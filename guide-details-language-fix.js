/**
 * ガイド詳細ページ専用の言語切り替え機能強化
 * ガイド詳細ページ内の特殊要素に対する翻訳処理を追加
 */

document.addEventListener('DOMContentLoaded', function() {
  // 現在のページがガイド詳細ページか確認
  if (window.location.pathname.includes('guide-details')) {
    console.log('ガイド詳細ページ用言語切り替え拡張を初期化');
    
    // 言語切り替えイベントを監視
    window.addEventListener('languageChanged', function(e) {
      enhanceGuideDetailsTranslation(e.detail.language);
    });
    
    // 初期ロード時の言語設定に基づいて翻訳実行
    const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
    if (currentLang === 'en') {
      enhanceGuideDetailsTranslation('en');
    }
  }
  
  /**
   * ガイド詳細ページ専用の翻訳処理を強化
   * @param {string} lang - 言語コード（'en'または'ja'）
   */
  function enhanceGuideDetailsTranslation(lang) {
    if (lang === 'ja') return; // 日本語の場合は処理不要
    
    console.log('ガイド詳細ページの翻訳処理開始:', lang);
    
    try {
      // セッション料金セクション
      translateSessionFee(lang);
      
      // ツアープランセクション
      translateSampleTourPlans(lang);
      
      // 「予約する」ボタン
      translateBookButton(lang);
      
      // 「メッセージを送る」ボタン
      translateMessageButton(lang);
      
      // その他のガイド詳細特有の要素
      translateGuideBadges(lang);
      translateReviews(lang);
      
    } catch (error) {
      console.error('ガイド詳細ページの翻訳処理中にエラーが発生しました:', error);
    }
  }
  
  /**
   * セッション料金セクションの翻訳
   */
  function translateSessionFee(lang) {
    const sessionFeeTitle = document.querySelector('.session-fee-title');
    if (sessionFeeTitle) {
      sessionFeeTitle.textContent = getTranslation(lang, 'guide', 'セッション料金');
    }
    
    const sessionDescription = document.querySelector('.session-description');
    if (sessionDescription) {
      sessionDescription.textContent = getTranslation(lang, 'guide', '1セッション = 2時間の基本ガイドサービス');
    }
  }
  
  /**
   * サンプルツアープランの翻訳
   */
  function translateSampleTourPlans(lang) {
    const tourPlansTitle = document.querySelector('h2:contains("ツアープラン例")');
    if (tourPlansTitle) {
      tourPlansTitle.textContent = getTranslation(lang, 'guide', 'ツアープラン例');
    }
    
    // ツアープランのタイトルと説明
    document.querySelectorAll('.tour-title, .tour-description').forEach(element => {
      if (element.childElementCount === 0) {
        const original = element.textContent.trim();
        if (original) {
          element.textContent = translateText(lang, original);
        }
      }
    });
  }
  
  /**
   * 予約ボタンの翻訳
   */
  function translateBookButton(lang) {
    const bookButton = document.querySelector('.btn-primary:contains("予約")');
    if (bookButton) {
      bookButton.textContent = getTranslation(lang, 'buttons', '予約する');
    }
  }
  
  /**
   * メッセージボタンの翻訳
   */
  function translateMessageButton(lang) {
    const messageButton = document.querySelector('.btn-outline-primary:contains("メッセージ")');
    if (messageButton) {
      messageButton.textContent = getTranslation(lang, 'buttons', 'メッセージを送る');
    }
  }
  
  /**
   * ガイドのバッジ（認証済み、返信時間など）の翻訳
   */
  function translateGuideBadges(lang) {
    const verifiedBadge = document.querySelector('.badge-verified');
    if (verifiedBadge) {
      verifiedBadge.textContent = getTranslation(lang, 'guide', '認証済みガイド');
    }
    
    const replyTimeBadge = document.querySelector('.reply-time');
    if (replyTimeBadge) {
      replyTimeBadge.textContent = getTranslation(lang, 'guide', '通常24時間以内に返信');
    }
  }
  
  /**
   * レビューセクションの翻訳
   */
  function translateReviews(lang) {
    const reviewsTitle = document.querySelector('h2:contains("レビュー")');
    if (reviewsTitle) {
      reviewsTitle.textContent = getTranslation(lang, 'sections', 'レビュー');
    }
    
    const reviewCount = document.querySelector('.review-count');
    if (reviewCount) {
      const text = reviewCount.textContent;
      const match = text.match(/(\d+)件のレビュー/);
      if (match) {
        reviewCount.textContent = match[1] + ' ' + getTranslation(lang, 'guide', '件のレビュー');
      }
    }
  }
  
  /**
   * jQuery風のcontainsセレクタの拡張
   */
  function setupContainsSelector() {
    // Document.querySelectorAllで:containsを使えるようにする拡張
    document.querySelectorAll = function(selector) {
      if (selector.includes(':contains(')) {
        try {
          // :contains()を抽出
          const matches = selector.match(/(.*):contains\("(.*)"\)(.*)/);
          if (matches && matches.length >= 4) {
            const [_, beforeContains, containsText, afterContains] = matches;
            
            // 基本セレクタで要素を取得
            let baseSelector = beforeContains + afterContains;
            if (baseSelector === '') baseSelector = '*';
            
            const elements = Array.from(document.querySelectorAll(baseSelector));
            
            // テキスト内容でフィルタリング
            return elements.filter(el => el.textContent.includes(containsText));
          }
        } catch (e) {
          console.error('セレクタ解析エラー:', e);
        }
      }
      
      // 通常のクエリセレクタを使用
      return document.querySelectorAll.call(document, selector);
    };
  }
  
  // 拡張セレクタを初期化
  setupContainsSelector();
  
  /**
   * 翻訳ヘルパー関数（グローバルな関数がない場合用）
   */
  function getTranslation(lang, category, key) {
    if (window.translationData && window.getTranslation) {
      return window.getTranslation(lang, category, key);
    }
    
    // フォールバック - 最低限の基本翻訳
    const basicTranslations = {
      'en': {
        'guide': {
          'セッション料金': 'Session Fee',
          '1セッション = 2時間の基本ガイドサービス': '1 Session = 2 hours of basic guide service',
          '認証済みガイド': 'Verified Guide',
          '通常24時間以内に返信': 'Usually replies within 24 hours',
          '件のレビュー': 'reviews'
        },
        'buttons': {
          '予約する': 'Book Now',
          'メッセージを送る': 'Send Message'
        },
        'sections': {
          'ツアープラン例': 'Sample Tour Plans',
          'レビュー': 'Reviews'
        }
      }
    };
    
    try {
      return basicTranslations[lang][category][key] || key;
    } catch (e) {
      return key;
    }
  }
  
  /**
   * テキスト翻訳ヘルパー（グローバルな関数がない場合用）
   */
  function translateText(lang, text) {
    if (window.translateText) {
      return window.translateText(lang, text);
    }
    return text;
  }
});