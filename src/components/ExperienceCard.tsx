import { Check, Ticket } from 'lucide-react';
import type { Experience } from '@/data/experiences';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { formatINR } from '@/lib/utils';

export function ExperienceCard({ experience }: { experience: Experience }) {
  const { toast } = useToast();

  return (
    <article className="gradient-edge flex h-full flex-col overflow-hidden rounded-card border border-gray-100 bg-white shadow-calm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-bloom">
      <div className="flex items-start gap-4 p-6 pb-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-light text-3xl"
          aria-hidden="true"
        >
          {experience.emoji}
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-lg leading-snug text-ink-dark">{experience.title}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-primary-bg px-2.5 py-0.5 text-[11px] font-bold text-primary">
              ⭐ {experience.rating}
            </span>
            <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold text-ink-medium">
              {experience.category}
            </span>
            {experience.badge && (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-white">
                {experience.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="px-6 pb-1 text-sm font-light leading-relaxed text-ink-medium">
        {experience.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 p-6 pt-4">
        <div>
          <p className="font-serif text-2xl text-primary">{formatINR(experience.price)}</p>
          <p className="text-xs text-ink-medium">{experience.duration} · per person</p>
        </div>
        <Button
          onClick={() => toast(`"${experience.title}" requested — the host confirms within 2 hrs`)}
          aria-label={`Book ${experience.title}`}
        >
          <Ticket className="h-4 w-4" aria-hidden="true" />
          Book Now
        </Button>
      </div>
    </article>
  );
}

export function ExperienceBookedNote() {
  return (
    <p className="flex items-center gap-2 text-xs text-ink-light">
      <Check className="h-3.5 w-3.5 text-primary-light" aria-hidden="true" />
      Free cancellation up to 24h before · escrow protected
    </p>
  );
}
