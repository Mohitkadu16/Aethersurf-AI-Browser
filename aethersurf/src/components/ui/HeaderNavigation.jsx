import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

// Modal components for Settings and Help
const SettingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-gray-700">
          <h2 className="text-lg font-semibold text-foreground dark:text-white">Settings</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white">
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground dark:text-white">Appearance</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Customize how AetherSurf looks on your device</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground dark:text-white">Search Preferences</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Configure your default search settings</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground dark:text-white">Privacy</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Manage your data and privacy settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-gray-700">
          <h2 className="text-lg font-semibold text-foreground dark:text-white">Help & Support</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white">
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground dark:text-white">Quick Start Guide</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Learn the basics of using AetherSurf</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground dark:text-white">FAQ</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Find answers to commonly asked questions</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground dark:text-white">Contact Support</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">Get help from our support team</p>
          </div>
        </div>
      </div>
    </div>
  );
};
import ThemeToggle from './ThemeToggle';

const HeaderNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const navigationItems = [
    { path: '/main-search-interface', label: 'Search', icon: 'Search' },
    { path: '/search-results-display', label: 'Results', icon: 'FileText' },
    { path: '/search-history-management', label: 'History', icon: 'Clock' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/main-search-interface');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const { theme, toggleTheme } = useTheme();
  return (
    <header className="fixed top-0 left-0 right-0 bg-background dark:bg-gray-900 border-b border-border z-50 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-6 relative">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
          onClick={handleLogoClick}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground dark:text-white">AetherSurf</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActivePath(item.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              iconName={item.icon}
              iconPosition="left"
              iconSize={16}
              className="transition-smooth dark:text-white dark:hover:bg-gray-800"
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Desktop Utility Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="transition-smooth"
          >
            <Icon name="Settings" size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsHelpOpen(true)}
            className="transition-smooth"
          >
            <Icon name="HelpCircle" size={18} />
          </Button>
        </div>

        {/* Settings Modal */}
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />

        {/* Help Modal */}
        <HelpModal 
          isOpen={isHelpOpen} 
          onClose={() => setIsHelpOpen(false)} 
        />

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden transition-smooth"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border dark:bg-gray-900 shadow-elevated">
          <div className="px-4 py-3 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActivePath(item.path) ? "default" : "ghost"}
                fullWidth
                onClick={() => handleNavigation(item.path)}
                iconName={item.icon}
                iconPosition="left"
                iconSize={16}
                className="justify-start transition-smooth"
              >
                {item.label}
              </Button>
            ))}
            <div className="border-t border-light pt-2 mt-3">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
                className="justify-start transition-smooth"
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsHelpOpen(true);
                }}
                iconName="HelpCircle"
                iconPosition="left"
                iconSize={16}
                className="justify-start transition-smooth"
              >
                Help
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={toggleTheme}
                iconName={theme === 'dark' ? 'Sun' : 'Moon'}
                iconPosition="left"
                iconSize={16}
                className="justify-start transition-smooth"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderNavigation;