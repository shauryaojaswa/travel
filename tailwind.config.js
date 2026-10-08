/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6A4F',
          light: '#52B788',
          lighter: '#95D5B2',
          bg: '#F0FAF4',
        },
        accent: {
          DEFAULT: '#D4A373',
          light: '#FEFAE0',
        },
        ink: {
          dark: '#1B4332',
          medium: '#52796F',
          light: '#84A98C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        // clamp-based display sizes for responsive headings
        'display-xl': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.08' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.15' }],
        'display-md': ['clamp(1.6rem, 3vw, 2.25rem)', { lineHeight: '1.25' }],
      },
      boxShadow: {
        calm: '0 1px 3px rgba(45, 106, 79, 0.08)',
        'calm-md': '0 4px 20px rgba(45, 106, 79, 0.1)',
        'calm-lg': '0 10px 40px rgba(45, 106, 79, 0.15)',
        bloom: '0 16px 48px rgba(45, 106, 79, 0.18)',
      },
      borderRadius: {
        card: '24px',
        input: '12px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '33%': { transform: 'translateY(-28px) translateX(12px)' },
          '66%': { transform: 'translateY(14px) translateX(-10px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.35)' },
        },
      },
      animation: {
        float: 'float 18s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
