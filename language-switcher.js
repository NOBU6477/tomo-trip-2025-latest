/**
 * 全サイト共通言語切り替え機能
 * すべてのページで動作し、ローカルストレージで言語設定を保存
 */
// グローバル変数として定義
var switchLanguage;

(function() {
  console.log('言語切り替え機能を初期化中... v2');

  // デバッグログ追加
  window.addEventListener('error', function(e) {
    console.error('言語切り替えエラー:', e.message);
  });

  // 現在の言語設定を取得（デフォルトは日本語）
  let currentLang = localStorage.getItem('localGuideLanguage') || 'ja';
  
  // 翻訳データ - すべてのページで使用される要素
  const translations = {
    'en': {
      // ヘッダーとナビゲーション
      'navbar': {
        'home': 'Home',
        'find-guides': 'Find Guides',
        'how-to-use': 'How to Use',
        'login': 'Login',
        'register': 'Register',
        'as-tourist': 'Register as Tourist',
        'tourist-desc': 'Experience unique trips with local guides',
        'as-guide': 'Register as Guide',
        'guide-desc': 'Share your knowledge and experience'
      },
      
      // ホームページ - ヒーローセクション
      'hero': {
        'title': 'Your Special Journey Awaits',
        'subtitle': 'Experience hidden gems with local guides that you cannot find in regular tours',
        'find-guides': 'Find Guides',
        'contact-us': 'Contact Us'
      },
      
      // ホームページ - ガイド検索
      'guides': {
        'popular': 'Popular Guides',
        'filter': 'Filter Guides',
        'region': 'Region',
        'language': 'Language',
        'fee': 'Fee',
        'all': 'All'
      },
      
      // ホームページ - 使い方セクション
      'how-it-works': {
        'title': 'How It Works',
        'for-tourists': 'For Tourists',
        'for-guides': 'For Guides',
        'tourist-steps': [
          'Sign up as a tourist',
          'Search for guides that match your interests',
          'Contact and book a guide',
          'Enjoy your unique experience'
        ],
        'guide-steps': [
          'Sign up as a guide',
          'Create your attractive profile',
          'Set your available schedule',
          'Accept bookings and guide tourists'
        ]
      },
      
      // ホームページ - ガイド特典セクション
      'benefits': {
        'title': 'Benefits of Being a Guide',
        'items': [
          {
            'title': 'Earn Extra Income',
            'desc': 'Set your own fees and get paid directly for sharing your knowledge and passion.'
          },
          {
            'title': 'Flexible Schedule',
            'desc': 'Work when it fits your schedule, making it perfect alongside your main job or studies.'
          },
          {
            'title': 'Do What You Love',
            'desc': 'Turn your hobby, expertise, or special knowledge into a rewarding experience for others.'
          },
          {
            'title': 'Meet People from Around the World',
            'desc': 'Expand your network globally and deepen your cultural understanding.'
          }
        ]
      },
      
      // フッター
      'footer': {
        'about-us': 'About Us',
        'terms': 'Terms of Service',
        'privacy': 'Privacy Policy',
        'faq': 'FAQ',
        'copyright': '© 2025 Local Guide. All Rights Reserved.'
      },
      
      // ガイドプロフィールページ
      'guide-profile': {
        'basic-info': 'Basic Information',
        'photo-gallery': 'Photo Gallery',
        'schedule': 'Schedule',
        'messages': 'Messages',
        'account-settings': 'Account Settings',
        'fullname': 'Full Name',
        'username': 'Username',
        'profile-url-note': 'This will be used in your profile URL',
        'email-address': 'Email Address',
        'activity-area': 'Activity Area',
        'activity-area-placeholder': 'e.g., Shinjuku, Tokyo',
        'supported-languages': 'Supported Languages',
        'self-introduction': 'Self Introduction',
        'session-fee': 'Session Fee (per session)',
        'fee-description': 'The standard fee is ¥6,000/session. Setting a higher fee may result in fewer bookings.',
        'specialties': 'Specialties & Interests',
        'keyword-night': 'Night Tours',
        'keyword-food': 'Gourmet',
        'keyword-photo': 'Photo Spots',
        'keyword-cooking': 'Cooking',
        'keyword-activity': 'Activities',
        'other-keywords': 'Enter other keywords (separate multiple with commas)',
        'save-changes': 'Save Changes',
        'gallery-description': 'Upload photos of your activities and places you can guide. You can set up to 15 photos.',
        'add-photo': 'Add Photo',
        'schedule-settings': 'Available Time Settings',
        'schedule-description': 'Set your available times for each day of the week.',
        'day-available': 'Available on this day',
        'start-time': 'Start Time',
        'end-time': 'End Time',
        'save-schedule': 'Save Schedule',
        'reservation-calendar': 'Reservation Calendar',
        'calendar-info': 'Green dates are available for booking, red dates are fully booked.',
        'time-settings': 'Time Settings',
        'booking-summary': 'Booking Summary',
        'reservations-this-month': 'Reservations this month',
        'reservations-next-month': 'Reservations next month',
        'cancellations': 'Cancellations',
        'total-booking-days': 'Total booking days',
        'next-reservation': 'Next reservation',
        'april': 'Apr',
        'prev-month': 'Previous Month',
        'current-month': 'Current Month',
        'next-month': 'Next Month',
        'prev-year': 'Previous Year',
        'next-year': 'Next Year',
        'mobility-range': 'Mobility Range',
        'start-article': 'Start Article'
      }
    }
  };

  // DOMが読み込まれた後に実行
  document.addEventListener('DOMContentLoaded', initializeLanguageSwitcher);

  /**
   * 言語切り替え機能の初期化
   */
  function initializeLanguageSwitcher() {
    // 言語切り替えボタンを設定
    setupLanguageButtons();
    
    // 保存されている言語で初期表示
    applyLanguage(currentLang, false);
  }

  /**
   * 言語切り替えボタンの設定
   */
  function setupLanguageButtons() {
    const engLink = document.querySelector('.dropdown-item[data-lang="en"]');
    const jpnLink = document.querySelector('.dropdown-item[data-lang="ja"]');
    
    if (engLink) {
      engLink.addEventListener('click', function(e) {
        e.preventDefault();
        switchLanguage('en');
      });
    }
    
    if (jpnLink) {
      jpnLink.addEventListener('click', function(e) {
        e.preventDefault();
        switchLanguage('ja');
      });
    }
  }

  /**
   * 言語を切り替える
   * @param {string} lang - 言語コード（'en' または 'ja'）
   */
  // グローバルスコープで利用できるよう関数を定義
  switchLanguage = function(lang) {
    // 現在の言語を保存
    currentLang = lang;
    localStorage.setItem('localGuideLanguage', lang);
    
    // 言語を適用
    applyLanguage(lang, true);
  }

  /**
   * 指定された言語をページに適用
   * @param {string} lang - 言語コード（'en' または 'ja'）
   * @param {boolean} animate - アニメーション効果を付けるかどうか
   */
  function applyLanguage(lang, animate) {
    // 言語ボタンのテキストを更新
    updateLanguageButton(lang);
    
    // 日本語の場合はページをリロード（デフォルト言語に戻す）
    if (lang === 'ja' && animate) {
      location.reload();
      return;
    }
    
    // 英語の場合は翻訳を適用
    if (lang === 'en') {
      translatePage();
    }
  }
  
  /**
   * 言語ボタンのテキストを更新
   * @param {string} lang - 言語コード
   */
  function updateLanguageButton(lang) {
    const langBtn = document.getElementById('languageDropdown');
    if (langBtn) {
      langBtn.textContent = lang === 'en' ? 'English' : '日本語';
    }
  }
  
  /**
   * ページを英語に翻訳
   */
  function translatePage() {
    // current URL pathを取得
    const path = window.location.pathname;
    
    // ナビゲーションの翻訳（すべてのページ共通）
    translateNavigation();
    
    // ページ固有の翻訳
    if (path.includes('index.html') || path === '/' || path === '') {
      translateHomePage();
    }
    else if (path.includes('guide-profile.html')) {
      translateGuideProfile();
    }
    
    // ページタイトルの翻訳
    document.title = 'Local Guide - Experience Special Journeys';
  }
  
  /**
   * ナビゲーションを翻訳（すべてのページ共通）
   */
  function translateNavigation() {
    // ナビゲーションリンク
    document.querySelectorAll('.navbar-nav .nav-link').forEach((link, index) => {
      if (index === 0) link.textContent = translations.en.navbar['home'];
      else if (index === 1) link.textContent = translations.en.navbar['find-guides'];
      else if (index === 2) link.textContent = translations.en.navbar['how-to-use'];
    });
    
    // ボタン
    document.querySelectorAll('button.btn, a.btn').forEach(btn => {
      if (btn.textContent.includes('ログイン')) btn.textContent = translations.en.navbar['login'];
      else if (btn.textContent.trim() === '新規登録') btn.textContent = translations.en.navbar['register'];
      else if (btn.textContent.includes('ガイドを探す')) btn.textContent = translations.en.hero['find-guides'];
      else if (btn.textContent.includes('お問い合わせ')) btn.textContent = translations.en.hero['contact-us'];
    });
    
    // ドロップダウンアイテム
    document.querySelectorAll('.dropdown-item').forEach(item => {
      if (item.textContent.includes('旅行者として登録')) {
        const title = item.querySelector('.fw-bold');
        const desc = item.querySelector('.small');
        if (title) title.textContent = translations.en.navbar['as-tourist'];
        if (desc) desc.textContent = translations.en.navbar['tourist-desc'];
      }
      else if (item.textContent.includes('ガイドとして登録')) {
        const title = item.querySelector('.fw-bold');
        const desc = item.querySelector('.small');
        if (title) title.textContent = translations.en.navbar['as-guide'];
        if (desc) desc.textContent = translations.en.navbar['guide-desc'];
      }
    });
  }
  
  /**
   * ホームページの翻訳
   */
  function translateHomePage() {
    // ヒーローセクション
    const heroTitle = document.querySelector('.hero-section h1');
    const heroSubtitle = document.querySelector('.hero-section .lead');
    if (heroTitle) heroTitle.textContent = translations.en.hero['title'];
    if (heroSubtitle) heroSubtitle.textContent = translations.en.hero['subtitle'];
    
    // セクションタイトル（すべてのh2を対象に）
    document.querySelectorAll('h2').forEach(title => {
      if (title.textContent.includes('人気のガイド')) title.textContent = translations.en.guides['popular'];
      else if (title.textContent.includes('使い方')) title.textContent = 'How It Works';
      else if (title.textContent.includes('ガイドとして活躍')) title.textContent = 'Benefits of Being a Guide';
      else if (title.textContent.includes('ガイドになる')) title.textContent = 'Benefits of Being a Guide';
    });
    
    // カード・フィルタリング・フォーム要素
    document.querySelectorAll('.card-title, .card-header, h3, h4, h5, .fw-bold').forEach(title => {
      if (title.textContent.includes('ガイドを絞り込む')) title.textContent = 'Filter Guides';
      else if (title.textContent.includes('キーワード')) title.textContent = 'Keywords';
      else if (title.textContent.includes('アカウント登録')) title.textContent = 'Create Account';
      else if (title.textContent.includes('ガイドを探す')) title.textContent = 'Find Guides';
      else if (title.textContent.includes('予約して楽しむ')) title.textContent = 'Book and Enjoy';
      else if (title.textContent.includes('あなたの日常が観光資源')) title.textContent = 'Your Daily Life Becomes a Tourist Attraction';
      else if (title.textContent.includes('観光客の方を友達')) title.textContent = 'Welcome Tourists as Friends';
      else if (title.textContent.includes('隙間時間を使って')) title.textContent = 'Work Efficiently in Your Free Time';
      else if (title.textContent.includes('自分の好きなこと')) title.textContent = 'Do What You Love';
      else if (title.textContent.includes('世界中の人と')) title.textContent = 'Meet People from Around the World';
      else if (title.textContent.includes('語学力を活かし')) title.textContent = 'Improve Your Language Skills';
      else if (title.textContent.includes('地元への愛着')) title.textContent = 'Deepen Your Love for Your Hometown';
      else if (title.textContent.includes('安心のサポート体制')) title.textContent = 'Reliable Support System';
      else if (title.textContent.includes('自分のペースで')) title.textContent = 'Work at Your Own Pace';
      else if (title.textContent.includes('地域活性化')) title.textContent = 'Contribute to Local Economy';
    });
    
    // すべてのフォームラベル
    document.querySelectorAll('label, .form-label, th').forEach(label => {
      if (label.textContent.includes('地域')) label.textContent = 'Region';
      else if (label.textContent.includes('言語')) label.textContent = 'Language';
      else if (label.textContent.includes('料金')) label.textContent = 'Fee';
    });
    
    // フォームセレクトのオプション
    document.querySelectorAll('select option').forEach(option => {
      if (option.textContent === 'すべて') option.textContent = 'All';
    });
    
    // チェックボックスラベルとボタン
    document.querySelectorAll('.form-check-label').forEach(label => {
      if (label.textContent.includes('ナイトツアー')) label.textContent = 'Night Tours';
      else if (label.textContent.includes('グルメ')) label.textContent = 'Gourmet';
      else if (label.textContent.includes('写真スポット')) label.textContent = 'Photo Spots';
      else if (label.textContent.includes('料理')) label.textContent = 'Cooking';
      else if (label.textContent.includes('アクティビティ')) label.textContent = 'Activities';
    });
    
    // ボタンテキスト
    document.querySelectorAll('button, .btn').forEach(btn => {
      if (btn.textContent.trim() === 'リセット') btn.textContent = 'Reset';
      else if (btn.textContent.trim() === '検索') btn.textContent = 'Search';
      else if (btn.textContent.trim() === 'もっと見る') btn.textContent = 'See More';
      else if (btn.textContent.trim() === '詳細を見る') btn.textContent = 'See Details';
      else if (btn.textContent.trim() === 'ガイドとして登録する') btn.textContent = 'Register as Guide';
    });
    
    // 入力フィールドのプレースホルダー
    document.querySelectorAll('input[type="text"], input[type="search"], textarea').forEach(input => {
      if (input.placeholder && input.placeholder.includes('その他のキーワード')) {
        input.placeholder = 'Enter other keywords (separate with commas)';
      }
    });
    
    // ガイドカードの説明文
    document.querySelectorAll('.guide-card p, .card p').forEach(p => {
      // ガイドの説明文は翻訳辞書ではなく、コンテンツに基づいて条件分岐する
      if (p.textContent.includes('東京在住の食文化')) {
        p.textContent = 'A detailed guide to Tokyo\'s food culture, taking you to hidden gems known only to locals.';
      } else if (p.textContent.includes('京都在住10年')) {
        p.textContent = 'Resident of Kyoto for 10 years, conveying various attractions from historical temples and shrines to modern Kyoto.';
      } else if (p.textContent.includes('大阪のストリートフード')) {
        p.textContent = 'Local guide specializing in Osaka\'s street food and nightlife, experience the hospitality and personality of Osaka!';
      }
    });
    
    // 認証済みバッジ
    document.querySelectorAll('.badge').forEach(badge => {
      if (badge.textContent.includes('認証済み')) {
        badge.textContent = 'Verified';
      }
    });
    
    // 言語表示
    document.querySelectorAll('.guide-card .small, .card .small').forEach(small => {
      if (small.textContent.includes('言語: ')) {
        small.textContent = small.textContent.replace('言語: ', 'Languages: ')
          .replace('日本語', 'Japanese')
          .replace('英語', 'English')
          .replace('中国語', 'Chinese');
      }
    });
    
    // 料金表示
    document.querySelectorAll('.guide-price, .price').forEach(price => {
      if (price.textContent.includes('/回')) {
        price.textContent = price.textContent.replace('/回', '/session');
      }
    });
    
    // 使い方セクション
    const howItWorksSection = document.querySelector('#how-it-works');
    if (howItWorksSection) {
      // タブ
      const touristTab = howItWorksSection.querySelector('#touristTab');
      const guideTab = howItWorksSection.querySelector('#guideTab');
      if (touristTab) touristTab.textContent = 'For Tourists';
      if (guideTab) guideTab.textContent = 'For Guides';
      
      // 使い方ステップの説明文
      document.querySelectorAll('.step-description').forEach(desc => {
        if (desc.textContent.includes('簡単な情報入力と電話番号認証')) {
          desc.textContent = 'Simple information input and phone number verification';
        } else if (desc.textContent.includes('場所、言語、専門性などで理想のガイド')) {
          desc.textContent = 'Search for ideal guides by location, language, and specialties';
        } else if (desc.textContent.includes('希望の日時で予約し、特別な体験')) {
          desc.textContent = 'Book on your preferred date and enjoy a special experience';
        }
      });
    }
    
    // ガイド特典セクション
    const benefitTitles = document.querySelectorAll('.guide-benefit-card h5');
    const benefitDescs = document.querySelectorAll('.guide-benefit-card p.text-muted');
    
    benefitTitles.forEach((title, index) => {
      if (index < translations.en.benefits.items.length) {
        title.textContent = translations.en.benefits.items[index].title;
      }
    });
    
    benefitDescs.forEach((desc, index) => {
      if (index < translations.en.benefits.items.length) {
        desc.textContent = translations.en.benefits.items[index].desc;
      }
    });
    
    // メリットカードの翻訳（全ての段落とカード）
    document.querySelectorAll('.card p, .card-body p').forEach(p => {
      if (p.textContent.includes('様々な国や文化から来た旅行者との交流')) {
        p.textContent = 'Interact with travelers from different countries and cultures, expanding your international network and deepening cross-cultural understanding.';
      } else if (p.textContent.includes('地元の魅力を発信することで')) {
        p.textContent = 'By promoting the attractions of your local area, you will develop a deeper appreciation and attachment to your hometown.';
      } else if (p.textContent.includes('外国語を使う実践的な機会')) {
        p.textContent = 'Gain practical opportunities to use foreign languages, naturally improving your communication skills.';
      } else if (p.textContent.includes('予約を受ける日時や頻度は完全に自分')) {
        p.textContent = 'When and how often you accept bookings is completely up to you, allowing for a lifestyle that suits your needs.';
      } else if (p.textContent.includes('予約管理、決済、保険など')) {
        p.textContent = 'We provide the essential support for guide activities such as reservation management, payment, and insurance, so you can work with peace of mind.';
      } else if (p.textContent.includes('観光客を地元のお店や施設')) {
        p.textContent = 'By introducing tourists to local shops and facilities, you contribute to the revitalization of the local economy and community development.';
      } else if (p.textContent.includes('地元の方だけが知る特別な場所')) {
        p.textContent = 'By sharing special places that only locals know about, your everyday surroundings become valuable tourism resources.';
      } else if (p.textContent.includes('形式ばったガイドツアー')) {
        p.textContent = 'Rather than a formal guided tour, you can naturally convey the charm of your local area as if spending time with friends.';
      } else if (p.textContent.includes('自分の都合の良い時間')) {
        p.textContent = 'You can set your schedule according to your convenience, allowing you to earn income while balancing with your main job or studies.';
      } else if (p.textContent.includes('趣味や特技、専門知識')) {
        p.textContent = 'By providing unique guided experiences that utilize your hobbies, skills, and specialized knowledge, you can turn your passion into income.';
      }
    });
    
    // フッター
    document.querySelectorAll('footer .nav-link').forEach(link => {
      if (link.textContent.includes('会社概要')) link.textContent = translations.en.footer['about-us'];
      else if (link.textContent.includes('利用規約')) link.textContent = translations.en.footer['terms'];
      else if (link.textContent.includes('プライバシー')) link.textContent = translations.en.footer['privacy'];
      else if (link.textContent.includes('よくある質問')) link.textContent = translations.en.footer['faq'];
    });
    
    // コピーライト
    const copyright = document.querySelector('footer .text-center.text-muted');
    if (copyright) copyright.textContent = translations.en.footer['copyright'];
  }
  
  /**
   * ガイドプロフィールページの翻訳
   */
  function translateGuideProfile() {
    const profileData = translations.en['guide-profile'];
    
    // ページタイトルを更新
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
      pageTitle.textContent = 'Guide Profile Management';
    }

    // まず、data-key属性を持つすべての要素を翻訳
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (profileData[key]) {
        el.textContent = profileData[key];
      }
    });
    
    // タブメニューを確実に翻訳（data-keyがなくても翻訳）
    document.querySelectorAll('.nav-link').forEach(tab => {
      // サイドバーのタブ
      if (tab.textContent.includes('基本情報')) tab.textContent = profileData['basic-info'];
      else if (tab.textContent.includes('写真ギャラリー')) tab.textContent = profileData['photo-gallery'];
      else if (tab.textContent.includes('スケジュール')) tab.textContent = profileData['schedule']; 
      else if (tab.textContent.includes('メッセージ')) tab.textContent = profileData['messages'];
      else if (tab.textContent.includes('アカウント設定')) tab.textContent = profileData['account-settings'];
      
      // スケジュールタブ（曜日）
      if (tab.textContent.includes('月曜日') || tab.textContent === '月') tab.textContent = tab.classList.contains('mobile-only') ? 'Mon' : 'Monday';
      else if (tab.textContent.includes('火曜日') || tab.textContent === '火') tab.textContent = tab.classList.contains('mobile-only') ? 'Tue' : 'Tuesday';
      else if (tab.textContent.includes('水曜日') || tab.textContent === '水') tab.textContent = tab.classList.contains('mobile-only') ? 'Wed' : 'Wednesday';
      else if (tab.textContent.includes('木曜日') || tab.textContent === '木') tab.textContent = tab.classList.contains('mobile-only') ? 'Thu' : 'Thursday';
      else if (tab.textContent.includes('金曜日') || tab.textContent === '金') tab.textContent = tab.classList.contains('mobile-only') ? 'Fri' : 'Friday';
      else if (tab.textContent.includes('土曜日') || tab.textContent === '土') tab.textContent = tab.classList.contains('mobile-only') ? 'Sat' : 'Saturday';
      else if (tab.textContent.includes('日曜日') || tab.textContent === '日') tab.textContent = tab.classList.contains('mobile-only') ? 'Sun' : 'Sunday';
    });
    
    // ラベルを翻訳
    document.querySelectorAll('label.form-label, .form-check-label').forEach(label => {
      if (label.textContent.includes('氏名')) label.textContent = profileData['fullname'];
      else if (label.textContent.includes('ユーザー名')) label.textContent = profileData['username'];
      else if (label.textContent.includes('メールアドレス')) label.textContent = profileData['email-address'];
      else if (label.textContent.includes('活動エリア')) label.textContent = profileData['activity-area'];
      else if (label.textContent.includes('対応言語')) label.textContent = profileData['supported-languages'];
      else if (label.textContent.includes('自己紹介')) label.textContent = profileData['self-introduction'];
      else if (label.textContent.includes('セッション料金')) label.textContent = profileData['session-fee'];
      else if (label.textContent.includes('得意分野・興味')) label.textContent = profileData['specialties'];
      else if (label.textContent.includes('この曜日は活動可能')) label.textContent = profileData['day-available'];
      else if (label.textContent.includes('開始時間')) label.textContent = profileData['start-time'];
      else if (label.textContent.includes('終了時間')) label.textContent = profileData['end-time'];
      
      // チェックボックスのラベル
      if (label.textContent.includes('ナイトツアー')) label.textContent = profileData['keyword-night'];
      else if (label.textContent.includes('グルメ')) label.textContent = profileData['keyword-food'];
      else if (label.textContent.includes('写真スポット')) label.textContent = profileData['keyword-photo'];
      else if (label.textContent.includes('料理')) label.textContent = profileData['keyword-cooking'];
      else if (label.textContent.includes('アクティビティ')) label.textContent = profileData['keyword-activity'];
    });
    
    // セクションタイトルと見出し
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      if (heading.textContent.includes('基本情報')) heading.textContent = profileData['basic-info'];
      else if (heading.textContent.includes('予約状況サマリー')) heading.textContent = profileData['booking-summary'];
      else if (heading.textContent.includes('時間帯設定')) heading.textContent = profileData['time-settings'];
      else if (heading.textContent.includes('次回の予約')) heading.textContent = profileData['next-reservation'];
    });
    
    // 小さなテキスト要素
    document.querySelectorAll('.small, .form-text, small, p').forEach(text => {
      if (text.textContent.includes('プロフィールURLに使用されます')) text.textContent = profileData['profile-url-note'];
      else if (text.textContent.includes('標準料金は¥6,000/回です')) text.textContent = profileData['fee-description'];
      else if (text.textContent.includes('今月の予約数')) text.textContent = profileData['reservations-this-month'];
      else if (text.textContent.includes('来月の予約数')) text.textContent = profileData['reservations-next-month'];
      else if (text.textContent.includes('キャンセル数')) text.textContent = profileData['cancellations'];
      else if (text.textContent.includes('総予約日数')) text.textContent = profileData['total-booking-days'];
      else if (text.textContent === '4月') text.textContent = profileData['april'];
    });
    
    // 入力フィールドのプレースホルダー
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
      if (input.placeholder.includes('例：東京都新宿区')) input.placeholder = profileData['activity-area-placeholder'];
      else if (input.placeholder.includes('あなた自身やガイドとしての特徴')) input.placeholder = profileData['self-introduction-placeholder'];
    });
    
    // ボタン
    document.querySelectorAll('button.btn, a.btn').forEach(btn => {
      if (btn.textContent.includes('前月')) btn.textContent = profileData['prev-month'];
      else if (btn.textContent.includes('翌月')) btn.textContent = profileData['next-month'];
      else if (btn.textContent.includes('今月')) btn.textContent = profileData['current-month'];
      else if (btn.textContent.includes('前年')) btn.textContent = profileData['prev-year'];
      else if (btn.textContent.includes('翌年')) btn.textContent = profileData['next-year'];
      else if (btn.textContent.includes('保存する')) btn.textContent = 'Save';
    });
    
    // 選択オプションの翻訳
    document.querySelectorAll('select[id="guide-languages"] option').forEach(option => {
      if (option.textContent === '日本語') option.textContent = 'Japanese';
      else if (option.textContent === '英語') option.textContent = 'English';
      else if (option.textContent === '中国語') option.textContent = 'Chinese';
      else if (option.textContent === '韓国語') option.textContent = 'Korean';
      else if (option.textContent === 'フランス語') option.textContent = 'French';
      else if (option.textContent === 'ドイツ語') option.textContent = 'German';
      else if (option.textContent === 'スペイン語') option.textContent = 'Spanish';
      else if (option.textContent === 'イタリア語') option.textContent = 'Italian';
      else if (option.textContent === 'ロシア語') option.textContent = 'Russian';
      else if (option.textContent === 'その他') option.textContent = 'Other';
    });
  }
})();