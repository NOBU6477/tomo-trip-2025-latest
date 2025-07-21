// English Filter Correct - Japanese structure copy
console.log('✅ English Filter Correct Loading...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Setting up English filter system matching Japanese structure...');
  
  // Disable old filter system
  const oldFilterCollapse = document.getElementById('filterCollapse');
  if (oldFilterCollapse) {
    oldFilterCollapse.style.display = 'none';
    console.log('✅ Disabled old filter system');
  }
  
  // Filter toggle functionality exactly like Japanese version
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const filterCard = document.getElementById('filter-card');
  
  if (filterToggleBtn && filterCard) {
    console.log('✅ Found filter elements:', {
      button: filterToggleBtn,
      card: filterCard,
      cardClasses: filterCard.className
    });
    
    filterToggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
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
    console.log('❌ Filter elements not found:', {
      button: !!filterToggleBtn,
      card: !!filterCard
    });
  }
  
  // Search and reset functions
  window.searchGuides = function() {
    const location = document.getElementById('location-filter')?.value;
    const language = document.getElementById('language-filter')?.value;
    const price = document.getElementById('price-filter')?.value;
    
    console.log('Searching guides:', { location, language, price });
    alert(`Searching guides with: Location: ${location || 'All'}, Language: ${language || 'All'}, Price: ${price || 'All'}`);
  };
  
  window.resetFilters = function() {
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const priceFilter = document.getElementById('price-filter');
    const customKeywords = document.getElementById('custom-keywords');
    
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (customKeywords) customKeywords.value = '';
    
    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    console.log('Filters reset');
    alert('All filters have been reset');
  };
});

console.log('✅ English Filter Correct System Loaded');