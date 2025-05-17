/**
 * Replit Preview 修正スクリプト
 * Replitのプレビューパネルでの読み込み問題を解決
 */
(function() {
  // このスクリプトが外部サイトにデプロイされた場合は実行しない
  if (!window.location.hostname.includes('replit') && 
      !window.location.hostname.includes('repl.co')) {
    return;
  }
  
  console.log('Replit Preview パネル修正を実行中');
  
  // プレビューパネルの問題に対応するCSS
  const style = document.createElement('style');
  style.innerHTML = `
    /* プレビューローディングの修正 */
    [role="status"]#status-message,
    [role="status"].loading-indicator,
    div[role="status"],
    #loading-indicator,
    #preview-loading {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }
    
    /* プレビューフレームの調整 */
    iframe {
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
    }
    
    /* プレビューパネルの内部コンテンツを表示 */
    iframe body {
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
    }
    
    /* "Loading your page..."メッセージとその親要素の削除 */
    div:has(> span:contains("Loading your page")) {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(style);
  
  // 外部に関数をエクスポートしてコンソールから呼び出せるようにする
  window.__fixReplitPreview = function() {
    // Replitのプレビューパネルのローディング要素を探索して削除
    try {
      // 直接のDOM要素を検索
      const loadingElements = document.querySelectorAll('[role="status"], #status-message, .loading-indicator');
      loadingElements.forEach(function(element) {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.remove();
      });
      
      // プレビューiframeを取得
      const previewFrames = document.querySelectorAll('iframe[title="Preview"], iframe[name="Preview"], iframe[id="Preview"], iframe[src*="run"]');
      previewFrames.forEach(function(frame) {
        // フレームのスタイル調整
        frame.style.display = 'block';
        frame.style.visibility = 'visible';
        frame.style.opacity = '1';
        
        // iframe内のコンテンツにアクセス（可能な場合）
        try {
          const frameDocument = frame.contentDocument || frame.contentWindow.document;
          
          // iframe内のローディング要素を削除
          const frameLoaders = frameDocument.querySelectorAll('[role="status"], #loading, .loading, .spinner');
          frameLoaders.forEach(function(loader) {
            loader.style.display = 'none';
            loader.style.visibility = 'hidden';
            loader.remove();
          });
          
          // コンテンツを表示
          frameDocument.body.style.display = 'block';
          frameDocument.body.style.visibility = 'visible';
          frameDocument.body.style.opacity = '1';
        } catch (e) {
          // クロスオリジンエラーなどで失敗した場合は無視
          console.log('iframe内のコンテンツにアクセスできません（セキュリティ制限）');
        }
      });
      
      // テキストノードを走査して「Loading your page...」を含む要素を検索
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.includes('Loading your page')) {
          // 最大5階層上まで遡って親要素を非表示
          let parent = node.parentElement;
          let depth = 0;
          while (parent && depth < 5) {
            parent.style.display = 'none';
            parent.style.visibility = 'hidden';
            parent = parent.parentElement;
            depth++;
          }
        }
      }
    } catch (e) {
      console.log('Replit Preview パネル修正中にエラーが発生しました:', e);
    }
  };
  
  // 即時実行
  window.__fixReplitPreview();
  
  // ページロード完了時にも実行
  window.addEventListener('load', window.__fixReplitPreview);
  
  // DOMが変更されたときにも実行
  const observer = new MutationObserver(function(mutations) {
    // Loading要素が追加された可能性があるため再実行
    window.__fixReplitPreview();
  });
  
  // body全体を監視
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 定期的に実行して確実に対応
  setInterval(window.__fixReplitPreview, 1000);
})();