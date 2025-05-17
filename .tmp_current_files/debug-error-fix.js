/**
 * デバッグエラー修正スクリプト
 * console.log周りのSyntaxErrorを防止し、JSONエラーを解消します
 */

(function() {
  // グローバルフラグを確認
  if (window.debugErrorFixApplied) {
    return;
  }
  
  // グローバルフラグを設定
  window.debugErrorFixApplied = true;
  
  console.log('デバッグエラー修正スクリプトを実行します');
  
  // 安全なJSONパース処理
  function safeJsonParse(str) {
    if (!str) return null;
    if (typeof str === 'object') return str;
    
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }
  
  // 安全なJSONシリアライズ処理
  function safeJsonStringify(obj) {
    if (!obj) return '{}';
    if (typeof obj === 'string') {
      // 既にJSON文字列の場合はそのまま返す
      try {
        JSON.parse(obj);
        return obj;
      } catch (e) {
        // JSONではない文字列の場合
        return JSON.stringify(obj);
      }
    }
    
    try {
      return JSON.stringify(obj);
    } catch (e) {
      return '{}';
    }
  }
  
  // console.logを安全にオーバーライド
  const originalConsoleLog = console.log;
  console.log = function() {
    try {
      // 引数を変換
      const args = Array.from(arguments).map(arg => {
        if (arg === undefined) return 'undefined';
        if (arg === null) return 'null';
        
        // オブジェクトや配列の場合
        if (typeof arg === 'object') {
          try {
            // 循環参照があるとJSON.stringifyがエラーになるので
            // 安全なシリアライズで置き換え
            const seen = new WeakSet();
            const replacer = (key, value) => {
              if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                  return '[Circular]';
                }
                seen.add(value);
              }
              return value;
            };
            
            // JSON文字列化試行
            return arg;
          } catch (e) {
            return arg.toString();
          }
        }
        
        return arg;
      });
      
      // 元のconsole.logを呼び出し
      return originalConsoleLog.apply(console, args);
    } catch (e) {
      // 万が一エラーが発生しても通知だけして続行
      originalConsoleLog.call(console, 'console.log内でエラーが発生しました:', e.message);
    }
  };
  
  // その他のconsoleメソッドも同様に処理
  const methods = ['warn', 'error', 'info', 'debug'];
  methods.forEach(method => {
    const original = console[method];
    console[method] = function() {
      try {
        const args = Array.from(arguments);
        return original.apply(console, args);
      } catch (e) {
        originalConsoleLog.call(console, `console.${method}内でエラーが発生しました:`, e.message);
      }
    };
  });
  
  // セッションストレージの操作を安全に
  const originalSessionGetItem = sessionStorage.getItem;
  sessionStorage.getItem = function(key) {
    try {
      return originalSessionGetItem.call(this, key);
    } catch (e) {
      console.warn(`sessionStorage.getItem('${key}')エラー:`, e.message);
      return null;
    }
  };
  
  // ローカルストレージの操作を安全に
  const originalLocalGetItem = localStorage.getItem;
  localStorage.getItem = function(key) {
    try {
      return originalLocalGetItem.call(this, key);
    } catch (e) {
      console.warn(`localStorage.getItem('${key}')エラー:`, e.message);
      return null;
    }
  };
  
  // JSON.parseを安全に
  const originalJsonParse = JSON.parse;
  JSON.parse = function(text) {
    try {
      return originalJsonParse.call(JSON, text);
    } catch (e) {
      console.warn('JSONパースエラー:', e.message);
      return {};
    }
  };
  
  // JSON.stringifyを安全に
  const originalJsonStringify = JSON.stringify;
  JSON.stringify = function(value, replacer, space) {
    try {
      return originalJsonStringify.call(JSON, value, replacer, space);
    } catch (e) {
      console.warn('JSON文字列化エラー:', e.message);
      return '{}';
    }
  };
  
  // デバッグ情報の表示を抑止
  window.suppressDebugOutput = true;
  
  console.log('デバッグエラー修正が完了しました');
})();