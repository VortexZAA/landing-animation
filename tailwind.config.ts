import type { Config } from 'tailwindcss'

const colors = require('tailwindcss/colors')

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      ...colors,
      'sacramento-green': '#00312E',
      'medium-aquamarine': '#62D4A0',
      'spanish-gray': '#969696',
      'sonic-silver': '#757575'
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        marcellus: ['var(--font-marcellus)'],
        nunito: ['var(--font-nunito)']
      },
      animation: {
        'spin-slow': 'spin 16s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        rotate: 'rotate 15s linear infinite'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        rotate: {
          '0%': { rotate: '0deg' },
          '100%': { rotate: '360deg' }
        },
        swipeUp: {
          '0%': { transform: 'translateY(5px)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(-5px)' }
        }
      },
    },
  },
  plugins: [],
}
export default config
