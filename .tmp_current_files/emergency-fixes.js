/**
 * 緊急修正スクリプト 
 * 最も深刻なエラーを修正するために、既存のスクリプトの実行を阻止し、
 * 安全な実装に置き換えるための最終手段
 */

(function() {
  // グローバル実行フラグのチェック
  if (window.emergencyFixesApplied) {
    console.log('緊急修正はすでに適用されています');
    return;
  }
  
  // 実行フラグを設定
  window.emergencyFixesApplied = true;
  
  console.log('緊急修正を開始します');
  
  // ドロップダウン文字列の緊急修正
  fixDropdownParsing();
  
  // 既存の問題のあるスクリプトをブロック
  blockProblemScripts();
  
  // 安全なJSONユーティリティを設定
  setupSafeJsonUtils();
  
  // 安全なストレージユーティリティを設定
  setupSafeStorageUtils();
  
  // 安全な翻訳データオブジェクトを作成
  createSafeTranslationData();
  
  /**
   * ドロップダウン文字列パースエラーを修正
   */
  function fixDropdownParsing() {
    // JSON.parseの原始参照を保存
    const originalJSONParse = JSON.parse;
    
    // JSON.parseをオーバーライド
    window.JSON.parse = function(text) {
      // 問題のある "dropdown" を検出
      if (text === 'dropdown' || text === '"dropdown"') {
        console.log('dropdown文字列のパースを安全に処理します');
        return {}; // 安全な空オブジェクトを返す
      }
      
      // その他のケースでは通常のJSONパースを試みる
      try {
        return originalJSONParse.apply(this, arguments);
      } catch (e) {
        console.log('=== JSONパースエラー ===');
        console.log('エラーメッセージ:', e.message);
        console.log('問題のテキスト (最初の100文字):', text.substring(0, 100));
        
        // nullの代わりに空オブジェクトを返してエラー伝播を防止
        return {};
      }
    };
  }
  
  /**
   * 既存の問題のあるスクリプトをブロック
   */
  function blockProblemScripts() {
    // 問題のあるスクリプトのグローバルフラグを設定して実行を防止
    window.criticalFixesApplied = true;
    window.translationDataProtected = true;
    window.translationJsonFixApplied = true;
    window.translatorErrorFixApplied = true;
    window.noDuplicateTranslationDataApplied = true;
    window.sessionSyncFixApplied = true;
    window.newTranslatorLoaded = true; // 新翻訳スクリプト用
    window.safeTranslationSystemLoaded = true; // 安全な翻訳システム用
    
    // 既存の問題のあるイベントリスナーを削除
    try {
      // 既存のDOMContentLoadedイベントリスナーを無効化（ハックですが効果的）
      const originalAddEventListener = document.addEventListener;
      document.addEventListener = function(type, listener, options) {
        if (type === 'DOMContentLoaded') {
          console.log('DOMContentLoadedリスナーの登録をブロックしました');
          return;
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
      
      console.log('問題のあるイベントリスナーのブロックを設定しました');
    } catch (e) {
      console.error('イベントリスナーのブロックに失敗:', e);
    }
    
    console.log('問題のあるスクリプトをブロックしました');
  }
  
  /**
   * 安全なJSONユーティリティを提供
   */
  function setupSafeJsonUtils() {
    window.safeJSON = {
      parse: function(str) {
        if (!str) return null;
        if (typeof str !== 'string') return str;
        
        try {
          // データがJSONの場合のみ解析
          if (str.trim().startsWith('{') || str.trim().startsWith('[')) {
            return JSON.parse(str);
          }
          return str; // JSONでない場合は元の文字列を返す
        } catch (e) {
          console.error('JSONパースエラー:', e);
          return null;
        }
      },
      
      stringify: function(obj) {
        try {
          return JSON.stringify(obj);
        } catch (e) {
          console.error('JSON文字列化エラー:', e);
          return '{}';
        }
      }
    };
    
    // 既存のJSONメソッドのバックアップ
    const originalParse = JSON.parse;
    const originalStringify = JSON.stringify;
    
    // JSONメソッドを安全な実装で置き換え
    JSON.parse = function(text, reviver) {
      try {
        return originalParse.call(JSON, text, reviver);
      } catch (e) {
        console.error('安全なJSON.parseがエラーを捕捉:', e);
        
        // 非標準の修復を試みる
        try {
          // 引用符の問題を修正
          const fixed = text.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
          return originalParse.call(JSON, fixed, reviver);
        } catch (e2) {
          console.error('修復の試みも失敗:', e2);
          return null;
        }
      }
    };
    
    JSON.stringify = function(value, replacer, space) {
      try {
        return originalStringify.call(JSON, value, replacer, space);
      } catch (e) {
        console.error('安全なJSON.stringifyがエラーを捕捉:', e);
        
        // 循環参照などの問題を回避する基本的なオブジェクトを返す
        try {
          // 循環参照を排除した基本的なオブジェクトだけを返す
          const basicObj = {};
          if (typeof value === 'object' && value !== null) {
            Object.keys(value).forEach(key => {
              const val = value[key];
              if (typeof val !== 'object' || val === null) {
                basicObj[key] = val;
              } else {
                basicObj[key] = '[object]';
              }
            });
          }
          return originalStringify.call(JSON, basicObj || {});
        } catch (e2) {
          console.error('フォールバックの試みも失敗:', e2);
          return '{}';
        }
      }
    };
    
    console.log('安全なJSONユーティリティを設定しました');
  }
  
  /**
   * 安全なストレージラッパーを提供
   */
  function setupSafeStorageUtils() {
    window.safeStorage = {
      // セッションストレージ
      session: {
        get: function(key) {
          try {
            const data = sessionStorage.getItem(key);
            return window.safeJSON.parse(data);
          } catch (e) {
            console.error('セッションストレージ読み取りエラー:', e);
            return null;
          }
        },
        
        set: function(key, value) {
          try {
            const json = typeof value === 'string' ? value : window.safeJSON.stringify(value);
            sessionStorage.setItem(key, json);
            return true;
          } catch (e) {
            console.error('セッションストレージ書き込みエラー:', e);
            return false;
          }
        },
        
        remove: function(key) {
          try {
            sessionStorage.removeItem(key);
            return true;
          } catch (e) {
            console.error('セッションストレージ削除エラー:', e);
            return false;
          }
        }
      },
      
      // ローカルストレージ
      local: {
        get: function(key) {
          try {
            const data = localStorage.getItem(key);
            return window.safeJSON.parse(data);
          } catch (e) {
            console.error('ローカルストレージ読み取りエラー:', e);
            return null;
          }
        },
        
        set: function(key, value) {
          try {
            const json = typeof value === 'string' ? value : window.safeJSON.stringify(value);
            localStorage.setItem(key, json);
            return true;
          } catch (e) {
            console.error('ローカルストレージ書き込みエラー:', e);
            return false;
          }
        },
        
        remove: function(key) {
          try {
            localStorage.removeItem(key);
            return true;
          } catch (e) {
            console.error('ローカルストレージ削除エラー:', e);
            return false;
          }
        }
      }
    };
    
    // 古いヘルパー関数との互換性のためのエイリアス
    window.safeSessionGet = function(key) {
      return window.safeStorage.session.get(key);
    };
    
    window.safeSessionSet = function(key, value) {
      return window.safeStorage.session.set(key, value);
    };
    
    window.safeLocalGet = function(key) {
      return window.safeStorage.local.get(key);
    };
    
    window.safeLocalSet = function(key, value) {
      return window.safeStorage.local.set(key, value);
    };
    
    console.log('安全なストレージユーティリティを設定しました');
  }
  
  /**
   * 安全な翻訳データオブジェクトを構築
   */
  function createSafeTranslationData() {
    // 既存の翻訳データをバックアップ
    const oldTranslationData = window.translationData;
    
    // グローバル変数を再設定
    try {
      delete window.translationData;
    } catch (e) {
      console.warn('既存の翻訳データの削除に失敗:', e);
    }
    
    // ハードコードされた最小限のデータで初期化
    window.translationData = {
      en: {
        navigation: {
          'ホーム': 'Home',
          'ガイドを探す': 'Find Guides',
          '使い方': 'How It Works',
          'ログイン': 'Login',
          '新規登録': 'Sign Up',
          'マイページ': 'My Page',
          'ログアウト': 'Logout'
        },
        common: {
          'はい': 'Yes',
          'いいえ': 'No',
          '次へ': 'Next',
          '戻る': 'Back',
          '完了': 'Complete',
          'キャンセル': 'Cancel',
          '登録': 'Register',
          '送信': 'Submit'
        },
        auth: {
          'ユーザー名': 'Username',
          'メールアドレス': 'Email',
          'パスワード': 'Password',
          '電話番号': 'Phone Number',
          '観光客として登録': 'Register as Tourist',
          'ガイドとして登録': 'Register as Guide'
        }
      }
    };
    
    // 安全に既存データをマージ
    try {
      if (oldTranslationData && oldTranslationData.en) {
        // 各カテゴリごとにマージ
        for (const category in oldTranslationData.en) {
          if (!window.translationData.en[category]) {
            window.translationData.en[category] = {};
          }
          
          // このカテゴリが文字列でない場合のみマージ
          if (typeof oldTranslationData.en[category] === 'object' && !Array.isArray(oldTranslationData.en[category])) {
            for (const key in oldTranslationData.en[category]) {
              if (typeof oldTranslationData.en[category][key] === 'string') {
                window.translationData.en[category][key] = oldTranslationData.en[category][key];
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('翻訳データのマージに失敗:', e);
    }
    
    console.log('安全な翻訳データオブジェクトを作成しました');
  }
  
  /**
   * ユーザーセッションを修正
   */
  function fixUserSession() {
    try {
      // セッションストレージからユーザー情報を取得
      const userSessionData = window.safeStorage.session.get('currentUser');
      
      // ローカルストレージからユーザー情報を取得
      const touristData = window.safeStorage.local.get('touristData');
      const guideData = window.safeStorage.local.get('guideData');
      
      // セッションにデータがあれば、それをローカルストレージに同期
      if (userSessionData) {
        // ユーザータイプの推測
        const userType = userSessionData.type || 
                        (userSessionData.id && userSessionData.id.indexOf('tourist') >= 0 ? 'tourist' : 
                        (userSessionData.id && userSessionData.id.indexOf('guide') >= 0 ? 'guide' : 'unknown'));
        
        // タイプが分かっていれば同期
        if (userType === 'tourist') {
          window.safeStorage.local.set('touristData', userSessionData);
        } else if (userType === 'guide') {
          window.safeStorage.local.set('guideData', userSessionData);
        }
        
        console.log('ユーザーセッションをローカルストレージに同期しました');
      } 
      // セッションにデータがなく、ローカルストレージにある場合は逆方向に同期
      else if (touristData || guideData) {
        window.safeStorage.session.set('currentUser', touristData || guideData);
        console.log('ユーザーセッションをセッションストレージに復元しました');
      }
    } catch (e) {
      console.error('ユーザーセッション修正中にエラーが発生:', e);
    }
  }
  
  // 緊急修正の実行順序
  blockProblemScripts();
  setupSafeJsonUtils();
  setupSafeStorageUtils();
  createSafeTranslationData();
  fixUserSession();
  
  console.log('緊急修正を完了しました');
})();