// Event handlers - centralized setup
export function setupEventListeners() {
    console.log('%cSetting up event listeners...', 'color: #007bff;');
    
    // Guide cards click handling
    setupGuideCardEvents();
    
    // Modal handling
    setupModalEvents();
    
    // Filter and search
    setupFilterEvents();
    
    // Pagination
    setupPaginationEvents();
    
    console.log('%cEvent listeners setup complete', 'color: #28a745;');
}

function setupGuideCardEvents() {
    // Guide card click handlers will be set up when cards are rendered
    document.addEventListener('click', function(e) {
        const guideCard = e.target.closest('.guide-card, .card[data-guide-id]');
        if (guideCard) {
            const guideId = guideCard.dataset.guideId;
            if (guideId) {
                console.log('Guide card clicked:', guideId);
                // Guide detail logic would go here
            }
        }
    });
}

function setupModalEvents() {
    // Modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-bs-dismiss="modal"]')) {
            console.log('Modal dismiss clicked');
        }
    });
}

function setupFilterEvents() {
    // Filter button handlers
    const filterButtons = document.querySelectorAll('.filter-btn, .btn-filter');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Filter clicked:', this.textContent);
        });
    });
}

function setupPaginationEvents() {
    // Pagination handlers
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            console.log('Previous page clicked');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            console.log('Next page clicked');
        });
    }
}