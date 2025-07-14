/**
 * シンプルで確実に動作する電話番号認証セクション
 * 基本的なDOM操作のみを使用し、複雑な処理を避ける
 */
(function() {
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', init);
  
  // 既に読み込まれている場合でも実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }
  
  // 初期化関数
  function init() {
    // ユーザータイプ選択モーダルのボタンにイベントリスナーを追加
    const userTypeModal = document.getElementById('userTypeModal');
    if (userTypeModal) {
      const guideBtn = userTypeModal.querySelector('#guide-type-btn');
      if (guideBtn) {
        guideBtn.addEventListener('click', function() {
          setTimeout(addPhoneVerification, 500); // モーダルの表示後に実行
        });
      }
    }
    
    // 新規登録ボタンにもイベントリスナーを追加
    const registerBtn = document.getElementById('show-user-type-modal');
    if (registerBtn) {
      registerBtn.addEventListener('click', function() {
        setTimeout(function() {
          const guideBtn = document.getElementById('guide-type-btn');
          if (guideBtn) {
            guideBtn.addEventListener('click', function() {
              setTimeout(addPhoneVerification, 500);
            });
          }
        }, 300);
      });
    }
    
    // モーダル表示イベントを監視
    document.body.addEventListener('shown.bs.modal', function(e) {
      if (e.target && e.target.classList.contains('modal')) {
        const modalTitle = e.target.querySelector('.modal-title');
        if (modalTitle && modalTitle.textContent.includes('ガイド登録')) {
          addPhoneVerification();
        }
      }
    });
    
    // 既に表示されているモーダルをチェック
    checkExistingModals();
    
    // 定期的にモーダルをチェック（セーフティネット）
    setInterval(checkExistingModals, 2000);
  }
  
  // 既に表示されているモーダルをチェック
  function checkExistingModals() {
    const modals = document.querySelectorAll('.modal.show, .modal[style*="display: block"]');
    modals.forEach(function(modal) {
      const modalTitle = modal.querySelector('.modal-title');
      if (modalTitle && modalTitle.textContent.includes('ガイド登録')) {
        addPhoneVerification();
      }
    });
  }
  
  // 電話番号認証セクションを追加
  function addPhoneVerification() {
    // 表示されているガイド登録モーダルを探す
    const guideModals = document.querySelectorAll('.modal.show, .modal[style*="display: block"]');
    
    guideModals.forEach(function(modal) {
      const modalTitle = modal.querySelector('.modal-title');
      if (modalTitle && modalTitle.textContent.includes('ガイド登録')) {
        const modalBody = modal.querySelector('.modal-body');
        if (!modalBody) return;
        
        // 既に電話認証セクションが追加されていれば処理しない
        if (modalBody.querySelector('#phone-verification-section')) return;
        
        // 基本情報セクションを探す
        const basicInfoSection = findSectionByTitle(modalBody, '基本情報');
        
        // 身分証明書セクションを探す
        const idVerificationSection = findSectionByTitle(modalBody, '身分証明書の確認');
        
        // 国籍セクションも探す (身分証明書セクションの一部かもしれないため)
        const nationalityField = findElementByLabel(modalBody, '国籍');
        const nationalitySection = nationalityField ? findParentSection(nationalityField) : null;
        
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
        
        // 電話番号認証セクションの挿入
        const phoneSection = document.createElement('div');
        phoneSection.innerHTML = phoneVerificationHTML;
        
        if (basicInfoSection && idVerificationSection) {
          // 基本情報と身分証明書のセクションが見つかった場合、その間に挿入
          if (basicInfoSection.nextElementSibling === idVerificationSection) {
            basicInfoSection.after(phoneSection.firstElementChild);
          } else {
            idVerificationSection.before(phoneSection.firstElementChild);
          }
        } else if (basicInfoSection) {
          // 基本情報セクションのみが見つかった場合、その後に挿入
          basicInfoSection.after(phoneSection.firstElementChild);
        } else if (idVerificationSection) {
          // 身分証明書セクションのみが見つかった場合、その前に挿入
          idVerificationSection.before(phoneSection.firstElementChild);
        } else if (nationalitySection) {
          // 国籍セクションが見つかった場合、その前に挿入
          nationalitySection.before(phoneSection.firstElementChild);
        } else {
          // どのセクションも見つからない場合は、モーダルの先頭に挿入
          modalBody.prepend(phoneSection.firstElementChild);
        }
        
        // 電話番号認証機能を設定
        setupPhoneVerification(modal);
      }
    });
  }
  
  // セクションのタイトルから該当セクションを探す
  function findSectionByTitle(container, title) {
    const allHeadings = container.querySelectorAll('h1, h2, h3, h4, h5, h6, .form-label.fw-bold, .section-header');
    
    for (const heading of allHeadings) {
      if (heading.textContent.trim() === title || heading.textContent.includes(title)) {
        // 親セクションを探す
        return findParentSection(heading);
      }
    }
    
    return null;
  }
  
  // 要素の親セクションを探す
  function findParentSection(element) {
    if (!element) return null;
    
    // 親セクション要素を探す
    const parent = element.closest('.mb-4') || 
                   element.closest('.form-group') || 
                   element.closest('.section') || 
                   element.closest('div[class*="section"]');
    
    if (parent) return parent;
    
    // 親要素がセクションっぽい要素か確認
    let currentEl = element.parentElement;
    let depth = 0;
    while (currentEl && depth < 3) {
      if (currentEl.tagName === 'DIV' && 
          (currentEl.className.includes('mb-') || 
           currentEl.children.length > 1)) {
        return currentEl;
      }
      currentEl = currentEl.parentElement;
      depth++;
    }
    
    return element.parentElement;
  }
  
  // ラベルから要素を探す
  function findElementByLabel(container, labelText) {
    const labels = container.querySelectorAll('label, .form-label');
    
    for (const label of labels) {
      if (label.textContent.trim() === labelText || label.textContent.includes(labelText)) {
        return label;
      }
    }
    
    return null;
  }
  
  // 電話番号認証機能をセットアップ
  function setupPhoneVerification(modal) {
    const phoneInput = modal.querySelector('#phone-number');
    const sendCodeBtn = modal.querySelector('#send-code-btn');
    const codeContainer = modal.querySelector('#verification-code-container');
    const codeInput = modal.querySelector('#verification-code');
    const verifyBtn = modal.querySelector('#verify-code-btn');
    const alertDiv = modal.querySelector('#verification-alert');
    
    if (!phoneInput || !sendCodeBtn || !codeContainer || !codeInput || !verifyBtn || !alertDiv) {
      console.error('電話認証に必要な要素が見つかりませんでした');
      return;
    }
    
    // 認証コード送信ボタンのイベントリスナー
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
      
      // 実際のシステムではここでAPIを呼び出してSMS送信するが
      // デモンストレーション用のダミーコード送信処理
      setTimeout(function() {
        codeContainer.classList.remove('d-none');
        showAlert('認証コードを送信しました。SMSをご確認ください。', 'success');
        
        // テスト環境では固定コードを使用
        if (location.hostname === 'localhost' || location.hostname.includes('replit')) {
          codeInput.value = '123456';
        }
      }, 1000);
    });
    
    // 認証ボタンのイベントリスナー
    verifyBtn.addEventListener('click', function() {
      const code = codeInput.value.trim();
      
      if (!code) {
        showAlert('認証コードを入力してください', 'danger');
        return;
      }
      
      showAlert('認証コードを確認しています...', 'info');
      
      // 実際のシステムではここでAPIを呼び出して認証コードを検証するが
      // デモンストレーション用のダミー認証処理
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
          
          // セッションストレージに認証状態を保存
          sessionStorage.setItem('phone-verified', 'true');
          
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