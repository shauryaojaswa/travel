import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, HandHeart, Receipt, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import { StatCounter } from '@/components/StatCounter';
import { HostelCard } from '@/components/HostelCard';
import { ItineraryCard } from '@/components/ItineraryCard';
import { hostels } from '@/data/hostels';
import { itineraries } from '@/data/itineraries';

const whyCards = [
  {
    icon: Receipt,
    title: 'Exact Budgets',
    body: 'Every rupee, itemized before you book. Our deterministic budget engine uses real Delhi prices — never "starting from" estimates.',
  },
  {
    icon: Sparkles,
    title: 'Calm Design',
    body: 'No countdown timers. No fake scarcity. No pop-ups begging you to book now. Just a peaceful space to plan at your own pace.',
  },
  {
    icon: HandHeart,
    title: 'Fair Marketplace',
    body: 'Independent hostels keep 91–93% of what you pay. Payments sit in secure escrow until you check in. Fair for travelers and hosts alike.',
  },
];

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden px-5 pb-24 pt-36 sm:px-8 sm:pt-44">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Badge className="mb-7 px-4 py-1.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-70" />
                <span className="relative inline-flex h-2 w-2 animate-pulse-dot rounded-full bg-primary" />
              </span>
              Now live in Delhi — Coming to Jaipur
            </Badge>
          </motion.div>

          <motion.h1
            className="text-display-xl font-light tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            Travel Delhi{' '}
            <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
              Without the Stress
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-7 max-w-2xl text-base font-light leading-relaxed text-ink-medium sm:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            Curated hostels, hidden itineraries, and exact budget planning. No hidden fees. No
            dark patterns. Just calm, confident travel.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            <Link to="/hostels">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Hostels
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/budget">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Plan My Budget
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-y-8 rounded-card glass px-4 py-8 shadow-calm sm:grid-cols-4 sm:px-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
          >
            <StatCounter target={5} label="Curated Hostels" />
            <StatCounter target={3} label="Hidden Itineraries" />
            <StatCounter target={499} prefix="₹" suffix="+" label="Starting/Night" />
            <StatCounter target={0} suffix="%" label="Hidden Fees" />
          </motion.div>
        </div>
      </section>
      {/* ============ WHY ============ */}
      <section className="px-5 py-20 sm:px-8 sm:py-24" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl">
          <div id="why-heading">
            <SectionHeader
              eyebrow="Why us"
              title="Why Delhi Calm Travel?"
              subtitle="Travel apps should lower your blood pressure, not raise it. Here’s what we do differently."
            />
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {whyCards.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <div className="glass gradient-edge h-full rounded-card p-8 shadow-calm transition-all duration-300 hover:-translate-y-2 hover:shadow-bloom">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-calm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-xl text-ink-dark">{title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-ink-medium">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOSTEL PREVIEW ============ */}
      <section
        className="bg-primary-bg px-5 py-20 sm:px-8 sm:py-24"
        aria-labelledby="hostel-preview-heading"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge className="mb-4">Stay</Badge>
              <h2 id="hostel-preview-heading" className="text-display-md">
                Top picks for your first night
              </h2>
              <p className="mt-3 max-w-xl text-sm font-light text-ink-medium sm:text-base">
                Hand-verified boutique hostels with real reviews and exact prices. What you see is
                what you pay.
              </p>
            </div>
            <Link to="/hostels">
              <Button variant="soft">
                View all hostels
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hostels.slice(0, 2).map((h, i) => (
              <Reveal key={h.id} delay={i * 0.1}>
                <HostelCard hostel={h} />
              </Reveal>
            ))}
            <Reveal
              delay={0.2}
              className="hidden rounded-card border-2 border-dashed border-primary-lighter/60 p-8 text-center lg:flex lg:flex-col lg:items-center lg:justify-center"
            >
              <span className="text-4xl" aria-hidden="true">
                🌿
              </span>
              <p className="mt-4 font-serif text-xl text-primary">3 more waiting for you</p>
              <p className="mt-2 text-sm font-light text-ink-medium">
                Every hostel is visited and verified by our team before it goes live.
              </p>
              <Link to="/hostels" className="mt-6">
                <Button variant="outline" size="sm">
                  Browse all 5
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
      {/* ============ ITINERARY PREVIEW ============ */}
      <section className="px-5 py-20 sm:px-8 sm:py-24" aria-labelledby="itin-preview-heading">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge className="mb-4">Explore</Badge>
              <h2 id="itin-preview-heading" className="text-display-md">
                A hidden itinerary, on the house
              </h2>
              <p className="mt-3 max-w-xl text-sm font-light text-ink-medium sm:text-base">
                Every route is walked, timed, and priced to the rupee by locals.
              </p>
            </div>
            <Link to="/itineraries">
              <Button variant="soft">
                All itineraries
                <Compass className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Reveal>
              <ItineraryCard itinerary={itineraries[0]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="px-5 pb-8 sm:px-8">
        <Reveal className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary via-primary-light to-emerald-400 px-8 py-14 text-center shadow-bloom sm:px-14">
            <span
              className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-14 -left-10 h-52 w-52 rounded-full bg-white/10"
              aria-hidden="true"
            />
            <h2 className="relative text-display-md text-white">
              Your calm Delhi trip starts here
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm font-light text-white/90 sm:text-base">
              Pick a hostel, follow a hidden itinerary, and know your exact budget — before you
              spend a single rupee.
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/hostels">
                <Button variant="white" size="lg" className="w-full sm:w-auto">
                  Explore Hostels
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/map">
                <Button
                  size="lg"
                  className="w-full border-2 border-white/70 bg-transparent text-white shadow-none hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  Open Discovery Map
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>


    </>
  );
}
