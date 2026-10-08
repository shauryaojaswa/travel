import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { Slider } from '@/components/ui/slider';
import { ExpenseTracker } from '@/components/ExpenseTracker';
import { PackingList } from '@/components/PackingList';
import { CurrencyWidget } from '@/components/CurrencyWidget';
import { DelhiAi } from '@/components/DelhiAi';
import { useCity } from '@/context/CityContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cities } from '@/data/cities';
import { formatINR } from '@/lib/utils';

const STYLES = [
  { key: 'budget', name: 'Budget', emoji: '🎒', blurb: 'Dorms, street food, metro' },
  { key: 'balanced', name: 'Balanced', emoji: '⚖️', blurb: 'Cafes, autos, curated fun' },
  { key: 'comfortable', name: 'Comfortable', emoji: '🌟', blurb: 'Pods, restaurants, cabs' },
] as const;

type StyleKey = (typeof STYLES)[number]['key'];

const BUDGET_MIN = 2000;
const BUDGET_MAX = 50000;

const COMPANIONS = [
  { label: 'Solo', factor: 1 },
  { label: '2 People', factor: 1.85 },
  { label: '3–4', factor: 3.4 },
  { label: 'Group 5+', factor: 5.6 },
];

const PURPOSES = ['Adventure', 'Relaxation', 'Culture', 'Digital Nomad', 'Party', 'Wellness'];

const ESIM_PER_DAY = 299;
const INSURANCE_PER_DAY = 50;

interface Row {
  key: string;
  emoji: string;
  label: string;
  color: string;
  amount: number;
}

