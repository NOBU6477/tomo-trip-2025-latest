/**
 * ドキュメントレディーハンドラー
 * ページ読み込み完了を安全に検知し、他のスクリプトよりも優先的に実行する
 */
(function() {
  // DOM読み込み完了状態を追跡する変数
  let isDomReady = false;
  let isPageReady = false;
  let pageLoadTime = new Date().getTime();
  
  // 最初に実行する緊急対策関数
  function initEmergencyMeasures() {
    // モバイル環境かどうかをチェック
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // パフォーマンスモニタリング開始
    startPerformanceMonitoring();
    
    // エラー処理をオーバーライド
    overrideErrorHandling();
    
    // コンソールオブジェクトを安全化
    safeConsole();
    
    // グローバルレスキュー機能をセットアップ
    setupGlobalRescue();
    
    // URLパラメータをチェック（debugモードなど）
    checkUrlParameters();
    
    // モバイル環境での追加対策
    if (isMobile) {
      setupMobileSpecificMeasures();
    }
  }
  
  // パフォーマンスモニタリング
  function startPerformanceMonitoring() {
    // ページの読み込み開始時間を記録
    window.__pageStartTime = pageLoadTime;
    
    // パフォーマンス問題の自動検出（15秒以上かかった場合）
    setTimeout(function() {
      if (!isPageReady) {
        console.log('ページの読み込みに時間がかかりすぎています。強制的に完了処理を実行します。');
        // 強制的に完了とみなして処理を実行
        executeReadyFunctions(true);
      }
    }, 15000);
  }
  
  // エラー処理のオーバーライド
  function overrideErrorHandling() {
    // 元のエラーハンドラを保存
    const originalOnError = window.onerror;
    
    // 新しいエラーハンドラを設定
    window.onerror = function(message, source, lineno, colno, error) {
      // エラーの重大度を判定
      const isCritical = isCriticalError(message, error);
      
      // 重大なエラーの場合、回復アクションを実行
      if (isCritical) {
        performRecoveryActions();
      }
      
      // 元のエラーハンドラを呼び出す（存在する場合）
      if (typeof originalOnError === 'function') {
        return originalOnError(message, source, lineno, colno, error);
      }
      
      // デフォルトのエラー処理を抑止
      return true;
    };
    
    // Promiseエラーのハンドリング
    window.addEventListener('unhandledrejection', function(event) {
      console.log('未処理のPromiseエラーを検出:', event.reason);
      event.preventDefault();
    });
  }
  
  // エラーの重大度を判定
  function isCriticalError(message, error) {
    if (!message) return false;
    
    // 重大なエラーキーワード
    const criticalKeywords = [
      'undefined is not an object',
      'null is not an object',
      'cannot read property',
      'is not a function',
      'maximum call stack',
      'out of memory',
      'script error',
      'security error',
      'quota exceeded'
    ];
    
    // いずれかのキーワードが含まれるか確認
    return criticalKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  // 回復アクションの実行
  function performRecoveryActions() {
    console.log('重大なエラーから回復するアクションを実行中...');
    
    // スクリプトの実行エラーに対応するため、残りのDOMコンテンツを強制的に表示
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    // ローディング表示を削除
    const loaders = document.querySelectorAll('.spinner, .loader, .loading');
    loaders.forEach(loader => {
      loader.style.display = 'none';
    });
    
    // 無効化されたボタンを再有効化
    const disabledButtons = document.querySelectorAll('button[disabled], input[disabled]');
    disabledButtons.forEach(button => {
      button.disabled = false;
    });
  }
  
  // コンソールオブジェクトの安全化
  function safeConsole() {
    // コンソールが存在しない環境対策
    if (typeof window.console === 'undefined') {
      window.console = {
        log: function() {},
        error: function() {},
        warn: function() {},
        info: function() {},
        debug: function() {}
      };
    }
    
    // コンソールメソッドの安全な呼び出しを確保
    ['log', 'error', 'warn', 'info', 'debug'].forEach(method => {
      const originalMethod = console[method];
      console[method] = function() {
        try {
          originalMethod.apply(console, arguments);
        } catch (e) {
          // コンソールエラーは無視
        }
      };
    });
  }
  
  // グローバルレスキュー機能のセットアップ
  function setupGlobalRescue() {
    // グローバルスコープにレスキュー関数を追加
    window.__rescuePage = function() {
      console.log('緊急ページレスキューを実行');
      performRecoveryActions();
      executeReadyFunctions(true);
    };
    
    // 5分間何も操作がなければ自動リセット
    setTimeout(function() {
      // ユーザーが操作していないか確認
      const now = new Date().getTime();
      if (now - window.__lastUserAction > 300000) { // 5分 = 300000ms
        window.__rescuePage();
      }
    }, 300000);
    
    // 最後のユーザーアクション時間を追跡
    window.__lastUserAction = new Date().getTime();
    ['click', 'touchstart', 'keydown', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, function() {
        window.__lastUserAction = new Date().getTime();
      }, { passive: true });
    });
  }
  
  // URLパラメータのチェック
  function checkUrlParameters() {
    // URLからパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    
    // デバッグモード確認
    const isDebugMode = urlParams.has('debug') || urlParams.has('dev');
    
    // 特殊モード処理
    if (isDebugMode) {
      console.log('デバッグモードで実行中');
      // デバッグ用のスタイルを適用
      const style = document.createElement('style');
      style.innerHTML = `
        .debug-visible {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // 強制モード（フォールバック）
    if (urlParams.has('force') || urlParams.has('fallback')) {
      console.log('強制モードで実行中');
      // ページ読み込みを強制的に完了とみなす
      setTimeout(function() {
        executeReadyFunctions(true);
      }, 1000);
    }
  }
  
  // モバイル環境での特別な対策
  function setupMobileSpecificMeasures() {
    // iOSのエラーダイアログ抑止
    window.addEventListener('error', function(e) {
      e.preventDefault();
      return true;
    }, true);
    
    // Androidの一部端末でのレンダリング問題対策
    const androidStyle = document.createElement('style');
    androidStyle.innerHTML = `
      * {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(androidStyle);
  }
  
  // DOMの準備完了時に実行する関数
  function onDomReady() {
    if (isDomReady) return; // 既に実行済みなら終了
    
    isDomReady = true;
    console.log('DOM準備完了');
    
    // DOMコンテンツを可視化
    document.documentElement.style.visibility = 'visible';
    
    // レディ関数を実行
    executeReadyFunctions();
  }
  
  // ページ完全読み込み時に実行する関数
  function onPageLoad() {
    if (isPageReady) return; // 既に実行済みなら終了
    
    isPageReady = true;
    console.log('ページ読み込み完了');
    
    // 読み込み完了時間を記録
    const loadTime = new Date().getTime() - pageLoadTime;
    console.log('ページ読み込み時間: ' + loadTime + 'ms');
    
    // レディ関数を実行（フォールバックも含む）
    executeReadyFunctions(true);
  }
  
  // レディ関数を実行
  function executeReadyFunctions(includeLoaded = false) {
    // カスタムイベントをディスパッチ
    document.dispatchEvent(new Event('CustomDOMReady'));
    
    // ロード完了含む場合
    if (includeLoaded) {
      document.dispatchEvent(new Event('CustomPageLoaded'));
    }
  }
  
  // 初期化を実行
  initEmergencyMeasures();
  
  // DOMContentLoadedイベントをリッスン
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDomReady);
  } else {
    onDomReady();
  }
  
  // ロード完了イベントをリッスン
  window.addEventListener('load', onPageLoad);
  
  // フォールバック: 一定時間経過後に強制的にonDomReadyを呼び出す
  setTimeout(function() {
    if (!isDomReady) {
      console.log('DOMContentLoadedイベントがトリガーされないため、強制的に実行します');
      onDomReady();
    }
  }, 5000);
  
  // フォールバック: 長時間経過後に強制的にonPageLoadを呼び出す
  setTimeout(function() {
    if (!isPageReady) {
      console.log('loadイベントがトリガーされないため、強制的に実行します');
      onPageLoad();
    }
  }, 10000);
})();