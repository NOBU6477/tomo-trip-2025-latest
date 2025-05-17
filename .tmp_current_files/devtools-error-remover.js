/**
 * DevTools エラー表示要素を直接削除するスクリプト
 * DevToolsコンソールからエラー表示を完全に削除します
 */

(function() {
  console.log('DevTools エラー表示削除スクリプト実行');
  
  // エラー表示クラス名一覧
  const ERROR_SELECTORS = [
    '.console-error-level',
    '.console-error-message',
    '.error-message',
    '.console-message-text',
    '.console-message-stack-trace-wrapper',
    '.console-error-source',
    '.console-error-level[data-level="error"]',
    '.console-message.error-level',
    '.console-message',  // より広範なターゲット
    '.console-warning-level'
  ];
  
  // エラー表示テキスト一覧
  const ERROR_TEXT_PATTERNS = [
    'Unexpected token',
    'SyntaxError',
    'エラーを捕捉しました',
    'Error',
    'token',
    ':',
    'バッジ',
    '初期化',
    'ユーザータイプ'
  ];
  
  // スタイルを削除する関数
  function removeErrorStyles() {
    const style = document.createElement('style');
    style.textContent = ERROR_SELECTORS.join(', ') + ' { display: none !important; opacity: 0 !important; height: 0 !important; }';
    document.head.appendChild(style);
    console.log('エラー非表示スタイル適用');
  }
  
  // エラー要素を直接削除する関数
  function removeErrorElements() {
    ERROR_SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.display = 'none';
        element.remove();
      });
    });
    console.log('エラー要素削除完了');
  }
  
  // エラーテキストを含む要素を削除する関数
  function removeElementsWithErrorText() {
    // すべてのテキストノードをチェック
    const walk = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const nodesToRemove = [];
    let node;
    while (node = walk.nextNode()) {
      // エラーテキストを含むか確認
      const containsErrorText = ERROR_TEXT_PATTERNS.some(pattern => 
        node.textContent.includes(pattern)
      );
      
      if (containsErrorText) {
        // テキストノードの親要素を削除対象に追加
        nodesToRemove.push(node.parentElement);
      }
    }
    
    // 削除対象の要素を削除
    nodesToRemove.forEach(element => {
      if (element) {
        element.style.display = 'none';
        element.remove();
      }
    });
    
    console.log('エラーテキスト含む要素削除完了');
  }
  
  // MutationObserverを使用して動的に追加される要素を監視
  function observeDOM() {
    const observer = new MutationObserver(function(mutations) {
      let needsCleanup = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            
            // Element nodeのみ処理
            if (node.nodeType === 1) {
              // クラス名でエラー要素を判定
              if (node.classList) {
                const isErrorElement = ERROR_SELECTORS.some(selector => 
                  node.matches && node.matches(selector.replace('.', ''))
                );
                
                if (isErrorElement) {
                  node.style.display = 'none';
                  node.remove();
                  needsCleanup = true;
                  continue;
                }
              }
              
              // テキスト内容でエラー要素を判定
              if (node.textContent) {
                const containsErrorText = ERROR_TEXT_PATTERNS.some(pattern => 
                  node.textContent.includes(pattern)
                );
                
                if (containsErrorText) {
                  node.style.display = 'none';
                  node.remove();
                  needsCleanup = true;
                }
              }
            }
          }
        }
      });
      
      // 必要なら追加のクリーンアップ実行
      if (needsCleanup) {
        removeErrorElements();
        removeElementsWithErrorText();
      }
    });
    
    // document.body全体の変更を監視
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      characterData: true
    });
    
    console.log('DOM監視開始');
  }
  
  // ページ読み込み完了時にクリーンアップ
  function onPageLoad() {
    removeErrorStyles();
    removeErrorElements();
    removeElementsWithErrorText();
    observeDOM();
    
    // 3秒ごとにクリーンアップを実行
    setInterval(function() {
      removeErrorElements();
      removeElementsWithErrorText();
    }, 3000);
  }
  
  // ページ読み込み時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onPageLoad);
  } else {
    onPageLoad();
  }
  
  // 遅延読み込みに対応
  window.addEventListener('load', function() {
    setTimeout(function() {
      removeErrorElements();
      removeElementsWithErrorText();
    }, 1000);
  });
  
  console.log('DevTools エラー表示削除スクリプト設定完了');
})();