/**
 * ローディング状態を強制的に終了させる緊急スクリプト
 * ページの読み込みが完了しない場合に強制的に表示を行う
 */
(function() {
  // 即時実行部分
  console.log('ローディング強制終了スクリプトを実行');
  
  // グローバルにアクセス可能なフラグを設定
  window.__forceLoadingComplete = true;
  
  // 強制的にローディング画面を削除
  forceRemoveLoadingScreen();
  
  // 一定間隔でローディング画面をチェック
  setInterval(forceRemoveLoadingScreen, 500);
  
  // ページロード完了時にも実行
  window.addEventListener('load', forceRemoveLoadingScreen);
  window.addEventListener('DOMContentLoaded', forceRemoveLoadingScreen);
  
  /**
   * ローディング画面を強制的に削除
   */
  function forceRemoveLoadingScreen() {
    // 一般的なローディングインジケーターを検索して削除
    const loadingElements = document.querySelectorAll(
      '.loading, .loading-screen, .loader, #loading, .spinner, .spinner-border, .spinner-grow, ' +
      '[role="progressbar"], [class*="loading"], [id*="loading"], [class*="spinner"], ' +
      '[class*="progress"], [class*="overlay"], .modal-backdrop, .loading-overlay'
    );
    
    loadingElements.forEach(function(element) {
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      element.style.zIndex = '-9999';
      
      // アニメーションも停止
      element.style.animation = 'none';
      element.style.webkitAnimation = 'none';
      
      // 可能であれば要素を削除
      try {
        element.remove();
      } catch (e) {
        // 削除できない場合は非表示のままでOK
      }
    });
    
    // ページコンテンツを表示
    document.body.style.display = 'block';
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    // もしbodyに直接スタイルが効かない場合、子要素を表示
    const mainContainers = document.querySelectorAll(
      'main, .container, .content, #content, #main, .main-content, .page-content, .app'
    );
    
    mainContainers.forEach(function(container) {
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.opacity = '1';
    });
    
    // 先頭画面のプリロードスクリーンを対象
    const preloaders = document.querySelectorAll(
      '.preloader, #preloader, .loading-page, .loading-view, .loading-container, .loading-wrapper'
    );
    
    preloaders.forEach(function(preloader) {
      preloader.style.display = 'none';
      preloader.style.visibility = 'hidden';
      try {
        preloader.remove();
      } catch (e) {
        // 削除できない場合は非表示のままでOK
      }
    });
    
    // スクロールの復元
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.height = '';
    document.body.style.width = '';
    
    // オーバーレイの削除
    const overlays = document.querySelectorAll('.overlay, .modal-backdrop, .dialog-backdrop');
    overlays.forEach(function(overlay) {
      overlay.style.display = 'none';
      overlay.style.visibility = 'hidden';
      try {
        overlay.remove();
      } catch (e) {
        // 削除できない場合は非表示のままでOK
      }
    });
    
    // モーダル関連のクラスをbodyから削除
    document.body.classList.remove('modal-open');
    document.body.classList.remove('overflow-hidden');
    
    // loading要素がプレビューパネルにある場合（Replit固有）
    const previewFrames = document.querySelectorAll('iframe');
    previewFrames.forEach(function(frame) {
      try {
        // iframeの内部にアクセス
        const frameDocument = frame.contentDocument || frame.contentWindow.document;
        const frameLoaders = frameDocument.querySelectorAll('.loading, #loading, .spinner');
        
        frameLoaders.forEach(function(loader) {
          loader.style.display = 'none';
          loader.style.visibility = 'hidden';
        });
        
        // iframe内のbodyを表示
        frameDocument.body.style.display = 'block';
        frameDocument.body.style.visibility = 'visible';
      } catch (e) {
        // クロスオリジンエラーなどで失敗した場合は無視
      }
    });
    
    // "Loading your page..."という特定のテキストを持つ要素を検索
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.includes('Loading') || 
          node.textContent.includes('loading') ||
          node.textContent.includes('読み込み中')) {
        textNodes.push(node);
      }
    }
    
    // テキストノードの親要素を非表示
    textNodes.forEach(function(textNode) {
      let parent = textNode.parentElement;
      // 親要素を最大5階層まで遡って非表示
      for (let i = 0; i < 5 && parent; i++) {
        parent.style.display = 'none';
        parent.style.visibility = 'hidden';
        parent = parent.parentElement;
      }
    });
    
    // iframe内の特定ローディング要素への対応（Replit固有）
    try {
      const replitLoading = document.querySelector('iframe[title="Preview"]');
      if (replitLoading) {
        const replitDoc = replitLoading.contentDocument || replitLoading.contentWindow.document;
        const loadingElements = replitDoc.querySelectorAll('div[role="status"], div:contains("Loading your page")');
        loadingElements.forEach(el => el.style.display = 'none');
      }
    } catch (e) {
      // クロスオリジンでアクセスできない場合は無視
    }
  }
  
  // 即時実行
  forceRemoveLoadingScreen();
  
  // スクリプトタグの代替ハンドラを設定
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    // script要素の場合、ロード失敗をハンドリング
    if (tagName.toLowerCase() === 'script') {
      element.addEventListener('error', function(e) {
        console.log('スクリプトロードエラーを検出、ページ表示を強制します');
        setTimeout(forceRemoveLoadingScreen, 0);
      });
      
      // 元のonloadも保持しつつ、追加のアクションを実行
      const originalOnload = element.onload;
      element.onload = function(e) {
        if (originalOnload) {
          originalOnload.call(this, e);
        }
        // スクリプト読み込み完了後にもチェック
        setTimeout(forceRemoveLoadingScreen, 100);
      };
    }
    
    return element;
  };
  
  // ユーザーインタラクションが発生した時点でもローディングを強制終了
  const userEvents = ['click', 'touchstart', 'keydown', 'mousedown'];
  userEvents.forEach(function(eventType) {
    document.addEventListener(eventType, function() {
      forceRemoveLoadingScreen();
    }, { once: true, passive: true });
  });
})();