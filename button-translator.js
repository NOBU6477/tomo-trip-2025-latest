/**
 * 専用の「詳細を見る」ボタン翻訳スクリプト
 * 言語切り替え時に確実にボタンを翻訳する
 */

(function() {
  'use strict';

  /**
   * すべてのガイド詳細ボタンを英語に翻訳する
   */
  function translateDetailButtons() {
    // 現在の言語設定を確認
    const currentLanguage = localStorage.getItem('language') || 'ja';
    
    // 日本語モードの場合は翻訳を実行しない
    if (currentLanguage === 'ja') {
      console.log('日本語モードのため詳細ボタンの英語翻訳をスキップ');
      return 0;
    }
    
    console.log('ガイド詳細ボタンの翻訳を開始');
    
    // 複数のセレクタでボタンを検索
    const selectors = [
      '.guide-details-link',
      'a.btn',
      'button.btn',
      '.btn'
    ];
    
    let translatedCount = 0;
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        const text = element.textContent.trim();
        
        // ガイド詳細ボタンの翻訳
        if (text === '詳細を見る') {
          element.innerHTML = '<i class="bi bi-eye me-1"></i>See Details';
          translatedCount++;
          console.log(`詳細ボタンを翻訳: ${selector}`);
        }
        // 旧ログイン要求ボタンの翻訳（互換性のため）
        else if (text === 'ログインして詳細を見る') {
          element.innerHTML = '<i class="bi bi-lock me-1"></i>Login to View Details';
          translatedCount++;
          console.log(`ログインボタンを翻訳: ${selector}`);
        }
      });
    });
    
    console.log(`${translatedCount}個のボタンを翻訳しました`);
    return translatedCount;
  }

  /**
   * 英語モードかどうかを確認
   */
  function isEnglishMode() {
    return localStorage.getItem('language') === 'en';
  }

  /**
   * ボタン翻訳を実行（英語モードの場合のみ）
   */
  function executeButtonTranslation() {
    if (isEnglishMode()) {
      translateDetailButtons();
    }
  }

  /**
   * DOM変更の監視とボタン翻訳
   */
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      if (!isEnglishMode()) return;
      
      let shouldTranslate = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 新しく追加された要素に「詳細を見る」ボタンがあるかチェック
              if (node.textContent && node.textContent.includes('詳細を見る')) {
                shouldTranslate = true;
              }
            }
          });
        }
      });
      
      if (shouldTranslate) {
        setTimeout(translateDetailButtons, 50);
      }
    });

    // ガイドコンテナとドキュメント全体を監視
    const containers = [
      document.getElementById('guide-cards-container'),
      document.body
    ].filter(Boolean);
    
    containers.forEach(container => {
      observer.observe(container, { 
        childList: true, 
        subtree: true,
        characterData: true
      });
    });
  }

  /**
   * 初期化
   */
  function initialize() {
    console.log('ボタン翻訳システムを初期化');
    
    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(executeButtonTranslation, 100);
        setupMutationObserver();
      });
    } else {
      setTimeout(executeButtonTranslation, 100);
      setupMutationObserver();
    }
    
    // 定期的なチェック（念のため）- 日本語モードでは不要
    // setInterval(function() {
    //   if (isEnglishMode()) {
    //     translateDetailButtons();
    //   }
    // }, 2000);
  }

  // グローバル関数として公開
  window.translateDetailButtons = translateDetailButtons;
  window.executeButtonTranslation = executeButtonTranslation;

  // 初期化実行
  initialize();

})();