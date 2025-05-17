/**
 * セッションデバッグ機能の修正版
 * JSONパースエラーとSyntaxErrorを解決します
 */

(function() {
  // グローバルフラグを確認して重複実行を防止
  if (window.sessionDebugFixApplied) {
    return;
  }
  
  // グローバルフラグを設定
  window.sessionDebugFixApplied = true;
  
  console.log('セッションデバッグ修正スクリプトを実行します');
  
  // 既存のセッションデバッガーを無効化（重複実行防止）
  window.debugSessionState = window.debugSessionState || function() {};
  
  // 安全なJSONパース
  function safeJsonParse(str) {
    if (!str) return null;
    if (typeof str === 'object') return str;
    
    try {
      return JSON.parse(str);
    } catch (e) {
      console.warn('JSONパースエラー:', e.message);
      return null;
    }
  }
  
  // 安全なJSONシリアライズ
  function safeJsonStringify(obj) {
    if (!obj) return null;
    if (typeof obj === 'string') return obj;
    
    try {
      return JSON.stringify(obj);
    } catch (e) {
      console.warn('JSON文字列化エラー:', e.message);
      return '{}';
    }
  }
  
  // セッションを直接上書きする危険を避けるためのラッパー
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    // 重要なセッションキーのみ処理
    if (key === 'currentUser' || key === 'touristData' || key === 'guideData') {
      try {
        // オブジェクトならシリアライズ
        if (typeof value === 'object') {
          value = safeJsonStringify(value);
        }
        
        // 文字列でないなら警告
        if (typeof value !== 'string') {
          console.warn(`${key}に文字列以外（${typeof value}）を保存しようとしています`);
          value = String(value);
        }
      } catch (e) {
        console.error(`${key}保存エラー:`, e.message);
      }
    }
    
    // 元の関数を呼び出し
    return originalSetItem.call(this, key, value);
  };
  
  // 安全なセッションアクセス
  const originalGetItem = Storage.prototype.getItem;
  Storage.prototype.getItem = function(key) {
    const value = originalGetItem.call(this, key);
    
    // 特別なキーの場合は自動的にパース
    if (value && (key === 'currentUser' || key === 'touristData' || key === 'guideData')) {
      try {
        if (value.startsWith('{') || value.startsWith('[')) {
          return safeJsonParse(value);
        }
      } catch (e) {
        console.warn(`${key}読み込みエラー:`, e.message);
      }
    }
    
    return value;
  };
  
  // セッションデバッグ関数の安全版
  function safeDebugSession() {
    try {
      // 安全にセッションデータを取得
      const sessionUser = sessionStorage.getItem('currentUser');
      const localTourist = localStorage.getItem('touristData');
      const localGuide = localStorage.getItem('guideData');
      
      // ログ出力
      console.log('セッションストレージ内のガイド登録データ:', safeJsonStringify(sessionUser));
      
      // ユーザーのログイン状態判定
      let loginState = '未ログイン';
      let userType = 'なし';
      
      if (sessionUser) {
        loginState = 'ログイン済み';
        userType = sessionUser.type || '不明';
      }
      
      console.log('ユーザーログイン状態:', loginState);
      console.log('ユーザータイプ:', userType);
      
      // セッション同期状態チェック
      if (sessionUser && sessionUser.type === 'tourist' && localTourist) {
        console.log('✓ 観光客のセッションとローカルストレージは同期されています');
      } else if (sessionUser && sessionUser.type === 'guide' && localGuide) {
        console.log('✓ ガイドのセッションとローカルストレージは同期されています');
      } else if (sessionUser) {
        console.warn('⚠️ セッションとローカルストレージが同期されていません');
      }
    } catch (err) {
      console.error('デバッグ情報の表示中にエラーが発生しました:', err.message);
    }
  }
  
  // グローバル関数として公開
  window.safeDebugSession = safeDebugSession;
  
  // 既存のセッションデバッガーをオーバーライド
  window.debugSessionState = safeDebugSession;
  
  // ページロード完了時に一度実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(safeDebugSession, 500);
  } else {
    window.addEventListener('load', function() {
      setTimeout(safeDebugSession, 500);
    });
  }
})();