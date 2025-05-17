// 修正済みスクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('修正済みスクリプトを読み込みました');
  
  // デモ用：ユーザーデータのシミュレーション
  simulateDemoUserData();
  
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
      
      // 電話番号認証モーダルを表示
      const phoneModal = new bootstrap.Modal(document.getElementById('phoneVerificationModal'));
      
      // モーダルが完全に表示された後の処理
      document.getElementById('phoneVerificationModal').addEventListener('shown.bs.modal', function() {
        // Firebase Auth SDKの初期化状態を確認
        if (window.firebaseEnabled) {
          console.log('Firebase Auth SDKが利用可能です');
        } else {
          console.warn('Firebase Auth SDKが利用できないため、モック認証を使用します');
        }
      }, { once: true });
      
      // 電話認証が完了した後の処理を設定
      window.onPhoneVerificationComplete = function() {
        console.log('電話認証が完了しました');
        
        // 電話認証モーダルを閉じる
        const phoneVerificationModal = bootstrap.Modal.getInstance(document.getElementById('phoneVerificationModal'));
        if (phoneVerificationModal) phoneVerificationModal.hide();
        
        // 次のステップ：観光客登録モーダルを表示
        setTimeout(() => {
          const touristModal = new bootstrap.Modal(document.getElementById('touristRegisterModal'));
          touristModal.show();
        }, 500);
      };
      
      phoneModal.show();
    });
  }
  
  // ガイドとして登録ボタンのイベント処理
  const guideRegisterBtn = document.getElementById('guide-register-btn');
  const becomeGuideBtn = document.getElementById('become-guide-btn');
  
  function handleGuideRegistration(e) {
    e.preventDefault();
    console.log('ガイドとして登録ボタンがクリックされました');
    
    // 現在のモーダルを閉じる（userTypeModalが親の場合）
    const currentModal = bootstrap.Modal.getInstance(document.getElementById('userTypeModal'));
    if (currentModal) currentModal.hide();
    
    // 電話番号認証モーダルを表示
    const phoneModal = new bootstrap.Modal(document.getElementById('phoneVerificationModal'));
    
    // モーダルが完全に表示された後の処理
    document.getElementById('phoneVerificationModal').addEventListener('shown.bs.modal', function() {
      // Firebase Auth SDKの初期化状態を確認
      if (window.firebaseEnabled) {
        console.log('Firebase Auth SDKが利用可能です');
      } else {
        console.warn('Firebase Auth SDKが利用できないため、モック認証を使用します');
      }
    }, { once: true });
    
    // 電話認証が完了した後の処理を設定
    window.onPhoneVerificationComplete = function() {
      console.log('電話認証が完了しました');
      
      // 電話認証モーダルを閉じる
      const phoneVerificationModal = bootstrap.Modal.getInstance(document.getElementById('phoneVerificationModal'));
      if (phoneVerificationModal) phoneVerificationModal.hide();
      
      // 次のステップ：ガイド登録モーダルを表示
      setTimeout(() => {
        const guideModal = new bootstrap.Modal(document.getElementById('guideRegisterModal'));
        guideModal.show();
      }, 500);
    };
    
    phoneModal.show();
  }
  
  if (guideRegisterBtn) {
    guideRegisterBtn.addEventListener('click', handleGuideRegistration);
  }
  
  if (becomeGuideBtn) {
    becomeGuideBtn.addEventListener('click', handleGuideRegistration);
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
  
  // 言語切替機能（i18n.jsの中での実装を使用）
  console.log('言語切替機能の初期化が完了しました');
  
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
  if (window.initializeLanguage && typeof window.initializeLanguage === 'function') {
    window.initializeLanguage();
  } else {
    console.warn('初期言語設定機能が利用できません');
  }
});

// グローバル関数として言語切替を実装
// i18n.jsの同名関数との互換性のために残す
function changeLanguage(lang) {
  console.log('言語切替関数が呼び出されました:', lang);
  
  // i18n.jsのwindow.changeLanguage関数が定義されていればそれを使用
  if (window.translationSystem && typeof window.translationSystem.changeLanguage === 'function') {
    return window.translationSystem.changeLanguage(lang);
  }
  
  // fallback: 言語切替用の翻訳データがあれば適用
  const translations = (lang === 'ja') ? window.translations_ja : 
                      (lang === 'en') ? window.translations_en : null;
  
  if (translations) {
    // 言語表示の更新
    document.getElementById('current-language').textContent = 
      lang === 'ja' ? '日本語' : 'English';
    
    // ページ内の翻訳要素を更新
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });
    
    // 言語設定を保存
    localStorage.setItem('preferredLanguage', lang);
    return true;
  }
  
  return false;
}

// API関連の機能
async function fetchAPI(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`/api${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    throw error;
  }
}

// ユーザー情報関連
function getCurrentUser() {
  const userInfo = localStorage.getItem('currentUser');
  return userInfo ? JSON.parse(userInfo) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

// UIの更新
function updateUIForLoggedInUser(user) {
  document.getElementById('user-info').classList.remove('d-none');
  document.getElementById('username').textContent = `${user.firstName} ${user.lastName}`;
  document.getElementById('user-type').textContent = user.type === 'guide' ? 'ガイド' : '観光客';
  
  // ログイン/登録ボタンを非表示
  document.querySelectorAll('.btn[data-i18n="nav.login"], .btn[data-i18n="nav.register"]').forEach(function(el) {
    el.style.display = 'none';
  });
  
  // パーソナライズされたウェルカムセクションを更新（ある場合）
  if (window.personalizedUI && typeof window.personalizedUI.renderWelcomeSection === 'function') {
    window.personalizedUI.renderWelcomeSection('personalized-welcome');
  }
}

function updateUIForLoggedOutUser() {
  document.getElementById('user-info').classList.add('d-none');
  
  // ログイン/登録ボタンを表示
  document.querySelectorAll('.btn[data-i18n="nav.login"], .btn[data-i18n="nav.register"]').forEach(function(el) {
    el.style.display = '';
  });
  
  // パーソナライズされたウェルカムセクションを更新（ある場合）
  if (window.personalizedUI && typeof window.personalizedUI.renderWelcomeSection === 'function') {
    window.personalizedUI.renderWelcomeSection('personalized-welcome');
  }
}

// デモ用：ユーザーデータのシミュレーション
function simulateDemoUserData() {
  // すでにユーザーデータがある場合は何もしない
  if (getCurrentUser()) return;
  
  // デモ用のユーザーデータを作成
  const demoUser = {
    id: 10001,
    username: "tanaka_tourist",
    email: "tanaka@example.com",
    firstName: "太郎",
    lastName: "田中",
    type: "tourist",
    profileImage: null,
    phoneNumber: "+819012345678",
    phoneVerificationStatus: "verified"
  };
  
  // 適度な確率で別のユーザータイプを表示（ガイド）
  if (Math.random() > 0.7) {
    demoUser.type = "guide";
    demoUser.username = "yamada_guide";
    demoUser.firstName = "花子";
    demoUser.lastName = "山田";
  }
  
  // ユーザーデータを保存
  setCurrentUser(demoUser);
  
  // UIを更新
  updateUIForLoggedInUser(demoUser);
}
