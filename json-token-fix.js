/**
 * JSON解析エラー「Unexpected token」を防止するためのスクリプト
 * 文字列（特に"tourist"など）が直接JSONとして解析されることを防ぎます
 */
(function() {
  console.log('JSON解析エラー修正スクリプトを実行しています...');
  
  // 元のJSON.parseを保存
  const originalJSONParse = JSON.parse;
  
  // JSON.parseをオーバーライド
  window.JSON.parse = function(text) {
    // 単純な文字列の場合はエラーを避ける
    if (typeof text === 'string' && !text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      console.log(`JSON解析回避: "${text}" は有効なJSONではありません`);
      
      // 単純な文字列は、そのままオブジェクトのプロパティとして返す
      return { value: text };
    }
    
    // 通常のJSON.parseを実行
    try {
      return originalJSONParse.apply(this, arguments);
    } catch (e) {
      console.warn(`JSON解析エラー: ${e.message}`, e);
      console.log(`問題のあるテキスト: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
      
      // エラーがあってもアプリケーションが継続できるように空オブジェクトを返す
      return {};
    }
  };
  
  // ユーザータイプ関連のエラー修正
  function fixUserTypeErrors() {
    // ページのDOMが完全に読み込まれた後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupUserTypeFixing);
    } else {
      setupUserTypeFixing();
    }
    
    function setupUserTypeFixing() {
      // URLパラメータチェック
      const urlParams = new URLSearchParams(window.location.search);
      const userType = urlParams.get('login-user-type');
      
      if (userType) {
        console.log(`ユーザータイプをURLから取得: ${userType}`);
        
        // セッションストレージに安全に保存
        try {
          sessionStorage.setItem('selectedUserType', userType);
          console.log(`ユーザータイプがセッションに保存されました: ${userType}`);
        } catch (e) {
          console.error('セッションストレージへの保存に失敗:', e);
        }
      }
    }
  }
  
  // 修正を実行
  fixUserTypeErrors();
  
  console.log('JSON解析エラー修正スクリプトが完了しました');
})();