import { type Config } from "tailwindcss";

export default {
  content: [
    "./routes/**/*.{ts,tsx}",
    "./islands/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  safelist: [
    // Score colors used dynamically in useScoreColors hook
    'text-green-600',
    'text-yellow-600', 
    'text-red-600',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;