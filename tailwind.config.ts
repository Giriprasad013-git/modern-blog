
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#1E73BE',
					50: '#EBF3FB',
					100: '#C5DDF5',
					200: '#9FC7EF',
					300: '#79B0E9',
					400: '#539AE3',
					500: '#2D84DD',
					600: '#1E73BE',
					700: '#17598F',
					800: '#0F3E60',
					900: '#072232',
					950: '#031019',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#FF7A00',
					50: '#FFFAF5',
					100: '#FEF0E0',
					200: '#FCE1C2',
					300: '#FBD2A3',
					400: '#FAC385',
					500: '#F9B466',
					600: '#F7A547',
					700: '#F69628',
					800: '#FF7A00',
					900: '#D46700',
					950: '#A35000',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards'
			},
			fontFamily: {
				'roboto': ['Roboto', 'sans-serif'],
				'merrifield': ['Georgia', 'serif'] // Using Georgia as a fallback for Merrifield
			},
			typography: {
				DEFAULT: {
					css: {
						h1: {
							fontFamily: 'Roboto, sans-serif',
						},
						h2: {
							fontFamily: 'Roboto, sans-serif',
						},
						h3: {
							fontFamily: 'Roboto, sans-serif',
						},
						h4: {
							fontFamily: 'Roboto, sans-serif',
						},
						h5: {
							fontFamily: 'Roboto, sans-serif',
						},
						h6: {
							fontFamily: 'Roboto, sans-serif',
						},
						p: {
							fontFamily: 'Georgia, serif',
						},
					},
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config;
