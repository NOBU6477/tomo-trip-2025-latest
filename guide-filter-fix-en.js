/**
 * Guide Filter Fix - English Version
 * Comprehensive filter functionality for English site
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Applying English guide filter fix...');
  
  // Override original filter apply and reset button events
  const applyFiltersBtn = document.getElementById('apply-filters');
  const resetFiltersBtn = document.getElementById('reset-filters');
  
  if (applyFiltersBtn) {
    // Remove existing event listeners
    const newApplyBtn = applyFiltersBtn.cloneNode(true);
    applyFiltersBtn.parentNode.replaceChild(newApplyBtn, applyFiltersBtn);
    
    // Add new event listener
    newApplyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Apply filters (English version)');
      enhancedFilterGuidesEN();
    });
  }
  
  if (resetFiltersBtn) {
    // Remove existing event listeners
    const newResetBtn = resetFiltersBtn.cloneNode(true);
    resetFiltersBtn.parentNode.replaceChild(newResetBtn, resetFiltersBtn);
    
    // Add new event listener
    newResetBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Reset filters (English version)');
      resetAllFiltersEN();
    });
  }
  
  // Reset all filters
  function resetAllFiltersEN() {
    // Clear all filter inputs
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const feeFilter = document.getElementById('fee-filter');
    const keywordCustomInput = document.getElementById('keyword-filter-custom');
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
    
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (feeFilter) feeFilter.value = '';
    if (keywordCustomInput) keywordCustomInput.value = '';
    
    // Clear keyword checkboxes
    keywordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Show all guide cards
    const guideCards = document.querySelectorAll('.guide-item, .col-lg-4, .col-md-6');
    guideCards.forEach(card => {
      // Remove all filter-related classes and styles
      card.classList.remove('filtered-out', 'hidden-guide');
      card.style.display = '';
      card.style.opacity = '1';
      
      // Also check parent container
      const parentItem = card.closest('.guide-item, .col, .col-md-4, .col-lg-4, .col-md-6');
      if (parentItem) {
        parentItem.classList.remove('filtered-out', 'hidden-guide');
        parentItem.style.display = '';
        parentItem.style.opacity = '1';
      }
    });
    
    // Update results display with total count
    const totalGuides = guideCards.length;
    updateResultsDisplayEN(totalGuides);
    
    // Hide "Load More" button if exists
    const loadMoreBtn = document.getElementById('load-more-guides');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
    
    console.log(`Reset complete. Showing all ${totalGuides} guides.`);
  }
  
  // Enhanced filter function
  function enhancedFilterGuidesEN() {
    console.log('Starting enhanced filter process...');
    
    // Get filter values
    const locationValue = document.getElementById('location-filter')?.value?.toLowerCase() || '';
    const languageValue = document.getElementById('language-filter')?.value?.toLowerCase() || '';
    const feeValue = document.getElementById('fee-filter')?.value || '';
    
    // Get keyword values from checkboxes and custom input
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox:checked');
    const selectedKeywords = Array.from(keywordCheckboxes).map(cb => cb.value.toLowerCase());
    
    const customKeywords = document.getElementById('keyword-filter-custom')?.value?.toLowerCase() || '';
    const customKeywordArray = customKeywords ? customKeywords.split(',').map(k => k.trim()).filter(k => k) : [];
    
    const allKeywords = [...selectedKeywords, ...customKeywordArray];
    
    console.log('Filter values:', {
      location: locationValue,
      language: languageValue,
      fee: feeValue,
      keywords: allKeywords
    });
    
    // Get all guide cards
    const guideCards = document.querySelectorAll('.guide-item, .col-lg-4, .col-md-6');
    let visibleCount = 0;
    
    guideCards.forEach(card => {
      const shouldShow = checkGuideMatchesFiltersEN(card, {
        location: locationValue,
        language: languageValue,
        fee: feeValue,
        keywords: allKeywords
      });
      
      if (shouldShow) {
        // Show the card
        card.classList.remove('filtered-out', 'hidden-guide');
        card.style.display = '';
        card.style.opacity = '1';
        
        // Also check parent container
        const parentItem = card.closest('.guide-item, .col, .col-md-4, .col-lg-4, .col-md-6');
        if (parentItem) {
          parentItem.classList.remove('filtered-out', 'hidden-guide');
          parentItem.style.display = '';
          parentItem.style.opacity = '1';
        }
        
        visibleCount++;
      } else {
        // Hide the card
        card.classList.add('filtered-out');
        card.style.display = 'none';
        
        // Also hide parent container
        const parentItem = card.closest('.guide-item, .col, .col-md-4, .col-lg-4, .col-md-6');
        if (parentItem) {
          parentItem.classList.add('filtered-out');
          parentItem.style.display = 'none';
        }
      }
    });
    
    // Update results display
    updateResultsDisplayEN(visibleCount);
    
    console.log(`Filter complete. Showing ${visibleCount} of ${guideCards.length} guides.`);
  }
  
  // Check if guide matches filters
  function checkGuideMatchesFiltersEN(card, filters) {
    // Get guide data from card attributes or text content
    const cardText = card.textContent.toLowerCase();
    const locationText = card.querySelector('.text-muted')?.textContent?.toLowerCase() || '';
    const languageBadges = card.querySelectorAll('.badge');
    const languageText = Array.from(languageBadges).map(badge => badge.textContent.toLowerCase()).join(' ');
    const priceText = card.querySelector('.price-badge')?.textContent || '';
    
    // Location filter
    if (filters.location && !locationText.includes(filters.location) && !cardText.includes(filters.location)) {
      return false;
    }
    
    // Language filter  
    if (filters.language && !languageText.includes(filters.language) && !cardText.includes(filters.language)) {
      return false;
    }
    
    // Fee filter
    if (filters.fee) {
      const priceMatch = priceText.match(/¥([\d,]+)/);
      if (priceMatch) {
        const price = parseInt(priceMatch[1].replace(',', ''));
        
        switch (filters.fee) {
          case '6000-10000':
            if (price < 6000 || price > 10000) return false;
            break;
          case '10000-15000':
            if (price < 10000 || price > 15000) return false;
            break;
          case '15000-20000':
            if (price < 15000 || price > 20000) return false;
            break;
          case '20000+':
            if (price < 20000) return false;
            break;
        }
      }
    }
    
    // Keywords filter - check if ANY keyword matches
    if (filters.keywords && filters.keywords.length > 0) {
      const hasKeywordMatch = filters.keywords.some(keyword => 
        cardText.includes(keyword) || 
        locationText.includes(keyword) ||
        languageText.includes(keyword)
      );
      if (!hasKeywordMatch) {
        return false;
      }
    }
    
    return true;
  }
  
  // Toggle card visibility
  function toggleCardVisibilityEN(card, shouldShow) {
    const guideItem = card.closest('.guide-item, .col, .col-md-4, .col-lg-4, .col-md-6');
    
    if (shouldShow) {
      if (guideItem) {
        guideItem.style.display = '';
        guideItem.classList.remove('d-none', 'hidden-guide');
      }
      card.style.display = '';
      card.classList.remove('d-none', 'hidden-guide');
    } else {
      if (guideItem) {
        guideItem.style.display = 'none';
        guideItem.classList.add('hidden-guide');
      }
      card.style.display = 'none';
      card.classList.add('hidden-guide');
    }
  }
  
  // Update results display
  function updateResultsDisplayEN(count) {
    // Update main counter badge (showing current displayed vs total)
    const counter = document.querySelector('.counter-badge');
    if (counter) {
      counter.innerHTML = `<i class="bi bi-people-fill me-2"></i>Showing ${count} guides (out of 70 total)`;
    }
    
    // Update search results counter
    const searchCounter = document.getElementById('search-results-counter');
    if (searchCounter) {
      searchCounter.textContent = `${count} guides found`;
      searchCounter.classList.remove('d-none');
    }
    
    // Show/hide no results message
    const noResultsMessage = document.getElementById('no-results-message');
    if (count === 0) {
      if (noResultsMessage) {
        noResultsMessage.classList.remove('d-none');
      }
      if (searchCounter) {
        searchCounter.textContent = '0 guides found';
      }
    } else {
      if (noResultsMessage) {
        noResultsMessage.classList.add('d-none');
      }
    }
    
    console.log(`Display updated: ${count} guides shown`);
  }
  
  console.log('English guide filter fix applied successfully');
});