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

// Completely block Service Worker to prevent sw.js 404 requests
if ('serviceWorker' in navigator) {
    // Unregister existing workers
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
    });
    
    // Block future registrations permanently
    const originalRegister = navigator.serviceWorker.register;
    navigator.serviceWorker.register = function() {
        console.log('🚫 Service Worker registration blocked - preventing sw.js 404');
        return Promise.reject(new Error('Service Worker disabled'));
    };
    
    // Remove service worker from navigator to prevent automatic requests
    try {
        Object.defineProperty(navigator, 'serviceWorker', {
            value: undefined,
            writable: false,
            configurable: false
        });
    } catch(e) {
        // Fallback if property cannot be redefined
        console.log('Service Worker access blocked');
    }
}