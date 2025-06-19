/**
 * 電話番号認証ボタンの直接特定と削除
 * 特にスクリーンショットに表示される緑色ボタンに特化
 */
(function() {
  // 初期化
  function init() {
    console.log('認証ボタン直接削除: 初期化');
    
    // モーダル表示イベントの監視
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダル表示: 認証ボタン探索を実行');
        
        // モーダル表示直後と遅延実行（レンダリングのタイミング差に対応）
        removeAuthBadge();
        setTimeout(removeAuthBadge, 300);
        setTimeout(removeAuthBadge, 800);
      }
    });
    
    // DOM変更の監視
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        // 要素の追加を監視
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // ガイド登録モーダルが表示されている場合のみ処理
          const modal = document.getElementById('guideRegistrationModal');
          if (modal && isModalVisible(modal)) {
            removeAuthBadge();
          }
        }
      }
    });
    
    // 監視開始
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 初期実行と定期実行
    removeAuthBadge();
    setInterval(removeAuthBadge, 2000); // バックアップとして2秒ごとに実行
  }
  
  // 認証バッジを削除
  function removeAuthBadge() {
    // ガイド登録モーダル内のすべての緑色ボタンを探す
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal || !isModalVisible(modal)) return;
    
    // 認証済みボタンの可能性がある要素
    const candidates = [
      // クラスで検索
      ...modal.querySelectorAll('.btn-success'),
      ...modal.querySelectorAll('.badge.bg-success'),
      ...modal.querySelectorAll('.alert-success'),
      ...modal.querySelectorAll('[class*="success"]'),
      
      // テキスト内容で検索
      ...Array.from(modal.querySelectorAll('button, span, div')).filter(el => 
        el.textContent && 
        el.textContent.trim() === '認証済み'
      )
    ];
    
    // 重複排除
    const uniqueCandidates = [...new Set(candidates)];
    
    // 各候補を処理
    let removed = false;
    
    for (const element of uniqueCandidates) {
      // テキスト内容と表示状態をチェック
      if (element.textContent && 
          element.textContent.trim() === '認証済み' && 
          isElementVisible(element)) {
        
        console.log('「認証済み」バッジを発見:', element.tagName, element.className);
        
        // 非表示要素の作成
        const unverifiedText = document.createElement('span');
        unverifiedText.className = 'text-muted ms-2';
        unverifiedText.textContent = '未表示';
        
        // 要素の置換
        if (element.parentElement) {
          element.parentElement.insertBefore(unverifiedText, element);
          element.parentElement.removeChild(element);
          removed = true;
          console.log('「認証済み」バッジを削除し、「未表示」テキストを挿入しました');
        }
      }
    }
    
    if (!removed) {
      // 電話番号認証セクションを直接探す
      const phoneSection = findPhoneVerificationSection(modal);
      if (phoneSection) {
        const successElements = phoneSection.querySelectorAll('.btn-success, .badge.bg-success, .alert-success');
        for (const element of successElements) {
          hideElement(element);
          console.log('電話認証セクション内の緑色要素を非表示化:', element.tagName, element.className);
        }
      }
    }
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSection(modal) {
    // ラベルから探す
    const labels = modal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // ラベルの親フォームグループを返す
        return label.closest('.form-group, .row, .mb-3') || label.parentElement;
      }
    }
    
    // テキストノードから探す
    return findElementContainingText(modal, '電話番号認証');
  }
  
  // テキストを含む要素を探す
  function findElementContainingText(root, text) {
    const walker = document.createTreeWalker(
      root, 
      NodeFilter.SHOW_TEXT, 
      { 
        acceptNode: function(node) {
          return node.textContent.includes(text) ? 
            NodeFilter.FILTER_ACCEPT : 
            NodeFilter.FILTER_SKIP;
        } 
      }
    );
    
    const textNode = walker.nextNode();
    if (textNode) {
      // 親要素を返す
      let element = textNode.parentElement;
      
      // フォームグループを探す
      return element.closest('.form-group, .row, .mb-3') || element;
    }
    
    return null;
  }
  
  // 要素を非表示にする
  function hideElement(element) {
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.classList.add('d-none');
    element.setAttribute('aria-hidden', 'true');
  }
  
  // 要素が表示されているかチェック
  function isElementVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           !element.classList.contains('d-none');
  }
  
  // モーダルが表示されているかチェック
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
  }
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ウィンドウ読み込み完了時にも実行
  window.addEventListener('load', init);
})();