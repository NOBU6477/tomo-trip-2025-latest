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
        window.location.href = 'sponsor-list.html';
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