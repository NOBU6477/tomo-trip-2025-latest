/**
 * 電話番号認証機能 - 単一ファイル完結版
 * 最もシンプルで確実な実装
 */
(function() {
  // ページが完全に読み込まれた後に実行
  window.addEventListener('load', function() {
    console.log('電話番号認証スクリプトがロードされました');
    
    // 初期チェックと監視を設定
    initPhoneVerification();
    setupModalOpenMonitoring();
  });
  
  // 電話認証機能の初期化
  function initPhoneVerification() {
    // ページ読み込み直後に一度チェック
    setTimeout(checkForGuideModal, 1000);
    
    // 定期的にチェック (モーダルが開く可能性のあるタイミングで)
    setInterval(checkForGuideModal, 2000);
  }
  
  // モーダルオープンの監視設定
  function setupModalOpenMonitoring() {
    // 新規登録ボタンのクリックを監視
    document.addEventListener('click', function(event) {
      const target = event.target;
      
      // 新規登録ボタンがクリックされた場合
      if (target.id === 'show-user-type-modal' || 
          target.textContent === '新規登録' ||
          (target.parentElement && target.parentElement.id === 'show-user-type-modal')) {
        setTimeout(checkForGuideModal, 500);
      }
      
      // ガイド登録ボタンがクリックされた場合
      if (target.id === 'register-as-guide-btn' || 
          target.textContent === 'ガイドとして登録' ||
          (target.parentElement && target.parentElement.id === 'register-as-guide-btn')) {
        setTimeout(checkForGuideModal, 500);
      }
    });
  }
  
  // ガイド登録モーダルを確認
  function checkForGuideModal() {
    const modal = document.getElementById('registerGuideModal');
    if (modal && isModalVisible(modal)) {
      console.log('ガイド登録モーダルが表示されています');
      
      // 内容を置換
      replacePhoneVerificationSection(modal);
    }
  }
  
  // モーダルが表示されているか確認
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
  }
  
  // 電話番号認証セクションを置換
  function replacePhoneVerificationSection(modal) {
    // 既に認証UIが設置済みかチェック
    if (modal.querySelector('#simple-phone-verification')) {
      return;
    }
    
    // モーダル内のセクションを特定
    const rows = modal.querySelectorAll('.row');
    if (!rows || rows.length === 0) {
      console.error('モーダル内の行要素が見つかりません');
      return;
    }
    
    // 電話番号認証セクションを探す
    let phoneSection = null;
    let labelText = '';
    
    // まず、ラベルテキストから探す
    rows.forEach(row => {
      const labels = row.querySelectorAll('label');
      labels.forEach(label => {
        if (label.textContent && label.textContent.includes('電話番号認証')) {
          phoneSection = findPhoneContainerInRow(row);
          labelText = label.textContent;
        }
      });
    });
    
    // セクションが見つからない場合、セクションの内容から探す
    if (!phoneSection) {
      rows.forEach(row => {
        const text = row.textContent || '';
        if (text.includes('電話番号認証')) {
          phoneSection = findPhoneContainerInRow(row);
          labelText = '電話番号認証';
        }
      });
    }
    
    // まだ見つからない場合、モーダル全体から特定のパターンで探す
    if (!phoneSection) {
      const verifyElements = modal.querySelectorAll('[id*="phone"], [id*="verify"], [class*="verify"]');
      for (const el of verifyElements) {
        const parent = findParentCol(el);
        if (parent) {
          phoneSection = parent;
          labelText = '電話番号認証';
          break;
        }
      }
    }
    
    // それでも見つからない場合、2行目のcolを探す（一般的なUIパターン）
    if (!phoneSection && rows.length >= 2) {
      const secondRow = rows[1];
      const cols = secondRow.querySelectorAll('.col-md-6');
      if (cols && cols.length >= 2) {
        phoneSection = cols[1]; // 右側のカラム
        labelText = '電話番号認証';
      }
    }
    
    // 電話番号認証セクションが見つかった場合
    if (phoneSection) {
      console.log('電話番号認証セクションを発見:', phoneSection);
      
      // 現在の内容をバックアップ
      const originalContent = phoneSection.innerHTML;
      
      // 新しい認証UI要素を作成
      const verificationUI = document.createElement('div');
      verificationUI.id = 'simple-phone-verification';
      verificationUI.innerHTML = `
        <label class="form-label">${labelText}</label>
        <div class="phone-verify-container">
          <div class="input-group mb-2">
            <span class="input-group-text">+81</span>
            <input type="tel" class="form-control" id="simple-phone-input" placeholder="電話番号（例：09012345678）">
            <button class="btn btn-primary" type="button" id="simple-send-code-btn">認証コード送信</button>
          </div>
          
          <div id="simple-code-section" class="mt-3 d-none">
            <div class="mb-2">
              <label for="simple-code-input" class="form-label">認証コード</label>
              <input type="text" class="form-control" id="simple-code-input" placeholder="6桁のコード">
            </div>
            <div class="form-text mb-2">SMSで送信された6桁のコードを入力してください</div>
          </div>
          
          <div id="simple-verified" class="alert alert-success mt-3 d-none">
            <i class="fas fa-check-circle me-2"></i>電話番号認証が完了しました
          </div>
          
          <div class="small text-muted mt-2">
            テスト用コード: 123456
          </div>
        </div>
      `;
      
      // 元の内容を新しいUIに置き換え
      phoneSection.innerHTML = '';
      phoneSection.appendChild(verificationUI);
      
      // 「未表示」テキストがあれば削除
      removeUnverifiedTexts(modal);
      
      // イベントハンドラを設定
      setupEventHandlers();
    } else {
      console.error('電話番号認証セクションが見つかりません');
    }
  }
  
  // 行内の電話番号コンテナを探す
  function findPhoneContainerInRow(row) {
    // col-md-6クラスの要素を探す
    const cols = row.querySelectorAll('.col-md-6');
    if (cols && cols.length > 0) {
      for (const col of cols) {
        if (col.textContent && col.textContent.includes('電話番号認証')) {
          return col;
        }
      }
      // 2列レイアウトの場合は右側を返す
      if (cols.length >= 2) {
        return cols[1];
      }
      // 1列しかない場合はそれを返す
      return cols[0];
    }
    return null;
  }
  
  // 親のカラム要素を探す
  function findParentCol(element) {
    let current = element;
    while (current) {
      if (current.classList && (
          current.classList.contains('col-md-6') || 
          current.classList.contains('col-lg-6') || 
          current.classList.contains('col-sm-6'))) {
        return current;
      }
      current = current.parentElement;
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
    const sendButton = document.getElementById('simple-send-code-btn');
    if (sendButton) {
      sendButton.addEventListener('click', handleSendCode);
    }
    
    // コード入力欄（6桁入力で自動認証）
    const codeInput = document.getElementById('simple-code-input');
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
    const phoneInput = document.getElementById('simple-phone-input');
    if (!phoneInput || !phoneInput.value.trim()) {
      showMessage('電話番号を入力してください', 'warning');
      return;
    }
    
    // 送信ボタンのローディング表示
    const sendButton = document.getElementById('simple-send-code-btn');
    if (sendButton) {
      sendButton.disabled = true;
      const originalText = sendButton.textContent;
      sendButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> 送信中...';
      
      // 処理をシミュレート（実際はここでAPIを呼ぶ）
      setTimeout(() => {
        sendButton.disabled = false;
        sendButton.textContent = originalText;
        
        // コード入力欄を表示
        const codeSection = document.getElementById('simple-code-section');
        if (codeSection) {
          codeSection.classList.remove('d-none');
        }
        
        // コード入力欄にフォーカス
        const codeInput = document.getElementById('simple-code-input');
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
      const verifiedElement = document.getElementById('simple-verified');
      if (verifiedElement) {
        verifiedElement.classList.remove('d-none');
      }
      
      // 入力項目を無効化
      const phoneInput = document.getElementById('simple-phone-input');
      const codeInput = document.getElementById('simple-code-input');
      const sendButton = document.getElementById('simple-send-code-btn');
      
      if (phoneInput) phoneInput.disabled = true;
      if (codeInput) codeInput.disabled = true;
      if (sendButton) sendButton.disabled = true;
      
      // モーダル内の「未表示」テキストを全て削除
      const modal = document.getElementById('registerGuideModal');
      if (modal) {
        removeAllUnverifiedTextsFromPage();
      }
      
      showMessage('電話番号認証が完了しました', 'success');
    } else {
      showMessage('認証コードが正しくありません', 'danger');
    }
  }
  
  // ページ全体から「未表示」テキストを削除
  function removeAllUnverifiedTextsFromPage() {
    const allElements = document.querySelectorAll('*');
    for (const element of allElements) {
      if (element.childNodes.length === 1 && 
          element.childNodes[0].nodeType === Node.TEXT_NODE && 
          element.childNodes[0].textContent.trim() === '未表示') {
        element.style.display = 'none';
      }
    }
  }
  
  // メッセージを表示
  function showMessage(message, type = 'info') {
    // 通知エリアを作成
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} fixed-top mx-auto mt-3`;
    notification.style.width = '80%';
    notification.style.maxWidth = '500px';
    notification.style.zIndex = '9999';
    notification.style.textAlign = 'center';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    notification.innerHTML = message;
    
    // ドキュメントに追加
    document.body.appendChild(notification);
    
    // 3秒後に削除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
})();