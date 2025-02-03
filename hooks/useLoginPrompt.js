import { useState, useEffect } from 'react';

export const useLoginPrompt = (searchResults) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  useEffect(() => {
    // Check if user has 3 or more cards and hasn't been prompted yet
    const resultsCount = Object.keys(searchResults || {}).length;
    const hasSeenPrompt = localStorage.getItem('hasSeenLoginPrompt');
    
    if (resultsCount >= 3 && !hasSeenPrompt && !hasPrompted) {
      setShowLoginPrompt(true);
      setHasPrompted(true);
      localStorage.setItem('hasSeenLoginPrompt', 'true');
    }
  }, [searchResults, hasPrompted]);

  return {
    showLoginPrompt,
    setShowLoginPrompt
  };
}; 