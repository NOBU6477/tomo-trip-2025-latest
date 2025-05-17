/**
 * 超シンプルな翻訳システム - 依存関係ゼロ
 * ドロップダウンエラーを解決するための最終策
 */

// 即時実行関数
(function() {
  // 翻訳対象のテキストと英語訳の対応表
  const translations = {
    '日本語': 'Japanese',
    'ホーム': 'Home',
    'ガイドを探す': 'Find Guides',
    '使い方': 'How It Works',
    'ログイン': 'Login',
    '新規登録': 'Sign Up',
    'マイページ': 'My Page',
    'ログアウト': 'Logout',
    'お問い合わせ': 'Contact Us',
    'あなただけの特別な旅を': 'Your Special Journey Awaits',
    '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that you cannot find in regular tours',
    '人気のガイド': 'Popular Guides',
    'ガイドとして活躍': 'Benefits of Being a Guide',
    'もっと見る': 'See More',
    '観光客として登録': 'Register as Tourist',
    'ガイドとして登録': 'Register as Guide',
    'メールアドレス': 'Email Address',
    'パスワード': 'Password',
    'パスワードを忘れた': 'Forgot Password',
    'アカウント登録はこちら': 'Register Here',
    'すでにアカウントをお持ちの方': 'Already have an account',
    'ガイド詳細の閲覧にはログインが必要です': 'Login Required to View Guide Details',
    'ガイドの詳細情報、写真ギャラリー、レビュー、予約機能を利用するには、ログインまたは新規登録が必要です。': 'To access guide details, photo gallery, reviews, and booking features, please login or sign up.'
  };

  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('超シンプル翻訳システム: 初期化開始...');
    
    // 言語切り替えボタンのセットアップ
    setupLanguageButtons();
    
    // 保存された言語設定の適用
    const savedLang = localStorage.getItem('simpleLang');
    if (savedLang === 'en') {
      console.log('超シンプル翻訳システム: 保存された言語設定（英語）を適用します');
      applyTranslation();
    }
    
    console.log('超シンプル翻訳システム: 初期化完了');
  });

  // 言語切り替えボタンのセットアップ
  function setupLanguageButtons() {
    // 英語ボタン
    document.querySelectorAll('[data-lang="en"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('超シンプル翻訳システム: 英語に切り替えます');
        localStorage.setItem('simpleLang', 'en');
        applyTranslation();
      });
    });
    
    // 日本語ボタン
    document.querySelectorAll('[data-lang="ja"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('超シンプル翻訳システム: 日本語に切り替えます');
        localStorage.setItem('simpleLang', 'ja');
        window.location.reload(); // 日本語はデフォルト言語なのでリロード
      });
    });
  }

  // 翻訳を適用
  function applyTranslation() {
    try {
      // 言語ドロップダウンボタンのテキスト更新
      const langBtn = document.getElementById('languageDropdown');
      if (langBtn) {
        langBtn.textContent = 'English';
      }
      
      // ナビメニュー項目の翻訳
      document.querySelectorAll('.navbar-nav .nav-link').forEach(function(navLink) {
        translateElement(navLink);
      });
      
      // ヘッダーセクションの翻訳
      document.querySelectorAll('.hero-content h1, .hero-content p').forEach(function(heroText) {
        translateElement(heroText);
      });
      
      // 見出しの翻訳
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function(heading) {
        translateElement(heading);
      });
      
      // 段落の翻訳
      document.querySelectorAll('p:not(.no-translate)').forEach(function(para) {
        translateElement(para);
      });
      
      // ボタンテキストの翻訳
      document.querySelectorAll('button:not([data-no-translate]), .btn:not([data-no-translate])').forEach(function(btn) {
        if (btn.childElementCount === 0) {
          translateElement(btn);
        }
      });
      
      // リンクテキストの翻訳
      document.querySelectorAll('a:not(.no-translate)').forEach(function(link) {
        if (link.childElementCount === 0 && !link.closest('.dropdown-menu')) {
          translateElement(link);
        }
      });
      
      // ドロップダウンアイテムの翻訳
      document.querySelectorAll('.dropdown-item:not([data-lang])').forEach(function(item) {
        translateElement(item);
      });
      
      console.log('超シンプル翻訳システム: 翻訳適用完了');
    } catch (error) {
      console.error('超シンプル翻訳システム: 翻訳適用エラー', error);
    }
  }

  // 要素のテキストを翻訳
  function translateElement(element) {
    if (!element || !element.textContent || element.textContent.trim() === '') return;
    
    const original = element.textContent.trim();
    if (translations[original]) {
      element.textContent = translations[original];
    }
  }

  // グローバルスコープへのエクスポート
  window.superSimpleTranslator = {
    translate: function(text) {
      return translations[text] || text;
    },
    switchToEnglish: applyTranslation
  };

  // 古いシステムとの互換性
  window.translateUI = function(lang) {
    if (lang === 'en') {
      applyTranslation();
    } else {
      window.location.reload();
    }
  };
})();