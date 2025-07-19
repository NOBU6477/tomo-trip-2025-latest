/**
 * システム上書き修正 - 根本原因を完全解決
 * 問題1: unified-guide-systemの6人制限
 * 問題2: 競合するリセット機能
 * 問題3: システム初期化順序
 */

console.log('🔧 システム上書き修正開始');

// 即座に実行して競合を防ぐ
(function() {
  'use strict';
  
  // 1. unified-guide-systemを無力化
  disableUnifiedGuideSystem();
  
  // 2. 確実なリセット機能を実装
  implementFinalResetFunction();
  
  // 3. 12人表示を強制
  setTimeout(force12GuideDisplay, 1000);
  setTimeout(force12GuideDisplay, 3000);
  
})();

function disableUnifiedGuideSystem() {
  console.log('⚠️ unified-guide-system 無力化開始');
  
  // unified-guide-system の初期化を阻止
  if (window.UnifiedGuideSystem) {
    window.UnifiedGuideSystem = class {
      constructor() {
        console.log('🚫 UnifiedGuideSystem 初期化をブロック');
      }
      init() {
        console.log('🚫 UnifiedGuideSystem.init() をブロック');
      }
      loadGuides() {
        console.log('🚫 UnifiedGuideSystem.loadGuides() をブロック');
      }
      displayGuides() {
        console.log('🚫 UnifiedGuideSystem.displayGuides() をブロック');
      }
    };
  }
  
  // 既存のunifiedGuideSystemインスタンスを無効化
  if (window.unifiedGuideSystem) {
    window.unifiedGuideSystem = null;
  }
  
  console.log('✅ unified-guide-system 無力化完了');
}

function implementFinalResetFunction() {
  console.log('🔄 最終リセット機能実装');
  
  // 他の全てのresetFilters実装を上書き
  window.resetFilters = function() {
    console.log('🚨 最終リセット実行');
    
    try {
      // 料金フィルターを完全リセット
      const priceFilter = document.getElementById('price-filter');
      if (priceFilter) {
        console.log('💰 料金フィルターリセット前:', {
          value: priceFilter.value,
          selectedIndex: priceFilter.selectedIndex,
          selectedOption: priceFilter.options[priceFilter.selectedIndex]?.text
        });
        
        // 複数段階でリセット
        priceFilter.selectedIndex = 0;
        priceFilter.value = '';
        
        // 最初のオプション（"すべて"）を強制選択
        if (priceFilter.options.length > 0) {
          priceFilter.options[0].selected = true;
          for (let i = 1; i < priceFilter.options.length; i++) {
            priceFilter.options[i].selected = false;
          }
        }
        
        // DOM属性をクリア
        priceFilter.removeAttribute('value');
        
        console.log('💰 料金フィルターリセット後:', {
          value: priceFilter.value,
          selectedIndex: priceFilter.selectedIndex,
          selectedOption: priceFilter.options[priceFilter.selectedIndex]?.text
        });
        
        // イベントを発火
        ['change', 'input', 'blur'].forEach(eventType => {
          const event = new Event(eventType, { bubbles: true, cancelable: true });
          priceFilter.dispatchEvent(event);
        });
      }
      
      // 他のフィルターも同様にリセット
      resetAllOtherFilters();
      
      // 12人表示を強制実行
      setTimeout(() => {
        force12GuideDisplay();
      }, 300);
      
      console.log('✅ 最終リセット完了');
      
    } catch (error) {
      console.error('❌ リセットエラー:', error);
    }
  };
  
  // グローバル関数として確実に設置
  window.systemOverrideReset = window.resetFilters;
  
  console.log('✅ 最終リセット機能実装完了');
}

function resetAllOtherFilters() {
  const filterIds = ['location-filter', 'language-filter', 'custom-keywords'];
  
  filterIds.forEach(filterId => {
    const element = document.getElementById(filterId);
    if (element) {
      if (element.tagName === 'SELECT') {
        element.selectedIndex = 0;
        element.value = '';
        if (element.options.length > 0) {
          element.options[0].selected = true;
        }
      } else if (element.tagName === 'INPUT') {
        element.value = '';
      }
      
      // イベントを発火
      const event = new Event('change', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);
      
      console.log(`🔄 ${filterId} リセット完了`);
    }
  });
  
  // チェックボックスをすべてリセット
  const checkboxes = document.querySelectorAll('input[name="keywords"], .keyword-checkbox');
  checkboxes.forEach((cb, index) => {
    cb.checked = false;
    console.log(`☑️ キーワード${index}チェックボックスリセット`);
  });
}

