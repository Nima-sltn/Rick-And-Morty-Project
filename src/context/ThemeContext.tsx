import React, {
    createContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    ReactNode,
  } from "react";
  
  type Theme = "light" | "dark";
  
  interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
  }
  
  export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
  
  interface ThemeProviderProps {
    children: ReactNode;
  }
  
  export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme === "light" ? "light" : "dark";
    });
  
    useEffect(() => {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
  
    const toggleTheme = useCallback(() => {
      setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    }, []);
  
    const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  
    return (
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    );
  };
  