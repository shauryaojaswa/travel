import type { CityId } from '@/context/CityContext';

export interface StyleRates {
  hostel: number;
  food: number;
  transport: number;
  activities: number;
}

export interface CityMeta {
  id: CityId;
  name: string;
  tagline: string;
  mapCenter: [number, number];
  zoom: number;
  live: boolean;
  rates: {
    budget: StyleRates;
    balanced: StyleRates;
    comfortable: StyleRates;
  };
}

export const cities: Record<CityId, CityMeta> = {
  delhi: {
    id: 'delhi',
    name: 'Delhi',
    tagline: 'The calm capital',
    mapCenter: [28.6139, 77.209],
    zoom: 12,
    live: true,
    rates: {
      budget: { hostel: 399, food: 500, transport: 300, activities: 400 },
      balanced: { hostel: 599, food: 750, transport: 400, activities: 600 },
      comfortable: { hostel: 999, food: 1200, transport: 600, activities: 1000 },
    },
  },
  jaipur: {
    id: 'jaipur',
    name: 'Jaipur',
    tagline: 'The Pink City — beta',
    mapCenter: [26.9124, 75.7873],
    zoom: 12,
    live: false,
    rates: {
      budget: { hostel: 349, food: 400, transport: 250, activities: 300 },
      balanced: { hostel: 549, food: 650, transport: 350, activities: 500 },
      comfortable: { hostel: 899, food: 1100, transport: 500, activities: 800 },
    },
  },
};

export const cityList: CityMeta[] = [cities.delhi, cities.jaipur];
