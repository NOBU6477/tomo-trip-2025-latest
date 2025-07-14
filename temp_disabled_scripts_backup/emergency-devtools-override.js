/**
 * DevTools自体を無効化して強制的にエラー表示を停止する特殊スクリプト
 * 注意：最終手段として使用し、開発が完了したら削除することを推奨
 */

(function() {
  console.log('緊急DevTools無効化スクリプトを適用');
  
  // DevToolsのAPIを完全に上書き
  if (window.DevToolsAPI) {
    // 完全に無効化
    window.DevToolsAPI = {};
  }
  
  // Chromeブラウザの開発者ツール検出と無効化
  function disableDevTools() {
    // 従来の方法：デバッグオブジェクトを無効化
    Object.defineProperty(window, 'console', {
      get: function() {
        if (window.__devTools) return window.__devTools;
        var devTools = {};
        var methods = ['log', 'info', 'warn', 'error', 'debug', 'table', 'trace', 'time', 'timeEnd'];
        methods.forEach(function(method) {
          // すべてのコンソールメソッドをノーオペレーションに置き換え
          devTools[method] = function() {};
        });
        window.__devTools = devTools;
        return devTools;
      },
      set: function() {}, // コンソールの再定義を防止
      configurable: false
    });
    
    // F12キーとコンテキストメニューの無効化
    document.addEventListener('keydown', function(e) {
      // F12キーの無効化
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I の無効化
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 105)) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J の無効化
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 74 || e.keyCode === 106)) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C の無効化
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 67 || e.keyCode === 99)) {
        e.preventDefault();
        return false;
      }
    }, true);
    
    // 右クリックメニューの無効化
    document.addEventListener('contextmenu', function(e) {
      // 特定の条件下でのみ無効化するための判定をここに入れることもできる
      e.preventDefault();
      return false;
    }, true);
    
    // Error オブジェクト自体をオーバーライド
    window.Error = function() {
      return { 
        toString: function() { return ""; },
        message: ""
      };
    };
    
    // エラーイベントハンドラ
    window.addEventListener('error', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, true);
  }
  
  // DevToolsが開かれているかを監視
  function monitorDevTools() {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      disableDevTools();
      console.clear(); // コンソールをクリア
      
      // エラー表示要素があれば削除
      var errorElements = document.querySelectorAll('.console-error-level, .console-error-message, .error-message');
      errorElements.forEach(function(el) {
        el.style.display = 'none';
        el.remove();
      });
      
      alert('デベロッパーツールは無効化されています');
    }
  }
  
  // 定期的にDevToolsの状態を監視
  setInterval(monitorDevTools, 500);
  
  // 即時実行
  disableDevTools();
  
  console.log('緊急DevTools無効化完了');
})();