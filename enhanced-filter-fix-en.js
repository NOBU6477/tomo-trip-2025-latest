/**
 * Enhanced Filter Fix for English Site - New Tab Compatibility
 * 新しいタブでのフィルター機能を完全に修正
 */

(function() {
  'use strict';
  
  console.log('🔧 Enhanced English Filter Fix Starting...');
  
  // Global variables
  let isFilterSystemInitialized = false;
  let guidesLoaded = false;
  
  // Wait for guides to be loaded
  function waitForGuides() {
    return new Promise((resolve) => {
      const checkGuides = () => {
        const guideCards = document.querySelectorAll('.guide-item, [data-guide-id]');
        console.log(`Guide cards found: ${guideCards.length}`);
        
        if (guideCards.length >= 5 || guidesLoaded) {
          guidesLoaded = true;
          resolve(guideCards.length);
        } else {
          setTimeout(checkGuides, 100);
        }
      };
      checkGuides();
    });
  }
  
  // Enhanced filter function
  function enhancedFilterGuides() {
    console.log('🔍 Starting enhanced filter process...');
    
    // Get filter values
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter'); 
    const feeFilter = document.getElementById('fee-filter');
    const keywordCustomInput = document.getElementById('keyword-filter-custom');
    
    const locationValue = locationFilter?.value?.toLowerCase() || '';
    const languageValue = languageFilter?.value?.toLowerCase() || '';
    const feeValue = feeFilter?.value || '';
    
    // Get keyword values from checkboxes
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox:checked, input[type="checkbox"]:checked');
    const selectedKeywords = Array.from(keywordCheckboxes).map(cb => {
      return cb.value?.toLowerCase() || cb.nextElementSibling?.textContent?.toLowerCase() || '';
    }).filter(k => k);
    
    // Get custom keywords
    const customKeywords = keywordCustomInput?.value?.toLowerCase() || '';
    const customKeywordArray = customKeywords ? 
      customKeywords.split(',').map(k => k.trim()).filter(k => k) : [];
    
    const allKeywords = [...selectedKeywords, ...customKeywordArray];
    
    console.log('Filter values:', {
      location: locationValue,
      language: languageValue,
      fee: feeValue,
      keywords: allKeywords
    });
    
    // Get all possible guide cards with multiple selectors
    const allPossibleCards = [
      ...document.querySelectorAll('.guide-item'),
      ...document.querySelectorAll('[data-guide-id]'),
      ...document.querySelectorAll('.col-lg-4 .card'),
      ...document.querySelectorAll('.col-md-6 .card'),
      ...document.querySelectorAll('.guide-card'),
      ...document.querySelectorAll('.card')
    ];
    
    // Remove duplicates
    const uniqueCards = Array.from(new Set(allPossibleCards));
    console.log(`Found ${uniqueCards.length} unique guide cards`);
    
    let visibleCount = 0;
    
    uniqueCards.forEach((card, index) => {
      const shouldShow = checkCardMatchesFilters(card, {
        location: locationValue,
        language: languageValue,
        fee: feeValue,
        keywords: allKeywords
      });
      
      console.log(`Card ${index + 1}: ${shouldShow ? 'SHOW' : 'HIDE'}`);
      
      if (shouldShow) {
        showCard(card);
        visibleCount++;
      } else {
        hideCard(card);
      }
    });
    
    // Update results display
    updateResultsDisplay(visibleCount);
    
    console.log(`✅ Filter complete. Showing ${visibleCount} out of ${uniqueCards.length} guides`);
  }
  
  // Check if card matches filters
  function checkCardMatchesFilters(card, filters) {
    // Skip if no active filters
    if (!filters.location && !filters.language && !filters.fee && filters.keywords.length === 0) {
      return true;
    }
    
    // Get card text content
    const cardText = card.textContent?.toLowerCase() || '';
    const cardName = card.querySelector('.card-title, h5, h6')?.textContent?.toLowerCase() || '';
    const cardLocation = card.querySelector('.location, .text-muted')?.textContent?.toLowerCase() || '';
    const cardPrice = card.querySelector('.price, .badge')?.textContent?.toLowerCase() || '';
    const cardDescription = card.querySelector('.card-text, p')?.textContent?.toLowerCase() || '';
    
    console.log('Card content:', {
      name: cardName,
      location: cardLocation,
      price: cardPrice,
      description: cardDescription.substring(0, 50)
    });
    
    // Location filter
    if (filters.location && !cardText.includes(filters.location) && !cardLocation.includes(filters.location)) {
      console.log('Location filter failed');
      return false;
    }
    
    // Language filter  
    if (filters.language && filters.language !== 'all' && !cardText.includes(filters.language)) {
      console.log('Language filter failed');
      return false;
    }
    
    // Fee filter
    if (filters.fee && filters.fee !== 'all') {
      // Extract price numbers for comparison
      const priceMatch = cardPrice.match(/[\d,]+/);
      if (priceMatch) {
        const price = parseInt(priceMatch[0].replace(',', ''));
        switch (filters.fee) {
          case 'under-10000':
            if (price >= 10000) return false;
            break;
          case '10000-20000':
            if (price < 10000 || price > 20000) return false;
            break;
          case 'over-20000':
            if (price <= 20000) return false;
            break;
        }
      }
    }
    
    // Keyword filter
    if (filters.keywords.length > 0) {
      const hasKeyword = filters.keywords.some(keyword => 
        cardText.includes(keyword) || 
        cardName.includes(keyword) || 
        cardDescription.includes(keyword)
      );
      if (!hasKeyword) {
        console.log('Keyword filter failed');
        return false;
      }
    }
    
    return true;
  }
  
  // Show card function
  function showCard(card) {
    card.style.display = '';
    card.style.opacity = '1';
    card.style.visibility = 'visible';
    card.classList.remove('filtered-out', 'hidden-guide', 'd-none');
    
    // Show parent containers
    const parentCol = card.closest('.col, .col-lg-4, .col-md-6, .col-sm-12');
    if (parentCol) {
      parentCol.style.display = '';
      parentCol.style.opacity = '1';
      parentCol.classList.remove('filtered-out', 'hidden-guide', 'd-none');
    }
  }
  
  // Hide card function
  function hideCard(card) {
    card.style.display = 'none';
    card.style.opacity = '0';
    card.classList.add('filtered-out');
    
    // Hide parent containers
    const parentCol = card.closest('.col, .col-lg-4, .col-md-6, .col-sm-12');
    if (parentCol) {
      parentCol.style.display = 'none';
      parentCol.classList.add('filtered-out');
    }
  }
  
  // Reset all filters
  function resetAllFilters() {
    console.log('🔄 Resetting all filters...');
    
    // Clear all filter inputs
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const feeFilter = document.getElementById('fee-filter');
    const keywordCustomInput = document.getElementById('keyword-filter-custom');
    
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (feeFilter) feeFilter.value = '';
    if (keywordCustomInput) keywordCustomInput.value = '';
    
    // Clear keyword checkboxes
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox, input[type="checkbox"]');
    keywordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Show all cards
    const allCards = [
      ...document.querySelectorAll('.guide-item'),
      ...document.querySelectorAll('[data-guide-id]'),
      ...document.querySelectorAll('.card')
    ];
    
    const uniqueCards = Array.from(new Set(allCards));
    uniqueCards.forEach(card => showCard(card));
    
    // Update results display
    updateResultsDisplay(uniqueCards.length);
    
    console.log(`✅ Reset complete. Showing all ${uniqueCards.length} guides`);
  }
  
  // Update results display
  function updateResultsDisplay(count) {
    // Update counter badges
    const counterElements = document.querySelectorAll('.counter-badge, [class*="counter"], [class*="found"], .badge');
    counterElements.forEach(element => {
      if (element.textContent.includes('Found') || 
          element.textContent.includes('guides') || 
          element.textContent.includes('ガイド')) {
        element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${count} guides found`;
      }
    });
    
    // Update popular guides section title
    const popularGuidesTitle = document.querySelector('h2');
    if (popularGuidesTitle && popularGuidesTitle.textContent.includes('Popular Guides')) {
      const subtitle = popularGuidesTitle.nextElementSibling;
      if (subtitle) {
        subtitle.textContent = `${count} guides found`;
      }
    }
    
    // Update "no results" message
    let noResultsMsg = document.getElementById('no-results-message');
    if (count === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'text-center py-5';
        noResultsMsg.innerHTML = `
          <div class="alert alert-info">
            <i class="bi bi-search me-2"></i>
            <strong>No guides found</strong><br>
            Please try adjusting your search criteria.
          </div>
        `;
        
        const guidesContainer = document.getElementById('guide-cards-container') || 
                              document.querySelector('.row .col-lg-4')?.parentElement ||
                              document.querySelector('.container .row');
        if (guidesContainer) {
          guidesContainer.appendChild(noResultsMsg);
        }
      }
      noResultsMsg.style.display = 'block';
    } else {
      if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
      }
    }
    
    console.log(`Results display updated: ${count} guides`);
  }
  
  // Setup enhanced filter event listeners
  function setupEnhancedFilterEvents() {
    console.log('🎛️ Setting up enhanced filter events...');
    
    // Apply filters button
    const applyBtn = document.getElementById('apply-filters') || 
                    document.querySelector('[onclick*="filterGuides"]') ||
                    document.querySelector('.btn:contains("Search")') ||
                    document.querySelector('.btn-primary');
    
    if (applyBtn) {
      // Remove existing events
      const newApplyBtn = applyBtn.cloneNode(true);
      applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);
      
      newApplyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔍 Apply filters clicked');
        enhancedFilterGuides();
      });
      
      console.log('✅ Apply button configured');
    }
    
    // Reset filters button
    const resetBtn = document.getElementById('reset-filters') ||
                    document.querySelector('[onclick*="resetFilters"]') ||
                    document.querySelector('.btn:contains("Reset")') ||
                    document.querySelector('.btn-secondary');
    
    if (resetBtn) {
      // Remove existing events
      const newResetBtn = resetBtn.cloneNode(true);
      resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
      
      newResetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔄 Reset filters clicked');
        resetAllFilters();
      });
      
      console.log('✅ Reset button configured');
    }
    
    // Auto-filter on input change
    const filterInputs = document.querySelectorAll('#location-filter, #language-filter, #fee-filter, #keyword-filter-custom');
    filterInputs.forEach(input => {
      input.addEventListener('change', () => {
        setTimeout(enhancedFilterGuides, 100);
      });
    });
    
    // Auto-filter on checkbox change
    const checkboxes = document.querySelectorAll('.keyword-checkbox, input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        setTimeout(enhancedFilterGuides, 100);
      });
    });
    
    console.log('✅ Enhanced filter events configured');
  }
  
  // Initialize enhanced filter system
  async function initializeEnhancedFilters() {
    if (isFilterSystemInitialized) {
      console.log('Filter system already initialized');
      return;
    }
    
    console.log('🚀 Initializing enhanced filter system...');
    
    // Wait for guides to load
    const guideCount = await waitForGuides();
    console.log(`Guides loaded: ${guideCount}`);
    
    // Setup events
    setupEnhancedFilterEvents();
    
    // Initial display update
    updateResultsDisplay(guideCount);
    
    isFilterSystemInitialized = true;
    console.log('✅ Enhanced filter system initialized successfully');
  }
  
  // Multiple initialization attempts
  function attemptInitialization() {
    initializeEnhancedFilters();
    
    // Retry after delays
    setTimeout(initializeEnhancedFilters, 500);
    setTimeout(initializeEnhancedFilters, 1500);
    setTimeout(initializeEnhancedFilters, 3000);
  }
  
  // Start initialization
  attemptInitialization();
  
  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptInitialization);
  }
  
  // Window load
  window.addEventListener('load', attemptInitialization);
  
  // Visibility change (for new tabs)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(attemptInitialization, 100);
    }
  });
  
  console.log('📝 Enhanced Filter Fix for English Site loaded');
  
})();