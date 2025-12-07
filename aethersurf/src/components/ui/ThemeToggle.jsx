import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import Icon from '../AppIcon';
import Button from './Button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className={`
        w-10 h-10 rounded-md
        bg-background hover:bg-accent hover:text-accent-foreground
        transition-colors duration-300
        border border-input
        flex items-center justify-center
        ${theme === 'dark' ? 'dark:hover:bg-muted' : 'hover:bg-secondary'}
      `}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Icon 
          name="Sun" 
          size={20} 
          className="rotate-0 scale-100 transition-all duration-200 text-yellow-400" 
        />
      ) : (
        <Icon 
          name="Moon" 
          size={20} 
          className="rotate-0 scale-100 transition-all duration-200 text-slate-700" 
        />
      )}
    </Button>
  );
};

export default ThemeToggle;
