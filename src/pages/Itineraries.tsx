import { useMemo, useState } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import { ItineraryCard } from '@/components/ItineraryCard';
import { ItineraryDetail } from '@/components/ItineraryDetail';
import { SurpriseMe } from '@/components/SurpriseMe';
import { AiGenerator } from '@/components/AiGenerator';
import { Button } from '@/components/ui/button';
import { useCity } from '@/context/CityContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cities } from '@/data/cities';
import { itineraries, itineraryTypes, type Itinerary, type ItineraryTag } from '@/data/itineraries';
import { cn } from '@/lib/utils';

/** Filter semantics: "up to N hours" — pick the pace that suits you. */
const durationFilters: { label: string; max: number }[] = [
  { label: '1 hr', max: 1 },
  { label: '3 hr', max: 3 },
  { label: '6 hr', max: 6 },
  { label: 'Full Day', max: 24 },
];

const budgetFilters: { label: string; test: (b: number) => boolean }[] = [
  { label: '< ₹500', test: (b) => b < 500 },
  { label: '₹500 - 1000', test: (b) => b >= 500 && b <= 1000 },
  { label: '₹1000+', test: (b) => b > 1000 },
];

const chipClass = (active: boolean) =>
  cn(
    'min-h-[38px] rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200',
    active
      ? 'border-primary bg-primary text-white shadow-calm'
      : 'border-gray-200 bg-white text-ink-medium hover:border-primary-lighter hover:bg-primary-bg hover:text-primary',
  );

export default function Itineraries() {
  const { city } = useCity();
  const cityName = city === 'delhi' ? 'Delhi' : 'Jaipur';
  usePageMeta(
    `${cityName} Itineraries`,
    `Hidden, locally-walked micro-itineraries in ${cityName} with exact per-item budgets.`,
  );

  const [maxDuration, setMaxDuration] = useState<number | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [type, setType] = useState<ItineraryTag | 'All'>('All');
  const [detail, setDetail] = useState<Itinerary | null>(null);

  const filtered = useMemo(() => {
    return itineraries.filter((it) => {
      if (it.cityId !== city) return false;
      if (maxDuration !== null && it.durationHours > maxDuration) return false;
      if (budget) {
        const band = budgetFilters.find((f) => f.label === budget);
        if (band && !band.test(it.budget)) return false;
      }
      if (type !== 'All' && !it.tags.includes(type)) return false;
      return true;
    });
  }, [city, maxDuration, budget, type]);

  const reset = () => {
    setMaxDuration(null);
    setBudget(null);
    setType('All');
  };

  const hasFilters = maxDuration !== null || budget !== null || type !== 'All';

  return (
    <section className="px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Explore"
          title={`Hidden ${cityName} Itineraries`}
          subtitle="Locally walked routes with a line-by-line budget. Every stop, every rupee — before you leave the hostel."
        />
        {/* ============ FILTERS ============ */}
        <div className="mt-12 space-y-6 rounded-card border border-gray-100 bg-white p-6 shadow-calm sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-ink-medium">
              Find your pace
            </h3>
            {hasFilters && (
              <button
                type="button"
                onClick={reset}
                className="min-h-[38px] rounded-full px-3 py-1.5 text-xs font-semibold text-ink-medium transition hover:bg-primary-bg hover:text-primary"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-light">
                Duration
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Duration filter">
                {durationFilters.map((d) => (
                  <button
                    key={d.label}
                    type="button"
                    aria-pressed={maxDuration === d.max}
                    onClick={() => setMaxDuration(maxDuration === d.max ? null : d.max)}
                    className={chipClass(maxDuration === d.max)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-light">
                Budget
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Budget filter">
                {budgetFilters.map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    aria-pressed={budget === f.label}
                    onClick={() => setBudget(budget === f.label ? null : f.label)}
                    className={chipClass(budget === f.label)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-light">
                Type
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Type filter">
                {(['All', ...itineraryTypes] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={type === t}
                    onClick={() => setType(t)}
                    className={chipClass(type === t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-ink-light">
            <span className="font-semibold text-primary">{filtered.length}</span> itinerary
            {filtered.length === 1 ? '' : 'ies'} match your filters
          </p>
        </div>

        {/* ============ GRID ============ */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it, i) => (
              <Reveal key={it.id} delay={(i % 3) * 0.1}>
                <ItineraryCard itinerary={it} onExplore={setDetail} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-card border border-dashed border-primary-lighter bg-primary-bg px-8 py-16 text-center">
            <span className="text-4xl" aria-hidden="true">
              🧭
            </span>
            <p className="mt-4 font-serif text-xl text-primary">
              No itineraries match those filters
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm font-light text-ink-medium">
              Loosen a filter and a hidden route will appear — we’re walking new ones every week.
            </p>
            <Button variant="outline" className="mt-6" onClick={reset}>
              Clear filters
            </Button>
          </div>
        )}

        <SurpriseMe itineraries={filtered.length > 0 ? filtered : itineraries.filter((it) => it.cityId === city)} onExplore={setDetail} />

        <AiGenerator city={cities[city]} />

        <ItineraryDetail itinerary={detail} onClose={() => setDetail(null)} onPick={setDetail} />

      </div>
    </section>
  );
}
