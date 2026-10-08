import { AnimatePresence, motion } from 'framer-motion';
import { Dices, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import type { Itinerary } from '@/data/itineraries';
import { ItineraryCard } from './ItineraryCard';
import { Button } from '@/components/ui/button';

export function SurpriseMe({
  itineraries,
  onExplore,
}: {
  itineraries: Itinerary[];
  onExplore: (itinerary: Itinerary) => void;
}) {
  const [pick, setPick] = useState<Itinerary | null>(null);
  const [spinning, setSpinning] = useState(false);

  const surprise = () => {
    if (itineraries.length === 0 || spinning) return;
    setSpinning(true);
    let ticks = 0;
    const timer = window.setInterval(() => {
      setPick(itineraries[Math.floor(Math.random() * itineraries.length)]);
      ticks += 1;
      if (ticks >= 6) {
        window.clearInterval(timer);
        setSpinning(false);
      }
    }, 130);
  };

  return (
    <div className="mt-14 overflow-hidden rounded-card border border-accent/30 bg-gradient-to-br from-accent-light via-white to-primary-bg p-8 text-center shadow-calm sm:p-10">
      <p className="font-serif text-2xl text-ink-dark">Feeling spontaneous?</p>
      <p className="mx-auto mt-2 max-w-xl text-sm font-light text-ink-medium">
        87% of travelers leave room for unexpected discoveries. Let the city decide.
      </p>
      <Button size="lg" className="mt-6" onClick={surprise} disabled={spinning}>
        {spinning ? <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Dices className="h-5 w-5" aria-hidden="true" />}
        🎲 Surprise Me!
      </Button>

      <AnimatePresence mode="wait">
        {pick && !spinning && (
          <motion.div
            key={pick.id + String(Date.now())}
            initial={{ opacity: 0, rotateY: 70, y: 20 }}
            animate={{ opacity: 1, rotateY: 0, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 max-w-xl text-left"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setPick(null)}
                aria-label="Dismiss surprise pick"
                className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-light shadow-calm transition hover:text-primary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
              <ItineraryCard itinerary={pick} onExplore={onExplore} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
