import { motion } from 'framer-motion';
import { Check, Clock, Link2, Plus } from 'lucide-react';
import type { Itinerary } from '@/data/itineraries';
import { itineraries } from '@/data/itineraries';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import { cn, formatINR } from '@/lib/utils';
import { adventureLabel } from './ItineraryCard';

export function ItineraryDetail({
  itinerary,
  onClose,
  onPick,
}: {
  itinerary: Itinerary | null;
  onClose: () => void;
  onPick: (itinerary: Itinerary) => void;
}) {
  const { addItem, isInTrip } = useTrip();
  const { toast } = useToast();
  const added = itinerary !== null && isInTrip(itinerary.id);

  const similar =
    itinerary === null
      ? []
      : itineraries
          .filter((it) => it.id !== itinerary.id && it.cityId === itinerary.cityId)
          .filter((it) => it.tags.some((t) => itinerary.tags.includes(t)))
          .slice(0, 2);

  return (
    <Modal open={itinerary !== null} onClose={onClose} labelledBy="itin-detail-title" wide>
      {itinerary && (
        <div>
          <div className={cn('relative flex h-44 items-center justify-center sm:h-56', itinerary.accentSoft)}>
            <span className="text-6xl" aria-hidden="true">
              {itinerary.emoji}
            </span>
            {itinerary.badge && (
              <span className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-calm">
                ✨ {itinerary.badge}
              </span>
            )}
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <h2 id="itin-detail-title" className="font-serif text-2xl text-ink-dark sm:text-3xl">
                {itinerary.title}
              </h2>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-primary-bg px-2.5 py-1 text-primary">
                  ⏱ {itinerary.durationLabel}
                </span>
                <span className="rounded-full bg-accent-light px-2.5 py-1 text-accent">
                  💰 {formatINR(itinerary.budget)}
                </span>
                <span className="rounded-full bg-gray-50 px-2.5 py-1 text-ink-medium">
                  🚶 {itinerary.transport}
                </span>
                {itinerary.themes.map((t) => (
                  <span key={t} className="rounded-full border border-accent/40 bg-accent-light px-2.5 py-1 text-accent">
                    {t}
                  </span>
                ))}
              </p>
            </div>

            {/* Adventure meter */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-ink-light">
                  Adventure Level · {adventureLabel(itinerary.adventure)}
                </span>
                <span className="font-bold text-primary">{itinerary.adventure}%</span>
              </div>
              <div
                className="h-3 w-full overflow-hidden rounded-full bg-primary-lighter/30"
                role="progressbar"
                aria-valuenow={itinerary.adventure}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Adventure level"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-primary-light to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${itinerary.adventure}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] font-medium text-ink-light">
                <span>Chill</span>
                <span>Moderate</span>
                <span>Thrilling</span>
                <span>Extreme</span>
              </div>
            </div>
            {/* __TIMELINE__ */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-light">
                Your timeline
              </p>
              <ol className="relative space-y-6 border-l-2 border-primary-lighter/50 pl-6">
                {itinerary.stops.map((stop, i) => (
                  <li key={stop.time + stop.title} className="relative">
                    <span
                      className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-white"
                      aria-hidden="true"
                    />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="rounded-full bg-primary-bg px-2.5 py-0.5 text-[11px] font-bold text-primary">
                        <Clock className="mr-1 inline h-3 w-3" aria-hidden="true" />
                        {stop.time}
                      </span>
                      <h3 className="font-serif text-lg text-ink-dark">{stop.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm font-light leading-relaxed text-ink-medium">
                      {stop.detail}
                    </p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-ink-medium">
                      <span>
                        💰 {stop.cost === 0 ? <span className="text-primary-light">Free</span> : formatINR(stop.cost)}
                      </span>
                      <span>⏳ {stop.duration}</span>
                      <span>🚇 {stop.transit}</span>
                    </p>
                    {i === 0 && (
                      <span className="mt-2 inline-block rounded-2xl border border-dashed border-primary-lighter bg-primary-bg px-3 py-1.5 text-[11px] text-ink-medium">
                        Photo spot 📸 — {stop.title} looks best in morning light
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => {
                  const ok = addItem({ id: itinerary.id, kind: 'itinerary', title: itinerary.title });
                  toast(ok ? `${itinerary.title} added to your trip plan` : 'Already in your trip');
                }}
              >
                {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                {added ? 'In My Trip' : 'Add to Trip Plan'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => toast('Shareable link copied — send it to your travel crew')}
              >
                <Link2 className="h-4 w-4" aria-hidden="true" />
                Share
              </Button>
            </div>

            {/* Similar */}
            {similar.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-light">
                  Similar itineraries
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {similar.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onPick(s)}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-calm transition hover:-translate-y-0.5 hover:shadow-calm-md"
                    >
                      <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl', s.accentSoft)} aria-hidden="true">
                        {s.emoji}
                      </span>
                      <span>
                        <span className="block font-serif text-base leading-tight text-ink-dark">{s.title}</span>
                        <span className="mt-0.5 block text-xs text-ink-medium">
                          {s.durationLabel} · {formatINR(s.budget)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
      )}
    </Modal>
  );
}
