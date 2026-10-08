import type { CityId } from '@/context/CityContext';

export interface BudgetLine {
  label: string;
  price: number;
}

export type ItineraryTag = 'Food' | 'Nature' | 'Culture' | 'Nightlife' | 'Digital Nomad';

export type ItineraryTheme =
  | 'Sight-Doing'
  | 'Lore Chasing'
  | 'Active Travel'
  | 'Miles on Milestones'
  | 'Digital Nomad';

export interface ItineraryStop {
  time: string;
  title: string;
  detail: string;
  cost: number;
  duration: string;
  transit: string;
}

export interface Itinerary {
  id: string;
  title: string;
  emoji: string;
  cityId: CityId;
  badge?: string;
  durationHours: number;
  durationLabel: string;
  budget: number;
  typeLabel: string;
  tags: ItineraryTag[];
  themes: ItineraryTheme[];
  transport: string;
  breakdown: BudgetLine[];
  adventure: number;
  /** accent colors for the card */
  accent: string;
  accentSoft: string;
  stops: ItineraryStop[];
}

export const itineraries: Itinerary[] = [
  {
    id: 'lodi-garden-art-crawl',
    title: 'The Lodi Garden Art Crawl',
    emoji: '🖼️',
    cityId: 'delhi',
    durationHours: 4,
    durationLabel: '4 Hours',
    budget: 500,
    typeLabel: 'Nature + Culture',
    tags: ['Nature', 'Culture'],
    themes: ['Sight-Doing', 'Active Travel'],
    transport: 'Metro + Walking',
    breakdown: [
      { label: 'Lodi Gardens', price: 0 },
      { label: 'Art Gallery', price: 150 },
      { label: 'Tea at Khan Market', price: 200 },
      { label: 'Metro & Transport', price: 150 },
    ],
    adventure: 70,
    accent: 'text-primary',
    accentSoft: 'bg-primary-bg',
    stops: [
      { time: '10:00 AM', title: 'Arrive at Lodi Gardens', detail: 'Enter from the Jor Bagh gate and loop the 6th-century tombs, duck pond, and bonsai park.', cost: 0, duration: '90 min', transit: 'Jor Bagh metro → 10 min walk to Gate 1' },
      { time: '11:30 AM', title: 'Art gallery hour', detail: 'Pop into the nearby NGMA annexe or a Khan Market gallery show — one ticket, all floors.', cost: 150, duration: '60 min', transit: 'Auto to gallery (₹60) or 15 min walk' },
      { time: '12:40 PM', title: 'Tea at Khan Market', detail: 'Masala chai + people-watching at a second-floor book café overlooking the market.', cost: 200, duration: '45 min', transit: 'Khan Market metro, Exit 3' },
      { time: '1:30 PM', title: 'Head home', detail: 'Metro back with a camera roll full of tombs. Total transport for the day included.', cost: 150, duration: '30 min', transit: 'Violet line → change at Central Secretariat' },
    ],
  },
  {
    id: 'old-delhi-food-trek',
    title: 'Old Delhi Street Food Trek',
    emoji: '🍛',
    cityId: 'delhi',
    durationHours: 3,
    durationLabel: '3 Hours',
    budget: 500,
    typeLabel: 'Food + Culture',
    tags: ['Food', 'Culture'],
    themes: ['Sight-Doing', 'Lore Chasing'],
    transport: 'Walking + Rickshaw',
    breakdown: [
      { label: 'Chandni Chowk Exploration', price: 0 },
      { label: 'Paranthe Wali Gali (Lunch)', price: 150 },
      { label: 'Jama Masjid (Free Entry)', price: 0 },
      { label: 'Street Snacks (Golgappa, Jalebi)', price: 100 },
      { label: 'Cycle Rickshaw Rides', price: 250 },
    ],
    adventure: 85,
    accent: 'text-accent',
    accentSoft: 'bg-accent-light',
    stops: [
      { time: '5:00 PM', title: 'Chandni Chowk by foot', detail: 'Start at the Fatehpuri end and drift east through spice, sari, and silver lanes. Keep cameras ready.', cost: 0, duration: '40 min', transit: 'Chandni Chowk metro, Exit 5' },
      { time: '5:45 PM', title: 'Paranthe Wali Gali lunch', detail: 'Aaloo-pyaaz parantha trio with lassi at the 150-year-old legend. Sit upstairs for a breather.', cost: 150, duration: '40 min', transit: '5 min walk from the main road' },
      { time: '6:30 PM', title: 'Jama Masjid at dusk', detail: 'Climb the minaret edge for the sunset view over spires and kites. Entry free, camera ₹300 optional.', cost: 0, duration: '45 min', transit: 'Cycle rickshaw (₹80)' },
      { time: '7:15 PM', title: 'Snacks + rickshaw glide', detail: 'Golgappa, jalebi, then a full rickshaw loop back through Ballimaran with the evening breeze.', cost: 350, duration: '45 min', transit: 'Rickshaw to Chandni Chowk metro' },
    ],
  },
  {
    id: 'hauz-khas-nomad-day',
    title: 'Hauz Khas Digital Nomad Day',
    emoji: '💻',
    cityId: 'delhi',
    durationHours: 6,
    durationLabel: '6 Hours',
    budget: 800,
    typeLabel: 'Digital Nomad + Nature',
    tags: ['Digital Nomad', 'Nature'],
    themes: ['Digital Nomad', 'Active Travel'],
    transport: 'Metro + Auto',
    breakdown: [
      { label: 'Cafe Turtle (Coffee + WiFi)', price: 250 },
      { label: 'Deer Park Walk', price: 0 },
      { label: 'Lunch at Social / Elma’s Bakery', price: 350 },
      { label: 'Sunset at Hauz Khas Lake', price: 0 },
      { label: 'Metro & Auto', price: 200 },
    ],
    adventure: 55,
    accent: 'text-indigo-600',
    accentSoft: 'bg-indigo-50',
    stops: [
      { time: '9:30 AM', title: 'Coffee + deep work', detail: 'Corner table at Cafe Turtle — outlets under the window, WiFi 70 Mbps, bottomless filter coffee.', cost: 250, duration: '3 hrs', transit: 'Hauz Khas metro, Gate 2 → 8 min walk' },
      { time: '12:30 PM', title: 'Deer Park reset', detail: 'A screen-free forest loop. Spot deer, watch cormorants, stretch on the lawns.', cost: 0, duration: '60 min', transit: '10 min walk from the cafe' },
      { time: '1:45 PM', title: 'Lunch at Social', detail: 'Butter chicken bao or Elma’s red velvet — your call. Both have working-day lunch crowds.', cost: 350, duration: '60 min', transit: 'Inside Hauz Khas Village' },
      { time: '3:00 PM', title: 'Lake sunset wind-down', detail: 'Finish emails on the monument steps, then watch the sun drop behind the madrasa ruins.', cost: 0, duration: '90 min', transit: '5 min walk to the lake' },
      { time: '4:30 PM', title: 'Auto + metro home', detail: 'Shared auto to the metro, then home with a full workday and a full heart.', cost: 200, duration: '30 min', transit: 'Auto ₹120 + metro ₹40' },
    ],
  },
  {
    id: 'ridge-forest-rain-walk',
    title: 'The Monsoon Rain Walk: Ridge Forest Trail',
    emoji: '🌧️',
    cityId: 'delhi',
    badge: 'Seasonal',
    durationHours: 2,
    durationLabel: '2 Hours',
    budget: 200,
    typeLabel: 'Nature',
    tags: ['Nature'],
    themes: ['Active Travel', 'Lore Chasing'],
    transport: 'Walking + Rickshaw',
    breakdown: [
      { label: 'Ridge Forest Entry', price: 0 },
      { label: 'Chai at Malcha Marg', price: 80 },
      { label: 'Rickshaw to CP', price: 120 },
    ],
    adventure: 40,
    accent: 'text-primary',
    accentSoft: 'bg-primary-bg',
    stops: [
      { time: '4:00 PM', title: 'Enter the Ridge', detail: 'Walk the forest trail behind Buddha Jayanti Park as clouds gather. Zero tourists, all birdsong.', cost: 0, duration: '60 min', transit: 'Shankar Road bus stop → forest gate' },
      { time: '5:00 PM', title: 'Chai at Malcha Marg', detail: 'Shelter from the drizzle with cutting chai and bun-maska at the market corner.', cost: 80, duration: '30 min', transit: 'Rickshaw from trail exit (₹60)' },
      { time: '5:30 PM', title: 'Rickshaw glide to CP', detail: 'Rain-flecked ride down to Connaught Place as streets steam. Pure monsoon magic.', cost: 120, duration: '25 min', transit: 'E-rickshaw to Rajiv Chowk metro' },
    ],
  },
  {
    id: 'haveli-mosque-crawl',
    title: 'Old Delhi Haveli & Hidden Mosque Crawl',
    emoji: '🕌',
    cityId: 'delhi',
    badge: 'Off-Beat',
    durationHours: 5,
    durationLabel: '5 Hours',
    budget: 600,
    typeLabel: 'Culture + Heritage',
    tags: ['Culture', 'Food'],
    themes: ['Lore Chasing', 'Sight-Doing'],
    transport: 'Walking + Rickshaw',
    breakdown: [
      { label: 'Jama Masjid', price: 0 },
      { label: 'Naughara Gali Havelis', price: 0 },
      { label: "Karim's Lunch", price: 250 },
      { label: 'Ballimaran Market', price: 100 },
      { label: 'Rickshaw', price: 250 },
    ],
    adventure: 75,
    accent: 'text-primary',
    accentSoft: 'bg-primary-bg',
    stops: [
      { time: '10:30 AM', title: 'Jama Masjid courtyard', detail: 'Enter the great courtyard before the crowds. Admire the old-city panorama from the dome edge.', cost: 0, duration: '60 min', transit: 'Jama Masjid metro, Exit 1' },
      { time: '11:30 AM', title: 'Naughara Gali havelis', detail: 'Nine Jain havelis with carved facades and a 200-year-old temple at the lane’s end.', cost: 0, duration: '60 min', transit: '15 min walk via Kinari Bazaar' },
      { time: '12:45 PM', title: "Karim's lunch", detail: 'Mutton korma + rumali roti at the 1913 original. Veg friends: dal makhani + tandoori rotis.', cost: 250, duration: '60 min', transit: 'Rickshaw to Gali Kababian (₹50)' },
      { time: '2:00 PM', title: 'Ballimaran + ride home', detail: 'Browse ittar bottles and Ghalib’s haveli, then a rickshaw wind-down through the galis.', cost: 350, duration: '90 min', transit: 'Rickshaw to Chandni Chowk metro' },
    ],
  },
  {
    id: 'sundown-party-route',
    title: 'Sundown Party Route: Hauz Khas → Cyber Hub',
    emoji: '🪩',
    cityId: 'delhi',
    badge: 'Party',
    durationHours: 5,
    durationLabel: '5 Hours',
    budget: 2000,
    typeLabel: 'Nightlife + Social',
    tags: ['Nightlife', 'Food'],
    themes: ['Lore Chasing', 'Miles on Milestones'],
    transport: 'Auto + Cab',
    breakdown: [
      { label: 'Pre-drinks at Raasta HK', price: 500 },
      { label: 'Dinner at Social', price: 700 },
      { label: 'Cyber Hub Bar', price: 600 },
      { label: 'Cab', price: 200 },
    ],
    adventure: 90,
    accent: 'text-indigo-600',
    accentSoft: 'bg-indigo-50',
    stops: [
      { time: '7:00 PM', title: 'Pre-drinks at Raasta', detail: 'Caribbean beats, fairy lights, and a happy-hour pitcher with the crew on the terrace.', cost: 500, duration: '90 min', transit: 'Hauz Khas Village entry gate' },
      { time: '8:45 PM', title: 'Dinner at Social', detail: 'Butter chicken biryani + filter coffee old fashioned. Fuel up — the night is young.', cost: 700, duration: '75 min', transit: '3 min walk within the Village' },
      { time: '10:00 PM', title: 'Cyber Hub bar hop', detail: 'Cab to Gurgaon’s neon strip. One rooftop bar, one dance floor, zero regrets.', cost: 600, duration: '2 hrs', transit: 'Cab split 3 ways (₹200 each)' },
      { time: '12:15 AM', title: 'Cab home', detail: 'Night-rate cab back with the windows down. Sunday is for sleeping in.', cost: 200, duration: '30 min', transit: 'Pre-booked cab, share live location' },
    ],
  },
  // __JAIPUR_ITINS__
  {
    id: 'pink-city-heritage-walk',
    title: 'The Pink City Heritage Walk',
    emoji: '🏰',
    cityId: 'jaipur',
    durationHours: 4,
    durationLabel: '4 Hours',
    budget: 600,
    typeLabel: 'Culture + Heritage',
    tags: ['Culture', 'Food'],
    themes: ['Lore Chasing', 'Sight-Doing'],
    transport: 'Walking + Auto',
    breakdown: [
      { label: 'Hawa Mahal (Entry)', price: 200 },
      { label: 'City Palace (Entry)', price: 300 },
      { label: 'Jantar Mantar + Lassi', price: 100 },
    ],
    adventure: 65,
    accent: 'text-primary',
    accentSoft: 'bg-primary-bg',
    stops: [
      { time: '9:00 AM', title: 'Hawa Mahal at sunrise', detail: 'Beat the crowds to the 953-window facade. Photograph from the rooftop cafe across the street.', cost: 200, duration: '60 min', transit: 'Auto to Badi Chaupar (₹60)' },
      { time: '10:15 AM', title: 'City Palace courtyards', detail: 'Peacock doors, armory halls, and the royal textile gallery. Audio guide worth every rupee.', cost: 300, duration: '2 hrs', transit: '10 min walk from Hawa Mahal' },
      { time: '12:30 PM', title: 'Jantar Mantar + lassi', detail: 'Giant sundials that still tell time to the minute, then saffron lassi at the corner shop.', cost: 100, duration: '45 min', transit: '5 min walk + lassi ₹50' },
    ],
  },
  {
    id: 'nahargarh-sunset-trek',
    title: 'Nahargarh Fort Sunset Trek',
    emoji: '🌄',
    cityId: 'jaipur',
    durationHours: 3,
    durationLabel: '3 Hours',
    budget: 400,
    typeLabel: 'Nature + Adventure',
    tags: ['Nature', 'Culture'],
    themes: ['Active Travel', 'Lore Chasing'],
    transport: 'Walking + Auto',
    breakdown: [
      { label: 'Fort Trail Entry', price: 100 },
      { label: 'Sunset Café Chai', price: 150 },
      { label: 'Auto Back', price: 150 },
    ],
    adventure: 80,
    accent: 'text-accent',
    accentSoft: 'bg-accent-light',
    stops: [
      { time: '4:00 PM', title: 'Start the fort trail', detail: 'Climb the old pilgrim path through scrub forest as peacocks call. Carry 1L water.', cost: 100, duration: '75 min', transit: 'Auto to trailhead (₹120)' },
      { time: '5:30 PM', title: 'Ramparts at golden hour', detail: 'Watch Jaipur blush pink from the palace terraces. Samosas taste better at 300m.', cost: 150, duration: '60 min', transit: 'Fort café steps' },
      { time: '6:45 PM', title: 'Ride back down', detail: 'Auto back as the city lights flicker on. Ask the driver for the lit-fort viewpoint stop.', cost: 150, duration: '30 min', transit: 'Shared auto to Bani Park' },
    ],
  },
  {
    id: 'johari-bazaar-crawl',
    title: 'Johari Bazaar Shopping Crawl',
    emoji: '💎',
    cityId: 'jaipur',
    durationHours: 3,
    durationLabel: '3 Hours',
    budget: 1500,
    typeLabel: 'Culture + Shopping',
    tags: ['Culture', 'Food'],
    themes: ['Sight-Doing', 'Miles on Milestones'],
    transport: 'Walking + Auto',
    breakdown: [
      { label: 'Jewelry Hunting', price: 800 },
      { label: 'Textiles (Block Print)', price: 500 },
      { label: 'Spices + Snacks', price: 200 },
    ],
    adventure: 60,
    accent: 'text-indigo-600',
    accentSoft: 'bg-indigo-50',
    stops: [
      { time: '11:00 AM', title: 'Jewelry lanes', detail: 'Haggle gently for silver jhumkas and kundan chokers. Fixed-price government shops if bargaining scares you.', cost: 800, duration: '75 min', transit: 'Auto to Johari Gate (₹80)' },
      { time: '12:30 PM', title: 'Textile alleys', detail: 'Sanganer block-print bedsheets and bandhani dupattas. Feel the fabric, check the weave.', cost: 500, duration: '60 min', transit: 'Inside the bazaar lanes' },
      { time: '1:30 PM', title: 'Spices + kachori break', detail: 'Stock up on kachori masala and ker-sangri, then rawat kachori + lassi to finish strong.', cost: 200, duration: '45 min', transit: 'Walk to LMB corner' },
    ],
  },
];

export const itineraryTypes: ItineraryTag[] = [
  'Food',
  'Nature',
  'Culture',
  'Nightlife',
  'Digital Nomad',
];
