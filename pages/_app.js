import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <Component {...pageProps} />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default MyApp
