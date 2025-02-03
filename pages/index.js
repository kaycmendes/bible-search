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

const Home = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('searchResults');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [version, setVersion] = useState('KJV');
  const { theme } = useTheme();

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Save to localStorage whenever searchResults changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('searchResults', JSON.stringify(searchResults));
    }
  }, [searchResults, mounted]);

  const handleSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      const result = await searchBiblePassage(searchQuery, version);
      setSearchResults(prev => [result, ...prev]);
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setSearchResults([]);
    localStorage.removeItem('searchResults');
    toast.success('Search history cleared');
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

  // Show loading state while mounting
  if (!mounted) {
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
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 overflow-hidden relative">
        {/* Animated Open Book Icon and Title */}
        <div className="flex flex-col items-center mb-8">
          {/* Glowing effect layers */}
          <div className="relative">
            <div className="absolute inset-0 blur-2xl animate-glow-1 bg-gradient-to-r from-navy-400/30 to-sage-400/30" />
            <div className="absolute inset-0 blur-xl animate-glow-2 bg-gradient-to-l from-navy-300/20 to-sage-300/20" />
            <div className="absolute inset-0 blur-lg animate-glow-3 bg-gradient-to-t from-navy-200/10 to-sage-200/10" />
            
            {/* Book icon */}
            <svg
              viewBox="0 0 24 24"
              className="relative w-16 h-16 sm:w-20 sm:h-20 animate-gradient mb-4"
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
          <h1 className="font-cinzel text-2xl sm:text-3xl tracking-[0.2em] text-navy-800 dark:text-cream-100 font-semibold">
            HOLY BIBLE
          </h1>
        </div>

        {/* Mobile-optimized search section */}
        <div className="flex flex-col gap-4 sm:gap-2 sm:flex-row">
          {/* Search input - Full width on mobile */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-2 sm:flex-row">
            <Input
              type="text"
              placeholder="Search for verses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              className="w-full h-12 sm:h-10 px-4 rounded-xl sm:rounded-lg bg-[#fffbf2] dark:bg-navy-800/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 dark:placeholder:text-cream-200/50 dark:text-cream-50 text-lg sm:text-base"
            />
            
            {/* Version selector - Full width on mobile */}
            <div className="w-full sm:w-auto sm:min-w-[140px]">
              <VersionSelector
                version={version}
                onVersionChange={setVersion}
                className="w-full h-12 sm:h-10 bg-[#fffbf2] dark:bg-navy-800/50 rounded-xl sm:rounded-lg"
              />
            </div>
          </div>

          {/* Search button - Full width on mobile */}
          <Button 
            onClick={() => handleSearch(query)}
            variant="default"
            className="w-full sm:w-auto h-12 sm:h-10 rounded-xl sm:rounded-lg flex items-center justify-center gap-2 text-cream-50 dark:text-navy-900 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-navy-600 to-sage-600 hover:from-navy-500 hover:to-sage-500 dark:from-cream-100 dark:to-cream-200 dark:hover:from-cream-50 dark:hover:to-cream-100"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span className="sm:hidden">Search</span>
              </>
            )}
          </Button>
        </div>

        {/* Add some space between search and results */}
        <div className="h-8" />

        {/* Cards section */}
        <Cards
          results={searchResults}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          version={version}
        />
      </main>
    </div>
  );
};

export default Home;

