/**
 * 観光客プロフィール登録関連のハンドラ
 * 写真アップロードや趣味・興味選択の処理を管理
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log("観光客プロフィール登録ハンドラーを初期化");
  setupTouristProfilePhotoUpload();
  setupTouristPreferences();
  setupPasswordVisibilityToggles();
});

/**
 * 観光客プロフィール写真アップロード機能の設定
 */
function setupTouristProfilePhotoUpload() {
  const photoInput = document.getElementById('tourist-photo-input');
  const photoSelect = document.getElementById('tourist-photo-select');
  const photoCamera = document.getElementById('tourist-photo-camera');
  const photoPreview = document.getElementById('tourist-photo-preview');
  const photoImage = document.getElementById('tourist-photo-image');
  const photoRemove = document.getElementById('tourist-photo-remove');
  const photoPrompt = document.getElementById('tourist-photo-prompt');
  
  if (!photoInput || !photoSelect) return;
  
  // 写真選択ボタンのクリックイベント
  photoSelect.addEventListener('click', function() {
    photoInput.click();
  });
  
  // カメラ撮影ボタンのクリックイベント
  if (photoCamera) {
    photoCamera.addEventListener('click', function() {
      // スマホのカメラを起動
      photoInput.setAttribute('capture', 'user');
      photoInput.setAttribute('accept', 'image/*');
      photoInput.click();
    });
  }
  
  // ファイル選択イベント
  photoInput.addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      
      // ファイルサイズチェック (5MB以下)
      if (file.size > 5 * 1024 * 1024) {
        showError('ファイルサイズは5MB以下にしてください');
        this.value = '';
        return;
      }
      
      // ファイル形式チェック
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showError('JPGまたはPNG形式の画像を選択してください');
        this.value = '';
        return;
      }
      
      // プレビュー表示
      const reader = new FileReader();
      reader.onload = function(e) {
        photoImage.src = e.target.result;
        photoPreview.classList.remove('d-none');
        photoPrompt.classList.add('d-none');
      };
      reader.readAsDataURL(file);
    }
  });
  
  // 写真削除ボタン
  if (photoRemove) {
    photoRemove.addEventListener('click', function() {
      photoInput.value = '';
      photoPreview.classList.add('d-none');
      photoPrompt.classList.remove('d-none');
    });
  }
}

/**
 * 観光客の旅行プリファレンス設定機能
 */
function setupTouristPreferences() {
  // 関心カテゴリのチェックボックス管理
  const interestCheckboxes = document.querySelectorAll('.interests-checkboxes input[type="checkbox"]');
  
  // 少なくとも1つは選択するようにフォーム送信前に確認
  const touristForm = document.getElementById('tourist-register-form');
  if (touristForm) {
    touristForm.addEventListener('submit', function(e) {
      // フォーム送信時に選択された関心カテゴリを確認
      const checkedInterests = document.querySelectorAll('.interests-checkboxes input[type="checkbox"]:checked');
      if (checkedInterests.length === 0) {
        e.preventDefault();
        showError('関心のあるカテゴリーを少なくとも1つ選択してください');
        return false;
      }
      
      // 選択された言語プリファレンスを確認
      const checkedLanguages = document.querySelectorAll('.language-preferences input[type="checkbox"]:checked');
      if (checkedLanguages.length === 0) {
        e.preventDefault();
        showError('希望する言語を少なくとも1つ選択してください');
        return false;
      }
      
      // フォーム送信時にローディング表示
      const loadingElement = document.getElementById('tourist-form-loading');
      if (loadingElement) {
        loadingElement.classList.remove('d-none');
      }
      
      // フォームデータの収集
      const formData = collectTouristFormData();
      
      // 観光客登録処理の実行
      submitTouristRegistration(formData, e);
    });
  }
}

/**
 * 観光客登録フォームからデータを収集
 * @returns {Object} 登録フォームデータ
 */
