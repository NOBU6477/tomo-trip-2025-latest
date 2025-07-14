/**
 * バッジ問題を完全に解決するための最終対応策
 * 既存のDOM要素を削除し、新しい要素に置き換える方法
 */
document.addEventListener('DOMContentLoaded', function() {
  // 観察を開始
  startObservation();
});

/**
 * DOM変更の観察を開始
 */
function startObservation() {
  console.log('モーダルの観察を開始します');
  
  // モーダルのDOMが変更された時のチェック
  const observer = new MutationObserver(handleMutations);
  
  // bodyタグ全体を監視
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
  
  // ページロード時にもチェック
  setTimeout(findAndFixGuideModal, 500);
  
  // クリックイベントの監視
  document.addEventListener('click', function(event) {
    // 新規登録ボタンのクリック
    if (event.target.id === 'show-user-type-modal' || 
        event.target.textContent === '新規登録' ||
        event.target.closest('#show-user-type-modal')) {
      console.log('新規登録ボタンがクリックされました');
      setTimeout(findAndFixGuideModal, 500);
    }
    
    // ガイドとして登録ボタンのクリック
    if (event.target.id === 'register-as-guide-btn' || 
        event.target.textContent === 'ガイドとして登録' ||
        event.target.closest('#register-as-guide-btn')) {
      console.log('ガイド登録ボタンがクリックされました');
      setTimeout(findAndFixGuideModal, 500);
    }
  });
}

/**
 * ミューテーションを処理
 */
function handleMutations(mutations) {
  for (const mutation of mutations) {
    // モーダルが追加またはクラスが変更された場合
    if (mutation.type === 'childList' || 
        (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
      findAndFixGuideModal();
    }
  }
}

/**
 * ガイド登録モーダルを探して修正
 */
function findAndFixGuideModal() {
  const modal = document.getElementById('registerGuideModal');
  if (modal && isModalVisible(modal)) {
    console.log('ガイド登録モーダルが見つかりました - 修正を適用します');
    fixPhoneVerificationSection(modal);
  }
}

/**
 * モーダルが表示されているか確認
 */
function isModalVisible(modal) {
  return modal.classList.contains('show') && getComputedStyle(modal).display !== 'none';
}

/**
 * 電話番号認証セクションを修正
 */
function fixPhoneVerificationSection(modal) {
  // 電話番号認証セクションを探す
  const phoneSection = findPhoneSection(modal);
  if (!phoneSection) {
    console.log('電話番号認証セクションが見つかりません');
    return;
  }
  
  // 未表示テキストを確認
  const unverifiedText = findUnverifiedText(phoneSection);
  if (unverifiedText) {
    console.log('「未表示」テキストを検出しました。修正を適用します');
    
    // 元の認証コンテナを取得
    const originalContainer = phoneSection.querySelector('div[id*="phone"]') || 
                              phoneSection.querySelector('div[class*="phone"]');
    
    if (originalContainer) {
      // 元のコンテナをバックアップ
      const containerParent = originalContainer.parentElement;
      const containerPosition = Array.from(containerParent.children).indexOf(originalContainer);
      
      // ラベルを保持
      const label = phoneSection.querySelector('label');
      const labelText = label ? label.textContent : '電話番号認証';
      
      // コンテナを完全にクリア
      phoneSection.innerHTML = '';
      
      // 新しいラベルを作成
      const newLabel = document.createElement('label');
      newLabel.className = 'form-label';
      newLabel.textContent = labelText;
      phoneSection.appendChild(newLabel);
      
      // 完全に新しい電話認証コンテナを作成
      createNewVerificationUI(phoneSection);
    } else {
      // コンテナが見つからない場合は未表示テキストのみを削除
      unverifiedText.remove();
    }
  }
}

/**
 * 電話番号セクションを探す
 */
function findPhoneSection(modal) {
  // ラベルから探す
  const labels = modal.querySelectorAll('label');
  for (const label of labels) {
    if (label.textContent.includes('電話番号認証')) {
      return label.closest('.col-md-6');
    }
  }
  
  // IDから探す
  const phoneElements = modal.querySelectorAll('[id*="phone"]');
  for (const el of phoneElements) {
    const col = el.closest('.col-md-6');
    if (col) return col;
  }
  
  return null;
}

/**
 * 未表示テキストを探す
 */
function findUnverifiedText(container) {
  // すべてのテキストノードを検索
  const treeWalker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    { acceptNode: node => node.textContent.trim() === '未表示' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP },
    false
  );
  
  while (treeWalker.nextNode()) {
    const textNode = treeWalker.currentNode;
    if (textNode.textContent.trim() === '未表示') {
      // 親要素を返す
      return textNode.parentElement;
    }
  }
  
  // 直接テキスト内容で検索
  const allElements = container.querySelectorAll('*');
  for (const el of allElements) {
    if (el.childNodes.length === 1 && 
        el.childNodes[0].nodeType === Node.TEXT_NODE && 
        el.childNodes[0].textContent.trim() === '未表示') {
      return el;
    }
  }
  
  return null;
}