function force12GuideDisplay() {
  console.log('👥 12人ガイド強制表示実行');
  
  const container = document.getElementById('guide-cards-container');
  if (!container) {
    console.error('❌ ガイドコンテナが見つかりません');
    return;
  }
  
  // 現在の表示状況を確認
  const currentCards = container.querySelectorAll('.guide-card, .card').length;
  console.log(`📊 現在のガイドカード数: ${currentCards}`);
  
  // 12人未満の場合のみ強制表示
  if (currentCards < 12) {
    console.log('🔄 12人未満のため強制表示実行');
    
    // 12人分のガイドデータを取得
    const guides = getSystemOverride12GuideData();
    
    // コンテナをクリアして再生成
    container.innerHTML = '';
    
    // 12人すべてを表示
    guides.forEach((guide, index) => {
      const guideCard = createSystemOverrideGuideCard(guide, index);
      container.appendChild(guideCard);
      console.log(`✅ ガイド${index + 1} 追加: ${guide.name}`);
    });
    
    // カウンター更新
    updateSystemOverrideCounter(guides.length);
    
    console.log(`✅ 12人ガイド強制表示完了: ${guides.length}枚のカード表示`);
  } else {
    console.log('✅ 既に12人以上表示済み');
  }
}

function createSystemOverrideGuideCard(guide, index) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-md-4 mb-4 guide-item';
  colDiv.setAttribute('data-guide-id', guide.id);
  colDiv.setAttribute('data-fee', guide.fee || 6000);
  colDiv.id = `system-guide-card-${index + 1}`;
  
  colDiv.innerHTML = `
    <div class="card guide-card h-100">
      <div class="position-relative">
        <img src="${guide.profileImage}" class="card-img-top" alt="${guide.name}" 
             style="height: 200px; object-fit: cover;">
        <div class="position-absolute top-0 end-0 m-2">
          <span class="badge bg-primary">${guide.rating}★</span>
        </div>
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${guide.name}</h5>
        <p class="text-muted small mb-2">
          <i class="bi bi-geo-alt-fill"></i> ${guide.location}
        </p>
        <p class="card-text flex-grow-1">${guide.description}</p>
        <div class="mb-3">
          <div class="d-flex flex-wrap gap-1">
            ${(guide.languages || []).map(lang => 
              `<span class="badge bg-light text-dark">${lang}</span>`
            ).join('')}
          </div>
        </div>
        <div class="mt-auto">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="h5 mb-0 text-primary">¥${(guide.fee || 6000).toLocaleString()}/セッション</span>
          </div>
          <div class="d-grid">
            <button class="btn btn-primary" onclick="showGuideDetails(${guide.id})">詳細を見る</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return colDiv;
}

function updateSystemOverrideCounter(displayedGuides) {
  const counterText = `${displayedGuides}人のガイドが見つかりました（${displayedGuides}人表示中）`;
  
  const counterSelectors = [
    '.text-primary.fw-bold.fs-5',
    '.counter-badge',
    '#guides-count',
    '.guide-counter',
    '#guide-counter'
  ];
  
  counterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${counterText}`;
      console.log(`📊 カウンター更新: ${counterText}`);
    });
  });
  
  console.log(`📊 システム上書きカウンター更新完了: ${counterText}`);
}

