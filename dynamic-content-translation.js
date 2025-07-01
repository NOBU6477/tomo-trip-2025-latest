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

    document.querySelectorAll('.guide-card').forEach(card => {
      // ガイド名（そのまま保持）
      const nameElement = card.querySelector('.guide-name, h5');
      
      // 地域翻訳
      const regionElement = card.querySelector('.guide-location, .text-muted');
      if (regionElement) {
        const regionText = regionElement.textContent.trim();
        const englishRegion = translations.regions[regionText];
        if (englishRegion) {
          regionElement.textContent = englishRegion;
        }
      }

      // 説明文翻訳
      const descriptionElement = card.querySelector('.guide-description, .card-text p');
      if (descriptionElement) {
        translateDescription(descriptionElement);
      }

      // キーワードバッジ翻訳
      card.querySelectorAll('.badge').forEach(badge => {
        const keywordText = badge.textContent.trim();
        const englishKeyword = translations.keywords[keywordText];
        if (englishKeyword) {
          badge.textContent = englishKeyword;
        }
      });

      // 料金表示翻訳
      const feeElement = card.querySelector('.guide-fee, .fee');
      if (feeElement && feeElement.textContent.includes('時間')) {
        feeElement.textContent = feeElement.textContent.replace('円/時間', ' yen/hour');
      }
    });

    console.log('動的ガイドカード翻訳完了');
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
    document.querySelectorAll('h2, h3, .section-title').forEach(title => {
      if (title.textContent.includes('ガイドになる特典') || title.textContent.includes('ガイドのメリット')) {
        title.textContent = 'Benefits of Becoming a Guide';
      }
    });

    // ベネフィットカード翻訳
    document.querySelectorAll('.card').forEach(card => {
      const cardText = card.textContent;
      
      // タイトルと説明文の翻訳
      for (const [japaneseTitle, englishTitle] of Object.entries(translations.benefits)) {
        if (cardText.includes(japaneseTitle)) {
          // タイトル翻訳
          const titleElement = card.querySelector('.card-title, h5, h4');
          if (titleElement && titleElement.textContent.includes(japaneseTitle)) {
            titleElement.textContent = englishTitle;
          }
          
          // 説明文翻訳
          const contentElement = card.querySelector('.card-text, p');
          if (contentElement) {
            // 対応する説明文を検索
            const nextEntry = Object.entries(translations.benefits).find(([key]) => 
              cardText.includes(key) && key !== japaneseTitle && key.length > 10
            );
            
            if (nextEntry) {
              contentElement.textContent = nextEntry[1];
            }
          }
          break;
        }
      }
    });

    console.log('ベネフィットセクション翻訳完了');
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