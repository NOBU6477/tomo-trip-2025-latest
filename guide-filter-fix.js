/**
 * 地域検索修正スクリプト - 北海道フィルタリング問題の解決
 * 既存の検索機能を置き換えずに並行動作する設計
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド検索修正スクリプトを適用しています');
  
  // 元のフィルター適用ボタンとリセットボタンのイベントをオーバーライド
  const applyFiltersBtn = document.getElementById('apply-filters');
  const resetFiltersBtn = document.getElementById('reset-filters');
  
  if (applyFiltersBtn) {
    // 既存のイベントリスナーを削除
    const newApplyBtn = applyFiltersBtn.cloneNode(true);
    applyFiltersBtn.parentNode.replaceChild(newApplyBtn, applyFiltersBtn);
    
    // 新しいイベントリスナーを追加
    newApplyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('フィルター適用（修正版）');
      enhancedFilterGuides();
    });
  }
  
  if (resetFiltersBtn) {
    // 既存のイベントリスナーを削除
    const newResetBtn = resetFiltersBtn.cloneNode(true);
    resetFiltersBtn.parentNode.replaceChild(newResetBtn, resetFiltersBtn);
    
    // 新しいイベントリスナーを追加
    newResetBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('フィルターリセット（修正版）');
      resetAllFilters();
    });
  }
  
  // フィルターのリセット処理
  function resetAllFilters() {
    // フィルター入力をリセット
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const feeFilter = document.getElementById('fee-filter');
    const keywordCustomInput = document.getElementById('keyword-filter-custom');
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
    
    if (locationFilter) locationFilter.value = '';
    if (languageFilter) languageFilter.value = '';
    if (feeFilter) feeFilter.value = '';
    if (keywordCustomInput) keywordCustomInput.value = '';
    
    // チェックボックスをリセット
    keywordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // すべてのガイドカードを表示状態にリセット
    resetGuideVisibility();
  }
  
  // ガイド表示状態をリセット - 全ガイドを表示
  function resetGuideVisibility() {
    const guideItems = document.querySelectorAll('.guide-item');
    
    guideItems.forEach(item => {
      // すべてのフィルター関連クラスを削除
      item.classList.remove('filtered-out', 'hidden-guide');
      item.style.display = '';
      item.style.opacity = '1';
    });
    
    // 結果カウンターを更新（全ガイド数を表示）
    const totalGuides = guideItems.length;
    updateGuideCounter(totalGuides);
    
    // 「もっと見る」ボタンを非表示
    const loadMoreBtn = document.getElementById('load-more-guides');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
    
    console.log(`リセット完了: ${totalGuides}件のガイドを表示中`);
  }
  
  // ガイドカウンターを更新
  function updateGuideCounter(count) {
    // 検索結果カウンターを更新
    const searchCounter = document.getElementById('search-results-counter');
    if (searchCounter) {
      searchCounter.textContent = `${count}人のガイドが見つかりました`;
      searchCounter.classList.remove('d-none');
    }
    
    // メインカウンター（上部の青いバッジ）を更新
    const counterBadge = document.querySelector('.counter-badge');
    if (counterBadge) {
      counterBadge.innerHTML = `<i class="bi bi-people-fill me-2"></i>${count}件のガイドを表示中（全70件中）`;
    }
    
    // 表示中ガイド数の更新
    const displayText = document.querySelector('.text-muted');
    if (displayText && displayText.textContent.includes('ガイドが見つかりました')) {
      displayText.textContent = `${count}人のガイドが見つかりました`;
    }
  }
  
  // 「もっと見る」ボタンの表示状態を更新
  function updateLoadMoreButtonState(currentlyVisible) {
    const loadMoreBtn = document.getElementById('load-more-guides');
    if (!loadMoreBtn) return;
    
    const visibleGuides = document.querySelectorAll('.guide-item:not(.hidden-guide):not(.filtered-out)');
    const totalVisibleGuides = document.querySelectorAll('.guide-item:not(.filtered-out)');
    
    if (visibleGuides.length >= totalVisibleGuides.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-block';
    }
  }
  
  // 改良版フィルタリング機能
  function enhancedFilterGuides() {
    const guideItems = document.querySelectorAll('.guide-item');
    console.log(`日本語版: ${guideItems.length}件のガイドアイテムを検出`);
    
    const initialVisibleCount = 3;
    
    // フィルター値の取得
    const locationFilter = document.getElementById('location-filter');
    const languageFilter = document.getElementById('language-filter');
    const feeFilter = document.getElementById('fee-filter');
    const keywordCustomInput = document.getElementById('keyword-filter-custom');
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
    
    const location = locationFilter ? locationFilter.value.toLowerCase() : '';
    const language = languageFilter ? languageFilter.value.toLowerCase() : '';
    const fee = feeFilter && feeFilter.value ? parseInt(feeFilter.value) : 0;
    
    // キーワードの収集
    const selectedKeywords = Array.from(keywordCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.toLowerCase());
    
    // カスタムキーワードを追加
    const customKeywords = keywordCustomInput && keywordCustomInput.value
      ? keywordCustomInput.value
          .split(',')
          .map(keyword => keyword.trim().toLowerCase())
          .filter(keyword => keyword !== '')
      : [];
    
    // すべてのキーワードを結合
    const allKeywords = [...selectedKeywords, ...customKeywords];
    
    console.log('検索条件:', {
      location: location,
      language: language,
      fee: fee,
      keywords: allKeywords
    });
    
    // 検索条件に一致するガイドをカウント
    let visibleCount = 0;
    
    // 各ガイドをフィルタリング
    guideItems.forEach(item => {
      // ガイド情報を取得
      const guideLocation = item.querySelector('.card-text') ? 
                           item.querySelector('.card-text').textContent.toLowerCase() : '';
      
      const guidePrefecture = item.getAttribute('data-prefecture') ? 
                             item.getAttribute('data-prefecture').toLowerCase() : '';
                             
      const guideLanguages = item.querySelector('.text-muted') ? 
                            item.querySelector('.text-muted').textContent.toLowerCase() : '';
                            
      const guideFeeElem = item.querySelector('.badge');
      const guideFeeText = guideFeeElem ? guideFeeElem.textContent : '0';
      const guideFee = parseInt(guideFeeText.replace(/[^0-9]/g, '')) || 0;
      
      // ガイドカードの全テキスト
      const fullCardText = item.textContent.toLowerCase();
      
      // 北海道対応 - 特別ケース
      const isHokkaidoSearch = location === '北海道' || location === 'hokkaido';
      const hasHokkaidoLocation = 
        guideLocation.includes('北海道') || 
        guideLocation.includes('hokkaido') || 
        guideLocation.includes('札幌') || 
        guideLocation.includes('函館') ||
        guideLocation.includes('旭川');
      
      // 条件のマッチング
      // 1. 地域フィルター
      let matchesLocation = true;
      if (location) {
        matchesLocation = guideLocation.includes(location) || guidePrefecture.includes(location);
        
        // 北海道特別対応
        if (isHokkaidoSearch && hasHokkaidoLocation) {
          matchesLocation = true;
        }
      }
      
      // 2. 言語フィルター
      let matchesLanguage = true;
      if (language) {
        matchesLanguage = guideLanguages.includes(language);
      }
      
      // 3. 料金フィルター
      let matchesFee = true;
      if (fee > 0) {
        matchesFee = guideFee <= fee;
      }
      
      // 4. キーワードフィルター
      let matchesKeywords = true;
      if (allKeywords.length > 0) {
        matchesKeywords = allKeywords.some(keyword => fullCardText.includes(keyword));
      }
      
      // すべての条件に一致する場合
      if (matchesLocation && matchesLanguage && matchesFee && matchesKeywords) {
        // フィルター条件に一致 - 表示
        item.classList.remove('filtered-out', 'hidden-guide');
        item.style.display = '';
        item.style.opacity = '1';
        visibleCount++;
      } else {
        // 条件に一致しない場合は非表示
        item.classList.add('filtered-out');
        item.style.display = 'none';
      }
    });
    
    // ガイドカウンターを更新
    updateGuideCounter(visibleCount);
    
    // フィルター適用時は「もっと見る」ボタンを非表示
    const loadMoreBtn = document.getElementById('load-more-guides');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
    
    // 検索結果がない場合のメッセージ
    updateNoResultsMessage(visibleCount);
    
    console.log(`検索結果: ${visibleCount}件のガイドが条件に一致しました`);
  }
  
  // 検索結果がない場合のメッセージを表示/非表示
  function updateNoResultsMessage(visibleCount) {
    const guidesContainer = document.querySelector('.guides-container');
    if (!guidesContainer) return;
    
    let noResultsMsg = document.getElementById('no-results-message');
    
    if (visibleCount === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.className = 'col-12 text-center my-5';
        noResultsMsg.innerHTML = '<p class="lead">条件に一致するガイドが見つかりませんでした。<br>別の検索条件をお試しください。</p>';
        guidesContainer.appendChild(noResultsMsg);
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }
});