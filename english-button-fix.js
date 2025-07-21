// English Site Button Fix - Same structure as Japanese site
console.log('English Button Fix - Loading same structure as Japanese site');

document.addEventListener('DOMContentLoaded', function() {
    console.log('English site button fix initializing...');
    
    // Sponsor Registration Button
    const sponsorRegisterBtn = document.getElementById('sponsorRegisterBtn');
    if (sponsorRegisterBtn) {
        sponsorRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            alert('Welcome to Sponsor Registration!\n\nBenefits:\n• Display your business in our sponsor banner\n• Reach thousands of tourists monthly\n• Special discount opportunities\n\nClick OK to proceed to registration form.');
            console.log('Sponsor registration clicked - English');
        });
        console.log('Sponsor registration button activated');
    }
    
    // Sponsor Login Button  
    const sponsorLoginBtn = document.getElementById('sponsorLoginBtn');
    if (sponsorLoginBtn) {
        sponsorLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            alert('Sponsor Login\n\nAccess your sponsor dashboard to:\n• Manage your advertisements\n• View analytics and reach\n• Update special offers\n\nClick OK to proceed to login.');
            console.log('Sponsor login clicked - English');
        });
        console.log('Sponsor login button activated');
    }
    
    // Language Switcher
    const switchToJapaneseBtn = document.querySelector('.lang-btn-jp');
    if (switchToJapaneseBtn) {
        switchToJapaneseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Switching to Japanese site...');
            window.location.href = 'index.html';
        });
        console.log('Japanese language switcher activated');
    }
    
    // Header Login Button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            console.log('Login modal opening - English');
        });
        console.log('Header login button activated');
    }
    
    // Header Sign Up Button
    const signUpBtn = document.getElementById('signUpBtn');
    if (signUpBtn) {
        signUpBtn.addEventListener('click', function(e) {
            console.log('Sign up modal opening - English');
        });
        console.log('Header sign up button activated');
    }
    
    // Filter Help Modal Button (if exists)
    const filterHelpBtn = document.querySelector('[data-bs-target="#filter-help-modal"]');
    if (filterHelpBtn) {
        filterHelpBtn.addEventListener('click', function(e) {
            console.log('Filter help modal opening - English');
        });
        console.log('Filter help button activated');
    }
    
    // Ensure all buttons have proper z-index and positioning
    const allButtons = document.querySelectorAll('.sponsor-mini-btn, .btn');
    allButtons.forEach(button => {
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        if (button.classList.contains('sponsor-mini-btn')) {
            button.style.zIndex = '1040';
            button.style.position = 'relative';
        }
    });
    
    console.log('All English site buttons configured with proper z-index and functionality');
});

// Emergency button activation (in case DOMContentLoaded fails)
setTimeout(() => {
    const buttons = document.querySelectorAll('.sponsor-mini-btn');
    buttons.forEach(btn => {
        if (!btn.onclick && !btn.hasEventListener) {
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '1040';
            
            if (btn.id === 'sponsorRegisterBtn') {
                btn.onclick = () => alert('Sponsor Registration - English Site');
            }
            if (btn.id === 'sponsorLoginBtn') {
                btn.onclick = () => alert('Sponsor Login - English Site');
            }
        }
    });
    console.log('Emergency button activation completed');
}, 2000);