import InstallPrompt from '@/components/InstallPrompt'
import ConsentDialog from '@/components/ConsentDialog'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ConsentDialog />
      <InstallPrompt />
    </>
  )
} 