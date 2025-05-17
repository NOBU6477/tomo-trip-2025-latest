/**
 * 登録フォームのスピナー表示と成功メッセージ修正
 */
document.addEventListener('DOMContentLoaded', function() {
  // ガイド登録フォームの処理設定
  setupGuideRegistrationForm();
  
  // 言語選択の処理
  setupLanguageSelection();
  
  // パスワード一致確認
  setupPasswordValidation();
  
  // 電話番号認証ボタンの処理
  setupPhoneVerification();
  
  // 身分証明書アップロードボタンの処理は不要のためコメントアウト
  // setupIdDocumentUpload();
});

/**
 * ガイド登録フォームの設定
 */
function setupGuideRegistrationForm() {
  const form = document.getElementById('register-guide-form');
  if (!form) {
    console.error('登録フォームが見つかりません');
    return;
  }
  
  console.log('ガイド登録フォームを設定しました');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 入力値の検証
    if (!validateGuideForm()) {
      return;
    }
    
    // フォームデータの収集
    const formData = collectGuideFormData();
    
    // 登録処理の実行
    submitGuideRegistration(formData);
  });
}

/**
 * ガイド登録フォームの検証
 * @returns {boolean} 検証結果
 */
function validateGuideForm() {
  const password = document.getElementById('guide-password').value;
  const confirmPassword = document.getElementById('guide-confirm-password').value;
  
  // パスワード一致チェック
  if (password !== confirmPassword) {
    showGuideError('パスワードが一致しません');
    return false;
  }
  
  // 言語選択チェック
  const languagesSelect = document.getElementById('guide-languages');
  if (languagesSelect) {
    const selectedLanguages = Array.from(languagesSelect.selectedOptions).map(option => option.value);
    
    if (selectedLanguages.length === 0) {
      showGuideError('少なくとも1つの言語を選択してください');
      return false;
    }
  }
  
  // 利用規約同意チェック
  const termsAgreed = document.getElementById('guide-terms').checked;
  if (!termsAgreed) {
    showGuideError('利用規約に同意してください');
    return false;
  }
  
  // 身分証明書検証
  if (!validateGuideDocuments()) {
    return false;
  }
  
  return true;
}

/**
 * ガイド登録フォームからデータを収集
 * @returns {Object} フォームデータ
 */
function collectGuideFormData() {
  // 基本情報
  const fullname = document.getElementById('guide-fullname')?.value || '';
  const username = document.getElementById('guide-username')?.value || '';
  const email = document.getElementById('guide-email')?.value || '';
  const gender = document.getElementById('guide-gender')?.value || '';
  const ageGroup = document.getElementById('guide-age-group')?.value || '';
  const phone = document.getElementById('guide-phone')?.value || '';
  const password = document.getElementById('guide-password')?.value || '';
  
  // プロフィール情報
  const city = document.getElementById('guide-city')?.value || '';
  const bio = document.getElementById('guide-bio')?.value || '';
  const baseFee = document.getElementById('guide-base-fee')?.value || 6000;
  const hourlyFee = document.getElementById('guide-hourly-fee')?.value || 3000;
  
  // 言語選択データの取得
  let languages = [];
  const languagesSelect = document.getElementById('guide-languages');
  if (languagesSelect) {
    languages = Array.from(languagesSelect.selectedOptions).map(option => option.value);
  }
  
  // 専門分野
  const specialties = [];
  const specialtyCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="specialty-"]:checked');
  if (specialtyCheckboxes.length > 0) {
    specialtyCheckboxes.forEach(checkbox => {
      specialties.push(checkbox.value);
    });
  }
  
  // 身分証明書データの収集
  const documentData = collectGuideDocumentData();
  
  return {
    fullname,
    username,
    email,
    gender,
    ageGroup,
    phone,
    password,
    city,
    languages,
    bio,
    baseFee,
    hourlyFee,
    specialties,
    userType: 'guide',
    documentType: documentData.type,
    documentFiles: documentData.files
  };
}

