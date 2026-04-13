module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dce8ff',
          200: '#c0d4ff',
          300: '#97b6ff',
          400: '#6f93ff',
          500: '#4f71f3',
          600: '#3d58d7',
          700: '#3448b4',
          800: '#2f408f',
          900: '#2d3a72'
        }
      },
      borderRadius: {
        xl: '1rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
}
