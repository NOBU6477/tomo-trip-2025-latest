/**
 * Replit スピンキラー
 * Replit プレビューパネルのスピナーと読み込み表示を完全に無効化します
 */

(function() {
  console.log('ローディング強制終了スクリプトを実行');
  
  // タイマーIDを管理
  var timerIds = [];

  // すべてのスピナー要素を見つけて削除または非表示にする
  function killSpinners() {
    try {
      // spinner クラスを持つすべての要素を非表示
      var spinners = document.querySelectorAll('.spinner, .loading, [role="progressbar"], [aria-busy="true"]');
      for (var i = 0; i < spinners.length; i++) {
        var spinner = spinners[i];
        if (spinner && spinner.style) {
          spinner.style.display = 'none';
          spinner.style.visibility = 'hidden';
          spinner.style.opacity = '0';
          spinner.style.animation = 'none';
          spinner.style.webkitAnimation = 'none';
          
          // 可能であれば要素を削除
          if (spinner.parentNode) {
            try {
              spinner.parentNode.removeChild(spinner);
            } catch (e) {
              // 削除できない場合は無視
            }
          }
        }
      }
      
      // iframe内の「Loading your page」テキストを削除
      var loadingElements = document.querySelectorAll('*');
      for (var i = 0; i < loadingElements.length; i++) {
        var el = loadingElements[i];
        if (el.textContent && (
            el.textContent.includes('Loading your page') || 
            el.textContent.includes('Loading') ||
            el.textContent.includes('読み込み中'))) {
          el.style.display = 'none';
          el.textContent = '';
        }
      }
      
      // Replitプレビューインジケータを強制的に消す
      forceHideLoadingIndicator();
      
      // iframe内のbodyを確実に表示
      var bodies = document.querySelectorAll('body');
      for (var i = 0; i < bodies.length; i++) {
        bodies[i].style.visibility = 'visible';
        bodies[i].style.display = 'block';
        bodies[i].style.opacity = '1';
      }
    } catch (e) {
      console.error('スピナー削除中にエラー:', e);
    }
  }
  
  // Replit固有のプレビューインジケータを強制的に非表示
  function forceHideLoadingIndicator() {
    try {
      var styles = `
        /* すべてのスピナーを非表示 */
        .spinner, .loading, .loader, 
        [role="progressbar"], [aria-busy="true"],
        *[class*="spinner"], *[class*="loading"],
        *[id*="spinner"], *[id*="loading"],
        .progress, .progress-bar {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          animation: none !important;
          -webkit-animation: none !important;
          background-image: none !important;
        }
        
        /* Replit特有の要素を非表示 */
        .replit-ui-theme-root .loading-indicator,
        .jsx-2504940298,
        .jsx-467725132,
        div[aria-label="ローディング"],
        div[aria-label="Loading"] {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* iframe内のbodyを必ず表示 */
        body {
          visibility: visible !important;
          display: block !important;
          opacity: 1 !important;
        }
      `;
      
      var styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.innerHTML = styles;
      
      // スタイル要素が既に存在するか確認
      var existingStyle = document.getElementById('replit-spin-killer-styles');
      if (existingStyle) {
        existingStyle.innerHTML = styles;
      } else {
        styleElement.id = 'replit-spin-killer-styles';
        document.head.appendChild(styleElement);
      }
      
      // Replit UI TreeWalkerを使ってローディング要素を検索し削除
      if (document.createTreeWalker) {
        try {
          var treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            { 
              acceptNode: function(node) { 
                // クラス名やテキストでローディング要素を判定
                var classList = node.className || '';
                var innerText = node.innerText || '';
                
                if (
                  (typeof classList === 'string' && 
                   (classList.includes('spinner') || 
                    classList.includes('loading') ||
                    classList.includes('progress') ||
                    classList.includes('jsx-'))) ||
                  (typeof innerText === 'string' && 
                   (innerText.includes('Loading') || 
                    innerText.includes('読み込み中')))
                ) {
                  return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
              }
            },
            false
          );
          
          var currentNode;
          // ツリーを巡回して該当要素を非表示
          while(currentNode = treeWalker.nextNode()) {
            currentNode.style.display = 'none';
            currentNode.style.visibility = 'hidden';
            currentNode.style.opacity = '0';
          }
        } catch (e) {
          console.log('Replit Preview パネル修正中にエラーが発生しました:', e);
        }
      }
    } catch (e) {
      console.error('ローディングインジケータ非表示化中にエラー:', e);
    }
  }
  
  // iframe内を処理
  function processIframes() {
    try {
      var iframes = document.querySelectorAll('iframe');
      
      for (var i = 0; i < iframes.length; i++) {
        try {
          var iframe = iframes[i];
          var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          
          // iframe内のすべてのスピナーを削除
          var spinners = iframeDoc.querySelectorAll('.spinner, .loading, [role="progressbar"], [aria-busy="true"]');
          for (var j = 0; j < spinners.length; j++) {
            var spinner = spinners[j];
            spinner.style.display = 'none';
            spinner.style.visibility = 'hidden';
            spinner.style.opacity = '0';
          }
          
          // iframe内のbodyを確実に表示
          var body = iframeDoc.body;
          if (body) {
            body.style.visibility = 'visible';
            body.style.display = 'block';
            body.style.opacity = '1';
          }
          
          // iframe内のスタイルを注入
          var style = iframeDoc.createElement('style');
          style.type = 'text/css';
          style.innerHTML = `
            .spinner, .loading, .loader, [role="progressbar"], [aria-busy="true"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
            }
            body {
              visibility: visible !important;
              display: block !important;
              opacity: 1 !important;
            }
          `;
          iframeDoc.head.appendChild(style);
        } catch (e) {
          // クロスオリジンエラーは無視
        }
      }
    } catch (e) {
      console.error('iframe処理中にエラー:', e);
    }
  }
  
  // Replitプレビュースピナー対策のためのCSS注入
  function injectReplitSpecificFixes() {
    try {
      // CSSSelectorを使った確実な非表示
      var styleElement = document.createElement('style');
      styleElement.textContent = `
        /* Replitプレビュースペース内のローディング要素を完全に削除 */
        div[aria-label="Preview"], div[data-cy="preview-container"] {
          .loading-placeholder, 
          .jsx-2504940298, 
          .jsx-467725132, 
          iframe:not([src]), 
          [role="progressbar"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            transform: scale(0) !important;
          }
          
          /* Replitプレビューのテキスト「Loading your page」を隠す */
          div:has(p:contains("Loading")), 
          div:has(p:contains("loading")),
          div:has(p:contains("読み込み中")) {
            display: none !important;
          }
        }
        
        /* プレビューエリアを強制表示 */
        iframe {
          visibility: visible !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(styleElement);
      
    } catch (e) {
      console.error('Replit固有修正中にエラー:', e);
    }
  }
  
  // 強制的にページをレンダリング
  function forceRender() {
    try {
      // スピナーを非表示
      killSpinners();
      
      // iframeを処理
      processIframes();
      
      // すべてのonloadイベントを直接呼び出し
      if (window.onload) {
        try {
          window.onload();
        } catch (e) {}
      }
      
      // すべての画像の読み込みを完了としてマーク
      var images = document.querySelectorAll('img');
      for (var i = 0; i < images.length; i++) {
        try {
          var event = new Event('load');
          images[i].dispatchEvent(event);
        } catch (e) {}
      }
      
      // DOMContentLoadedとloadイベントを発火
      try {
        var domContentLoaded = new Event('DOMContentLoaded');
        document.dispatchEvent(domContentLoaded);
        
        var loadEvent = new Event('load');
        window.dispatchEvent(loadEvent);
      } catch (e) {}
    } catch (e) {
      console.error('レンダリング強制中にエラー:', e);
    }
  }
  
  // スタートアップ時にスピナー非表示
  function startup() {
    // 複数回実行を避ける
    if (window.__spinKillerInitialized) return;
    window.__spinKillerInitialized = true;
    
    console.log('スピンキラー: 起動');
    
    // Replit固有の修正を注入
    injectReplitSpecificFixes();
    
    // ローディング画面を即座に隠す
    killSpinners();
    forceRender();
    
    // 定期的に実行
    timerIds.push(setInterval(killSpinners, 100));
    timerIds.push(setInterval(processIframes, 500));
    
    // 新しいiframeをチェック
    var observer = new MutationObserver(function(mutations) {
      killSpinners();
      processIframes();
    });
    
    // body全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // ページ読み込み後にも実行
    window.addEventListener('load', function() {
      forceRender();
      
      // 少し遅らせて再度実行 (遅延ロードコンテンツ対策)
      setTimeout(forceRender, 500);
      setTimeout(forceRender, 1000);
      setTimeout(forceRender, 2000);
    });
    
    console.log('スピンキラー: セットアップ完了');
  }
  
  // 実行
  startup();
  
  // 2秒後に再度実行（確実にするため）
  setTimeout(startup, 2000);
})();