/**
 * 修正済み検索システム
 * 既存のHTMLガイドカードと検索機能を統合
 */

(function() {
  'use strict';
  
  console.log('🔍 修正済み検索システム開始');
  
  // 実際のガイドデータ（HTMLから抽出）
  const guideData = [
    {
      id: 1,
      name: '桜',
      location: '東京都 新宿区',
      languages: ['日本語', '英語'],
      specialties: ['ナイトツアー', '写真スポット'],
      fee: 8000,
      description: '東京のナイトライフを知り尽くしたガイド。隠れた名店から最新スポットまでご案内します。',
      rating: 4.5,
      element: null
    },
    {
      id: 2,
      name: '海',
      location: '大阪府 大阪市',
      languages: ['日本語', '英語', '中国語'],
      specialties: ['グルメ', '料理'],
      fee: 6000,
      description: '大阪の食文化に詳しいガイド。本場のたこ焼きから高級料理まで、美味しい大阪をお届けします。',
      rating: 4.2,
      element: null
    },
    {
      id: 3,
      name: '山',
      location: '京都府 京都市',
      languages: ['日本語', '英語'],
      specialties: ['アクティビティ', '写真スポット'],
      fee: 7500,
      description: '京都の伝統文化と自然を愛するガイド。季節ごとの美しい風景をご案内いたします。',
      rating: 3.5,
      element: null
    },
    {
      id: 4,
      name: '雪',
      location: '北海道 札幌市',
      languages: ['日本語', '英語', 'ロシア語'],
      specialties: ['自然体験', 'アクティビティ'],
      fee: 8000,
      description: '北海道・札幌のローカルガイド。四季折々の自然と新鮮な海の幸、絶景スポットをご案内します。',
      rating: 4.0,
      element: null
    },
    {
      id: 5,
      name: '海',
      location: '沖縄県 那覇市',
      languages: ['日本語', '英語'],
      specialties: ['マリンスポーツ', '自然体験'],
      fee: 12000,
      description: '沖縄在住15年のダイビングインストラクター。美しい海と独自の文化が残る島々を案内します。',
      rating: 4.5,
      element: null
    },
    {
      id: 6,
      name: '平和',
      location: '広島県 広島市',
      languages: ['日本語', '英語', 'フランス語'],
      specialties: ['歴史ツアー', '文化体験'],
      fee: 6500,
      description: '広島の歴史と文化に精通したガイド。平和記念公園から宮島まで、心に残る旅をご提供します。',
      rating: 4.0,
      element: null
    }
  ];
  
  let currentlyDisplayedGuides = [];
  
  // 初期化
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupSearchSystem);
    } else {
      setupSearchSystem();
    }
  }
  
  function setupSearchSystem() {
    console.log('🔧 検索システム初期化');
    
    // 既存のガイドカード要素を取得
    collectExistingGuideCards();
    
    // フィルターボタンのイベント設定
    const toggleButton = document.getElementById('toggle-filter-button');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleFilterCard);
    }
    
    // 初期表示更新
    updateGuideCount();
    
    console.log('✅ 検索システム初期化完了');
  }
  
  function collectExistingGuideCards() {
    const guideCards = document.querySelectorAll('.guide-card');
    guideCards.forEach((card, index) => {
      if (index < guideData.length) {
        guideData[index].element = card.closest('.col-md-4');
        currentlyDisplayedGuides.push(guideData[index]);
      }
    });
    console.log(`📋 ${currentlyDisplayedGuides.length}個の既存ガイドカードを収集`);
  }
  
  function toggleFilterCard() {
    const filterCard = document.getElementById('filter-card');
    const toggleButton = document.getElementById('toggle-filter-button');
    
    if (filterCard.classList.contains('d-none')) {
      filterCard.classList.remove('d-none');
      toggleButton.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
    } else {
      filterCard.classList.add('d-none');
      toggleButton.innerHTML = '<i class="bi bi-funnel"></i> フィルターを開く';
    }
  }
  
  function searchGuides() {
    console.log('🔍 検索実行');
    
    // フィルター値を取得
    const location = document.getElementById('location-filter')?.value || '';
    const language = document.getElementById('language-filter')?.value || '';
    const priceRange = document.getElementById('price-filter')?.value || '';
    
    // チェックボックスの値を取得
    const checkedKeywords = [];
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox:checked');
    keywordCheckboxes.forEach(cb => checkedKeywords.push(cb.value));
    
    // カスタムキーワードを取得
    const customKeywords = document.getElementById('custom-keywords')?.value || '';
    const customKeywordList = customKeywords.split(',').map(k => k.trim()).filter(k => k);
    
    // 全キーワードを結合
    const allKeywords = [...checkedKeywords, ...customKeywordList];
    
    console.log('検索条件:', { location, language, priceRange, allKeywords });
    
    // フィルタリング実行
    let filteredGuides = [...guideData];
    
    // 地域フィルター
    if (location) {
      filteredGuides = filteredGuides.filter(guide => 
        guide.location.includes(location)
      );
    }
    
    // 言語フィルター
    if (language) {
      filteredGuides = filteredGuides.filter(guide => 
        guide.languages.includes(language)
      );
    }
    
    // 料金フィルター
    if (priceRange) {
      filteredGuides = filteredGuides.filter(guide => {
        const fee = guide.fee;
        switch (priceRange) {
          case '6000円以下':
            return fee <= 6000;
          case '6000-10000円':
            return fee > 6000 && fee <= 10000;
          case '10000円以上':
            return fee > 10000;
          default:
            return true;
        }
      });
    }
    
    // キーワードフィルター
    if (allKeywords.length > 0) {
      filteredGuides = filteredGuides.filter(guide => {
        return allKeywords.some(keyword => 
          guide.specialties.some(specialty => specialty.includes(keyword)) ||
          guide.description.includes(keyword) ||
          guide.name.includes(keyword)
        );
      });
    }
    
    // 結果を表示
    displayFilteredGuides(filteredGuides);
    console.log(`検索結果: ${filteredGuides.length}件`);
  }
  
  function displayFilteredGuides(filteredGuides) {
    // 全てのガイドカードを非表示
    guideData.forEach(guide => {
      if (guide.element) {
        guide.element.style.display = 'none';
      }
    });
    
    // フィルター結果のガイドカードを表示
    filteredGuides.forEach(guide => {
      if (guide.element) {
        guide.element.style.display = 'block';
      }
    });
    
    // カウンターを更新
    currentlyDisplayedGuides = filteredGuides;
    updateGuideCount();
    
    // "結果なし" メッセージの表示制御
    showNoResultsMessage(filteredGuides.length === 0);
  }
  
  function resetFilters() {
    console.log('🔄 フィルターリセット');
    
    // フォームをリセット
    const form = document.getElementById('guide-filter-form');
    if (form) {
      form.reset();
    }
    
    // チェックボックスをリセット
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
    keywordCheckboxes.forEach(cb => cb.checked = false);
    
    // 全ガイドを表示
    displayFilteredGuides(guideData);
  }
  
  function updateGuideCount() {
    const counter = document.getElementById('guides-count');
    if (counter) {
      counter.textContent = `${currentlyDisplayedGuides.length}人のガイドが見つかりました`;
    }
  }
  
  function showNoResultsMessage(show) {
    // 結果なしメッセージを動的に作成
    let noResultsDiv = document.getElementById('no-results-message');
    
    if (show && !noResultsDiv) {
      noResultsDiv = document.createElement('div');
      noResultsDiv.id = 'no-results-message';
      noResultsDiv.className = 'alert alert-info text-center my-4';
      noResultsDiv.innerHTML = `
        <h5>検索結果がありません</h5>
        <p>検索条件を変更してお試しください</p>
      `;
      
      const guidesContainer = document.querySelector('#guides .row');
      if (guidesContainer) {
        guidesContainer.appendChild(noResultsDiv);
      }
    } else if (!show && noResultsDiv) {
      noResultsDiv.remove();
    }
  }
  
  // グローバル関数として公開
  window.searchGuides = searchGuides;
  window.resetFilters = resetFilters;
  
  // 初期化実行
  initialize();
  
})();