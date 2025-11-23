import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#2563eb", // blue-600
                    light: "#60a5fa", // blue-400
                    dark: "#1e40af", // blue-800
                },
                secondary: {
                    DEFAULT: "#4f46e5", // indigo-600
                    light: "#818cf8", // indigo-400
                    dark: "#3730a3", // indigo-800
                },
                background: "#ffffff",
                surface: "#f8fafc", // slate-50
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
