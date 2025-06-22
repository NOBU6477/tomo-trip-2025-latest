/**
 * 認証テストヘルパー
 * デバッグ用の認証状態制御
 */

(function() {
  'use strict';
  
  // デバッグ用のログアウト機能をグローバルに追加
  window.debugLogout = function() {
    localStorage.removeItem('touristData');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('pendingGuideId');
    console.log('デバッグ: 全認証データを削除しました');
    
    // ページをリロード
    window.location.reload();
  };
  
  // デバッグ用の認証状態確認
  window.debugCheckAuth = function() {
    const touristData = localStorage.getItem('touristData');
    const sessionData = sessionStorage.getItem('currentUser');
    const pendingGuideId = sessionStorage.getItem('pendingGuideId');
    
    console.log('=== 認証状態デバッグ ===');
    console.log('touristData:', touristData);
    console.log('sessionData:', sessionData);
    console.log('pendingGuideId:', pendingGuideId);
    console.log('=====================');
    
    return {
      touristData,
      sessionData,
      pendingGuideId
    };
  };
  
  // ページ読み込み時に認証状態をログ出力
  document.addEventListener('DOMContentLoaded', function() {
    console.log('ページ読み込み完了 - 認証状態確認');
    window.debugCheckAuth();
  });
  
  // コンソールに使用方法を表示
  console.log('=== 認証デバッグ機能 ===');
  console.log('debugLogout() - 全ログアウト');
  console.log('debugCheckAuth() - 認証状態確認');
  console.log('======================');
  
})();