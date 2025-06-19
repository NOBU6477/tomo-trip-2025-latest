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
    // テスト用ログインボタンを追加
    const navbar = document.querySelector('.navbar-nav');
    if (navbar) {
      const testLoginHTML = `
        <li class="nav-item dropdown">
          <button class="btn btn-sm btn-warning dropdown-toggle me-2" type="button" data-bs-toggle="dropdown">
            テスト
          </button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" onclick="testLogin()">観光客ログイン</button></li>
            <li><button class="dropdown-item" onclick="testLogout()">ログアウト</button></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" onclick="checkLoginStatus()">ログイン状態確認</button></li>
          </ul>
        </li>
      `;
      navbar.insertAdjacentHTML('beforeend', testLoginHTML);
    }
  }

  function checkExistingLogin() {
    const touristData = localStorage.getItem('touristData');
    const guideData = sessionStorage.getItem('guideData');
    
    if (touristData || guideData) {
      updateLoginUI(true);
    }
  }

  function updateLoginUI(isLoggedIn) {
    const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
    const statusIndicator = document.createElement('span');
    statusIndicator.className = 'badge bg-success ms-2';
    statusIndicator.textContent = 'ログイン済み';
    
    if (isLoggedIn) {
      if (loginBtn && !loginBtn.querySelector('.badge')) {
        loginBtn.appendChild(statusIndicator);
      }
    } else {
      const existingBadge = loginBtn?.querySelector('.badge');
      if (existingBadge) {
        existingBadge.remove();
      }
    }
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