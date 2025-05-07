/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          800: '#1E40AF', // Primary
        },
        teal: {
          600: '#0D9488', // Accent
        },
        success: {
          100: '#DCFCE7',
          500: '#22C55E',
          700: '#15803D',
        },
        warning: {
          100: '#FEF3C7',
          500: '#F59E0B',
          700: '#B45309',
        },
        error: {
          100: '#FEE2E2',
          500: '#EF4444',
          700: '#B91C1C',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            maxWidth: 'none',
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.900'),
              marginTop: '1.5em',
              marginBottom: '0.75em',
            },
            a: {
              color: theme('colors.blue.800'),
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.300'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.100'),
            },
            a: {
              color: theme('colors.blue.400'),
            },
          },
        },
      }),
    },
  },
  plugins: [],
};