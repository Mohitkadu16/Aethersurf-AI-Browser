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
      className="
        w-10 h-10 rounded-md
        bg-white dark:bg-gray-800
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-300
        border border-gray-300 dark:border-gray-700
        flex items-center justify-center
      "
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
          className="rotate-0 scale-100 transition-all duration-200 text-gray-700 dark:text-gray-300" 
        />
      )}
    </Button>
  );
};

export default ThemeToggle;
