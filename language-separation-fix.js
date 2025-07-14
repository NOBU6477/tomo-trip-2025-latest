/**
 * 言語分離修正システム
 * 日本語と英語サイトの言語混合を完全に防ぐ
 */

(function() {
  'use strict';
  
  console.log('🌐 言語分離修正開始');
  
  const isEnglishSite = window.location.href.includes('index-en.html');
  
  function enforceLanguageSeparation() {
    try {
      if (isEnglishSite) {
        // 英語サイト：日本語テキストを除去・修正
        enforceEnglishOnly();
      } else {
        // 日本語サイト：英語テキストを除去・修正
        enforceJapaneseOnly();
      }
    } catch (error) {
      console.error('言語分離エラー:', error);
    }
  }
  
  function enforceEnglishOnly() {
    // 日本語テキストパターンを英語に修正
    const textMappings = {
      '人のガイドが見つかりました': 'guides found',
      'ガイドを絞り込む': 'Filter Guides',
      'フィルターを閉じる': 'Close Filter',
      'リセット': 'Reset',
      '検索': 'Search',
      'もっと見る': 'Load More',
      '詳細を見る': 'See Details'
    };
    
    document.querySelectorAll('*').forEach(element => {
      if (element.children.length === 0 && element.textContent) {
        let text = element.textContent;
        
        // 数字 + "人のガイドが見つかりました" パターン
        const guideCountMatch = text.match(/(\d+)人のガイドが見つかりました/);
        if (guideCountMatch) {
          element.textContent = `Found ${guideCountMatch[1]} guides`;
          return;
        }
        
        // その他の日本語テキスト
        Object.keys(textMappings).forEach(japanese => {
          if (text.includes(japanese)) {
            element.textContent = text.replace(japanese, textMappings[japanese]);
          }
        });
      }
    });
  }
  
  function enforceJapaneseOnly() {
    // 英語テキストパターンを日本語に修正
    const textMappings = {
      'Found': '見つかりました',
      'guides': 'ガイド',
      'Filter Guides': 'ガイドを絞り込む',
      'Close Filter': 'フィルターを閉じる',
      'Reset': 'リセット',
      'Search': '検索',
      'Load More': 'もっと見る',
      'See Details': '詳細を見る'
    };
    
    document.querySelectorAll('*').forEach(element => {
      if (element.children.length === 0 && element.textContent) {
        let text = element.textContent;
        
        // "Found X guides" パターン
        const foundGuidesMatch = text.match(/Found (\d+) guides/);
        if (foundGuidesMatch) {
          element.textContent = `${foundGuidesMatch[1]}人のガイドが見つかりました`;
          return;
        }
        
        // その他の英語テキスト
        Object.keys(textMappings).forEach(english => {
          if (text.includes(english)) {
            element.textContent = text.replace(new RegExp(english, 'g'), textMappings[english]);
          }
        });
      }
    });
  }
  
  function preventLanguageMixing() {
    // MutationObserver で動的な言語混合を監視
    const observer = new MutationObserver((mutations) => {
      let needsLanguageCheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          needsLanguageCheck = true;
        }
      });
      
      if (needsLanguageCheck) {
        setTimeout(enforceLanguageSeparation, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    console.log('🔍 言語混合監視開始');
  }
  
  function initialize() {
    // 初回言語分離実行
    enforceLanguageSeparation();
    
    // 継続的な監視
    preventLanguageMixing();
    
    // 定期的なチェック（5秒間隔）
    setInterval(enforceLanguageSeparation, 5000);
    
    console.log(`✅ 言語分離修正完了 (${isEnglishSite ? '英語' : '日本語'}サイト)`);
  }
  
  // DOMContentLoaded後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // ページ読み込み完了後にも実行
  window.addEventListener('load', () => {
    setTimeout(initialize, 500);
  });
  
})();