/**
 * 電話番号認証セクション内の認証済みバッジをピンポイントで削除
 */
(function() {
  // 実行
  function init() {
    console.log('ピンポイント認証バッジ削除: 実行');
    
    // 即時実行
    removePhoneVerificationBadges();
    
    // モーダル表示時にも削除
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'guideRegistrationModal') {
        setTimeout(removePhoneVerificationBadges, 100);
        setTimeout(removePhoneVerificationBadges, 500); // 遅延実行も追加
      }
    });
    
    // DOMの変更を監視
    const observer = new MutationObserver(function(mutations) {
      removePhoneVerificationBadges();
    });
    
    // body全体の変更を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 電話番号認証セクション内の認証済みバッジを削除
  function removePhoneVerificationBadges() {
    // ガイド登録モーダルを取得
    const guideModal = document.getElementById('guideRegistrationModal');
    if (!guideModal) return;
    
    // 電話番号認証セクションを探す（ラベルから）
    const labels = guideModal.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent && label.textContent.includes('電話番号認証')) {
        // 見つけたラベルの親要素を取得
        const parentSection = label.closest('.form-group, .mb-3, .row') || label.parentElement;
        
        // バッジらしき要素を探す
        const badgeCandidates = [
          ...parentSection.querySelectorAll('.btn-success'),
          ...parentSection.querySelectorAll('.badge'),
          ...parentSection.querySelectorAll('[class*="success"]'),
          ...parentSection.querySelectorAll('button'),
          ...parentSection.querySelectorAll('span')
        ];
        
        // 認証済みテキストを含む要素を削除
        for (const element of badgeCandidates) {
          if (element.textContent && element.textContent.trim() === '認証済み') {
            console.log('認証済みバッジを発見:', element);
            
            // 要素の非表示と位置のリセット
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.height = '0';
            element.style.width = '0';
            element.style.position = 'absolute';
            element.style.left = '-9999px';
            element.style.pointerEvents = 'none';
            
            if (element.parentElement) {
              try {
                // 可能であれば削除を試みる
                element.parentElement.removeChild(element);
              } catch (error) {
                console.log('削除エラー:', error);
              }
            }
          }
        }
        
        // 未表示テキストがなければ追加
        const hasVerifyText = Array.from(parentSection.querySelectorAll('*')).some(el => 
          el.textContent && 
          (el.textContent.trim() === '電話認証' || el.textContent.trim() === '未表示') &&
          getComputedStyle(el).display !== 'none'
        );
        
        if (!hasVerifyText) {
          // 電話認証テキストを追加
          const verifyText = document.createElement('span');
          verifyText.className = 'text-verification-status ms-2';
          verifyText.textContent = '電話認証';
          verifyText.style.cursor = 'pointer';
          verifyText.onclick = function() {
            const phoneModal = document.getElementById('phoneVerificationModal');
            if (phoneModal) {
              const modal = new bootstrap.Modal(phoneModal);
              modal.show();
            }
          };
          
          // 適切な場所に挿入
          if (label.nextSibling) {
            label.parentNode.insertBefore(verifyText, label.nextSibling);
          } else {
            label.parentNode.appendChild(verifyText);
          }
        }
      }
    }
  }
  
  // ページ読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();