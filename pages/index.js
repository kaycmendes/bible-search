// Home.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import Cards from './Cards';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { searchBiblePassage } from '@/utils/api';
import { toast } from 'react-hot-toast';
import { useTheme } from "next-themes";

const Home = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchBiblePassage(query);
      setSearchResults([result, ...searchResults]);
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="gradient-heading text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Explore Biblical Wisdom
          </h1>
          <p className="text-xl text-muted-foreground">
            Ask questions and discover relevant scripture passages
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex gap-2 mb-12">
          <Input
            type="text"
            placeholder="What does the Bible say about..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 search-bar"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2">Search</span>
          </Button>
        </form>

        <div className="max-w-3xl mx-auto">
          <Cards results={searchResults} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Home;

