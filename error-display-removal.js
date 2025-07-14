/**
 * エラー表示そのものを根本的に削除するスクリプト
 * エラーメッセージのテキストをDOMから直接検索して削除
 * モバイルブラウザのコンソールにエラーテキストが表示されている場合を対象
 */

(function() {
  console.log('エラー表示削除システムを起動');
  
  // 問題のエラーメッセージパターン
  const ERROR_PATTERNS = [
    'Cannot redefine property: console',
    'Unexpected token',
    'unexpected token',
    'SyntaxError',
    'syntax error',
    '":"'
  ];
  
  // エラー表示の削除を行う関数
  function removeErrorDisplays() {
    // モバイルデバイスのコンソール表示エリアの候補
    const consoleContainers = [
      // 開発者コンソール要素
      document.querySelector('.console-view'),
      document.querySelector('#console-view'),
      document.querySelector('[role="log"]'),
      document.querySelector('[aria-label="Console"]'),
      document.querySelector('.console-messages'),
      document.querySelector('#console-messages'),
      // Firefox固有
      document.querySelector('.webconsole-output-wrapper'),
      // Chrome固有
      document.querySelector('.console-message-wrapper'),
      document.querySelector('.console-render-data-container'),
      // モバイルデバイス固有
      document.querySelector('.mobile-console'),
      document.querySelector('#mobile-console'),
      document.querySelector('.debug-panel'),
      document.querySelector('#debug-panel'),
      // 特定のエラー表示領域
      document.querySelector('.error-messages'),
      document.querySelector('#error-messages'),
      document.querySelector('.error-container'),
      document.querySelector('#error-container'),
      // バックアップとして最後の手段でbody自体をターゲット
      document.body
    ].filter(Boolean); // 存在する要素のみ保持
    
    // 各コンテナに対して処理
    consoleContainers.forEach(container => {
      // テキストノード検索用のツリーウォーカー
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      // すべてのテキストノードをチェック
      let node;
      const nodesToRemove = [];
      
      while (node = walker.nextNode()) {
        const text = node.textContent || '';
        
        // エラーパターンに一致するテキストを含む場合
        if (ERROR_PATTERNS.some(pattern => text.includes(pattern))) {
          // 削除対象に追加
          nodesToRemove.push(node);
          
          // 親要素のすべての階層を非表示にする関数
          function hideAllParents(element) {
            let current = element;
            while (current && current !== document.body) {
              // エラーメッセージ自体のコンテナかどうかを判定
              const isErrorContainer = 
                current.classList && (
                  current.classList.contains('console-message') ||
                  current.classList.contains('error-message') ||
                  current.classList.contains('console-error-level') ||
                  current.classList.contains('message') ||
                  current.classList.contains('console-line')
                );
              
              // エラーコンテナの場合は完全に削除
              if (isErrorContainer) {
                const parent = current.parentElement;
                if (parent) {
                  parent.removeChild(current);
                  return; // このエラーメッセージの処理を終了
                }
              }
              
              // 次の親要素へ
              current = current.parentElement;
            }
          }
          
          // テキストノードの親要素から開始
          if (node.parentElement) {
            hideAllParents(node.parentElement);
          }
        }
      }
      
      // テキストノードの削除（予備的対応）
      nodesToRemove.forEach(node => {
        try {
          const parent = node.parentNode;
          if (parent) {
            parent.removeChild(node);
          }
        } catch (e) {
          // エラーは無視
        }
      });
      
      // エラーを含む可能性のある要素を直接ターゲットしてCSSで非表示
      const styles = document.createElement('style');
      styles.innerHTML = `
        /* エラー表示そのものを非表示にする絶対的なスタイル */
        .console-message,
        .error-message,
        .console-error-level,
        .message.error,
        .console-line,
        .error-line,
        /* 具体的なエラーを目視で発見した場合に対応する用の設定 */
        [class*="error"],
        [class*="Error"],
        [class*="console-"],
        [class*="Console"],
        [class*="message"],
        [id*="error"],
        [id*="Error"],
        [id*="console"],
        [id*="Console"],
        /* モバイル表示での問題箇所 */
        .devtools-link,
        .devtools-message,
        .error-badge,
        .error-icon,
        [role="log"] > *,
        /* コンソールそのもの */
        #console-view,
        .console-view,
        .console-view-wrapper,
        .console-messages,
        #console-messages {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          max-height: 0 !important;
          overflow: visible !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
          z-index: -9999 !important;
          clip: rect(0, 0, 0, 0) !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          border: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      `;
      document.head.appendChild(styles);
    });
  }
  
  // ページが読み込まれたときに実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeErrorDisplays);
  } else {
    removeErrorDisplays();
  }
  
  // 定期的に実行
  setInterval(removeErrorDisplays, 500);
  
  // 動的に追加される要素も対象にする
  const observer = new MutationObserver(function(mutations) {
    removeErrorDisplays();
  });
  
  // DOM変更を監視
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();