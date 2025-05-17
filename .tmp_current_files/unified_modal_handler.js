/**
 * 統一されたモーダル処理スクリプト
 * 登録、ID書類アップロード、電話認証などの機能を統合
 */
document.addEventListener("DOMContentLoaded", function() {
  // モーダル初期化
  initializeModals();
  
  // ユーザー登録ボタンのイベント設定
  setupRegistrationButtons();
  
  // 電話認証のイベント設定
  setupPhoneVerification();
  
  // ID書類アップロードのイベント設定
  setupIdDocumentUpload();
  
  // 登録フォームの送信処理は個別に設定済み
  // setupRegistrationButtons()内で実装しています
});

/**
 * モーダルの初期化
 */
function initializeModals() {
  // ユーザータイプモーダル内のボタン設定
  document.querySelectorAll("#select-tourist-btn, #select-guide-btn").forEach(button => {
    button.addEventListener("click", function() {
      const userType = this.id === "select-tourist-btn" ? "tourist" : "guide";
      const currentModal = bootstrap.Modal.getInstance(document.getElementById("userTypeModal"));
      currentModal.hide();
      
      setTimeout(() => {
        const registerModalId = userType === "tourist" ? "registerTouristModal" : "guideRegisterModal";
        console.log("モーダルID:", registerModalId, "要素:", document.getElementById(registerModalId));
        const modalElement = document.getElementById(registerModalId);
        if (modalElement) {
          const registerModal = new bootstrap.Modal(modalElement);
          registerModal.show();
        } else {
          console.error("モーダル要素が見つかりません:", registerModalId);
          // フォールバック: 観光客モーダルを表示
          const touristModal = new bootstrap.Modal(document.getElementById("registerTouristModal"));
          touristModal.show();
        }
      }, 500);
    });
  });
  
  // ヘッダーのボタン設定
  const headerRegisterLink = document.getElementById("register-btn");
  if (headerRegisterLink) {
    headerRegisterLink.addEventListener("click", function(e) {
      e.preventDefault();
      showUserTypeModal();
    });
  }
  
  // ヒーローセクションのガイド登録ボタン
  const searchGuidesBtn = document.getElementById("search-guides-btn");
  if (searchGuidesBtn) {
    searchGuidesBtn.addEventListener("click", function() {
      window.location.href = "guides.html";
    });
  }
  
  // 「ガイドになる」ボタン設定
  const becomeGuideBtn = document.getElementById("become-guide-btn");
  if (becomeGuideBtn) {
    becomeGuideBtn.addEventListener("click", function(e) {
      e.preventDefault();
      showUserTypeModal();
    });
  }
  
  // モーダル閉じるボタンの拡張
  document.querySelectorAll(".modal .btn-close").forEach(button => {
    button.addEventListener("click", function() {
      const modal = this.closest(".modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    });
  });
  
  // 「ユーザータイプ選択に戻る」リンク設定
  document.querySelectorAll("#back-to-user-type").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const currentModal = this.closest(".modal");
      const modalInstance = bootstrap.Modal.getInstance(currentModal);
      modalInstance.hide();
      
      setTimeout(() => {
        showUserTypeModal();
      }, 500);
    });
  });
}

/**
 * ユーザー登録ボタンの設定
 */
function setupRegistrationButtons() {
  // 観光客登録フォーム
  const touristForm = document.getElementById("tourist-register-form");
  if (touristForm) {
    touristForm.addEventListener("submit", function(e) {
      e.preventDefault();
      handleFormSubmission("tourist");
    });
  }
  
  // ガイド登録フォーム
  const guideForm = document.getElementById("guide-register-form");
  if (guideForm) {
    guideForm.addEventListener("submit", function(e) {
      e.preventDefault();
      handleFormSubmission("guide");
    });
  }
}

/**
 * 電話認証機能の設定
 */
