import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Design System - ForeverStory
        surface: '#FFF8F5',
        'surface-dim': '#E1D8D4',
        'surface-bright': '#FFF8F5',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#FBF2ED',
        'surface-container': '#F5ECE7',
        'surface-container-high': '#EFE6E2',
        'surface-container-highest': '#E9E1DC',
        'on-surface': '#1E1B18',
        'on-surface-variant': '#4F4444',
        outline: '#817474',
        'outline-variant': '#D3C3C2',

        // Primary (Blush)
        primary: '#735758',
        'primary-container': '#F5D0D0',
        'on-primary': '#FFFFFF',
        'on-primary-container': '#735758',
        'inverse-primary': '#E2BEBE',

        // Secondary (Gold)
        secondary: '#735C00',
        'secondary-container': '#FED65B',
        'on-secondary': '#FFFFFF',
        'on-secondary-container': '#745C00',

        // Tertiary
        tertiary: '#5E5F5D',
        'tertiary-container': '#D9D9D6',
        'on-tertiary': '#FFFFFF',
        'on-tertiary-container': '#5E5F5D',

        // Error
        error: '#BA1A1A',
        'on-error': '#FFFFFF',
        'error-container': '#FFDAD6',
        'on-error-container': '#93000A',

        // Neutral
        charcoal: '#2D2926',
        muted: '#4F4444',

        // Legacy aliases for compatibility
        ivory: '#FFF8F5',
        cream: '#FBF2ED',
        'blush': '#F5D0D0',
        'blush-light': '#FDF0F0',
        'rose': '#735758',
        'gold': '#735C00',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft': '0 2px 8px rgba(201, 169, 110, 0.12)',
        'glow': '0 0 20px rgba(201, 169, 110, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
