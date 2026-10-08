import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Mail, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { useTrip } from '@/context/TripContext';
import { delhiJaipurTransit } from '@/data/transit';
import { formatINR } from '@/lib/utils';

export function Corridor() {
  const { toast } = useToast();
  const { addItem } = useTrip();
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-24" aria-labelledby="corridor-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary-lighter/50 bg-primary-bg px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            Multi-city
          </span>
          <h2 id="corridor-heading" className="text-display-lg">
            🏙️ Delhi to Jaipur — Your Multi-City Journey
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-ink-medium sm:text-lg">
            One trip, two cities. Pick your corridor ride — it flows straight into your trip plan.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {delhiJaipurTransit.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="gradient-edge flex flex-col gap-3 rounded-card border border-gray-100 bg-white p-6 shadow-calm transition-all duration-300 hover:-translate-y-2 hover:shadow-bloom"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-bg text-2xl" aria-hidden="true">
                {t.emoji}
              </span>
              <h3 className="font-serif text-xl text-ink-dark">{t.mode}</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-light">{t.duration}</p>
              <p className="font-serif text-2xl text-primary">{formatINR(t.price)}</p>
              <p className="text-sm font-light leading-relaxed text-ink-medium">{t.description}</p>
              <Button
                className="mt-auto w-full"
                onClick={() => {
                  const ok = addItem({ id: `corridor-${t.id}`, kind: 'itinerary', title: `Delhi→Jaipur: ${t.mode}` });
                  toast(ok ? `${t.mode} added to your trip` : 'Already in your trip');
                }}
                aria-label={`Add ${t.mode} to trip`}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add to Trip
              </Button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JaipurWaitlist() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  return (
    <div className="glass mx-auto mt-6 flex max-w-xl flex-col items-center gap-4 rounded-card p-6 shadow-calm sm:flex-row">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-light text-2xl" aria-hidden="true">
        🗺️
      </span>
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="font-serif text-lg text-ink-dark">Coming Next: Jaipur — The Pink City</p>
        <p className="text-xs font-light text-ink-medium">Beta launching Q2 2026. Join the waitlist →</p>
      </div>
      <form
        className="flex w-full gap-2 sm:w-auto"
        onSubmit={(e) => {
          e.preventDefault();
          if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast('Enter a valid email to join the waitlist');
            return;
          }
          toast("You're on the waitlist! 🎉");
          setEmail('');
        }}
      >
        <label htmlFor="waitlist-email" className="sr-only">
          Email for Jaipur waitlist
        </label>
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="calm-input min-w-0 flex-1 sm:w-44"
        />
        <Button type="submit" size="sm" aria-label="Join Jaipur waitlist">
          Join
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </form>
      <p className="hidden items-center gap-1 text-[11px] text-ink-light" aria-hidden="true">
        <Mail className="h-3 w-3" />
        <Check className="h-3 w-3" />
      </p>
    </div>
  );
}
