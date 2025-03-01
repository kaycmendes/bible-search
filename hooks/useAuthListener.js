import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook to listen for authentication status changes 
 * and clear localStorage when user logs out
 */
export const useAuthListener = () => {
  const { status } = useSession();

  useEffect(() => {
    // If authentication status changes to unauthenticated (i.e., user logged out)
    if (status === 'unauthenticated') {
      try {
        // Clear search results from localStorage
        localStorage.removeItem('searchResults');
        console.log('Auth listener: Cleared search results from localStorage (unauthenticated)');
      } catch (error) {
        console.error('Error clearing localStorage on logout:', error);
      }
    }
  }, [status]); // Re-run effect when auth status changes

  return null; // This hook doesn't return anything
}; 