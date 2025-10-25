import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const colors = isDarkMode
    ? {
        background: "#121212",
        card: "#1E1E1E",
        text: "#FFFFFF",
        primary: "#E33D57",
        switchThumb: "#fff",
        placeholder: "#888",
      }
    : {
        background: "#FDECF0",
        card: "#FCF8F9",
        text: "#000000",
        primary: "#E33D57",
        switchThumb: "#fff",
        placeholder: "#aaa",
      };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
