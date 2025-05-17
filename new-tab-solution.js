/**
 * 新しいタブで強制的にアプリを開くスクリプト
 * Replitプレビューの代わりに直接アクセス可能なURLに強制的にリダイレクト
 */

(function() {
  console.log('新しいタブソリューションを起動');

  // Replitのプレビューパネル内で実行されているかを確認
  function isInReplitPreview() {
    try {
      // iframe内で実行されているか確認
      const isIframe = window !== window.top;
      
      // URLやUser-Agentをチェックしてもよい
      const urlPath = window.location.pathname;
      
      return isIframe;
    } catch (e) {
      // アクセス制限エラーが発生した場合もiframe内と判断
      return true;
    }
  }
  
  // ホストURLを取得
  function getHostUrl() {
    return window.location.protocol + '//' + window.location.host;
  }
  
  // 自分自身の絶対URL（クエリ付き）を取得
  function getSelfUrl() {
    return window.location.href;
  }
  
  // 外部でアプリを開くためのポップアップを表示
  function showOpenInNewTabPopup() {
    // 既存のポップアップを削除
    const existingPopup = document.getElementById('open-in-new-tab-popup');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    // ポップアップを作成
    const popup = document.createElement('div');
    popup.id = 'open-in-new-tab-popup';
    popup.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #fff;
      border: 2px solid #0d6efd;
      border-radius: 10px;
      padding: 15px;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 80%;
      max-width: 500px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    `;
    
    const hostUrl = getHostUrl();
    const selfUrl = getSelfUrl();
    
    // ポップアップのコンテンツ
    popup.innerHTML = `
      <h3 style="margin-top: 0; color: #0d6efd;">アプリを新しいタブで開きます</h3>
      <p>Replitプレビューでの表示に問題があるため、アプリを新しいタブで開くことをお勧めします。</p>
      <div style="margin: 15px 0;">
        <a href="${hostUrl}" target="_blank" style="
          display: inline-block;
          background-color: #0d6efd;
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          margin-right: 10px;
        ">新しいタブで開く</a>
        <a href="${hostUrl}/?mode=simple" target="_blank" style="
          display: inline-block;
          background-color: #6c757d;
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
        ">シンプルモードで開く</a>
      </div>
      <div style="margin-top: 15px; font-size: 12px; color: #6c757d;">
        <p>または、以下のURLをコピーしてブラウザで直接開いてください：</p>
        <code style="
          display: block;
          padding: 8px;
          background-color: #f8f9fa;
          border-radius: 5px;
          overflow-x: auto;
          white-space: nowrap;
          font-family: monospace;
        ">${hostUrl}</code>
      </div>
      <button id="close-popup-btn" style="
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #6c757d;
      ">✕</button>
    `;
    
    // ポップアップを追加
    document.body.appendChild(popup);
    
    // 閉じるボタンのイベントリスナーを追加
    document.getElementById('close-popup-btn').addEventListener('click', function() {
      popup.remove();
      
      // 3分後に再表示
      setTimeout(showOpenInNewTabPopup, 3 * 60 * 1000);
    });
  }
  
  // 10秒後にポップアップを表示するための遅延
  if (isInReplitPreview()) {
    // 既にロード済みならすぐに表示、そうでなければDOMContentLoadedを待つ
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(showOpenInNewTabPopup, 5000);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(showOpenInNewTabPopup, 5000);
      });
    }
  }
})();