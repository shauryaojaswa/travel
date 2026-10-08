import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type CityId = 'delhi' | 'jaipur';

interface CityContextValue {
  city: CityId;
  setCity: (city: CityId) => void;
}

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<CityId>('delhi');
  const value = useMemo(() => ({ city, setCity }), [city]);
  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error('useCity must be used within CityProvider');
  return ctx;
}
