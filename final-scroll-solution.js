/**
 * 最終的なスクロール問題解決策
 * 言語切り替え時にページをリロードしてスクロール問題を完全に回避
 */
(function() {
  'use strict';
  
  console.log('🔧 最終スクロール解決システム開始');
  
  // 言語切り替え時にページリロード
  function setupLanguageReloadFix() {
    const langJa = document.getElementById('lang-ja');
    const langEn = document.getElementById('lang-en');
    
    if (langJa) {
      langJa.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('日本語切り替え - ページリロード');
        
        // 言語設定を保存
        localStorage.setItem('language', 'ja');
        
        // ページリロード
        window.location.reload();
      });
    }
    
    if (langEn) {
      langEn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('英語切り替え - ページリロード');
        
        // 言語設定を保存
        localStorage.setItem('language', 'en');
        
        // ページリロード
        window.location.reload();
      });
    }
  }
  
  // ページ読み込み時に言語設定を適用
  function applyLanguageOnLoad() {
    const savedLanguage = localStorage.getItem('language') || 'ja';
    console.log('ページ読み込み時の言語設定:', savedLanguage);
    
    if (savedLanguage === 'en') {
      // 英語翻訳を適用
      setTimeout(() => {
        performEnglishTranslation();
      }, 100);
    }
  }
  
  // シンプルな英語翻訳
  function performEnglishTranslation() {
    console.log('英語翻訳開始');
    
    // ナビゲーション
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (navLinks.length >= 3) {
      navLinks[0].textContent = 'Home';
      navLinks[1].textContent = 'Find Guides';
      navLinks[2].textContent = 'How to Use';
    }
    
    // ヒーローセクション
    const heroTitle = document.querySelector('h1');
    if (heroTitle && heroTitle.textContent.includes('特別な旅')) {
      heroTitle.textContent = 'Your Special Journey Awaits';
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && heroSubtitle.textContent.includes('地元ガイド')) {
      heroSubtitle.textContent = 'Experience hidden gems with local guides that you cannot find in regular tours';
    }
    
    // ボタン
    const findGuidesBtn = document.querySelector('a[href="#guides"]');
    if (findGuidesBtn && findGuidesBtn.textContent.includes('ガイドを探す')) {
      findGuidesBtn.textContent = 'Find Guides';
    }
    
    const contactBtn = document.querySelector('a[href="#contact"]');
    if (contactBtn && contactBtn.textContent.includes('お問い合わせ')) {
      contactBtn.textContent = 'Contact Us';
    }
    
    // セクションタイトル
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
      if (title.textContent.includes('おすすめガイド')) {
        title.textContent = 'Recommended Guides';
      } else if (title.textContent.includes('ガイドになる特典')) {
        title.textContent = 'Benefits of Becoming a Guide';
      }
    });
    
    // ガイドカウンター
    const counter = document.getElementById('search-results-counter');
    if (counter && counter.textContent.includes('人のガイド')) {
      const count = counter.textContent.match(/\d+/);
      if (count) {
        counter.textContent = `Found ${count[0]} guides`;
      }
    }
    
    // 言語ドロップダウン表示を更新
    const languageButton = document.getElementById('languageDropdown');
    if (languageButton) {
      languageButton.textContent = 'English';
    }
    
    console.log('英語翻訳完了');
  }
  
  // 70人のガイドを確実に表示
  function ensure70Guides() {
    const container = document.getElementById('guide-cards-container');
    if (container && container.children.length < 10) {
      console.log('ガイド数が少ない - 70人ガイドスクリプトを実行');
      
      // load-70-guides.jsの機能を直接実行
      if (typeof displayGuides === 'function') {
        displayGuides();
      } else {
        // スクリプトを動的に読み込み
        const script = document.createElement('script');
        script.src = 'load-70-guides.js';
        document.head.appendChild(script);
      }
    }
  }
  
  // 初期化
  function initialize() {
    console.log('最終スクロール解決システム初期化');
    
    // 言語切り替えをリロードベースに変更
    setupLanguageReloadFix();
    
    // ページ読み込み時の言語適用
    applyLanguageOnLoad();
    
    // 70人のガイド表示確保
    setTimeout(ensure70Guides, 1000);
    
    console.log('最終解決システム準備完了');
  }
  
  // DOM準備完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();