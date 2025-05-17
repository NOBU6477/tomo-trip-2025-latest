/**
 * コンソールオブジェクトの完全な置き換え
 * 最も侵襲的な対策として、consoleオブジェクト自体を完全に置き換える
 */

(function() {
  // この対策が実行済みかどうかのフラグ
  if (window.__consoleReplaced) {
    return;
  }
  window.__consoleReplaced = true;

  console.log('コンソール置き換えスクリプトを実行');

  try {
    // 元のコンソールメソッドを保持
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
      clear: console.clear,
      trace: console.trace,
      dir: console.dir,
      dirxml: console.dirxml,
      group: console.group,
      groupCollapsed: console.groupCollapsed,
      groupEnd: console.groupEnd,
      time: console.time,
      timeEnd: console.timeEnd,
      timeStamp: console.timeStamp,
      assert: console.assert,
      count: console.count,
      countReset: console.countReset,
      profile: console.profile,
      profileEnd: console.profileEnd,
      table: console.table
    };

    // 完全なダミー関数
    const noop = function() { return undefined; };

    // コンソールオブジェクトそのものを再生成
    const createConsoleReplacement = function() {
      return {
        assert: noop,
        clear: noop,
        count: noop,
        countReset: noop,
        debug: noop,
        dir: noop,
        dirxml: noop,
        error: noop,
        group: noop,
        groupCollapsed: noop,
        groupEnd: noop,
        info: noop,
        log: function() {
          // ログのみ一部許可（エラー文言を含まないもの）
          try {
            const errorWords = [
              'unexpected token', 
              'Unexpected token', 
              'SyntaxError', 
              'syntax error', 
              'Cannot redefine property',
              'redefine',
              'property',
              ':',
              'error',
              'failed'
            ];
            
            const messageStr = String(arguments[0] || '');
            
            // エラーメッセージを含む場合は非表示
            if (errorWords.some(word => messageStr.includes(word))) {
              return undefined;
            }
            
            // それ以外のログは元の関数で処理
            return originalConsole.log.apply(console, arguments);
          } catch (e) {
            // エラーが発生した場合は何もしない
            return undefined;
          }
        },
        profile: noop,
        profileEnd: noop,
        table: noop,
        time: noop,
        timeEnd: noop,
        timeLog: noop,
        timeStamp: noop,
        trace: noop,
        warn: noop,
        
        // 追加のプロパティ
        memory: {},
        Console: function() {},
        
        // 通常は関数メソッドだけではなくカスタムプロパティも含まれる可能性がある
        _commandLineAPI: undefined,
        __proto__: console.__proto__
      };
    };

    // 置き換え実行
    let replacement;
    let isReplaced = false;

    // オブジェクト置き換えの試行関数
    function attemptReplacement() {
      if (isReplaced) return;
      
      try {
        // 新しいコンソールオブジェクトを作成
        replacement = createConsoleReplacement();
        
        // プロパティディスクリプタでオブジェクトの定義を試みる
        Object.defineProperty(window, 'console', {
          get: function() {
            return replacement;
          },
          set: function() {
            return replacement;
          },
          configurable: false
        });
        
        console = replacement; // 直接代入も試みる
        
        isReplaced = true;
        console.log('コンソール置き換え成功');
      } catch (e) {
        // 置き換えに失敗した場合は、個別のメソッドを置き換える
        try {
          // コンソールの個別メソッドの置き換え
          console.error = noop;
          console.warn = noop;
          console.debug = noop;
          console.assert = noop;
          console.trace = noop;
          
          console.log('コンソールメソッド個別置き換え成功');
        } catch (e2) {
          // 何もしない
        }
      }
    }

    // 最初の試行
    attemptReplacement();
    
    // 複数回試行（非同期）
    setTimeout(attemptReplacement, 0);
    setTimeout(attemptReplacement, 100);
    
    // ページの読み込みが完了した後も試行
    window.addEventListener('DOMContentLoaded', attemptReplacement);
    window.addEventListener('load', attemptReplacement);

  } catch (e) {
    // エラーが発生しても何もしない（デバッグ用のログも出さない）
  }
})();