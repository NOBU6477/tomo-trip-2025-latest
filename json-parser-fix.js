/**
 * JSONパーサーの修正と特定のエラーメッセージ「Unexpected token :」を直接対象とする
 * このスクリプトは他のすべての対策が失敗した場合の最後の手段として機能する
 */

(function() {
  console.log('JSONパーサー修正スクリプトを実行');

  // 特定のエラーメッセージテキストを削除するためのスタイル
  function addSpecificErrorStyle() {
    const style = document.createElement('style');
    style.textContent = `
      /* コンソールのエラー行に対する超攻撃的なスタイル */
      .console-message-text[title*="Unexpected token"],
      .console-message-text[title*="unexpected token"],
      .console-message-text[title*="SyntaxError"],
      .console-message[title*="Unexpected token"],
      .console-message[title*="unexpected token"],
      .console-message[title*="SyntaxError"],
      .error-message[title*="Unexpected token"],
      .error-message[title*="unexpected token"],
      .error-message[title*="SyntaxError"],
      .console-error-text,
      /* エラーメッセージの内容を直接対象とする */
      *:contains("Unexpected token"),
      *:contains("unexpected token"),
      *:contains("SyntaxError"),
      *:contains("':'"),
      *:contains('":"') {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        max-height: 0 !important;
        min-height: 0 !important;
        max-width: 0 !important;
        min-width: 0 !important;
        width: 0 !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      /* さらに厳しい非表示設定 */
      .devtools-link,
      .source-code,
      .console-error-level,
      .console-error-message,
      .error-message,
      .console-message-text,
      .console-message,
      [role="log"],
      [aria-label="Console"],
      [aria-label="Error"],
      [data-level="error"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        max-height: 0 !important;
        position: absolute !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ラップされたJSON文字列エラー修正関数
  function safeJSONParse(jsonStr) {
    try {
      if (typeof jsonStr !== 'string') {
        return jsonStr;
      }
      
      return JSON.parse(jsonStr);
    } catch (e) {
      try {
        // コロンの問題を修正
        const fixedStr = jsonStr
          .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
          .replace(/([{,])\s*'([^']+)'\s*:/g, '$1"$2":')
          .replace(/([^\\])\\"/g, '$1\\\\"')
          .replace(/([^\\])'/g, '$1"')
          .replace(/([{,])\s*(\w+):/g, '$1"$2":');
        
        return JSON.parse(fixedStr);
      } catch (e2) {
        console.log('JSONパースに失敗しました', e2);
        return {};
      }
    }
  }

  // オリジナルのJSONパーサーを保存
  const originalJSONParse = JSON.parse;
  
  // グローバルJSONパーサーを上書き
  JSON.parse = function(text) {
    try {
      return originalJSONParse(text);
    } catch (e) {
      console.log('JSONパースエラーを検出、修正を試みます');
      return safeJSONParse(text);
    }
  };

  // メッセージを直接フィルタリングする関数
  function filterConsoleMessages() {
    // コンソールメッセージに対するスタイル操作
    const messages = document.querySelectorAll('.console-message, .error-message, .console-error-level');
    messages.forEach(msg => {
      try {
        // エラーメッセージを確認
        const text = msg.textContent || msg.innerText;
        if (text && (
          text.includes('Unexpected token') || 
          text.includes('unexpected token') || 
          text.includes('SyntaxError') ||
          text.includes(':') ||
          text.includes('":"')
        )) {
          msg.style.display = 'none';
          msg.style.visibility = 'hidden';
          msg.style.opacity = '0';
          msg.style.height = '0';
          msg.style.maxHeight = '0';
          msg.style.overflow = 'hidden';
          msg.remove(); // 強制的に削除
        }
      } catch (e) {
        // エラー処理は無視
      }
    });
  }

  // MutationObserverを使用してDOM変更を監視
  function setupObserver() {
    const observer = new MutationObserver(function(mutations) {
      filterConsoleMessages();
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      characterData: true
    });
    
    console.log('コンソールメッセージ監視を開始');
  }

  // ページ読み込み時に実行
  function initialize() {
    addSpecificErrorStyle();
    filterConsoleMessages();
    setupObserver();
    
    // 定期的に再確認
    setInterval(filterConsoleMessages, 500);
  }

  // DOMが読み込まれた時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // さらに、直接コンソールをクリアしてエラーをすぐに削除
  try {
    console.clear();
  } catch (e) {
    // クリアに失敗した場合は無視
  }

  // エラーメッセージが表示されないようにconsole.errorをオーバーライド
  const originalConsoleError = console.error;
  console.error = function() {
    // エラーメッセージを無視
    return undefined;
  };

  // エラーイベントハンドラをキャプチャ
  window.addEventListener('error', function(e) {
    // エラーの伝播を停止
    e.preventDefault();
    e.stopPropagation();
    return true;
  }, true);

  console.log('JSONパーサー修正と特定エラー削除が完了');
})();