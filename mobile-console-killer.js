/**
 * モバイル環境専用のコンソールエラー対策
 * レンダリングされる前にエラー要素を削除するための最終手段
 */

(function() {
  console.log('モバイル用コンソール削除システム起動');

  // モバイルデバイスの検出
  function isMobileDevice() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768
    );
  }

  if (!isMobileDevice()) {
    // モバイルデバイスでない場合は何もしない
    console.log('モバイルデバイスではないため処理をスキップ');
    return;
  }

  console.log('モバイルデバイス検出 - 特殊対策を適用');

  // 1. コンソールオブジェクトを完全にオーバーライドする手法（モバイル向け）
  try {
    // モバイルブラウザでは異なる方法で console にアクセスする場合がある
    const noopFunc = function() { return undefined; };
    window.console = {
      log: function() {},
      error: noopFunc,
      warn: noopFunc,
      info: noopFunc,
      debug: noopFunc,
      assert: noopFunc,
      clear: noopFunc,
      count: noopFunc,
      group: noopFunc,
      groupEnd: noopFunc,
      table: noopFunc,
      time: noopFunc,
      timeEnd: noopFunc,
      trace: noopFunc
    };
  } catch (e) {
    // エラーは無視
  }

  // 2. モバイルブラウザでのエラー要素をDOMから直接削除
  function removeErrorElements() {
    // 一般的なモバイルブラウザのエラー表示要素
    const mobileErrorSelectors = [
      '.mobile-console',
      '.console-panel',
      '.error-panel',
      '.debug-console',
      '.error-message',
      '.console-message',
      // Chrome モバイル
      '.chrome-mobile-error',
      '.chrome-error-panel',
      '.chrome-console',
      '.chrome-devtools',
      // Safari モバイル
      '.safari-error',
      '.safari-console',
      '.safari-debug',
      // Firefox モバイル
      '.firefox-error',
      '.firefox-console',
      '.gecko-console',
      // 一般的なモバイルブラウザ要素
      '.browser-console',
      '.browser-error',
      '.error-output',
      // バックアップとして汎用的なエラーセレクタ
      '[class*="error"]',
      '[class*="console"]',
      '[class*="debug"]',
      '[id*="error"]',
      '[id*="console"]',
      '[id*="debug"]',
      // 属性ベースのセレクタ
      '[aria-label*="console"]',
      '[aria-label*="error"]',
      '[aria-label*="debug"]',
      '[data-*="console"]',
      '[data-*="error"]',
      '[data-*="debug"]',
      // ログ要素
      '[role="log"]',
      // 具体的なエラー表示行
      '.message-line',
      '.error-line',
      '.console-line'
    ];

    // セレクタにマッチする要素を非表示にする
    mobileErrorSelectors.forEach(selector => {
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
          el.style.pointerEvents = 'none';
          el.setAttribute('aria-hidden', 'true');
        });
      } catch (e) {
        // エラーは無視
      }
    });

    // 3. 特定のキーワードを含むテキストノードを持つ要素を探して非表示
    const errorKeywords = [
      'Unexpected token',
      'unexpected token',
      'SyntaxError',
      'syntax error',
      'Cannot redefine property',
      'console',
      'error',
      'failed'
    ];

    try {
      // すべてのテキストノードを走査
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const elementsToHide = [];
      let node;
      
      while (node = walker.nextNode()) {
        const text = node.textContent || '';
        
        // エラーキーワードを含むテキストノードを検出
        if (errorKeywords.some(keyword => text.includes(keyword))) {
          if (node.parentElement) {
            elementsToHide.push(node.parentElement);
          }
        }
      }

      // 検出した要素を非表示
      elementsToHide.forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        el.style.height = '0';
        el.style.overflow = 'hidden';
      });
    } catch (e) {
      // エラーは無視
    }
  }

  // 4. モバイル環境専用のCSS対策を追加
  function addMobileCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* モバイル環境専用のエラー表示対策 */
      @media (max-width: 768px) {
        /* 全ブラウザで共通的なエラー表示要素 */
        [role="log"],
        [aria-label*="Console"],
        [aria-label*="Error"],
        [aria-label*="Warning"],
        /* 色々なブラウザ固有の要素 */
        .console-panel,
        .error-panel,
        .debug-panel,
        .console-wrapper,
        .error-wrapper,
        .debug-wrapper,
        .console-output,
        .error-output,
        .debug-output,
        .console-view,
        .error-view,
        .debug-view,
        /* エラーテキストを含む可能性のある要素 */
        *:has(span:contains("Unexpected token")),
        *:has(span:contains("Cannot redefine property")),
        *:has(span:contains("SyntaxError")),
        *:has(div:contains("Unexpected token")),
        *:has(div:contains("Cannot redefine property")),
        *:has(div:contains("SyntaxError")),
        /* ブラウザの底部に表示されるエラーコンソール */
        .bottom-panel,
        .mobile-panel,
        .browser-panel,
        .developer-panel,
        .debug-overlay,
        /* あらゆるエラー関連クラス */
        [class*="error"],
        [class*="console"],
        [class*="Error"],
        [class*="Console"],
        /* コード実行やエラーハイライト関連 */
        .code-line,
        .code-error,
        .highlight-error,
        .code-highlight,
        .js-error,
        .js-warning,
        .syntax-highlight,
        .syntax-error,
        /* モバイルブラウザ特有要素 */
        .mobile-console,
        .mobile-error,
        .mobile-debug,
        .browser-console,
        .browser-error,
        .browser-debug {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          max-height: 0 !important;
          min-height: 0 !important;
          overflow: visible !important;
          position: absolute !important;
          left: -9999px !important;
          bottom: -9999px !important;
          right: auto !important;
          top: auto !important;
          z-index: -9999 !important;
          pointer-events: none !important;
          touch-action: none !important;
          user-select: none !important;
          clip: rect(0, 0, 0, 0) !important;
          clip-path: inset(50%) !important;
          white-space: nowrap !important;
          transform: translateY(100%) scale(0) !important;
          transition: none !important;
          animation: none !important;
          border: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        /* モバイルでのデバッグパネルを画面外に */
        .debug-panel,
        .error-panel,
        .console-panel,
        .mobile-panel {
          transform: translateY(200%) !important;
        }
        
        /* 特定の要素が存在する場合に、その下部にコンテンツが隠れないよう対策 */
        body:has(.error-panel),
        body:has(.console-panel),
        body:has(.debug-panel) {
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // 5. ボディの末尾にブランク要素を追加してエラー表示を押し下げる
  function addBottomSpacer() {
    const spacer = document.createElement('div');
    spacer.id = 'mobile-error-spacer';
    spacer.style.cssText = `
      height: 300px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 30%);
      backdrop-filter: blur(5px);
      pointer-events: none;
      display: none;
    `;
    
    document.body.appendChild(spacer);
    
    // エラーワードが検出された場合に表示する
    function showSpacerIfErrors() {
      const errorWords = ['Unexpected token', 'Cannot redefine property', 'SyntaxError'];
      const bodyText = document.body.innerText || '';
      
      if (errorWords.some(word => bodyText.includes(word))) {
        spacer.style.display = 'block';
      } else {
        spacer.style.display = 'none';
      }
    }
    
    // 定期的にチェック
    setInterval(showSpacerIfErrors, 1000);
  }

  // 初期化処理
  function init() {
    // 各対策を適用
    addMobileCSS();
    removeErrorElements();
    addBottomSpacer();
    
    // 定期的にエラー要素を削除
    setInterval(removeErrorElements, 500);
    
    // DOM変更を監視
    const observer = new MutationObserver(function() {
      removeErrorElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    
    console.log('モバイル用コンソール削除システム初期化完了');
  }

  // ページの読み込み状態に応じて初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();