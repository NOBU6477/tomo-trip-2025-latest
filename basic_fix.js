/**
 * 基本的なWebページの機能を復元するための最小限のスクリプト
 */
(function() {
  // DOMの読み込みが完了したら初期化
  document.addEventListener('DOMContentLoaded', initialize);
  
  // すでに読み込み済みの場合も初期化
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initialize();
  }
  
  // 初期化関数
  function initialize() {
    console.log('基本機能の初期化を実行中...');
    
    // 新規登録ボタンのイベント設定
    const registerBtn = document.getElementById('show-user-type-modal');
    if (registerBtn) {
      registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // ユーザータイプ選択モーダルを表示
        const userTypeModal = new bootstrap.Modal(document.getElementById('userTypeModal'));
        userTypeModal.show();
      });
    }
    
    // ユーザータイプ選択ボタンの設定
    setupUserTypeButtons();
    
    console.log('初期化完了');
  }
  
  // ユーザータイプ選択ボタンのイベント設定
  function setupUserTypeButtons() {
    const touristBtn = document.getElementById('tourist-type-btn');
    const guideBtn = document.getElementById('guide-type-btn');
    
    if (touristBtn) {
      touristBtn.addEventListener('click', function() {
        // 観光客登録モーダルを表示
        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        // 既存のモーダルを閉じる
        const userTypeModal = bootstrap.Modal.getInstance(document.getElementById('userTypeModal'));
        if (userTypeModal) {
          userTypeModal.hide();
        }
        registerModal.show();
      });
    }
    
    if (guideBtn) {
      guideBtn.addEventListener('click', function() {
        // ガイド登録モーダルを表示
        const guideRegisterModal = new bootstrap.Modal(document.getElementById('guideRegisterModal'));
        // 既存のモーダルを閉じる
        const userTypeModal = bootstrap.Modal.getInstance(document.getElementById('userTypeModal'));
        if (userTypeModal) {
          userTypeModal.hide();
        }
        guideRegisterModal.show();
        
        // ガイド登録モーダル表示後、電話認証を追加
        setTimeout(addPhoneVerification, 300);
      });
    }
  }
  
  // 電話番号認証セクションを追加
  function addPhoneVerification() {
    console.log('電話番号認証セクションを追加します...');
    
    // ガイド登録モーダルを取得
    const modal = document.getElementById('guideRegisterModal');
    if (!modal) {
      console.log('ガイド登録モーダルが見つかりません');
      return;
    }
    
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
      console.log('モーダルボディが見つかりません');
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
    
    // 電話番号認証セクションの挿入位置を決定
    let insertPosition = null;
    
    if (basicInfoSection && idVerificationSection) {
      // 基本情報と身分証明書の間に挿入
      insertPosition = {
        element: idVerificationSection,
        position: 'beforebegin'
      };
    } else if (basicInfoSection) {
      // 基本情報の後に挿入
      insertPosition = {
        element: basicInfoSection,
        position: 'afterend'
      };
    } else if (idVerificationSection) {
      // 身分証明書の前に挿入
      insertPosition = {
        element: idVerificationSection,
        position: 'beforebegin'
      };
    } else {
      // いずれも見つからない場合はモーダルの先頭に挿入
      insertPosition = {
        element: modalBody.firstChild,
        position: 'beforebegin'
      };
    }
    
    // 電話番号認証セクションを挿入
    if (insertPosition) {
      insertPosition.element.insertAdjacentHTML(insertPosition.position, phoneVerificationHTML);
      console.log('電話番号認証セクションを挿入しました');
      
      // 認証機能のセットアップ
      setupVerificationListeners(modal);
    }
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
      console.log('電話認証に必要な要素が見つかりません');
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