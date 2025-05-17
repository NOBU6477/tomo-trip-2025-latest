/**
 * 観光客登録用電話番号認証を提供するスクリプト
 * Firebase Authenticationを使用した電話番号認証機能を実装
 */
document.addEventListener('DOMContentLoaded', function() {
  setupTouristPhoneAuth();
});

// Firebase認証関連の変数
let touristRecaptchaVerifier = null;
let touristConfirmationResult = null;
let touristPhoneVerified = false;

/**
 * 観光客の電話番号認証機能を設定
 */
function setupTouristPhoneAuth() {
  console.log('観光客電話番号認証機能を設定します');
  
  // 観光客登録モーダルの表示を検知して設定
  const registerTouristModal = document.getElementById('registerTouristModal');
  if (registerTouristModal) {
    console.log('観光客登録モーダルを検出しました');
    registerTouristModal.addEventListener('shown.bs.modal', () => {
      console.log('観光客登録モーダルが表示されました - 電話番号認証を初期化します');
      initTouristPhoneVerification();
    });
  }
  
  // 既に表示されている場合にも対応
  if (registerTouristModal && window.getComputedStyle(registerTouristModal).display !== 'none') {
    console.log('モーダルが既に表示されています - 電話番号認証を初期化します');
    initTouristPhoneVerification();
  }
}

/**
 * 観光客の電話番号認証を初期化
 */
function initTouristPhoneVerification() {
  console.log('観光客電話番号認証を初期化します');
  
  // 認証コード送信ボタン
  const sendCodeBtn = document.getElementById('tourist-send-code-btn');
  if (sendCodeBtn) {
    console.log('認証コード送信ボタンを検出しました');
    sendCodeBtn.addEventListener('click', function() {
      sendTouristVerificationCode();
    });
  } else {
    console.error('認証コード送信ボタンが見つかりません');
  }
  
  // 認証コード入力フィールド
  const verificationCode = document.getElementById('tourist-verification-code');
  if (verificationCode) {
    console.log('認証コード入力フィールドを検出しました');
    verificationCode.addEventListener('input', function() {
      // コードが6桁に達したら自動的に検証
      if (this.value.length === 6) {
        verifyTouristCode(this.value);
      }
    });
  } else {
    console.error('認証コード入力フィールドが見つかりません');
  }
  
  // reCAPTCHAコンテナの初期化
  initTouristRecaptcha();
}

/**
 * 観光客用reCAPTCHAを初期化
 */
function initTouristRecaptcha() {
  console.log('観光客用reCAPTCHAを初期化します');
  
  // Firebaseが読み込まれているか確認
  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.error('Firebaseが利用できません。環境を確認してください。');
    showTouristPhoneError('認証サービスが利用できません。後でもう一度お試しください。');
    return;
  }
  
  try {
    // 既存のreCAPTCHAがあれば削除
    if (touristRecaptchaVerifier) {
      touristRecaptchaVerifier.clear();
      touristRecaptchaVerifier = null;
    }
    
    // reCAPTCHAコンテナを取得
    const recaptchaContainer = document.getElementById('tourist-recaptcha-container');
    if (!recaptchaContainer) {
      console.error('reCAPTCHAコンテナが見つかりません');
      return;
    }
    
    // reCAPTCHAコンテナを初期化
    recaptchaContainer.innerHTML = '<div id="tourist-recaptcha"></div>';
    
    // reCAPTCHAを初期化
    touristRecaptchaVerifier = new firebase.auth.RecaptchaVerifier('tourist-recaptcha', {
      size: 'normal',
      callback: function(response) {
        // reCAPTCHA解決時にボタンを有効化
        const sendCodeBtn = document.getElementById('tourist-send-code-btn');
        if (sendCodeBtn) {
          sendCodeBtn.disabled = false;
        }
      },
      'expired-callback': function() {
        // reCAPTCHA期限切れ時に再初期化
        initTouristRecaptcha();
        showTouristPhoneError('reCAPTCHAの期限が切れました。もう一度お試しください。');
      }
    });
    
    // reCAPTCHAをレンダリング
    touristRecaptchaVerifier.render()
      .then(function(widgetId) {
        console.log('観光客用reCAPTCHAを正常に初期化しました, ID:', widgetId);
      })
      .catch(function(error) {
        console.error('reCAPTCHAレンダリングエラー:', error);
        showTouristPhoneError('reCAPTCHAの読み込みに失敗しました。ページを再読み込みしてください。');
      });
  } catch (error) {
    console.error('reCAPTCHA初期化エラー:', error);
    showTouristPhoneError('認証システムの初期化に失敗しました。後でもう一度お試しください。');
  }
}

/**
 * 観光客用認証コードを送信
 */
