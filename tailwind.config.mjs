/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F0E8',
        ivory: '#EDE7D4',
        sepia: '#8B6F47',
        dark: '#1A1410',
        charcoal: '#2D2520',
        rust: '#C4622D',
        gold: '#B8962E',
        'gold-light': '#D4AF50',
        text: '#3D3028',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['DM Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
