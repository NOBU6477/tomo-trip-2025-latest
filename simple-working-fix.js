/**
 * シンプルで確実な言語切り替え修正
 * 既存のHTMLを活用して最小限の変更で動作させる
 */
(function() {
  'use strict';
  
  console.log('🔧 シンプル修正開始');
  
  // 3秒遅延で確実に実行（全てのスクリプト読み込み後）
  setTimeout(function() {
    
    console.log('言語ボタンを検索中...');
    
    // 既存のボタンを検索
    let langJa = document.getElementById('lang-ja');
    let langEn = document.getElementById('lang-en');
    let langDropdown = document.getElementById('languageDropdown');
    
    console.log('要素確認結果:');
    console.log('- lang-ja:', langJa ? 'あり' : 'なし');
    console.log('- lang-en:', langEn ? 'あり' : 'なし');
    console.log('- languageDropdown:', langDropdown ? 'あり' : 'なし');
    
    // 要素が見つからない場合、代替方法でアクセス
    if (!langJa || !langEn || !langDropdown) {
      console.log('直接検索で要素を探します...');
      
      // より広範囲で検索
      const allLinks = document.querySelectorAll('a, button');
      allLinks.forEach(link => {
        const text = link.textContent.trim();
        if (text === '日本語' && link.closest('.dropdown-menu')) {
          langJa = link;
          console.log('日本語ボタンを発見');
        } else if (text === 'English' && link.closest('.dropdown-menu')) {
          langEn = link;
          console.log('英語ボタンを発見');
        } else if (text === '日本語' && link.classList.contains('dropdown-toggle')) {
          langDropdown = link;
          console.log('言語ドロップダウンを発見');
        }
      });
    }
    
    // 手動でイベントを設定
    if (langJa) {
      console.log('日本語ボタンにイベントを設定');
      
      // onclick属性を直接設定
      langJa.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('日本語ボタンクリック');
        
        // 言語設定を保存
        localStorage.setItem('selectedLanguage', 'ja');
        localStorage.setItem('localGuideLanguage', 'ja');
        
        // ドロップダウンテキスト更新
        if (langDropdown) {
          langDropdown.textContent = '日本語';
        }
        
        // ページリロード
        location.reload();
        
        return false;
      };
      
      // addEventListener も設定（二重保険）
      langJa.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('日本語ボタン - addEventListenerで処理');
        localStorage.setItem('selectedLanguage', 'ja');
        location.reload();
      });
    }
    
    if (langEn) {
      console.log('英語ボタンにイベントを設定');
      
      // onclick属性を直接設定
      langEn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('英語ボタンクリック');
        
        // 言語設定を保存
        localStorage.setItem('selectedLanguage', 'en');
        localStorage.setItem('localGuideLanguage', 'en');
        
        // ドロップダウンテキスト更新
        if (langDropdown) {
          langDropdown.textContent = 'English';
        }
        
        // 英語翻訳実行
        translateToEnglishNow();
        
        return false;
      };
      
      // addEventListener も設定（二重保険）
      langEn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('英語ボタン - addEventListenerで処理');
        localStorage.setItem('selectedLanguage', 'en');
        translateToEnglishNow();
      });
    }
    
    // ドロップダウン自体のクリック処理
    if (langDropdown) {
      console.log('ドロップダウンにイベントを設定');
      
      langDropdown.onclick = function(e) {
        console.log('言語ドロップダウンクリック');
        
        const menu = this.nextElementSibling || document.querySelector('.dropdown-menu');
        if (menu) {
          if (menu.style.display === 'block') {
            menu.style.display = 'none';
          } else {
            menu.style.display = 'block';
          }
        }
      };
    }
    
    // 新規登録ドロップダウンも修正
    const registerBtn = document.getElementById('registerDropdown');
    if (registerBtn) {
      console.log('新規登録ドロップダウンを修正');
      
      registerBtn.onclick = function(e) {
        console.log('新規登録ドロップダウンクリック');
        
        const menu = this.nextElementSibling;
        if (menu && menu.classList.contains('dropdown-menu')) {
          if (menu.style.display === 'block') {
            menu.style.display = 'none';
            this.setAttribute('aria-expanded', 'false');
          } else {
            menu.style.display = 'block';
            this.setAttribute('aria-expanded', 'true');
          }
        }
      };
    }
    
    console.log('✓ シンプル修正完了');
    
  }, 3000);
  
  // 英語翻訳関数
  function translateToEnglishNow() {
    console.log('英語翻訳を実行');
    
    // ナビゲーションメニュー
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach((link, index) => {
      if (index === 0) link.textContent = 'Home';
      else if (index === 1) link.textContent = 'Find Guides';
      else if (index === 2) link.textContent = 'How to Use';
    });
    
    // 主要セクション
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      const text = heading.textContent.trim();
      if (text === '人気のガイド') heading.textContent = 'Popular Guides';
      else if (text === 'ガイドを絞り込む') heading.textContent = 'Filter Guides';
      else if (text === '使い方') heading.textContent = 'How to Use';
      else if (text === 'ガイドとして活躍するメリット') heading.textContent = 'Benefits of Being a Guide';
      else if (text === 'あなただけの特別な旅を') heading.textContent = 'Your Special Journey Awaits';
    });
    
    // ボタン
    document.querySelectorAll('button, .btn, a.btn').forEach(btn => {
      const text = btn.textContent.trim();
      if (text === '詳細を見る') btn.textContent = 'See Details';
      else if (text === 'ログイン') btn.textContent = 'Login';
      else if (text === '新規登録') btn.textContent = 'Register';
      else if (text === 'お問い合わせ') btn.textContent = 'Contact Us';
      else if (text === 'ガイドを探す') btn.textContent = 'Find Guides';
      else if (text === '検索') btn.textContent = 'Search';
      else if (text === 'リセット') btn.textContent = 'Reset';
      else if (text === 'ガイドとして登録する') btn.textContent = 'Register as Guide';
      else if (text === 'ガイドを絞り込む') btn.textContent = 'Filter Guides';
    });
    
    // フォームラベル
    document.querySelectorAll('label, .form-label').forEach(label => {
      const text = label.textContent.trim();
      if (text === '地域') label.textContent = 'Region';
      else if (text === '言語') label.textContent = 'Language';
      else if (text === '料金') label.textContent = 'Fee';
      else if (text === 'キーワード') label.textContent = 'Keywords';
    });
    
    // ドロップダウンメニュー
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
    
    // ヒーローセクション
    const heroLead = document.querySelector('.hero-section .lead');
    if (heroLead && heroLead.textContent.includes('地元ガイドと一緒に')) {
      heroLead.textContent = 'Experience hidden gems with local guides that you cannot find in regular tours';
    }
    
    console.log('✓ 英語翻訳完了');
  }
  
  // 外部から実行可能にする
  window.translateToEnglishNow = translateToEnglishNow;
  
  console.log('🔧 シンプル修正スクリプト準備完了');
  
})();