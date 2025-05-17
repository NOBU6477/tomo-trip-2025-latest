/**
 * ガイド詳細ページの翻訳機能強化スクリプト
 * ガイド詳細ページの特殊要素に対する翻訳を強化します
 */

document.addEventListener('DOMContentLoaded', function() {
  // 現在のページがガイド詳細ページか確認
  if (window.location.pathname.includes('guide-details')) {
    console.log('ガイド詳細ページの翻訳強化を初期化');
    
    // 言語切り替えイベントをリッスン
    window.addEventListener('languageChanged', function(e) {
      enhanceGuideDetailsTranslation(e.detail.language);
    });
    
    // 初期ロード時にも適用（英語モードの場合）
    const currentLang = localStorage.getItem('selectedLanguage') || 'ja';
    if (currentLang === 'en') {
      enhanceGuideDetailsTranslation('en');
    }
  }
  
  /**
   * ガイド詳細ページの翻訳を強化
   * @param {string} lang - 言語コード（'en'または'ja'）
   */
  function enhanceGuideDetailsTranslation(lang) {
    if (lang === 'ja') return; // 日本語の場合は処理不要
    
    console.log('ガイド詳細ページの翻訳強化を実行:', lang);
    
    // タブナビゲーションの翻訳
    translateTabs(lang);
    
    // セクションタイトルの翻訳
    translateSectionTitles(lang);
    
    // 自己紹介文の翻訳
    translateBio(lang);
    
    // 得意分野バッジの翻訳
    translateSpecialtyBadges(lang);
    
    // 予約ボタン・メッセージボタンの翻訳
    translateActionButtons(lang);
    
    // ツアープラン例の翻訳
    translateTourPlans(lang);
    
    // レビューセクションの翻訳
    translateReviews(lang);
  }
  
  /**
   * タブナビゲーションの翻訳
   */
  function translateTabs(lang) {
    const profileTab = document.getElementById('profile-tab');
    if (profileTab) {
      profileTab.textContent = getTranslatedText(lang, 'sections', 'プロフィール');
    }
    
    const galleryTab = document.getElementById('gallery-tab');
    if (galleryTab) {
      galleryTab.textContent = getTranslatedText(lang, 'sections', '写真ギャラリー');
    }
    
    const reviewsTab = document.getElementById('reviews-tab');
    if (reviewsTab) {
      reviewsTab.textContent = getTranslatedText(lang, 'sections', 'レビュー');
    }
  }
  
  /**
   * セクションタイトルの翻訳
   */
  function translateSectionTitles(lang) {
    // h3タグを検索
    document.querySelectorAll('#profile h3').forEach(function(heading) {
      const original = heading.textContent.trim();
      heading.textContent = getTranslatedText(lang, 'guide', original);
    });
  }
  
  /**
   * 自己紹介文の翻訳
   */
  function translateBio(lang) {
    const bioElement = document.getElementById('guide-bio');
    if (bioElement) {
      const original = bioElement.textContent.trim();
      
      // 部分的な置換ではなく全体を翻訳
      if (window.translateText) {
        bioElement.textContent = window.translateText(lang, original);
      }
    }
  }
  
  /**
   * 得意分野バッジの翻訳
   */
  function translateSpecialtyBadges(lang) {
    document.querySelectorAll('.guide-badge').forEach(function(badge) {
      const original = badge.textContent.trim();
      badge.textContent = getTranslatedText(lang, 'specialties', original);
    });
  }
  
  /**
   * 予約ボタン・メッセージボタンの翻訳
   */
  function translateActionButtons(lang) {
    // 予約ボタン
    const bookButtons = document.querySelectorAll('.btn-primary:not(.dropdown-toggle)');
    bookButtons.forEach(button => {
      if (button.textContent.includes('予約')) {
        button.textContent = getTranslatedText(lang, 'buttons', '予約する');
      }
    });
    
    // メッセージボタン
    const messageButtons = document.querySelectorAll('.btn-outline-primary');
    messageButtons.forEach(button => {
      if (button.textContent.includes('メッセージ')) {
        button.textContent = getTranslatedText(lang, 'buttons', 'メッセージを送る');
      }
    });
  }
  
  /**
   * ツアープラン例の翻訳
   */
  function translateTourPlans(lang) {
    // ツアープランセクションのタイトル
    const tourPlansTitle = document.querySelector('h3:contains("ツアープラン例")');
    if (tourPlansTitle) {
      tourPlansTitle.textContent = getTranslatedText(lang, 'guide', 'ツアープラン例');
    }
    
    // 個別のツアープラン
    const tourPlans = document.querySelectorAll('#tour-plans-container .card');
    tourPlans.forEach(function(plan) {
      // プラン名
      const planTitle = plan.querySelector('.card-title');
      if (planTitle) {
        planTitle.textContent = getTranslatedText(lang, null, planTitle.textContent.trim());
      }
      
      // プラン詳細
      const planDesc = plan.querySelector('.card-text');
      if (planDesc) {
        planDesc.textContent = getTranslatedText(lang, null, planDesc.textContent.trim());
      }
      
      // 所要時間
      const duration = plan.querySelector('.tour-duration');
      if (duration) {
        const text = duration.textContent;
        const match = text.match(/所要時間: (.*)/);
        if (match) {
          duration.textContent = `${getTranslatedText(lang, 'guide', '所要時間')}: ${match[1]}`;
        }
      }
      
      // 料金
      const price = plan.querySelector('.tour-price');
      if (price) {
        const text = price.textContent;
        const match = text.match(/料金: (.*)/);
        if (match) {
          price.textContent = `${getTranslatedText(lang, 'guide', '料金:')}: ${match[1]}`;
        }
      }
    });
  }
  
  /**
   * レビューセクションの翻訳
   */
  function translateReviews(lang) {
    // レビュータブ内の見出し
    const reviewsTitle = document.querySelector('#reviews h3');
    if (reviewsTitle) {
      reviewsTitle.textContent = getTranslatedText(lang, 'sections', 'レビュー');
    }
    
    // レビューの内容
    document.querySelectorAll('.review-card .review-text').forEach(function(reviewText) {
      reviewText.textContent = getTranslatedText(lang, null, reviewText.textContent.trim());
    });
    
    // レビュー日付
    document.querySelectorAll('.review-date').forEach(function(dateText) {
      const text = dateText.textContent;
      if (text.includes('年') && text.includes('月')) {
        // 日付形式を英語式に変換（2023年1月 → January 2023）
        const match = text.match(/(\d+)年(\d+)月/);
        if (match) {
          const year = match[1];
          const month = match[2];
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          dateText.textContent = `${monthNames[parseInt(month) - 1]} ${year}`;
        }
      }
    });
  }
  
  /**
   * 翻訳テキストを取得する汎用関数
   * @param {string} lang - 言語コード（'en'または'ja'）
   * @param {string} category - カテゴリ（'guide', 'buttons'など）
   * @param {string} text - 翻訳するテキスト
   * @returns {string} - 翻訳されたテキスト
   */
  function getTranslatedText(lang, category, text) {
    if (lang === 'ja') return text;
    
    // カテゴリが指定されている場合
    if (category && window.getTranslation) {
      const translated = window.getTranslation(lang, category, text);
      if (translated !== text) return translated;
    }
    
    // カテゴリ未指定またはgetTranslationでマッチしなかった場合
    if (window.translateText) {
      return window.translateText(lang, text);
    }
    
    return text;
  }
});

