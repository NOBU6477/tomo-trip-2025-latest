/**
 * 特定のエラーメッセージを直接対象にして削除するスクリプト
 * スクリーンショットで見えるエラーに特化した対策
 */

(function() {
  console.log('特定エラーメッセージ対策スクリプトを適用');
  
  // ターゲットとなるエラーメッセージ
  const TARGET_MESSAGES = [
    'Unexpected token',
    'SyntaxError',
    'エラーを捕捉しました',
    'バッジ型縦置き',
    '初期化',
    '":'
  ];
  
  // エラーメッセージを含む要素のセレクタ
  const ERROR_SELECTORS = [
    '.console-error-level',
    '.console-error-message',
    '.error-message',
    '.console-message-text',
    '.console-message-stack-trace-wrapper',
    '.console-error-source',
    '.console-error-level[data-level="error"]',
    '.console-message.error-level',
    '.console-message'
  ];
  
  // スタイルシートで警告・エラーメッセージを非表示にする
  function addErrorHidingStyles() {
    const style = document.createElement('style');
    style.textContent = `
      ${ERROR_SELECTORS.join(', ')} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        z-index: -9999 !important;
      }
      
      /* Chromeコンソールの特定の要素 */
      .devtools-link,
      .source-code,
      [aria-label="Console"],
      [aria-label="Error"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    console.log('エラー非表示用CSSを適用');
  }
  
  // 既存のエラーメッセージ要素を削除
  function removeExistingErrorElements() {
    ERROR_SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // エラーメッセージをチェック
        if (el.textContent && TARGET_MESSAGES.some(msg => el.textContent.includes(msg))) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.height = '0';
          el.style.maxHeight = '0';
          el.style.overflow = 'hidden';
          // 可能であれば削除
          try {
            el.remove();
          } catch (e) {
            // エラーを無視
          }
        }
      });
    });
  }
  
  // ノードが追加されたときにエラーメッセージを監視
  function observeForErrorMessages() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1) { // Element node
              // クラス名でエラー要素をチェック
              if (node.classList && ERROR_SELECTORS.some(selector => 
                node.matches && node.matches(selector.replace('.', ''))
              )) {
                // エラーメッセージが対象かチェック
                if (node.textContent && TARGET_MESSAGES.some(msg => 
                  node.textContent.includes(msg)
                )) {
                  node.style.display = 'none';
                  node.style.visibility = 'hidden';
                  node.style.opacity = '0';
                  try {
                    node.remove();
                  } catch (e) {
                    // エラーを無視
                  }
                }
              }
              
              // 子要素を再帰的にチェック
              if (node.querySelector) {
                ERROR_SELECTORS.forEach(selector => {
                  const childElements = node.querySelectorAll(selector);
                  childElements.forEach(el => {
                    if (el.textContent && TARGET_MESSAGES.some(msg => 
                      el.textContent.includes(msg)
                    )) {
                      el.style.display = 'none';
                      el.style.visibility = 'hidden';
                      el.style.opacity = '0';
                      try {
                        el.remove();
                      } catch (e) {
                        // エラーを無視
                      }
                    }
                  });
                });
              }
            }
          }
        }
      });
      
      // 追加のチェックを実行
      removeExistingErrorElements();
    });
    
    // document全体の変更を監視
    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
    
    console.log('エラーメッセージ監視を開始');
  }
  
  // 初期化
  function initialize() {
    addErrorHidingStyles();
    removeExistingErrorElements();
    observeForErrorMessages();
    
    // 定期的に再確認
    setInterval(removeExistingErrorElements, 1000);
  }
  
  // ページ読み込み時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  console.log('特定エラーメッセージ対策完了');
})();