// Home.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Cards from './Cards';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { searchBiblePassage } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { useTheme } from "next-themes";
import VersionSelector from '@/components/VersionSelector';
import LoginDialog from '@/components/LoginDialog';
import { useLoginPrompt } from '@/hooks/useLoginPrompt';
import { useSession } from 'next-auth/react';
import { ClipLoader } from 'react-spinners';

const Home = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [version, setVersion] = useState('KJV');
  const { theme } = useTheme();
  const { showLoginPrompt, setShowLoginPrompt } = useLoginPrompt(searchResults);
  const { data: session, status } = useSession();

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved cards on mount
  useEffect(() => {
    // Always try to load from localStorage first
    try {
      const savedResults = localStorage.getItem('searchResults');
      if (savedResults) {
        // Convert to array, sort by timestamp (key), and convert back to object
        const savedCards = JSON.parse(savedResults);
        const sortedCards = Object.entries(savedCards)
          .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB))
          .reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value
          }), {});
        setSearchResults(sortedCards);
      }
    } catch (err) {
      console.error('Failed to load from localStorage:', err);
      localStorage.removeItem('searchResults');
    }

    // Additionally load from Supabase if logged in
    if (status === 'authenticated' && session) {
      loadSavedCards();
      syncLocalCards();
    }
  }, [session, status]);

  const loadSavedCards = async () => {
    try {
      const response = await fetch('/api/cards');
      console.log('Loading cards response:', response);
      if (response.ok) {
        const cards = await response.json();
        console.log('Loaded cards:', cards);
        const cardsObj = {};
        cards.reverse().forEach(card => {
          cardsObj[card.id] = {
            verse: card.verse,
            verseLocation: card.verse_location,
            query: card.query,
            version: card.version
          };
        });
        console.log('Formatted cards:', cardsObj);
        setSearchResults(cardsObj);
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
      toast.error('Failed to load saved cards');
    }
  };

  const syncLocalCards = async () => {
    try {
      const localCards = JSON.parse(localStorage.getItem('searchResults') || '{}');
      if (Object.keys(localCards).length === 0) return;
      
      const response = await fetch('/api/cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: localCards })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.synced > 0) {
          toast.success(`Synced ${result.synced} cards to cloud`);
        }
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Failed to sync cards with cloud');
    }
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery?.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await searchBiblePassage(searchQuery, version);
      
      if (!result) {
        throw new Error('No results found');
      }

      // Format the result object
      const cardData = {
        verse: result.verse,
        verseLocation: result.verseLocation,
        query: searchQuery,
        version
      };

      // Create timestamp for sorting
      const timestamp = Date.now();

      // Always update localStorage and local state first
      const newResults = {
        ...searchResults,
        [timestamp]: cardData
      };

      try {
        localStorage.setItem('searchResults', JSON.stringify(newResults));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
      setSearchResults(newResults);

      // Additionally save to database if logged in
      if (session) {
        try {
          const saveResponse = await fetch('/api/cards', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData),
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save to database');
          }

          const savedCard = await saveResponse.json();
          console.log('Saved to database:', savedCard);
        } catch (error) {
          console.error('Failed to save to database:', error);
          toast.error('Failed to sync with cloud');
        }
      }
      
      setQuery('');
      toast.success('Verse found!');
      
    } catch (error) {
      console.error('Search failed:', error);
      toast.error(error.message || 'Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }
    handleSearch(query);
  };

  const handleRefresh = async (queryToRefresh) => {
    handleSearch(queryToRefresh);
  };

  const handleDeleteCard = async (key) => {
    try {
      // Delete from database first if logged in
      if (session) {
        const response = await fetch(`/api/cards?verse_location=${searchResults[key].verseLocation}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete from database');
        }
      }

      // Always update local state and storage
      setSearchResults(prev => {
        const newResults = { ...prev };
        delete newResults[key];
        // Sort by timestamp before saving
        const sortedResults = Object.entries(newResults)
          .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB))
          .reduce((acc, [k, v]) => ({
            ...acc,
            [k]: v
          }), {});
        try {
          localStorage.setItem('searchResults', JSON.stringify(sortedResults));
        } catch (err) {
          console.error('Failed to update localStorage:', err);
        }
        return sortedResults;
      });
      
      toast.success('Card removed');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete card');
    }
  };

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* Background SVG - Hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block" aria-hidden="true">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 480 360" 
          className="w-full h-full opacity-[0.08] dark:opacity-[0.04]"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-navy-400" stopColor="currentColor" />
              <stop offset="100%" className="text-sage-400" stopColor="currentColor" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="blur" operator="over" in2="SourceGraphic" />
            </filter>
          </defs>
          <g className="animate-border-flow">
            <path 
              fill="none" 
              stroke="url(#borderGradient)" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5"
              filter="url(#glow)"
              className="border-path"
              d="M410 224.7a65 65 0 0 0 20-44.7 65 65 0 0 0-20-44.7V100h-20V60H90v40H70v35.3a65 65 0 0 0 0 89.4V260h20v40h300v-40h20v-35.3Z"
            />
          </g>
        </svg>
      </div>

      <Navbar />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-2 sm:pt-6 overflow-hidden relative">
        {/* Animated Open Book Icon and Title - Reduced top spacing */}
        <div className="flex flex-col items-center mb-3 sm:mb-6">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl animate-glow-1 bg-gradient-to-r from-navy-400/30 to-sage-400/30" />
            <div className="absolute inset-0 blur-xl animate-glow-2 bg-gradient-to-l from-navy-300/20 to-sage-300/20" />
            <div className="absolute inset-0 blur-lg animate-glow-3 bg-gradient-to-t from-navy-200/10 to-sage-200/10" />
            
            {/* Book icon */}
            <svg
              viewBox="0 0 24 24"
              className="relative w-10 h-10 sm:w-16 sm:h-16 animate-gradient mb-2 sm:mb-3"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                className="stroke-gradient"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-cinzel text-lg sm:text-3xl tracking-[0.2em] text-navy-800 dark:text-cream-100 font-semibold">
            HOLY BIBLE
          </h1>
        </div>

        {/* Search section - Adjusted heights */}
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 mb-2 sm:mb-4">
          <div className="flex flex-col sm:flex-row w-full bg-cream-50/80 dark:bg-navy-800/50 rounded-xl sm:rounded-2xl overflow-hidden border border-cream-200/20 dark:border-navy-700/20 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Input with reduced height on mobile */}
            <div className="flex-1 flex items-stretch">
              <Input
                type="text"
                placeholder="Search for verses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                className="flex-1 h-full min-h-[3rem] sm:min-h-[4rem] px-4 sm:px-8 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-base sm:text-xl placeholder:text-navy-400/60 dark:placeholder:text-cream-200/40 text-navy-800 dark:text-cream-50"
              />
            </div>

            {/* Version selector - Reduced height on mobile */}
            <div className="border-t sm:border-t-0 border-cream-200/50 dark:border-navy-700/50">
              <VersionSelector
                version={version}
                onVersionChange={setVersion}
                className="w-full sm:w-[100px] h-12 sm:h-16"
              />
            </div>

            {/* Search button - Reduced height on mobile */}
            <Button 
              onClick={() => handleSearch(query)}
              disabled={isLoading}
              className="relative z-20 h-12 sm:h-16 px-6 sm:px-12 rounded-none bg-gradient-to-r from-navy-600 to-sage-600 hover:from-navy-500 hover:to-sage-500 dark:from-navy-700 dark:to-navy-800 dark:hover:from-navy-600 dark:hover:to-navy-700 text-cream-50 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 focus:outline-none focus-visible:outline-none"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
              ) : (
                <>
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-base sm:text-lg font-medium">Search</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Three dots and loading spinner container */}
        <div className="relative w-full flex flex-col items-center">
          {/* Loading spinner - positioned below dots */}
          {isLoading && (
            <div className="mt-4">
            </div>
          )}
        </div>

        {/* Cards section - Adjusted height calculation */}
        <div className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)] overflow-hidden">
          <Cards
            results={searchResults}
            isLoading={isLoading}
            onRefresh={handleRefresh}
            onDelete={handleDeleteCard}
            version={version}
          />
        </div>
      </main>

      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </div>
  );
};

export default Home;


