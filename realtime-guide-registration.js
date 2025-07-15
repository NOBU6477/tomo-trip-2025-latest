/**
 * リアルタイムガイド登録システム
 * 新規ガイド登録時にトップページのガイド一覧へ即座に反映
 */

(function() {
  'use strict';
  
  console.log('🎯 リアルタイムガイド登録システム開始');
  
  // ガイドデータの保存とリアルタイム更新
  let guideDatabase = [];
  
  function initializeGuideDatabase() {
    // ローカルストレージからガイドデータを読み込み
    const savedGuides = localStorage.getItem('registeredGuides');
    if (savedGuides) {
      try {
        guideDatabase = JSON.parse(savedGuides);
        console.log(`📊 保存済みガイド読み込み: ${guideDatabase.length}件`);
      } catch (error) {
        console.error('ガイドデータ読み込みエラー:', error);
        guideDatabase = [];
      }
    }
    
    // 初期ガイドデータがない場合のサンプルデータ
    if (guideDatabase.length === 0) {
      addInitialGuides();
    }
    
    updateGuideDisplay();
  }
  
  function addInitialGuides() {
    const initialGuides = [
      {
        id: 'guide_001',
        name: '田中 さくら',
        location: '東京',
        languages: ['日本語', '英語'],
        fee: 8000,
        specialty: ['グルメ', '夜景'],
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=300&h=300&fit=crop',
        rating: 4.8,
        reviews: 124,
        description: '東京の隠れた名店と絶景スポットをご案内します。'
      },
      {
        id: 'guide_002', 
        name: '山田 健太',
        location: '大阪',
        languages: ['日本語', '英語', '中国語'],
        fee: 7500,
        specialty: ['歴史', '文化'],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        rating: 4.9,
        reviews: 89,
        description: '大阪の歴史と文化を深く知るツアーをお届けします。'
      }
    ];
    
    guideDatabase = [...initialGuides];
    saveGuideDatabase();
  }
  
  function saveGuideDatabase() {
    try {
      localStorage.setItem('registeredGuides', JSON.stringify(guideDatabase));
      console.log(`💾 ガイドデータ保存完了: ${guideDatabase.length}件`);
    } catch (error) {
      console.error('ガイドデータ保存エラー:', error);
    }
  }
  
  function addNewGuide(guideData) {
    const newGuide = {
      id: `guide_${Date.now()}`,
      name: guideData.name || '新規ガイド',
      location: guideData.location || '未設定',
      languages: guideData.languages || ['日本語'],
      fee: parseInt(guideData.fee) || 6000,
      specialty: guideData.specialty || ['観光'],
      image: guideData.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      rating: 5.0,
      reviews: 0,
      description: guideData.description || '新しく登録されたガイドです。',
      registeredAt: new Date().toISOString()
    };
    
    guideDatabase.unshift(newGuide); // 先頭に追加
    saveGuideDatabase();
    updateGuideDisplay();
    
    console.log('✅ 新規ガイド追加:', newGuide.name);
    showNotification(`新しいガイド「${newGuide.name}」が登録されました！`, 'success');
    
    return newGuide;
  }
  
  function updateGuideDisplay() {
    const guideContainer = document.querySelector('#guides-section .row, .guides-container, .guide-cards-container');
    
    if (!guideContainer) {
      console.warn('ガイド表示コンテナが見つかりません');
      return;
    }
    
    // 既存のガイドカードをクリア
    guideContainer.innerHTML = '';
    
    // ガイドカードを生成
    guideDatabase.forEach(guide => {
      const guideCard = createGuideCard(guide);
      guideContainer.appendChild(guideCard);
    });
    
    // ガイド数を更新
    updateGuideCounter();
    
    console.log(`🔄 ガイド表示更新: ${guideDatabase.length}件`);
  }
  
  function createGuideCard(guide) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'col-md-4 col-sm-6 mb-4';
    cardDiv.setAttribute('data-location', guide.location);
    cardDiv.setAttribute('data-languages', guide.languages.join(','));
    cardDiv.setAttribute('data-fee', guide.fee);
    cardDiv.setAttribute('data-keywords', guide.specialty.join(','));
    
    cardDiv.innerHTML = `
      <div class="guide-card card h-100 shadow-sm">
        <img src="${guide.image}" class="guide-image card-img-top" alt="${guide.name}">
        <div class="card-body">
          <h5 class="card-title">${guide.name}</h5>
          <p class="text-muted mb-2">
            <i class="bi bi-geo-alt"></i> ${guide.location}
          </p>
          <p class="text-muted mb-2">
            <i class="bi bi-translate"></i> ${guide.languages.join(', ')}
          </p>
          <p class="card-text text-truncate">${guide.description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="rating">
              <span class="text-warning">★★★★★</span>
              <small class="text-muted">(${guide.reviews})</small>
            </div>
            <span class="badge bg-primary">¥${guide.fee.toLocaleString()}</span>
          </div>
          <div class="mt-2">
            ${guide.specialty.map(s => `<span class="badge bg-secondary me-1">${s}</span>`).join('')}
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary w-100" onclick="showGuideDetails('${guide.id}')">
            詳細を見る
          </button>
        </div>
      </div>
    `;
    
    return cardDiv;
  }
  
  function updateGuideCounter() {
    const counters = document.querySelectorAll('#search-results-counter, #guide-counter, .counter-badge');
    const count = guideDatabase.length;
    
    counters.forEach(counter => {
      counter.textContent = `${count}人のガイドが見つかりました`;
    });
  }
  
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
  
  // ガイド登録フォーム送信の監視
  function setupRegistrationListener() {
    document.addEventListener('submit', function(event) {
      const form = event.target;
      
      if (form.id === 'guideRegistrationForm' || form.classList.contains('guide-registration-form')) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const guideData = {
          name: formData.get('fullName') || formData.get('name'),
          location: formData.get('location') || formData.get('prefecture'),
          languages: [formData.get('language1'), formData.get('language2')].filter(Boolean),
          fee: formData.get('fee'),
          specialty: [formData.get('specialty1'), formData.get('specialty2')].filter(Boolean),
          description: formData.get('description')
        };
        
        const newGuide = addNewGuide(guideData);
        
        // フォームをリセット
        form.reset();
        
        // モーダルを閉じる
        const modal = form.closest('.modal');
        if (modal) {
          const bsModal = bootstrap.Modal.getInstance(modal);
          if (bsModal) {
            bsModal.hide();
          }
        }
        
        return false;
      }
    });
  }
  
  // ガイド詳細表示機能
  window.showGuideDetails = function(guideId) {
    const guide = guideDatabase.find(g => g.id === guideId);
    if (!guide) return;
    
    // ガイド詳細モーダルを表示する処理
    console.log('ガイド詳細表示:', guide.name);
  };
  
  function initialize() {
    initializeGuideDatabase();
    setupRegistrationListener();
    
    console.log('✅ リアルタイムガイド登録システム初期化完了');
  }
  
  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // 外部からのアクセス用
  window.GuideRegistrationSystem = {
    addGuide: addNewGuide,
    updateDisplay: updateGuideDisplay,
    getGuides: () => [...guideDatabase]
  };
  
})();