// :contains セレクタの拡張（jQueryの機能を簡易実装）
Element.prototype.querySelectorAll = function(selector) {
  if (selector.includes(':contains(')) {
    try {
      // :contains()を抽出
      const matches = selector.match(/(.*):contains\("(.*)"\)(.*)/);
      if (matches && matches.length >= 4) {
        const [_, beforeContains, containsText, afterContains] = matches;
        
        // 基本セレクタで要素を取得
        let baseSelector = beforeContains + afterContains;
        if (baseSelector === '') baseSelector = '*';
        
        const elements = Array.from(this.querySelectorAll(baseSelector));
        
        // テキストコンテンツでフィルタリング
        return elements.filter(el => el.textContent.includes(containsText));
      }
    } catch (e) {
      console.error('セレクタ解析エラー:', e);
    }
  }
  
  // 通常のquerySelectorAll呼び出し
  return Element.prototype.querySelectorAll.call(this, selector);
};

// ドキュメントノードにも適用
Document.prototype.querySelectorAll = function(selector) {
  if (selector.includes(':contains(')) {
    try {
      // :contains()を抽出
      const matches = selector.match(/(.*):contains\("(.*)"\)(.*)/);
      if (matches && matches.length >= 4) {
        const [_, beforeContains, containsText, afterContains] = matches;
        
        // 基本セレクタで要素を取得
        let baseSelector = beforeContains + afterContains;
        if (baseSelector === '') baseSelector = '*';
        
        const elements = Array.from(Document.prototype.querySelectorAll.call(this, baseSelector));
        
        // テキストコンテンツでフィルタリング
        return elements.filter(el => el.textContent.includes(containsText));
      }
    } catch (e) {
      console.error('セレクタ解析エラー:', e);
    }
  }
  
  // 通常のquerySelectorAll呼び出し
  return Document.prototype.querySelectorAll.call(this, selector);
};