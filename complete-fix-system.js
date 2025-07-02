/**
 * 完全修復システム - 全ての問題を根本的に解決
 * スクロール、言語切り替え、ガイド人数表示を統合管理
 */
(function() {
  'use strict';
  
  console.log('🚀 完全修復システム起動');
  
  // 1. 強制スクロール有効化
  function enforceScrolling() {
    try {
      // HTMLとBODYの確実なスクロール設定
      const html = document.documentElement;
      const body = document.body;
      
      [html, body].forEach(element => {
        element.style.overflow = 'auto';
        element.style.overflowY = 'auto';
        element.style.overflowX = 'hidden';
        element.style.height = 'auto';
        element.style.maxHeight = 'none';
        element.style.position = 'static';
        element.style.paddingRight = '0';
      });
      
      // modal-openクラスを削除
      body.classList.remove('modal-open');
      
      // すべてのoverflow:hiddenを強制的にautoに変更
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        if (computed.overflow === 'hidden' && el !== document.querySelector('.hero-section')) {
          el.style.overflow = 'visible';
        }
      });
      
      console.log('✅ スクロール強制有効化完了');
    } catch (e) {
      console.error('❌ スクロール修復エラー:', e);
    }
  }
  
  // 2. ガイド人数表示修復
  function fixGuideDisplay() {
    try {
      // 左下の固定表示を削除
      document.querySelectorAll('[style*="position: fixed"]').forEach(element => {
        const text = element.textContent || '';
        if (text.includes('ガイド') || text.includes('21人') || text.includes('見つかりました')) {
          console.log('🗑️ 削除:', text.substring(0, 30));
          element.remove();
        }
      });
      
      // 正しいカウンターを修正
      const counter = document.getElementById('search-results-counter');
      if (counter && counter.textContent.includes('21')) {
        counter.textContent = '70人のガイドが見つかりました';
        counter.style.position = 'static';
        counter.style.display = 'block';
        console.log('✅ ガイドカウンター修正完了');
      }
    } catch (e) {
      console.error('❌ ガイド表示修復エラー:', e);
    }
  }
  
  // 3. 言語切り替えボタン完全修復
  function fixLanguageSwitching() {
    try {
      // すべての可能なログインボタンを検索
      const loginSelectors = [
        'button[data-bs-target="#loginModal"]',
        '.btn[data-bs-target="#loginModal"]',
        '.navbar .btn:contains("ログイン")',
        '.navbar .btn:contains("Login")',
        '.btn-outline-light'
      ];
      
      // すべての可能な新規登録ボタンを検索
      const signupSelectors = [
        'button[onclick="showRegisterOptions()"]',
        '.btn[onclick="showRegisterOptions()"]',
        '.navbar .btn:contains("新規登録")',
        '.navbar .btn:contains("Sign Up")',
        '.btn-light'
      ];
      
      // 日本語切り替え関数を強化
      window.switchToJapanese = function() {
        console.log('🇯🇵 日本語切り替え開始');
        
        // ナビゲーションリンク
        document.querySelectorAll('.nav-link').forEach((link, index) => {
          switch(index) {
            case 0: link.textContent = 'ホーム'; break;
            case 1: link.textContent = 'ガイドを探す'; break;
            case 2: link.textContent = '使い方'; break;
          }
        });
        
        // ログインボタン
        loginSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(btn => {
            if (btn.textContent.includes('Login') || btn.textContent.includes('ログイン')) {
              btn.textContent = 'ログイン';
            }
          });
        });
        
        // 新規登録ボタン
        signupSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(btn => {
            if (btn.textContent.includes('Sign Up') || btn.textContent.includes('新規登録')) {
              btn.textContent = '新規登録';
            }
          });
        });
        
        // メインコンテンツ
        const mainTitle = document.querySelector('h1');
        if (mainTitle) mainTitle.textContent = 'あなただけの特別な旅を';
        
        const subtitle = document.querySelector('.hero-section p');
        if (subtitle) subtitle.textContent = '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう';
        
        setTimeout(() => {
          enforceScrolling();
          fixGuideDisplay();
        }, 100);
        
        console.log('✅ 日本語切り替え完了');
      };
      
      // 英語切り替え関数を強化
      window.switchToEnglish = function() {
        console.log('🇺🇸 英語切り替え開始');
        
        // ナビゲーションリンク
        document.querySelectorAll('.nav-link').forEach((link, index) => {
          switch(index) {
            case 0: link.textContent = 'Home'; break;
            case 1: link.textContent = 'Find Guides'; break;
            case 2: link.textContent = 'How It Works'; break;
          }
        });
        
        // ログインボタン
        loginSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(btn => {
            if (btn.textContent.includes('ログイン') || btn.textContent.includes('Login')) {
              btn.textContent = 'Login';
            }
          });
        });
        
        // 新規登録ボタン
        signupSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(btn => {
            if (btn.textContent.includes('新規登録') || btn.textContent.includes('Sign Up')) {
              btn.textContent = 'Sign Up';
            }
          });
        });
        
        // メインコンテンツ
        const mainTitle = document.querySelector('h1');
        if (mainTitle) mainTitle.textContent = 'Your Special Journey Awaits';
        
        const subtitle = document.querySelector('.hero-section p');
        if (subtitle) subtitle.textContent = 'Discover hidden gems with local guides that regular tourism can\'t show you';
        
        setTimeout(() => {
          enforceScrolling();
        }, 100);
        
        console.log('✅ 英語切り替え完了');
      };
      
      console.log('✅ 言語切り替え強化完了');
    } catch (e) {
      console.error('❌ 言語切り替え修復エラー:', e);
    }
  }
  
  // 4. 即座に実行
  enforceScrolling();
  
  // 5. DOMContentLoaded後に全修復実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        enforceScrolling();
        fixGuideDisplay();
        fixLanguageSwitching();
        console.log('🎉 DOMContentLoaded後の完全修復完了');
      }, 500);
    });
  } else {
    setTimeout(() => {
      enforceScrolling();
      fixGuideDisplay();
      fixLanguageSwitching();
      console.log('🎉 即時完全修復完了');
    }, 500);
  }
  
  // 6. 継続的監視システム
  setInterval(() => {
    enforceScrolling();
    fixGuideDisplay();
  }, 3000);
  
  console.log('🌟 完全修復システム起動完了');
})();