/**
 * ページの基本機能を復元するためのスクリプト
 * 他のスクリプトの干渉を避けてシンプルに実装
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ページの復元を開始します...');
  
  // 新規登録ボタンのイベントハンドラを追加
  const registerButton = document.getElementById('show-user-type-modal');
  if (registerButton) {
    registerButton.removeEventListener('click', handleRegisterClick);
    registerButton.addEventListener('click', handleRegisterClick);
    console.log('新規登録ボタンのイベントを設定しました');
  } else {
    console.error('新規登録ボタンが見つかりません');
  }
  
  // モーダル内のユーザータイプ選択ボタンのイベントを設定
  setupUserTypeButtons();
  
  // DOMの変更を監視
  setupMutationObserver();
});

// 新規登録ボタンのクリックハンドラ
function handleRegisterClick(e) {
  console.log('新規登録ボタンがクリックされました');
  e.preventDefault();
  
  // 既存のモーダルがあれば削除
  removeExistingModals();
  
  // ユーザータイプ選択モーダルを表示
  showUserTypeModal();
}

// 既存のモーダルを削除
function removeExistingModals() {
  const existingModals = document.querySelectorAll('.modal.show');
  existingModals.forEach(modal => {
    try {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (error) {
      console.error('モーダルの非表示に失敗しました:', error);
      // フォールバック: 直接スタイルで非表示
      modal.style.display = 'none';
      modal.classList.remove('show');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  });
}

// ユーザータイプ選択モーダルを表示
function showUserTypeModal() {
  const userTypeModal = document.getElementById('userTypeModal');
  if (!userTypeModal) {
    console.error('ユーザータイプ選択モーダルが見つかりません');
    return;
  }
  
  try {
    const modal = new bootstrap.Modal(userTypeModal);
    modal.show();
    console.log('ユーザータイプ選択モーダルを表示しました');
  } catch (error) {
    console.error('モーダルの表示に失敗しました:', error);
    // フォールバック: 直接スタイルで表示
    userTypeModal.style.display = 'block';
    userTypeModal.classList.add('show');
    
    // 背景を追加
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
}

// ユーザータイプ選択ボタンの設定
function setupUserTypeButtons() {
  // 観光客タイプボタン
  const touristBtn = document.getElementById('tourist-type-btn');
  if (touristBtn) {
    touristBtn.removeEventListener('click', handleTouristClick);
    touristBtn.addEventListener('click', handleTouristClick);
    console.log('観光客ボタンのイベントを設定しました');
  }
  
  // ガイドタイプボタン
  const guideBtn = document.getElementById('guide-type-btn');
  if (guideBtn) {
    guideBtn.removeEventListener('click', handleGuideClick);
    guideBtn.addEventListener('click', handleGuideClick);
    console.log('ガイドボタンのイベントを設定しました');
  }
}

// 観光客ボタンのクリックハンドラ
function handleTouristClick() {
  console.log('観光客ボタンがクリックされました');
  
  // ユーザータイプモーダルを閉じる
  closeUserTypeModal();
  
  // 観光客登録モーダルを表示
  const registerModal = document.getElementById('registerModal');
  if (registerModal) {
    try {
      const modal = new bootstrap.Modal(registerModal);
      modal.show();
    } catch (error) {
      console.error('観光客登録モーダルの表示に失敗しました:', error);
      // フォールバック: 直接スタイルで表示
      registerModal.style.display = 'block';
      registerModal.classList.add('show');
      
      // 背景を追加
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }
}

// ガイドボタンのクリックハンドラ
function handleGuideClick() {
  console.log('ガイドボタンがクリックされました');
  
  // ユーザータイプモーダルを閉じる
  closeUserTypeModal();
  
  // ガイド登録モーダルを表示
  const guideRegisterModal = document.getElementById('guideRegisterModal');
  if (guideRegisterModal) {
    try {
      const modal = new bootstrap.Modal(guideRegisterModal);
      modal.show();
      
      // モーダルが表示された後、電話認証セクションを追加
      setTimeout(addPhoneVerification, 300);
    } catch (error) {
      console.error('ガイド登録モーダルの表示に失敗しました:', error);
      // フォールバック: 直接スタイルで表示
      guideRegisterModal.style.display = 'block';
      guideRegisterModal.classList.add('show');
      
      // 背景を追加
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
      
      // 電話認証セクションを追加
      setTimeout(addPhoneVerification, 300);
    }
  }
}

// ユーザータイプモーダルを閉じる
function closeUserTypeModal() {
  const userTypeModal = document.getElementById('userTypeModal');
  if (!userTypeModal) return;
  
  try {
    const modalInstance = bootstrap.Modal.getInstance(userTypeModal);
    if (modalInstance) {
      modalInstance.hide();
    }
  } catch (error) {
    console.error('ユーザータイプモーダルの非表示に失敗しました:', error);
    // フォールバック: 直接スタイルで非表示
    userTypeModal.style.display = 'none';
    userTypeModal.classList.remove('show');
    
    // 背景を削除
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }
}

// 電話番号認証セクションを追加
function addPhoneVerification() {
  console.log('電話番号認証セクションを追加します...');
  
  // ガイド登録モーダルを取得
  const modal = document.getElementById('guideRegisterModal');
  if (!modal) {
    console.error('ガイド登録モーダルが見つかりません');
    return;
  }
  
  const modalBody = modal.querySelector('.modal-body');
  if (!modalBody) {
    console.error('モーダルボディが見つかりません');
    return;
  }
  
  // 既に電話認証セクションがあれば処理しない
  if (modal.querySelector('#phone-verification-section')) {
    console.log('既に電話認証セクションが存在します');
    return;
  }
  
  // 基本情報セクションを探す
  const basicInfoHeading = findHeadingByText(modalBody, '基本情報');
  const basicInfoSection = basicInfoHeading ? findParentSection(basicInfoHeading) : null;
  
  // 身分証明書セクションを探す
  const idVerificationHeading = findHeadingByText(modalBody, '身分証明書の確認');
  const idVerificationSection = idVerificationHeading ? findParentSection(idVerificationHeading) : null;
  
  console.log('基本情報セクション:', basicInfoSection ? '見つかりました' : '見つかりません');
  console.log('身分証明書セクション:', idVerificationSection ? '見つかりました' : '見つかりません');
  
  // 電話番号認証セクションのHTML
  const phoneVerificationHTML = `
    <div id="phone-verification-section" class="mb-4">
      <h5 class="fw-bold">電話番号認証</h5>
      <div class="input-group mb-2">
        <span class="input-group-text">+81</span>
        <input type="tel" class="form-control" id="phone-number" placeholder="9012345678（先頭の0は除く）">
        <button class="btn btn-primary" type="button" id="send-code-btn">認証コード送信</button>
      </div>
      <div class="d-flex align-items-center">
        <small class="form-text text-muted me-2">ハイフンなしで入力してください</small>
        <span class="badge bg-secondary">未認証</span>
      </div>
      <div id="verification-code-container" class="d-none mt-3">
        <div class="mb-3">
          <input type="text" class="form-control text-center" id="verification-code" placeholder="認証コード">
          <small class="form-text text-muted text-center mt-1">SMSで送信された6桁のコードを入力してください</small>
          <button type="button" class="btn btn-primary w-100 mt-2" id="verify-code-btn">認証する</button>
        </div>
        <div id="verification-alert" class="alert mt-2 d-none"></div>
      </div>
    </div>
  `;
  
  // 電話番号認証セクションを作成
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = phoneVerificationHTML;
  const phoneSection = tempDiv.firstChild;
  
  if (basicInfoSection && idVerificationSection) {
    // 基本情報と身分証明書の間に挿入
    idVerificationSection.parentNode.insertBefore(phoneSection, idVerificationSection);
  } else if (basicInfoSection) {
    // 基本情報の後に挿入
    basicInfoSection.after(phoneSection);
  } else if (idVerificationSection) {
    // 身分証明書の前に挿入
    idVerificationSection.before(phoneSection);
  } else {
    // どちらも見つからない場合は、モーダルの先頭に挿入
    modalBody.prepend(phoneSection);
  }
  
  console.log('電話番号認証セクションを挿入しました');
  
  // 認証機能のセットアップ
  setupVerificationListeners(modal);
}

// 見出しテキストで要素を探す
function findHeadingByText(container, text) {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6, .section-header, .form-label');
  for (const heading of headings) {
    if (heading.textContent.trim() === text || heading.textContent.includes(text)) {
      return heading;
    }
  }
  return null;
}

// 親セクションを探す
function findParentSection(element) {
  if (!element) return null;
  
  // 親セクション要素を探す
  const parent = element.closest('.mb-4') || 
               element.closest('.form-group') || 
               element.closest('.section');
  
  return parent || element.parentElement;
}

// 認証のイベントリスナーをセットアップ
function setupVerificationListeners(modal) {
  const phoneInput = modal.querySelector('#phone-number');
  const sendCodeBtn = modal.querySelector('#send-code-btn');
  const codeContainer = modal.querySelector('#verification-code-container');
  const codeInput = modal.querySelector('#verification-code');
  const verifyBtn = modal.querySelector('#verify-code-btn');
  const alertDiv = modal.querySelector('#verification-alert');
  
  if (!phoneInput || !sendCodeBtn || !codeContainer || !codeInput || !verifyBtn) {
    console.error('電話認証に必要な要素が見つかりません');
    return;
  }
  
  // コード送信ボタンのイベント
  sendCodeBtn.addEventListener('click', function() {
    const phoneNumber = phoneInput.value.trim();
    
    if (!phoneNumber) {
      showAlert('電話番号を入力してください', 'danger');
      return;
    }
    
    // 電話番号の簡易バリデーション
    const phonePattern = /^[0-9]{9,11}$/;
    if (!phonePattern.test(phoneNumber)) {
      showAlert('有効な電話番号を入力してください（ハイフンなし、9〜11桁）', 'danger');
      return;
    }
    
    showAlert('認証コードを送信しています...', 'info');
    
    // 擬似的な送信処理
    setTimeout(function() {
      codeContainer.classList.remove('d-none');
      showAlert('認証コードを送信しました。SMSをご確認ください。', 'success');
      
      // テスト環境では固定コードを使用
      if (location.hostname === 'localhost' || location.hostname.includes('replit')) {
        codeInput.value = '123456';
      }
    }, 1000);
  });
  
  // 認証ボタンのイベント
  verifyBtn.addEventListener('click', function() {
    const code = codeInput.value.trim();
    
    if (!code) {
      showAlert('認証コードを入力してください', 'danger');
      return;
    }
    
    showAlert('認証コードを確認しています...', 'info');
    
    // 擬似的な認証処理
    setTimeout(function() {
      if (code === '123456') {
        // 認証成功
        showAlert('電話番号認証が完了しました', 'success');
        
        // UI更新
        phoneInput.readOnly = true;
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = '認証済み';
        
        // 未認証バッジを認証済みに変更
        const unverifiedBadge = modal.querySelector('#phone-verification-section .badge');
        if (unverifiedBadge) {
          unverifiedBadge.className = 'badge bg-success';
          unverifiedBadge.textContent = '認証済み';
        }
        
        // コード入力フォームを非表示
        setTimeout(function() {
          codeContainer.classList.add('d-none');
        }, 2000);
      } else {
        // 認証失敗
        showAlert('認証コードが正しくありません。再度お試しください。', 'danger');
      }
    }, 1000);
  });
  
  // アラート表示関数
  function showAlert(message, type) {
    if (!alertDiv) return;
    
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type} mt-2`;
    alertDiv.classList.remove('d-none');
    
    // 成功メッセージは5秒後に非表示
    if (type === 'success') {
      setTimeout(function() {
        alertDiv.classList.add('d-none');
      }, 5000);
    }
  }
}

// DOM変更の監視を設定
function setupMutationObserver() {
  console.log('DOM変更の監視を開始します');
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 新しく追加されたモーダルをチェック
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // ガイド登録モーダルが追加された場合
            if (node.id === 'guideRegisterModal' || 
                (node.querySelector && node.querySelector('#guideRegisterModal'))) {
              setTimeout(addPhoneVerification, 300);
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}