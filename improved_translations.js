// インラインスクリプトのJavaScriptエラーを修正
document.addEventListener('DOMContentLoaded', function() {
  console.log('修正スクリプトを実行します');
  
  // 非表示モーダルのバックドロップを削除
  function clearBackdrops() {
    document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    });
  }
  
  // 新規登録ボタン
  const registerButton = document.querySelector('a.btn.btn-warning');
  if (registerButton) {
    registerButton.onclick = function(e) {
      e.preventDefault();
      
      clearBackdrops();
      
      const userTypeModal = document.getElementById('userTypeModal');
      if (userTypeModal) {
        document.querySelectorAll('.modal.show').forEach(function(modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
        });
        
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.style.opacity = '0.25';
        document.body.appendChild(backdrop);
        
        userTypeModal.classList.add('show');
        userTypeModal.style.display = 'block';
        userTypeModal.setAttribute('aria-modal', 'true');
        userTypeModal.removeAttribute('aria-hidden');
        
        document.body.classList.add('modal-open');
      }
      return false;
    };
  }
  
  // ログインボタン
  const loginButton = document.querySelector('a[data-bs-target="#loginModal"]');
  if (loginButton) {
    loginButton.onclick = function(e) {
      e.preventDefault();
      
      clearBackdrops();
      
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        document.querySelectorAll('.modal.show').forEach(function(modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
          modal.removeAttribute('aria-modal');
        });
        
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.style.opacity = '0.25';
        document.body.appendChild(backdrop);
        
        loginModal.classList.add('show');
        loginModal.style.display = 'block';
        loginModal.setAttribute('aria-modal', 'true');
        loginModal.removeAttribute('aria-hidden');
        
        document.body.classList.add('modal-open');
      }
      return false;
    };
  }
});
