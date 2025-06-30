/**
 * 言語切り替えボタン根本修正スクリプト
 * 最も直接的なアプローチで確実に動作させる
 */
(function() {
  'use strict';
  
  console.log('🔧 言語ボタン根本修正開始');
  
  // 実行順序を制御するため、遅延実行
  setTimeout(function() {
    console.log('🔍 詳細調査を開始します...');
    
    // 1. 全てのドロップダウン要素を調査
    const allDropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    console.log(`見つかったドロップダウン要素: ${allDropdowns.length}個`);
    
    allDropdowns.forEach((dropdown, index) => {
      console.log(`ドロップダウン${index + 1}:`, {
        id: dropdown.id,
        tagName: dropdown.tagName,
        textContent: dropdown.textContent.trim(),
        classes: dropdown.className
      });
    });
    
    // 2. 言語関連要素を直接取得
    const languageDropdown = document.getElementById('languageDropdown');
    const langJa = document.getElementById('lang-ja');
    const langEn = document.getElementById('lang-en');
    const registerDropdown = document.getElementById('registerDropdown');
    
    console.log('要素確認結果:');
    console.log('- languageDropdown:', languageDropdown ? '✓' : '✗');
    console.log('- lang-ja:', langJa ? '✓' : '✗');
    console.log('- lang-en:', langEn ? '✓' : '✗');
    console.log('- registerDropdown:', registerDropdown ? '✓' : '✗');
    
    // 3. Bootstrap確認
    if (typeof window.bootstrap !== 'undefined') {
      console.log('✓ Bootstrap JavaScript利用可能');
      
      // Bootstrap ドロップダウンを強制初期化
      if (languageDropdown) {
        try {
          const bsDropdown = new bootstrap.Dropdown(languageDropdown);
          console.log('✓ 言語ドロップダウンをBootstrapで初期化');
        } catch (e) {
          console.log('⚠️ Bootstrap初期化エラー:', e);
        }
      }
      
      if (registerDropdown) {
        try {
          const bsRegDropdown = new bootstrap.Dropdown(registerDropdown);
          console.log('✓ 登録ドロップダウンをBootstrapで初期化');
        } catch (e) {
          console.log('⚠️ Bootstrap初期化エラー:', e);
        }
      }
    } else {
      console.log('✗ Bootstrap JavaScript未利用');
    }
    
    // 4. 強制的にイベントハンドラを設定
    if (langJa) {
      // 既存のイベントを全て削除
      langJa.removeAttribute('onclick');
      const newJa = langJa.cloneNode(true);
      langJa.parentNode.replaceChild(newJa, langJa);
      
      // 直接的なイベント設定
      newJa.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log('🇯🇵 日本語ボタンクリック - 処理開始');
        
        // 言語設定を保存
        localStorage.setItem('selectedLanguage', 'ja');
        localStorage.setItem('localGuideLanguage', 'ja');
        
        // ドロップダウンテキスト更新
        if (languageDropdown) {
          languageDropdown.textContent = '日本語';
        }
        
        // ページリロード
        console.log('日本語に切り替えてリロードします');
        window.location.reload();
      }, true);
      
      console.log('✓ 日本語ボタン修正完了');
    }
    
    if (langEn) {
      // 既存のイベントを全て削除
      langEn.removeAttribute('onclick');
      const newEn = langEn.cloneNode(true);
      langEn.parentNode.replaceChild(newEn, langEn);
      
      // 直接的なイベント設定
      newEn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log('🇺🇸 英語ボタンクリック - 処理開始');
        
        // 言語設定を保存
        localStorage.setItem('selectedLanguage', 'en');
        localStorage.setItem('localGuideLanguage', 'en');
        
        // ドロップダウンテキスト更新
        if (languageDropdown) {
          languageDropdown.textContent = 'English';
        }
        
        // 英語翻訳実行
        console.log('英語に翻訳します');
        performEnglishTranslation();
      }, true);
      
      console.log('✓ 英語ボタン修正完了');
    }
    
    // 5. 新規登録ドロップダウンの手動制御
    if (registerDropdown) {
      console.log('新規登録ドロップダウンを設定中...');
      
      registerDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('新規登録ドロップダウンクリック');
        
        const menu = registerDropdown.nextElementSibling;
        if (menu && menu.classList.contains('dropdown-menu')) {
          
          // 他のドロップダウンメニューを閉じる
          document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
            if (otherMenu !== menu) {
              otherMenu.classList.remove('show');
              otherMenu.style.display = 'none';
            }
          });
          
          // 現在のメニューをトグル
          if (menu.classList.contains('show')) {
            menu.classList.remove('show');
            menu.style.display = 'none';
            registerDropdown.setAttribute('aria-expanded', 'false');
            console.log('ドロップダウンを閉じました');
          } else {
            menu.classList.add('show');
            menu.style.display = 'block';
            registerDropdown.setAttribute('aria-expanded', 'true');
            console.log('ドロップダウンを開きました');
          }
        }
      });
      
      console.log('✓ 新規登録ドロップダウン修正完了');
    }
    
    // 6. 外部クリックでドロップダウンを閉じる
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          menu.classList.remove('show');
          menu.style.display = 'none';
        });
        document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
        });
      }
    });
    
  }, 1000); // 1秒後に実行
  
  // 7. 英語翻訳関数
  function performEnglishTranslation() {
    console.log('英語翻訳を実行中...');
    
    const translations = {
      'ホーム': 'Home',
      'ガイドを探す': 'Find Guides',
      '使い方': 'How to Use',
      'ログイン': 'Login',
      '新規登録': 'Register',
      '旅行者として登録': 'Register as Tourist',
      'ガイドとして登録': 'Register as Guide',
      'ローカルガイドと一緒に特別な旅を体験': 'Experience special journeys with local guides',
      'あなたの知識と経験を共有しましょう': 'Share your knowledge and experience',
      'お問い合わせ': 'Contact Us',
      '人気のガイド': 'Popular Guides',
      'ガイドを絞り込む': 'Filter Guides',
      '地域': 'Region',
      '言語': 'Language',
      '料金': 'Fee',
      'キーワード': 'Keywords',
      '検索': 'Search',
      'リセット': 'Reset',
      '詳細を見る': 'See Details',
      'あなただけの特別な旅を': 'Your Special Journey Awaits',
      '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that you cannot find in regular tours',
      '使い方': 'How It Works',
      'アカウント登録': 'Create Account',
      'ガイドを見つける': 'Find Guides',
      '予約して楽しむ': 'Book and Enjoy'
    };
    
    // メインコンテンツの翻訳
    let translatedCount = 0;
    
    // ナビゲーションリンクを個別に翻訳
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach((link, index) => {
      if (index === 0 && link.textContent.includes('ホーム')) {
        link.textContent = 'Home';
        translatedCount++;
      } else if (index === 1 && link.textContent.includes('ガイドを探す')) {
        link.textContent = 'Find Guides';
        translatedCount++;
      } else if (index === 2 && link.textContent.includes('使い方')) {
        link.textContent = 'How to Use';
        translatedCount++;
      }
    });
    
    // 一般的なテキスト要素の翻訳
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, span, label').forEach(element => {
      // 子要素が無いか、テキストのみの要素を対象
      if (element.children.length === 0 || (element.children.length === 1 && element.children[0].tagName === 'I')) {
        const text = element.textContent.trim();
        if (translations[text]) {
          // アイコンがある場合は保持
          const icon = element.querySelector('i');
          element.textContent = translations[text];
          if (icon) {
            element.prepend(icon);
          }
          translatedCount++;
        }
      }
    });
    
    // ドロップダウンメニューの翻訳
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
      const titleEl = item.querySelector('.fw-bold');
      const descEl = item.querySelector('.text-muted, .small');
      
      if (titleEl && titleEl.textContent.includes('旅行者として登録')) {
        titleEl.textContent = 'Register as Tourist';
        if (descEl) descEl.textContent = 'Experience special journeys with local guides';
        translatedCount++;
      } else if (titleEl && titleEl.textContent.includes('ガイドとして登録')) {
        titleEl.textContent = 'Register as Guide';
        if (descEl) descEl.textContent = 'Share your knowledge and experience';
        translatedCount++;
      }
    });
    
    console.log(`✓ ${translatedCount}個の要素を英語に翻訳しました`);
  }
  
  console.log('🔧 言語ボタン根本修正スクリプト準備完了');
  
})();