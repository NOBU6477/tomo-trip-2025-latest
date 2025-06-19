/**
 * 直接要素削除スクリプト
 * 認証バッジを直接削除する最終手段
 */
(function() {
  // 即時実行と遅延実行
  executeRemoval();
  
  // 読み込み完了後に実行
  window.addEventListener('load', function() {
    executeRemoval();
    // 遅延実行（非同期処理による遅延対策）
    setTimeout(executeRemoval, 500);
    setTimeout(executeRemoval, 1000);
    setTimeout(executeRemoval, 2000);
  });
  
  // モーダル表示時にも実行
  document.addEventListener('shown.bs.modal', function() {
    executeRemoval();
    // 少し遅延させて再実行
    setTimeout(executeRemoval, 200);
  });
  
  // DOM変更を監視
  const observer = new MutationObserver(function(mutations) {
    let shouldRemove = false;
    
    for (const mutation of mutations) {
      // 新しい要素が追加された場合
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldRemove = true;
        break;
      }
      // 属性が変更された場合
      else if (mutation.type === 'attributes' && 
               (mutation.target.classList.contains('btn-success') || 
                mutation.target.classList.contains('badge') || 
                mutation.target.id && mutation.target.id.includes('verified'))) {
        shouldRemove = true;
        break;
      }
    }
    
    if (shouldRemove) {
      executeRemoval();
    }
  });
  
  // ドキュメント全体を監視
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'id']
  });
  
  // 削除実行関数
  function executeRemoval() {
    console.log('バッジ直接削除: 実行');
    
    // 削除対象のセレクタ
    const selectors = [
      '.btn-success',
      '.badge.bg-success',
      '#guide-phone-verified',
      '.alert-success:not(#verification-success)',
      '[id*="verified"]',
      '.authentication-badge'
    ];
    
    // 電話認証セクション内の要素を特定して削除
    document.querySelectorAll('.row:has(label:contains("電話番号認証"))').forEach(row => {
      // この行内のすべてのバッジを探す
      const badges = row.querySelectorAll(selectors.join(','));
      badges.forEach(badge => {
        console.log('電話認証セクション内のバッジを削除:', badge.className || badge.id);
        directRemove(badge);
      });
    });
    
    // ガイド登録モーダル内のバッジを特定して削除
    const guideModal = document.getElementById('guideRegistrationModal');
    if (guideModal) {
      const badges = guideModal.querySelectorAll(selectors.join(','));
      badges.forEach(badge => {
        console.log('ガイドモーダル内のバッジを削除:', badge.className || badge.id);
        directRemove(badge);
      });
    }
    
    // スクリーンショットで表示されている特定のバッジとマッチする要素を探す
    document.querySelectorAll('label').forEach(label => {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // 電話番号認証ラベルが見つかった場合
        let parent = label.parentElement;
        // 2階層上まで遡って探す
        for (let i = 0; i < 2 && parent; i++) {
          // この親要素内の緑色のボタンや認証関連要素を探す
          const badges = parent.querySelectorAll('.btn-success, .badge.bg-success, .alert-success, [id*="verified"]');
          badges.forEach(badge => {
            console.log(`電話認証ラベルの親(${i}階層)内のバッジを削除:`, badge.className || badge.id);
            directRemove(badge);
          });
          parent = parent.parentElement;
        }
      }
    });
    
    // 最後の手段：すべてのバッジを消去
    document.querySelectorAll(selectors.join(',')).forEach(badge => {
      // 電話認証セクションに関連するか、またはガイドモーダル内にあるか確認
      if (badge.closest('[id*="phone"]') || 
          badge.closest('#guideRegistrationModal') || 
          (badge.textContent && badge.textContent.includes('認証済'))) {
        console.log('バッジを削除:', badge.className || badge.id);
        directRemove(badge);
      }
    });
  }
  
  // 要素を直接削除する関数
  function directRemove(element) {
    if (!element) return;
    
    // まず非表示にしてから削除
    element.style.setProperty('display', 'none', 'important');
    element.style.setProperty('visibility', 'hidden', 'important');
    element.style.setProperty('opacity', '0', 'important');
    element.style.setProperty('height', '0', 'important');
    element.style.setProperty('width', '0', 'important');
    element.style.setProperty('overflow', 'hidden', 'important');
    element.classList.add('d-none');
    
    // テキストも消去
    element.textContent = '';
    element.innerHTML = '';
    
    // 可能であれば親要素から削除
    try {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (e) {
      console.error('要素削除エラー:', e);
    }
  }
})();