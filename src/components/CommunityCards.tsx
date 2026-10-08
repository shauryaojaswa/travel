import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { localGuides, type Meetup } from '@/data/community';
import { useState } from 'react';

// __CARDS__
export function GuideCard({ guide, index }: { guide: (typeof localGuides)[number]; index: number }) {
  const { toast } = useToast();
  return (
    <Reveal delay={(index % 2) * 0.1}>
      <article className="gradient-edge flex h-full flex-col gap-4 rounded-card border border-gray-100 bg-white p-6 shadow-calm transition-all duration-300 hover:-translate-y-2 hover:shadow-bloom">
        <div className="flex items-center gap-3.5">
          <span className={'flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ' + guide.color} aria-hidden="true">
            {guide.initials}
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-xl text-ink-dark">{guide.name}</h3>
            <p className="truncate text-sm font-medium text-primary">{guide.tagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-primary-bg px-2.5 py-1 text-primary">
            ⭐ {guide.rating} ({guide.reviews})
          </span>
          <span className="rounded-full bg-accent-light px-2.5 py-1 text-accent">{guide.specialty}</span>
          <span className="rounded-full bg-gray-50 px-2.5 py-1 text-ink-medium">{guide.price}</span>
        </div>
        <p className="text-sm font-light italic leading-relaxed text-ink-medium">“{guide.bio}”</p>
        <div className="mt-auto flex gap-3 pt-1">
          <Button className="flex-1" size="sm" onClick={() => toast(`Session requested with ${guide.name} — they reply within a day`)}>
            Book Session
          </Button>
          <Button variant="outline" className="flex-1" size="sm" onClick={() => toast(`Message sent to ${guide.name}`)}>
            Message
          </Button>
        </div>
      </article>
    </Reveal>
  );
}

export function MeetupCard({ meetup, index }: { meetup: Meetup; index: number }) {
  const { toast } = useToast();
  const [joined, setJoined] = useState(false);
  return (
    <Reveal delay={(index % 2) * 0.1}>
      <article className="gradient-edge flex h-full flex-col gap-3 rounded-card border border-gray-100 bg-white p-6 shadow-calm transition-all duration-300 hover:-translate-y-2 hover:shadow-bloom">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-bg text-2xl" aria-hidden="true">
            {meetup.emoji}
          </span>
          <span className="rounded-full bg-primary-bg px-2.5 py-1 text-[11px] font-bold text-primary">
            {meetup.price}
          </span>
        </div>
        <h3 className="font-serif text-lg leading-snug text-ink-dark">{meetup.title}</h3>
        <p className="text-xs font-semibold text-ink-medium">🗓 {meetup.when}</p>
        <p className="text-sm font-light text-ink-medium">{meetup.detail}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="flex items-center" aria-label={`${meetup.attendees + (joined ? 1 : 0)} attending`}>
            {['bg-emerald-500', 'bg-sky-500', 'bg-amber-500'].map((c, i) => (
              <span key={i} className={'flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white ' + c} style={{ marginLeft: i === 0 ? 0 : -8 }} aria-hidden="true">
                {['AK', 'RS', 'MT'][i]}
              </span>
            ))}
            <span className="ml-2 text-xs font-semibold text-ink-medium">
              {meetup.attendees + (joined ? 1 : 0)} attending
            </span>
          </span>
          <Button
            size="sm"
            variant={joined ? 'soft' : 'default'}
            onClick={() => {
              setJoined((v) => !v);
              toast(joined ? 'Spot released — see you next time!' : "You're in! Spot reserved 🎉");
            }}
            aria-pressed={joined}
          >
            {joined ? 'Joined ✓' : 'Join'}
          </Button>
        </div>
      </article>
    </Reveal>
  );
}
export function GuideDirectory() {
  return null;
}
