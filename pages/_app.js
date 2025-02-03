import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import InstallPrompt from '@/components/InstallPrompt'
import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import ConsentDialog from '@/components/ConsentDialog'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('SW registered:', registration.scope))
        .catch((err) => console.log('SW registration failed:', err));
    }
  }, []);

  return (
    <SessionProvider session={session}>
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
