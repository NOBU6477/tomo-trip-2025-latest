/**
 * 言語切替機能の最終版（簡潔かつ確実）
 */
(function() {
  console.log("言語翻訳機能：最終版を実行");

  // 翻訳データ - 各要素のテキスト内容に対応
  const translations = {
    // ヘッダー
    'ホーム': 'Home',
    'ガイドを探す': 'Find Guides',
    'ガイドとして登録': 'Register as Guide',
    '旅行者として登録': 'Register as Tourist',
    'ログイン': 'Login',
    '新規登録': 'Register',
    '予約管理': 'Bookings',
    'ガイドプロフィール': 'Guide Profile',
    '旅行者プロフィール': 'Tourist Profile',
    'メッセージ': 'Messages',
    'ログアウト': 'Logout',
    'テーマ': 'Theme',
    'ライトモード': 'Light Mode',
    'ダークモード': 'Dark Mode',
    '自動（システム設定）': 'Auto (System)',
    '詳細を見る': 'View Details',
    
    // ヒーローセクション
    'あなただけの特別な旅を': 'Your Special Journey',
    '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden attractions with local guides that you won\'t find in regular tourism',
    'お問い合わせ': 'Contact Us',
    
    // フィルターセクション
    '人気のガイド': 'Popular Guides',
    'ガイドを絞り込む': 'Filter Guides',
    '地域': 'Location',
    'すべて': 'All',
    '言語': 'Language',
    '料金': 'Price',
    'キーワード': 'Keywords',
    'ナイトツアー': 'Night Tour',
    'グルメ': 'Food Tour',
    '写真スポット': 'Photo Spot',
    '料理': 'Cooking',
    'アクティビティ': 'Activity',
    'その他のキーワードを入力（コンマ区切りで複数入力可）': 'Enter other keywords (comma separated)',
    '検索': 'Search',
    'リセット': 'Reset',
    
    // 使い方セクション
    '使い方': 'How to Use',
    'アカウント登録': 'Create Account',
    '簡単な情報入力と電話番号認証で登録完了': 'Simple signup with phone verification',
    'ガイドを見つける': 'Find Guides',
    '場所、言語、専門性などで理想のガイドを検索': 'Search by location, language, and expertise',
    '予約して楽しむ': 'Book and Enjoy',
    '希望の日時で予約し、特別な体験を楽しむ': 'Book at your preferred time and enjoy a special experience',
    
    // ガイドメリットセクション
    'ガイドとして活躍するメリット': 'Benefits of Being a Guide',
    'あなたの知識と経験を活かして、世界中の旅行者に特別な体験を提供しましょう': 'Share your knowledge and experience to provide special experiences to travelers from around the world',
    '柔軟な働き方': 'Flexible Work Style',
    '自分のスケジュールに合わせて活動できます。空き時間を有効活用しましょう。': 'Work according to your own schedule. Make effective use of your free time.',
    '追加収入': 'Additional Income',
    'あなたの専門知識や特技を収入に変えることができます。': 'Turn your expertise and skills into income.',
    '国際交流': 'International Exchange',
    '世界中の人々と交流し、異文化理解を深めることができます。': 'Interact with people from around the world and deepen cross-cultural understanding.',
    '自己成長': 'Personal Growth',
    'ガイド活動を通じて、コミュニケーション能力や知識が向上します。': 'Improve your communication skills and knowledge through guiding activities.',

    // 新規登録メニュー
    '旅行者として登録': 'Register as Tourist',
    'ローカルガイドと一緒に特別な旅を体験': 'Experience special journeys with local guides',
    'ガイドとして登録': 'Register as Guide',
    'あなたの知識と経験を共有しましょう': 'Share your knowledge and experience',

    // ページタイトル・メタデータ
    'Local Guide - 地元の魅力を発見': 'Local Guide - Discover Local Attractions'
  };

  // ページロード時に実行
  document.addEventListener('DOMContentLoaded', function() {
    checkAndTranslate();
  });

  // ページが完全に読み込まれた後にも実行（遅延読み込み要素対応）
  window.addEventListener('load', function() {
    setTimeout(checkAndTranslate, 500);
  });

  // 言語パラメータをチェックして必要に応じて翻訳
  function checkAndTranslate() {
    // URLからlangパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    console.log("言語パラメータ:", langParam);
    
    // 英語モードの場合、翻訳を実行
    if (langParam === 'en') {
      console.log("英語モードを適用します");
      translateToEnglish();
      updateLanguageHighlight(langParam);
    } else {
      console.log("日本語モードを維持します");
      updateLanguageHighlight('ja');
    }
  }

  // 英語に翻訳する
  function translateToEnglish() {
    console.log("ページを英語に翻訳");

    // テキストを含む要素をすべて取得して翻訳
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span, label, option, div');
    
    elements.forEach(function(element) {
      // 子要素が少ないシンプルな要素のみ処理（複雑な構造は避ける）
      if (element.children.length <= 2) {
        const originalText = element.textContent.trim();
        if (translations[originalText]) {
          element.textContent = translations[originalText];
        }
      }
    });

    // プレースホルダー属性を翻訳
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(function(input) {
      const placeholder = input.getAttribute('placeholder');
      if (placeholder && translations[placeholder]) {
        input.setAttribute('placeholder', translations[placeholder]);
      }
    });

    // ガイドカードを個別に翻訳
    translateGuideCards();
    
    // ドキュメントタイトルを翻訳
    if (document.title && translations[document.title]) {
      document.title = translations[document.title];
    }
  }

  // ガイドカードの特殊翻訳
  function translateGuideCards() {
    const cards = document.querySelectorAll('.guide-card');
    
    cards.forEach(function(card) {
      // カード内の翻訳対象要素
      const elements = card.querySelectorAll('.card-title, .card-text, .badge');
      
      elements.forEach(function(element) {
        const text = element.textContent.trim();
        if (translations[text]) {
          element.textContent = translations[text];
        }
      });
      
      // ボタン要素は特別に処理
      const buttons = card.querySelectorAll('.btn');
      buttons.forEach(function(button) {
        const text = button.textContent.trim();
        if (translations[text]) {
          button.textContent = translations[text];
        }
      });
    });
  }

  // 言語ボタンのハイライト状態を更新
  function updateLanguageHighlight(lang) {
    const jaButton = document.getElementById('ja-button');
    const enButton = document.getElementById('en-button');
    
    if (jaButton && enButton) {
      if (lang === 'en') {
        jaButton.classList.remove('active');
        enButton.classList.add('active');
      } else {
        jaButton.classList.add('active');
        enButton.classList.remove('active');
      }
    }
  }
})();