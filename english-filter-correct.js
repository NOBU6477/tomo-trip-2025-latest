// English Filter Correct - Japanese structure copy
console.log('✅ English Filter Correct Loading...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Setting up English filter system matching Japanese structure...');
  
  // Filter toggle functionality exactly like Japanese version
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const filterCard = document.getElementById('filter-card');
  
  if (filterToggleBtn && filterCard) {
    filterToggleBtn.addEventListener('click', function() {
      console.log('✅ Filter button clicked');
      
      if (filterCard.classList.contains('d-none')) {
        filterCard.classList.remove('d-none');
        filterToggleBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Close Filter';
        console.log('✅ Filter opened');
      } else {
        filterCard.classList.add('d-none');
        filterToggleBtn.innerHTML = '<i class="bi bi-funnel"></i> Open Filter';
        console.log('✅ Filter closed');
      }
    });
    
    console.log('✅ Filter toggle setup complete');
  } else {
    console.log('❌ Filter elements not found');
  }
  
  // Search and reset functions
  window.searchGuides = function() {
    const location = document.getElementById('location-filter').value;
    const language = document.getElementById('language-filter').value;
    const price = document.getElementById('price-filter').value;
    
    console.log('Searching guides:', { location, language, price });
    alert(`Searching guides with: Location: ${location || 'All'}, Language: ${language || 'All'}, Price: ${price || 'All'}`);
  };
  
  window.resetFilters = function() {
    document.getElementById('location-filter').value = '';
    document.getElementById('language-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('custom-keywords').value = '';
    
    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    console.log('Filters reset');
    alert('All filters have been reset');
  };
});

console.log('✅ English Filter Correct System Loaded');