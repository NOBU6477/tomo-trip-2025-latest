/**
 * 電話番号認証機能 - 完全単独版
 * 他のスクリプトに依存せず単独で機能する
 */
(function() {
  // ページの読み込みが完了したら実行
  window.addEventListener('load', function() {
    console.log('電話番号認証機能をロードしました');
    setupVerificationSystem();
  });

  // 認証システムのセットアップ
  function setupVerificationSystem() {
    // ガイド登録モーダルが表示されたときに実行
    document.addEventListener('click', function(event) {
      // 新規登録またはガイド登録ボタンがクリックされた場合
      if (isRegisterButton(event.target)) {
        setTimeout(checkForGuideModal, 500);
      }
    });
    
    // 定期的にモーダルをチェック
    setInterval(checkForGuideModal, 1000);
  }
  
  // 登録関連のボタンかどうかを判定
  function isRegisterButton(element) {
    if (!element) return false;
    
    // IDで判定
    if (element.id === 'show-user-type-modal' || 
        element.id === 'register-as-guide-btn') {
      return true;
    }
    
    // テキスト内容で判定
    if (element.textContent && 
        (element.textContent.includes('新規登録') || 
         element.textContent.includes('ガイドとして登録'))) {
      return true;
    }
    
    // 親要素で判定
    if (element.parentElement && 
        (element.parentElement.id === 'show-user-type-modal' || 
         element.parentElement.id === 'register-as-guide-btn')) {
      return true;
    }
    
    return false;
  }
  
  // ガイド登録モーダルを探して処理
  function checkForGuideModal() {
    const modal = document.getElementById('registerGuideModal');
    if (modal && isVisible(modal)) {
      setupPhoneVerification(modal);
    }
  }
  
  // 要素が表示状態かどうかを確認
  function isVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           element.offsetParent !== null &&
           element.classList.contains('show');
  }
  
  // 電話番号認証を設定
  function setupPhoneVerification(modal) {
    // 電話番号認証セクションを探す
    const phoneSection = findPhoneSection(modal);
    if (!phoneSection) return;
    
    // 既に置き換え済みかどうかチェック
    if (phoneSection.querySelector('#standalone-phone-verification')) {
      return;
    }
    
    // 古い内容を退避
    const oldContent = phoneSection.innerHTML;
    
    // セクションのラベルを取得
    const label = phoneSection.querySelector('label')?.textContent || '電話番号認証';
    
    // 新しい内容に置き換え
    phoneSection.innerHTML = `
      <label class="form-label">${label}</label>
      <div id="standalone-phone-verification">
        <div class="input-group mb-2">
          <span class="input-group-text">+81</span>
          <input type="tel" class="form-control" id="standalone-phone-input" placeholder="電話番号（例：09012345678）">
          <button class="btn btn-primary" type="button" id="standalone-send-code">認証コード送信</button>
        </div>
        
        <div id="standalone-code-section" class="mt-3 d-none">
          <div class="mb-2">
            <label for="standalone-code-input" class="form-label">認証コード</label>
            <input type="text" class="form-control" id="standalone-code-input" placeholder="6桁のコード">
          </div>
          <div class="form-text mb-2">SMSで送信された6桁のコードを入力してください</div>
          <button class="btn btn-primary btn-sm" type="button" id="standalone-verify-code">認証</button>
        </div>
        
        <div id="standalone-verified" class="alert alert-success mt-3 d-none">
          <i class="fas fa-check-circle me-2"></i>電話番号認証が完了しました
        </div>
        
        <div class="small text-muted mt-2">
          テスト用コード: 123456
        </div>
      </div>
    `;
    
    // 「未表示」テキストノードを削除
    removeUnverifiedTexts(modal);
    
    // イベントハンドラを設定
    setupEventHandlers();
  }
  
  // 電話番号セクションを探す
  function findPhoneSection(modal) {
    // ラベルから探す
    const labels = modal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号')) {
        return label.closest('.row')?.querySelector('.col-md-6') || 
               label.closest('.col-md-6') || 
               label.parentElement;
      }
    }
    
    // クラスから探す
    const formGroups = modal.querySelectorAll('.form-group, .mb-3');
    for (const group of formGroups) {
      if (group.textContent && group.textContent.includes('電話番号')) {
        return group;
      }
    }
    
    return null;
  }
  
  // 「未表示」テキストを削除
  function removeUnverifiedTexts(container) {
    // すべてのテキストノードを走査
    const textNodes = [];
    const walker = document.createTreeWalker(
      container, 
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.trim() === '未表示') {
        textNodes.push(node);
      }
    }
    
    // 該当するテキストノードを処理
    textNodes.forEach(node => {
      if (node.parentNode) {
        if (node.parentNode.childNodes.length === 1) {
          // 親要素に他の子要素がなければ親要素ごと非表示
          node.parentNode.style.display = 'none';
        } else {
          // そうでなければテキストだけを消去
          node.textContent = '';
        }
      }
    });
  }
  
  // イベントハンドラを設定
  function setupEventHandlers() {
    // 認証コード送信ボタン
    const sendButton = document.getElementById('standalone-send-code');
    if (sendButton) {
      sendButton.addEventListener('click', handleSendCode);
    }
    
    // 認証ボタン
    const verifyButton = document.getElementById('standalone-verify-code');
    if (verifyButton) {
      verifyButton.addEventListener('click', function() {
        const codeInput = document.getElementById('standalone-code-input');
        if (codeInput) {
          handleVerifyCode(codeInput.value);
        }
      });
    }
    
    // コード入力欄（6桁入力で自動認証）
    const codeInput = document.getElementById('standalone-code-input');
    if (codeInput) {
      codeInput.addEventListener('input', function() {
        if (this.value.length === 6) {
          handleVerifyCode(this.value);
        }
      });
    }
  }
  
  // 認証コード送信処理
  function handleSendCode() {
    const phoneInput = document.getElementById('standalone-phone-input');
    if (!phoneInput || !phoneInput.value.trim()) {
      showMessage('電話番号を入力してください', 'warning');
      return;
    }
    
    // 送信ボタンのローディング表示
    const sendButton = document.getElementById('standalone-send-code');
    if (sendButton) {
      sendButton.disabled = true;
      const originalText = sendButton.textContent;
      sendButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> 送信中...';
      
      // 処理をシミュレート（実際はここでAPIを呼ぶ）
      setTimeout(() => {
        sendButton.disabled = false;
        sendButton.textContent = originalText;
        
        // コード入力欄を表示
        const codeSection = document.getElementById('standalone-code-section');
        if (codeSection) {
          codeSection.classList.remove('d-none');
        }
        
        // コード入力欄にフォーカス
        const codeInput = document.getElementById('standalone-code-input');
        if (codeInput) {
          codeInput.focus();
        }
        
        showMessage('認証コードを送信しました', 'success');
      }, 1000);
    }
  }
  
  // 認証コード検証処理
  function handleVerifyCode(code) {
    if (!code || code.trim().length !== 6) {
      showMessage('6桁の認証コードを入力してください', 'warning');
      return;
    }
    
    // テスト用コードの検証
    if (code === '123456') {
      // 認証完了表示
      const verifiedElement = document.getElementById('standalone-verified');
      if (verifiedElement) {
        verifiedElement.classList.remove('d-none');
      }
      
      // 入力項目を無効化
      const phoneInput = document.getElementById('standalone-phone-input');
      const codeInput = document.getElementById('standalone-code-input');
      const sendButton = document.getElementById('standalone-send-code');
      const verifyButton = document.getElementById('standalone-verify-code');
      
      if (phoneInput) phoneInput.disabled = true;
      if (codeInput) codeInput.disabled = true;
      if (sendButton) sendButton.disabled = true;
      if (verifyButton) verifyButton.disabled = true;
      
      // モーダル内の「未表示」テキストを全て削除
      const modal = document.getElementById('registerGuideModal');
      if (modal) {
        removeUnverifiedTexts(modal);
      }
      
      showMessage('電話番号認証が完了しました', 'success');
    } else {
      showMessage('認証コードが正しくありません', 'danger');
    }
  }
  
  // メッセージを表示
  function showMessage(message, type = 'info') {
    // トーストメッセージ要素を作成
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 position-fixed`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    
    // トースト内容を設定
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    // ドキュメントに追加
    document.body.appendChild(toast);
    
    // Bootstrap Toastを初期化して表示
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      const bsToast = new bootstrap.Toast(toast);
      bsToast.show();
      
      // 一定時間後に要素を削除
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 5000);
    } else {
      // Bootstrapが使えない場合は単純なアラート表示
      alert(message);
      toast.parentNode.removeChild(toast);
    }
  }
})();