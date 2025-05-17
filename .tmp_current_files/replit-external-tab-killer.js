/**
 * Replit Preview プレビュータブの"Loading your page"を無効化するための外部スクリプト
 * このスクリプトはindex.htmlのhead内に埋め込み、
 * 最優先で実行されるようにします
 */

// 即時実行関数として実行
(function() {
  // 現在実行中のウィンドウがiframe内かチェック
  function isInIframe() {
    try {
      return window !== window.top;
    } catch (e) {
      return true;
    }
  }

  // すぐに実行するタブ修正処理
  function fixLoadingTab() {
    try {
      // まず親フレームがアクセス可能か確認
      if (window.parent && window.parent.document) {
        // ログ
        console.log('外部タブキラー: 親フレームにアクセス');
        
        // すべての要素をチェック
        const elements = window.parent.document.querySelectorAll('*');
        let foundLoadingTab = false;
        
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          
          try {
            // Loading your page... を含む要素を見つける
            if (el.textContent && el.textContent.includes('Loading your page')) {
              foundLoadingTab = true;
              
              // 要素を非表示
              el.style.display = 'none';
              el.style.visibility = 'hidden';
              
              // 親要素も同様に非表示
              let parentEl = el.parentElement;
              let depth = 0;
              
              while (parentEl && depth < 5) {
                parentEl.style.display = 'none';
                depth++;
                parentEl = parentEl.parentElement;
              }
              
              console.log('外部タブキラー: Loading your pageタブを非表示');
            }
            
            // ロール="status"の要素も非表示
            if (el.getAttribute && el.getAttribute('role') === 'status') {
              el.style.display = 'none';
              console.log('外部タブキラー: [role="status"]要素を非表示');
            }
          } catch (err) {
            // 個別要素の処理エラーは無視
          }
        }
        
        // CSSを注入してすべてのローディング要素を隠す
        try {
          const style = document.createElement('style');
          style.textContent = `
            div[role="status"],
            div:has(> [role="status"]),
            [aria-busy="true"],
            [aria-label*="Loading"],
            [class*="loading"],
            [id*="loading"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
            }
          `;
          window.parent.document.head.appendChild(style);
          console.log('外部タブキラー: CSSインジェクション成功');
        } catch (cssErr) {
          console.log('外部タブキラー: CSSインジェクションエラー', cssErr);
        }
        
        return foundLoadingTab;
      }
    } catch (e) {
      console.log('外部タブキラー: エラー', e);
      return false;
    }
    
    return false;
  }
  
  // Replit Preview パネル内で実行されているかをチェック
  if (isInIframe()) {
    console.log('外部タブキラー: iframeで実行中');
    
    // すぐに実行
    const result = fixLoadingTab();
    
    // 周期的に実行
    const interval = setInterval(function() {
      fixLoadingTab();
    }, 500);
    
    // ウィンドウ読み込み完了時にも実行
    window.addEventListener('load', function() {
      fixLoadingTab();
    });
  }
})();