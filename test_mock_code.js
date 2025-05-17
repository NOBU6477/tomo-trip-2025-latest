// テスト用のモック認証コード表示ツール
document.addEventListener('DOMContentLoaded', function() {
  // モックコードを表示するための要素を作成
  const mockCodeContainer = document.createElement('div');
  mockCodeContainer.id = 'mock-code-container';
  mockCodeContainer.style.cssText = 'position: fixed; bottom: 0; right: 0; background: rgba(0,0,0,0.8); color: #00ff00; padding: 10px; font-family: monospace; z-index: 9999; border-radius: 5px 0 0 0; font-size: 12px;';
  document.body.appendChild(mockCodeContainer);
  
  // モック認証コードを表示する関数
  window.displayMockCode = function(code) {
    mockCodeContainer.innerHTML = `<div>テスト用認証コード: <strong>${code}</strong></div>`;
    mockCodeContainer.style.display = 'block';
    
    // モーダルが表示されているか確認し、あれば自動的にモックコードを入力する
    setTimeout(() => {
      const codeInput = document.querySelector('input[placeholder="6 桁のコード"]');
      if (codeInput) {
        codeInput.value = code;
        console.log('認証コードを自動入力しました:', code);
      }
    }, 500);
  };
  
  // バックエンドエラーをキャッチして認証コードを表示する関連処理を追加
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    const response = await originalFetch(url, options);
    const responseClone = response.clone();
    
    // 電話番号認証リクエストの場合
    if (url.includes('/api/verify-phone/start') || url.includes('/api/firebase/verify-phone-firebase')) {
      try {
        const data = await responseClone.json();
        // サーバーからのレスポンスにモックコードが含まれている場合
        if (data.mockCode) {
          console.log('モック認証コードを受信:', data.mockCode);
          window.displayMockCode(data.mockCode);
        }
      } catch (e) {
        console.error('レスポンスのJSONパースに失敗:', e);
      }
    }
    
    return response;
  };
  
  // 既知のテスト用コードをデフォルトで表示（より良いユーザー体験のため）
  window.displayMockCode('409389'); // デフォルトコード
});
