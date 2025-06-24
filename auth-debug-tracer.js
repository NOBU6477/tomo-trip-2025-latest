/**
 * 認証デバッグトレーサー
 * 認証データの変更を完全に追跡し、問題の原因を特定
 */

(function() {
  'use strict';
  
  console.log('=== 認証デバッグトレーサー開始 ===');
  
  // 認証データの初期状態を記録
  let initialAuthState = {
    localStorage: localStorage.getItem('touristData'),
    sessionStorage: sessionStorage.getItem('currentUser'),
    timestamp: Date.now()
  };
  
  console.log('初期認証状態:', initialAuthState);
  
  // ストレージ操作を完全に監視
  const originalSetItem = localStorage.setItem;
  const originalRemoveItem = localStorage.removeItem;
  const originalClear = localStorage.clear;
  const sessionSetItem = sessionStorage.setItem;
  const sessionRemoveItem = sessionStorage.removeItem;
  const sessionClear = sessionStorage.clear;
  
  // localStorage監視
  localStorage.setItem = function(key, value) {
    if (key.includes('tourist') || key.includes('auth')) {
      console.log('🔍 localStorage.setItem:', key, '=', value);
      console.trace('設定元の呼び出しスタック:');
    }
    return originalSetItem.call(this, key, value);
  };
  
  localStorage.removeItem = function(key) {
    if (key.includes('tourist') || key.includes('auth')) {
      console.warn('⚠️ localStorage.removeItem:', key);
      console.trace('削除元の呼び出しスタック:');
    }
    return originalRemoveItem.call(this, key);
  };
  
  localStorage.clear = function() {
    console.error('🚨 localStorage.clear() 呼び出し');
    console.trace('クリア元の呼び出しスタック:');
    return originalClear.call(this);
  };
  
  // sessionStorage監視
  sessionStorage.setItem = function(key, value) {
    if (key.includes('tourist') || key.includes('auth') || key === 'currentUser') {
      console.log('🔍 sessionStorage.setItem:', key, '=', value);
      console.trace('設定元の呼び出しスタック:');
    }
    return sessionSetItem.call(this, key, value);
  };
  
  sessionStorage.removeItem = function(key) {
    if (key.includes('tourist') || key.includes('auth') || key === 'currentUser') {
      console.warn('⚠️ sessionStorage.removeItem:', key);
      console.trace('削除元の呼び出しスタック:');
    }
    return sessionRemoveItem.call(this, key);
  };
  
  sessionStorage.clear = function() {
    console.error('🚨 sessionStorage.clear() 呼び出し');
    console.trace('クリア元の呼び出しスタック:');
    return sessionClear.call(this);
  };
  
  // DOM変更監視
  const registerButton = document.getElementById('registerDropdown');
  if (registerButton) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          console.log('🔄 登録ボタンテキスト変更:', registerButton.textContent);
          console.trace('変更元の呼び出しスタック:');
        }
      });
    });
    
    observer.observe(registerButton, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // ページイベント監視
  window.addEventListener('beforeunload', function() {
    console.log('📤 beforeunload - 現在の認証状態:');
    console.log('  localStorage.touristData:', localStorage.getItem('touristData'));
    console.log('  sessionStorage.currentUser:', sessionStorage.getItem('currentUser'));
  });
  
  window.addEventListener('pagehide', function() {
    console.log('📤 pagehide - 現在の認証状態:');
    console.log('  localStorage.touristData:', localStorage.getItem('touristData'));
    console.log('  sessionStorage.currentUser:', sessionStorage.getItem('currentUser'));
  });
  
  window.addEventListener('pageshow', function(event) {
    console.log('📥 pageshow (persisted:', event.persisted, ') - 現在の認証状態:');
    console.log('  localStorage.touristData:', localStorage.getItem('touristData'));
    console.log('  sessionStorage.currentUser:', sessionStorage.getItem('currentUser'));
  });
  
  window.addEventListener('load', function() {
    console.log('📥 load - 現在の認証状態:');
    console.log('  localStorage.touristData:', localStorage.getItem('touristData'));
    console.log('  sessionStorage.currentUser:', sessionStorage.getItem('currentUser'));
  });
  
  // DOMContentLoaded監視
  document.addEventListener('DOMContentLoaded', function() {
    console.log('📥 DOMContentLoaded - 現在の認証状態:');
    console.log('  localStorage.touristData:', localStorage.getItem('touristData'));
    console.log('  sessionStorage.currentUser:', sessionStorage.getItem('currentUser'));
  });
  
  // 定期チェック
  setInterval(function() {
    const currentAuth = localStorage.getItem('touristData');
    const currentSession = sessionStorage.getItem('currentUser');
    
    if (currentAuth !== initialAuthState.localStorage || 
        currentSession !== initialAuthState.sessionStorage) {
      console.log('🔄 認証状態変更検出:');
      console.log('  前回 localStorage:', initialAuthState.localStorage);
      console.log('  現在 localStorage:', currentAuth);
      console.log('  前回 sessionStorage:', initialAuthState.sessionStorage);
      console.log('  現在 sessionStorage:', currentSession);
      
      // 状態を更新
      initialAuthState.localStorage = currentAuth;
      initialAuthState.sessionStorage = currentSession;
      initialAuthState.timestamp = Date.now();
    }
  }, 1000);
  
  // グローバル関数の監視
  const dangerousFunctions = [
    'cleanupInvalidAuthData',
    'performCompleteLogout',
    'clearAuthenticationData',
    'updateUIAfterLogout'
  ];
  
  dangerousFunctions.forEach(funcName => {
    const originalFunc = window[funcName];
    if (originalFunc) {
      window[funcName] = function(...args) {
        console.warn(`🚨 ${funcName} 呼び出し検出`);
        console.trace('呼び出し元:');
        return originalFunc.apply(this, args);
      };
    }
  });
  
  console.log('認証デバッグトレーサー設定完了');
})();