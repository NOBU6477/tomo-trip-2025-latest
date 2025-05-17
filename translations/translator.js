/**
 * 翻訳ユーティリティ
 * サイト全体の翻訳機能を提供する中央モジュール
 */

// 翻訳データを安全に読み込む
// モジュール形式のサポート
if (typeof require !== 'undefined') {
  const translationModule = require('./translation-data.js');
  // モジュール環境での変数割り当て
} else {
  // ブラウザ環境ではwindowオブジェクトから参照
  console.log('翻訳データをグローバルスコープから使用します');
}

/**
 * 現在の言語を取得
 * @returns {string} 言語コード（'en'または'ja'）
 */
function getCurrentLanguage() {
  return localStorage.getItem('selectedLanguage') || 'ja';
}

/**
 * 言語を設定
 * @param {string} lang - 言語コード（'en'または'ja'）
 */
function setLanguage(lang) {
  localStorage.setItem('selectedLanguage', lang);
  console.log(`言語を${lang}に設定しました`);
}

/**
 * ページ全体を翻訳
 * @param {string} lang - 言語コード（'en'または'ja'）
 */
function translatePage(lang) {
  if (lang === 'ja') {
    // 日本語の場合はページをリロード（デフォルト言語）
    location.reload();
    return;
  }
  
  // 言語設定を保存
  setLanguage(lang);
  
  // 言語切り替えイベントを発行（登録モーダル翻訳用）
  dispatchLanguageChangeEvent(lang);
  
  // 言語ドロップダウンの表示を更新
  const langBtn = document.getElementById('languageDropdown');
  if (langBtn) {
    langBtn.textContent = lang === 'en' ? 'English' : '日本語';
  }
  
  // タイトルを翻訳
  if (document.title.includes('Local Guide')) {
    document.title = 'Local Guide - ' + (lang === 'en' ? 'Experience Special Journeys' : 'あなただけの特別な旅を');
  }
  
  // ナビゲーションメニュー項目の翻訳
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function(element) {
    const original = element.textContent.trim();
    element.textContent = translateText(lang, original);
  });
  
  // ボタンとリンクの翻訳
  document.querySelectorAll('button.btn, a.btn').forEach(function(element) {
    // 子要素を持たない場合のみ処理（アイコンなどが含まれる場合は除外）
    if (element.childElementCount === 0) {
      const original = element.textContent.trim();
      const translated = translateText(lang, original);
      if (translated !== original) {
        element.textContent = translated;
      }
    }
  });
  
  // 見出しの翻訳
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function(element) {
    // 子要素を持たない場合のみ処理
    if (element.childElementCount === 0) {
      const original = element.textContent.trim();
      element.textContent = translateText(lang, original);
    }
  });
  
  // 段落と説明文の翻訳
  document.querySelectorAll('p, .lead, .description, .card-text').forEach(function(element) {
    // 子要素を持たない場合のみ処理
    if (element.childElementCount === 0) {
      const original = element.textContent.trim();
      element.textContent = translateText(lang, original);
    }
  });
  
  // フォームラベルの翻訳
  document.querySelectorAll('label, .form-label').forEach(function(element) {
    // 子要素を持たない場合のみ処理
    if (element.childElementCount === 0) {
      const original = element.textContent.trim();
      element.textContent = translateText(lang, original);
    }
  });
  
  // プレースホルダーの翻訳
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function(element) {
    const original = element.placeholder;
    element.placeholder = translateText(lang, original);
  });
  
  // セレクトオプションの翻訳
  document.querySelectorAll('select option').forEach(function(element) {
    const original = element.textContent.trim();
    element.textContent = translateText(lang, original);
  });
  
  // カードタイトルの翻訳
  document.querySelectorAll('.card-title, .card-header').forEach(function(element) {
    // 子要素を持たない場合のみ処理
    if (element.childElementCount === 0) {
      const original = element.textContent.trim();
      element.textContent = translateText(lang, original);
    }
  });
  
  // ドロップダウンアイテムの翻訳
  document.querySelectorAll('.dropdown-item').forEach(function(element) {
    // テキストノードだけを取得して翻訳
    element.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        node.textContent = translateText(lang, node.textContent.trim());
      }
    });
  });
  
  // バリデーションメッセージとエラーの翻訳
  document.querySelectorAll('.form-text, .invalid-feedback, .valid-feedback, .alert').forEach(function(element) {
    if (element.childElementCount === 0) {
      const original = element.textContent.trim();
      element.textContent = translateText(lang, original);
    }
  });
  
  // その他の一般的なテキスト要素の翻訳
  document.querySelectorAll('.text-content, span, div.text, .list-item').forEach(function(element) {
    if (element.childElementCount === 0) {
      const original = element.textContent.trim();
      if (original && original.length > 1) { // 空白や単一文字は処理しない
        element.textContent = translateText(lang, original);
      }
    }
  });
  
  // ページ特有の翻訳処理を呼び出す
  translatePageSpecific(lang);
}

/**
 * ページ特有の翻訳処理（各ページで上書き可能）
 * @param {string} lang - 言語コード（'en'または'ja'）
 */
