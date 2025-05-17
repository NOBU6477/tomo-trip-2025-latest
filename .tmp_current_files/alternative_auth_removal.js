/**
 * 代替手法による電話認証バッジ除去
 * スクリーンショットで表示されている特定の緑ボタンを最後の手段で確実に非表示にする
 */
(function() {
  // 即時実行関数
  function executeNow() {
    // ガイド登録モーダルがある場合のみ処理
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal) return;
    
    console.log('代替手法による電話認証バッジ除去を実行');
    
    // 電話番号認証の文字を含むラベルを検索
    const labels = guideModal.querySelectorAll('label');
    let phoneLabel = null;
    
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        phoneLabel = label;
        break;
      }
    }
    
    if (phoneLabel) {
      // 緑色ボタンを含む親要素を検索
      const parentElement = phoneLabel.closest('.form-group, .row, .mb-3, div');
      
      if (parentElement) {
        // CSS対応
        injectCustomStyles(parentElement);
        
        // JavaScript対応
        removeGreenElements(parentElement);
        
        // DOM構造修正
        replaceAuthenticationSection(parentElement);
      }
    }
    
    // ボタンテキスト内容でも直接検索
    const allButtons = guideModal.querySelectorAll('button, .btn, .badge');
    for (const btn of allButtons) {
      if (btn.textContent && btn.textContent.trim() === '認証済み') {
        console.log('「認証済み」テキストを持つボタンを検出:', btn.tagName, btn.className);
        removeElement(btn);
      }
    }
  }
  
  // カスタムスタイルを注入
  function injectCustomStyles(targetElement) {
    // インラインスタイルを追加
    if (!document.getElementById('auth-badge-fix-style')) {
      const style = document.createElement('style');
      style.id = 'auth-badge-fix-style';
      style.textContent = `
        /* 特定の親要素内の緑色ボタンを強制非表示 */
        #${targetElement.id} .btn-success,
        #${targetElement.id} .badge.bg-success,
        #${targetElement.id} .alert-success,
        #${targetElement.id} button.btn-success,
        #${targetElement.id} [class*="success"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          position: absolute !important;
          overflow: hidden !important;
          pointer-events: none !important;
          max-width: 0 !important;
          max-height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // 緑色要素を削除
  function removeGreenElements(parentElement) {
    // 緑色要素の検索パターン
    const greenSelectors = [
      '.btn-success', 
      '.badge.bg-success', 
      '.alert-success', 
      'button.btn-success', 
      '[class*="success"]'
    ];
    
    // すべてのセレクタで要素を検索して削除
    for (const selector of greenSelectors) {
      try {
        const elements = parentElement.querySelectorAll(selector);
        for (const el of elements) {
          removeElement(el);
        }
      } catch (e) {
        console.error('セレクタエラー:', selector, e);
      }
    }
    
    // テキスト内容でも検索
    const allElements = parentElement.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('認証済')) {
        if (el.classList.contains('btn-success') || 
            el.classList.contains('badge') || 
            el.classList.contains('alert') || 
            el.tagName === 'BUTTON') {
          removeElement(el);
        }
      }
    }
  }
  
  // 認証セクションを置き換え
  function replaceAuthenticationSection(parentElement) {
    // 未表示要素を作成
    const unhiddenElement = document.createElement('span');
    unhiddenElement.className = 'text-muted';
    unhiddenElement.textContent = '未表示';
    unhiddenElement.style.marginLeft = '10px';
    
    // 緑色ボタンを削除して未表示要素を挿入
    const successElements = parentElement.querySelectorAll('.btn-success, .badge.bg-success, .alert-success');
    if (successElements.length > 0) {
      // 最初の緑色要素があった場所に未表示要素を挿入
      const firstElement = successElements[0];
      if (firstElement.parentNode) {
        firstElement.parentNode.insertBefore(unhiddenElement, firstElement);
      }
      
      // 緑色要素を削除
      successElements.forEach(removeElement);
    } else {
      // 緑色要素が見つからない場合は親要素の最後に追加
      parentElement.appendChild(unhiddenElement);
    }
  }
  
  // 要素を完全に削除
  function removeElement(element) {
    if (!element) return;
    
    try {
      // インラインスタイルで非表示
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('height', '0', 'important');
      element.style.setProperty('width', '0', 'important');
      element.style.setProperty('position', 'absolute', 'important');
      element.style.setProperty('overflow', 'hidden', 'important');
      
      // クラスで非表示
      element.classList.add('d-none');
      
      // コンテンツを削除
      element.textContent = '';
      element.innerHTML = '';
      
      // 可能であれば完全に削除
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (e) {
      console.error('要素削除エラー:', e);
    }
  }
  
  // すぐに実行
  executeNow();
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeNow);
  }
  
  // ページ読み込み完了時に実行
  window.addEventListener('load', function() {
    executeNow();
    // 少し遅延させて再度実行
    setTimeout(executeNow, 500);
    setTimeout(executeNow, 1000);
  });
  
  // モーダル表示時にも実行
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'guideRegistrationModal') {
      executeNow();
      // 少し遅延させて再度実行
      setTimeout(executeNow, 100);
      setTimeout(executeNow, 300);
    }
  });
  
  // 定期実行
  setInterval(executeNow, 1000);
})();