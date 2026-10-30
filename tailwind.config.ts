import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Direct Core Tokens
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
          light: "var(--color-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "var(--color-secondary-hover)",
          light: "var(--color-secondary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          active: "var(--color-accent-active)",
          dark: "var(--accent)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--text-muted)",
        },
        destructive: "var(--destructive)",
        background: "var(--background)",
        sidebar: {
          DEFAULT: "var(--sidebar)",
          primary: "var(--sidebar-primary)",
          accent: "var(--sidebar-accent)",
          border: "var(--sidebar-border)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // Chart Tokens
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },

        // Semantic UI Canvas Roles
        app: "var(--bg-app)",
        surface: "var(--bg-surface)",
        "surface-alt": "var(--bg-surface-alt)",
        line: "var(--border-default)",
        "line-strong": "var(--border-strong)",
        "line-dark": "var(--border-dark)",

        // Text Tokens
        content: "var(--text-primary)",
        "content-secondary": "var(--text-secondary)",
        "content-muted": "var(--text-muted)",
        "on-dark": "var(--text-on-dark)",
        "on-accent": "var(--text-on-accent)",
        "on-primary": "var(--text-on-primary)",

        // Functional State
        success: "var(--state-success)",
        "success-bg": "var(--state-success-bg)",
        warning: "var(--state-warning)",
        "warning-bg": "var(--state-warning-bg)",
        live: "var(--live-indicator)",
        "live-bg": "var(--live-indicator-bg)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        display: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        normal: "0em",
      },
      boxShadow: {
        button: "rgba(255, 255, 255, 0.2) 0px 2px 1px 0px inset",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "4px",
        md: "8px",
        lg: "12px",
        card: "8px",
        pill: "9999px",
      },
      spacing: {
        base: "0.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
