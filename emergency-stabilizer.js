/**
 * 緊急安定化スクリプト
 * 高速ページ切り替わり問題を完全に停止
 */

(function() {
  'use strict';
  
  // 緊急停止フラグ
  let emergencyStabilized = false;
  
  // 全てのリダイレクト機能を一時停止
  function emergencyStabilize() {
    if (emergencyStabilized) return;
    emergencyStabilized = true;
    
    console.log('緊急安定化モード開始 - ページ切り替わりを停止');
    
    // location.replace を無効化
    const originalReplace = window.location.replace;
    window.location.replace = function(url) {
      console.log('リダイレクト停止:', url);
      return false;
    };
    
    // location.href の変更を無効化
    let originalHref = window.location.href;
    Object.defineProperty(window.location, 'href', {
      get: function() { return originalHref; },
      set: function(value) {
        console.log('URL変更停止:', value);
        return false;
      }
    });
    
    // setTimeout/setInterval による遅延リダイレクトも停止
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
      // リダイレクト関連の処理をフィルタリング
      if (typeof callback === 'function') {
        const callbackStr = callback.toString();
        if (callbackStr.includes('location') || callbackStr.includes('redirect')) {
          console.log('遅延リダイレクト停止');
          return;
        }
      }
      return originalSetTimeout.apply(this, arguments);
    };
    
    // 緊急メッセージ表示
    showEmergencyMessage();
  }
  
  // 緊急安定化メッセージを表示
  function showEmergencyMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.id = 'emergency-stabilizer-message';
    messageDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff4444;
      color: white;
      padding: 10px;
      text-align: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    messageDiv.innerHTML = `
      🛑 緊急安定化モード - ページの高速切り替わりを停止しました
      <button onclick="window.location.reload()" style="margin-left: 20px; padding: 5px 15px; background: white; color: #ff4444; border: none; border-radius: 3px; cursor: pointer;">
        ページをリロード
      </button>
    `;
    
    document.body.insertBefore(messageDiv, document.body.firstChild);
  }
  
  // 即座に安定化を実行
  emergencyStabilize();
  
  // ページ読み込み完了後にも再度実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', emergencyStabilize);
  }
  
  // グローバルに公開
  window.EmergencyStabilizer = {
    isStabilized: () => emergencyStabilized,
    disable: () => {
      emergencyStabilized = false;
      const message = document.getElementById('emergency-stabilizer-message');
      if (message) message.remove();
      console.log('緊急安定化モード解除');
    }
  };
  
})();