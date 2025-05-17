/**
 * 電話認証関連の修正スクリプト
 * 認証バッジと未表示テキスト表示問題の修正
 */

(function() {
  // DOMが完全に読み込まれた後に実行
  document.addEventListener('DOMContentLoaded', function() {
    // モーダルイベントリスナーを設定
    setupModalEventListeners();
    // DOM変更の監視を開始
    observeDOMChanges();
  });

  /**
   * モーダルイベントリスナーの設定
   */
  function setupModalEventListeners() {
    // ガイド登録モーダルが表示されたとき
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal) {
      guideModal.addEventListener('shown.bs.modal', function() {
        fixPhoneVerificationDisplay(guideModal);
      });
    }

    // 観光客登録モーダルが表示されたとき
    const touristModal = document.getElementById('registerTouristModal');
    if (touristModal) {
      touristModal.addEventListener('shown.bs.modal', function() {
        fixPhoneVerificationDisplay(touristModal);
      });
    }
  }

  /**
   * 電話認証表示の修正
   */
  function fixPhoneVerificationDisplay(modal) {
    // すべての認証バッジの表示を確認
    const successBadges = modal.querySelectorAll('.badge.bg-success');
    successBadges.forEach(badge => {
      // バッジが非表示になっていたら表示する
      if (getComputedStyle(badge).display === 'none' || 
          getComputedStyle(badge).visibility === 'hidden' ||
          badge.style.display === 'none' ||
          badge.style.visibility === 'hidden') {
        badge.style.display = 'inline-block';
        badge.style.visibility = 'visible';
        badge.style.opacity = '1';
      }
      
      // 隣接する「未表示」テキストを非表示にする
      const nextElement = badge.nextElementSibling;
      if (nextElement && nextElement.id && 
          (nextElement.id === 'guide-phone-number' || nextElement.id === 'tourist-phone-number')) {
        nextElement.style.display = 'none';
      }
    });
  }

  /**
   * DOM変更の監視を設定
   */
  function observeDOMChanges() {
    // モーダルコンテンツを監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // 要素が追加された場合
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 追加された要素内で認証バッジの表示を修正
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // 要素ノードの場合のみ
              const modal = findParentModal(node);
              if (modal) {
                fixPhoneVerificationDisplay(modal);
              }
            }
          });
        }
      });
    });
    
    // ドキュメント全体を監視対象に
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 親モーダルを検索
   */
  function findParentModal(element) {
    if (!element || element === document.body) return null;
    if (element.classList && element.classList.contains('modal')) return element;
    return findParentModal(element.parentElement);
  }
})();