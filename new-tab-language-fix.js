/**
 * 新しいタブ言語切り替え修正スクリプト
 * エディターと新しいタブの動作差異を完全に解決
 */

(function() {
  'use strict';
  
  console.log('🔧 新しいタブ言語切り替え修正開始');
  
  // 言語切り替えボタンの強化処理
  function enhanceLanguageButtons() {
    const langJa = document.getElementById('lang-ja');
    const langEn = document.getElementById('lang-en');
    
    console.log('言語ボタン確認:', {
      langJa: langJa ? 'found' : 'not found',
      langEn: langEn ? 'found' : 'not found'
    });
    
    if (langJa) {
      // 既存のイベントを削除して新しいものを設定
      const newLangJa = langJa.cloneNode(true);
      langJa.parentNode.replaceChild(newLangJa, langJa);
      
      newLangJa.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🇯🇵 日本語ボタンクリック');
        
        // 言語設定をクリア（日本語が初期値）
        localStorage.removeItem('language');
        localStorage.removeItem('lang');
        localStorage.removeItem('preferred-language');
        localStorage.removeItem('site-language');
        sessionStorage.clear();
        
        // 日本語サイトにリダイレクト
        const currentURL = window.location.href;
        const japaneseURL = currentURL.replace('index-en.html', 'index.html');
        
        console.log('日本語サイトにリダイレクト:', japaneseURL);
        window.location.href = japaneseURL;
      });
      
      console.log('✅ 日本語ボタン強化完了');
    }
    
    if (langEn) {
      // 既存のイベントを削除して新しいものを設定
      const newLangEn = langEn.cloneNode(true);
      langEn.parentNode.replaceChild(newLangEn, langEn);
      
      newLangEn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🇺🇸 英語ボタンクリック');
        
        // 強制的に英語設定を保存
        localStorage.setItem('language', 'en');
        localStorage.setItem('lang', 'en');
        localStorage.setItem('preferred-language', 'en');
        localStorage.setItem('site-language', 'en');
        sessionStorage.setItem('language', 'en');
        
        // 英語サイトにリダイレクト（既に英語サイトの場合はリロード）
        const currentURL = window.location.href;
        if (currentURL.includes('index-en.html')) {
          console.log('英語サイトでリロード');
          window.location.reload();
        } else {
          const englishURL = currentURL.replace('index.html', 'index-en.html');
          console.log('英語サイトにリダイレクト:', englishURL);
          window.location.href = englishURL;
        }
      });
      
      console.log('✅ 英語ボタン強化完了');
    }
  }
  
  // 現在のページが英語版かどうかを確認
  function checkAndEnforceEnglishSite() {
    const currentURL = window.location.href;
    const isEnglishSite = currentURL.includes('index-en.html');
    
    console.log('サイト確認:', {
      currentURL,
      isEnglishSite
    });
    
    if (isEnglishSite) {
      // 英語版サイトの場合、強制的に英語設定を適用
      localStorage.setItem('language', 'en');
      localStorage.setItem('lang', 'en');
      localStorage.setItem('preferred-language', 'en');
      localStorage.setItem('site-language', 'en');
      sessionStorage.setItem('language', 'en');
      
      // HTMLタグの言語属性を強制設定
      document.documentElement.lang = 'en';
      
      // 言語ドロップダウンボタンのテキストを英語に設定
      const langDropdown = document.getElementById('languageDropdown');
      if (langDropdown) {
        langDropdown.textContent = 'English';
      }
      
      console.log('✅ 英語サイト設定を強制適用');
    }
  }
  
  // ページ初期化時の処理
  function initializePageSettings() {
    checkAndEnforceEnglishSite();
    enhanceLanguageButtons();
    
    // ページのタイトルと言語を再確認
    const currentURL = window.location.href;
    if (currentURL.includes('index-en.html')) {
      document.title = 'TomoTrip - Local Guide Matching Platform';
      document.documentElement.lang = 'en';
      
      // 言語ドロップダウンのテキストを確実に英語に設定
      setTimeout(() => {
        const langDropdown = document.getElementById('languageDropdown');
        if (langDropdown && langDropdown.textContent.trim() !== 'English') {
          langDropdown.textContent = 'English';
        }
      }, 100);
    }
  }
  
  // 初期化処理の実行
  function initialize() {
    console.log('🚀 新しいタブ言語切り替え修正初期化');
    
    // 即座に実行
    initializePageSettings();
    
    // 遅延実行（DOM完全構築後）
    setTimeout(initializePageSettings, 100);
    setTimeout(initializePageSettings, 500);
    
    console.log('✅ 新しいタブ言語切り替え修正完了');
  }
  
  // 様々なタイミングで初期化を実行
  initialize();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  
  window.addEventListener('load', () => {
    setTimeout(initialize, 50);
  });
  
  // ページが新しいタブで開かれた時も実行
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(initialize, 10);
    }
  });
  
  console.log('📝 新しいタブ言語切り替え修正設定完了');
  
})();