/**
 * シンプルなフィルター機能の修正
 * 基本的な折りたたみと検索機能を確実に動作させる
 */

(function() {
  'use strict';

  console.log('シンプルフィルター修正スクリプト開始');

  // 他のスクリプトからの干渉を防ぐ
  function preventConflicts() {
    // 定期的に競合するカウンターを削除
    setInterval(() => {
      const badCounters = document.querySelectorAll('.search-results-counter, .alert');
      badCounters.forEach(counter => {
        if (counter.textContent && counter.textContent.includes('件中') && counter.textContent.includes('件のガイドが表示')) {
          const match = counter.textContent.match(/(\d+)件中(\d+)件/);
          if (match && match[1] !== match[2]) {
            console.log('不正確なカウンターを削除:', counter.textContent);
            counter.remove();
          }
        }
      });
    }, 1000);
  }

  // DOMContentLoaded後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSimpleFilter();
      preventConflicts();
    });
  } else {
    initSimpleFilter();
    preventConflicts();
  }

  function initSimpleFilter() {
    console.log('シンプルフィルター初期化開始');
    
    // 既存の競合するカウンターを削除
    const existingCounters = document.querySelectorAll('.search-results-counter, .alert');
    existingCounters.forEach(counter => {
      if (counter.textContent && counter.textContent.includes('件のガイドが表示')) {
        counter.remove();
      }
    });
    
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
    
    // 初期状態のカウンター表示
    setTimeout(() => {
      displayInitialCount();
    }, 500);
  }

  function displayInitialCount() {
    const allGuides = document.querySelectorAll('.guide-item');
    const visibleGuides = Array.from(allGuides).filter(guide => {
      const style = window.getComputedStyle(guide);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    
    console.log(`初期表示: 全${allGuides.length}件中${visibleGuides.length}件が表示中`);
    showSearchResults(visibleGuides.length, allGuides.length);
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
    // 既存の結果メッセージをすべて削除
    const existingMessages = document.querySelectorAll('.search-results-message, .search-results-counter');
    existingMessages.forEach(msg => msg.remove());
    
    // 新しい結果メッセージを作成
    const message = document.createElement('div');
    message.className = 'search-results-message';
    message.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      margin: 20px 0;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      border: none;
    `;
    
    // アイコンとテキストを追加
    message.innerHTML = `
      <i class="bi bi-search me-2"></i>
      ${totalCount}件中 <span style="color: #FFD700;">${visibleCount}件</span> のガイドが表示されています
    `;
    
    // フィルターカードの後に挿入
    const filterCard = document.getElementById('filter-card');
    if (filterCard && filterCard.parentNode) {
      filterCard.parentNode.insertBefore(message, filterCard.nextSibling);
    } else {
      // フィルターカードがない場合は、ガイドコンテナの前に挿入
      const guidesContainer = document.querySelector('#guides, .row');
      if (guidesContainer) {
        guidesContainer.parentNode.insertBefore(message, guidesContainer);
      }
    }
    
    // アニメーション効果を追加
    message.style.opacity = '0';
    message.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      message.style.transition = 'all 0.3s ease-out';
      message.style.opacity = '1';
      message.style.transform = 'translateY(0)';
    }, 100);
  }

})();