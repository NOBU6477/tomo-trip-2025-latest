// Nuclear English Site Protection System
console.log('🚀 Nuclear English Protection Loading...');

// Comprehensive protection against all forms of auto-redirect
function nuclearProtection() {
  console.log('🛡️ Activating nuclear-level protection...');
  
  // 1. Override all redirect functions
  const originalLocationSet = Object.getOwnPropertyDescriptor(window.location, 'href').set;
  Object.defineProperty(window.location, 'href', {
    set: function(value) {
      console.log(`🚫 Redirect attempt blocked: ${value}`);
      if (value.includes('index.html') && !value.includes('index-en.html')) {
        console.log('🚫 Blocked redirect to Japanese version');
        return;
      }
      originalLocationSet.call(this, value);
    },
    get: function() {
      return window.location.toString();
    }
  });
  
  // 2. Block window.location methods
  const originalReplace = window.location.replace;
  window.location.replace = function(url) {
    if (url.includes('index.html') && !url.includes('index-en.html')) {
      console.log('🚫 Blocked location.replace to Japanese version');
      return;
    }
    return originalReplace.call(this, url);
  };
  
  // 3. Override setTimeout and setInterval to block timed redirects
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function(func, delay) {
    if (typeof func === 'function') {
      const funcString = func.toString();
      if (funcString.includes('index.html') || funcString.includes('location.href')) {
        console.log('🚫 Blocked timer-based redirect');
        return;
      }
    }
    return originalSetTimeout.call(this, func, delay);
  };
  
  // 4. Block all switchToJapanese functions
  window.switchToJapanese = function() {
    console.log('🚫 switchToJapanese function blocked');
    return false;
  };
  
  // 5. Monitor and block DOM manipulation that causes redirects
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            // Check for script tags that might redirect
            const scripts = node.querySelectorAll ? node.querySelectorAll('script') : [];
            scripts.forEach(script => {
              if (script.textContent && script.textContent.includes('index.html')) {
                console.log('🚫 Blocked script injection with redirect');
                script.remove();
              }
            });
          }
        });
      }
    });
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // 6. Block onclick handlers that redirect
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (target.onclick) {
      const onclickString = target.onclick.toString();
      if (onclickString.includes('index.html') && !onclickString.includes('index-en.html')) {
        console.log('🚫 Blocked onclick redirect to Japanese version');
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, true);
  
  // 7. Force English content display
  document.title = 'TomoTrip - Find Local Guides in Japan (English)';
  
  console.log('✅ Nuclear protection active - English site secured');
}

// Apply nuclear protection immediately
nuclearProtection();

// Re-apply after DOM loads
document.addEventListener('DOMContentLoaded', nuclearProtection);

// Continuous monitoring every 5 seconds
setInterval(function() {
  // Check if we're still on English version
  if (!window.location.href.includes('index-en.html')) {
    console.log('⚠️ Detected redirect away from English version');
    // Force back to English if redirected
    window.location.href = 'index-en.html';
  }
}, 5000);

console.log('🚀 Nuclear English Protection System Active');