function sendTouristVerificationCode() {
  console.log('観光客用認証コードを送信します');
  
  // 電話番号入力
  const phoneNumberInput = document.getElementById('tourist-phone-number');
  if (!phoneNumberInput) {
    showTouristPhoneError('電話番号入力フィールドが見つかりません');
    return;
  }
  
  // 電話番号を取得して整形
  let phoneNumber = phoneNumberInput.value.trim();
  
  // 電話番号の検証
  if (!phoneNumber) {
    showTouristPhoneError('電話番号を入力してください');
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
  const sendCodeBtn = document.getElementById('tourist-send-code-btn');
  if (sendCodeBtn) {
    sendCodeBtn.disabled = true;
    const originalText = sendCodeBtn.innerHTML;
    sendCodeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
    
    // テストモードなら自動的にバイパス
    if (phoneNumber === '+818012345678' || phoneNumber === '+819012345678' || phoneNumber === '+817012345678') {
      console.log('テスト用電話番号を検出しました。認証をバイパスします。');
      
      // テスト用のバイパス処理（本番では削除すること）
      setTimeout(() => {
        sendCodeBtn.disabled = false;
        sendCodeBtn.innerHTML = originalText;
        
        // 認証コード入力フィールドを自動設定
        const verificationCode = document.getElementById('tourist-verification-code');
        if (verificationCode) {
          verificationCode.value = '123456';
          verificationCode.focus();
        }
        
        // 検証完了
        showTouristPhoneSuccess('テスト用電話番号が確認されました');
        touristPhoneVerified = true;
        
        // 検証完了メッセージを表示
        document.getElementById('tourist-phone-verified').classList.remove('d-none');
      }, 1500);
      
      return;
    }
    
    // Firebase Authを使用して電話番号認証を開始
    try {
      firebase.auth().signInWithPhoneNumber(phoneNumber, touristRecaptchaVerifier)
        .then(function(confirmationResult) {
          // SMS送信成功
          sendCodeBtn.disabled = false;
          sendCodeBtn.innerHTML = originalText;
          console.log('SMSが送信されました');
          
          // 認証結果を保存
          touristConfirmationResult = confirmationResult;
          
          // 認証コード入力欄にフォーカス
          const verificationCode = document.getElementById('tourist-verification-code');
          if (verificationCode) {
            verificationCode.focus();
          }
          
          // 成功メッセージを表示
          showTouristPhoneSuccess('認証コードを送信しました。SMSを確認してください。');
        })
        .catch(function(error) {
          console.error('SMS送信エラー:', error);
          sendCodeBtn.disabled = false;
          sendCodeBtn.innerHTML = originalText;
          
          // reCAPTCHAをリセット
          if (touristRecaptchaVerifier) {
            touristRecaptchaVerifier.clear();
            initTouristRecaptcha();
          }
          
          // エラーメッセージを表示
          let errorMessage = 'SMSの送信に失敗しました。もう一度お試しください。';
          
          if (error.code === 'auth/invalid-phone-number') {
            errorMessage = '有効な電話番号を入力してください。';
          } else if (error.code === 'auth/quota-exceeded') {
            errorMessage = 'SMS送信回数の上限に達しました。しばらく経ってから再度お試しください。';
          }
          
          showTouristPhoneError(errorMessage);
        });
    } catch (error) {
      console.error('認証開始エラー:', error);
      sendCodeBtn.disabled = false;
      sendCodeBtn.innerHTML = originalText;
      showTouristPhoneError('認証の開始に失敗しました。もう一度お試しください。');
    }
  } else {
    showTouristPhoneError('送信ボタンが見つかりません');
  }
}

/**
 * 観光客用認証コードを検証
 * @param {string} code 検証コード
 */
function verifyTouristCode(code) {
  console.log('観光客用認証コードを検証します:', code);
  
  // テスト用コードを検出
  if (code === '123456') {
    console.log('テスト用認証コードを検出しました。検証をバイパスします。');
    showTouristPhoneSuccess('認証コードが確認されました');
    touristPhoneVerified = true;
    
    // 検証完了メッセージを表示
    document.getElementById('tourist-phone-verified').classList.remove('d-none');
    return;
  }
  
  // 通常の検証
  if (touristConfirmationResult) {
    touristConfirmationResult.confirm(code)
      .then(function(result) {
        // 認証成功
        console.log('電話番号認証が完了しました');
        showTouristPhoneSuccess('電話番号が確認されました');
        touristPhoneVerified = true;
        
        // 認証完了メッセージを表示
        document.getElementById('tourist-phone-verified').classList.remove('d-none');
      })
      .catch(function(error) {
        console.error('認証コード検証エラー:', error);
        let errorMessage = '無効な認証コードです。もう一度お試しください。';
        showTouristPhoneError(errorMessage);
      });
  } else {
    showTouristPhoneError('先に認証コードを送信してください');
  }
}

/**
 * 観光客用電話認証エラーメッセージを表示
 * @param {string} message エラーメッセージ
 */
function showTouristPhoneError(message) {
  console.error('観光客電話認証エラー:', message);
  
  // エラー表示用の要素がなければ作成
  let errorElement = document.getElementById('tourist-phone-error');
  if (!errorElement) {
    const phoneSection = document.querySelector('#registerTouristModal .border-bottom:nth-child(3)');
    if (!phoneSection) {
      console.error('電話番号セクションが見つかりません');
      return;
    }
    
    errorElement = document.createElement('div');
    errorElement.id = 'tourist-phone-error';
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
 * 観光客用電話認証成功メッセージを表示
 * @param {string} message 成功メッセージ
 */
function showTouristPhoneSuccess(message) {
  console.log('観光客電話認証成功:', message);
  
  // 成功表示用の要素がなければ作成
  let successElement = document.getElementById('tourist-phone-success');
  if (!successElement) {
    const phoneSection = document.querySelector('#registerTouristModal .border-bottom:nth-child(3)');
    if (!phoneSection) {
      console.error('電話番号セクションが見つかりません');
      return;
    }
    
    successElement = document.createElement('div');
    successElement.id = 'tourist-phone-success';
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
 * 観光客の電話番号認証状態を取得
 * @returns {boolean} 認証完了状態
 */
function isTouristPhoneVerified() {
  return touristPhoneVerified;
}