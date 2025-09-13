"use client";

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export default function ThemeSwitcher() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-light-2 dark:bg-dark-4 text-black dark:text-white"
        >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}
