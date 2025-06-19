/**
 * テスト用ログイン機能
 * ガイド詳細ページへの遷移をテストするためのシンプルなログイン
 */

(function() {
  'use strict';

  // テスト用ユーザーデータ
  const testTouristData = {
    id: 'test_tourist_001',
    name: 'テスト太郎',
    email: 'test@example.com',
    phone: '090-1234-5678',
    loginTime: new Date().toISOString()
  };

  // ページ読み込み時にテストボタンを追加
  document.addEventListener('DOMContentLoaded', function() {
    addTestLoginButton();
    checkExistingLogin();
  });

  function addTestLoginButton() {
    // テスト用ログインボタンを追加（本番では非表示）
    // 開発者コンソールから window.testLogin() で呼び出し可能
    return; // 本番では表示しない
  }

  function checkExistingLogin() {
    const touristData = localStorage.getItem('touristData');
    const guideData = sessionStorage.getItem('guideData');
    
    if (touristData || guideData) {
      updateLoginUI(true);
    }
  }

  function updateLoginUI(isLoggedIn) {
    // UI更新は本番では行わない（ログイン状態は内部で管理）
    return;
  }

  // グローバル関数として公開
  window.testLogin = function() {
    localStorage.setItem('touristData', JSON.stringify(testTouristData));
    updateLoginUI(true);
    alert('テスト用観光客としてログインしました\n名前: ' + testTouristData.name + '\nメール: ' + testTouristData.email);
  };

  window.testLogout = function() {
    localStorage.removeItem('touristData');
    sessionStorage.removeItem('guideData');
    updateLoginUI(false);
    alert('ログアウトしました');
  };

  window.checkLoginStatus = function() {
    const touristData = localStorage.getItem('touristData');
    const guideData = sessionStorage.getItem('guideData');
    
    if (touristData) {
      const user = JSON.parse(touristData);
      alert('観光客としてログイン中\n名前: ' + user.name + '\nメール: ' + user.email);
    } else if (guideData) {
      const guide = JSON.parse(guideData);
      alert('ガイドとしてログイン中\n名前: ' + guide.name);
    } else {
      alert('ログインしていません');
    }
  };

})();