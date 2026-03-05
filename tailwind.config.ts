import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c97a',
          dark: '#8b6914',
        },
        cream: '#f5f0e8',
        ivory: '#faf8f3',
        charcoal: '#1a1a1a',
        'bg-dark': '#111010',
        'bg-deeper': '#0a0805',
        'warm-gray': '#8a8278',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e8c97a, #c9a84c)',
      },
    },
  },
  plugins: [],
}
export default config
