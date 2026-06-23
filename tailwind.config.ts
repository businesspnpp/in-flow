import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        surface: '#FFFFFF',
        panel: '#F5F5F5',
        border: '#E4E4E7',
        accent: '#D97706',
        'accent-hover': '#B45309',
        muted: '#A1A1AA',
        text: '#18181B',
        'text-dim': '#71717A',
        statusActive: '#059669',
      },
      borderRadius: {
        card: '10px',
        button: '8px',
      },
      boxShadow: {
        'none': 'none',
        'border': '0 0 0 1px var(--tw-border-color)',
      },
    },
  },
  plugins: [],
};

export default config;
