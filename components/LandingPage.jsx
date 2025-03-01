import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Search, Book, Bookmark, MessageCircle, RefreshCw, ArrowRight, Sun, Moon, ChevronDown } from "lucide-react";
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';
import { useTheme } from "next-themes";
import Link from 'next/link';

const exampleCards = [
  {
    verse: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    verseLocation: "John 3:16",
    query: "How do I go to heaven?"
  },
  {
    verse: "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God; and the peace of God, which surpasses all understanding, will guard your hearts and minds through Christ Jesus.",
    verseLocation: "Philippians 4:6-7",
    query: "I'm feeling anxious about my exam"
  },
  {
    verse: "Trust in the LORD with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.",
    verseLocation: "Proverbs 3:5-6",
    query: "I don't know what to do with my life"
  }
];

const featureList = [
  {
    icon: <Search className="h-6 w-6 text-navy-600 dark:text-cream-100" />,
    title: "Search with AI",
    description: "Ask questions in natural language and get relevant verses that answer your queries."
  },
  {
    icon: <Book className="h-6 w-6 text-navy-600 dark:text-cream-100" />,
    title: "Multiple Translations",
    description: "Access different Bible versions including KJV, NIV, ESV, and more."
  },
  {
    icon: <Bookmark className="h-6 w-6 text-navy-600 dark:text-cream-100" />,
    title: "Save Favorites",
    description: "Build your personal collection of meaningful Bible passages."
  },
  {
    icon: <RefreshCw className="h-6 w-6 text-navy-600 dark:text-cream-100" />,
    title: "Generate Alternatives",
    description: "Find different verses on the same topic with just one click."
  }
];

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 18,
      stiffness: 50
    }
  }
};

const heroTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 18,
      stiffness: 50,
      delay: 0.2
    }
  }
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 18,
      stiffness: 60
    }
  }
};

// Background particle animation
const particleVariants = {
  initial: { 
    y: 0,
    opacity: 0.3,
  },
  animate: {
    y: -10,
    opacity: 0.7,
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay: Math.random() * 2,
    }
  }
};

// Floating animation for decorative elements
const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const moveUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      damping: 25
    }
  }
};

const Particle = ({ className }) => (
  <motion.div
    className={`absolute rounded-full bg-gradient-to-r from-navy-500/10 to-sage-500/10 dark:from-navy-400/5 dark:to-sage-400/5 blur-sm ${className}`}
    variants={particleVariants}
    initial="initial"
    animate="animate"
  />
);

