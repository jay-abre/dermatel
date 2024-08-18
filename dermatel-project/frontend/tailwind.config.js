module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f3f4f6',
        primary: '#2d72d9',
        'primary-foreground': '#ffffff',
        heading: '#333333',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out',
        hover: 'hoverEffect 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        hoverEffect: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
