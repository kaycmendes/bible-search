import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import InstallPrompt from '@/components/InstallPrompt'
import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import ConsentDialog from '@/components/ConsentDialog'
import { registerServiceWorker } from '@/lib/pwa'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    // Force update service worker on load
    const forceUpdateSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          
          // Check if we need to force update (version check)
          const needsUpdate = sessionStorage.getItem('sw-needs-update');
          
          if (needsUpdate === 'true' && registrations.length > 0) {
            console.log('🔄 Forcing service worker update...');
            
            // Unregister old workers
            for (const registration of registrations) {
              await registration.unregister();
            }
            
            // Clear caches
            if ('caches' in window) {
              const cacheNames = await caches.keys();
              for (const cacheName of cacheNames) {
                await caches.delete(cacheName);
              }
            }
            
            sessionStorage.removeItem('sw-needs-update');
            console.log('✅ Service worker updated, reloading...');
            window.location.reload(true);
            return;
          }
          
          // Register new service worker
          navigator.serviceWorker
            .register('/service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
            
        } catch (error) {
          console.error('Service worker update error:', error);
        }
      }
      registerServiceWorker();
    };
    
    forceUpdateSW();
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      if(localStorage.getItem('hasConsented')) {
        window.dispatchEvent(new Event('beforeinstallprompt-check'));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <SessionProvider 
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background">
          <Component {...pageProps} />
          <Toaster />
          <InstallPrompt />
          <ConsentDialog />
        </div>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
