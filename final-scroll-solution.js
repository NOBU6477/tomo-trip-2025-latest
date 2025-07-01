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
        
        // 両方のキーに保存（互換性確保）
        localStorage.setItem('language', 'ja');
        localStorage.setItem('selectedLanguage', 'ja');
        
        // ページリロード
        window.location.reload();
      });
    }
    
    if (langEn) {
      langEn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('英語切り替え - ページリロード');
        
        // 両方のキーに保存（互換性確保）
        localStorage.setItem('language', 'en');
        localStorage.setItem('selectedLanguage', 'en');
        
        // ページリロード
        window.location.reload();
      });
    }
  }
  
  // ページ読み込み時に言語設定を適用
  function applyLanguageOnLoad() {
    // 両方のキーをチェック（互換性確保）
    const savedLanguage = localStorage.getItem('selectedLanguage') || localStorage.getItem('language') || 'ja';
    console.log('ページ読み込み時の言語設定:', savedLanguage);
    
    if (savedLanguage === 'en') {
      // 英語翻訳を適用（複数回実行で確実性向上）
      setTimeout(() => {
        performEnglishTranslation();
      }, 100);
      
      setTimeout(() => {
        performEnglishTranslation();
      }, 500);
      
      setTimeout(() => {
        performEnglishTranslation();
      }, 1000);
    }
  }
  
  // 包括的な英語翻訳
  function performEnglishTranslation() {
    console.log('包括的英語翻訳開始');
    
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
    
    // ヒーローセクションの説明文
    document.querySelectorAll('p, span, div').forEach(element => {
      if (element.textContent.includes('隠れた名所')) {
        element.textContent = 'Experience hidden gems with local guides that you cannot find in regular tours';
      }
    });
    
    // ボタン翻訳（より包括的に）
    document.querySelectorAll('a, button').forEach(element => {
      const text = element.textContent.trim();
      if (text === 'ガイドを探す') {
        element.textContent = 'Find Guides';
      } else if (text === 'お問い合わせ') {
        element.textContent = 'Contact Us';
      } else if (text === '詳細を見る') {
        element.textContent = 'See Details';
      } else if (text === 'ガイド登録') {
        element.textContent = 'Register as Guide';
      } else if (text === '観光客登録') {
        element.textContent = 'Register as Tourist';
      } else if (text === 'ログイン') {
        element.textContent = 'Login';
      }
    });
    
    // セクションタイトル
    const sectionTitles = document.querySelectorAll('.section-title, h2, h3');
    sectionTitles.forEach(title => {
      const text = title.textContent.trim();
      if (text.includes('おすすめガイド')) {
        title.textContent = 'Recommended Guides';
      } else if (text.includes('ガイドになる特典')) {
        title.textContent = 'Benefits of Becoming a Guide';
      } else if (text.includes('注目のガイド')) {
        title.textContent = 'Featured Guides';
      }
    });
    
    // ガイドカウンター
    const counter = document.getElementById('search-results-counter');
    if (counter) {
      const text = counter.textContent;
      if (text.includes('人のガイド')) {
        const count = text.match(/\d+/);
        if (count) {
          counter.textContent = `Showing ${count[0]} guides (${count[0]} total)`;
        }
      } else if (text.includes('Showing') && text.includes('guides')) {
        // 既に英語の場合はそのまま
      } else {
        counter.textContent = 'Showing 70 guides (70 total)';
      }
    }
    
    // ベネフィットカード翻訳
    translateBenefitCards();
    
    // スポンサーセクション翻訳
    translateSponsorSection();
    
    // 言語ドロップダウン表示を更新
    const languageButton = document.getElementById('languageDropdown');
    if (languageButton) {
      languageButton.textContent = 'English';
    }
    
    console.log('包括的英語翻訳完了');
  }
  
  // ベネフィットカード翻訳
  function translateBenefitCards() {
    document.querySelectorAll('.card').forEach(card => {
      const cardText = card.textContent;
      
      // ベネフィットカードの翻訳
      if (cardText.includes('収入アップ')) {
        const title = card.querySelector('.card-title, h5');
        if (title) title.textContent = 'Increase Income';
        
        const content = card.querySelector('.card-text, p');
        if (content && content.textContent.includes('ガイド活動')) {
          content.textContent = 'Earn money through guide activities and build your personal brand.';
        }
      }
      
      if (cardText.includes('スキル向上')) {
        const title = card.querySelector('.card-title, h5');
        if (title) title.textContent = 'Skill Enhancement';
        
        const content = card.querySelector('.card-text, p');
        if (content && content.textContent.includes('言語スキル')) {
          content.textContent = 'Improve language skills and communication abilities through tourist interactions.';
        }
      }
      
      if (cardText.includes('ネットワーク')) {
        const title = card.querySelector('.card-title, h5');
        if (title) title.textContent = 'Network Building';
        
        const content = card.querySelector('.card-text, p');
        if (content && content.textContent.includes('世界中')) {
          content.textContent = 'Build connections with people from around the world and expand your network.';
        }
      }
    });
  }
  
  // スポンサーセクション翻訳
  function translateSponsorSection() {
    document.querySelectorAll('h2, h3, .section-title').forEach(title => {
      if (title.textContent.includes('スポンサー')) {
        title.textContent = 'Our Sponsors';
      }
    });
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