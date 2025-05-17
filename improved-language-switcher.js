/**
 * 改良版言語切り替え機能
 * 既存の言語切り替え機能より確実に動作する直接制御方式
 */
(function() {
  console.log('改良版言語切り替え機能を初期化');
  
  // グローバル変数
  const TRANSLATIONS = {
    // ナビゲーション
    'ホーム': 'Home',
    'ガイドを探す': 'Find Guides',
    '使い方': 'How to Use',
    'ログイン': 'Login',
    '新規登録': 'Sign Up',
    'お問い合わせ': 'Contact Us',
    'テーマ': 'Theme',
    
    // ヘッダーセクション
    'あなただけの特別な旅を': 'Your Unique Journey Awaits',
    '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that tourists rarely discover',
    
    // テーマ設定
    'ライトモード': 'Light Mode',
    'ダークモード': 'Dark Mode',
    '自動（システム設定）': 'Auto (System)',
    
    // 新規登録
    '旅行者として登録': 'Register as Tourist',
    'ガイドとして登録': 'Register as Guide',
    
    // ガイド検索
    '人気のガイド': 'Popular Guides',
    'ガイドを絞り込む': 'Filter Guides',
    '地域': 'Location',
    '言語': 'Language',
    '料金': 'Price',
    'キーワード': 'Keywords',
    'すべて': 'All',
    '検索': 'Search',
    
    // ガイドメリット
    '地元の方だけが知る特別な場所や体験を共有することで、日常がけがえのない旅の思い出に変わります。': 'Share special places and experiences that only locals know, turning everyday life into unforgettable travel memories.',
    '形式ばったガイドツアーではなく、友人との交流のように自然な形で地元の魅力を伝えられます。': 'Rather than formal guided tours, convey local attractions naturally, like interactions with friends.',
    '自分の都合の良い時間にスケジュールを設定できるため、本業や学業と両立しながら収入を得られます。': 'Set schedules at your convenience, earning income while balancing with your main job or studies.',
    '趣味や文化など来た旅行者との交流を通じて、国際的な人脈を広げ、異文化理解を深められます。': 'Expand international connections and deepen cross-cultural understanding through interactions with travelers who share interests in hobbies and culture.',
    '外国語を使う実践的な機会が得られ、コミュニケーション能力が自然と高まります。': 'Gain practical opportunities to use foreign languages, naturally enhancing communication skills.',
    '地元の魅力を発信することで、自分自身の住む地域への理解や愛着がさらに強くなります。': 'By promoting local attractions, your understanding and attachment to your own area will grow stronger.',
    '予約管理、決済、保険など、ガイド活動に必要な基盤を当サービスが提供するので安心して活動できます。': 'Work with peace of mind as our service provides the necessary infrastructure for guiding activities, such as reservation management, payments, and insurance.',
    '予約を受ける日時や頻度は完全に自分で決められるため、ライフスタイルに合わせた働き方ができます。': 'Choose the dates, times, and frequency of accepting reservations entirely on your own, allowing you to work in a way that fits your lifestyle.',
    '観光客を地元のお店や施設に案内することで、地域経済の活性化とコミュニティの発展に貢献できます。': 'Contribute to revitalizing the local economy and community development by guiding tourists to local shops and facilities.',
    
    // フッター
    '© 2025 ローカルガイド. All rights reserved.': '© 2025 Local Guide. All rights reserved.',
  };
  
  // DOMContentLoaded前でも動作できるように即時実行
  setupImprovedLanguageSwitcher();
  
  // DOMContentLoaded後にも確実に実行
  document.addEventListener('DOMContentLoaded', function() {
    setupImprovedLanguageSwitcher();
    checkInitialLanguage();
  });
  
  /**
   * 初期言語を確認して適用
   */
  function checkInitialLanguage() {
    const savedLang = localStorage.getItem('localGuideLanguage') || 'ja';
    if (savedLang === 'en') {
      console.log('英語モードを検出 - 直接翻訳を適用');
      translateToEnglish(false);
    }
  }
  
  /**
   * 直接言語切り替えボタンを設定
   */
  function setupImprovedLanguageSwitcher() {
    // 言語メインボタン - ドロップダウントグルをオーバーライド
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
      // 既存のイベントリスナーを無効化
      languageDropdown.outerHTML = languageDropdown.outerHTML;
      
      // 新しいボタン要素を取得
      const newLangButton = document.getElementById('languageDropdown');
      
      // 直接言語を切り替える機能を追加
      newLangButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 現在の言語を取得して切り替え
        const currentLang = localStorage.getItem('localGuideLanguage') || 'ja';
        const nextLang = currentLang === 'ja' ? 'en' : 'ja';
        
        console.log('言語切替ボタンがクリックされました - 現在:', currentLang, '次:', nextLang);
        
        if (nextLang === 'en') {
          switchToEnglish();
        } else {
          switchToJapanese();
        }
        
        return false;
      });
    }
    
    // 日本語ボタン
    const jpButtons = document.querySelectorAll('a[data-lang="ja"]');
    jpButtons.forEach(jpButton => {
      if (jpButton) {
        // 既存のイベントリスナーを無効化
        jpButton.outerHTML = jpButton.outerHTML;
      }
    });
    
    // 新しい日本語ボタンを取得
    const newJpButtons = document.querySelectorAll('a[data-lang="ja"]');
    newJpButtons.forEach(jpButton => {
      if (jpButton) {
        jpButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('日本語ボタンがクリックされました');
          switchToJapanese();
          
          // Bootstrap dropdownを手動で閉じる
          const dropdownMenus = document.querySelectorAll('.dropdown-menu.show');
          dropdownMenus.forEach(menu => menu.classList.remove('show'));
          
          return false;
        });
      }
    });
    
    // 英語ボタン
    const enButtons = document.querySelectorAll('a[data-lang="en"]');
    enButtons.forEach(enButton => {
      if (enButton) {
        // 既存のイベントリスナーを無効化
        enButton.outerHTML = enButton.outerHTML;
      }
    });
    
    // 新しい英語ボタンを取得
    const newEnButtons = document.querySelectorAll('a[data-lang="en"]');
    newEnButtons.forEach(enButton => {
      if (enButton) {
        enButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('英語ボタンがクリックされました');
          switchToEnglish();
          
          // Bootstrap dropdownを手動で閉じる
          const dropdownMenus = document.querySelectorAll('.dropdown-menu.show');
          dropdownMenus.forEach(menu => menu.classList.remove('show'));
          
          return false;
        });
      }
    });
    
    // 言語ドロップダウンの表示を現在の言語に合わせて更新
    updateLanguageDisplay();
  }
  
  /**
   * 英語に切り替え
   */
  function switchToEnglish() {
    // localStorageとsessionStorageの両方に保存（より確実）
    localStorage.setItem('localGuideLanguage', 'en');
    sessionStorage.setItem('localGuideLanguage', 'en');
    document.documentElement.setAttribute('data-lang', 'en');
    
    // 独自実装の翻訳関数を実行
    translateToEnglish(true);
    
    // 言語表示を更新
    updateLanguageDisplay();
    
    console.log('英語モードに完全切替しました');
  }
  
  /**
   * 日本語に切り替え
   */
  function switchToJapanese() {
    // localStorageとsessionStorageの両方に保存（より確実）
    localStorage.setItem('localGuideLanguage', 'ja');
    sessionStorage.setItem('localGuideLanguage', 'ja');
    document.documentElement.setAttribute('data-lang', 'ja');
    
    // 翻訳済み要素を元に戻す
    revertToJapanese();
    
    // 言語表示を更新
    updateLanguageDisplay();
    
    console.log('日本語モードに完全切替しました');
  }
  
  /**
   * ページを英語に翻訳
   */
  function translateToEnglish(saveOriginals) {
    // 対象となる要素のセレクタ
    const selectors = 'a, button, h1, h2, h3, h4, h5, h6, p, label, option, span, div.card-title, div.card-text';
    
    // 翻訳処理
    document.querySelectorAll(selectors).forEach(element => {
      // 子要素がない、またはテキストのみの要素を翻訳
      if (element.childElementCount === 0 || 
          (element.childElementCount === 1 && element.firstElementChild.tagName === 'I')) {
        const text = element.textContent.trim();
        
        // 元のテキストを保存（初回のみ）
        if (saveOriginals && text && !element.hasAttribute('data-original-text')) {
          element.setAttribute('data-original-text', text);
        }
        
        // 翻訳辞書に該当があれば翻訳
        if (TRANSLATIONS[text]) {
          element.textContent = TRANSLATIONS[text];
          
          // アイコン要素があれば復元
          if (element.querySelector('i')) {
            const iconElement = element.querySelector('i');
            const iconClasses = iconElement.className;
            element.innerHTML = TRANSLATIONS[text];
            const newIcon = document.createElement('i');
            newIcon.className = iconClasses;
            element.prepend(newIcon);
          }
        }
      }
    });
    
    console.log('ページを英語に翻訳しました (改良版)');
  }
  
  /**
   * 翻訳を元に戻して日本語表示に
   */
  function revertToJapanese() {
    document.querySelectorAll('[data-original-text]').forEach(element => {
      const originalText = element.getAttribute('data-original-text');
      if (originalText) {
        // アイコン要素があれば保存
        let iconElement = null;
        if (element.querySelector('i')) {
          iconElement = element.querySelector('i');
        }
        
        // テキストを元に戻す
        element.textContent = originalText;
        
        // アイコンがあれば復元
        if (iconElement) {
          element.prepend(iconElement);
        }
      }
    });
    
    console.log('ページを日本語に戻しました');
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
})();