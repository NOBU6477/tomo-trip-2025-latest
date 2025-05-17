/**
 * ガイド登録モーダルを強制的に上書きするスクリプト
 */
(function() {
  // テスト用認証コード
  const TEST_VERIFICATION_CODE = '123456';
  
  // モーダル内に挿入する電話認証コンテンツ
  const phoneAuthContent = `
    <div class="mb-3 phone-verification-section bg-light p-3 border rounded">
      <h5 class="fw-bold mb-3">電話番号認証</h5>
      <p class="text-muted mb-3">セキュリティのため、電話番号の認証を行ってください。</p>
      <div class="mb-3">
        <label for="guide-phone-number" class="form-label">電話番号</label>
        <div class="input-group">
          <span class="input-group-text">+81</span>
          <input type="tel" class="form-control" id="guide-phone-number" placeholder="9012345678（先頭の0は除く）" required>
          <button class="btn btn-primary" type="button" id="guide-send-code-btn">認証コード送信</button>
        </div>
        <small class="form-text text-muted">ハイフンなしの電話番号を入力してください</small>
        <span class="unverified-text badge bg-secondary mt-2">未認証</span>
      </div>
      <div class="verification-code-container d-none">
        <div class="mb-3 bg-white p-3 border rounded">
          <label for="guide-verification-code" class="form-label">認証コード</label>
          <input type="text" class="form-control text-center fs-5" id="guide-verification-code" placeholder="6桁のコード">
          <div class="text-center text-muted mt-2">SMSで送信された6桁のコードを入力してください</div>
          <button type="button" class="btn btn-primary w-100 mt-3" id="guide-verify-code-btn">認証する</button>
        </div>
        <div id="guide-verification-alert" class="alert mt-3 d-none"></div>
      </div>
    </div>
  `;

  // ウィンドウロード時にイベントリスナーをセットアップ
  window.addEventListener('load', function() {
    // モーダル開閉イベントをリッスン
    listenForModals();
    
    // 既存のモーダルをチェック
    setTimeout(checkExistingModals, 500);
    
    // 定期的にモーダルをチェック
    setInterval(checkExistingModals, 1000);
  });
  
  // モーダル開閉イベントをリッスン
  function listenForModals() {
    document.addEventListener('click', function(e) {
      // ガイド登録関連のボタンクリック
      const isGuideButton = 
        (e.target.id === 'guide-registration-btn' || 
         e.target.classList.contains('guide-register-button') ||
         (e.target.closest && (
           e.target.closest('#guide-registration-btn') || 
           e.target.closest('.guide-register-button')
         )));
      
      if (isGuideButton) {
        console.log('[GRO] ガイド登録ボタンがクリックされました');
        setTimeout(function() {
          const modal = findGuideModal();
          if (modal) {
            overrideGuideModal(modal);
          }
        }, 300);
      }
      
      // ユーザータイプ選択モーダルの「ガイドになる」ボタン
      const isUserTypeGuideButton = 
        (e.target.id === 'guide-type-btn' || 
         (e.target.closest && e.target.closest('#guide-type-btn')));
      
      if (isUserTypeGuideButton) {
        console.log('[GRO] ユーザータイプ「ガイド」が選択されました');
        setTimeout(function() {
          const modal = findGuideModal();
          if (modal) {
            overrideGuideModal(modal);
          }
        }, 300);
      }
    });
    
    // Bootstrap モーダル表示イベント
    document.addEventListener('shown.bs.modal', function(e) {
      const modal = e.target;
      if (isGuideModal(modal)) {
        console.log('[GRO] ガイド登録モーダルが表示されました');
        overrideGuideModal(modal);
      }
    });
  }
  
  // 既存のモーダルを確認
  function checkExistingModals() {
    const modal = findGuideModal();
    if (modal && isModalVisible(modal) && !modal.querySelector('.phone-verification-section')) {
      console.log('[GRO] 表示中のガイド登録モーダルを検出しました');
      overrideGuideModal(modal);
    }
  }
  
  // ガイド登録モーダルを検索
  function findGuideModal() {
    // ID、クラス、内容から特定する方法を複数試す
    const modalById = document.getElementById('registerGuideModal');
    if (modalById) return modalById;
    
    // タイトルでモーダルを検索
    const modals = document.querySelectorAll('.modal');
    for (const modal of modals) {
      if (isGuideModal(modal)) {
        return modal;
      }
    }
    
    return null;
  }
  
  // モーダルがガイド登録モーダルかどうか判定
  function isGuideModal(modal) {
    if (!modal) return false;
    
    // ID で判定
    if (modal.id === 'registerGuideModal') return true;
    
    // タイトルで判定
    const title = modal.querySelector('.modal-title');
    if (title && (
        title.textContent.includes('ガイド登録') || 
        title.textContent.includes('Guide Registration')
    )) {
      return true;
    }
    
    // 内容で判定
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      // ガイド固有のフォームフィールドがあるか確認
      const hasBioField = modalBody.querySelector('textarea') !== null;
      const hasGenderField = modalBody.querySelector('select') !== null;
      const hasEmailField = modalBody.querySelector('input[type="email"]') !== null;
      
      if (hasBioField && hasGenderField && hasEmailField) {
        return true;
      }
    }
    
    return false;
  }
  
  // モーダルが表示されているかどうか判定
  function isModalVisible(modal) {
    return modal && (
      modal.classList.contains('show') || 
      modal.style.display === 'block' || 
      getComputedStyle(modal).display === 'block'
    );
  }
  
  // ガイド登録モーダルを強制的に上書き
  function overrideGuideModal(modal) {
    if (!modal) return;
    
    // すでに電話認証セクションが存在するか確認
    if (modal.querySelector('.phone-verification-section')) {
      console.log('[GRO] 電話認証セクションは既に存在します');
      return;
    }
    
    console.log('[GRO] ガイド登録モーダルを上書きします');
    
    // モーダルボディを取得
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
      console.error('[GRO] モーダルボディが見つかりません');
      return;
    }
    
    // 電話番号入力欄をモーダルに追加（既存の電話番号入力欄があれば置換）
    const existingPhoneInput = modalBody.querySelector('input[type="tel"]');
    const existingPhoneGroup = existingPhoneInput ? 
      existingPhoneInput.closest('.form-group') || 
      existingPhoneInput.closest('.mb-3') : null;
    
    if (existingPhoneGroup) {
      console.log('[GRO] 既存の電話番号入力欄を置換します');
      // DOM要素として直接置換
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = phoneAuthContent;
      existingPhoneGroup.replaceWith(tempDiv.firstElementChild);
    } else {
      console.log('[GRO] 電話認証セクションを新規追加します');
      
      // 自己紹介の直前に挿入するのが理想的
      const bioField = modalBody.querySelector('textarea');
      const bioGroup = bioField ? 
        bioField.closest('.form-group') || 
        bioField.closest('.mb-3') : null;
      
      if (bioGroup) {
        console.log('[GRO] 自己紹介フィールドの前に挿入します');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = phoneAuthContent;
        modalBody.insertBefore(tempDiv.firstElementChild, bioGroup);
      } else {
        // 性別フィールドの後に挿入
        const genderField = modalBody.querySelector('select');
        const genderGroup = genderField ? 
          genderField.closest('.form-group') || 
          genderField.closest('.mb-3') : null;
        
        if (genderGroup) {
          console.log('[GRO] 性別フィールドの後に挿入します');
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = phoneAuthContent;
          
          if (genderGroup.nextElementSibling) {
            modalBody.insertBefore(tempDiv.firstElementChild, genderGroup.nextElementSibling);
          } else {
            modalBody.appendChild(tempDiv.firstElementChild);
          }
        } else {
          // どの特定フィールドも見つからない場合はモーダルの最後に追加
          console.log('[GRO] フォームの最後に挿入します');
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = phoneAuthContent;
          modalBody.appendChild(tempDiv.firstElementChild);
        }
      }
    }
    
    // イベントリスナーをセットアップ
    setupVerificationEvents(modal);
  }
  
  // 電話認証のイベントリスナーをセットアップ
  function setupVerificationEvents(modal) {
    // 要素を取得
    const phoneInput = modal.querySelector('#guide-phone-number');
    const sendCodeBtn = modal.querySelector('#guide-send-code-btn');
    const codeContainer = modal.querySelector('.verification-code-container');
    const codeInput = modal.querySelector('#guide-verification-code');
    const verifyBtn = modal.querySelector('#guide-verify-code-btn');
    const alertDiv = modal.querySelector('#guide-verification-alert');
    const unverifiedText = modal.querySelector('.unverified-text');
    
    if (!phoneInput || !sendCodeBtn || !codeContainer || !codeInput || !verifyBtn) {
      console.error('[GRO] 必要な要素が見つかりません');
      return;
    }
    
    // 認証状態をチェック
    const isVerified = sessionStorage.getItem('guide-phone-verified') === 'true';
    if (isVerified) {
      updateUIToVerified();
      return;
    }
    
    // 既存のイベントリスナーを削除（重複を防ぐため）
    sendCodeBtn.removeEventListener('click', handleSendCode);
    verifyBtn.removeEventListener('click', handleVerifyCode);
    
    // コード送信ボタンのイベント
    sendCodeBtn.addEventListener('click', handleSendCode);
    
    // 認証ボタンのイベント
    verifyBtn.addEventListener('click', handleVerifyCode);
    
    // Enterキーのイベント
    phoneInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSendCode();
      }
    });
    
    codeInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleVerifyCode();
      }
    });
    
    // コード送信処理
    function handleSendCode() {
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
      
      // コード送信中表示
      showAlert('認証コードを送信しています...', 'info');
      
      // 送信シミュレーション
      setTimeout(function() {
        codeContainer.classList.remove('d-none');
        showAlert('認証コードを送信しました。SMSをご確認ください。', 'success');
        codeInput.focus();
        console.log('[GRO] テスト用認証コード: ' + TEST_VERIFICATION_CODE);
      }, 1500);
    }
    
    // 認証コード確認処理
    function handleVerifyCode() {
      const code = codeInput.value.trim();
      if (!code) {
        showAlert('認証コードを入力してください', 'danger');
        return;
      }
      
      // 認証中表示
      showAlert('認証コードを確認しています...', 'info');
      
      // 認証シミュレーション
      setTimeout(function() {
        if (code === TEST_VERIFICATION_CODE) {
          // 成功
          updateUIToVerified();
          showAlert('電話番号認証が完了しました！', 'success');
          
          // 認証状態を保存
          sessionStorage.setItem('guide-phone-verified', 'true');
        } else {
          // 失敗
          showAlert('認証コードが正しくありません。再度お試しください。', 'danger');
        }
      }, 1000);
    }
    
    // 認証済みのUIに更新
    function updateUIToVerified() {
      // 「未認証」テキストを消して「認証済み」バッジを表示
      if (unverifiedText) {
        unverifiedText.style.display = 'none';
        
        // 既に「認証済み」バッジがあるか確認
        if (!modal.querySelector('.verification-badge.verified')) {
          const verifiedBadge = document.createElement('span');
          verifiedBadge.className = 'badge bg-success verification-badge verified';
          verifiedBadge.textContent = '認証済み';
          unverifiedText.parentNode.insertBefore(verifiedBadge, unverifiedText.nextSibling);
        }
      }
      
      // 入力フィールドを無効化
      if (phoneInput) {
        phoneInput.readOnly = true;
      }
      
      // 送信ボタンを無効化
      if (sendCodeBtn) {
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = '認証済み';
      }
      
      // 認証コード入力欄を非表示
      if (codeContainer) {
        codeContainer.classList.add('d-none');
      }
    }
    
    // アラートメッセージを表示
    function showAlert(message, type) {
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
  }
})();