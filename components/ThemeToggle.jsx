'use client'

import { useState } from "react";

export default function ThemeToggle() {
    const [isLight, setIsLight] = useState(true)
    function toggleTheme() {
        try {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'light' ? 'dark' : 'light';
            setIsLight(next === 'light')
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <button onClick={toggleTheme} className="btn" aria-label="Toggle theme">
            {isLight? '🌙' : '☀️'}
        </button>
    );
}