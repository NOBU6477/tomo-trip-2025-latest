/**
 * 統一フィルターシステム
 * 日本語サイト、英語サイト両方で動作する統一されたフィルター機能
 */

class UnifiedFilterSystem {
  constructor() {
    this.isEnglishSite = document.documentElement.lang === 'en' || 
                        window.location.pathname.includes('index-en') ||
                        document.querySelector('#guide-counter'); // 英語サイト識別子
    
    this.filterElements = {
      toggleButton: document.getElementById('toggle-filter-button'),
      filterCard: document.getElementById('filter-card'),
      locationFilter: document.getElementById('location-filter'),
      languageFilter: document.getElementById('language-filter'), 
      minFeeFilter: document.getElementById('min-fee-filter'),
      maxFeeFilter: document.getElementById('max-fee-filter'),
      keywordCheckboxes: document.querySelectorAll('.keyword-checkbox'),
      customKeywords: document.getElementById('custom-keywords') || document.getElementById('keyword-filter-custom'),
      resetButton: document.getElementById('reset-filters') || document.querySelector('[onclick="resetFilters()"]'),
      applyButton: document.getElementById('apply-filters') || document.querySelector('[onclick="searchGuides()"]'),
      guideContainer: document.getElementById('guide-cards-container'),
      counter: this.isEnglishSite ? 
        document.getElementById('guide-counter') : 
        document.getElementById('guides-count')
    };

    this.init();
  }

  init() {
    console.log(`統一フィルターシステム初期化 - ${this.isEnglishSite ? '英語' : '日本語'}サイト`);
    
    this.setupFilterToggle();
    this.setupFilterHandlers();
    this.updateCounter();
  }

  setupFilterToggle() {
    if (!this.filterElements.toggleButton || !this.filterElements.filterCard) {
      console.error('フィルタートグル要素が見つかりません');
      return;
    }

    this.filterElements.toggleButton.addEventListener('click', () => {
      this.toggleFilter();
    });
  }

