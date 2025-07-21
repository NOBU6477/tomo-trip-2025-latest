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
      
      // Perform actual filtering
      filterGuideCards(location, language, price, allKeywords);
    };
    
    function filterGuideCards(location, language, price, keywords) {
      const guideCards = document.querySelectorAll('#guide-cards-container .col-md-4');
      let visibleCount = 0;
      
      console.log(`🔍 Filtering ${guideCards.length} guide cards...`);
      
      guideCards.forEach(cardWrapper => {
        const card = cardWrapper.querySelector('.guide-card');
        let shouldShow = true;
        
        // Get card data
        const cardLocation = card.querySelector('.text-muted')?.textContent || '';
        const cardLanguages = Array.from(card.querySelectorAll('.badge')).map(badge => badge.textContent.trim());
        const cardPrice = card.querySelector('.fw-bold')?.textContent || '';
        const cardText = card.textContent.toLowerCase();
        
        // Location filter
        if (location && !cardLocation.toLowerCase().includes(location.toLowerCase())) {
          shouldShow = false;
        }
        
        // Language filter
        if (language && !cardLanguages.some(lang => lang.toLowerCase().includes(language.toLowerCase()))) {
          shouldShow = false;
        }
        
        // Price filter
        if (price) {
          const priceNum = parseFloat(cardPrice.replace(/[^0-9]/g, ''));
          switch (price) {
            case 'under-6000':
              if (priceNum >= 6000) shouldShow = false;
              break;
            case '6000-10000':
              if (priceNum < 6000 || priceNum > 10000) shouldShow = false;
              break;
            case 'over-10000':
              if (priceNum <= 10000) shouldShow = false;
              break;
          }
        }
        
        // Keywords filter
        if (keywords.length > 0) {
          const hasKeyword = keywords.some(keyword => 
            cardText.includes(keyword.toLowerCase())
          );
          if (!hasKeyword) shouldShow = false;
        }
        
        // Show/hide card
        if (shouldShow) {
          cardWrapper.style.display = '';
          visibleCount++;
        } else {
          cardWrapper.style.display = 'none';
        }
      });
      
      // Update counter
      updateGuideCounter(visibleCount);
      
      console.log(`✅ Filter applied: ${visibleCount} guides visible`);
      
      // Show result message
      const filterMsg = [];
      if (location) filterMsg.push(`Location: ${location}`);
      if (language) filterMsg.push(`Language: ${language}`);
      if (price) filterMsg.push(`Price: ${price}`);
      if (keywords.length > 0) filterMsg.push(`Keywords: ${keywords.join(', ')}`);
      
      alert(`Filter applied!\n${filterMsg.join('\n')}\n\nShowing ${visibleCount} guides`);
    }
    
    function updateGuideCounter(count) {
      // Update counter number
      const counterNumber = document.getElementById('guide-count-number');
      if (counterNumber) {
        counterNumber.textContent = count;
      }
      
      // Update counter text
      const counterElement = document.getElementById('guides-count');
      if (counterElement) {
        counterElement.innerHTML = `<i class="bi bi-people-fill me-2"></i><span id="guide-count-number">${count}</span> guides found`;
      }
      
      // Update page info if exists
      const pageInfo = document.getElementById('current-page-info');
      if (pageInfo) {
        pageInfo.textContent = `Page 1 (1-${count} people)`;
      }
      
      console.log(`📊 Counter updated: ${count} guides`);
    }
    
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
      
      // Show all guide cards
      const guideCards = document.querySelectorAll('#guide-cards-container .col-md-4');
      guideCards.forEach(cardWrapper => {
        cardWrapper.style.display = '';
      });
      
      // Update counter to show all guides
      updateGuideCounter(guideCards.length);
      
      console.log('✅ All filters reset');
      alert(`All filters reset!\nShowing all ${guideCards.length} guides`);
    };
    
    console.log('✅ Filter functions setup complete');
  }
  
})();

console.log('🚀 Ultimate English Filter Fix Loaded');