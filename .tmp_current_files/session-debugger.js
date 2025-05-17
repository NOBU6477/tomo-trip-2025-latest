/**
 * セッションデバッグ機能
 * ユーザータイプと認証状態を追跡して問題を診断します
 */

document.addEventListener('DOMContentLoaded', function() {
  // デバッグログを有効にする (開発環境でのみ使用)
  const enableDebug = true;
  
  // 現在のセッション状態をチェック
  function debugSessionState() {
    if (!enableDebug) return;
    
    try {
      // セッションストレージとローカルストレージの状態を確認
      const sessionUser = JSON.parse(sessionStorage.getItem('currentUser'));
      const localTouristData = JSON.parse(localStorage.getItem('touristData'));
      
      console.group('セッション状態デバッグ情報');
      console.log('現在のページ:', window.location.pathname);
      console.log('セッションストレージ (currentUser):', sessionUser);
      console.log('ローカルストレージ (touristData):', localTouristData);
      
      // ユーザータイプの整合性を確認
      if (sessionUser && localTouristData) {
        if (sessionUser.type !== localTouristData.type) {
          console.warn('⚠️ ユーザータイプの不一致:', {
            'sessionUser.type': sessionUser.type,
            'localTouristData.type': localTouristData.type
          });
        } else {
          console.log('✓ ユーザータイプの一致:', sessionUser.type);
        }
      }
      
      // URLとユーザータイプの整合性を確認
      if (sessionUser) {
        const isGuidePage = window.location.pathname.includes('guide-profile.html');
        const isTouristPage = window.location.pathname.includes('tourist-profile.html');
        
        if (isGuidePage && sessionUser.type !== 'guide') {
          console.warn('⚠️ ガイドページに観光客ユーザーでアクセス:', sessionUser.type);
        } else if (isTouristPage && sessionUser.type !== 'tourist') {
          console.warn('⚠️ 観光客ページにガイドユーザーでアクセス:', sessionUser.type);
        }
      }
      
      console.groupEnd();
    } catch (err) {
      console.error('セッションデバッグ中にエラーが発生しました:', err);
    }
  }
  
  // ページロード時に実行
  debugSessionState();
  
  // ログイン状態変更を監視
  const originalSetItem = sessionStorage.setItem;
  sessionStorage.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    if (key === 'currentUser') {
      console.log('セッション変更検出:', key);
      debugSessionState();
    }
  };
  
  const originalRemoveItem = sessionStorage.removeItem;
  sessionStorage.removeItem = function(key) {
    if (key === 'currentUser') {
      console.log('セッション削除検出:', key);
    }
    originalRemoveItem.call(this, key);
    if (key === 'currentUser') {
      debugSessionState();
    }
  };
});