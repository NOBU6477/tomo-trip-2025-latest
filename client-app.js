/**
 * クライアントサイド専用スクリプト
 * ブラウザ環境でのみ動作する機能を提供
 */

(function() {
  'use strict';
  
  console.log('TomoTrip クライアントアプリケーション開始');
  
  // 協賛店ボタンの機能を追加
  function initSponsorButtons() {
    const sponsorRegisterBtn = document.getElementById('sponsorRegisterBtn');
    const sponsorLoginBtn = document.getElementById('sponsorLoginBtn');
    
    if (sponsorRegisterBtn) {
      sponsorRegisterBtn.addEventListener('click', function() {
        console.log('協賛店登録ボタンがクリックされました');
        window.location.href = 'sponsor-registration.html';
      });
    }
    
    if (sponsorLoginBtn) {
      sponsorLoginBtn.addEventListener('click', function() {
        console.log('協賛店ログインボタンがクリックされました');
        // 簡単なメニューを表示
        const menu = document.createElement('div');
        menu.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          z-index: 10000;
          text-align: center;
          min-width: 300px;
        `;
        
        menu.innerHTML = `
          <h4 style="margin-bottom: 20px; color: #333;">協賛店メニュー</h4>
          <button class="btn btn-primary btn-lg mb-3 w-100" onclick="window.location.href='sponsor-list.html'; document.body.removeChild(this.closest('div'));">
            <i class="bi bi-list"></i> 協賛店一覧
          </button>
          <button class="btn btn-success btn-lg mb-3 w-100" onclick="window.location.href='sponsor-management.html'; document.body.removeChild(this.closest('div'));">
            <i class="bi bi-pencil-square"></i> 店舗管理
          </button>
          <button class="btn btn-outline-secondary btn-lg w-100" onclick="document.body.removeChild(this.closest('div'));">
            <i class="bi bi-x"></i> キャンセル
          </button>
        `;
        
        // 背景オーバーレイ
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 9999;
        `;
        overlay.onclick = () => {
          document.body.removeChild(overlay);
          document.body.removeChild(menu);
        };
        
        document.body.appendChild(overlay);
        document.body.appendChild(menu);
      });
    }
  }
  
  // DOMが読み込まれたら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSponsorButtons);
  } else {
    initSponsorButtons();
  }
  
  // ページが完全に読み込まれた後の追加初期化
  window.addEventListener('load', function() {
    console.log('ページ読み込み完了 - クライアントアプリ初期化');
    
    // 協賛店ボタンの存在確認
    const sponsorButtons = document.querySelectorAll('.sponsor-mini-btn');
    console.log(`協賛店ボタン数: ${sponsorButtons.length}`);
    
    // 新しい協賛店が追加された場合の処理
    updateSponsorLogos();
  });
  
  // 協賛店ロゴの更新
  function updateSponsorLogos() {
    const newSponsorAdded = localStorage.getItem('newSponsorAdded');
    if (newSponsorAdded === 'true') {
      console.log('新しい協賛店が追加されました - ロゴを更新');
      
      // トップページの流れるロゴを更新する処理をここに追加
      // 現在は基本的な実装のため、将来的に拡張可能
      
      // フラグをリセット
      localStorage.removeItem('newSponsorAdded');
    }
  }
  
})();