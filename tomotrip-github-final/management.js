// Management Center Functions - CSP Compliant
// All management-related inline scripts moved to external file

// Use global locationNames (defined in app-init.js) - no local declaration

// Management Center Functions
function showManagementCenter() {
    console.log('Opening Management Center...');
    loadManagementData();
    const managementModal = new bootstrap.Modal(document.getElementById('managementModal'));
    managementModal.show();
}

function loadManagementData() {
    loadBookmarksList();
    loadComparisonList();
    loadBookingsList();
    loadSettingsData();
}

function loadBookmarksList() {
    const bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
    const bookmarksList = document.getElementById('bookmarksList');
    
    if (bookmarkedGuides.length === 0) {
        bookmarksList.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-bookmark text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-3">保存されたガイドはありません</p>
            </div>
        `;
        return;
    }
    
    const allGuides = loadAllGuides();
    bookmarksList.innerHTML = bookmarkedGuides.map(guideId => {
        const guide = allGuides.find(g => g.id == guideId);
        if (!guide) return '';
        
        return `
            <div class="col-md-6 mb-3">
                <div class="card h-100">
                    <div class="row g-0">
                        <div class="col-4">
                            <img src="attached_assets/image_1754398586272.png" class="img-fluid rounded-start h-100" style="object-fit: cover;" alt="ガイド">
                        </div>
                        <div class="col-8">
                            <div class="card-body p-3">
                                <h6 class="card-title mb-1">${guide.name}</h6>
                                <p class="card-text small text-muted mb-2">${window.locationNames[guide.location] || guide.location}</p>
                                <p class="card-text"><strong>¥${Number(guide?.price || 0).toLocaleString()}</strong></p>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-outline-primary btn-sm" data-action="show-guide-detail" data-guide-id="${guide.id}">詳細</button>
                                    <button class="btn btn-outline-danger btn-sm" data-action="remove-bookmark" data-guide-id="${guide.id}">削除</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Setup event listeners for dynamically created buttons
    setupManagementEventListeners();
}

function loadComparisonList() {
    const comparisonGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
    const comparisonList = document.getElementById('comparisonList');
    
    if (comparisonGuides.length === 0) {
        comparisonList.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-graph-up text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-3">比較中のガイドはありません</p>
            </div>
        `;
        return;
    }
    
    const allGuides = loadAllGuides();
    comparisonList.innerHTML = comparisonGuides.map(guideId => {
        const guide = allGuides.find(g => g.id == guideId);
        if (!guide) return '';
        
        return `
            <div class="col-md-4 mb-3">
                <div class="card h-100 border-success">
                    <img src="attached_assets/image_1754398586272.png" class="card-img-top" style="height: 120px; object-fit: cover;" alt="ガイド">
                    <div class="card-body p-3 d-flex flex-column">
                        <h6 class="card-title mb-1">${guide.name}</h6>
                        <p class="card-text small text-muted mb-1">${window.locationNames[guide.location] || guide.location}</p>
                        <p class="card-text small mb-2"><span class="text-warning">★</span> ${guide.rating}</p>
                        <p class="card-text mb-3"><strong>¥${Number(guide?.price || 0).toLocaleString()}</strong></p>
                        <div class="mt-auto">
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-primary btn-sm" data-action="show-guide-detail" data-guide-id="${guide.id}">
                                    <i class="bi bi-info-circle me-1"></i>詳細
                                </button>
                                <button class="btn btn-outline-danger btn-sm" data-action="remove-from-comparison" data-guide-id="${guide.id}">
                                    <i class="bi bi-x me-1"></i>比較から除外
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Setup event listeners for dynamically created buttons
    setupManagementEventListeners();
}

function loadBookingsList() {
    const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const bookingsList = document.getElementById('bookingsList');
    
    if (userBookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-calendar3 text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-3">予約履歴はありません</p>
            </div>
        `;
        return;
    }
    
    // Sort bookings by date (newest first)
    const sortedBookings = userBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    
    bookingsList.innerHTML = sortedBookings.map(booking => {
        const statusBadge = {
            'pending': '<span class="badge bg-warning">予約中</span>',
            'confirmed': '<span class="badge bg-success">確定</span>',
            'completed': '<span class="badge bg-info">完了</span>',
            'cancelled': '<span class="badge bg-danger">キャンセル</span>'
        };
        
        return `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="attached_assets/image_1754398586272.png" class="img-fluid rounded-circle" style="width: 60px; height: 60px; object-fit: cover;" alt="ガイド">
                        </div>
                        <div class="col-md-6">
                            <h6 class="mb-1">${booking.guideName || 'ガイド名'}</h6>
                            <p class="mb-1 text-muted small">予約ID: #${booking.id || 'N/A'}</p>
                            <p class="mb-0 small">日時: ${booking.date || ''} ${booking.time || ''} (${booking.duration || 0}時間)</p>
                        </div>
                        <div class="col-md-2 text-center">
                            <strong>${booking.totalPrice}</strong>
                        </div>
                        <div class="col-md-2 text-center">
                            ${statusBadge[booking.status] || '<span class="badge bg-secondary">不明</span>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadSettingsData() {
    // Load user settings from localStorage
    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Populate form fields
    if (userSettings.notifications !== undefined) {
        const notificationCheckbox = document.getElementById('notificationSettings');
        if (notificationCheckbox) notificationCheckbox.checked = userSettings.notifications;
    }
    
    if (userSettings.language) {
        const languageSelect = document.getElementById('languageSettings');
        if (languageSelect) languageSelect.value = userSettings.language;
    }
    
    if (userSettings.currency) {
        const currencySelect = document.getElementById('currencySettings');
        if (currencySelect) currencySelect.value = userSettings.currency;
    }
}

// Setup event listeners for management center buttons
function setupManagementEventListeners() {
    // Remove existing listeners to prevent duplicates
    const buttons = document.querySelectorAll('[data-action]');
    buttons.forEach(button => {
        button.removeEventListener('click', handleManagementAction);
        button.addEventListener('click', handleManagementAction);
    });
    
    // Setup image error handling for CSP compliance
    setTimeout(() => {
        const images = document.querySelectorAll('img[data-fallback]');
        images.forEach(img => {
            img.addEventListener('error', function() {
                if (this.src !== this.dataset.fallback) {
                    this.src = this.dataset.fallback;
                    console.log('Image fallback applied');
                }
            });
            img.addEventListener('load', function() {
                console.log('Image loaded successfully');
            });
        });
    }, 100);
}

// Handle management center button actions
function handleManagementAction(event) {
    const action = event.target.getAttribute('data-action');
    const guideId = event.target.getAttribute('data-guide-id');
    
    switch (action) {
        case 'show-guide-detail':
            if (typeof showGuideDetailModal === 'function') {
                showGuideDetailModal(parseInt(guideId));
            }
            break;
        case 'remove-bookmark':
            if (typeof removeBookmark === 'function') {
                removeBookmark(parseInt(guideId));
            }
            break;
        case 'remove-from-comparison':
            if (typeof removeFromComparison === 'function') {
                removeFromComparison(parseInt(guideId));
            }
            break;
    }
}

// Clear all data functions
function clearAllBookmarks() {
    if (confirm('すべてのブックマークを削除しますか？')) {
        localStorage.removeItem('bookmarkedGuides');
        loadBookmarksList();
        console.log('All bookmarks cleared');
    }
}

function clearAllComparisons() {
    if (confirm('すべての比較データを削除しますか？')) {
        localStorage.removeItem('comparisonGuides');
        loadComparisonList();
        console.log('All comparisons cleared');
    }
}

function clearAllBookings() {
    if (confirm('すべての予約履歴を削除しますか？')) {
        localStorage.removeItem('userBookings');
        loadBookingsList();
        console.log('All bookings cleared');
    }
}

function saveSettings() {
    const settings = {
        notifications: document.getElementById('notificationSettings')?.checked || false,
        language: document.getElementById('languageSettings')?.value || 'ja',
        currency: document.getElementById('currencySettings')?.value || 'JPY'
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Show success message
    const toast = new bootstrap.Toast(document.getElementById('settingsToast'));
    toast.show();
    
    console.log('Settings saved:', settings);
}