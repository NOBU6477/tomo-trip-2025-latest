/**
 * 最も軽量な電話認証スクリプト - 他のスクリプトと完全に独立
 * このスクリプトはエラーのない、最小限の機能を提供する
 */
(function() {
  // DOMの読み込みが完了したら初期化
  document.addEventListener('DOMContentLoaded', init);
  
  // 初期化関数
  function init() {
    // モーダルの開閉を監視
    document.addEventListener('shown.bs.modal', function(e) {
      if (e.target && e.target.id === 'registerGuideModal') {
        setupPhoneVerification();
      }
    });
    
    // ガイド登録ボタンのクリック監視
    document.addEventListener('click', function(e) {
      if (e.target && e.target.id === 'register-as-guide-btn') {
        setTimeout(setupPhoneVerification, 500);
      }
    });
  }
  
  // 電話認証UIの設定
  function setupPhoneVerification() {
    const modal = document.getElementById('registerGuideModal');
    if (!modal) return;
    
    // モーダル内の電話認証コンテナを探す
    let container = null;
    const labels = modal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.indexOf('電話番号認証') !== -1) {
        // 親要素を探す (フォームグループ)
        let parent = label.parentElement;
        while (parent && parent !== modal) {
          if (parent.classList.contains('mb-3') || 
              parent.classList.contains('form-group') || 
              parent.classList.contains('col-md-6') || 
              parent.classList.contains('col')) {
            container = parent;
            break;
          }
          parent = parent.parentElement;
        }
        if (container) break;
      }
    }
    
    if (!container) {
      // 代替検索方法 - .col-md-6要素で電話認証テキストを含むもの
      const cols = modal.querySelectorAll('.col-md-6');
      for (const col of cols) {
        if (col.textContent && col.textContent.indexOf('電話番号認証') !== -1) {
          container = col;
          break;
        }
      }
    }
    
    if (container) {
      // すでに処理済みか確認
      if (container.querySelector('#super-verified')) return;
      
      // ラベルテキストを取得
      let labelText = '電話番号認証';
      const label = container.querySelector('label');
      if (label) labelText = label.textContent;
      
      // 新しいUIを作成
      const html = `
        <label class="form-label">${labelText}</label>
        <div class="input-group mb-2">
          <span class="input-group-text">+81</span>
          <input type="tel" class="form-control" id="super-phone" placeholder="電話番号（ハイフンなし）">
          <button class="btn btn-primary" type="button" id="super-send-code">認証コード送信</button>
        </div>
        <div id="super-code-container" class="d-none">
          <div class="mb-2">
            <input type="text" class="form-control" id="super-code" placeholder="6桁のコード">
            <div class="form-text">SMSで送信された6桁のコードを入力してください</div>
          </div>
        </div>
        <div id="super-verified" class="alert alert-success mt-2 d-none">
          電話番号認証が完了しました
        </div>
        <div class="small text-muted">テスト用コード: 123456</div>
      `;
      
      // コンテンツを置き換え
      container.innerHTML = html;
      
      // イベントリスナーを設定
      const sendBtn = document.getElementById('super-send-code');
      if (sendBtn) {
        sendBtn.addEventListener('click', function() {
          // 入力値を取得
          const phoneInput = document.getElementById('super-phone');
          if (!phoneInput || !phoneInput.value.trim()) {
            showMessage('電話番号を入力してください', 'warning');
            return;
          }
          
          // ボタンを処理中表示に
          this.disabled = true;
          const origText = this.textContent;
          this.textContent = '送信中...';
          
          // 処理をシミュレート
          setTimeout(() => {
            this.disabled = false;
            this.textContent = origText;
            
            // コード入力欄を表示
            const codeContainer = document.getElementById('super-code-container');
            if (codeContainer) {
              codeContainer.classList.remove('d-none');
              
              // フォーカスを設定
              const codeInput = document.getElementById('super-code');
              if (codeInput) {
                codeInput.focus();
                
                // コード入力イベント
                codeInput.addEventListener('input', function() {
                  if (this.value.length === 6) {
                    verifyCode(this.value);
                  }
                });
              }
            }
            
            showMessage('認証コードを送信しました', 'success');
          }, 1000);
        });
      }
      
      // 「未表示」バッジを非表示にするスタイルを追加
      addCleanupStyles();
    }
  }
  
  // 認証コード検証
  function verifyCode(code) {
    if (code === '123456') {
      // 認証完了表示
      const verifiedMsg = document.getElementById('super-verified');
      if (verifiedMsg) verifiedMsg.classList.remove('d-none');
      
      // 入力フィールドを無効化
      const phoneInput = document.getElementById('super-phone');
      const codeInput = document.getElementById('super-code');
      const sendBtn = document.getElementById('super-send-code');
      
      if (phoneInput) phoneInput.disabled = true;
      if (codeInput) codeInput.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
      
      // 「未表示」バッジを非表示
      removeUnverifiedElements();
      
      showMessage('電話番号認証が完了しました', 'success');
    } else {
      showMessage('認証コードが正しくありません', 'danger');
    }
  }
  
  // スタイル追加
  function addCleanupStyles() {
    if (document.getElementById('super-lightweight-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'super-lightweight-styles';
    style.textContent = `
      /* 空のスパンを非表示 */
      #registerGuideModal span:empty { display: none !important; }
      
      /* 非バッジを非表示 */
      #registerGuideModal .badge:not(.bg-success) { display: none !important; }
      
      /* 通常のスパンを透明に */
      #registerGuideModal span:not(.input-group-text) { color: transparent !important; }
      
      /* 認証完了メッセージのスタイル */
      #super-verified {
        display: block !important;
        visibility: visible !important;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // 「未表示」テキストを削除
  function removeUnverifiedElements() {
    const modal = document.getElementById('registerGuideModal');
    if (!modal) return;
    
    const spans = modal.querySelectorAll('span');
    spans.forEach(span => {
      if (span.textContent && span.textContent.trim() === '未表示') {
        span.style.display = 'none';
        span.textContent = '';
      }
    });
  }
  
  // メッセージ表示
  function showMessage(message, type) {
    const existingMsgs = document.querySelectorAll('.super-alert');
    existingMsgs.forEach(msg => {
      if (msg.parentNode) msg.parentNode.removeChild(msg);
    });
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} super-alert`;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.zIndex = '9999';
    alert.style.padding = '10px 20px';
    alert.style.borderRadius = '4px';
    alert.style.boxShadow = '0 3px 6px rgba(0,0,0,0.2)';
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
      if (alert.parentNode) alert.parentNode.removeChild(alert);
    }, 3000);
  }
})();