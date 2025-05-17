/**
 * シンプルな翻訳機能修正
 * このファイルはサイト表示時に自動的に翻訳機能を修正します
 */

(function() {
  console.log("翻訳機能の修正を適用します...");

  // ページが完全に読み込まれたら実行
  document.addEventListener('DOMContentLoaded', function() {
    // 英語ボタンへのクリックイベントを設定
    setupTranslationButtons();
    // 言語が英語に設定されていれば翻訳を実行
    applyInitialTranslation();
  });

  /**
   * 言語切り替えボタンのセットアップ
   */
  function setupTranslationButtons() {
    try {
      // 英語切り替えボタン
      document.querySelectorAll('a[data-lang="en"], button[data-lang="en"], .dropdown-item[data-lang="en"]').forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          translatePageDirectly('en');
          console.log("英語への翻訳ボタンがクリックされました");
        });
      });
      
      // 日本語切り替えボタン
      document.querySelectorAll('a[data-lang="ja"], button[data-lang="ja"], .dropdown-item[data-lang="ja"]').forEach(function(button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          localStorage.setItem('selectedLanguage', 'ja');
          location.reload();
          console.log("日本語への翻訳ボタンがクリックされました");
        });
      });

      console.log("翻訳ボタンの設定が完了しました");
    } catch (error) {
      console.error("翻訳ボタン設定エラー:", error);
    }
  }

  /**
   * 保存された言語設定に基づいて初期翻訳を適用
   */
  function applyInitialTranslation() {
    try {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage === 'en') {
        console.log("保存された言語設定（英語）を適用します");
        translatePageDirectly('en');
      }
    } catch (error) {
      console.error("初期翻訳適用エラー:", error);
    }
  }

  /**
   * 翻訳オブジェクトから翻訳するシンプルな関数
   */
  function translateText(lang, text) {
    if (!text || text.trim() === "" || lang === 'ja') return text;
    
    try {
      // グローバル翻訳オブジェクトをチェック
      if (!window.translationData || !window.translationData[lang]) {
        console.warn("翻訳データが見つかりません");
        return text;
      }
      
      // すべてのカテゴリを検索
      for (const category in window.translationData[lang]) {
        if (window.translationData[lang][category] && 
            window.translationData[lang][category][text]) {
          return window.translationData[lang][category][text];
        }
      }
      
      return text;
    } catch (error) {
      console.error("テキスト翻訳エラー:", error);
      return text;
    }
  }

  /**
   * ページ全体を直接翻訳する（他の翻訳システムに依存しない）
   */
  function translatePageDirectly(lang) {
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
      
      // その他の一般的なテキスト要素の翻訳
      document.querySelectorAll('.text-content, span, div.text, .list-item').forEach(function(element) {
        if (element.childElementCount === 0) {
          const original = element.textContent.trim();
          if (original && original.length > 1) { // 空白や単一文字は処理しない
            element.textContent = translateText(lang, original);
          }
        }
      });

      // ガイド詳細ページの特別処理
      if (window.location.pathname.includes('guide-details')) {
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
      }
      
      console.log('ページの翻訳が完了しました');
    } catch (e) {
      console.error('ページ翻訳中の重大なエラー:', e);
    }
  }

  // グローバルスコープに翻訳関数を公開
  window.translatePageDirectly = translatePageDirectly;
  
  console.log("翻訳機能の修正適用が完了しました");
})();