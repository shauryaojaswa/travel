# Delhi Calm Travel 🌿

A next-generation "Calm Technology" travel super-app prototype for Delhi, India (with Jaipur next).
React 18 + TypeScript + Vite, Tailwind CSS, Framer Motion, React Router v6, React-Leaflet, Lucide.

## Run it

```powershell
npm.cmd install        # install dependencies
npm.cmd run dev        # dev server → http://localhost:5173
npm.cmd run build      # typecheck + production build
npm.cmd run preview    # serve the production build
```

## Pages

| Route | Page |
|---|---|
| `/` | Landing: hero, animated stats, glass "why" cards, previews, CTA |
| `/hostels` | 5 curated hostels, dual-thumb price range, location/rating/amenity filters, sorting |
| `/itineraries` | 3 hidden itineraries with exact per-item budget tables, duration/budget/type filters |
| `/budget` | Deterministic budget engine — budget/nights/style sliders, animated cost breakdown, within/over status + data-sources note |
| `/map` | Lazy-loaded Leaflet map (CARTO Positron), 15 emoji pins, 3 dashed routes, legend |

## Design system

- Palette: `#2D6A4F` / `#52B788` / `#95D5B2` / `#F0FAF4`, accent `#D4A373` / `#FEFAE0`
- Fonts: Inter (body) + DM Serif Display (headings) via Google Fonts
- Glassmorphism cards, 24px card radius, pill buttons, calm green shadows
- Floating particles, scroll-reveal + count-up animations, toast notifications

## Structure

```
src/
  components/   Navbar, Footer, Particles, Reveal, cards, ui/ (shadcn-style)
  context/      ToastContext, TripContext ("My Trip" state)
  data/         hostels, itineraries, mapPoints (single source of truth)
  hooks/        useCountUp (IntersectionObserver + ease-out)
  pages/        Home, Hostels, Itineraries, Budget, MapPage (lazy)
  lib/utils.ts  cn() + formatINR()
```
