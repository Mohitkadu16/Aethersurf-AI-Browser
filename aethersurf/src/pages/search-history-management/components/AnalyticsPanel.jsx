import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalyticsPanel = ({ historyData }) => {
  // Calculate analytics from history data
  const calculateAnalytics = () => {
    if (!historyData || historyData.length === 0) {
      return {
        totalSearches: 0,
        modelUsage: { OpenAI: 0, Ollama: 0 },
        topQueries: [],
        storageUsed: 0,
        averageResponseTime: 0,
        successRate: 0
      };
    }

    const totalSearches = historyData.length;
    const modelUsage = historyData.reduce((acc, entry) => {
      acc[entry.model] = (acc[entry.model] || 0) + 1;
      return acc;
    }, { OpenAI: 0, Ollama: 0 });

    // Get top queries by frequency
    const queryFrequency = historyData.reduce((acc, entry) => {
      const query = entry.query.toLowerCase();
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {});

    const topQueries = Object.entries(queryFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([query, count]) => ({ query, count }));

    // Calculate storage (rough estimate)
    const storageUsed = Math.round(JSON.stringify(historyData).length / 1024); // KB

    // Calculate average response time
    const responseTimes = historyData
      .filter(entry => entry.responseTime)
      .map(entry => parseFloat(entry.responseTime.replace('s', '')));
    const averageResponseTime = responseTimes.length > 0 
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2)
      : 0;

    // Calculate success rate
    const successfulSearches = historyData.filter(entry => entry.status === 'success').length;
    const successRate = totalSearches > 0 ? Math.round((successfulSearches / totalSearches) * 100) : 0;

    return {
      totalSearches,
      modelUsage,
      topQueries,
      storageUsed,
      averageResponseTime,
      successRate
    };
  };

  const analytics = calculateAnalytics();

  const StatCard = ({ icon, label, value, color = "var(--color-text-primary)" }) => (
    <div className="bg-card dark:bg-gray-800/50 border border-border dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-muted dark:bg-gray-700">
          <Icon name={icon} size={20} className={`text-${color.split('--color-')[1]}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground dark:text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-foreground dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, max, color = "var(--color-primary)" }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground dark:text-gray-400">{label}</span>
          <span className="text-foreground dark:text-white font-medium">{value}</span>
        </div>
        <div className="w-full bg-muted dark:bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-smooth"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full lg:w-80 bg-background dark:bg-gray-900 border-l border-border dark:border-gray-800 p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Icon name="BarChart3" size={20} className="text-primary dark:text-primary" />
        <h2 className="text-lg font-semibold text-foreground dark:text-white">Analytics</h2>
      </div>

      {/* Quick Stats */}
      <div className="space-y-4">
        <StatCard 
          icon="Search" 
          label="Total Searches" 
          value={analytics.totalSearches}
          color="var(--color-primary)"
        />
        
        <StatCard 
          icon="Clock" 
          label="Avg Response Time" 
          value={`${analytics.averageResponseTime}s`}
          color="var(--color-accent)"
        />
        
        <StatCard 
          icon="CheckCircle" 
          label="Success Rate" 
          value={`${analytics.successRate}%`}
          color="var(--color-success)"
        />
        
        <StatCard 
          icon="HardDrive" 
          label="Storage Used" 
          value={`${analytics.storageUsed} KB`}
          color="var(--color-secondary)"
        />
      </div>

      {/* Model Usage */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground dark:text-white flex items-center space-x-2">
          <Icon name="Cpu" size={16} className="text-foreground dark:text-white" />
          <span>Model Usage</span>
        </h3>
        
        <div className="space-y-3">
          <ProgressBar 
            label="OpenAI" 
            value={analytics.modelUsage.OpenAI} 
            max={analytics.totalSearches}
            color="var(--color-primary)"
          />
          <ProgressBar 
            label="Ollama" 
            value={analytics.modelUsage.Ollama} 
            max={analytics.totalSearches}
            color="var(--color-secondary)"
          />
        </div>
      </div>

      {/* Top Queries */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground dark:text-white flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="text-foreground dark:text-white" />
          <span>Most Frequent Queries</span>
        </h3>
        
        {analytics.topQueries.length > 0 ? (
          <div className="space-y-2">
            {analytics.topQueries.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-card dark:bg-gray-800/50 rounded-md">
                <span className="text-sm text-foreground dark:text-white truncate flex-1 mr-2">
                  {item.query}
                </span>
                <span className="text-xs font-medium text-muted-foreground dark:text-gray-400 bg-muted dark:bg-gray-700 px-2 py-1 rounded">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Icon name="Search" size={24} className="text-muted-foreground dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground dark:text-gray-400">No search data yet</p>
          </div>
        )}
      </div>

      {/* Storage Management */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground dark:text-white flex items-center space-x-2">
          <Icon name="Database" size={16} className="text-foreground dark:text-white" />
          <span>Storage Management</span>
        </h3>
        
        <div className="bg-card dark:bg-gray-800/50 border border-border dark:border-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground dark:text-gray-400">Local Storage</span>
            <span className="text-xs font-medium text-foreground dark:text-white">
              {analytics.storageUsed} KB / 5 MB
            </span>
          </div>
          <div className="w-full bg-muted dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-primary dark:bg-primary transition-smooth"
              style={{ width: `${Math.min((analytics.storageUsed / 5120) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground dark:text-gray-400 mt-2">
            {Math.round(((5120 - analytics.storageUsed) / 5120) * 100)}% available
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 pt-4 border-t border-border dark:border-gray-800">
        <button className="w-full flex items-center space-x-2 p-2 text-sm text-muted-foreground dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-md transition-smooth">
          <Icon name="Download" size={16} />
          <span>Export All Data</span>
        </button>
        
        <button className="w-full flex items-center space-x-2 p-2 text-sm text-muted-foreground dark:text-gray-400 hover:text-destructive dark:hover:text-red-400 hover:bg-destructive/5 dark:hover:bg-red-500/10 rounded-md transition-smooth">
          <Icon name="Trash2" size={16} />
          <span>Clear All History</span>
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPanel;