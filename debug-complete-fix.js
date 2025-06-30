/**
 * 全機能統合デバッグ・修正スクリプト
 * ヘッダーボタン機能と詳細ボタン翻訳問題の根本解決
 */
(function() {
  'use strict';
  
  console.log('=== 統合修正スクリプト開始 ===');
  
  // 1. Bootstrap CSS/JSが正しく読み込まれているかチェック
  function checkBootstrap() {
    console.log('Bootstrap チェック開始');
    
    // Bootstrap CSS チェック
    const hasBootstrapCSS = Array.from(document.styleSheets).some(sheet => {
      try {
        return sheet.href && sheet.href.includes('bootstrap');
      } catch (e) {
        return false;
      }
    });
    
    // Bootstrap JS チェック
    const hasBootstrapJS = typeof window.bootstrap !== 'undefined';
    
    console.log('Bootstrap CSS:', hasBootstrapCSS ? '✓ 読み込み済み' : '✗ 未読み込み');
    console.log('Bootstrap JS:', hasBootstrapJS ? '✓ 読み込み済み' : '✗ 未読み込み');
    
    return hasBootstrapCSS && hasBootstrapJS;
  }
  
  // 2. ヘッダーボタンの強制修正
  function fixHeaderButtons() {
    console.log('ヘッダーボタン修正開始');
    
    // 言語切り替えボタンの修正
    const langJaBtn = document.getElementById('lang-ja');
    const langEnBtn = document.getElementById('lang-en');
    const languageDropdown = document.getElementById('languageDropdown');
    
    if (langJaBtn) {
      // 既存のイベントリスナーを削除
      const newJaBtn = langJaBtn.cloneNode(true);
      langJaBtn.parentNode.replaceChild(newJaBtn, langJaBtn);
      
      newJaBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('日本語ボタンがクリックされました');
        
        if (languageDropdown) {
          languageDropdown.textContent = '日本語';
        }
        
        // 日本語に切り替え
        localStorage.setItem('selectedLanguage', 'ja');
        localStorage.setItem('localGuideLanguage', 'ja');
        
        // ページリロードで確実に日本語表示
        location.reload();
      });
      console.log('日本語ボタン: 修正完了');
    }
    
    if (langEnBtn) {
      // 既存のイベントリスナーを削除
      const newEnBtn = langEnBtn.cloneNode(true);
      langEnBtn.parentNode.replaceChild(newEnBtn, langEnBtn);
      
      newEnBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('英語ボタンがクリックされました');
        
        if (languageDropdown) {
          languageDropdown.textContent = 'English';
        }
        
        // 英語に切り替え
        localStorage.setItem('selectedLanguage', 'en');
        localStorage.setItem('localGuideLanguage', 'en');
        
        // 英語翻訳を実行
        translatePageToEnglish();
      });
      console.log('英語ボタン: 修正完了');
    }
    
    // 新規登録ドロップダウンの修正
    const registerDropdown = document.getElementById('registerDropdown');
    if (registerDropdown) {
      // Bootstrap ドロップダウン属性を強制設定
      registerDropdown.setAttribute('data-bs-toggle', 'dropdown');
      registerDropdown.setAttribute('aria-expanded', 'false');
      
      // 手動でクリックイベントを追加（Bootstrap失敗時のフォールバック）
      registerDropdown.addEventListener('click', function(e) {
        console.log('新規登録ドロップダウンがクリックされました');
        
        const dropdownMenu = registerDropdown.nextElementSibling;
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
          // Bootstrap が動作しない場合の手動トグル
          if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
          } else {
            dropdownMenu.style.display = 'block';
            // 他のドロップダウンを閉じる
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
              if (menu !== dropdownMenu) {
                menu.style.display = 'none';
              }
            });
          }
        }
      });
      console.log('新規登録ドロップダウン: 修正完了');
    }
  }
  
  // 3. 詳細ボタンの強制日本語化（See Details → 詳細を見る）
  function forceJapaneseDetailButtons() {
    console.log('詳細ボタン強制日本語化開始');
    
    // 全ての「See Details」ボタンを「詳細を見る」に変更
    const detailButtons = document.querySelectorAll('a, button');
    let count = 0;
    
    detailButtons.forEach(btn => {
      if (btn.textContent && btn.textContent.trim() === 'See Details') {
        btn.textContent = '詳細を見る';
        count++;
        console.log('ボタン修正:', btn);
      }
    });
    
    console.log(`詳細ボタン修正完了: ${count}件`);
    
    // 継続監視システム（2秒間隔で監視）
    setInterval(function() {
      const englishButtons = document.querySelectorAll('a, button');
      englishButtons.forEach(btn => {
        if (btn.textContent && btn.textContent.trim() === 'See Details') {
          btn.textContent = '詳細を見る';
          console.log('自動修正: See Details → 詳細を見る');
        }
      });
    }, 2000);
  }
  
  // 4. 英語翻訳関数（シンプル版）
  function translatePageToEnglish() {
    console.log('英語翻訳開始');
    
    // 翻訳辞書
    const translations = {
      'ホーム': 'Home',
      'ガイドを探す': 'Find Guides',
      '使い方': 'How to Use',
      'ログイン': 'Login',
      '新規登録': 'Register',
      '旅行者として登録': 'Register as Tourist',
      'ガイドとして登録': 'Register as Guide',
      'お問い合わせ': 'Contact Us',
      '人気のガイド': 'Popular Guides',
      'ガイドを絞り込む': 'Filter Guides',
      '地域': 'Region',
      '言語': 'Language',
      '料金': 'Fee',
      'キーワード': 'Keywords',
      '検索': 'Search',
      'リセット': 'Reset',
      '詳細を見る': 'See Details',
      'あなただけの特別な旅を': 'Your Special Journey Awaits',
      '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that you cannot find in regular tours'
    };
    
    // テキスト要素を翻訳
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span, label').forEach(element => {
      if (element.childElementCount === 0) {
        const text = element.textContent.trim();
        if (translations[text]) {
          element.textContent = translations[text];
        }
      }
    });
    
    // ナビゲーションメニューの翻訳
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach((link, index) => {
      if (index === 0) link.textContent = 'Home';
      else if (index === 1) link.textContent = 'Find Guides';
      else if (index === 2) link.textContent = 'How to Use';
    });
    
    console.log('英語翻訳完了');
  }
  
  // 5. Bootstrap JS の強制再初期化
  function reinitializeBootstrap() {
    if (typeof window.bootstrap !== 'undefined') {
      console.log('Bootstrap 再初期化開始');
      
      // ドロップダウンを再初期化
      const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
      dropdownElements.forEach(element => {
        try {
          new bootstrap.Dropdown(element);
        } catch (e) {
          console.log('Bootstrap ドロップダウン初期化エラー:', e);
        }
      });
      
      console.log('Bootstrap 再初期化完了');
    }
  }
  
  // 6. メイン初期化関数
  function initialize() {
    console.log('初期化開始');
    
    // Bootstrap チェック
    const bootstrapOK = checkBootstrap();
    
    // ヘッダーボタン修正
    fixHeaderButtons();
    
    // 詳細ボタン強制日本語化
    forceJapaneseDetailButtons();
    
    // Bootstrap 再初期化
    reinitializeBootstrap();
    
    // 現在の言語設定をチェック
    const currentLang = localStorage.getItem('selectedLanguage') || localStorage.getItem('localGuideLanguage');
    console.log('現在の言語設定:', currentLang);
    
    if (currentLang === 'en') {
      // 英語モードの場合は翻訳実行
      setTimeout(translatePageToEnglish, 500);
    }
    
    console.log('=== 統合修正スクリプト完了 ===');
  }
  
  // DOM読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // 外部からアクセス可能にする
  window.debugCompleteFix = {
    initialize: initialize,
    translatePageToEnglish: translatePageToEnglish,
    forceJapaneseDetailButtons: forceJapaneseDetailButtons,
    fixHeaderButtons: fixHeaderButtons
  };
  
})();