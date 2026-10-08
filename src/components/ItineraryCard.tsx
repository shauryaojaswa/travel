import { motion } from 'framer-motion';
import { BookOpen, Check, Clock, Footprints, Plus, Wallet } from 'lucide-react';
import type { Itinerary } from '@/data/itineraries';
import { Button } from '@/components/ui/button';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import { cn, formatINR } from '@/lib/utils';

export const adventureLabel = (v: number) =>
  v < 35 ? 'Chill' : v < 60 ? 'Moderate' : v < 80 ? 'Thrilling' : 'Extreme';

export function ItineraryCard({
  itinerary,
  onExplore,
}: {
  itinerary: Itinerary;
  onExplore?: (itinerary: Itinerary) => void;
}) {
  const { addItem, isInTrip } = useTrip();
  const { toast } = useToast();
  const added = isInTrip(itinerary.id);

  const handleAdd = () => {
    const didAdd = addItem({ id: itinerary.id, kind: 'itinerary', title: itinerary.title });
    toast(didAdd ? `${itinerary.title} added to your trip` : `${itinerary.title} is already in your trip`);
  };

  const computedTotal = itinerary.breakdown.reduce((sum, line) => sum + line.price, 0);

  return (
    <article className="gradient-edge flex h-full flex-col overflow-hidden rounded-card border border-gray-100 bg-white shadow-calm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-bloom">
      <div className="flex items-start gap-4 p-6 pb-4">
        <span
          className={cn(
            'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl',
            itinerary.accentSoft,
          )}
          aria-hidden="true"
        >
          {itinerary.emoji}
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-xl leading-snug text-ink-dark">{itinerary.title}</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-bg px-2.5 py-1 text-[11px] font-semibold text-primary">
              <Clock className="h-3 w-3" aria-hidden="true" /> {itinerary.durationLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-semibold text-accent">
              <Wallet className="h-3 w-3" aria-hidden="true" /> {formatINR(itinerary.budget)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-ink-medium">
              <Footprints className="h-3 w-3" aria-hidden="true" /> {itinerary.transport}
            </span>
            <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-ink-medium">
              {itinerary.typeLabel}
            </span>
            {itinerary.badge && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white">
                ✨ {itinerary.badge}
              </span>
            )}
            {itinerary.themes.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full border border-accent/40 bg-accent-light px-2.5 py-1 text-[11px] font-semibold text-accent"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Exact budget breakdown */}
      <div className="mx-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-light">
          Exact Budget Breakdown
        </p>
        <ul className="space-y-2.5">
          {itinerary.breakdown.map((line) => (
            <li
              key={line.label}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <span className="flex items-baseline gap-2 font-light text-ink-medium">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-lighter" aria-hidden="true" />
                {line.label}
              </span>
              <span className={cn('shrink-0 font-semibold', line.price === 0 ? 'text-primary-light' : 'text-ink-dark')}>
                {line.price === 0 ? 'Free' : formatINR(line.price)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-dashed border-primary-lighter pt-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-medium">Total</span>
          <span className={cn('font-serif text-xl', itinerary.accent)}>{formatINR(computedTotal)}</span>
        </div>
      </div>

      {/* Adventure level */}
      <div className="px-6 pt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-ink-light">
            Adventure Level · {adventureLabel(itinerary.adventure)}
          </span>
          <span className="font-bold text-primary">{itinerary.adventure}%</span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-primary-lighter/30"
          role="progressbar"
          aria-valuenow={itinerary.adventure}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Adventure level"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
            initial={{ width: 0 }}
            whileInView={{ width: `${itinerary.adventure}%` }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>

      <div className="p-6 pt-5">
        <div className="flex gap-3">
          <Button className="flex-1" onClick={handleAdd} aria-label={`Add ${itinerary.title} to my trip`}>
            {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {added ? 'In My Trip' : 'Add to My Trip'}
          </Button>
          {onExplore && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onExplore(itinerary)}
              aria-label={`Explore details of ${itinerary.title}`}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Explore
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
