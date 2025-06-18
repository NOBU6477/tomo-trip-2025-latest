/**
 * 最小限のボタン修正スクリプト
 * 既存のHTML構造を保持し、ボタン機能のみを修正
 */
(function() {
  'use strict';

  function initializeButtons() {
    // Bootstrapが読み込まれるまで待機
    if (typeof bootstrap === 'undefined') {
      setTimeout(initializeButtons, 100);
      return;
    }

    console.log('Initializing button functionality...');

    // すべてのモーダルボタンを修正
    fixModalButtons();
    
    // 協賛店ボタンを修正
    fixSponsorButtons();
  }

  function fixModalButtons() {
    // ログインボタンの修正
    const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
    if (loginBtn) {
      loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Login button clicked');
        
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          const modal = bootstrap.Modal.getOrCreateInstance(loginModal);
          modal.show();
        } else {
          console.error('Login modal not found');
        }
      });
      console.log('Login button fixed');
    }

    // 旅行者登録ボタンの修正
    const touristRegisterBtn = document.querySelector('[data-bs-target="#registerTouristModal"]');
    if (touristRegisterBtn) {
      touristRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Tourist register button clicked');
        
        const touristModal = document.getElementById('registerTouristModal');
        if (touristModal) {
          const modal = bootstrap.Modal.getOrCreateInstance(touristModal);
          modal.show();
        } else {
          console.error('Tourist register modal not found');
        }
      });
      console.log('Tourist register button fixed');
    }

    // 新規登録ドロップダウンの確認
    const registerDropdown = document.getElementById('registerDropdown');
    if (registerDropdown) {
      try {
        new bootstrap.Dropdown(registerDropdown);
        console.log('Register dropdown initialized');
      } catch (error) {
        console.error('Register dropdown initialization error:', error);
      }
    }
  }

  function fixSponsorButtons() {
    // 協賛店ログインボタンの修正
    const sponsorLoginBtn = document.querySelector('[data-bs-target="#sponsorLoginModal"]');
    if (sponsorLoginBtn) {
      sponsorLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Sponsor login button clicked');
        
        const sponsorLoginModal = document.getElementById('sponsorLoginModal');
        if (sponsorLoginModal) {
          const modal = bootstrap.Modal.getOrCreateInstance(sponsorLoginModal);
          modal.show();
        } else {
          console.error('Sponsor login modal not found');
        }
      });
      console.log('Sponsor login button fixed');
    }

    // 協賛店登録ボタンの修正
    const sponsorRegisterBtn = document.querySelector('[data-bs-target="#sponsorRegisterModal"]');
    if (sponsorRegisterBtn) {
      sponsorRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Sponsor register button clicked');
        
        const sponsorRegisterModal = document.getElementById('sponsorRegisterModal');
        if (sponsorRegisterModal) {
          const modal = bootstrap.Modal.getOrCreateInstance(sponsorRegisterModal);
          modal.show();
        } else {
          console.error('Sponsor register modal not found');
        }
      });
      console.log('Sponsor register button fixed');
    }
  }

  // DOMContentLoaded後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeButtons);
  } else {
    initializeButtons();
  }

  // 追加の保険として、少し遅延して実行
  setTimeout(initializeButtons, 1000);

})();