/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		colors: {
  			primary: {
  				DEFAULT: '#0066FF',
  				foreground: '#FFFFFF'
  			},
  			accent: {
  				DEFAULT: '#E6F0FF',
  				foreground: '#0066FF'
  			},
  			'main-gray': '#ebefee',
  			mustard: '#c66a1e',
  			'main-green': '#015640',
  			'main-blue': '#2196f3',
  			'main-orange': '#e59148',
  			'dark-green': '#002d21',
  			'figma-black': '#0e1726'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
