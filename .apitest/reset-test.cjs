/**
 * Integration test for the resilient API client.
 *
 * Reproduces the reported production failure — a server that closes the TCP
 * socket mid-request (ECONNRESET) — and asserts:
 *   A. transient reset → retried and succeeds
 *   B. persistent reset → bounded to 3 attempts, ApiFetchError names endpoint + reason
 *   C. HTTP 401 → fails fast, exactly 1 attempt (credentials never retried)
 *   D. hanging server → aborts per timeout, bounded, clear "timed out" reason
 */
process.env.DEBUG = 'api';

const http = require('http');
const assert = require('assert');
const { retryFetch, ApiFetchError } = require('./api.js');

let mode = 'reset-once';
let hits = [];
let hangTimer = null;

const server = http.createServer((req, res) => {
  hits.push({ method: req.method, url: req.url, t: Date.now() });
  if (mode === 'reset-once') {
    if (hits.length === 1) {
      req.socket.destroy(); // <- the reported ECONNRESET
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  if (mode === 'always-reset') {
    req.socket.destroy();
    return;
  }
  if (mode === 'ok-401') {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('invalid api key');
    return;
  }
  if (mode === 'hang') {
    hangTimer = setTimeout(() => {
      try {
        res.writeHead(200);
        res.end('too late');
      } catch {
        /* socket already gone */
      }
    }, 5000);
    return;
  }
  res.writeHead(500);
  res.end('unexpected mode ' + mode);
});

async function main() {
  await new Promise((r) => server.listen(4242, '127.0.0.1', r));
  const base = 'http://127.0.0.1:4242';

  // --- A: transient ECONNRESET is retried and succeeds ---
  mode = 'reset-once';
  hits = [];
  const t0 = Date.now();
  const res = await retryFetch(`${base}/rest/v1/stores?select=*`, { method: 'GET' }, { label: 'test', baseDelayMs: 60 });
  assert.strictEqual(res.status, 200, 'A: status should be 200 after retry');
  assert.strictEqual(hits.length, 2, `A: expected 2 attempts, got ${hits.length}`);
  console.log(`A PASS — transient reset retried: attempts=${hits.length} total=${Date.now() - t0}ms status=${res.status}`);

  // --- B: persistent ECONNRESET → bounded retries, diagnosable error ---
  mode = 'always-reset';
  hits = [];
  await assert.rejects(
    () => retryFetch(`${base}/rest/v1/rewards`, { method: 'GET' }, { label: 'test', baseDelayMs: 60 }),
    (err) => {
      assert.ok(err instanceof ApiFetchError, 'B: must be ApiFetchError');
      assert.ok(err.message.includes('4242'), 'B: message must contain endpoint — got: ' + err.message);
      assert.ok(/failed after \d+ms/.test(err.message), 'B: message must contain timing — got: ' + err.message);
      assert.ok(err.cause, 'B: original cause must be preserved');
      return true;
    },
  );
  assert.strictEqual(hits.length, 3, `B: must stop at exactly 3 attempts, got ${hits.length}`);
  console.log(`B PASS — bounded retries: attempts=${hits.length} (no infinite loop), error names endpoint + reason`);

  // --- C: 401 fails fast ---
  mode = 'ok-401';
  hits = [];
  await assert.rejects(
    () => retryFetch(`${base}/rest/v1/rpc/whoami`, { method: 'GET' }, { label: 'test', baseDelayMs: 60 }),
    (err) => {
      assert.ok(err instanceof ApiFetchError && err.status === 401, 'C: ApiFetchError with status 401');
      assert.ok(err.message.includes('HTTP 401'), 'C: message contains HTTP 401 — got: ' + err.message);
      return true;
    },
  );
  assert.strictEqual(hits.length, 1, `C: 401 must not be retried, got ${hits.length} attempts`);
  console.log('C PASS — credentials fail fast: attempts=1 status=401');

  // --- D: timeout aborts and reports clearly ---
  mode = 'hang';
  hits = [];
  await assert.rejects(
    () => retryFetch(`${base}/rest/v1/slow`, { method: 'GET', timeout: 250 }, { label: 'test', baseDelayMs: 40 }),
    (err) => {
      assert.ok(err instanceof ApiFetchError, 'D: ApiFetchError');
      assert.ok(err.message.includes('timed out'), 'D: message says timed out — got: ' + err.message);
      return true;
    },
  );
  assert.strictEqual(hits.length, 3, `D: timeouts bounded to 3 attempts, got ${hits.length}`);
  console.log('D PASS — timeout bounded + clear reason');

  clearTimeout(hangTimer);
  server.close();
  console.log('\nALL TESTS PASSED');
}

main().catch((err) => {
  clearTimeout(hangTimer);
  server.close();
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
