/**
 * 緊急対応：直接対象要素を削除するバッジ修正最終手段
 * モーダル内のすべての操作を監視し、認証済みバッジを即座に削除する緊急手段
 */
(function() {
  console.log('Badge Emergency Fix: 初期化');

  // DOM読み込み後に実行
  document.addEventListener('DOMContentLoaded', init);
  
  // 初期化処理
  function init() {
    // 初回実行
    setTimeout(emergencyFix, 100);

    // 定期的に実行
    setInterval(emergencyFix, 500);

    // モーダル表示イベントをリッスン
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        emergencyFix();
        
        // 表示後複数回実行
        setTimeout(emergencyFix, 100);
        setTimeout(emergencyFix, 300);
        setTimeout(emergencyFix, 500);
      }
    });

    // クリックイベントの監視
    document.addEventListener('click', function(event) {
      const modal = document.getElementById('guideRegistrationModal');
      if (modal && isModalOpen(modal)) {
        setTimeout(emergencyFix, 50);
      }
    });

    // 変更監視
    setupMutationObserver();
  }

  // 直接認証バッジを削除する緊急措置
  function emergencyFix() {
    // ガイド登録モーダルを取得
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal || !isModalOpen(modal)) return;

    console.log('緊急バッジ修正を実行');

    // 1. 電話番号認証セクションを見つける
    const sections = findAllVerificationSections(modal);
    sections.forEach(function(section) {
      // 2. 認証バッジや緑色ボタンを徹底削除
      purgeAuthenticationBadges(section);
      
      // 3. 「未表示」テキストのみを確実に表示
      ensureUnverifiedTextOnly(section);
    });

    // 4. CSSを使った緊急隠蔽
    injectEmergencyStyles();
  }

  // 電話番号認証セクションを見つける（複数の探し方で確実に）
  function findAllVerificationSections(container) {
    const sections = [];
    
    // 1. ラベルから探す
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        const section = findParentSection(label);
        if (section && !sections.includes(section)) {
          sections.push(section);
        }
      }
    }
    
    // 2. テキストを含む要素から探す
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証') && el.nodeType === 1) {
        const section = findParentSection(el);
        if (section && !sections.includes(section)) {
          sections.push(section);
        }
      }
    }
    
    // 3. 緑色バッジの近くから探す
    const greenBadges = container.querySelectorAll('.badge.bg-success, .btn-success');
    for (const badge of greenBadges) {
      if (badge.textContent && badge.textContent.includes('認証済み')) {
        const section = findParentSection(badge);
        if (section && !sections.includes(section)) {
          sections.push(section);
        }
      }
    }
    
    return sections;
  }

  // 親セクションを見つける
  function findParentSection(element) {
    // form-group, mb-3などのフォーム項目の典型的なクラスを持つ親要素を探す
    return element.closest('.form-group, .mb-3, .row, [class*="form"]') || element.parentElement;
  }

  // 徹底的に認証バッジを削除
  function purgeAuthenticationBadges(section) {
    // 緑色バッジ・ボタンを探して削除
    const greenElements = section.querySelectorAll('.badge.bg-success, .badge-success, .btn-success, .btn.bg-success, [class*="badge"][class*="success"], [class*="btn"][class*="success"]');
    
    for (const el of greenElements) {
      forceRemoveElement(el);
    }
    
    // "認証済み"テキストを含む要素を削除
    const allElements = Array.from(section.querySelectorAll('*'));
    for (const el of allElements) {
      if (el.textContent && el.textContent.trim() === '認証済み') {
        // ただし「未表示」テキストでない場合のみ
        if (!el.textContent.includes('未表示')) {
          forceRemoveElement(el);
        }
      }
      
      // テキストノードの検査
      for (const node of Array.from(el.childNodes)) {
        if (node.nodeType === 3 && node.textContent && node.textContent.trim() === '認証済み') {
          el.removeChild(node);
        }
      }
    }
    
    // スタイルで緑色の要素も検査
    const elementsWithStyle = section.querySelectorAll('*');
    elementsWithStyle.forEach(function(el) {
      const style = window.getComputedStyle(el);
      if (isGreenColor(style.backgroundColor) || isGreenColor(style.color)) {
        // テキストが認証済みなら削除
        if (el.textContent && el.textContent.includes('認証済み')) {
          forceRemoveElement(el);
        }
      }
    });
  }

  // 「未表示」テキストのみを確保
  function ensureUnverifiedTextOnly(section) {
    // 既存の「未表示」テキストを探す
    let unverifiedText = null;
    
    // テキストで探す
    const allElements = section.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.trim() === '未表示' && isVisible(el)) {
        unverifiedText = el;
        break;
      }
      
      // テキストノードの検査
      for (const node of Array.from(el.childNodes)) {
        if (node.nodeType === 3 && node.textContent && node.textContent.trim() === '未表示') {
          unverifiedText = el;
          break;
        }
      }
      
      if (unverifiedText) break;
    }
    
    // 見つからない場合は新しく作成
    if (!unverifiedText) {
      // ラベルを探す
      const label = section.querySelector('label');
      
      if (label) {
        // 新しいspan要素を作成
        unverifiedText = document.createElement('span');
        unverifiedText.className = 'text-muted emergency-unverified-text';
        unverifiedText.textContent = '未表示';
        unverifiedText.style.marginLeft = '0.5rem';
        unverifiedText.style.cursor = 'pointer';
        
        // クリックイベントを設定
        unverifiedText.onclick = function() {
          const phoneModal = document.getElementById('phoneVerificationModal');
          if (phoneModal) {
            try {
              const bsModal = new bootstrap.Modal(phoneModal);
              bsModal.show();
            } catch (error) {
              console.error('モーダル表示エラー:', error);
              phoneModal.classList.add('show');
              phoneModal.style.display = 'block';
              document.body.classList.add('modal-open');
              
              const backdrop = document.createElement('div');
              backdrop.className = 'modal-backdrop fade show';
              document.body.appendChild(backdrop);
            }
          }
        };
        
        // ラベルの後に挿入
        label.parentNode.insertBefore(unverifiedText, label.nextSibling);
      }
    } else {
      // 見つかった場合は表示状態を確保
      forceMakeVisible(unverifiedText);
    }
  }

  // 要素を強制的に削除
  function forceRemoveElement(element) {
    try {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (error) {
      console.error('要素の削除に失敗:', error);
      
      // 削除できなければ非表示にする
      if (element) {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.height = '0';
        element.style.width = '0';
        element.style.overflow = 'hidden';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.pointerEvents = 'none';
        
        // 念のためクラスも追加
        element.classList.add('d-none', 'invisible');
      }
    }
  }

  // 要素を強制的に表示
  function forceMakeVisible(element) {
    element.style.display = 'inline-block';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.position = 'static';
    element.style.left = 'auto';
    element.style.pointerEvents = 'auto';
    
    // 念のためクラスも調整
    element.classList.remove('d-none', 'invisible', 'visually-hidden');
    element.classList.add('emergency-unverified-text');
  }

  // RGB色が緑色系かをチェック
  function isGreenColor(color) {
    // rgb, rgba形式の色をパース
    const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i);
    
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      
      // 緑が主要な色で、赤と青より顕著に高い場合
      return g > 100 && g > r * 1.5 && g > b * 1.5;
    }
    
    return false;
  }

  // 要素が表示されているかをチェック
  function isVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           !element.classList.contains('d-none') &&
           !element.classList.contains('invisible') &&
           !element.classList.contains('visually-hidden');
  }

  // モーダルが表示されているかチェック
  function isModalOpen(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
  }

  // 緊急スタイルの注入
  function injectEmergencyStyles() {
    // すでに注入済みなら何もしない
    if (document.getElementById('emergency-badge-styles')) return;
    
    const styleEl = document.createElement('style');
    styleEl.id = 'emergency-badge-styles';
    
    styleEl.textContent = `
      /* 電話番号認証セクション内の認証済みバッジを強制的に非表示 */
      #guideRegistrationModal .badge.bg-success,
      #guideRegistrationModal .btn-success,
      #guideRegistrationModal button[class*="success"],
      #guideRegistrationModal span[class*="success"],
      #guideRegistrationModal div[class*="success"],
      #guideRegistrationModal [style*="background-color: rgb(25, 135, 84)"],
      #guideRegistrationModal [style*="background-color: rgb(40, 167, 69)"],
      #guideRegistrationModal [style*="color: rgb(25, 135, 84)"],
      #guideRegistrationModal [style*="color: rgb(40, 167, 69)"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        max-height: 0 !important;
        max-width: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        z-index: -9999 !important;
        pointer-events: none !important;
        clip: rect(0, 0, 0, 0) !important;
        clip-path: inset(50%) !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      /* 「未表示」テキストの表示を強制確保 */
      #guideRegistrationModal .emergency-unverified-text,
      #guideRegistrationModal span.text-muted:not([class*="success"]) {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        width: auto !important;
        max-height: none !important;
        max-width: none !important;
        overflow: visible !important;
        position: static !important;
        left: auto !important;
        top: auto !important;
        z-index: auto !important;
        pointer-events: auto !important;
        clip: auto !important;
        clip-path: none !important;
        cursor: pointer !important;
        margin-left: 0.5rem !important;
      }
    `;
    
    document.head.appendChild(styleEl);
  }

  // DOM変更を監視
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      let shouldCheck = false;
      
      for (const mutation of mutations) {
        // モーダル関連の変更があれば実行
        if (mutation.target && (mutation.target.id === 'guideRegistrationModal' || 
            mutation.target.closest('#guideRegistrationModal'))) {
          shouldCheck = true;
          break;
        }
      }
      
      if (shouldCheck) {
        emergencyFix();
      }
    });
    
    // bodyを監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }
})();