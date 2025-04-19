/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FCF9F0',
          100: '#F5F3E5',
          200: '#EAE5CC',
          300: '#DFD7B3',
          400: '#D4C999',
          500: '#C8A951',
          600: '#B99A49',
          700: '#A98B41',
          800: '#997C39',
          900: '#8A6D31',
        },
        secondary: {
          50: '#F9F0F1',
          100: '#F3E0E3',
          200: '#E6C1C7',
          300: '#D9A3AC',
          400: '#CC8490',
          500: '#BF6575',
          600: '#AF576A',
          700: '#8F4555',
          800: '#7D2027',
          900: '#5E1A1E',
        },
        accent: {
          50: '#F6F4F1',
          100: '#EDE9E3',
          200: '#DDD4C6',
          300: '#CCBEA9',
          400: '#BBA98D',
          500: '#AA9470',
          600: '#95805C',
          700: '#756648',
          800: '#544A33',
          900: '#3A2618',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};