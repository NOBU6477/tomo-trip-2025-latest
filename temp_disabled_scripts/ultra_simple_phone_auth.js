/**
 * 超シンプルな電話認証UI 
 * エラーを完全に排除した最小限の実装
 */
(function() {
  // ページロード完了後に実行
  document.addEventListener('DOMContentLoaded', init);
  
  // 初期化
  function init() {
    console.log('シンプル電話認証: 初期化');
    
    // ガイド登録ボタンのクリックを監視
    document.addEventListener('click', function(e) {
      // ガイド登録ボタンを識別するための条件
      if (e.target && 
          ((e.target.id === 'register-as-guide-btn') || 
           (e.target.textContent && e.target.textContent.includes('ガイド')) ||
           (e.target.parentElement && e.target.parentElement.id === 'register-as-guide-btn'))) {
        
        // 少し遅延させてモーダル表示を待つ
        setTimeout(checkAndInjectVerification, 500);
      }
    });
    
    // Bootstrapモーダルのイベントを監視（より確実）
    document.addEventListener('shown.bs.modal', function(e) {
      if (e.target && e.target.id === 'registerGuideModal') {
        checkAndInjectVerification();
      }
    });
    
    // 定期的に確認（バックアップ対策）
    setInterval(checkAndInjectVerification, 2000);
  }
  
  // ガイド登録モーダルをチェックしてUI注入
  function checkAndInjectVerification() {
    // モーダルを取得
    const modal = document.getElementById('registerGuideModal');
    if (!modal) return;
    
    // モーダルが表示されているか確認
    const computedStyle = window.getComputedStyle(modal);
    if (computedStyle.display === 'none' || !modal.classList.contains('show')) {
      return;
    }
    
    // 既に電話認証UIを注入済みかチェック
    if (modal.querySelector('#ultra-simple-verification')) {
      // 既に実装済み - バッジクリーンアップだけ実行
      cleanupBadges();
      return;
    }
    
    // モーダル内の電話認証セクションを探す
    const allRowElements = Array.from(modal.querySelectorAll('.row'));
    
    // 電話認証セクションを特定
    let phoneRow = null;
    let phoneSection = null;
    
    // 方法1: ラベルから探す
    const labels = modal.querySelectorAll('label');
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].textContent && labels[i].textContent.includes('電話番号認証')) {
        // ラベルの親要素を特定
        let parent = labels[i].parentElement;
        
        // フォームグループやカラムを探す
        while (parent && parent !== modal) {
          if (parent.classList.contains('form-group') || 
              parent.classList.contains('mb-3') || 
              parent.classList.contains('col-md-6') || 
              parent.classList.contains('col')) {
            phoneSection = parent;
            break;
          }
          parent = parent.parentElement;
        }
        
        if (phoneSection) break;
      }
    }
    
    // 方法2: テキスト内容で行から探す
    if (!phoneSection) {
      for (let i = 0; i < allRowElements.length; i++) {
        if (allRowElements[i].textContent && allRowElements[i].textContent.includes('電話番号認証')) {
          phoneRow = allRowElements[i];
          
          // 適切な列を特定
          const columns = phoneRow.querySelectorAll('.col, .col-md-6');
          if (columns && columns.length > 0) {
            // テキストを含む列を探す
            for (let j = 0; j < columns.length; j++) {
              if (columns[j].textContent.includes('電話番号認証')) {
                phoneSection = columns[j];
                break;
              }
            }
            
            // テキストを含む列が見つからなければ、最初の列を使用
            if (!phoneSection && columns.length > 0) {
              phoneSection = columns[0];
            }
          }
          
          break;
        }
      }
    }
    
    // 方法3: フォームグループから直接探す（最終手段）
    if (!phoneSection) {
      const formGroups = modal.querySelectorAll('.form-group, .mb-3');
      for (let i = 0; i < formGroups.length; i++) {
        if (formGroups[i].textContent && formGroups[i].textContent.includes('電話番号認証')) {
          phoneSection = formGroups[i];
          break;
        }
      }
    }
    
    // 電話認証セクションが見つかったら、UIを注入
    if (phoneSection) {
      injectPhoneVerificationUI(phoneSection);
    } else {
      console.warn('電話番号認証セクションが見つかりませんでした');
    }
  }
  
  // 電話認証UIを注入
  function injectPhoneVerificationUI(container) {
    // 元のラベルテキストを取得（存在すれば）
    let labelText = '電話番号認証';
    const existingLabel = container.querySelector('label');
    if (existingLabel && existingLabel.textContent) {
      labelText = existingLabel.textContent;
    }
    
    // 単純なHTMLを作成（最小限の構造）
    const verificationHtml = `
      <div id="ultra-simple-verification">
        <label class="form-label">${labelText}</label>
        <div class="input-group mb-2">
          <span class="input-group-text">+81</span>
          <input type="tel" class="form-control" id="ultra-phone-input" placeholder="電話番号（ハイフンなし）">
          <button class="btn btn-primary" type="button" id="ultra-send-code">認証コード送信</button>
        </div>
        
        <div id="ultra-code-section" class="d-none">
          <div class="mb-2">
            <label class="form-label">認証コード</label>
            <input type="text" class="form-control" id="ultra-code-input" placeholder="6桁のコード">
          </div>
          <div class="text-muted small mb-2">SMSで送信された6桁のコードを入力してください</div>
        </div>
        
        <div id="ultra-verified" class="alert alert-success mt-2 d-none">
          電話番号認証が完了しました
        </div>
        
        <div class="small text-muted mt-2">
          テスト用コード: 123456
        </div>
      </div>
    `;
    
    // 既存内容を置き換え
    container.innerHTML = verificationHtml;
    
    // イベントハンドラを設定
    setupEventHandlers();
    
    // バッジをクリーンアップ
    cleanupBadges();
    
    // 「未表示」テキストを非表示にするスタイルを追加
    injectCleanupStyles();
  }
  
  // イベントハンドラのセットアップ
  function setupEventHandlers() {
    // 認証コード送信ボタン
    const sendButton = document.getElementById('ultra-send-code');
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        handleSendCode();
      });
    }
    
    // 認証コード入力欄
    const codeInput = document.getElementById('ultra-code-input');
    if (codeInput) {
      codeInput.addEventListener('input', function() {
        // 6桁入力されたら検証
        if (this.value.length === 6) {
          handleVerifyCode(this.value);
        }
      });
    }
  }
  
  // 認証コード送信
  function handleSendCode() {
    const phoneInput = document.getElementById('ultra-phone-input');
    if (!phoneInput || !phoneInput.value.trim()) {
      showMessage('電話番号を入力してください', 'warning');
      return;
    }
    
    // ボタンを処理中表示に
    const sendButton = document.getElementById('ultra-send-code');
    if (sendButton) {
      sendButton.disabled = true;
      const originalText = sendButton.textContent;
      sendButton.textContent = '送信中...';
      
      // 処理をシミュレート
      setTimeout(function() {
        sendButton.disabled = false;
        sendButton.textContent = originalText;
        
        // コード入力セクションを表示
        const codeSection = document.getElementById('ultra-code-section');
        if (codeSection) {
          codeSection.classList.remove('d-none');
        }
        
        // 入力欄にフォーカス
        const codeInput = document.getElementById('ultra-code-input');
        if (codeInput) {
          codeInput.focus();
        }
        
        showMessage('認証コードを送信しました', 'success');
      }, 1000);
    }
  }
  
  // 認証コード検証
  function handleVerifyCode(code) {
    if (!code || code.trim().length !== 6) {
      showMessage('6桁の認証コードを入力してください', 'warning');
      return;
    }
    
    // テスト用コード検証
    if (code === '123456') {
      // 認証完了メッセージを表示
      const verifiedDiv = document.getElementById('ultra-verified');
      if (verifiedDiv) {
        verifiedDiv.classList.remove('d-none');
      }
      
      // 入力項目を無効化
      const phoneInput = document.getElementById('ultra-phone-input');
      const codeInput = document.getElementById('ultra-code-input');
      const sendButton = document.getElementById('ultra-send-code');
      
      if (phoneInput) phoneInput.disabled = true;
      if (codeInput) codeInput.disabled = true;
      if (sendButton) sendButton.disabled = true;
      
      // バッジを非表示
      cleanupBadges();
      
      // セクション全体にスタイルを適用
      const verificationSection = document.getElementById('ultra-simple-verification');
      if (verificationSection) {
        verificationSection.classList.add('verified');
      }
      
      showMessage('電話番号認証が完了しました', 'success');
    } else {
      showMessage('認証コードが正しくありません', 'danger');
    }
  }
  
  // バッジのクリーンアップ
  function cleanupBadges() {
    const modal = document.getElementById('registerGuideModal');
    if (!modal) return;
    
    // すべてのバッジ要素を非表示
    const badgeSelectors = [
      '.badge:not(.bg-success)',
      'span:empty',
      'span:not(.input-group-text):not([class])'
    ];
    
    // 選択した要素を処理
    badgeSelectors.forEach(selector => {
      try {
        const elements = modal.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.textContent && el.textContent.trim() === '未表示') {
            el.style.display = 'none';
            el.textContent = '';
          } else if (!el.textContent || el.textContent.trim() === '') {
            el.style.display = 'none';
          }
        });
      } catch (e) {
        console.error('バッジクリーンアップエラー:', e);
      }
    });
  }
  
  // 「未表示」テキストを非表示にするスタイルを注入
  function injectCleanupStyles() {
    // スタイルが既に存在するか確認
    if (document.getElementById('ultra-simple-styles')) return;
    
    // 新しいスタイル要素を作成
    const style = document.createElement('style');
    style.id = 'ultra-simple-styles';
    style.textContent = `
      /* 空要素を非表示 */
      #registerGuideModal span:empty,
      #registerGuideModal div:empty:not(.input-group):not(.input-group-text) {
        display: none !important;
      }
      
      /* 「未表示」テキストを含むスパンを透明に */
      #registerGuideModal span:not(.input-group-text):not([class*="spinner"]) {
        color: transparent;
      }
      
      /* 認証完了バッジを強制表示 */
      #ultra-verified {
        display: block !important;
        color: #0f5132 !important;
      }
      
      /* 非表示バッジを隠す */
      #registerGuideModal .badge:not(.bg-success) {
        display: none !important;
      }
      
      /* 認証済みスタイル */
      #ultra-simple-verification.verified input,
      #ultra-simple-verification.verified button {
        opacity: 0.65;
        pointer-events: none;
      }
    `;
    
    // ドキュメントに追加
    document.head.appendChild(style);
  }
  
  // 通知メッセージ表示
  function showMessage(message, type) {
    // 既存の通知を削除
    const notifications = document.querySelectorAll('.ultra-notification');
    notifications.forEach(notification => {
      notification.remove();
    });
    
    // 新しい通知を作成
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} ultra-notification`;
    notification.textContent = message;
    
    // スタイルを適用
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '9999';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 3px 6px rgba(0,0,0,0.2)';
    
    // ドキュメントに追加
    document.body.appendChild(notification);
    
    // 3秒後に削除
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
})();