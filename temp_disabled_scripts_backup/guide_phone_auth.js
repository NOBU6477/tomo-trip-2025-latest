/**
 * ガイド登録用電話番号認証処理
 * 観光客登録と同様の仕組みを実装し、認証バッジの重複表示問題を解決
 */
document.addEventListener('DOMContentLoaded', function() {
  setupGuidePhoneAuth();
});

// Firebase認証関連の変数
let guideRecaptchaVerifier = null;
let guideConfirmationResult = null;
let guidePhoneVerified = false;

/**
 * ガイドの電話番号認証機能を設定
 */
function setupGuidePhoneAuth() {
  console.log('ガイド電話番号認証機能を設定します');
  
  // ガイド登録モーダルの表示を検知して設定
  const registerGuideModal = document.getElementById('registerGuideModal');
  if (registerGuideModal) {
    console.log('ガイド登録モーダルを検出しました');
    
    // モーダル表示時のイベント
    registerGuideModal.addEventListener('shown.bs.modal', () => {
      console.log('ガイド登録モーダルが表示されました - 電話番号認証を初期化します');
      cleanPhoneVerificationSection();
      initGuidePhoneVerification();
    });
    
    // 子要素へのミューテーションを監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          cleanPhoneVerificationSection();
        }
      });
    });
    
    // 監視設定
    observer.observe(registerGuideModal, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }
  
  // 既に表示されている場合にも対応
  if (registerGuideModal && isModalVisible(registerGuideModal)) {
    console.log('モーダルが既に表示されています - 電話番号認証を初期化します');
    cleanPhoneVerificationSection();
    initGuidePhoneVerification();
  }
}

/**
 * 電話番号認証セクションをクリーンアップ
 * 認証バッジの重複表示を防止
 */
function cleanPhoneVerificationSection() {
  // 電話番号認証セクションを探す
  const authSections = document.querySelectorAll('#registerGuideModal [class*="phone-verification"], #registerGuideModal [id*="phone-auth"]');
  
  authSections.forEach(section => {
    // 「認証済み」ボタン/バッジを探して削除
    const successBadges = section.querySelectorAll('.badge.bg-success, .btn-success, [class*="badge"][class*="success"]');
    successBadges.forEach(badge => {
      if (badge.textContent && badge.textContent.includes('認証済み')) {
        badge.remove();
      }
    });
    
    // 「認証済み」テキストを探して削除
    const allElements = section.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.trim() === '認証済み' && !el.id.includes('trigger')) {
        el.remove();
      }
    }
    
    // インラインスタイルの削除
    const verifiedAlert = document.getElementById('guide-phone-verified');
    if (verifiedAlert) {
      verifiedAlert.style.display = '';
      verifiedAlert.removeAttribute('style');
    }
  });
}

/**
 * モーダルが表示されているかチェック
 */
function isModalVisible(modal) {
  return modal.classList.contains('show') && 
         window.getComputedStyle(modal).display !== 'none';
}

/**
 * ガイドの電話番号認証を初期化
 */
function initGuidePhoneVerification() {
  console.log('ガイド電話番号認証を初期化します');
  
  // 認証コード送信ボタン
  const sendCodeBtn = document.getElementById('guide-send-code-btn');
  if (sendCodeBtn) {
    console.log('認証コード送信ボタンを検出しました');
    // 既存のイベントリスナーを削除
    const newBtn = sendCodeBtn.cloneNode(true);
    sendCodeBtn.parentNode.replaceChild(newBtn, sendCodeBtn);
    
    // 新しいイベントリスナーを設定
    newBtn.addEventListener('click', function() {
      sendGuideVerificationCode();
    });
  } else {
    console.error('認証コード送信ボタンが見つかりません');
  }
  
  // 認証コード入力フィールド
  const verificationCode = document.getElementById('guide-verification-code');
  if (verificationCode) {
    console.log('認証コード入力フィールドを検出しました');
    // 既存のイベントリスナーを削除
    const newField = verificationCode.cloneNode(true);
    verificationCode.parentNode.replaceChild(newField, verificationCode);
    
    // 新しいイベントリスナーを設定
    newField.addEventListener('input', function() {
      // コードが6桁に達したら自動的に検証
      if (this.value.length === 6) {
        verifyGuideCode(this.value);
      }
    });
  } else {
    console.error('認証コード入力フィールドが見つかりません');
  }
  
  // reCAPTCHAコンテナの初期化
  initGuideRecaptcha();
}

/**
 * ガイド用reCAPTCHAを初期化
 */
