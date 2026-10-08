export interface CommunityPost {
  id: string;
  user: string;
  initials: string;
  avatarColor: string;
  verified: boolean;
  caption: string;
  location: string;
  likes: number;
  comments: number;
  hostel?: string;
  gradient: string;
  emoji: string;
}

export interface LocalGuide {
  id: string;
  name: string;
  initials: string;
  color: string;
  tagline: string;
  specialty: string;
  rating: number;
  reviews: number;
  price: string;
  bio: string;
}

export interface Meetup {
  id: string;
  title: string;
  emoji: string;
  when: string;
  price: string;
  attendees: number;
  detail: string;
}

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  status: 'unlocked' | 'progress' | 'locked';
  note: string;
}

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-chai',
    user: '@riya_travels',
    initials: 'RT',
    avatarColor: 'bg-emerald-500',
    verified: true,
    caption:
      "Found this hidden chai stall behind Lodhi Gardens 😍 The owner's been here 30 years! #HiddenDelhi",
    location: 'Lodhi Gardens',
    likes: 234,
    comments: 18,
    gradient: 'from-emerald-400 via-green-300 to-teal-200',
    emoji: '🍵',
  },
  {
    id: 'post-nomad',
    user: '@nomad_arjun',
    initials: 'NA',
    avatarColor: 'bg-sky-500',
    verified: true,
    caption:
      'Day 3 working from Madpackers rooftop. WiFi: 85 Mbps. Coffee: ₹120. Sunset: priceless 💻🌅',
    location: 'Madpackers Hostel',
    likes: 189,
    comments: 22,
    hostel: 'Madpackers',
    gradient: 'from-sky-400 via-blue-300 to-indigo-200',
    emoji: '💻',
  },
  {
    id: 'post-food',
    user: '@backpack_priya',
    initials: 'BP',
    avatarColor: 'bg-amber-500',
    verified: false,
    caption:
      '₹500 street food challenge completed ✅ Golgappa → Jalebi → Parantha → Chole Kulche. Full route in comments!',
    location: 'Chandni Chowk',
    likes: 412,
    comments: 45,
    gradient: 'from-amber-300 via-orange-200 to-rose-200',
    emoji: '🍛',
  },
  {
    id: 'post-run',
    user: '@delhi_sarah',
    initials: 'DS',
    avatarColor: 'bg-rose-500',
    verified: true,
    caption: 'Sunset run at India Gate cycling track. 5km done. This city has energy! 🏃‍♀️',
    location: 'India Gate',
    likes: 156,
    comments: 9,
    gradient: 'from-rose-300 via-pink-200 to-orange-100',
    emoji: '🏃‍♀️',
  },
  {
    id: 'post-print',
    user: '@travel_rishabh',
    initials: 'TR',
    avatarColor: 'bg-violet-500',
    verified: false,
    caption:
      'Block printing workshop was INCREDIBLE. Made my own tote bag 🎨 Hands-on > any souvenir',
    location: 'Hauz Khas Art Village',
    likes: 298,
    comments: 31,
    gradient: 'from-violet-300 via-purple-200 to-fuchsia-100',
    emoji: '🎨',
  },
  {
    id: 'post-monsoon',
    user: '@weekend_wanderer',
    initials: 'WW',
    avatarColor: 'bg-teal-500',
    verified: false,
    caption: 'Monsoon walk through Ridge Forest. Zero tourists. Pure magic 🌧️🌿',
    location: 'Ridge Forest',
    likes: 178,
    comments: 12,
    gradient: 'from-teal-300 via-emerald-200 to-lime-100',
    emoji: '🌧️',
  },
];

export const localGuides: LocalGuide[] = [
  {
    id: 'priya',
    name: 'Priya',
    initials: 'PK',
    color: 'bg-amber-500',
    tagline: 'Old Delhi Food Expert',
    specialty: 'Food',
    rating: 4.9,
    reviews: 89,
    price: '₹500/2hr',
    bio: 'Born and raised in Chandni Chowk. I know every hidden food stall.',
  },
  {
    id: 'raj',
    name: 'Raj',
    initials: 'RS',
    color: 'bg-sky-600',
    tagline: 'Delhi Heritage Cyclist',
    specialty: 'Adventure',
    rating: 4.7,
    reviews: 67,
    price: '₹800/4hr',
    bio: 'History teacher turned tour guide. Cycles through 5,000 years of Delhi.',
  },
  {
    id: 'meera',
    name: 'Meera',
    initials: 'MS',
    color: 'bg-emerald-600',
    tagline: 'Yoga & Wellness Coach',
    specialty: 'Wellness',
    rating: 4.8,
    reviews: 112,
    price: '₹300/1.5hr',
    bio: 'Certified yoga instructor. Sunrise sessions at Lodhi Gardens.',
  },
  {
    id: 'vikram',
    name: 'Vikram',
    initials: 'VJ',
    color: 'bg-violet-600',
    tagline: 'Nightlife Connector',
    specialty: 'Nightlife',
    rating: 4.5,
    reviews: 45,
    price: '₹1,000/night',
    bio: 'Knows every rooftop bar, hidden club, and underground gig in Delhi.',
  },
];

export const meetups: Meetup[] = [
  {
    id: 'run-club',
    title: 'Delhi Sunrise Run Club — Lodhi Gardens Loop',
    emoji: '🏃',
    when: 'Saturday 6:00 AM',
    price: 'Free',
    attendees: 23,
    detail: '5km social run + post-run chai',
  },
  {
    id: 'art-walk',
    title: 'Street Art Walk — Hauz Khas Village',
    emoji: '🎨',
    when: 'Sunday 11:00 AM',
    price: '₹200',
    attendees: 15,
    detail: 'Guided walk + coffee',
  },
  {
    id: 'food-crawl',
    title: 'Chandni Chowk Food Crawl Meetup',
    emoji: '🍜',
    when: 'Friday 5:00 PM',
    price: '₹500',
    attendees: 31,
    detail: 'Group street food adventure',
  },
  {
    id: 'cowork-day',
    title: 'Digital Nomad Co-Working Day — Madpackers Rooftop',
    emoji: '💻',
    when: 'Wednesday 10:00 AM',
    price: 'Free',
    attendees: 12,
    detail: 'Bring your laptop, we bring the WiFi',
  },
];

export const achievements: Achievement[] = [
  { id: 'a1', title: 'First Trip Planner', emoji: '🏆', status: 'unlocked', note: 'Unlocked' },
  { id: 'a2', title: '3 Itineraries Completed', emoji: '🗺️', status: 'progress', note: '2/3' },
  { id: 'a3', title: 'Joined 1 Meetup', emoji: '🤝', status: 'locked', note: 'Not yet' },
  { id: 'a4', title: 'Left a Review', emoji: '⭐', status: 'locked', note: 'Not yet' },
  { id: 'a5', title: 'Stayed Under Budget', emoji: '💰', status: 'unlocked', note: 'Unlocked' },
  { id: 'a6', title: 'Shared a Story', emoji: '📸', status: 'locked', note: 'Not yet' },
];
