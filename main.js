// TomoTrip Main JavaScript - CSP Compliant
// All inline scripts moved to external file

// Error suppression and DOM handling
document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners
    setupEventListeners();
    
    // Footer visibility enforcement
    const footer = document.getElementById('main-footer');
    if (footer) {
        footer.style.display = 'block';
        footer.style.visibility = 'visible';
        console.log('✅ Footer forced visible after DOMContentLoaded');
    } else {
        console.warn('⚠️ Footer not found after DOMContentLoaded');
    }
    
    // Remove any error notification elements
    const errorElements = document.querySelectorAll('[class*="error"], [class*="notification"], [id*="error"]');
    errorElements.forEach(el => {
        if (el.textContent && el.textContent.includes('Could not find run command')) {
            el.style.display = 'none';
            el.remove();
        }
    });
    
    // Monitor for dynamically added error messages
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.textContent) {
                    if (node.textContent.includes('Could not find run command')) {
                        node.style.display = 'none';
                        node.remove();
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Login dropdown toggle
function toggleLoginDropdown() {
    const dropdown = document.getElementById('loginDropdown');
    const dropdownMenu = dropdown.nextElementSibling;
    dropdownMenu.classList.toggle('show');
}

// Sponsor registration handler
function handleSponsorRegistration() {
    console.log('Sponsor registration clicked');
    console.log('🚀 DIRECT ACTION: Redirecting to sponsor-registration.html');
    try {
        window.location.href = 'sponsor-registration.html';
    } catch (error) {
        console.error('Redirect failed:', error);
        alert('リダイレクトに失敗しました');
    }
}

// Sponsor login handler
function handleSponsorLogin() {
    console.log('Sponsor login clicked');
    console.log('🔐 DIRECT ACTION: Showing sponsor login modal');
    try {
        showSponsorLoginModal();
    } catch (error) {
        console.error('Modal failed:', error);
        alert('モーダル表示に失敗しました');
    }
}

// Image load handlers
function handleLogoLoad(img) {
    console.log('✅ Logo loaded successfully from:', img.src);
}

function handleLogoError(img) {
    console.error('❌ Logo load failed:', img.src);
    console.log('❌ Image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
    img.style.display = 'none';
    img.parentElement.innerHTML = '<span style="font-size: 24px; color: white;">T</span>';
}

// Background image load handlers
function handleBgLoad(img) {
    console.log('✅ Background image loaded:', img.src);
}

function handleBgError(img) {
    console.log('❌ Background image failed, using fallback');
    img.style.display = 'none';
}

// Load all guides data for management functions
function loadAllGuides() {
    const sampleGuides = [
        {
            id: 1,
            name: "田中太郎",
            location: "tokyo",
            rating: 4.8,
            price: 8000,
            image: "attached_assets/image_1754398586272.png",
            languages: ["ja", "en"],
            specialties: ["history", "culture"]
        },
        {
            id: 2,
            name: "佐藤花子", 
            location: "osaka",
            rating: 4.9,
            price: 7500,
            image: "attached_assets/image_1754398970075.png",
            languages: ["ja", "en", "ko"],
            specialties: ["food", "shopping"]
        },
        {
            id: 3,
            name: "鈴木一郎",
            location: "kyoto",
            rating: 4.7,
            price: 9000,
            image: "attached_assets/image_1754399234136.png",
            languages: ["ja", "en"],
            specialties: ["temples", "traditional"]
        }
    ];
    
    // Get additional guides from localStorage if available
    const additionalGuides = JSON.parse(localStorage.getItem('registeredGuides') || '[]');
    
    return [...sampleGuides, ...additionalGuides];
}

// Setup all event listeners
function setupEventListeners() {
    // Login dropdown
    const loginDropdown = document.getElementById('loginDropdown');
    if (loginDropdown) {
        loginDropdown.addEventListener('click', toggleLoginDropdown);
    }
    
    // Sponsor buttons
    const sponsorRegBtn = document.getElementById('sponsorRegBtn');
    const sponsorLoginBtn = document.getElementById('sponsorLoginBtn');
    const sponsorRegBtnMobile = document.getElementById('sponsorRegBtnMobile');
    const sponsorLoginBtnMobile = document.getElementById('sponsorLoginBtnMobile');
    
    if (sponsorRegBtn) sponsorRegBtn.addEventListener('click', handleSponsorRegistration);
    if (sponsorLoginBtn) sponsorLoginBtn.addEventListener('click', handleSponsorLogin);
    if (sponsorRegBtnMobile) sponsorRegBtnMobile.addEventListener('click', handleSponsorRegistration);
    if (sponsorLoginBtnMobile) sponsorLoginBtnMobile.addEventListener('click', handleSponsorLogin);
    
    // Dropdown items with hover effects
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        item.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
        });
    });
    
    // Setup logo image handlers
    const logoImg = document.getElementById('logoImg');
    if (logoImg) {
        logoImg.addEventListener('load', function() {
            handleLogoLoad(this);
        });
        logoImg.addEventListener('error', function() {
            handleLogoError(this);
        });
    }
}