export default function Budget() {
  const { city } = useCity();
  const cityName = city === 'delhi' ? 'Delhi' : 'Jaipur';
  usePageMeta(
    `${cityName} Budget Calculator`,
    `Exact, deterministic ${cityName} trip budgets with eSIM, insurance, expense tracking, and packing lists.`,
  );
  const cityRates = cities[city].rates;

  const [budget, setBudget] = useState(15000);
  const [nights, setNights] = useState(3);
  const [styleIdx, setStyleIdx] = useState(1);
  const [companionIdx, setCompanionIdx] = useState(0);
  const [purpose, setPurpose] = useState('Culture');
  const styleKey: StyleKey = STYLES[styleIdx].key;
  const rates = cityRates[styleKey];
  const companions = COMPANIONS[companionIdx];

  const result = useMemo(() => {
    const f = nights * companions.factor;
    const rows: Row[] = [
      { key: 'stay', emoji: '🏨', label: 'Hostel Stay', color: '#2D6A4F', amount: Math.round(rates.hostel * f) },
      { key: 'food', emoji: '🍜', label: 'Food & Drinks', color: '#D4A373', amount: Math.round(rates.food * f) },
      { key: 'transport', emoji: '🚇', label: 'Local Transport', color: '#6366F1', amount: Math.round(rates.transport * f) },
      { key: 'activities', emoji: '🎯', label: 'Activities & Experiences', color: '#EAB308', amount: Math.round(rates.activities * f) },
      { key: 'esim', emoji: '📱', label: 'eSIM & Connectivity', color: '#14B8A6', amount: ESIM_PER_DAY * nights },
      { key: 'insurance', emoji: '🛡️', label: 'Travel Insurance', color: '#F97316', amount: INSURANCE_PER_DAY * nights },
    ];
    const subtotal = rows.reduce((sum, r) => sum + r.amount, 0);
    const buffer = Math.round(subtotal * 0.1);
    rows.push({ key: 'buffer', emoji: '🧰', label: 'Safety Buffer 10%', color: '#8B5CF6', amount: buffer });
    const total = subtotal + buffer;
    const remaining = budget - total;
    // Budget score: efficiency vs a reference "average Delhi traveler" day cost (~₹2,900/day)
    const perDay = total / Math.max(nights, 1);
    const score = Math.max(5, Math.min(100, Math.round(100 - ((perDay - 1500) / 3000) * 100)));
    return { rows, subtotal, buffer, total, remaining, score, perDay };
  }, [budget, nights, companions, rates]);

  const withinBudget = result.remaining >= 0;

  return (
    <section className="px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Plan"
          title="Exact Budget Calculator"
          subtitle="No guesses. No hidden fees. Get a deterministic breakdown powered by real Delhi data."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* ============ CONTROLS ============ */}
          <div className="rounded-card border border-gray-100 bg-white p-6 shadow-calm sm:p-8">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-ink-medium">
              Your trip
            </h3>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <label htmlFor="budget-slider" className="text-sm font-medium text-ink-dark">
                  Total budget
                </label>
                <span className="rounded-full bg-primary-bg px-3.5 py-1 text-sm font-bold text-primary">
                  {formatINR(budget)}
                </span>
              </div>
              <Slider
                id="budget-slider"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={500}
                value={[budget]}
                onValueChange={(v) => setBudget(v[0])}
                aria-label="Total budget in rupees"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-ink-light">
                <span>{formatINR(BUDGET_MIN)}</span>
                <span>{formatINR(BUDGET_MAX)}</span>
              </div>
            </div>

            <div className="mt-9">
              <div className="mb-3 flex items-center justify-between">
                <label htmlFor="nights-slider" className="text-sm font-medium text-ink-dark">
                  Nights
                </label>
                <span className="rounded-full bg-primary-bg px-3.5 py-1 text-sm font-bold text-primary">
                  {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
              </div>
              <Slider
                id="nights-slider"
                min={1}
                max={14}
                step={1}
                value={[nights]}
                onValueChange={(v) => setNights(v[0])}
                aria-label="Number of nights"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-ink-light">
                <span>1 night</span>
                <span>14 nights</span>
              </div>
            </div>
            <div className="mt-9">
              <div className="mb-4 flex items-center justify-between">
                <p id="style-label" className="text-sm font-medium text-ink-dark">
                  Travel style
                </p>
                <span className="rounded-full bg-primary-bg px-3.5 py-1 text-sm font-bold text-primary">
                  {STYLES[styleIdx].emoji} {STYLES[styleIdx].name}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3" role="group" aria-labelledby="style-label">
                {STYLES.map((s, i) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setStyleIdx(i)}
                    aria-pressed={styleIdx === i}
                    className={
                      'rounded-2xl border-2 p-4 text-center transition-all duration-200 ' +
                      (styleIdx === i
                        ? 'border-primary bg-primary-bg shadow-calm'
                        : 'border-gray-100 bg-white hover:border-primary-lighter hover:bg-primary-bg/50')
                    }
                  >
                    <span className="text-3xl" aria-hidden="true">
                      {s.emoji}
                    </span>
                    <span className="mt-1.5 block text-sm font-bold text-ink-dark">{s.name}</span>
                    <span className="mt-0.5 block text-[11px] font-light text-ink-medium">{s.blurb}</span>
                  </button>
                ))}
              </div>
              <p className="mt-5 rounded-input bg-gray-50 px-4 py-3 text-xs leading-relaxed text-ink-medium">
                {cityName} {STYLES[styleIdx].name.toLowerCase()} per-day rates:{' '}
                <strong className="text-ink-dark">hostel {formatINR(rates.hostel)}/night</strong>,
                food {formatINR(rates.food)}/day, transport {formatINR(rates.transport)}/day,
                activities {formatINR(rates.activities)}/day.
              </p>
            </div>

            {/* Companions */}
            <div className="mt-9">
              <div className="mb-3 flex items-center justify-between">
                <p id="companions-label" className="text-sm font-medium text-ink-dark">
                  Companions
                </p>
                <span className="rounded-full bg-primary-bg px-3.5 py-1 text-sm font-bold text-primary">
                  {companions.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby="companions-label">
                {COMPANIONS.map((c, i) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setCompanionIdx(i)}
                    aria-pressed={companionIdx === i}
                    className={
                      'min-h-[40px] rounded-full border px-4 py-1.5 text-xs font-semibold transition ' +
                      (companionIdx === i
                        ? 'border-primary bg-primary text-white shadow-calm'
                        : 'border-gray-200 text-ink-medium hover:border-primary-lighter hover:bg-primary-bg hover:text-primary')
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose */}
            <div className="mt-9">
              <label htmlFor="purpose" className="mb-1.5 block text-sm font-medium text-ink-dark">
                Trip purpose
              </label>
              <select id="purpose" className="calm-input" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                {PURPOSES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <p className="mt-2 text-xs font-light text-ink-medium">
                Planning a {purpose.toLowerCase()} trip for {nights} {nights === 1 ? 'night' : 'nights'} · {formatINR(result.perDay)}/day per plan
              </p>
            </div>

          </div>
          {/* ============ RESULTS ============ */}
          <div className="glass rounded-card p-6 shadow-calm-md sm:p-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-ink-medium">
                Your exact estimate
              </h3>
              <span className="rounded-full bg-primary-bg px-3 py-1 text-xs font-bold text-primary">
                {nights} {nights === 1 ? 'night' : 'nights'} · {STYLES[styleIdx].emoji} {STYLES[styleIdx].name}
              </span>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-light">
                  Total estimated cost
                </p>
                <motion.p
                  key={result.total}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-5xl text-primary"
                  aria-live="polite"
                >
                  {formatINR(result.total)}
                </motion.p>
              </div>

              {/* Budget score gauge */}
              <div
                className="relative flex h-20 w-20 shrink-0 items-center justify-center"
                role="img"
                aria-label={`Budget score ${result.score} out of 100`}
              >
                <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" strokeWidth="9" className="stroke-gray-100" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#52B788"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - result.score / 100) }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </svg>
                <span className="text-center">
                  <span className="block font-serif text-xl leading-none text-primary">{result.score}</span>
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-ink-light">score</span>
                </span>
              </div>
            </div>

            <ul className="mt-7 space-y-5">
              {result.rows.map((row) => {
                const pct = result.total > 0 ? (row.amount / result.total) * 100 : 0;
                return (
                  <li key={row.key}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 font-medium text-ink-dark">
                        <span aria-hidden="true">{row.emoji}</span>
                        {row.label}
                      </span>
                      <span className="font-semibold text-ink-dark">{formatINR(row.amount)}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: row.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        role="progressbar"
                        aria-valuenow={Math.round(pct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${row.label} share of total`}
                      />
                    </div>
                    <span className="mt-1 block text-right text-[11px] text-ink-light">
                      {pct.toFixed(1)}% of total
                    </span>
                  </li>
                );
              })}
            </ul>

            <div
              className={
                'mt-7 rounded-input px-5 py-4 text-sm font-semibold ' +
                (withinBudget
                  ? 'bg-primary-bg text-primary'
                  : 'bg-amber-50 text-amber-700')
              }
              role="status"
            >
              {withinBudget ? (
                <>✅ Within budget! {formatINR(result.remaining)} remaining</>
              ) : (
                <>⚠️ Over budget by {formatINR(Math.abs(result.remaining))}</>
              )}
            </div>

            <p className="mt-6 flex gap-2.5 rounded-input bg-white/80 px-4 py-3.5 text-xs font-light leading-relaxed text-ink-medium shadow-calm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-ink-dark">Data Sources:</strong> Hostel
                prices from verified listings. Food &amp; transport costs based on {cityName}
                cost-of-living indices. eSIM {formatINR(ESIM_PER_DAY)}/day, insurance{' '}
                {formatINR(INSURANCE_PER_DAY)}/day. All prices in INR. This is the{' '}
                <strong className="font-semibold text-primary">Deterministic Budget Engine</strong>{' '}
                — not a guess.
              </span>
            </p>
          </div>

        </div>

        {/* ============ EXPENSE TRACKER + PACKING ============ */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <ExpenseTracker budget={budget} />
          <PackingList />
        </div>

        {/* Floating widgets */}
        <CurrencyWidget amountINR={result.total} />
        <DelhiAi />
      </div>
    </section>
  );
}