/**
 * ガイド登録データをサーバーに送信
 * @param {Object} formData 登録データ
 */
function submitGuideRegistration(formData) {
  console.log('ガイド登録を開始します...');
  
  // ボタンを無効化し、ローディング表示
  const submitBtn = document.querySelector('#register-guide-form button[type="submit"]');
  if (!submitBtn) {
    console.error('送信ボタンが見つかりません');
    return;
  }
  
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 処理中...';
  
  // エラー表示をクリア
  hideGuideError();
  
  // IDフォトの検証
  const idPhoto = window.idPhotoHandler && typeof window.idPhotoHandler.getIdPhotoFile === 'function' 
    ? window.idPhotoHandler.getIdPhotoFile() 
    : null;
    
  if (!idPhoto) {
    console.error('証明写真が選択されていません');
    showGuideError('証明写真をアップロードしてください');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    return;
  }
  
  // モックAPIリクエスト（実際の実装時に置き換え）
  setTimeout(() => {
    try {
      // 成功ケース（APIが実装されるまでの一時的なモック）
      console.log('ガイド登録データ:', formData);
      
      // 証明写真URL
      const idPhotoUrl = idPhoto ? URL.createObjectURL(idPhoto) : null;
      console.log('証明写真が取得されました:', !!idPhoto);
      
      // セッションストレージにユーザー情報を保存（デモ用）
      sessionStorage.setItem('currentUser', JSON.stringify({
        id: 'guide-' + Date.now(),
        username: formData.username,
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        userType: 'guide',
        city: formData.city,
        languages: formData.languages,
        bio: formData.bio,
        baseFee: formData.baseFee,
        hourlyFee: formData.hourlyFee,
        gender: formData.gender,
        ageGroup: formData.ageGroup,
        specialties: formData.specialties,
        profilePhotoUrl: idPhotoUrl, // 証明写真URL
        verified: true
      }));
      
      // 成功メッセージ表示
      showToast('アカウント登録が完了しました！', 'success');
      
      // モーダルを閉じる
      const modal = bootstrap.Modal.getInstance(document.getElementById('registerGuideModal'));
      if (modal) {
        modal.hide();
        console.log('モーダルを閉じました');
      } else {
        console.error('モーダルインスタンスが見つかりません');
      }
      
      // ユーザー情報を作成
      const userData = {
        id: data?.id || '12345',
        username: formData.username,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        userType: 'guide',
        city: formData.city,
        languages: formData.languages,
        bio: formData.bio,
        baseFee: formData.baseFee,
        hourlyFee: formData.hourlyFee,
        gender: formData.gender,
        ageGroup: formData.ageGroup,
        specialties: formData.specialties,
        profilePhotoUrl: idPhotoUrl, // 証明写真URL
        certificationPhotoUrl: idPhotoUrl, // 証明写真URL（プロフィール画面用）
        verified: true
      };
      
      // セッションストレージに登録データを保存
      try {
        // 更新されたユーザーデータを保存
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        
        // ガイド登録データを別途保存（プロフィールページで利用）
        sessionStorage.setItem('guideRegistrationData', JSON.stringify(userData));
        
        console.log('ユーザーデータをセッションに保存しました');
      } catch (storageError) {
        console.error('セッションストレージエラー:', storageError);
      }
      
      // 成功メッセージをより目立つように表示
      const successToast = document.createElement('div');
      successToast.className = 'position-fixed top-50 start-50 translate-middle p-3 bg-success text-white rounded shadow-lg';
      successToast.style.zIndex = '9999';
      successToast.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="bi bi-check-circle-fill me-2"></i>
          <strong>登録が完了しました！</strong>
        </div>
        <div class="mt-2">プロフィール画面に移動します...</div>
      `;
      document.body.appendChild(successToast);
      
      // ガイドプロフィール画面へのリンクを生成して自動クリック
      console.log('ガイドプロフィール画面へリダイレクトします...');
      
      // ディレイを延長（ユーザーによるデータ確認用）
      setTimeout(() => {
        try {
          // セッションストレージに特別なフラグを設定（プロフィール画面でこのフラグを使ってメッセージを表示する）
          sessionStorage.setItem('guideRegistrationCompleted', 'true');
          
          // プロフィールページでの表示用のリファレンスをもう一度保存
          try {
            const userData = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
            console.log('登録前の保存されたユーザーデータ:', userData);
          } catch (err) {
            console.error('ユーザーデータの取得エラー:', err);
          }
          
          // 直接リンクを画面に追加し、ユーザーに選択してもらう
          // 自動リダイレクトに問題があるため、明示的なリンクを提供
          successToast.innerHTML += `
            <div class="mt-3">
              <a href="guide-profile.html" class="btn btn-light btn-sm mt-2">
                <i class="bi bi-arrow-right"></i> プロフィール画面へ進む
              </a>
            </div>
          `;
          
          // 安全に自動リダイレクトを試みる
          const redirectTimer = setTimeout(() => {
            try {
              window.location.href = 'guide-profile.html';
              console.log('guide-profile.htmlへリダイレクトしました');
            } catch (innerRedirectError) {
              console.error('自動リダイレクト（遅延）エラー:', innerRedirectError);
            }
          }, 3000); // 3秒待ってリダイレクト
          
        } catch (redirectError) {
          console.error('リダイレクト準備エラー:', redirectError);
          
          // エラーが発生した場合は手動リンクを表示
          successToast.innerHTML += `
            <div class="mt-2 text-warning">
              自動移動に失敗しました。
              <a href="guide-profile.html" class="btn btn-light btn-sm mt-2">こちらをクリック</a>
            </div>
          `;
        }
      }, 2500); // 2.5秒待ってから処理開始
      
    } catch (error) {
      console.error('登録エラー:', error);
      showGuideError('アカウント登録中にエラーが発生しました。後でもう一度お試しください。');
    } finally {
      // ボタンを元に戻す
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }, 1500);
}

/**
 * 言語選択の処理設定
 */
function setupLanguageSelection() {
  const languagesSelect = document.getElementById('guide-languages');
  const languagesInput = document.getElementById('guide-languages-input');
  
  if (!languagesSelect || !languagesInput) return;
  
  // 選択変更時に隠しフィールドを更新
  languagesSelect.addEventListener('change', function() {
    const selectedLanguages = Array.from(this.selectedOptions).map(option => option.value);
    languagesInput.value = JSON.stringify(selectedLanguages);
  });
}

/**
 * パスワード一致確認の設定
 */
function setupPasswordValidation() {
  const password = document.getElementById('guide-password');
  const confirmPassword = document.getElementById('guide-password-confirm');
  
  if (!password || !confirmPassword) return;
  
  confirmPassword.addEventListener('input', function() {
    if (password.value !== this.value) {
      this.setCustomValidity('パスワードが一致していません');
    } else {
      this.setCustomValidity('');
    }
  });
}

/**
 * 電話番号認証ボタンの設定
 */
function setupPhoneVerification() {
  const verifyPhoneBtn = document.getElementById('guide-verify-phone');
  
  if (!verifyPhoneBtn) return;
  
  verifyPhoneBtn.addEventListener('click', function() {
    const phoneInput = document.getElementById('guide-phone');
    const phoneNumber = phoneInput.value.trim();
    
    if (!phoneNumber) {
      showGuideError('電話番号を入力してください');
      return;
    }
    
    // 電話番号フォーマットの簡易チェック
    if (!phoneNumber.startsWith('+')) {
      showGuideError('電話番号は国際形式（+819012345678）で入力してください');
      return;
    }
    
    // 電話認証モーダルを開く
    const phoneVerificationModal = new bootstrap.Modal(document.getElementById('phoneVerificationModal'));
    phoneVerificationModal.show();
    
    // 電話認証モーダルに電話番号をセット
    const verificationPhoneInput = document.getElementById('verification-phone');
    if (verificationPhoneInput) {
      verificationPhoneInput.value = phoneNumber;
    }
  });
}

/**
 * ガイド登録フォームが送信される前に身分証明書の選択状態を検証
 * @returns {boolean} 検証結果
 */
function validateGuideDocuments() {
  // 書類タイプが選択されているか確認
  const documentType = document.getElementById('guide-document-type');
  if (!documentType || documentType.value === '') {
    showGuideError('身分証明書の種類を選択してください');
    return false;
  }
  
  // アクティブなセクションを特定
  let activeSection = null;
  if (documentType.value.includes('passport')) {
    activeSection = document.getElementById('passport-upload');
  } else if (documentType.value.includes('driverLicense')) {
    activeSection = document.getElementById('license-upload');
  } else if (documentType.value.includes('mynumber') || documentType.value.includes('idCard')) {
    activeSection = document.getElementById('idcard-upload');
  } else if (documentType.value.includes('residenceCard')) {
    activeSection = document.getElementById('residencecard-upload');
  }
  
  if (!activeSection) {
    return false;
  }
  
  // ファイルがアップロードされているか確認
  const fileInputs = activeSection.querySelectorAll('input[type="file"]');
  let allFilesUploaded = true;
  
  fileInputs.forEach(input => {
    if (input.files.length === 0) {
      allFilesUploaded = false;
    }
  });
  
  if (!allFilesUploaded) {
    showGuideError('すべての必要な身分証明書をアップロードしてください');
    return false;
  }
  
  return true;
}

/**
 * 身分証明書データを収集
 * @returns {Object} 身分証明書データ
 */
function collectGuideDocumentData() {
  // 新しい身分証明書ハンドラを利用してデータを収集
  if (window.guideDocumentHandler && typeof window.guideDocumentHandler.collectDocumentFiles === 'function') {
    return window.guideDocumentHandler.collectDocumentFiles();
  }
  
  return { type: '', files: {} };
}

/**
 * ID書類アップロードボタンの設定
 * 以前の実装はモーダルで行っていましたが、登録フォーム内に統合したため不要
 */
function setupIdDocumentUpload() {
  // 新しい実装では、既にフォームに身分証明書アップロード機能が含まれている
  // ここでは追加処理は不要
}

/**
 * ガイド登録エラーの表示
 * @param {string} message エラーメッセージ
 */
function showGuideError(message) {
  const errorElement = document.getElementById('guide-register-error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
  }
}

/**
 * ガイド登録エラーの非表示
 */
function hideGuideError() {
  const errorElement = document.getElementById('guide-register-error');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.add('d-none');
  }
}

/**
 * トースト通知表示
 * @param {string} message メッセージ
 * @param {string} type タイプ（success, danger, warning, info）
 */
function showToast(message, type = 'info') {
  // 既存のトースト要素を確認
  let toastContainer = document.querySelector('.toast-container');
  
  // トーストコンテナがなければ作成
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  // トースト要素の作成
  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  
  const toastBody = document.createElement('div');
  toastBody.className = 'd-flex';
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'toast-body';
  messageDiv.textContent = message;
  
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close btn-close-white me-2 m-auto';
  closeButton.setAttribute('data-bs-dismiss', 'toast');
  closeButton.setAttribute('aria-label', 'Close');
  
  toastBody.appendChild(messageDiv);
  toastBody.appendChild(closeButton);
  toastEl.appendChild(toastBody);
  toastContainer.appendChild(toastEl);
  
  // Bootstrapトースト初期化
  const toast = new bootstrap.Toast(toastEl, {
    autohide: true,
    delay: 5000
  });
  
  // トースト表示
  toast.show();
  
  // 表示後に自動削除
  toastEl.addEventListener('hidden.bs.toast', function() {
    toastEl.remove();
  });
}