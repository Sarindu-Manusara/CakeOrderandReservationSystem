export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002C77',  // Strong Blue
          light: '#4F6BAE',
          dark: '#001F54',
        },
        secondary: {
          DEFAULT: '#FFB300',  // Bright Yellow
          light: '#FFC933',
          dark: '#CC8C00',
        },
        neutral: {
          50: '#FFFFFF',      // Pure white
          100: '#F5F5F5',     // Light Gray
          900: '#333333',     // Dark Text
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
}
