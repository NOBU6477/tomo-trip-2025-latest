/**
 * 日本語サイト専用ボタン修正システム
 * 新規登録ボタンの英語表示を完全に防止
 */

(function() {
  'use strict';
  
  console.log('🇯🇵 日本語ボタン修正開始');
  
  function forceJapaneseButtons() {
    try {
      // 1. 新規登録ボタンの強制修正
      const registerButtons = document.querySelectorAll('button, a, [role="button"]');
      
      registerButtons.forEach(btn => {
        const text = btn.textContent?.trim();
        
        if (text && (text.includes('Sign Up') || text.includes('Register') || text === 'Sign Up')) {
          console.log('🔧 新規登録ボタン修正:', text, '→ 新規登録');
          btn.textContent = '新規登録';
          btn.innerHTML = '新規登録';
        }
        
        if (text && (text.includes('Login') && !text.includes('ログイン'))) {
          console.log('🔧 ログインボタン修正:', text, '→ ログイン');
          btn.textContent = 'ログイン';
          btn.innerHTML = 'ログイン';
        }
      });
      
      // 2. 特定IDのボタン修正
      const specificButtons = [
        { selector: '[onclick*="showRegisterOptions"]', text: '新規登録' },
        { selector: '#registerBtn', text: '新規登録' },
        { selector: '.register-button', text: '新規登録' },
        { selector: '.btn-light', text: '新規登録' }
      ];
      
      specificButtons.forEach(({ selector, text }) => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(btn => {
          if (btn.textContent && (btn.textContent.includes('Sign') || btn.textContent.includes('Register'))) {
            console.log('🔧 特定ボタン修正:', btn.textContent, '→', text);
            btn.textContent = text;
            btn.innerHTML = text;
          }
        });
      });
      
      // 3. navbar内の新規登録ボタン特別処理
      const navbarArea = document.getElementById('navbar-user-area');
      if (navbarArea) {
        const navButtons = navbarArea.querySelectorAll('button');
        navButtons.forEach(btn => {
          if (btn.textContent?.includes('Sign') || btn.textContent?.includes('Register')) {
            console.log('🔧 ナビゲーション新規登録ボタン修正');
            btn.textContent = '新規登録';
            btn.innerHTML = '新規登録';
          }
        });
      }
      
      console.log('✅ 日本語ボタン修正完了');
      
    } catch (error) {
      console.error('日本語ボタン修正エラー:', error);
    }
  }
  
  function initialize() {
    // 即座に実行
    forceJapaneseButtons();
    
    // 継続監視（1秒間隔）
    setInterval(forceJapaneseButtons, 1000);
    
    // DOM変更監視
    const observer = new MutationObserver(() => {
      setTimeout(forceJapaneseButtons, 50);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['textContent', 'innerHTML']
    });
    
    console.log('✅ 日本語ボタン修正システム初期化完了');
  }
  
  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  window.addEventListener('load', () => {
    setTimeout(initialize, 200);
  });
  
})();