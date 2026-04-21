/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			heading: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
  			body: ['Lato', 'sans-serif'],
  			script: ['"Great Vibes"', 'cursive']
  		},
  		colors: {
  			/* Invitation palette — extracted from the wedding invitation */
  			invite: {
  				navy: '#344E8A',
  				blue: '#4A6AA6',
  				'blue-soft': '#6A8BAD',
  				'blue-mist': '#DDE5F0',
  				ivory: '#F7F3EB',
  				'ivory-soft': '#FAF7F0',
  				gold: '#C0A971',
  				'gold-deep': '#A08A55',
  				ink: '#424242'
  			},
  			gold: {
  				'50': '#FBF7E6',
  				'100': '#F6EFCC',
  				'500': '#C0A971',
  				'600': '#A08A55'
  			},
  			rose: {
  				'50': '#FFF1F2',
  				'100': '#FFE4E6',
  				'200': '#FECDD3'
  			},
  			stone: {
  				'50': '#FAFAF9',
  				'100': '#F5F5F4',
  				'500': '#78716C',
  				'600': '#57534E',
  				'700': '#44403C',
  				'800': '#292524',
  				'900': '#1C1917'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
  			'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
