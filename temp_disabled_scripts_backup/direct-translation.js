/**
 * 直接的な翻訳システム
 * 最もシンプルなアプローチで、依存関係なしで機能します
 */

(function() {
  console.log("直接的な翻訳システムを初期化します...");
  
  // =======================================
  // 翻訳データ（インラインで定義）
  // =======================================
  const translations = {
    'ホーム': 'Home',
    'ガイドを探す': 'Find Guides',
    '使い方': 'How It Works',
    'ログイン': 'Login',
    '新規登録': 'Sign Up',
    'マイページ': 'My Page',
    'ログアウト': 'Logout',
    'お問い合わせ': 'Contact Us',
    
    // ヒーローセクション
    'あなただけの特別な旅を': 'Your Special Journey Awaits',
    '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that you cannot find in regular tours',
    
    // ボタンとアクション
    'ガイドを探す': 'Find Guides',
    'もっと見る': 'See More',
    '詳細を見る': 'See Details',
    '予約する': 'Book Now',
    'メッセージを送る': 'Send Message',
    '検索': 'Search',
    'リセット': 'Reset',
    '登録する': 'Register',
    '送信': 'Submit',
    '更新': 'Update',
    '削除': 'Delete',
    '保存': 'Save',
    'キャンセル': 'Cancel',
    
    // セクションタイトル
    '人気のガイド': 'Popular Guides',
    '使い方': 'How It Works',
    'ガイドとして活躍': 'Benefits of Being a Guide',
    'ガイドになる': 'Become a Guide',
    'プロフィール': 'Profile',
    '写真ギャラリー': 'Photo Gallery',
    'レビュー': 'Reviews',
    '予約': 'Bookings',
    'メッセージ': 'Messages',
    '設定': 'Settings',
    
    // 使い方セクション
    'アカウント登録': 'Create Account',
    'ガイドを探す': 'Find Guides',
    '予約して楽しむ': 'Book and Enjoy',
    '簡単な情報入力と電話番号認証': 'Simple information input and phone number verification',
    '場所、言語、専門性などで理想のガイド': 'Search for ideal guides by location, language, and specialties',
    '希望の日時で予約し、特別な体験': 'Book on your preferred date and enjoy a special experience',
    '観光客向け': 'For Tourists',
    'ガイド向け': 'For Guides',
    
    // その他の重要な翻訳
    '準備中': 'Coming Soon',
    '読み込み中': 'Loading',
    'エラーが発生しました': 'An error occurred',
    '再試行': 'Try Again',
    'よくある質問': 'Frequently Asked Questions',
    'プライバシーポリシー': 'Privacy Policy',
    '利用規約': 'Terms of Service',
    '著作権': 'Copyright'
  };
  
  // =======================================
  // 翻訳ロジック
  // =======================================
  
  // 保存された言語設定
  let currentLang = localStorage.getItem('directLanguage') || 'ja';
  
  // DOMが読み込まれたら翻訳ボタンを設定
  document.addEventListener('DOMContentLoaded', function() {
    setupLanguageButtons();
    applyCurrentLanguage();
  });
  
  // 言語ボタンの設定
  function setupLanguageButtons() {
    // 言語ドロップダウンメニューのボタンを探す
    const langButtons = document.querySelectorAll('[data-lang]');
    
    // 各ボタンにイベントリスナーを設定
    langButtons.forEach(button => {
      const lang = button.getAttribute('data-lang');
      button.addEventListener('click', function(e) {
        e.preventDefault();
        switchLanguage(lang);
      });
    });
    
    console.log("言語切り替えボタンを設定しました");
  }
  
  // 言語切り替え
  function switchLanguage(lang) {
    console.log("言語を切り替えます:", lang);
    
    // 言語設定を保存
    currentLang = lang;
    localStorage.setItem('directLanguage', lang);
    
    // UI表示を更新
    updateLanguageDisplay(lang);
    
    // 実際に翻訳を適用
    if (lang === 'ja') {
      // 日本語はデフォルトなのでページをリロード
      location.reload();
      return;
    }
    
    // 英語翻訳を適用
    translatePage();
  }
  
  // 言語表示の更新
  function updateLanguageDisplay(lang) {
    // 言語ドロップダウンボタンのテキストを更新
    const langDropdown = document.getElementById('languageDropdown');
    if (langDropdown) {
      langDropdown.textContent = lang === 'en' ? 'English' : '日本語';
    }
  }
  
  // 保存された言語設定を適用
  function applyCurrentLanguage() {
    if (currentLang === 'en') {
      // 言語表示を更新
      updateLanguageDisplay('en');
      
      // 翻訳を適用
      translatePage();
    }
  }
  
  // ページ全体を翻訳
  function translatePage() {
    // すべてのテキストノードを処理
    walkTextNodes(document.body);
    
    // タイトルを翻訳
    document.title = translate(document.title);
    
    // プレースホルダーを翻訳
    translatePlaceholders();
    
    // セレクトオプションを翻訳
    translateSelectOptions();
    
    console.log("ページの翻訳が完了しました");
  }
  
  // テキストノードを辿ってテキスト置換
  function walkTextNodes(node) {
    if (node.nodeType === 3) { // テキストノード
      const text = node.nodeValue.trim();
      if (text.length > 0) {
        // 翻訳を適用
        const translatedText = translate(text);
        if (translatedText !== text) {
          node.nodeValue = node.nodeValue.replace(text, translatedText);
        }
      }
    } else if (node.nodeType === 1) { // 要素ノード
      // 子ノードがない要素は直接テキストコンテンツを置換
      if (node.childNodes.length === 0 && node.textContent && node.textContent.trim().length > 0) {
        const originalText = node.textContent.trim();
        const translatedText = translate(originalText);
        if (translatedText !== originalText) {
          node.textContent = translatedText;
        }
      } else {
        // 子ノードを再帰的に処理
        for (let i = 0; i < node.childNodes.length; i++) {
          walkTextNodes(node.childNodes[i]);
        }
      }
    }
  }
  
  // プレースホルダーを翻訳
  function translatePlaceholders() {
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(element => {
      if (element.placeholder) {
        element.placeholder = translate(element.placeholder);
      }
    });
  }
  
  // セレクトオプションを翻訳
  function translateSelectOptions() {
    document.querySelectorAll('select option').forEach(option => {
      if (option.text) {
        option.text = translate(option.text);
      }
    });
  }
  
  // 翻訳処理
  function translate(text) {
    if (!text || typeof text !== 'string' || text.trim() === '') return text;
    
    // 直接辞書から翻訳を取得
    return translations[text] || text;
  }
  
  // グローバルに公開
  window.directTranslation = {
    switchLanguage: switchLanguage,
    translate: translate
  };
  
  // 古い翻訳システムとの互換性のためにスタブ関数を設定
  window.translateUI = function(lang) {
    window.directTranslation.switchLanguage(lang === 'en' ? 'en' : 'ja');
  };
  
  console.log("直接的な翻訳システムの初期化が完了しました");
})();