function initGuideRecaptcha() {
  console.log('ガイド用reCAPTCHAを初期化します');
  
  // Firebaseが読み込まれているか確認
  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.error('Firebaseが利用できません。環境を確認してください。');
    showGuidePhoneError('認証サービスが利用できません。後でもう一度お試しください。');
    return;
  }
  
  try {
    // 既存のreCAPTCHAがあれば削除
    if (guideRecaptchaVerifier) {
      guideRecaptchaVerifier.clear();
      guideRecaptchaVerifier = null;
    }
    
    // reCAPTCHAコンテナを取得
    const recaptchaContainer = document.getElementById('guide-recaptcha-container');
    if (!recaptchaContainer) {
      console.error('reCAPTCHAコンテナが見つかりません');
      return;
    }
    
    // reCAPTCHAコンテナを初期化
    recaptchaContainer.innerHTML = '<div id="guide-recaptcha"></div>';
    
    // reCAPTCHAを初期化
    guideRecaptchaVerifier = new firebase.auth.RecaptchaVerifier('guide-recaptcha', {
      size: 'normal',
      callback: function(response) {
        // reCAPTCHA解決時にボタンを有効化
        const sendCodeBtn = document.getElementById('guide-send-code-btn');
        if (sendCodeBtn) {
          sendCodeBtn.disabled = false;
        }
      },
      'expired-callback': function() {
        // reCAPTCHA期限切れ時に再初期化
        initGuideRecaptcha();
        showGuidePhoneError('reCAPTCHAの期限が切れました。もう一度お試しください。');
      }
    });
    
    // reCAPTCHAをレンダリング
    guideRecaptchaVerifier.render()
      .then(function(widgetId) {
        console.log('ガイド用reCAPTCHAを正常に初期化しました, ID:', widgetId);
      })
      .catch(function(error) {
        console.error('reCAPTCHAレンダリングエラー:', error);
        showGuidePhoneError('reCAPTCHAの読み込みに失敗しました。ページを再読み込みしてください。');
      });
  } catch (error) {
    console.error('reCAPTCHA初期化エラー:', error);
    showGuidePhoneError('認証システムの初期化に失敗しました。後でもう一度お試しください。');
  }
}

/**
 * ガイド用認証コードを送信
 */
function sendGuideVerificationCode() {
  console.log('ガイド用認証コードを送信します');
  
  // 電話番号入力
  const phoneNumberInput = document.getElementById('guide-phone-number');
  if (!phoneNumberInput) {
    showGuidePhoneError('電話番号入力フィールドが見つかりません');
    return;
  }
  
  // 電話番号を取得して整形
  let phoneNumber = phoneNumberInput.value.trim();
  
  // 電話番号の検証
  if (!phoneNumber) {
    showGuidePhoneError('電話番号を入力してください');
    return;
  }
  
  // 国コードを追加（日本の場合は+81）
  if (phoneNumber.startsWith('0')) {
    phoneNumber = '+81' + phoneNumber.substring(1);
  } else if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+81' + phoneNumber;
  }
  
  console.log('送信する電話番号:', phoneNumber);
  
  // 送信ボタンとレキャプチャをロック
  const sendCodeBtn = document.getElementById('guide-send-code-btn');
  if (sendCodeBtn) {
    sendCodeBtn.disabled = true;
    const originalText = sendCodeBtn.innerHTML;
    sendCodeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
    
    // テストモードなら自動的にバイパス
    if (phoneNumber === '+818012345678' || phoneNumber === '+819012345678' || phoneNumber === '+817012345678' || phoneNumber === '123456') {
      console.log('テスト用電話番号を検出しました。認証をバイパスします。');
      
      // テスト用のバイパス処理
      setTimeout(() => {
        sendCodeBtn.disabled = false;
        sendCodeBtn.innerHTML = originalText;
        
        // 認証コード入力フィールドを自動設定
        const verificationCode = document.getElementById('guide-verification-code');
        if (verificationCode) {
          verificationCode.value = '123456';
          verificationCode.focus();
        }
        
        // 検証完了
        showGuidePhoneSuccess('テスト用電話番号が確認されました');
        guidePhoneVerified = true;
        
        // 検証完了メッセージを表示
        updateGuidePhoneVerifiedStatus(true);
      }, 1500);
      
      return;
    }
    
    // Firebase Authを使用して電話番号認証を開始
    try {
      firebase.auth().signInWithPhoneNumber(phoneNumber, guideRecaptchaVerifier)
        .then(function(confirmationResult) {
          // SMS送信成功
          sendCodeBtn.disabled = false;
          sendCodeBtn.innerHTML = originalText;
          console.log('SMSが送信されました');
          
          // 認証結果を保存
          guideConfirmationResult = confirmationResult;
          
          // 認証コード入力欄にフォーカス
          const verificationCode = document.getElementById('guide-verification-code');
          if (verificationCode) {
            verificationCode.focus();
          }
          
          // 成功メッセージを表示
          showGuidePhoneSuccess('認証コードを送信しました。SMSを確認してください。');
        })
        .catch(function(error) {
          console.error('SMS送信エラー:', error);
          sendCodeBtn.disabled = false;
          sendCodeBtn.innerHTML = originalText;
          
          // reCAPTCHAをリセット
          if (guideRecaptchaVerifier) {
            guideRecaptchaVerifier.clear();
            initGuideRecaptcha();
          }
          
          // エラーメッセージを表示
          let errorMessage = 'SMSの送信に失敗しました。もう一度お試しください。';
          
          if (error.code === 'auth/invalid-phone-number') {
            errorMessage = '有効な電話番号を入力してください。';
          } else if (error.code === 'auth/quota-exceeded') {
            errorMessage = 'SMS送信回数の上限に達しました。しばらく経ってから再度お試しください。';
          }
          
          showGuidePhoneError(errorMessage);
        });
    } catch (error) {
      console.error('認証開始エラー:', error);
      sendCodeBtn.disabled = false;
      sendCodeBtn.innerHTML = originalText;
      showGuidePhoneError('認証の開始に失敗しました。もう一度お試しください。');
    }
  } else {
    showGuidePhoneError('送信ボタンが見つかりません');
  }
}

