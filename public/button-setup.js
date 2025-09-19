// Unified Button Setup - CSP Compliant
// Centralized event handler setup for all main buttons

/**
 * Setup all main application buttons with consistent event handling
 * Call this function after DOM is loaded to ensure all buttons work
 */
function setupAllButtons() {
    console.log('🔧 Setting up all button event handlers...');
    
    // Setup Dashboard Button
    setupDashboardButton();
    
    // Setup Login Dropdown
    setupLoginDropdown();
    
    // Setup Search Button  
    setupSearchButton();
    
    // Setup Contact Button
    setupContactButton();
    
    // Setup Register Button (Header)
    setupRegisterButton();
    
    // Setup Management Center Buttons
    setupManagementButtons();
    
    // Setup Guide Card Management Buttons (delegated event handling)
    setupGuideCardButtons();
    
    console.log('✅ All button event handlers setup complete');
}

/**
 * Setup Dashboard Button - Opens Management Center
 */
function setupDashboardButton() {
    const dashboardBtn = document.getElementById('dashboardBtn');
    
    if (dashboardBtn) {
        // Remove any existing listeners to prevent duplicates
        dashboardBtn.removeEventListener('click', handleDashboardClick);
        dashboardBtn.addEventListener('click', handleDashboardClick);
        console.log('✅ Dashboard button handler attached');
    } else {
        console.warn('⚠️ Dashboard button not found');
    }
}

function handleDashboardClick(e) {
    e.preventDefault();
    console.log('🏪 Dashboard button clicked - opening sponsor dashboard');
    
    try {
        // Open sponsor dashboard page (for store owners/sponsors)
        window.open('sponsor-dashboard.html', '_blank');
        console.log('✅ Sponsor dashboard opened');
    } catch (error) {
        console.error('❌ Dashboard button error:', error);
        alert('ダッシュボードの表示に失敗しました。');
    }
}

/**
 * Setup Login Dropdown - Toggles custom dropdown visibility
 */
function setupLoginDropdown() {
    const loginDropdown = document.getElementById('loginDropdown');
    const customLoginDropdown = document.getElementById('customLoginDropdown');
    
    if (loginDropdown && customLoginDropdown) {
        // Remove any existing listeners to prevent duplicates
        loginDropdown.removeEventListener('click', handleLoginDropdownClick);
        loginDropdown.addEventListener('click', handleLoginDropdownClick);
        
        // Setup click outside to close dropdown
        document.removeEventListener('click', handleOutsideClick);
        document.addEventListener('click', handleOutsideClick);
        
        console.log('✅ Login dropdown handler attached');
    } else {
        console.warn('⚠️ Login dropdown or custom dropdown not found');
    }
}

function handleLoginDropdownClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const customLoginDropdown = document.getElementById('customLoginDropdown');
    if (customLoginDropdown) {
        const isVisible = customLoginDropdown.style.display === 'block';
        
        if (isVisible) {
            customLoginDropdown.style.display = 'none';
            console.log('🔽 Login dropdown closed');
        } else {
            customLoginDropdown.style.display = 'block';
            console.log('🔼 Login dropdown opened');
        }
    }
}

function handleOutsideClick(e) {
    const loginDropdown = document.getElementById('loginDropdown');
    const customLoginDropdown = document.getElementById('customLoginDropdown');
    
    if (loginDropdown && customLoginDropdown) {
        if (!loginDropdown.contains(e.target) && !customLoginDropdown.contains(e.target)) {
            customLoginDropdown.style.display = 'none';
        }
    }
}

/**
 * Setup Search Button - Triggers filtering functionality
 */
function setupSearchButton() {
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn) {
        // Remove any existing listeners to prevent duplicates
        searchBtn.removeEventListener('click', handleSearchClick);
        searchBtn.addEventListener('click', handleSearchClick);
        console.log('✅ Search button handler attached');
    } else {
        console.warn('⚠️ Search button not found');
    }
}

