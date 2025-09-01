"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search, Sparkles, BookOpen, Clock, Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModernVerseCard from './ModernVerseCard';
import VersionSelector from './VersionSelector';
import { toast } from 'react-hot-toast';

const ModernSearchInterface = ({
  results = {},
  isLoading = false,
  onSearch,
  onRefresh,
  onDelete,
  version = 'KJV',
  onVersionChange,
  session = null
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  // Sample recent searches for demo
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  }, []);

  const addToRecentSearches = (searchQuery) => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [searchQuery, ...recent.filter(s => s !== searchQuery)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated.slice(0, 5));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    if (!session) {
      toast.error('Please sign in to search the Bible', {
        icon: '🔒',
        duration: 3000
      });
      return;
    }
    
    addToRecentSearches(query.trim());
    await onSearch(query.trim());
  };

  const handleSuggestionClick = (suggestion) => {
    if (!session) {
      toast.error('Please sign in to search the Bible', {
        icon: '🔒',
        duration: 3000
      });
      return;
    }
    
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  const suggestions = [
    'How do I find peace in difficult times?',
    'What does the Bible say about love?',
    'Verses about forgiveness',
    'God\'s plan for my life',
    'Strength in weakness',
    'Hope for the future'
  ];

  const resultsArray = Object.entries(results || {}).reverse();

  return (
    <div className="min-h-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Search Header */}
      <div className="sticky top-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ask the Bible
              </span>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about love, hope, forgiveness, or any topic..."
                className="w-full pl-14 pr-48 py-6 text-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                disabled={isLoading}
              />
              
              <div className="absolute inset-y-0 right-2 flex items-center space-x-2">
                {/* Voice Search */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={startVoiceSearch}
                  disabled={isLoading || !('webkitSpeechRecognition' in window)}
                  className={`p-3 rounded-xl ${isListening ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                </Button>

                {/* Version Selector */}
                <VersionSelector
                  version={version}
                  onVersionChange={onVersionChange}
                  className="min-w-[80px]"
                />
                
                {/* Search Button */}
                <Button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="
                    ml-2
                    px-6 py-3
                    rounded-xl font-semibold
                    shadow-lg hover:shadow-xl
                    bg-blue-600 text-white
                    dark:bg-blue-400 dark:text-navy-900
                    transition-all duration-200
                    hover:bg-blue-700 dark:hover:bg-blue-300
                    hover:scale-105
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Searching
                    </div>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Search Suggestions */}
          {!isLoading && resultsArray.length === 0 && (
            <div className="mt-8">
              <div className="flex flex-wrap justify-center gap-3">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950/50 transition-all"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-950/50 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Searching Scripture...
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Finding the perfect verse for your question
              </p>
            </motion.div>
          )}

          {!isLoading && resultsArray.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Ready to search Scripture
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Ask any question and discover God&apos;s wisdom in His Word
              </p>
            </motion.div>
          )}

         

        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernSearchInterface;
