// Home.jsx
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from "next-themes";
import { toast } from 'react-hot-toast';
import { useAuthListener } from '../hooks/useAuthListener';
import ModernLandingPage from '@/components/ModernLandingPage';
import ModernSearchInterface from '@/components/ModernSearchInterface';
import ModernVerseCard from '@/components/ModernVerseCard';
import AppNavbar from '@/components/AppNavbar';
import { ChevronDown, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Home = () => {
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [version, setVersion] = useState('KJV');
  const [globalLayout, setGlobalLayout] = useState('vertical'); // 'vertical' or 'horizontal'
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Call the authentication listener hook
  useAuthListener();

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved cards on mount
  useEffect(() => {
    if (status === 'authenticated' && session) {
      loadSavedCards();
    }
  }, [session, status]);

  const loadSavedCards = async () => {
    try {
      // Load from localStorage
      const localCards = JSON.parse(localStorage.getItem('searchResults') || '{}');
      setSearchResults(localCards);

      // Try to load from database
      try {
        const response = await fetch('/api/cards');
        if (response.ok) {
          const cards = await response.json();
          const cardsObj = {};
          cards.reverse().forEach((card, index) => {
            const cardId = card.id || card.verse_location || `card_${index}`;
            cardsObj[cardId] = {
              verse: card.verse,
              verseLocation: card.verse_location,
              query: card.query,
              version: card.version
            };
          });
          setSearchResults(cardsObj);
        }
      } catch (error) {
        console.error('Failed to load cards from database:', error);
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    const timestamp = Date.now();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          version: version,
          lastVerse: ''
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.verse && data.verseLocation) {
        const newCard = {
          verse: data.verse,
          verseLocation: data.verseLocation,
          query: searchQuery,
          version: version
        };

        // Save to localStorage
        const updatedResults = {
          ...searchResults,
          [timestamp]: newCard
        };
        setSearchResults(updatedResults);
        localStorage.setItem('searchResults', JSON.stringify(updatedResults));

        // Try to save to database
        try {
          await fetch('/api/cards', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              verse: data.verse,
              verse_location: data.verseLocation,
              query: searchQuery,
              version: version
            }),
          });
        } catch (error) {
          console.error('Failed to save to database:', error);
        }

        toast.success('Verse found!', {
          icon: '✅',
          duration: 3000
        });
      } else {
        toast.error('No verse found. Try a different search term.', {
          icon: '❌',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.', {
        icon: '❌',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (timestamp) => {
    const card = searchResults[timestamp];
    if (!card) return;

    setIsLoading(true);
    const newTimestamp = Date.now();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: card.query,
          version: card.version,
          lastVerse: card.verseLocation
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.verse && data.verseLocation) {
        const newCard = {
          verse: data.verse,
          verseLocation: data.verseLocation,
          query: card.query,
          version: card.version
        };

        const updatedResults = {
          ...searchResults,
          [newTimestamp]: newCard
        };
        setSearchResults(updatedResults);
        localStorage.setItem('searchResults', JSON.stringify(updatedResults));

        // Try to save to database
        try {
          await fetch('/api/cards', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCard),
          });
        } catch (error) {
          console.error('Failed to save to database:', error);
        }

        toast.success('New verse added!', {
          icon: '✨',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Refresh failed:', error);
      toast.error('Failed to generate new verse. Please try again.', {
        icon: '❌',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (timestamp) => {
    const updatedResults = { ...searchResults };
    delete updatedResults[timestamp];
    setSearchResults(updatedResults);
    localStorage.setItem('searchResults', JSON.stringify(updatedResults));

    // Try to delete from database
    try {
      const cardToDelete = searchResults[timestamp];
      if (cardToDelete?.verseLocation) {
        await fetch(`/api/cards?verse_location=${encodeURIComponent(cardToDelete.verseLocation)}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error('Failed to delete from database:', error);
    }

    toast.success('Card deleted!', {
      icon: '✅',
      duration: 3000
    });
  };

    const handleGenerateAnother = async (query) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    const timestamp = Date.now();
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          version: version,
          lastVerse: Object.values(searchResults)[0]?.verseLocation || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      const newCard = {
        verse: data.verse,
        verseLocation: data.verseLocation,
        query: query.trim(),
        version: version
      };

      // Save to localStorage
      const updatedResults = {
        ...searchResults,
        [timestamp]: newCard
      };
      setSearchResults(updatedResults);
      localStorage.setItem('searchResults', JSON.stringify(updatedResults));

      // Try to save to database
      try {
        await fetch('/api/cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCard),
        });
      } catch (error) {
        console.error('Failed to save to database:', error);
      }

      toast.success('Generated new verse!', {
        icon: '✨',
        duration: 3000
      });
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to generate new verse', {
        icon: '❌',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudyScripture = (verseLocation, verse) => {
    // Parse verse location to get book, chapter, and verse
    const match = verseLocation.match(/(\w+)\s+(\d+):(\d+)/);
    if (match) {
      const [, book, chapter, verseNum] = match;
      const bookAbbr = book.toLowerCase().substring(0, 3);
      const blueLetterUrl = `https://www.blueletterbible.org/kjv/${bookAbbr}/${chapter}/${verseNum}/`;
      
      // Open Blue Letter Bible in new tab
      window.open(blueLetterUrl, '_blank');
    } else {
      toast.error('Could not parse verse location', {
        icon: '❌',
        duration: 3000
      });
    }
  };

  const handleVersionChange = (newVersion) => {
    setVersion(newVersion);
    console.log('Version changed to:', newVersion);
  };

  if (!mounted) return null;

  // Show landing page for unauthenticated users
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <ModernLandingPage />
      </div>
    );
  }

  // Show loading state
  if (status === 'loading' || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Main app for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* App Navbar */}
      <AppNavbar />

      {/* Animated Background Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Crosses */}
        <div className="absolute top-20 left-10 w-8 h-8 opacity-20 animate-float-slow">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 w-6 h-6 opacity-15 animate-float-medium">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
        <div className="absolute bottom-32 left-1/4 w-10 h-10 opacity-25 animate-float-fast">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>

        {/* Geometric Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-300" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Animated Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Additional Biblical Patterns */}
        <div className="absolute top-1/3 right-10 w-12 h-12 opacity-10 animate-float-slow">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-indigo-400">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <div className="absolute bottom-1/4 right-1/3 w-8 h-8 opacity-15 animate-float-medium">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-slate-400">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>

        {/* More Biblical Symbols */}
        <div className="absolute top-1/2 left-1/3 w-6 h-6 opacity-20 animate-float-fast">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-500">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
          </svg>
        </div>

        <div className="absolute top-2/3 right-1/4 w-10 h-10 opacity-15 animate-float-slow">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-indigo-500">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Subtle Dot Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/6 left-1/6 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/6 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* Modern Search Interface */}
      <ModernSearchInterface
        results={searchResults}
        isLoading={isLoading}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onDelete={handleDelete}
        version={version}
        onVersionChange={handleVersionChange}
        session={session}
      />

      {/* Centered Search Result Display */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {isLoading ? (
            /* Loading Animation with Wave Effect */
            <div className="space-y-6">
              <div className="flex justify-center space-x-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse max-w-md mx-auto"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse max-w-sm mx-auto"></div>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Searching the Bible...</p>
            </div>
          ) : Object.keys(searchResults).length > 0 ? (
            /* Current Search Result */
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
                <span>Latest Search</span>
              </div>

              {/* Get the most recent card */}
              {(() => {
                const latestCard = Object.entries(searchResults)
                  .sort(([a], [b]) => parseInt(b) - parseInt(a))[0];
                const card = latestCard[1];

                return (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700">
                    <div className="mb-6">
                      <div className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-full mb-4">
                        Question: {card.query}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        Version: {card.version}
                      </div>
                    </div>

                    <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-relaxed text-slate-800 dark:text-slate-200 mb-6">
                      &ldquo;{card.verse}&rdquo;
                    </blockquote>

                    <cite className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                      {card.verseLocation}
                    </cite>

                    <div className="flex justify-center space-x-4 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => handleGenerateAnother(card.query)}
                        className="px-6 py-2 border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Generate New
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleStudyScripture(card.verseLocation, card.verse)}
                        className="px-6 py-2 border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 hover:bg-green-50 hover:border-green-400 hover:text-green-700 dark:hover:bg-green-950/50 dark:hover:border-green-500 dark:hover:text-green-300"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Study Scripture
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Placeholder for No Searches Yet */
            <div className="space-y-6">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto animate-pulse"></div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">
                  Ready to Search the Bible?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Use the search bar above to ask questions about love, hope, forgiveness, or any topic you&apos;d like to explore in Scripture.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Foldable Collection Section */}
      {Object.keys(searchResults).length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <details className="group" open>
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-center space-x-3 mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Your Bible Study Collection
                  </h2>
                  <ChevronDown className="w-6 h-6 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" />
                </div>
              </summary>

                             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                 {Object.entries(searchResults)
                   .sort(([a], [b]) => parseInt(b) - parseInt(a))
                   .map(([timestamp, card]) => (
                     <motion.div
                       key={timestamp}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
                       className="group bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-600 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden relative min-h-[320px]"
                     >
                       {/* Header Section */}
                       <div className="mb-8">
                         <div className="flex items-start justify-between mb-4">
                           <div className="flex-1 mr-4">
                             <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full mb-3 line-clamp-2">
                               <span className="truncate">{card.query}</span>
                             </div>
                           </div>
                           <div className="flex-shrink-0">
                             <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg">
                               {card.version}
                             </span>
                           </div>
                         </div>
                       </div>

                       {/* Verse Content */}
                       <div className="mb-8 flex-1">
                         <blockquote className="text-base leading-relaxed font-serif text-slate-800 dark:text-slate-200 mb-6 line-clamp-5 italic">
                           &ldquo;{card.verse}&rdquo;
                         </blockquote>
                         
                         <cite className="text-base font-semibold text-blue-600 dark:text-blue-400 block">
                           {card.verseLocation}
                         </cite>
                       </div>

                       {/* Action Buttons */}
                       <div className="flex items-center space-x-4">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleRefresh(timestamp)}
                           className="flex-1 h-10 px-4 text-sm border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700 dark:hover:bg-amber-950/50 dark:hover:border-amber-500 dark:hover:text-amber-300 transition-all duration-200"
                         >
                           <RefreshCw className="w-4 h-4 mr-2" />
                           Another
                         </Button>
                         
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleGenerateAnother(card.query)}
                           className="flex-1 h-10 px-4 text-sm border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 dark:hover:bg-indigo-950/50 dark:hover:border-indigo-500 dark:hover:text-indigo-300 transition-all duration-200"
                         >
                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                           </svg>
                           New
                         </Button>
                         
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleDelete(timestamp)}
                           className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-300 transition-all duration-200"
                         >
                           <Trash2 className="w-5 h-5" />
                         </Button>
                       </div>
                     </motion.div>
                   ))}
              </div>
            </details>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;


