/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0a0f1e',
        bgSecondary: '#111827',
        bgCard: '#1a2235',
        bgInput: '#0d1526',
        accent: '#f97316',
        accentHover: '#ea6a05',
        accent2: '#3b82f6',
        textPrimary: '#f1f5f9',
        textSecondary: '#94a3b8',
        border: '#1e2d45',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#eab308',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        btn: '8px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
