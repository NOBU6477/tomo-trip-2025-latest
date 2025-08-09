// TomoTrip Main JavaScript - CSP Compliant
document.addEventListener('DOMContentLoaded', () => {
  // Footer protection
  const footers = document.querySelectorAll('footer#main-footer');
  for (let i = 1; i < footers.length; i++) footers[i].remove();

  const footer = footers[0];
  if (footer) { 
    footer.style.display = 'block'; 
    footer.style.visibility = 'visible'; 
  }

  // Initialize application
  if (typeof appInit === 'function') {
    appInit();
  }
});

// Service Worker management - only register in production
if ('serviceWorker' in navigator) {
    // Development/preview: complete blocking
    if (location.hostname === 'localhost' || 
        location.host.includes('.replit.dev') || 
        location.host.includes('replit.com')) {
        
        // Unregister any existing workers in development
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => registration.unregister());
        });
        
        // Block future registrations in development
        navigator.serviceWorker.register = function() {
            console.log('🚫 Service Worker blocked in development - preventing sw.js 404');
            return Promise.reject(new Error('Service Worker disabled in development'));
        };
        
        console.log('Development mode: Service Worker completely disabled');
    }
    // Production: normal SW registration would go here if needed
}