function handleSearchClick(e) {
    e.preventDefault();
    console.log('🔍 Search button clicked - applying filters');
    
    try {
        // Check if filterGuides function exists
        if (typeof filterGuides === 'function') {
            filterGuides();
            console.log('✅ filterGuides() called successfully');
        } else if (typeof applyCurrentFilters === 'function') {
            applyCurrentFilters();
            console.log('✅ applyCurrentFilters() called successfully');
        } else if (window.AppState && window.renderGuideCards) {
            // Fallback: manual filter application
            handleManualSearch();
        } else {
            alert('検索機能は現在利用できません。');
            console.error('❌ No search function available');
        }
    } catch (error) {
        console.error('❌ Search button error:', error);
        alert('検索に失敗しました。');
    }
}

function handleManualSearch() {
    console.log('🔍 Manual search triggered');
    
    // Get filter values
    const locationFilter = document.getElementById('locationFilter');
    const languageFilter = document.getElementById('languageFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    const locationValue = locationFilter?.value || '';
    const languageValue = languageFilter?.value || '';
    const priceValue = priceFilter?.value || '';
    
    console.log('🎯 Search filters:', { locationValue, languageValue, priceValue });
    
    // Apply filters if AppState is available
    if (window.AppState && window.AppState.guides) {
        let filteredGuides = [...window.AppState.guides];
        
        // Apply location filter with improved matching
        if (locationValue) {
            filteredGuides = filteredGuides.filter(guide => {
                // Try to match location string to prefecture code
                // This requires prefecture-selector.mjs to be loaded
                try {
                    // Basic matching for immediate filtering
                    const prefectureName = window.locationNames[locationValue];
                    return guide.location === locationValue || 
                           guide.prefecture === locationValue ||
                           (prefectureName && guide.location && guide.location.includes(prefectureName)) ||
                           guide.location === prefectureName;
                } catch (error) {
                    console.warn('Location matching fallback:', error);
                    return guide.location === locationValue || guide.prefecture === locationValue;
                }
            });
        }
        
        if (languageValue) {
            filteredGuides = filteredGuides.filter(guide => 
                guide.languages && guide.languages.includes(languageValue)
            );
        }
        
        if (priceValue) {
            filteredGuides = filteredGuides.filter(guide => {
                // Handle different price field names
                const price = parseInt(guide.sessionRate) || parseInt(guide.price) || 0;
                switch(priceValue) {
                    case 'budget': return price >= 6000 && price <= 10000;
                    case 'premium': return price >= 10001 && price <= 20000;
                    case 'luxury': return price >= 20001;
                    default: return true;
                }
            });
        }
        
        console.log(`✅ Filtered: ${filteredGuides.length}/${window.AppState.guides.length} guides`);
        
        // Re-render guide cards if function is available
        if (window.renderGuideCards) {
            window.renderGuideCards(filteredGuides);
        }
        
        // Update counters if function is available
        if (window.updateGuideCounters) {
            window.updateGuideCounters(filteredGuides.length, window.AppState.guides.length);
        }
        
        // Scroll to results
        const guideSection = document.getElementById('guideSection') || document.querySelector('.guide-cards-container');
        if (guideSection) {
            guideSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

/**
 * Setup Contact Button - Opens contact functionality
 */
function setupContactButton() {
    const contactBtn = document.getElementById('contactBtn');
    
    if (contactBtn) {
        // Remove any existing listeners to prevent duplicates
        contactBtn.removeEventListener('click', handleContactClick);
        contactBtn.addEventListener('click', handleContactClick);
        console.log('✅ Contact button handler attached');
    } else {
        console.warn('⚠️ Contact button not found');
    }
}

function handleContactClick(e) {
    e.preventDefault();
    console.log('📞 Contact button clicked - opening Japanese contact page');
    
    try {
        // Always open the beautiful Japanese contact page
        window.open('chat.html', '_blank');
        console.log('✅ Japanese contact page opened');
    } catch (error) {
        console.error('❌ Contact button error:', error);
        // Fallback: show contact options
        showContactOptions();
    }
}

function showContactOptions() {
    const contactOptions = `
お問い合わせ方法を選択してください：

1. メール: support@tomotrip.com
2. 電話: 03-1234-5678 (平日 9:00-18:00)
3. チャット: サイト右下のチャットボタン

どちらをご希望ですか？
    `;
    
    if (confirm(contactOptions + '\n\nメールを開きますか？')) {
        window.location.href = 'mailto:support@tomotrip.com?subject=TomoTripお問い合わせ&body=お問い合わせ内容をこちらに記載してください。';
    }
}

/**
 * Setup Register Button - Opens registration options
 */
function setupRegisterButton() {
    const registerBtn = document.getElementById('registerBtn');
    
    if (registerBtn) {
        // Remove any existing listeners to prevent duplicates
        registerBtn.removeEventListener('click', handleRegisterClick);
        registerBtn.addEventListener('click', handleRegisterClick);
        console.log('✅ Register button handler attached');
    } else {
        console.warn('⚠️ Register button not found');
    }
}

function handleRegisterClick(e) {
    e.preventDefault();
    console.log('📝 Register button clicked - showing registration choice');
    
    try {
        // Try to show registration choice first
        if (typeof window.showRegistrationChoice === 'function') {
            console.log('✅ Using window.showRegistrationChoice');
            window.showRegistrationChoice();
        } else if (typeof showRegistrationChoice === 'function') {
            console.log('✅ Using showRegistrationChoice');
            showRegistrationChoice();
        } else {
            // Manually create and show registration choice
            console.log('🔧 Creating registration choice manually');
            showRegistrationChoiceManual();
        }
    } catch (error) {
        console.error('❌ Register button error:', error);
        alert('新規登録機能に問題が発生しました。しばらくお待ちください。');
    }
}

function showRegistrationChoiceManual() {
    console.log('🔧 Showing registration choice manually');
    
    let formContainer = document.getElementById('registrationFormContainer');
    if (!formContainer) {
        console.warn('⚠️ Registration form container not found, creating one');
        // Create the container if it doesn't exist
        formContainer = document.createElement('div');
        formContainer.id = 'registrationFormContainer';
        formContainer.style.display = 'none';
        
        // Insert after the navigation
        const nav = document.querySelector('nav');
        if (nav && nav.parentNode) {
            nav.parentNode.insertBefore(formContainer, nav.nextSibling);
        } else {
            document.body.appendChild(formContainer);
        }
    }
    
    // Clear any existing content
    formContainer.innerHTML = '';
    
    // Create registration choice content
    const choiceContent = `
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="choice-container" style="background: white; border-radius: 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); margin: 2rem 0;">
                    <div class="choice-header" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 2rem; border-radius: 20px 20px 0 0; text-align: center;">
                        <h1><i class="bi bi-person-plus me-2"></i>登録タイプを選択</h1>
                        <p class="mb-0">お客様の用途に合わせて適切な登録タイプをお選びください</p>
                    </div>
                    
                    <div class="choice-body" style="padding: 2.5rem;">
                        <div class="row g-4">
                            <!-- Tourist Registration -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 border-primary choice-card" style="cursor: pointer; border-radius: 15px; border-width: 2px; transition: transform 0.2s;" onclick="openTouristRegistration()">
                                    <div class="card-body text-center p-4">
                                        <i class="bi bi-person-check text-primary mb-3" style="font-size: 3rem;"></i>
                                        <h6 class="fw-bold text-primary mb-2">観光客登録</h6>
                                        <p class="text-muted small mb-3">地元ガイドサービスを利用するための登録です</p>
                                        <div class="mt-3">
                                            <span class="badge bg-primary">個人向け</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Guide Registration -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 border-success choice-card" style="cursor: pointer; border-radius: 15px; border-width: 2px; transition: transform 0.2s;" onclick="window.open('guide-registration-perfect.html', '_blank')">
                                    <div class="card-body text-center p-4">
                                        <i class="bi bi-person-badge text-success mb-3" style="font-size: 3rem;"></i>
                                        <h6 class="fw-bold text-success mb-2">ガイド登録</h6>
                                        <p class="text-muted small mb-3">地元ガイドとして観光客にサービスを提供します</p>
                                        <div class="mt-3">
                                            <span class="badge bg-success">フリーランス</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Sponsor Registration -->
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 border-warning choice-card" style="cursor: pointer; border-radius: 15px; border-width: 2px; transition: transform 0.2s;" onclick="handleSponsorRegistration()">
                                    <div class="card-body text-center p-4">
                                        <i class="bi bi-building text-warning mb-3" style="font-size: 3rem;"></i>
                                        <h6 class="fw-bold text-warning mb-2">協賛店登録</h6>
                                        <p class="text-muted small mb-3">お店や施設を協賛店として登録し、観光客にPRできます</p>
                                        <div class="mt-3">
                                            <span class="badge bg-warning">ビジネス向け</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-center mt-4">
                            <button type="button" class="btn btn-outline-secondary" onclick="hideRegistrationChoice()" style="border-radius: 25px; padding: 12px 30px;">キャンセル</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    formContainer.innerHTML = choiceContent;
    formContainer.style.display = 'block';
    
    // Scroll to the form container
    setTimeout(() => {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
    
    console.log('✅ Registration choice displayed manually');
}

// Helper functions for registration choices
function openTouristRegistration() {
    console.log('🎯 Tourist registration selected');
    hideRegistrationChoice();
    window.open('tourist-registration-simple.html', '_blank');
}

function openGuideRegistration() {
    console.log('🎯 Guide registration selected - opening PERFECT detailed form');
    hideRegistrationChoice();
    
    // Open the PERFECT guide registration form in new window
    try {
        const newWindow = window.open('guide-registration-perfect.html', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
        if (newWindow) {
            console.log('✅ PERFECT guide registration form opened in new window');
        } else {
            // Fallback: redirect in same window
            window.location.href = 'guide-registration-perfect.html';
        }
    } catch (error) {
        console.error('❌ Error opening PERFECT guide registration form:', error);
        alert('ガイド登録フォームの表示に問題が発生しました。');
    }
}

function handleSponsorRegistration() {
    console.log('🎯 Sponsor registration selected');
    hideRegistrationChoice();
    window.open('sponsor-registration.html', '_blank');
}

function hideRegistrationChoice() {
    console.log('🛑 Hiding registration choice');
    const formContainer = document.getElementById('registrationFormContainer');
    if (formContainer) {
        formContainer.style.display = 'none';
        formContainer.innerHTML = '';
        console.log('✅ Registration choice hidden');
    }
}


/**
 * Setup Management Center Buttons - Both desktop and mobile
 */
function setupManagementButtons() {
    const managementBtn = document.getElementById('managementBtn');
    const managementBtnMobile = document.getElementById('managementBtnMobile');
    
    [managementBtn, managementBtnMobile].forEach(btn => {
        if (btn && !btn.hasAttribute('data-handler-added')) {
            // Remove any existing listeners to prevent duplicates
            btn.removeEventListener('click', handleManagementClick);
            btn.addEventListener('click', handleManagementClick);
            btn.setAttribute('data-handler-added', 'true');
            console.log('✅ Management center button handler attached');
        }
    });
}

function handleManagementClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('🏆 Management center button clicked');
    
    try {
        // Check if management modal exists
        const managementModal = document.getElementById('managementModal');
        if (managementModal) {
            // Load management data if function exists
            if (typeof loadManagementData === 'function') {
                loadManagementData();
            }
            const modal = new bootstrap.Modal(managementModal);
            modal.show();
            console.log('✅ Management center opened');
        } else {
            // Fallback: show simple alert
            alert('管理センターは準備中です。ブックマークと比較機能は各ガイドカードのボタンからご利用いただけます。');
        }
    } catch (error) {
        console.error('❌ Management center error:', error);
        alert('管理センターの表示に問題が発生しました。');
    }
}

/**
 * Setup Guide Card Management Buttons - Bookmark and Compare (delegated event handling)
 */
function setupGuideCardButtons() {
    // Use delegated event handling since guide cards are dynamically generated
    document.addEventListener('click', function(e) {
        // Handle bookmark button clicks (use closest for better event targeting)
        const bookmarkBtn = e.target.closest('.bookmark-btn');
        if (bookmarkBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const guideId = bookmarkBtn.getAttribute('data-guide-id');
            handleBookmarkClick(guideId, bookmarkBtn);
        }
        
        // Handle compare button clicks (use closest for better event targeting)
        const compareBtn = e.target.closest('.compare-btn');
        if (compareBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const guideId = compareBtn.getAttribute('data-guide-id');
            handleCompareClick(guideId, compareBtn);
        }
    });
    
    console.log('✅ Guide card button delegation setup complete');
}

function handleBookmarkClick(guideId, buttonElement) {
    console.log('⭐ Bookmark button clicked for guide:', guideId);
    
    try {
        // Get current bookmarks
        let bookmarkedGuides = JSON.parse(localStorage.getItem('bookmarkedGuides') || '[]');
        
        // Check if already bookmarked
        const isBookmarked = bookmarkedGuides.includes(guideId) || bookmarkedGuides.includes(parseInt(guideId));
        
        if (isBookmarked) {
            // Remove from bookmarks
            bookmarkedGuides = bookmarkedGuides.filter(id => id != guideId && id != parseInt(guideId));
            buttonElement.classList.remove('btn-warning');
            buttonElement.classList.add('btn-outline-warning');
            console.log('📌 Guide removed from bookmarks');
        } else {
            // Add to bookmarks
            bookmarkedGuides.push(guideId);
            buttonElement.classList.remove('btn-outline-warning');
            buttonElement.classList.add('btn-warning');
            console.log('⭐ Guide added to bookmarks');
        }
        
        // Save to localStorage
        localStorage.setItem('bookmarkedGuides', JSON.stringify(bookmarkedGuides));
        
        // Show feedback
        const action = isBookmarked ? '削除しました' : '追加しました';
        safeShowToast(`ブックマークに${action}`, 'success');
        
    } catch (error) {
        console.error('❌ Bookmark error:', error);
        safeShowToast('ブックマークの操作に失敗しました', 'error');
    }
}

function handleCompareClick(guideId, buttonElement) {
    console.log('✓ Compare button clicked for guide:', guideId);
    
    try {
        // Get current comparison list
        let comparisonGuides = JSON.parse(localStorage.getItem('comparisonGuides') || '[]');
        
        // Check if already in comparison
        const isInComparison = comparisonGuides.includes(guideId) || comparisonGuides.includes(parseInt(guideId));
        
        if (isInComparison) {
            // Remove from comparison
            comparisonGuides = comparisonGuides.filter(id => id != guideId && id != parseInt(guideId));
            buttonElement.classList.remove('btn-success');
            buttonElement.classList.add('btn-outline-success');
            console.log('📊 Guide removed from comparison');
        } else {
            // Check comparison limit
            if (comparisonGuides.length >= 3) {
                safeShowToast('比較リストは最大3件までです', 'warning');
                return;
            }
            
            // Add to comparison
            comparisonGuides.push(guideId);
            buttonElement.classList.remove('btn-outline-success');
            buttonElement.classList.add('btn-success');
            console.log('✓ Guide added to comparison');
        }
        
        // Save to localStorage
        localStorage.setItem('comparisonGuides', JSON.stringify(comparisonGuides));
        
        // Show feedback
        const action = isInComparison ? '削除しました' : '追加しました';
        safeShowToast(`比較リストに${action}`, 'success');
        
    } catch (error) {
        console.error('❌ Compare error:', error);
        safeShowToast('比較リストの操作に失敗しました', 'error');
    }
}

// Safe wrapper for toast notifications
function safeShowToast(message, type = 'info') {
    if (typeof showToast === 'function') {
        return showToast(message, type);
    }
    // Fallback implementation
    return showToastFallback(message, type);
}

function showToast(message, type = 'info') {
    // Simple toast implementation
    const toastContainer = document.createElement('div');
    toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-size: 14px;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    toastContainer.textContent = message;
    
    document.body.appendChild(toastContainer);
    
    // Show toast
    setTimeout(() => {
        toastContainer.style.opacity = '1';
        toastContainer.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toastContainer.style.opacity = '0';
        toastContainer.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (toastContainer.parentNode) {
                toastContainer.parentNode.removeChild(toastContainer);
            }
        }, 300);
    }, 3000);
}

// Fallback toast implementation (alias for main implementation)
function showToastFallback(message, type = 'info') {
    return showToast(message, type);
}

/**
 * Initialize all buttons when DOM is ready
 */
function initializeButtons() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAllButtons);
    } else {
        setupAllButtons();
    }
}

// Auto-initialize if this script is loaded
initializeButtons();

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.setupAllButtons = setupAllButtons;
    window.handleDashboardClick = handleDashboardClick;
    window.handleLoginDropdownClick = handleLoginDropdownClick;
    window.handleSearchClick = handleSearchClick;
    window.handleContactClick = handleContactClick;
    window.handleRegisterClick = handleRegisterClick;
}