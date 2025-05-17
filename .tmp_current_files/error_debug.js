/**
 * JavaScriptエラーをキャッチするデバッグ用スクリプト
 */
(function() {
  // エラーログの保存用配列
  const errorLogs = [];
  const maxLogs = 100;

  // オリジナルのコンソールメソッドを保存
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };

  // グローバルエラーイベントハンドラ
  window.addEventListener('error', function(event) {
    const { message, filename, lineno, colno, error } = event;
    const errorInfo = {
      type: 'uncaught',
      message,
      source: filename,
      line: lineno,
      column: colno,
      stack: error && error.stack,
      time: new Date().toISOString()
    };
    
    logError(errorInfo);
  });

  // Promise拒否エラーハンドラ
  window.addEventListener('unhandledrejection', function(event) {
    const errorInfo = {
      type: 'promise',
      message: event.reason.message || String(event.reason),
      stack: event.reason.stack,
      time: new Date().toISOString()
    };
    
    logError(errorInfo);
  });

  // エラーをログに追加する関数
  function logError(errorInfo) {
    // エラー情報をログに追加
    errorLogs.push(errorInfo);
    
    // 最大数を超えたら古いログを削除
    if (errorLogs.length > maxLogs) {
      errorLogs.shift();
    }
    
    // オリジナルのコンソールでエラーを表示
    originalConsole.error('JavaScript エラーが検出されました:', errorInfo);
    
    // 画面に通知を表示
    showErrorNotification(errorInfo);
  }

  // エラー通知を画面に表示する関数
  function showErrorNotification(errorInfo) {
    // 既存の通知を削除
    const existingNotifications = document.querySelectorAll('.error-notification');
    existingNotifications.forEach(notification => {
      notification.remove();
    });
    
    // 新しい通知を作成
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="error-header">
        <span class="error-title">JavaScriptエラー</span>
        <span class="error-close">&times;</span>
      </div>
      <div class="error-content">
        <div class="error-message">${errorInfo.message}</div>
        <div class="error-details">
          ${errorInfo.source ? `<div>ファイル: ${errorInfo.source}</div>` : ''}
          ${errorInfo.line ? `<div>行: ${errorInfo.line}</div>` : ''}
        </div>
      </div>
    `;
    
    // スタイルを設定
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: '#721c24',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      zIndex: '9999',
      fontSize: '14px',
      maxWidth: '90%',
      minWidth: '300px'
    });
    
    // ヘッダーのスタイル
    const header = notification.querySelector('.error-header');
    Object.assign(header.style, {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      fontWeight: 'bold'
    });
    
    // 閉じるボタンのスタイル
    const closeButton = notification.querySelector('.error-close');
    Object.assign(closeButton.style, {
      cursor: 'pointer',
      fontSize: '20px',
      fontWeight: 'bold',
      lineHeight: '1'
    });
    
    // 閉じるボタンのクリックイベント
    closeButton.addEventListener('click', function() {
      notification.remove();
    });
    
    // エラーメッセージのスタイル
    const errorMessage = notification.querySelector('.error-message');
    Object.assign(errorMessage.style, {
      marginBottom: '5px',
      wordBreak: 'break-word'
    });
    
    // エラー詳細のスタイル
    const errorDetails = notification.querySelector('.error-details');
    Object.assign(errorDetails.style, {
      fontSize: '12px',
      opacity: '0.8'
    });
    
    // 通知を10秒後に自動的に閉じる
    setTimeout(function() {
      if (document.body.contains(notification)) {
        notification.remove();
      }
    }, 10000);
    
    // 通知をドキュメントに追加
    document.body.appendChild(notification);
  }

  // エラーログを表示する関数をグローバルに公開
  window.showErrorLogs = function() {
    originalConsole.log('エラーログ:', errorLogs);
    return errorLogs;
  };

  // デバッグコンソール拡張用に元のコンソールメソッドを上書き
  console.error = function(...args) {
    // エラーをログに追加
    const errorInfo = {
      type: 'console',
      message: args.map(arg => String(arg)).join(' '),
      time: new Date().toISOString()
    };
    errorLogs.push(errorInfo);
    
    // 最大数を超えたら古いログを削除
    if (errorLogs.length > maxLogs) {
      errorLogs.shift();
    }
    
    // 元のconsole.errorを呼び出し
    originalConsole.error.apply(console, args);
  };

  // カメラボタン関連の各種オブジェクトの存在を確認
  window.checkCameraFunctions = function() {
    originalConsole.log('カメラ関連の各種グローバル関数チェック:');
    
    const functionCheck = [
      { name: 'openCameraModal', obj: window.openCameraModal },
      { name: 'showCameraModal', obj: window.showCameraModal },
      { name: 'setupCameraButtons', obj: window.setupCameraButtons },
      { name: 'streamlined_camera.js', status: 'スクリプトロード済み' }
    ];
    
    functionCheck.forEach(func => {
      if (func.obj) {
        originalConsole.log(`✓ ${func.name} が存在します`);
      } else if (func.status) {
        originalConsole.log(`✓ ${func.name}: ${func.status}`);
      } else {
        originalConsole.log(`✗ ${func.name} が見つかりません`);
      }
    });
    
    // カメラボタンの状態を確認
    const cameraButtons = document.querySelectorAll('.camera-button');
    originalConsole.log(`カメラボタン数: ${cameraButtons.length}`);
    
    // サンプルのボタンをクリックしてみる
    const testButton = cameraButtons[0];
    if (testButton) {
      originalConsole.log('サンプルボタン:', testButton);
      
      const targetId = testButton.getAttribute('data-target');
      originalConsole.log('ターゲットID:', targetId);
      
      originalConsole.log('クリックイベントシミュレート:');
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      
      try {
        testButton.dispatchEvent(clickEvent);
        originalConsole.log('クリックイベント発行完了');
      } catch (error) {
        originalConsole.error('クリックイベント発行エラー:', error);
      }
    }
    
    return 'チェック完了';
  };

  // ページ読み込み完了時に各種オブジェクトの状態を確認
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      originalConsole.log('ページ読み込み完了後のカメラ機能チェック:');
      window.checkCameraFunctions();
    }, 1000);
  });

  // オリジナルのconsole.logメソッドを使ってメッセージを表示
  originalConsole.log('エラーデバッグスクリプトが初期化されました');
})();