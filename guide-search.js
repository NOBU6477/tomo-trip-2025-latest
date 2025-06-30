/**
 * ガイド検索機能
 * 地域、言語、料金、キーワードによるフィルタリング機能を提供
 */
document.addEventListener('DOMContentLoaded', function() {
  // 要素の取得
  const guideItems = document.querySelectorAll('.guide-item');
  const loadMoreBtn = document.getElementById('load-more-guides');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const resetFiltersBtn = document.getElementById('reset-filters');
  
  const locationFilter = document.getElementById('location-filter');
  const languageFilter = document.getElementById('language-filter');
  const feeFilter = document.getElementById('fee-filter');
  const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
  const keywordCustomInput = document.getElementById('keyword-filter-custom');
  
  // 初期状態設定 - すべてのガイドを表示
  const initialVisibleCount = 999;
  let currentlyVisible = initialVisibleCount;
  
  // 初期化：全てのガイドカードを表示状態にする
  function initializeGuideDisplay() {
    guideItems.forEach(item => {
      item.classList.remove('hidden-guide');
      item.classList.remove('filtered-out');
    });
    currentlyVisible = guideItems.length;
    console.log(`初期化完了: ${guideItems.length}件のガイドカードを表示中`);
    updateLoadMoreButton();
  }
  
  // ページ読み込み時に初期化実行
  initializeGuideDisplay();
  
  // 「もっと見る」ボタンの表示・非表示を切り替える
  function updateLoadMoreButton() {
    const visibleGuides = document.querySelectorAll('.guide-item:not(.hidden):not(.filtered-out)');
    if (visibleGuides.length <= currentlyVisible) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-block';
    }
  }
  
  // 「もっと見る」ボタンのクリックイベント
  loadMoreBtn.addEventListener('click', function() {
    const hiddenGuides = document.querySelectorAll('.guide-item.hidden-guide:not(.filtered-out)');
    
    // 非表示のガイド要素を最大3つまで表示
    for (let i = 0; i < Math.min(3, hiddenGuides.length); i++) {
      hiddenGuides[i].classList.remove('hidden-guide');
      currentlyVisible++;
    }
    
    // もう表示するガイドがない場合はボタンを非表示
    if (document.querySelectorAll('.guide-item.hidden-guide:not(.filtered-out)').length === 0) {
      loadMoreBtn.style.display = 'none';
    }
  });
  
  // フィルター適用
  applyFiltersBtn.addEventListener('click', function() {
    filterGuides();
  });
  
  // フィルターリセット
  resetFiltersBtn.addEventListener('click', function() {
    locationFilter.value = '';
    languageFilter.value = '';
    feeFilter.value = '';
    keywordCustomInput.value = '';
    
    // チェックボックスをリセット
    keywordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // フィルター解除して全て表示
    resetFilters();
  });
  
  // フィルターのリセット
  function resetFilters() {
    guideItems.forEach(item => {
      item.classList.remove('filtered-out');
      item.classList.remove('hidden-guide');
    });
    
    currentlyVisible = guideItems.length;
    updateLoadMoreButton();
  }
  
  // ガイドのフィルタリング
  function filterGuides() {
    const location = locationFilter.value.toLowerCase();
    const language = languageFilter.value.toLowerCase();
    const fee = parseInt(feeFilter.value) || 0;
    
    // キーワードの取得（チェックボックスと入力フィールドの両方）
    const selectedKeywords = Array.from(keywordCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.toLowerCase());
    
    // カスタムキーワードをカンマで分割して配列に追加
    const customKeywords = keywordCustomInput.value
      .split(',')
      .map(keyword => keyword.trim().toLowerCase())
      .filter(keyword => keyword !== '');
    
    // 全てのキーワードを結合
    const allKeywords = [...selectedKeywords, ...customKeywords];
    
    // 各ガイドを評価
    let visibleCount = 0;
    
    guideItems.forEach(item => {
      // ガイド情報の取得
      const guideCard = item.querySelector('.card-body');
      const guideLocation = item.querySelector('.card-text').textContent.toLowerCase();
      const guideLanguages = item.querySelector('.text-muted').textContent.toLowerCase();
      const guideFeeText = item.querySelector('.badge').textContent;
      const guideFee = parseInt(guideFeeText.replace(/[^0-9]/g, '')) || 0;
      
      // フィルター条件に一致するか確認
      let matchesLocation = !location || guideLocation.includes(location);
      let matchesLanguage = !language || guideLanguages.includes(language);
      let matchesFee = !fee || guideFee <= fee;
      
      // キーワードに一致するか確認
      let matchesKeywords = allKeywords.length === 0 || 
        allKeywords.some(keyword => guideLocation.includes(keyword));
      
      // 全ての条件に一致するガイドを表示
      if (matchesLocation && matchesLanguage && matchesFee && matchesKeywords) {
        item.classList.remove('filtered-out');
        
        // 表示件数を増やす
        if (visibleCount < initialVisibleCount) {
          item.classList.remove('hidden-guide');
        } else {
          item.classList.add('hidden-guide');
        }
        
        visibleCount++;
      } else {
        item.classList.add('filtered-out');
      }
    });
    
    // 表示件数を更新
    currentlyVisible = Math.min(initialVisibleCount, visibleCount);
    
    // 「もっと見る」ボタンの表示状態を更新
    updateLoadMoreButton();
    
    // 検索結果がない場合のメッセージ
    const guidesContainer = document.querySelector('.guides-container');
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (visibleCount === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'col-12 text-center my-5';
        noResultsMsg.innerHTML = '<p class="lead">条件に一致するガイドが見つかりませんでした。<br>別の検索条件をお試しください。</p>';
        guidesContainer.appendChild(noResultsMsg);
      }
      loadMoreBtn.style.display = 'none';
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }
  
  // ページ読み込み時に「もっと見る」ボタンの表示状態を設定
  updateLoadMoreButton();
});