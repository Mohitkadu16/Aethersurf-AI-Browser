import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterToolbar = ({ 
  onSearchChange, 
  onDateRangeChange, 
  onModelFilter, 
  onSortChange,
  selectedModel,
  sortBy,
  searchTerm,
  totalEntries,
  selectedCount
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handleDateRangeChange = (field, value) => {
    const newRange = { ...dateRange, [field]: value };
    setDateRange(newRange);
    if (onDateRangeChange) {
      onDateRangeChange(newRange);
    }
  };

  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    onSearchChange('');
    onModelFilter('all');
    onDateRangeChange({ start: '', end: '' });
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: 'ArrowDown' },
    { value: 'oldest', label: 'Oldest First', icon: 'ArrowUp' },
    { value: 'alphabetical', label: 'A-Z', icon: 'ArrowUpDown' },
    { value: 'favorites', label: 'Favorites First', icon: 'Star' }
  ];

  const modelOptions = [
    { value: 'all', label: 'All Models', icon: 'Layers' },
    { value: 'OpenAI', label: 'OpenAI', icon: 'Zap' },
    { value: 'Ollama', label: 'Ollama', icon: 'Cpu' }
  ];

  return (
    <div className="bg-background dark:bg-gray-900 border-b border-border dark:border-gray-800">
      <div className="p-4">
        {/* Main Filter Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search and Quick Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search in history..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              {/* Model Filter */}
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => onModelFilter(e.target.value)}
                  className="appearance-none bg-background dark:bg-gray-800 text-foreground dark:text-gray-200 border border-border dark:border-gray-700 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {modelOptions.map(option => (
                    <option key={option.value} value={option.value} className="dark:bg-gray-800 dark:text-gray-200">
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground dark:text-gray-400" 
                />
              </div>
              
              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="appearance-none bg-background dark:bg-gray-800 text-foreground dark:text-gray-200 border border-border dark:border-gray-700 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value} className="dark:bg-gray-800 dark:text-gray-200">
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-text-secondary" 
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              iconName="Filter"
              iconPosition="left"
              iconSize={16}
            >
              <span className="hidden sm:inline">Advanced</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-border dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="flex-1"
                  />
                  <span className="flex items-center text-muted-foreground dark:text-gray-400">to</span>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Quick Date Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const todayStr = today.toISOString().split('T')[0];
                      handleDateRangeChange('start', todayStr);
                      handleDateRangeChange('end', todayStr);
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                      handleDateRangeChange('start', weekAgo.toISOString().split('T')[0]);
                      handleDateRangeChange('end', today.toISOString().split('T')[0]);
                    }}
                  >
                    Last 7 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                      handleDateRangeChange('start', monthAgo.toISOString().split('T')[0]);
                      handleDateRangeChange('end', today.toISOString().split('T')[0]);
                    }}
                  >
                    Last 30 days
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
          <span>
            {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'} found
            {selectedCount > 0 && ` • ${selectedCount} selected`}
          </span>
          
          {(searchTerm || selectedModel !== 'all' || dateRange.start || dateRange.end) && (
            <span className="text-primary dark:text-primary">Filters active</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;