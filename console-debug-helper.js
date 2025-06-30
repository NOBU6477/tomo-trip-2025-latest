/**
 * コンソールデバッグヘルパー
 * ブラウザコンソールで手動実行できるデバッグ関数
 */
(function() {
  'use strict';
  
  // グローバル関数として公開
  window.debugLanguageButtons = function() {
    console.log('=== 言語ボタンデバッグ開始 ===');
    
    // 全ての要素を詳細調査
    const langJa = document.getElementById('lang-ja');
    const langEn = document.getElementById('lang-en');
    const langDropdown = document.getElementById('languageDropdown');
    const registerDropdown = document.getElementById('registerDropdown');
    
    console.log('要素調査結果:');
    console.log('1. lang-ja:', langJa || '見つからない');
    console.log('2. lang-en:', langEn || '見つからない');
    console.log('3. languageDropdown:', langDropdown || '見つからない');
    console.log('4. registerDropdown:', registerDropdown || '見つからない');
    
    // ドロップダウンメニューを検索
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    console.log('5. ドロップダウンメニュー数:', dropdownMenus.length);
    
    dropdownMenus.forEach((menu, index) => {
      console.log(`メニュー${index + 1}:`, menu);
      const items = menu.querySelectorAll('.dropdown-item');
      items.forEach((item, itemIndex) => {
        console.log(`  項目${itemIndex + 1}:`, item.textContent.trim(), item);
      });
    });
    
    // Bootstrap確認
    console.log('6. Bootstrap:', typeof window.bootstrap !== 'undefined' ? '利用可能' : '未定義');
    
    // 現在の言語設定
    console.log('7. 言語設定:');
    console.log('  - selectedLanguage:', localStorage.getItem('selectedLanguage'));
    console.log('  - localGuideLanguage:', localStorage.getItem('localGuideLanguage'));
    
    console.log('=== デバッグ完了 ===');
  };
  
  // 強制英語翻訳
  window.forceEnglishTranslation = function() {
    console.log('強制英語翻訳を実行');
    
    // ナビゲーション
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks[0] && (navLinks[0].textContent = 'Home');
    navLinks[1] && (navLinks[1].textContent = 'Find Guides');
    navLinks[2] && (navLinks[2].textContent = 'How to Use');
    
    // セクションタイトル
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      if (h.textContent.includes('人気のガイド')) h.textContent = 'Popular Guides';
      if (h.textContent.includes('使い方')) h.textContent = 'How to Use';
      if (h.textContent.includes('ガイドを絞り込む')) h.textContent = 'Filter Guides';
    });
    
    // 詳細ボタン
    document.querySelectorAll('button, .btn, a').forEach(btn => {
      if (btn.textContent.trim() === '詳細を見る') {
        btn.textContent = 'See Details';
        console.log('詳細ボタンを英訳:', btn);
      }
    });
    
    console.log('強制翻訳完了');
  };
  
  // 強制日本語復帰
  window.forceJapaneseRevert = function() {
    console.log('強制日本語復帰を実行');
    
    // 言語設定をクリア
    localStorage.removeItem('selectedLanguage');
    localStorage.removeItem('localGuideLanguage');
    
    // ページリロード
    location.reload();
  };
  
  // 手動でボタンクリックをシミュレート
  window.simulateLanguageClick = function(lang) {
    console.log(`${lang}ボタンクリックをシミュレート`);
    
    if (lang === 'ja') {
      localStorage.setItem('selectedLanguage', 'ja');
      location.reload();
    } else if (lang === 'en') {
      localStorage.setItem('selectedLanguage', 'en');
      window.forceEnglishTranslation();
    }
  };
  
  console.log('デバッグヘルパー準備完了');
  console.log('使用可能な関数:');
  console.log('- debugLanguageButtons() : 詳細調査');
  console.log('- forceEnglishTranslation() : 強制英語翻訳');
  console.log('- forceJapaneseRevert() : 強制日本語復帰');
  console.log('- simulateLanguageClick("ja"|"en") : 言語切り替えシミュレート');
  
})();