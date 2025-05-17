/**
 * ボタン修正スクリプト
 * 言語切り替えボタンとテーマ切り替えボタンの動作を修正
 */
(function() {
  // 即時実行関数でボタンの動作を修正（DOMContentLoadedを待たない）
  console.log('ボタン修正スクリプトを実行');
  
  // テーマオプションのクリックハンドラ関数
  function themeOptionHandler(e) {
    e.preventDefault();
    const theme = this.getAttribute('data-theme');
    console.log('テーマオプションを選択: ' + theme);
    localStorage.setItem('theme-preference', theme);
    applyThemeDirectly(theme);
  }
  
  // モバイルテーマボタンのクリックハンドラ
  function mobileThemeClickHandler(e) {
    e.preventDefault(); 
    // 現在のテーマを取得して次のテーマに切り替え
    const currentTheme = localStorage.getItem('theme-preference') || 'auto';
    const nextTheme = currentTheme === 'light' ? 'dark' : (currentTheme === 'dark' ? 'auto' : 'light');
    console.log('モバイルボタンからテーマを切り替え: ' + nextTheme);
    // テーマを適用
    localStorage.setItem('theme-preference', nextTheme);
    applyThemeDirectly(nextTheme);
  }

  // 言語切り替えボタン
  setupLanguageSwitchButtons();
  
  // テーマ切り替えボタン
  setupThemeToggleButtons();
  
  // 新規登録ボタン
  setupRegisterButtons();
  
  // ログインボタン
  setupLoginButtons();
  
  // ページ読み込み完了時にもう一度実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('ページ読み込み完了後にボタン修正を再実行');
    // 言語切り替えボタン
    setupLanguageSwitchButtons();
    
    // テーマ切り替えボタン
    setupThemeToggleButtons();
    
    // 新規登録ボタン
    setupRegisterButtons();
    
    // ログインボタン
    setupLoginButtons();
  });
  
  /**
   * 言語切り替えボタンのイベントリスナーを修正
   */
  function setupLanguageSwitchButtons() {
    // 日本語ボタン
    const jpButton = document.querySelector('a[data-lang="ja"]');
    if (jpButton) {
      jpButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('日本語に切り替え');
        localStorage.setItem('localGuideLanguage', 'ja');
        location.reload();
      });
    }
    
    // 英語ボタン
    const enButton = document.querySelector('a[data-lang="en"]');
    if (enButton) {
      enButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('英語に切り替え');
        localStorage.setItem('localGuideLanguage', 'en');
        
        // 英語翻訳を適用（既存のswitchLanguage関数を使用）
        if (typeof switchLanguage === 'function') {
          switchLanguage('en');
        } else {
          // 翻訳関数が見つからない場合はリロード
          location.reload();
        }
      });
    }
  }
  
  /**
   * テーマ切り替えボタンのイベントリスナーを修正
   */
  function setupThemeToggleButtons() {
    // テーマオプションのクリックイベント修正
    document.querySelectorAll('.theme-option').forEach(option => {
      // 既存のイベントリスナーを削除して重複を防止
      option.removeEventListener('click', themeOptionHandler);
      // 新しいイベントリスナーを追加
      option.addEventListener('click', themeOptionHandler);
    });
    
    // メインテーマボタン - ただしこれはドロップダウントグルなので実際は不要
    const themeButton = document.getElementById('themeToggleButton');
    if (themeButton) {
      // 直接テーマを切り替える機能を追加（ドロップダウンを開かずに切り替え）
      themeButton.addEventListener('dblclick', function(e) {
        console.log('テーマ切替ボタンがダブルクリックされました');
        // 現在のテーマを取得して次のテーマに切り替え
        const currentTheme = localStorage.getItem('theme-preference') || 'auto';
        const nextTheme = currentTheme === 'light' ? 'dark' : (currentTheme === 'dark' ? 'auto' : 'light');
        console.log('次のテーマに切り替え: ' + nextTheme);
        // テーマを適用
        localStorage.setItem('theme-preference', nextTheme);
        applyThemeDirectly(nextTheme);
      });
    }
    
    // テーマ直接切替ボタン（モバイル用フローティングボタン）
    const mobileThemeButton = document.querySelector('.theme-toggle-mobile');
    if (mobileThemeButton) {
      mobileThemeButton.removeEventListener('click', mobileThemeClickHandler);
      mobileThemeButton.addEventListener('click', mobileThemeClickHandler);
    }
  }
  
  /**
   * テーマを直接適用
   */
  function applyThemeDirectly(theme) {
    // ルート要素からすべてのテーマクラスを削除
    document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
    
    // 新しいテーマクラスを追加
    document.documentElement.classList.add(`${theme}-theme`);
    
    // アイコンを更新
    updateThemeIcons(theme);
    
    // localStorageに保存
    localStorage.setItem('theme-preference', theme);
    
    console.log('テーマを適用: ' + theme);
  }
  
  /**
   * テーマアイコンを更新
   */
  function updateThemeIcons(theme) {
    // すべてのテーマアイコンのクラスを更新
    document.querySelectorAll('.theme-toggle-mobile i, #themeToggleButton i').forEach(icon => {
      // クラスをリセット
      icon.className = 'bi';
      
      // テーマに応じたアイコンクラスを追加
      if (theme === 'dark') {
        icon.classList.add('bi-moon');
      } else if (theme === 'auto') {
        icon.classList.add('bi-circle-half');
      } else {
        icon.classList.add('bi-sun');
      }
    });
  }
  
  /**
   * 新規登録ボタンの修正
   */
  function setupRegisterButtons() {
    const registerButton = document.querySelector('button#registerDropdown');
    if (registerButton) {
      registerButton.addEventListener('click', function(e) {
        console.log('新規登録ボタンがクリックされました');
      });
    }
    
    // 旅行者として登録
    const touristRegisterLink = document.querySelector('a[data-bs-target="#registerTouristModal"]');
    if (touristRegisterLink) {
      touristRegisterLink.addEventListener('click', function(e) {
        console.log('旅行者登録リンクがクリックされました');
      });
    }
    
    // ガイドとして登録
    const guideRegisterLink = document.querySelector('a[data-bs-target="#registerGuideModal"]');
    if (guideRegisterLink) {
      guideRegisterLink.addEventListener('click', function(e) {
        console.log('ガイド登録リンクがクリックされました');
      });
    }
  }
  
  /**
   * ログインボタンの修正
   */
  function setupLoginButtons() {
    const loginButton = document.querySelector('button[data-bs-target="#loginModal"]');
    if (loginButton) {
      loginButton.addEventListener('click', function(e) {
        console.log('ログインボタンがクリックされました');
      });
    }
  }
})();