  toggleFilter() {
    const { toggleButton, filterCard } = this.filterElements;
    const isHidden = filterCard.classList.contains('d-none');

    if (isHidden) {
      // フィルターを表示
      filterCard.classList.remove('d-none');
      
      if (this.isEnglishSite) {
        toggleButton.innerHTML = '<i class="bi bi-funnel-fill"></i> Hide Filters';
      } else {
        toggleButton.innerHTML = '<i class="bi bi-funnel-fill"></i> フィルターを閉じる';
      }
      
      toggleButton.classList.remove('btn-outline-primary');
      toggleButton.classList.add('btn-primary');

      // スムーズスクロール
      setTimeout(() => {
        filterCard.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);

    } else {
      // フィルターを隠す
      filterCard.classList.add('d-none');
      
      if (this.isEnglishSite) {
        toggleButton.innerHTML = '<i class="bi bi-funnel"></i> Filter Guides';
      } else {
        toggleButton.innerHTML = '<i class="bi bi-funnel"></i> フィルターを開く';
      }
      
      toggleButton.classList.remove('btn-primary');
      toggleButton.classList.add('btn-outline-primary');
    }
  }

  setupFilterHandlers() {
    // 各フィルター要素にイベントリスナーを追加
    const elements = [
      this.filterElements.locationFilter,
      this.filterElements.languageFilter,
      this.filterElements.minFeeFilter,
      this.filterElements.maxFeeFilter,
      this.filterElements.customKeywords
    ];

    elements.forEach(element => {
      if (element) {
        element.addEventListener('change', () => this.applyFilters());
        element.addEventListener('input', () => this.applyFilters());
      }
    });

    // キーワードチェックボックス
    this.filterElements.keywordCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyFilters());
    });

    // リセットボタン
    if (this.filterElements.resetButton) {
      this.filterElements.resetButton.addEventListener('click', () => this.resetFilters());
    }

    // 適用ボタン（すでにリアルタイムで動作するが念のため）
    if (this.filterElements.applyButton) {
      this.filterElements.applyButton.addEventListener('click', () => this.applyFilters());
    }
  }

  applyFilters() {
    const filters = this.getFilterValues();
    console.log('フィルター適用:', filters);

    // 統一ガイドシステムがあるかチェック
    if (window.unifiedGuideSystem) {
      window.unifiedGuideSystem.applyFilters(filters);
    } else {
      console.warn('統一ガイドシステムが利用できません');
      this.fallbackFilter(filters);
    }

    this.updateCounter();
  }

  getFilterValues() {
    const selectedKeywords = [];
    
    // チェックボックスから選択されたキーワード
    this.filterElements.keywordCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedKeywords.push(checkbox.value);
      }
    });

    // カスタムキーワード
    if (this.filterElements.customKeywords && this.filterElements.customKeywords.value.trim()) {
      const customKeywords = this.filterElements.customKeywords.value
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      selectedKeywords.push(...customKeywords);
    }

    return {
      location: this.filterElements.locationFilter ? this.filterElements.locationFilter.value : '',
      language: this.filterElements.languageFilter ? this.filterElements.languageFilter.value : '',
      minFee: this.filterElements.minFeeFilter ? parseInt(this.filterElements.minFeeFilter.value) || 0 : 0,
      maxFee: this.filterElements.maxFeeFilter ? parseInt(this.filterElements.maxFeeFilter.value) || Infinity : Infinity,
      keywords: selectedKeywords
    };
  }

  fallbackFilter(filters) {
    // 統一ガイドシステムが利用できない場合のフォールバック
    if (!this.filterElements.guideContainer) return;

    const guideCards = this.filterElements.guideContainer.querySelectorAll('.guide-card, .col-md-4, .col-lg-4');
    let visibleCount = 0;

    guideCards.forEach(card => {
      const visible = this.matchesFilters(card, filters);
      const parentElement = card.closest('.col-md-4, .col-lg-4, .guide-item');
      
      if (parentElement) {
        parentElement.style.display = visible ? '' : 'none';
      } else {
        card.style.display = visible ? '' : 'none';
      }
      
      if (visible) visibleCount++;
    });

    this.updateCounterDisplay(visibleCount);
  }

  matchesFilters(card, filters) {
    // データ属性またはテキスト内容からマッチングを判定
    const cardData = {
      location: card.dataset.location || card.querySelector('.guide-location')?.textContent || '',
      languages: card.dataset.languages || this.extractLanguages(card),
      fee: parseInt(card.dataset.fee) || this.extractFee(card),
      keywords: card.dataset.keywords || this.extractKeywords(card)
    };

    // 地域フィルター
    if (filters.location && !cardData.location.includes(filters.location)) {
      return false;
    }

    // 言語フィルター
    if (filters.language && !cardData.languages.includes(filters.language)) {
      return false;
    }

    // 料金フィルター
    if (cardData.fee < filters.minFee || cardData.fee > filters.maxFee) {
      return false;
    }

    // キーワードフィルター
    if (filters.keywords.length > 0) {
      const hasMatchingKeyword = filters.keywords.some(keyword => 
        cardData.keywords.includes(keyword) || 
        card.textContent.toLowerCase().includes(keyword.toLowerCase())
      );
      if (!hasMatchingKeyword) {
        return false;
      }
    }

    return true;
  }

  extractLanguages(card) {
    const languageBadges = card.querySelectorAll('.badge, .guide-lang');
    return Array.from(languageBadges).map(badge => badge.textContent.trim()).join(',');
  }

  extractFee(card) {
    const feeText = card.querySelector('.price-badge, .badge')?.textContent || '';
    const match = feeText.match(/[¥$]?(\d+,?\d*)/);
    return match ? parseInt(match[1].replace(',', '')) : 0;
  }

  extractKeywords(card) {
    // カードのテキスト内容からキーワードを推定
    const text = card.textContent.toLowerCase();
    const keywords = [];
    
    if (text.includes('グルメ') || text.includes('gourmet') || text.includes('food')) keywords.push('グルメ');
    if (text.includes('写真') || text.includes('photo')) keywords.push('写真スポット');
    if (text.includes('ナイト') || text.includes('night')) keywords.push('ナイトツアー');
    if (text.includes('料理') || text.includes('cuisine') || text.includes('cooking')) keywords.push('料理');
    if (text.includes('アクティビティ') || text.includes('activity')) keywords.push('アクティビティ');
    
    return keywords.join(',');
  }

  resetFilters() {
    // すべてのフィルターをリセット
    if (this.filterElements.locationFilter) this.filterElements.locationFilter.value = '';
    if (this.filterElements.languageFilter) this.filterElements.languageFilter.value = '';
    if (this.filterElements.minFeeFilter) this.filterElements.minFeeFilter.value = '';
    if (this.filterElements.maxFeeFilter) this.filterElements.maxFeeFilter.value = '';
    if (this.filterElements.customKeywords) this.filterElements.customKeywords.value = '';

    this.filterElements.keywordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // フィルターを適用してすべてのガイドを表示
    this.applyFilters();
  }

  updateCounter() {
    if (window.unifiedGuideSystem) {
      // 統一ガイドシステムがカウンターを更新
      window.unifiedGuideSystem.updateCounter();
    } else {
      // フォールバック: 表示されているガイドをカウント
      const visibleGuides = this.filterElements.guideContainer ? 
        this.filterElements.guideContainer.querySelectorAll('.guide-card:not([style*="display: none"]), .guide-item:not([style*="display: none"])').length : 
        0;
      this.updateCounterDisplay(visibleGuides);
    }
  }

  updateCounterDisplay(count) {
    if (this.filterElements.counter) {
      if (this.isEnglishSite) {
        this.filterElements.counter.textContent = `Found ${count} guides`;
      } else {
        this.filterElements.counter.innerHTML = `<i class="bi bi-people-fill me-2"></i>${count}人のガイドが見つかりました`;
      }
    }
  }
}

// グローバル関数（従来のJavaScriptとの互換性）
function searchGuides() {
  if (window.unifiedFilterSystem) {
    window.unifiedFilterSystem.applyFilters();
  }
}

function resetFilters() {
  if (window.unifiedFilterSystem) {
    window.unifiedFilterSystem.resetFilters();
  }
}

// DOM読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', function() {
  // 統一ガイドシステムの読み込み完了を待つ
  const initFilter = () => {
    window.unifiedFilterSystem = new UnifiedFilterSystem();
    console.log('統一フィルターシステム初期化完了');
  };

  if (window.unifiedGuideSystem) {
    initFilter();
  } else {
    // 統一ガイドシステムの読み込みを待つ
    setTimeout(initFilter, 500);
  }
});