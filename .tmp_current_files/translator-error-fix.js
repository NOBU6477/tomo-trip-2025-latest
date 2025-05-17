/**
 * 翻訳エラー修正スクリプト - 強化版
 * "Unexpected token ':'" と "Cannot read properties of null" エラーを解決し
 * "translator.translate is not a function" エラーを防止します
 */

(function() {
  try {
    // グローバルフラグを確認してスクリプトの重複実行を防止
    if (window.translatorErrorFixLoaded) {
      return;
    }
    
    // グローバルフラグを設定
    window.translatorErrorFixLoaded = true;
    
    console.log('翻訳エラー修正スクリプトを読み込みました');
    
    // translationDataのグローバル参照を確保
    if (typeof window.translationData !== 'object' || window.translationData === null) {
      // このタイミングでwindow.translationDataがまだ存在しない場合は空オブジェクトを割り当て
      window.translationData = window.translationData || {};
    }
    
    // translatorオブジェクトの参照を確保（翻訳関数呼び出しのための安全策）
    if (!window.translator) {
      window.translator = createSafeTranslator();
    } else {
      ensureTranslatorMethods(window.translator);
    }
    
    // 翻訳関数のマップが安全に動作するよう保証
    setupSafeTranslateFunctions();
    
    console.log('翻訳エラー修正スクリプトのセットアップが完了しました');
  } catch (e) {
    console.error('翻訳エラー修正スクリプトの初期化エラー:', e);
  }
  
  /**
   * 安全なtranslatorオブジェクトを作成
   */
  function createSafeTranslator() {
    return {
      querySelector: function() {
        return null;
      },
      translate: function(text) {
        // 現在の言語を取得
        const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
        if (currentLang === 'ja') return text;
        
        try {
          // translationDataから対応するテキストを探す
          const translationData = window.translationData || {};
          
          // 各カテゴリーを検索
          if (translationData[currentLang]) {
            for (const category in translationData[currentLang]) {
              if (translationData[currentLang][category] && 
                  translationData[currentLang][category][text]) {
                return translationData[currentLang][category][text];
              }
            }
          }
          
          return text;
        } catch (e) {
          return text;
        }
      },
      getTranslation: function(category, key) {
        return key;
      }
    };
  }
  
  /**
   * translatorオブジェクトに必要なメソッドが存在するか確認し、なければ追加
   */
  function ensureTranslatorMethods(translator) {
    // オブジェクトでなければ作成し直す
    if (typeof translator !== 'object' || translator === null) {
      window.translator = createSafeTranslator();
      return;
    }
    
    // 各メソッドを確認
    if (typeof translator.translate !== 'function') {
      translator.translate = function(text) {
        return text;
      };
    }
    
    if (typeof translator.querySelector !== 'function') {
      translator.querySelector = function() {
        return null;
      };
    }
    
    if (typeof translator.getTranslation !== 'function') {
      translator.getTranslation = function(category, key) {
        return key;
      };
    }
  }
  
  /**
   * 翻訳に関連する関数がすべて安全に動作するようセットアップ
   */
  function setupSafeTranslateFunctions() {
    // getCurrentLanguage関数の安全な確保
    if (typeof window.getCurrentLanguage !== 'function') {
      window.getCurrentLanguage = function() {
        return localStorage.getItem('selectedLanguage') || 'ja';
      };
    }
    
    // translateText関数の安全な確保
    if (typeof window.translateText !== 'function') {
      window.translateText = function(lang, text) {
        if (!text || typeof text !== 'string') return text || '';
        if (lang === 'ja') return text;
        
        try {
          if (window.translator && typeof window.translator.translate === 'function') {
            return window.translator.translate(text);
          }
          return text;
        } catch (e) {
          return text;
        }
      };
    } else {
      // 既存のtranslateText関数をラップして安全に
      const originalTranslateText = window.translateText;
      window.translateText = function(lang, text) {
        try {
          if (!text || typeof text !== 'string') return text || '';
          if (lang === 'ja') return text;
          return originalTranslateText(lang, text) || text;
        } catch (e) {
          return text || '';
        }
      };
    }
  }
})();