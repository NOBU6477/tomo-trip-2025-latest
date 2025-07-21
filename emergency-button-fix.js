// Emergency button fix for English site
console.log('🚨 Emergency Button Fix Loading...');

function emergencyButtonFix() {
  console.log('🔧 Applying emergency button fixes...');
  
  // Language switch button (disabled for English version protection)
  const langBtn = document.getElementById('switchToJapaneseBtn');
  if (langBtn) {
    langBtn.onclick = function(e) {
      e.preventDefault();
      console.log('Language switch blocked by anti-auto-switch protection');
      return false;
    };
    console.log('✓ Language switch button protected from auto-redirect');
  }
  
  // Force sponsor buttons to work (direct navigation like Japanese version)
  const sponsorReg = document.getElementById('sponsorRegisterBtn');
  if (sponsorReg) {
    sponsorReg.onclick = function(e) {
      e.preventDefault();
      console.log('Emergency: Sponsor register clicked - direct navigation');
      window.location.href = 'sponsor-register.html';
    };
    console.log('✓ Sponsor register button fixed');
  }
  
  const sponsorLogin = document.getElementById('sponsorLoginBtn');
  if (sponsorLogin) {
    sponsorLogin.onclick = function(e) {
      e.preventDefault();
      console.log('Emergency: Sponsor login clicked - direct navigation');
      window.location.href = 'sponsor-login.html';
    };
    console.log('✓ Sponsor login button fixed');
  }
  
  // Test all buttons
  const buttons = ['switchToJapaneseBtn', 'sponsorRegisterBtn', 'sponsorLoginBtn', 'loginBtn', 'signUpBtn'];
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      console.log(`✓ Button found: ${id}`);
      btn.style.pointerEvents = 'auto';
      btn.style.cursor = 'pointer';
    } else {
      console.log(`✗ Button missing: ${id}`);
    }
  });
  
  console.log('🎯 Emergency fix complete!');
}

// Apply fix immediately and after DOM loads
emergencyButtonFix();
document.addEventListener('DOMContentLoaded', emergencyButtonFix);
setTimeout(emergencyButtonFix, 1000);
setTimeout(emergencyButtonFix, 3000);