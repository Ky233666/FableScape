import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#17231b',
          900: '#203b2a',
          800: '#2f5237',
          700: '#3f6845',
        },
        parchment: {
          50: '#fff9ea',
          100: '#f4e7c4',
          200: '#e4cc91',
        },
        ochre: {
          300: '#cda45a',
          500: '#9b6c31',
        },
        umber: {
          700: '#5a3a25',
          900: '#2d2119',
        },
        clay: {
          500: '#a85f3c',
        },
      },
      boxShadow: {
        story: '0 22px 80px rgba(20, 31, 23, 0.35)',
        insetPaper: 'inset 0 1px 0 rgba(255,255,255,0.45)',
      },
      fontFamily: {
        story: [
          'ui-serif',
          'Georgia',
          'Cambria',
          'Noto Serif SC',
          'Songti SC',
          'serif',
        ],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Noto Sans SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
