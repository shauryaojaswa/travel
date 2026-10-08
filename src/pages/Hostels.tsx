import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GitCompareArrows, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import { HostelCard } from '@/components/HostelCard';
import { HostelDetail } from '@/components/HostelDetail';
import { CompareModal } from '@/components/CompareModal';
import { ExperienceCard } from '@/components/ExperienceCard';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useCity } from '@/context/CityContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { allAmenities, hostelAreas, hostels, type Hostel } from '@/data/hostels';
import { experiences } from '@/data/experiences';
import { formatINR } from '@/lib/utils';

const PRICE_MIN = 300;
const PRICE_MAX = 2000;

type SortKey = 'price-asc' | 'price-desc' | 'rating' | 'reviews' | 'metro' | 'nomad';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Rating: High → Low' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'metro', label: 'Distance to Metro' },
  { value: 'nomad', label: 'Nomad Score' },
];

const ratingOptions = ['Any rating', '4.0+', '4.3+', '4.5+'];

/** Condensed, frequently-used amenity chips for quick filtering. */
const amenityChips = ['All', 'WiFi', 'Cafe', 'Lockers', 'Work', 'Rooftop', 'Gym', 'Vegan', 'Female'];

function matchesAmenity(hostelAmenities: string[], chip: string): boolean {
  if (chip === 'All') return true;
  const needle = chip.toLowerCase();
  if (needle === 'work') return hostelAmenities.some((a) => /work|cowork/i.test(a));
  if (needle === 'gym') return hostelAmenities.some((a) => /gym|fitness/i.test(a));
  if (needle === 'vegan') return hostelAmenities.some((a) => /vegan|food/i.test(a));
  if (needle === 'female') return hostelAmenities.some((a) => /female/i.test(a));
  return hostelAmenities.some((a) => a.toLowerCase().includes(needle));
}

