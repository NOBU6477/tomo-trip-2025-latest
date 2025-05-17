/**
 * 電話番号認証システムの初期化と「認証済み」バッジの「電話認証」テキストへの変更
 */
(function() {
  // 初期化
  function init() {
    console.log('電話認証初期化スクリプト: 実行');
    
    // モーダル表示イベントの監視
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダル表示: 電話認証要素を初期化');
        
        // 電話番号認証セクションを初期化
        setTimeout(replaceAuthBadgeWithVerifyText, 100);
        setTimeout(replaceAuthBadgeWithVerifyText, 500);
      }
    });
    
    // DOM変更の監視
    const observer = new MutationObserver(function() {
      // ガイド登録モーダルが表示されている場合のみ処理
      const modal = document.getElementById('guideRegistrationModal');
      if (modal && isModalVisible(modal)) {
        replaceAuthBadgeWithVerifyText();
      }
    });
    
    // 監視開始
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // 初期実行
    setTimeout(replaceAuthBadgeWithVerifyText, 500);
  }
  
  // 認証バッジを電話認証テキストに置き換え
  function replaceAuthBadgeWithVerifyText() {
    // ガイド登録モーダルチェック
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal || !isModalVisible(modal)) return;
    
    // 電話番号認証セクションを探す
    const phoneVerificationSection = findPhoneVerificationSection(modal);
    if (!phoneVerificationSection) {
      console.log('電話番号認証セクションが見つかりません');
      return;
    }
    
    console.log('電話番号認証セクション発見:', phoneVerificationSection);
    
    // 緑色の認証済みバッジを探す
    const authBadges = findAllAuthBadges(phoneVerificationSection);
    
    // 既存の「電話認証」テキストがあるか確認
    const existingVerifyText = findPhoneVerifyText(phoneVerificationSection);
    
    // 「電話認証」テキストがまだ無く、バッジが1つ以上ある場合
    if (!existingVerifyText && authBadges.length > 0) {
      console.log('認証済みバッジを発見:', authBadges.length, '個');
      
      // バッジをすべて非表示にする
      authBadges.forEach(badge => {
        hideBadge(badge);
      });
      
      // 「電話認証」テキストを挿入
      insertVerifyText(phoneVerificationSection);
    }
    // バッジもテキストもない場合は、テキストだけ挿入
    else if (!existingVerifyText && authBadges.length === 0) {
      console.log('認証バッジが見つからないため「電話認証」テキストのみ挿入');
      insertVerifyText(phoneVerificationSection);
    }
    else {
      console.log('電話認証テキストは既に存在します');
    }
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSection(container) {
    // ラベルから探す
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // 親要素を探す
        return label.closest('.form-group, .row, .mb-3') || label.parentElement;
      }
    }
    
    // テキストで探す
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証')) {
        // 親要素を探す
        return el.closest('.form-group, .row, .mb-3') || el.parentElement;
      }
    }
    
    return null;
  }
  
  // 認証バッジをすべて探す
  function findAllAuthBadges(container) {
    const badges = [];
    
    // クラス名で探す
    const classBadges = container.querySelectorAll('.btn-success, .badge.bg-success, [class*="success"]');
    classBadges.forEach(badge => {
      if (isElementVisible(badge) && 
          badge.textContent && 
          badge.textContent.trim() === '認証済み') {
        badges.push(badge);
      }
    });
    
    // テキスト内容で探す
    const allElements = container.querySelectorAll('*');
    allElements.forEach(el => {
      if (isElementVisible(el) && 
          el.textContent && 
          el.textContent.trim() === '認証済み' && 
          !badges.includes(el)) {
        badges.push(el);
      }
    });
    
    return badges;
  }
  
  // 既存の「電話認証」テキストを探す
  function findPhoneVerifyText(container) {
    // クラス名で探す
    const classTexts = container.querySelectorAll('.text-verification-status, .text-muted');
    for (const text of classTexts) {
      if (text.textContent && 
          (text.textContent.trim() === '電話認証' || 
           text.textContent.trim() === '未表示')) {
        return text;
      }
    }
    
    // テキスト内容で探す
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && 
          (el.textContent.trim() === '電話認証' || 
           el.textContent.trim() === '未表示') && 
          isElementVisible(el)) {
        return el;
      }
    }
    
    return null;
  }
  
  // バッジを非表示にする
  function hideBadge(badge) {
    if (!badge || !badge.parentElement) return;
    
    try {
      // 非表示にする
      badge.style.display = 'none';
      badge.style.visibility = 'hidden';
      badge.style.opacity = '0';
      badge.classList.add('d-none');
      
      // 可能であればDOMから削除
      if (badge.parentElement) {
        badge.parentElement.removeChild(badge);
      }
    } catch (e) {
      console.error('バッジの非表示化でエラー:', e);
    }
  }
  
  // 「電話認証」テキストを挿入
  function insertVerifyText(container) {
    if (!container) return;
    
    // 挿入位置を探す
    let insertTarget = null;
    
    // ラベルの後に挿入
    const label = container.querySelector('label');
    if (label) {
      insertTarget = label;
    }
    
    if (!insertTarget) {
      const divs = container.querySelectorAll('div');
      if (divs.length > 0) {
        // 最初のdivの後に挿入
        insertTarget = divs[0];
      } else {
        // コンテナ自体の先頭に挿入
        insertTarget = container;
      }
    }
    
    // 電話認証ボタンテキストを作成
    const verifyText = document.createElement('span');
    verifyText.className = 'text-verification-status ms-2';
    verifyText.textContent = '電話認証';
    verifyText.style.cursor = 'pointer';
    verifyText.setAttribute('data-verification-trigger', 'true');
    
    // クリックイベントを設定
    verifyText.addEventListener('click', function() {
      // 電話番号認証モーダルを表示
      const phoneModal = document.getElementById('phoneVerificationModal');
      if (phoneModal) {
        const modal = new bootstrap.Modal(phoneModal);
        modal.show();
      } else {
        console.error('電話番号認証モーダルが見つかりません');
      }
    });
    
    // 挿入
    if (insertTarget === container) {
      // コンテナの先頭に追加
      if (container.firstChild) {
        container.insertBefore(verifyText, container.firstChild);
      } else {
        container.appendChild(verifyText);
      }
    } else {
      // 対象要素の後ろに追加
      if (insertTarget.nextSibling) {
        insertTarget.parentNode.insertBefore(verifyText, insertTarget.nextSibling);
      } else {
        insertTarget.parentNode.appendChild(verifyText);
      }
    }
  }
  
  // 要素が表示されているかチェック
  function isElementVisible(element) {
    if (!element) return false;
    
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