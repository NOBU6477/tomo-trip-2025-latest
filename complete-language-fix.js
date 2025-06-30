/**
 * 完全独立言語切り替えシステム
 * 他のスクリプトの影響を受けない独立したシステム
 */
(function() {
  'use strict';
  
  console.log('🔄 完全独立言語システム開始');
  
  // 他のスクリプトとの競合を避けるため5秒遅延で実行
  setTimeout(initializeLanguageSystem, 5000);
  
  function initializeLanguageSystem() {
    console.log('言語システムを初期化中...');
    
    // 既存のイベントリスナーを完全に無効化
    removeAllExistingListeners();
    
    // 新しいイベントリスナーを設定
    setupNewLanguageListeners();
    
    // ページ読み込み時の言語状態を確認
    checkInitialLanguageState();
  }
  
  function removeAllExistingListeners() {
    console.log('既存のイベントリスナーを削除中...');
    
    const langJa = document.getElementById('lang-ja');
    const langEn = document.getElementById('lang-en');
    const langDropdown = document.getElementById('languageDropdown');
    
    // 要素を複製して既存のイベントを削除
    if (langJa) {
      const newLangJa = langJa.cloneNode(true);
      langJa.parentNode.replaceChild(newLangJa, langJa);
    }
    
    if (langEn) {
      const newLangEn = langEn.cloneNode(true);
      langEn.parentNode.replaceChild(newLangEn, langEn);
    }
    
    if (langDropdown) {
      const newLangDropdown = langDropdown.cloneNode(true);
      langDropdown.parentNode.replaceChild(newLangDropdown, langDropdown);
    }
    
    console.log('✓ 既存のイベントリスナー削除完了');
  }
  
  function setupNewLanguageListeners() {
    console.log('新しいイベントリスナーを設定中...');
    
    const langJa = document.getElementById('lang-ja');
    const langEn = document.getElementById('lang-en');
    const langDropdown = document.getElementById('languageDropdown');
    
    console.log('要素確認:', {
      langJa: langJa ? '見つかった' : '見つからない',
      langEn: langEn ? '見つかった' : '見つからない',
      langDropdown: langDropdown ? '見つかった' : '見つからない'
    });
    
    // 日本語ボタン
    if (langJa) {
      langJa.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🇯🇵 日本語ボタンクリック');
        switchToJapanese();
      }, true);
      
      // onclick属性も設定（二重保険）
      langJa.onclick = function(e) {
        e.preventDefault();
        switchToJapanese();
        return false;
      };
    }
    
    // 英語ボタン
    if (langEn) {
      langEn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🇺🇸 英語ボタンクリック');
        switchToEnglish();
      }, true);
      
      // onclick属性も設定（二重保険）
      langEn.onclick = function(e) {
        e.preventDefault();
        switchToEnglish();
        return false;
      };
    }
    
    // ドロップダウンボタン
    if (langDropdown) {
      langDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('ドロップダウンボタンクリック');
        toggleDropdownMenu();
      }, true);
    }
    
    // 外部クリックでメニューを閉じる
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        closeAllDropdowns();
      }
    });
    
    console.log('✓ 新しいイベントリスナー設定完了');
  }
  
  function switchToJapanese() {
    console.log('日本語に切り替え中...');
    
    // 言語設定を保存
    localStorage.setItem('selectedLanguage', 'ja');
    localStorage.setItem('localGuideLanguage', 'ja');
    
    // ドロップダウンボタンのテキストを更新
    const langDropdown = document.getElementById('languageDropdown');
    if (langDropdown) {
      langDropdown.textContent = '日本語';
    }
    
    // メニューを閉じる
    closeAllDropdowns();
    
    // ページリロードで確実に日本語に戻す
    console.log('日本語設定完了 - ページをリロード');
    location.reload();
  }
  
  function switchToEnglish() {
    console.log('英語に切り替え中...');
    
    // 言語設定を保存
    localStorage.setItem('selectedLanguage', 'en');
    localStorage.setItem('localGuideLanguage', 'en');
    
    // ドロップダウンボタンのテキストを更新
    const langDropdown = document.getElementById('languageDropdown');
    if (langDropdown) {
      langDropdown.textContent = 'English';
    }
    
    // メニューを閉じる
    closeAllDropdowns();
    
    // 包括的な英語翻訳を実行
    performCompleteEnglishTranslation();
  }
  
  function toggleDropdownMenu() {
    const dropdown = document.querySelector('.dropdown .dropdown-menu');
    if (dropdown) {
      const isVisible = dropdown.style.display === 'block';
      if (isVisible) {
        dropdown.style.display = 'none';
      } else {
        closeAllDropdowns(); // 他のメニューを閉じる
        dropdown.style.display = 'block';
      }
    }
  }
  
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.style.display = 'none';
    });
    document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
  }
  
  function checkInitialLanguageState() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    console.log('初期言語状態:', savedLanguage);
    
    if (savedLanguage === 'en') {
      console.log('英語設定が保存されているため英語翻訳を実行');
      const langDropdown = document.getElementById('languageDropdown');
      if (langDropdown) {
        langDropdown.textContent = 'English';
      }
      // 短い遅延の後に翻訳実行
      setTimeout(performCompleteEnglishTranslation, 500);
    }
  }
  
  function performCompleteEnglishTranslation() {
    console.log('包括的英語翻訳を実行中...');
    
    // ナビゲーションメニュー
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (navLinks.length >= 3) {
      navLinks[0].textContent = 'Home';
      navLinks[1].textContent = 'Find Guides';
      navLinks[2].textContent = 'How to Use';
    }
    
    // メインタイトル・セクション
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      const text = heading.textContent.trim();
      switch(text) {
        case '人気のガイド':
          heading.textContent = 'Popular Guides';
          break;
        case 'ガイドを絞り込む':
          heading.textContent = 'Filter Guides';
          break;
        case '使い方':
          heading.textContent = 'How to Use';
          break;
        case 'ガイドとして活躍するメリット':
          heading.textContent = 'Benefits of Being a Guide';
          break;
        case 'あなただけの特別な旅を':
          heading.textContent = 'Your Special Journey Awaits';
          break;
        case 'アカウント登録':
          heading.textContent = 'Account Registration';
          break;
        case 'ガイドを探す':
          heading.textContent = 'Find Guides';
          break;
        case '予約して楽しむ':
          heading.textContent = 'Book and Enjoy';
          break;
      }
    });
    
    // ボタン翻訳
    document.querySelectorAll('button, .btn, a.btn').forEach(btn => {
      const text = btn.textContent.trim();
      switch(text) {
        case '詳細を見る':
          btn.textContent = 'See Details';
          break;
        case 'ログイン':
          btn.textContent = 'Login';
          break;
        case '新規登録':
          btn.textContent = 'Register';
          break;
        case 'お問い合わせ':
          btn.textContent = 'Contact Us';
          break;
        case '検索':
          btn.textContent = 'Search';
          break;
        case 'リセット':
          btn.textContent = 'Reset';
          break;
        case 'ガイドとして登録する':
          btn.textContent = 'Register as Guide';
          break;
        case 'もっと見る':
          btn.textContent = 'View More';
          break;
        case 'ガイドを絞り込む':
          btn.textContent = 'Filter Guides';
          break;
      }
    });
    
    // フォームラベル・プレースホルダー
    document.querySelectorAll('label, .form-label').forEach(label => {
      const text = label.textContent.trim();
      switch(text) {
        case '地域':
          label.textContent = 'Region';
          break;
        case '言語':
          label.textContent = 'Language';
          break;
        case '料金':
          label.textContent = 'Fee';
          break;
        case 'キーワード':
          label.textContent = 'Keywords';
          break;
      }
    });
    
    // ドロップダウンメニュー項目
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
      if (item.id === 'lang-ja' || item.id === 'lang-en') return; // 言語ボタンはスキップ
      
      const titleEl = item.querySelector('.fw-bold');
      const descEl = item.querySelector('.text-muted, .small');
      
      if (titleEl && titleEl.textContent.includes('旅行者として登録')) {
        titleEl.textContent = 'Register as Tourist';
        if (descEl) descEl.textContent = 'Experience special journeys with local guides';
      } else if (titleEl && titleEl.textContent.includes('ガイドとして登録')) {
        titleEl.textContent = 'Register as Guide';
        if (descEl) descEl.textContent = 'Share your knowledge and experience';
      }
    });
    
    // ヒーローセクションの説明文
    const heroLead = document.querySelector('.hero-section .lead');
    if (heroLead && heroLead.textContent.includes('地元ガイドと一緒に')) {
      heroLead.textContent = 'Experience hidden gems with local guides that you cannot find in regular tours';
    }
    
    // 利用方法セクションの説明文
    document.querySelectorAll('p, .text-muted').forEach(p => {
      const text = p.textContent.trim();
      if (text.includes('簡単な情報入力と電話番号等認証で登録完了')) {
        p.textContent = 'Complete registration with simple information entry and phone verification';
      } else if (text.includes('場所、言語、専門性などで理想のガイドを検索')) {
        p.textContent = 'Search for ideal guides by location, language, and expertise';
      } else if (text.includes('希望の日時で予約し、特別な体験を楽しむ')) {
        p.textContent = 'Book for your preferred date and time, and enjoy special experiences';
      }
    });
    
    // ベネフィットカードの翻訳
    translateBenefitCards();
    
    console.log('✓ 包括的英語翻訳完了');
  }
  
  function translateBenefitCards() {
    console.log('ベネフィットカード翻訳中...');
    
    // ベネフィットカードのタイトル翻訳
    const benefitTitles = {
      'あなたの日常が観光資源になる': 'Your daily life becomes a tourism resource',
      '観光客の方と友達としてお迎えするだけです': 'Simply welcome tourists as friends',
      '隙間時間を使って効率よくお仕事をする': 'Work efficiently using spare time',
      '自分の好きなことを仕事にできる': 'Turn your passions into work',
      '世界中の人と新しい出会いが生まれる': 'Meet new people from around the world',
      '語学力を活かし、さらに向上させられる': 'Utilize and improve language skills',
      '地元への愛着と誇りが深まる': 'Deepen love and pride for your hometown',
      '安心のサポート体制': 'Reliable support system',
      '自分のペースで活動可能': 'Work at your own pace',
      '地域活性化に貢献できる': 'Contribute to regional revitalization'
    };
    
    Object.keys(benefitTitles).forEach(japanese => {
      const elements = document.querySelectorAll('h3, h4, h5, .fw-bold');
      elements.forEach(el => {
        if (el.textContent.trim() === japanese) {
          el.textContent = benefitTitles[japanese];
        }
      });
    });
    
    console.log('✓ ベネフィットカード翻訳完了');
  }
  
  // グローバル関数として公開（デバッグ用）
  window.forceLanguageSwitch = function(lang) {
    if (lang === 'en') {
      switchToEnglish();
    } else {
      switchToJapanese();
    }
  };
  
  console.log('🔄 完全独立言語システム準備完了');
  
})();