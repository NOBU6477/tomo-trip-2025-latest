/**
 * 日本語サイト専用ヘッダー修正スクリプト
 * ヘッダーボタンの日本語表示を確実に維持
 */

(function() {
  'use strict';
  
  console.log('🇯🇵 日本語ヘッダー修正システム開始');
  
  // ヘッダーボタンを日本語に修正
  function fixHeaderButtons() {
    // 新規登録ボタンを修正
    const registerButtons = document.querySelectorAll(
      'button[onclick*="showRegisterOptions"], ' +
      '.btn:contains("Sign Up"), ' +
      '.btn[data-bs-target*="register"], ' +
      'button.btn-light'
    );
    
    registerButtons.forEach(btn => {
      if (btn.textContent.includes('Sign Up') || btn.textContent.includes('Register')) {
        btn.textContent = '新規登録';
        console.log('✅ 新規登録ボタンを修正');
      }
    });
    
    // ログインボタンを確認
    const loginButtons = document.querySelectorAll('button[data-bs-target*="login"]');
    loginButtons.forEach(btn => {
      if (btn.textContent.includes('Login') || btn.textContent.includes('Sign In')) {
        btn.textContent = 'ログイン';
        console.log('✅ ログインボタンを修正');
      }
    });
    
    // 言語スイッチャーの日本語ボタンをアクティブに設定
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
      if (btn.textContent.includes('日本語')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  // 継続監視
  function continuousMonitoring() {
    setInterval(() => {
      fixHeaderButtons();
    }, 2000);
  }
  
  // 初期化
  function initialize() {
    fixHeaderButtons();
    continuousMonitoring();
    
    // DOMの変更を監視
    const observer = new MutationObserver(() => {
      fixHeaderButtons();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('✅ 日本語ヘッダー修正システム起動完了');
  }
  
  // 実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();