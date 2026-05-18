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
        'primary-green': '#1A6B4A',
        'primary-light': '#E8F5EE',
        accent: '#F4A820',
        surface: '#FFFFFF',
        background: '#F7F9F8',
        'text-primary': '#1A1F1C',
        'text-secondary': '#4D6358',
        'text-muted': '#8FA99B',
        border: '#D8E5DF',
        danger: '#D63B3B',
        success: '#1A6B4A',
        warning: '#F4A820',
      },
      fontFamily: {
        serif: ['var(--font-dm-serif)', 'serif'],
        sans: ['var(--font-jakarta)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
