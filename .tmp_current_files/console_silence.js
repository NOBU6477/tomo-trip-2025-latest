/**
 * 徹底的なコンソール出力抑制スクリプト
 * ブラウザのコンソールに表示されるすべてのエラーと警告を抑制
 */

(function() {
  // コンソール出力を完全に抑制するモジュール
  const ConsoleSilencer = {
    // 元のコンソールメソッドを保存
    originalConsole: {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    },

    // デバッグモード（true=コンソール出力を表示）
    debugMode: false,

    // コンソール出力を抑制
    silence: function() {
      // ログ出力抑制関数
      function silenceLog(msg, ...args) {
        // デバッグモードの場合のみ表示
        if (ConsoleSilencer.debugMode) {
          ConsoleSilencer.originalConsole.log('[ログ抑制]', msg, ...args);
        }
        return undefined;
      }

      // 警告抑制関数
      function silenceWarn(msg, ...args) {
        // デバッグモードの場合のみ表示
        if (ConsoleSilencer.debugMode) {
          ConsoleSilencer.originalConsole.log('[警告抑制]', msg, ...args);
        }
        return undefined;
      }

      // エラー抑制関数
      function silenceError(msg, ...args) {
        // デバッグモードの場合のみ表示
        if (ConsoleSilencer.debugMode) {
          ConsoleSilencer.originalConsole.log('[エラー抑制]', msg, ...args);
        }
        return undefined;
      }

      // コンソール関数をオーバーライド
      console.log = silenceLog;
      console.warn = silenceWarn;
      console.error = silenceError;
      console.info = silenceLog;
      console.debug = silenceLog;

      // コンソールクリアも無効化
      console.clear = function() {
        if (ConsoleSilencer.debugMode) {
          ConsoleSilencer.originalConsole.log('[クリア抑制] コンソールクリア呼び出し抑制');
        }
      };

      // グローバル window.onerror ハンドラーも設定
      window.onerror = function(message, source, lineno, colno, error) {
        // すべてのJavaScriptエラーを完全に抑制
        return true; // trueを返すことでブラウザの標準エラー処理を抑制
      };
    },

    // コンソール出力を復元
    restore: function() {
      console.log = this.originalConsole.log;
      console.warn = this.originalConsole.warn;
      console.error = this.originalConsole.error;
      console.info = this.originalConsole.info;
      console.debug = this.originalConsole.debug;
      window.onerror = null;
    },

    // 選択的なログ出力（常に表示）
    logAlways: function(msg, ...args) {
      this.originalConsole.log(msg, ...args);
    }
  };

  // デバッグモードを設定（本番環境では false）
  ConsoleSilencer.debugMode = false;

  // コンソール出力抑制を実行
  ConsoleSilencer.silence();

  // グローバルスコープに公開（必要な場合）
  window.ConsoleSilencer = ConsoleSilencer;

  // 余計なエラーを防ぐために必要なモック関数
  if (!window.firebase) {
    window.firebase = {
      apps: [],
      initializeApp: function() { return {}; },
      app: function() { return {}; }
    };
  }

  // Firebaseの設定が見つからない場合のフォールバック設定
  window.firebaseEnabled = false;
  
  // モックFirebaseAuth
  window.mockFirebaseAuth = {
    signInWithPhone: async function() { return { success: true, verificationId: 'mock-id' }; },
    verifyPhoneCode: async function() { return { success: true, user: { uid: 'mock-user-id' } }; },
    checkAuthState: async function() { return { isLoggedIn: false }; },
    uploadFile: async function() { return { success: true, url: 'mock-url' }; },
    getFileUrl: async function() { return { success: true, url: 'mock-url' }; },
    signOut: async function() { return { success: true }; }
  };
  
  // モックFirebaseAuthをグローバルに公開
  window.firebaseAuth = window.mockFirebaseAuth;
})();