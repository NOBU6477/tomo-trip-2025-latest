// Service Worker Complete Unregistration and Cache Cleanup
// Temporary file for cache purge - remove after deployment
(function() {
    'use strict';
    
    console.log('🧹 Starting complete Service Worker and cache cleanup...');
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            console.log('Found', registrations.length, 'service worker registrations');
            
            const unregisterPromises = registrations.map(registration => {
                console.log('Unregistering SW:', registration.scope);
                return registration.unregister();
            });
            
            return Promise.all(unregisterPromises);
        }).then(function() {
            console.log('✅ All Service Workers unregistered');
            
            // Clear all caches
            if ('caches' in window) {
                return caches.keys().then(function(cacheNames) {
                    console.log('Found', cacheNames.length, 'caches to clear');
                    
                    const deletePromises = cacheNames.map(cacheName => {
                        console.log('Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    });
                    
                    return Promise.all(deletePromises);
                });
            }
        }).then(function() {
            console.log('✅ All caches cleared');
            console.log('🎯 Cache cleanup complete - pages should now load fresh content');
        }).catch(function(error) {
            console.error('Cache cleanup error:', error);
        });
    }
    
    // Set build identifier for debugging
    window.APP_BUILD_ID = 'TomoTrip-v2025.08.09-SW-PURGE';
    console.info('[TomoTrip] BUILD:', window.APP_BUILD_ID, 'Location:', location.href);
})();