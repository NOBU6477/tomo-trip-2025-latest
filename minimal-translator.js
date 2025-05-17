/**
 * 極限までシンプル化した翻訳機能
 * JavaScriptの基本機能のみを使用し、エラー発生リスクを最小限に抑えます
 */

// 即時実行関数で実行（スコープが閉じている）
(function() {
  // ブラウザコンソールに初期化メッセージを表示
  console.log('極小翻訳: 初期化開始...');
  
  // 翻訳データ（ハードコーディング）
  var translations = {
    'ホーム': 'Home',
    'ガイドを探す': 'Find Guides',
    '使い方': 'How It Works', 
    'ログイン': 'Login',
    '新規登録': 'Sign Up',
    'あなただけの特別な旅を': 'Your Special Journey Awaits',
    '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides you cannot find in regular tours'
  };
  
  // DOMが完全に読み込まれたらイベントリスナーを設定
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // 初期化関数
  function initialize() {
    // 言語切り替えボタンを探す
    var enButtons = document.querySelectorAll('[data-lang="en"]');
    var jaButtons = document.querySelectorAll('[data-lang="ja"]');
    
    // 英語ボタンにイベントリスナーを追加
    for (var i = 0; i < enButtons.length; i++) {
      enButtons[i].addEventListener('click', function(e) {
        e.preventDefault();
        console.log('極小翻訳: 英語に切り替えます');
        translateToEnglish();
      });
    }
    
    // 日本語ボタンにイベントリスナーを追加
    for (var j = 0; j < jaButtons.length; j++) {
      jaButtons[j].addEventListener('click', function(e) {
        e.preventDefault();
        console.log('極小翻訳: 日本語に切り替えます');
        location.reload(); // 日本語はデフォルト表示なのでリロード
      });
    }
    
    console.log('極小翻訳: 言語ボタンの設定が完了しました。ボタン数:', enButtons.length, jaButtons.length);
  }
  
  // 英語に翻訳する関数
  function translateToEnglish() {
    try {
      // 言語ドロップダウンボタンを更新
      var langBtn = document.getElementById('languageDropdown');
      if (langBtn) {
        langBtn.textContent = 'English';
      }
      
      // ナビゲーションメニューのリンクを翻訳
      var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
      for (var i = 0; i < navLinks.length; i++) {
        translateElement(navLinks[i]);
      }
      
      // ヒーローセクションを翻訳
      var heroHeading = document.querySelector('.hero-content h1');
      if (heroHeading) translateElement(heroHeading);
      
      var heroParagraph = document.querySelector('.hero-content p');
      if (heroParagraph) translateElement(heroParagraph);
      
      console.log('極小翻訳: 翻訳が完了しました');
    } catch (error) {
      console.error('極小翻訳: エラーが発生しました', error);
    }
  }
  
  // 要素のテキストを翻訳
  function translateElement(element) {
    if (!element || !element.textContent) return;
    
    var originalText = element.textContent.trim();
    var translatedText = translations[originalText];
    
    if (translatedText) {
      element.textContent = translatedText;
      console.log('極小翻訳: 翻訳しました', originalText, '->', translatedText);
    }
  }
  
  // グローバル変数として公開（他のスクリプトからも使えるように）
  window.minimalTranslator = {
    translateToEnglish: translateToEnglish
  };
  
  console.log('極小翻訳: 初期化完了');
})();