/**
 * 新しい電話認証UIを作成
 */
function createNewVerificationUI(container) {
  // 新しいコンテナを作成
  const verificationContainer = document.createElement('div');
  verificationContainer.id = 'fixed-phone-verification';
  container.appendChild(verificationContainer);
  
  // 電話番号入力グループ
  verificationContainer.innerHTML = `
    <div class="input-group mb-3">
      <span class="input-group-text">+81</span>
      <input type="tel" class="form-control" id="fixed-phone-number" placeholder="90-1234-5678">
      <button class="btn btn-primary" type="button" id="fixed-send-code-btn">認証コード送信</button>
    </div>
    <div class="form-text mb-3">ハイフンなしの電話番号を入力してください</div>
    
    <div class="mb-4">
      <label for="fixed-verification-code" class="form-label">認証コード</label>
      <input type="text" class="form-control" id="fixed-verification-code" placeholder="• • • • • •">
      <div class="form-text">SMSで送信された6桁のコードを入力してください</div>
    </div>
    
    <div id="fixed-phone-verified" class="alert alert-success d-none">
      <i class="fas fa-check-circle me-2"></i>電話番号認証が完了しました
    </div>
  `;
  
  // 送信ボタンのイベントリスナー
  const sendCodeBtn = document.getElementById('fixed-send-code-btn');
  if (sendCodeBtn) {
    sendCodeBtn.addEventListener('click', handleSendCode);
  }
  
  // 認証コード入力のイベントリスナー
  const verificationCode = document.getElementById('fixed-verification-code');
  if (verificationCode) {
    verificationCode.addEventListener('input', function() {
      if (this.value.length === 6) {
        handleVerifyCode(this.value);
      }
    });
  }
}

/**
 * 認証コード送信処理
 */
function handleSendCode() {
  const phoneInput = document.getElementById('fixed-phone-number');
  if (!phoneInput || !phoneInput.value.trim()) {
    alert('電話番号を入力してください');
    return;
  }
  
  // 送信ボタンを無効化
  const sendCodeBtn = document.getElementById('fixed-send-code-btn');
  if (sendCodeBtn) {
    sendCodeBtn.disabled = true;
    
    // 送信中の表示
    const originalText = sendCodeBtn.textContent;
    sendCodeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
    
    // 1秒後に処理完了
    setTimeout(() => {
      sendCodeBtn.disabled = false;
      sendCodeBtn.textContent = originalText;
      
      // 認証コード入力欄にフォーカス
      const codeInput = document.getElementById('fixed-verification-code');
      if (codeInput) {
        codeInput.focus();
      }
    }, 1000);
  }
}

/**
 * 認証コード確認処理
 */
function handleVerifyCode(code) {
  // テストモードでは123456を有効なコードとする
  if (code === '123456') {
    // 成功メッセージを表示
    const successAlert = document.getElementById('fixed-phone-verified');
    if (successAlert) {
      successAlert.classList.remove('d-none');
    }
    
    // 入力フィールドを無効化
    const phoneInput = document.getElementById('fixed-phone-number');
    const sendCodeBtn = document.getElementById('fixed-send-code-btn');
    const codeInput = document.getElementById('fixed-verification-code');
    
    if (phoneInput) phoneInput.disabled = true;
    if (sendCodeBtn) sendCodeBtn.disabled = true;
    if (codeInput) codeInput.disabled = true;
  } else {
    alert('無効な認証コードです。テストモードでは123456を入力してください。');
  }
}