/**
 * 身分証明書確認セクションの上に電話番号認証を配置するスクリプト
 */
(function() {
  // テスト用認証コード
  const TEST_CODE = '123456';
  
  // 電話認証セクションのHTML
  const phoneVerificationHTML = `
    <div class="mb-3 phone-section">
      <div class="input-group mb-2">
        <span class="input-group-text">+81</span>
        <input type="tel" class="form-control" id="phone-number" placeholder="9012345678（先頭の0は除く）">
        <button class="btn btn-primary" type="button" id="send-code-btn">認証コード送信</button>
      </div>
      <div class="d-flex align-items-center">
        <small class="form-text text-muted me-2">ハイフンなしの電話番号を入力してください</small>
        <span class="unverified-text badge bg-secondary">未認証</span>
      </div>
      <div class="verification-code-container d-none mt-3">
        <div class="mb-3">
          <input type="text" class="form-control text-center" id="verification-code" placeholder="認証コード">
          <small class="form-text text-muted text-center mt-1">SMSで送信された6桁のコードを入力してください</small>
          <button type="button" class="btn btn-primary w-100 mt-2" id="verify-code-btn">認証する</button>
        </div>
        <div id="verification-alert" class="alert mt-2 d-none"></div>
      </div>
    </div>
  `;
  
  // ページロード時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    // 既存のモーダルをチェック
    const existingModal = document.getElementById('registerGuideModal');
    if (existingModal && existingModal.classList.contains('show')) {
      injectPhoneVerification(existingModal);
    }
    
    // モーダルの表示イベントをリッスン
    document.body.addEventListener('shown.bs.modal', function(e) {
      const modal = e.target;
      if (isGuideModal(modal)) {
        injectPhoneVerification(modal);
      }
    });
    
    // ガイド登録ボタンのクリックイベント
    document.body.addEventListener('click', function(e) {
      if (e.target.id === 'guide-type-btn' || 
          e.target.classList.contains('guide-register-button') ||
          (e.target.closest && (
            e.target.closest('#guide-type-btn') || 
            e.target.closest('.guide-register-button')
          ))) {
        setTimeout(function() {
          const modal = document.getElementById('registerGuideModal');
          if (modal) {
            injectPhoneVerification(modal);
          }
        }, 300);
      }
    });
    
    // 定期的に確認
    setInterval(function() {
      const modals = document.querySelectorAll('.modal.show');
      modals.forEach(function(modal) {
        if (isGuideModal(modal) && !modal.querySelector('.phone-section')) {
          injectPhoneVerification(modal);
        }
      });
    }, 1000);
  });
  
  // モーダルがガイド登録モーダルかどうか判定
  function isGuideModal(modal) {
    if (!modal) return false;
    
    // IDで判定
    if (modal.id === 'registerGuideModal') return true;
    
    // タイトルで判定
    const title = modal.querySelector('.modal-title');
    if (title && title.textContent.includes('ガイド登録')) {
      return true;
    }
    
    return false;
  }
  
  // 電話認証セクションを挿入
  function injectPhoneVerification(modal) {
    if (!modal) return;
    
    // 既に追加済みか確認
    if (modal.querySelector('.phone-section')) {
      return;
    }
    
    // モーダルボディを検索
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) return;
    
    // 基本情報セクションの後、身分証明書セクションの前に挿入
    const basicInfoSections = Array.from(modalBody.querySelectorAll('h4, h5, h6, label, .form-label, .section-header, div')).filter(el => {
      const text = el.textContent.trim();
      return text === '基本情報' || text.includes('基本情報');
    });
    
    if (basicInfoSections.length > 0) {
      const basicInfoSection = basicInfoSections[0];
      const basicInfoContainer = basicInfoSection.closest('.form-section') || 
                               basicInfoSection.closest('.section') || 
                               basicInfoSection.closest('.mb-4') || 
                               basicInfoSection.closest('.mb-3');
      
      if (basicInfoContainer) {
        // 基本情報セクション内のすべての入力フィールド（氏名、ユーザー名など）を含むフォームグループを探す
        const formGroups = basicInfoContainer.querySelectorAll('.form-group, .mb-3');
        if (formGroups.length > 0) {
          const lastFormGroup = formGroups[formGroups.length - 1];
          
          // 基本情報の最後の入力フィールドの後に電話番号認証を挿入
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = `
            <div class="mb-4">
              <label class="form-label">電話番号</label>
              ${phoneVerificationHTML}
            </div>
          `;
          lastFormGroup.parentNode.insertBefore(tempDiv.firstElementChild, lastFormGroup.nextSibling);
          setupVerificationListeners(modal);
          return;
        }
      }
    }
    
    // 基本情報が見つからない場合は、身分証明書の確認セクションを探す
    const idVerificationSection = findIdVerificationSection(modalBody);
    
    if (idVerificationSection) {
      // 身分証明書確認セクションの前に電話番号認証セクションを挿入
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div class="mb-4">
          <label class="form-label">電話番号</label>
          ${phoneVerificationHTML}
        </div>
      `;
      idVerificationSection.parentNode.insertBefore(tempDiv.firstElementChild, idVerificationSection);
    } else {
      // 最初のフォーム要素を探す
      const firstInput = modalBody.querySelector('input, select, textarea');
      if (firstInput) {
        const firstGroup = firstInput.closest('.form-group') || 
                          firstInput.closest('.mb-3');
        
        if (firstGroup) {
          // 最初のフォーム要素の前に挿入
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = `
            <div class="mb-4">
              <label class="form-label fw-bold mb-2">電話番号</label>
              ${phoneVerificationHTML}
            </div>
          `;
          firstGroup.parentNode.insertBefore(tempDiv.firstElementChild, firstGroup);
        }
      } else {
        // モーダルの最初に追加
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
          <div class="mb-4">
            <label class="form-label fw-bold mb-2">電話番号</label>
            ${phoneVerificationHTML}
          </div>
        `;
        modalBody.insertBefore(tempDiv.firstElementChild, modalBody.firstChild);
      }
    }
    
    // イベントリスナーをセットアップ
    setupVerificationListeners(modal);
  }
  
  // 身分証明書確認セクションを探す関数
  function findIdVerificationSection(modalBody) {
    // 基本情報セクションの後、身分証明書セクションの前に挿入する方法
    // 身分証明書関連のヘッダーやラベルを探す
    const idVerificationHeaders = Array.from(modalBody.querySelectorAll('h4, h5, h6, label, .form-label, .section-header, div')).filter(el => {
      const text = el.textContent.trim();
      return text.includes('身分証明') || 
             text.includes('書類の種類') || 
             text.includes('国籍') || 
             text.includes('確認') || 
             text.includes('証明書');
    });
    
    // 基本情報セクションを探す
    const basicInfoSections = Array.from(modalBody.querySelectorAll('h4, h5, h6, label, .form-label, .section-header, div')).filter(el => {
      const text = el.textContent.trim();
      return text === '基本情報' || text.includes('基本情報');
    });
    
    // 基本情報と身分証明書のセクション両方が見つかった場合
    if (basicInfoSections.length > 0 && idVerificationHeaders.length > 0) {
      // 基本情報セクションの内容（氏名、ユーザー名など）の後を探す
      const basicInfoSection = basicInfoSections[0];
      const basicInfoContainer = basicInfoSection.closest('.form-section') || 
                              basicInfoSection.closest('.section') || 
                              basicInfoSection.closest('.mb-4') || 
                              basicInfoSection.closest('.mb-3');
      
      if (basicInfoContainer) {
        // 基本情報セクションの次の要素（通常は身分証明書セクション）
        let nextElement = basicInfoContainer.nextElementSibling;
        while (nextElement) {
          if (nextElement.textContent.includes('身分証明') || 
              nextElement.textContent.includes('書類の種類') || 
              nextElement.textContent.includes('国籍') || 
              nextElement.querySelector('select')) {
            return nextElement;
          }
          nextElement = nextElement.nextElementSibling;
        }
      }
    }
    
    // 通常の検索方法
    if (idVerificationHeaders.length > 0) {
      // 最も親に近いセクションコンテナを探す
      for (const header of idVerificationHeaders) {
        const sectionContainer = header.closest('.form-section') || 
                                header.closest('.section') || 
                                header.closest('.mb-4') || 
                                header.closest('.mb-3') || 
                                header;
        if (sectionContainer) {
          return sectionContainer;
        }
      }
      return idVerificationHeaders[0]; // 最初のヘッダー要素を返す
    }
    
    // 身分証明書のセレクトメニューを探す
    const idDocumentSelect = modalBody.querySelector('select[id$="document-type"]') || 
                            modalBody.querySelector('select:first-of-type');
    
    if (idDocumentSelect) {
      const selectGroup = idDocumentSelect.closest('.form-group') || 
                         idDocumentSelect.closest('.mb-3') || 
                         idDocumentSelect.closest('.mb-4');
      return selectGroup || idDocumentSelect.parentNode;
    }
    
    return null;
  }
  
  // 認証のイベントリスナーをセットアップ
  function setupVerificationListeners(modal) {
    const phoneInput = modal.querySelector('#phone-number');
    const sendCodeBtn = modal.querySelector('#send-code-btn');
    const codeContainer = modal.querySelector('.verification-code-container');
    const codeInput = modal.querySelector('#verification-code');
    const verifyBtn = modal.querySelector('#verify-code-btn');
    const alertDiv = modal.querySelector('#verification-alert');
    const unverifiedText = modal.querySelector('.unverified-text');
    
    if (!phoneInput || !sendCodeBtn || !codeContainer || !codeInput || !verifyBtn) {
      return;
    }
    
    // 認証状態をチェック
    const isVerified = sessionStorage.getItem('phone-verified') === 'true';
    if (isVerified) {
      updateToVerifiedUI();
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
      const phonePattern = /^\+?[0-9\s\-()]{6,20}$/;
      if (!phonePattern.test(phoneNumber)) {
        showAlert('有効な電話番号を入力してください', 'danger');
        return;
      }
      
      // 送信中表示
      showAlert('認証コードを送信しています...', 'info');
      
      // 送信シミュレーション (本番では実際にSMS送信のAPIを呼び出す)
      setTimeout(function() {
        codeContainer.classList.remove('d-none');
        showAlert('認証コードを送信しました。SMSをご確認ください。', 'success');
        codeInput.focus();
        console.log('テスト用認証コード: ' + TEST_CODE);
        // テスト中はコードを自動入力
        if (location.hostname === 'localhost' || location.hostname.includes('replit')) {
          codeInput.value = TEST_CODE;
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
      
      // 認証中表示
      showAlert('認証コードを確認しています...', 'info');
      
      // 認証シミュレーション
      setTimeout(function() {
        if (code === TEST_CODE) {
          // 認証成功
          updateToVerifiedUI();
          showAlert('電話番号認証が完了しました！', 'success');
          
          // 認証状態を保存
          sessionStorage.setItem('phone-verified', 'true');
        } else {
          // 認証失敗
          showAlert('認証コードが正しくありません。再度お試しください。', 'danger');
        }
      }, 1000);
    });
    
    // Enterキーのイベント
    phoneInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendCodeBtn.click();
      }
    });
    
    codeInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyBtn.click();
      }
    });
    
    // 認証済みUIに更新
    function updateToVerifiedUI() {
      // 未認証テキストを非表示
      if (unverifiedText) {
        unverifiedText.style.display = 'none';
        
        // 認証済みバッジを追加
        const verifiedBadge = document.createElement('span');
        verifiedBadge.className = 'badge bg-success verification-badge';
        verifiedBadge.textContent = '認証済み';
        unverifiedText.parentNode.insertBefore(verifiedBadge, unverifiedText.nextSibling);
      }
      
      // 入力フィールドを読み取り専用に
      if (phoneInput) {
        phoneInput.readOnly = true;
      }
      
      // 送信ボタンを無効化
      if (sendCodeBtn) {
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = '認証済み';
      }
      
      // 認証コード入力セクションを非表示
      if (codeContainer) {
        codeContainer.classList.add('d-none');
      }
    }
    
    // アラートを表示
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
})();