/**
 * アクセス制御モジュール
 * ログイン状態に応じたコンテンツアクセス制御とUIの調整を行う
 */

document.addEventListener('DOMContentLoaded', function() {
  // URLパラメータを確認してアクションを実行
  checkUrlParams();
  
  // ガイドカードへのアクセス制御を設定
  setupGuideCardAccess();
  
  // グローバル関数として公開
  window.applyAccessControls = applyAccessControls;
});

/**
 * アクセス制限が必要な要素を制御
 */
function applyAccessControls(isLoggedIn, userType) {
  console.log('アクセス制御を適用:', isLoggedIn, userType);
  
  // 制限付きコンテンツの要素
  const restrictedElements = document.querySelectorAll('.restricted-content');
  const guideOnlyElements = document.querySelectorAll('.guide-only');
  const touristOnlyElements = document.querySelectorAll('.tourist-only');
  
  // ログイン必須のコンテンツ
  restrictedElements.forEach(element => {
    if (isLoggedIn) {
      element.classList.remove('content-restricted');
    } else {
      element.classList.add('content-restricted');
    }
  });
  
  // ガイド専用コンテンツ
  guideOnlyElements.forEach(element => {
    if (isLoggedIn && userType === 'guide') {
      element.classList.remove('d-none');
    } else {
      element.classList.add('d-none');
    }
  });
  
  // 観光客専用コンテンツ
  touristOnlyElements.forEach(element => {
    if (isLoggedIn && userType === 'tourist') {
      element.classList.remove('d-none');
    } else {
      element.classList.add('d-none');
    }
  });
  
  // 現在のページに応じた特別な処理
  handlePageSpecificAccess(isLoggedIn, userType);
}

/**
 * ページ固有のアクセス制御
 */
function handlePageSpecificAccess(isLoggedIn, userType) {
  const currentPage = window.location.pathname.split('/').pop();
  
  // ガイド詳細ページ
  if (currentPage === 'guide-details.html') {
    const detailsContent = document.querySelector('.guide-details-content');
    const loginPrompt = document.querySelector('.guide-details-login-prompt');
    
    if (detailsContent && loginPrompt) {
      if (isLoggedIn && userType === 'tourist') {
        // ガイド詳細コンテンツを表示
        detailsContent.classList.remove('d-none');
        loginPrompt.classList.add('d-none');
        
        // ログイン成功メッセージは表示しない（tourist-login.jsで制御）
      } else {
        detailsContent.classList.add('d-none');
        loginPrompt.classList.remove('d-none');
      }
    }
  }
  
  // メッセージページ
  if (currentPage === 'messages.html') {
    const messagesContent = document.querySelector('.messages-container');
    const messagesLoginPrompt = document.querySelector('.messages-login-prompt');
    
    if (messagesContent && messagesLoginPrompt) {
      if (isLoggedIn) {
        messagesContent.classList.remove('d-none');
        messagesLoginPrompt.classList.add('d-none');
      } else {
        messagesContent.classList.add('d-none');
        messagesLoginPrompt.classList.remove('d-none');
      }
    }
  }
  
  // 予約ページ
  if (currentPage === 'bookings.html') {
    const bookingsContent = document.querySelector('.bookings-container');
    const bookingsLoginPrompt = document.querySelector('.bookings-login-prompt');
    
    if (bookingsContent && bookingsLoginPrompt) {
      if (isLoggedIn) {
        bookingsContent.classList.remove('d-none');
        bookingsLoginPrompt.classList.add('d-none');
      } else {
        bookingsContent.classList.add('d-none');
        bookingsLoginPrompt.classList.remove('d-none');
      }
    }
  }
}

/**
 * ガイドカードへのアクセス制御
 */
function setupGuideCardAccess() {
  // ガイドカードのリンククリック時の処理
  const guideCardLinks = document.querySelectorAll('.guide-details-link');
  guideCardLinks.forEach(link => {
    // イベントリスナーはtourist-login.jsにて設定
  });
}

/**
 * URLパラメータをチェックして対応するアクション実行
 */
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // アラートメッセージパラメータの確認
  const alertMessage = urlParams.get('message');
  const alertType = urlParams.get('type') || 'info';
  
  if (alertMessage) {
    showAccessAlert(decodeURIComponent(alertMessage), alertType);
  }
  
  // ログインプロンプトパラメータの確認
  const promptLogin = urlParams.get('login');
  if (promptLogin === 'required') {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    if (loginModal) {
      loginModal.show();
    }
  }
}

/**
 * アラートメッセージを表示
 */
function showAccessAlert(message, type = 'warning') {
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) {
    console.error('アラートコンテナが見つかりません');
    return;
  }
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  alertContainer.appendChild(alert);
  
  // 5秒後に自動で消える
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => {
      alert.remove();
    }, 300);
  }, 5000);
}