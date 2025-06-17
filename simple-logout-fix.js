/**
 * シンプルログアウト修正
 * 無限ループを防ぐ最小限のログアウト処理
 */

(function() {
  'use strict';

  // 既存のログアウト処理をオーバーライド
  window.handleLogout = function() {
    console.log('シンプルログアウト処理を開始');
    
    if (!confirm('ログアウトしますか？')) {
      return;
    }

    try {
      // セッションデータクリア
      sessionStorage.clear();
      
      // 主要なローカルストレージアイテムをクリア
      localStorage.removeItem('currentUser');
      localStorage.removeItem('touristData');
      localStorage.removeItem('guideData');
      localStorage.removeItem('guideRegistrationData');
      localStorage.removeItem('latestGuideRegistration');
      
      // 成功メッセージ表示
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 9999;
        font-weight: bold;
      `;
      message.textContent = 'ログアウトしました';
      document.body.appendChild(message);
      
      // 1秒後にリダイレクト
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
      
    } catch (error) {
      console.error('ログアウトエラー:', error);
      // エラーが発生してもリダイレクト
      window.location.href = 'index.html';
    }
  };

  // ログアウトボタンを探してイベントを再設定
  function setupLogoutButtons() {
    const logoutButtons = document.querySelectorAll('[id*="logout"], [class*="logout"], a[href="#logout"]');
    
    logoutButtons.forEach(button => {
      // 既存のイベントを削除
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // 新しいイベントを設定
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.handleLogout();
      });
    });
    
    // プロフィールページのログアウトボタン
    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    if (profileLogoutBtn) {
      profileLogoutBtn.onclick = function(e) {
        e.preventDefault();
        window.handleLogout();
      };
    }
    
    // トップページのログアウトボタン
    const topLogoutBtn = document.getElementById('top-logout-btn');
    if (topLogoutBtn) {
      topLogoutBtn.onclick = function(e) {
        e.preventDefault();
        window.handleLogout();
      };
    }
  }

  // ページ読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLogoutButtons);
  } else {
    setupLogoutButtons();
  }

  // 少し遅延してもう一度実行（動的に生成されるボタン対応）
  setTimeout(setupLogoutButtons, 1000);
  setTimeout(setupLogoutButtons, 3000);

  console.log('シンプルログアウト修正システム初期化完了');
})();