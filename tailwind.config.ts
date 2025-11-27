import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette from WooCommerce
        brand: {
          title: '#2d4a3e',      // Dark green for titles
          text: '#2d2d2d',       // Dark charcoal for body text
          black: '#1a1a1a',      // Accent 1 - deep black
          rust: '#c45c3e',       // Accent 2 - terracotta/rust
          lime: '#8bc53f',       // Accent 3 - main brand green
          gold: '#d4a84b',       // Border color - golden/mustard
          sage: '#f0f4e8',       // Form backgrounds - light sage
        },
        // Extended spice green scale
        spice: {
          50: '#f5fbe9',
          100: '#e5f5c7',
          200: '#d2eda8',
          300: '#b9e07c',
          400: '#a4d455',
          500: '#8bc53f',
          600: '#6ea01f',
          700: '#597d18',
          800: '#446014',
          900: '#2c3e0c',
          950: '#1b2406',
        },
        // Rust/terracotta scale
        rust: {
          50: '#fef6f3',
          100: '#fdeae4',
          200: '#fbd4c9',
          300: '#f6b3a0',
          400: '#ee8568',
          500: '#c45c3e',
          600: '#a84a31',
          700: '#8c3d28',
          800: '#733324',
          900: '#5f2c21',
        },
        // Gold/mustard scale
        gold: {
          50: '#fdfaf3',
          100: '#faf3e0',
          200: '#f4e4bc',
          300: '#ecd18e',
          400: '#e2b85c',
          500: '#d4a84b',
          600: '#c08c35',
          700: '#9f6e2c',
          800: '#81572a',
          900: '#6a4826',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(139, 197, 63, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 197, 63, 0.4)',
        'glow-rust': '0 0 20px rgba(196, 92, 62, 0.3)',
        'glow-gold': '0 0 20px rgba(212, 168, 75, 0.3)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
