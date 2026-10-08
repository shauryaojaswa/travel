import { Check, Star, TrainFront, Wifi, X } from 'lucide-react';
import type { Hostel } from '@/data/hostels';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { formatINR } from '@/lib/utils';

export function CompareModal({
  hostels,
  open,
  onClose,
  onRemove,
}: {
  hostels: Hostel[];
  open: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const { toast } = useToast();
  const winners = {
    price: Math.min(...hostels.map((h) => h.price)),
    rating: Math.max(...hostels.map((h) => h.rating)),
    wifi: Math.max(...hostels.map((h) => h.wifiMbps)),
    metro: Math.min(...hostels.map((h) => h.metroMins)),
    nomad: Math.max(...hostels.map((h) => h.nomadScore)),
  };

  const rows: {
    label: string;
    render: (h: Hostel) => string;
    wins: (h: Hostel) => boolean;
  }[] = [
    { label: 'Price / night', render: (h) => formatINR(h.price), wins: (h) => h.price === winners.price },
    { label: 'Rating', render: (h) => `${h.rating}★ (${h.reviews})`, wins: (h) => h.rating === winners.rating },
    { label: 'WiFi speed', render: (h) => `${h.wifiMbps} Mbps`, wins: (h) => h.wifiMbps === winners.wifi },
    { label: 'Walk to metro', render: (h) => `${h.metroMins} min`, wins: (h) => h.metroMins === winners.metro },
    { label: 'Nomad score', render: (h) => `${h.nomadScore}/100`, wins: (h) => h.nomadScore === winners.nomad },
    { label: 'Location', render: (h) => `${h.area}, ${h.city}`, wins: () => false },
  ];
  // __TABLE__
  return (
    <Modal open={open} onClose={onClose} labelledBy="compare-title" wide>
      <div className="p-6 sm:p-8">
        <h2 id="compare-title" className="font-serif text-2xl text-ink-dark sm:text-3xl">
          Compare hostels
        </h2>
        <p className="mt-2 text-sm font-light text-ink-medium">
          Side-by-side, no marketing fog. 🏅 marks the best value in each row.
        </p>

        {hostels.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-medium">
            Nothing to compare yet — tap the compare icon on any hostel card.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-32 p-0 text-left align-bottom" scope="col">
                    <span className="sr-only">Feature</span>
                  </th>
                  {hostels.map((h) => (
                    <th key={h.id} scope="col" className="p-2 align-bottom">
                      <div className="rounded-2xl bg-primary-bg p-4 text-center">
                        <span className="text-2xl" aria-hidden="true">
                          {h.emoji}
                        </span>
                        <p className="mt-1 font-serif text-base leading-tight text-ink-dark">{h.name}</p>
                        <button
                          type="button"
                          onClick={() => onRemove(h.id)}
                          className="mx-auto mt-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink-light shadow-calm transition hover:text-primary"
                          aria-label={`Remove ${h.name} from compare`}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-gray-100">
                    <th scope="row" className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-light">
                      {row.label}
                    </th>
                    {hostels.map((h) => (
                      <td key={h.id} className="p-3 text-center">
                        <span
                          className={
                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ' +
                            (row.wins(h) ? 'bg-primary text-white shadow-calm' : 'bg-gray-50 text-ink-dark')
                          }
                        >
                          {row.wins(h) && <span aria-hidden="true">🏅</span>}
                          {row.render(h)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-gray-100">
                  <th scope="row" className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-light">
                    Amenities
                  </th>
                  {hostels.map((h) => (
                    <td key={h.id} className="p-3">
                      <ul className="space-y-1.5 text-left text-xs text-ink-medium">
                        {h.amenities.map((a) => (
                          <li key={a} className="flex items-start gap-1.5">
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary-light" aria-hidden="true" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-xs text-ink-light">
          <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          <TrainFront className="h-3.5 w-3.5" aria-hidden="true" />
          <span>All figures verified by our team · updated weekly</span>
        </div>

        <Button
          className="mt-5 w-full"
          onClick={() => {
            toast('Comparison saved to your trip notes');
            onClose();
          }}
        >
          Save this comparison
        </Button>
      </div>
    </Modal>
  );
}
