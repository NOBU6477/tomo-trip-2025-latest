/**
 * 強制的に電話認証のユーザーインターフェースを追加する
 * どのような状況でも確実にUIを挿入する最終手段
 */

(function() {
  // モーダルのDOMの変更を監視する設定
  const config = { 
    attributes: true, 
    childList: true, 
    subtree: true,
    characterData: true
  };
  
  // 監視を開始
  document.addEventListener('DOMContentLoaded', function() {
    // 既に監視を設定済みか確認するフラグ
    window.authObserverInstalled = window.authObserverInstalled || false;
    
    if (!window.authObserverInstalled) {
      // ボディを監視
      const observer = new MutationObserver(handleMutations);
      observer.observe(document.body, config);
      
      // 即時実行
      checkAndAttachVerification();
      
      // 監視設定済みフラグを立てる
      window.authObserverInstalled = true;
      console.log('電話認証UI監視を開始しました');
    }
  });
  
  // DOM変更の処理
  function handleMutations(mutations) {
    for (const mutation of mutations) {
      // 要素追加の場合
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // モーダル関連の変更を検出
            if (node.classList && (
                node.id === 'registerGuideModal' || 
                node.classList.contains('modal') ||
                node.classList.contains('modal-dialog') ||
                node.classList.contains('modal-content')
            )) {
              setTimeout(checkAndAttachVerification, 100);
            }
            
            // モーダル内部の変更を検出
            if (node.querySelector && (
                node.querySelector('.modal-body') ||
                node.querySelector('form')
            )) {
              setTimeout(checkAndAttachVerification, 100);
            }
          }
        }
      }
      
      // 属性変更の場合（モーダル表示/非表示など）
      if (mutation.type === 'attributes') {
        const target = mutation.target;
        if (target.classList && target.classList.contains('modal') && 
            target.classList.contains('show')) {
          setTimeout(checkAndAttachVerification, 100);
        }
      }
    }
  }
  
  // 電話認証UIを確認して必要なら追加
  function checkAndAttachVerification() {
    const guideModal = document.getElementById('registerGuideModal');
    
    if (guideModal && guideModal.classList.contains('show')) {
      // モーダルが表示されていることを確認
      console.log('ガイド登録モーダルが表示中です');
      
      // 電話認証セクションの有無をチェック
      const existingSection = guideModal.querySelector('#guide-phone-verification-section');
      
      if (!existingSection) {
        console.log('電話認証セクションが見つからないため追加します');
        insertPhoneVerificationUI(guideModal);
      } else {
        console.log('電話認証セクションは既に存在します');
      }
    }
  }
  
  // 電話認証UIを挿入する
  function insertPhoneVerificationUI(modal) {
    // モーダルボディを取得
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
      console.error('モーダルボディが見つかりません');
      return;
    }
    
    // 電話認証セクションを作成
    const phoneSection = document.createElement('div');
    phoneSection.id = 'guide-phone-verification-section';
    phoneSection.className = 'phone-verification-section mb-4 p-3 bg-light rounded border';
    
    // HTMLコンテンツ
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
    
    // 既存の電話番号フィールドを探す
    const existingPhoneField = modalBody.querySelector('input[type="tel"]');
    
    if (existingPhoneField && existingPhoneField.closest('.form-group')) {
      // 既存の電話フィールドがあれば置換
      const phoneGroup = existingPhoneField.closest('.form-group');
      phoneGroup.parentNode.replaceChild(phoneSection, phoneGroup);
    } else {
      // 適切な位置を探す
      const elements = modalBody.children;
      let inserted = false;
      
      // 性別選択フィールドを探す（その後に挿入）
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.querySelector && 
            (element.querySelector('select') || 
             element.querySelector('input[type="radio"]'))) {
          // 性別選択フィールドの後に挿入
          if (elements[i + 1]) {
            modalBody.insertBefore(phoneSection, elements[i + 1]);
          } else {
            modalBody.appendChild(phoneSection);
          }
          inserted = true;
          break;
        }
      }
      
      // 挿入できなかった場合は単純に追加
      if (!inserted) {
        modalBody.appendChild(phoneSection);
      }
    }
    
    // イベントリスナーを設定
    setupVerificationEvents(modal);
    
    console.log('電話認証UIを挿入しました');
  }
  
  // 認証機能のイベントリスナーを設定
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
    
    // 認証状態の確認
    const isVerified = sessionStorage.getItem('guide-phone-verified') === 'true';
    if (isVerified) {
      // 認証済み状態の表示
      updateUIToVerified();
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
          updateUIToVerified();
          
          showAlert(alertDiv, '電話番号認証が完了しました！', 'success');
          codeContainer.classList.add('d-none');
          
          // 認証状態を保存
          sessionStorage.setItem('guide-phone-verified', 'true');
          
          // 認証成功イベントの発火
          document.dispatchEvent(new CustomEvent('phoneVerified', {
            detail: { userType: 'guide' }
          }));
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
  
  // 定期的にチェック（フォールバックとして）
  setInterval(checkAndAttachVerification, 1000);
})();