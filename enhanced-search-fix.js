/**
 * 強化版検索システム
 * 6人のガイド表示と検索フィルター機能の完全修正
 */

(function() {
  'use strict';
  
  console.log('🔍 強化版検索システム開始');
  
  // 初期化
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(setupSearchSystem, 100);
      });
    } else {
      setTimeout(setupSearchSystem, 100);
    }
  }
  
  function setupSearchSystem() {
    console.log('🔧 検索システムセットアップ開始');
    
    // ガイド数カウントの修正
    updateGuideCount();
    
    // フィルターシステムの設定
    setupFilters();
    
    // 「もっと見る」ボタンの処理
    setupLoadMoreButton();
    
    console.log('✅ 強化版検索システム完了');
  }
  
  // ガイド数を正確にカウント
  function updateGuideCount() {
    const allGuides = document.querySelectorAll('.guide-item');
    const visibleGuides = document.querySelectorAll('.guide-item:not(.d-none)');
    const countElement = document.getElementById('guides-count');
    
    console.log(`📊 全ガイド数: ${allGuides.length}, 表示中: ${visibleGuides.length}`);
    
    if (countElement) {
      countElement.textContent = `${visibleGuides.length}人のガイドが見つかりました`;
    }
  }
  
  // フィルターシステムの設定
  function setupFilters() {
    // フィルタートグルボタン
    const filterToggle = document.getElementById('filter-toggle');
    const filterSection = document.getElementById('filter-section');
    
    if (filterToggle && filterSection) {
      filterToggle.addEventListener('click', function() {
        filterSection.classList.toggle('d-none');
        console.log('📋 フィルター表示切り替え');
      });
    }
    
    // 地域フィルター
    const locationFilter = document.getElementById('location-filter');
    if (locationFilter) {
      locationFilter.addEventListener('change', applyFilters);
    }
    
    // 言語フィルター
    const languageFilter = document.getElementById('language-filter');
    if (languageFilter) {
      languageFilter.addEventListener('change', applyFilters);
    }
    
    // 料金フィルター
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    if (minPrice) minPrice.addEventListener('input', applyFilters);
    if (maxPrice) maxPrice.addEventListener('input', applyFilters);
    
    // キーワードチェックボックス
    const keywordCheckboxes = document.querySelectorAll('input[name="keywords"]');
    keywordCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', applyFilters);
    });
    
    // カスタムキーワード入力
    const customKeywords = document.getElementById('custom-keywords');
    if (customKeywords) {
      customKeywords.addEventListener('input', applyFilters);
    }
    
    console.log('📋 フィルターイベントリスナー設定完了');
  }
  
  // フィルターを適用
  function applyFilters() {
    console.log('🔍 フィルター適用開始');
    
    const locationFilter = document.getElementById('location-filter')?.value || '';
    const languageFilter = document.getElementById('language-filter')?.value || '';
    const minPrice = parseInt(document.getElementById('min-price')?.value || '0');
    const maxPrice = parseInt(document.getElementById('max-price')?.value || '999999');
    
    // 選択されたキーワードを取得
    const selectedKeywords = Array.from(document.querySelectorAll('input[name="keywords"]:checked'))
      .map(cb => cb.value);
    
    // カスタムキーワードを取得
    const customKeywords = document.getElementById('custom-keywords')?.value || '';
    const customKeywordList = customKeywords ? customKeywords.split(',').map(k => k.trim()) : [];
    
    const allKeywords = [...selectedKeywords, ...customKeywordList];
    
    console.log('📊 フィルター条件:', { locationFilter, languageFilter, minPrice, maxPrice, allKeywords });
    
    // 全ガイドアイテムを取得
    const guideItems = document.querySelectorAll('.guide-item');
    let visibleCount = 0;
    
    guideItems.forEach(item => {
      const card = item.querySelector('.guide-card');
      if (!card) return;
      
      const location = card.getAttribute('data-location') || '';
      const languages = card.getAttribute('data-languages') || '';
      const fee = parseInt(card.getAttribute('data-fee') || '0');
      const keywords = card.getAttribute('data-keywords') || '';
      
      let shouldShow = true;
      
      // 地域フィルター
      if (locationFilter && !location.includes(locationFilter)) {
        shouldShow = false;
      }
      
      // 言語フィルター
      if (languageFilter && !languages.includes(languageFilter)) {
        shouldShow = false;
      }
      
      // 料金フィルター
      if (fee < minPrice || fee > maxPrice) {
        shouldShow = false;
      }
      
      // キーワードフィルター
      if (allKeywords.length > 0) {
        const hasKeyword = allKeywords.some(keyword => 
          keywords.includes(keyword) || 
          card.textContent.includes(keyword)
        );
        if (!hasKeyword) {
          shouldShow = false;
        }
      }
      
      // 表示/非表示を設定
      if (shouldShow) {
        item.classList.remove('d-none');
        visibleCount++;
      } else {
        item.classList.add('d-none');
      }
    });
    
    // ガイド数を更新
    const countElement = document.getElementById('guides-count');
    if (countElement) {
      countElement.textContent = `${visibleCount}人のガイドが見つかりました`;
    }
    
    console.log(`✅ フィルター適用完了: ${visibleCount}人表示`);
  }
  
  // 「もっと見る」ボタンの処理
  function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-guides');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() {
        // 現在は全て表示されているので、メッセージを表示
        alert('すべてのガイドが表示されています');
      });
    }
  }
  
  // グローバル関数として公開
  window.applyFilters = applyFilters;
  window.updateGuideCount = updateGuideCount;
  
  // 初期化実行
  initialize();
  
})();