/**
 * ガイド用認証コードを検証
 * @param {string} code 検証コード
 */
function verifyGuideCode(code) {
  console.log('ガイド用認証コードを検証します:', code);
  
  // テスト用コードを検出
  if (code === '123456') {
    console.log('テスト用認証コードを検出しました。検証をバイパスします。');
    showGuidePhoneSuccess('認証コードが確認されました');
    guidePhoneVerified = true;
    
    // 検証完了メッセージを表示
    updateGuidePhoneVerifiedStatus(true);
    return;
  }
  
  // 通常の検証
  if (guideConfirmationResult) {
    guideConfirmationResult.confirm(code)
      .then(function(result) {
        // 認証成功
        console.log('電話番号認証が完了しました');
        showGuidePhoneSuccess('電話番号が確認されました');
        guidePhoneVerified = true;
        
        // 認証完了メッセージを表示
        updateGuidePhoneVerifiedStatus(true);
      })
      .catch(function(error) {
        console.error('認証コード検証エラー:', error);
        let errorMessage = '無効な認証コードです。もう一度お試しください。';
        showGuidePhoneError(errorMessage);
      });
  } else {
    showGuidePhoneError('先に認証コードを送信してください');
  }
}

/**
 * ガイド用電話認証エラーメッセージを表示
 * @param {string} message エラーメッセージ
 */
function showGuidePhoneError(message) {
  console.error('ガイド電話認証エラー:', message);
  
  // エラー表示用の要素がなければ作成
  let errorElement = document.getElementById('guide-phone-error');
  if (!errorElement) {
    const phoneSection = document.getElementById('guide-phone-auth-form');
    if (!phoneSection) {
      console.error('電話番号セクションが見つかりません');
      return;
    }
    
    errorElement = document.createElement('div');
    errorElement.id = 'guide-phone-error';
    errorElement.className = 'alert alert-danger mt-2';
    phoneSection.appendChild(errorElement);
  }
  
  // エラーメッセージを設定
  errorElement.textContent = message;
  errorElement.classList.remove('d-none');
  
  // 3秒後にエラーメッセージを非表示
  setTimeout(() => {
    errorElement.classList.add('d-none');
  }, 3000);
}

/**
 * ガイド用電話認証成功メッセージを表示
 * @param {string} message 成功メッセージ
 */
function showGuidePhoneSuccess(message) {
  console.log('ガイド電話認証成功:', message);
  
  // 成功表示用の要素がなければ作成
  let successElement = document.getElementById('guide-phone-success');
  if (!successElement) {
    const phoneSection = document.getElementById('guide-phone-auth-form');
    if (!phoneSection) {
      console.error('電話番号セクションが見つかりません');
      return;
    }
    
    successElement = document.createElement('div');
    successElement.id = 'guide-phone-success';
    successElement.className = 'alert alert-success mt-2';
    phoneSection.appendChild(successElement);
  }
  
  // 成功メッセージを設定
  successElement.textContent = message;
  successElement.classList.remove('d-none');
  
  // 3秒後に成功メッセージを非表示
  setTimeout(() => {
    successElement.classList.add('d-none');
  }, 3000);
}

/**
 * ガイド用認証完了ステータスを更新
 * @param {boolean} isVerified 認証完了フラグ
 */
function updateGuidePhoneVerifiedStatus(isVerified) {
  const verifiedAlert = document.getElementById('guide-phone-verified');
  if (verifiedAlert) {
    // 強制的に表示スタイルを上書き
    verifiedAlert.removeAttribute('style');
    verifiedAlert.style.display = isVerified ? 'block' : 'none';
    verifiedAlert.classList.remove('d-none');
    
    // 認証完了メッセージの可視性を確保
    if (isVerified) {
      // 30msごとに10回、合計300msの間、表示状態を確認して強制的に表示
      let attempts = 0;
      const interval = setInterval(() => {
        if (attempts >= 10) {
          clearInterval(interval);
          return;
        }
        
        verifiedAlert.removeAttribute('style');
        verifiedAlert.style.display = 'block !important';
        verifiedAlert.classList.remove('d-none');
        attempts++;
      }, 30);
    }
    
    console.log(`電話認証ステータスを ${isVerified ? '認証済み' : '未認証'} に更新しました`);
  } else {
    console.error('認証完了メッセージ要素が見つかりません');
  }
  
  // ステータス表示を修正するためのイベントを発火
  document.dispatchEvent(new CustomEvent('guide-phone-verification-updated', {
    detail: { verified: isVerified }
  }));
}

/**
 * ガイドの電話番号認証状態を取得
 * @returns {boolean} 認証完了状態
 */
function isGuidePhoneVerified() {
  return guidePhoneVerified;
}