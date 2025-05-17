// 言語管理モジュール

// デフォルト言語
window.translationSystem = window.translationSystem || {};
window.translationSystem.currentLanguage = window.translationSystem.currentLanguage || 'ja';

// 利用可能な言語
const availableLanguages = {
  'ja': '日本語',
  'en': 'English',
  'zh': '中文',
  'ko': '한국어',
  'fr': 'Français',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'ru': 'Русский'
};

// 読み込み済み翻訳データのキャッシュ
const translationsCache = {};

// 翻訳データの取得
async function loadTranslations(lang) {
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }
  
  try {
    // ブラウザ環境での動的読み込み
    console.log(`Loading translations for ${lang}`);
    
    // 既に読み込まれた翻訳ファイルを使用する（window.translations_jaまたはwindow.translations_en）
    if (lang === 'ja' && window.translations_ja) {
      console.log('Using preloaded Japanese translations');
      window.translations = window.translations_ja;
      translationsCache[lang] = window.translations_ja;
      return window.translations_ja;
    } else if (lang === 'en' && window.translations_en) {
      console.log('Using preloaded English translations');
      window.translations = window.translations_en;
      translationsCache[lang] = window.translations_en;
      return window.translations_en;
    }
    
    // まだ翻訳が読み込まれていない場合は、スクリプトタグを動的に追加して読み込む
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `/translations/${lang}.js`;
      script.onload = () => {
        console.log(`Translation file ${lang}.js loaded successfully`);
        
        if (lang === 'ja' && window.translations_ja) {
          window.translations = window.translations_ja;
          translationsCache[lang] = window.translations_ja;
          resolve(window.translations_ja);
        } else if (lang === 'en' && window.translations_en) {
          window.translations = window.translations_en;
          translationsCache[lang] = window.translations_en;
          resolve(window.translations_en);
        } else {
          console.error(`Loaded ${lang}.js but translation object not found`);
          reject(new Error(`Translation object not found for ${lang}`));
        }
      };
      script.onerror = () => {
        console.error(`Failed to load translation file for ${lang}`);
        reject(new Error(`Failed to load translation file for ${lang}`));
      };
      document.head.appendChild(script);
    });
    
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    return null;
  }
}

// 言語の変更
window.translationSystem.changeLanguage = async function(lang) {
  if (!availableLanguages[lang]) {
    console.error(`Language ${lang} is not supported`);
    return false;
  }
  
  // まだサポートしていない言語の場合は、現在のところ英語か日本語にフォールバック
  const actualLang = (lang !== 'ja' && lang !== 'en') ? 'en' : lang;
  
  const translations = await loadTranslations(actualLang);
  if (!translations) {
    console.error(`Failed to load translations for ${actualLang}`);
    // 英語へのフォールバックを試みる
    if (actualLang !== 'en') {
      const enTranslations = await loadTranslations('en');
      if (enTranslations) {
        window.translationSystem.currentLanguage = 'en';
        localStorage.setItem('preferredLanguage', 'en');
        document.getElementById('current-language').textContent = availableLanguages['en'];
        updatePageTranslations(enTranslations);
        alert('Selected language is not available yet. Switching to English.');
        return true;
      }
    }
    // 日本語への最終フォールバック
    const jaTranslations = await loadTranslations('ja');
    if (jaTranslations) {
      window.translationSystem.currentLanguage = 'ja';
      localStorage.setItem('preferredLanguage', 'ja');
      document.getElementById('current-language').textContent = availableLanguages['ja'];
      updatePageTranslations(jaTranslations);
      alert('Translation files are not available. Switching to Japanese.');
      return true;
    }
    return false;
  }
  
  window.translationSystem.currentLanguage = actualLang;
  localStorage.setItem('preferredLanguage', actualLang);
  
  // UI要素の更新
  document.getElementById('current-language').textContent = availableLanguages[actualLang];
  
  // ページ内のすべての翻訳可能要素を更新
  updatePageTranslations(translations);
  
  // window.translationsのグローバル更新（エラーメッセージ等で使用）
  window.translations = translations;
  
  return true;
}

// ページ内の翻訳を適用
function updatePageTranslations(translations) {
  console.log(`${Object.keys(translations).length}個の翻訳要素を処理します`);
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      // テキストコンテンツを持つ要素
      if (!el.hasAttribute('data-i18n-attr')) {
        el.textContent = translations[key];
      } 
      // 属性の翻訳（例：placeholder, title, alt）
      else {
        const attr = el.getAttribute('data-i18n-attr');
        el.setAttribute(attr, translations[key]);
      }
    } else {
      // 翻訳が見つからない場合はコンソールに警告を表示
      console.warn(`翻訳キー "${key}" の翻訳が見つかりません`);
    }
  });
}

// 初期言語設定
window.initializeLanguage = async function() {
  // 保存された言語設定かブラウザの言語設定を取得
  const savedLang = localStorage.getItem('preferredLanguage');
  const browserLang = navigator.language.split('-')[0];
  
  const langToUse = savedLang || 
    (availableLanguages[browserLang] ? browserLang : 'ja');
  
  // 手動でオリジナルのchangeLanguage関数を呼び出す
  const result = await window.translationSystem.changeLanguage(langToUse);
  
  // 互換性のためのグローバル関数を追加
  window.changeLanguage = function(lang) {
    console.log('グローバルchangeLanguage関数が呼び出されました。translationSystem.changeLanguageを使用します。');
    return window.translationSystem.changeLanguage(lang);
  };
  
  // 言語選択のイベントリスナーを設定（ドロップダウンなど）
  document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      window.translationSystem.changeLanguage(lang);
    });
  });
  
  // ドロップダウン用のイベントリスナー
  document.querySelectorAll('.dropdown-item').forEach(option => {
    option.addEventListener('click', function(e) {
      // ドロップダウンが直接onclick属性を使用している場合はイベントはすでに処理されています
      console.log('言語ドロップダウンがクリックされました');
    });
  });
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
  // グローバル関数を使用
  window.initializeLanguage();
});
