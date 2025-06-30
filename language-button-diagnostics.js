/**
 * 言語切り替えボタン診断スクリプト
 * ボタンの状態とイベントリスナーを詳細に調査
 */
(function() {
  'use strict';
  
  console.log('=== 言語ボタン診断開始 ===');
  
  function diagnoseLanguageButtons() {
    // 1. ボタン要素の存在確認
    const langJaBtn = document.getElementById('lang-ja');
    const langEnBtn = document.getElementById('lang-en');
    const languageDropdown = document.getElementById('languageDropdown');
    
    console.log('ボタン要素チェック:');
    console.log('- 日本語ボタン (lang-ja):', langJaBtn ? '✓ 存在' : '✗ 存在しない');
    console.log('- 英語ボタン (lang-en):', langEnBtn ? '✓ 存在' : '✗ 存在しない');
    console.log('- ドロップダウンボタン (languageDropdown):', languageDropdown ? '✓ 存在' : '✗ 存在しない');
    
    if (langJaBtn) {
      console.log('日本語ボタン詳細:', {
        tagName: langJaBtn.tagName,
        className: langJaBtn.className,
        textContent: langJaBtn.textContent,
        href: langJaBtn.href,
        onclick: langJaBtn.onclick,
        hasClickHandler: typeof langJaBtn.onclick === 'function'
      });
    }
    
    if (langEnBtn) {
      console.log('英語ボタン詳細:', {
        tagName: langEnBtn.tagName,
        className: langEnBtn.className,
        textContent: langEnBtn.textContent,
        href: langEnBtn.href,
        onclick: langEnBtn.onclick,
        hasClickHandler: typeof langEnBtn.onclick === 'function'
      });
    }
    
    // 2. Bootstrap ドロップダウン状態確認
    if (languageDropdown) {
      console.log('ドロップダウン詳細:', {
        tagName: languageDropdown.tagName,
        className: languageDropdown.className,
        textContent: languageDropdown.textContent,
        'data-bs-toggle': languageDropdown.getAttribute('data-bs-toggle'),
        'aria-expanded': languageDropdown.getAttribute('aria-expanded')
      });
    }
    
    // 3. Bootstrap JavaScript 確認
    console.log('Bootstrap チェック:');
    console.log('- window.bootstrap:', typeof window.bootstrap !== 'undefined' ? '✓ 利用可能' : '✗ 未定義');
    console.log('- jQuery:', typeof window.$ !== 'undefined' ? '✓ 利用可能' : '✗ 未定義');
    
    // 4. 現在の言語設定確認
    const currentLang1 = localStorage.getItem('selectedLanguage');
    const currentLang2 = localStorage.getItem('localGuideLanguage');
    const currentLang3 = localStorage.getItem('language');
    
    console.log('現在の言語設定:');
    console.log('- selectedLanguage:', currentLang1);
    console.log('- localGuideLanguage:', currentLang2);
    console.log('- language:', currentLang3);
    
    return {
      langJaBtn,
      langEnBtn,
      languageDropdown,
      hasBootstrap: typeof window.bootstrap !== 'undefined'
    };
  }
  
  function setupWorkingLanguageButtons() {
    console.log('動作する言語ボタンを設定中...');
    
    const elements = diagnoseLanguageButtons();
    
    if (elements.langJaBtn) {
      // 新しいイベントリスナーを追加（既存を上書き）
      elements.langJaBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🇯🇵 日本語ボタンクリック処理開始');
        
        // ドロップダウンテキスト更新
        if (elements.languageDropdown) {
          elements.languageDropdown.textContent = '日本語';
        }
        
        // 言語設定保存
        localStorage.setItem('selectedLanguage', 'ja');
        localStorage.setItem('localGuideLanguage', 'ja');
        localStorage.setItem('language', 'ja');
        
        // ページリロード（確実な方法）
        console.log('日本語モードに切り替え - ページをリロードします');
        setTimeout(() => {
          location.reload();
        }, 100);
        
        return false;
      };
      console.log('✓ 日本語ボタンのイベントハンドラを設定しました');
    }
    
    if (elements.langEnBtn) {
      elements.langEnBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🇺🇸 英語ボタンクリック処理開始');
        
        // ドロップダウンテキスト更新
        if (elements.languageDropdown) {
          elements.languageDropdown.textContent = 'English';
        }
        
        // 言語設定保存
        localStorage.setItem('selectedLanguage', 'en');
        localStorage.setItem('localGuideLanguage', 'en');
        localStorage.setItem('language', 'en');
        
        // 英語翻訳実行
        console.log('英語モードに切り替え中...');
        translateToEnglishSimple();
        
        return false;
      };
      console.log('✓ 英語ボタンのイベントハンドラを設定しました');
    }
    
    // 新規登録ドロップダウンの修正も実行
    setupRegistrationDropdown();
  }
  
  function setupRegistrationDropdown() {
    const registerDropdown = document.getElementById('registerDropdown');
    if (registerDropdown) {
      console.log('新規登録ドロップダウンを設定中...');
      
      // Bootstrap属性を確実に設定
      registerDropdown.setAttribute('data-bs-toggle', 'dropdown');
      registerDropdown.setAttribute('aria-expanded', 'false');
      
      // 手動クリックハンドラも追加（フォールバック）
      registerDropdown.onclick = function(e) {
        console.log('新規登録ドロップダウンがクリックされました');
        
        const menu = document.querySelector('#registerDropdown + .dropdown-menu');
        if (menu) {
          // 表示/非表示を切り替え
          if (menu.style.display === 'block') {
            menu.style.display = 'none';
            registerDropdown.setAttribute('aria-expanded', 'false');
          } else {
            // 他のドロップダウンを閉じる
            document.querySelectorAll('.dropdown-menu').forEach(m => {
              if (m !== menu) m.style.display = 'none';
            });
            
            menu.style.display = 'block';
            registerDropdown.setAttribute('aria-expanded', 'true');
          }
        }
      };
      
      console.log('✓ 新規登録ドロップダウンを設定しました');
    }
  }
  
  function translateToEnglishSimple() {
    console.log('シンプル英語翻訳を実行中...');
    
    // 基本的な翻訳辞書
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
      '詳細を見る': 'See Details',
      'あなただけの特別な旅を': 'Your Special Journey Awaits',
      '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that you cannot find in regular tours'
    };
    
    // テキスト要素を翻訳
    let translatedCount = 0;
    document.querySelectorAll('a, button, h1, h2, h3, h4, h5, h6, p, span, label').forEach(element => {
      if (element.childElementCount === 0) {
        const text = element.textContent.trim();
        if (translations[text]) {
          element.textContent = translations[text];
          translatedCount++;
        }
      }
    });
    
    // ナビゲーションメニュー翻訳
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach((link, index) => {
      if (index === 0) link.textContent = 'Home';
      else if (index === 1) link.textContent = 'Find Guides';
      else if (index === 2) link.textContent = 'How to Use';
    });
    
    console.log(`✓ ${translatedCount}個の要素を英語に翻訳しました`);
  }
  
  // 外部からアクセス可能な関数として公開
  window.diagnoseLanguageButtons = diagnoseLanguageButtons;
  window.setupWorkingLanguageButtons = setupWorkingLanguageButtons;
  window.translateToEnglishSimple = translateToEnglishSimple;
  
  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        diagnoseLanguageButtons();
        setupWorkingLanguageButtons();
      }, 500);
    });
  } else {
    setTimeout(function() {
      diagnoseLanguageButtons();
      setupWorkingLanguageButtons();
    }, 500);
  }
  
  console.log('=== 言語ボタン診断システム準備完了 ===');
  
})();