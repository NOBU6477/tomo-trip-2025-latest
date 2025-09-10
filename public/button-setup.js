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
    
    // Setup Register Button
    setupRegisterButton();
    
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
    console.log('🏆 Dashboard button clicked - opening management center');
    
    try {
        // Check if management center function exists
        if (typeof showManagementCenter === 'function') {
            showManagementCenter();
        } else {
            // Fallback: try to show management modal directly
            const managementModal = document.getElementById('managementModal');
            if (managementModal) {
                const modal = new bootstrap.Modal(managementModal);
                modal.show();
                console.log('📋 Management modal opened directly');
            } else {
                alert('管理センターは現在利用できません。');
                console.error('❌ Management center not available');
            }
        }
    } catch (error) {
        console.error('❌ Dashboard button error:', error);
        alert('管理センターの表示に失敗しました。');
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
        
        // Apply filters
        if (locationValue) {
            filteredGuides = filteredGuides.filter(guide => 
                guide.location === locationValue || guide.prefecture === locationValue
            );
        }
        
        if (languageValue) {
            filteredGuides = filteredGuides.filter(guide => 
                guide.languages && guide.languages.includes(languageValue)
            );
        }
        
        if (priceValue) {
            filteredGuides = filteredGuides.filter(guide => {
                const price = guide.price;
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
    console.log('📞 Contact button clicked - opening contact options');
    
    try {
        // Check if contact modal exists
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
            const modal = new bootstrap.Modal(contactModal);
            modal.show();
            console.log('📧 Contact modal opened');
        } else {
            // Fallback: show contact options in alert or create simple contact form
            showContactOptions();
        }
    } catch (error) {
        console.error('❌ Contact button error:', error);
        alert('お問い合わせ機能に問題が発生しました。');
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
    console.log('📝 Register button clicked - showing registration options');
    
    try {
        // Show registration form or redirect to registration page
        const registrationContainer = document.getElementById('registrationFormContainer');
        if (registrationContainer) {
            // Toggle registration form visibility
            const isVisible = registrationContainer.style.display === 'block';
            registrationContainer.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                // Scroll to registration form
                registrationContainer.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Fallback: alert with registration options
            alert('新規登録機能は開発中です。しばらくお待ちください。');
        }
    } catch (error) {
        console.error('❌ Register button error:', error);
        alert('新規登録に問題が発生しました。');
    }
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