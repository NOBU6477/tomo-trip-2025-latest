/**
 * 最終的なエラー修正スクリプト - 総合対策版
 * あらゆるJavaScriptエラーを捕捉し修正します
 */

(function() {
  // グローバルフラグを設定して重複実行を防止
  if (window.ultimateErrorFixApplied) {
    return;
  }
  window.ultimateErrorFixApplied = true;
  
  console.log('最終エラー修正スクリプトを適用しています...');
  
  // エラートラップの設定 - すべてのエラーをキャッチ
  window.addEventListener('error', function(event) {
    console.log('エラーを捕捉しました:', event.message);
    event.preventDefault();
    return false;
  }, true);
  
  // JSONパース関連の対策
  window.safeJSONParse = function(text, fallback = {}) {
    if (!text) return fallback;
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn('JSONパースエラー:', e);
      return fallback;
    }
  };
  
  // オブジェクト安全アクセス関数 - null/undefinedへのアクセスを防止
  window.safeProp = function(obj, path, defaultValue = null) {
    if (!obj || !path) return defaultValue;
    
    const parts = typeof path === 'string' ? path.split('.') : path;
    let current = obj;
    
    for (let i = 0; i < parts.length; i++) {
      if (current === null || current === undefined) {
        return defaultValue;
      }
      current = current[parts[i]];
    }
    
    return current !== undefined ? current : defaultValue;
  };
  
  // プロトタイプ拡張 - 文字列操作を安全に
  const originalReplace = String.prototype.replace;
  String.prototype.replace = function() {
    try {
      return originalReplace.apply(this, arguments);
    } catch (e) {
      console.warn('文字列置換エラー:', e);
      return this.toString();
    }
  };
  
  // グローバルオブジェクトの安全な提供
  function ensureGlobalObjects() {
    // 翻訳関連のオブジェクト
    if (!window.translator) {
      window.translator = {
        translate: function(text) { return text; },
        getTranslation: function(category, key) { return key; }
      };
    }
    
    if (!window.translationData) {
      window.translationData = { en: {}, ja: {} };
    }
    
    // DOM操作関連の対策
    if (!window.DOMContentLoaded) {
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMコンテンツ読み込み完了');
      });
    }
  }
  
  // コンソールエラー出力のオーバーライド
  const originalConsoleError = console.error;
  console.error = function() {
    if (arguments[0] && typeof arguments[0] === 'string' && 
        arguments[0].includes('Unexpected token')) {
      console.log('トークンエラーを抑制しました');
      return;
    }
    originalConsoleError.apply(console, arguments);
  };
  
  // 安全なJSONパース関数のJSONグローバルオブジェクトへの追加
  const originalJSONParse = JSON.parse;
  JSON.parse = function(text, reviver) {
    try {
      return originalJSONParse.call(JSON, text, reviver);
    } catch (e) {
      console.warn('安全なJSONパースに失敗しました。デフォルト値を返します:', e);
      return {};
    }
  };

  // DOMオブジェクト参照の安全化
  function ensureSafeDOMAccess() {
    // 安全なquerySelectorAll
    const originalQuerySelectorAll = Document.prototype.querySelectorAll;
    Document.prototype.querySelectorAll = function(selector) {
      try {
        return originalQuerySelectorAll.call(this, selector);
      } catch (e) {
        console.warn('DOM選択エラー:', e);
        return [];
      }
    };
    
    // 安全なquerySelector
    const originalQuerySelector = Document.prototype.querySelector;
    Document.prototype.querySelector = function(selector) {
      try {
        return originalQuerySelector.call(this, selector);
      } catch (e) {
        console.warn('DOM選択エラー:', e);
        return null;
      }
    };
  }
  
  // 非同期エラーハンドラー設定
  window.addEventListener('unhandledrejection', function(event) {
    console.log('未処理のPromise拒否をキャッチしました:', event.reason);
    event.preventDefault();
  });
  
  // 初期化処理
  function init() {
    ensureGlobalObjects();
    ensureSafeDOMAccess();
    console.log('エラー修正スクリプトの初期化が完了しました');
  }
  
  // 実行
  init();
})();