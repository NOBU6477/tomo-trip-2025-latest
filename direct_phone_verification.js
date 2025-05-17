/**
 * 基本情報と身分証明書の確認セクションの間に電話番号認証を配置する
 * よりシンプルで直接的なアプローチ
 */
(function() {
  // テスト用認証コード
  const TEST_CODE = '123456';
  
  // ページロード時と新しいモーダルが表示されたときに実行
  document.addEventListener('DOMContentLoaded', function() {
    // 初期モーダルのチェック
    setTimeout(checkForGuideModal, 500);
    
    // モーダルが表示されたときのイベント
    document.body.addEventListener('shown.bs.modal', function(e) {
      if (e.target && e.target.classList.contains('modal')) {
        checkForGuideModal();
      }
    });
    
    // 新規登録ボタンのクリックイベント
    document.addEventListener('click', function(e) {
      if (e.target.id === 'show-user-type-modal' || 
          (e.target.closest && e.target.closest('#show-user-type-modal'))) {
        setTimeout(checkForGuideModal, 500);
      }
      
      // ガイドタイプボタンのクリック
      if (e.target.id === 'guide-type-btn' || 
          (e.target.closest && e.target.closest('#guide-type-btn'))) {
        setTimeout(checkForGuideModal, 500);
      }
    });
  });
  
  // モーダルをチェックして電話認証を追加
  function checkForGuideModal() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      const title = modal.querySelector('.modal-title');
      if (title && title.textContent.includes('ガイド登録')) {
        // 既存の電話番号セクションを削除（重複防止）
        removeExistingPhoneSections(modal);
        
        // セクションを追加
        addPhoneVerificationSection(modal);
      }
    });
  }
  
  // 既存の電話番号セクションを削除
  function removeExistingPhoneSections(modal) {
    // 電話番号セクションを探す
    const existingPhoneSections = modal.querySelectorAll('.phone-verification-section');
    existingPhoneSections.forEach(function(section) {
      section.remove();
    });
    
    // 電話番号ラベルを持つ要素も削除
    const labels = modal.querySelectorAll('label');
    labels.forEach(function(label) {
      if (label.textContent.includes('電話番号')) {
        const parent = label.closest('.mb-3') || label.closest('.mb-4') || label.parentNode;
        if (parent) {
          parent.remove();
        }
      }
    });
  }
  
  // 電話認証セクションをモーダルに追加
  function addPhoneVerificationSection(modal) {
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) return;
    
    // 基本情報セクションと身分証明書セクションを探す
    const basicInfoSection = findBasicInfoSection(modalBody);
    const idVerificationSection = findIdVerificationSection(modalBody);
    
    // 電話認証セクションのHTML
    const phoneVerificationHTML = `
      <div class="mb-4 phone-verification-section">
        <div class="form-group">
          <label class="form-label">電話番号</label>
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
      </div>
    `;
    
    // 基本情報と身分証明書の間に挿入
    if (basicInfoSection && idVerificationSection) {
      // セクションの直後に挿入
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = phoneVerificationHTML;
      
      // 両方のセクションが見つかった場合、基本情報の後に挿入
      if (basicInfoSection.nextElementSibling === idVerificationSection) {
        modalBody.insertBefore(tempDiv.firstElementChild, idVerificationSection);
      } else {
        // 間に他の要素がある場合は身分証明書の前に挿入
        modalBody.insertBefore(tempDiv.firstElementChild, idVerificationSection);
      }
    } else if (basicInfoSection) {
      // 基本情報のみ見つかった場合、その後に追加
      basicInfoSection.insertAdjacentHTML('afterend', phoneVerificationHTML);
    } else if (idVerificationSection) {
      // 身分証明書のみ見つかった場合、その前に追加
      idVerificationSection.insertAdjacentHTML('beforebegin', phoneVerificationHTML);
    } else {
      // 両方見つからない場合はモーダルの中央あたりに追加
      const formGroups = modalBody.querySelectorAll('.form-group, .mb-3, .mb-4');
      if (formGroups.length > 1) {
        // フォームグループの中間に挿入
        const middleIndex = Math.floor(formGroups.length / 2);
        formGroups[middleIndex].insertAdjacentHTML('beforebegin', phoneVerificationHTML);
      } else {
        // フォームグループがない場合はモーダルの先頭に追加
        modalBody.insertAdjacentHTML('afterbegin', phoneVerificationHTML);
      }
    }
    
    // イベントリスナーをセットアップ
    setupVerificationListeners(modal);
  }
  
  // 基本情報セクションを探す
  function findBasicInfoSection(container) {
    // セクションヘッダーを探す
    const headers = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6, div, label'));
    for (const header of headers) {
      if (header.textContent.includes('基本情報')) {
        return header.closest('.section') || 
               header.closest('.form-section') || 
               header.closest('.mb-4') || 
               header.closest('.mb-3') || 
               header;
      }
    }
    
    // 基本情報っぽいフィールドを探す
    const nameFields = container.querySelectorAll('input[name*="name"], input[placeholder*="名前"], input[id*="name"]');
    if (nameFields.length > 0) {
      const nameField = nameFields[0];
      return nameField.closest('.section') || 
             nameField.closest('.form-section') || 
             nameField.closest('.mb-4') || 
             nameField.closest('.mb-3');
    }
    
    return null;
  }
  
  // 身分証明書セクションを探す
  function findIdVerificationSection(container) {
    // セクションヘッダーを探す
    const headers = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6, div, label'));
    for (const header of headers) {
      if (header.textContent.includes('身分証明書') || 
          header.textContent.includes('確認') || 
          header.textContent.includes('国籍')) {
        return header.closest('.section') || 
               header.closest('.form-section') || 
               header.closest('.mb-4') || 
               header.closest('.mb-3') || 
               header;
      }
    }
    
    // 国籍や書類選択フィールドを探す
    const selectFields = container.querySelectorAll('select');
    for (const select of selectFields) {
      const label = findLabelForElement(select, container);
      if (label && (label.textContent.includes('国籍') || 
                   label.textContent.includes('書類の種類'))) {
        return select.closest('.section') || 
               select.closest('.form-section') || 
               select.closest('.mb-4') || 
               select.closest('.mb-3');
      }
    }
    
    return null;
  }
  
  // 要素に関連するラベルを探す
  function findLabelForElement(element, container) {
    if (!element.id) return null;
    
    // idを使ってラベルを探す
    const label = container.querySelector(`label[for="${element.id}"]`);
    if (label) return label;
    
    // 親要素のラベルを探す
    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel;
    
    // 近くのラベルを探す
    const parent = element.parentNode;
    const siblings = parent.childNodes;
    for (const sibling of siblings) {
      if (sibling.nodeName === 'LABEL') return sibling;
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