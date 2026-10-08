import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

const PARTICLES: Particle[] = [
  { size: 10, top: '12%', left: '8%', duration: 22, delay: 0, color: '#95D5B2', opacity: 0.3 },
  { size: 6, top: '25%', left: '85%', duration: 18, delay: 2, color: '#52B788', opacity: 0.22 },
  { size: 8, top: '65%', left: '15%', duration: 25, delay: 4, color: '#FEFAE0', opacity: 0.3 },
  { size: 5, top: '75%', left: '75%', duration: 20, delay: 1, color: '#95D5B2', opacity: 0.25 },
  { size: 9, top: '45%', left: '50%', duration: 24, delay: 6, color: '#D4A373', opacity: 0.15 },
  { size: 4, top: '85%', left: '40%', duration: 16, delay: 3, color: '#52B788', opacity: 0.2 },
  { size: 7, top: '5%', left: '60%', duration: 21, delay: 5, color: '#95D5B2', opacity: 0.18 },
  { size: 6, top: '55%', left: '92%', duration: 23, delay: 7, color: '#FEFAE0', opacity: 0.3 },
];

/** Fixed, calm floating particle background behind all content. */
export function Particles() {
  const [particles] = useState(() => PARTICLES);
  const nodes = useMemo(
    () =>
      particles.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="fixed rounded-full"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            backgroundColor: p.color,
            opacity: p.opacity,
            zIndex: 0,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: p.opacity }}
          transition={{ duration: 1.2, delay: p.delay * 0.2 }}
        />
      )),
    [particles],
  );

  return <div aria-hidden="true">{nodes}</div>;
}
