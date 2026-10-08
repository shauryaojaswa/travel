import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { useCity } from '@/context/CityContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useToast } from '@/context/ToastContext';
import { useTrip } from '@/context/TripContext';
import { cities } from '@/data/cities';
import {
  allPoints,
  categoryMeta,
  mapRoutes,
  type MapPoint,
  type PointCategory,
} from '@/data/mapPoints';
import { cn, formatINR } from '@/lib/utils';

function makeIcon(point: MapPoint): L.DivIcon {
  const meta = categoryMeta[point.category];
  return L.divIcon({
    className: '',
    html: `<div class="calm-marker" style="background:${meta.markerBg}" role="img" aria-label="${point.name}">${point.emoji}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
  });
}

/** Recenters the map when the city changes (with a gentle fly). */
function CityFlyer({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [map, center, zoom]);
  return null;
}

const legendOrder: PointCategory[] = ['hostel', 'food', 'stop', 'transit', 'active', 'cowork'];

const defaultLayers: Record<PointCategory, boolean> = {
  hostel: true,
  food: true,
  stop: true,
  transit: true,
  active: false,
  cowork: false,
};

const MODES = [
  { id: 'walk', emoji: '🚶', label: 'Walk', kmh: 4.5 },
  { id: 'metro', emoji: '🚇', label: 'Metro', kmh: 32 },
  { id: 'auto', emoji: '🚗', label: 'Auto', kmh: 22 },
] as const;

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const aa = s1 * s1 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * s2 * s2;
  return 2 * R * Math.asin(Math.sqrt(aa));
}

export default function MapPage() {
  const { city } = useCity();
  const cityMeta = cities[city];
  const cityName = cityMeta.name;
  usePageMeta(
    `${cityName} Discovery Map`,
    `Interactive ${cityName} map: hostels, food, itinerary routes, active-travel and coworking pins.`,
  );
  const { toast } = useToast();
  const { addItem } = useTrip();

  const [layers, setLayers] = useState(defaultLayers);
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [mode, setMode] = useState<(typeof MODES)[number]['id']>('walk');
  const [plan, setPlan] = useState<null | { from: MapPoint; to: MapPoint; km: number; mins: number }>(null);

  const cityPoints = useMemo(() => allPoints.filter((p) => p.cityId === city), [city]);
  const cityRoutes = useMemo(() => mapRoutes.filter((r) => r.cityId === city), [city]);
  const markers = useMemo(
    () =>
      cityPoints
        .filter((p) => layers[p.category])
        .map((p) => ({ point: p, icon: makeIcon(p) })),
    [cityPoints, layers],
  );

  useEffect(() => {
    setPlan(null);
    setStartId('');
    setEndId('');
  }, [city]);

  const toggleLayer = (cat: PointCategory) =>
    setLayers((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const goPlan = () => {
    const from = cityPoints.find((p) => p.id === startId);
    const to = cityPoints.find((p) => p.id === endId);
    if (!from || !to) {
      toast('Pick a start and an end pin first');
      return;
    }
    const m = MODES.find((x) => x.id === mode) ?? MODES[0];
    const km = haversineKm([from.lat, from.lng], [to.lat, to.lng]);
    const mins = Math.max(2, Math.round((km / m.kmh) * 60));
    setPlan({ from, to, km, mins });
  };

  const counts = useMemo(() => {
    const c: Record<PointCategory, number> = {
      hostel: 0,
      food: 0,
      stop: 0,
      transit: 0,
      active: 0,
      cowork: 0,
    };
    cityPoints.forEach((p) => {
      c[p.category] += 1;
    });
    return c;
  }, [cityPoints]);
  // __MAPBODY__
  return (
    <section className="px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Discover"
          title={`${cityName} Discovery Map`}
          subtitle="Every hostel, food stop, and itinerary route in one calm view. Tap a pin for exact details."
        />

        {/* Plan-a-route tool */}
        <div className="glass mt-12 rounded-card p-6 shadow-calm sm:p-7">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-ink-medium">
            🧭 Plan a route
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto_auto]">
            <div>
              <label htmlFor="route-start" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-light">
                Start
              </label>
              <select id="route-start" className="calm-input" value={startId} onChange={(e) => setStartId(e.target.value)}>
                <option value="">Choose a pin…</option>
                {cityPoints.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="route-end" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-light">
                End
              </label>
              <select id="route-end" className="calm-input" value={endId} onChange={(e) => setEndId(e.target.value)}>
                <option value="">Choose a pin…</option>
                {cityPoints.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-light" id="mode-label">
                Mode
              </p>
              <div className="flex gap-1.5" role="group" aria-labelledby="mode-label">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    aria-pressed={mode === m.id}
                    title={m.label}
                    className={
                      'flex h-[42px] w-[46px] items-center justify-center rounded-input border text-lg transition ' +
                      (mode === m.id
                        ? 'border-primary bg-primary text-white shadow-calm'
                        : 'border-gray-200 bg-white hover:border-primary-lighter hover:bg-primary-bg')
                    }
                  >
                    <span aria-hidden="true">{m.emoji}</span>
                    <span className="sr-only">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={goPlan} className="w-full md:w-auto">
                Go
              </Button>
            </div>
          </div>
          {plan ? (
            <p className="mt-4 rounded-input bg-primary-bg px-4 py-3 text-sm font-semibold text-primary" role="status">
              {plan.from.emoji} {plan.from.name} → {plan.to.emoji} {plan.to.name}: ~{plan.km.toFixed(1)} km, ~{plan.mins} min{' '}
              {MODES.find((m) => m.id === mode)?.label.toLowerCase()}. Straight-line estimates — full route optimization coming in Phase 2.
            </p>
          ) : (
            <p className="mt-4 text-xs font-light text-ink-light">
              For now, we show straight-line estimates. Full route optimization coming in Phase 2.
            </p>
          )}
        </div>
        {/* __MAPWRAP__ */}
        <div className="relative mt-8 overflow-hidden rounded-card border border-gray-100 bg-white shadow-calm">
          {/* Layer toggle panel */}
          <div className="glass absolute left-4 top-4 z-[500] w-56 rounded-2xl bg-white p-4 shadow-calm-md">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-light">
              Layers
            </p>
            <ul className="space-y-1.5">
              {legendOrder.map((cat) => (
                <li key={cat}>
                  <label className="flex min-h-[36px] cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-dark">
                    <input
                      type="checkbox"
                      checked={layers[cat]}
                      onChange={() => toggleLayer(cat)}
                      className="h-[18px] w-[18px] accent-[#2D6A4F]"
                      aria-label={`Show ${categoryMeta[cat].label}`}
                    />
                    <span className={'h-2.5 w-2.5 shrink-0 rounded-full ' + categoryMeta[cat].dot} aria-hidden="true" />
                    <span className="flex-1">{categoryMeta[cat].label}</span>
                    <span className="text-[11px] font-bold text-ink-light">{counts[cat]}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <MapContainer
            center={cityMeta.mapCenter}
            zoom={cityMeta.zoom}
            className="h-[400px] w-full sm:h-[550px]"
            scrollWheelZoom
            aria-label={`Interactive map of ${cityName} discovery points`}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />
            <CityFlyer center={cityMeta.mapCenter} zoom={cityMeta.zoom} />

            {cityRoutes.map((route) => (
              <Polyline
                key={route.id}
                positions={route.points}
                pathOptions={{ color: route.color, weight: 3, dashArray: '2 12', lineCap: 'round', opacity: 0.85 }}
              >
                <Popup>
                  <div className="popup-title">{route.name}</div>
                  <div className="popup-meta">{route.label}</div>
                </Popup>
              </Polyline>
            ))}

            {markers.map(({ point, icon }) => (
              <Marker key={point.id} position={[point.lat, point.lng]} icon={icon}>
                <Popup>
                  <div className="popup-title">
                    <span aria-hidden="true">{point.emoji}</span> {point.name}
                  </div>
                  <span className="popup-meta">{categoryMeta[point.category].label}</span>
                  <div className="popup-meta">{point.description}</div>
                  <span className="popup-price">{point.price}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const ok = addItem({ id: point.id, kind: point.category === 'hostel' ? 'hostel' : 'itinerary', title: point.name });
                      toast(ok ? `${point.name} added to your trip` : 'Already in your trip');
                    }}
                    className="mt-2 block rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white"
                  >
                    + Add to Trip
                  </button>
                </Popup>
              </Marker>
            ))}

            {plan && (
              <Polyline
                positions={[
                  [plan.from.lat, plan.from.lng],
                  [plan.to.lat, plan.to.lng],
                ]}
                pathOptions={{ color: '#2D6A4F', weight: 4, dashArray: '6 10', lineCap: 'round' }}
              >
                <Popup>
                  <div className="popup-title">
                    {plan.from.name} → {plan.to.name}
                  </div>
                  <div className="popup-meta">
                    ~{plan.km.toFixed(1)} km · ~{plan.mins} min
                  </div>
                </Popup>
              </Polyline>
            )}
          </MapContainer>
        </div>
        {/* __LEGEND2__ */}
        <div className="mt-6 flex flex-col gap-5 rounded-card border border-gray-100 bg-white p-6 shadow-calm sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5" aria-label="Map legend">
            {legendOrder.map((cat) => (
              <span key={cat} className="flex items-center gap-2 text-xs font-semibold text-ink-medium">
                <span className={'h-3 w-3 shrink-0 rounded-full ' + categoryMeta[cat].dot} aria-hidden="true" />
                {categoryMeta[cat].label}
                <span className="text-ink-light">({counts[cat]})</span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5" aria-label="Route legend">
            {cityRoutes.map((route) => (
              <span key={route.id} className="flex items-center gap-2 text-xs font-semibold text-ink-medium">
                <svg width="26" height="10" aria-hidden="true">
                  <line x1="1" y1="5" x2="25" y2="5" stroke={route.color} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" />
                </svg>
                {route.name}
                <span className="font-normal text-ink-light">{route.label}</span>
              </span>
            ))}
          </div>

          <p className={cn('shrink-0 rounded-full bg-primary-bg px-4 py-2 text-xs font-semibold text-primary')}>
            {counts.hostel} hostels · {cityPoints.length} pins · {cityRoutes.length} routes
          </p>
        </div>
      </div>
    </section>
  );
}
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Discover"
          title="Delhi Discovery Map"
          subtitle="Every hostel, food stop, and itinerary route in one calm view. Tap a pin for exact details."
        />

        <div className="mt-12 overflow-hidden rounded-card border border-gray-100 bg-white shadow-calm">
          <MapContainer
            center={DELHI_CENTER}
            zoom={12}
            className="h-[60vh] min-h-[420px] w-full lg:h-[70vh]"
            scrollWheelZoom
            aria-label="Interactive map of Delhi discovery points"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />

            {/* Dashed, color-coded itinerary routes */}
            {mapRoutes.map((route) => (
              <Polyline
                key={route.id}
                positions={route.points}
                pathOptions={{
                  color: route.color,
                  weight: 3,
                  dashArray: '2 12',
                  lineCap: 'round',
                  opacity: 0.85,
                }}
              >
                <Popup>
                  <div className="popup-title">{route.name}</div>
                  <div className="popup-meta">Dashed walking / transit route</div>
                </Popup>
              </Polyline>
            ))}
            {/* Emoji circle markers with styled popups */}
            {markers.map(({ point, icon }) => (
              <Marker key={point.id} position={[point.lat, point.lng]} icon={icon}>
                <Popup>
                  <div className="popup-title">
                    <span aria-hidden="true">{point.emoji}</span> {point.name}
                  </div>
                  <div className="popup-meta">{point.description}</div>
                  <span className="popup-price">{point.price}</span>
                </Popup>
              </Marker>
            ))}

          </MapContainer>
        </div>
        {/* ============ LEGEND ============ */}
        <div className="mt-6 flex flex-col gap-5 rounded-card border border-gray-100 bg-white p-6 shadow-calm sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Map legend">
            {legendOrder.map((cat) => (
              <span key={cat} className="flex items-center gap-2.5 text-sm font-medium text-ink-medium">
                <span
                  className={'h-3 w-3 shrink-0 rounded-full ' + categoryMeta[cat].dot}
                  aria-hidden="true"
                />
                {categoryMeta[cat].label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Route legend">
            {mapRoutes.map((route) => (
              <span
                key={route.id}
                className="flex items-center gap-2.5 text-sm font-medium text-ink-medium"
              >
                <svg width="26" height="10" aria-hidden="true">
                  <line
                    x1="1"
                    y1="5"
                    x2="25"
                    y2="5"
                    stroke={route.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="2 7"
                  />
                </svg>
                {route.name}
              </span>
            ))}
          </div>

          <p className="shrink-0 rounded-full bg-primary-bg px-4 py-2 text-xs font-semibold text-primary">
            5 hostels · 15 pins · 3 routes
          </p>
        </div>

      </div>
    </section>
  );
}
