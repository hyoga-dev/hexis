import { useState, useEffect } from "react";

const useTheme = () => {
    // Default colors for light and dark modes
    const defaultLightTheme = {
        backgroundColor: "#f2f5f7",
        surfaceColor: "#ffffff",
        primaryColor: "#38acff",
        primaryHover: "#2c6bb0",
        secondaryColor: "#474747",
        fontColor: "#1a2126",
        secondaryFontColor: "#66666679",
        onPrimary: "#f7f7f7",
        borderColor: "#e0e0e0",
        shadowColor: "#e3e6e8",
        errorColor: "#e74c3c",
    };

    const defaultDarkTheme = {
        backgroundColor: "#121416",
        surfaceColor: "#1e2329",
        primaryColor: "#38acff",
        primaryHover: "#62baff",
        secondaryColor: "#cfd8dc",
        fontColor: "#eef1f5",
        secondaryFontColor: "#94a3b8",
        onPrimary: "#f7f7f7",
        borderColor: "#2f3640",
        shadowColor: "#000000",
        errorColor: "#ff6b6b",
    };

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("hexis-dark-mode");
        if (saved !== null) return JSON.parse(saved);
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    // Applied colors that are persisted to localStorage
    const [appliedColors, setAppliedColors] = useState(() => {
        const saved = localStorage.getItem("hexis-custom-colors");
        return saved ? JSON.parse(saved) : {};
    });

    // Staged colors for editing before applying
    const [stagedColors, setStagedColors] = useState({ ...appliedColors });

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        const baseTheme = isDarkMode ? defaultDarkTheme : defaultLightTheme;
        const finalColors = { ...baseTheme, ...appliedColors };

        Object.entries(finalColors).forEach(([key, value]) => {
            const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
            root.style.setProperty(cssVar, value);
        });

        // Save preferences
        localStorage.setItem("hexis-dark-mode", JSON.stringify(isDarkMode));
    }, [isDarkMode, appliedColors]);

    // Update staged color
    const updateColor = (colorName, colorValue) => {
        setStagedColors((prev) => ({
            ...prev,
            [colorName]: colorValue,
        }));
    };

    // Apply staged colors to document and save to localStorage
    const applyColors = () => {
        setAppliedColors(stagedColors);
        localStorage.setItem("hexis-custom-colors", JSON.stringify(stagedColors));
    };

    // Discard staged changes and revert to applied colors
    const discardChanges = () => {
        setStagedColors({ ...appliedColors });
    };

    const resetColors = () => {
        setAppliedColors({});
        setStagedColors({});
        localStorage.removeItem("hexis-custom-colors");
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    const getColorValue = (colorName) => {
        const baseTheme = isDarkMode ? defaultDarkTheme : defaultLightTheme;
        return stagedColors[colorName] || baseTheme[colorName];
    };

    // Check if there are unsaved changes
    const hasChanges = JSON.stringify(stagedColors) !== JSON.stringify(appliedColors);

    return {
        isDarkMode,
        toggleDarkMode,
        stagedColors,
        appliedColors,
        updateColor,
        applyColors,
        discardChanges,
        resetColors,
        getColorValue,
        hasChanges,
        defaultLightTheme,
        defaultDarkTheme,
    };
};

export default useTheme;
