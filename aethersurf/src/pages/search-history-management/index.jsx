import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { useTheme } from '../../hooks/useTheme';
import HistoryCard from './components/HistoryCard';
import FilterToolbar from './components/FilterToolbar';
import BulkActionBar from './components/BulkActionBar';
import AnalyticsPanel from './components/AnalyticsPanel';
import ConfirmationModal from './components/ConfirmationModal';
import EmptyState from './components/EmptyState';
import Icon from '../../components/AppIcon';
import SearchResultViewer from '../../components/ui/SearchResultViewer';


const SearchHistoryManagement = () => {
  const navigate = useNavigate();
  
  // State management
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });
  const [selectedResult, setSelectedResult] = useState(null);

  // Mock search history data
  const mockHistoryData = [
    {
      id: 1,
      query: "How to implement React hooks for state management",
      model: "OpenAI",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      resultSummary: "Comprehensive guide on useState, useEffect, and custom hooks with practical examples.",
      resultCount: 15,
      responseTime: "2.3s",
      status: "success",
      isFavorite: true
    },
    {
      id: 2,
      query: "Best practices for API integration in modern web applications",
      model: "Ollama",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      resultSummary: "RESTful APIs, GraphQL, error handling, and authentication strategies.",
      resultCount: 23,
      responseTime: "1.8s",
      status: "success",
      isFavorite: false
    },
    {
      id: 3,
      query: "Machine learning algorithms for beginners",
      model: "OpenAI",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      resultSummary: "Introduction to supervised learning, neural networks, and practical implementations.",
      resultCount: 31,
      responseTime: "3.1s",
      status: "success",
      isFavorite: true
    },
    {
      id: 4,
      query: "CSS Grid vs Flexbox comparison",
      model: "OpenAI",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      resultSummary: "Layout comparison with use cases, browser support, and practical examples.",
      resultCount: 18,
      responseTime: "1.5s",
      status: "success",
      isFavorite: false
    },
    {
      id: 5,
      query: "Docker containerization best practices",
      model: "Ollama",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      resultSummary: "Container optimization, security considerations, and deployment strategies.",
      resultCount: 27,
      responseTime: "2.7s",
      status: "success",
      isFavorite: false
    },
    {
      id: 6,
      query: "JavaScript async/await vs Promises",
      model: "OpenAI",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      resultSummary: "Asynchronous programming patterns with error handling and performance considerations.",
      resultCount: 21,
      responseTime: "2.1s",
      status: "success",
      isFavorite: true
    }
  ];

  // Initialize data
  useEffect(() => {
    // Load from localStorage or use mock data
    const savedHistory = localStorage.getItem('searchHistory');
    const data = savedHistory ? JSON.parse(savedHistory) : mockHistoryData;
    setHistoryData(data);
    setFilteredData(data);
  }, []);

  // Filter and sort data
  useEffect(() => {
    let filtered = [...historyData];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.resultSummary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply model filter
    if (selectedModel !== 'all') {
      filtered = filtered.filter(entry => entry.model === selectedModel);
    }

    // Apply date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null;
        
        if (startDate && entryDate < startDate) return false;
        if (endDate && entryDate > endDate) return false;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'alphabetical':
          return a.query.localeCompare(b.query);
        case 'favorites':
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return new Date(b.timestamp) - new Date(a.timestamp);
        default: // newest
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    setFilteredData(filtered);
  }, [historyData, searchTerm, selectedModel, sortBy, dateRange]);

  // Selection handlers
  const handleSelectEntry = (id, isSelected) => {
    const newSelected = new Set(selectedEntries);
    if (isSelected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedEntries(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedEntries(new Set(filteredData.map(entry => entry.id)));
  };

  const handleDeselectAll = () => {
    setSelectedEntries(new Set());
  };

  // Action handlers
  const handleRerunSearch = (entry) => {
    // Navigate to search interface with pre-filled query
    navigate('/main-search-interface', { 
      state: { 
        query: entry.query, 
        model: entry.model 
      } 
    });
  };

  const handleViewResults = (entry) => {
    // Navigate to results display
    navigate('/search-results-display', { 
      state: { 
        query: entry.query, 
        model: entry.model,
        fromHistory: true
      } 
    });
  };

  const handleDeleteEntry = (id) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete-single',
      data: { id },
      title: 'Delete Search Entry',
      message: 'Are you sure you want to delete this search entry? This action cannot be undone.'
    });
  };

  const handleToggleFavorite = (id) => {
    const updatedData = historyData.map(entry =>
      entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
    );
    setHistoryData(updatedData);
    localStorage.setItem('searchHistory', JSON.stringify(updatedData));
  };

  // Bulk actions
  const handleBulkDelete = () => {
    setConfirmModal({
      isOpen: true,
      type: 'delete-bulk',
      data: { ids: Array.from(selectedEntries) },
      title: 'Delete Selected Entries',
      message: `Are you sure you want to delete ${selectedEntries.size} selected entries? This action cannot be undone.`
    });
  };

  const handleBulkFavorite = () => {
    const updatedData = historyData.map(entry =>
      selectedEntries.has(entry.id) ? { ...entry, isFavorite: !entry.isFavorite } : entry
    );
    setHistoryData(updatedData);
    localStorage.setItem('searchHistory', JSON.stringify(updatedData));
    setSelectedEntries(new Set());
  };

  const handleBulkExport = () => {
    const selectedData = historyData.filter(entry => selectedEntries.has(entry.id));
    const dataStr = JSON.stringify(selectedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `search-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSelectedEntries(new Set());
  };

  // Confirmation modal handler
  const handleConfirmAction = () => {
    const { type, data } = confirmModal;
    
    if (type === 'delete-single') {
      const updatedData = historyData.filter(entry => entry.id !== data.id);
      setHistoryData(updatedData);
      localStorage.setItem('searchHistory', JSON.stringify(updatedData));
    } else if (type === 'delete-bulk') {
      const updatedData = historyData.filter(entry => !data.ids.includes(entry.id));
      setHistoryData(updatedData);
      localStorage.setItem('searchHistory', JSON.stringify(updatedData));
      setSelectedEntries(new Set());
    } else if (type === 'clear-all') {
      setHistoryData([]);
      localStorage.removeItem('searchHistory');
      setSelectedEntries(new Set());
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedModel('all');
    setDateRange({ start: '', end: '' });
  };

  const allSelected = filteredData.length > 0 && selectedEntries.size === filteredData.length;

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <div className="pt-15 flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Filter Toolbar */}
          <FilterToolbar
            onSearchChange={setSearchTerm}
            onDateRangeChange={setDateRange}
            onModelFilter={setSelectedModel}
            onSortChange={setSortBy}
            selectedModel={selectedModel}
            sortBy={sortBy}
            searchTerm={searchTerm}
            totalEntries={filteredData.length}
            selectedCount={selectedEntries.size}
          />

          {/* History List */}
          <div className="flex-1 overflow-y-auto">
            {filteredData.length === 0 ? (
              <EmptyState
                type={historyData.length === 0 ? "no-history" : "no-results"}
                searchTerm={searchTerm}
                onAction={clearFilters}
              />
            ) : (
              <div className="p-6 space-y-4">
                {filteredData.map(entry => (
                  <HistoryCard
                    key={entry.id}
                    entry={entry}
                    isSelected={selectedEntries.has(entry.id)}
                    onSelect={handleSelectEntry}
                    onRerun={handleRerunSearch}
                    onDelete={handleDeleteEntry}
                    onToggleFavorite={handleToggleFavorite}
                    onViewResults={handleViewResults}
                    searchTerm={searchTerm}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <AnalyticsPanel historyData={historyData} />
        )}
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedEntries.size}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onBulkFavorite={handleBulkFavorite}
        totalCount={filteredData.length}
        allSelected={allSelected}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        type="destructive"
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Analytics Toggle Button (Mobile) */}
      <button
        className="lg:hidden fixed bottom-20 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-elevated flex items-center justify-center z-1000"
        onClick={() => setShowAnalytics(!showAnalytics)}
      >
        <Icon name="BarChart3" size={20} />
      </button>

      {/* Search Result Viewer */}
      {selectedResult && (
        <SearchResultViewer
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
};

export default SearchHistoryManagement;