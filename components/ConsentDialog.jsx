"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const ConsentDialog = ({ onConsent = () => {} }) => {
  const [showConsent, setShowConsent] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if already consented
    const hasConsented = localStorage.getItem('hasConsented') === 'true';
    if (hasConsented) {
      setShowConsent(false);
      onConsent?.();
    } else {
      // Ensure consent is false
      localStorage.setItem('hasConsented', 'false');
    }
    
    // Check if device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [onConsent]);

  const handleAccept = () => {
    localStorage.setItem('hasConsented', 'true');
    setShowConsent(false);
    onConsent?.();
    
    // Trigger a storage event for the InstallPrompt to detect
    window.dispatchEvent(new Event('storage'));
  };

  // Always show if consent hasn't been given
  if (!showConsent && localStorage.getItem('hasConsented') === 'true') {
    return null;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-md z-[999999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-navy-800 rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold text-navy-800 dark:text-cream-50 mb-4">
          Welcome to Ask the Bible
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          By using our service, you agree to our{' '}
          <Link 
            href="/terms" 
            className="text-navy-600 dark:text-cream-200 hover:underline"
            target="_blank"
          >
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link 
            href="/privacy-policy" 
            className="text-navy-600 dark:text-cream-200 hover:underline"
            target="_blank"
          >
            Privacy Policy
          </Link>
          . We use local storage to save your preferences and Google Sign-in for account features.
        </p>
        <Button
          onClick={handleAccept}
          className="w-full bg-navy-600 text-white hover:bg-navy-700 dark:bg-cream-100 dark:text-navy-800 dark:hover:bg-cream-200"
        >
          Accept & Continue
        </Button>
      </div>
    </div>
  );
};

export default ConsentDialog; 