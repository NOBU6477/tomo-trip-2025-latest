/**
 * 専用の「詳細を見る」ボタン翻訳スクリプト
 * 言語切り替え時に確実にボタンを翻訳する
 */

(function() {
  'use strict';

  /**
   * すべての「詳細を見る」ボタンを「See Details」に翻訳する
   */
  function translateDetailButtons() {
    console.log('詳細を見るボタンの翻訳を開始');
    
    // 複数のセレクタでボタンを検索
    const selectors = [
      '.guide-details-link',
      'a.btn',
      'button.btn',
      '.btn',
      'a[href="#"]'
    ];
    
    let translatedCount = 0;
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (element.textContent && element.textContent.trim() === '詳細を見る') {
          element.textContent = 'See Details';
          translatedCount++;
          console.log(`翻訳しました: ${selector}`);
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
    return localStorage.getItem('selectedLanguage') === 'en';
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
    
    // 定期的なチェック（念のため）
    setInterval(function() {
      if (isEnglishMode()) {
        translateDetailButtons();
      }
    }, 2000);
  }

  // グローバル関数として公開
  window.translateDetailButtons = translateDetailButtons;
  window.executeButtonTranslation = executeButtonTranslation;

  // 初期化実行
  initialize();

})();