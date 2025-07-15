/**
 * 統合サイト修正システム
 * すべての問題を一括で解決する最終的な修正スクリプト
 */

(function() {
  'use strict';
  
  console.log('🔧 統合サイト修正システム開始');
  
  let isProcessing = false;
  let processingTimeout = null;
  
  // サイト判定
  const isEnglishSite = window.location.href.includes('index-en.html');
  
  function unifiedSiteFix() {
    if (isProcessing) return;
    isProcessing = true;
    
    // 処理タイムアウト設定（500ms）
    if (processingTimeout) clearTimeout(processingTimeout);
    processingTimeout = setTimeout(() => {
      isProcessing = false;
    }, 500);
    
    try {
      // 1. 全ガイドカード強制表示
      const allGuideCards = document.querySelectorAll('.guide-item, .guide-card, [data-guide-id]');
      let visibleCount = 0;
      
      allGuideCards.forEach(card => {
        // 表示を強制
        card.classList.remove('d-none', 'hidden');
        card.style.display = 'block';
        card.style.visibility = 'visible';
        card.style.opacity = '1';
        visibleCount++;
      });
      
      // 2. 検索結果カウンター修正
      const searchCounters = document.querySelectorAll(
        '#search-results-counter, #guide-counter, .guide-counter, .counter-badge, [class*="counter"]'
      );
      
      searchCounters.forEach(counter => {
        if (counter.textContent !== undefined) {
          if (isEnglishSite) {
            // 英語サイト
            counter.textContent = `Found ${visibleCount} guides`;
            counter.innerHTML = `<i class="bi bi-people-fill me-2"></i>Found ${visibleCount} guides`;
          } else {
            // 日本語サイト
            counter.textContent = `${visibleCount}人のガイドが見つかりました`;
          }
        }
      });
      
      // 3. 全テキスト要素の言語統一
      document.querySelectorAll('*').forEach(element => {
        if (element.children.length === 0 && element.textContent) {
          const text = element.textContent.trim();
          
          if (isEnglishSite) {
            // 英語サイト：日本語→英語変換
            const translations = {
              '人のガイドが見つかりました': 'guides found',
              'ガイドを絞り込み': 'Filter Guides',
              '検索': 'Search',
              'リセット': 'Reset',
              '詳細を見る': 'See Details',
              '新規登録': 'Sign Up',
              'ログイン': 'Login',
              'もっと見る': 'Load More'
            };
            
            // X人のガイドが見つかりました パターン
            const matchJapanese = text.match(/(\d+)人のガイドが見つかりました/);
            if (matchJapanese) {
              element.textContent = `Found ${matchJapanese[1]} guides`;
              return;
            }
            
            // 個別変換
            Object.keys(translations).forEach(japanese => {
              if (text.includes(japanese)) {
                element.textContent = text.replace(new RegExp(japanese, 'g'), translations[japanese]);
              }
            });
            
          } else {
            // 日本語サイト：英語→日本語変換
            const translations = {
              'Found': '見つかりました',
              'guides found': '人のガイドが見つかりました',
              'Filter Guides': 'ガイドを絞り込み',
              'Search': '検索',
              'Reset': 'リセット',
              'See Details': '詳細を見る',
              'Sign Up': '新規登録',
              'Login': 'ログイン',
              'Load More': 'もっと見る'
            };
            
            // Found X guides パターン
            const matchEnglish = text.match(/Found (\d+) guides/);
            if (matchEnglish) {
              element.textContent = `${matchEnglish[1]}人のガイドが見つかりました`;
              return;
            }
            
            // 個別変換
            Object.keys(translations).forEach(english => {
              if (text.includes(english)) {
                element.textContent = text.replace(new RegExp(english, 'g'), translations[english]);
              }
            });
          }
        }
      });
      
      // 4. 新規登録ボタン修正
      const registerButtons = document.querySelectorAll('[onclick*="showRegisterOptions"], button[class*="btn"]');
      registerButtons.forEach(btn => {
        if (btn.textContent) {
          if (isEnglishSite) {
            if (btn.textContent.includes('新規登録') || btn.textContent.includes('登録')) {
              btn.textContent = 'Sign Up';
            }
          } else {
            if (btn.textContent.includes('Sign Up') || btn.textContent.includes('Register')) {
              btn.textContent = '新規登録';
            }
          }
        }
      });
      
      // 5. フィルター機能修正
      const filterButton = document.getElementById('toggle-filter-button');
      const filterCard = document.getElementById('filter-card');
      
      if (filterButton && filterCard) {
        filterButton.onclick = function() {
          const isHidden = filterCard.classList.contains('d-none');
          
          if (isHidden) {
            filterCard.classList.remove('d-none');
            filterButton.innerHTML = isEnglishSite ? 
              '<i class="bi bi-funnel-fill"></i> Hide Filter' : 
              '<i class="bi bi-funnel-fill"></i> フィルターを非表示';
          } else {
            filterCard.classList.add('d-none');
            filterButton.innerHTML = isEnglishSite ? 
              '<i class="bi bi-funnel"></i> Filter Guides' : 
              '<i class="bi bi-funnel"></i> ガイドを絞り込み';
          }
        };
      }
      
      // 6. フィルター入力値リセット
      const filterInputs = document.querySelectorAll('#filter-card input, #filter-card select');
      filterInputs.forEach(input => {
        if (input.type === 'checkbox') {
          input.checked = false;
        } else if (input.type === 'text') {
          input.value = '';
        } else if (input.tagName === 'SELECT') {
          input.selectedIndex = 0;
        }
      });
      
      console.log(`✅ 統合修正完了: ${visibleCount}ガイド表示 (${isEnglishSite ? '英語' : '日本語'})`);
      
    } catch (error) {
      console.error('統合修正エラー:', error);
    } finally {
      isProcessing = false;
    }
  }
  
  function setupFilterFunctionality() {
    // フィルター機能を有効化
    const applyFilters = () => {
      const locationFilter = document.getElementById('location-filter');
      const languageFilter = document.getElementById('language-filter');
      const feeFilter = document.getElementById('fee-filter');
      const keywordInputs = document.querySelectorAll('.keyword-checkbox:checked');
      
      const allCards = document.querySelectorAll('.guide-item, .guide-card');
      let visibleCount = 0;
      
      allCards.forEach(card => {
        let shouldShow = true;
        
        // 地域フィルター
        if (locationFilter && locationFilter.value) {
          const cardLocation = card.querySelector('[data-location]')?.getAttribute('data-location') || 
                              card.getAttribute('data-location') || '';
          if (!cardLocation.includes(locationFilter.value)) {
            shouldShow = false;
          }
        }
        
        // 言語フィルター
        if (languageFilter && languageFilter.value) {
          const cardLanguages = card.querySelector('[data-languages]')?.getAttribute('data-languages') || 
                               card.getAttribute('data-languages') || '';
          if (!cardLanguages.includes(languageFilter.value)) {
            shouldShow = false;
          }
        }
        
        // 料金フィルター
        if (feeFilter && feeFilter.value) {
          const cardFee = parseInt(card.querySelector('[data-fee]')?.getAttribute('data-fee') || 
                                 card.getAttribute('data-fee') || '0');
          const feeRange = feeFilter.value;
          
          if (feeRange === '6000-10000' && (cardFee < 6000 || cardFee > 10000)) shouldShow = false;
          if (feeRange === '10000-15000' && (cardFee < 10000 || cardFee > 15000)) shouldShow = false;
          if (feeRange === '15000-20000' && (cardFee < 15000 || cardFee > 20000)) shouldShow = false;
          if (feeRange === '20000+' && cardFee < 20000) shouldShow = false;
        }
        
        // キーワードフィルター
        if (keywordInputs.length > 0) {
          const cardKeywords = card.querySelector('[data-keywords]')?.getAttribute('data-keywords') || 
                             card.getAttribute('data-keywords') || '';
          const hasKeyword = Array.from(keywordInputs).some(input => 
            cardKeywords.includes(input.value)
          );
          if (!hasKeyword) shouldShow = false;
        }
        
        // 表示/非表示切り替え
        if (shouldShow) {
          card.classList.remove('d-none');
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.classList.add('d-none');
          card.style.display = 'none';
        }
      });
      
      // カウンター更新
      const counters = document.querySelectorAll('#search-results-counter, #guide-counter, .counter-badge');
      counters.forEach(counter => {
        if (isEnglishSite) {
          counter.textContent = `Found ${visibleCount} guides`;
        } else {
          counter.textContent = `${visibleCount}人のガイドが見つかりました`;
        }
      });
    };
    
    // フィルター変更時に実行
    const filterElements = document.querySelectorAll(
      '#location-filter, #language-filter, #fee-filter, .keyword-checkbox'
    );
    
    filterElements.forEach(element => {
      element.addEventListener('change', applyFilters);
    });
    
    // リセットボタン
    const resetButton = document.getElementById('reset-filters');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        filterElements.forEach(element => {
          if (element.type === 'checkbox') {
            element.checked = false;
          } else if (element.tagName === 'SELECT') {
            element.selectedIndex = 0;
          }
        });
        unifiedSiteFix(); // 全ガイド表示復帰
      });
    }
  }
  
  function initialize() {
    // 即座に実行
    unifiedSiteFix();
    
    // フィルター機能設定
    setupFilterFunctionality();
    
    // 継続監視（3秒間隔）
    setInterval(unifiedSiteFix, 3000);
    
    // DOM変更監視
    const observer = new MutationObserver(() => {
      setTimeout(unifiedSiteFix, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    console.log('✅ 統合サイト修正システム初期化完了');
  }
  
  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  window.addEventListener('load', () => {
    setTimeout(initialize, 300);
  });
  
})();