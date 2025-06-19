/**
 * 直接HTML挿入による電話認証機能
 * モーダルのHTMLを直接書き換えることでUIを強制的に表示
 */

(function() {
  // テスト用認証コード
  const TEST_VERIFICATION_CODE = '123456';
  
  // 電話認証セクションのHTML
  const phoneAuthHTML = `
    <div class="form-group mb-4" id="direct-phone-auth-section">
      <h5 class="fw-bold mb-3">電話番号認証</h5>
      <p class="text-muted mb-3">セキュリティのため、電話番号の認証を行ってください。</p>
      <label for="guide-phone-number" class="form-label">電話番号</label>
      <div class="input-group mb-2">
        <span class="input-group-text">+81</span>
        <input type="tel" class="form-control" id="guide-phone-number" placeholder="9012345678（先頭の0は除く）">
        <button class="btn btn-primary" type="button" id="guide-send-code-btn">認証コード送信</button>
      </div>
      <small class="form-text text-muted">ハイフンなしの電話番号を入力してください</small>
      <span class="unverified-text badge bg-light text-secondary mt-2 d-inline-block">未表示</span>
      
      <div class="verification-code-container mt-3 d-none">
        <div class="form-group mb-3 bg-light p-3 rounded">
          <label for="guide-verification-code" class="form-label">認証コード</label>
          <input type="text" class="form-control text-center fs-4 letter-spacing-2" id="guide-verification-code" placeholder="6桁のコード">
          <div class="verification-info text-center mt-2 text-muted">SMSで送信された6桁のコードを入力してください</div>
          <button type="button" class="btn btn-primary w-100 mt-3" id="guide-verify-code-btn">認証する</button>
        </div>
        <div id="guide-verification-alert" class="alert mt-3 d-none"></div>
      </div>
    </div>
  `;
  
  // DOM読み込み完了時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    // モーダル表示イベントをリッスン
    document.body.addEventListener('shown.bs.modal', function(e) {
      const modal = e.target;
      
      if (modal && modal.id === 'registerGuideModal') {
        console.log('ガイド登録モーダルが表示されました - 直接HTML挿入による認証UIを追加します');
        injectPhoneAuthHTML(modal);
      }
    });
    
    // ボタンクリックでモーダルを開く場合の対応
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
            injectPhoneAuthHTML(modal);
          }
        }, 300);
      }
    });
    
    // 既に表示されているモーダルをチェック
    const visibleModal = document.getElementById('registerGuideModal');
    if (visibleModal && visibleModal.classList.contains('show')) {
      injectPhoneAuthHTML(visibleModal);
    }
  });
  
  // 電話認証セクションを注入
  function injectPhoneAuthHTML(modal) {
    if (!modal) return;
    
    // モーダルボディを取得
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
      console.error('モーダルボディが見つかりません');
      return;
    }
    
    // 既に追加済みか確認
    if (modal.querySelector('#direct-phone-auth-section')) {
      console.log('電話認証セクションは既に存在しています');
      return;
    }
    
    // 電話番号入力欄がすでにあるかチェック
    const existingPhoneField = modalBody.querySelector('input[type="tel"]');
    const existingPhoneSection = existingPhoneField ? existingPhoneField.closest('.form-group') : null;
    
    // 既存の電話番号セクションがある場合は置換、なければ適切な位置に挿入
    if (existingPhoneSection) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = phoneAuthHTML;
      existingPhoneSection.replaceWith(tempDiv.firstElementChild);
    } else {
      // 自己紹介欄の前に挿入
      const bioField = modalBody.querySelector('textarea');
      if (bioField && bioField.closest('.form-group')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = phoneAuthHTML;
        modalBody.insertBefore(tempDiv.firstElementChild, bioField.closest('.form-group'));
      } else {
        // モーダルの内容を直接置換する強制的なアプローチ
        // 既存の電話番号入力欄を探す
        const existingPhoneInput = modalBody.querySelector('input[type="tel"]');
        if (existingPhoneInput) {
          // 既存の電話番号入力欄がある場合は置換
          console.log('電話番号入力欄を見つけたため置換します');
          const parentForm = existingPhoneInput.closest('.form-group') || existingPhoneInput.closest('.mb-3');
          if (parentForm) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = phoneAuthHTML;
            parentForm.replaceWith(tempDiv.firstElementChild);
          }
        } else {
          // 電話認証セクションを直接挿入（性別セレクトの後、自己紹介の前が理想的）
          const genderSelect = modalBody.querySelector('select');
          const bioTextarea = modalBody.querySelector('textarea');
          
          if (genderSelect && genderSelect.closest('.form-group')) {
            // 性別選択の後に挿入
            const genderGroup = genderSelect.closest('.form-group');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = phoneAuthHTML;
            
            if (genderGroup.nextElementSibling) {
              modalBody.insertBefore(tempDiv.firstElementChild, genderGroup.nextElementSibling);
            } else {
              modalBody.appendChild(tempDiv.firstElementChild);
            }
          } else if (bioTextarea && bioTextarea.closest('.form-group')) {
            // 自己紹介の前に挿入
            const bioGroup = bioTextarea.closest('.form-group');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = phoneAuthHTML;
            modalBody.insertBefore(tempDiv.firstElementChild, bioGroup);
          } else {
            // どちらも見つからない場合は最後に追加
            console.log('適切な挿入位置が見つからなかったため、モーダルの最後に追加します');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = phoneAuthHTML;
            modalBody.appendChild(tempDiv.firstElementChild);
          }
        }
      }
    }
    
    // イベントリスナーを設定
    setupPhoneAuthEvents(modal);
    console.log('電話認証セクションをモーダルに挿入しました');
  }
  
  // 電話認証のイベントリスナーをセットアップ
  function setupPhoneAuthEvents(modal) {
    // 各要素を取得
    const phoneInput = modal.querySelector('#guide-phone-number');
    const sendCodeBtn = modal.querySelector('#guide-send-code-btn');
    const codeContainer = modal.querySelector('.verification-code-container');
    const codeInput = modal.querySelector('#guide-verification-code');
    const verifyBtn = modal.querySelector('#guide-verify-code-btn');
    const alertDiv = modal.querySelector('#guide-verification-alert');
    const unverifiedText = modal.querySelector('.unverified-text');
    
    if (!phoneInput || !sendCodeBtn || !codeContainer || !codeInput || !verifyBtn || !alertDiv) {
      console.error('必要な要素が見つかりません');
      return;
    }
    
    // 認証状態をチェック
    const isVerified = sessionStorage.getItem('guide-phone-verified') === 'true';
    if (isVerified) {
      updateUIToVerified();
      return;
    }
    
    // コード送信ボタンのイベント
    sendCodeBtn.addEventListener('click', function() {
      handleSendCode();
    });
    
    // 認証ボタンのイベント
    verifyBtn.addEventListener('click', function() {
      handleVerifyCode();
    });
    
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
        console.log('テスト用認証コード: ' + TEST_VERIFICATION_CODE);
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
          
          // 認証成功イベントの発火
          document.dispatchEvent(new CustomEvent('phoneVerified', {
            detail: { userType: 'guide' }
          }));
        } else {
          // 失敗
          showAlert('認証コードが正しくありません。再度お試しください。', 'danger');
        }
      }, 1000);
    }
    
    // 認証済みのUIに更新
    function updateUIToVerified() {
      // 「未表示」テキストを消して「認証済み」バッジを表示
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
  
  // 定期的に電話認証セクションをチェックして必要なら追加
  setInterval(function() {
    const modal = document.getElementById('registerGuideModal');
    if (modal && modal.classList.contains('show') && !modal.querySelector('#direct-phone-auth-section')) {
      console.log('ガイド登録モーダルが表示中ですが電話認証セクションがありません - 追加します');
      injectPhoneAuthHTML(modal);
    }
  }, 1000);
})();