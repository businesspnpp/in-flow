import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#13131a',
        panel: '#1a1a24',
        border: '#2a2a3a',
        accent: '#6c63ff',
        'accent-hover': '#7c73ff',
        muted: '#4a4a5a',
        text: '#e8e8f0',
        'text-dim': '#9090a8',
      },
    },
  },
  plugins: [],
};

export default config;
