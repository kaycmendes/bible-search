// Force service worker update script
// This will immediately unregister old service workers and reload

(async function forceSWUpdate() {
  console.log('🔄 Checking for old service workers...');
  
  if ('serviceWorker' in navigator) {
    try {
      // Get all registrations
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      console.log(`Found ${registrations.length} service worker registration(s)`);
      
      if (registrations.length > 0) {
        // Unregister all
        for (const registration of registrations) {
          const result = await registration.unregister();
          console.log('🗑️ Unregistered service worker:', result);
        }
        
        // Clear all caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          console.log(`Found ${cacheNames.length} cache(s) to clear`);
          
          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
            console.log('🗑️ Deleted cache:', cacheName);
          }
        }
        
        console.log('✅ All service workers and caches cleared!');
        console.log('🔄 Reloading page...');
        
        // Wait a moment then reload
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      } else {
        console.log('✅ No service workers found - all clear!');
      }
    } catch (error) {
      console.error('❌ Error clearing service workers:', error);
    }
  } else {
    console.log('ℹ️ Service workers not supported in this browser');
  }
})();
