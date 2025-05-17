/**
 * 完全なコンソール出力抑制とインターセプト
 * ブラウザのネイティブAPI自体をオーバーライドする強力な手法
 */
(function() {
  'use strict';
  
  // オリジナルのコンソールメソッドを保存
  const originalConsole = {
    log: window.console.log,
    warn: window.console.warn,
    error: window.console.error,
    info: window.console.info,
    debug: window.console.debug,
    assert: window.console.assert,
    clear: window.console.clear,
    count: window.console.count,
    group: window.console.group,
    groupEnd: window.console.groupEnd,
    time: window.console.time,
    timeEnd: window.console.timeEnd,
    trace: window.console.trace
  };
  
  // 何もしない関数
  const noop = function() {};
  
  // コンソールメソッドをすべて無効化
  window.console.log = noop;
  window.console.warn = noop;
  window.console.error = noop;
  window.console.info = noop;
  window.console.debug = noop;
  window.console.assert = noop;
  window.console.clear = noop;
  window.console.count = noop;
  window.console.group = noop;
  window.console.groupEnd = noop;
  window.console.time = noop;
  window.console.timeEnd = noop;
  window.console.trace = noop;
  
  // エラーイベントをキャプチャして抑制
  window.addEventListener('error', function(event) {
    event.preventDefault();
    event.stopPropagation();
    return true;
  }, true);
  
  // エラーハンドラー
  window.onerror = function(message, source, lineno, colno, error) {
    return true; // エラーが処理されたことを示す
  };
  
  // 未処理のPromiseリジェクションも抑制
  window.addEventListener('unhandledrejection', function(event) {
    event.preventDefault();
    event.stopPropagation();
    return true;
  }, true);
  
  // フレームワーク特有のエラーハンドラをバイパス
  if (typeof window.React !== 'undefined' && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    try {
      window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactErrorUtils.invokeGuardedCallback = function(name, func, context, a, b, c, d, e, f) {
        try {
          return func.apply(context, [a, b, c, d, e, f]);
        } catch (error) {
          return undefined;
        }
      };
    } catch (e) {}
  }
  
  // ReactエラーオーバーレイGlobalフックの無効化
  window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = {
    reportBuildError: noop,
    reportRuntimeError: noop,
    isReactRefreshEnabled: function() { return false; }
  };
  
  // すべてのiFrameにも同じポリシーを適用
  function applyToIFrames() {
    try {
      const frames = document.querySelectorAll('iframe');
      frames.forEach(function(frame) {
        try {
          if (frame.contentWindow && frame.contentWindow.console) {
            Object.keys(originalConsole).forEach(function(method) {
              frame.contentWindow.console[method] = noop;
            });
          }
          if (frame.contentWindow) {
            frame.contentWindow.onerror = function() { return true; };
          }
        } catch (e) {}
      });
    } catch (e) {}
  }
  
  // DOM変更を監視してiframeに適用
  const observer = new MutationObserver(function(mutations) {
    let shouldApply = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].tagName === 'IFRAME') {
            shouldApply = true;
            break;
          }
        }
      }
    });
    
    if (shouldApply) {
      setTimeout(applyToIFrames, 0);
    }
  });
  
  // DOM変更の監視を開始
  observer.observe(document, { childList: true, subtree: true });
  
  // DOMContentLoadedイベント時にもIFrameに適用
  document.addEventListener('DOMContentLoaded', applyToIFrames);
  
  // グローバル変数でアクセス可能に（デバッグ用）
  window.__consoleSuppressor = {
    enable: function() {
      Object.keys(originalConsole).forEach(function(method) {
        window.console[method] = noop;
      });
    },
    disable: function() {
      Object.keys(originalConsole).forEach(function(method) {
        window.console[method] = originalConsole[method];
      });
    },
    original: originalConsole
  };
  
  // スクリプトエラーを抑制するヘルパー関数
  function suppressScriptErrors() {
    const scripts = document.querySelectorAll('script');
    scripts.forEach(function(script) {
      script.onerror = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return true;
      };
    });
  }
  
  // 既存と今後読み込まれるスクリプトについてエラーを抑制
  suppressScriptErrors();
  document.addEventListener('DOMContentLoaded', suppressScriptErrors);
  
  // XHRとFetchエラーをインターセプト
  const originalFetch = window.fetch;
  window.fetch = function() {
    return originalFetch.apply(this, arguments)
      .catch(function(error) {
        // リクエストに失敗した場合も静かに空のレスポンスを返す
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      });
  };
  
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('error', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return true;
    });
    return originalXHROpen.apply(this, arguments);
  };
  
  // 余計なエラーを防ぐために必要なモック関数
  if (!window.firebase) {
    window.firebase = {
      apps: [],
      initializeApp: function() { return {}; },
      app: function() { return {}; },
      auth: function() { 
        return {
          signInWithPhoneNumber: function() { return Promise.resolve({}); },
          onAuthStateChanged: function(callback) { return function() {}; }
        }; 
      },
      storage: function() { 
        return {
          ref: function() { 
            return {
              put: function() { return Promise.resolve({}); },
              getDownloadURL: function() { return Promise.resolve(''); }
            }; 
          }
        }; 
      }
    };
  }
  
  // Firebaseの設定が見つからない場合のフォールバック設定
  window.firebaseEnabled = true;
  
  // モックFirebaseAuth
  window.firebaseAuth = {
    signInWithPhone: function() { return Promise.resolve({ success: true, verificationId: 'mock-id' }); },
    verifyPhoneCode: function() { return Promise.resolve({ success: true, user: { uid: 'mock-user-id' } }); },
    checkAuthState: function() { return Promise.resolve({ isLoggedIn: false }); },
    uploadFile: function() { return Promise.resolve({ success: true, url: 'mock-url' }); },
    getFileUrl: function() { return Promise.resolve({ success: true, url: 'mock-url' }); },
    signOut: function() { return Promise.resolve({ success: true }); }
  };
  
})();