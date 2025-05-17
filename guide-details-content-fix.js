/**
 * ガイド詳細ページのコンテンツ修正スクリプト
 * ログイン状態に応じてコンテンツを適切に表示します
 */

(function() {
  // グローバルフラグを確認してスクリプトの重複実行を防止
  if (window.guideDetailsContentFixLoaded) {
    console.log('ガイド詳細コンテンツ修正スクリプトは既に実行済みです');
    return;
  }
  
  // グローバルフラグを設定
  window.guideDetailsContentFixLoaded = true;
  
  console.log('ガイド詳細コンテンツ修正スクリプトを読み込みました');

  // DOMの準備ができたら実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setupPageStructure();
  } else {
    document.addEventListener('DOMContentLoaded', setupPageStructure, { once: true });
  }
  
  /**
   * ページ構造の確認と修正
   */
  function setupPageStructure() {
    console.log('ガイド詳細ページ構造の確認を開始します');
    
    // ガイド詳細ページかどうかを確認
    if (!window.location.href.includes('guide-details.html')) {
      console.log('このページはガイド詳細ページではありません');
      return;
    }
    
    // メインコンテンツを探す
    const mainContent = document.querySelector('.container.py-5');
    if (!mainContent) {
      console.log('メインコンテンツが見つかりません');
      return;
    }
    
    // ログイン状態を安全に確認
    let isLoggedIn = false;
    try {
      const userSessionStr = sessionStorage.getItem('currentUser');
      const localUserDataStr = localStorage.getItem('touristData') || localStorage.getItem('guideData');
      isLoggedIn = !!(userSessionStr || localUserDataStr);
    } catch (e) {
      console.error('ログイン状態の確認中にエラーが発生しました:', e.message);
    }
    
    console.log('ガイド詳細構造修正: ログイン状態=', isLoggedIn ? 'ログイン済み' : '未ログイン');
    
    try {
      // ログイン要求コンテナと詳細コンテンツを確認
      const loginRequiredContainer = document.querySelector('.login-required-container');
      const guideDetailsContent = document.getElementById('guide-details-content');
      
      // 既存のコンテンツIDがあるか確認
      if (!guideDetailsContent) {
        console.log('ガイド詳細コンテンツIDが存在しないため、ページ構造を修正します');
        
        // メインコンテンツにID付与（ログイン状態に関わらず）
        mainContent.id = 'guide-details-content';
        
        if (isLoggedIn) {
          // ログイン済みの場合
          if (loginRequiredContainer) {
            loginRequiredContainer.style.display = 'none';
            console.log('ログイン要求コンテナを非表示にしました');
          }
          
          mainContent.style.display = 'block';
          console.log('ガイド詳細コンテンツを表示しました');
        } else {
          // 未ログインの場合
          if (loginRequiredContainer) {
            loginRequiredContainer.style.display = 'block';
            console.log('ログイン要求コンテナを表示しました');
          }
          
          mainContent.style.display = 'none';
          console.log('ガイド詳細コンテンツを非表示にしました');
        }
      } else if (isLoggedIn) {
        // 既存のIDがあり、ログイン済みの場合
        if (loginRequiredContainer) {
          loginRequiredContainer.style.display = 'none';
        }
        guideDetailsContent.style.display = 'block';
        console.log('既存のガイド詳細コンテンツの表示状態を更新しました');
      }
    } catch (error) {
      console.error('ガイド詳細構造修正中にエラーが発生しました:', error.message);
    }
  }
})();