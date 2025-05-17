/**
 * 電話番号認証の初期状態を設定するスクリプト
 * 初期状態では認証完了メッセージを表示せず、正しい状態で表示するようにします
 */
(function() {
  console.log('電話番号認証初期化: 実行開始');
  
  // DOMが読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePhoneAuthUI);
  } else {
    initializePhoneAuthUI();
  }
  
  // モーダル表示時にも実行
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'registerTouristModal' || event.target.id === 'registerGuideModal') {
      console.log('電話番号認証初期化: モーダル表示イベント');
      setTimeout(initializePhoneAuthUI, 100);
    }
  });
  
  // ページ上の新しい要素の監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const authSections = document.querySelectorAll('.border-bottom');
        for (const section of authSections) {
          if (section.textContent.includes('電話番号認証')) {
            console.log('電話番号認証初期化: 新しい電話番号セクションを検出');
            initializePhoneAuthUI();
            break;
          }
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 電話番号認証UIの初期化
  function initializePhoneAuthUI() {
    console.log('電話番号認証初期化: UI初期化');
    
    // 観光客用
    resetPhoneAuthUI('tourist');
    
    // ガイド用
    resetPhoneAuthUI('guide');
  }
  
  // 電話番号認証UIをリセット
  function resetPhoneAuthUI(prefix) {
    // 認証完了メッセージを隠す
    const verifiedElement = document.getElementById(`${prefix}-phone-verified`);
    if (verifiedElement) {
      verifiedElement.classList.add('d-none');
    }
    
    // 入力フィールドをリセット
    const phoneInput = document.getElementById(`${prefix}-phone-number`);
    if (phoneInput) {
      phoneInput.disabled = false;
      phoneInput.value = '';
    }
    
    // 認証コード入力をリセット
    const codeInput = document.getElementById(`${prefix}-verification-code`);
    if (codeInput) {
      codeInput.value = '';
      
      // コード入力セクションを表示
      const codeSection = codeInput.closest('.mb-4');
      if (codeSection) {
        codeSection.style.display = 'block';
      }
    }
    
    // reCAPTCHAコンテナをリセット
    const recaptchaContainer = document.getElementById(`${prefix}-recaptcha-container`);
    if (recaptchaContainer) {
      recaptchaContainer.style.display = 'block';
      recaptchaContainer.innerHTML = '';
    }
    
    // 送信ボタンをリセット
    const sendButton = document.getElementById(`${prefix}-send-code-btn`);
    if (sendButton) {
      sendButton.disabled = false;
    }
    
    // エラーメッセージを隠す
    const errorElement = document.getElementById(`${prefix}-phone-error`);
    if (errorElement) {
      errorElement.classList.add('d-none');
    }
    
    // 成功メッセージを隠す
    const successElement = document.getElementById(`${prefix}-phone-success`);
    if (successElement) {
      successElement.classList.add('d-none');
    }
    
    // グローバル関数経由で認証状態をリセット
    if (window.resetPhoneVerification) {
      window.resetPhoneVerification();
    }
  }
})();