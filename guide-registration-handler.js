/**
 * ガイド登録処理システム
 * 基本情報登録後の編集画面遷移を実装
 */

(function() {
  'use strict';
  
  console.log('📝 ガイド登録処理システム開始');
  
  // 初期化
  function initialize() {
    setupGuideRegistrationForm();
    setupTouristRegistrationForm();
  }
  
  // ガイド登録フォーム設定
  function setupGuideRegistrationForm() {
    const form = document.getElementById('guide-register-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('📝 ガイド登録フォーム送信');
      
      // バリデーション
      if (!validateGuideForm()) {
        return;
      }
      
      // 基本情報を取得
      const basicGuideData = collectGuideBasicInfo();
      
      // sessionStorageに保存
      sessionStorage.setItem('newGuideData', JSON.stringify(basicGuideData));
      
      // 登録完了メッセージ
      showAlert('基本情報の登録が完了しました。詳細編集画面に移動します...', 'success');
      
      // 編集画面に遷移
      setTimeout(() => {
        window.location.href = 'guide-edit-page.html';
      }, 1500);
    });
  }
  
  // 観光客登録フォーム設定
  function setupTouristRegistrationForm() {
    const form = document.getElementById('tourist-register-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('📝 観光客登録フォーム送信');
      
      // バリデーション
      if (!validateTouristForm()) {
        return;
      }
      
      // 観光客情報を取得
      const touristData = collectTouristInfo();
      
      // localStorageに保存
      localStorage.setItem(`tourist_${touristData.id}`, JSON.stringify(touristData));
      
      // 登録完了メッセージ
      showAlert('観光客登録が完了しました！', 'success');
      
      // モーダルを閉じる
      const modal = document.getElementById('registerTouristModal');
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
      
      // フォームリセット
      form.reset();
    });
  }
  
  // ガイド基本情報収集
  function collectGuideBasicInfo() {
    const profilePreview = document.getElementById('guide-profile-preview');
    
    return {
      id: Date.now().toString(),
      name: document.getElementById('guide-name').value,
      username: document.getElementById('guide-username').value,
      email: document.getElementById('guide-email').value,
      password: document.getElementById('guide-password').value,
      location: document.getElementById('guide-location').value,
      languages: Array.from(document.getElementById('guide-languages').selectedOptions).map(opt => opt.text).join(', '),
      phoneNumber: document.getElementById('guide-phone-number').value,
      profilePhoto: profilePreview && profilePreview.src !== 'https://placehold.co/150?text=写真' ? profilePreview.src : null,
      idType: document.getElementById('guide-id-type').value,
      idFrontPhoto: getImageSrc('guide-id-front-preview'),
      idBackPhoto: getImageSrc('guide-id-back-preview'),
      registeredAt: new Date().toISOString(),
      status: 'draft' // 下書き状態
    };
  }
  
  // 観光客情報収集
  function collectTouristInfo() {
    const profilePreview = document.getElementById('tourist-profile-preview');
    
    return {
      id: Date.now().toString(),
      name: document.getElementById('tourist-name').value,
      email: document.getElementById('tourist-email').value,
      password: document.getElementById('tourist-password').value,
      nationality: document.getElementById('tourist-nationality').value,
      phoneNumber: document.getElementById('tourist-phone-number').value,
      profilePhoto: profilePreview && profilePreview.src !== 'https://placehold.co/150?text=写真' ? profilePreview.src : null,
      idType: document.getElementById('tourist-id-type').value,
      idFrontPhoto: getImageSrc('tourist-id-front-preview'),
      idBackPhoto: getImageSrc('tourist-id-back-preview'),
      registeredAt: new Date().toISOString(),
      userType: 'tourist'
    };
  }
  
  // 画像のsrc取得
  function getImageSrc(elementId) {
    const img = document.getElementById(elementId);
    return img && img.src && !img.src.includes('placehold') ? img.src : null;
  }
  
  // ガイドフォームバリデーション
  function validateGuideForm() {
    const requiredFields = [
      'guide-name',
      'guide-email',
      'guide-password',
      'guide-location',
      'guide-languages',
      'guide-phone-number'
    ];
    
    for (const fieldId of requiredFields) {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        showAlert(`${getFieldLabel(fieldId)}は必須項目です`, 'danger');
        return false;
      }
    }
    
    // 電話番号認証確認
    const phoneVerified = document.getElementById('guide-phone-verified');
    if (!phoneVerified || phoneVerified.classList.contains('d-none')) {
      showAlert('電話番号認証を完了してください', 'danger');
      return false;
    }
    
    // 身分証明書確認（より柔軟な判定）
    const idFrontInput = document.getElementById('guide-id-front');
    const idFrontPreview = document.getElementById('guide-id-front-preview');
    
    if (!idFrontInput || !idFrontInput.files || idFrontInput.files.length === 0) {
      if (!idFrontPreview || !idFrontPreview.src || idFrontPreview.src.includes('placehold')) {
        showAlert('身分証明書（表面）をアップロードしてください', 'danger');
        return false;
      }
    }
    
    // 運転免許証の場合は裏面も必要
    const idType = document.getElementById('guide-id-type').value;
    if (idType === 'drivers_license') {
      const idBackInput = document.getElementById('guide-id-back');
      const idBackPreview = document.getElementById('guide-id-back-preview');
      
      if (!idBackInput || !idBackInput.files || idBackInput.files.length === 0) {
        if (!idBackPreview || !idBackPreview.src || idBackPreview.src.includes('placehold')) {
          showAlert('運転免許証の裏面もアップロードしてください', 'danger');
          return false;
        }
      }
    }
    
    // 利用規約同意確認
    const termsCheckbox = document.getElementById('guide-terms');
    if (!termsCheckbox || !termsCheckbox.checked) {
      showAlert('利用規約に同意してください', 'danger');
      return false;
    }
    
    return true;
  }
  
  // 観光客フォームバリデーション
  function validateTouristForm() {
    const requiredFields = [
      'tourist-name',
      'tourist-email',
      'tourist-password',
      'tourist-nationality',
      'tourist-phone-number'
    ];
    
    for (const fieldId of requiredFields) {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        showAlert(`${getFieldLabel(fieldId)}は必須項目です`, 'danger');
        return false;
      }
    }
    
    // 電話番号認証確認
    const phoneVerified = document.getElementById('tourist-phone-verified');
    if (!phoneVerified || phoneVerified.classList.contains('d-none')) {
      showAlert('電話番号認証を完了してください', 'danger');
      return false;
    }
    
    // 身分証明書確認（より柔軟な判定）
    const idFrontInput = document.getElementById('tourist-id-front');
    const idFrontPreview = document.getElementById('tourist-id-front-preview');
    
    if (!idFrontInput || !idFrontInput.files || idFrontInput.files.length === 0) {
      if (!idFrontPreview || !idFrontPreview.src || idFrontPreview.src.includes('placehold')) {
        showAlert('身分証明書（表面）をアップロードしてください', 'danger');
        return false;
      }
    }
    
    // 利用規約同意確認
    const termsCheckbox = document.getElementById('tourist-terms');
    if (!termsCheckbox || !termsCheckbox.checked) {
      showAlert('利用規約に同意してください', 'danger');
      return false;
    }
    
    return true;
  }
  
  // フィールドラベル取得
  function getFieldLabel(fieldId) {
    const labelMap = {
      'guide-name': '氏名',
      'guide-email': 'メールアドレス',
      'guide-password': 'パスワード',
      'guide-location': '活動エリア',
      'guide-languages': '対応言語',
      'guide-phone-number': '電話番号',
      'tourist-name': '氏名',
      'tourist-email': 'メールアドレス',
      'tourist-password': 'パスワード',
      'tourist-nationality': '国籍',
      'tourist-phone-number': '電話番号'
    };
    
    return labelMap[fieldId] || fieldId;
  }
  
  // アラート表示
  function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  }
  
  // アラートコンテナ作成
  function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; max-width: 400px; z-index: 9999;';
    document.body.appendChild(container);
    return container;
  }
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();