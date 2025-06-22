/**
 * リダイレクト原因特定用のデバッグスクリプト
 * window.locationの変更を監視し、どのスクリプトがリダイレクトを起こしているかを特定
 */

(function() {
  'use strict';

  console.log('🔍 リダイレクトデバッグトラッカー開始');

  // 元のwindow.locationメソッドを保存
  const originalReplace = window.location.replace;
  const originalAssign = window.location.assign;
  const originalHref = window.location.href;

  // window.location.replaceを監視
  window.location.replace = function(url) {
    console.error('🚨 REDIRECT DETECTED - location.replace:', url);
    console.error('📍 Stack trace:', new Error().stack);
    
    // login-required.htmlへのリダイレクトを完全にブロック
    if (url.includes('login-required.html')) {
      console.error('❌ login-required.htmlへのリダイレクトをブロックしました');
      return;
    }
    
    return originalReplace.call(this, url);
  };

  // window.location.assignを監視
  window.location.assign = function(url) {
    console.error('🚨 REDIRECT DETECTED - location.assign:', url);
    console.error('📍 Stack trace:', new Error().stack);
    
    if (url.includes('login-required.html')) {
      console.error('❌ login-required.htmlへのリダイレクトをブロックしました');
      return;
    }
    
    return originalAssign.call(this, url);
  };

  // window.location.hrefの設定を監視
  let hrefValue = window.location.href;
  Object.defineProperty(window.location, 'href', {
    get: function() {
      return hrefValue;
    },
    set: function(url) {
      console.error('🚨 REDIRECT DETECTED - location.href:', url);
      console.error('📍 Stack trace:', new Error().stack);
      
      if (url.includes('login-required.html')) {
        console.error('❌ login-required.htmlへのリダイレクトをブロックしました');
        return;
      }
      
      hrefValue = url;
      window.location.replace(url);
    }
  });

  // 認証チェック関数の呼び出しを監視
  const monitorFunctions = ['requireAuthentication', 'checkAuthStatus', 'validateAuth'];
  
  monitorFunctions.forEach(funcName => {
    if (window[funcName]) {
      const originalFunc = window[funcName];
      window[funcName] = function(...args) {
        console.log(`🔍 認証関数呼び出し: ${funcName}`, args);
        console.log('📍 Stack trace:', new Error().stack);
        return originalFunc.apply(this, args);
      };
    }
  });

  // ページ読み込み時の認証データ確認
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 ページ読み込み完了 - 認証データ確認');
    console.log('localStorage touristData:', localStorage.getItem('touristData'));
    console.log('sessionStorage currentUser:', sessionStorage.getItem('currentUser'));
    console.log('sessionStorage pendingGuideId:', sessionStorage.getItem('pendingGuideId'));
  });

  // 5秒ごとに認証状態をレポート
  setInterval(() => {
    const touristData = localStorage.getItem('touristData');
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (touristData || currentUser) {
      console.log('✅ 認証データ存在確認');
    } else {
      console.log('❌ 認証データなし');
    }
  }, 5000);

})();