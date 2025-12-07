import React, { useEffect } from "react";
import Routes from "./Routes";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();
  
  useEffect(() => {
    // Apply the initial theme class to the HTML element
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
      <div className="pt-16">
        <Routes />
      </div>
    </div>
  );
}

export default App;
