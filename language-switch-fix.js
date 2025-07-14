/**
 * 言語切り替え機能修正
 * 英語から日本語への切り替えを確実に実行
 */

(function() {
  'use strict';
  
  console.log('🌐 言語切り替え修正開始');
  
  // switchToJapanese関数を定義
  function switchToJapanese() {
    console.log('🇯🇵 日本語に切り替え中...');
    
    try {
      // 確実にindex.htmlにリダイレクト
      if (window.location.href.includes('index-en.html')) {
        window.location.href = window.location.href.replace('index-en.html', 'index.html');
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('言語切り替えエラー:', error);
      // フォールバック
      window.location.href = '/';
    }
  }
  
  // switchToEnglish関数を定義
  function switchToEnglish() {
    console.log('🇺🇸 英語に切り替え中...');
    
    try {
      // 確実にindex-en.htmlにリダイレクト
      if (window.location.href.includes('index.html') && !window.location.href.includes('index-en.html')) {
        window.location.href = window.location.href.replace('index.html', 'index-en.html');
      } else {
        window.location.href = '/index-en.html';
      }
    } catch (error) {
      console.error('言語切り替えエラー:', error);
      // フォールバック
      window.location.href = '/index-en.html';
    }
  }
  
  // グローバル関数として設定
  window.switchToJapanese = switchToJapanese;
  window.switchToEnglish = switchToEnglish;
  
  // 言語ボタンの設定
  function setupLanguageButtons() {
    // 日本語ボタン
    const japaneseButtons = document.querySelectorAll('[onclick*="switchToJapanese"], .lang-btn[href*="index.html"]');
    japaneseButtons.forEach(btn => {
      btn.removeAttribute('onclick');
      btn.removeAttribute('href');
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        switchToJapanese();
      });
    });
    
    // 英語ボタン
    const englishButtons = document.querySelectorAll('[onclick*="switchToEnglish"], .lang-btn[href*="index-en.html"]');
    englishButtons.forEach(btn => {
      btn.removeAttribute('onclick');
      btn.removeAttribute('href');
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        switchToEnglish();
      });
    });
    
    console.log('言語ボタン設定完了');
  }
  
  // 初期化
  function initialize() {
    setupLanguageButtons();
    
    // DOM変更を監視
    const observer = new MutationObserver(() => {
      setupLanguageButtons();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('✅ 言語切り替え修正完了');
  }
  
  // DOMContentLoaded後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();