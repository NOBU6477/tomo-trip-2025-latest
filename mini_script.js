// シンプルなイベントハンドラスクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('ミニスクリプトを初期化しました');
  
  // 言語切替機能
  function changeLanguage(lang) {
    if (window.i18n && window.i18n.setLanguage) {
      window.i18n.setLanguage(lang);
      document.getElementById('current-language').textContent = lang === 'ja' ? '日本語' : 'English';
      console.log('言語を' + lang + 'に変更しました');
    }
  }
  
  // ログインフォーム処理
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('ログインフォームが送信されました');
      
      // ログイン成功時の処理
      document.getElementById('user-info').classList.remove('d-none');
      const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      if (loginModal) loginModal.hide();
      
      // UIを更新
      document.querySelectorAll('.nav-link[data-i18n="nav.login"]').forEach(function(el) {
        el.style.display = 'none';
      });
      document.querySelectorAll('.nav-link[data-i18n="nav.register"]').forEach(function(el) {
        el.style.display = 'none';
      });
    });
  }
  
  // 言語切替イベント
  document.querySelectorAll('.dropdown-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      const lang = this.getAttribute('onclick').match(/'([^']+)'/)[1];
      changeLanguage(lang);
    });
  });
  
  // 初期言語設定
  changeLanguage('ja');
});
