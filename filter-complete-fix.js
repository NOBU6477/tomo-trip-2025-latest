/**
 * フィルター機能完全修正版
 * 折りたたみ機能 + 正常なフィルタリング動作
 */

(function() {
  'use strict';

  let filterSystem = {
    initialized: false,
    filterCard: null,
    toggleButton: null,
    searchButton: null,
    resetButton: null,
    isExpanded: false
  };

  function init() {
    if (filterSystem.initialized) return;
    
    console.log('フィルター完全修正版を初期化中...');
    
    // DOM要素を取得
    filterSystem.filterCard = document.getElementById('filter-card');
    filterSystem.toggleButton = document.getElementById('toggle-filter-button');
    filterSystem.searchButton = document.getElementById('apply-filters');
    filterSystem.resetButton = document.getElementById('reset-filters');
    
    if (!filterSystem.filterCard || !filterSystem.toggleButton) {
      console.error('必要な要素が見つかりません');
      return;
    }
    
    // 折りたたみ機能をセットアップ
    setupToggleFunctionality();
    
    // フィルター機能をセットアップ
    setupFilterFunctionality();
    
    filterSystem.initialized = true;
    console.log('フィルター初期化完了');
  }

  function setupToggleFunctionality() {
    // 初期状態は折りたたまれている
    filterSystem.filterCard.classList.add('d-none');
    filterSystem.isExpanded = false;
    
    // トグルボタンのイベント
    filterSystem.toggleButton.addEventListener('click', function() {
      if (filterSystem.isExpanded) {
        // 折りたたむ
        filterSystem.filterCard.classList.add('d-none');
        filterSystem.toggleButton.innerHTML = '<i class="bi bi-funnel"></i> 詳細検索フィルター';
        filterSystem.isExpanded = false;
      } else {
        // 展開する
        filterSystem.filterCard.classList.remove('d-none');
        filterSystem.toggleButton.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
        filterSystem.isExpanded = true;
      }
    });
    
    console.log('折りたたみ機能セットアップ完了');
  }

  function setupFilterFunctionality() {
    // 検索ボタン
    if (filterSystem.searchButton) {
      // 既存のイベントリスナーを削除
      const newSearchButton = filterSystem.searchButton.cloneNode(true);
      filterSystem.searchButton.parentNode.replaceChild(newSearchButton, filterSystem.searchButton);
      filterSystem.searchButton = newSearchButton;
      
      filterSystem.searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        performSearch();
      });
    }
    
    // リセットボタン
    if (filterSystem.resetButton) {
      // 既存のイベントリスナーを削除
      const newResetButton = filterSystem.resetButton.cloneNode(true);
      filterSystem.resetButton.parentNode.replaceChild(newResetButton, filterSystem.resetButton);
      filterSystem.resetButton = newResetButton;
      
      filterSystem.resetButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetFilters();
      });
    }
    
    console.log('フィルター機能セットアップ完了');
  }

  function performSearch() {
    console.log('検索を実行中...');
    
    try {
      // フィルター値を取得
      const filters = getFilterValues();
      console.log('フィルター条件:', filters);
      
      // ガイドカードを取得
      const guideItems = document.querySelectorAll('.guide-item');
      console.log('ガイドカード数:', guideItems.length);
      
      let visibleCount = 0;
      
      guideItems.forEach((item, index) => {
        const shouldShow = evaluateGuideCard(item, filters);
        
        if (shouldShow) {
          item.style.display = 'block';
          item.classList.remove('d-none');
          visibleCount++;
        } else {
          item.style.display = 'none';
          item.classList.add('d-none');
        }
        
        console.log(`ガイド${index + 1}: ${shouldShow ? '表示' : '非表示'}`);
      });
      
      updateResultCount(visibleCount);
      console.log(`検索完了: ${visibleCount}件のガイドを表示`);
      
    } catch (error) {
      console.error('検索処理エラー:', error);
      alert('検索中にエラーが発生しました');
    }
  }

  function getFilterValues() {
    const locationSelect = document.getElementById('location-filter');
    const languageSelect = document.getElementById('language-filter');
    const feeSelect = document.getElementById('fee-filter');
    const keywordInput = document.getElementById('keyword-filter-custom');
    const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox:checked');
    
    return {
      location: locationSelect ? locationSelect.value : '',
      language: languageSelect ? languageSelect.value : '',
      fee: feeSelect ? feeSelect.value : '',
      customKeywords: keywordInput ? keywordInput.value.trim().toLowerCase() : '',
      selectedKeywords: Array.from(keywordCheckboxes).map(cb => cb.value.toLowerCase())
    };
  }

  function evaluateGuideCard(item, filters) {
    const guideCard = item.querySelector('.guide-card');
    if (!guideCard) return true;
    
    // データ属性から情報を取得
    const cardData = {
      location: (guideCard.dataset.location || '').toLowerCase(),
      languages: (guideCard.dataset.languages || '').toLowerCase(),
      fee: parseInt(guideCard.dataset.fee) || 0,
      keywords: (guideCard.dataset.keywords || '').toLowerCase(),
      text: item.textContent.toLowerCase()
    };
    
    // 地域フィルター
    if (filters.location && filters.location !== 'すべて') {
      const locationFilter = filters.location.toLowerCase();
      if (!cardData.location.includes(locationFilter) && !cardData.text.includes(locationFilter)) {
        return false;
      }
    }
    
    // 言語フィルター
    if (filters.language && filters.language !== 'すべて') {
      const languageFilter = filters.language.toLowerCase();
      if (!cardData.languages.includes(languageFilter) && !cardData.text.includes(languageFilter)) {
        return false;
      }
    }
    
    // 料金フィルター
    if (filters.fee && filters.fee !== 'すべて') {
      const feeFilter = parseInt(filters.fee);
      if (feeFilter === 6000 && cardData.fee < 6000) return false;
      if (feeFilter === 10000 && cardData.fee > 10000) return false;
      if (feeFilter === 15000 && cardData.fee > 15000) return false;
      if (feeFilter === 20000 && cardData.fee > 20000) return false;
    }
    
    // キーワードチェックボックス
    if (filters.selectedKeywords.length > 0) {
      const keywordMatch = filters.selectedKeywords.some(keyword => 
        cardData.keywords.includes(keyword) || cardData.text.includes(keyword)
      );
      if (!keywordMatch) return false;
    }
    
    // カスタムキーワード
    if (filters.customKeywords) {
      const customKeywords = filters.customKeywords.split(',').map(k => k.trim());
      const customMatch = customKeywords.some(keyword => 
        keyword && cardData.text.includes(keyword)
      );
      if (!customMatch) return false;
    }
    
    return true;
  }

  function resetFilters() {
    console.log('フィルターをリセット中...');
    
    try {
      // セレクトボックスをリセット
      const selects = ['location-filter', 'language-filter', 'fee-filter'];
      selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) select.selectedIndex = 0;
      });
      
      // テキスト入力をクリア
      const keywordInput = document.getElementById('keyword-filter-custom');
      if (keywordInput) keywordInput.value = '';
      
      // チェックボックスをクリア
      const checkboxes = document.querySelectorAll('.keyword-checkbox');
      checkboxes.forEach(cb => cb.checked = false);
      
      // 全てのガイドカードを表示
      const guideItems = document.querySelectorAll('.guide-item');
      guideItems.forEach(item => {
        item.style.display = 'block';
        item.classList.remove('d-none');
      });
      
      updateResultCount(guideItems.length);
      console.log('リセット完了');
      
    } catch (error) {
      console.error('リセット処理エラー:', error);
    }
  }

  function updateResultCount(count) {
    // 結果件数を更新
    const countElements = document.querySelectorAll('.guide-count, .result-count');
    countElements.forEach(el => {
      el.textContent = `${count}件のガイドが見つかりました`;
    });
    
    // メインタイトルを更新
    const mainTitle = document.querySelector('h2');
    if (mainTitle && mainTitle.textContent.includes('人気のガイド')) {
      mainTitle.textContent = `人気のガイド (${count}件)`;
    }
    
    // 結果なしメッセージの表示/非表示
    const noResultsMsg = document.getElementById('no-results-message');
    if (noResultsMsg) {
      if (count === 0) {
        noResultsMsg.classList.remove('d-none');
      } else {
        noResultsMsg.classList.add('d-none');
      }
    }
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }

})();