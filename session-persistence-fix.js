/**
 * セッション永続化修正スクリプト
 * 観光客ログイン状態を適切に維持し、ガイドカードクリック時の不適切なログアウトを防止
 */

(function() {
  'use strict';

  console.log('セッション永続化修正スクリプト開始');

  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    initializeSessionPersistence();
    overrideGuideDetailHandlers();
  });

  /**
   * セッション永続化の初期化
   */
  function initializeSessionPersistence() {
    // 現在のログイン状態を確認
    const touristData = localStorage.getItem('touristData');
    
    if (touristData) {
      console.log('既存の観光客ログイン状態を確認:', JSON.parse(touristData));
      
      // セッションデータも同期
      if (!sessionStorage.getItem('currentUser')) {
        sessionStorage.setItem('currentUser', touristData);
      }
    }
  }

  /**
   * ガイド詳細ハンドラーをオーバーライド
   */
  function overrideGuideDetailHandlers() {
    // すべてのガイド詳細リンクを再設定
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // ガイド詳細ボタンかどうかを判定
      const isGuideDetailsButton = target.classList.contains('guide-details-link') ||
                                   target.hasAttribute('data-guide-id') ||
                                   (target.classList.contains('btn') && target.textContent.includes('詳細を見る'));

      if (isGuideDetailsButton) {
        e.preventDefault();
        e.stopPropagation();
        
        // ガイドIDを取得
        let guideId = target.getAttribute('data-guide-id');
        if (!guideId) {
          const guideCard = target.closest('.guide-card');
          if (guideCard) {
            guideId = guideCard.getAttribute('data-guide-id');
          }
        }

        if (!guideId) {
          console.error('ガイドIDが見つかりません');
          return;
        }

        console.log('ガイド詳細ボタンクリック - ガイドID:', guideId);
        
        // ログイン状態を確認（データ削除は行わない）
        const touristData = localStorage.getItem('touristData');
        
        if (touristData) {
          console.log('観光客ログイン済み - ガイド詳細ページに移動');
          // ログイン済みなら直接詳細ページに移動
          window.location.href = `guide-details.html?id=${guideId}`;
        } else {
          console.log('未ログイン - ログイン要求ページに移動');
          // 未ログインならログイン要求ページに移動
          sessionStorage.setItem('pendingGuideId', guideId);
          window.location.href = 'login-required.html';
        }
      }
    });
  }

  /**
   * ログイン状態保護機能
   * 他のスクリプトによる不適切なログアウトを防止
   */
  function protectLoginState() {
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.removeItem = function(key) {
      // touristDataの削除を監視
      if (key === 'touristData') {
        console.warn('touristDataの削除が試行されました - 呼び出し元:', new Error().stack);
        
        // 明示的なログアウト処理でない限り削除を防止
        const isExplicitLogout = new Error().stack.includes('touristLogout') || 
                                new Error().stack.includes('logout');
        
        if (!isExplicitLogout) {
          console.log('不適切なtouristData削除を防止しました');
          return;
        }
      }
      
      // 通常の削除処理を実行
      return originalRemoveItem.call(this, key);
    };
  }

  /**
   * ログイン後の処理
   */
  function handleLoginSuccess(userData) {
    console.log('ログイン成功処理:', userData);
    
    // ペンディング中のガイドIDがあるかチェック
    const pendingGuideId = sessionStorage.getItem('pendingGuideId');
    if (pendingGuideId) {
      console.log('ペンディングガイドID発見:', pendingGuideId);
      sessionStorage.removeItem('pendingGuideId');
      
      // ガイド詳細ページに遷移
      setTimeout(() => {
        window.location.href = `guide-details.html?id=${pendingGuideId}`;
      }, 500);
    }
  }

  // ログイン成功を監視
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    if (key === 'touristData') {
      console.log('観光客ログインデータが保存されました');
      
      // ログイン成功処理を実行
      try {
        const userData = JSON.parse(value);
        handleLoginSuccess(userData);
      } catch (e) {
        console.error('ログインデータの解析に失敗:', e);
      }
    }
    
    return originalSetItem.call(this, key, value);
  };

  // セッション保護を有効化
  protectLoginState();

  console.log('セッション永続化修正スクリプト初期化完了');
})();