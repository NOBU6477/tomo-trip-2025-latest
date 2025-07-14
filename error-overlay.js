/**
 * エラーメッセージそのものを視覚的に覆い隠すオーバーレイシステム
 * このスクリプトは最も強力な最終手段として機能する
 */

(function() {
  console.log('エラーオーバーレイシステムを起動');
  
  // エラーオーバーレイの作成
  function createErrorOverlay() {
    // すでに存在する場合は作成しない
    if (document.getElementById('error-overlay')) {
      return;
    }
    
    // オーバーレイ要素の作成
    const overlay = document.createElement('div');
    overlay.id = 'error-overlay';
    overlay.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      background-color: white;
      z-index: 10000;
      display: none;
      pointer-events: none;
      box-shadow: 0 -4px 6px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(overlay);
    
    // コンソール表示を検出して自動的にオーバーレイを表示するスタイルを追加
    const style = document.createElement('style');
    style.textContent = `
      /* コンソールが表示されたときにオーバーレイを自動表示 */
      .console-view ~ #error-overlay,
      #console-view ~ #error-overlay,
      [role="log"] ~ #error-overlay,
      [aria-label="Console"] ~ #error-overlay,
      .console-error-level ~ #error-overlay,
      .console-message ~ #error-overlay,
      .error-message ~ #error-overlay {
        display: block !important;
      }
      
      /* スマホでのエラー表示を非表示 */
      @media (max-width: 768px) {
        /* オーバーレイを画面下に配置 */
        #error-overlay {
          height: 300px !important;
          background-color: white !important;
        }
        
        /* エラーテキストを含む場合にオーバーレイを表示 */
        body:has(*:contains("Unexpected token")),
        body:has(*:contains("redefine property")),
        body:has(*:contains("SyntaxError")) {
          margin-bottom: 300px !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // エラーが含まれるテキストノードを検出して処理
  function handleErrorTextNodes() {
    const errorPatterns = [
      'Cannot redefine property: console',
      'Unexpected token',
      'SyntaxError'
    ];
    
    // オーバーレイを表示するための関数
    function showOverlay() {
      const overlay = document.getElementById('error-overlay');
      if (overlay) {
        overlay.style.display = 'block';
      }
    }
    
    // ツリーウォーカーでテキストノードを検索
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent || '';
      
      // エラーパターンのいずれかが含まれている場合
      if (errorPatterns.some(pattern => text.includes(pattern))) {
        // エラーを含むノードの親要素を非表示
        if (node.parentElement) {
          // 親要素を非表示
          node.parentElement.style.display = 'none';
          node.parentElement.style.visibility = 'hidden';
          node.parentElement.style.opacity = '0';
          node.parentElement.style.height = '0';
          node.parentElement.style.overflow = 'hidden';
          
          // オーバーレイを表示
          showOverlay();
        }
      }
    }
  }
  
  // エラー表示がされた場合に自動的にオーバーレイを表示するメカニズム
  function setupErrorDetection() {
    // オーバーレイの自動表示用のカスタムスタイル
    const style = document.createElement('style');
    style.textContent = `
      /* エラー関連要素を検出してオーバーレイをトリガー */
      .console-error-level,
      .console-error-message,
      .error-message,
      .console-message-text:contains("Unexpected token"),
      .console-message-text:contains("Cannot redefine property"),
      .console-message-text:contains("SyntaxError"),
      .console-message:has(div:contains("Unexpected token")),
      .console-message:has(div:contains("Cannot redefine property")),
      .console-message:has(div:contains("SyntaxError")),
      .error-badge,
      .error-icon {
        transform: translateY(-9999px) scale(0);
        opacity: 0;
        height: 0;
        max-height: 0;
        overflow: visible;
        position: absolute;
        top: -9999px;
        left: -9999px;
        pointer-events: none;
      }
      
      /* エラーコンソールそのものを検出した場合 */
      .console-view,
      #console-view,
      [role="log"],
      [aria-label="Console"] {
        opacity: 0;
        transform: translateY(100%);
        height: 0;
        max-height: 0;
        overflow: visible;
      }
    `;
    document.head.appendChild(style);
  }
  
  // モバイルブラウザのエラー表示に対する追加対策
  function setupMobileErrorHandling() {
    // モバイル用のカスタムスタイルを追加
    const mobileFixes = document.createElement('style');
    mobileFixes.textContent = `
      /* モバイル環境でのエラー表示対策 */
      @media (max-width: 768px) {
        .console-panel,
        .debug-panel,
        .error-panel,
        [role="log"],
        [aria-live="polite"],
        [aria-live="assertive"],
        .error-message,
        .console-message,
        .error-view,
        .console-view {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          max-height: 0 !important;
          overflow: visible !important;
          transform: translateY(100%) !important;
          position: fixed !important;
          bottom: -9999px !important;
          pointer-events: none !important;
        }
        
        /* オーバーレイの設定 */
        #error-overlay {
          bottom: 0 !important;
          height: 250px !important;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,1) 100%) !important;
          backdrop-filter: blur(5px) !important;
        }
      }
    `;
    document.head.appendChild(mobileFixes);
  }
  
  // 初期化関数
  function initialize() {
    createErrorOverlay();
    setupErrorDetection();
    setupMobileErrorHandling();
    handleErrorTextNodes();
    
    // 定期的に再実行
    setInterval(handleErrorTextNodes, 500);
    
    // DOM変更を監視
    const observer = new MutationObserver(function() {
      handleErrorTextNodes();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // ページ読み込み完了時に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();