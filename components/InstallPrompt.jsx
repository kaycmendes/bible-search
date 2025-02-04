"use client"

import { usePWAInstall } from '@/hooks/usePWAInstall'
import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const { canInstall, handleInstall } = usePWAInstall()
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const checkPrompt = () => {
      const hasConsented = localStorage.getItem('hasConsented');
      const promptShown = sessionStorage.getItem('installPromptShown');
      
      if (hasConsented && canInstall && !promptShown) {
        setShowPrompt(true);
      }
    };
    
    checkPrompt();
    window.addEventListener('storage', checkPrompt);
    return () => window.removeEventListener('storage', checkPrompt);
  }, [canInstall]);

  const handleClose = () => {
    sessionStorage.setItem('installPromptShown', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-navy-800 rounded-lg p-6 max-w-md w-full shadow-xl mx-4">
        <h3 className="text-lg font-semibold mb-4">Install Ask the Bible</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Get the best experience! Add to your home screen for:
          <ul className="list-disc pl-5 mt-2">
            <li>Faster loading times</li>
            <li>Offline access</li>
            <li>App-like navigation</li>
          </ul>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-3 sm:py-2 rounded-lg sm:rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-navy-700 dark:hover:bg-navy-600 flex-1 text-base sm:text-sm shadow-sm hover:shadow-md transition-shadow"
          >
            Later
          </button>
          <button
            onClick={() => {
              const installed = handleInstall()
              if (installed) handleClose()
            }}
            className="px-6 py-3 sm:py-2 rounded-lg sm:rounded-md bg-blue-600 hover:bg-blue-700 text-white flex-1 text-base sm:text-sm shadow-sm hover:shadow-md transition-shadow"
          >
            Install Now
          </button>
        </div>
      </div>
    </div>
  )
} 