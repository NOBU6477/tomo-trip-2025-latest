/**
 * ガイド登録の電話認証バッジ固定コード
 * ガイド登録フォームでの電話認証バッジ表示を常に消去する
 * 
 * このコードはプロファイルの電話認証状態を表示するバッジを
 * 強制的に消去することで、UIの不一致を防ぐ
 */
(function() {
  console.log('ガイド認証バッジ修正: 初期化');
  
  // DOMが読み込まれたらすぐに実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForceFix);
  } else {
    initForceFix();
  }
  
  // ロード完了時と少し遅延させても実行
  window.addEventListener('load', function() {
    initForceFix();
    // 遅延実行（非同期読み込みへの対応）
    setTimeout(initForceFix, 500);
    setTimeout(initForceFix, 1000);
  });
  
  // モーダル表示時にも実行
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal && modal.id && modal.id.includes('guide')) {
      initForceFix();
    }
  });
  
  // 初期化関数
  function initForceFix() {
    console.log('ガイド認証バッジ修正: 実行開始');
    
    // ガイド用電話認証バッジを常に非表示にする
    forceHideGuideBadge();
    
    // MutationObserverで動的に追加される要素も監視
    setupBadgeObserver();
  }
  
  // ガイド用電話認証バッジを直接非表示
  function forceHideGuideBadge() {
    // 特定のID（guide-phone-verified）を持つ要素
    const guideBadge = document.getElementById('guide-phone-verified');
    if (guideBadge) {
      console.log('ガイド電話認証バッジを発見して非表示化');
      forceHideElement(guideBadge);
    }
    
    // ガイド関連セクション内の認証バッジを全て非表示
    const guideSection = document.querySelector('#guideRegistrationForm, #guideProfileModal, #guideRegistrationModal');
    if (guideSection) {
      const badges = guideSection.querySelectorAll('.badge, .alert-success, button.btn-success');
      badges.forEach(badge => {
        if (badge.textContent && badge.textContent.includes('認証済み')) {
          console.log('ガイドセクション内の認証バッジを非表示化:', badge.textContent);
          forceHideElement(badge);
        }
      });
    }
    
    // ガイド電話認証セクション周辺の緑色要素を探して非表示
    const phoneSection = document.querySelector('#guide-phone-auth-form, [id*="guide"][id*="phone"]');
    if (phoneSection) {
      // 緑色ボタン・アラート・バッジを全て非表示
      const greenElements = phoneSection.querySelectorAll('.btn-success, .alert-success, .badge.bg-success');
      greenElements.forEach(element => {
        console.log('ガイド電話セクション内の緑色要素を非表示化:', element.tagName);
        forceHideElement(element);
      });
      
      // 親要素もチェック
      let parent = phoneSection.parentElement;
      if (parent) {
        const parentBadges = parent.querySelectorAll('.badge, .alert-success, .btn-success');
        parentBadges.forEach(badge => {
          if (badge.textContent && badge.textContent.includes('認証')) {
            console.log('ガイド電話セクション親要素内のバッジを非表示化');
            forceHideElement(badge);
          }
        });
      }
    }
  }
  
  // 動的に追加される要素を監視
  function setupBadgeObserver() {
    // 監視する要素（ドキュメント全体）
    const targetNode = document.body;
    
    // 監視オプション (属性変化、子要素の追加削除、子孫の変化)
    const config = { 
      attributes: true, 
      childList: true, 
      subtree: true,
      attributeFilter: ['class', 'style', 'id'] // クラス、スタイル、ID変更時だけ反応
    };
    
    // コールバック関数
    const callback = function(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 新しい要素が追加された場合
          mutation.addedNodes.forEach(node => {
            // 要素ノードの場合のみ処理
            if (node.nodeType === 1) {
              // ガイド関連の認証バッジかどうか確認
              if ((node.id && node.id.includes('verified')) || 
                  (node.classList && 
                   (node.classList.contains('badge') || 
                    node.classList.contains('alert-success') || 
                    node.classList.contains('btn-success')))) {
                
                // 親要素がガイド関連かどうか確認
                let isGuideRelated = false;
                let element = node;
                
                // 3階層まで親をさかのぼって確認
                for (let i = 0; i < 3 && element; i++) {
                  if (element.id && 
                      (element.id.includes('guide') || element.id.includes('Guide'))) {
                    isGuideRelated = true;
                    break;
                  }
                  element = element.parentElement;
                }
                
                // ガイド関連であれば強制非表示
                if (isGuideRelated) {
                  console.log('動的に追加されたガイド認証バッジを検出:', node.className || node.id);
                  forceHideElement(node);
                }
              }
              
              // 子孫要素も確認
              const badges = node.querySelectorAll('#guide-phone-verified, .badge.bg-success');
              badges.forEach(badge => {
                console.log('動的に追加された要素内のバッジを検出:', badge.id || badge.className);
                forceHideElement(badge);
              });
            }
          });
        }
        else if (mutation.type === 'attributes') {
          // 属性変更の場合、ガイド電話認証系の場合は強制非表示
          const target = mutation.target;
          if (target.id === 'guide-phone-verified' || 
              (target.classList && 
               target.classList.contains('badge') && 
               target.closest('[id*="guide"]'))) {
            console.log('属性変更された認証バッジを検出:', target.id || target.className);
            forceHideElement(target);
          }
        }
      }
    };
    
    // オブザーバーのインスタンス作成と開始
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    
    console.log('バッジ監視オブザーバーを設定しました');
  }
  
  // 要素を完全に非表示化する関数
  function forceHideElement(element) {
    if (!element) return;
    
    // CSSで強制非表示
    element.style.setProperty('display', 'none', 'important');
    element.style.setProperty('visibility', 'hidden', 'important');
    element.style.setProperty('opacity', '0', 'important');
    element.style.setProperty('height', '0', 'important');
    element.style.setProperty('width', '0', 'important');
    element.style.setProperty('overflow', 'hidden', 'important');
    element.style.setProperty('position', 'absolute', 'important');
    element.style.setProperty('pointer-events', 'none', 'important');
    
    // d-none クラスも追加
    element.classList.add('d-none');
    
    // 可能であれば要素を削除
    try {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (e) {
      console.log('要素の削除に失敗:', e);
    }
  }
})();