function translatePageSpecific(lang) {
  // ガイド詳細ページの特別処理
  if (window.location.pathname.includes('guide-details')) {
    translateGuideDetails(lang);
  }
  // その他のページ特有の処理...
}

/**
 * ガイド詳細ページ特有の翻訳
 * @param {string} lang - 言語コード（'en'または'ja'）
 */
function translateGuideDetails(lang) {
  // ガイド名は翻訳しない
  
  // 地域名の翻訳
  const locationElement = document.querySelector('.guide-location');
  if (locationElement) {
    const location = locationElement.textContent.trim();
    locationElement.textContent = translateText(lang, location);
  }
  
  // レビュー数の翻訳
  const ratingElement = document.getElementById('guide-rating');
  if (ratingElement) {
    const text = ratingElement.textContent;
    const match = text.match(/(\d+\.?\d*)\s*\((\d+)件のレビュー\)/);
    if (match) {
      ratingElement.textContent = `${match[1]} (${match[2]} reviews)`;
    }
  }
  
  // 言語バッジの翻訳
  document.querySelectorAll('.language-badge').forEach(function(badge) {
    const text = badge.textContent.trim();
    badge.textContent = translateText(lang, text);
  });
  
  // ツアープラン内容の翻訳
  document.querySelectorAll('.tour-plan-item, .tour-plan-title, .tour-plan-description').forEach(function(element) {
    if (element.childElementCount === 0) {
      const original = element.textContent.trim();
      element.textContent = translateText(lang, original);
    }
  });
}

/**
 * 言語切り替えイベントのセットアップ
 */
function setupLanguageSwitcher() {
  // 英語切り替えボタン
  const enButtons = document.querySelectorAll('a[data-lang="en"], button[data-lang="en"], .dropdown-item[data-lang="en"]');
  enButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      translatePage('en');
    });
  });
  
  // 日本語切り替えボタン
  const jaButtons = document.querySelectorAll('a[data-lang="ja"], button[data-lang="ja"], .dropdown-item[data-lang="ja"]');
  jaButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      translatePage('ja');
    });
  });
}

/**
 * 保存された言語設定に基づいて初期翻訳を適用
 */
function applyInitialTranslation() {
  const savedLanguage = getCurrentLanguage();
  if (savedLanguage === 'en') {
    console.log('保存された言語設定（英語）を適用します');
    translatePage('en');
  }
}

// DOMが読み込まれたら言語切り替え機能を初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('翻訳ユーティリティを初期化');
  setupLanguageSwitcher();
  applyInitialTranslation();
});

/**
 * 言語切り替えイベントを発行する（モーダル翻訳システムとの連携用）
 * @param {string} lang - 言語コード ('en'または'ja')
 */
function dispatchLanguageChangeEvent(lang) {
  const event = new CustomEvent('languageChanged', {
    detail: { language: lang }
  });
  document.dispatchEvent(event);
}

// グローバルに公開（モーダル翻訳システムから使用できるように）
window.getCurrentLanguage = getCurrentLanguage;

// 安全に関数を公開
if (typeof window.translateText !== 'function') {
  // window.translationDataから直接アクセスしてtranslateText関数を定義
  window.translateText = function(lang, text) {
    if (!text || typeof text !== 'string') return text || '';
    if (lang === 'ja') return text;
    
    try {
      const translationData = window.translationData || {};
      if (!translationData[lang]) return text;
      
      // カテゴリを順番に検索
      for (const category in translationData[lang]) {
        if (translationData[lang][category][text]) {
          return translationData[lang][category][text];
        }
      }
      
      // 地域名などの部分一致翻訳
      for (const category in translationData[lang]) {
        for (const key in translationData[lang][category]) {
          // 全体を囲むパターン（例：「北海道のガイド」→「Hokkaido guide」）
          const pattern = new RegExp(`(^|\\s)${key}($|\\s|の|、|。|に|へ|から|で|と|や|な)`, 'g');
          if (pattern.test(text)) {
            const translation = translationData[lang][category][key];
            return text.replace(pattern, (match, p1, p2) => {
              return `${p1}${translation}${p2 === 'の' ? ' ' : p2}`;
            });
          }
        }
      }
      
      return text;
    } catch (e) {
      console.warn('translateText error:', e);
      return text;
    }
  };
}

// 翻訳者オブジェクトの安全な作成
if (!window.translator) {
  window.translator = {
    translate: function(key) {
      try {
        const lang = window.getCurrentLanguage();
        
        // 安全に翻訳データにアクセス
        const translationData = window.translationData || {};
        
        // カテゴリーを探索
        for (const category in translationData[lang]) {
          if (translationData[lang][category] && translationData[lang][category][key]) {
            return translationData[lang][category][key];
          }
        }
        
        return key;
      } catch (e) {
        console.warn('translator.translate error:', e);
        return key;
      }
    }
  };
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCurrentLanguage,
    setLanguage,
    translatePage,
    applyInitialTranslation,
    setupLanguageSwitcher,
    dispatchLanguageChangeEvent
  };
}