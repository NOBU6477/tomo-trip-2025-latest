/**
 * 「認証済み」バッジの完全一致で削除するスクリプト
 * 緑色バッジと「認証済み」テキストを両方持つ要素を正確に特定
 */
(function() {
  // 初期化
  function init() {
    console.log('完全一致認証バッジ削除: 初期化');
    
    // ガイド登録モーダルの表示イベントをリッスン
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        console.log('ガイド登録モーダルが表示されました');
        
        // モーダル表示直後に実行し、少し遅延して再度実行（DOMの描画タイミングの差異に対応）
        findAndReplaceAuthBadge();
        setTimeout(findAndReplaceAuthBadge, 500);
      }
    });
    
    // 認証済みバッジが動的に追加された場合のために、DOM変更を監視
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        // 追加された要素をチェック
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 各追加ノードをチェック
          Array.from(mutation.addedNodes).forEach(node => {
            // 要素ノードのみ処理
            if (node.nodeType === 1) {
              // クラス名が'success'を含む場合
              if ((node.className && typeof node.className === 'string' && 
                  (node.className.includes('success') || node.className.includes('badge'))) ||
                  (node.textContent && node.textContent.trim() === '認証済み')) {
                
                findAndReplaceAuthBadge();
              }
            }
          });
        }
      }
    });
    
    // DOM全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // 初期実行とセーフティとしての定期実行
    findAndReplaceAuthBadge();
    setInterval(findAndReplaceAuthBadge, 3000);
  }
  
  // 認証済みバッジを探して置換
  function findAndReplaceAuthBadge() {
    // ガイド登録モーダルが表示されているか確認
    const modal = document.getElementById('guideRegistrationModal');
    if (!modal || !isModalVisible(modal)) return;
    
    // 電話番号認証セクションを探す
    const verificationSection = findPhoneVerificationSection(modal);
    if (!verificationSection) return;
    
    // 認証済みバッジを探す (完全一致: 緑色 + 認証済み)
    const exactMatches = findExactAuthBadges(verificationSection);
    
    if (exactMatches.length > 0) {
      console.log(`完全一致する認証済みバッジを ${exactMatches.length} 個発見しました`);
      
      // 各バッジを「未表示」に置き換え
      exactMatches.forEach(badge => {
        replaceBadgeWithUnverified(badge);
      });
    } else {
      console.log('完全一致する認証済みバッジは見つかりませんでした');
    }
  }
  
  // 電話番号認証セクションを探す
  function findPhoneVerificationSection(container) {
    // ラベルで探す
    const labels = container.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // フォームグループを返す
        const formGroup = label.closest('.form-group, .mb-3, .row');
        if (formGroup) return formGroup;
        
        // 最も近い親のdiv要素を返す
        let parent = label.parentElement;
        for (let i = 0; i < 3 && parent; i++) {
          if (parent.tagName === 'DIV') return parent;
          parent = parent.parentElement;
        }
        
        return label.parentElement;
      }
    }
    
    // 電話番号認証というテキストを持つ要素を探す
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes('電話番号認証')) {
        const formGroup = el.closest('.form-group, .mb-3, .row');
        return formGroup || el.parentElement;
      }
    }
    
    return null;
  }
  
  // 完全に一致する認証済みバッジを探す
  function findExactAuthBadges(container) {
    const matches = [];
    
    // 緑色のバッジ/ボタンを探す
    const greenElements = [
      ...container.querySelectorAll('.btn-success'),
      ...container.querySelectorAll('.badge.bg-success'),
      ...container.querySelectorAll('.alert-success'),
      ...container.querySelectorAll('[class*="success"]')
    ];
    
    // テキストが「認証済み」のものだけをフィルタリング
    for (const el of greenElements) {
      if (el.textContent && el.textContent.trim() === '認証済み' && isElementVisible(el)) {
        matches.push(el);
      }
    }
    
    // さらに「認証済み」テキストで探す（クラスによる検索で漏れた場合）
    const allElements = container.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && 
          el.textContent.trim() === '認証済み' && 
          isElementVisible(el) &&
          !matches.includes(el)) {
        
        // ここで念のため緑色かどうかをコンピュテッドスタイルでチェック
        const style = window.getComputedStyle(el);
        if (style.backgroundColor === 'rgb(25, 135, 84)' || 
            style.backgroundColor === 'rgb(40, 167, 69)' ||
            style.color === 'rgb(255, 255, 255)') {
          matches.push(el);
        }
      }
    }
    
    return matches;
  }
  
  // バッジを「未表示」に置き換え
  function replaceBadgeWithUnverified(badge) {
    if (!badge || !badge.parentElement) return;
    
    console.log('認証済みバッジを置換:', badge.tagName, badge.className);
    
    // 「未表示」要素を作成
    const unverifiedText = document.createElement('span');
    unverifiedText.className = 'text-muted ms-2';
    unverifiedText.textContent = '未表示';
    
    // バッジを隠す（完全に消すのではなく視覚的に非表示にする）
    badge.style.display = 'none';
    badge.style.visibility = 'hidden';
    badge.classList.add('d-none');
    
    // 「未表示」要素を挿入
    badge.parentElement.insertBefore(unverifiedText, badge.nextSibling);
    
    try {
      // DOM上からバッジを完全に削除（最も確実な方法）
      badge.parentElement.removeChild(badge);
      console.log('認証済みバッジをDOM上から完全に削除しました');
    } catch (e) {
      console.log('バッジの削除でエラーが発生:', e);
    }
  }
  
  // 要素が視覚的に表示されているかを確認
  function isElementVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           !element.classList.contains('d-none');
  }
  
  // モーダルが表示されているかを確認
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