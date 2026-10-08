import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QA: { q: string; a: string }[] = [
  {
    q: "What's the cheapest hostel near the metro?",
    a: 'The Hosteller at ₹499/night is 4 min from New Delhi Metro — and Backpackers Paradise at ₹399 is even cheaper.',
  },
  {
    q: 'How do I get to Jaipur from Delhi?',
    a: 'Shatabdi Express: 4.5 hrs, ₹1,050 with breakfast. Or a Volvo bus: 6 hrs, ₹800 — both bookable from the corridor section on Home.',
  },
  {
    q: 'Best street food under ₹100?',
    a: 'Paranthe Wali Gali in Chandni Chowk! Pyaaz parantha + lassi combo for ~₹80. Follow our ₹500 Food Trek route.',
  },
];

export function DelhiAi() {
  const [open, setOpen] = useState(false);
  const [asked, setAsked] = useState<number[]>([]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="glass mb-3 w-[19rem] max-w-[calc(100vw-3rem)] rounded-card bg-white p-5 shadow-bloom"
            role="dialog"
            aria-label="Ask Delhi AI"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-1.5 font-serif text-lg text-ink-dark">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                Ask Delhi AI ✨
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Delhi AI"
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink-light transition hover:bg-primary-bg hover:text-primary"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <p className="mb-3 text-xs font-light text-ink-medium">
              Tap a question — answers come from our verified Delhi data, not guesses.
            </p>
            <div className="space-y-2.5">
              {QA.map((item, i) => (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() => setAsked((prev) => (prev.includes(i) ? prev : [...prev, i]))}
                    aria-expanded={asked.includes(i)}
                    className="flex w-full items-start gap-2 rounded-input bg-primary-bg px-3.5 py-2.5 text-left text-xs font-semibold text-primary transition hover:bg-primary-lighter/40"
                  >
                    <Send className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    {item.q}
                  </button>
                  <AnimatePresence initial={false}>
                    {asked.includes(i) && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden text-xs font-light leading-relaxed text-ink-medium"
                      >
                        <span className="block rounded-input bg-gray-50 px-3.5 py-2.5">
                          {item.a}
                        </span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Ask Delhi AI"
          className="shadow-bloom"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Ask Delhi AI ✨
        </Button>
      </motion.div>
    </div>
  );
}
