/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        khmer: ['"Dangrek"', 'sans-serif'],
      },
      spacing: {
        15: "3.75rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Static color versions
        primary: {
          DEFAULT: "#0f8abe",       // Light primary
          dark: "#0c6e9b",          // Darker shade
          foreground: "#ffffff",   // Optional text color over primary
        },

        // Keep CSS variable-based colors if used in your design system
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Additional custom colors
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        chat: {
          user: "#0f8abe",
          admin: "#ffffff",
          time: {
            user: "rgba(255, 255, 255, 0.8)",
            admin: "#888888",
          },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-in-message": "fadeInMessage 0.4s ease forwards",
        spin: "spin 0.6s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInMessage: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        chat: "0 12px 30px rgba(0, 0, 0, 0.2)",
        "chat-button": "0 4px 12px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    tailwindcssAnimate,
  ],
};
