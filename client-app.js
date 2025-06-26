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
        // 将来的に協賛店登録モーダルを開く
        alert('協賛店登録機能は開発中です');
      });
    }
    
    if (sponsorLoginBtn) {
      sponsorLoginBtn.addEventListener('click', function() {
        console.log('協賛店ログインボタンがクリックされました');
        // 将来的に協賛店ログインモーダルを開く
        alert('協賛店ログイン機能は開発中です');
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
  });
  
})();