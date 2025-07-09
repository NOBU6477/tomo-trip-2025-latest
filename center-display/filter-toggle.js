/**
 * フィルター表示・非表示切り替え機能
 * ガイド検索フィルターの表示状態を制御します
 */

document.addEventListener('DOMContentLoaded', function() {
  // フィルター切り替え機能を初期化
  initFilterToggle();
});

/**
 * フィルター切り替え機能の初期化
 */
function initFilterToggle() {
  console.log('フィルター切り替え機能を初期化中...');
  
  // 要素の取得
  const toggleButton = document.getElementById('toggle-filter-button');
  const filterCard = document.getElementById('filter-card');
  
  if (!toggleButton || !filterCard) {
    console.error('フィルター切り替え要素が見つかりません');
    return;
  }
  
  // トグルボタンのクリックイベントを設定
  toggleButton.addEventListener('click', function() {
    toggleFilterVisibility();
  });
  
  console.log('フィルター切り替え機能が正常に初期化されました');
}

/**
 * フィルターの表示・非表示を切り替え
 */
function toggleFilterVisibility() {
  const toggleButton = document.getElementById('toggle-filter-button');
  const filterCard = document.getElementById('filter-card');
  
  if (!toggleButton || !filterCard) {
    console.error('フィルター要素が見つかりません');
    return;
  }
  
  // 現在の表示状態を確認
  const isHidden = filterCard.classList.contains('d-none');
  
  if (isHidden) {
    // フィルターを表示
    filterCard.classList.remove('d-none');
    
    // ボタンテキストを変更
    toggleButton.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
    toggleButton.classList.remove('btn-outline-primary');
    toggleButton.classList.add('btn-primary');
    
    console.log('フィルターを表示しました');
    
    // スムーズにスクロールしてフィルターを表示
    setTimeout(() => {
      filterCard.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
    
  } else {
    // フィルターを非表示
    filterCard.classList.add('d-none');
    
    // ボタンテキストを元に戻す
    toggleButton.innerHTML = '<i class="bi bi-funnel"></i> ガイドを絞り込み';
    toggleButton.classList.remove('btn-primary');
    toggleButton.classList.add('btn-outline-primary');
    
    console.log('フィルターを非表示にしました');
  }
}

/**
 * フィルターが表示されているかどうかを確認
 */
function isFilterVisible() {
  const filterCard = document.getElementById('filter-card');
  return filterCard && !filterCard.classList.contains('d-none');
}

/**
 * フィルターを強制的に表示
 */
function showFilter() {
  const filterCard = document.getElementById('filter-card');
  const toggleButton = document.getElementById('toggle-filter-button');
  
  if (filterCard && filterCard.classList.contains('d-none')) {
    toggleFilterVisibility();
  }
}

/**
 * フィルターを強制的に非表示
 */
function hideFilter() {
  const filterCard = document.getElementById('filter-card');
  const toggleButton = document.getElementById('toggle-filter-button');
  
  if (filterCard && !filterCard.classList.contains('d-none')) {
    toggleFilterVisibility();
  }
}

// グローバル関数として公開
window.toggleFilterVisibility = toggleFilterVisibility;
window.isFilterVisible = isFilterVisible;
window.showFilter = showFilter;
window.hideFilter = hideFilter;