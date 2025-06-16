/**
 * シンプルなフィルター機能の修正
 * 基本的な折りたたみと検索機能を確実に動作させる
 */

(function() {
  'use strict';

  console.log('シンプルフィルター修正スクリプト開始');

  // DOMContentLoaded後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleFilter);
  } else {
    initSimpleFilter();
  }

  function initSimpleFilter() {
    console.log('シンプルフィルター初期化開始');
    
    // 初期化時にhidden-guideクラスを削除
    const hiddenGuides = document.querySelectorAll('.guide-item.hidden-guide');
    console.log('hidden-guideクラス付きガイド数:', hiddenGuides.length);
    hiddenGuides.forEach(guide => {
      guide.classList.remove('hidden-guide');
      guide.style.display = '';
      guide.style.visibility = 'visible';
      guide.style.opacity = '1';
    });
    
    // 必要な要素の確認
    const toggleButton = document.getElementById('toggle-filter-button');
    const filterCard = document.getElementById('filter-card');
    const searchButton = document.getElementById('apply-filters');
    const resetButton = document.getElementById('reset-filters');

    console.log('要素確認:', {
      toggleButton: !!toggleButton,
      filterCard: !!filterCard,
      searchButton: !!searchButton,
      resetButton: !!resetButton
    });

    // 折りたたみボタンの設定
    if (toggleButton && filterCard) {
      // 既存のイベントリスナーを削除
      const newToggleButton = toggleButton.cloneNode(true);
      toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);

      newToggleButton.addEventListener('click', function() {
        console.log('フィルター切り替えボタンがクリックされました');
        
        if (filterCard.classList.contains('d-none')) {
          filterCard.classList.remove('d-none');
          console.log('フィルターを表示');
        } else {
          filterCard.classList.add('d-none');
          console.log('フィルターを非表示');
        }
      });
      
      console.log('折りたたみボタン設定完了');
    } else {
      console.error('折りたたみボタンまたはフィルターカードが見つかりません');
    }

    // 検索ボタンの設定
    if (searchButton) {
      const newSearchButton = searchButton.cloneNode(true);
      searchButton.parentNode.replaceChild(newSearchButton, searchButton);

      newSearchButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('検索ボタンがクリックされました');
        performSearch();
      });
      
      console.log('検索ボタン設定完了');
    } else {
      console.error('検索ボタンが見つかりません');
    }

    // リセットボタンの設定
    if (resetButton) {
      const newResetButton = resetButton.cloneNode(true);
      resetButton.parentNode.replaceChild(newResetButton, resetButton);

      newResetButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('リセットボタンがクリックされました');
        resetFilters();
      });
      
      console.log('リセットボタン設定完了');
    } else {
      console.error('リセットボタンが見つかりません');
    }

    console.log('シンプルフィルター初期化完了');
  }

  function performSearch() {
    console.log('検索実行開始');
    
    // フィルター値を取得
    const filters = getFilterValues();
    console.log('現在のフィルター設定:', filters);
    
    // hidden-guideクラスを削除してすべてのガイドを表示可能にする
    const hiddenGuides = document.querySelectorAll('.guide-item.hidden-guide');
    hiddenGuides.forEach(guide => {
      guide.classList.remove('hidden-guide');
    });
    
    // ガイドアイテムを取得
    const guideItems = document.querySelectorAll('.guide-item');
    console.log('検索対象ガイド数:', guideItems.length);
    
    let visibleCount = 0;
    
    guideItems.forEach((item, index) => {
      const shouldShow = matchesFilters(item, filters);
      
      if (shouldShow) {
        item.style.display = '';
        item.style.visibility = 'visible';
        item.style.opacity = '1';
        visibleCount++;
        console.log(`ガイド${index + 1}: 表示`);
      } else {
        item.style.display = 'none';
        console.log(`ガイド${index + 1}: 非表示`);
      }
    });
    
    console.log(`検索完了: ${visibleCount}件のガイドが表示されています`);
    
    // 結果メッセージを表示
    showSearchResults(visibleCount, guideItems.length);
  }

  function getFilterValues() {
    const locationSelect = document.getElementById('location-filter');
    const languageSelect = document.getElementById('language-filter');
    const feeSelect = document.getElementById('fee-filter');
    const keywordInput = document.getElementById('keyword-filter-custom');
    
    return {
      location: locationSelect ? locationSelect.value : '',
      language: languageSelect ? languageSelect.value : '',
      fee: feeSelect ? feeSelect.value : '',
      keyword: keywordInput ? keywordInput.value.trim() : ''
    };
  }

  function matchesFilters(item, filters) {
    // 地域フィルター
    if (filters.location) {
      const locationText = item.textContent || '';
      if (!locationText.includes(filters.location)) {
        console.log('地域フィルターで除外:', filters.location);
        return false;
      }
    }
    
    // 言語フィルター
    if (filters.language) {
      const languageTags = item.querySelectorAll('.language-tag');
      let hasLanguage = false;
      languageTags.forEach(tag => {
        if (tag.textContent.includes(filters.language)) {
          hasLanguage = true;
        }
      });
      if (!hasLanguage) {
        console.log('言語フィルターで除外:', filters.language);
        return false;
      }
    }
    
    // キーワードフィルター
    if (filters.keyword) {
      const itemText = item.textContent || '';
      if (!itemText.toLowerCase().includes(filters.keyword.toLowerCase())) {
        console.log('キーワードフィルターで除外:', filters.keyword);
        return false;
      }
    }
    
    return true;
  }

  function resetFilters() {
    console.log('フィルターリセット開始');
    
    // フォーム要素をリセット
    const locationSelect = document.getElementById('location-filter');
    const languageSelect = document.getElementById('language-filter');
    const feeSelect = document.getElementById('fee-filter');
    const keywordInput = document.getElementById('keyword-filter-custom');
    
    if (locationSelect) locationSelect.value = '';
    if (languageSelect) languageSelect.value = '';
    if (feeSelect) feeSelect.value = '';
    if (keywordInput) keywordInput.value = '';
    
    // hidden-guideクラスを削除してすべてのガイドを表示可能にする
    const hiddenGuides = document.querySelectorAll('.guide-item.hidden-guide');
    hiddenGuides.forEach(guide => {
      guide.classList.remove('hidden-guide');
    });
    
    // すべてのガイドを表示
    const guideItems = document.querySelectorAll('.guide-item');
    guideItems.forEach(item => {
      item.style.display = '';
      item.style.visibility = 'visible';
      item.style.opacity = '1';
    });
    
    // 結果メッセージを削除
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    console.log('フィルターリセット完了');
    console.log(`${guideItems.length}件のガイドがすべて表示されています`);
  }

  function showSearchResults(visibleCount, totalCount) {
    // 既存の結果メッセージを削除
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // 新しい結果メッセージを作成
    const message = document.createElement('div');
    message.className = 'search-results-message alert alert-info mt-3';
    message.textContent = `${totalCount}件中${visibleCount}件のガイドが表示されています`;
    
    // フィルターカードの後に挿入
    const filterCard = document.getElementById('filter-card');
    if (filterCard && filterCard.parentNode) {
      filterCard.parentNode.insertBefore(message, filterCard.nextSibling);
    }
  }

})();