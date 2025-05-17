/**
 * デバッグ出力を完全に無効化するスクリプト
 * エラーの原因となるデバッグ関数をすべてモックに置き換え
 */

(function() {
  console.log('デバッグ無効化スクリプトを実行します');

  // すべてのデバッグ関数を無効な関数に置き換え
  window.debugSessionState = function() {};
  window.safeDebugSession = function() {};
  window.showSessionData = function() {};
  window.debugSession = function() {};
  window.debugLoginState = function() {};

  // console関連の処理
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // console.logの安全版を定義
  console.log = function() {
    try {
      const args = Array.from(arguments).map(arg => {
        // JSONデータに関するエラーを回避
        if (arg && typeof arg === 'object') {
          try {
            if (Object.keys(arg).length === 0) {
              return '{}';
            }
            // 安全に文字列化
            const seen = new WeakSet();
            return JSON.stringify(arg, (key, value) => {
              if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) return '[Circular]';
                seen.add(value);
              }
              return value;
            });
          } catch (e) {
            return String(arg);
          }
        }
        return arg;
      });
      
      return originalConsoleLog.apply(console, args);
    } catch (e) {
      // エラーが発生しても無視して処理を継続
      return originalConsoleLog.call(console, '[ログエラー抑制]');
    }
  };
  
  // console.errorも同様に処理
  console.error = function() {
    try {
      const args = Array.from(arguments).map(arg => {
        if (arg && typeof arg === 'object') {
          try {
            return '{}';
          } catch (e) {
            return String(arg);
          }
        }
        return arg;
      });
      
      return originalConsoleError.apply(console, args);
    } catch (e) {
      return originalConsoleError.call(console, '[エラー出力抑制]');
    }
  };
  
  // console.warnも同様に処理
  console.warn = function() {
    try {
      const args = Array.from(arguments).map(arg => {
        if (arg && typeof arg === 'object') {
          try {
            return '{}';
          } catch (e) {
            return String(arg);
          }
        }
        return arg;
      });
      
      return originalConsoleWarn.apply(console, args);
    } catch (e) {
      return originalConsoleWarn.call(console, '[警告出力抑制]');
    }
  };
  
  // すべてのグループ化されたコンソール出力を抑制
  const noOpFunction = function() {};
  console.group = noOpFunction;
  console.groupEnd = noOpFunction;
  console.groupCollapsed = noOpFunction;
  
  // デバッグ用のStorage監視を削除
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    // デバッグ通知を削除
    return originalSetItem.call(this, key, value);
  };
  
  // 既存のデバッグリスナーを削除
  window.removeEventListener('load', window.debugSessionState);
  window.removeEventListener('load', window.safeDebugSession);
  document.removeEventListener('DOMContentLoaded', window.debugSessionState);
  document.removeEventListener('DOMContentLoaded', window.safeDebugSession);
  
  // ページ読み込み時のデバッグ実行を無効化
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(event, listener, options) {
    if (event === 'load' && 
        (listener === window.debugSessionState || 
         listener === window.safeDebugSession ||
         listener.toString().includes('debugSession'))) {
      // デバッグリスナーは登録しない
      return;
    }
    return originalAddEventListener.call(this, event, listener, options);
  };
  
  console.log('デバッグ出力の無効化が完了しました');
})();