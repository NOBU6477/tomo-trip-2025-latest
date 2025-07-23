// English version guide count and filter fix system
(function() {
    'use strict';
    
    function updateGuideCount() {
        // Count actual visible guide cards
        const visibleGuideCards = document.querySelectorAll('.guide-card:not([style*="display: none"])');
        const actualCount = visibleGuideCards.length;
        
        // Update counter elements
        const countElement = document.getElementById('guide-count-number');
        if (countElement && actualCount > 0) {
            countElement.textContent = actualCount;
            console.log(`Guide counter updated: ${actualCount} guides`);
        }
        
        // Update "X guides found" text
        const guideCountText = document.querySelector('.guide-counter');
        if (guideCountText && actualCount > 0) {
            const peopleIcon = '<i class="bi bi-people-fill me-2"></i>';
            guideCountText.innerHTML = `${peopleIcon}<span id="guide-count-number">${actualCount}</span> guides found`;
        }
        
        return actualCount;
    }
    
    // Setup filter button functionality
    function setupFilterButton() {
        const filterBtn = document.getElementById('filterToggleBtn');
        const filterCard = document.getElementById('filter-card');
        
        if (filterBtn && filterCard) {
            // Remove existing event listeners
            const newBtn = filterBtn.cloneNode(true);
            filterBtn.parentNode.replaceChild(newBtn, filterBtn);
            
            // Add new event listener
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Filter button clicked');
                
                if (filterCard.classList.contains('d-none')) {
                    filterCard.classList.remove('d-none');
                    newBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Close Filter';
                    console.log('Filter shown');
                } else {
                    filterCard.classList.add('d-none');
                    newBtn.innerHTML = '<i class="bi bi-funnel"></i> Filter Guides';
                    console.log('Filter hidden');
                }
            });
            
            console.log('Filter button setup complete');
        }
    }
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('English guide count fix system started');
        
        // Initial count update
        setTimeout(updateGuideCount, 100);
        
        // Filter button setup
        setTimeout(setupFilterButton, 200);
        
        // Periodic count updates (every 3 seconds)
        setInterval(updateGuideCount, 3000);
    });
    
    // Also run on window load
    window.addEventListener('load', function() {
        setTimeout(updateGuideCount, 300);
        setTimeout(setupFilterButton, 400);
    });
    
    // Expose as global functions
    window.updateGuideCount = updateGuideCount;
    window.setupFilterButton = setupFilterButton;
    
})();