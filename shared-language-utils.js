/**
 * 共有言語ユーティリティ - 全ページで一貫した言語管理のための共通関数
 * このスクリプトは各ページの言語切り替え機能を強化し、ページ間で言語設定を保持します
 */

// 初期化処理
(function() {
  console.log('共有言語ユーティリティを初期化');
  
  // ページ読み込み時に言語設定を復元
  document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage === 'en') {
      console.log('保存された言語設定を復元: 英語');
      applyLanguage('en');
    }
  });
})();

/**
 * 指定された言語をページに適用する
 * @param {string} lang - 適用する言語コード ('en' または 'ja')
 */
function applyLanguage(lang) {
  // 言語設定を保存
  localStorage.setItem('selectedLanguage', lang);
  
  // 言語ドロップダウンメニューの表示を更新
  const langBtn = document.getElementById('languageDropdown');
  if (langBtn) {
    langBtn.textContent = lang === 'en' ? 'English' : '日本語';
  }
  
  // 既存の翻訳関数を呼び出す（ページによって異なる）
  if (lang === 'en') {
    if (typeof translateToEnglish === 'function') {
      translateToEnglish();
    } else if (typeof translatePage === 'function') {
      translatePage('en');
    }
  } else if (lang === 'ja') {
    // 日本語に戻すときはページをリロード（最も簡単で確実な方法）
    location.reload();
  }
}

/**
 * 言語切り替えボタンをセットアップ
 * このページに存在する既存の言語ボタンを拡張し、localStorage使用するように設定
 */
function setupLanguageButtons() {
  // 言語ボタンの要素を取得（クラス名や属性は異なる場合があるため複数パターン対応）
  const enButtons = [
    ...document.querySelectorAll('.dropdown-item[data-lang="en"]'),
    ...document.querySelectorAll('a[data-lang="en"]'),
    ...document.querySelectorAll('button[data-lang="en"]')
  ];
  
  const jaButtons = [
    ...document.querySelectorAll('.dropdown-item[data-lang="ja"]'),
    ...document.querySelectorAll('a[data-lang="ja"]'),
    ...document.querySelectorAll('button[data-lang="ja"]')
  ];
  
  // 英語ボタンにクリックイベントを設定
  enButtons.forEach(button => {
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('英語に切り替えます');
        applyLanguage('en');
      });
    }
  });
  
  // 日本語ボタンにクリックイベントを設定
  jaButtons.forEach(button => {
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('日本語に切り替えます');
        applyLanguage('ja');
      });
    }
  });
}

// ページが読み込まれたら言語ボタンを設定
document.addEventListener('DOMContentLoaded', setupLanguageButtons);