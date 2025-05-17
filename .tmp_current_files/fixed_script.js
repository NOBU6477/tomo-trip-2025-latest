// 修正済みスクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('修正済みスクリプトを読み込みました');
  
  // 新規登録ボタンのイベント処理
  const registerBtn = document.getElementById('register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('新規登録ボタンがクリックされました');
      
      // ユーザータイプモーダルを表示
      const modal = new bootstrap.Modal(document.getElementById('userTypeModal'));
      modal.show();
    });
  }
  
  // 観光客として登録ボタンのイベント処理
  const touristRegisterBtn = document.getElementById('tourist-register-btn');
  if (touristRegisterBtn) {
    touristRegisterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('観光客として登録ボタンがクリックされました');
      
      // 現在のモーダルを閉じる
      const currentModal = bootstrap.Modal.getInstance(document.getElementById('userTypeModal'));
      if (currentModal) currentModal.hide();
      
      // 観光客登録モーダルを表示
      const modal = new bootstrap.Modal(document.getElementById('touristRegisterModal'));
      modal.show();
    });
  }
  
  // ガイドとして登録ボタンのイベント処理
  const guideRegisterBtn = document.getElementById('guide-register-btn');
  if (guideRegisterBtn) {
    guideRegisterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('ガイドとして登録ボタンがクリックされました');
      
      // 現在のモーダルを閉じる
      const currentModal = bootstrap.Modal.getInstance(document.getElementById('userTypeModal'));
      if (currentModal) currentModal.hide();
      
      // ガイド登録モーダルを表示
      const modal = new bootstrap.Modal(document.getElementById('guideRegisterModal'));
      modal.show();
    });
  }
  
  // 本人確認書類アップロードボタン（観光客）
  const touristUploadBtn = document.getElementById('tourist-upload-id');
  if (touristUploadBtn) {
    touristUploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('観光客本人確認書類アップロードボタンがクリックされました');
      
      // 現在のモーダルを閉じる
      const currentModal = bootstrap.Modal.getInstance(document.getElementById('touristRegisterModal'));
      if (currentModal) currentModal.hide();
      
      // フォームにユーザータイプを設定
      const typeField = document.querySelector('#idDocumentModal input[name="user-type"]');
      if (typeField) typeField.value = 'tourist';
      
      // 身分証明書モーダルを表示
      const modal = new bootstrap.Modal(document.getElementById('idDocumentModal'));
      modal.show();
    });
  }
  
  // 本人確認書類アップロードボタン（ガイド）
  const guideUploadBtn = document.getElementById('guide-upload-id');
  if (guideUploadBtn) {
    guideUploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('ガイド本人確認書類アップロードボタンがクリックされました');
      
      // 現在のモーダルを閉じる
      const currentModal = bootstrap.Modal.getInstance(document.getElementById('guideRegisterModal'));
      if (currentModal) currentModal.hide();
      
      // フォームにユーザータイプを設定
      const typeField = document.querySelector('#idDocumentModal input[name="user-type"]');
      if (typeField) typeField.value = 'guide';
      
      // 身分証明書モーダルを表示
      const modal = new bootstrap.Modal(document.getElementById('idDocumentModal'));
      modal.show();
    });
  }
  
  // 身分証明書タイプ変更時の処理
  const documentTypeSelect = document.getElementById('document-type');
  if (documentTypeSelect) {
    documentTypeSelect.addEventListener('change', function() {
      // すべての書類フォームを非表示
      document.querySelectorAll('.document-upload').forEach(function(el) {
        el.classList.add('d-none');
      });
      
      // 選択されたタイプのフォームを表示
      const selectedType = this.value;
      if (selectedType === 'passport') {
        document.getElementById('passport-upload').classList.remove('d-none');
      } else if (selectedType === 'driverLicense') {
        document.getElementById('license-upload').classList.remove('d-none');
      } else if (selectedType === 'idCard') {
        document.getElementById('idcard-upload').classList.remove('d-none');
      }
    });
  }
  
  // ファイル選択時のプレビュー
  document.querySelectorAll('input[type="file"]').forEach(function(input) {
    input.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const fileId = this.id;
        const previewId = fileId.replace('file', 'preview');
        const imageId = fileId.replace('file', 'image');
        const promptId = fileId.replace('file', 'upload-prompt');
        
        // ファイルを読み込んでプレビュー表示
        const reader = new FileReader();
        reader.onload = function(e) {
          const preview = document.getElementById(previewId);
          const image = document.getElementById(imageId);
          const prompt = document.getElementById(promptId);
          
          if (preview && image && prompt) {
            image.src = e.target.result;
            preview.classList.remove('d-none');
            prompt.classList.add('d-none');
          }
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  });
  
  // ファイル削除ボタン
  document.querySelectorAll('.remove-file').forEach(function(button) {
    button.addEventListener('click', function() {
      const inputId = this.getAttribute('data-input');
      const input = document.getElementById(inputId);
      if (input) {
        input.value = '';
        
        const previewId = inputId.replace('file', 'preview');
        const promptId = inputId.replace('file', 'upload-prompt');
        
        document.getElementById(previewId).classList.add('d-none');
        document.getElementById(promptId).classList.remove('d-none');
      }
    });
  });
  
  // 言語切替機能
  window.changeLanguage = function(lang) {
    if (window.i18n && typeof window.i18n.setLanguage === 'function') {
      window.i18n.setLanguage(lang);
      
      // 表示言語の更新
      const currentLangElement = document.getElementById('current-language');
      if (currentLangElement) {
        currentLangElement.textContent = lang === 'ja' ? '日本語' : 'English';
      }
      
      console.log('言語を ' + lang + ' に変更しました');
    }
  };
  
  // ログインフォーム処理
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('ログインフォームが送信されました');
      
      // ログイン成功時の表示
      document.getElementById('user-info').classList.remove('d-none');
      
      // モーダルを閉じる
      const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      if (modal) modal.hide();
      
      // ログイン/登録ボタンを非表示
      document.querySelectorAll('.btn[data-i18n="nav.login"], .btn[data-i18n="nav.register"]').forEach(function(el) {
        el.style.display = 'none';
      });
    });
  }
  
  // 初期言語設定
  if (typeof window.changeLanguage === 'function') {
    window.changeLanguage('ja');
  }
  
  // ページ読み込み時にユーザー状態を確認
  const currentUser = getCurrentUser();
  if (currentUser) {
    updateUIForLoggedInUser(currentUser);
  }
});

