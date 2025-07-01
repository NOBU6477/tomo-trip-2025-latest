/**
 * 英語版サイト強制適用スクリプト
 * 新しいタブで開いても必ず英語コンテンツが表示されるよう強制
 */

(function() {
  'use strict';
  
  console.log('🇺🇸 英語版サイト強制適用開始');
  
  // 即座に英語設定を強制
  function forceEnglishSettings() {
    // localStorage設定
    localStorage.setItem('language', 'en');
    localStorage.setItem('lang', 'en');
    localStorage.setItem('preferred-language', 'en');
    localStorage.setItem('site-language', 'en');
    
    // sessionStorage設定
    sessionStorage.setItem('language', 'en');
    sessionStorage.setItem('lang', 'en');
    sessionStorage.setItem('current-language', 'en');
    
    // ページタイトルと言語属性を強制設定
    document.documentElement.lang = 'en';
    document.title = 'TomoTrip - Local Guide Matching Platform';
    
    console.log('✅ 英語設定を強制適用しました');
  }
  
  // HTML lang属性を強制的に英語に設定
  function enforceEnglishHTML() {
    // HTML要素のlang属性を英語に固定
    document.documentElement.setAttribute('lang', 'en');
    
    // metaタグの言語設定
    let langMeta = document.querySelector('meta[http-equiv="content-language"]');
    if (!langMeta) {
      langMeta = document.createElement('meta');
      langMeta.setAttribute('http-equiv', 'content-language');
      document.head.appendChild(langMeta);
    }
    langMeta.setAttribute('content', 'en');
    
    console.log('✅ HTML言語属性を英語に固定しました');
  }
  
  // 日本語コンテンツを英語に強制変換
  function enforceEnglishContent() {
    const translations = {
      // ヘッダー関連
      'トモトリップ': 'TomoTrip',
      '家': 'Home',
      'ガイドを探す': 'Find Guides',
      '利点': 'Benefits',
      '使い方': 'How to Use',
      'ログイン': 'Login',
      'サインアップ': 'Sign Up',
      'ガイド登録': 'Register as Guide',
      
      // ヒーローセクション
      '地元の日本語ガイドとつながる': 'Connect with Local Japanese Guides',
      '地元の人々の目を通して、本物の日本を体験しましょう。認定ガイドを予約して、あなただけの文化体験をお楽しみください。': 'Experience authentic Japan through the eyes of locals. Book verified guides for your unique cultural experience.',
      'お問い合わせ': 'Contact Us',
      'スポンサー登録': 'Sponsor Registration',
      
      // 人気のガイドセクション
      '人気のガイド': 'Popular Guides',
      '件のガイドが見つかりました': ' guides found',
      '5件のガイドが見つかりました': '5 guides found',
      '70件のガイドが見つかりました': '70 guides found',
      'フィルターガイド': 'Filter Guides',
      '詳細を見る': 'See Details',
      
      // フィルター関連
      '位置': 'Location',
      '言語': 'Language',
      '料金（円/回）': 'Price (¥/session)',
      '全て': 'All',
      'キーワード': 'Keywords',
      'ナイトツアー': 'Night Tour',
      'グルメ': 'Gourmet',
      'フォトスポット': 'Photo Spots',
      '料理': 'Cuisine',
      '活動': 'Activities',
      'その他のキーワードを入力してください（複数のキーワードの場合はカンマで区切ってください）': 'Enter other keywords (separate multiple keywords with commas)',
      'リセット': 'Reset',
      '検索': 'Search',
      
      // 使い方セクション
      '地元のガイドとつながるための簡単な手順': 'Simple steps to connect with local guides',
      'アカウント登録': 'Account Registration',
      '簡単な情報入力と電話番号認証で登録完了': 'Complete registration with simple information input and phone number verification',
      'ガイドを探す': 'Find Guides',
      '場所、言語、専門知識で理想的なガイドを検索': 'Search for ideal guides by location, language, and expertise',
      '予約して楽しんでください': 'Book and Enjoy',
      'ご希望の日時を予約して、特別な体験をお楽しみください': 'Book your preferred date and time, and enjoy a special experience',
      
      // ガイドになるメリット
      'ガイドになるメリット': 'Benefits of Being a Guide',
      'あなたの知識と経験を活かして、世界中の旅行者に特別な体験を提供しましょう': 'Use your knowledge and experience to provide special experiences to travelers from around the world',
      'ガイドとして登録する': 'Register as Guide',
      
      // ベネフィットカード
      'あなたの日常生活が観光資源になる': 'Your daily life becomes a tourism resource',
      '地元の人だけが知っている特別な場所や体験を共有し、日常の瞬間を、かけがえのない旅の思い出に変えましょう。': 'Share special places and experiences known only to locals, and turn everyday moments into unforgettable travel memories.',
      
      '空き時間を活用して効率的に働く': 'Use your free time efficiently',
      '都合の良い時間にスケジュールを設定でき、本業や趣味とバランスを取りながら収入を得られます。': 'You can set schedules at convenient times and earn income while balancing your main job and hobbies.',
      
      '世界中の新しい人々と出会う': 'Meet new people from around the world',
      'さまざまな国や文化圏の旅行者との交流を通して、国際的なネットワークを広げ、異文化理解を深められます。': 'Through interactions with travelers from various countries and cultures, you can expand your international network and deepen your cross-cultural understanding.',
      
      '言語スキルを活用し、さらに向上させる': 'Utilize and further improve your language skills',
      '外国語を使う実践的な機会が得られ、コミュニケーション能力が自然と高まります。': 'You can get practical opportunities to use foreign languages, and your communication skills will naturally improve.',
      
      '故郷への愛と誇りを深める': 'Deepen your love and pride for your hometown',
      '地元の魅力を発信することで、自分自身の住む地域への理解や愛着がより強くなります。': 'By promoting the charm of your local area, your understanding and attachment to the region where you live will become stronger.',
      
      '信頼できるサポート体制': 'Reliable support system',
      '予約管理、決済、保険など、ガイド活動に必要な基盤を当サービスが提供するので安心して活動できます。': 'Our service provides the necessary infrastructure for guide activities such as booking management, payments, and insurance, so you can work with peace of mind.',
      
      '真実な経験とスキルを積む': 'Build authentic experience and skills',
      '観光、コミュニケーション、文化交流の経験を積み、個人的かつ専門的な成長を促進します。': 'Gain experience in tourism, communication, and cultural exchange, promoting personal and professional growth.',
      
      '地域社会の発展に貢献できる': 'Contribute to community development',
      '地元の企業、レストラン、文化的な場所を観光客に紹介することで、地域経済を支援し、地域社会の繁栄に貢献します。': 'By introducing local businesses, restaurants, and cultural places to tourists, you support the local economy and contribute to community prosperity.',
      
      // 日本語（言語タグ）
      '日本語': 'Japanese',
      '英語': 'English',
      '中国語': 'Chinese',
      '韓国語': 'Korean',
      '中国語': 'Chinese',
      'イタリア語': 'Italian',
      'フランス語': 'French'
    };
    
    // すべてのテキストノードを処理
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    let translationCount = 0;
    
    while (node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (text && translations[text]) {
        node.textContent = translations[text];
        translationCount++;
      }
      
      // 「〜件のガイドが見つかりました」パターンの処理
      if (text.match(/\d+件のガイドが見つかりました/)) {
        const newText = text.replace(/(\d+)件のガイドが見つかりました/, '$1 guides found');
        node.textContent = newText;
        translationCount++;
      }
    }
    
    // 要素の属性も処理
    const elementsWithText = document.querySelectorAll('[placeholder], [title], [alt]');
    elementsWithText.forEach(element => {
      if (element.placeholder && translations[element.placeholder]) {
        element.placeholder = translations[element.placeholder];
      }
      if (element.title && translations[element.title]) {
        element.title = translations[element.title];
      }
      if (element.alt && translations[element.alt]) {
        element.alt = translations[element.alt];
      }
    });
    
    console.log(`✅ ${translationCount}個のテキストを英語に変換しました`);
  }
  
  // URL確認と強制リダイレクト
  function checkAndEnforceEnglishURL() {
    const currentURL = window.location.href;
    
    // 日本語版のindex.htmlにアクセスしている場合、英語版にリダイレクト
    if (currentURL.includes('index.html') && !currentURL.includes('index-en.html')) {
      const englishURL = currentURL.replace('index.html', 'index-en.html');
      console.log('🔄 英語版URLにリダイレクトします:', englishURL);
      window.location.href = englishURL;
      return false;
    }
    
    return true;
  }
  
  // DOM監視と継続的な英語強制
  function setupContinuousEnforcement() {
    const observer = new MutationObserver((mutations) => {
      let needsTranslation = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          needsTranslation = true;
        }
        if (mutation.type === 'characterData') {
          needsTranslation = true;
        }
      });
      
      if (needsTranslation) {
        setTimeout(enforceEnglishContent, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    console.log('🔍 継続的な英語強制監視を開始しました');
  }
  
  // メイン初期化関数
  function initialize() {
    console.log('🚀 英語版サイト強制適用初期化');
    
    // URL確認
    if (!checkAndEnforceEnglishURL()) {
      return; // リダイレクトが発生した場合は処理を停止
    }
    
    // 即座に実行
    forceEnglishSettings();
    enforceEnglishHTML();
    
    // DOM構築後に翻訳実行
    setTimeout(() => {
      enforceEnglishContent();
      setupContinuousEnforcement();
    }, 100);
    
    // 遅延実行（他のスクリプトの干渉対策）
    setTimeout(() => {
      forceEnglishSettings();
      enforceEnglishContent();
    }, 500);
    
    setTimeout(() => {
      enforceEnglishContent();
    }, 1000);
    
    // 最終確認実行
    setTimeout(() => {
      forceEnglishSettings();
      enforceEnglishContent();
      console.log('🎯 英語版サイト強制適用完了');
    }, 2000);
  }
  
  // 即座に実行（ページ読み込み状態に関係なく）
  initialize();
  
  // DOMContentLoadedでも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }
  
  // ページ完全読み込み後も実行
  window.addEventListener('load', () => {
    setTimeout(initialize, 100);
  });
  
  // ページ表示時（新しいタブで開いた時）も実行
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(initialize, 50);
    }
  });
  
  console.log('📝 英語版サイト強制適用システム設定完了');
  
})();