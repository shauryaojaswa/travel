import { Link } from 'react-router-dom';
import { BadgeCheck, Cpu, Lock, Percent, Sparkles, Users } from 'lucide-react';
import { useCity } from '@/context/CityContext';

const features = [
  { icon: Lock, label: 'No Dark Patterns' },
  { icon: Percent, label: '7-9% Commission' },
  { icon: BadgeCheck, label: 'Secure Escrow' },
  { icon: Sparkles, label: 'Calm Technology' },
  { icon: Cpu, label: 'AI-Powered' },
  { icon: Users, label: 'Community-First' },
];

export function Footer() {
  const { city } = useCity();
  return (
    <footer className="relative z-10 mt-24 border-t border-gray-100 bg-primary-bg">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <Link to="/" className="flex items-center gap-2 font-serif text-2xl text-primary">
              <span aria-hidden="true">🌿</span> Delhi Calm Travel
            </Link>
            <p className="mt-3 max-w-sm text-sm text-ink-medium">
              Calm, transparent travel for {city === 'delhi' ? 'Delhi' : 'Jaipur'} — and soon,
              everywhere worth slowing down for.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Footer navigation">
            {features.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 rounded-full border border-primary-lighter/60 bg-white px-4 py-2 text-xs font-semibold text-primary shadow-calm"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </span>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-primary-lighter/40 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-ink-medium">
            Coming soon:{' '}
            <span className="font-semibold text-primary">
              Jaipur • Udaipur • Goa • Bali
            </span>
          </p>
          <p className="text-xs text-ink-light">
            © {new Date().getFullYear()} Delhi Calm Travel — a prototype built on calm
            principles.
          </p>
        </div>
      </div>
    </footer>
  );
}
