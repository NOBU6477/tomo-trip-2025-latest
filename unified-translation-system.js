/**
 * 統一翻訳システム
 * 動的ガイドデータ、ページ遷移後の言語持続性、完全翻訳を実現
 */

(function() {
  'use strict';

  console.log('🌐 統一翻訳システム開始');

  // 言語設定管理
  const LANGUAGE_KEY = 'selectedLanguage';
  
  // 包括的翻訳データベース
  const translationDatabase = {
    // UI要素
    ui: {
      '70人のガイドが見つかりました': 'Found 70 guides',
      '詳細を見る': 'See Details',
      '新規登録': 'Sign Up',
      'ログイン': 'Login',
      'ガイド登録': 'Register as Guide',
      'Filter Guides': 'Filter Guides',
      'Popular Guides': 'Popular Guides',
      '旅行者として登録': 'Register as Tourist',
      'ガイドとして登録': 'Register as Guide',
      'あなたの知識と経験を共有しましょう': 'Share your knowledge and experience',
      'ローカルガイドと一緒に特別な旅を体験': 'Experience special journeys with local guides'
    },
    
    // ガイドデータ（名前とプロフィール）
    guides: {
      '橋本 学': 'Manabu Hashimoto',
      '山本 和也': 'Kazuya Yamamoto', 
      '高橋 洋子': 'Yoko Takahashi',
      '山下 翔太': 'Shota Yamashita',
      '清水 恵子': 'Keiko Shimizu',
      
      // プロフィール
      'ナイトマーケットを中心に、北海道の魅力をお伝えします。写真や動画の生活や文化体験できます。': 'Focusing on night markets, I will share the charm of Hokkaido. You can experience photography, videos, local life and culture.',
      'アートを基軸に古い石川県の魅力をお伝えします。現地の生活や文化も体験できます。': 'Experience the charm of old Ishikawa Prefecture through art. You can also experience local life and culture.',
      '鹿児島県の歴史と文化に精通したガイドです。歴史から寺院まで幅広くご案内します。': 'A guide well-versed in the history and culture of Kagoshima Prefecture. I provide comprehensive guidance from history to temples.',
      '広島県の魅力を知り尽くしたローカルガイドです。ショッピングやファッションのスポットをご案内します。': 'A local guide who knows all about the charm of Hiroshima Prefecture. I will guide you to shopping and fashion spots.',
      '東京都のローカルフードとトレンドスポットを知り尽くしています。直筆好きの方にもおすすめです。': 'I know all about Tokyo\'s local food and trendy spots. Also recommended for those who love handwriting.',
      '青森県で育った地元民ならではの視点で、写真や動画撮影スポットを案内します。': 'As a local who grew up in Aomori Prefecture, I will guide you to photo and video shooting spots from a unique local perspective.',
      '東京都の歴史と文化に精通したガイドです。温泉からリラクゼーションまで幅広くご案内します。': 'A guide well-versed in the history and culture of Tokyo. I provide comprehensive guidance from hot springs to relaxation.'
    },
    
    // 地域・言語
    locations: {
      '北海道': 'Hokkaido',
      '札幌市': 'Sapporo',
      '青森県': 'Aomori',
      '東京都': 'Tokyo',
      '新宿区': 'Shinjuku',
      '小笠原島': 'Ogasawara Islands',
      '鹿児島県': 'Kagoshima',
      '薩摩川内市': 'Satsumasendai',
      '広島県': 'Hiroshima',
      '石川県': 'Ishikawa',
      '金沢市': 'Kanazawa'
    },
    
    languages: {
      '日本語': 'Japanese',
      '英語': 'English',
      '中国語': 'Chinese',
      '韓国語': 'Korean',
      'フランス語': 'French',
      'スペイン語': 'Spanish'
    },
    
    // ベネフィット説明文
    benefits: {
      '地元の方だけが知る特別な場所や体験を共有することで、日常がかけがえのない旅の思い出に変わります。': 'Share special places and experiences that only locals know, transforming everyday moments into irreplaceable travel memories.',
      '自分の都合の良い時間にスケジュールを設定できるため、本業や学業と両立しながら収入を得られます。': 'Set your schedule at convenient times, earning income while balancing your main job or studies.',
      '様々な国や文化からきた旅行者との交流を通じて、国際的な人脈を広げ、異文化理解を深められます。': 'Expand your international network and deepen cross-cultural understanding through interactions with travelers from various countries and cultures.',
      '外国語を使う実践的な機会が得られ、コミュニケーション能力が自然と高まります。': 'Gain practical opportunities to use foreign languages and naturally improve your communication skills.',
      '地元の魅力を発信することで、自分自身の住む地域の理解や愛着がより深くなります。': 'Promote local attractions to deepen your understanding and attachment to your own region.',
      '予約管理、決済、保険など、ガイド活動に必要な基盤をサポートするので安心して活動できます。': 'Reliable support for booking management, payments, insurance, and other infrastructure needed for guide activities.',
      '予約を受ける日時や頻度は完全に自分次第のため、ライフスタイルに合わせた働き方ができます。': 'Complete control over booking schedule and frequency allows you to work according to your lifestyle.',
      '観光客を地元のお店や施設に案内することで、地域経済の活性化とコミュニティの発展に貢献できます。': 'Contribute to local economic revitalization and community development by guiding tourists to local shops and facilities.',
      
      // 新しく発見された文章
      '観光客の方を友達としてお迎えするだけです': 'Simply welcome tourists as friends',
      '形式ばったガイドツアーではなく、友人との交流のように自然な形で地元の魅力を伝えられます。': 'Rather than formal guided tours, you can naturally convey local attractions in a friendly, conversational way.',
      '趣味や特技、専門知識を活かしたオリジナルのガイド体験を提供することで、情熱を収入に変えられます。': 'Turn your passion into income by providing original guide experiences using your hobbies, skills, and expertise.'
    },
    
    // How to Use セクション
    howToUse: {
      '簡単な情報入力と電話番号認証で登録完了': 'Complete registration with simple information entry and phone number verification'
    }
  };

  // 現在の言語を取得
  function getCurrentLanguage() {
    return localStorage.getItem(LANGUAGE_KEY) || 'ja';
  }
  
  // 言語設定を保存
  function saveLanguage(language) {
    localStorage.setItem(LANGUAGE_KEY, language);
    console.log('言語設定保存:', language);
  }

  // テキストを翻訳
  function translateText(text) {
    const currentLang = getCurrentLanguage();
    if (currentLang !== 'en') return text;

    // 全カテゴリから翻訳を検索
    for (const category of Object.values(translationDatabase)) {
      if (category[text]) {
        return category[text];
      }
    }
    
    // 部分一致翻訳
    for (const category of Object.values(translationDatabase)) {
      for (const [japanese, english] of Object.entries(category)) {
        if (text.includes(japanese)) {
          return text.replace(japanese, english);
        }
      }
    }
    
    return text;
  }

  // 要素のテキストを翻訳
  function translateElement(element) {
    if (!element || element.getAttribute('data-translated') === 'true') return;
    
    const currentLang = getCurrentLanguage();
    if (currentLang !== 'en') return;

    const originalText = element.textContent.trim();
    const translatedText = translateText(originalText);
    
    if (translatedText !== originalText) {
      element.textContent = translatedText;
      element.setAttribute('data-translated', 'true');
      console.log('要素翻訳:', originalText, '→', translatedText);
      return true;
    }
    
    return false;
  }

  // ガイドカウンターを翻訳
  function translateGuideCounter() {
    const currentLang = getCurrentLanguage();
    if (currentLang !== 'en') return;

    // 複数のセレクターでガイドカウンターを検索
    const counterSelectors = [
      '.guide-counter',
      '#search-results-counter', 
      '[class*="counter"]',
      '[id*="counter"]'
    ];
    
    counterSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        translateElement(element);
      });
    });

    // テキストパターンでも検索
    document.querySelectorAll('*').forEach(element => {
      if (element.children.length === 0) { // テキストのみの要素
        const text = element.textContent.trim();
        if (text.match(/\d+人のガイドが見つかりました/) || text.includes('ガイドが見つかりました')) {
          translateElement(element);
        }
      }
    });
  }

  // ガイドカードを翻訳
  function translateGuideCards() {
    const currentLang = getCurrentLanguage();
    if (currentLang !== 'en') return;

    console.log('ガイドカード翻訳開始');
    
    // ガイドカードを検索
    const cardSelectors = [
      '.guide-card',
      '.card',
      '[class*="guide"]',
      '[class*="card"]'
    ];
    
    cardSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(card => {
        // 名前を翻訳
        const nameElements = card.querySelectorAll('h5, h4, .card-title, .guide-name, [class*="name"]');
        nameElements.forEach(nameEl => translateElement(nameEl));
        
        // 説明文を翻訳
        const descElements = card.querySelectorAll('p, .card-text, .description, .guide-description');
        descElements.forEach(descEl => translateElement(descEl));
        
        // 地域を翻訳
        const locationElements = card.querySelectorAll('.location, [class*="location"], .text-muted');
        locationElements.forEach(locEl => translateElement(locEl));
        
        // 言語バッジを翻訳
        const languageElements = card.querySelectorAll('.badge, .language-tag, [class*="language"]');
        languageElements.forEach(langEl => translateElement(langEl));
        
        // ボタンを翻訳
        const buttons = card.querySelectorAll('button, .btn, a');
        buttons.forEach(btn => translateElement(btn));
      });
    });
  }

  // ベネフィットセクションを翻訳
  function translateBenefits() {
    const currentLang = getCurrentLanguage();
    if (currentLang !== 'en') return;

    console.log('ベネフィット翻訳開始');
    
    // ベネフィットカードを検索
    document.querySelectorAll('.card, [class*="benefit"], .col').forEach(element => {
      // タイトルを翻訳
      const titles = element.querySelectorAll('h5, h4, h3, .fw-bold, [class*="title"]');
      titles.forEach(title => translateElement(title));
      
      // 説明文を翻訳
      const descriptions = element.querySelectorAll('p, .text-muted, .description');
      descriptions.forEach(desc => translateElement(desc));
    });
  }

  // How to Useセクションを翻訳
  function translateHowToUse() {
    const currentLang = getCurrentLanguage();
    if (currentLang !== 'en') return;

    document.querySelectorAll('h1, h2, h3, p, .description').forEach(element => {
      translateElement(element);
    });
  }

  // ページ全体を翻訳
  function translatePage() {
    const currentLang = getCurrentLanguage();
    if (currentLang !== 'en') return;

    console.log('🌐 ページ全体翻訳開始');
    
    translateGuideCounter();
    translateGuideCards();
    translateBenefits();
    translateHowToUse();
    
    // ヘッダーとナビゲーション
    document.querySelectorAll('nav button, nav a, .navbar button, .navbar a').forEach(element => {
      translateElement(element);
    });
    
    console.log('🌐 ページ全体翻訳完了');
  }

  // 言語切り替え処理
  function setupLanguageSwitcher() {
    // 言語切り替えボタンを検索
    document.querySelectorAll('[id*="lang"], .language-option').forEach(langBtn => {
      langBtn.addEventListener('click', function(e) {
        const language = this.id === 'lang-en' ? 'en' : 'ja';
        console.log('言語切り替え:', language);
        
        saveLanguage(language);
        
        // 翻訳状態をリセット
        document.querySelectorAll('[data-translated="true"]').forEach(el => {
          el.removeAttribute('data-translated');
        });
        
        // 言語に応じて翻訳実行
        if (language === 'en') {
          setTimeout(translatePage, 100);
        } else {
          // 日本語に戻す場合はページリロード
          location.reload();
        }
      });
    });
  }

  // 新規登録ボタン修復
  function fixRegistrationButton() {
    console.log('🔧 新規登録ボタン修復開始');
    
    const registerDropdown = document.getElementById('registerDropdown');
    if (registerDropdown && typeof bootstrap !== 'undefined') {
      // Bootstrapドロップダウンを再初期化
      new bootstrap.Dropdown(registerDropdown);
      console.log('新規登録ドロップダウン修復完了');
      
      // 言語に応じてテキスト設定
      const currentLang = getCurrentLanguage();
      if (currentLang === 'en') {
        translateElement(registerDropdown);
        
        // ドロップダウン項目も翻訳
        document.querySelectorAll('.dropdown-item .fw-bold').forEach(option => {
          translateElement(option);
        });
        document.querySelectorAll('.dropdown-item .text-muted').forEach(desc => {
          translateElement(desc);
        });
      }
    }
  }

  // 初期化
  function initialize() {
    console.log('🚀 統一翻訳システム初期化');
    
    // 言語切り替え機能設定
    setupLanguageSwitcher();
    
    // 新規登録ボタン修復
    setTimeout(fixRegistrationButton, 500);
    
    // 現在の言語で翻訳実行
    const currentLang = getCurrentLanguage();
    if (currentLang === 'en') {
      setTimeout(translatePage, 1000);
      setTimeout(translatePage, 2000); // 確実性のため複数回実行
    }
    
    // ページ遷移後の言語維持
    window.addEventListener('beforeunload', function() {
      const currentLang = getCurrentLanguage();
      sessionStorage.setItem('pageLanguage', currentLang);
    });
    
    // ページロード時の言語復元
    const savedLanguage = sessionStorage.getItem('pageLanguage');
    if (savedLanguage) {
      saveLanguage(savedLanguage);
      if (savedLanguage === 'en') {
        setTimeout(translatePage, 1500);
      }
    }
  }

  // DOM読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // グローバル公開
  window.unifiedTranslation = {
    translatePage,
    getCurrentLanguage,
    saveLanguage,
    translateText
  };

})();