function setupPhoneVerification() {
  // 観光客電話認証ボタン
  const touristVerifyPhone = document.getElementById("tourist-verify-phone");
  if (touristVerifyPhone) {
    touristVerifyPhone.addEventListener("click", function() {
      const phoneNumber = document.getElementById("tourist-phone").value;
      if (!phoneNumber) {
        showError("電話番号を入力してください。");
        return;
      }
      
      verifyPhoneNumber(phoneNumber, "tourist");
    });
  }
  
  // ガイド電話認証ボタン
  const guideVerifyPhone = document.getElementById("guide-verify-phone");
  if (guideVerifyPhone) {
    guideVerifyPhone.addEventListener("click", function() {
      const phoneNumber = document.getElementById("guide-phone").value;
      if (!phoneNumber) {
        showError("電話番号を入力してください。");
        return;
      }
      
      verifyPhoneNumber(phoneNumber, "guide");
    });
  }
}

/**
 * 電話番号認証処理
 * @param {string} phoneNumber 電話番号
 * @param {string} userType ユーザータイプ
 */
function verifyPhoneNumber(phoneNumber, userType) {
  // 電話認証中表示
  const pendingBadge = document.getElementById(`${userType}-phone-pending`);
  const verifiedBadge = document.getElementById(`${userType}-phone-verified`);
  
  if (pendingBadge) pendingBadge.classList.remove("d-none");
  if (verifiedBadge) verifiedBadge.classList.add("d-none");
  
  // Firebase認証呼び出し模擬
  setTimeout(() => {
    if (pendingBadge) pendingBadge.classList.add("d-none");
    if (verifiedBadge) verifiedBadge.classList.remove("d-none");
    
    // ガイド登録の場合は電話番号を表示
    if (userType === "guide") {
      const phoneDisplay = document.getElementById("guide-phone-number");
      if (phoneDisplay) {
        phoneDisplay.textContent = phoneNumber;
      }
    }
    
    showSuccess("電話番号が認証されました。");
  }, 2000);
}

/**
 * 書類アップロード機能の設定
 */
function setupIdDocumentUpload() {
  // 観光客ID書類アップロードボタン
  const touristUploadId = document.getElementById("tourist-upload-id");
  if (touristUploadId) {
    touristUploadId.addEventListener("click", function() {
      // 観光客用のID書類アップロード処理を実装
      console.log("観光客ID書類アップロードボタンがクリックされました");
      alert("観光客用ID書類アップロード機能は別の方法で実装されています");
    });
  }
  
  // ガイドID書類アップロードボタン
  // ガイド登録フォームでは別の方法で処理
}

// 重複防止のためshowIdDocumentModal関数は削除し、別の関数名で実装
/**
 * 観光客用ID書類アップロード処理
 * @param {string} userType ユーザータイプ
 */
function handleTouristDocument(userType) {
  console.log("観光客用ID書類アップロード処理を開始");
  alert("観光客用ID書類アップロード機能は現在準備中です");
}

/**
 * 登録フォーム送信処理
 * @param {string} userType ユーザータイプ
 */
function handleFormSubmission(userType) {
  // パスワード一致チェック
  const password = document.getElementById(`${userType}-password`).value;
  const confirmPassword = document.getElementById(`${userType}-confirm-password`).value;
  
  if (password !== confirmPassword) {
    showError("パスワードが一致しません。");
    return;
  }
  
  // 送信中表示
  const submitButton = document.querySelector(`#${userType}-register-form button[type="submit"]`);
  const originalText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
  
  // API送信模擬
  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
    
    // 成功メッセージ表示
    showSuccess("アカウントが正常に登録されました。");
    
    // モーダルを閉じる
    const modalId = userType === "tourist" ? "registerTouristModal" : "guideRegisterModal";
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    modal.hide();
    
    // ログインページへリダイレクト
    setTimeout(() => {
      // 実際のアプリケーションではログインページへリダイレクト
      window.location.reload();
    }, 1000);
  }, 2000);
}

/**
 * ユーザータイプモーダルを表示
 */
function showUserTypeModal() {
  const modal = new bootstrap.Modal(document.getElementById("userTypeModal"));
  modal.show();
}

/**
 * エラーメッセージ表示
 * @param {string} message エラーメッセージ
 */
function showError(message) {
  // トースト通知またはアラート
  alert(message);
}

/**
 * 成功メッセージ表示
 * @param {string} message 成功メッセージ
 */
function showSuccess(message) {
  // トースト通知またはアラート
  alert(message);
}