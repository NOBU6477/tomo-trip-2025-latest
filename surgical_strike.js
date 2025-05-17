/**
 * 認証済みバッジを完全消去するための外科的精密アプローチ
 * 複数の手法を組み合わせて冗長に実行
 */
(function() {
  // 初期化と実行
  function init() {
    console.log('認証済みバッジ外科的削除: 初期化');
    
    // 即時実行
    executeAllRemovalMethods();
    
    // 遅延実行（DOM完全ロード後）
    setTimeout(executeAllRemovalMethods, 300);
    setTimeout(executeAllRemovalMethods, 1000);
    
    // モーダル表示イベントで実行
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダル表示: バッジ削除実行');
        executeAllRemovalMethods();
        
        // ガイド登録モーダル表示時に複数回実行（タイミング違いで）
        setTimeout(executeAllRemovalMethods, 100);
        setTimeout(executeAllRemovalMethods, 500);
      }
    });
    
    // DOM変更の監視
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // 認証済み要素の特徴を持つ要素が追加された可能性がある
          const targets = document.querySelectorAll('.btn-success, .badge.bg-success, [class*="verified"], [class*="success"]');
          if (targets.length > 0) {
            executeAllRemovalMethods();
            break;
          }
        }
      }
    });
    
    // body全体の変更を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  // すべての削除手法を実行
  function executeAllRemovalMethods() {
    // 1. クラスベースの削除
    removeByClass();
    
    // 2. テキストコンテンツベースの削除
    removeByTextContent();
    
    // 3. 特定のDOMパスに基づく削除
    removeByDOMPath();
    
    // 4. 電話番号認証セクション内のバッジのみを削除
    removePhoneVerificationBadges();
    
    // 5. CSSプロパティによる非表示化
    hideSuccessElementsByCSS();
    
    // 6. データ属性による削除
    removeByDataAttributes();
  }
  
  // 1. クラスベースの削除
  function removeByClass() {
    const selectors = [
      '.btn-success',
      '.badge.bg-success',
      '.badge-success',
      '[class*="verified"]',
      '[class*="verification-success"]',
      '[class*="phone-verified"]',
      '[class*="auth-success"]'
    ];
    
    // セレクタに一致する要素を取得して処理
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element.textContent && element.textContent.trim() === '認証済み') {
          console.log('クラスベース削除:', element);
          removeElement(element);
        }
      });
    });
  }
  
  // 2. テキストコンテンツベースの削除
  function removeByTextContent() {
    // ドキュメント内のすべての要素を走査
    const allElements = document.querySelectorAll('*');
    
    for (const element of allElements) {
      // ノードタイプが要素で、かつテキストが「認証済み」に一致
      if (element.nodeType === 1 && 
          element.textContent && 
          element.textContent.trim() === '認証済み') {
        // スキップすべき要素（モーダル内のプロンプトなど）
        const skipParents = ['#phoneVerificationModal'];
        let shouldSkip = false;
        
        // スキップすべき親要素をチェック
        for (const selector of skipParents) {
          if (element.closest(selector)) {
            shouldSkip = true;
            break;
          }
        }
        
        if (!shouldSkip) {
          console.log('テキストベース削除:', element);
          removeElement(element);
        }
      }
    }
  }
  
  // 3. 特定のDOMパスに基づく削除
  function removeByDOMPath() {
    // ガイド登録モーダル内の特定パスの要素
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal) return;
    
    // 電話番号認証セクションを探す
    const labels = modal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // 親セクションを取得
        const section = label.closest('.form-group, .mb-3, .row') || label.parentElement;
        
        // セクション内の緑色ボタンやバッジを探す
        const successElements = section.querySelectorAll('.btn, .badge, button, span');
        for (const element of successElements) {
          if (element.textContent && element.textContent.trim() === '認証済み') {
            console.log('DOMパス削除:', element);
            removeElement(element);
          }
        }
      }
    }
  }
  
  // 4. 電話番号認証セクション内のバッジのみを削除
  function removePhoneVerificationBadges() {
    // ガイド登録モーダルを取得
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal) return;
    
    // 電話番号認証セクションを探す
    const phoneSection = findPhoneVerificationSection(guideModal);
    if (!phoneSection) return;
    
    // セクション内のすべての子要素を検査
    const allChildren = phoneSection.querySelectorAll('*');
    for (const child of allChildren) {
      // 認証済みテキストを持つ要素を削除
      if (child.textContent && child.textContent.trim() === '認証済み') {
        console.log('電話セクション内バッジ削除:', child);
        removeElement(child);
      }
    }
  }
  
  // 5. CSSプロパティによる非表示化
  function hideSuccessElementsByCSS() {
    // 認証済みテキストを持つ要素を探す
    const allElements = document.querySelectorAll('*');
    
    for (const element of allElements) {
      if (element.textContent && element.textContent.trim() === '認証済み') {
        console.log('CSS非表示:', element);
        
        // スタイルを使って完全に非表示化
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.height = '0';
        element.style.width = '0';
        element.style.overflow = 'hidden';
        element.style.padding = '0';
        element.style.margin = '0';
        element.style.border = 'none';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        element.style.zIndex = '-9999';
      }
    }
  }
  
  // 6. データ属性による削除
  function removeByDataAttributes() {
    // データ属性を持つ要素を探す
    const dataElements = document.querySelectorAll('[data-verification], [data-verified], [data-authentication]');
    
    for (const element of dataElements) {
      if (element.textContent && element.textContent.trim() === '認証済み') {
        console.log('データ属性ベース削除:', element);
        removeElement(element);
      }
    }
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSection(container) {
    // ラベルから探す
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        return label.closest('.form-group, .row, .mb-3') || label.parentElement;
      }
    }
    
    // テキストで探す（バックアップ）
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証') && el.nodeType === 1) {
        return el.closest('.form-group, .row, .mb-3') || el.parentElement;
      }
    }
    
    return null;
  }
  
  // 要素を削除（複数の手段を試行）
  function removeElement(element) {
    if (!element) return;
    
    try {
      // 1. クラスで非表示
      element.classList.add('d-none');
      
      // 2. スタイルで非表示
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      
      // 3. コンテンツをクリア
      const originalContent = element.textContent;
      element.textContent = '';
      
      // 4. 要素を実際に削除
      if (element.parentElement) {
        element.parentElement.removeChild(element);
      }
      
      console.log('要素を削除:', originalContent);
    } catch (error) {
      console.error('要素削除エラー:', error);
    }
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