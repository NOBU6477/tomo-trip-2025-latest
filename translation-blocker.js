/**
 * 翻訳ブロッカーシステム
 * 英語翻訳スクリプトによる日本語から英語への変換を完全にブロック
 */

(function() {
  'use strict';
  
  console.log('🚫 翻訳ブロッカーシステム開始');
  
  // 翻訳阻止対象の日本語テキスト
  const protectedJapaneseTexts = [
    '新規登録',
    'ログイン',
    'ホーム',
    'ガイドを探す',
    '使い方',
    '日本語'
  ];
  
  // 翻訳関数を無効化
  function disableTranslationFunctions() {
    // 一般的な翻訳関数名をオーバーライド
    const translationFunctions = [
      'translateContent',
      'translateText',
      'switchToEnglish', 
      'changeLanguage',
      'translatePage',
      'applyTranslation',
      'executeTranslation'
    ];
    
    translationFunctions.forEach(funcName => {
      if (window[funcName]) {
        window[funcName] = function() {
          console.log(`🚫 翻訳関数 ${funcName} をブロックしました`);
          return false;
        };
      }
    });
  }
  
  // 翻訳データオブジェクトを無効化
  function disableTranslationData() {
    const translationDataNames = [
      'translationData',
      'translations',
      'langData',
      'translateMap'
    ];
    
    translationDataNames.forEach(dataName => {
      if (window[dataName]) {
        window[dataName] = {};
        console.log(`🚫 翻訳データ ${dataName} を無効化`);
      }
    });
  }
  
  // DOM変更を監視して日本語テキストを保護
  function protectJapaneseText() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          const text = mutation.target.textContent;
          if (text === 'Sign Up' || text === 'Login' || text === 'Register') {
            // 元の親要素を特定
            const parent = mutation.target.parentElement;
            if (parent && parent.tagName === 'BUTTON') {
              if (parent.onclick && parent.onclick.toString().includes('showRegisterOptions')) {
                mutation.target.textContent = '新規登録';
                console.log('🛡️ 新規登録ボタンテキストを保護');
              } else if (parent.getAttribute('data-bs-target') === '#loginModal') {
                mutation.target.textContent = 'ログイン';
                console.log('🛡️ ログインボタンテキストを保護');
              }
            }
          }
        }
        
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              protectElementText(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // 要素のテキストを保護
  function protectElementText(element) {
    if (element.textContent && element.textContent.includes('Sign Up')) {
      if (element.onclick && element.onclick.toString().includes('showRegisterOptions')) {
        element.textContent = '新規登録';
        console.log('🛡️ 動的に追加された新規登録ボタンを保護');
      }
    }
  }
  
  // localStorage/sessionStorageへの翻訳データ保存をブロック
  function blockTranslationStorage() {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key.includes('language') || key.includes('translate') || key.includes('Language')) {
        // 翻訳関連のストレージ操作をブロック
        if (value.includes('english') || value.includes('English') || value.includes('en')) {
          console.log(`🚫 翻訳関連ストレージ保存をブロック: ${key}`);
          return;
        }
      }
      return originalSetItem.call(this, key, value);
    };
  }
  
  // 初期化
  function initialize() {
    disableTranslationFunctions();
    disableTranslationData();
    protectJapaneseText();
    blockTranslationStorage();
    
    // 継続監視
    setInterval(() => {
      disableTranslationFunctions();
      disableTranslationData();
    }, 1000);
    
    console.log('🛡️ 翻訳ブロッカーシステム完全起動');
  }
  
  // 最高優先度で実行
  initialize();
  
})();