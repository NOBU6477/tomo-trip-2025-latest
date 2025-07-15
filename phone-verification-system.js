/**
 * 電話番号認証システム
 * SMS認証コード送信と認証機能を実装
 */

(function() {
  'use strict';
  
  console.log('📱 電話番号認証システム開始');
  
  let verificationCodeSent = false;
  let phoneVerified = false;
  
  // 初期化
  function initialize() {
    setupPhoneVerification();
  }
  
  // 電話番号認証の設定
  function setupPhoneVerification() {
    // 観光客用認証ボタン
    const touristSendCodeBtn = document.getElementById('tourist-send-code-btn');
    if (touristSendCodeBtn) {
      touristSendCodeBtn.addEventListener('click', function() {
        sendVerificationCode('tourist');
      });
    }
    
    // ガイド用認証ボタン
    const guideSendCodeBtn = document.getElementById('guide-send-code-btn');
    if (guideSendCodeBtn) {
      guideSendCodeBtn.addEventListener('click', function() {
        sendVerificationCode('guide');
      });
    }
    
    // 認証コード入力フィールドの監視
    setupVerificationCodeInput('tourist');
    setupVerificationCodeInput('guide');
  }
  
  // 認証コード送信
  function sendVerificationCode(userType) {
    const phoneInput = document.getElementById(`${userType}-phone-number`);
    const sendBtn = document.getElementById(`${userType}-send-code-btn`);
    
    if (!phoneInput || !sendBtn) {
      console.error('電話番号入力フィールドまたはボタンが見つかりません');
      return;
    }
    
    const phoneNumber = phoneInput.value.trim();
    
    // 電話番号バリデーション
    if (!validatePhoneNumber(phoneNumber)) {
      showAlert('有効な電話番号を入力してください（例：9012345678）', 'danger');
      return;
    }
    
    // ボタンをローディング状態に
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="spinner-border spinner-border-sm me-2"></i>送信中...';
    
    // 実際のSMS送信をシミュレート（実装時はAPI呼び出し）
    setTimeout(() => {
      // SMS送信成功
      verificationCodeSent = true;
      
      // ボタンを再送信状態に
      sendBtn.disabled = false;
      sendBtn.innerHTML = '再送信';
      sendBtn.classList.remove('btn-primary');
      sendBtn.classList.add('btn-outline-primary');
      
      // 成功メッセージ
      showAlert(`+81${phoneNumber}にSMSで認証コードを送信しました`, 'success');
      
      // 認証コード入力フィールドを有効化
      const codeInput = document.getElementById(`${userType}-verification-code`);
      if (codeInput) {
        codeInput.disabled = false;
        codeInput.focus();
      }
      
      console.log('📱 認証コード送信完了');
      
    }, 2000); // 2秒のシミュレート
  }
  
  // 認証コード入力の監視
  function setupVerificationCodeInput(userType) {
    const codeInput = document.getElementById(`${userType}-verification-code`);
    if (!codeInput) return;
    
    codeInput.addEventListener('input', function() {
      const code = this.value.trim();
      
      // 6桁入力された場合、自動認証
      if (code.length === 6) {
        verifyCode(userType, code);
      }
    });
  }
  
  // 認証コード確認
  function verifyCode(userType, code) {
    // 簡単な認証コード検証（実装時はサーバー側で検証）
    const validCodes = ['123456', '111111', '000000']; // テスト用コード
    
    if (validCodes.includes(code)) {
      // 認証成功
      phoneVerified = true;
      
      // 成功メッセージを表示
      const verifiedDiv = document.getElementById(`${userType}-phone-verified`);
      if (verifiedDiv) {
        verifiedDiv.classList.remove('d-none');
      }
      
      // 認証コード入力を無効化
      const codeInput = document.getElementById(`${userType}-verification-code`);
      if (codeInput) {
        codeInput.disabled = true;
        codeInput.classList.add('is-valid');
      }
      
      // 送信ボタンを無効化
      const sendBtn = document.getElementById(`${userType}-send-code-btn`);
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '認証完了';
        sendBtn.classList.remove('btn-outline-primary');
        sendBtn.classList.add('btn-success');
      }
      
      showAlert('電話番号認証が完了しました！', 'success');
      console.log('✅ 電話番号認証成功');
      
    } else {
      // 認証失敗
      const codeInput = document.getElementById(`${userType}-verification-code`);
      if (codeInput) {
        codeInput.classList.add('is-invalid');
        setTimeout(() => {
          codeInput.classList.remove('is-invalid');
        }, 3000);
      }
      
      showAlert('認証コードが正しくありません', 'danger');
    }
  }
  
  // 電話番号バリデーション
  function validatePhoneNumber(phoneNumber) {
    // 日本の携帯電話番号パターン（先頭0除く）
    const phonePattern = /^[789]0\d{8}$/;
    return phonePattern.test(phoneNumber);
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
    
    // 自動削除
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
  
  // 認証状態取得（外部から使用可能）
  window.getPhoneVerificationStatus = function() {
    return {
      codeSent: verificationCodeSent,
      verified: phoneVerified
    };
  };
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();