"use client";

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {MoonIcon, SunIcon} from "@heroicons/react/24/solid";
import {Button} from "@/components/ui/button";

export default function ThemeSwitcher() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <Button

            variant={"outline"}
            size={"sm"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}

        >
            {theme === "light" ? <MoonIcon/> : <SunIcon/>}
        </Button>
    );
}
