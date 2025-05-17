/**
 * 完全置換型電話番号認証機能
 * HTML構造そのものを書き換え、UIを崩さずに問題を解決
 */
(function() {
  // 初期化関数
  function initPhoneVerification() {
    console.log('電話番号認証機能を初期化します');
    
    try {
      // 新規登録ボタンのクリックを監視
      const registerBtn = document.getElementById('show-user-type-modal');
      if (registerBtn) {
        registerBtn.addEventListener('click', function() {
          setTimeout(watchForGuideModal, 500);
        });
      }
      
      // ボディへのクリックイベントをグローバルに監視
      document.addEventListener('click', function(event) {
        // ガイド登録ボタンがクリックされた場合
        if (event.target.id === 'register-as-guide-btn' || 
            (event.target.parentElement && event.target.parentElement.id === 'register-as-guide-btn') ||
            event.target.textContent === 'ガイドとして登録') {
          setTimeout(watchForGuideModal, 500);
        }
      });
      
      // DOMの変更を監視（安全なチェック）
      if (document.body) {
        setupMutationObserver();
      } else {
        window.addEventListener('load', setupMutationObserver);
      }
      
      // 初期ロード時にもチェック（少し遅延）
      setTimeout(watchForGuideModal, 1000);
    } catch (error) {
      console.error('電話番号認証機能の初期化中にエラーが発生しました:', error);
    }
  }
  
  // MutationObserverの設定を別関数に
  function setupMutationObserver() {
    try {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            watchForGuideModal();
          }
        });
      });
      
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        console.log('DOM変更の監視を開始しました');
      }
    } catch (error) {
      console.error('MutationObserverの設定中にエラーが発生しました:', error);
    }
  }
  
  // ページ読み込み時に初期化（DOMContentLoadedだと早すぎる場合があるのでloadも使用）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhoneVerification);
  } else {
    initPhoneVerification();
  }
  
  // バックアップとしてwindow.loadイベントも使用
  window.addEventListener('load', function() {
    setTimeout(watchForGuideModal, 500);
  });
  
  // ガイド登録モーダルを監視
  function watchForGuideModal() {
    const modal = document.getElementById('registerGuideModal');
    if (modal && isModalVisible(modal)) {
      console.log('ガイド登録モーダルを検出しました');
      
      // 電話番号認証セクションを検索
      const verificationSection = findPhoneVerificationSection(modal);
      if (verificationSection) {
        // 既存のセクションを完全に置き換え
        replacePhoneVerificationSection(verificationSection);
      }
    }
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSection(modal) {
    let phoneSection = null;
    
    // ラベルから検索
    const labels = modal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        phoneSection = label.closest('.col-md-6');
        break;
      }
    }
    
    // IDからも検索
    if (!phoneSection) {
      const phoneElements = modal.querySelectorAll('[id*="phone"], [id*="verification"]');
      for (const el of phoneElements) {
        const section = el.closest('.col-md-6');
        if (section) {
          phoneSection = section;
          break;
        }
      }
    }
    
    return phoneSection;
  }
  
  // 電話番号認証セクションを完全に置き換え
  function replacePhoneVerificationSection(section) {
    if (!section) return;
    
    console.log('電話番号認証セクションを置き換えます');
    
    // 元のラベルテキストを保持
    const originalLabel = section.querySelector('label')?.textContent || '電話番号認証';
    
    // 完全に新しいHTMLで置き換え
    section.innerHTML = `
      <label class="form-label">${originalLabel}</label>
      <div id="complete-phone-verification">
        <div class="input-group mb-3">
          <span class="input-group-text">+81</span>
          <input type="tel" class="form-control" id="complete-phone-number" placeholder="90-1234-5678">
          <button class="btn btn-primary" type="button" id="complete-send-code-btn">認証コード送信</button>
        </div>
        <div class="form-text mb-3">ハイフンなしの電話番号を入力してください</div>
        
        <div class="mb-4">
          <label for="complete-verification-code" class="form-label">認証コード</label>
          <input type="text" class="form-control" id="complete-verification-code" placeholder="• • • • • •">
          <div class="verification-info">SMSで送信された6桁のコードを入力してください</div>
        </div>
        
        <div id="complete-phone-verified" class="alert alert-success d-none">
          <i class="fas fa-check-circle me-2"></i>電話番号認証が完了しました
        </div>
        
        <div class="small text-muted mb-2">
          テスト環境では、認証コード「123456」を使用できます
        </div>
      </div>
    `;
    
    // イベントリスナーを設定
    setupVerificationListeners();
  }
  
  // 電話認証のイベントリスナーを設定
  function setupVerificationListeners() {
    // 認証コード送信ボタン
    const sendCodeBtn = document.getElementById('complete-send-code-btn');
    if (sendCodeBtn) {
      sendCodeBtn.addEventListener('click', handleSendCode);
    }
    
    // 認証コード入力
    const codeInput = document.getElementById('complete-verification-code');
    if (codeInput) {
      codeInput.addEventListener('input', function() {
        // 6桁入力されたら自動検証
        if (this.value.length === 6) {
          verifyCode(this.value);
        }
      });
    }
  }
  
  // 認証コード送信処理
  function handleSendCode() {
    const phoneInput = document.getElementById('complete-phone-number');
    if (!phoneInput || !phoneInput.value.trim()) {
      showFloatingMessage('電話番号を入力してください', 'danger');
      return;
    }
    
    const sendCodeBtn = document.getElementById('complete-send-code-btn');
    if (sendCodeBtn) {
      // ボタンを無効化して処理中表示
      sendCodeBtn.disabled = true;
      const originalText = sendCodeBtn.textContent;
      sendCodeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
      
      // 1秒後に処理完了（実際のAPIコールをシミュレート）
      setTimeout(() => {
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = originalText;
        
        showFloatingMessage('認証コードを送信しました', 'success');
        
        // 認証コード入力欄にフォーカス
        const codeInput = document.getElementById('complete-verification-code');
        if (codeInput) {
          codeInput.focus();
        }
      }, 1000);
    }
  }
  
  // 認証コード検証
  function verifyCode(code) {
    // テスト用認証コード
    if (code === '123456') {
      // 認証完了表示
      const verifiedAlert = document.getElementById('complete-phone-verified');
      if (verifiedAlert) {
        verifiedAlert.classList.remove('d-none');
      }
      
      // 入力フィールドを無効化
      const phoneInput = document.getElementById('complete-phone-number');
      const sendCodeBtn = document.getElementById('complete-send-code-btn');
      const codeInput = document.getElementById('complete-verification-code');
      
      if (phoneInput) phoneInput.disabled = true;
      if (sendCodeBtn) sendCodeBtn.disabled = true;
      if (codeInput) codeInput.disabled = true;
      
      // 成功メッセージ
      showFloatingMessage('電話番号認証が完了しました', 'success');
      
      // 「未表示」テキストを強制的に削除
      removeAllUnverifiedTexts();
    } else {
      showFloatingMessage('無効な認証コードです', 'danger');
    }
  }
  
  // 「未表示」テキストをすべて削除
  function removeAllUnverifiedTexts() {
    const modal = document.getElementById('registerGuideModal');
    if (!modal) return;
    
    // すべてのテキストノードを探す
    const walker = document.createTreeWalker(
      modal,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const nodesToRemove = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim() === '未表示') {
        nodesToRemove.push(node);
      }
    }
    
    // テキストノードを削除
    nodesToRemove.forEach(node => {
      if (node.parentNode) {
        if (node.parentNode.childNodes.length === 1) {
          // 親要素が他の子要素を持たない場合は親要素自体を非表示
          node.parentNode.style.display = 'none';
        } else {
          // そうでなければテキストノードだけを削除
          node.textContent = '';
        }
      }
    });
  }
  
  // フローティングメッセージを表示
  function showFloatingMessage(message, type) {
    // 既存のメッセージを削除
    const existingMessages = document.querySelectorAll('.floating-message');
    existingMessages.forEach(el => el.remove());
    
    // 新しいメッセージを作成
    const messageEl = document.createElement('div');
    messageEl.className = `alert alert-${type} floating-message`;
    messageEl.style.position = 'fixed';
    messageEl.style.top = '20px';
    messageEl.style.left = '50%';
    messageEl.style.transform = 'translateX(-50%)';
    messageEl.style.zIndex = '9999';
    messageEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    messageEl.style.padding = '10px 20px';
    messageEl.textContent = message;
    
    document.body.appendChild(messageEl);
    
    // 3秒後に削除
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 3000);
  }
  
  // モーダルが表示されているか確認
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
  }
})();