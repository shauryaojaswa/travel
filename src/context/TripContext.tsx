import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface TripItem {
  id: string;
  kind: 'hostel' | 'itinerary';
  title: string;
}

interface TripContextValue {
  items: TripItem[];
  addItem: (item: TripItem) => boolean;
  removeItem: (id: string) => void;
  isInTrip: (id: string) => boolean;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TripItem[]>([]);

  const addItem = useCallback(
    (item: TripItem) => {
      if (items.some((i) => i.id === item.id)) return false;
      setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
      return true;
    },
    [items],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInTrip = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, isInTrip }),
    [items, addItem, removeItem, isInTrip],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
}
