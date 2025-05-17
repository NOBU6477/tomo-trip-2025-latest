/**
 * 安全な翻訳システム
 * 既存の翻訳システムに問題がある場合、このスクリプトで問題を解決します
 */

// 固定データを使わないセーフティーネットバージョン
(function() {
  console.log("安全な翻訳システムを初期化しています");

  // 翻訳データが正しく読み込まれたか確認
  if (!window.translationData || !window.translationData.en) {
    console.warn("翻訳データが見つかりません。修正版を読み込みます。");
    
    // 修正版の翻訳データスクリプトを動的に読み込む
    const script = document.createElement('script');
    script.src = './translations/translation-data-fix.js';
    script.onerror = function() {
      console.error("修正版翻訳データの読み込みに失敗しました");
    };
    document.head.appendChild(script);
  }

  // 安全なtranslateText関数を確保
  if (typeof window.translateText !== 'function') {
    window.translateText = function(lang, text) {
      if (!text || typeof text !== 'string') return text || '';
      if (lang === 'ja') return text;
      
      try {
        if (!window.translationData || !window.translationData[lang]) {
          return text;
        }
        
        // カテゴリを順番に検索
        for (const category in window.translationData[lang]) {
          if (window.translationData[lang][category] && 
              window.translationData[lang][category][text]) {
            return window.translationData[lang][category][text];
          }
        }
        
        return text;
      } catch (e) {
        console.warn('translateText error:', e);
        return text;
      }
    };
  }

  // 現在の言語を取得する安全な関数
  if (typeof window.getCurrentLanguage !== 'function') {
    window.getCurrentLanguage = function() {
      try {
        return localStorage.getItem('selectedLanguage') || 'ja';
      } catch (e) {
        console.warn('getCurrentLanguage error:', e);
        return 'ja';
      }
    };
  }

  // 翻訳ヘルパー関数
  window.safeTranslate = function(text) {
    try {
      const lang = window.getCurrentLanguage();
      return window.translateText(lang, text);
    } catch (e) {
      console.warn('safeTranslate error:', e);
      return text;
    }
  };

  // ページ全体を安全に翻訳
  window.safeTranslatePage = function(lang) {
    try {
      if (lang === 'ja') {
        location.reload();
        return;
      }
      
      // 言語設定を保存
      localStorage.setItem('selectedLanguage', lang);
      
      // 言語切り替えイベントを発行
      try {
        const event = new CustomEvent('languageChanged', {
          detail: { language: lang }
        });
        document.dispatchEvent(event);
      } catch (e) {
        console.warn('言語切り替えイベント発行エラー:', e);
      }
      
      // 言語ドロップダウンの表示を更新
      try {
        const langBtn = document.getElementById('languageDropdown');
        if (langBtn) {
          langBtn.textContent = lang === 'en' ? 'English' : '日本語';
        }
      } catch (e) {
        console.warn('言語ドロップダウン更新エラー:', e);
      }

      // タイトル更新
      try {
        if (document.title.includes('Local Guide')) {
          document.title = 'Local Guide - ' + (lang === 'en' ? 'Experience Special Journeys' : 'あなただけの特別な旅を');
        }
      } catch (e) {
        console.warn('タイトル更新エラー:', e);
      }
      
      // セレクタごとに安全に翻訳
      const translateElements = function(selector) {
        try {
          document.querySelectorAll(selector).forEach(function(element) {
            if (element.childElementCount === 0) {
              const original = element.textContent.trim();
              if (original && original.length > 1) {
                element.textContent = window.translateText(lang, original);
              }
            }
          });
        } catch (e) {
          console.warn(`${selector}要素の翻訳エラー:`, e);
        }
      };
      
      // 主要要素の翻訳
      translateElements('.navbar-nav .nav-link');
      translateElements('button.btn, a.btn');
      translateElements('h1, h2, h3, h4, h5, h6');
      translateElements('p, .lead, .description, .card-text');
      translateElements('label, .form-label');
      translateElements('.card-title, .card-header');
      translateElements('.dropdown-item');
      translateElements('.form-text, .invalid-feedback, .valid-feedback, .alert');
      translateElements('.text-content, span, div.text, .list-item');
      
      // プレースホルダーの翻訳
      try {
        document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function(element) {
          const original = element.placeholder;
          element.placeholder = window.translateText(lang, original);
        });
      } catch (e) {
        console.warn('プレースホルダー翻訳エラー:', e);
      }
      
      // セレクトオプションの翻訳
      try {
        document.querySelectorAll('select option').forEach(function(element) {
          const original = element.textContent.trim();
          element.textContent = window.translateText(lang, original);
        });
      } catch (e) {
        console.warn('セレクトオプション翻訳エラー:', e);
      }
      
      console.log('ページの翻訳が完了しました');
    } catch (e) {
      console.error('ページ翻訳中の重大なエラー:', e);
    }
  };
  
  // 言語切り替えハンドラの設定
  document.addEventListener('DOMContentLoaded', function() {
    try {
      // 英語切り替えボタン
      document.querySelectorAll('a[data-lang="en"], button[data-lang="en"], .dropdown-item[data-lang="en"]').forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          window.safeTranslatePage('en');
        });
      });
      
      // 日本語切り替えボタン
      document.querySelectorAll('a[data-lang="ja"], button[data-lang="ja"], .dropdown-item[data-lang="ja"]').forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          window.safeTranslatePage('ja');
        });
      });
      
      // 初期言語適用
      const savedLanguage = window.getCurrentLanguage();
      if (savedLanguage === 'en') {
        window.safeTranslatePage('en');
      }
      
      console.log('言語切り替えハンドラの設定が完了しました');
    } catch (e) {
      console.error('言語切り替えハンドラ設定エラー:', e);
    }
  });
  
  // 既存の翻訳システムのバックアップ
  if (typeof window.originalTranslateText !== 'function' && typeof window.translateText === 'function') {
    window.originalTranslateText = window.translateText;
  }
  
  console.log("安全な翻訳システムの初期化が完了しました");
})();