export default function Hostels() {
  const { city } = useCity();
  const cityName = city === 'delhi' ? 'Delhi' : 'Jaipur';
  usePageMeta(
    `${cityName} Hostels`,
    `Curated, verified hostels in ${cityName} with exact prices, nomad scores, and zero hidden fees.`,
  );

  const [range, setRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [area, setArea] = useState('All locations');
  const [minRating, setMinRating] = useState('Any rating');
  const [amenity, setAmenity] = useState('All');
  const [workFriendlyOnly, setWorkFriendlyOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('price-asc');
  const [detail, setDetail] = useState<Hostel | null>(null);
  const [compare, setCompare] = useState<Hostel[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const cityHostels = useMemo(() => hostels.filter((h) => h.cityId === city), [city]);
  const areas = useMemo(() => Array.from(new Set(cityHostels.map((h) => h.area))), [cityHostels]);
  void hostelAreas;
  void allAmenities;

  const toggleCompare = (hostel: Hostel) => {
    setCompare((prev) => {
      if (prev.some((h) => h.id === hostel.id)) return prev.filter((h) => h.id !== hostel.id);
      if (prev.length >= 3) return prev;
      return [...prev, hostel];
    });
  };

  const resetFilters = () => {
    setRange([PRICE_MIN, PRICE_MAX]);
    setArea('All locations');
    setMinRating('Any rating');
    setAmenity('All');
    setWorkFriendlyOnly(false);
    setSort('price-asc');
  };

  const filtered = useMemo(() => {
    const ratingFloor = minRating === 'Any rating' ? 0 : parseFloat(minRating);
    const result = cityHostels.filter(
      (h) =>
        h.price >= range[0] &&
        h.price <= range[1] &&
        (area === 'All locations' || h.area === area) &&
        h.rating >= ratingFloor &&
        matchesAmenity(h.amenities, amenity) &&
        (!workFriendlyOnly || /work|cowork|wifi/i.test(h.amenities.join(' '))),
    );

    const sorted = [...result];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'metro':
        sorted.sort((a, b) => a.metroMins - b.metroMins);
        break;
      case 'nomad':
        sorted.sort((a, b) => b.nomadScore - a.nomadScore);
        break;
    }
    return sorted;
  }, [cityHostels, range, area, minRating, amenity, workFriendlyOnly, sort]);

  return (
    <section className="px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Stay"
          title={`Curated ${cityName} Hostels`}
          subtitle={`${cityHostels.length} hand-verified hostels with exact nightly prices. No hidden cleaning fees, no surprise taxes at checkout.`}
        />
        {/* ============ FILTER BAR ============ */}
        <div className="sticky top-[76px] z-30 mt-12 rounded-card border border-gray-100 bg-white p-6 shadow-calm-md sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-widest text-ink-medium">
              <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
              Filters
            </h3>
            <button
              type="button"
              onClick={resetFilters}
              className="flex min-h-[38px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-medium transition hover:bg-primary-bg hover:text-primary"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>

          <div className="grid gap-7 lg:grid-cols-2">
            {/* Price range */}
            <div>
              <div className="mb-3 flex items-center justify-between text-sm">
                <label htmlFor="price-slider" className="font-medium text-ink-dark">
                  Price range
                </label>
                <span className="rounded-full bg-primary-bg px-3 py-1 text-xs font-bold text-primary">
                  {formatINR(range[0])} – {formatINR(range[1])} / night
                </span>
              </div>
              <Slider
                id="price-slider"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={10}
                value={range}
                onValueChange={(v) => setRange([v[0], v[v.length - 1]])}
                aria-label="Price range per night"
              />
            </div>

            {/* Dropdowns */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="area-filter"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-light"
                >
                  Location
                </label>
                <select
                  id="area-filter"
                  className="calm-input"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  <option>All locations</option>
                  {areas.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="rating-filter"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-light"
                >
                  Rating
                </label>
                <select
                  id="rating-filter"
                  className="calm-input"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                >
                  {ratingOptions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="sort-filter"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-light"
                >
                  Sort by
                </label>
                <select
                  id="sort-filter"
                  className="calm-input"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Amenities (checkbox-style chips) */}
          <div className="mt-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-light">
              Amenities
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Amenity filter">
              {amenityChips.map((chip) => {
                const active = amenity === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setAmenity(chip)}
                    aria-pressed={active}
                    className={
                      active
                        ? 'flex min-h-[38px] items-center gap-1.5 rounded-full border border-primary bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-calm transition-all duration-200'
                        : 'flex min-h-[38px] items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-ink-medium transition-all duration-200 hover:border-primary-lighter hover:bg-primary-bg hover:text-primary'
                    }
                  >
                    <span
                      aria-hidden="true"
                      className={
                        'flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border text-[10px] leading-none ' +
                        (active ? 'border-white bg-white text-primary' : 'border-gray-300 text-transparent')
                      }
                    >
                      ✓
                    </span>
                    {chip}
                  </button>
                );
              })}
            </div>

            {/* Work-friendly quick toggle */}
            <label className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-dark">
              <input
                type="checkbox"
                checked={workFriendlyOnly}
                onChange={(e) => setWorkFriendlyOnly(e.target.checked)}
                className="h-5 w-5 rounded-md border-gray-300 accent-[#2D6A4F]"
                aria-label="Work-friendly hostels only"
              />
              💻 Work-friendly only (fast WiFi + workspace)
            </label>

            <p className="mt-3 text-xs text-ink-light">
              <span className="font-semibold text-primary">{filtered.length}</span> hostel
              {filtered.length === 1 ? '' : 's'} match your filters
            </p>
          </div>
        </div>
        {/* ============ GRID ============ */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((h, i) => (
              <Reveal key={h.id} delay={(i % 3) * 0.1}>
                <HostelCard
                  hostel={h}
                  onExplore={setDetail}
                  onCompare={toggleCompare}
                  comparing={compare.some((c) => c.id === h.id)}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-card border border-dashed border-primary-lighter bg-primary-bg px-8 py-16 text-center">
            <span className="text-4xl" aria-hidden="true">
              🌿
            </span>
            <p className="mt-4 font-serif text-xl text-primary">No hostels match those filters</p>
            <p className="mx-auto mt-2 max-w-md text-sm font-light text-ink-medium">
              Try widening the price range or clearing a filter — the right bed is still here.
            </p>
            <Button variant="outline" className="mt-6" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset filters
            </Button>
          </div>
        )}

        {/* ============ EXPERIENCES MARKETPLACE ============ */}
        <section className="mt-24" aria-labelledby="experiences-heading">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary-lighter/50 bg-primary-bg px-3 py-1 text-xs font-semibold tracking-wide text-primary">
              Hands-on
            </span>
            <h2 id="experiences-heading" className="text-display-lg">
              Experiences Marketplace
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-ink-medium sm:text-lg">
              79% of Gen Z want hands-on local workshops on trips. Book them straight from the
              people who run them — fair prices, secure escrow, zero platform games.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experiences
              .filter((e) => e.cityId === city)
              .map((exp, i) => (
                <Reveal key={exp.id} delay={(i % 3) * 0.1}>
                  <ExperienceCard experience={exp} />
                </Reveal>
              ))}
          </div>
        </section>

        {/* Detail modal */}
        <HostelDetail hostel={detail} onClose={() => setDetail(null)} />

        {/* Compare modal */}
        <CompareModal
          hostels={compare}
          open={compareOpen}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => setCompare((prev) => prev.filter((h) => h.id !== id))}
        />

        {/* Floating compare bar */}
        <AnimatePresence>
          {compare.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 items-center justify-between gap-3 rounded-full border border-gray-100 bg-white px-4 py-2.5 pl-5 shadow-bloom sm:px-5"
              role="status"
            >
              <p className="text-xs font-semibold text-ink-dark sm:text-sm">
                <GitCompareArrows className="mr-1.5 inline h-4 w-4 text-primary" aria-hidden="true" />
                {compare.length}/3 selected to compare
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCompare([])}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink-light transition hover:bg-primary-bg hover:text-primary"
                  aria-label="Clear compare selection"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
                <Button
                  size="sm"
                  disabled={compare.length < 2}
                  onClick={() => setCompareOpen(true)}
                  className="disabled:opacity-50"
                >
                  Compare now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
