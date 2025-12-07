import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import SearchResultsDisplay from "pages/search-results-display";
import MainSearchInterface from "pages/main-search-interface";
import SearchHistoryManagement from "pages/search-history-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<MainSearchInterface />} />
        <Route path="/search-results-display" element={<SearchResultsDisplay />} />
        <Route path="/main-search-interface" element={<MainSearchInterface />} />
        <Route path="/search-history-management" element={<SearchHistoryManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;