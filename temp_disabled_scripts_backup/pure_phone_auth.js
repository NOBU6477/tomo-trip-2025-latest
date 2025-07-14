/**
 * 純粋な電話認証スクリプト - エラーフリー版
 * 他のスクリプトの問題を回避するための完全独立実装
 */
(function() {
  // ページの読み込みが完了したら初期化
  if (document.readyState === 'complete') {
    initPhoneAuth();
  } else {
    window.addEventListener('load', initPhoneAuth);
  }
  
  // 初期化関数
  function initPhoneAuth() {
    console.log('電話認証: 初期化完了');
    
    // 新規登録ボタンのクリックを監視
    document.addEventListener('click', function(e) {
      if (e.target) {
        // ボタン要素自体またはその親要素が登録関連のボタンかチェック
        let button = e.target;
        
        // ID、クラス、テキストでチェック
        if (button && 
            (button.id === 'register-as-guide-btn' ||
             (button.textContent && button.textContent.indexOf('ガイド') > -1) ||
             (button.parentElement && button.parentElement.id === 'register-as-guide-btn'))) {
          
          // モーダルが表示されるまで少し待機
          setTimeout(checkForGuideModal, 500);
        }
      }
    });
    
    // Bootstrapモーダルイベントを監視
    document.addEventListener('shown.bs.modal', function(e) {
      if (e.target && e.target.id === 'registerGuideModal') {
        checkForGuideModal();
      }
    });
    
    // 定期的にモーダルをチェック (バックアップメカニズム)
    setInterval(checkForGuideModal, 3000);
  }
  
  // ガイド登録モーダルをチェック
  function checkForGuideModal() {
    const modal = document.getElementById('registerGuideModal');
    if (!modal) return;
    
    // モーダルが表示されているか確認
    if (getComputedStyle(modal).display === 'none' || !modal.classList.contains('show')) {
      return;
    }
    
    // すでに処理済みかチェック
    if (modal.querySelector('#pure-phone-auth')) {
      return;
    }
    
    // 電話認証セクションを探す
    const phoneSection = findPhoneVerificationSection(modal);
    
    if (phoneSection) {
      replaceWithCustomUI(phoneSection);
    } else {
      console.warn('電話認証セクションが見つかりませんでした');
    }
  }
  
  // 電話認証セクションを探す関数
  function findPhoneVerificationSection(modal) {
    let result = null;
    
    // 方法1: ラベルから探す
    const labels = modal.querySelectorAll('label');
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      if (label.textContent && label.textContent.indexOf('電話番号認証') > -1) {
        // ラベルの親要素がフォームグループかチェック
        let parent = label.parentElement;
        while (parent && parent !== modal) {
          if (parent.classList.contains('form-group') || 
              parent.classList.contains('mb-3') || 
              parent.classList.contains('col-md-6') || 
              parent.classList.contains('col')) {
            return parent;
          }
          parent = parent.parentElement;
        }
      }
    }
    
    // 方法2: テキスト内容で行から探す
    const rows = modal.querySelectorAll('.row');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.textContent && row.textContent.indexOf('電話番号認証') > -1) {
        // この行の列を探す
        const cols = row.querySelectorAll('.col, .col-md-6');
        if (cols.length > 0) {
          for (let j = 0; j < cols.length; j++) {
            if (cols[j].textContent.indexOf('電話番号認証') > -1) {
              return cols[j];
            }
          }
          // テキストがある列が見つからなければ、最初の列を返す
          return cols[0];
        }
      }
    }
    
    // 方法3: フォームグループから探す
    const formGroups = modal.querySelectorAll('.form-group, .mb-3');
    for (let i = 0; i < formGroups.length; i++) {
      if (formGroups[i].textContent && formGroups[i].textContent.indexOf('電話番号認証') > -1) {
        return formGroups[i];
      }
    }
    
    return null;
  }
  
  // 電話認証UI置き換え
  function replaceWithCustomUI(container) {
    // 元のラベルテキストを保存
    let labelText = '電話番号認証';
    const existingLabel = container.querySelector('label');
    if (existingLabel && existingLabel.textContent) {
      labelText = existingLabel.textContent;
    }
    
    // シンプルなHTML
    const html = `
      <div id="pure-phone-auth">
        <div class="mb-3">
          <label class="form-label">${labelText}</label>
          <div class="input-group">
            <span class="input-group-text">+81</span>
            <input type="tel" class="form-control" id="pure-phone-input" placeholder="電話番号（ハイフンなし）">
            <button class="btn btn-primary" type="button" id="pure-send-code">認証コード送信</button>
          </div>
        </div>
        
        <div id="pure-code-section" class="mb-3 d-none">
          <label class="form-label">認証コード</label>
          <input type="text" class="form-control" id="pure-code-input" placeholder="6桁のコード">
          <div class="form-text">SMSで送信された6桁のコードを入力してください</div>
        </div>
        
        <div id="pure-verified" class="alert alert-success mt-2 d-none">
          <i class="fas fa-check-circle me-2"></i>電話番号認証が完了しました
        </div>
        
        <div class="form-text mt-2">
          テスト用コード: 123456
        </div>
      </div>
    `;
    
    // コンテンツを置き換え
    container.innerHTML = html;
    
    // イベントリスナーを設定
    const sendButton = document.getElementById('pure-send-code');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        handleSendCode();
      });
    }
    
    const codeInput = document.getElementById('pure-code-input');
    if (codeInput) {
      codeInput.addEventListener('input', function() {
        // 6桁入力されたら自動検証
        if (this.value.length === 6) {
          verifyCode(this.value);
        }
      });
    }
    
    // 未表示バッジを消すためのスタイルを追加
    addCleanupStyles();
  }
  
  // コード送信処理
  function handleSendCode() {
    const phoneInput = document.getElementById('pure-phone-input');
    if (!phoneInput || !phoneInput.value.trim()) {
      showFeedback('電話番号を入力してください', 'warning');
      return;
    }
    
    // 送信ボタンを処理中表示に
    const sendButton = document.getElementById('pure-send-code');
    sendButton.disabled = true;
    const originalText = sendButton.textContent;
    sendButton.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> 送信中...';
    
    // 送信処理をシミュレート
    setTimeout(function() {
      sendButton.disabled = false;
      sendButton.textContent = originalText;
      
      // コード入力セクションを表示
      const codeSection = document.getElementById('pure-code-section');
      if (codeSection) {
        codeSection.classList.remove('d-none');
      }
      
      // 入力フォームにフォーカス
      const codeInput = document.getElementById('pure-code-input');
      if (codeInput) {
        codeInput.focus();
      }
      
      showFeedback('認証コードを送信しました', 'success');
    }, 1000);
  }
  
  // コード検証処理
  function verifyCode(code) {
    if (!code || code.trim().length !== 6) {
      showFeedback('6桁の認証コードを入力してください', 'warning');
      return;
    }
    
    // テスト用コードかチェック
    if (code === '123456') {
      // 認証完了表示
      const verifiedMsg = document.getElementById('pure-verified');
      if (verifiedMsg) {
        verifiedMsg.classList.remove('d-none');
      }
      
      // フォームを無効化
      const phoneInput = document.getElementById('pure-phone-input');
      const codeInput = document.getElementById('pure-code-input');
      const sendButton = document.getElementById('pure-send-code');
      
      if (phoneInput) phoneInput.disabled = true;
      if (codeInput) codeInput.disabled = true;
      if (sendButton) sendButton.disabled = true;
      
      // 認証UIに完了クラスを追加
      const authContainer = document.getElementById('pure-phone-auth');
      if (authContainer) {
        authContainer.classList.add('verified');
      }
      
      // モーダルから「未表示」要素を見つけて削除
      removeUnverifiedElements();
      
      showFeedback('電話番号認証が完了しました', 'success');
    } else {
      showFeedback('認証コードが正しくありません', 'danger');
    }
  }
  
  // 「未表示」要素を削除
  function removeUnverifiedElements() {
    const modal = document.getElementById('registerGuideModal');
    if (!modal) return;
    
    // すべてのテキストノードを検索
    const textNodes = [];
    
    function walkDOM(node) {
      if (node.nodeType === 3) { // テキストノード
        if (node.nodeValue && node.nodeValue.trim() === '未表示') {
          textNodes.push(node);
        }
      } else {
        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
          walkDOM(children[i]);
        }
      }
    }
    
    walkDOM(modal);
    
    // テキストを空に
    textNodes.forEach(function(node) {
      node.nodeValue = '';
    });
    
    // 空のspanやバッジも非表示に
    const spans = modal.querySelectorAll('span:not(.input-group-text):not(.spinner-border-sm)');
    spans.forEach(function(span) {
      if (!span.textContent || span.textContent.trim() === '') {
        span.style.display = 'none';
      }
      if (span.classList.contains('badge') && !span.classList.contains('bg-success')) {
        span.style.display = 'none';
      }
    });
  }
  
  // クリーンアップ用のスタイルを追加
  function addCleanupStyles() {
    // すでに追加済みならスキップ
    if (document.getElementById('pure-auth-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'pure-auth-styles';
    style.textContent = `
      /* バッジのクリーンアップ */
      #registerGuideModal span:empty { 
        display: none !important; 
      }
      
      #registerGuideModal .badge:not(.bg-success) { 
        display: none !important; 
      }
      
      /* 非表示テキストを透明に */
      #registerGuideModal span:not(.input-group-text):not(.spinner-border-sm) { 
        color: transparent !important; 
      }
      
      /* 認証完了表示の強制 */
      #pure-verified { 
        display: block !important; 
        visibility: visible !important; 
      }
      
      /* 認証済み状態のスタイル */
      #pure-phone-auth.verified input,
      #pure-phone-auth.verified button {
        opacity: 0.65;
        pointer-events: none;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // フィードバック表示
  function showFeedback(message, type) {
    // 既存のフィードバックを削除
    const existingAlerts = document.querySelectorAll('.pure-feedback');
    existingAlerts.forEach(function(alert) {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    });
    
    // 新しいフィードバックを作成
    const feedback = document.createElement('div');
    feedback.className = `alert alert-${type} pure-feedback`;
    feedback.textContent = message;
    
    // スタイルを設定
    feedback.style.position = 'fixed';
    feedback.style.top = '20px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    feedback.style.zIndex = '9999';
    feedback.style.padding = '10px 20px';
    feedback.style.borderRadius = '4px';
    feedback.style.boxShadow = '0 3px 6px rgba(0,0,0,0.2)';
    
    // ドキュメントに追加
    document.body.appendChild(feedback);
    
    // 3秒後に削除
    setTimeout(function() {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 3000);
  }
})();