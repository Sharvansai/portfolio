"use client";
import React, { useEffect, useState, createContext, useContext } from "react";
import { getSharvanBaseData, SharvanBaseConfig } from "@/lib/sharvan-base-data";

interface ThemeContextType {
  theme: {
    accentColor: string;
    accentName: string;
    secondaryColor?: string;
  };
  setThemeColor: (color: string, name: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: { accentColor: "#c084fc", accentName: "Electric Violet" },
  setThemeColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState({
    accentColor: "#c084fc",
    accentName: "Electric Violet",
    secondaryColor: "#38bdf8",
  });

  const applyThemeToDOM = (accentColor: string) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.style.setProperty("--accent-color", accentColor);
    root.style.setProperty("--accent-glow", `${accentColor}80`);
    root.style.setProperty("--accent-glow-subtle", `${accentColor}25`);
    root.style.setProperty("--theme-accent", accentColor);

    // Convert hex to rgb for rgba() utilities
    const hex = accentColor.replace("#", "");
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      root.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
    }
  };

  const syncFromStorage = () => {
    const data = getSharvanBaseData();
    if (data.theme?.accentColor) {
      setCurrentTheme({
        accentColor: data.theme.accentColor,
        accentName: data.theme.accentName || "Custom Theme",
        secondaryColor: "#38bdf8",
      });
      applyThemeToDOM(data.theme.accentColor);
    }
  };

  useEffect(() => {
    syncFromStorage();

    const handleUpdate = () => {
      syncFromStorage();
    };

    window.addEventListener("sharvan-base-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("sharvan-base-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const setThemeColor = (color: string, name: string) => {
    setCurrentTheme({ accentColor: color, accentName: name, secondaryColor: "#38bdf8" });
    applyThemeToDOM(color);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
