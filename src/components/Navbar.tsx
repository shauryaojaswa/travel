import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BedDouble, ChevronDown, Compass, Home, Map, Menu, Moon, PieChart, Sun, Users, X } from 'lucide-react';
import { useTrip } from '@/context/TripContext';
import { useCity, type CityId } from '@/context/CityContext';
import { useToast } from '@/context/ToastContext';
import { cityList } from '@/data/cities';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/hostels', label: 'Hostels', icon: BedDouble },
  { to: '/itineraries', label: 'Itineraries', icon: Compass },
  { to: '/budget', label: 'Budget', icon: PieChart },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/community', label: 'Community', icon: Users },
];

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('dct-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('dct-theme', dark ? 'dark' : 'light');
    } catch {
      /* private mode */
    }
  }, [dark]);

  return { dark, toggle: () => setDark((v) => !v) };
}

function CitySwitcher({ compact }: { compact?: boolean }) {
  const { city, setCity } = useCity();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const pick = (id: CityId, live: boolean) => {
    if (id !== city) {
      setCity(id);
      toast(live ? `Switched to ${id === 'delhi' ? 'Delhi' : 'Jaipur'} 🌿` : 'Jaipur beta — preview data, full launch Q2 2026');
    }
    setOpen(false);
  };

  return (
    <div className={'relative ' + (compact ? '' : 'hidden lg:block')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Switch city"
        className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-primary-lighter bg-primary-bg px-4 py-2 text-sm font-bold text-primary transition hover:shadow-calm"
      >
        📍 {city === 'delhi' ? 'Delhi' : 'Jaipur'}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <button type="button" aria-label="Close city menu" tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" />
            <motion.ul
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              role="listbox"
              aria-label="Cities"
              className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-bloom"
            >
              {cityList.map((c) => (
                <li key={c.id} role="option" aria-selected={city === c.id}>
                  <button
                    type="button"
                    onClick={() => pick(c.id, c.live)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-input p-3 text-left transition',
                      city === c.id ? 'bg-primary-bg' : 'hover:bg-primary-bg/60',
                    )}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {c.id === 'delhi' ? '🌿' : '🏰'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-ink-dark">
                        {c.name}
                        {!c.live && (
                          <span className="ml-2 rounded-full bg-accent-light px-2 py-0.5 text-[10px] font-bold text-accent">
                            Coming Soon
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-xs font-light text-ink-medium">{c.tagline}</span>
                    </span>
                    {city === c.id && <span className="text-primary" aria-hidden="true">✓</span>}
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { items } = useTrip();
  const { city } = useCity();
  const { dark, toggle } = useDarkMode();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-gray-100 bg-white/90 shadow-calm backdrop-blur-xl'
          : 'glass backdrop-blur-lg',
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex min-h-[44px] items-center gap-2 font-serif text-lg text-primary transition-transform duration-200 hover:scale-[1.02] sm:text-xl"
        >
          <span aria-hidden="true">🌿</span>
          <span>Delhi Calm Travel</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[44px] items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium transition-all duration-200 xl:gap-2 xl:px-4 xl:text-sm',
                  isActive
                    ? 'bg-primary text-white shadow-calm'
                    : 'text-ink-medium hover:bg-primary-bg hover:text-primary',
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
          <CitySwitcher />
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={dark}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-ink-medium transition hover:bg-primary-bg hover:text-primary"
          >
            {dark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
          </button>
          <span
            className="ml-1 flex min-h-[38px] items-center gap-1.5 rounded-full border border-primary-lighter bg-primary-bg px-3.5 py-1.5 text-xs font-semibold text-primary"
            aria-label={`My trip: ${items.length} items`}
            title="Items in my trip"
          >
            🧳 {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-ink-medium transition hover:bg-primary-bg"
          >
            {dark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
          </button>
        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-ink-dark transition hover:bg-primary-bg"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              <div className="mb-2 px-1">
                <CitySwitcher compact />
              </div>
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[44px] items-center gap-3 rounded-input px-4 py-3 text-sm font-medium transition',
                      isActive
                        ? 'bg-primary text-white shadow-calm'
                        : 'text-ink-medium hover:bg-primary-bg',
                    )
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center justify-between rounded-input bg-primary-bg px-4 py-3 text-xs font-semibold text-primary">
                <span>🧳 My Trip</span>
                <span>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
