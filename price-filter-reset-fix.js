/**
 * 料金フィルターリセット機能緊急修正
 * 問題: リセットボタンを押しても料金フィルターが前回の選択状態のまま残る
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('💰 料金フィルターリセット修正システム開始');
  
  // リセット機能の強化
  setTimeout(() => {
    enhancePriceFilterReset();
  }, 1000);
});

function enhancePriceFilterReset() {
  console.log('🔧 料金フィルターリセット機能強化開始');
  
  // グローバルリセット関数を強化
  const originalResetFilters = window.resetFilters;
  
  window.resetFilters = function() {
    console.log('💰 強化されたリセット機能実行開始');
    
    // 料金フィルターを確実にリセット
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
      console.log('💰 リセット前の料金フィルター:', {
        value: priceFilter.value,
        selectedIndex: priceFilter.selectedIndex,
        options: Array.from(priceFilter.options).map(opt => opt.value)
      });
      
      // 複数の方法でリセット
      priceFilter.value = '';
      priceFilter.selectedIndex = 0;
      
      // Changeイベントを発火してシステムに更新を通知
      const changeEvent = new Event('change', { bubbles: true });
      priceFilter.dispatchEvent(changeEvent);
      
      console.log('💰 リセット後の料金フィルター:', {
        value: priceFilter.value,
        selectedIndex: priceFilter.selectedIndex
      });
    }
    
    // 他の全てのフィルターもリセット
    ['location-filter', 'language-filter', 'custom-keywords'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        if (element.tagName === 'SELECT') {
          element.selectedIndex = 0;
        }
        element.value = '';
        
        // Changeイベントを発火
        const changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(changeEvent);
        
        console.log(`🔄 ${id} をリセット:`, element.value);
      }
    });
    
    // チェックボックスをリセット
    document.querySelectorAll('input[name="keywords"]').forEach((cb, index) => {
      cb.checked = false;
      console.log(`☑️ キーワード${index}をリセット`);
    });
    
    // 元のリセット関数も実行（ページングシステム）
    if (originalResetFilters && typeof originalResetFilters === 'function') {
      originalResetFilters();
    }
    
    // 追加確認: 200ms後に再確認してリセットが完了したか確認
    setTimeout(() => {
      verifyResetCompletion();
    }, 200);
    
    console.log('✅ 強化リセット機能実行完了');
  };
  
  // リセットボタンに直接イベントリスナーを追加（フェイルセーフ）
  const resetButton = document.querySelector('button[onclick*="resetFilters"], .btn:contains("リセット"), #reset-btn');
  if (resetButton) {
    resetButton.addEventListener('click', function(e) {
      console.log('💰 リセットボタン直接クリック検出');
      
      // 少し待ってからリセット確認
      setTimeout(() => {
        const priceFilter = document.getElementById('price-filter');
        if (priceFilter && priceFilter.value !== '') {
          console.log('⚠️ 料金フィルターが正しくリセットされていません - 強制リセット実行');
          forcePriceFilterReset();
        }
      }, 100);
    });
  }
  
  console.log('✅ 料金フィルターリセット機能強化完了');
}

function verifyResetCompletion() {
  console.log('🔍 リセット完了確認開始');
  
  const filters = [
    { id: 'price-filter', name: '料金' },
    { id: 'location-filter', name: '地域' },
    { id: 'language-filter', name: '言語' },
    { id: 'custom-keywords', name: 'キーワード' }
  ];
  
  let allReset = true;
  
  filters.forEach(filter => {
    const element = document.getElementById(filter.id);
    if (element) {
      const isReset = element.value === '' || element.value === null;
      console.log(`🔍 ${filter.name}フィルター: ${isReset ? 'リセット完了' : 'リセット未完了'} (値: "${element.value}")`);
      
      if (!isReset) {
        allReset = false;
        // 強制リセット
        element.value = '';
        element.selectedIndex = 0;
        console.log(`🔧 ${filter.name}フィルターを強制リセット`);
      }
    }
  });
  
  // チェックボックス確認
  const checkedBoxes = document.querySelectorAll('input[name="keywords"]:checked');
  if (checkedBoxes.length > 0) {
    console.log(`⚠️ ${checkedBoxes.length}個のキーワードチェックボックスがまだ選択されています`);
    checkedBoxes.forEach(cb => cb.checked = false);
    allReset = false;
  }
  
  if (allReset) {
    console.log('✅ 全フィルターリセット確認完了');
  } else {
    console.log('⚠️ 一部フィルターが正しくリセットされていませんでした - 修正完了');
  }
}

function forcePriceFilterReset() {
  console.log('🚨 料金フィルター強制リセット実行');
  
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    // DOM操作で強制的にリセット
    priceFilter.value = '';
    priceFilter.selectedIndex = 0;
    
    // すべてのオプションを確認して最初のものを選択
    const firstOption = priceFilter.querySelector('option');
    if (firstOption) {
      firstOption.selected = true;
    }
    
    // 強制的にchangeイベントを発火
    ['change', 'input', 'click'].forEach(eventType => {
      const event = new Event(eventType, { bubbles: true });
      priceFilter.dispatchEvent(event);
    });
    
    console.log('💰 強制リセット完了:', {
      value: priceFilter.value,
      selectedIndex: priceFilter.selectedIndex,
      selectedOption: priceFilter.options[priceFilter.selectedIndex]?.textContent
    });
    
    // ページングシステムに再フィルターを指示
    if (window.paginationGuideSystem) {
      setTimeout(() => {
        window.paginationGuideSystem.resetFilters();
      }, 50);
    }
  }
}

// リセット機能のテスト用関数
window.testPriceFilterReset = function() {
  console.log('🧪 料金フィルターリセットテスト開始');
  
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    // テスト用に値を設定
    priceFilter.value = '6000-10000円';
    console.log('📝 テスト用値設定:', priceFilter.value);
    
    // リセット実行
    setTimeout(() => {
      window.resetFilters();
      
      // 結果確認
      setTimeout(() => {
        const isReset = priceFilter.value === '';
        console.log(`🧪 テスト結果: ${isReset ? '✅成功' : '❌失敗'} (値: "${priceFilter.value}")`);
      }, 300);
    }, 1000);
  }
};

console.log('💰 料金フィルターリセット修正システム読み込み完了');