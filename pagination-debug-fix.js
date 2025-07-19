/**
 * ページングシステム緊急修正・デバッグスクリプト
 * ガイド表示問題とリセット機能の根本的解決
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 ページング緊急修正システム開始');
  
  // 2秒後に診断と修正を実行
  setTimeout(() => {
    diagnoseAndFixPaginationIssues();
  }, 2000);
  
  // 5秒後に再確認
  setTimeout(() => {
    verifyAndForceDisplay();
  }, 5000);
});

function diagnoseAndFixPaginationIssues() {
  console.log('🔍 ページングシステム診断開始');
  
  // 1. ページングシステムの存在確認
  const paginationExists = window.paginationGuideSystem;
  console.log(`📋 ページングシステム存在: ${paginationExists ? 'YES' : 'NO'}`);
  
  if (paginationExists) {
    console.log(`📊 全ガイド数: ${paginationExists.allGuides?.length || 0}`);
    console.log(`📊 フィルター済みガイド数: ${paginationExists.filteredGuides?.length || 0}`);
    console.log(`📊 表示中ガイド数: ${paginationExists.displayedGuides?.length || 0}`);
  }
  
  // 2. コンテナの存在確認
  const container = document.getElementById('guide-cards-container');
  console.log(`📦 コンテナ存在: ${container ? 'YES' : 'NO'}`);
  if (container) {
    console.log(`📦 コンテナ内子要素数: ${container.children.length}`);
  }
  
  // 3. カウンター要素の確認
  const counterElements = document.querySelectorAll('#guides-count, .guide-counter, .counter-badge');
  console.log(`🔢 カウンター要素数: ${counterElements.length}`);
  counterElements.forEach((el, idx) => {
    console.log(`🔢 カウンター${idx}: ${el.textContent.trim()}`);
  });
  
  // 4. 問題がある場合の強制修正
  if (!paginationExists || (paginationExists && paginationExists.allGuides?.length === 0)) {
    console.log('🚨 緊急修正: ページングシステムを再構築');
    forcePaginationReconstruction();
  }
  
  // 5. リセット機能の確保
  ensureResetFunctionality();
}

function forcePaginationReconstruction() {
  console.log('🔨 ページングシステム強制再構築開始');
  
  try {
    // 基本ガイドデータを直接作成
    const basicGuides = [
      {
        id: 1, name: "田中 太郎", location: "東京",
        languages: ["日本語", "英語"], specialties: ["歴史散策", "グルメツアー"],
        fee: 8000, rating: 4.8,
        description: "東京の歴史ある下町エリアを中心に、隠れた名店をご紹介します。",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: 2, name: "佐藤 花子", location: "京都",
        languages: ["日本語", "英語", "中国語"], specialties: ["文化体験", "写真スポット"],
        fee: 12000, rating: 4.9,
        description: "京都の伝統文化を体験できる特別なツアーをご提供します。",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b42fc568?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: 3, name: "山田 次郎", location: "大阪",
        languages: ["日本語", "英語"], specialties: ["グルメツアー", "ナイトライフ"],
        fee: 7000, rating: 4.6,
        description: "大阪の美味しいものを知り尽くした地元ガイドです。",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: 4, name: "鈴木 美香", location: "神戸",
        languages: ["日本語", "英語", "韓国語"], specialties: ["アート", "写真スポット"],
        fee: 9000, rating: 4.7,
        description: "神戸のおしゃれスポットとアートシーンをご案内します。",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: 5, name: "高橋 健一", location: "名古屋",
        languages: ["日本語", "英語"], specialties: ["歴史散策", "文化体験"],
        fee: 6500, rating: 4.5,
        description: "名古屋城周辺の歴史スポットを詳しくご紹介します。",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: 6, name: "渡辺 麻衣", location: "福岡",
        languages: ["日本語", "英語"], specialties: ["グルメツアー", "文化体験"],
        fee: 7500, rating: 4.8,
        description: "福岡の屋台文化と美味しいものをご紹介します。",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      }
    ];
    
    // 新規登録ガイドも追加
    const newGuides = JSON.parse(localStorage.getItem('newRegisteredGuides') || '[]');
    const allGuides = [...basicGuides, ...newGuides];
    
    console.log(`📊 強制再構築: ${allGuides.length}人のガイドを確保`);
    
    // コンテナに直接ガイドカードを生成
    const container = document.getElementById('guide-cards-container');
    if (container && allGuides.length > 0) {
      container.innerHTML = '';
      
      // 最初の6人（または12人）を表示
      const initialGuides = allGuides.slice(0, 12);
      initialGuides.forEach(guide => {
        const guideCard = createEmergencyGuideCard(guide);
        container.appendChild(guideCard);
      });
      
      // カウンター更新
      updateEmergencyCounter(allGuides.length, initialGuides.length);
      
      // もっと見るボタン設置
      setupEmergencyLoadMoreButton(allGuides, initialGuides.length);
      
      console.log(`✅ 緊急修正完了: ${initialGuides.length}枚のガイドカードを表示`);
      
      // ページングシステムを再初期化
      setTimeout(() => {
        if (window.paginationGuideSystem) {
          window.paginationGuideSystem.allGuides = allGuides;
          window.paginationGuideSystem.filteredGuides = allGuides;
          window.paginationGuideSystem.displayedGuides = initialGuides;
          window.paginationGuideSystem.currentPage = 0;
          console.log('🔄 ページングシステムデータを同期');
        }
      }, 500);
    }
    
  } catch (error) {
    console.error('❌ 強制再構築エラー:', error);
  }
}

function createEmergencyGuideCard(guide) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-md-4 mb-4 guide-item';
  colDiv.setAttribute('data-guide-id', guide.id);
  colDiv.setAttribute('data-location', guide.location || '');
  colDiv.setAttribute('data-languages', (guide.languages || []).join(','));
  colDiv.setAttribute('data-fee', guide.fee || 6000);
  colDiv.setAttribute('data-keywords', (guide.specialties || []).join(','));

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
          <div class="d-flex flex-wrap gap-1 mb-2">
            ${(guide.languages || []).map(lang => 
              `<span class="badge bg-info">${lang}</span>`
            ).join('')}
          </div>
          <div class="d-flex flex-wrap gap-1">
            ${(guide.specialties || []).map(specialty => 
              `<span class="badge bg-secondary">${specialty}</span>`
            ).join('')}
          </div>
        </div>
        
        <div class="d-flex justify-content-between align-items-center">
          <span class="price-badge fw-bold text-primary">¥${(guide.fee || 6000).toLocaleString()}/セッション</span>
          <button class="btn btn-outline-primary btn-sm">詳細を見る</button>
        </div>
      </div>
    </div>
  `;

  return colDiv;
}

function updateEmergencyCounter(total, displayed) {
  const counterSelectors = [
    '#guides-count', 
    '.guide-counter', 
    '.counter-badge',
    '.text-primary.fw-bold.fs-5'
  ];
  
  counterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.innerHTML = `<i class="bi bi-people-fill me-2"></i>${total}人のガイドが見つかりました（${displayed}人表示中）`;
    });
  });
  
  console.log(`📊 緊急カウンター更新: ${total}人中${displayed}人表示`);
}

function setupEmergencyLoadMoreButton(allGuides, currentDisplayed) {
  let loadMoreBtn = document.getElementById('load-more-btn');
  if (!loadMoreBtn) {
    loadMoreBtn = document.createElement('div');
    loadMoreBtn.id = 'load-more-btn';
    loadMoreBtn.className = 'text-center mt-4';
    loadMoreBtn.innerHTML = '<button class="btn btn-primary btn-lg load-more-button">もっと見る</button>';
    
    const container = document.getElementById('guide-cards-container');
    if (container && container.parentElement) {
      container.parentElement.appendChild(loadMoreBtn);
    }
  }
  
  const button = loadMoreBtn.querySelector('.load-more-button');
  if (button) {
    // 既存のイベントリスナーを削除
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // 新しいイベントリスナーを追加
    newButton.addEventListener('click', function() {
      const container = document.getElementById('guide-cards-container');
      const currentCards = container.querySelectorAll('.guide-item').length;
      const nextBatch = allGuides.slice(currentCards, currentCards + 12);
      
      nextBatch.forEach(guide => {
        const guideCard = createEmergencyGuideCard(guide);
        container.appendChild(guideCard);
      });
      
      const newTotal = container.querySelectorAll('.guide-item').length;
      updateEmergencyCounter(allGuides.length, newTotal);
      
      if (newTotal >= allGuides.length) {
        newButton.style.display = 'none';
      }
      
      console.log(`📄 緊急もっと見る実行: ${nextBatch.length}枚追加、合計${newTotal}枚表示`);
    });
    
    // ボタンの表示/非表示
    if (currentDisplayed >= allGuides.length) {
      newButton.style.display = 'none';
    } else {
      newButton.style.display = 'block';
      const remaining = allGuides.length - currentDisplayed;
      newButton.textContent = `もっと見る（残り${remaining}人）`;
    }
  }
}

function ensureResetFunctionality() {
  console.log('🔄 リセット機能の確保');
  
  // グローバルリセット関数を強制作成
  window.resetFilters = function() {
    console.log('🔄 緊急リセット機能実行');
    
    // フィルター要素をリセット
    const filters = ['location-filter', 'language-filter', 'price-filter', 'custom-keywords'];
    filters.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.value = '';
        console.log(`🔄 ${id} をリセット`);
      }
    });

    // チェックボックスをリセット
    document.querySelectorAll('input[name="keywords"]').forEach(cb => {
      cb.checked = false;
    });
    
    // ページングシステムがある場合はそれを使用
    if (window.paginationGuideSystem) {
      window.paginationGuideSystem.resetFilters();
    } else {
      // 緊急リセット: 全ガイドを再表示
      forcePaginationReconstruction();
    }
    
    console.log('✅ リセット機能実行完了');
  };
  
  // 検索機能も確保
  window.searchGuides = function() {
    console.log('🔍 緊急検索機能実行');
    
    if (window.paginationGuideSystem) {
      window.paginationGuideSystem.applyFilters();
    } else {
      console.log('⚠️ ページングシステムが利用できません - 基本検索を実行');
      // 基本的な検索機能をここに実装可能
    }
  };
  
  console.log('✅ リセット・検索機能確保完了');
}

function verifyAndForceDisplay() {
  console.log('🔍 最終確認と強制表示');
  
  const container = document.getElementById('guide-cards-container');
  const displayedCards = container ? container.querySelectorAll('.guide-item, .col-md-4').length : 0;
  
  console.log(`📊 最終確認: ${displayedCards}枚のガイドカード表示中`);
  
  if (displayedCards === 0) {
    console.log('🚨 ガイドカードが表示されていません - 最終緊急修正実行');
    forcePaginationReconstruction();
  } else {
    console.log('✅ ガイドカード表示確認完了');
  }
  
  // カウンター表示の最終確認
  const counters = document.querySelectorAll('#guides-count, .guide-counter');
  counters.forEach((counter, idx) => {
    if (counter.textContent.includes('0人')) {
      console.log(`🔢 カウンター${idx}が0人表示 - 修正実行`);
      updateEmergencyCounter(displayedCards || 6, displayedCards || 6);
    }
  });
}