// Anti Auto-Switch Protection System for English Site
console.log('🛡️ Anti Auto-Switch Protection Loading...');

// Disable all automatic Japanese switching
function disableAutoSwitch() {
  console.log('🚫 Disabling automatic Japanese switching...');
  
  // Override any functions that might switch to Japanese
  window.switchToJapanese = function() {
    console.log('⚠️ Blocked automatic switch to Japanese');
    return false;
  };
  
  // Block location.href changes to index.html
  const originalLocationSetter = Object.getOwnPropertyDescriptor(window.location, 'href').set;
  Object.defineProperty(window.location, 'href', {
    set: function(value) {
      if (value === 'index.html' || value.endsWith('index.html')) {
        console.log('🚫 Blocked automatic redirect to index.html');
        return;
      }
      originalLocationSetter.call(this, value);
    },
    get: function() {
      return window.location.toString();
    }
  });
  
  // Disable window.location.replace for index.html
  const originalReplace = window.location.replace;
  window.location.replace = function(url) {
    if (url === 'index.html' || url.endsWith('index.html')) {
      console.log('🚫 Blocked location.replace to index.html');
      return;
    }
    return originalReplace.call(this, url);
  };
  
  // Monitor and prevent DOM changes that add Japanese content
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.innerHTML && node.innerHTML.includes('特別な旅')) {
            console.log('🚫 Detected Japanese content insertion, blocking...');
            node.remove();
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Block timer-based redirects
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function(func, delay) {
    const funcString = func.toString();
    if (funcString.includes('index.html') || funcString.includes('switchToJapanese')) {
      console.log('🚫 Blocked timer-based redirect to Japanese');
      return;
    }
    return originalSetTimeout.call(this, func, delay);
  };
  
  console.log('✅ Auto-switch protection activated');
}

// Force English content stability
function maintainEnglishContent() {
  console.log('🇺🇸 Maintaining English content...');
  
  // Ensure page title stays English
  document.title = 'TomoTrip - Find Local Guides in Japan';
  
  // Monitor and fix hero section
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle && heroTitle.textContent !== 'Your Special Journey Awaits') {
    heroTitle.textContent = 'Your Special Journey Awaits';
  }
  
  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroSubtitle && !heroSubtitle.textContent.includes('Discover hidden gems')) {
    heroSubtitle.textContent = 'Discover hidden gems with local guides that tourism can\'t reveal';
  }
  
  // Ensure language button shows as active English
  const englishBtn = document.querySelector('.lang-btn-en');
  if (englishBtn) {
    englishBtn.classList.add('active');
    englishBtn.style.transform = 'scale(1.05)';
  }
}

// Apply protection immediately
disableAutoSwitch();
maintainEnglishContent();

// Re-apply protection after potential interference
document.addEventListener('DOMContentLoaded', function() {
  disableAutoSwitch();
  maintainEnglishContent();
});

// Continuous monitoring
setInterval(maintainEnglishContent, 2000);

console.log('🛡️ Anti Auto-Switch Protection System Active');