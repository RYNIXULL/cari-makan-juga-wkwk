/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Menggunakan warna aksen biru sesuai spesifikasi desain CariMakan
        brandBlue: '#3B82F6', 
        brandAmber: '#F59E0B',
      },
    },
  },
  plugins: [],
}