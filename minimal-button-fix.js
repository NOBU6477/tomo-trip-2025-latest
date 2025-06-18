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

    // ヘッダーボタンの表示を確保
    ensureHeaderButtonsVisible();
    
    // すべてのモーダルボタンを修正
    fixModalButtons();
    
    // 協賛店ボタンを修正
    fixSponsorButtons();
    
    // Swiperの再初期化
    reinitializeSwiper();
  }

  function ensureHeaderButtonsVisible() {
    // まず不要なユーザー表示を削除
    removeUnwantedUserDisplays();
    
    const userArea = document.getElementById('navbar-user-area');
    if (userArea) {
      // 強制的に表示
      userArea.style.display = 'block';
      userArea.style.visibility = 'visible';
      userArea.style.opacity = '1';
      
      // 子要素も確実に表示
      const buttons = userArea.querySelectorAll('button, .dropdown');
      buttons.forEach(button => {
        button.style.display = '';
        button.style.visibility = 'visible';
        button.style.opacity = '1';
      });
      
      console.log('Header buttons visibility ensured');
    } else {
      console.error('navbar-user-area not found');
    }
  }

  function removeUnwantedUserDisplays() {
    // ナビバー内の「undefinedさん」やその他の不要な表示を削除
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // 不要なパターンを持つ要素を削除
    const elementsToCheck = navbar.querySelectorAll('*');
    elementsToCheck.forEach(element => {
      const text = element.textContent.trim();
      
      // 保護すべき要素をチェック
      const isProtected = (
        element.id === 'languageDropdown' ||
        element.id === 'registerDropdown' ||
        element.id === 'navbar-user-area' ||
        element.closest('#languageDropdown') ||
        element.closest('#registerDropdown') ||
        element.closest('#navbar-user-area') ||
        element.classList.contains('navbar-brand') ||
        element.closest('.navbar-brand') ||
        text.includes('ホーム') ||
        text.includes('ガイドを探す') ||
        text.includes('使い方') ||
        text.includes('ログイン') ||
        text.includes('新規登録') ||
        text === '日本語' ||
        text === 'English'
      );

      // 削除すべき要素をチェック
      const shouldRemove = (
        text.includes('undefined') ||
        (text.includes('さん') && text.length < 15 && !isProtected) ||
        (text.includes('ユーザー') && !isProtected)
      );

      if (shouldRemove && !isProtected) {
        console.log('Removing unwanted element:', text, element.tagName);
        element.remove();
      }
    });
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

  function reinitializeSwiper() {
    // Swiperが存在する場合のみ再初期化
    if (typeof Swiper !== 'undefined') {
      const swiperContainer = document.querySelector('.sponsor-swiper');
      if (swiperContainer && swiperContainer.swiper) {
        try {
          swiperContainer.swiper.destroy(true, true);
          console.log('Existing Swiper destroyed');
        } catch (error) {
          console.log('Swiper destroy error:', error);
        }
      }
      
      // 新しいSwiperを初期化
      setTimeout(() => {
        try {
          new Swiper('.sponsor-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            centeredSlides: true,
            allowTouchMove: true,
            breakpoints: {
              640: { 
                slidesPerView: 2,
                spaceBetween: 20,
                centeredSlides: false
              },
              1024: { 
                slidesPerView: 3,
                spaceBetween: 30,
                centeredSlides: false
              }
            },
            autoplay: { 
              delay: 4000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              stopOnLastSlide: false,
              waitForTransition: false
            },
            loop: true,
            loopedSlides: 2,
            speed: 800,
            freeMode: false,
            navigation: {
              nextEl: '.sponsor-next',
              prevEl: '.sponsor-prev',
              disabledClass: 'swiper-button-disabled',
              hiddenClass: 'swiper-button-hidden'
            },
            pagination: { 
              el: '.swiper-pagination', 
              clickable: true 
            },
            on: {
              init: function() {
                console.log('Swiper reinitialized successfully');
                this.autoplay.start();
              }
            }
          });
        } catch (error) {
          console.error('Swiper reinitialization error:', error);
        }
      }, 500);
    }
  }

  // DOMContentLoaded後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeButtons);
  } else {
    initializeButtons();
  }

  // 継続的な監視と修正
  setInterval(() => {
    removeUnwantedUserDisplays();
    ensureHeaderButtonsVisible();
  }, 2000);

  // 追加の保険として、少し遅延して実行
  setTimeout(initializeButtons, 1000);
  setTimeout(initializeButtons, 2000);

})();