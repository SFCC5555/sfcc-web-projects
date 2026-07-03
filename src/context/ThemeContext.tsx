import React, { createContext, useContext, useState } from "react";
import { Mode } from "../types";

interface ThemeContextValue {
  mode: Mode;
  controlDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "Dark",
  controlDarkMode: () => {},
});

const stored = localStorage.getItem("mode");
const initialMode: Mode = stored === "Light" ? "Light" : "Dark";

initialMode === "Light"
  ? document.body.classList.add("lightMode")
  : document.body.classList.remove("lightMode");

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(initialMode);

  function controlDarkMode() {
    const next: Mode = mode === "Light" ? "Dark" : "Light";
    setMode(next);
    localStorage.setItem("mode", next);
    document.body.classList.toggle("lightMode");
  }

  return (
    <ThemeContext.Provider value={{ mode, controlDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

export { ThemeProvider, useTheme };
