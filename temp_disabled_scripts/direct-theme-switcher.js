/**
 * 直接テーマ切り替え機能 - 問題解決用
 * ブートストラップのドロップダウンに依存しない直接切替方式
 */
(function() {
  console.log('直接テーマ切り替え機能を初期化');
  
  // DOMContentLoaded前でも動作できるように即時実行
  setupDirectThemeSwitcher();
  
  // DOMContentLoaded後にも確実に実行
  document.addEventListener('DOMContentLoaded', function() {
    setupDirectThemeSwitcher();
  });
  
  /**
   * 直接テーマ切り替えボタンを設定
   */
  function setupDirectThemeSwitcher() {
    console.log('直接テーマ切り替えボタンをセットアップ');

    // テーマオプションのイベントハンドラ削除して直接設定（代入）
    document.querySelectorAll('.theme-option').forEach(option => {
      const theme = option.getAttribute('data-theme');
      
      // jQuery使用時の対策 - データ属性からテーマ名を取得する
      option.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const targetTheme = this.getAttribute('data-theme');
        console.log('テーマオプションがクリックされました:', targetTheme);
        
        // 必ずテーマを取得できた場合のみ適用
        if (targetTheme) {
          applyTheme(targetTheme);
        }
        
        // Bootstrap dropdownを手動で閉じる
        const dropdownMenus = document.querySelectorAll('.dropdown-menu.show');
        dropdownMenus.forEach(menu => menu.classList.remove('show'));
        
        return false;
      });
    });
    
    // テーマメインボタンに直接クリックイベントを設定（シングルクリック）
    const themeToggleButton = document.getElementById('themeToggleButton');
    if (themeToggleButton) {
      themeToggleButton.addEventListener('click', function(e) {
        console.log('テーマボタンがクリックされました - 直接テーマをサイクル');
        cycleTheme();
        
        // ドロップダウンを開かないようにデフォルト動作を停止
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true); // キャプチャリングフェーズで実行して確実に処理
    }

    // モバイル用フローティングボタンの設定
    const mobileToggle = document.querySelector('.theme-toggle-mobile');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('モバイルテーマボタンがクリックされました');
        cycleTheme();
        return false;
      }, true); // キャプチャリングフェーズで実行して確実に処理
    }

    // 初期テーマの適用
    const savedTheme = localStorage.getItem('theme-preference') || 'light';
    applyTheme(savedTheme);
  }

  /**
   * テーマをサイクル（ライト→ダーク→自動→ライト）
   */
  function cycleTheme() {
    const currentTheme = localStorage.getItem('theme-preference') || 'light';
    let nextTheme;
    
    if (currentTheme === 'light') {
      nextTheme = 'dark';
    } else if (currentTheme === 'dark') {
      nextTheme = 'auto';
    } else {
      nextTheme = 'light';
    }
    
    console.log('テーマをサイクル:', currentTheme, '→', nextTheme);
    applyTheme(nextTheme);
  }

  /**
   * テーマを適用する
   */
  function applyTheme(theme) {
    console.log('テーマを適用:', theme);
    
    // localStorage に保存
    localStorage.setItem('theme-preference', theme);
    
    // HTML要素のクラスを変更
    document.documentElement.classList.remove('light-theme', 'dark-theme', 'auto-theme');
    document.documentElement.classList.add(theme + '-theme');
    
    // アイコンを更新
    updateThemeIcons(theme);
    
    // ドロップダウンメニューを閉じる（Bootstrapの機能を使用）
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('show');
    });
    
    // dropdownボタンのaria-expandedを更新
    const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"][aria-expanded="true"]');
    dropdownToggles.forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
    });
  }
  
  /**
   * テーマアイコンを更新
   */
  function updateThemeIcons(theme) {
    // メインテーマアイコン
    const mainIcon = document.querySelector('#themeToggleButton i');
    if (mainIcon) {
      mainIcon.className = 'bi';
      if (theme === 'dark') {
        mainIcon.classList.add('bi-moon');
      } else if (theme === 'auto') {
        mainIcon.classList.add('bi-circle-half');
      } else {
        mainIcon.classList.add('bi-sun');
      }
    }
    
    // モバイルテーマアイコン
    const mobileIcon = document.querySelector('.theme-toggle-mobile i');
    if (mobileIcon) {
      mobileIcon.className = 'bi';
      if (theme === 'dark') {
        mobileIcon.classList.add('bi-moon');
      } else if (theme === 'auto') {
        mobileIcon.classList.add('bi-circle-half');
      } else {
        mobileIcon.classList.add('bi-sun');
      }
    }
    
    // ドロップダウンメニューの選択状態を更新
    document.querySelectorAll('.theme-option').forEach(option => {
      if (option.getAttribute('data-theme') === theme) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }
})();