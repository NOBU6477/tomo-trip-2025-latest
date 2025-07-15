/**
 * 核兵器級ヘッダー修正システム
 * すべての干渉を排除してヘッダーボタンを完全に日本語化
 */

(function() {
  'use strict';
  
  console.log('🚀 核兵器級ヘッダー修正システム開始');
  
  // 強制的にHTMLを直接書き換え
  function forceHeaderFix() {
    // ナビゲーションバー全体を取得
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // 新規登録ボタンを強制修正
    const registerButtons = navbar.querySelectorAll('button, .btn');
    registerButtons.forEach(btn => {
      const text = btn.textContent.trim();
      if (text.includes('Sign Up') || text.includes('Register') || text === 'Sign Up') {
        btn.innerHTML = '新規登録';
        btn.setAttribute('onclick', 'showRegisterOptions()');
        console.log('✅ 新規登録ボタンを強制修正');
      }
      
      if (text.includes('Login') || text.includes('Sign In')) {
        btn.innerHTML = 'ログイン';
        console.log('✅ ログインボタンを強制修正');
      }
    });
    
    // 言語ドロップダウンを直接ボタンに置換
    const langDropdown = navbar.querySelector('#languageDropdown, .dropdown');
    if (langDropdown) {
      const newLangDiv = document.createElement('div');
      newLangDiv.className = 'language-switcher me-3';
      newLangDiv.innerHTML = `
        <button class="btn btn-outline-light btn-sm lang-btn active">
          🇯🇵 日本語
        </button>
        <button class="btn btn-outline-light btn-sm lang-btn" onclick="window.location.href='index-en.html'">
          🇺🇸 English
        </button>
      `;
      
      langDropdown.parentNode.replaceChild(newLangDiv, langDropdown);
      console.log('✅ 言語ドロップダウンを直接ボタンに置換');
    }
  }
  
  // DOMの完全な修正
  function nuclearHeaderReconstruction() {
    const navbarUserArea = document.getElementById('navbar-user-area');
    if (navbarUserArea) {
      navbarUserArea.innerHTML = `
        <button class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">ログイン</button>
        <button class="btn btn-light" onclick="showRegisterOptions()">新規登録</button>
      `;
      console.log('✅ ナビゲーションエリアを完全再構築');
    }
  }
  
  // すべてのSign Upテキストを新規登録に強制変換
  function eliminateAllSignUpText() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.textContent && el.textContent.includes('Sign Up')) {
        const walker = document.createTreeWalker(
          el,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let node;
        while (node = walker.nextNode()) {
          if (node.textContent.includes('Sign Up')) {
            node.textContent = node.textContent.replace(/Sign Up/g, '新規登録');
          }
        }
      }
    });
  }
  
  // 継続監視と修正
  function continuousMonitoring() {
    // 100ms間隔で監視
    setInterval(() => {
      forceHeaderFix();
      eliminateAllSignUpText();
    }, 100);
    
    // 2秒間隔で核兵器級修正
    setInterval(() => {
      nuclearHeaderReconstruction();
    }, 2000);
  }
  
  // MutationObserverで動的変更を監視
  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          forceHeaderFix();
          eliminateAllSignUpText();
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // 初期化
  function initialize() {
    // 即座に実行
    forceHeaderFix();
    nuclearHeaderReconstruction();
    eliminateAllSignUpText();
    
    // 継続監視開始
    continuousMonitoring();
    setupMutationObserver();
    
    console.log('💥 核兵器級ヘッダー修正システム完全起動');
  }
  
  // 最高優先度で実行
  initialize();
  
  // DOMContentLoaded後にも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  
  // ページ読み込み完了後にも実行
  window.addEventListener('load', initialize);
  
})();