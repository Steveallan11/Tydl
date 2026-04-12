import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af'
        },
        accent: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706'
        }
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace']
      }
    }
  },
  plugins: []
} satisfies Config;
