/**
 * 翻訳要素直接置換スクリプト - 最終的な解決策
 * DOM要素を直接書き換え、翻訳状態を強制的に維持する
 */
(function() {
  console.log('翻訳要素直接置換スクリプトを初期化');
  
  // 翻訳対象の主要テキスト
  const translations = {
    // ヘッダー部分
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
    'ダークモード': 'Dark Mode',
    'ライトモード': 'Light Mode',
    // メイン部分
    '人気のガイド': 'Popular Guides',
    'フィルター': 'Filter',
    'ガイドを絞り込む': 'Filter Guides',
    '場所': 'Location',
    '東京': 'Tokyo',
    '京都': 'Kyoto',
    '大阪': 'Osaka',
    '北海道': 'Hokkaido',
    '沖縄': 'Okinawa',
    'すべて': 'All',
    '言語': 'Language',
    '日本語': 'Japanese',
    '英語': 'English',
    '中国語': 'Chinese',
    '韓国語': 'Korean',
    'フランス語': 'French',
    'スペイン語': 'Spanish',
    'ドイツ語': 'German',
    'イタリア語': 'Italian',
    '料金': 'Price',
    '5000円以下': 'Under ¥5,000',
    '5000〜10000円': '¥5,000-¥10,000',
    '10000円以上': 'Over ¥10,000',
    'キーワード': 'Keywords',
    'ナイトツアー': 'Night Tour',
    'グルメ': 'Food',
    '写真スポット': 'Photo Spot',
    '料理': 'Cooking',
    'アクティビティ': 'Activity',
    'その他のキーワードを入力（コンマ区切りで複数入力可）': 'Enter other keywords (comma separated)',
    'リセット': 'Reset',
    '検索': 'Search',
    // 利用方法セクション
    '使い方': 'How to Use',
    'アカウント登録': 'Create Account',
    '簡単な情報入力と電話番号認証で登録完了': 'Simple signup with phone verification',
    'ガイドを見つける': 'Find Guides',
    '場所、言語、専門性などで理想のガイドを検索': 'Search by location, language, and expertise',
    '予約して楽しむ': 'Book and Enjoy',
    '希望の日時で予約し、特別な体験を楽しむ': 'Book at your preferred time and enjoy a special experience',
    // ガイドとしての利点セクション
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
    // フッター部分
    '会社概要': 'About Us',
    'プライバシーポリシー': 'Privacy Policy',
    '利用規約': 'Terms of Service',
    'ヘルプ': 'Help',
    'お問い合わせ': 'Contact Us',
    '© 2025 Local Guide. All rights reserved.': '© 2025 Local Guide. All rights reserved.',
    // モーダル部分
    '閉じる': 'Close',
    '送信': 'Submit',
    '確認': 'Confirm',
    'キャンセル': 'Cancel'
  };
  
  // 現在の言語
  let currentLanguage = localStorage.getItem('language') || 'ja';
  
  // 初期化時に一度実行
  document.addEventListener('DOMContentLoaded', function() {
    // 言語切替ボタンのイベントリスナーを上書き
    setupLanguageSwitchButtons();
    
    // 既存の翻訳データを適用
    applyTranslation();
    
    // ページ読み込み後に再実行
    setTimeout(function() {
      applyTranslation();
    }, 500);
  });
  
  /**
   * DOM変更を監視して翻訳を適用
   */
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          // テキストノードが変更された場合のみ適用
          if (currentLanguage === 'en') {
            applyTranslation();
          }
        }
      });
    });
    
    // 監視設定
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    console.log('DOM変更の監視を開始しました');
  }
  
  /**
   * 言語切り替えボタンのイベントリスナーを設定
   */
  function setupLanguageSwitchButtons() {
    const enButton = document.getElementById('en-button');
    const jaButton = document.getElementById('ja-button');
    
    if (enButton) {
      // 元のイベントリスナーを削除するために新しい要素に置き換え
      const newEnButton = enButton.cloneNode(true);
      enButton.parentNode.replaceChild(newEnButton, enButton);
      
      // 新しいイベントリスナーを設定
      newEnButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        switchLanguage('en');
        return false;
      });
      
      console.log('英語ボタンを設定しました');
    }
    
    if (jaButton) {
      // 元のイベントリスナーを削除するために新しい要素に置き換え
      const newJaButton = jaButton.cloneNode(true);
      jaButton.parentNode.replaceChild(newJaButton, jaButton);
      
      // 新しいイベントリスナーを設定
      newJaButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        switchLanguage('ja');
        return false;
      });
      
      console.log('日本語ボタンを設定しました');
    }
    
    // 最初に適用
    highlightCurrentLanguage();
  }
  
  /**
   * 現在の言語ボタンをハイライト
   */
  function highlightCurrentLanguage() {
    const enButton = document.getElementById('en-button');
    const jaButton = document.getElementById('ja-button');
    
    if (enButton && jaButton) {
      if (currentLanguage === 'en') {
        enButton.classList.add('active');
        jaButton.classList.remove('active');
      } else {
        jaButton.classList.add('active');
        enButton.classList.remove('active');
      }
    }
  }
  
  /**
   * 言語を切り替える
   */
  function switchLanguage(lang) {
    console.log(`言語を切り替えます: ${currentLanguage} -> ${lang}`);
    
    if (currentLanguage === lang) {
      return; // 同じ言語の場合は何もしない
    }
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // UIを更新
    if (lang === 'en') {
      console.log('英語モードに切り替えます');
      applyTranslation();
    } else {
      console.log('日本語モードに切り替えます');
      restoreOriginalTexts();
    }
    
    // 現在の言語ボタンをハイライト
    highlightCurrentLanguage();
    
    // イベントを発火して他のスクリプトに通知
    const event = new CustomEvent('languageChanged', { detail: { language: lang } });
    document.dispatchEvent(event);
  }
  
  /**
   * 翻訳を適用する
   */
  function applyTranslation() {
    if (currentLanguage !== 'en') return;
    
    console.log('英語翻訳を適用します');
    
    // テキストノードを翻訳
    translateTextNodes(document.body);
    
    // プレースホルダーを翻訳
    translatePlaceholders();
    
    // ボタンテキストを翻訳
    translateButtonTexts();
    
    // すべてのhタグを翻訳
    translateHeadings();
    
    // ガイドカードの特別な翻訳
    translateGuideCards();
    
    // フィルターセクションの特別な翻訳
    translateFilterSection();
    
    // 使い方セクションの特別な翻訳
    translateHowToUseSection();
    
    // ガイドメリットセクションの特別な翻訳
    translateBenefitsSection();
    
    console.log('英語翻訳が完了しました');
  }
  
  /**
   * 元のテキストに戻す
   */
  function restoreOriginalTexts() {
    console.log('日本語テキストに戻します');
    
    // ページをリロードする簡易的な方法
    location.reload();
  }
  
  /**
   * テキストノードを翻訳
   */
  function translateTextNodes(element) {
    if (!element) return;
    
    // 子ノードを処理
    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];
      
      // テキストノードの場合
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const text = node.textContent.trim();
        if (translations[text]) {
          node.textContent = node.textContent.replace(text, translations[text]);
        }
      }
      // 要素ノードの場合は再帰的に処理
      else if (node.nodeType === Node.ELEMENT_NODE) {
        // scriptタグは無視
        if (node.tagName.toLowerCase() !== 'script') {
          translateTextNodes(node);
        }
      }
    }
  }
  
  /**
   * プレースホルダーを翻訳
   */
  function translatePlaceholders() {
    const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(input => {
      const placeholder = input.getAttribute('placeholder');
      if (placeholder && translations[placeholder]) {
        input.setAttribute('placeholder', translations[placeholder]);
      }
    });
  }
  
  /**
   * ボタンテキストを翻訳
   */
  function translateButtonTexts() {
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
    buttons.forEach(button => {
      // typeがsubmitまたはbuttonの場合はvalue属性を翻訳
      if ((button.tagName.toLowerCase() === 'input') && 
          (button.getAttribute('type') === 'submit' || button.getAttribute('type') === 'button')) {
        const value = button.getAttribute('value');
        if (value && translations[value]) {
          button.setAttribute('value', translations[value]);
        }
      } 
      // buttonタグの場合はテキストコンテンツを翻訳
      else if (button.tagName.toLowerCase() === 'button') {
        const text = button.textContent.trim();
        if (text && translations[text]) {
          button.textContent = translations[text];
        }
      }
    });
  }
  
  /**
   * 見出しを翻訳
   */
  function translateHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const text = heading.textContent.trim();
      if (text && translations[text]) {
        heading.textContent = translations[text];
      }
    });
  }
  
  /**
   * ガイドカードを翻訳
   */
  function translateGuideCards() {
    const guideCards = document.querySelectorAll('.guide-card');
    guideCards.forEach(card => {
      // カード内のさまざまな要素を処理
      const elements = card.querySelectorAll('.card-title, .card-text, .badge, .btn');
      elements.forEach(element => {
        const text = element.textContent.trim();
        if (text && translations[text]) {
          element.textContent = translations[text];
        }
      });
    });
  }
  
  /**
   * フィルターセクションを翻訳
   */
  function translateFilterSection() {
    const filterSection = document.getElementById('guide-filter');
    if (!filterSection) return;
    
    // フィルターセクション内のラベルとオプションを処理
    const labels = filterSection.querySelectorAll('label');
    labels.forEach(label => {
      const text = label.textContent.trim();
      if (text && translations[text]) {
        label.textContent = translations[text];
      }
    });
    
    // セレクトボックスのオプションを処理
    const options = filterSection.querySelectorAll('option');
    options.forEach(option => {
      const text = option.textContent.trim();
      if (text && translations[text]) {
        option.textContent = translations[text];
      }
    });
    
    // チェックボックスのラベルを処理
    const checkboxLabels = filterSection.querySelectorAll('.form-check-label');
    checkboxLabels.forEach(label => {
      const text = label.textContent.trim();
      if (text && translations[text]) {
        label.textContent = translations[text];
      }
    });
  }
  
  /**
   * 使い方セクションを翻訳
   */
  function translateHowToUseSection() {
    const howToUseSection = document.querySelector('.how-to-use');
    if (!howToUseSection) return;
    
    // 見出しと説明を処理
    const elements = howToUseSection.querySelectorAll('h2, h3, h4, p, .step-title, .step-description');
    elements.forEach(element => {
      const text = element.textContent.trim();
      if (text && translations[text]) {
        element.textContent = translations[text];
      }
    });
  }
  
  /**
   * ガイドメリットセクションを翻訳
   */
  function translateBenefitsSection() {
    const benefitsSection = document.querySelector('.guide-benefits');
    if (!benefitsSection) return;
    
    // 見出しと説明を処理
    const elements = benefitsSection.querySelectorAll('h2, h3, h4, p, .card-title, .card-text');
    elements.forEach(element => {
      const text = element.textContent.trim();
      if (text && translations[text]) {
        element.textContent = translations[text];
      }
    });
  }
  
  // 変更監視を開始
  setupMutationObserver();
  
  // 初期言語を適用
  if (currentLanguage === 'en') {
    setTimeout(applyTranslation, 100);
  }
})();