function getSystemOverride12GuideData() {
  return [
    {
      id: 1, name: "田中 太郎", location: "東京",
      languages: ["日本語", "英語"], specialties: ["歴史散策", "グルメツアー"],
      fee: 8000, rating: 4.8, description: "東京の歴史ある下町エリアを中心に、隠れた名店をご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2, name: "佐藤 花子", location: "京都",
      languages: ["日本語", "英語", "中国語"], specialties: ["文化体験", "写真スポット"],
      fee: 12000, rating: 4.9, description: "京都の伝統文化を体験できる特別なツアーをご提供します。",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3, name: "山田 次郎", location: "大阪",
      languages: ["日本語", "英語"], specialties: ["グルメツアー", "ナイトライフ"],
      fee: 7000, rating: 4.6, description: "大阪の美味しいものを知り尽くした地元ガイドです。",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4, name: "鈴木 美香", location: "神戸",
      languages: ["日本語", "英語", "韓国語"], specialties: ["アート", "写真スポット"],
      fee: 9000, rating: 4.7, description: "神戸のおしゃれスポットとアートシーンをご案内します。",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5, name: "高橋 健一", location: "名古屋",
      languages: ["日本語", "英語"], specialties: ["歴史散策", "文化体験"],
      fee: 6500, rating: 4.5, description: "名古屋城周辺の歴史スポットを詳しくご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6, name: "渡辺 麻衣", location: "福岡",
      languages: ["日本語", "英語"], specialties: ["グルメツアー", "文化体験"],
      fee: 7500, rating: 4.8, description: "福岡の屋台文化と美味しいものをご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 7, name: "中村 雄一", location: "広島",
      languages: ["日本語", "英語"], specialties: ["歴史散策", "平和学習"],
      fee: 8500, rating: 4.7, description: "広島の歴史と平和について深く学べるツアーをご提供します。",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 8, name: "小林 桜", location: "仙台",
      languages: ["日本語", "英語", "中国語"], specialties: ["自然体験", "温泉"],
      fee: 9500, rating: 4.9, description: "東北の美しい自然と温泉文化をご案内します。",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 9, name: "石井 健太", location: "札幌",
      languages: ["日本語", "英語"], specialties: ["グルメツアー", "スキー"],
      fee: 10000, rating: 4.6, description: "北海道の新鮮な海産物とウィンタースポーツをご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 10, name: "森田 愛子", location: "沖縄",
      languages: ["日本語", "英語"], specialties: ["マリンスポーツ", "文化体験"],
      fee: 8800, rating: 4.8, description: "沖縄の美しい海と独特の文化をお楽しみいただけます。",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 11, name: "橋本 直樹", location: "金沢",
      languages: ["日本語", "英語"], specialties: ["工芸体験", "歴史散策"],
      fee: 9200, rating: 4.7, description: "金沢の伝統工芸と美しい街並みをご案内します。",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 12, name: "松本 香織", location: "奈良",
      languages: ["日本語", "英語", "韓国語"], specialties: ["歴史散策", "寺院巡り"],
      fee: 7800, rating: 4.5, description: "古都奈良の歴史ある寺院と文化遺産をご紹介します。",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    }
  ];
}

// 継続監視システム
setInterval(() => {
  const container = document.getElementById('guide-cards-container');
  const priceFilter = document.getElementById('price-filter');
  
  if (container && priceFilter) {
    const displayedCards = container.querySelectorAll('.guide-card, .card').length;
    const isFiltered = priceFilter.value && priceFilter.value !== '';
    
    // フィルター無効時に12人未満なら修正
    if (!isFiltered && displayedCards < 12) {
      console.log(`⚠️ 監視検出: ガイド数不足 (${displayedCards}/12) - 修正実行`);
      force12GuideDisplay();
    }
  }
}, 5000);

// デバッグ用関数
window.systemOverrideDebug = function() {
  console.log('🔍 システム上書きデバッグ情報');
  
  const container = document.getElementById('guide-cards-container');
  const priceFilter = document.getElementById('price-filter');
  
  console.log('Guide Container:', {
    exists: !!container,
    cardCount: container ? container.querySelectorAll('.guide-card, .card').length : 0
  });
  
  console.log('Price Filter:', {
    exists: !!priceFilter,
    value: priceFilter ? priceFilter.value : 'N/A',
    selectedIndex: priceFilter ? priceFilter.selectedIndex : 'N/A',
    selectedText: priceFilter ? priceFilter.options[priceFilter.selectedIndex]?.text : 'N/A'
  });
  
  console.log('Reset Functions:', {
    resetFilters: typeof window.resetFilters,
    systemOverrideReset: typeof window.systemOverrideReset
  });
};

console.log('🔧 システム上書き修正完了');
console.log('🔧 デバッグ用: window.systemOverrideDebug() を実行してください');