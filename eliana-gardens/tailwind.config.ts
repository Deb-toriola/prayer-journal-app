import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1B3A2F',
          50: '#F2F6F4',
          100: '#DCE7E1',
          200: '#B6CCC0',
          300: '#83A89A',
          400: '#4F8270',
          500: '#2E5849',
          600: '#1B3A2F',
          700: '#163029',
          800: '#102420',
          900: '#0A1814',
        },
        gold: {
          DEFAULT: '#B08D2E',
          50: '#FAF5E6',
          100: '#F3E9C7',
          200: '#E5D188',
          300: '#D6B84F',
          400: '#C2A23B',
          500: '#B08D2E',
          600: '#8D7124',
          700: '#6A551B',
          800: '#473912',
          900: '#241D09',
        },
        bone: {
          DEFAULT: '#EEF2EF',
          50: '#FAFBFA',
          100: '#EEF2EF',
          200: '#DDE4DF',
        },
        ink: {
          DEFAULT: '#222222',
          soft: '#3A3A3A',
          muted: '#6B6B6B',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Editorial type scale — based on a 1.333 (perfect fourth) ratio for body,
        // larger jumps in display for real contrast.
        'eyebrow': ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.18em', fontWeight: '500' }],
        'micro': ['0.75rem', { lineHeight: '1.4' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.65' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'lead': ['1.25rem', { lineHeight: '1.55' }],
        'h6': ['1.125rem', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }],
        'h5': ['1.375rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['1.75rem',  { lineHeight: '1.2',  letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['2.25rem',  { lineHeight: '1.15', letterSpacing: '-0.02em',  fontWeight: '500' }],
        'h2': ['clamp(2rem, 4.2vw + 1rem, 3.5rem)',     { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '500' }],
        'h1': ['clamp(2.5rem, 6vw + 1rem, 5.25rem)',    { lineHeight: '0.98', letterSpacing: '-0.03em',  fontWeight: '500' }],
        'display': ['clamp(3rem, 8vw + 1rem, 7rem)',    { lineHeight: '0.95', letterSpacing: '-0.035em', fontWeight: '500' }],
      },
      spacing: {
        // 8-pt grid with named section rhythm
        'section-y':    'clamp(4rem, 9vw, 8rem)',
        'section-y-lg': 'clamp(6rem, 12vw, 11rem)',
        'gutter':       'clamp(1.25rem, 4vw, 2.5rem)',
      },
      maxWidth: {
        // Editorial container widths
        'reading': '38rem',
        'wide':    '78rem',
        'shell':   '88rem',
      },
      transitionTimingFunction: {
        // Custom easings — restrained, premium feel
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-rise': {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'underline-draw': {
          '0%':   { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-rise':       'fade-rise 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-rise-slow':  'fade-rise 900ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'underline':       'underline-draw 250ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
