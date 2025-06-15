/**
 * フィルター問題の根本的なデバッグとテスト
 */

console.log('=== フィルターデバッグ開始 ===');

function debugFilterIssues() {
  console.log('DOM状態チェック:');
  console.log('- readyState:', document.readyState);
  console.log('- DOMContentLoaded:', document.readyState !== 'loading');

  // 要素の存在確認
  const elements = {
    toggleButton: document.getElementById('toggle-filter-button'),
    filterCard: document.getElementById('filter-card'),
    searchButton: document.getElementById('apply-filters'),
    resetButton: document.getElementById('reset-filters'),
    locationFilter: document.getElementById('location-filter'),
    languageFilter: document.getElementById('language-filter'),
    feeFilter: document.getElementById('fee-filter'),
    keywordInput: document.getElementById('keyword-filter-custom'),
    keywordCheckboxes: document.querySelectorAll('.keyword-checkbox'),
    guideItems: document.querySelectorAll('.guide-item'),
    guideCards: document.querySelectorAll('.guide-card')
  };

  console.log('要素存在チェック:');
  Object.entries(elements).forEach(([name, element]) => {
    if (element && element.length !== undefined) {
      console.log(`- ${name}: ${element.length}個`);
    } else {
      console.log(`- ${name}: ${element ? '存在' : '未発見'}`);
    }
  });

  // イベントリスナーのテスト
  console.log('\nイベントリスナーテスト開始');
  
  if (elements.toggleButton) {
    console.log('折りたたみボタンテスト');
    elements.toggleButton.addEventListener('click', function() {
      console.log('CLICKED: 折りたたみボタン');
      testToggleFunction();
    });
  }

  if (elements.searchButton) {
    console.log('検索ボタンテスト');
    elements.searchButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('CLICKED: 検索ボタン');
      testSearchFunction();
    });
  }

  if (elements.resetButton) {
    console.log('リセットボタンテスト');
    elements.resetButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('CLICKED: リセットボタン');
      testResetFunction();
    });
  }

  console.log('=== デバッグ完了 ===');
}

function testToggleFunction() {
  const filterCard = document.getElementById('filter-card');
  if (!filterCard) {
    console.error('フィルターカードが見つかりません');
    return;
  }

  const isHidden = filterCard.classList.contains('d-none');
  console.log('現在の状態:', isHidden ? '非表示' : '表示');

  if (isHidden) {
    filterCard.classList.remove('d-none');
    console.log('→ 表示に変更');
  } else {
    filterCard.classList.add('d-none');
    console.log('→ 非表示に変更');
  }
}

function testSearchFunction() {
  console.log('検索機能テスト開始');
  
  const guideItems = document.querySelectorAll('.guide-item');
  console.log(`対象ガイド数: ${guideItems.length}`);
  
  let visibleCount = 0;
  guideItems.forEach((item, index) => {
    const isVisible = item.style.display !== 'none';
    console.log(`ガイド${index + 1}: ${isVisible ? '表示' : '非表示'}`);
    if (isVisible) visibleCount++;
  });
  
  console.log(`表示中のガイド: ${visibleCount}件`);
  
  // 簡単なテスト: 1つだけ隠してみる
  if (guideItems.length > 0) {
    guideItems[0].style.display = 'none';
    console.log('テスト: 最初のガイドを非表示にしました');
  }
}

function testResetFunction() {
  console.log('リセット機能テスト開始');
  
  const guideItems = document.querySelectorAll('.guide-item');
  guideItems.forEach((item, index) => {
    item.style.display = '';
    console.log(`ガイド${index + 1}: 表示に戻しました`);
  });
  
  console.log('リセット完了');
}

// 実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', debugFilterIssues);
} else {
  debugFilterIssues();
}

// 手動テスト用のグローバル関数
window.testToggle = testToggleFunction;
window.testSearch = testSearchFunction;
window.testReset = testResetFunction;