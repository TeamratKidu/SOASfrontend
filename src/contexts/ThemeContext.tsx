"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
    children: ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

    useEffect(() => {
        const root = window.document.documentElement

        const applyTheme = (isDark: boolean) => {
            if (isDark) {
                root.classList.add("dark")
                setResolvedTheme("dark")
            } else {
                root.classList.remove("dark")
                setResolvedTheme("light")
            }
        }

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
            applyTheme(mediaQuery.matches)

            const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
            mediaQuery.addEventListener("change", handler)
            return () => mediaQuery.removeEventListener("change", handler)
        } else {
            applyTheme(theme === "dark")
        }
    }, [theme])

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme)
        localStorage.setItem(storageKey, newTheme)
    }

    return (
        <ThemeContext.Provider {...props} value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider")
    }
    return context
}
