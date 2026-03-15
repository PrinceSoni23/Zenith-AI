/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          700: "#334155",
          800: "#1e293b",
          850: "#172033",
          900: "#0f172a",
          950: "#080d1a",
        },
        accent: {
          purple: "#8b5cf6",
          violet: "#7c3aed",
          green: "#10b981",
          orange: "#f59e0b",
          pink: "#ec4899",
          teal: "#14b8a6",
          cyan: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.3), transparent)",
        "hero-glow-dark":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.5), transparent)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-up": "fadeUp 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        shimmer: "shimmer 2.5s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "float-up": "floatUp var(--dur, 3s) ease-out var(--delay, 0s) both",
        "pop-in": "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        "pulse-ring": "pulseRing 1.4s ease-out infinite",
        "text-shimmer": "textShimmer 2s linear infinite",
        wiggle: "wiggle 0.6s ease-in-out",
        marquee: "marquee 35s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(99,102,241,0.3)" },
          "100%": {
            boxShadow:
              "0 0 40px rgba(99,102,241,0.7), 0 0 80px rgba(99,102,241,0.2)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        floatUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(0)    scale(0.6) rotate(var(--rot, 0deg))",
          },
          "15%": {
            opacity: "1",
            transform: "translateY(-15vh) scale(1.1) rotate(var(--rot, 0deg))",
          },
          "85%": {
            opacity: "0.8",
            transform: "translateY(-80vh) scale(0.9) rotate(var(--rot, 0deg))",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-95vh) scale(0.7) rotate(var(--rot, 0deg))",
          },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.3) rotate(-8deg)" },
          "60%": { opacity: "1", transform: "scale(1.12) rotate(3deg)" },
          "100%": { opacity: "1", transform: "scale(1)    rotate(0deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "70%": { transform: "scale(1.5)", opacity: "0" },
          "100%": { transform: "scale(0.9)", opacity: "0" },
        },
        textShimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(99,102,241,0.3)",
        glow: "0 0 30px rgba(99,102,241,0.4)",
        "glow-lg": "0 0 60px rgba(99,102,241,0.5)",
        "glow-purple": "0 0 30px rgba(139,92,246,0.5)",
        card: "0 4px 24px rgba(0,0,0,0.06)",
        "card-dark": "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};
