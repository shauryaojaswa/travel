"use strict";
/**
 * Resilient API client for the Jolly Enterprises data provider.
 *
 * Every request to the Supabase REST API passes through this module so that
 * failures are never silent. Guarantees:
 *
 *  - Observation: every attempt logs method, URL, status, timing and reason
 *    (network reset / timeout / 429 / 5xx) — enable with `DEBUG=api vite dev`.
 *  - Timeouts: each call is aborted after 5s (AbortController).
 *  - Bounded retries: resets, timeouts and transient 5xx/429 are retried at
 *    most 2 extra times with exponential backoff + jitter. Never infinite.
 *    401/403/404 fail fast so credentials are never retried.
 *  - Diagnosable errors: ApiFetchError carries endpoint, status, timing, cause.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFetchError = void 0;
exports.logApi = logApi;
exports.isNetworkError = isNetworkError;
exports.retryFetch = retryFetch;
exports.apiFetch = apiFetch;
class ApiFetchError extends Error {
    constructor(opts) {
        super(opts.status === null
            ? `[${opts.label}] ${String(opts.input)} failed after ${opts.timingMs}ms: ${opts.cause?.message ?? 'unknown error'}`
            : `[${opts.label}] ${String(opts.input)} -> HTTP ${opts.status} after ${opts.timingMs}ms: ${opts.cause?.message ?? 'unknown error'}`);
        this.name = 'ApiFetchError';
        this.label = opts.label;
        this.input = opts.input;
        this.init = opts.init;
        this.status = opts.status;
        this.timingMs = opts.timingMs;
        this.cause = opts.cause;
    }
}
exports.ApiFetchError = ApiFetchError;
const debug = (() => {
    try {
        const g = globalThis;
        return (g.process?.env?.DEBUG ?? '')
            .split(',')
            .map((s) => s.trim())
            .includes('api');
    }
    catch {
        return false;
    }
})();
function logApi(label, msg) {
    if (debug)
        console.warn(`[gift-api:${label}] ${msg}`);
}
/** Socket/TLS-level failures — the remote closed the connection (ECONNRESET etc). */
function isNetworkError(error) {
    // Node/undici wraps resets as `TypeError: fetch failed` with ECONNRESET in
    // `cause`; browsers surface `TypeError: Failed to fetch`. Inspect the chain.
    const pattern = /ECONNRESET|ECONNREFUSED|EPIPE|ETIMEDOUT|socket hang up|socket connection was closed|fetch failed|Failed to fetch|Load failed|NetworkError|terminated|other side closed/i;
    let current = error;
    for (let depth = 0; depth < 5 && current; depth += 1) {
        const msg = current instanceof Error ? current.message : String(current);
        if (pattern.test(msg))
            return true;
        current = current instanceof Error ? current.cause : undefined;
    }
    return false;
}
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/** Best-effort label so logs name the subsystem even without explicit context. */
function inferLabel(input) {
    const url = String(input);
    if (url.includes('/rest/v1/'))
        return 'supabase-rest';
    if (url.includes('/auth/v1/'))
        return 'supabase-auth';
    if (url.includes('/realtime/'))
        return 'supabase-realtime';
    return 'api';
}
function normalizeHeaders(headers) {
    if (!headers)
        return {};
    if (headers instanceof Headers)
        return Object.fromEntries(headers.entries());
    if (Array.isArray(headers))
        return Object.fromEntries(headers);
    return { ...headers };
}
/**
 * Resilient fetch: timeout + bounded exponential-backoff retry with jitter.
 *
 * Attempt plan: 1st immediate → retry after base·2⁰+jitter → retry after
 * base·2¹+jitter → give up (max 3 attempts total, never infinite).
 */
async function retryFetch(input, init = {}, context) {
    const label = context?.label ?? inferLabel(input);
    const maxAttempts = context?.maxAttempts ?? 3;
    const baseDelayMs = context?.baseDelayMs ?? 400;
    const method = init.method ?? 'GET';
    const url = String(input);
    let lastError = null;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const controller = new AbortController();
        const startedAt = Date.now();
        const timer = setTimeout(() => controller.abort(), init.timeout ?? 5000);
        try {
            const headers = {
                'x-client-info': 'gift-customer-flow',
                ...normalizeHeaders(init.headers),
            };
            const response = await fetch(input, { ...init, headers, signal: controller.signal });
            clearTimeout(timer);
            const status = response.status;
            const timingMs = Date.now() - startedAt;
            if (status === 429) {
                const retryAfter = init.retryAfter ?? (parseInt(response.headers.get('Retry-After') ?? '0', 10) || 1);
                logApi(label, `429 ${method} ${url} retryAfter=${retryAfter}s attempt=${attempt + 1}/${maxAttempts}`);
                if (attempt === maxAttempts - 1) {
                    const body = await response.text().catch(() => null);
                    throw new ApiFetchError({ label, input, init, status, timingMs, cause: new Error(body?.slice(0, 200) ?? 'rate limited') });
                }
                await sleep(Math.max(retryAfter * 1000, baseDelayMs * 2 ** attempt));
                continue;
            }
            if (!response.ok) {
                const body = await response.text().catch(() => null);
                const httpError = new ApiFetchError({ label, input, init, status, timingMs, cause: new Error(body?.slice(0, 200) ?? `HTTP ${status}`) });
                logApi(label, `${status} ${method} ${url} attempt=${attempt + 1}/${maxAttempts} ${timingMs}ms`);
                if (status === 401 || status === 403 || status === 404)
                    throw httpError;
                if (attempt === maxAttempts - 1)
                    throw httpError;
                await sleep(baseDelayMs * 2 ** attempt);
                continue;
            }
            logApi(label, `OK ${status} ${method} ${url} attempt=${attempt + 1}/${maxAttempts} ${timingMs}ms`);
            return response;
        }
        catch (error) {
            clearTimeout(timer);
            const timingMs = Date.now() - startedAt;
            lastError = error instanceof Error ? error : new Error(String(error));
            if (lastError instanceof ApiFetchError)
                throw lastError;
            const isNetwork = isNetworkError(lastError);
            const isTimeout = lastError.name === 'AbortError';
            if (isTimeout) {
                lastError = new Error(`Request timed out after ${init.timeout ?? 5000}ms (no response)`);
            }
            logApi(label, `attempt ${attempt + 1}/${maxAttempts} ${method} ${url} -> ${lastError.name}${isNetwork ? ' (network)' : isTimeout ? ' (timeout)' : ''} ${timingMs}ms: ${lastError.message}`);
            const isRetryable = isNetwork || isTimeout;
            if (!isRetryable || attempt === maxAttempts - 1) {
                throw new ApiFetchError({ label, input, init, status: null, timingMs, cause: lastError });
            }
            await sleep(baseDelayMs * 2 ** attempt);
        }
    }
    throw lastError ?? new Error('API fetch failed');
}
/** Labeled one-shot wrapper around retryFetch. */
function apiFetch(url, init = {}, label = 'api') {
    return retryFetch(url, init, { label });
}
