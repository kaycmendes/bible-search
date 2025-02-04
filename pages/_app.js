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
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed:', err))
    }
    registerServiceWorker()
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
