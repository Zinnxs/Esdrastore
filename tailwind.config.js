/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 80px rgba(15, 23, 42, 0.16)',
      },
      backgroundImage: {
        'mesh-light': 'radial-gradient(circle at top left, rgba(251, 146, 60, 0.18), transparent 35%), radial-gradient(circle at top right, rgba(20, 184, 166, 0.16), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.98))',
      },
    },
  },
  plugins: [],
};
