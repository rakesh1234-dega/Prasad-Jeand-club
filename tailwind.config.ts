import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0D0D0D', light: '#1A1A1A', dark: '#000000' },
        card: '#1A1A1A',
        elevated: '#222222',
        gold: { DEFAULT: '#C9A84C', light: '#E8C96A', dark: '#B8922A' },
        border: '#2A2A2A',
        success: '#2ECC71',
        danger: '#E74C3C',
        warning: '#F39C12',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'xxs': '0.625rem',
      },
    },
  },
  plugins: [],
}
export default config
