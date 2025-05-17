/**
 * 最終的なインラインスタイルの上書き
 * ガイド登録モーダル開始時に緊急のスタイル注入を行う
 */
(function() {
  console.log('Final Inline Override: 初期化');
  
  // DOM読み込み完了時
  document.addEventListener('DOMContentLoaded', init);
  
  // ウィンドウ読み込み完了時
  window.addEventListener('load', init);
  
  // モーダル表示イベント
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'guideRegistrationModal') {
      console.log('ガイド登録モーダルが表示されました - インラインスタイル上書き実行');
      injectEmergencyStyles();
    }
  });
  
  // 初期化関数
  function init() {
    // カスタムクラスを持つスタイル要素を作成して挿入
    const customStyle = document.createElement('style');
    customStyle.id = 'final-inline-override-styles';
    customStyle.textContent = getOverrideStyles();
    document.head.appendChild(customStyle);
    
    // 定期的にチェック
    setInterval(function() {
      const modal = document.getElementById('guideRegistrationModal');
      if (modal && isModalVisible(modal)) {
        injectEmergencyStyles();
      }
    }, 1000);
    
    // インラインスタイル上書き
    injectEmergencyStyles();
  }
  
  // インラインで緊急スタイルを注入
  function injectEmergencyStyles() {
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal) return;
    
    // 電話番号認証セクションを探す
    const sections = findPhoneVerificationSections(modal);
    
    console.log(`${sections.length}個の電話番号認証セクションを見つけました`);
    
    // 各セクションにスタイルを適用
    sections.forEach(function(section) {
      // 既に処理済みかチェック
      if (section.hasAttribute('data-inline-override')) return;
      
      console.log('セクションにインラインスタイルを適用:', section);
      
      // 緑色バッジ・ボタンを探して非表示
      const greenElements = section.querySelectorAll('.badge.bg-success, .badge-success, .btn-success, .btn.bg-success, [class*="badge"][class*="success"], [class*="btn"][class*="success"]');
      greenElements.forEach(function(el) {
        console.log('緑色要素に非表示スタイルを適用:', el);
        applyHidingStyles(el);
      });
      
      // 「認証済み」テキストを含む要素を探して非表示
      const allElements = section.querySelectorAll('*');
      allElements.forEach(function(el) {
        // テキストノードだけを確認
        for (const node of el.childNodes) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim() === '認証済み') {
            console.log('認証済みテキストを含む要素に非表示スタイルを適用:', el);
            applyHidingStyles(el);
            break;
          }
        }
      });
      
      // 「未表示」テキストを探して表示状態を確保
      const unverifiedElements = Array.from(section.querySelectorAll('*')).filter(function(el) {
        // テキストノードだけを確認
        return Array.from(el.childNodes).some(function(node) {
          return node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim() === '未表示';
        });
      });
      
      if (unverifiedElements.length > 0) {
        console.log('未表示テキストを含む要素の表示を確保:', unverifiedElements[0]);
        applyShowingStyles(unverifiedElements[0]);
      }
      
      // 処理済みマークを付ける
      section.setAttribute('data-inline-override', 'true');
      
      // セクション全体のスタイルを調整
      adjustSectionStyles(section);
    });
    
    // グローバルスタイル注入
    injectGlobalStyles();
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSections(container) {
    const sections = [];
    
    // ラベルから探す
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        const section = label.closest('.form-group, .mb-3, .row, div[class*="form"]') || label.parentElement;
        if (!sections.includes(section)) {
          sections.push(section);
        }
      }
    }
    
    // テキストから探す
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証') && el.nodeType === Node.ELEMENT_NODE) {
        // ラベル以外のテキストノードから探す
        if (el.tagName !== 'LABEL') {
          const section = el.closest('.form-group, .mb-3, .row, div[class*="form"]') || el.parentElement;
          if (section && !sections.includes(section)) {
            sections.push(section);
          }
        }
      }
    }
    
    return sections;
  }
  
  // 非表示スタイルを適用
  function applyHidingStyles(element) {
    element.style.cssText = `
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
    `;
    
    // クラスも追加
    element.classList.add('d-none');
    element.classList.add('invisible');
    element.classList.add('visually-hidden');
    
    // データ属性でマーク
    element.setAttribute('data-hidden-by-inline', 'true');
  }
  
  // 表示スタイルを適用
  function applyShowingStyles(element) {
    element.style.cssText = `
      display: inline-block !important;
      visibility: visible !important;
      opacity: 1 !important;
      height: auto !important;
      width: auto !important;
      max-height: none !important;
      max-width: none !important;
      overflow: visible !important;
      position: static !important;
      z-index: auto !important;
      pointer-events: auto !important;
      clip: auto !important;
      clip-path: none !important;
    `;
    
    // カーソルをポインターに
    element.style.cursor = 'pointer';
    
    // クラスも調整
    element.classList.remove('d-none');
    element.classList.remove('invisible');
    element.classList.remove('visually-hidden');
    
    // データ属性でマーク
    element.setAttribute('data-shown-by-inline', 'true');
    
    // テキストマージン調整
    element.style.marginLeft = '0.5rem';
    
    // 電話認証モーダルを開くクリックイベントを設定
    if (!element.onclick) {
      element.onclick = function() {
        const phoneModal = document.getElementById('phoneVerificationModal');
        if (phoneModal) {
          try {
            const modal = new bootstrap.Modal(phoneModal);
            modal.show();
          } catch (error) {
            console.error('電話認証モーダル表示エラー:', error);
            
            // フォールバック方法
            phoneModal.classList.add('show');
            phoneModal.style.display = 'block';
            document.body.classList.add('modal-open');
            
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
          }
        }
      };
    }
  }
  
  // セクション全体のスタイルを調整
  function adjustSectionStyles(section) {
    // 一貫性のあるスタイルとプロパティを確保
    section.style.marginBottom = '1rem';
    section.style.position = 'relative';
    
    // 不要なpaddingやborderをリセット
    section.style.overflow = 'visible';
  }
  
  // グローバルスタイルを注入
  function injectGlobalStyles() {
    // スタイル要素があるか確認
    let styleEl = document.getElementById('inline-verified-badge-styles');
    
    // なければ作成
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'inline-verified-badge-styles';
      document.head.appendChild(styleEl);
    }
    
    // スタイル内容を設定
    styleEl.textContent = `
      /* 電話番号認証セクション内の認証済みバッジを強制的に非表示 */
      .modal#guideRegistrationModal label:contains("電話番号認証") ~ .badge.bg-success,
      .modal#guideRegistrationModal label:contains("電話番号認証") ~ .btn-success,
      .modal#guideRegistrationModal div:has(label:contains("電話番号認証")) .badge.bg-success,
      .modal#guideRegistrationModal div:has(label:contains("電話番号認証")) .btn-success,
      .modal#guideRegistrationModal *:contains("認証済み"):not(.modal-content, .modal-body, .modal-dialog, .modal-header) {
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
      
      /* 「未表示」テキストを確保 */
      .modal#guideRegistrationModal span.text-muted:contains("未表示"),
      .modal#guideRegistrationModal div.text-muted:contains("未表示"),
      .modal#guideRegistrationModal span:contains("未表示"),
      .modal#guideRegistrationModal div:contains("未表示"):not(.modal-content, .modal-body, .modal-dialog, .modal-header) {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        width: auto !important;
        max-height: none !important;
        max-width: none !important;
        overflow: visible !important;
        position: static !important;
        z-index: auto !important;
        pointer-events: auto !important;
        clip: auto !important;
        clip-path: none !important;
        cursor: pointer !important;
        margin-left: 0.5rem !important;
      }
    `;
  }
  
  // 上書き用スタイルを取得
  function getOverrideStyles() {
    return `
      /* 電話番号認証セクション内の認証済みバッジを強制的に非表示 */
      .modal#guideRegistrationModal label:contains("電話番号認証") ~ .badge.bg-success,
      .modal#guideRegistrationModal label:contains("電話番号認証") ~ .btn-success,
      .modal#guideRegistrationModal div:has(label:contains("電話番号認証")) .badge.bg-success,
      .modal#guideRegistrationModal div:has(label:contains("電話番号認証")) .btn-success,
      .modal#guideRegistrationModal *:contains("認証済み"):not(.modal-content, .modal-body, .modal-dialog, .modal-header) {
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
      
      /* モーダル内の緑色要素をすべて非表示（認証バッジかどうかに関わらず） */
      .modal#guideRegistrationModal [data-hidden-by-inline="true"],
      .modal#guideRegistrationModal .badge.bg-success,
      .modal#guideRegistrationModal .btn-success,
      .modal#guideRegistrationModal [style*="background-color: rgb(25, 135, 84)"],
      .modal#guideRegistrationModal [style*="background-color: rgb(40, 167, 69)"],
      .modal#guideRegistrationModal [style*="background-color:#198754"],
      .modal#guideRegistrationModal [style*="background-color: #198754"],
      .modal#guideRegistrationModal [style*="background-color:#28a745"],
      .modal#guideRegistrationModal [style*="background-color: #28a745"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      
      /* 「未表示」テキストの表示を確保 */
      .modal#guideRegistrationModal [data-shown-by-inline="true"],
      .modal#guideRegistrationModal span.text-muted:contains("未表示"),
      .modal#guideRegistrationModal div.text-muted:contains("未表示"),
      .modal#guideRegistrationModal span:contains("未表示"),
      .modal#guideRegistrationModal div:contains("未表示"):not(.modal-content, .modal-body, .modal-dialog, .modal-header) {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        width: auto !important;
        max-height: none !important;
        max-width: none !important;
        overflow: visible !important;
        position: static !important;
        z-index: auto !important;
        pointer-events: auto !important;
        clip: auto !important;
        clip-path: none !important;
        cursor: pointer !important;
        margin-left: 0.5rem !important;
      }
    `;
  }
  
  // モーダルが表示されているかを確認
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
  }
})();