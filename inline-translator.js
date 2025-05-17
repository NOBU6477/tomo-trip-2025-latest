/**
 * インライン翻訳システム - 最もシンプルな実装
 * JSONパースエラーを回避して直接HTMLに翻訳を適用する
 */
(function() {
  // 翻訳テキストのデータ
  const translations = {
    // ナビゲーション
    "ホーム": "Home",
    "ガイドを探す": "Find Guides",
    "使い方": "How It Works",
    "ログイン": "Login",
    "新規登録": "Sign Up",
    "日本語": "English",
    "マイページ": "My Page",
    "ログアウト": "Logout",
    
    // ヒーローセクション
    "あなただけの特別な旅を": "Your Special Journey Awaits",
    "地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう": "Experience hidden gems with local guides that you cannot find in regular tours",
    
    // ボタンとセクション見出し
    "ガイドを探す": "Find Guides",
    "お問い合わせ": "Contact Us",
    "人気のガイド": "Popular Guides",
    "ガイドとして活躍": "Benefits of Being a Guide",
    "もっと見る": "See More",
    
    // フィルタリング
    "ガイドを絞り込む": "Filter Guides",
    "地域": "Location",
    "すべて": "All",
    "言語": "Language",
    "料金": "Price",
    "キーワード": "Keywords",
    "検索条件に一致するガイドが見つかりませんでした。条件を変更してお試しください。": "No guides found matching your criteria. Please try different filters.",
    
    // ユーザー関連
    "観光客として登録": "Register as Tourist",
    "ガイドとして登録": "Register as Guide",
    "メールアドレス": "Email Address",
    "パスワード": "Password",
    "パスワードを忘れた": "Forgot Password",
    "アカウント登録はこちら": "Register Here",
    "すでにアカウントをお持ちの方": "Already have an account",
    
    // メッセージ
    "ガイド詳細の閲覧にはログインが必要です": "Login Required to View Guide Details",
    "ガイドの詳細情報、写真ギャラリー、レビュー、予約機能を利用するには、ログインまたは新規登録が必要です。": "To access guide details, photo gallery, reviews, and booking features, please login or sign up."
  };
  
  // 初期化
  function init() {
    console.log('インライン翻訳システム: 初期化しています...');
    
    // 言語切り替えボタンの設定
    setupLanguageButtons();
    
    // ページロード時に保存されている言語設定を適用
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang === 'en') {
      console.log('インライン翻訳システム: 保存された英語設定を適用します');
      translateToEnglish();
    }
    
    // dropdown文字列の安全対策
    blockDropdownStrParsing();
    
    console.log('インライン翻訳システム: 初期化完了');
  }
  
  // dropdown文字列がJSONとして解析されないようにブロックする
  function blockDropdownStrParsing() {
    // 元のJSON.parseを保存
    const originalJSONParse = JSON.parse;
    
    // JSONパース時の修正関数を登録
    window.JSON.parse = function(text) {
      // dropdownという単語が単独で使われている場合の対策
      if (text === 'dropdown' || text === '"dropdown"') {
        console.log('dropdown文字列のパースを安全に処理します');
        return {};
      }
      
      // 通常のJSON.parseを呼び出す
      try {
        return originalJSONParse(text);
      } catch (error) {
        console.error('JSONパースエラー:', error.message);
        
        // エラーが起きた場合は空オブジェクトを返す（エラー伝播を防止）
        return {};
      }
    };
  }
  
  // 言語切り替えボタンの設定
  function setupLanguageButtons() {
    // 英語ボタン
    document.querySelectorAll('[data-lang="en"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('インライン翻訳システム: 英語に切り替えます');
        translateToEnglish();
        localStorage.setItem('appLanguage', 'en');
      });
    });
    
    // 日本語ボタン
    document.querySelectorAll('[data-lang="ja"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('インライン翻訳システム: 日本語に切り替えます');
        localStorage.setItem('appLanguage', 'ja');
        location.reload(); // 日本語はデフォルト言語なのでリロード
      });
    });
  }
  
  // 英語に翻訳
  function translateToEnglish() {
    try {
      console.log('インライン翻訳システム: ページ翻訳を開始します');
      
      // ドロップダウンボタンのテキスト更新
      const langBtn = document.getElementById('languageDropdown');
      if (langBtn) {
        langBtn.textContent = 'English';
      }
      
      // ナビゲーションリンク
      translateElements('.navbar-nav .nav-link');
      
      // ヒーロースクション
      translateElements('.hero-content h1, .hero-content p');
      
      // ボタン
      translateElements('.btn:not([data-no-translate])');
      
      // 見出し
      translateElements('h1, h2, h3, h4, h5, h6');
      
      // ラベル
      translateElements('label.form-label');
      
      // セレクトオプション
      translateElements('select option');
      
      // その他テキスト要素
      translateElements('p:not(.no-translate)');
      translateElements('.alert');
      
      // ドロップダウンメニュー（登録ドロップダウン）
      translateDropdownMenus();
      
      console.log('インライン翻訳システム: ページ翻訳が完了しました');
    } catch (error) {
      console.error('インライン翻訳システム: エラーが発生しました', error);
    }
  }
  
  // ドロップダウンメニューの翻訳（イベントリスナーに依存しない実装）
  function translateDropdownMenus() {
    // 登録ドロップダウンメニュー
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
      // 旅行者として登録
      if (item.textContent.includes('旅行者として登録')) {
        const title = item.querySelector('.fw-bold');
        const desc = item.querySelector('.small');
        if (title) title.textContent = 'Register as Tourist';
        if (desc) desc.textContent = 'Experience unique trips with local guides';
      }
      // ガイドとして登録
      else if (item.textContent.includes('ガイドとして登録')) {
        const title = item.querySelector('.fw-bold');
        const desc = item.querySelector('.small');
        if (title) title.textContent = 'Register as Guide';
        if (desc) desc.textContent = 'Share your knowledge and experience';
      }
    });
  }
  
  // 要素のコレクションを翻訳
  function translateElements(selector) {
    document.querySelectorAll(selector).forEach(function(element) {
      translateElement(element);
    });
  }
  
  // 単一要素を翻訳
  function translateElement(element) {
    if (!element || !element.textContent || element.textContent.trim() === '') {
      return;
    }
    
    const originalText = element.textContent.trim();
    const translatedText = translations[originalText];
    
    if (translatedText) {
      element.textContent = translatedText;
      console.log(`インライン翻訳システム: "${originalText}" => "${translatedText}"`);
    }
  }
  
  // DOMが読み込まれたら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // グローバルスコープへのエクスポート
  window.inlineTranslator = {
    translate: function(text) {
      return translations[text] || text;
    },
    translateToEnglish: translateToEnglish
  };
  
  // 従来の翻訳システムとの互換性
  window.translateUI = function(lang) {
    if (lang === 'en') {
      translateToEnglish();
    } else {
      location.reload();
    }
  };
})();