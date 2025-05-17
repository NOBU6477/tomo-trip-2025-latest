/**
 * DOM深層解析ツール
 * ガイド登録モーダル内の問題要素を徹底的に検出して除去
 */
(function() {
  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM深層解析ツールを初期化');
    // モーダル表示を監視
    monitorModalVisibility();
    // DOM変更を監視（document.bodyが存在する場合のみ）
    if (document.body) {
      observeDOMChanges();
    } else {
      // bodyが読み込まれるのを待つ
      document.addEventListener('load', observeDOMChanges);
    }
  });
  
  // ガイド登録モーダルの表示を監視
  function monitorModalVisibility() {
    // グローバルクリックイベントを監視
    document.addEventListener('click', function(event) {
      // 新規登録ボタンのクリック
      if (event.target.id === 'show-user-type-modal' || 
          event.target.textContent === '新規登録' ||
          (event.target.parentElement && event.target.parentElement.id === 'show-user-type-modal')) {
        setTimeout(inspectGuideModal, 500);
      }
      
      // ガイド登録ボタンのクリック
      if (event.target.id === 'register-as-guide-btn' ||
          event.target.textContent === 'ガイドとして登録' ||
          (event.target.parentElement && event.target.parentElement.id === 'register-as-guide-btn')) {
        setTimeout(inspectGuideModal, 500);
      }
    });
    
    // 初期ロード時にもチェック
    setTimeout(inspectGuideModal, 1000);
  }
  
  // DOM変更を観察
  function observeDOMChanges() {
    try {
      const observer = new MutationObserver(function(mutations) {
        // モーダルが表示された可能性がある場合、検査を実行
        let shouldInspect = false;
        
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' || 
              (mutation.type === 'attributes' && 
               (mutation.attributeName === 'class' || mutation.attributeName === 'style'))) {
            shouldInspect = true;
          }
        });
        
        if (shouldInspect) {
          inspectGuideModal();
        }
      });
      
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style', 'display']
        });
        console.log('DOM観察を開始しました');
      } else {
        console.warn('document.bodyがまだ読み込まれていません');
      }
    } catch (error) {
      console.error('DOM観察の設定中にエラーが発生しました:', error);
    }
  }
  
  // ガイド登録モーダルを検査して問題を修正
  function inspectGuideModal() {
    const modal = document.getElementById('registerGuideModal');
    if (!modal || !isModalVisible(modal)) return;
    
    console.log('ガイド登録モーダルを検出して詳細検査を実行します');
    
    // 電話番号認証セクションを探して深層解析
    const phoneSection = findPhoneSection(modal);
    if (phoneSection) {
      console.log('電話番号認証セクションを発見:', phoneSection);
      
      // 「未表示」テキストを検出して削除
      removeUnverifiedTexts(phoneSection);
      
      // 認証状態に対応したUIの整合性を確保
      ensureVerificationStateConsistency(phoneSection);
    }
    
    // モーダル全体から「未表示」テキストを除去
    removeAllUnverifiedTextsFromModal(modal);
  }
  
  // 電話番号認証セクションを探す
  function findPhoneSection(modal) {
    // 方法1: ラベルテキストで検索
    const labels = modal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        return label.closest('.col-md-6');
      }
    }
    
    // 方法2: ID属性で検索
    const phoneElements = modal.querySelectorAll('[id*="phone"]');
    for (const el of phoneElements) {
      const section = el.closest('.col-md-6');
      if (section) return section;
    }
    
    // 方法3: 特定の構造パターンで検索
    const allCols = modal.querySelectorAll('.col-md-6');
    for (const col of allCols) {
      const text = col.textContent.toLowerCase();
      if (text.includes('電話') && text.includes('認証')) {
        return col;
      }
    }
    
    return null;
  }
  
  // 「未表示」テキストを削除
  function removeUnverifiedTexts(container) {
    // すべてのテキストノードを走査
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const nodesToProcess = [];
    let node;
    
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.trim() === '未表示') {
        nodesToProcess.push(node);
      }
    }
    
    // 検出したテキストノードを処理
    nodesToProcess.forEach(function(textNode) {
      console.log('「未表示」テキストを検出:', textNode);
      
      // 親要素が他の要素を持たない場合は親要素ごと削除
      if (textNode.parentNode && textNode.parentNode.childNodes.length === 1) {
        console.log('親要素ごと非表示にします:', textNode.parentNode);
        textNode.parentNode.style.display = 'none';
        textNode.parentNode.style.visibility = 'hidden';
        textNode.parentNode.style.position = 'absolute';
        textNode.parentNode.style.pointerEvents = 'none';
      } else {
        // テキストノードのみを空にする
        textNode.textContent = '';
      }
    });
  }
  
  // 認証状態の一貫性を確保
  function ensureVerificationStateConsistency(container) {
    // 認証済みバッジを探す
    const successBadges = container.querySelectorAll('.badge.bg-success, [class*="badge"][class*="success"]');
    const verifiedAlerts = container.querySelectorAll('.alert.alert-success, [id*="verified"]');
    
    // 認証成功表示を確認
    let isVerified = false;
    
    verifiedAlerts.forEach(function(alert) {
      if (alert.textContent.includes('完了') || 
          alert.textContent.includes('認証済み') || 
          !alert.classList.contains('d-none')) {
        isVerified = true;
        
        // 確実に表示
        alert.classList.remove('d-none');
        alert.style.display = 'block';
        alert.style.visibility = 'visible';
      }
    });
    
    // 認証バッジの表示状態を制御
    successBadges.forEach(function(badge) {
      if (isVerified) {
        // 認証済みの場合は表示
        badge.classList.remove('d-none');
        badge.style.display = 'inline-block';
        badge.style.visibility = 'visible';
      } else {
        // 未認証の場合は非表示
        badge.classList.add('d-none');
        badge.style.display = 'none';
      }
    });
    
    // 「未表示」テキストを持つ要素を非表示
    if (isVerified) {
      const allElements = container.querySelectorAll('*');
      allElements.forEach(function(el) {
        if (el.textContent && el.textContent.trim() === '未表示') {
          el.style.display = 'none';
        }
      });
    }
  }
  
  // モーダル全体から「未表示」テキストを除去
  function removeAllUnverifiedTextsFromModal(modal) {
    // CSSルールを適用
    const styleId = 'unverified-text-remover';
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        #registerGuideModal *:empty { display: none !important; }
        #registerGuideModal span:not([class]):empty { display: none !important; }
      `;
      document.head.appendChild(styleEl);
    }
    
    // 特定の文字列を含む要素を検出して削除
    const allElements = modal.querySelectorAll('*');
    allElements.forEach(function(el) {
      if (el.childNodes.length === 1 && 
          el.childNodes[0].nodeType === Node.TEXT_NODE && 
          el.childNodes[0].textContent.trim() === '未表示') {
        el.style.display = 'none';
      }
    });
  }
  
  // モーダルが表示されているか確認
  function isModalVisible(modal) {
    if (!modal) return false;
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
  }
})();