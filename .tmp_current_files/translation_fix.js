/**
 * 翻訳キーが見つからない問題を解決するための強化スクリプト
 * 翻訳がない場合に自動的に人間が読める形式に変換する
 */
(function() {
  'use strict';

  // オリジナルのi18n.getText関数を保存するための変数
  let originalGetText = null;
  
  // DOMが読み込まれたときに初期化
  // DOMの準備ができたら初期化を試みる
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initTranslationFix();
    });
  } else {
    // DOMがすでに読み込まれている場合は直接実行
    initTranslationFix();
  }
  
  // ウィンドウの読み込みが完了した時にも初期化を試みる
  window.addEventListener('load', function() {
    initTranslationFix();
  });
  
  /**
   * 翻訳システムに修正を適用する
   */
  function initTranslationFix() {
    // i18nオブジェクトの有無を確認
    const i18nExists = window.i18n && typeof window.i18n.getText === 'function';
    
    if (i18nExists && !originalGetText) {
      // オリジナルのgetText関数を保存
      originalGetText = window.i18n.getText;
      
      // 機能拡張版でオーバーライド
      window.i18n.getText = function(key, defaultValue) {
        // まずオリジナルの関数を試す
        const translation = originalGetText.call(window.i18n, key);
        
        // 翻訳が見つからない場合
        if (!translation || translation === key) {
          // デフォルト値が指定されていれば使用
          if (defaultValue !== undefined) {
            return defaultValue;
          }
          
          // キーから人間が読める形式に変換
          return humanizeKey(key);
        }
        
        return translation;
      };
      
      // 全ての翻訳要素に適用
      applyToAllElements();
    }
  }
  
  /**
   * 翻訳キーを人間が読める形式に変換
   * @param {string} key - 翻訳キー（例：'nav.home', 'search.placeholder'）
   * @returns {string} 人間が読める形式の文字列
   */
  function humanizeKey(key) {
    // キーがない場合は空文字を返す
    if (!key) return '';
    
    // キーの最後の部分だけを使用（例：'nav.home' -> 'home'）
    const lastPart = key.split('.').pop();
    
    // アンダースコアをスペースに置換
    const withSpaces = lastPart.replace(/_/g, ' ');
    
    // キャメルケースをスペースで区切る（例：'searchButton' -> 'search Button'）
    const separated = withSpaces.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // 最初の文字を大文字に
    return separated.charAt(0).toUpperCase() + separated.slice(1);
  }
  
  /**
   * ページ内のすべての翻訳要素に修正を適用
   */
  function applyToAllElements() {
    // data-i18n属性を持つすべての要素を取得
    const elements = document.querySelectorAll('[data-i18n]');
    
    // 各要素に対して処理を実行
    elements.forEach(function(element) {
      const key = element.getAttribute('data-i18n');
      
      // すでに翻訳が適用されている場合はスキップ
      if (element.textContent && element.textContent !== key) {
        return;
      }
      
      // 翻訳を取得して適用
      element.textContent = window.i18n.getText(key, element.textContent);
    });
    
    // data-i18n-attrを持つ要素（属性の翻訳）を処理
    const attrElements = document.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(function(element) {
      const attrName = element.getAttribute('data-i18n-attr');
      const key = element.getAttribute('data-i18n');
      
      if (attrName && key) {
        element.setAttribute(attrName, window.i18n.getText(key, element.getAttribute(attrName)));
      }
    });
  }
  
  /**
   * モーダルが表示されたときに翻訳を再適用するリスナーを設定
   */
  function setupModalListeners() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(function(modal) {
      modal.addEventListener('shown.bs.modal', function() {
        // モーダル内の翻訳要素だけを処理
        const elements = modal.querySelectorAll('[data-i18n]');
        elements.forEach(function(element) {
          const key = element.getAttribute('data-i18n');
          element.textContent = window.i18n.getText(key, element.textContent);
        });
        
        // モーダル内の属性翻訳要素
        const attrElements = modal.querySelectorAll('[data-i18n-attr]');
        attrElements.forEach(function(element) {
          const attrName = element.getAttribute('data-i18n-attr');
          const key = element.getAttribute('data-i18n');
          
          if (attrName && key) {
            element.setAttribute(attrName, window.i18n.getText(key, element.getAttribute(attrName)));
          }
        });
      });
    });
  }
  
  // イベントが利用可能になったらモーダルリスナーを設定
  if (typeof bootstrap !== 'undefined') {
    setupModalListeners();
  } else {
    // Bootstrapがまだ読み込まれていない場合は、読み込み後に実行
    window.addEventListener('load', function() {
      if (typeof bootstrap !== 'undefined') {
        setupModalListeners();
      }
    });
  }
  
  // デバッグ用のAPIを公開
  window.translationFix = {
    reapplyTranslations: applyToAllElements,
    humanizeKey: humanizeKey
  };
  
  // MutationObserverで動的に追加される要素にも対応
  const observer = new MutationObserver(function(mutations) {
    let hasNewTranslatableElements = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        for (const node of addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.hasAttribute('data-i18n') || node.querySelector('[data-i18n]')) {
              hasNewTranslatableElements = true;
              break;
            }
          }
        }
      }
    });
    
    if (hasNewTranslatableElements) {
      applyToAllElements();
    }
  });
  
  // ページ全体を監視（document.bodyが存在することを確認）
  function initObserver() {
    try {
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } else {
        // bodyがまだ利用できない場合は、ロードイベント時に再試行
        window.addEventListener('load', function() {
          try {
            if (document.body) {
              observer.observe(document.body, {
                childList: true,
                subtree: true
              });
            }
          } catch (error) {
            console.log('MutationObserver初期化エラー (遅延):', error);
          }
        });
      }
    } catch (error) {
      console.log('MutationObserver初期化エラー:', error);
    }
  }
  
  // 安全に初期化を遅延実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initObserver, 100);
    });
  } else {
    setTimeout(initObserver, 100);
  }
})();