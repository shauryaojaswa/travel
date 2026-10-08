import type { CityId } from '@/context/CityContext';

export type ExperienceCategory = 'Culture' | 'Food' | 'Wellness' | 'Adventure' | 'Nightlife';

export interface Experience {
  id: string;
  title: string;
  emoji: string;
  cityId: CityId;
  price: number;
  duration: string;
  rating: number;
  badge?: string;
  category: ExperienceCategory;
  description: string;
}

export const experiences: Experience[] = [
  {
    id: 'food-photo-walk',
    title: 'Street Food Photography Walk in Old Delhi',
    emoji: '📸',
    cityId: 'delhi',
    price: 800,
    duration: '3 hrs',
    rating: 4.8,
    badge: 'New',
    category: 'Food',
    description:
      'Shoot sizzling tandoors and neon-lit galis with a pro photographer while tasting 6 street classics along the way.',
  },
  {
    id: 'pottery-workshop',
    title: 'Pottery Workshop in Hauz Khas Art Village',
    emoji: '🏺',
    cityId: 'delhi',
    price: 1200,
    duration: '2 hrs',
    rating: 4.6,
    category: 'Culture',
    description:
      'Throw, shape, and glaze your own clay diya or mug with a master potter — fired and shipped to your hostel in 48 hours.',
  },
  {
    id: 'yoga-lodhi',
    title: 'Yoga & Meditation Session at Lodhi Gardens',
    emoji: '🧘',
    cityId: 'delhi',
    price: 300,
    duration: '1.5 hrs',
    rating: 4.7,
    badge: 'Wellness',
    category: 'Wellness',
    description:
      'Sunrise vinyasa among 500-year-old tombs, ending with guided meditation by the duck pond. Mats included.',
  },
  {
    id: 'heritage-cycling',
    title: 'Delhi Heritage Cycling Tour',
    emoji: '🚲',
    cityId: 'delhi',
    price: 600,
    duration: '4 hrs',
    rating: 4.5,
    category: 'Adventure',
    description:
      'Pedal 12 car-free kilometers past the Red Fort, Raj Ghat, and spice-scented lanes, with chai stops every 45 minutes.',
  },
  {
    id: 'block-printing',
    title: 'Block Printing Textile Workshop',
    emoji: '🧵',
    cityId: 'delhi',
    price: 900,
    duration: '2.5 hrs',
    rating: 4.4,
    badge: 'Hands-On',
    category: 'Culture',
    description:
      'Carve your own motif and hand-print a cotton tote or scarf with natural dyes, guided by Sanganer artisans.',
  },
  {
    id: 'rooftop-dj',
    title: 'Rooftop Sunset DJ Session in Hauz Khas',
    emoji: '🎧',
    cityId: 'delhi',
    price: 500,
    duration: '3 hrs',
    rating: 4.3,
    badge: 'Nightlife',
    category: 'Nightlife',
    description:
      'Golden-hour deep house over the lake ruins with mocktails, fairy lights, and Delhi’s friendliest dance floor.',
  },
  {
    id: 'jaipur-blue-pottery',
    title: 'Blue Pottery Workshop in Sanganer',
    emoji: '🏺',
    cityId: 'jaipur',
    price: 1100,
    duration: '2.5 hrs',
    rating: 4.7,
    badge: 'Hands-On',
    category: 'Culture',
    description:
      'Paint the famous turquoise-blue Jaipur pottery with master craftsmen, and take your tile home the same day.',
  },
  {
    id: 'jaipur-food-crawl-hosted',
    title: 'Johari Bazaar Breakfast Crawl',
    emoji: '🥘',
    cityId: 'jaipur',
    price: 600,
    duration: '3 hrs',
    rating: 4.6,
    category: 'Food',
    description:
      'Kachori-sabzi, mirchi vada, and saffron lassi across the old city’s legendary breakfast counters before the crowds.',
  },
];
