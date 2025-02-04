import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';

const ConsentDialog = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('hasConsented');
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('hasConsented', 'true');
    setShowConsent(false);
  };

  return (
    <AlertDialog open={showConsent} onOpenChange={setShowConsent}>
      <AlertDialogContent 
        className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-md z-[999999] flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-navy-800 rounded-lg p-6 max-w-md w-full shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-navy-800 dark:text-cream-50">
              Welcome to Ask the Bible
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
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
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={handleAccept}
              className="w-full bg-navy-600 text-white hover:bg-navy-700 dark:bg-cream-100 dark:text-navy-800 dark:hover:bg-cream-200"
            >
              Accept & Continue
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConsentDialog; 