import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const NavigationButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center space-x-4 mt-6">
      <Button
        onClick={() => navigate('/search-results-display')}
        variant="default"
        className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white"
      >
        <Icon name="FileText" size={16} />
        <span>View Results</span>
      </Button>
      <Button
        onClick={() => navigate('/search-history-management')}
        variant="default"
        className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white"
      >
        <Icon name="Clock" size={16} />
        <span>Search History</span>
      </Button>
    </div>
  );
};

export default NavigationButtons;
