import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./data/**/*.ts"],
  theme: {
    extend: {
      colors: {
        primary: "#12284C",
        accent: "#2F6BFF",
        highlight: "#C8102E", // 일본 연상 색. CTA·강조 한두 곳에만 사용
        bg: "#FFFFFF",
        "bg-subtle": "#F5F7FA",
        text: "#1A1A1A",
        "text-muted": "#5B6574",
        border: "#E3E7ED",
      },
      fontFamily: {
        sans: ['"Pretendard"', '"Noto Sans JP"', '"Inter"', "sans-serif"],
      },
      maxWidth: { page: "1200px" },
      borderRadius: { card: "12px" },
      boxShadow: { card: "0 1px 3px rgba(18,40,76,.06), 0 4px 12px rgba(18,40,76,.04)" },
    },
  },
  plugins: [],
};

export default config;
