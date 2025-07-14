/**
 * 電話番号認証を強制的に追加するスクリプト
 * モーダルに直接アクセスする方法
 */

(function() {
  // モーダルを開く前に電話認証セクションを事前に準備
  document.addEventListener('DOMContentLoaded', function() {
    // 「ガイドになる」ボタンのクリックを監視
    setupGuideButtonListener();
    
    // モーダルの表示イベントを監視
    setupModalShowListener();
    
    // 既存のモーダルにも対応
    setTimeout(function() {
      forceAddPhoneVerification();
    }, 500);
  });
  
  // 「ガイドになる」ボタンのクリックを監視
  function setupGuideButtonListener() {
    document.body.addEventListener('click', function(e) {
      // ガイド登録関連ボタンの検出
      const isGuideButton = e.target.id === 'guide-type-btn' || 
                           e.target.classList.contains('guide-register-button') ||
                           (e.target.closest && (
                             e.target.closest('#guide-type-btn') || 
                             e.target.closest('.guide-register-button')
                           ));
      
      if (isGuideButton) {
        console.log('ガイド登録ボタンがクリックされました');
        // ボタンクリック後、モーダルが表示されるのを待ってから処理
        setTimeout(function() {
          forceAddPhoneVerification();
        }, 300);
      }
    });
  }
  
  // モーダル表示イベントを監視
  function setupModalShowListener() {
    document.addEventListener('shown.bs.modal', function(e) {
      const modal = e.target;
      if (modal && modal.id === 'registerGuideModal') {
        console.log('ガイド登録モーダルが表示されました');
        setTimeout(function() {
          insertPhoneVerification(modal);
        }, 100);
      }
    });
  }
  
  // 強制的に電話認証セクションを追加
  function forceAddPhoneVerification() {
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal) {
      console.log('ガイド登録モーダルを検出しました');
      insertPhoneVerification(guideModal);
    } else {
      console.log('ガイド登録モーダルが見つかりません');
    }
  }
  
  // 電話認証セクションを挿入
  function insertPhoneVerification(modal) {
    if (!modal) return;
    
    // 既に追加済みか確認
    const existingSection = modal.querySelector('#guide-phone-verification-section');
    if (existingSection) {
      console.log('電話認証セクションは既に存在します');
      return;
    }
    
    // モーダルボディを取得
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
      console.error('モーダルボディが見つかりません');
      return;
    }
    
    // 電話番号フィールドが既に存在するか確認
    const existingPhoneField = modalBody.querySelector('input[type="tel"]');
    
    // 電話認証セクションを作成
    const phoneSection = document.createElement('div');
    phoneSection.id = 'guide-phone-verification-section';
    phoneSection.className = 'phone-verification-section mb-4 p-3 bg-light rounded border';
    
    phoneSection.innerHTML = `
      <h5 class="section-title mb-3">電話番号認証</h5>
      <p class="text-muted mb-3">セキュリティのため、電話番号の認証を行ってください。</p>
      <div class="form-group mb-3">
        <label for="guide-phone-number">電話番号</label>
        <div class="input-group">
          <span class="input-group-text">+81</span>
          <input type="tel" class="form-control" id="guide-phone-number" placeholder="9012345678（先頭の0は除く）">
          <button class="btn btn-primary" type="button" id="guide-send-code-btn">認証コード送信</button>
        </div>
        <small class="form-text text-muted">ハイフンなしの電話番号を入力してください</small>
        <span class="unverified-text d-inline-block mt-2">未表示</span>
      </div>
      <div class="verification-code-container mt-3 d-none">
        <div class="form-group mb-3">
          <label for="guide-verification-code">認証コード</label>
          <input type="text" class="form-control" id="guide-verification-code" placeholder="SMSで送信された6桁のコードを入力してください">
          <div class="verification-info mt-2">SMSで送信された6桁のコードを入力してください</div>
        </div>
        <button type="button" class="btn btn-primary w-100" id="guide-verify-code-btn">認証する</button>
        <div id="guide-verification-alert" class="alert mt-3 d-none"></div>
      </div>
    `;
    
    // 適切な位置に挿入
    if (existingPhoneField && existingPhoneField.closest('.form-group')) {
      // 既存の電話フィールドがあれば置換
      const phoneGroup = existingPhoneField.closest('.form-group');
      phoneGroup.parentNode.replaceChild(phoneSection, phoneGroup);
    } else {
      // 適切な位置を探す
      const emailField = modalBody.querySelector('input[type="email"]');
      const genderSelect = modalBody.querySelector('select');
      const bioTextarea = modalBody.querySelector('textarea');
      
      if (genderSelect && genderSelect.closest('.form-group')) {
        // 性別選択の後に挿入
        const genderGroup = genderSelect.closest('.form-group');
        if (genderGroup.nextSibling) {
          modalBody.insertBefore(phoneSection, genderGroup.nextSibling);
        } else {
          modalBody.appendChild(phoneSection);
        }
      } else if (emailField && emailField.closest('.form-group')) {
        // メールフィールドの後に挿入
        const emailGroup = emailField.closest('.form-group');
        if (emailGroup.nextSibling) {
          modalBody.insertBefore(phoneSection, emailGroup.nextSibling);
        } else {
          modalBody.appendChild(phoneSection);
        }
      } else if (bioTextarea && bioTextarea.closest('.form-group')) {
        // 自己紹介の前に挿入
        const bioGroup = bioTextarea.closest('.form-group');
        modalBody.insertBefore(phoneSection, bioGroup);
      } else {
        // どれも見つからなければ最後に追加
        modalBody.appendChild(phoneSection);
      }
    }
    
    console.log('電話認証セクションを追加しました');
    
    // イベントリスナーをセットアップ
    setupVerificationEvents(modal);
  }
  
  // 認証機能のイベントリスナーをセットアップ
  function setupVerificationEvents(modal) {
    // テスト用認証コード
    const TEST_CODE = '123456';
    
    // 要素取得
    const phoneInput = modal.querySelector('#guide-phone-number');
    const sendCodeBtn = modal.querySelector('#guide-send-code-btn');
    const codeContainer = modal.querySelector('.verification-code-container');
    const codeInput = modal.querySelector('#guide-verification-code');
    const verifyBtn = modal.querySelector('#guide-verify-code-btn');
    const alertDiv = modal.querySelector('#guide-verification-alert');
    const unverifiedText = modal.querySelector('.unverified-text');
    
    if (!phoneInput || !sendCodeBtn || !codeContainer || !codeInput || !verifyBtn) {
      console.error('電話認証に必要な要素が見つかりません');
      return;
    }
    
    // コード送信ボタンのイベント
    sendCodeBtn.addEventListener('click', function() {
      const phoneNumber = phoneInput.value.trim();
      if (!phoneNumber) {
        showAlert(alertDiv, '電話番号を入力してください', 'danger');
        return;
      }
      
      // 電話番号の簡易バリデーション
      const phonePattern = /^\+?[0-9\s\-()]{6,20}$/;
      if (!phonePattern.test(phoneNumber)) {
        showAlert(alertDiv, '有効な電話番号を入力してください', 'danger');
        return;
      }
      
      // コード送信中表示
      showAlert(alertDiv, '認証コードを送信しています...', 'info');
      
      // 送信シミュレーション
      setTimeout(function() {
        codeContainer.classList.remove('d-none');
        showAlert(alertDiv, '認証コードを送信しました。SMSをご確認ください。', 'success');
        codeInput.focus();
        console.log('テスト用認証コード: ' + TEST_CODE);
      }, 1500);
    });
    
    // 認証ボタンのイベント
    verifyBtn.addEventListener('click', function() {
      const code = codeInput.value.trim();
      if (!code) {
        showAlert(alertDiv, '認証コードを入力してください', 'danger');
        return;
      }
      
      // 認証中表示
      showAlert(alertDiv, '認証コードを確認しています...', 'info');
      
      // 認証シミュレーション
      setTimeout(function() {
        if (code === TEST_CODE) {
          // 成功
          const verifiedBadge = document.createElement('span');
          verifiedBadge.className = 'badge bg-success verification-badge verified';
          verifiedBadge.textContent = '認証済み';
          
          unverifiedText.style.display = 'none';
          unverifiedText.parentNode.insertBefore(verifiedBadge, unverifiedText.nextSibling);
          
          showAlert(alertDiv, '電話番号認証が完了しました！', 'success');
          codeContainer.classList.add('d-none');
          
          // 認証状態を保存
          sessionStorage.setItem('guide-phone-verified', 'true');
          
          // コード入力欄を無効化
          phoneInput.readOnly = true;
          sendCodeBtn.disabled = true;
          sendCodeBtn.textContent = '認証済み';
        } else {
          // 失敗
          showAlert(alertDiv, '認証コードが正しくありません。再度お試しください。', 'danger');
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
  }
  
  // アラートメッセージを表示
  function showAlert(alertDiv, message, type) {
    if (!alertDiv) return;
    
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.classList.remove('d-none');
    
    // 成功メッセージは5秒後に非表示
    if (type === 'success') {
      setTimeout(function() {
        alertDiv.classList.add('d-none');
      }, 5000);
    }
  }
  
  // 定期的に確認と修正を行う
  setInterval(function() {
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal && guideModal.classList.contains('show')) {
      const existingSection = guideModal.querySelector('#guide-phone-verification-section');
      if (!existingSection) {
        console.log('モーダルが表示されていますが電話認証セクションがありません');
        insertPhoneVerification(guideModal);
      }
    }
  }, 2000);
})();