function collectTouristFormData() {
  // 基本情報
  const formData = {
    type: 'tourist',
    firstName: document.getElementById('tourist-firstname').value,
    lastName: document.getElementById('tourist-lastname').value,
    username: document.getElementById('tourist-username').value,
    email: document.getElementById('tourist-email').value,
    phone: document.getElementById('tourist-phone').value,
    password: document.getElementById('tourist-password').value,
    gender: document.getElementById('tourist-gender').value,
    ageRange: document.getElementById('tourist-age').value,
    
    // プリファレンス情報
    interests: [],
    languages: [],
    budget: document.getElementById('tourist-budget').value,
    stayLength: document.getElementById('tourist-stay-length').value
  };
  
  // 関心カテゴリの収集
  document.querySelectorAll('.interests-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
    formData.interests.push(checkbox.value);
  });
  
  // 言語プリファレンスの収集
  document.querySelectorAll('.language-preferences input[type="checkbox"]:checked').forEach(checkbox => {
    formData.languages.push(checkbox.value);
  });
  
  // プロフィール写真の収集
  const photoInput = document.getElementById('tourist-photo-input');
  if (photoInput && photoInput.files && photoInput.files[0]) {
    formData.profilePhoto = photoInput.files[0];
  }
  
  return formData;
}

/**
 * 観光客登録データをサーバーに送信
 * @param {Object} formData 観光客登録データ
 * @param {Event} event フォーム送信イベント
 */
function submitTouristRegistration(formData, event) {
  if (event) {
    event.preventDefault();
  }
  
  // FormDataオブジェクトの作成（ファイルアップロード対応）
  const apiFormData = new FormData();
  
  // 基本情報の追加
  for (const key in formData) {
    if (key === 'profilePhoto' || key === 'interests' || key === 'languages') {
      continue; // 特殊処理が必要なフィールドはスキップ
    }
    apiFormData.append(key, formData[key]);
  }
  
  // 配列データの追加
  formData.interests.forEach(interest => {
    apiFormData.append('interests[]', interest);
  });
  
  formData.languages.forEach(language => {
    apiFormData.append('languages[]', language);
  });
  
  // プロフィール写真の追加
  if (formData.profilePhoto) {
    apiFormData.append('profilePhoto', formData.profilePhoto);
  }
  
  // APIリクエスト
  fetch('/api/register', {
    method: 'POST',
    body: apiFormData
  })
  .then(response => {
    const loadingElement = document.getElementById('tourist-form-loading');
    if (loadingElement) {
      loadingElement.classList.add('d-none');
    }
    
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(text || '登録処理中にエラーが発生しました');
      });
    }
    return response.json();
  })
  .then(data => {
    // 登録成功時の処理
    showSuccess('アカウント登録が完了しました！');
    
    // ユーザーセッションの設定
    setCurrentUser(data);
    
    // モーダルを閉じる
    const modal = document.getElementById('touristRegisterModal');
    if (modal) {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
    
    // ホームページへリダイレクト
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  })
  .catch(error => {
    console.error('Registration error:', error);
    showError(error.message || '登録処理中にエラーが発生しました');
  });
}

/**
 * パスワード表示切替機能の設定
 */
function setupPasswordVisibilityToggles() {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      
      if (!passwordInput) return;
      
      // パスワード表示/非表示の切り替え
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.querySelector('i').classList.remove('bi-eye');
        this.querySelector('i').classList.add('bi-eye-slash');
        this.title = 'パスワードを隠す';
      } else {
        passwordInput.type = 'password';
        this.querySelector('i').classList.remove('bi-eye-slash');
        this.querySelector('i').classList.add('bi-eye');
        this.title = 'パスワードを表示';
      }
    });
  });
}

/**
 * エラーメッセージの表示
 * @param {string} message エラーメッセージ
 */
function showError(message) {
  const errorElement = document.getElementById('tourist-register-error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
    
    // スクロールしてエラーメッセージを表示
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * 成功メッセージの表示（トースト通知）
 * @param {string} message 成功メッセージ
 */
function showSuccess(message) {
  // Bootstrapのトースト通知を表示
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    // トーストコンテナがない場合は作成
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
  }
  
  // トースト要素の作成
  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-white bg-success border-0';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <i class="bi bi-check-circle me-2"></i> ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  document.getElementById('toast-container').appendChild(toastEl);
  
  // Bootstrap Toastの初期化と表示
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  
  // 自動削除
  toastEl.addEventListener('hidden.bs.toast', function() {
    toastEl.remove();
  });
}