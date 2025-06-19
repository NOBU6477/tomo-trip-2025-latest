/**
 * 最小限の実装で基本情報と身分証明書の間に電話番号認証セクションを配置する
 * ボタンクリックイベントを直接捕捉する方式
 */
(function() {
  // DOMが読み込まれたら初期化
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 1000);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, 1000);
    });
  }

  // ページ読み込み後も定期的にチェック
  function init() {
    console.log('電話認証セクション初期化');
    
    // ユーザータイプモーダル表示ボタンを監視
    const userTypeBtn = document.getElementById('show-user-type-modal');
    if (userTypeBtn) {
      userTypeBtn.addEventListener('click', function() {
        console.log('ユーザータイプモーダル表示ボタンがクリックされました');
        setTimeout(setupGuideTypeButton, 500);
      });
    }
    
    // 既に表示されているモーダルがあればチェック
    setupGuideTypeButton();
    
    // モーダル表示イベントを監視
    if (typeof $ !== 'undefined') {
      $(document).on('shown.bs.modal', '.modal', function() {
        console.log('モーダルが表示されました');
        setTimeout(checkForGuideModal, 300);
      });
    }
    
    // 定期的にチェック
    setInterval(checkForGuideModal, 2000);
  }
  
  // ガイドタイプボタンの設定
  function setupGuideTypeButton() {
    const guideBtn = document.getElementById('guide-type-btn');
    if (guideBtn) {
      console.log('ガイドタイプボタンが見つかりました');
      guideBtn.addEventListener('click', function() {
        console.log('ガイドタイプボタンがクリックされました');
        setTimeout(checkForGuideModal, 500);
      });
    }
  }
  
  // ガイド登録モーダルをチェック
  function checkForGuideModal() {
    console.log('ガイド登録モーダルをチェック中');
    
    // 表示中のモーダルを探す
    const modals = document.querySelectorAll('.modal');
    for (const modal of modals) {
      if (isModalVisible(modal)) {
        const title = modal.querySelector('.modal-title');
        if (title && title.textContent.includes('ガイド登録')) {
          console.log('ガイド登録モーダルが見つかりました');
          insertPhoneSection(modal);
          return;
        }
      }
    }
  }
  
  // モーダルが表示されているかを確認
  function isModalVisible(modal) {
    if (!modal) return false;
    const style = window.getComputedStyle(modal);
    return style.display !== 'none' && style.visibility !== 'hidden' && modal.classList.contains('show');
  }
  
  // 電話番号認証セクションを挿入
  function insertPhoneSection(modal) {
    console.log('電話番号認証セクションを挿入しようとしています');
    
    // モーダルボディを取得
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) return;
    
    // 既に電話認証セクションがあるか確認
    if (modalBody.querySelector('#minimal-phone-section')) {
      console.log('既に電話認証セクションが存在します');
      return;
    }
    
    // 基本情報セクションを探す
    const basicInfoSection = findSectionByText(modalBody, '基本情報');
    
    // 身分証明書セクションを探す
    const idSection = findSectionByText(modalBody, '身分証明書の確認');
    
    // 国籍フィールドも探す（身分証明書セクションの一部）
    const nationalityField = findFieldByLabel(modalBody, '国籍');
    const nationalitySection = nationalityField ? 
                               nationalityField.closest('.mb-4') || 
                               nationalityField.closest('.form-group') || 
                               nationalityField.parentElement : null;
    
    // 電話番号認証セクションのHTML
    const phoneSectionHTML = `
      <div id="minimal-phone-section" class="mb-4">
        <h5 class="form-label fw-bold">電話番号認証</h5>
        <div class="input-group mb-2">
          <span class="input-group-text">+81</span>
          <input type="tel" class="form-control" id="phone-number" placeholder="9012345678（先頭の0は除く）">
          <button class="btn btn-primary" type="button" id="send-code-btn">認証コード送信</button>
        </div>
        <div class="d-flex align-items-center">
          <small class="form-text text-muted me-2">ハイフンなしで入力してください</small>
          <span class="badge bg-secondary">未認証</span>
        </div>
        <div id="verification-code-container" class="d-none mt-3">
          <div class="mb-3">
            <input type="text" class="form-control text-center" id="verification-code" placeholder="認証コード">
            <small class="form-text text-muted text-center mt-1">SMSで送信された6桁のコードを入力してください</small>
            <button type="button" class="btn btn-primary w-100 mt-2" id="verify-code-btn">認証する</button>
          </div>
          <div id="verification-alert" class="alert mt-2 d-none"></div>
        </div>
      </div>
    `;
    
    console.log('基本情報セクション:', basicInfoSection ? 'あり' : 'なし');
    console.log('身分証明書セクション:', idSection ? 'あり' : 'なし');
    console.log('国籍フィールド:', nationalitySection ? 'あり' : 'なし');
    
    // 電話番号認証セクションを作成
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = phoneSectionHTML;
    const phoneSection = tempDiv.firstElementChild;
    
    // 適切な位置に挿入
    if (basicInfoSection && idSection) {
      // 基本情報セクションの後、身分証明書セクションの前に挿入
      console.log('基本情報と身分証明書セクションの間に挿入');
      modalBody.insertBefore(phoneSection, idSection);
    } else if (basicInfoSection && nationalitySection) {
      // 基本情報セクションの後、国籍フィールドの前に挿入
      console.log('基本情報セクションと国籍フィールドの間に挿入');
      modalBody.insertBefore(phoneSection, nationalitySection);
    } else if (basicInfoSection) {
      // 基本情報セクションの後に挿入
      console.log('基本情報セクションの後に挿入');
      insertAfter(phoneSection, basicInfoSection);
    } else if (idSection) {
      // 身分証明書セクションの前に挿入
      console.log('身分証明書セクションの前に挿入');
      modalBody.insertBefore(phoneSection, idSection);
    } else if (nationalitySection) {
      // 国籍フィールドの前に挿入
      console.log('国籍フィールドの前に挿入');
      modalBody.insertBefore(phoneSection, nationalitySection);
    } else {
      // モーダルの先頭に挿入
      console.log('モーダルの先頭に挿入');
      const firstChild = modalBody.firstElementChild;
      if (firstChild) {
        modalBody.insertBefore(phoneSection, firstChild);
      } else {
        modalBody.appendChild(phoneSection);
      }
    }
    
    // 電話番号認証機能をセットアップ
    setupPhoneVerification(modal);
  }
  
  // 要素の後に挿入するヘルパー関数
  function insertAfter(newNode, referenceNode) {
    if (referenceNode.nextSibling) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    } else {
      referenceNode.parentNode.appendChild(newNode);
    }
  }
  
  // テキストでセクションを探す
  function findSectionByText(container, text) {
    // 見出しを探す
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6, .fw-bold');
    for (const heading of headings) {
      if (heading.textContent.trim() === text || heading.textContent.includes(text)) {
        // 親セクションを返す
        return heading.closest('.mb-4') || heading.closest('.form-group') || heading.parentElement;
      }
    }
    return null;
  }
  
  // ラベルからフィールドを探す
  function findFieldByLabel(container, labelText) {
    // ラベルを探す
    const labels = container.querySelectorAll('label, .form-label');
    for (const label of labels) {
      if (label.textContent.trim() === labelText || label.textContent.includes(labelText)) {
        return label;
      }
    }
    return null;
  }
  
  // 電話番号認証機能をセットアップ
  function setupPhoneVerification(modal) {
    console.log('電話番号認証機能をセットアップ');
    
    const phoneInput = modal.querySelector('#phone-number');
    const sendCodeBtn = modal.querySelector('#send-code-btn');
    const codeContainer = modal.querySelector('#verification-code-container');
    const codeInput = modal.querySelector('#verification-code');
    const verifyBtn = modal.querySelector('#verify-code-btn');
    const alertDiv = modal.querySelector('#verification-alert');
    
    if (!phoneInput || !sendCodeBtn || !codeContainer || !codeInput || !verifyBtn) {
      console.error('電話認証に必要な要素が見つかりません');
      return;
    }
    
    // 送信ボタンのイベントリスナー
    sendCodeBtn.addEventListener('click', function() {
      console.log('認証コード送信ボタンがクリックされました');
      
      const phoneNumber = phoneInput.value.trim();
      if (!phoneNumber) {
        showAlert('電話番号を入力してください', 'danger');
        return;
      }
      
      // 送信中表示
      showAlert('認証コードを送信しています...', 'info');
      
      // テスト用コード送信シミュレーション
      setTimeout(function() {
        codeContainer.classList.remove('d-none');
        showAlert('認証コードを送信しました（テスト用コード: 123456）', 'success');
        
        // テスト環境ではコードを自動入力
        codeInput.value = '123456';
      }, 1000);
    });
    
    // 認証ボタンのイベントリスナー
    verifyBtn.addEventListener('click', function() {
      console.log('認証ボタンがクリックされました');
      
      const code = codeInput.value.trim();
      if (!code) {
        showAlert('認証コードを入力してください', 'danger');
        return;
      }
      
      // 認証中表示
      showAlert('認証コードを確認しています...', 'info');
      
      // テスト用認証シミュレーション
      setTimeout(function() {
        if (code === '123456') {
          // 認証成功
          showAlert('電話番号認証が完了しました！', 'success');
          
          // UIを認証済みに更新
          phoneInput.readOnly = true;
          sendCodeBtn.disabled = true;
          sendCodeBtn.textContent = '認証済み';
          
          // 未認証バッジを認証済みに変更
          const badge = modal.querySelector('#minimal-phone-section .badge');
          if (badge) {
            badge.className = 'badge bg-success';
            badge.textContent = '認証済み';
          }
          
          // コード入力欄を非表示
          setTimeout(function() {
            codeContainer.classList.add('d-none');
          }, 2000);
        } else {
          // 認証失敗
          showAlert('認証コードが正しくありません', 'danger');
        }
      }, 1000);
    });
    
    // アラート表示関数
    function showAlert(message, type) {
      console.log('アラート表示:', message, type);
      if (!alertDiv) return;
      
      alertDiv.textContent = message;
      alertDiv.className = `alert alert-${type} mt-2`;
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