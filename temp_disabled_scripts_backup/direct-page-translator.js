/**
 * サイト全体の翻訳機能 - ガイドプロフィールページ向け特別強化版
 * すべてのページ要素を直接選択して翻訳する
 */
(function() {
  console.log('直接ページ翻訳機能を初期化中... v1.0');
  
  // 現在の言語設定を取得（デフォルトは日本語）
  let currentLang = localStorage.getItem('localGuideLanguage') || 'ja';
  
  // DOMが読み込まれた後に実行
  document.addEventListener('DOMContentLoaded', function() {
    // 言語切り替えボタン
    setupLanguageButtons();
    
    // 保存されている言語設定があれば適用
    if (currentLang === 'en') {
      applyEnglish();
    } else {
      applyJapanese();
    }
  });
  
  /**
   * 言語切り替えボタンの設定
   */
  function setupLanguageButtons() {
    const engLink = document.querySelector('.dropdown-item[data-lang="en"]');
    const jpnLink = document.querySelector('.dropdown-item[data-lang="ja"]');
    
    // 英語ボタン
    if (engLink) {
      engLink.addEventListener('click', function(e) {
        e.preventDefault();
        setLanguage('en');
      });
    }
    
    // 日本語ボタン
    if (jpnLink) {
      jpnLink.addEventListener('click', function(e) {
        e.preventDefault();
        setLanguage('ja');
      });
    }
  }
  
  /**
   * 言語を設定して適用
   */
  function setLanguage(lang) {
    console.log(`言語を${lang}に設定します`);
    currentLang = lang;
    localStorage.setItem('localGuideLanguage', lang);
    
    if (lang === 'en') {
      applyEnglish();
    } else {
      applyJapanese();
    }
    
    // 言語切り替えボタンのテキストを更新
    const langBtn = document.getElementById('languageDropdown');
    if (langBtn) {
      langBtn.textContent = lang === 'en' ? 'English' : '日本語';
    }
  }
  
  /**
   * 英語に切り替え
   */
  function applyEnglish() {
    console.log('英語表示に切り替えます');
    translateSpecificPage();
  }
  
  /**
   * 日本語に切り替え
   */
  function applyJapanese() {
    console.log('日本語表示にリセットします');
    location.reload();
  }
  
  /**
   * 現在のページに応じた翻訳を適用
   */
  function translateSpecificPage() {
    // URLのパスを取得
    const path = window.location.pathname;
    
    // 共通要素の翻訳
    translateCommonElements();
    
    // ページ固有の翻訳
    if (path.includes('guide-profile.html')) {
      translateGuideProfile();
    } else if (path.includes('index.html') || path === '/' || path === '') {
      // ホームページの翻訳はminimal-language.jsに任せる
    }
  }
  
  /**
   * 共通要素の翻訳
   */
  function translateCommonElements() {
    // ナビゲーションメニュー
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach((link, index) => {
      if (index === 0) link.textContent = 'Home';
      else if (index === 1) link.textContent = 'Find Guides';
      else if (index === 2) link.textContent = 'How to Use';
    });
    
    // フッター
    const footerLinks = document.querySelectorAll('footer .nav-link');
    footerLinks.forEach(link => {
      if (link.textContent.includes('会社概要')) link.textContent = 'About Us';
      else if (link.textContent.includes('利用規約')) link.textContent = 'Terms of Service';
      else if (link.textContent.includes('プライバシー')) link.textContent = 'Privacy Policy';
      else if (link.textContent.includes('よくある質問')) link.textContent = 'FAQ';
    });
    
    // コピーライト
    const copyright = document.querySelector('footer .text-center.text-muted');
    if (copyright) copyright.textContent = '© 2025 Local Guide. All Rights Reserved.';
  }
  
  /**
   * ガイドプロフィールページの翻訳
   */
  function translateGuideProfile() {
    console.log('ガイドプロフィールページを翻訳します');
    
    // ページタイトル
    document.title = 'Guide Profile Management | Local Guide';
    
    // ヘッダータイトル
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = 'Guide Profile Management';
    
    // サイドバーメニュー
    const sidebarItems = {
      '基本情報': 'Basic Information',
      '写真ギャラリー': 'Photo Gallery',
      'スケジュール': 'Schedule',
      'メッセージ': 'Messages',
      'アカウント設定': 'Account Settings'
    };
    
    document.querySelectorAll('.nav-link').forEach(link => {
      Object.keys(sidebarItems).forEach(ja => {
        if (link.textContent.includes(ja)) {
          link.textContent = sidebarItems[ja];
        }
      });
    });
    
    // フォームラベル
    const formLabels = {
      '氏名': 'Full Name',
      'ユーザー名': 'Username',
      'プロフィールURLに使用されます': 'This will be used in your profile URL',
      'メールアドレス': 'Email Address',
      '活動エリア': 'Activity Area',
      '例：東京都新宿区': 'e.g., Shinjuku, Tokyo',
      '対応言語': 'Supported Languages',
      '自己紹介': 'Self Introduction',
      'セッション料金': 'Session Fee (per session)',
      '標準料金は¥6,000/回です。料金を高く設定すると予約が少なくなる可能性があります。': 'The standard fee is ¥6,000/session. Setting a higher fee may result in fewer bookings.',
      '得意分野・興味': 'Specialties & Interests',
      'ナイトツアー': 'Night Tours',
      'グルメ': 'Gourmet',
      '写真スポット': 'Photo Spots',
      '料理': 'Cooking',
      'アクティビティ': 'Activities',
      'その他のキーワード': 'Other Keywords',
      '保存する': 'Save Changes',
      '変更を保存': 'Save Changes',
      '変更を保存しました': 'Changes saved successfully',
      '更新に失敗しました': 'Update failed',
      '写真を追加': 'Add Photo',
      '写真ギャラリーの説明': 'Upload photos of your activities and places you can guide.',
      '最大15枚まで設定できます': 'You can set up to 15 photos.',
      'この曜日は活動可能': 'Available on this day',
      '開始時間': 'Start Time',
      '終了時間': 'End Time',
      'スケジュールを保存': 'Save Schedule',
      '予約カレンダー': 'Reservation Calendar',
      '緑色の日付は予約可能、赤色の日付は予約済みです': 'Green dates are available for booking, red dates are fully booked.',
      '時間帯設定': 'Time Settings',
      '予約状況サマリー': 'Booking Summary',
      '今月の予約数': 'Reservations this month',
      '来月の予約数': 'Reservations next month',
      'キャンセル数': 'Cancellations',
      '総予約日数': 'Total booking days',
      '次回の予約': 'Next reservation'
    };
    
    // すべてのテキストノードとラベルを検索
    translateTextNodes(document.body, formLabels);
    
    // すべてのラベル要素
    document.querySelectorAll('label').forEach(label => {
      Object.keys(formLabels).forEach(ja => {
        if (label.textContent.includes(ja)) {
          label.textContent = formLabels[ja];
        }
      });
    });
    
    // すべてのボタン
    document.querySelectorAll('button, .btn').forEach(btn => {
      if (btn.textContent.includes('保存')) btn.textContent = 'Save';
      else if (btn.textContent.includes('キャンセル')) btn.textContent = 'Cancel';
      else if (btn.textContent.includes('追加')) btn.textContent = 'Add';
      else if (btn.textContent.includes('削除')) btn.textContent = 'Delete';
      else if (btn.textContent.includes('前月')) btn.textContent = 'Previous Month';
      else if (btn.textContent.includes('今月')) btn.textContent = 'Current Month';
      else if (btn.textContent.includes('翌月')) btn.textContent = 'Next Month';
      else if (btn.textContent.includes('前年')) btn.textContent = 'Previous Year';
      else if (btn.textContent.includes('翌年')) btn.textContent = 'Next Year';
    });
    
    // プレースホルダーの翻訳
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
      if (input.placeholder.includes('例：東京都新宿区')) {
        input.placeholder = 'e.g., Shinjuku, Tokyo';
      } else if (input.placeholder.includes('キーワードをカンマ区切りで入力')) {
        input.placeholder = 'Enter keywords (separate with commas)';
      }
    });
    
    // 言語選択肢の翻訳
    const langOptions = {
      '日本語': 'Japanese',
      '英語': 'English',
      '中国語': 'Chinese',
      '韓国語': 'Korean',
      'フランス語': 'French',
      'ドイツ語': 'German',
      'スペイン語': 'Spanish',
      'イタリア語': 'Italian',
      'ロシア語': 'Russian',
      'その他': 'Other'
    };
    
    document.querySelectorAll('select option').forEach(option => {
      Object.keys(langOptions).forEach(ja => {
        if (option.textContent === ja) {
          option.textContent = langOptions[ja];
        }
      });
    });
    
    // 見出しの翻訳
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      Object.keys(formLabels).forEach(ja => {
        if (heading.textContent.includes(ja)) {
          heading.textContent = formLabels[ja];
        }
      });
    });
  }
  
  /**
   * テキストノードを再帰的に翻訳
   */
  function translateTextNodes(element, translations) {
    if (element.nodeType === Node.TEXT_NODE) {
      // テキストノードの場合、翻訳対象か確認
      let text = element.textContent.trim();
      if (text) {
        for (let ja in translations) {
          if (text.includes(ja)) {
            element.textContent = element.textContent.replace(ja, translations[ja]);
            break;
          }
        }
      }
    } else {
      // 要素の場合、子要素を再帰的に処理
      for (let i = 0; i < element.childNodes.length; i++) {
        translateTextNodes(element.childNodes[i], translations);
      }
    }
  }
})();