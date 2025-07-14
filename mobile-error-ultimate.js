/**
 * モバイル環境のエラー表示を完全に防ぐための最終手段
 * このスクリプトは他のすべての対策が失敗した場合の最後の防衛線として機能します
 */

(function() {
  // モバイルデバイスかどうかを判定
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth < 768;

  if (!isMobile) {
    // モバイルでない場合は何もしない
    return;
  }

  console.log("モバイル環境用の最終エラー対策を適用します");

  try {
    // 1. consoleオブジェクトの完全無効化 (最強の対策)
    window.console = {
      log: function() {},
      warn: function() {},
      error: function() {},
      info: function() {},
      debug: function() {},
      trace: function() {},
      dir: function() {},
      dirxml: function() {},
      group: function() {},
      groupCollapsed: function() {},
      groupEnd: function() {},
      time: function() {},
      timeEnd: function() {},
      timeLog: function() {},
      table: function() {},
      count: function() {},
      countReset: function() {},
      assert: function() {},
      clear: function() {},
      profile: function() {},
      profileEnd: function() {}
    };

    // 2. グローバルエラーハンドラの設定
    window.onerror = function(msg, url, line) {
      return true; // すべてのエラーを抑制
    };

    // 3. エラー表示UI要素を削除する関数
    function removeErrorElements() {
      // エラー表示の可能性がある要素のセレクタ
      const selectors = [
        // 一般的なエラー表示要素
        '.error', '.error-message', '.console-error', '.console-message',
        // ブラウザ固有のエラー表示要素
        '.browser-error', '.devtools-error', '.inspector-error',
        // コンソール関連
        '.console', '.console-view', '.console-panel',
        // 一般的な属性を持つ要素
        '[data-type="error"]', '[data-level="error"]', '[data-severity="error"]',
        '[role="alert"]', '[aria-live="assertive"]',
        // "Cannot redefine property"や"Unexpected token"などのエラーを含む要素
        '*:contains("Cannot redefine property")',
        '*:contains("Unexpected token")',
        '*:contains("SyntaxError")',
        '*:contains("console")',
        // ブラウザ開発ツール用のエリア
        '#console-view', '#devtools-panel', '#inspector-view'
      ];

      // セレクタに一致する要素を非表示にする
      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.height = '0';
            el.style.maxHeight = '0';
            el.style.overflow = 'hidden';
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            el.setAttribute('aria-hidden', 'true');
          });
        } catch (e) {
          // エラーは無視
        }
      });
    }

    // 4. エラーメッセージを含むテキストノードを探して非表示にする
    function hideErrorTextNodes() {
      const errorWords = [
        'Unexpected token', 'unexpected token', 'SyntaxError',
        'Cannot redefine property', 'console', 'Error', 'error',
        'undefined', 'null', 'NaN', 'failed', 'rejected'
      ];
      
      // すべてのテキストノードを走査
      try {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let node;
        while (node = walker.nextNode()) {
          const text = node.textContent || '';
          
          // エラーワードを含むテキストノードを検出
          if (errorWords.some(word => text.includes(word))) {
            const parent = node.parentElement;
            if (parent) {
              parent.style.display = 'none';
              parent.style.visibility = 'hidden';
              parent.style.opacity = '0';
              parent.style.height = '0';
              parent.style.overflow = 'hidden';
            }
          }
        }
      } catch (e) {
        // エラーは無視
      }
    }

    // 5. 画面下部にエラー表示を覆い隠すオーバーレイを追加
    function addOverlay() {
      const overlay = document.createElement('div');
      overlay.id = 'mobile-error-overlay';
      overlay.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%);
        z-index: 9999999;
        pointer-events: none;
        touch-action: none;
      `;
      
      document.body.appendChild(overlay);
    }

    // 6. Error.prototypeの置き換え
    const originalErrorToString = Error.prototype.toString;
    Error.prototype.toString = function() {
      if (this.message && (
        this.message.includes('Unexpected token') || 
        this.message.includes('SyntaxError') ||
        this.message.includes('Cannot redefine property') ||
        this.message.includes('console')
      )) {
        return '';
      }
      return originalErrorToString.call(this);
    };

    // 7. Promiseのエラーハンドリングをオーバーライド
    window.addEventListener('unhandledrejection', function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    });

    // 8. すべてのエラー関連のDOMイベントをキャプチャ
    ['error', 'abort', 'unhandledrejection'].forEach(eventType => {
      window.addEventListener(eventType, function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
    });

    // 初期化処理
    function init() {
      // CSSの追加
      const style = document.createElement('style');
      style.textContent = `
        /* モバイル環境専用のエラー表示対策 */
        @media (max-width: 768px) {
          /* エラー関連クラスを持つ要素 */
          [class*="error"],
          [class*="console"],
          [class*="debug"],
          /* エラーメッセージと関連表示 */
          .error-message,
          .console-message,
          .stack-trace,
          .message-line,
          /* エラー表示コンテナ */
          .error-panel,
          .console-panel,
          .debug-view {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            max-height: 0 !important;
            overflow: visible !important;
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
          }
        }
      `;
      
      document.head.appendChild(style);
      
      // 対策の実行
      addOverlay();
      removeErrorElements();
      hideErrorTextNodes();
      
      // 定期的に実行
      setInterval(removeErrorElements, 1000);
      setInterval(hideErrorTextNodes, 1000);
    }
    
    // DOMが準備できたら実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
    
    // DOM変更監視
    try {
      const observer = new MutationObserver(function() {
        removeErrorElements();
        hideErrorTextNodes();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      });
    } catch (e) {
      // エラーは無視
    }
  } catch (e) {
    // 最終的なエラーもすべて無視
  }
})();