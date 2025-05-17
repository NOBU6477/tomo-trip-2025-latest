/**
 * ガイド検索リアルタイムフィルター機能
 * 
 * フィルターフォームの各要素の変更を監視し、
 * ガイドカードをリアルタイムでフィルタリングして表示します。
 */

document.addEventListener('DOMContentLoaded', function() {
  // フィルターフォームの要素を取得
  const locationFilter = document.getElementById('location-filter');
  const languageFilter = document.getElementById('language-filter');
  const feeFilter = document.getElementById('fee-filter');
  const keywordCheckboxes = document.querySelectorAll('.keyword-checkbox');
  const customKeywordInput = document.getElementById('keyword-filter-custom');
  const filterForm = document.getElementById('guide-filter-form');
  const allGuideCards = document.querySelectorAll('.guide-card');
  const guidesContainer = document.querySelector('#guide-cards-container');
  const noResultsMessage = document.getElementById('no-results-message');
  
  // 検索件数表示用の要素
  let searchResultsCounter = document.getElementById('search-results-counter');
  if (!searchResultsCounter) {
    searchResultsCounter = document.createElement('div');
    searchResultsCounter.id = 'search-results-counter';
    searchResultsCounter.className = 'alert alert-success fw-bold fs-5 text-center my-3';
    const guidesSection = document.getElementById('guides');
    if (guidesSection) {
      const cardsContainer = guidesSection.querySelector('#guide-cards-container');
      if (cardsContainer) {
        cardsContainer.parentNode.insertBefore(searchResultsCounter, cardsContainer);
      }
    }
  }
  
  // 「検索結果なし」メッセージがない場合は作成
  if (!noResultsMessage) {
    const noResultsDiv = document.createElement('div');
    noResultsDiv.id = 'no-results-message';
    noResultsDiv.className = 'alert alert-info text-center my-4 d-none';
    noResultsDiv.innerHTML = '検索条件に一致するガイドが見つかりませんでした。条件を変更してお試しください。';
    if (guidesContainer) {
      guidesContainer.parentNode.insertBefore(noResultsDiv, guidesContainer.nextSibling);
    }
  }

  // フィルターの変更を監視
  if (locationFilter) locationFilter.addEventListener('change', applyFilters);
  if (languageFilter) languageFilter.addEventListener('change', applyFilters);
  if (feeFilter) feeFilter.addEventListener('change', applyFilters);
  
  // キーワードチェックボックスの変更を監視
  keywordCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // カスタムキーワード入力フィールドの変更を監視
  if (customKeywordInput) {
    customKeywordInput.addEventListener('input', debounce(applyFilters, 300));
  }
  
  // フォームのリセットボタンがあれば監視
  const resetButton = filterForm ? filterForm.querySelector('button[type="reset"]') : null;
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      // フォームの値をリセット
      if (locationFilter) locationFilter.value = '';
      if (languageFilter) languageFilter.value = '';
      if (feeFilter) feeFilter.value = feeFilter.getAttribute('max') || '20000';
      
      // キーワードのチェックを外す
      keywordCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      
      // カスタムキーワードをクリア
      if (customKeywordInput) {
        customKeywordInput.value = '';
      }
      
      // すべてのカードを表示状態に戻す前に、DOM要素を最新の状態に更新
      const allCards = document.querySelectorAll('.guide-card');
      const allGuideItems = document.querySelectorAll('.guide-item');
      
      // すべてのガイドアイテムを表示状態に
      allGuideItems.forEach(item => {
        item.classList.remove('hidden-guide');
        item.style.display = '';
        item.style.opacity = '1';
      });
      
      // すべてのカードも表示状態に
      allCards.forEach(card => {
        card.classList.remove('hidden-guide');
        card.style.display = '';
        card.style.opacity = '1';
      });
      
      console.log('フィルターをリセットしました');
      
      // リセット後に改めてフィルター適用（遅延実行）
      setTimeout(() => {
        // DOM要素を再取得してからフィルター適用
        applyFilters();
      }, 50);
    });
  }
  
  // 初期表示時にも実行
  applyFilters();

  /**
   * すべてのフィルターを適用してガイドカードをフィルタリングする
   */
  function applyFilters() {
    console.log('フィルターを適用...');
    const location = locationFilter ? locationFilter.value.toLowerCase() : '';
    const language = languageFilter ? languageFilter.value.toLowerCase() : '';
    const fee = feeFilter ? parseInt(feeFilter.value) || 0 : 0;
    
    // 選択されたキーワードを取得
    const selectedKeywords = Array.from(keywordCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.toLowerCase());
    
    // カスタムキーワードを取得
    const customKeywords = customKeywordInput && customKeywordInput.value 
      ? customKeywordInput.value.split(',').map(kw => kw.trim().toLowerCase()).filter(kw => kw !== '')
      : [];
    
    // すべてのキーワードを結合
    const allKeywords = [...selectedKeywords, ...customKeywords];
    
    let visibleCount = 0;
    
    // 各ガイドカードをフィルタリング
    allGuideCards.forEach(card => {
      const cardLocation = (card.getAttribute('data-location') || '').toLowerCase();
      const cardLanguages = (card.getAttribute('data-languages') || '').toLowerCase();
      const cardFee = parseInt(card.getAttribute('data-fee') || '0');
      const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      
      console.log(`カード情報: ID=${card.getAttribute('data-guide-id')}, 地域=${cardLocation}, 言語=${cardLanguages}, 料金=${cardFee}, キーワード=${cardKeywords}`);
      
      // 各フィルター条件をチェック（選択値がない場合は全て一致とみなす）
      let matchesLocation = true;
      if (location && location !== 'すべて') {
        // 北海道特別対応
        if (location === 'hokkaido') {
          // 北海道や札幌などの北海道内の都市が含まれているか確認
          matchesLocation = cardLocation.includes('北海道') || 
                           cardLocation.includes('札幌') || 
                           cardLocation.includes('函館') || 
                           cardLocation.includes('旭川') || 
                           cardLocation.includes('hokkaido') || 
                           cardLocation.includes('sapporo');
        } else {
          // 完全一致ではなく、部分一致で判定（東京都 渋谷区 → 東京 でも一致するように）
          matchesLocation = cardLocation.includes(location);
        }
      }
      
      let matchesLanguage = true;
      if (language && language !== 'すべて') {
        // カンマ区切りのリストから探す
        matchesLanguage = cardLanguages.split(',').some(lang => 
          lang.trim().toLowerCase() === language
        );
      }
      
      // 料金フィルターはシンプルな数値比較
      let matchesFee = !fee || cardFee <= fee;
      
      // キーワード一致の判定を改良
      let matchesKeywords = true;
      if (allKeywords.length > 0) {
        // いずれかのキーワードが含まれていれば一致とみなす
        matchesKeywords = allKeywords.some(keyword => {
          // キーワードが空でなければチェック
          if (keyword && keyword.trim()) {
            // 部分一致ではなく、単語として含まれているかチェック
            const keywordList = cardKeywords.split(',').map(k => k.trim().toLowerCase());
            return keywordList.includes(keyword.toLowerCase());
          }
          return true; // 空のキーワードは常に一致とみなす
        });
      }
      
      console.log(`フィルター条件: 地域=${matchesLocation}, 言語=${matchesLanguage}, 料金=${matchesFee}, キーワード=${matchesKeywords}`);
      
      // すべての条件に一致する場合のみ表示
      const shouldShow = matchesLocation && matchesLanguage && matchesFee && matchesKeywords;
      
      // ガイドアイテム（親要素）を取得
      const guideItem = card.closest('.guide-item');
      
      // アニメーション効果を追加してカードの表示/非表示を切り替え
      if (shouldShow) {
        if (guideItem) {
          guideItem.classList.remove('hidden-guide');
          guideItem.style.display = '';
        }
        card.classList.remove('hidden-guide');
        card.style.display = '';
        visibleCount++;
        
        // フェードイン効果（オプション）
        if (guideItem) {
          guideItem.style.opacity = '0';
          setTimeout(() => {
            guideItem.style.transition = 'opacity 0.3s ease-in-out';
            guideItem.style.opacity = '1';
          }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease-in-out';
            card.style.opacity = '1';
          }, 10);
        }
      } else {
        // フェードアウト効果（オプション）
        if (guideItem) {
          guideItem.style.transition = 'opacity 0.3s ease-in-out';
          guideItem.style.opacity = '0';
          setTimeout(() => {
            guideItem.classList.add('hidden-guide');
            guideItem.style.display = 'none';
          }, 300);
        } else {
          card.style.transition = 'opacity 0.3s ease-in-out';
          card.style.opacity = '0';
          setTimeout(() => {
            card.classList.add('hidden-guide');
            card.style.display = 'none';
          }, 300);
        }
      }
    });
    
    // 検索結果数を更新
    if (searchResultsCounter) {
      searchResultsCounter.textContent = `${visibleCount}件のガイドが見つかりました`;
    }
    
    // 検索結果がない場合のメッセージ表示
    const noResultsMessageElement = document.getElementById('no-results-message');
    if (noResultsMessageElement) {
      if (visibleCount === 0) {
        noResultsMessageElement.classList.remove('d-none');
      } else {
        noResultsMessageElement.classList.add('d-none');
      }
    }
    
    console.log(`フィルター結果: ${visibleCount}件のガイドが表示されています`);
  }
  
  // バッジデータをガイドカードに設定
  function setGuideCardAttributes() {
    // DOMから最新のガイドカードを全て取得（動的に追加されたものも含む）
    const allCurrentCards = document.querySelectorAll('.guide-card');
    
    allCurrentCards.forEach(card => {
      // キーワード情報を設定
      if (!card.hasAttribute('data-keywords') || card.getAttribute('data-keywords') === '') {
        const cardKeywordElements = card.querySelectorAll('.badge');
        // 料金バッジ（bg-primary）以外のバッジを取得
        const keywords = Array.from(cardKeywordElements)
          .filter(badge => !badge.classList.contains('bg-primary'))
          .map(badge => badge.textContent.trim());
        
        if (keywords.length > 0) {
          card.setAttribute('data-keywords', keywords.join(',').toLowerCase());
        }
      }
      
      // ガイド言語情報を設定
      if (!card.hasAttribute('data-languages') || card.getAttribute('data-languages') === '') {
        const languageElements = card.querySelectorAll('.guide-languages .badge');
        const languages = Array.from(languageElements).map(badge => badge.textContent.trim());
        if (languages.length > 0) {
          card.setAttribute('data-languages', languages.join(',').toLowerCase());
        }
      }
      
      // 料金情報を設定
      if (!card.hasAttribute('data-fee') || card.getAttribute('data-fee') === '') {
        const feeElement = card.querySelector('.guide-fee');
        if (feeElement) {
          const feeText = feeElement.textContent;
          const feeMatch = feeText.match(/¥([0-9,]+)/);
          if (feeMatch) {
            const fee = parseInt(feeMatch[1].replace(/,/g, ''));
            card.setAttribute('data-fee', fee.toString());
          }
        }
      }
      
      // 地域情報を設定
      if (!card.hasAttribute('data-location') || card.getAttribute('data-location') === '') {
        const locationElement = card.querySelector('.guide-location');
        if (locationElement) {
          const locationText = locationElement.textContent.trim();
          if (locationText) {
            card.setAttribute('data-location', locationText.toLowerCase());
          }
        }
      }
    });
    
    console.log(`${allCurrentCards.length}件のガイドカードの属性を設定しました`);
  }
  
  // ページ読み込み時にガイドカードの属性を設定
  setGuideCardAttributes();
  
  // 追加されたガイドカードのために、グローバルスコープでapplyFilters関数を公開
  window.applyFilters = applyFilters;
});

/**
 * 連続した呼び出しを間引くためのデバウンス関数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}