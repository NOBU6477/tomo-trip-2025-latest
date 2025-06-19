/**
 * 直接言語切り替え機能 - 問題解決用
 * 既存の言語切り替え機能が動作しない場合の代替手段
 */
(function() {
  console.log('直接言語切り替え機能を初期化');

  // DOMContentLoaded前でも動作できるように即時実行
  setupDirectLanguageSwitcher();
  
  // DOMContentLoaded後にも確実に実行
  document.addEventListener('DOMContentLoaded', function() {
    setupDirectLanguageSwitcher();
  });
  
  /**
   * 直接言語切り替えボタンを設定
   */
  function setupDirectLanguageSwitcher() {
    console.log('直接言語切り替えボタンをセットアップ');
    
    // 言語メインボタン - ドロップダウントグルをオーバーライド
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
      // 直接言語を切り替える機能を追加（ドロップダウンを開かずに切り替え）
      languageDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 現在の言語を取得して切り替え
        const currentLang = localStorage.getItem('localGuideLanguage') || 'ja';
        const nextLang = currentLang === 'ja' ? 'en' : 'ja';
        
        console.log('言語ボタンがクリックされました - 現在:', currentLang, '次:', nextLang);
        
        if (nextLang === 'en') {
          switchToEnglish();
        } else {
          switchToJapanese();
        }
        
        return false;
      }, true); // キャプチャリングフェーズで実行
    }
    
    // 日本語ボタン
    const jpButton = document.querySelector('a[data-lang="ja"]');
    if (jpButton) {
      console.log('日本語ボタンを検出');
      
      // 既存のイベントリスナーを削除して再設定
      jpButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('日本語に切り替え');
        switchToJapanese();
        
        // Bootstrap dropdownを手動で閉じる
        const dropdownMenus = document.querySelectorAll('.dropdown-menu.show');
        dropdownMenus.forEach(menu => menu.classList.remove('show'));
        
        return false;
      }, true); // キャプチャリングフェーズで実行
    }
    
    // 英語ボタン
    const enButton = document.querySelector('a[data-lang="en"]');
    if (enButton) {
      console.log('英語ボタンを検出');
      
      // 既存のイベントリスナーを削除して再設定
      enButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('英語に切り替え');
        switchToEnglish();
        
        // Bootstrap dropdownを手動で閉じる
        const dropdownMenus = document.querySelectorAll('.dropdown-menu.show');
        dropdownMenus.forEach(menu => menu.classList.remove('show'));
        
        return false;
      }, true); // キャプチャリングフェーズで実行
    }
    
    // 言語ドロップダウンの表示を現在の言語に合わせて更新
    updateLanguageDisplay();
  }
  
  /**
   * 日本語に切り替え
   */
  function switchToJapanese() {
    localStorage.setItem('localGuideLanguage', 'ja');
    // 既存の言語切り替え機能を使用してみる
    if (typeof window.switchLanguage === 'function') {
      window.switchLanguage('ja');
    } else {
      // 既存関数が使えない場合はリロード
      location.reload();
    }
  }
  
  /**
   * 英語に切り替え
   */
  function switchToEnglish() {
    localStorage.setItem('localGuideLanguage', 'en');
    // 既存の言語切り替え機能を使用してみる
    if (typeof window.switchLanguage === 'function') {
      window.switchLanguage('en');
    } else {
      // ページ内の要素を英語に切り替える簡易実装
      translatePageToEnglish();
    }
  }
  
  /**
   * 言語表示を更新
   */
  function updateLanguageDisplay() {
    const currentLang = localStorage.getItem('localGuideLanguage') || 'ja';
    const languageButton = document.getElementById('languageDropdown');
    
    if (languageButton) {
      if (currentLang === 'en') {
        languageButton.textContent = 'English';
      } else {
        languageButton.textContent = '日本語';
      }
    }
  }
  
  /**
   * ページを英語に翻訳する簡易実装
   */
  function translatePageToEnglish() {
    // 簡易翻訳マップ - 主要なUIテキストのみ
    const translations = {
      'ホーム': 'Home',
      'ガイドを探す': 'Find Guides',
      '使い方': 'How to Use',
      'ログイン': 'Login',
      '新規登録': 'Sign Up',
      'お問い合わせ': 'Contact Us',
      'テーマ': 'Theme',
      'ライトモード': 'Light Mode',
      'ダークモード': 'Dark Mode',
      '自動（システム設定）': 'Auto (System)',
      'あなただけの特別な旅を': 'Your Unique Journey Awaits',
      '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that tourists rarely discover',
      '旅行者として登録': 'Register as Tourist',
      'ガイドとして登録': 'Register as Guide',
      '人気のガイド': 'Popular Guides',
      'ガイドを絞り込む': 'Filter Guides',
      '地域': 'Location',
      '言語': 'Language',
      '料金': 'Price',
      'キーワード': 'Keywords',
      'すべて': 'All',
    };
    
    // テキストの翻訳関数
    function translateText(element) {
      const text = element.textContent.trim();
      if (translations[text]) {
        element.textContent = translations[text];
      }
    }
    
    // 要素の翻訳
    document.querySelectorAll('a, button, h1, h2, h3, h4, h5, p, label, option').forEach(translateText);
    
    // 言語ドロップダウンの表示を更新
    updateLanguageDisplay();
    
    // 翻訳完了のメッセージ
    console.log('ページを英語に簡易翻訳しました');
  }
})();