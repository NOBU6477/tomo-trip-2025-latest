/**
 * ガイド詳細ページアクセス修正スクリプト
 * 開発中の観光客ログイン機能によるアクセス制限を解除
 */

(function() {
  'use strict';

  // ページ読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixGuideAccess);
  } else {
    fixGuideAccess();
  }

  function fixGuideAccess() {
    console.log('ガイド詳細ページアクセス修正を実行中...');
    
    // ガイド詳細ページかどうかを確認
    if (window.location.pathname.includes('guide-details.html')) {
      forceShowGuideDetails();
    }
    
    // ガイド一覧ページの場合、新規ガイドデータを確認
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      ensureNewGuideVisibility();
    }
  }

  /**
   * ガイド詳細を強制表示
   */
  function forceShowGuideDetails() {
    console.log('ガイド詳細を強制表示中...');
    
    // ログインプロンプトを非表示
    const loginPrompt = document.querySelector('.guide-details-login-prompt');
    if (loginPrompt) {
      loginPrompt.classList.add('d-none');
      loginPrompt.style.display = 'none';
      console.log('ログインプロンプトを非表示にしました');
    }
    
    // ガイド詳細コンテンツを表示
    const detailsContent = document.querySelector('.guide-details-content');
    if (detailsContent) {
      detailsContent.classList.remove('d-none');
      detailsContent.style.display = 'block';
      console.log('ガイド詳細コンテンツを表示しました');
    }
    
    // モーダルダイアログを自動的に閉じる
    setTimeout(() => {
      const modals = document.querySelectorAll('.modal.show');
      modals.forEach(modal => {
        const closeButton = modal.querySelector('.btn-close, .btn[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.click();
        }
      });
    }, 100);
    
    // アクセス制御モーダルを無効化
    const accessModals = document.querySelectorAll('#userTypeAccessModal, #loginModal');
    accessModals.forEach(modal => {
      modal.style.display = 'none';
      if (modal.classList.contains('show')) {
        modal.classList.remove('show');
      }
    });
  }

  /**
   * 新規ガイドの表示を確保
   */
  function ensureNewGuideVisibility() {
    console.log('新規ガイドの表示を確保中...');
    
    // ローカルストレージから新規ガイドデータを取得
    const guides = JSON.parse(localStorage.getItem('guides')) || [];
    const currentUser = getCurrentUserData();
    
    if (currentUser && currentUser.userType === 'guide') {
      // 新規ガイドがガイドリストに含まれているか確認
      const existingGuide = guides.find(g => g.id === currentUser.id);
      
      if (!existingGuide) {
        console.log('新規ガイドをガイドリストに追加中...');
        
        const newGuide = {
          id: currentUser.id,
          name: currentUser.name || '新規ガイド',
          location: currentUser.city || '東京',
          city: currentUser.city || '東京',
          bio: currentUser.bio || '新規登録ガイドです。',
          description: currentUser.bio || '新規登録ガイドです。',
          fee: currentUser.fee || 6000,
          price: currentUser.fee || 6000,
          rating: '新規',
          reviews: '0',
          imageUrl: 'https://placehold.co/400x300/e3f2fd/1976d2/png?text=Guide',
          specialties: ['観光案内'],
          keywords: ['観光案内'],
          languages: ['日本語'],
          userType: 'guide'
        };
        
        guides.push(newGuide);
        localStorage.setItem('guides', JSON.stringify(guides));
        
        // ガイド詳細データも保存
        const guideDetailsData = JSON.parse(localStorage.getItem('guideDetailsData')) || {};
        guideDetailsData[currentUser.id] = newGuide;
        localStorage.setItem('guideDetailsData', JSON.stringify(guideDetailsData));
        
        console.log('新規ガイドをストレージに保存しました');
        
        // ページを再読み込みしてガイドカードを表示
        setTimeout(() => {
          if (window.location.hash.includes('guides')) {
            window.location.reload();
          }
        }, 500);
      }
    }
  }

  /**
   * 現在のユーザーデータを取得
   */
  function getCurrentUserData() {
    try {
      const sessionUser = sessionStorage.getItem('currentUser');
      if (sessionUser) {
        return JSON.parse(sessionUser);
      }
      
      const registeredUser = sessionStorage.getItem('registeredUser');
      if (registeredUser) {
        return JSON.parse(registeredUser);
      }
      
      return null;
    } catch (error) {
      console.error('ユーザーデータ取得エラー:', error);
      return null;
    }
  }

  // グローバル関数として公開
  window.forceShowGuideDetails = forceShowGuideDetails;
  window.ensureNewGuideVisibility = ensureNewGuideVisibility;

})();

console.log('ガイドアクセス修正スクリプトがロードされました');