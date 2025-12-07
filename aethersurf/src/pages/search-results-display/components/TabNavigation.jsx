import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, resultCounts = {} }) => {
  const tabs = [
    {
      id: 'steps',
      label: 'Steps/Text Response',
      icon: 'FileText',
      count: resultCounts.steps || 0
    },
    {
      id: 'images',
      label: 'Images/References',
      icon: 'Image',
      count: resultCounts.images || 0
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: 'Play',
      count: resultCounts.videos || 0
    }
  ];

  return (
    <div className="border-b border-border dark:border-gray-800 bg-background dark:bg-gray-900">
      <div className="px-6">
        <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth
                ${activeTab === tab.id
                  ? 'border-primary text-primary dark:text-primary bg-primary/5 dark:bg-primary/10' 
                  : 'border-transparent text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 hover:border-border-active dark:hover:border-gray-600'
                }
              `}
            >
              <Icon 
                name={tab.icon} 
                size={16} 
                className={activeTab === tab.id ? 'text-primary dark:text-primary' : 'text-muted-foreground dark:text-gray-400'} 
              />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${activeTab === tab.id
                    ? 'bg-primary text-white dark:bg-primary dark:text-white' 
                    : 'bg-muted dark:bg-gray-800 text-muted-foreground dark:text-gray-400'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;