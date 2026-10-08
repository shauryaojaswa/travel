import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileDown, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { formatINR } from '@/lib/utils';

type Category = 'Food' | 'Transport' | 'Stay' | 'Activities' | 'Shopping' | 'Misc';

interface Expense {
  id: number;
  amount: number;
  category: Category;
  note: string;
  date: string;
}

const CATEGORIES: Category[] = ['Food', 'Transport', 'Stay', 'Activities', 'Shopping', 'Misc'];

const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#D4A373',
  Transport: '#6366F1',
  Stay: '#2D6A4F',
  Activities: '#EAB308',
  Shopping: '#EC4899',
  Misc: '#84A98C',
};

let nextId = 100;

export function ExpenseTracker({ budget }: { budget: number }) {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, amount: 599, category: 'Stay', note: 'Checkpoint Backpackers, Night 1', date: '2026-10-05' },
    { id: 2, amount: 150, category: 'Food', note: 'Lunch — Paranthe Wali Gali', date: '2026-10-06' },
    { id: 3, amount: 50, category: 'Transport', note: 'Metro pass', date: '2026-10-06' },
    { id: 4, amount: 200, category: 'Food', note: 'Evening chai + snacks', date: '2026-10-06' },
    { id: 5, amount: 800, category: 'Activities', note: 'Pottery workshop', date: '2026-10-07' },
  ]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [note, setNote] = useState('');
  const [splitCount, setSplitCount] = useState(2);
  const [showSplit, setShowSplit] = useState(false);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - total;
  // __CHART__
  const byCategory = useMemo(() => {
    const map = new Map<Category, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  // CSS donut: conic-gradient segments
  const donut = useMemo(() => {
    if (total === 0) return 'conic-gradient(#E2E8F0 0 100%)';
    let acc = 0;
    const parts = byCategory.map(([cat, amt]) => {
      const from = (acc / total) * 100;
      acc += amt;
      const to = (acc / total) * 100;
      return `${CATEGORY_COLORS[cat]} ${from.toFixed(1)}% ${to.toFixed(1)}%`;
    });
    return `conic-gradient(${parts.join(', ')})`;
  }, [byCategory, total]);

  const addExpense = () => {
    const value = Math.round(Number(amount));
    if (!Number.isFinite(value) || value <= 0) {
      toast('Enter an amount above ₹0 first');
      return;
    }
    setExpenses((prev) => [
      ...prev,
      {
        id: ++nextId,
        amount: value,
        category,
        note: note.trim() || category,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setAmount('');
    setNote('');
    toast(`${formatINR(value)} added to ${category}`);
  };
  // __UI__
  return (
    <div className="rounded-card border border-gray-100 bg-white p-6 shadow-calm sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl text-ink-dark">Expense Tracker</h3>
        <span className="rounded-full bg-primary-bg px-3 py-1 text-xs font-bold text-primary">
          {expenses.length} entries
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="exp-amount" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-light">
            Amount (₹)
          </label>
          <input id="exp-amount" type="number" min={1} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="250" className="calm-input" />
        </div>
        <div>
          <label htmlFor="exp-cat" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-light">
            Category
          </label>
          <select id="exp-cat" className="calm-input" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="exp-note" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-light">
            Note
          </label>
          <input id="exp-note" type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Dinner at Social, HKV…" className="calm-input" />
        </div>
        <Button className="sm:col-span-2" onClick={addExpense}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Expense
        </Button>
      </div>
      {/* __BOTTOM__ */}
      <div className="mt-6 flex flex-col items-center gap-5 rounded-2xl bg-primary-bg p-5 sm:flex-row">
        <div className="relative h-28 w-28 shrink-0 rounded-full" style={{ background: donut }} role="img" aria-label="Spending by category">
          <span className="absolute inset-3 flex items-center justify-center rounded-full bg-white text-center">
            <span>
              <span className="block font-serif text-lg leading-none text-primary">{formatINR(total)}</span>
              <span className="block text-[9px] font-semibold uppercase tracking-wider text-ink-light">spent</span>
            </span>
          </span>
        </div>
        <div className="w-full flex-1">
          <ul className="space-y-1.5">
            {byCategory.map(([cat, amt]) => (
              <li key={cat} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-ink-dark">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} aria-hidden="true" />
                  {cat}
                </span>
                <span className="font-semibold text-ink-dark">{formatINR(amt)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-primary-lighter/40 pt-2 text-sm font-bold text-ink-dark">
            Remaining: <span className={remaining >= 0 ? 'text-primary' : 'text-amber-600'}>{formatINR(remaining)}</span>
            <span className="ml-1 text-[11px] font-normal text-ink-light">of {formatINR(budget)} budget</span>
          </p>
        </div>
      </div>
      {/* __ENTRIES__ */}
      <ul className="mt-5 space-y-2.5">
        <AnimatePresence initial={false}>
          {expenses.map((e) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="flex items-center justify-between gap-3 rounded-input border border-gray-100 bg-gray-50/60 px-4 py-2.5"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-semibold text-ink-dark">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[e.category] }} aria-hidden="true" />
                  {formatINR(e.amount)}
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-ink-medium shadow-calm">{e.category}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs font-light text-ink-medium">
                  {e.note} · {e.date}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setExpenses((prev) => prev.filter((x) => x.id !== e.id))}
                aria-label={`Delete ${e.note}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-light transition hover:bg-white hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <label htmlFor="split-count" className="flex items-center gap-1.5 text-xs font-semibold text-ink-medium">
            <Users className="h-4 w-4" aria-hidden="true" />
            Split ×
          </label>
          <input id="split-count" type="number" min={2} max={20} value={splitCount} onChange={(e) => setSplitCount(Math.max(2, Math.min(20, Number(e.target.value) || 2)))} className="calm-input w-20" />
          <Button variant="soft" size="sm" onClick={() => setShowSplit((v) => !v)} aria-expanded={showSplit}>
            {formatINR(Math.round(total / splitCount))} each
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast('Export coming soon!')}>
          <FileDown className="h-4 w-4" aria-hidden="true" />
          Export PDF
        </Button>
      </div>
      {showSplit && (
        <p className="mt-3 rounded-input bg-primary-bg px-4 py-3 text-sm font-semibold text-primary" role="status">
          Split with friends: {formatINR(total)} ÷ {splitCount} = {formatINR(Math.round(total / splitCount))} per person
        </p>
      )}
    </div>
  );
}
