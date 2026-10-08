import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, X } from 'lucide-react';
import { formatINR } from '@/lib/utils';

const RATES = [
  { code: 'USD', symbol: '$', rate: 83.2, flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', rate: 90.1, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', rate: 105.4, flag: '🇬🇧' },
];

export function CurrencyWidget({ amountINR }: { amountINR: number }) {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(RATES[0]);

  return (
    <div className="fixed bottom-24 left-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="glass mb-3 w-64 rounded-2xl bg-white p-5 shadow-bloom"
            role="dialog"
            aria-label="Currency converter"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-light">
                Currency
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close currency converter"
                className="flex h-7 w-7 items-center justify-center rounded-full text-ink-light transition hover:bg-primary-bg hover:text-primary"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <p className="font-serif text-2xl text-primary">{formatINR(amountINR)}</p>
            <p className="text-xs text-ink-medium">your current estimate</p>
            <div className="mt-3 flex gap-1.5" role="group" aria-label="Target currency">
              {RATES.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => setCur(r)}
                  aria-pressed={cur.code === r.code}
                  className={
                    'min-h-[36px] flex-1 rounded-full text-xs font-bold transition ' +
                    (cur.code === r.code ? 'bg-primary text-white' : 'bg-primary-bg text-primary')
                  }
                >
                  {r.code}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold text-ink-dark" aria-live="polite">
              {cur.flag} {cur.symbol}
              {(amountINR / cur.rate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}{' '}
              {cur.code}
            </p>
            <p className="mt-1 text-[11px] text-ink-light">
              1 {cur.code} ≈ ₹{cur.rate} · indicative rates
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open currency converter"
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-bloom"
      >
        <ArrowLeftRight className="h-5 w-5" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
