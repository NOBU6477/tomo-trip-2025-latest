/**
 * 要素置換手法による認証バッジ排除
 * DOM要素を完全に置き換えることで、通常の非表示化では対応できない問題を解決
 */
(function() {
  // 初期化
  function init() {
    console.log('Element Replacement Technique: 初期化');
    
    // モーダル表示イベント監視
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダル表示を検知');
        setTimeout(executeReplacement, 100);
      }
    });
    
    // DOMの変更を監視
    setupMutationObserver();
    
    // 初期実行
    setTimeout(executeReplacement, 500);
    
    // 定期的に実行
    setInterval(executeReplacement, 1000);
  }
  
  // DOM変更監視の設定
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      // 変更があったらガイド登録モーダルをチェック
      const guideModal = document.getElementById('guideRegistrationModal');
      if (guideModal && isModalVisible(guideModal)) {
        executeReplacement();
      }
    });
    
    // bodyの変更を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
  
  // 置換処理を実行
  function executeReplacement() {
    // ガイド登録モーダルを取得
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal || !isModalVisible(guideModal)) return;
    
    // 電話番号認証セクションを探す
    const phoneSection = findPhoneVerificationSection(guideModal);
    if (!phoneSection) {
      console.log('電話番号認証セクションが見つかりません');
      return;
    }
    
    console.log('電話番号認証セクション発見:', phoneSection);
    
    // 認証バッジを含む親要素を完全に置き換える
    replaceVerificationSection(phoneSection);
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSection(container) {
    // ラベルから探す
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // フォームグループまたは近い親要素を返す
        return label.closest('.form-group, .mb-3, .row, [class*="form"]') || label.parentElement;
      }
    }
    
    // テキストから探す
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証') && el.nodeType === 1) {
        // テキストを含む要素の親を返す
        return el.closest('.form-group, .mb-3, .row, [class*="form"]') || el.parentElement;
      }
    }
    
    return null;
  }
  
  // 認証セクションを置き換える
  function replaceVerificationSection(section) {
    // 既に処理済みかどうかをチェック
    if (section.getAttribute('data-replaced') === 'true') {
      return;
    }
    
    // 既存の認証済みバッジを検出
    let hasVerifiedBadge = false;
    
    // グリーンボタンを検出
    const greenButtons = section.querySelectorAll('.btn-success, .btn.bg-success, [class*="btn"][class*="success"]');
    for (const button of greenButtons) {
      if (button.textContent && button.textContent.trim() === '認証済み') {
        hasVerifiedBadge = true;
        break;
      }
    }
    
    // バッジを検出
    const badges = section.querySelectorAll('.badge.bg-success, .badge-success, [class*="badge"][class*="success"]');
    for (const badge of badges) {
      if (badge.textContent && badge.textContent.trim() === '認証済み') {
        hasVerifiedBadge = true;
        break;
      }
    }
    
    // その他のテキスト要素
    const allElements = section.querySelectorAll('*');
    for (const el of allElements) {
      // テキストノードだけを取得
      let hasVerifiedText = false;
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '認証済み') {
          hasVerifiedText = true;
          break;
        }
      }
      
      if (hasVerifiedText) {
        hasVerifiedBadge = true;
        break;
      }
    }
    
    // 既存の「未表示」テキストを探す
    let hasUnverifiedText = false;
    let unverifiedTextElement = null;
    
    const textElements = section.querySelectorAll('.text-muted, span, small, div');
    for (const el of textElements) {
      // テキストノードだけを取得
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '未表示') {
          hasUnverifiedText = true;
          unverifiedTextElement = el;
          break;
        }
      }
      
      if (hasUnverifiedText) break;
    }
    
    // 問題がある場合のみ置換を実行
    if (hasVerifiedBadge || !hasUnverifiedText) {
      console.log('認証バッジを検出、セクションを置換します');
      
      // ラベルを保存
      const label = section.querySelector('label');
      const labelText = label ? label.textContent : '電話番号認証';
      
      // 親要素を取得
      const parent = section.parentElement;
      if (!parent) return;
      
      // 新しいセクションを作成
      const newSection = document.createElement('div');
      newSection.className = section.className || 'mb-3';
      newSection.setAttribute('data-replaced', 'true');
      
      // 内部コンテンツ
      newSection.innerHTML = `
        <label class="form-label">${labelText}</label>
        <span class="text-muted unverified-text" style="cursor:pointer;margin-left:0.5rem;">未表示</span>
      `;
      
      // 「未表示」テキストにクリックイベントを設定
      const newUnverifiedText = newSection.querySelector('.unverified-text');
      if (newUnverifiedText) {
        newUnverifiedText.onclick = function() {
          const phoneModal = document.getElementById('phoneVerificationModal');
          if (phoneModal) {
            const modal = new bootstrap.Modal(phoneModal);
            modal.show();
          }
        };
      }
      
      // 古いセクションをDOMから削除して新しいセクションに置き換え
      parent.replaceChild(newSection, section);
      console.log('電話番号認証セクションを置換しました');
    } else {
      // 処理不要の場合はマークだけ付ける
      section.setAttribute('data-replaced', 'true');
    }
  }
  
  // モーダルが表示されているかをチェック
  function isModalVisible(modal) {
    return modal.classList.contains('show') && 
           window.getComputedStyle(modal).display !== 'none';
  }
  
  // ドキュメント読み込み完了時に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // ウィンドウ読み込み完了時にも初期化
  window.addEventListener('load', init);
})();