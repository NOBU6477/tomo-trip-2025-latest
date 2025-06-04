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
      // 開発中のため、すべてのユーザーがガイド詳細を閲覧可能に変更
      // 観光客ログイン機能が完成するまでの暫定対応
      if (isLoggedIn || true) { // 暫定的にすべてのアクセスを許可
        // ガイド詳細コンテンツを表示
        detailsContent.classList.remove('d-none');
        loginPrompt.classList.add('d-none');
        
        console.log('ガイド詳細ページへのアクセスを許可（開発中暫定対応）');
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
  
  // ガイド専用機能へのアクセス制御
  document.addEventListener('click', function(e) {
    // ガイド登録・プロフィール関連のリンク（ページ内での制御はスキップ）
    if (e.target.closest('[href="bootstrap_solution.html"]') && !window.location.pathname.includes('guide-profile.html')) {
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      const userType = sessionStorage.getItem('userType');
      
      if (isLoggedIn && userType === 'tourist') {
        e.preventDefault();
        showUserTypeAccessModal(
          'ガイド専用機能です', 
          '現在観光客アカウントでログインされています。ガイド機能を利用するには、ガイドアカウントが必要です。',
          'guide'
        );
        return false;
      }
    }
    
    // 観光客専用機能（ガイド詳細など）
    if (e.target.closest('.guide-card, .guide-details-link')) {
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      const userType = sessionStorage.getItem('userType');
      
      if (isLoggedIn && userType === 'guide') {
        e.preventDefault();
        showUserTypeAccessModal(
          '観光客専用機能です',
          '現在ガイドアカウントでログインされています。ガイド詳細を見るには観光客アカウントが必要です。',
          'tourist'
        );
        return false;
      }
    }
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

/**
 * ユーザータイプアクセスモーダルを表示
 * @param {string} title モーダルタイトル
 * @param {string} message メッセージ
 * @param {string} requiredUserType 必要なユーザータイプ ('guide' または 'tourist')
 */
function showUserTypeAccessModal(title, message, requiredUserType) {
  const currentUserType = sessionStorage.getItem('userType') || '未ログイン';
  
  const modalHtml = `
    <div class="modal fade" id="userTypeAccessModal" tabindex="-1" aria-labelledby="userTypeAccessModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-warning">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title" id="userTypeAccessModalLabel">
              <i class="bi bi-exclamation-triangle me-2"></i>${title}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">${message}</p>
            <div class="row">
              <div class="col-md-6">
                <div class="alert alert-info">
                  <small><strong>現在のユーザータイプ:</strong><br>${getUserTypeDisplayText(currentUserType)}</small>
                </div>
              </div>
              <div class="col-md-6">
                <div class="alert alert-success">
                  <small><strong>必要なユーザータイプ:</strong><br>${getUserTypeDisplayText(requiredUserType)}</small>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2 flex-wrap justify-content-center">
              ${getActionButtons(requiredUserType)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 既存のモーダルを削除
  const existingModal = document.getElementById('userTypeAccessModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // 新しいモーダルを追加
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // モーダルを表示
  const modal = new bootstrap.Modal(document.getElementById('userTypeAccessModal'));
  modal.show();
}

/**
 * ユーザータイプの表示テキストを取得
 */
function getUserTypeDisplayText(userType) {
  switch(userType) {
    case 'guide': return 'ガイド';
    case 'tourist': return '観光客';
    default: return '未ログイン';
  }
}

/**
 * 必要なユーザータイプに応じたアクションボタンを生成
 */
function getActionButtons(requiredUserType) {
  if (requiredUserType === 'guide') {
    return `
      <a href="bootstrap_solution.html" class="btn btn-primary">
        <i class="bi bi-person-plus me-1"></i>ガイド登録
      </a>
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
        <i class="bi bi-x me-1"></i>キャンセル
      </button>
    `;
  } else if (requiredUserType === 'tourist') {
    return `
      <button type="button" class="btn btn-primary" onclick="showTouristLogin()">
        <i class="bi bi-person-check me-1"></i>観光客ログイン
      </button>
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
        <i class="bi bi-x me-1"></i>キャンセル
      </button>
    `;
  }
  
  return `
    <a href="bootstrap_solution.html" class="btn btn-primary me-2">
      <i class="bi bi-person-plus me-1"></i>ガイド登録
    </a>
    <button type="button" class="btn btn-outline-primary" onclick="showTouristLogin()">
      <i class="bi bi-person-check me-1"></i>観光客ログイン
    </button>
  `;
}

/**
 * 観光客ログインを表示
 */
function showTouristLogin() {
  // モーダルを閉じてからアラートを表示
  const currentModal = bootstrap.Modal.getInstance(document.getElementById('userTypeAccessModal'));
  if (currentModal) {
    currentModal.hide();
  }
  
  setTimeout(() => {
    alert('観光客ログイン機能は開発中です。現在はガイド登録のみ利用可能です。');
  }, 300);
}