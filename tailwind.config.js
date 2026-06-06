/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.html'
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /^(bg|text|border|from|to)-(blue|green|orange|red|yellow|purple)-(50|100|500|600)$/,
    }
  ],
  corePlugins: {
    preflight: true,
  },
  plugins: [],
};
