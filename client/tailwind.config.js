/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Professional Dark Theme Palette
        background: "#0F172A", // Very dark blue-gray background
        surface: "#1E293B", // Card/surface color
        primary: "#3B82F6", // Primary accent blue
        text: "#F1F5F9", // Main text color
        textSecondary: "#94A3B8", // Secondary text
        border: "#334155", // Border color

        // Legacy colors for compatibility
        accent: "#3B82F6",
        textDark: "#F1F5F9",
        textLight: "#94A3B8",

        // Enhanced professional palette
        professional: {
          bg: "#0F172A",
          surface: "#1E293B",
          surfaceHover: "#334155",
          primary: "#3B82F6",
          primaryHover: "#2563EB",
          text: "#F1F5F9",
          textSecondary: "#94A3B8",
          textMuted: "#64748B",
          border: "#334155",
          borderLight: "#475569",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },

        // Enegix brand colors (updated for dark theme)
        enegix: {
          blue: "#3B82F6",
          teal: "#06B6D4",
          dark: "#0F172A",
          darker: "#020617",
          gray: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          },
        },
      },
      boxShadow: {
        professional:
          "0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
        header: "0 4px 14px 0 rgba(0, 0, 0, 0.15)",
      },
      backgroundImage: {
        "gradient-professional":
          "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        "gradient-primary": "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
      },
    },
  },
  plugins: [],
};
