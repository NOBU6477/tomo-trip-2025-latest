/**
 * トークンエラーとJSONパース問題を修正するスクリプト
 * "Unexpected token ':'" エラーを修正し、JSONデータの整合性を保証します
 */

(function() {
  // グローバルフラグを確認してスクリプトの重複実行を防止
  if (window.translationJsonFixApplied) {
    console.log('JSON修正スクリプトは既に実行済みです');
    return;
  }
  
  // グローバルフラグを設定
  window.translationJsonFixApplied = true;
  
  console.log('JSON修正スクリプトを読み込みました');
  
  // 安全なJSON操作のためのユーティリティ関数
  function safeJSONStringify(obj) {
    try {
      if (obj === null || obj === undefined) {
        return '{}';
      }
      return JSON.stringify(obj);
    } catch (e) {
      console.error('JSON文字列化エラー:', e);
      return '{}';
    }
  }
  
  function safeJSONParse(str) {
    try {
      if (!str || typeof str !== 'string') {
        return {};
      }
      return JSON.parse(str);
    } catch (e) {
      console.error('JSONパースエラー:', e);
      return {};
    }
  }
  
  // セッションストレージとローカルストレージの安全なアクセス - プロトタイプ拡張ではなくヘルパー関数として実装
  // Storage.prototypeを直接変更すると予期せぬ副作用が発生するため、より安全なアプローチに変更
  
  // 安全なセッションストレージ操作
  window.safeSessionSet = function(key, value) {
    try {
      if (typeof value === 'object') {
        sessionStorage.setItem(key, safeJSONStringify(value));
      } else {
        sessionStorage.setItem(key, value);
      }
      return true;
    } catch (e) {
      console.error('セッションストレージへの保存に失敗しました:', e);
      return false;
    }
  };
  
  window.safeSessionGet = function(key) {
    try {
      const value = sessionStorage.getItem(key);
      if (value && typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        return safeJSONParse(value);
      }
      return value;
    } catch (e) {
      console.error('セッションストレージからの取得に失敗しました:', e);
      return null;
    }
  };
  
  // 安全なローカルストレージ操作
  window.safeLocalSet = function(key, value) {
    try {
      if (typeof value === 'object') {
        localStorage.setItem(key, safeJSONStringify(value));
      } else {
        localStorage.setItem(key, value);
      }
      return true;
    } catch (e) {
      console.error('ローカルストレージへの保存に失敗しました:', e);
      return false;
    }
  };
  
  window.safeLocalGet = function(key) {
    try {
      const value = localStorage.getItem(key);
      if (value && typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        return safeJSONParse(value);
      }
      return value;
    } catch (e) {
      console.error('ローカルストレージからの取得に失敗しました:', e);
      return null;
    }
  };
  
  // セッション保存の安全なラッパー
  window.saveTouristSession = function(userData) {
    try {
      if (!userData) return;
      
      // currentUserとtouristDataを同期
      window.safeSessionSet('currentUser', userData);
      window.safeLocalSet('touristData', userData);
      
      console.log('観光客セッションを安全に保存しました');
    } catch (e) {
      console.error('観光客セッション保存エラー:', e);
    }
  };
  
  // ガイドセッション保存の安全なラッパー
  window.saveGuideSession = function(userData) {
    try {
      if (!userData) return;
      
      // currentUserとguideDataを同期
      window.safeSessionSet('currentUser', userData);
      window.safeLocalSet('guideData', userData);
      
      console.log('ガイドセッションを安全に保存しました');
    } catch (e) {
      console.error('ガイドセッション保存エラー:', e);
    }
  };
  
  // 既存の観光客データをチェックして修正
  function fixExistingTouristData() {
    try {
      // セッションストレージのデータを確認
      const sessionData = window.safeSessionGet('currentUser');
      if (sessionData) {
        if (sessionData.type === 'tourist') {
          // ローカルストレージに同期
          window.safeLocalSet('touristData', sessionData);
          console.log('観光客データをセッションからローカルストレージに同期しました');
        } else if (sessionData.type === 'guide') {
          // ローカルストレージに同期
          window.safeLocalSet('guideData', sessionData);
          console.log('ガイドデータをセッションからローカルストレージに同期しました');
        }
      }
      
      // ローカルストレージのデータを確認
      const touristData = window.safeLocalGet('touristData');
      if (touristData && !sessionData) {
        // セッションストレージに同期
        window.safeSessionSet('currentUser', touristData);
        console.log('観光客データをローカルストレージからセッションに同期しました');
      }
      
      // ガイドデータの確認
      const guideData = window.safeLocalGet('guideData');
      if (guideData && !sessionData && !touristData) {
        // セッションストレージに同期
        window.safeSessionSet('currentUser', guideData);
        console.log('ガイドデータをローカルストレージからセッションに同期しました');
      }
      
      // グローバル変数を更新
      if (!window.currentTouristData) {
        const userData = sessionData || touristData;
        if (userData) {
          window.currentTouristData = userData;
          window.touristLoggedIn = true;
          console.log('グローバル観光客データを更新しました');
        }
      }
      
      // ガイドのグローバル変数も更新
      if (!window.currentGuideData) {
        const userData = sessionData || guideData;
        if (userData && userData.type === 'guide') {
          window.currentGuideData = userData;
          window.guideLoggedIn = true;
          console.log('グローバルガイドデータを更新しました');
        }
      }
    } catch (e) {
      console.error('既存データ修正エラー:', e);
    }
  }
  
  // ページ読み込み完了時にデータ修正を実行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    fixExistingTouristData();
  } else {
    window.addEventListener('load', fixExistingTouristData);
  }
})();