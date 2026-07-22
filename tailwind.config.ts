import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "var(--container)",
      },
    },
    extend: {
      colors: {
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
          DEFAULT: "hsl(var(--muted-bg))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          color: "hsl(var(--accent-color))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand-specific colors
        brand: {
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
        },
        // Rose-gold accent — second colour beat (CTAs hover, price, editorial).
        gold: {
          DEFAULT: "hsl(var(--gold))",
          soft: "hsl(var(--gold-soft))",
        },
        text: "hsl(var(--text))",
        heading: "hsl(var(--heading))",
        link: "hsl(var(--link))",
        bg: "hsl(var(--bg))",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "section-sm": "var(--space-section-sm)",
        "section-md": "var(--space-section-md)",
        "section-lg": "var(--space-section-lg)",
        "section-xl": "var(--space-section-xl)",
      },
      fontSize: {
        "h1": ["var(--text-h1)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "h1-lg": ["var(--text-h1-lg)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "h2": ["var(--text-h2)", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "h2-lg": ["var(--text-h2-lg)", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "display": ["var(--text-display)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "tagline": ["var(--text-tagline)", { lineHeight: "1.5" }],
        "body": ["var(--text-body)", { lineHeight: "1.6" }],
        "button": ["var(--text-button)", { lineHeight: "1.5" }],
        "button-lg": ["var(--text-button-lg)", { lineHeight: "1.5" }],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      transitionDuration: {
        fast: "var(--transition-fast)",
        base: "var(--transition-base)",
        slow: "var(--transition-slow)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        btn: "var(--radius-btn)",
        card: "var(--radius-card)",
      },
      fontFamily: {
        'heading': ["Playfair Display", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        'body': ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        'sans': ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        'serif': ["Playfair Display", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        'display': ["Playfair Display", "Georgia", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "breathing": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-bottom": "slide-in-bottom 0.3s ease-out",
        "shimmer": "shimmer 3s linear infinite",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "breathing": "breathing 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
