/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "montserrat": ["Montserrat-Regular", "sans-serif"],
        "montserrat-black": ["Montserrat-Black", "sans-serif"],
        "montserrat-bold": ["Montserrat-Bold", "sans-serif"],
        "montserrat-italic": ["Montserrat-Italic", "sans-serif"],
        "montserrat-light": ["Montserrat-Light", "sans-serif"],
        "playfair": ["PlayfairDisplay-Regular", "serif"],
        "playfair-bold": ["PlayfairDisplay-Bold", "serif"],
        "playfair-italic": ["PlayfairDisplay-Italic", "serif"],
        "playfair-medium": ["PlayfairDisplay-Medium", "serif"],
        "playfair-bold-italic": ["PlayfairDisplay-BoldItalic", "serif"]
      },
      colors: {
        background: "#1A3636",
        textPrimary: "#DCD7C9",
        textSecondary: "#D6BD98"
      },
    },
  },
  plugins: [],
}
