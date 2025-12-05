import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always initialize to light
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Enforce light mode on mount and updates
    // We ignore system preference and local storage for dark mode
    setTheme('light');
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);

  // Keep toggleTheme as a no-op or forced set to light to prevent errors if used elsewhere
  const toggleTheme = () => {
    setTheme('light');
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
