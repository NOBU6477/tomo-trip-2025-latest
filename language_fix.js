/**
 * 言語切替の問題を解決するための修正スクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('言語切替修正スクリプトを読み込みました');
  
  // 言語切替リンクを取得（最新のDOMを使用）
  function setupLanguageLinks() {
    const languageLinks = document.querySelectorAll('.dropdown-item[onclick^="changeLanguage"]');
    languageLinks.forEach(link => {
      const onclick = link.getAttribute('onclick');
      if (onclick) {
        const langMatch = onclick.match(/changeLanguage\(['"]([^'"]+)['"]\)/);
        if (langMatch && langMatch[1]) {
          const lang = langMatch[1];
          
          // 元のonclick属性を削除
          link.removeAttribute('onclick');
          
          // 新しいイベントリスナーを追加
          link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`言語を ${lang} に変更します...`);
            directLanguageChange(lang);
          });
        }
      }
    });
    
    console.log('言語切替リンクの設定が完了しました');
  }
  
  /**
   * 言語を直接変更する関数
   */
  function directLanguageChange(lang) {
    // 有効な言語かチェック
    if (lang !== 'ja' && lang !== 'en') {
      console.error(`サポートされていない言語です: ${lang}`);
      return;
    }
    
    console.log(`言語を ${lang} に変更しています...`);
    
    // 翻訳データの確認と読み込み
    if (!window.translations_ja || !window.translations_en) {
      console.warn('翻訳データがまだ読み込まれていません。再読み込みを試みます...');
      
      // 翻訳スクリプトが読み込まれているか確認
      const jaScriptExists = document.querySelector('script[src*="translations/ja.js"]');
      const enScriptExists = document.querySelector('script[src*="translations/en.js"]');
      
      // なければ追加
      if (!jaScriptExists) {
        const jaScript = document.createElement('script');
        jaScript.src = 'translations/ja.js';
        document.head.appendChild(jaScript);
      }
      
      if (!enScriptExists) {
        const enScript = document.createElement('script');
        enScript.src = 'translations/en.js';
        document.head.appendChild(enScript);
      }
      
      // 少し待ってから再試行
      setTimeout(() => {
        applyTranslations(lang);
      }, 200);
      return;
    }
    
    applyTranslations(lang);
  }
  
  /**
   * 翻訳を適用する関数
   */
  function applyTranslations(lang) {
    try {
      // 翻訳データを取得
      const translations = lang === 'ja' ? window.translations_ja : window.translations_en;
      
      if (!translations) {
        console.error(`${lang}の翻訳データが見つかりません`);
        return;
      }
      
      // グローバル変数を更新
      window.translations = translations;
      window.translationSystem = window.translationSystem || {};
      window.translationSystem.currentLanguage = lang;
      
      // html要素のlang属性を更新
      document.documentElement.lang = lang;
      
      // ローカルストレージに保存
      localStorage.setItem('preferredLanguage', lang);
      
      // 言語表示を更新
      const currentLangElement = document.getElementById('current-language');
      if (currentLangElement) {
        currentLangElement.textContent = lang === 'ja' ? '日本語' : 'English';
      }
      
      // すべての翻訳可能要素を更新
      const elements = document.querySelectorAll('[data-i18n]');
      console.log(`${elements.length}個の翻訳要素を処理します`);
      
      elements.forEach(el => {
        try {
          const key = el.getAttribute('data-i18n');
          if (!key) return;
          
          const translatedText = translations[key];
          if (!translatedText) {
            console.warn(`翻訳キー "${key}" の翻訳が見つかりません`);
            return;
          }
          
          // テキストコンテンツを持つ要素
          if (!el.hasAttribute('data-i18n-attr')) {
            el.textContent = translatedText;
          } 
          // 属性の翻訳（例：placeholder, title, alt）
          else {
            const attr = el.getAttribute('data-i18n-attr');
            if (attr) {
              el.setAttribute(attr, translatedText);
            }
          }
        } catch (elemError) {
          console.warn('翻訳要素の処理中にエラーが発生しました:', elemError);
        }
      });
      
      console.log(`言語を ${lang} に変更しました`);
    } catch (error) {
      console.error('翻訳適用中にエラーが発生しました:', error);
    }
  }
  
  // 言語切替リンクの設定を実行
  setupLanguageLinks();
  
  // 言語切替関数をグローバルに公開
  window.fixedChangeLanguage = directLanguageChange;
  
  // 元の言語切替関数をオーバーライド
  const originalChangeLanguage = window.changeLanguage;
  window.changeLanguage = function(lang) {
    console.log(`言語切替を実行: ${lang} (修正版)`);
    directLanguageChange(lang);
    return false; // onclick属性内で呼び出された場合に備えて
  };
  
  // モーダル表示時に言語適用
  document.addEventListener('shown.bs.modal', function(e) {
    console.log('モーダルが表示されました - 言語を再適用します');
    const currentLang = window.translationSystem?.currentLanguage || localStorage.getItem('preferredLanguage') || 'ja';
    
    try {
      applyTranslations(currentLang);
      
      // モーダル内の言語切替リンクをセットアップ
      setupLanguageLinks();
    } catch (err) {
      console.error('モーダル表示時の言語適用エラー:', err);
    }
  });
  
  // 初期言語の設定
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang === 'en') {
    // ページ読み込み時に英語が保存されている場合は、英語に切り替える
    setTimeout(() => directLanguageChange('en'), 500);
  } else {
    // デフォルトでも一度翻訳を適用しておく（日本語）
    setTimeout(() => applyTranslations('ja'), 500);
  }
  
  // ページロード後に言語切替リンクを再セットアップ
  setTimeout(setupLanguageLinks, 1000);
  
  // コンテンツの追加や変更を監視（例：動的に追加された要素に対応）
  const observer = new MutationObserver(function(mutations) {
    try {
      const currentLang = window.translationSystem?.currentLanguage || localStorage.getItem('preferredLanguage') || 'ja';
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 新しく追加された要素に翻訳を適用
          mutation.addedNodes.forEach(node => {
            try {
              if (node.nodeType === 1) { // ELEMENT_NODE
                const i18nElements = node.querySelectorAll('[data-i18n]');
                if (i18nElements.length > 0) {
                  console.log(`動的に追加された${i18nElements.length}個の要素に翻訳を適用します`);
                  applyTranslations(currentLang);
                  return;
                }
              }
            } catch (nodeError) {
              console.warn('追加ノードの処理中にエラー:', nodeError);
            }
          });
        }
      }
    } catch (observerError) {
      console.error('MutationObserver処理中にエラー:', observerError);
    }
  });
  
  // body要素の変更を監視
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
});