// Filter Debug System - Comprehensive diagnosis
console.log('🔍 Filter Debug System Loading...');

function debugFilterSystem() {
  console.log('=== FILTER SYSTEM DIAGNOSTIC ===');
  
  // 1. Check if button exists
  const filterBtn = document.getElementById('filterToggleBtn');
  console.log('Filter Button:', filterBtn);
  if (filterBtn) {
    console.log('✓ Filter button found');
    console.log('Button innerHTML:', filterBtn.innerHTML);
    console.log('Button style:', filterBtn.style.cssText);
    console.log('Button classes:', filterBtn.className);
    console.log('Button onclick:', filterBtn.onclick);
    console.log('Button event listeners:', getEventListeners ? getEventListeners(filterBtn) : 'Cannot check listeners');
  } else {
    console.log('❌ Filter button NOT found');
  }
  
  // 2. Check if filter collapse exists
  const filterCollapse = document.getElementById('filterCollapse');
  console.log('Filter Collapse:', filterCollapse);
  if (filterCollapse) {
    console.log('✓ Filter collapse found');
    console.log('Collapse display:', filterCollapse.style.display);
    console.log('Collapse classes:', filterCollapse.className);
    console.log('Collapse visibility:', filterCollapse.offsetHeight > 0 ? 'visible' : 'hidden');
  } else {
    console.log('❌ Filter collapse NOT found');
  }
  
  // 3. Test manual click
  if (filterBtn) {
    console.log('Testing manual click...');
    filterBtn.addEventListener('click', function(e) {
      console.log('🎯 Manual click detected!', e);
    });
    
    // Add direct click test
    filterBtn.onclick = function(e) {
      console.log('🎯 Direct onclick triggered!', e);
      e.preventDefault();
      
      if (filterCollapse) {
        console.log('Current collapse state:', {
          display: filterCollapse.style.display,
          classes: filterCollapse.className,
          hasShow: filterCollapse.classList.contains('show')
        });
        
        // Force toggle
        if (filterCollapse.style.display === 'none' || !filterCollapse.classList.contains('show')) {
          filterCollapse.style.display = 'block';
          filterCollapse.classList.add('show');
          filterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Hide Filter';
          console.log('✅ Filter panel SHOWN');
        } else {
          filterCollapse.style.display = 'none';
          filterCollapse.classList.remove('show');
          filterBtn.innerHTML = '<i class="bi bi-funnel"></i> Filter Guides';
          console.log('✅ Filter panel HIDDEN');
        }
      }
      
      return false;
    };
  }
  
  // 4. Check for conflicting scripts
  console.log('Checking for conflicting scripts...');
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    if (script.src.includes('filter')) {
      console.log('Filter-related script:', script.src);
    }
  });
  
  // 5. Check Bootstrap
  console.log('Bootstrap available:', typeof bootstrap !== 'undefined');
  console.log('jQuery available:', typeof $ !== 'undefined');
  
  console.log('=== DIAGNOSTIC COMPLETE ===');
}

// Run diagnostic immediately
setTimeout(debugFilterSystem, 500);

// Run diagnostic after DOM loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(debugFilterSystem, 1000);
});

// Run diagnostic with longer delay
setTimeout(debugFilterSystem, 3000);

console.log('🔍 Filter Debug System Active');