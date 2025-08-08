// TomoTrip Main JavaScript - CSP Compliant
document.addEventListener('DOMContentLoaded', () => {
  // Footer 多重保険：重複があれば先頭以外を除去
  const footers = document.querySelectorAll('footer#main-footer');
  for (let i = 1; i < footers.length; i++) footers[i].remove();

  const footer = footers[0];
  if (footer) { 
    footer.style.display = 'block'; 
    footer.style.visibility = 'visible'; 
  }

  // 旧インラインでやっていた初期化を集約
  setupEventListeners();
  if (typeof initializeGuidePagination === 'function') {
    initializeGuidePagination();
  }
});

// Default guide data for display
window.defaultGuideData = [
    {
        id: 1,
        name: "田中健太",
        location: "tokyo",
        rating: 4.8,
        price: 8000,
        image: "attached_assets/image_1754399234136.png",
        languages: ["ja", "en"],
        specialties: ["history", "culture"]
    },
    {
        id: 2,
        name: "佐藤美咲",
        location: "osaka",
        rating: 4.9,
        price: 7500,
        image: "attached_assets/image_1754399234136.png",
        languages: ["ja", "en", "zh"],
        specialties: ["food", "local"]
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

// Get all guides including localStorage data
function loadAllGuides() {
    const sampleGuides = [
        {
            id: 1,
            name: "田中健太",
            location: "tokyo",
            rating: 4.8,
            price: 8000,
            image: "attached_assets/image_1754399234136.png",
            languages: ["ja", "en"],
            specialties: ["history", "culture"]
        },
        {
            id: 2,
            name: "佐藤美咲",
            location: "osaka",
            rating: 4.9,
            price: 7500,
            image: "attached_assets/image_1754399234136.png",
            languages: ["ja", "en", "zh"],
            specialties: ["food", "local"]
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

// Handle functions
function toggleLoginDropdown() {
    console.log('Login dropdown toggled');
}

function handleSponsorRegistration() {
    console.log('Sponsor registration clicked');
    window.location.href = 'sponsor-registration.html';
}

function handleSponsorLogin() {
    console.log('Sponsor login clicked');
    alert('Sponsor login feature is under development');
}

function handleLogoLoad(img) {
    console.log('Logo loaded successfully');
}

function handleLogoError(img) {
    console.log('Logo failed to load, using fallback');
    img.style.display = 'none';
}