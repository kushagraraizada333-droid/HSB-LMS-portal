/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official HSB (Hari Shankar Singhania School of Business) Color Tokens
        // Extracted directly from live HSB stylesheet tokens (post-6.css)
        hsb: {
          50: '#ecf2fa',  // HSB Ice Surface Tint (--e-global-color-ad9268b)
          100: '#d7e4f5',
          200: '#b8d2ee',
          300: '#a3c5e9', // HSB Sky Border Tint (--e-global-color-fa9fbb8)
          400: '#5c95d5',
          500: '#2c72c5',
          600: '#1955a6', // Official HSB Core Primary Blue (--e-global-color-f09be2f)
          700: '#16488d',
          800: '#244a9a', // Official HSB Cobalt Blue (--e-global-color-53a4565)
          900: '#1d3c74', // Official HSB Deep Navy (--e-global-color-33620c3)
          950: '#0d1d3a', // Deep Institutional Slate
        },
        // Secondary & Accent HSB tokens
        'hsb-ocean': '#126ab3',   // HSB Ocean Blue (--e-global-color-63cc29a)
        'hsb-slate': '#36384e',   // HSB Charcoal Slate (--e-global-color-e7c8091)
        'hsb-accent': '#ff9e4a',  // HSB Warm Orange/Peach Accent
        'hsb-light': '#f5f8fd',   // Page Background Tint
        brand: {
          50: '#ecf2fa',
          100: '#d7e4f5',
          200: '#b8d2ee',
          300: '#a3c5e9',
          400: '#5c95d5',
          500: '#2c72c5',
          600: '#1955a6',
          700: '#16488d',
          800: '#244a9a',
          900: '#1d3c74',
          950: '#0d1d3a',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        // HSB Official Typography: Roboto for UI & body, Roboto Slab for editorial titles
        sans: ['Roboto', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Roboto Slab', 'Georgia', 'serif'],
        heading: ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
