import { Check, MapPin, MessageCircle, Plus, Star, Wifi, TrainFront } from 'lucide-react';
import type { Hostel } from '@/data/hostels';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import { cn, formatINR } from '@/lib/utils';

export function HostelDetail({
  hostel,
  onClose,
}: {
  hostel: Hostel | null;
  onClose: () => void;
}) {
  const { addItem, isInTrip } = useTrip();
  const { toast } = useToast();
  const added = hostel !== null && isInTrip(hostel.id);

  return (
    <Modal open={hostel !== null} onClose={onClose} labelledBy="hostel-detail-title">
      {hostel && (
        <div>
          <div className={cn('relative flex h-44 items-center justify-center sm:h-52', hostel.gradient)}>
            <span className="text-6xl drop-shadow" aria-hidden="true">
              {hostel.emoji}
            </span>
            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-dark shadow-calm backdrop-blur">
              {hostel.badge}
            </span>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <div>
              <h2 id="hostel-detail-title" className="font-serif text-2xl text-ink-dark sm:text-3xl">
                {hostel.name}
              </h2>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary-light" aria-hidden="true" />
                  {hostel.area}, {hostel.city}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <strong className="text-ink-dark">{hostel.rating}</strong> ({hostel.reviews} reviews)
                </span>
              </p>
            </div>

            <p className="text-sm font-light leading-relaxed text-ink-medium sm:text-base">
              {hostel.description}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Wifi, label: 'WiFi', value: `${hostel.wifiMbps} Mbps` },
                { icon: TrainFront, label: 'To metro', value: `${hostel.metroMins} min` },
                { icon: Star, label: 'Nomad score', value: `${hostel.nomadScore}/100` },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-gray-100 bg-primary-bg p-3.5 text-center"
                >
                  <Icon className="mx-auto h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="mt-1.5 font-serif text-lg text-ink-dark">{value}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-light">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-light">
                Amenities
              </p>
              <div className="flex flex-wrap gap-1.5">
                {hostel.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-medium text-ink-medium"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-primary-bg p-5">
              <div>
                <p className="font-serif text-3xl text-primary">{formatINR(hostel.price)}</p>
                <p className="text-xs text-ink-medium">per night · all taxes included · no hidden fees</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-calm">
                🛡️ Escrow protected
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => {
                  const ok = addItem({ id: hostel.id, kind: 'hostel', title: hostel.name });
                  toast(ok ? `${hostel.name} added to your trip` : 'Already in your trip');
                }}
              >
                {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                {added ? 'In Trip' : 'Add to Trip'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => toast(`Message sent to ${hostel.name}`)}
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Contact Hostel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
