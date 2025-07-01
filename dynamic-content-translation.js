/**
 * 動的コンテンツ翻訳システム
 * ガイド登録・編集データの翻訳と階層間言語設定維持
 */

(function() {
  'use strict';

  console.log('🌐 動的コンテンツ翻訳システム開始');

  // 翻訳データベース
  const translations = {
    // ガイド説明文の翻訳パターン
    descriptions: {
      '私は{region}の地元ガイドです。{keyword1}と{keyword2}を得意としており、観光客の皆様に最高の体験を提供します。': 
        'I am a local guide in {region}. I specialize in {keyword1} and {keyword2}, providing the best experience for tourists.',
      '{region}生まれ{region}育ちのガイドです。{keyword1}や{keyword2}など、地元ならではの魅力をお伝えします。':
        'Born and raised in {region}. I will share local attractions like {keyword1} and {keyword2} that only locals know.',
      '{region}在住15年のベテランガイドです。{keyword1}と{keyword2}の知識が豊富で、安心してお任せいただけます。':
        'A veteran guide with 15 years of experience in {region}. Rich knowledge of {keyword1} and {keyword2}, you can trust me.',
      '{region}の隠れた名所をご案内します。{keyword1}と{keyword2}を中心に、忘れられない旅をお手伝いします。':
        'I will guide you to hidden gems in {region}. Focusing on {keyword1} and {keyword2}, I will help create an unforgettable trip.',
      '{region}で生まれ育った地元民です。{keyword1}や{keyword2}を通じて、本当の{region}の魅力をお見せします。':
        'A local born and raised in {region}. Through {keyword1} and {keyword2}, I will show you the true charm of {region}.',
    },
    
    // キーワード翻訳
    keywords: {
      'ナイトツアー': 'Night Tour',
      'グルメ': 'Gourmet',
      '写真スポット': 'Photo Spots',
      '観光': 'Sightseeing',
      '料理': 'Cuisine',
      '文化体験': 'Cultural Experience',
      'アクティビティ': 'Activities',
      '自然': 'Nature',
      '歴史': 'History',
      '寺院': 'Temples',
      'ショッピング': 'Shopping',
      'ファッション': 'Fashion',
      'アート': 'Art',
      '音楽': 'Music',
      'フェスティバル': 'Festivals',
      '温泉': 'Hot Springs',
      'ハイキング': 'Hiking',
      'サイクリング': 'Cycling',
      '釣り': 'Fishing',
      'スキー': 'Skiing',
      '海水浴': 'Beach',
      'ダイビング': 'Diving',
      '陶芸': 'Pottery',
      '茶道': 'Tea Ceremony',
      '書道': 'Calligraphy',
      '武道': 'Martial Arts',
      '伝統工芸': 'Traditional Crafts',
      '地酒': 'Local Sake',
      '和菓子': 'Japanese Sweets',
      'ラーメン': 'Ramen',
      '寿司': 'Sushi',
      '居酒屋': 'Izakaya',
      '市場': 'Market',
      '祭り': 'Festival',
      '花見': 'Cherry Blossom Viewing',
      '紅葉': 'Autumn Leaves',
      '雪景色': 'Snow Scenery'
    },

    // 地域翻訳（都道府県 + 市）
    regions: {
      '北海道 札幌市': 'Sapporo, Hokkaido',
      '北海道 函館市': 'Hakodate, Hokkaido',
      '青森県 青森市': 'Aomori, Aomori',
      '宮城県 仙台市': 'Sendai, Miyagi',
      '秋田県 秋田市': 'Akita, Akita',
      '山形県 山形市': 'Yamagata, Yamagata',
      '福島県 会津若松市': 'Aizu-Wakamatsu, Fukushima',
      '茨城県 水戸市': 'Mito, Ibaraki',
      '栃木県 日光市': 'Nikko, Tochigi',
      '群馬県 前橋市': 'Maebashi, Gunma',
      '埼玉県 川越市': 'Kawagoe, Saitama',
      '千葉県 千葉市': 'Chiba, Chiba',
      '東京都 新宿区': 'Shinjuku, Tokyo',
      '東京都 渋谷区': 'Shibuya, Tokyo',
      '東京都 台東区': 'Taito, Tokyo',
      '神奈川県 横浜市': 'Yokohama, Kanagawa',
      '神奈川県 鎌倉市': 'Kamakura, Kanagawa',
      '新潟県 新潟市': 'Niigata, Niigata',
      '富山県 富山市': 'Toyama, Toyama',
      '石川県 金沢市': 'Kanazawa, Ishikawa',
      '福井県 福井市': 'Fukui, Fukui',
      '山梨県 甲府市': 'Kofu, Yamanashi',
      '長野県 松本市': 'Matsumoto, Nagano',
      '岐阜県 高山市': 'Takayama, Gifu',
      '静岡県 静岡市': 'Shizuoka, Shizuoka',
      '愛知県 名古屋市': 'Nagoya, Aichi',
      '三重県 伊勢市': 'Ise, Mie',
      '滋賀県 大津市': 'Otsu, Shiga',
      '京都府 京都市': 'Kyoto, Kyoto',
      '大阪府 大阪市': 'Osaka, Osaka',
      '兵庫県 神戸市': 'Kobe, Hyogo',
      '奈良県 奈良市': 'Nara, Nara',
      '和歌山県 和歌山市': 'Wakayama, Wakayama',
      '鳥取県 鳥取市': 'Tottori, Tottori',
      '島根県 松江市': 'Matsue, Shimane',
      '岡山県 岡山市': 'Okayama, Okayama',
      '広島県 広島市': 'Hiroshima, Hiroshima',
      '山口県 下関市': 'Shimonoseki, Yamaguchi',
      '徳島県 徳島市': 'Tokushima, Tokushima',
      '香川県 高松市': 'Takamatsu, Kagawa',
      '愛媛県 松山市': 'Matsuyama, Ehime',
      '高知県 高知市': 'Kochi, Kochi',
      '福岡県 福岡市': 'Fukuoka, Fukuoka',
      '佐賀県 佐賀市': 'Saga, Saga',
      '長崎県 長崎市': 'Nagasaki, Nagasaki',
      '熊本県 熊本市': 'Kumamoto, Kumamoto',
      '大分県 別府市': 'Beppu, Oita',
      '宮崎県 宮崎市': 'Miyazaki, Miyazaki',
      '鹿児島県 鹿児島市': 'Kagoshima, Kagoshima',
      '沖縄県 那覇市': 'Naha, Okinawa',
      '沖縄県 石垣島': 'Ishigaki Island, Okinawa',
      '沖縄県 宮古島': 'Miyako Island, Okinawa',
      '沖縄県 竹富島': 'Taketomi Island, Okinawa',
      '沖縄県 西表島': 'Iriomote Island, Okinawa',
      '沖縄県 与那国島': 'Yonaguni Island, Okinawa',
      '東京都 小笠原諸島': 'Ogasawara Islands, Tokyo',
      '鹿児島県 屋久島': 'Yakushima, Kagoshima',
      '鹿児島県 種子島': 'Tanegashima, Kagoshima',
      '鹿児島県 奄美大島': 'Amami Oshima, Kagoshima',
      '長崎県 壱岐': 'Iki, Nagasaki',
      '長崎県 対馬': 'Tsushima, Nagasaki',
      '島根県 隠岐諸島': 'Oki Islands, Shimane',
      '新潟県 佐渡島': 'Sado Island, Niigata'
    },

    // ベネフィットカード翻訳
    benefits: {
      '収入アップ': 'Increase Income',
      'ガイド活動を通じて収入を得ることができます。観光客との交流で経験も積めて、個人ブランドの構築にもつながります。':
        'Earn money through guide activities and build your personal brand through tourist interactions.',
        
      'スキル向上': 'Skill Enhancement',
      '言語スキルやコミュニケーション能力が向上します。観光客との会話で実践的な語学力を身につけることができます。':
        'Improve language skills and communication abilities through practical conversations with tourists.',
        
      'ネットワーク構築': 'Network Building',
      '世界中の人々とのつながりを築くことができます。国際的な人脈を広げ、異文化交流の機会が増えます。':
        'Build connections with people from around the world and expand your international network through cultural exchange.',
        
      '地域貢献': 'Community Contribution',
      '地元の魅力を世界に発信することで地域振興に貢献できます。観光業の発展に直接関わることができます。':
        'Contribute to local development by promoting regional attractions to the world and directly participate in tourism growth.',
        
      '個人成長': 'Personal Growth',
      'ガイドとしての経験を通じて自己成長を実現できます。責任感やリーダーシップスキルを身につけることができます。':
        'Achieve personal growth through guide experience and develop responsibility and leadership skills.',
        
      '文化交流': 'Cultural Exchange',
      '異なる文化背景を持つ人々との交流で視野が広がります。多様な価値観に触れることで人間としても成長できます。':
        'Broaden your perspective through interaction with people from different cultural backgrounds and grow as a person.'
    }
  };

  // 階層間言語設定維持システム
  function setupCrossSiteLangPersistence() {
    // 現在のページレベルを検出
    const currentDepth = window.location.pathname.split('/').length - 1;
    console.log('現在の階層レベル:', currentDepth);
    
    // 言語設定の階層間同期
    function syncLanguageAcrossLevels(language) {
      // すべての可能な階層パスで言語設定を保存
      for (let depth = 0; depth <= 3; depth++) {
        const prefix = depth === 0 ? '' : '../'.repeat(depth);
        localStorage.setItem(`${prefix}selectedLanguage`, language);
        localStorage.setItem(`${prefix}language`, language);
      }
      
      // 絶対パス系も保存
      localStorage.setItem('selectedLanguage', language);
      localStorage.setItem('language', language);
      localStorage.setItem('globalLanguage', language);
      
      console.log('言語設定を全階層に同期:', language);
    }

    // 言語ボタンのイベント設定
    const langJa = document.getElementById('lang-ja');
    const langEn = document.getElementById('lang-en');
    
    if (langJa) {
      langJa.addEventListener('click', function(e) {
        e.preventDefault();
        syncLanguageAcrossLevels('ja');
        window.location.reload();
      });
    }
    
    if (langEn) {
      langEn.addEventListener('click', function(e) {
        e.preventDefault();
        syncLanguageAcrossLevels('en');
        window.location.reload();
      });
    }
  }

  // 動的ガイドカード翻訳
  function translateDynamicGuideCards() {
    const currentLang = getCurrentLanguage();
    if (currentLang !== 'en') return;

    console.log('動的ガイドカード翻訳開始');

    // より包括的なガイドカード検索
    const cardSelectors = [
      '.guide-card',
      '.card.guide-card', 
      '.card.h-100',
      '.card.shadow-sm',
      '.guide-item .card',
      '.col-md-4 .card',
      '.col-lg-4 .card'
    ];

    let cardsFound = 0;

    cardSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(card => {
        const cardText = card.textContent;
        
        // ガイドカードかどうかを判定
        if (!cardText.includes('ガイド') && !cardText.includes('詳細を見る') && !cardText.includes('円')) {
          return;
        }

        cardsFound++;
        console.log(`ガイドカード ${cardsFound} を翻訳中:`, card);

        // ガイド名は保持
        const nameElement = card.querySelector('.card-title, h5, .guide-name');
        if (nameElement) {
          console.log('ガイド名:', nameElement.textContent);
        }
        
        // 地域翻訳（複数パターンに対応）
        const regionElements = card.querySelectorAll('.text-muted');
        regionElements.forEach(element => {
          if (element.textContent.includes('🗺️') || element.textContent.includes('geo-alt') || 
              element.querySelector('i.bi-geo-alt-fill')) {
            const regionText = element.textContent.replace(/🗺️|\s*geo-alt\s*/g, '').trim();
            const englishRegion = translations.regions[regionText];
            if (englishRegion) {
              element.innerHTML = element.innerHTML.replace(regionText, englishRegion);
              console.log('地域翻訳:', regionText, '→', englishRegion);
            }
          }
        });

        // 説明文翻訳（最も重要）
        const descriptionElements = [
          card.querySelector('.card-text'),
          card.querySelector('.card-text.small'),
          card.querySelector('p.small'),
          card.querySelector('.card-body p:not(.text-muted)')
        ].filter(el => el);

        descriptionElements.forEach(descElement => {
          if (descElement && descElement.textContent.length > 10) {
            console.log('翻訳前の説明文:', descElement.textContent);
            translateDescription(descElement);
            console.log('翻訳後の説明文:', descElement.textContent);
          }
        });

        // 言語バッジ翻訳
        card.querySelectorAll('.badge, .text-muted').forEach(element => {
          if (element.textContent.includes('🌐') || element.textContent.includes('translate') || 
              element.querySelector('i.bi-translate')) {
            // 日本語の言語名を英語に翻訳
            let langText = element.innerHTML;
            langText = langText.replace('日本語', 'Japanese');
            langText = langText.replace('英語', 'English');
            langText = langText.replace('中国語', 'Chinese');
            langText = langText.replace('韓国語', 'Korean');
            langText = langText.replace('フランス語', 'French');
            langText = langText.replace('スペイン語', 'Spanish');
            langText = langText.replace('ドイツ語', 'German');
            langText = langText.replace('イタリア語', 'Italian');
            element.innerHTML = langText;
          }
        });

        // キーワードバッジ翻訳
        card.querySelectorAll('.badge').forEach(badge => {
          const keywordText = badge.textContent.trim();
          const englishKeyword = translations.keywords[keywordText];
          if (englishKeyword) {
            badge.textContent = englishKeyword;
            console.log('キーワード翻訳:', keywordText, '→', englishKeyword);
          }
        });

        // 詳細ボタンと料金翻訳
        card.querySelectorAll('button, a, .btn').forEach(btn => {
          if (btn.textContent.includes('詳細を見る')) {
            btn.textContent = btn.textContent.replace('詳細を見る', 'See Details');
          }
          if (btn.textContent.includes('円/セッション')) {
            btn.textContent = btn.textContent.replace('円/セッション', ' yen/session');
          }
          if (btn.textContent.includes('セッション')) {
            btn.textContent = btn.textContent.replace('セッション', 'session');
          }
        });

        // 得意分野翻訳
        card.querySelectorAll('small, .small').forEach(small => {
          if (small.textContent.includes('得意分野:')) {
            let text = small.textContent;
            text = text.replace('得意分野:', 'Specialties:');
            
            // 各キーワードを翻訳
            Object.entries(translations.keywords).forEach(([jp, en]) => {
              text = text.replace(jp, en);
            });
            
            small.textContent = text;
          }
        });
      });
    });

    console.log(`動的ガイドカード翻訳完了: ${cardsFound}件のカードを処理`);
  }

  // 説明文翻訳処理
  function translateDescription(element) {
    const originalText = element.textContent.trim();
    
    // 翻訳パターンマッチング
    for (const [japanesePattern, englishPattern] of Object.entries(translations.descriptions)) {
      // パターンから変数部分を抽出
      const japaneseRegex = japanesePattern
        .replace(/\{region\}/g, '([^。]+)')
        .replace(/\{keyword1\}/g, '([^。]+)')
        .replace(/\{keyword2\}/g, '([^。]+)');
      
      const match = originalText.match(new RegExp(japaneseRegex));
      if (match) {
        let englishText = englishPattern;
        
        // 地域翻訳
        if (match[1]) {
          const regionShort = match[1].split(' ')[0];
          const englishRegion = translations.regions[match[1]] || regionShort;
          englishText = englishText.replace('{region}', englishRegion);
        }
        
        // キーワード翻訳
        if (match[2]) {
          const englishKeyword1 = translations.keywords[match[2]] || match[2];
          englishText = englishText.replace('{keyword1}', englishKeyword1);
        }
        
        if (match[3]) {
          const englishKeyword2 = translations.keywords[match[3]] || match[3];
          englishText = englishText.replace('{keyword2}', englishKeyword2);
        }
        
        element.textContent = englishText;
        return;
      }
    }
    
    // パターンマッチしない場合の基本翻訳
    let translatedText = originalText;
    
    // キーワード置換
    for (const [japanese, english] of Object.entries(translations.keywords)) {
      translatedText = translatedText.replace(new RegExp(japanese, 'g'), english);
    }
    
    // 地域置換
    for (const [japanese, english] of Object.entries(translations.regions)) {
      translatedText = translatedText.replace(new RegExp(japanese, 'g'), english);
    }
    
    if (translatedText !== originalText) {
      element.textContent = translatedText;
    }
  }

  // ベネフィットセクション翻訳
  function translateBenefitSection() {
    const currentLang = getCurrentLanguage();
    if (currentLang !== 'en') return;

    console.log('ベネフィットセクション翻訳開始');

    // セクションタイトル翻訳
    document.querySelectorAll('h1, h2, h3, .section-title').forEach(title => {
      if (title.textContent.includes('ガイドになる特典') || 
          title.textContent.includes('ガイドのメリット') ||
          title.textContent.includes('Benefits of Being a Guide')) {
        title.textContent = 'Benefits of Becoming a Guide';
      }
    });

    // より包括的なベネフィットカード翻訳
    const benefitCards = document.querySelectorAll('.card, .benefit-card, [class*="benefit"]');
    let cardsProcessed = 0;

    benefitCards.forEach(card => {
      const cardText = card.textContent;
      
      // ベネフィットカードの特定パターンを検索
      const benefitPatterns = [
        'Your daily life becomes a tourism resource',
        'Work efficiently using spare time', 
        'Meet new people from around the world',
        'Utilize and improve language skills',
        'Deepen love and pride for your hometown',
        'Reliable support system',
        'Work at your own pace',
        'Contribute to regional revitalization'
      ];

      // 英語タイトルが含まれているカードを検索
      const hasEnglishTitle = benefitPatterns.some(pattern => cardText.includes(pattern));
      
      if (hasEnglishTitle || cardText.includes('地元の方だけが') || cardText.includes('自分の都合の') || 
          cardText.includes('様々な国や文化') || cardText.includes('外国語を使う') ||
          cardText.includes('地元の魅力を') || cardText.includes('予約管理') ||
          cardText.includes('予約を受ける') || cardText.includes('観光客を地元の')) {
        
        cardsProcessed++;
        console.log(`ベネフィットカード ${cardsProcessed} を翻訳中`);

        // 説明文を具体的に翻訳（完全な文章マッチング）
        const descriptionElement = card.querySelector('.card-text, p, .text-muted, .description');
        if (descriptionElement) {
          let text = descriptionElement.textContent.trim();
          
          // 具体的な文章翻訳
          if (text.includes('地元の方だけが知っている場所や体験を共有することで、日常がより輝いた旅の思い出に変わります。')) {
            descriptionElement.textContent = 'Share local secrets and experiences that only locals know, transforming everyday moments into brilliant travel memories.';
          } else if (text.includes('自分の都合の良い時間にスケジュールを設定できるため、本業や学業と両立しながら収入を得られます。')) {
            descriptionElement.textContent = 'Set your schedule according to your convenience, earning income while balancing your main job or studies.';
          } else if (text.includes('様々な国や文化的な背景を持つ旅行者との交流を通じて、国際的な人脈を広げ、異文化理解を深められます。')) {
            descriptionElement.textContent = 'Expand your international network and deepen cross-cultural understanding through interactions with travelers from various countries and backgrounds.';
          } else if (text.includes('外国語を使う実践的な機会が得られ、コミュニケーション能力が自然と高まります。')) {
            descriptionElement.textContent = 'Gain practical opportunities to use foreign languages and naturally improve your communication skills.';
          } else if (text.includes('地元の魅力を発信することで、自分自身の住む地域の理解や愛着がより深くなります。')) {
            descriptionElement.textContent = 'Deepen your understanding and attachment to your local area by promoting its attractions to others.';
          } else if (text.includes('予約管理、決済、保険など、ガイド活動に必要な基盤をサポートするので安心して活動できます。')) {
            descriptionElement.textContent = 'Reliable support for booking management, payments, insurance, and other essential infrastructure for guide activities.';
          } else if (text.includes('予約を受ける日時や頻度は完全に自分次第のため、ライフスタイルに合わせた働き方ができます。')) {
            descriptionElement.textContent = 'Complete control over booking schedule and frequency allows you to work according to your lifestyle.';
          } else if (text.includes('観光客を地元のお店や施設に案内することで、地域経済の活性化とコミュニティの発展に貢献できます。')) {
            descriptionElement.textContent = 'Contribute to local economic revitalization and community development by guiding tourists to local shops and facilities.';
          }
          
          console.log('ベネフィット説明文翻訳完了:', text.substring(0, 50) + '...');
        }
      }
    });

    console.log(`ベネフィットセクション翻訳完了: ${cardsProcessed}件のカードを処理`);
  }

  // 現在の言語設定を取得
  function getCurrentLanguage() {
    return localStorage.getItem('selectedLanguage') || 
           localStorage.getItem('language') || 
           localStorage.getItem('globalLanguage') || 
           'ja';
  }

  // 言語設定適用
  function applyLanguageSettings() {
    const currentLang = getCurrentLanguage();
    console.log('現在の言語設定:', currentLang);
    
    if (currentLang === 'en') {
      // 言語ドロップダウン表示更新
      const languageButton = document.getElementById('languageDropdown');
      if (languageButton) {
        languageButton.textContent = 'English';
      }
      
      // 各翻訳の実行
      setTimeout(() => {
        translateDynamicGuideCards();
        translateBenefitSection();
      }, 100);
      
      setTimeout(() => {
        translateDynamicGuideCards();
        translateBenefitSection();
      }, 500);
      
      setTimeout(() => {
        translateDynamicGuideCards();
        translateBenefitSection();
      }, 1000);
    }
  }

  // 初期化
  function initialize() {
    console.log('動的コンテンツ翻訳システム初期化');
    
    // 階層間言語設定維持
    setupCrossSiteLangPersistence();
    
    // 初期言語設定適用
    applyLanguageSettings();
    
    // DOM変更監視（新しいコンテンツの動的翻訳）
    const observer = new MutationObserver((mutations) => {
      let shouldTranslate = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (node.classList.contains('guide-card') || node.querySelector('.guide-card'))) {
              shouldTranslate = true;
            }
          });
        }
      });
      
      if (shouldTranslate && getCurrentLanguage() === 'en') {
        setTimeout(() => {
          translateDynamicGuideCards();
          translateBenefitSection();
        }, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // DOM読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // グローバル関数として公開
  window.dynamicTranslation = {
    translateGuideCards: translateDynamicGuideCards,
    translateBenefits: translateBenefitSection,
    getCurrentLanguage: getCurrentLanguage
  };

})();