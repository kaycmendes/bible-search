import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Google } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const LoginDialog = ({ isOpen, onClose }) => {
  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in failed:', error);
      toast.error('Failed to sign in. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Save Your Bible Study Journey by signing in. Access your saved cards anywhere.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 my-4">
          <Button 
            onClick={handleGoogleSignIn} 
            variant="outline" 
            className="flex items-center gap-2 w-full justify-center hover:bg-gray-100 dark:hover:bg-navy-700"
          >
            <Google className="h-5 w-5" />
            Continue with Google
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Maybe Later</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog; 