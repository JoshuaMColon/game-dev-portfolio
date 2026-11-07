"use client";

import { useEffect, useState } from "react";

// Theme is a class on <html>, not React context. I apply it after mount:
// the server render has no class (light tokens win in globals.css), and
// the button stays labeled "Theme" until localStorage is safe to read.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    // A stored choice wins. With none, I follow the OS preference.
    const initialTheme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : systemPrefersDark
          ? "dark"
          : "light";

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    document.documentElement.setAttribute("data-theme", initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [mounted, theme]);

  return (
    <button
      type="button"
      onClick={() =>
        setTheme((current) => (current === "dark" ? "light" : "dark"))
      }
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-graphite-900/70 px-3 py-2 text-sm text-ink-muted transition-[color,border-color,transform] duration-150 active:scale-95 hover:border-phosphor/50 hover:text-ink-primary"
    >
      <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
      <span className="hidden sm:inline">
        {mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Theme"}
      </span>
    </button>
  );
}
