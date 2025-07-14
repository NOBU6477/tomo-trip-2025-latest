/**
 * 認証ボタンセレクタオーバーライド
 * 緑色の認証済みボタンを非表示にするための最終手段
 */
(function() {
  // ページロード時または遅延して実行
  function init() {
    applyOverrides();
    
    // モーダル表示時にも実行
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        setTimeout(applyOverrides, 100);
      }
    });
    
    // DOM変更監視
    watchDOMChanges();
  }
  
  // 特定セレクタの要素を探し、非表示にする
  function applyOverrides() {
    // スクリーンショットの特定の緑色ボタンをターゲット
    const selectors = [
      'button.btn.btn-success.authentication-badge',
      'button.btn.btn-success',
      '.badge.bg-success',
      '.alert-success',
      '[id*="verified"]',
      '.authentication-badge',
      // 電話認証セクション
      'label:contains("電話番号認証") ~ div button.btn-success',
      'label:contains("電話番号認証") ~ div .badge.bg-success',
      'label:contains("電話番号認証") ~ div .alert-success',
      'label:contains("電話番号認証") ~ div [id*="verified"]',
      '[class*="phone"] button.btn-success',
      '[class*="phone"] .badge.bg-success',
      '[id*="phone"] button.btn-success',
      '[id*="phone"] .badge.bg-success'
    ];
    
    // すべてのセレクタを適用
    for (const selector of selectors) {
      try {
        // 特殊セレクタを含む場合は別処理
        if (selector.includes(':contains')) {
          handleSpecialSelector(selector);
        } else {
          document.querySelectorAll(selector).forEach(removeElement);
        }
      } catch (e) {
        console.error('セレクタエラー:', selector, e);
      }
    }
    
    // ガイド登録モーダル内の要素を特別に処理
    const guideModal = document.getElementById('guideRegistrationModal');
    if (guideModal) {
      handleGuideModal(guideModal);
    }
    
    // 電話番号認証ラベルの周辺要素を検索
    handlePhoneVerificationArea();
  }
  
  // :contains擬似セレクタを含むセレクタを処理
  function handleSpecialSelector(selector) {
    if (selector.includes('label:contains("電話番号認証")')) {
      // ラベルを見つける
      document.querySelectorAll('label').forEach(function(label) {
        if (label.textContent && label.textContent.includes('電話番号認証')) {
          // セレクタの残りの部分を解析
          const parts = selector.split('~');
          if (parts.length > 1) {
            // 兄弟要素を探す
            let sibling = label.nextElementSibling;
            while (sibling) {
              // 兄弟要素内でターゲットを探す
              const targetSelector = parts[1].trim();
              sibling.querySelectorAll(targetSelector).forEach(removeElement);
              sibling = sibling.nextElementSibling;
            }
            
            // 親要素内でも探す
            const parent = label.parentElement;
            if (parent) {
              parent.querySelectorAll(targetSelector).forEach(removeElement);
            }
          }
        }
      });
    }
  }
  
  // ガイド登録モーダル内の要素を特別に処理
  function handleGuideModal(modal) {
    // すべての緑色要素を探す
    modal.querySelectorAll('.btn-success, .badge.bg-success, .alert-success, [id*="verified"], .authentication-badge').forEach(removeElement);
    
    // 電話番号認証セクションを特定
    modal.querySelectorAll('label').forEach(function(label) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // ラベルの親要素内のすべての緑色要素を探す
        const section = label.closest('.row, .form-group, div');
        if (section) {
          section.querySelectorAll('.btn-success, .badge.bg-success, .alert-success, [id*="verified"], .authentication-badge').forEach(removeElement);
        }
      }
    });
    
    // スクリプトでの認証状態を維持するための隠し入力
    createHiddenVerificationInput(modal);
  }
  
  // 電話番号認証エリアを処理
  function handlePhoneVerificationArea() {
    document.querySelectorAll('label').forEach(function(label) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // ラベルが含まれる行または親要素を探す
        const row = label.closest('.row, .form-group, div');
        if (row) {
          // この行内のすべての緑色ボタンを非表示
          row.querySelectorAll('.btn-success, .badge.bg-success, .alert-success, [id*="verified"], .authentication-badge').forEach(removeElement);
          
          // 周辺要素も確認
          const parent = row.parentElement;
          if (parent) {
            parent.querySelectorAll('.btn-success, .badge.bg-success, .alert-success, [id*="verified"], .authentication-badge').forEach(function(element) {
              if (isInOrNearElement(element, row)) {
                removeElement(element);
              }
            });
          }
        }
      }
    });
  }
  
  // 要素が他の要素の周辺にあるかチェック
  function isInOrNearElement(element, targetElement) {
    // 同じ要素内かチェック
    if (targetElement.contains(element)) {
      return true;
    }
    
    // 周辺要素かチェック
    let current = element;
    let distance = 0;
    const maxDistance = 3; // 最大階層距離
    
    while (current && distance < maxDistance) {
      current = current.parentElement;
      if (current === targetElement) {
        return true;
      }
      distance++;
    }
    
    return false;
  }
  
  // 認証状態を維持するための隠し入力を作成
  function createHiddenVerificationInput(container) {
    // 既存の隠し入力がないか確認
    if (container.querySelector('input[data-auth-hidden="true"]')) {
      return;
    }
    
    // 隠し入力を作成
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'phoneVerified';
    input.value = 'true';
    input.setAttribute('data-auth-hidden', 'true');
    
    // コンテナに追加
    container.appendChild(input);
    console.log('認証状態維持用の隠し入力を作成');
  }
  
  // 要素を非表示にする
  function removeElement(element) {
    if (!element) return;
    
    // まず非表示
    element.style.setProperty('display', 'none', 'important');
    element.style.setProperty('visibility', 'hidden', 'important');
    element.style.setProperty('opacity', '0', 'important');
    element.style.setProperty('height', '0', 'important');
    element.style.setProperty('width', '0', 'important');
    element.style.setProperty('overflow', 'hidden', 'important');
    element.style.setProperty('position', 'absolute', 'important');
    element.style.setProperty('pointer-events', 'none', 'important');
    element.classList.add('d-none');
    
    // 内容も空に
    element.textContent = '';
    element.innerHTML = '';
    
    // 可能であれば削除
    try {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (e) {
      console.log('要素削除エラー:', e);
    }
  }
  
  // DOM変更を監視
  function watchDOMChanges() {
    const observer = new MutationObserver(function(mutations) {
      let shouldProcess = false;
      
      for (const mutation of mutations) {
        // 新しい要素が追加された場合
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // 要素ノードかチェック
              if (isAuthElement(node)) {
                shouldProcess = true;
                break;
              }
            }
          }
        }
        // 属性が変更された場合
        else if (mutation.type === 'attributes') {
          if (isAuthElement(mutation.target)) {
            shouldProcess = true;
            break;
          }
        }
      }
      
      if (shouldProcess) {
        applyOverrides();
      }
    });
    
    // ドキュメント全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'id']
    });
  }
  
  // 認証関連要素かどうかを判定
  function isAuthElement(element) {
    if (!element || element.nodeType !== 1) return false; // 要素ノードでない場合
    
    // クラスやIDで判定
    if (element.classList && 
        (element.classList.contains('btn-success') || 
         element.classList.contains('badge') || 
         element.classList.contains('authentication-badge') || 
         element.classList.contains('alert-success'))) {
      return true;
    }
    
    if (element.id && element.id.includes('verified')) {
      return true;
    }
    
    // テキストで判定
    if (element.textContent && 
        (element.textContent.includes('認証済') || 
         element.textContent.includes('済み'))) {
      return true;
    }
    
    return false;
  }
  
  // DOMの準備ができたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ページロード後にも実行
  window.addEventListener('load', function() {
    init();
    setTimeout(applyOverrides, 500);
    setTimeout(applyOverrides, 1000);
  });
})();