/**
 * モーダル観察と特定要素除去スクリプト
 * 他のスクリプトとは独立して動作し、確実に問題の要素を特定・除去
 */
(function() {
  // 対象となる緑色ボタンの特性
  const TARGET_PROPS = {
    tagName: 'BUTTON',
    className: 'btn-success',
    text: '認証済み',
    parentSection: '電話番号認証'
  };
  
  // 初期化処理
  function init() {
    console.log("モーダル観察スクリプト: 初期化");
    
    // 即時実行
    processModals();
    
    // モーダル表示イベントをリッスン
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log("ガイド登録モーダルが表示されました");
        setTimeout(processModals, 0);
        setTimeout(processModals, 100);
        setTimeout(processModals, 300);
      }
    });
    
    // DOM変更を監視
    setupMutationObserver();
    
    // 定期的に検証
    setInterval(processModals, 1000);
  }
  
  // モーダル処理
  function processModals() {
    // ガイド登録モーダルを探す
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal) return;
    
    // 電話番号認証セクションを特定
    const phoneSection = findPhoneVerificationSection(guideModal);
    if (!phoneSection) {
      console.log("電話番号認証セクションが見つかりません");
      return;
    }
    
    // 緑色の認証済みボタンを特定して処理
    const verifiedButton = findVerifiedButton(phoneSection);
    if (verifiedButton) {
      console.log("認証済みボタンを発見:", verifiedButton.textContent.trim());
      replaceWithNonVerifiedText(verifiedButton);
    }
  }
  
  // 電話番号認証セクションを見つける
  function findPhoneVerificationSection(modal) {
    // まず、ラベルから見つける
    const labels = modal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        const section = findParentElement(label, '.form-group, .row, div.mb-3');
        if (section) return section;
        
        // 親要素がない場合、周囲の要素から探す
        let parent = label.parentElement;
        while (parent && parent !== modal) {
          if (parent.tagName === 'DIV') return parent;
          parent = parent.parentElement;
        }
        return label.parentElement;
      }
    }
    
    // ラベル以外のテキストノードからも探す
    return findElementContainingText(modal, '電話番号認証');
  }
  
  // 指定したセクション内の認証済みボタンを見つける
  function findVerifiedButton(section) {
    // 緑色ボタンを探す
    const buttons = section.querySelectorAll('button.btn-success, .btn.btn-success, .badge.bg-success');
    
    // 認証済みというテキストを含むボタンを優先
    for (const button of buttons) {
      if (button.textContent && 
          (button.textContent.trim() === '認証済み' || 
           button.textContent.includes('認証済'))) {
        return button;
      }
    }
    
    // テキストが一致しない場合でも、緑色ボタンがあれば返す
    if (buttons.length > 0) {
      return buttons[0];
    }
    
    return null;
  }
  
  // 認証済みボタンを未表示テキストに置き換える
  function replaceWithNonVerifiedText(button) {
    // ボタンの親要素を取得
    const parent = button.parentElement;
    if (!parent) return;
    
    // 未表示要素がすでに存在するか確認
    let nonVerifiedElement = null;
    const siblings = parent.childNodes;
    
    for (const node of siblings) {
      if (node.nodeType === 1 && // 要素ノード
          node.textContent && 
          node.textContent.trim() === '未表示') {
        nonVerifiedElement = node;
        break;
      }
    }
    
    // 未表示テキストが見つかった場合は表示
    if (nonVerifiedElement) {
      nonVerifiedElement.style.display = 'inline-block';
      nonVerifiedElement.classList.remove('d-none');
    } else {
      // 見つからない場合は新規作成
      nonVerifiedElement = document.createElement('span');
      nonVerifiedElement.className = 'text-muted ms-2';
      nonVerifiedElement.textContent = '未表示';
      
      // ボタンの後に挿入
      if (button.nextSibling) {
        parent.insertBefore(nonVerifiedElement, button.nextSibling);
      } else {
        parent.appendChild(nonVerifiedElement);
      }
    }
    
    // ボタンを非表示
    button.style.display = 'none';
    button.style.visibility = 'hidden';
    button.classList.add('d-none');
    
    // 可能であればDOM自体から削除
    try {
      parent.removeChild(button);
    } catch (e) {
      console.error('ボタン削除エラー:', e);
    }
  }
  
  // 親要素を特定のセレクタで検索
  function findParentElement(element, selector) {
    return element.closest(selector);
  }
  
  // テキストを含む要素を再帰的に探す
  function findElementContainingText(rootElement, searchText) {
    // テキストノードを確認
    if (rootElement.nodeType === 3 && rootElement.textContent.includes(searchText)) {
      return rootElement.parentElement;
    }
    
    // 自身のテキスト内容を確認
    if (rootElement.textContent && rootElement.textContent.includes(searchText)) {
      // 直接のテキストノードを含むか確認
      for (const child of rootElement.childNodes) {
        if (child.nodeType === 3 && child.textContent.includes(searchText)) {
          return rootElement;
        }
      }
    }
    
    // 子要素を再帰的に探索
    for (const child of rootElement.children) {
      const result = findElementContainingText(child, searchText);
      if (result) return result;
    }
    
    return null;
  }
  
  // DOM変更の監視
  function setupMutationObserver() {
    // 監視設定
    const config = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    };
    
    // コールバック関数
    const callback = function(mutationsList, observer) {
      let shouldProcess = false;
      
      for (const mutation of mutationsList) {
        // ガイド登録モーダル内の変更のみを対象
        const guideModal = document.getElementById('guideRegistrationModal');
        if (!guideModal) continue;
        
        if (mutation.type === 'childList') {
          // 新しい子要素が追加された場合
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // 要素ノード
              // 緑色ボタンまたはその親要素が追加された場合
              if ((node.classList && node.classList.contains('btn-success')) ||
                  (node.textContent && node.textContent.includes('認証済'))) {
                shouldProcess = true;
                break;
              }
            }
          }
        } else if (mutation.type === 'attributes') {
          // 属性が変更された場合
          const target = mutation.target;
          // クラスが変わった場合
          if (mutation.attributeName === 'class') {
            if (target.classList && target.classList.contains('btn-success')) {
              shouldProcess = true;
              break;
            }
          }
          // スタイルが変わった場合
          else if (mutation.attributeName === 'style') {
            if (target.style && target.style.display === 'block' && 
                target.textContent && target.textContent.includes('認証済')) {
              shouldProcess = true;
              break;
            }
          }
        }
      }
      
      if (shouldProcess) {
        processModals();
      }
    };
    
    // オブザーバーを作成して監視開始
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
  }
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ウィンドウ読み込み完了時にも実行
  window.addEventListener('load', function() {
    init();
    setTimeout(processModals, 500);
  });
})();