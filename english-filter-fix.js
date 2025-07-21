// English Filter Fix - Ensure filter button works on English site
console.log('🔧 English Filter Fix Loading...');

function fixEnglishFilter() {
  console.log('Fixing English filter button functionality...');
  
  // Find the filter button
  const filterBtn = document.getElementById('filterToggleBtn');
  const filterCollapse = document.getElementById('filterCollapse');
  
  if (filterBtn) {
    console.log('✓ Filter button found');
    
    // Remove any existing event listeners by replacing the element
    const newFilterBtn = filterBtn.cloneNode(true);
    filterBtn.parentNode.replaceChild(newFilterBtn, filterBtn);
    
    // Add direct onclick handler
    newFilterBtn.onclick = function(e) {
      e.preventDefault();
      console.log('Filter button clicked - toggling filter panel');
      
      if (filterCollapse) {
        // Toggle visibility manually
        if (filterCollapse.classList.contains('show')) {
          filterCollapse.classList.remove('show');
          filterCollapse.style.display = 'none';
          newFilterBtn.innerHTML = '<i class="bi bi-funnel"></i> Filter Guides';
          console.log('✓ Filter panel hidden');
        } else {
          filterCollapse.classList.add('show');
          filterCollapse.style.display = 'block';
          newFilterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Hide Filter';
          console.log('✓ Filter panel shown');
        }
      } else {
        console.log('⚠️ Filter collapse element not found');
      }
    };
    
    // Also add event listener as backup
    newFilterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Filter button clicked via addEventListener');
      
      if (filterCollapse) {
        // Toggle visibility manually if Bootstrap fails
        if (filterCollapse.style.display === 'none' || !filterCollapse.style.display) {
          filterCollapse.style.display = 'block';
          filterCollapse.classList.add('show');
        } else {
          filterCollapse.style.display = 'none';
          filterCollapse.classList.remove('show');
        }
        console.log('✓ Manual filter toggle applied');
      }
    });
    
    // Ensure button is clickable
    newFilterBtn.style.cursor = 'pointer';
    newFilterBtn.style.pointerEvents = 'auto';
    newFilterBtn.style.zIndex = '1040';
    
    console.log('✅ Filter button functionality restored');
  } else {
    console.log('❌ Filter button not found');
  }
  
  // Also check for filter collapse element
  if (filterCollapse) {
    console.log('✓ Filter collapse element found');
    // Ensure it's properly hidden initially
    filterCollapse.style.display = 'none';
    filterCollapse.classList.remove('show');
  } else {
    console.log('❌ Filter collapse element not found');
  }
  
  // Check for filter form elements
  const filterForm = document.querySelector('#filterCollapse form');
  if (filterForm) {
    console.log('✓ Filter form found');
  } else {
    console.log('❌ Filter form not found');
  }
}

// Apply fix immediately
fixEnglishFilter();

// Apply fix after DOM loads
document.addEventListener('DOMContentLoaded', fixEnglishFilter);

// Apply fix with delays to catch dynamically added elements
setTimeout(fixEnglishFilter, 1000);
setTimeout(fixEnglishFilter, 3000);

console.log('🔧 English Filter Fix System Active');