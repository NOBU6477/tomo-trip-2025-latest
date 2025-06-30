/**
 * 最終的な言語ボタン修正スクリプト
 * DOM構造を完全に再構築して確実に動作させる
 */
(function() {
  'use strict';
  
  console.log('🔨 最終修正開始 - DOM構造を再構築します');
  
  // より遅延させて、全てのスクリプトの後に実行
  setTimeout(function() {
    
    // 1. 現在の言語ドロップダウンを完全に置き換え
    const currentLanguageDropdown = document.getElementById('languageDropdown');
    if (currentLanguageDropdown) {
      console.log('既存の言語ドロップダウンを発見 - 再構築します');
      
      // 新しいドロップダウンHTML文字列を作成
      const newDropdownHTML = `
        <div class="dropdown me-3" id="language-dropdown-container">
          <button class="btn btn-outline-light dropdown-toggle" type="button" id="newLanguageDropdown" style="cursor: pointer;">
            日本語
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#" id="new-lang-ja" style="cursor:pointer;">日本語</a></li>
            <li><a class="dropdown-item" href="#" id="new-lang-en" style="cursor:pointer;">English</a></li>
          </ul>
        </div>
      `;
      
      // 既存のドロップダウンコンテナを置き換え
      const parentDropdown = currentLanguageDropdown.closest('.dropdown');
      if (parentDropdown) {
        parentDropdown.outerHTML = newDropdownHTML;
        console.log('✓ 言語ドロップダウンを再構築しました');
      }
    }
    
    // 2. 新しいドロップダウンにイベントを設定
    setTimeout(function() {
      const newLangDropdown = document.getElementById('newLanguageDropdown');
      const newLangJa = document.getElementById('new-lang-ja');
      const newLangEn = document.getElementById('new-lang-en');
      
      console.log('新しい要素確認:', {
        dropdown: newLangDropdown ? '✓' : '✗',
        jaBtn: newLangJa ? '✓' : '✗',
        enBtn: newLangEn ? '✓' : '✗'
      });
      
      if (newLangDropdown && newLangJa && newLangEn) {
        
        // ドロップダウン本体のクリック処理
        newLangDropdown.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('新しい言語ドロップダウンクリック');
          
          const menu = this.nextElementSibling;
          if (menu) {
            // 他のドロップダウンを閉じる
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
              if (otherMenu !== menu) {
                otherMenu.style.display = 'none';
              }
            });
            
            // 現在のメニューをトグル
            if (menu.style.display === 'block') {
              menu.style.display = 'none';
            } else {
              menu.style.display = 'block';
            }
          }
        });
        
        // 日本語ボタンクリック
        newLangJa.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('🇯🇵 日本語ボタンクリック');
          
          // ドロップダウンテキスト更新
          newLangDropdown.textContent = '日本語';
          
          // メニューを閉じる
          const menu = this.closest('.dropdown-menu');
          if (menu) menu.style.display = 'none';
          
          // 言語設定保存
          localStorage.setItem('selectedLanguage', 'ja');
          localStorage.setItem('localGuideLanguage', 'ja');
          
          // ページリロード
          console.log('日本語に切り替えてリロード');
          window.location.reload();
        });
        
        // 英語ボタンクリック
        newLangEn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('🇺🇸 英語ボタンクリック');
          
          // ドロップダウンテキスト更新
          newLangDropdown.textContent = 'English';
          
          // メニューを閉じる
          const menu = this.closest('.dropdown-menu');
          if (menu) menu.style.display = 'none';
          
          // 言語設定保存
          localStorage.setItem('selectedLanguage', 'en');
          localStorage.setItem('localGuideLanguage', 'en');
          
          // 英語翻訳実行
          console.log('英語に翻訳します');
          performQuickTranslation();
        });
        
        console.log('✓ 新しい言語ボタンのイベント設定完了');
      }
    }, 100);
    
    // 3. 新規登録ドロップダウンも修正
    const registerDropdown = document.getElementById('registerDropdown');
    if (registerDropdown) {
      console.log('新規登録ドロップダウンを修正中...');
      
      // 既存のイベントを削除
      const newRegisterBtn = registerDropdown.cloneNode(true);
      registerDropdown.parentNode.replaceChild(newRegisterBtn, registerDropdown);
      
      newRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('新規登録ドロップダウンクリック');
        
        const menu = this.nextElementSibling;
        if (menu && menu.classList.contains('dropdown-menu')) {
          // 他のドロップダウンを閉じる
          document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
            if (otherMenu !== menu) {
              otherMenu.style.display = 'none';
            }
          });
          
          // 現在のメニューをトグル
          if (menu.style.display === 'block') {
            menu.style.display = 'none';
            this.setAttribute('aria-expanded', 'false');
          } else {
            menu.style.display = 'block';
            this.setAttribute('aria-expanded', 'true');
          }
        }
      });
      
      console.log('✓ 新規登録ドロップダウン修正完了');
    }
    
    // 4. 外部クリックでメニューを閉じる
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.display = 'none';
        });
        document.querySelectorAll('[aria-expanded="true"]').forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
        });
      }
    });
    
  }, 2000); // 2秒遅延で確実に実行
  
  // 5. 英語翻訳関数
  function performQuickTranslation() {
    console.log('クイック英語翻訳実行');
    
    const translations = {
      'ホーム': 'Home',
      'ガイドを探す': 'Find Guides',
      '使い方': 'How to Use',
      'ログイン': 'Login',
      '新規登録': 'Register',
      '旅行者として登録': 'Register as Tourist',
      'ガイドとして登録': 'Register as Guide',
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
      '地元ガイドと一緒に、観光では見つけられない隠れた魅力を体験しましょう': 'Experience hidden gems with local guides that you cannot find in regular tours'
    };
    
    // ナビゲーションリンクを直接翻訳
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach((link, index) => {
      if (index === 0) link.textContent = 'Home';
      else if (index === 1) link.textContent = 'Find Guides';
      else if (index === 2) link.textContent = 'How to Use';
    });
    
    // ヒーローセクション翻訳
    const heroTitle = document.querySelector('.hero-section h1');
    const heroSubtitle = document.querySelector('.hero-section .lead');
    if (heroTitle && heroTitle.textContent.includes('あなただけの特別な旅を')) {
      heroTitle.textContent = 'Your Special Journey Awaits';
    }
    if (heroSubtitle && heroSubtitle.textContent.includes('地元ガイドと一緒に')) {
      heroSubtitle.textContent = 'Experience hidden gems with local guides that you cannot find in regular tours';
    }
    
    // セクションタイトル翻訳
    document.querySelectorAll('h2, h3, h4, h5').forEach(heading => {
      const text = heading.textContent.trim();
      if (translations[text]) {
        heading.textContent = translations[text];
      }
    });
    
    // ボタン翻訳
    document.querySelectorAll('button, .btn').forEach(btn => {
      const text = btn.textContent.trim();
      if (translations[text]) {
        btn.textContent = translations[text];
      }
    });
    
    // ドロップダウンメニュー項目の翻訳
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
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
    
    console.log('✓ クイック英語翻訳完了');
  }
  
  console.log('🔨 最終修正スクリプト準備完了');
  
})();