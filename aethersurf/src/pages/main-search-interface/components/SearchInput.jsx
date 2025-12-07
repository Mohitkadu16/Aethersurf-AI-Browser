import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchInput = ({ 
  onSearch, 
  searchHistory = [], 
  isLoading = false,
  placeholder = "Search with AI...",
  defaultQuery = "" 
}) => {
  const [query, setQuery] = useState(defaultQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (query.length > 0 && searchHistory.length > 0) {
      const filtered = searchHistory
        .filter(item => 
          item.query.toLowerCase().includes(query.toLowerCase()) && 
          item.query.toLowerCase() !== query.toLowerCase()
        )
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [query, searchHistory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.query);
    setShowSuggestions(false);
    onSearch(suggestion.query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
           ref={inputRef}
           type="search"
           placeholder={placeholder}
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           onKeyDown={handleKeyDown}
           onFocus={() => {
              if (filteredSuggestions.length > 0) {
               setShowSuggestions(true);
             }
            }}
           disabled={isLoading}
           className="pr-16 border-2 border-gray-700" // Updated for darker border
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={!query.trim() || isLoading}
              className="h-8 w-8 transition-smooth hover:bg-primary/10"
            >
              {isLoading ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <Icon name="Search" size={16} />
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background dark:bg-gray-900 border border-border dark:border-gray-700 rounded-lg shadow-lg dark:shadow-black/20 z-1000 max-h-64 overflow-y-auto"
        >
          <div className="p-2">
            <div className="text-xs text-muted-foreground dark:text-gray-400 mb-2 px-2">Recent searches</div>
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/10 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 group"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Icon name="Clock" size={14} className="text-muted-foreground dark:text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground dark:text-gray-200 truncate group-hover:text-primary dark:group-hover:text-primary transition-all duration-200">
                    {suggestion.query}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs font-mono text-muted-foreground dark:text-gray-500">
                      {suggestion.model}
                    </span>
                    <span className="text-xs text-muted-foreground dark:text-gray-500">
                      {new Date(suggestion.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Icon 
                  name="ArrowUpRight" 
                  size={12} 
                  className="text-muted-foreground dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary transition-all duration-200 opacity-0 group-hover:opacity-100" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;