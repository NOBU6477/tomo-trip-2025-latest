// Nuclear Filter Fix - Complete override system
console.log('💥 Nuclear Filter Fix Loading...');

function nuclearFilterFix() {
  console.log('💥 Applying nuclear filter fix...');
  
  // Wait for elements to be available
  setTimeout(function() {
    // Find button with multiple methods
    let filterBtn = document.getElementById('filterToggleBtn');
    if (!filterBtn) {
      filterBtn = document.querySelector('button[id="filterToggleBtn"]');
    }
    if (!filterBtn) {
      filterBtn = document.querySelector('.btn-outline-primary');
    }
    
    console.log('Nuclear: Found filter button:', filterBtn);
    
    if (filterBtn) {
      // Complete button override
      filterBtn.removeAttribute('onclick');
      filterBtn.onclick = null;
      
      // Remove all existing event listeners by cloning
      const newBtn = filterBtn.cloneNode(true);
      filterBtn.parentNode.replaceChild(newBtn, filterBtn);
      
      // Set up new event handling
      newBtn.addEventListener('click', function(e) {
        console.log('💥 NUCLEAR CLICK DETECTED');
        e.preventDefault();
        e.stopPropagation();
        
        // Find collapse element
        let collapse = document.getElementById('filterCollapse');
        if (!collapse) {
          console.log('💥 Creating filter collapse element');
          collapse = document.createElement('div');
          collapse.id = 'filterCollapse';
          collapse.className = 'collapse';
          collapse.style.display = 'none';
          collapse.innerHTML = `
            <div class="card card-body mb-4">
              <h5>Filter Panel</h5>
              <p>Filter functionality active!</p>
              <button onclick="this.parentElement.parentElement.style.display='none'">Close</button>
            </div>
          `;
          newBtn.parentElement.parentElement.appendChild(collapse);
        }
        
        console.log('💥 Toggling filter panel');
        if (collapse.style.display === 'none') {
          collapse.style.display = 'block';
          collapse.classList.add('show');
          newBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Hide Filter';
          console.log('💥 FILTER SHOWN');
        } else {
          collapse.style.display = 'none';
          collapse.classList.remove('show');
          newBtn.innerHTML = '<i class="bi bi-funnel"></i> Filter Guides';
          console.log('💥 FILTER HIDDEN');
        }
        
        return false;
      });
      
      // Ensure button is clickable
      newBtn.style.pointerEvents = 'auto';
      newBtn.style.cursor = 'pointer';
      newBtn.style.zIndex = '1000';
      newBtn.style.position = 'relative';
      
      console.log('💥 Nuclear filter fix complete');
    } else {
      console.log('💥 Filter button not found for nuclear fix');
    }
  }, 1000);
}

// Apply nuclear fix immediately
nuclearFilterFix();

// Apply nuclear fix after DOM loads
document.addEventListener('DOMContentLoaded', nuclearFilterFix);

// Apply nuclear fix with delays
setTimeout(nuclearFilterFix, 2000);
setTimeout(nuclearFilterFix, 5000);

console.log('💥 Nuclear Filter Fix System Active');