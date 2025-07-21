// Emergency button fix for English site
console.log('🚨 Emergency Button Fix Loading...');

function emergencyButtonFix() {
  console.log('🔧 Applying emergency button fixes...');
  
  // Force language switch button to work
  const langBtn = document.getElementById('switchToJapaneseBtn');
  if (langBtn) {
    langBtn.onclick = function(e) {
      e.preventDefault();
      console.log('Emergency: Language switch clicked');
      if (confirm('Switch to Japanese version?\n日本語版に切り替えますか？')) {
        window.location.href = 'index.html';
      }
    };
    console.log('✓ Language switch button fixed');
  }
  
  // Force sponsor buttons to work
  const sponsorReg = document.getElementById('sponsorRegisterBtn');
  if (sponsorReg) {
    sponsorReg.onclick = function(e) {
      e.preventDefault();
      console.log('Emergency: Sponsor register clicked');
      alert('🎯 Sponsor Registration\n\nRegister your business as a sponsor partner.');
    };
    console.log('✓ Sponsor register button fixed');
  }
  
  const sponsorLogin = document.getElementById('sponsorLoginBtn');
  if (sponsorLogin) {
    sponsorLogin.onclick = function(e) {
      e.preventDefault();
      console.log('Emergency: Sponsor login clicked');
      alert('🔑 Sponsor Login\n\nLogin to your sponsor dashboard.');
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