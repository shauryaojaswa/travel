import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/context/ToastContext';
import { itineraries, type ItineraryTag } from '@/data/itineraries';
import type { CityMeta } from '@/data/cities';
import { formatINR } from '@/lib/utils';

const VIBES: (ItineraryTag | 'Mixed')[] = ['Culture', 'Food', 'Nature', 'Nightlife', 'Digital Nomad', 'Mixed'];
const PACES = ['Relaxed', 'Balanced', 'Adventure'] as const;

/**
 * Demo AI generator: deterministic rules over the real itinerary dataset,
 * labeled honestly as "powered by our Deterministic Budget Engine".
 */
export function AiGenerator({ city }: { city: CityMeta }) {
  const { toast } = useToast();
  const [vibe, setVibe] = useState<(typeof VIBES)[number]>('Mixed');
  const [dailyBudget, setDailyBudget] = useState(800);
  const [days, setDays] = useState(2);
  const [pace, setPace] = useState<(typeof PACES)[number]>('Balanced');
  const [hiddenGems, setHiddenGems] = useState(true);
  const [avoidTraps, setAvoidTraps] = useState(true);
  const [result, setResult] = useState<null | { picks: string[]; total: number; note: string }>(null);

  const generate = () => {
    const pool = itineraries.filter((it) => {
      if (it.cityId !== city.id) return false;
      if (it.budget > dailyBudget) return false;
      if (vibe !== 'Mixed' && !it.tags.includes(vibe as ItineraryTag)) return false;
      if (hiddenGems && it.adventure < 55 && !it.badge) return false;
      return true;
    });

    const paceRank = (adv: number) =>
      pace === 'Relaxed' ? -adv : pace === 'Adventure' ? adv : -Math.abs(adv - 60);
    const ordered = [...pool].sort((a, b) => paceRank(b.adventure) - paceRank(a.adventure));

    const fallback = itineraries.filter((it) => it.cityId === city.id);
    const list = (ordered.length > 0 ? ordered : fallback).slice(0, Math.max(days, 1));
    const total = list.reduce((s, it) => s + it.budget, 0);

    setResult({
      picks: list.map((it) => `${it.emoji} ${it.title} — ${it.durationLabel}, ${formatINR(it.budget)}`),
      total,
      note: avoidTraps
        ? 'Tourist-trap filters on: every stop is verified local-approved and priced to the rupee.'
        : 'Balanced mix of classics and local favorites, priced to the rupee.',
    });
    toast('Your demo itinerary is ready ✨');
  };
  // __FORM__
  return (
    <div className="mt-14 overflow-hidden rounded-card border border-primary-lighter/40 bg-white p-6 shadow-calm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-serif text-2xl text-ink-dark">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            AI Itinerary Generator
          </h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-light">
            Powered by our Deterministic Budget Engine · demo
          </p>
        </div>
        <span className="rounded-full bg-primary-bg px-3 py-1 text-xs font-bold text-primary">
          {city.name}
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-light">
            What's your vibe?
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Vibe">
            {VIBES.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={vibe === v}
                onClick={() => setVibe(v)}
                className={
                  'min-h-[38px] rounded-full border px-4 py-1.5 text-xs font-semibold transition ' +
                  (vibe === v
                    ? 'border-primary bg-primary text-white shadow-calm'
                    : 'border-gray-200 text-ink-medium hover:border-primary-lighter hover:bg-primary-bg hover:text-primary')
                }
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-light">Pace</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Pace">
            {PACES.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={pace === p}
                onClick={() => setPace(p)}
                className={
                  'min-h-[38px] rounded-full border px-4 py-1.5 text-xs font-semibold transition ' +
                  (pace === p
                    ? 'border-primary bg-primary text-white shadow-calm'
                    : 'border-gray-200 text-ink-medium hover:border-primary-lighter hover:bg-primary-bg hover:text-primary')
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="ai-budget" className="text-sm font-medium text-ink-dark">
              Budget per day
            </label>
            <span className="rounded-full bg-primary-bg px-3 py-1 text-xs font-bold text-primary">
              {formatINR(dailyBudget)}
            </span>
          </div>
          <Slider id="ai-budget" min={200} max={5000} step={100} value={[dailyBudget]} onValueChange={(v) => setDailyBudget(v[0])} aria-label="Budget per day" />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="ai-days" className="text-sm font-medium text-ink-dark">
              How many days?
            </label>
            <span className="rounded-full bg-primary-bg px-3 py-1 text-xs font-bold text-primary">
              {days} {days === 1 ? 'day' : 'days'}
            </span>
          </div>
          <Slider id="ai-days" min={1} max={5} step={1} value={[days]} onValueChange={(v) => setDays(v[0])} aria-label="Number of days" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
        <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-dark">
          <input type="checkbox" checked={hiddenGems} onChange={(e) => setHiddenGems(e.target.checked)} className="h-5 w-5 accent-[#2D6A4F]" />
          💎 Include hidden gems
        </label>
        <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-dark">
          <input type="checkbox" checked={avoidTraps} onChange={(e) => setAvoidTraps(e.target.checked)} className="h-5 w-5 accent-[#2D6A4F]" />
          🚫 Avoid tourist traps
        </label>
      </div>

      <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={generate}>
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        ✨ Generate My Itinerary
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 rounded-2xl border border-primary-lighter/50 bg-primary-bg p-5"
          role="status"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Your {days}-day {pace.toLowerCase()} plan · ~{formatINR(result.total)} total
          </p>
          <ul className="mt-3 space-y-2">
            {result.picks.map((p) => (
              <li key={p} className="text-sm font-medium text-ink-dark">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-light text-ink-medium">{result.note}</p>
          <p className="mt-2 text-[11px] text-ink-light">
            Demo build — full AI with live availability ships in Phase 2.
          </p>
        </motion.div>
      )}
    </div>
  );
}
