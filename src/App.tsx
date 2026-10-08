import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from '@/context/ToastContext';
import { TripProvider } from '@/context/TripContext';
import { CityProvider } from '@/context/CityContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Particles } from '@/components/Particles';
import { BackToTop } from '@/components/BackToTop';

const Home = lazy(() => import('@/pages/Home'));
const Hostels = lazy(() => import('@/pages/Hostels'));
const Itineraries = lazy(() => import('@/pages/Itineraries'));
const Budget = lazy(() => import('@/pages/Budget'));
const Community = lazy(() => import('@/pages/Community'));
const MapPage = lazy(() => import('@/pages/MapPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center pt-28" role="status" aria-label="Loading page">
      <div className="w-full max-w-3xl space-y-4 px-6">
        <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-primary-lighter/40" />
        <div className="mx-auto h-12 w-3/4 animate-pulse rounded-2xl bg-primary-lighter/30" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-card bg-primary-lighter/25" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 12, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.998 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10"
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/hostels" element={<Hostels />} />
            <Route path="/itineraries" element={<Itineraries />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/community" element={<Community />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <TripProvider>
        <CityProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="relative min-h-screen overflow-x-hidden">
              <Particles />
              <Navbar />
              <AnimatedRoutes />
              <Footer />
              <BackToTop />
            </div>
          </BrowserRouter>
        </CityProvider>
      </TripProvider>
    </ToastProvider>
  );
}
