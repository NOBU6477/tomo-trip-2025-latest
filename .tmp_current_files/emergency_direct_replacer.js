/**
 * 認証バッジ緊急直接置換スクリプト
 * スクリーンショットで見えるDOM要素に直接アクセスして問題を解決
 */
(function() {
  // DOM完全ロード後に実行
  document.addEventListener('DOMContentLoaded', initReplacer);
  
  // ページロード完了時にも実行
  window.addEventListener('load', function() {
    initReplacer();
    // 遅延実行で非同期ロードにも対応
    setTimeout(initReplacer, 500);
    setTimeout(initReplacer, 1000);
  });
  
  // モーダル表示時に実行
  document.addEventListener('shown.bs.modal', function(event) {
    console.log('モーダル表示を検出:', event.target.id);
    // ガイド登録モーダルの場合は特別対応
    if (event.target.id === 'guideRegistrationModal') {
      initReplacer();
      setTimeout(emergencyFixGuideModal, 100);
      setTimeout(emergencyFixGuideModal, 500);
    } else {
      initReplacer();
    }
  });
  
  // DOM変更を監視
  function observeDOM() {
    const observer = new MutationObserver(function(mutations) {
      let shouldFix = false;
      
      for (const mutation of mutations) {
        // 要素追加時
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // 要素ノードのみ
              // クラスや属性で認証バッジらしき要素を検出
              if ((node.classList && (node.classList.contains('btn-success') || 
                                     node.classList.contains('badge') || 
                                     node.classList.contains('authentication-badge'))) || 
                  (node.id && node.id.includes('verified'))) {
                shouldFix = true;
                break;
              }
            }
          }
        }
        // 属性変更時
        else if (mutation.type === 'attributes') {
          const target = mutation.target;
          if (target.classList && (target.classList.contains('btn-success') || 
                                  target.classList.contains('badge') || 
                                  target.classList.contains('authentication-badge'))) {
            shouldFix = true;
            break;
          }
        }
      }
      
      if (shouldFix) {
        initReplacer();
      }
    });
    
    // ドキュメント全体を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'id']
    });
  }
  
  // 初期化と実行
  function initReplacer() {
    console.log('認証バッジ緊急置換: 実行');
    
    // すべての緑色ボタンを探す
    const greenButtons = document.querySelectorAll('.btn-success, .badge.bg-success, .authentication-badge, .alert-success, [id*="verified"]');
    greenButtons.forEach(function(button) {
      // テキストで認証バッジか判定
      if (button.textContent && (button.textContent.includes('認証済') || button.textContent.includes('済み'))) {
        console.log('認証バッジ検出:', button.tagName, button.className || button.id);
        
        // 要素を非表示化
        button.style.setProperty('display', 'none', 'important');
        button.style.setProperty('visibility', 'hidden', 'important');
        button.style.setProperty('opacity', '0', 'important');
        button.style.setProperty('height', '0', 'important');
        button.style.setProperty('width', '0', 'important');
        button.style.setProperty('overflow', 'hidden', 'important');
        button.classList.add('d-none');
        
        // テキストを空に
        button.textContent = '';
        button.innerHTML = '';
        
        // DOM削除
        try {
          if (button.parentNode) {
            button.parentNode.removeChild(button);
          }
        } catch (e) {
          console.error('DOM削除エラー:', e);
        }
      }
    });
    
    // 電話認証セクションを特定して処理
    const phoneLabels = document.querySelectorAll('label');
    phoneLabels.forEach(function(label) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        const parentRow = label.closest('.row') || label.closest('.form-group') || label.parentElement;
        if (parentRow) {
          const badges = parentRow.querySelectorAll('.btn-success, .badge.bg-success, .authentication-badge, .alert-success, [id*="verified"]');
          badges.forEach(function(badge) {
            console.log('電話認証セクション内のバッジを除去:', badge.className || badge.id);
            badge.style.setProperty('display', 'none', 'important');
            badge.style.setProperty('visibility', 'hidden', 'important');
            badge.classList.add('d-none');
            badge.textContent = '';
            badge.innerHTML = '';
            
            // DOM削除
            try {
              if (badge.parentNode) {
                badge.parentNode.removeChild(badge);
              }
            } catch (e) {
              console.error('DOM削除エラー:', e);
            }
          });
        }
      }
    });
    
    // ガイド登録モーダルを特別処理
    const guideModal = document.getElementById('guideRegistrationModal');
    if (guideModal) {
      emergencyFixGuideModal();
    }
    
    // DOM監視開始
    observeDOM();
  }
  
  // ガイド登録モーダル特別対応
  function emergencyFixGuideModal() {
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal) return;
    
    console.log('ガイド登録モーダル特別処理を実行');
    
    // モーダル内のすべての緑色要素を探す
    const greenElements = guideModal.querySelectorAll('.btn-success, .badge.bg-success, .authentication-badge, .alert-success, [id*="verified"]');
    greenElements.forEach(function(element) {
      console.log('ガイドモーダル内の緑色要素を検出:', element.tagName, element.className || element.id);
      
      // 常に非表示
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.classList.add('d-none');
      
      // テキストも空に
      element.textContent = '';
      element.innerHTML = '';
      
      // 可能なら削除
      try {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      } catch (e) {
        console.error('DOM削除エラー:', e);
      }
    });
    
    // phoneセクションを特定して処理
    const phoneSections = guideModal.querySelectorAll('[id*="phone"]');
    phoneSections.forEach(function(section) {
      const badges = section.querySelectorAll('.btn-success, .badge, .alert-success, [id*="verified"]');
      badges.forEach(function(badge) {
        badge.style.setProperty('display', 'none', 'important');
        badge.style.setProperty('visibility', 'hidden', 'important');
        badge.classList.add('d-none');
        badge.textContent = '';
        badge.innerHTML = '';
        
        // 可能なら削除
        try {
          if (badge.parentNode) {
            badge.parentNode.removeChild(badge);
          }
        } catch (e) {
          console.error('DOM削除エラー:', e);
        }
      });
    });
    
    // #guide-phone-verified 要素を特別対応
    const guidePhoneVerified = document.getElementById('guide-phone-verified');
    if (guidePhoneVerified) {
      guidePhoneVerified.style.setProperty('display', 'none', 'important');
      guidePhoneVerified.style.setProperty('visibility', 'hidden', 'important');
      guidePhoneVerified.style.setProperty('opacity', '0', 'important');
      guidePhoneVerified.classList.add('d-none');
      guidePhoneVerified.textContent = '';
      guidePhoneVerified.innerHTML = '';
      
      // 可能なら削除
      try {
        if (guidePhoneVerified.parentNode) {
          guidePhoneVerified.parentNode.removeChild(guidePhoneVerified);
        }
      } catch (e) {
        console.error('DOM削除エラー:', e);
      }
    }
  }
})();