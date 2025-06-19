/**
 * ガイド登録フォームに電話認証を直接追加するスクリプト
 * モーダルが読み込まれた際に完全に置換する最終手段
 */
(function() {
  // テスト用認証コード
  const TEST_CODE = '123456';
  
  // ページロード時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    // 新規登録ボタンにイベントリスナーを追加
    const registerBtn = document.getElementById('show-user-type-modal');
    if (registerBtn) {
      registerBtn.addEventListener('click', function() {
        console.log('新規登録ボタンがクリックされました');
        
        // ユーザータイプモーダルが開いたら、ガイドボタンにイベントリスナーを追加
        setTimeout(function() {
          const guideTypeBtn = document.getElementById('guide-type-btn');
          if (guideTypeBtn) {
            guideTypeBtn.addEventListener('click', waitForGuideModal);
          }
        }, 500);
      });
    }
    
    // 直接ガイド登録ボタンがあれば、それにもイベントリスナーを追加
    const directGuideButtons = document.querySelectorAll('.guide-register-button, #guide-registration-btn');
    directGuideButtons.forEach(function(button) {
      button.addEventListener('click', waitForGuideModal);
    });
    
    // モーダル表示イベントをリッスン
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      if (modal.id === 'registerGuideModal' || modal.querySelector('.modal-title')?.textContent.includes('ガイド登録')) {
        console.log('ガイド登録モーダルが表示されました');
        setTimeout(injectPhoneVerification, 100);
      }
    });
    
    // 既に表示されているモーダルをチェック
    checkExistingModal();
  });
  
  // 既に表示されているモーダルをチェック
  function checkExistingModal() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      if (modal.id === 'registerGuideModal' || modal.querySelector('.modal-title')?.textContent.includes('ガイド登録')) {
        console.log('既に表示されているガイド登録モーダルを検出');
        setTimeout(injectPhoneVerification, 100);
      }
    });
  }
  
  // ガイド登録モーダルを待機
  function waitForGuideModal() {
    console.log('ガイド登録モーダルを待機中...');
    
    // モーダルが開くまで少し待つ
    setTimeout(function() {
      let guideModal = document.getElementById('registerGuideModal');
      
      // IDで見つからない場合、タイトルで検索
      if (!guideModal) {
        const modals = document.querySelectorAll('.modal.show');
        for (let modal of modals) {
          const title = modal.querySelector('.modal-title');
          if (title && title.textContent.includes('ガイド登録')) {
            guideModal = modal;
            break;
          }
        }
      }
      
      if (guideModal) {
        console.log('ガイド登録モーダルを検出');
        injectPhoneVerification();
      } else {
        console.log('ガイド登録モーダルが見つかりません');
      }
    }, 500);
  }
  
  // 電話認証UI部分を挿入する関数
  function injectPhoneVerification() {
    // ガイド登録モーダルを検索
    let guideModal = document.getElementById('registerGuideModal');
    
    // IDで見つからない場合、タイトルで検索
    if (!guideModal) {
      const modals = document.querySelectorAll('.modal.show');
      for (let modal of modals) {
        const title = modal.querySelector('.modal-title');
        if (title && title.textContent.includes('ガイド登録')) {
          guideModal = modal;
          break;
        }
      }
    }
    
    if (!guideModal) {
      console.log('ガイド登録モーダルが見つかりません');
      return;
    }
    
    // 既に電話認証セクションが存在するか確認
    if (guideModal.querySelector('#dgf-phone-section')) {
      console.log('電話認証セクションは既に存在します');
      return;
    }
    
    // フォーム内容を取得
    const modalBody = guideModal.querySelector('.modal-body');
    if (!modalBody) {
      console.log('モーダルボディが見つかりません');
      return;
    }
    
    console.log('電話認証セクションを挿入します');
    
    // 電話認証セクションを作成
    const phoneSection = document.createElement('div');
    phoneSection.id = 'dgf-phone-section';
    phoneSection.className = 'mb-3 p-3 bg-light border rounded';
    phoneSection.innerHTML = `
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
    `;
    
    // 電話認証セクションを挿入（自己紹介の前が理想的）
    const bioField = modalBody.querySelector('textarea');
    
    if (bioField) {
      // 自己紹介フィールドを持つ親要素を探す
      let bioContainer = bioField.closest('.form-group') || bioField.closest('.mb-3');
      if (bioContainer) {
        // 自己紹介の前に挿入
        bioContainer.parentNode.insertBefore(phoneSection, bioContainer);
        console.log('自己紹介フィールドの前に電話認証セクションを挿入しました');
      } else {
        // 親要素が見つからない場合は直接自己紹介の前に挿入
        bioField.parentNode.insertBefore(phoneSection, bioField);
        console.log('自己紹介フィールドの直前に電話認証セクションを挿入しました');
      }
    } else {
      // 自己紹介フィールドが見つからない場合は最後に追加
      modalBody.appendChild(phoneSection);
      console.log('モーダルの最後に電話認証セクションを挿入しました');
    }
    
    // イベントリスナーを設定
    setupVerificationListeners();
  }
  
  // 電話認証のイベントリスナー設定
  function setupVerificationListeners() {
    const phoneInput = document.getElementById('guide-phone-number');
    const sendCodeBtn = document.getElementById('guide-send-code-btn');
    const codeContainer = document.querySelector('.verification-code-container');
    const codeInput = document.getElementById('guide-verification-code');
    const verifyBtn = document.getElementById('guide-verify-code-btn');
    const alertDiv = document.getElementById('guide-verification-alert');
    const unverifiedText = document.querySelector('.unverified-text');
    
    if (!phoneInput || !sendCodeBtn || !codeContainer || !codeInput || !verifyBtn || !alertDiv) {
      console.log('電話認証に必要な要素が見つかりません');
      return;
    }
    
    // 認証状態を確認
    const isVerified = sessionStorage.getItem('phone-verified') === 'true';
    if (isVerified) {
      // 既に認証済みの場合はUIを更新
      updateToVerifiedUI();
      return;
    }
    
    // コード送信ボタンのクリックイベント
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
      
      // 送信シミュレーション
      setTimeout(function() {
        codeContainer.classList.remove('d-none');
        showAlert('認証コードを送信しました。SMSをご確認ください。', 'success');
        codeInput.focus();
        console.log('テスト用認証コード: ' + TEST_CODE);
      }, 1500);
    });
    
    // 認証ボタンのクリックイベント
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
    
    // Enterキーのイベント処理
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
    
    // 認証済みUIに更新する関数
    function updateToVerifiedUI() {
      // 未認証テキストを非表示
      if (unverifiedText) {
        unverifiedText.style.display = 'none';
        
        // 認証済みバッジを追加
        const verifiedBadge = document.createElement('span');
        verifiedBadge.className = 'badge bg-success verification-badge ms-2';
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
    
    // アラートを表示する関数
    function showAlert(message, type) {
      alertDiv.textContent = message;
      alertDiv.className = `alert alert-${type} mt-3`;
      alertDiv.classList.remove('d-none');
      
      // 成功メッセージは5秒後に消す
      if (type === 'success') {
        setTimeout(function() {
          alertDiv.classList.add('d-none');
        }, 5000);
      }
    }
  }
  
  // モーダル表示を定期的にチェック（フォールバックとして）
  setInterval(function() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      if ((modal.id === 'registerGuideModal' || 
          modal.querySelector('.modal-title')?.textContent.includes('ガイド登録')) && 
          !modal.querySelector('#dgf-phone-section')) {
        console.log('表示中ガイド登録モーダルを検出（定期チェック）');
        injectPhoneVerification();
      }
    });
  }, 1000);
})();