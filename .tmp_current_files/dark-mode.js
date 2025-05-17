/**
 * ダークモード切り替え機能のスクリプト
 * ユーザーがテーマの切り替えとシステム設定の追従を選択できるようにする
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('ダークモード切り替え機能を初期化');
  
  // テーマ設定の読み込み
  loadThemePreference();
  
  // テーマ切り替えUI要素の追加
  addThemeToggle();
  
  // システムのテーマ設定変更を監視
  watchSystemTheme();
});

/**
 * 保存されたテーマ設定を読み込む
 */
function loadThemePreference() {
  // ローカルストレージからテーマ設定を取得
  const savedTheme = localStorage.getItem('theme-preference');
  
  if (savedTheme) {
    // 保存された設定があれば適用
    console.log(`保存されたテーマ設定を適用: ${savedTheme}`);
    applyTheme(savedTheme);
  } else {
    // 保存がなければシステム設定を使用
    console.log('システムのテーマ設定を使用');
    applyTheme('auto');
  }
}

/**
 * テーマを適用
 */
function applyTheme(theme) {
  const root = document.documentElement;
  
  // 既存のテーマクラスをすべて削除
  root.classList.remove('light-theme', 'dark-theme', 'auto-theme');
  
  // 選択されたテーマを適用
  if (theme === 'dark') {
    root.classList.add('dark-theme');
  } else if (theme === 'light') {
    root.classList.add('light-theme');
  } else {
    // 'auto'の場合はシステム設定を使用
    root.classList.add('auto-theme');
    
    // メディアクエリでシステムの設定を確認
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('システム設定：ダークモード');
    } else {
      console.log('システム設定：ライトモード');
    }
  }
  
  // テーマをローカルストレージに保存
  localStorage.setItem('theme-preference', theme);
  
  // テーマ切り替えボタンのアイコンを更新
  updateThemeToggleIcons(theme);
}

/**
 * テーマ切り替えUIの追加
 */
function addThemeToggle() {
  // 既存のテーマトグルボタンがあるか確認
  const existingToggle = document.getElementById('themeToggleButton');
  if (existingToggle) {
    console.log('テーマ切り替えボタンは既に存在します');
    // 既存のボタンにイベントリスナーを設定
    setupThemeOptionListeners();
    return;
  }
  
  // 言語ドロップダウンの横に切り替えボタンを追加
  const languageDropdown = document.querySelector('.dropdown [id="languageDropdown"]');
  if (languageDropdown) {
    const parentContainer = languageDropdown.closest('.dropdown').parentElement;
    
    // テーマ切り替えドロップダウン要素の作成
    const themeToggleContainer = document.createElement('div');
    themeToggleContainer.className = 'dropdown me-3';
    themeToggleContainer.innerHTML = `
      <button class="btn btn-light dropdown-toggle" id="themeToggleButton" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-sun"></i>
        <span class="d-none d-lg-inline-block ms-1">テーマ</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="themeToggleButton">
        <li><a class="dropdown-item theme-option" data-theme="light" href="#"><i class="bi bi-sun me-2"></i>ライトモード</a></li>
        <li><a class="dropdown-item theme-option" data-theme="dark" href="#"><i class="bi bi-moon me-2"></i>ダークモード</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item theme-option" data-theme="auto" href="#"><i class="bi bi-circle-half me-2"></i>自動（システム設定）</a></li>
      </ul>
    `;
    
    // 言語ドロップダウンの後に追加
    parentContainer.insertBefore(themeToggleContainer, document.getElementById('navbar-user-area'));
    
    // テーマオプションのクリックイベント設定
    setupThemeOptionListeners();
  } else {
    // 言語ドロップダウンが見つからない場合、代替手段としてnarbarのコンテナに直接追加
    const navbarContainer = document.querySelector('.navbar .container');
    if (navbarContainer) {
      const themeToggleButton = document.createElement('button');
      themeToggleButton.className = 'btn btn-light ms-auto me-2';
      themeToggleButton.id = 'themeToggleButtonDirect';
      themeToggleButton.innerHTML = '<i class="bi bi-circle-half"></i>';
      themeToggleButton.setAttribute('title', 'テーマ切り替え');
      
      navbarContainer.appendChild(themeToggleButton);
      
      // テーマ切り替えサイクル（ライト → ダーク → 自動）
      themeToggleButton.addEventListener('click', function() {
        const currentTheme = localStorage.getItem('theme-preference') || 'auto';
        const nextTheme = currentTheme === 'light' ? 'dark' : (currentTheme === 'dark' ? 'auto' : 'light');
        applyTheme(nextTheme);
      });
    }
  }
}

