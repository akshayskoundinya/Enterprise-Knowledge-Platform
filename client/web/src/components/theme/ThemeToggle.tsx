import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "./ThemeToggle.css";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "ekp-theme";

const HIDDEN_ROUTES = ["/", "/login", "/register"];

function ThemeToggle() {
    const location = useLocation();

    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

        return savedTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    if (HIDDEN_ROUTES.includes(location.pathname)) {
        return null;
    }

    function handleToggle() {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light",
        );
    }

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={handleToggle}
            aria-label={
                theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            }
        >
            {theme === "light" ? "☾" : "☀"}
        </button>
    );
}

export default ThemeToggle;