export interface TransitOption {
  id: string;
  emoji: string;
  mode: string;
  duration: string;
  price: number;
  description: string;
}

export const delhiJaipurTransit: TransitOption[] = [
  {
    id: 'shatabdi',
    emoji: '🚂',
    mode: 'Shatabdi Express',
    duration: '4.5 hrs',
    price: 1050,
    description: 'AC chair car. Departs 6:05 AM. Breakfast + WiFi on board.',
  },
  {
    id: 'volvo',
    emoji: '🚌',
    mode: 'Volvo AC Bus',
    duration: '6 hrs',
    price: 800,
    description: 'Comfortable sleeper. Multiple departures daily.',
  },
  {
    id: 'cab',
    emoji: '🚗',
    mode: 'Private Cab',
    duration: '5 hrs',
    price: 3500,
    description: 'Door-to-door. Split with friends to save big!',
  },
  {
    id: 'flight',
    emoji: '✈️',
    mode: 'Short Flight',
    duration: '1.5 hrs',
    price: 3200,
    description: '30 min air time + airport transfers on both ends.',
  },
];
