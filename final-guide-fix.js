/**
 * 最終解決策：最小限の依存関係で確実に動作するガイドフィルタリング機能
 */
window.addEventListener('load', function() {
  // 全てのガイド表示を確認
  ensureGuidesVisible();
  
  // フィルターのセットアップ
  setupFilters();
  
  // 結果カウンター修正
  fixResultsCounter();
  
  // エラーメッセージを削除
  removeErrorMessages();
  
  console.log('最終ガイド表示修正適用済み');
});

// 全てのガイド表示を確保
function ensureGuidesVisible() {
  var guides = document.querySelectorAll('.guide-item');
  console.log('ガイド件数:', guides.length);
  
  guides.forEach(function(guide) {
    guide.style.display = '';
    guide.style.opacity = '1';
    if (guide.classList.contains('hidden-guide')) {
      guide.classList.remove('hidden-guide');
    }
    
    var card = guide.querySelector('.guide-card');
    if (card) {
      card.style.display = '';
      card.style.opacity = '1';
      if (card.classList.contains('hidden-guide')) {
        card.classList.remove('hidden-guide');
      }
    }
  });
}

// エラーメッセージを削除する関数
function removeErrorMessages() {
  // 「条件に一致するガイドが見つかりませんでした。」のメッセージを探して削除
  var errorMessages = document.querySelectorAll('p, div');
  errorMessages.forEach(function(element) {
    if (element.textContent.includes('条件に一致するガイドが見つかりませんでした')) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  });
}

// カウンターの修正
function fixResultsCounter() {
  // 重複したカウンターの削除
  var counters = document.querySelectorAll('.search-results-counter');
  if (counters.length > 1) {
    for (var i = 1; i < counters.length; i++) {
      if (counters[i] && counters[i].parentNode) {
        counters[i].parentNode.removeChild(counters[i]);
      }
    }
  }
  
  // カウンターの作成または更新
  var counter = document.querySelector('.search-results-counter');
  if (!counter) {
    counter = document.createElement('p');
    counter.className = 'search-results-counter';
    counter.style.margin = '15px 0';
    counter.style.fontWeight = 'bold';
    counter.style.color = '#333';
    
    var container = document.querySelector('.guides-container') || document.querySelector('.container');
    if (container) {
      container.insertBefore(counter, container.firstChild);
    }
  }
  
  // カウンター表示更新
  var guides = document.querySelectorAll('.guide-item');
  var visibleGuides = Array.from(guides).filter(function(guide) {
    return guide.style.display !== 'none';
  });
  
  counter.textContent = visibleGuides.length + '件のガイドが見つかりました';
}

// フィルター機能のセットアップ
function setupFilters() {
  var applyBtn = document.getElementById('apply-filters');
  var resetBtn = document.getElementById('reset-filters');
  
  // 適用ボタン
  if (applyBtn) {
    applyBtn.onclick = function(e) {
      e.preventDefault();
      
      var locationFilter = document.getElementById('location-filter');
      var languageFilter = document.getElementById('language-filter');
      var feeFilter = document.getElementById('fee-filter');
      var location = locationFilter ? locationFilter.value : '';
      var language = languageFilter ? languageFilter.value : '';
      var fee = feeFilter && feeFilter.value ? parseInt(feeFilter.value) : 0;
      
      filterGuides(location, language, fee);
    };
  }
  
  // リセットボタン
  if (resetBtn) {
    resetBtn.onclick = function(e) {
      e.preventDefault();
      
      // フィルターリセット
      var locationFilter = document.getElementById('location-filter');
      var languageFilter = document.getElementById('language-filter');
      var feeFilter = document.getElementById('fee-filter');
      var keywordInput = document.getElementById('keyword-filter-custom');
      
      if (locationFilter) locationFilter.value = '';
      if (languageFilter) languageFilter.value = '';
      if (feeFilter) feeFilter.value = '';
      if (keywordInput) keywordInput.value = '';
      
      var checkboxes = document.querySelectorAll('.keyword-checkbox');
      checkboxes.forEach(function(cb) {
        cb.checked = false;
      });
      
      // すべて表示
      ensureGuidesVisible();
      
      // エラーメッセージを削除
      removeErrorMessages();
      
      // カウンター更新
      fixResultsCounter();
    };
  }
}

// ガイドのフィルタリング
function filterGuides(location, language, fee) {
  var guides = document.querySelectorAll('.guide-item');
  var visibleCount = 0;
  
  guides.forEach(function(guide) {
    var text = guide.textContent.toLowerCase();
    var matchLocation = !location || location === 'すべて' || text.includes(location.toLowerCase());
    var matchLanguage = !language || language === 'すべて' || text.includes(language.toLowerCase());
    
    var matchFee = true;
    if (fee > 0) {
      var feeMatch = text.match(/¥([0-9,]+)/);
      if (feeMatch) {
        var guideFee = parseInt(feeMatch[1].replace(/,/g, ''));
        matchFee = guideFee <= fee;
      }
    }
    
    if (matchLocation && matchLanguage && matchFee) {
      guide.style.display = '';
      visibleCount++;
    } else {
      guide.style.display = 'none';
    }
  });
  
  // エラーメッセージを削除
  removeErrorMessages();
  
  // カウンター更新
  var counter = document.querySelector('.search-results-counter');
  if (counter) {
    counter.textContent = visibleCount + '件のガイドが見つかりました';
  }
  
  // 特定の地域に対する特別処理
  if (location && visibleCount === 0) {
    // 北海道特別処理
    if (location.includes('北海道')) {
      // 北海道のガイドを強制的に検索
      guides.forEach(function(guide) {
        var text = guide.textContent.toLowerCase();
        if (text.includes('北海道') || text.includes('札幌') || text.includes('函館') || 
            text.includes('小樽') || text.includes('旭川') || text.includes('釧路')) {
          guide.style.display = '';
          visibleCount++;
        }
      });
      
      if (counter && visibleCount > 0) {
        counter.textContent = visibleCount + '件のガイドが見つかりました';
      }
    }
  }
  
  console.log('フィルター適用:', visibleCount, '件表示');
}