/**
 * テーマオプションのイベントリスナーを設定
 */
function setupThemeOptionListeners() {
  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const theme = this.getAttribute('data-theme');
      applyTheme(theme);
    });
  });
}

/**
 * モバイル用のフローティングテーマトグルボタンを追加
 */
function addMobileThemeToggle() {
  // 既存のモバイルトグルボタンがあるか確認
  if (document.querySelector('.theme-toggle-mobile')) {
    return;
  }

  // モバイル用の固定テーマ切り替えボタン
  const mobileToggle = document.createElement('button');
  mobileToggle.className = 'theme-toggle-mobile d-md-none';
  mobileToggle.innerHTML = '<i class="bi bi-sun"></i>';
  mobileToggle.setAttribute('aria-label', 'テーマを切り替え');
  
  mobileToggle.addEventListener('click', function() {
    // 現在のテーマを取得
    const currentTheme = localStorage.getItem('theme-preference') || 'auto';
    
    // 次のテーマを決定（循環）
    let nextTheme;
    if (currentTheme === 'light') {
      nextTheme = 'dark';
    } else if (currentTheme === 'dark') {
      nextTheme = 'auto';
    } else {
      nextTheme = 'light';
    }
    
    // 新しいテーマを適用
    applyTheme(nextTheme);
  });
  
  document.body.appendChild(mobileToggle);
}

/**
 * テーマ切り替えボタンのアイコンを更新
 */
function updateThemeToggleIcons(theme) {
  // テーマ切り替えボタンのアイコンとテキストを更新
  const themeToggleButton = document.getElementById('themeToggleButton');
  if (themeToggleButton) {
    // アイコンを更新
    let iconClass = 'bi-sun';
    if (theme === 'dark') {
      iconClass = 'bi-moon';
    } else if (theme === 'auto') {
      iconClass = 'bi-circle-half';
    }
    
    // アイコン要素を更新
    const iconElement = themeToggleButton.querySelector('i');
    if (iconElement) {
      iconElement.className = `bi ${iconClass}`;
    }
  }
  
  // 直接ボタンのアイコン更新
  const directButton = document.getElementById('themeToggleButtonDirect');
  if (directButton) {
    let iconClass = 'bi-sun';
    if (theme === 'dark') {
      iconClass = 'bi-moon';
    } else if (theme === 'auto') {
      iconClass = 'bi-circle-half';
    }
    
    const iconElement = directButton.querySelector('i');
    if (iconElement) {
      iconElement.className = `bi ${iconClass}`;
    }
  }
  
  // モバイルトグルボタンのアイコンを更新
  const mobileToggle = document.querySelector('.theme-toggle-mobile');
  if (mobileToggle) {
    let iconClass = 'bi-sun';
    if (theme === 'dark') {
      iconClass = 'bi-moon';
    } else if (theme === 'auto') {
      iconClass = 'bi-circle-half';
    }
    
    const iconElement = mobileToggle.querySelector('i');
    if (iconElement) {
      iconElement.className = `bi ${iconClass}`;
    }
  }
  
  // 選択されているオプションをハイライト
  document.querySelectorAll('.theme-option').forEach(option => {
    if (option.getAttribute('data-theme') === theme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

/**
 * システムのテーマ設定変更を監視
 */
function watchSystemTheme() {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // メディアクエリの変更を監視
    mediaQuery.addEventListener('change', e => {
      console.log(`システムのテーマ設定が変更されました: ${e.matches ? 'ダーク' : 'ライト'}`);
      
      // 'auto'設定の場合に再適用
      if (localStorage.getItem('theme-preference') === 'auto') {
        applyTheme('auto');
      }
    });
  }
}

/**
 * ドキュメントの準備ができたらテーマ関連の処理を初期化
 */
document.addEventListener('DOMContentLoaded', function() {
  loadThemePreference();
  addThemeToggle();
  addMobileThemeToggle();
  watchSystemTheme();
  
  // 初期状態のアイコン更新
  updateThemeToggleIcons(localStorage.getItem('theme-preference') || 'auto');
});