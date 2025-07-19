/**
 * 英語サイト専用フィルターシステム
 */

console.log('🔧 English Filter System Loading...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 Setting up English filter system...');
  
  // フィルターボタンの設定
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const filterCard = document.getElementById('filter-card');
  
  if (filterToggleBtn && filterCard) {
    filterToggleBtn.addEventListener('click', function() {
      if (filterCard.classList.contains('d-none')) {
        filterCard.classList.remove('d-none');
        filterToggleBtn.innerHTML = '<i class="bi bi-funnel-fill"></i> Hide Filters';
      } else {
        filterCard.classList.add('d-none');
        filterToggleBtn.innerHTML = '<i class="bi bi-funnel"></i> Filter Guides';
      }
    });
  }
  
  console.log('✅ English filter toggle setup complete');
});

console.log('✅ English Filter System Loaded');