const ExampleCard = ({ verse, verseLocation, query, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      delay: index * 0.2,
      duration: 0.5,
      type: "spring",
      damping: 15
    }}
    whileHover={{ 
      scale: 1.02, 
      boxShadow: "0 10px 30px -15px rgba(0,0,0,0.15)",
      transition: { duration: 0.2 }
    }}
    className="w-full"
  >
    <Card className="w-full h-full border border-cream-200 dark:border-navy-700 shadow-md hover:shadow-xl transition-all bg-white dark:bg-navy-800/70 overflow-hidden backdrop-blur-sm">
      <CardHeader className="pb-2 bg-cream-50/70 dark:bg-navy-800/90 border-b border-cream-200/50 dark:border-navy-700/50">
        <CardTitle className="flex justify-between items-start">
          <span className="text-sm font-medium text-navy-800 dark:text-cream-100 p-1">
            "{query}"
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-3 bg-white dark:bg-navy-800/70">
        <div className="mb-2">
          <p className="scripture-text text-navy-700 dark:text-cream-100 text-sm leading-relaxed line-clamp-4 sm:line-clamp-5 p-4">{verse}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-navy-600 dark:text-cream-200 p-4">
            {verseLocation}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const FeatureItem = ({ icon, title, description }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ 
      scale: 1.03, 
      transition: { duration: 0.2 }
    }}
    className="flex flex-col items-center text-center p-6 rounded-lg bg-white/60 dark:bg-navy-800/40 backdrop-blur-sm border border-cream-200/30 dark:border-navy-700/30 shadow-sm hover:shadow-md transition-all"
  >
    <div className="mb-4 p-4 rounded-full bg-cream-100 dark:bg-navy-700 flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2 text-navy-800 dark:text-cream-50">{title}</h3>
    <p className="text-navy-600 dark:text-cream-200 text-sm">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Wait until mounted to avoid hydration mismatch with theme
  useEffect(() => {
    setMounted(true);
    
    // Add scroll listener for navbar transparency
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50/90 via-white/80 to-white dark:from-navy-900/95 dark:via-navy-950/80 dark:to-navy-950 z-0"></div>
      
      {/* Animated background particles - keep but make more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <Particle className="w-3 h-3 top-[15%] left-[10%] opacity-15" />
        <Particle className="w-2 h-2 top-[25%] left-[20%] opacity-20" />
        <Particle className="w-4 h-4 top-[10%] left-[30%] opacity-15" />
        <Particle className="w-2 h-2 top-[40%] left-[40%] opacity-15" />
        <Particle className="w-3 h-3 top-[20%] left-[50%] opacity-20" />
        <Particle className="w-5 h-5 top-[35%] left-[60%] opacity-15" />
        <Particle className="w-3 h-3 top-[45%] left-[70%] opacity-20" />
        <Particle className="w-4 h-4 top-[30%] left-[80%] opacity-15" />
        <Particle className="w-2 h-2 top-[15%] left-[90%] opacity-20" />
        
        {/* Remove floating decorative elements */}
      </div>
      
      {/* Enhanced background SVG with subtle animation and more blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1080 1080" 
          className="w-full h-full opacity-[0.01] dark:opacity-[0.01] blur-[1px]"
          preserveAspectRatio="xMidYMid slice"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotate: [0, 1, 0, -1, 0],
            transition: { 
              opacity: { duration: 1 },
              scale: { duration: 2 },
              rotate: { 
                repeat: Infinity, 
                duration: 20,
                ease: "easeInOut"
              }
            }
          }}
        >
          <path 
            fill="none" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1"
            className="border-path text-navy-400 dark:text-cream-200"
            d="M350 700a350 350 0 1 1 0-700 350 350 0 0 1 0 700zm75-275l-150-87m150 87V212m0 213l150-87M275 300h300M275 125l150 87m-150-87v213m0 213l150 87m-150-87V338m375 175l-150 87M500 125l-150 87M500 125v213m0 213v-213m0 0l-150-87m150 87l150-87"
          />
        </motion.svg>
      </div>
      
      {/* Dynamic Navbar with scroll effect */}
      <motion.nav 
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled 
            ? "border-cream-200/70 dark:border-navy-700/70 bg-white/90 dark:bg-navy-950/90" 
            : "border-cream-200/30 dark:border-navy-700/30 bg-transparent"
        } backdrop-blur-sm`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container max-w-6xl flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold text-lg flex items-center gap-2 text-navy-800 dark:text-cream-50">
            <motion.svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                className="stroke-navy-800 dark:stroke-cream-100"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            <span className="relative">
              Ask the Bible
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-navy-500 to-sage-500 dark:from-navy-400 dark:to-sage-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {mounted && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-9 w-9 text-navy-700 dark:text-cream-200 hover:bg-cream-100 dark:hover:bg-navy-800 transition-colors duration-300"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>
            )}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignIn}
                className="gap-2 border-navy-300 dark:border-navy-700 text-navy-700 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-navy-800 transition-colors duration-300"
              >
                <FcGoogle className="h-4 w-4" />
                Sign in
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Content sections */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Hero Section - Adjust layout and sizing */}
        <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative">
          <div className="container max-w-6xl px-4 mx-auto py-12 md:py-0">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Left column - Text */}
              <div className="w-full md:w-3/5 text-center md:text-left">
                <motion.div 
                  className="relative mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.1 }}
                >
                  <div className="absolute inset-0 blur-2xl animate-glow-1 bg-gradient-to-r from-navy-400/20 to-sage-400/20 dark:from-navy-400/30 dark:to-sage-400/30" />
                  <div className="absolute inset-0 blur-xl animate-glow-2 bg-gradient-to-l from-navy-300/10 to-sage-300/10 dark:from-navy-300/20 dark:to-sage-300/20" />
                  
                  <svg
                    viewBox="0 0 24 24"
                    className="relative w-16 h-16 animate-gradient mx-auto md:mx-0 mb-4"
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
                </motion.div>
                
                {/* Added text content container with frosted glass effect for better readability */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative backdrop-blur-md bg-white/30 dark:bg-navy-900/40 rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)]"
                >
                  {/* Soft glow behind text for additional separation */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cream-50/50 via-white/40 to-transparent dark:from-navy-800/50 dark:via-navy-900/40 dark:to-transparent blur-xl -z-10"></div>
                  
                  <motion.h1 
                    variants={heroTextVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-navy-800 dark:text-cream-50 font-cinzel tracking-wide drop-shadow-md"
                  >
                    Discover Biblical Wisdom
                  </motion.h1>
                  <motion.p 
                    variants={heroTextVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="text-lg sm:text-xl mb-8 text-navy-700 dark:text-cream-100 max-w-lg mx-auto md:mx-0 drop-shadow-sm"
                  >
                    Ask questions about daily life challenges and find relevant Bible verses using AI technology. 
                    Your spiritual journey begins with a simple conversation.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      type: "spring", 
                      damping: 12, 
                      delay: 0.5,
                      stiffness: 100
                    }}
                  >
                    <Button 
                      onClick={handleSignIn}
                      disabled={isLoading}
                      className="h-14 px-8 sm:px-10 rounded-xl text-base sm:text-lg font-medium bg-gradient-to-r from-navy-600 to-sage-600 hover:from-navy-500 hover:to-sage-500 dark:from-navy-700 dark:to-navy-800 dark:hover:from-navy-600 dark:hover:to-navy-700 text-cream-50 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      <FcGoogle className="h-5 w-5" />
                      {isLoading ? "Signing In..." : "Sign in with Google"}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Right column - Example Cards with improved styling and smaller size */}
              <div className="w-full md:w-1/2 md:space-y-6 max-w-md mx-auto ">
                {exampleCards.map((card, index) => (
                  <ExampleCard 
                    key={index}
                    verse={card.verse}
                    verseLocation={card.verseLocation}
                    query={card.query}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Scroll down indicator - keep as is */}
            <motion.div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-navy-600/70 dark:text-cream-100/70 cursor-pointer hidden md:flex"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="text-sm mb-2">Scroll for more</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-cream-50/80 dark:bg-navy-800/50 relative border-t border-b border-cream-200/30 dark:border-navy-700/30">
          <div className="container max-w-6xl px-4 mx-auto">
            <motion.div 
              className="text-center mb-12"
              variants={moveUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-navy-800 dark:text-cream-50">
                Explore the Bible with AI
              </h2>
              <p className="text-navy-600 dark:text-cream-200 max-w-xl mx-auto">
                Our app combines modern technology with spiritual wisdom to help you find guidance for everyday questions.
              </p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featureList.map((feature, index) => (
                <FeatureItem
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Call to Action with enhanced styling */}
        <section className="py-20 relative">
          <motion.div
            className="container max-w-5xl px-4 mx-auto text-center"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-white/50 dark:bg-navy-900/50 p-8 sm:p-12 rounded-2xl border border-cream-200/50 dark:border-navy-700/50 shadow-lg backdrop-blur-sm">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-navy-800 dark:text-cream-50">
                Ready to Start Your Journey?
              </h2>
              <p className="text-navy-600 dark:text-cream-200 max-w-xl mx-auto mb-8">
                Sign in now to save your searches, access your favorite verses, and get personalized Bible insights.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="h-14 px-8 sm:px-10 rounded-xl text-base sm:text-lg font-medium bg-gradient-to-r from-navy-600 to-sage-600 hover:from-navy-500 hover:to-sage-500 dark:from-navy-700 dark:to-navy-800 dark:hover:from-navy-600 dark:hover:to-navy-700 text-cream-50 transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl"
                >
                  <FcGoogle className="h-5 w-5" />
                  {isLoading ? "Signing In..." : "Sign in with Google"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
      
      {/* Footer with improved styling */}
      <footer className="py-8 border-t border-cream-200/50 dark:border-navy-700/50 text-center text-sm text-navy-600 dark:text-cream-200 relative z-10 bg-white/50 dark:bg-navy-950/50 backdrop-blur-sm">
        <div className="container max-w-6xl px-4 mx-auto">
          <p>© {new Date().getFullYear()} Bible Search App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 