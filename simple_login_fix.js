/**
 * シンプルなログイン機能の修正スクリプト
 * ログイン処理とフォーム検証を簡略化したバージョン
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Simple login fix loaded');
  
  // ログインフォームの送信処理
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      // シンプルな検証
      if (!email || !password) {
        showAlert('メールアドレスとパスワードを入力してください', 'warning');
        return;
      }
      
      // ログイン処理 - デモ用
      showAlert('ログインに成功しました', 'success');
      
      // モーダルを閉じる
      const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      if (loginModal) {
        loginModal.hide();
      }
      
      // UI更新 - ログイン済み状態
      updateUIAfterLogin();
    });
  }
  
  // 新規登録フォームの送信処理
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // シンプルな検証 - デモ用に全て通過させる
      showAlert('登録が完了しました', 'success');
      
      // モーダルを閉じる
      const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
      if (registerModal) {
        registerModal.hide();
      }
      
      // UI更新 - ログイン済み状態
      updateUIAfterLogin();
    });
  }
  
  // アラート表示関数
  function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // 5秒後に自動で閉じる
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => {
        if (alertContainer.contains(alert)) {
          alertContainer.removeChild(alert);
        }
      }, 500);
    }, 5000);
  }
  
  // アラートコンテナがなければ作成
  function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.maxWidth = '400px';
    container.style.zIndex = '9999';
    
    document.body.appendChild(container);
    return container;
  }
  
  // ログイン後のUI更新
  function updateUIAfterLogin() {
    // ヘッダーのユーザーエリアを更新
    updateNavbarUserArea();
    
    // ガイド登録ボタンを非表示
    hideGuideRegisterButton();
    
    // その他のUI更新処理
    updateOtherUIElements();
  }
  
  // ナビゲーションバーのユーザーエリアを更新
  function updateNavbarUserArea() {
    const navbarUserArea = document.getElementById('navbar-user-area');
    if (navbarUserArea) {
      // ユーザードロップダウンメニューを表示
      navbarUserArea.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle me-1"></i> ユーザー名
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>プロフィール</a></li>
            <li><a class="dropdown-item" href="#"><i class="bi bi-calendar-check me-2"></i>予約一覧</a></li>
            <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>アカウント設定</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="bi bi-box-arrow-right me-2"></i>ログアウト</a></li>
          </ul>
        </div>
      `;
      
      // ログアウトボタンの処理
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // ログアウト処理
          showAlert('ログアウトしました', 'info');
          
          // ページをリロードして状態をリセット
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      }
    }
  }
  
  // ガイド登録ボタンを非表示
  function hideGuideRegisterButton() {
    const becomeGuideSection = document.querySelector('.bg-primary.text-white.py-5');
    if (becomeGuideSection) {
      becomeGuideSection.style.display = 'none';
    }
  }
  
  // その他のUI要素を更新
  function updateOtherUIElements() {
    // 予約ボタンのリンク先をログイン後の適切なURLに変更
    const bookButtons = document.querySelectorAll('.btn-primary:not(.dropdown-toggle)');
    bookButtons.forEach(button => {
      if (button.textContent.includes('Book') || button.textContent.includes('予約')) {
        button.href = "/booking.html";
      }
    });
  }
});