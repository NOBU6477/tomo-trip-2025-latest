// English Switch Fix for Japanese Site
console.log('🔧 English Switch Fix Loading...');

function fixEnglishSwitchButton() {
  console.log('Fixing English switch button functionality...');
  
  // Find the English button by multiple selectors
  const englishButton = document.querySelector('.lang-btn-en') ||
                       document.querySelector('button[style*="🇺🇸"]') ||
                       document.querySelector('button:contains("English")') ||
                       Array.from(document.querySelectorAll('button')).find(btn => 
                         btn.textContent.includes('🇺🇸') || btn.textContent.includes('English')
                       );
  
  if (englishButton) {
    console.log('Found English button, setting up click handler');
    
    // Remove any existing listeners
    englishButton.replaceWith(englishButton.cloneNode(true));
    const newEnglishButton = document.querySelector('.lang-btn-en') ||
                            Array.from(document.querySelectorAll('button')).find(btn => 
                              btn.textContent.includes('🇺🇸') || btn.textContent.includes('English')
                            );
    
    if (newEnglishButton) {
      // Add direct onclick handler
      newEnglishButton.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('English button clicked - switching to English version');
        window.location.href = 'index-en.html';
      };
      
      // Also add event listener as backup
      newEnglishButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('English button clicked via addEventListener');
        window.location.href = 'index-en.html';
      });
      
      // Ensure button is clickable
      newEnglishButton.style.cursor = 'pointer';
      newEnglishButton.style.pointerEvents = 'auto';
      
      console.log('✅ English button functionality fixed');
    }
  } else {
    console.log('❌ English button not found');
  }
}

// Apply fix immediately
fixEnglishSwitchButton();

// Apply fix after DOM loads
document.addEventListener('DOMContentLoaded', fixEnglishSwitchButton);

// Apply fix with delays to catch dynamically added elements
setTimeout(fixEnglishSwitchButton, 1000);
setTimeout(fixEnglishSwitchButton, 3000);

console.log('🔧 English Switch Fix System Active');