/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'rain': 'rain 1.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'flash': 'flash 5s infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        rain: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(120px)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flash: {
          '0%, 90%, 100%': { opacity: '0' },
          '92%, 96%': { opacity: '0.6' },
          '94%': { opacity: '0.1' },
        }
      },
    },
  },
  plugins: [],
}
