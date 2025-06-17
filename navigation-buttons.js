/**
 * ナビゲーションボタン（ホームボタンと戻るボタン）の機能を提供するスクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  // 新規登録モードの場合はナビゲーションボタンを追加しない
  const urlParams = new URLSearchParams(window.location.search);
  const isRegistrationMode = urlParams.get('mode') === 'registration' || urlParams.get('step') === '2';
  
  if (isRegistrationMode) {
    console.log('新規登録モードのためナビゲーションボタンをスキップします');
    return;
  }

  // トップページでない場合にのみナビゲーションボタンを追加
  if (!isTopPage()) {
    addNavigationButtons();
  }

  // 言語切り替えを検出するイベントリスナーの設定
  setupLanguageChangeDetection();
});

/**
 * ナビゲーションボタンを追加する
 */
function addNavigationButtons() {
  // すでに存在する場合は追加しない
  if (document.querySelector('.navigation-buttons')) {
    return;
  }

  // ナビゲーションボタンのコンテナを作成
  const navContainer = document.createElement('div');
  navContainer.className = 'navigation-buttons fixed-bottom mb-5 ml-4';
  navContainer.style.cssText = 'left: 0; z-index: 1030; width: auto;';

  // ホームボタンを追加
  const homeButton = createNavigationButton('home', '/', 'bi bi-house-fill');
  
  // 戻るボタンを追加
  const backButton = createNavigationButton('back', 'javascript:history.back()', 'bi bi-arrow-left-circle-fill');
  
  // ボタンをコンテナに追加
  navContainer.appendChild(homeButton);
  navContainer.appendChild(backButton);
  
  // ページにコンテナを追加
  document.body.appendChild(navContainer);

  // ボタンのスタイルを設定するCSSを追加
  const style = document.createElement('style');
  style.textContent = `
    .navigation-buttons {
      display: flex;
      gap: 10px;
    }
    .nav-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: rgba(0, 123, 255, 0.95);
      color: white;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      font-weight: bold;
      border: 2px solid white;
    }
    .nav-button:hover {
      background-color: rgba(0, 86, 179, 1);
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
      color: white;
      text-decoration: none;
    }
    .nav-button i {
      font-size: 28px;
    }
    .nav-back-button {
      background-color: rgba(220, 53, 69, 0.95);
    }
    .nav-back-button:hover {
      background-color: rgba(200, 35, 51, 1);
    }
    @media (max-width: 768px) {
      .navigation-buttons {
        margin-bottom: 1rem !important;
        margin-left: 1rem !important;
      }
      .nav-button {
        width: 55px;
        height: 55px;
        border-width: 2px;
      }
      .nav-button i {
        font-size: 24px;
      }
    }
  `;
  document.head.appendChild(style);

  // Bootstrap Iconsがまだ読み込まれていない場合は追加
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css';
    document.head.appendChild(link);
  }
}

/**
 * ナビゲーションボタンを作成する
 */
function createNavigationButton(type, href, iconClass) {
  const button = document.createElement('a');
  button.href = href;
  button.className = `nav-button nav-${type}-button`;
  button.setAttribute('data-type', type);
  button.setAttribute('title', type === 'home' ? 'ホーム' : '戻る');
  
  const icon = document.createElement('i');
  icon.className = iconClass;
  
  button.appendChild(icon);
  return button;
}

/**
 * トップページかどうかを判定する
 */
function isTopPage() {
  const path = window.location.pathname;
  return path === '/' || path === '/index.html' || path.endsWith('/');
}

/**
 * 言語切り替えの検出と翻訳
 */
function setupLanguageChangeDetection() {
  // 言語スイッチャーの要素を監視
  const englishButton = document.querySelector('.btn.btn-sm[data-language="en"]');
  const japaneseButton = document.querySelector('.btn.btn-sm[data-language="ja"]');
  
  if (englishButton) {
    englishButton.addEventListener('click', function() {
      setTimeout(() => translateNavigationButtons('en'), 100);
    });
  }
  
  if (japaneseButton) {
    japaneseButton.addEventListener('click', function() {
      setTimeout(() => translateNavigationButtons('ja'), 100);
    });
  }
  
  // ドロップダウンの言語切り替えリンクも監視
  const langLinks = document.querySelectorAll('[onclick*="changeLanguage"]');
  langLinks.forEach(link => {
    link.addEventListener('click', function() {
      const langCode = this.getAttribute('onclick').match(/'([a-z]{2})'/)[1];
      setTimeout(() => translateNavigationButtons(langCode), 100);
    });
  });
  
  // ページ読み込み時に現在の言語を検出して設定
  const currentLang = document.documentElement.lang || 'ja';
  translateNavigationButtons(currentLang);
}

/**
 * ナビゲーションボタンのテキストを翻訳する
 */
function translateNavigationButtons(lang) {
  const homeButton = document.querySelector('.nav-home-button');
  const backButton = document.querySelector('.nav-back-button');
  
  if (homeButton && backButton) {
    if (lang === 'en') {
      homeButton.setAttribute('title', 'Home');
      backButton.setAttribute('title', 'Back');
    } else {
      homeButton.setAttribute('title', 'ホーム');
      backButton.setAttribute('title', '戻る');
    }
  }
}