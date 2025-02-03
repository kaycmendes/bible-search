/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Custom color palette
        'navy': {
          '50': 'rgb(220 242 251)',
          '100': 'rgb(186 224 246)',
          '200': 'rgb(147 197 237)',
          '300': 'rgb(108 170 228)',
          '400': 'rgb(69 143 219)',
          '500': 'rgb(30 116 210)',
          '600': 'rgb(24 93 168)',
          '700': 'rgb(18 70 126)',
          '800': 'rgb(12 46 84)',
          '900': 'rgb(6 23 42)',
        },
        'sage': {
          '50': 'rgb(236 243 238)',
          '100': 'rgb(217 231 221)',
          '200': 'rgb(178 207 187)',
          '300': 'rgb(140 183 153)',
          '400': 'rgb(101 159 119)',
          '500': 'rgb(63 135 85)',
          '600': 'rgb(50 108 68)',
          '700': 'rgb(38 81 51)',
          '800': 'rgb(25 54 34)',
          '900': 'rgb(13 27 17)',
        },
        'cream': {
          '50': 'rgb(255 253 248)',
          '100': 'rgb(254 247 233)',
          '200': 'rgb(253 241 218)',
          '300': 'rgb(252 235 203)',
          '400': 'rgb(251 229 188)',
          '500': 'rgb(250 223 173)',
          '600': 'rgb(200 178 138)',
          '700': 'rgb(150 134 104)',
          '800': 'rgb(100 89 69)',
          '900': 'rgb(50 45 35)',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        'glow-1': 'glow1 4s ease-in-out infinite alternate',
        'glow-2': 'glow2 6s ease-in-out infinite alternate',
        'glow-3': 'glow3 8s ease-in-out infinite alternate',
        'border-flow': 'borderFlow 8s linear infinite',
        bounce: 'bounce 1s infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        glow1: {
          '0%': { transform: 'scale(0.8) translate(-10%, -10%)', opacity: 0.5 },
          '100%': { transform: 'scale(1.2) translate(10%, 10%)', opacity: 0.8 }
        },
        glow2: {
          '0%': { transform: 'scale(1.2) translate(10%, -10%)', opacity: 0.3 },
          '100%': { transform: 'scale(0.8) translate(-10%, 10%)', opacity: 0.6 }
        },
        glow3: {
          '0%': { transform: 'scale(1) translate(0%, 10%)', opacity: 0.4 },
          '100%': { transform: 'scale(1.1) translate(0%, -10%)', opacity: 0.7 }
        },
        borderFlow: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 2px rgba(18, 70, 126, 0.3))',
          },
          '50%': {
            filter: 'drop-shadow(0 0 6px rgba(50, 108, 68, 0.5))',
          }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: 0.5,
          },
          '50%': {
            transform: 'translateY(-25%)',
            opacity: 1,
          },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [require("daisyui")],
}