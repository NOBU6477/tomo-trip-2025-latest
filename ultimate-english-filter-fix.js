// Ultimate English Filter Fix - Complete system override
console.log('🚀 Ultimate English Filter Fix Loading...');

// Immediate execution to prevent other scripts from interfering
(function() {
  console.log('🚀 Starting ultimate filter fix...');
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFilter);
  } else {
    initializeFilter();
  }
  
  function initializeFilter() {
    console.log('🚀 Initializing ultimate filter system...');
    
    // Remove all competing filter systems
    const scriptsToDisable = [
      'english-filter-fix.js',
      'filter-debug-system.js', 
      'nuclear-filter-fix.js'
    ];
    
    // Hide old filter collapse system completely
    const oldFilterCollapse = document.getElementById('filterCollapse');
    if (oldFilterCollapse) {
      oldFilterCollapse.remove();
      console.log('✅ Removed old filterCollapse element');
    }
    
    // Set up new filter system
    setupNewFilterSystem();
  }
  
  function setupNewFilterSystem() {
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterCard = document.getElementById('filter-card');
    
    console.log('🔍 Filter elements found:', {
      button: !!filterToggleBtn,
      card: !!filterCard,
      buttonId: filterToggleBtn?.id,
      cardId: filterCard?.id,
      cardClasses: filterCard?.className
    });
    
    if (!filterToggleBtn || !filterCard) {
      console.error('❌ Critical filter elements not found');
      return;
    }
    
    // Remove any existing event listeners by cloning elements
    const newFilterBtn = filterToggleBtn.cloneNode(true);
    filterToggleBtn.parentNode.replaceChild(newFilterBtn, filterToggleBtn);
    
    // Add new event listener
    newFilterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🎯 Filter button clicked!');
      console.log('Current card classes:', filterCard.className);
      
      const isHidden = filterCard.classList.contains('d-none');
      
      if (isHidden) {
        filterCard.classList.remove('d-none');
        newFilterBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Close Filter';
        console.log('✅ Filter panel opened');
      } else {
        filterCard.classList.add('d-none');
        newFilterBtn.innerHTML = '<i class="bi bi-funnel"></i> Open Filter';
        console.log('✅ Filter panel closed');
      }
      
      console.log('New card classes:', filterCard.className);
    });
    
    // Ensure initial state
    filterCard.classList.add('d-none');
    newFilterBtn.innerHTML = '<i class="bi bi-funnel"></i> Open Filter';
    
    console.log('✅ Ultimate filter system initialized successfully');
    
    // Setup search and reset functions
    setupFilterFunctions();
  }
  
  function setupFilterFunctions() {
    // Override any existing functions
    window.searchGuides = function() {
      const location = document.getElementById('location-filter')?.value || '';
      const language = document.getElementById('language-filter')?.value || '';
      const price = document.getElementById('price-filter')?.value || '';
      const keywords = document.getElementById('custom-keywords')?.value || '';
      
      console.log('🔍 Searching with filters:', { location, language, price, keywords });
      
      // Get selected checkboxes
      const selectedKeywords = [];
      document.querySelectorAll('.keyword-checkbox:checked').forEach(cb => {
        selectedKeywords.push(cb.value);
      });
      
      const allKeywords = [...selectedKeywords];
      if (keywords) {
        allKeywords.push(...keywords.split(',').map(k => k.trim()));
      }
      
      alert(`Searching guides:\nLocation: ${location || 'All'}\nLanguage: ${language || 'All'}\nPrice: ${price || 'All'}\nKeywords: ${allKeywords.join(', ') || 'None'}`);
    };
    
    window.resetFilters = function() {
      console.log('🔄 Resetting all filters...');
      
      // Reset dropdowns
      const selects = ['location-filter', 'language-filter', 'price-filter'];
      selects.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.value = '';
          element.selectedIndex = 0;
        }
      });
      
      // Reset text input
      const customKeywords = document.getElementById('custom-keywords');
      if (customKeywords) {
        customKeywords.value = '';
      }
      
      // Reset all checkboxes
      document.querySelectorAll('.keyword-checkbox').forEach(checkbox => {
        checkbox.checked = false;
      });
      
      console.log('✅ All filters reset');
      alert('All filters have been reset to default values');
    };
    
    console.log('✅ Filter functions setup complete');
  }
  
})();

console.log('🚀 Ultimate English Filter Fix Loaded');