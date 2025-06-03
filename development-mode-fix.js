/**
 * 開発モード修正スクリプト
 * 開発中機能による制限を解除し、スムーズなユーザー体験を提供
 */

(function() {
  'use strict';

  // ページ読み込み時に実行
  document.addEventListener('DOMContentLoaded', function() {
    applyDevelopmentModeFixes();
    
    // 動的に追加される要素も監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          applyDevelopmentModeFixes();
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });

  function applyDevelopmentModeFixes() {
    // 開発中メッセージを非表示
    hideDevMessages();
    
    // アクセス制限モーダルを無効化
    disableAccessModals();
    
    // ガイド詳細コンテンツを強制表示
    forceShowContent();
    
    // 観光客ログイン機能の開発中制限を解除
    enableTouristAccess();
  }

  /**
   * 開発中メッセージを非表示
   */
  function hideDevMessages() {
    const devMessages = [
      '.alert:contains("開発中")',
      '.alert:contains("準備中")',
      '[class*="dev-message"]',
      '[id*="dev-message"]'
    ];
    
    devMessages.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'none';
          el.classList.add('d-none');
        });
      } catch (e) {
        // セレクタが無効な場合は無視
      }
    });
    
    // テキストベースの検索
    const alertElements = document.querySelectorAll('.alert, .modal-body, .card-body');
    alertElements.forEach(el => {
      if (el.textContent.includes('開発中') || 
          el.textContent.includes('準備中') ||
          el.textContent.includes('現在はガイド登録のみ利用可能')) {
        el.style.display = 'none';
        el.classList.add('d-none');
      }
    });
  }

  /**
   * アクセス制限モーダルを無効化
   */
  function disableAccessModals() {
    const modalIds = [
      'userTypeAccessModal',
      'loginRequiredModal',
      'accessDeniedModal'
    ];
    
    modalIds.forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        // モーダルを非表示
        modal.style.display = 'none';
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        
        // backdrop を削除
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        
        // body のスクロール制限を解除
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    });
  }

  /**
   * ガイド詳細コンテンツを強制表示
   */
  function forceShowContent() {
    // ガイド詳細ページ
    const detailsContent = document.querySelector('.guide-details-content');
    const loginPrompt = document.querySelector('.guide-details-login-prompt');
    
    if (detailsContent) {
      detailsContent.classList.remove('d-none');
      detailsContent.style.display = 'block';
    }
    
    if (loginPrompt) {
      loginPrompt.classList.add('d-none');
      loginPrompt.style.display = 'none';
    }
    
    // その他の制限されたコンテンツ
    const restrictedElements = document.querySelectorAll('.content-restricted, .login-required');
    restrictedElements.forEach(el => {
      el.classList.remove('content-restricted', 'login-required', 'd-none');
      el.style.display = '';
    });
  }

  /**
   * 観光客アクセスを有効化
   */
  function enableTouristAccess() {
    // セッションストレージに仮の観光客ログイン状態を設定
    if (!sessionStorage.getItem('touristLoggedIn')) {
      sessionStorage.setItem('touristLoggedIn', 'true');
      sessionStorage.setItem('userType', 'tourist');
      
      // 仮の観光客ユーザー情報を設定
      const tempTourist = {
        id: 'temp_tourist_' + Date.now(),
        userType: 'tourist',
        name: '観光客ユーザー',
        email: 'tourist@example.com',
        isLoggedIn: true
      };
      
      sessionStorage.setItem('currentUser', JSON.stringify(tempTourist));
      console.log('開発モード: 仮の観光客ログイン状態を設定しました');
    }
  }

  // ガイドカードのクリックイベントを修正
  document.addEventListener('click', function(e) {
    const guideCard = e.target.closest('.guide-card');
    const detailButton = e.target.closest('a[href*="guide-details.html"]');
    
    if (guideCard || detailButton) {
      // アクセス制限を一時的に解除
      setTimeout(() => {
        forceShowContent();
        disableAccessModals();
      }, 100);
    }
  });

  // グローバル関数として公開
  window.applyDevelopmentModeFixes = applyDevelopmentModeFixes;
  window.forceShowContent = forceShowContent;

})();

console.log('開発モード修正スクリプトがロードされました');