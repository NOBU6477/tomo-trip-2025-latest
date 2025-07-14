/**
 * 直接ロード修正スクリプト
 * iframeを検出して新しいタブで直接開くことでReplitの問題を回避
 */

(function() {
  console.log('Direct-load-fix: 初期化');
  
  // フレーム内かどうかを検出
  function isInsideFrame() {
    try {
      return window !== window.top;
    } catch (e) {
      return true; // クロスオリジンエラーが出る場合はフレーム内と判断
    }
  }
  
  // URLパラメータをチェック
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  
  // 新しいタブで自分自身を開く機能
  function openInNewTab() {
    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('direct_tab', 'true');
      
      console.log('新しいタブで開いています:', currentUrl.toString());
      window.open(currentUrl.toString(), '_blank');
    } catch (e) {
      console.error('新しいタブを開く際のエラー:', e);
    }
  }
  
  // シンプルモードにリダイレクト
  function redirectToSimpleMode() {
    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('mode', 'simple');
      
      console.log('シンプルモードにリダイレクト:', currentUrl.toString());
      window.location.href = currentUrl.toString();
    } catch (e) {
      console.error('シンプルモードリダイレクトエラー:', e);
      // 失敗したらクエリパラメータなしでシンプルに
      window.location.href = window.location.pathname + '?mode=simple';
    }
  }
  
  // 緊急ページにリダイレクト
  function redirectToEmergencyPage() {
    const emergencyUrl = window.location.origin + '/emergency';
    console.log('緊急ページにリダイレクト:', emergencyUrl);
    window.location.href = emergencyUrl;
  }
  
  // 自動フィックスを実行
  function applyAutoFix() {
    if (isInsideFrame()) {
      // フレーム内で表示されている場合の処理
      
      // 直接タブパラメータがなければ、新しいタブで開く
      if (!getQueryParam('direct_tab') && !getQueryParam('no_redirect')) {
        console.log('フレーム内で表示されています。新しいタブで開きます...');
        openInNewTab();
        return;
      }
    }
    
    // ページのロード時間を監視
    let pageLoaded = false;
    
    window.addEventListener('load', function() {
      pageLoaded = true;
    });
    
    // ページが3秒経ってもロードされない場合、シンプルモードにリダイレクト
    setTimeout(function() {
      if (!pageLoaded) {
        console.log('ページのロードに時間がかかっています。シンプルモードを試みます...');
        redirectToSimpleMode();
      }
    }, 3000);
    
    // 5秒経っても問題が解決しない場合の緊急措置
    setTimeout(function() {
      if (!pageLoaded) {
        console.log('ページのロードに失敗しました。緊急モードにリダイレクトします...');
        redirectToEmergencyPage();
      }
    }, 5000);
  }
  
  // Replitのspinnerを監視して非表示にする強化版
  function trackAndHideReplitSpinner() {
    // spinner要素を探して非表示にする関数
    function findAndHideSpinners() {
      try {
        // 親フレームにアクセスを試みる
        const docs = [document];
        try {
          if (window.parent && window.parent !== window) {
            docs.push(window.parent.document);
          }
        } catch (e) {}
        
        for (const doc of docs) {
          // クラス名やrole属性でスピナーを検索
          const spinnerSelectors = [
            '[role="status"]',
            '.loading-screen',
            '.loading-indicator',
            '.loading-wrapper',
            '.spinner',
            '[class*="spinner"]',
            '[id*="spinner"]',
            '[class*="loading"]',
            '[id*="loading"]'
          ];
          
          spinnerSelectors.forEach(selector => {
            try {
              const elements = doc.querySelectorAll(selector);
              elements.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
              });
            } catch (e) {}
          });
          
          // テキストでスピナーを検索
          const spinnerTexts = [
            'Loading your page',
            'Loading your repl',
            'loading'
          ];
          
          // すべての要素をループしてテキストを確認
          const allElements = doc.querySelectorAll('*');
          allElements.forEach(el => {
            try {
              if (el.textContent) {
                for (const text of spinnerTexts) {
                  if (el.textContent.toLowerCase().includes(text.toLowerCase())) {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                    
                    // 親要素も試す
                    let parent = el.parentElement;
                    let depth = 0;
                    while (parent && depth < 5) {
                      parent.style.display = 'none';
                      parent = parent.parentElement;
                      depth++;
                    }
                  }
                }
              }
            } catch (e) {}
          });
        }
      } catch (e) {
        console.error('スピナー非表示エラー:', e);
      }
    }
    
    // ページロード時に実行
    findAndHideSpinners();
    
    // 定期的に実行
    setInterval(findAndHideSpinners, 500);
    
    // ページ完全ロード時にも実行
    window.addEventListener('load', findAndHideSpinners);
    
    // スタイルで強制的に非表示
    try {
      const style = document.createElement('style');
      style.textContent = `
        [role="status"], .loading, .spinner,
        [class*="spinner"], [class*="loading"],
        [id*="spinner"], [id*="loading"],
        div[aria-busy="true"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
      
      try {
        if (window.parent && window.parent.document) {
          window.parent.document.head.appendChild(style.cloneNode(true));
        }
      } catch (e) {}
    } catch (e) {}
  }
  
  // メインとなる実行部分
  function initialize() {
    // Replitスピナーを非表示にするスタイルを追加
    trackAndHideReplitSpinner();
    
    // 自動フィックスを実行
    applyAutoFix();
    
    // パラメータにdebugが含まれる場合のみコンソールに詳細情報を表示
    if (getQueryParam('debug')) {
      console.log('ページ情報:', {
        url: window.location.href,
        isFrame: isInsideFrame(),
        userAgent: navigator.userAgent,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      });
    }
  }
  
  // 初期化実行
  initialize();
  
  console.log('Direct-load-fix: 初期化完了');
})();