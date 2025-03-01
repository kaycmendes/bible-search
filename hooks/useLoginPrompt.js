import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const useLoginPrompt = () => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { status } = useSession();
  
  // Add debug logging for authentication status changes
  useEffect(() => {
    console.log(`useLoginPrompt: Authentication status changed to "${status || 'undefined'}"`);
  }, [status]);

  // Function to check if user is authenticated
  const requireLogin = () => {
    // Handle undefined status case explicitly
    if (typeof status === 'undefined') {
      console.error('requireLogin: Authentication status is undefined');
      return null; // Can't determine authentication state
    }
    
    console.log(`requireLogin called - current status: ${status}`);
    
    if (status === 'loading') {
      console.log('Authentication state is still loading');
      return null; // Authentication status is undetermined
    }
    
    if (status === 'unauthenticated') {
      console.log('User is not authenticated, showing login prompt');
      setShowLoginPrompt(true);
      return false; // User is not authorized
    }
    
    console.log('User is authenticated');
    return true; // User is authorized
  };

  // Calculate derived authentication state with safety check
  const isAuthenticated = status === 'authenticated';
  
  return {
    showLoginPrompt,
    setShowLoginPrompt,
    requireLogin,
    isAuthenticated,
    status // Also expose the raw status for direct checks
  };
}; 