import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0D0D0D', light: '#1A1A1A', dark: '#000000' },
        secondary: { DEFAULT: '#C9A84C', light: '#E2BC5A', dark: '#A8892F' },
        accent: { DEFAULT: '#C9A84C', light: '#E2BC5A', dark: '#A8892F' },
        card: '#1A1A1A',
        elevated: '#222222',
        border: '#2A2A2A',
        success: '#2ECC71',
        danger: '#E74C3C',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        poppins: ['Playfair Display', 'serif'],
        inter: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
