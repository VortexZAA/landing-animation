import type { Config } from 'tailwindcss';

const colors = require('tailwindcss/colors');

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      ...colors,
      'sacramento-green': '#00312E',
      'medium-aquamarine': '#62D4A0',
      'spanish-gray': '#969696',
      'sonic-silver': '#757575',
      primary: '#1D2E0F',
      btnActive: '#5C6D2F',
      cardbg: '#1C2B0E',
      card: '#4B7526',
      cardBorder: '#121C09',
      purple: '#5C6D2F', //'#675AFF',
      vip1: '#1FCB4F',
      vip2: '#FFC01E',
      vip3: '#F46D22',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        marcellus: ['Marcellus', 'sans-serif'],
        nunito: ['var(--font-nunito)'],
        spring: ['spring', 'sans-serif'],
        satoshi: ['satoshi', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 16s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        rotate: 'rotate 15s linear infinite',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeUp: 'fadeUp 0.5s ease-in-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        rotate: {
          '0%': { rotate: '0deg' },
          '100%': { rotate: '360deg' },
        },
        swipeUp: {
          '0%': { transform: 'translateY(5px)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(-5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
