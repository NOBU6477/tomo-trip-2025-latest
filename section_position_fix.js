/**
 * 基本情報と身分証明書の確認の間に電話番号認証セクションを配置する修正スクリプト
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

  // ページロード時とDOM変更時の両方で実行
  function initializePositionFix() {
    // 既存の電話番号セクションを削除（重複防止）
    removeExistingPhoneSection();

    // 初期状態のモーダルを確認
    const initialModal = document.querySelector('#registerGuideModal.show, .modal.show');
    if (initialModal) {
      positionPhoneSection(initialModal);
    }

    // モーダル表示時のイベントリスナー
    document.body.addEventListener('shown.bs.modal', function(e) {
      const modal = e.target;
      removeExistingPhoneSection(modal);
      positionPhoneSection(modal);
    });

    // MutationObserverでDOM変更を監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const modals = document.querySelectorAll('.modal.show');
          modals.forEach(function(modal) {
            if (!modal.querySelector('.phone-section')) {
              positionPhoneSection(modal);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 定期確認（バックアップとして）
    setInterval(function() {
      const visibleModals = document.querySelectorAll('.modal.show');
      visibleModals.forEach(function(modal) {
        if (!modal.querySelector('.phone-section')) {
          positionPhoneSection(modal);
        }
      });
    }, 1000);
  }

  // 既存の電話番号セクションを削除
  function removeExistingPhoneSection(modal) {
    const container = modal || document.body;
    const existingPhoneSections = container.querySelectorAll('.phone-section');
    existingPhoneSections.forEach(function(section) {
      const parentElement = section.closest('.mb-4') || section.closest('.mb-3') || section.parentNode;
      if (parentElement) {
        parentElement.remove();
      }
    });

    // 「電話番号」というラベルだけの要素も削除（親要素ごと）
    const phoneLabels = container.querySelectorAll('label');
    phoneLabels.forEach(function(label) {
      if (label.textContent.trim() === '電話番号') {
        const parentElement = label.closest('.mb-4') || label.closest('.mb-3') || label.parentNode;
        if (parentElement && !parentElement.querySelector('.phone-section')) {
          parentElement.remove();
        }
      }
    });
  }

  // 電話番号セクションを正確な位置に配置
  function positionPhoneSection(modal) {
    if (!modal) return;
    
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) return;

    // 基本情報セクションと身分証明書セクションを探す
    const basicInfoSection = findSectionByText(modalBody, '基本情報');
    const idVerificationSection = findSectionByText(modalBody, '身分証明書の確認');

    if (basicInfoSection && idVerificationSection) {
      // 基本情報セクションの最後の入力項目を探す
      const lastBasicInfoFields = getAllFormControls(basicInfoSection);
      
      if (lastBasicInfoFields.length > 0) {
        // 最後の入力項目を見つける
        const lastField = lastBasicInfoFields[lastBasicInfoFields.length - 1];
        const lastFieldGroup = lastField.closest('.form-group') || 
                              lastField.closest('.mb-3') || 
                              lastField.parentNode;
        
        // 基本情報と身分証明書の間に挿入
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
          <div class="mb-4">
            <label class="form-label">電話番号</label>
            ${phoneVerificationHTML}
          </div>
        `;
        
        // 基本情報セクションの後、身分証明書セクションの前に挿入
        modalBody.insertBefore(tempDiv.firstElementChild, idVerificationSection);
        
        // イベントリスナーをセットアップ
        setupVerificationListeners(modal);
      }
    } else {
      // 基本情報セクションが見つからない場合、電話番号セクションだけを探す
      const phoneNumberLabel = findLabelByText(modalBody, '電話番号');
      if (phoneNumberLabel) {
        // 電話番号セクションが既にある場合は何もしない
        return;
      }
      
      // 身分証明書の確認セクションがある場合、その直前に挿入
      if (idVerificationSection) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
          <div class="mb-4">
            <label class="form-label">電話番号</label>
            ${phoneVerificationHTML}
          </div>
        `;
        
        modalBody.insertBefore(tempDiv.firstElementChild, idVerificationSection);
        setupVerificationListeners(modal);
      }
    }
  }

  // テキストからセクションを探す
  function findSectionByText(container, text) {
    // 見出しとラベルを探す
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6, .section-header, label.form-label, div'));
    
    for (const heading of headings) {
      if (heading.textContent.trim() === text || heading.textContent.trim().includes(text)) {
        // 見出しの親セクションを探す
        const section = heading.closest('.section') || 
                       heading.closest('.form-section') || 
                       heading.closest('.mb-4') || 
                       heading.closest('.mb-3');
        
        if (section) {
          return section;
        } else {
          // 親セクションが見つからない場合は見出し自体を返す
          return heading;
        }
      }
    }
    
    return null;
  }

  // ラベルをテキストから探す
  function findLabelByText(container, text) {
    const labels = Array.from(container.querySelectorAll('label'));
    
    for (const label of labels) {
      if (label.textContent.trim() === text || label.textContent.trim().includes(text)) {
        return label;
      }
    }
    
    return null;
  }

  // セクション内のすべてのフォームコントロールを取得
  function getAllFormControls(section) {
    if (!section) return [];
    
    return Array.from(section.querySelectorAll('input, select, textarea'));
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

  // ページロード時に実行
  document.addEventListener('DOMContentLoaded', initializePositionFix);
  
  // 既に読み込まれている場合も実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializePositionFix();
  }
})();