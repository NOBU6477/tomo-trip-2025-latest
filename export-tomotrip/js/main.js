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

// Service Worker management - unified for both environments
if ('serviceWorker' in navigator) {
    const isProd = !(location.hostname === 'localhost' || 
                     location.host.includes('.replit.dev') || 
                     location.host.includes('replit.com'));
    
    if (!isProd) {
        // Development/preview: complete blocking
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
                console.log('%cSW Unregistered:', 'color: #dc3545;', registration.scope);
            });
        });
        
        // Override register method to prevent future registrations
        const originalRegister = navigator.serviceWorker.register;
        navigator.serviceWorker.register = function() {
            console.log('%cSW Registration Blocked', 'color: #dc3545; font-weight: bold;', 'preventing sw.js 404');
            return Promise.reject(new Error('Service Worker disabled in development'));
        };
        
        console.log('%cDevelopment Mode:', 'color: #ffc107; font-weight: bold;', 'Service Worker completely disabled');
    } else {
        // Production: would register SW here with versioned cache
        console.log('%cProduction Mode:', 'color: #28a745; font-weight: bold;', 'Service Worker ready for registration');
    }
}