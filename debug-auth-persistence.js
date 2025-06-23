/**
 * 認証持続性デバッグスクリプト
 * 認証データがどこで失われているかを特定する
 */

console.log('=== 認証デバッグスクリプト開始 ===');

// 現在の認証状態を詳細に確認
function debugAuthState() {
  console.log('--- 認証状態デバッグ ---');
  
  // localStorage確認
  const localKeys = Object.keys(localStorage);
  console.log('localStorage keys:', localKeys);
  
  const touristData = localStorage.getItem('touristData');
  console.log('touristData:', touristData);
  
  if (touristData) {
    try {
      const parsed = JSON.parse(touristData);
      console.log('touristData parsed:', parsed);
    } catch (e) {
      console.error('touristData parse error:', e);
    }
  }
  
  // sessionStorage確認
  const sessionKeys = Object.keys(sessionStorage);
  console.log('sessionStorage keys:', sessionKeys);
  
  const currentUser = sessionStorage.getItem('currentUser');
  console.log('currentUser:', currentUser);
  
  // バックアップデータ確認
  const backup1 = localStorage.getItem('auth_backup_1');
  const backup2 = localStorage.getItem('auth_backup_2');
  console.log('backup1:', backup1);
  console.log('backup2:', backup2);
  
  // グローバル変数確認
  console.log('window.protectTouristAuth:', window.protectTouristAuth);
  console.log('window.touristAuthData:', window.touristAuthData);
  
  // UI状態確認
  const registerBtn = document.getElementById('registerDropdown');
  if (registerBtn) {
    console.log('Register button text:', registerBtn.textContent);
    console.log('Register button element:', registerBtn);
  } else {
    console.log('Register button not found');
  }
  
  console.log('--- 認証状態デバッグ終了 ---');
}

// 即座に実行
debugAuthState();

// 5秒後に再実行
setTimeout(() => {
  console.log('5秒後の認証状態:');
  debugAuthState();
}, 5000);

// ページの読み込み状態を監視
console.log('Document readyState:', document.readyState);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - 認証状態確認:');
    debugAuthState();
  });
}

// window.loadイベント
window.addEventListener('load', () => {
  console.log('Window loaded - 認証状態確認:');
  debugAuthState();
});

// ストレージ変更を監視
window.addEventListener('storage', (e) => {
  console.log('Storage change detected:', e.key, e.oldValue, e.newValue);
  if (e.key === 'touristData') {
    console.log('⚠️ touristData changed!');
    debugAuthState();
  }
});

// ページの可視性変更を監視
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    console.log('Page became visible - 認証状態確認:');
    debugAuthState();
  }
});