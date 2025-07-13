/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // One Barn AI Color Palette
        'stable-mahogany': '#6B3A2C',
        'arena-sand': '#F4E8D8',
        'midnight-black': '#1A1A1A',
        'hunter-green': '#2C5530',
        'sterling-silver': '#B8B5B0',
        'chestnut-glow': '#C67B5C',
        'champion-gold': '#D4A574',
        'ribbon-blue': '#4A6FA5',
        'victory-rose': '#B85450',
        'pasture-sage': '#8B9574',
      },
      borderRadius: {
        '3xl': '1.875rem',
      },
      fontFamily: {
        'display': ['"Bebas Neue"', 'display'],
        'primary': ['Inter', 'sans-serif'],
        'secondary': ['"Source Sans Pro"', 'sans-serif'],
        'mono': ['"Fira Code"', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}; 