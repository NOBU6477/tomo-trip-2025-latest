/**
 * サイト全体の重大なエラーに対する根本的修正スクリプト
 * 循環参照と翻訳データ問題を完全に解決します
 */

(function() {
  // 実行済みフラグをチェック
  if (window.criticalFixesApplied) {
    console.log('重大エラー修正は既に適用済みです');
    return;
  }
  
  console.log('重大エラー修正スクリプトが起動しました');
  
  // フラグを設定して重複実行を防止
  window.criticalFixesApplied = true;
  
  // 緊急フラグを設定して他のスクリプトの実行を制御
  window.translationDataProtected = true;
  window.translationJsonFixApplied = true;
  window.translatorErrorFixApplied = true;
  window.sessionSyncFixApplied = true;
  window.noDuplicateTranslationDataApplied = true;
  
  // 最小限の真に安全な翻訳データを再構築
  const safeTranslationData = {
    en: {
      'navigation': {
        'ホーム': 'Home',
        'ガイドを探す': 'Find Guides',
        '使い方': 'How It Works',
        'ログイン': 'Login',
        '新規登録': 'Sign Up',
        'マイページ': 'My Page',
        'ログアウト': 'Logout',
        'お問い合わせ': 'Contact Us'
      },
      'common': {
        'はい': 'Yes',
        'いいえ': 'No',
        '次へ': 'Next',
        '戻る': 'Back',
        '完了': 'Complete',
        'キャンセル': 'Cancel',
        '登録': 'Register',
        '送信': 'Submit',
        '更新': 'Update',
        '削除': 'Delete',
        '閉じる': 'Close',
        '保存': 'Save',
        '続ける': 'Continue',
        '確認': 'Confirm',
        '必須': 'Required',
        'エラー': 'Error',
        '成功': 'Success',
        '警告': 'Warning',
        '情報': 'Information'
      },
      'auth': {
        'ユーザー名': 'Username',
        'メールアドレス': 'Email',
        'パスワード': 'Password',
        'パスワード確認': 'Confirm Password',
        'パスワードを忘れた': 'Forgot Password',
        'ログイン': 'Login',
        'ログアウト': 'Logout',
        '新規登録': 'Sign Up',
        'アカウントを作成': 'Create Account',
        'ガイドとして登録': 'Register as Guide',
        '観光客として登録': 'Register as Tourist',
        '名前': 'Name',
        '姓': 'Last Name',
        '名': 'First Name',
        '電話番号': 'Phone Number',
        '認証コード': 'Verification Code',
        '認証': 'Verify',
        '認証済み': 'Verified',
        '未認証': 'Unverified',
        'コードを送信': 'Send Code',
        'コードを確認': 'Verify Code'
      },
      'guide': {
        'ガイド': 'Guide',
        'ガイドプロフィール': 'Guide Profile',
        'ガイド情報': 'Guide Information',
        '得意分野': 'Specialties',
        'ガイドエリア': 'Guide Area',
        '言語': 'Languages',
        '料金': 'Price',
        'レビュー': 'Reviews',
        '予約可能日': 'Available Dates',
        '写真ギャラリー': 'Photo Gallery',
        '自己紹介': 'About Me',
        'ガイドを探す': 'Find Guides',
        'フィルター': 'Filter',
        '地域': 'Region',
        '言語': 'Language',
        'キーワード': 'Keywords',
        '検索': 'Search',
        'クリア': 'Clear',
        '適用': 'Apply',
        '並び替え': 'Sort',
        '人気順': 'Popularity',
        '料金安い順': 'Price Low to High',
        '料金高い順': 'Price High to Low',
        'レビュー高評価順': 'Highest Rated'
      },
      'booking': {
        '予約': 'Booking',
        '予約リクエスト': 'Booking Request',
        '予約確認': 'Booking Confirmation',
        '予約日': 'Booking Date',
        '予約時間': 'Booking Time',
        '予約人数': 'Number of People',
        '予約詳細': 'Booking Details',
        '予約状況': 'Booking Status',
        '予約履歴': 'Booking History',
        '予約完了': 'Booking Complete',
        '予約キャンセル': 'Cancel Booking',
        '予約変更': 'Change Booking',
        '予約リクエスト送信': 'Send Booking Request',
        '待機中': 'Pending',
        '確認済み': 'Confirmed',
        'キャンセル': 'Cancelled',
        '完了': 'Completed'
      }
    }
  };

  // グローバル翻訳データを上書き
  try {
    // 既存の参照を完全に削除
    delete window.translationData;
  } catch (e) {
    console.warn('既存の翻訳データ削除に失敗:', e);
  }
  
  // 新しい安全な翻訳データを設定
  window.translationData = safeTranslationData;
  
  /**
   * 究極に安全なJSON処理ユーティリティ
   */
  window.safeJSON = {
    stringify: function(obj) {
      try {
        return JSON.stringify(obj);
      } catch (e) {
        console.error('JSON文字列化エラー:', e);
        return '{}';
      }
    },
    
    parse: function(str) {
      if (!str) return null;
      if (typeof str !== 'string') return str;
      
      try {
        // JSONとして解析可能な文字列のみ処理
        if (str.trim().startsWith('{') || str.trim().startsWith('[')) {
          return JSON.parse(str);
        }
        return str; // JSONでない場合は元の文字列を返す
      } catch (e) {
        console.error('JSON解析エラー:', e);
        return null;
      }
    }
  };
  
  /**
   * 安全なストレージアクセスユーティリティ
   */
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
    },
    
    // ユーザーセッション同期
    syncUserSession: function() {
      try {
        // セッションストレージからユーザーデータ取得
        const userData = this.session.get('currentUser');
        
        if (userData) {
          // ユーザータイプに基づいて適切なローカルストレージに保存
          if (userData.type === 'tourist' || (userData.id && userData.id.includes('tourist'))) {
            this.local.set('touristData', userData);
            console.log('観光客データをローカルストレージに同期しました');
          } else if (userData.type === 'guide' || (userData.id && userData.id.includes('guide'))) {
            this.local.set('guideData', userData);
            console.log('ガイドデータをローカルストレージに同期しました');
          }
          return true;
        }
        
        // セッションストレージにデータがない場合、ローカルストレージから復元
        const touristData = this.local.get('touristData');
        const guideData = this.local.get('guideData');
        
        if (touristData) {
          this.session.set('currentUser', touristData);
          console.log('観光客データをセッションストレージに復元しました');
          return true;
        }
        
        if (guideData) {
          this.session.set('currentUser', guideData);
          console.log('ガイドデータをセッションストレージに復元しました');
          return true;
        }
        
        return false;
      } catch (e) {
        console.error('ユーザーセッション同期エラー:', e);
        return false;
      }
    }
  };
  
  /**
   * 安全な代替翻訳関数
   */
  window.safeTranslator = {
    getTranslation: function(key, lang) {
      try {
        // 言語が指定されていない場合はローカルストレージから取得
        const currentLang = lang || localStorage.getItem('selectedLanguage') || 'ja';
        
        // 日本語の場合はそのまま表示
        if (currentLang === 'ja') return key;
        
        // キーをドット区切りで分割
        const parts = key.split('.');
        
        // 1部分だけの場合、カテゴリ全体を検索
        if (parts.length === 1) {
          const targetKey = parts[0];
          
          // 各カテゴリを検索
          for (const category in window.translationData.en) {
            if (window.translationData.en[category][targetKey]) {
              return window.translationData.en[category][targetKey];
            }
          }
          
          // 見つからない場合は元のキーを返す
          return key;
        }
        
        // カテゴリとキーが指定されている場合
        const category = parts[0];
        const targetKey = parts[1];
        
        // 指定されたカテゴリとキーで翻訳を取得
        if (window.translationData.en[category] && window.translationData.en[category][targetKey]) {
          return window.translationData.en[category][targetKey];
        }
        
        // 見つからない場合は元のキーを返す
        return targetKey || key;
      } catch (e) {
        console.error('翻訳エラー:', e);
        return key; // エラーの場合は元のキーを返す
      }
    },
    
    // テキストノードを安全に翻訳
    translateElement: function(element, lang) {
      if (!element) return;
      
      try {
        // 埋め込み翻訳データを持つ要素を処理
        if (element.dataset && element.dataset.translate) {
          const key = element.dataset.translate;
          element.textContent = this.getTranslation(key, lang);
          return;
        }
        
        // プレースホルダを持つ入力要素を処理
        if (element.placeholder && element.dataset && element.dataset.placeholderTranslate) {
          const key = element.dataset.placeholderTranslate;
          element.placeholder = this.getTranslation(key, lang);
          return;
        }
        
        // 通常のテキストを処理
        if (element.childNodes && element.childNodes.length > 0) {
          element.childNodes.forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim()) { // テキストノード
              const key = node.textContent.trim();
              const translation = this.getTranslation(key, lang);
              if (translation !== key) {
                node.textContent = node.textContent.replace(key, translation);
              }
            }
          });
        }
      } catch (e) {
        console.error('要素翻訳エラー:', e);
      }
    }
  };
  
  // 古いアクセス関数を安全なものにリダイレクト
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
  
  // 最初のユーザーセッション同期を実行
  window.safeStorage.syncUserSession();
  
  console.log('重大エラー修正が完了しました - 翻訳データとストレージ操作を安全化しました');
})();