"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Heart, Share2, Sparkles, ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import { signIn, signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from 'next/link';
import Image from 'next/image';

const ModernLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Natural Search",
      description: "Ask questions in your own words and find relevant scriptures instantly"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Multiple Translations", 
      description: "Choose from KJV, NKJV, and ACF translations for your study"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Save & Organize",
      description: "Build your personal collection of meaningful verses"
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Share Scripture",
      description: "Easily share verses with friends and family across platforms"
    }
  ];

  return (
    <div className="min-h-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Crosses */}
        <div className="absolute top-20 left-10 w-8 h-8 opacity-20 animate-float-slow">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div className="absolute top-40 right-20 w-6 h-6 opacity-15 animate-float-medium">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-1/4 w-10 h-10 opacity-25 animate-float-fast">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-400">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-300"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
        
        {/* Animated Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ask the Bible
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">About</Link>
              <Link href="/help" className="text-slate-600 hover:text-blue-600 transition-colors">Help</Link>
              
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {session ? (
                <div className="relative group">
                  <button className="flex items-center space-x-3 hover:bg-white/10 p-2 rounded-lg transition-colors">
                    <Image src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" width={32} height={32} />
                    <span className="text-sm font-medium text-white">{session.user.name}</span>
                    <ChevronDown className="w-4 h-4 text-white/80" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                        Signed in as {session.user.email}
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => signIn('google')}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="px-4 py-6 space-y-4">
                <Link href="/about" className="block text-slate-600 hover:text-blue-600">About</Link>
                <Link href="/help" className="block text-slate-600 hover:text-blue-600">Help</Link>
                {!session && (
                  <Button 
                    onClick={() => signIn('google')}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI • Find Scripture Instantly</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Ask the Bible
              </span>
              <br />
              <span className="text-slate-600 dark:text-slate-400 text-3xl sm:text-4xl lg:text-5xl">
                Find Answers in Scripture
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Search the Bible naturally with AI. Ask questions, find verses, and discover God&apos;s wisdom 
              for your life - all in beautiful, easy-to-share formats.
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto mt-12">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ask about love, hope, forgiveness..."
                  className="w-full pl-14 pr-32 py-6 text-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                  onClick={() => signIn('google')}
                  readOnly
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <select className="bg-transparent border-none text-sm font-medium text-slate-600 dark:text-slate-400 pr-8 cursor-pointer" onClick={() => signIn('google')}>
                    <option>KJV</option>
                    <option>NKJV</option>
                    <option>ACF</option>
                  </select>
                  {/* 
                    Button is styled for maximum contrast and visibility on both light and dark themes.
                    Uses Tailwind utility classes for color, shadow, and smooth hover transitions.
                    - bg-blue-600/dark:bg-blue-400: Ensures strong blue background in both themes.
                    - text-white/dark:text-navy-900: White text on light, deep navy on blue in dark for contrast.
                    - hover:scale-105: Subtle grow animation on hover.
                    - focus-visible:ring: Accessible focus ring.
                  */}
                  <Button
                    onClick={() => signIn('google')}
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
                    "
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Examples */}
           
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need for Bible study
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Designed to make Scripture accessible, searchable, and shareable for believers everywhere.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Verse Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Beautiful verse presentation
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Every verse is formatted beautifully and ready to share.
            </p>
          </div>

          {/* Sample Verse Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-3xl p-8 sm:p-12 text-center border border-blue-100 dark:border-blue-900/50"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                Question: Hope in difficult times
              </span>
            </div>
            
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-relaxed text-slate-800 dark:text-slate-200 mb-6">
              &ldquo;And we know that in all things God works for the good of those who love him, 
              who have been called according to his purpose.&rdquo;
            </blockquote>
            
            <cite className="text-lg font-medium text-blue-600 dark:text-blue-400">
              Romans 8:28 • KJV
            </cite>

            <div className="flex justify-center space-x-4 mt-8">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start your Bible study journey today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands discovering God&apos;s word through intelligent search and beautiful presentation.
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-semibold"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold">Ask the Bible</span>
            </div>
            
            <div className="flex space-x-8 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            © 2025 Ask the Bible. Made with ❤️ for the Body of Christ.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernLandingPage;
