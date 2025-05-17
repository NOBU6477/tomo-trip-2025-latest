/**
 * ガイド表示修正用の特別スクリプト
 * ガイドカードの表示を確実にするための特別な処理を含む
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイド表示修正スクリプト実行中');
  
  setTimeout(function() {
    // 重複しているカウンターを削除
    var counters = document.querySelectorAll('.search-results-counter');
    if (counters.length > 1) {
      for (var i = 1; i < counters.length; i++) {
        if (counters[i] && counters[i].parentNode) {
          counters[i].parentNode.removeChild(counters[i]);
        }
      }
    }
    
    // カウンターが存在しなければ作成
    var resultsCounter = document.querySelector('.search-results-counter');
    if (!resultsCounter) {
      resultsCounter = document.createElement('p');
      resultsCounter.className = 'search-results-counter';
      resultsCounter.style.fontWeight = 'bold';
      resultsCounter.style.marginTop = '15px';
      resultsCounter.style.marginBottom = '15px';
      
      var container = document.querySelector('.guides-container');
      if (container) {
        if (container.firstChild) {
          container.insertBefore(resultsCounter, container.firstChild);
        } else {
          container.appendChild(resultsCounter);
        }
      }
    }
    
    // ガイドカードが正しく表示されているか確認
    var guideItems = document.querySelectorAll('.guide-item');
    var guideCards = document.querySelectorAll('.guide-card');
    
    console.log('ガイドアイテム数:', guideItems.length);
    console.log('ガイドカード数:', guideCards.length);
    
    // ガイドアイテムが非表示になっていないか確認
    guideItems.forEach(function(item) {
      // display:noneを解除
      if (item.style.display === 'none') {
        item.style.display = '';
      }
      
      // hidden-guideクラスを削除
      if (item.classList.contains('hidden-guide')) {
        item.classList.remove('hidden-guide');
      }
      
      // 透明度を1に設定
      item.style.opacity = '1';
    });
    
    // ガイドカードも同様に確認
    guideCards.forEach(function(card) {
      // display:noneを解除
      if (card.style.display === 'none') {
        card.style.display = '';
      }
      
      // hidden-guideクラスを削除
      if (card.classList.contains('hidden-guide')) {
        card.classList.remove('hidden-guide');
      }
      
      // 透明度を1に設定
      card.style.opacity = '1';
    });
    
    // カウンター更新
    if (resultsCounter) {
      var count = guideItems.length || guideCards.length;
      resultsCounter.textContent = count + '件のガイドが見つかりました';
    }
    
    // フィルターボタンのイベントリスナー確認
    var applyBtn = document.getElementById('apply-filters');
    var resetBtn = document.getElementById('reset-filters');
    
    if (applyBtn && !applyBtn._hasListener) {
      applyBtn._hasListener = true;
      applyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var locationFilter = document.getElementById('location-filter');
        var location = locationFilter ? locationFilter.value : '';
        
        // フィルタリング処理
        var visible = 0;
        guideItems.forEach(function(item) {
          var text = item.textContent.toLowerCase();
          var match = !location || location === 'すべて' || text.includes(location.toLowerCase());
          
          if (match) {
            item.style.display = '';
            visible++;
          } else {
            item.style.display = 'none';
          }
        });
        
        // カウンター更新
        if (resultsCounter) {
          resultsCounter.textContent = visible + '件のガイドが見つかりました';
        }
      });
    }
    
    if (resetBtn && !resetBtn._hasListener) {
      resetBtn._hasListener = true;
      resetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // フィルターリセット
        var locationFilter = document.getElementById('location-filter');
        var languageFilter = document.getElementById('language-filter');
        var feeFilter = document.getElementById('fee-filter');
        var keywordInput = document.getElementById('keyword-filter-custom');
        var checkboxes = document.querySelectorAll('.keyword-checkbox');
        
        if (locationFilter) locationFilter.value = '';
        if (languageFilter) languageFilter.value = '';
        if (feeFilter) feeFilter.value = '';
        if (keywordInput) keywordInput.value = '';
        
        checkboxes.forEach(function(cb) {
          cb.checked = false;
        });
        
        // すべて表示
        guideItems.forEach(function(item) {
          item.style.display = '';
        });
        
        // カウンター更新
        if (resultsCounter) {
          resultsCounter.textContent = guideItems.length + '件のガイドが見つかりました';
        }
      });
    }
    
  }, 500); // 少し遅延させて実行
  
});