/**
 * 現在のログインユーザー情報を取得
 * @returns {Object|null} ユーザー情報
 */
function getCurrentUser() {
  try {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error('ユーザー情報の取得エラー:', e);
    return null;
  }
}

/**
 * ユーザー情報を保存
 * @param {Object} user ユーザー情報
 */
function setCurrentUser(user) {
  try {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    updateUIForLoggedInUser(user);
  } catch (e) {
    console.error('ユーザー情報の保存エラー:', e);
  }
}

/**
 * ユーザー情報をクリア（ログアウト）
 */
function clearCurrentUser() {
  sessionStorage.removeItem('currentUser');
  updateUIForLoggedOutUser();
}

/**
 * ログイン状態のUIを更新
 * @param {Object} user ユーザー情報
 */
function updateUIForLoggedInUser(user) {
  if (!user) return;
  
  // ログイン/登録ボタンを非表示
  document.querySelectorAll('.btn[data-i18n="nav.login"], #register-btn').forEach(function(el) {
    el.style.display = 'none';
  });
  
  // ユーザー種別に応じたメニュー表示
  const userType = user.userType;
  
  // ガイドメニュー表示
  if (userType === 'guide') {
    document.querySelectorAll('.guide-only').forEach(el => {
      el.classList.remove('d-none');
    });
  }
  
  // 観光客メニュー表示
  if (userType === 'tourist') {
    document.querySelectorAll('.tourist-only').forEach(el => {
      el.classList.remove('d-none');
    });
  }
  
  // ログアウトボタン表示
  const loginLink = document.querySelector('.btn[data-i18n="nav.login"]');
  if (loginLink) {
    const parentElement = loginLink.parentElement;
    const logoutBtn = document.createElement('a');
    logoutBtn.className = 'btn btn-outline-light ms-2';
    logoutBtn.href = '#';
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'ログアウト';
    logoutBtn.setAttribute('data-i18n', 'nav.logout');
    
    // ログインリンクを非表示にして、代わりにログアウトボタンを表示
    loginLink.style.display = 'none';
    parentElement.appendChild(logoutBtn);
    
    // ログアウトボタンのイベント
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      clearCurrentUser();
      window.location.href = '/';
    });
  }
}

/**
 * ログアウト状態のUIを更新
 */
function updateUIForLoggedOutUser() {
  // ログイン/登録ボタンを表示
  document.querySelectorAll('.btn[data-i18n="nav.login"], #register-btn').forEach(function(el) {
    el.style.display = '';
  });
  
  // すべてのユーザー種別メニューを非表示
  document.querySelectorAll('.guide-only, .tourist-only').forEach(el => {
    el.classList.add('d-none');
  });
  
  // ログアウトボタン削除
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.remove();
  }
}

// グローバル関数として言語切替関数を定義
function changeLanguage(lang) {
  if (window.i18n && typeof window.i18n.setLanguage === 'function') {
    window.i18n.setLanguage(lang);
    
    // 表示言語の更新
    const currentLangElement = document.getElementById('current-language');
    if (currentLangElement) {
      currentLangElement.textContent = lang === 'ja' ? '日本語' : 'English';
    }
    
    console.log('言語を ' + lang + ' に変更しました');
  }
}