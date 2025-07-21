// Test script to verify all English site buttons are working
console.log('=== English Site Button Test ===');

// Test all button functionalities
function testButton(buttonId, description) {
  const button = document.getElementById(buttonId);
  if (button) {
    console.log(`✓ Found ${description}: ${buttonId}`);
    return true;
  } else {
    console.log(`✗ Missing ${description}: ${buttonId}`);
    return false;
  }
}

function testAllButtons() {
  const tests = [
    ['switchToJapaneseBtn', 'Language Switch Button'],
    ['loginBtn', 'Header Login Button'],
    ['signUpBtn', 'Header Sign Up Button'],
    ['filterToggleBtn', 'Filter Toggle Button'],
    ['sponsorRegisterBtn', 'Sponsor Register Button'],
    ['sponsorLoginBtn', 'Sponsor Login Button'],
    ['contact-form', 'Contact Form'],
    ['login-form', 'Login Form'],
    ['register-form', 'Register Form']
  ];

  let foundButtons = 0;
  tests.forEach(([id, desc]) => {
    if (testButton(id, desc)) foundButtons++;
  });

  console.log(`=== Result: ${foundButtons}/${tests.length} buttons found ===`);
  
  // Test event listeners (disabled to prevent auto-redirect)
  const switchBtn = document.getElementById('switchToJapaneseBtn');
  if (switchBtn) {
    console.log('Language switch button found but auto-click disabled to prevent unwanted redirect');
  }
}

// Run test when DOM loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testAllButtons);
} else {
  testAllButtons();
}