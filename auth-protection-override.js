/**
 * 認証保護オーバーライドスクリプト
 * 他のスクリプトによる認証データの削除や改ざんを完全に防止
 */

(function() {
  'use strict';
  
  console.log('認証保護オーバーライド開始');
  
  // 認証関連の有害な関数を無効化（ただし登録中は除外）
  const harmfulFunctions = [
    'cleanupInvalidAuthData',
    'performCompleteLogout', 
    'clearAuthenticationData',
    'updateUIAfterLogout',
    'resetAuthState',
    'logoutUser'
  ];
  
  harmfulFunctions.forEach(funcName => {
    const originalFunction = window[funcName];
    Object.defineProperty(window, funcName, {
      value: function() {
        // 現在登録中または認証データが存在しない場合は元の関数を実行
        if (window.isRegistering || !localStorage.getItem('touristData')) {
          console.log(`${funcName} を許可（登録中または未認証）`);
          return originalFunction ? originalFunction.apply(this, arguments) : false;
        }
        console.log(`認証削除関数 ${funcName} をブロック`);
        return false;
      },
      writable: false,
      configurable: false
    });
  });
  
  // ストレージ操作の完全保護
  const protectedKeys = [
    'touristData',
    'currentUser', 
    'auth_backup_1',
    'auth_backup_2',
    'auth_session_backup',
    'nav_backup'
  ];
  
  const originalLocalRemove = localStorage.removeItem;
  const originalLocalClear = localStorage.clear;
  const originalSessionRemove = sessionStorage.removeItem;
  const originalSessionClear = sessionStorage.clear;
  
  localStorage.removeItem = function(key) {
    // 登録中または認証データが存在しない場合は削除を許可
    if (window.isRegistering || !localStorage.getItem('touristData')) {
      return originalLocalRemove.call(this, key);
    }
    if (protectedKeys.includes(key) || key.includes('tourist') || key.includes('auth_')) {
      console.log('認証データ削除をブロック:', key);
      return;
    }
    return originalLocalRemove.call(this, key);
  };
  
  localStorage.clear = function() {
    // 登録中または認証データが存在しない場合は完全削除を許可
    if (window.isRegistering || !localStorage.getItem('touristData')) {
      return originalLocalClear.call(this);
    }
    
    console.log('localStorage全削除をブロック - 認証データを保護');
    const backupData = {};
    protectedKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) backupData[key] = data;
    });
    
    originalLocalClear.call(this);
    
    Object.keys(backupData).forEach(key => {
      localStorage.setItem(key, backupData[key]);
    });
  };
  
  sessionStorage.removeItem = function(key) {
    if (protectedKeys.includes(key) || key.includes('tourist') || key.includes('auth_')) {
      console.log('セッション認証データ削除をブロック:', key);
      return;
    }
    return originalSessionRemove.call(this, key);
  };
  
  sessionStorage.clear = function() {
    console.log('sessionStorage全削除をブロック - 認証データを保護');
    const backupData = {};
    protectedKeys.forEach(key => {
      const data = sessionStorage.getItem(key);
      if (data) backupData[key] = data;
    });
    
    originalSessionClear.call(this);
    
    Object.keys(backupData).forEach(key => {
      sessionStorage.setItem(key, backupData[key]);
    });
  };
  
  console.log('認証保護オーバーライド完了');
})();