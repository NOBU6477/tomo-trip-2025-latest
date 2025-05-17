/**
 * シンプルな翻訳スクリプト
 * エラーに強い設計で、UIの表示言語を切り替えます
 */

(function() {
  // 翻訳データが読み込まれない場合のフォールバック
  if (!window.translationData) {
    console.warn("翻訳データが見つかりません。最小限の翻訳で実行します。");
    window.translationData = {
      en: {
        navigation: {
          'ホーム': 'Home',
          'ガイドを探す': 'Find Guides',
          'ログイン': 'Login'
        }
      }
    };
  }

  // 現在の言語設定
  let currentLanguage = localStorage.getItem('selectedLanguage') || 'ja';
  
  // ページ読み込み完了時に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log("シンプル翻訳: DOM読み込み完了");
    setupLanguageButtons();
    applyCurrentLanguage();
  });

  // 言語切り替えボタンの設定
  function setupLanguageButtons() {
    try {
      // 日本語ボタン
      document.querySelectorAll('[data-lang="ja"]').forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          switchLanguage('ja');
        });
      });
      
      // 英語ボタン
      document.querySelectorAll('[data-lang="en"]').forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          switchLanguage('en');
        });
      });
      
      console.log("シンプル翻訳: 言語切り替えボタンを設定しました");
    } catch (error) {
      console.error("シンプル翻訳: ボタン設定エラー", error);
    }
  }

  // 言語切り替え実行
  function switchLanguage(lang) {
    try {
      console.log("シンプル翻訳: 言語を切り替えます", lang);
      currentLanguage = lang;
      localStorage.setItem('selectedLanguage', lang);
      
      if (lang === 'ja') {
        // 日本語の場合はリロードで元の表示に戻す
        location.reload();
        return;
      }
      
      // 言語切り替えボタンの表示を更新
      updateLanguageButton(lang);
      
      // 翻訳を適用
      translatePage(lang);
    } catch (error) {
      console.error("シンプル翻訳: 言語切り替えエラー", error);
    }
  }

  // 言語切り替えボタンの表示を更新
  function updateLanguageButton(lang) {
    try {
      const langBtn = document.getElementById('languageDropdown');
      if (langBtn) {
        langBtn.textContent = lang === 'en' ? 'English' : '日本語';
      }
    } catch (error) {
      console.error("シンプル翻訳: ボタン表示更新エラー", error);
    }
  }

  // 保存された言語設定を適用
  function applyCurrentLanguage() {
    if (currentLanguage === 'en') {
      translatePage('en');
      updateLanguageButton('en');
    }
  }

  // 翻訳関数
  function translate(lang, text) {
    if (!text || typeof text !== 'string' || text.trim() === '' || lang === 'ja') {
      return text;
    }
    
    try {
      // 翻訳データが存在しない場合
      if (!window.translationData || !window.translationData[lang]) {
        return text;
      }
      
      // すべてのカテゴリをチェック
      for (const category in window.translationData[lang]) {
        const translations = window.translationData[lang][category];
        if (translations && translations[text]) {
          return translations[text];
        }
      }
      
      return text;
    } catch (error) {
      console.error("シンプル翻訳: 翻訳エラー", error);
      return text;
    }
  }

  // ページ全体の翻訳を実行
  function translatePage(lang) {
    try {
      console.log("シンプル翻訳: ページ翻訳開始", lang);
      
      // ナビゲーションメニュー
      document.querySelectorAll('.navbar-nav .nav-link').forEach(function(element) {
        translateElement(element, lang);
      });
      
      // ボタン
      document.querySelectorAll('button, .btn').forEach(function(element) {
        if (element.childElementCount === 0) {
          translateElement(element, lang);
        }
      });
      
      // 見出し
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function(element) {
        if (element.childElementCount === 0) {
          translateElement(element, lang);
        }
      });
      
      // 段落
      document.querySelectorAll('p, .card-text').forEach(function(element) {
        if (element.childElementCount === 0) {
          translateElement(element, lang);
        }
      });
      
      // ラベル
      document.querySelectorAll('label').forEach(function(element) {
        if (element.childElementCount === 0) {
          translateElement(element, lang);
        }
      });
      
      // プレースホルダー
      document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function(element) {
        const original = element.placeholder;
        element.placeholder = translate(lang, original);
      });
      
      // セレクトオプション
      document.querySelectorAll('select option').forEach(function(element) {
        translateElement(element, lang);
      });
      
      // その他のテキスト要素
      document.querySelectorAll('.text-content, .list-group-item, span:not(.badge)').forEach(function(element) {
        if (element.childElementCount === 0) {
          translateElement(element, lang);
        }
      });
      
      console.log("シンプル翻訳: ページ翻訳完了");
    } catch (error) {
      console.error("シンプル翻訳: ページ翻訳エラー", error);
    }
  }

  // 要素のテキストを翻訳
  function translateElement(element, lang) {
    try {
      const originalText = element.textContent.trim();
      if (originalText) {
        const translatedText = translate(lang, originalText);
        if (translatedText !== originalText) {
          element.textContent = translatedText;
        }
      }
    } catch (error) {
      console.error("シンプル翻訳: 要素翻訳エラー", error, element);
    }
  }

  // グローバルスコープに公開
  window.simpleTranslator = {
    translate: translate,
    switchLanguage: switchLanguage
  };
  
  console.log("シンプル翻訳: 初期化完了");
})();