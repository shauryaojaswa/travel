import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Backpack } from 'lucide-react';

interface PackingItem {
  id: string;
  label: string;
}

const GROUPS: { title: string; emoji: string; items: string[] }[] = [
  { title: 'Tech', emoji: '📱', items: ['Phone charger', 'Power bank', 'Earbuds', 'Universal adapter'] },
  { title: 'Clothing', emoji: '👕', items: ['3 T-shirts', '2 Shorts', 'Rain jacket', 'Comfortable walking shoes'] },
  { title: 'Health', emoji: '💊', items: ['Sunscreen', 'Hand sanitizer', 'Basic meds', 'Reusable water bottle'] },
  { title: 'Documents', emoji: '📄', items: ['ID', 'Cash (₹500 notes for street food)', 'Digital copies'] },
  { title: 'Delhi-Specific', emoji: '🎒', items: ['Mosquito repellent', 'Scarf (for temples)', 'Camera'] },
];

export function PackingList() {
  const [checked, setChecked] = useState<Set<string>>(new Set(['Phone charger']));

  const total = useMemo(() => GROUPS.reduce((s, g) => s + g.items.length, 0), []);
  const pct = Math.round((checked.size / total) * 100);

  const toggle = (label: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const asItem = (g: string, label: string): PackingItem => ({ id: `${g}:${label}`, label });

  return (
    <div className="rounded-card border border-gray-100 bg-white p-6 shadow-calm sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-serif text-2xl text-ink-dark">
          <Backpack className="h-5 w-5 text-primary" aria-hidden="true" />
          Smart Packing List
        </h3>
        <span className="rounded-full bg-primary-bg px-3 py-1 text-xs font-bold text-primary">
          {checked.size}/{total} · {pct}%
        </span>
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-primary-lighter/30">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Packing progress"
        />
      </div>

      <div className="mt-6 space-y-6">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink-light">
              {group.emoji} {group.title}
            </p>
            <ul className="space-y-2">
              {group.items.map((label) => {
                const item = asItem(group.title, label);
                const done = checked.has(label);
                return (
                  <li key={item.id}>
                    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-input border border-gray-100 bg-gray-50/60 px-4 py-2 transition hover:border-primary-lighter hover:bg-primary-bg/50">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggle(label)}
                        className="h-5 w-5 shrink-0 accent-[#2D6A4F]"
                        aria-label={label}
                      />
                      <motion.span
                        animate={{ opacity: done ? 0.55 : 1 }}
                        className={
                          'text-sm font-medium text-ink-dark ' +
                          (done ? 'line-through decoration-primary decoration-2' : '')
                        }
                      >
                        {label}
                      </motion.span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {pct === 100 && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-input bg-primary-bg px-4 py-3 text-center text-sm font-semibold text-primary"
          role="status"
        >
          🎉 Fully packed. Delhi, here you come!
        </motion.p>
      )}
    </div>
  );
}
