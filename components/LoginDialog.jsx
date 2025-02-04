'use client'

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Google, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const LoginDialog = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      toast.error('Sign in failed. Please try again.');
      console.error('Login error:', error);
    }
  };

  if (typeof window === 'undefined') return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999]">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-navy-800 p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Sign In Required</h2>
        <p className="mb-6">Please sign in to access this feature.</p>
        <button 
          onClick={() => signIn('google')}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginDialog; 