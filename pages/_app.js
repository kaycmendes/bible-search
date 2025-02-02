import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  )
}
