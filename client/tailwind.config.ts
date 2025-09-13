// tailwind.config.ts
import type {Config} from "tailwindcss";

const config: Config = {
    darkMode: "class", // enable dark mode via .dark class
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/global.css"
    ],
    theme: {
        extend: {
            colors: {
                "dark-1": "#000000",
                "dark-2": "#121417",
                "dark-3": "#101012",
                "dark-4": "#1F1F22",
                "light-1": "#FFFFFF",
                "light-2": "#EFEFEF",
                "light-3": "#7878A3",
                "light-4": "#5C5C7B",
            },
        },
    },
    plugins: [],
};

export default config;
