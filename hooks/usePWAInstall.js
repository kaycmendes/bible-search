import { useState, useEffect } from 'react'

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const handler = e => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const canInstall = !!deferredPrompt
  const isInstalled = typeof window !== 'undefined' ? 
    window.matchMedia('(display-mode: standalone)').matches : false

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
          setDeferredPrompt(null)
          return true
        }
      } catch (error) {
        console.error('Installation failed:', error)
      }
      return false
    }
    return false
  }

  return { canInstall: canInstall && !isInstalled, handleInstall }
} 