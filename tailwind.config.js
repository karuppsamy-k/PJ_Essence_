/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#6B1E2B',
          dark: '#4A121D',
          light: '#8E2C3D',
          deep: '#360911',
          surface: '#F4EAEB',
        },
        bronze: {
          DEFAULT: '#B68A4C',
          dark: '#936C35',
          light: '#D4AB6E',
          shimmer: '#E8CA9B',
          glow: 'rgba(182, 138, 76, 0.25)',
        },
        cream: {
          DEFAULT: '#F8F2EA',
          light: '#FCFAF7',
          warm: '#F4ECE1',
          dark: '#EDE2D3',
        },
        walnut: {
          DEFAULT: '#5C4033',
          dark: '#3E2A21',
          light: '#7B5949',
          deep: '#281A14',
        },
        taupe: {
          DEFAULT: '#B6A89C',
          light: '#D3C9C0',
          dark: '#8C7C70',
          muted: '#E6E0DA',
        },
        charcoal: {
          DEFAULT: '#1E1918',
          soft: '#2D2725',
          muted: '#524B49',
        },
        magenta: {
          DEFAULT: '#D81B7E',
          dark: '#A01060',
          light: '#F048A8',
          blush: '#FDE7F3',
          glow: 'rgba(216, 27, 126, 0.22)',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(92, 64, 51, 0.1)',
        'luxury-hover': '0 30px 60px -15px rgba(107, 30, 43, 0.15)',
        'gold-glow': '0 0 25px rgba(182, 138, 76, 0.35)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-foil': 'linear-gradient(135deg, #B68A4C 0%, #E8CA9B 50%, #936C35 100%)',
        'burgundy-velvet': 'linear-gradient(135deg, #6B1E2B 0%, #4A121D 100%)',
      }
    },
  },
  plugins: [],
}
