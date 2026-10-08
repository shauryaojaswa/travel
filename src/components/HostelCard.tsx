import { motion } from 'framer-motion';
import { Check, GitCompareArrows, MapPin, MessageCircle, Plus, Star } from 'lucide-react';
import type { Hostel } from '@/data/hostels';
import { Button } from '@/components/ui/button';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import { cn, formatINR } from '@/lib/utils';

export function HostelCard({
  hostel,
  onExplore,
  onCompare,
  comparing,
}: {
  hostel: Hostel;
  /** Optional: open the detail modal */
  onExplore?: (hostel: Hostel) => void;
  /** Optional: toggle compare selection */
  onCompare?: (hostel: Hostel) => void;
  comparing?: boolean;
}) {
  const { addItem, isInTrip } = useTrip();
  const { toast } = useToast();
  const added = isInTrip(hostel.id);

  const handleAdd = () => {
    const didAdd = addItem({ id: hostel.id, kind: 'hostel', title: hostel.name });
    toast(didAdd ? `${hostel.name} added to your trip` : `${hostel.name} is already in your trip`);
  };

  const handleContact = () =>
    toast(`Message sent to ${hostel.name} — they usually reply within a day`);

  return (
    <article className="gradient-edge flex h-full flex-col overflow-hidden rounded-card border border-gray-100 bg-white shadow-calm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-bloom">
      {/* Gradient image area */}
      <div className={cn('relative flex h-40 items-center justify-center', hostel.gradient)}>
        <span className="text-5xl drop-shadow-sm" aria-hidden="true">
          {hostel.emoji}
        </span>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-dark shadow-calm backdrop-blur">
          {hostel.badge}
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-primary shadow-calm backdrop-blur">
          {formatINR(hostel.price)}
          <span className="ml-1 text-[11px] font-medium text-ink-medium">/night</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-xl leading-snug text-ink-dark">
              {onExplore ? (
                <button
                  type="button"
                  onClick={() => onExplore(hostel)}
                  className="text-left transition-colors hover:text-primary"
                  aria-label={`View details of ${hostel.name}`}
                >
                  {hostel.name}
                </button>
              ) : (
                hostel.name
              )}
            </h3>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary-bg px-2.5 py-1 text-xs font-semibold text-primary">
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              {hostel.rating}
              <span className="font-normal text-ink-medium">({hostel.reviews})</span>
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-medium">
            <MapPin className="h-3.5 w-3.5 text-primary-light" aria-hidden="true" />
            {hostel.area}, {hostel.city}
            <span className="text-ink-light" aria-label={`${hostel.metroMins} minutes from metro`}>
              · {hostel.metroMins} min 🚇
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {hostel.amenities.map((a) => (
            <span
              key={a}
              className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-ink-medium"
            >
              {a}
            </span>
          ))}
        </div>

        <p className="text-sm font-light leading-relaxed text-ink-medium">
          {hostel.description}
        </p>

        {/* Nomad score */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink-light">
              💻 Nomad Score
            </span>
            <span className="font-bold text-primary">
              {hostel.nomadScore} · {hostel.wifiMbps} Mbps
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-primary-lighter/30"
            role="progressbar"
            aria-valuenow={hostel.nomadScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Nomad score for ${hostel.name}`}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
              initial={{ width: 0 }}
              whileInView={{ width: `${hostel.nomadScore}%` }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="mt-auto flex gap-3 pt-2">
          <Button className="flex-1" onClick={handleAdd} aria-label={`Add ${hostel.name} to trip`}>
            {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {added ? 'In Trip' : 'Add to Trip'}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleContact}
            aria-label={`Contact ${hostel.name}`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Contact
          </Button>
          {onCompare && (
            <Button
              variant={comparing ? 'default' : 'soft'}
              size="sm"
              className="shrink-0 px-3"
              onClick={() => onCompare(hostel)}
              aria-pressed={comparing}
              aria-label={comparing ? `Remove ${hostel.name} from compare` : `Add ${hostel.name} to compare`}
              title="Compare"
            >
              <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
