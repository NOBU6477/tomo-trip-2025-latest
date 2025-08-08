// TomoTrip Main JavaScript - CSP Compliant
document.addEventListener('DOMContentLoaded', () => {
  // Footer 多重保険：重複があれば先頭以外を除去
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

// Setup all event listeners
function setupEventListeners() {
    // Basic event listener setup moved to app-init.js
    console.log('Basic event listeners setup');
}