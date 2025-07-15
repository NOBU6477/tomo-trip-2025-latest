/**
 * ガイド登録テスト機能
 * 新規ガイド登録完了後の自動カード追加をテストする
 */

(function() {
  'use strict';
  
  console.log('🧪 ガイド登録テストシステム開始');
  
  // テスト用ガイドデータ
  const testGuideData = {
    name: 'テスト太郎',
    location: '東京都渋谷区',
    languages: ['日本語', '英語'],
    specialties: ['観光案内', '写真撮影'],
    fee: 8000,
    rating: 4.8,
    reviews: 15,
    bio: 'テスト用に追加されたガイドです。実際の登録フローをテストするためのサンプルデータです。',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
  };
  
  // ガイド登録完了を監視
  function setupGuideRegistrationMonitor() {
    // ガイド登録フォームの送信を監視
    const registerModal = document.getElementById('registerGuideModal');
    if (registerModal) {
      const submitButton = registerModal.querySelector('button[type="submit"], .btn-primary');
      if (submitButton) {
        submitButton.addEventListener('click', function(e) {
          setTimeout(() => {
            console.log('📝 ガイド登録送信を検出 - テストカード追加準備');
            addTestGuideCard();
          }, 1000);
        });
      }
    }
  }
  
  // テスト用ガイドカードを追加
  function addTestGuideCard() {
    const guidesContainer = document.getElementById('guides-container');
    if (!guidesContainer) {
      console.log('❌ ガイドコンテナが見つかりません');
      return;
    }
    
    // 新しいガイドカードを作成
    const newCard = createGuideCard(testGuideData);
    
    // 既存カードの最初に挿入
    const firstCard = guidesContainer.querySelector('.guide-item');
    if (firstCard) {
      guidesContainer.insertBefore(newCard, firstCard);
    } else {
      guidesContainer.appendChild(newCard);
    }
    
    // カウンターを更新
    updateGuideCounter();
    
    // 成功メッセージを表示
    showSuccessMessage();
    
    console.log('✅ テストガイドカードを追加しました');
  }
  
  // ガイドカードHTML作成
  function createGuideCard(guideData) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4 guide-item';
    card.style.animation = 'fadeInUp 0.5s ease';
    
    card.innerHTML = `
      <div class="card h-100 shadow-sm guide-card" style="border-radius: 15px; overflow: hidden; transition: transform 0.3s ease;">
        <div class="position-relative">
          <img src="${guideData.image}" class="card-img-top" alt="${guideData.name}" style="height: 200px; object-fit: cover;">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-success rounded-pill">NEW</span>
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title fw-bold">${guideData.name}</h5>
          <p class="text-muted mb-2">
            <i class="bi bi-geo-alt-fill text-primary"></i> ${guideData.location}
          </p>
          <p class="text-muted mb-2">
            <i class="bi bi-translate text-info"></i> ${guideData.languages.join(', ')}
          </p>
          <p class="text-muted mb-2">
            <i class="bi bi-star-fill text-warning"></i> ${guideData.specialties.join(', ')}
          </p>
          <p class="card-text small">${guideData.bio}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-warning">
                ${'★'.repeat(Math.floor(guideData.rating))}
              </span>
              <small class="text-muted">(${guideData.reviews}件)</small>
            </div>
            <span class="fw-bold text-primary">¥${guideData.fee.toLocaleString()}/時間</span>
          </div>
        </div>
        <div class="card-footer bg-transparent">
          <button class="btn btn-primary w-100" onclick="viewGuideDetails('${guideData.name}')">
            詳細を見る
          </button>
        </div>
      </div>
    `;
    
    return card;
  }
  
  // ガイドカウンターを更新
  function updateGuideCounter() {
    const counter = document.getElementById('search-results-counter');
    if (counter) {
      const visibleCards = document.querySelectorAll('.guide-item:not(.d-none)');
      const newCount = visibleCards.length;
      counter.textContent = `${newCount}人のガイドが見つかりました`;
      console.log(`📊 ガイドカウンターを更新: ${newCount}人`);
    }
  }
  
  // 成功メッセージを表示
  function showSuccessMessage() {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    successAlert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; max-width: 350px;';
    successAlert.innerHTML = `
      <strong>✅ 登録完了！</strong> 新しいガイドが追加されました。
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(successAlert);
    
    // 5秒後に自動削除
    setTimeout(() => {
      if (successAlert.parentNode) {
        successAlert.remove();
      }
    }, 5000);
  }
  
  // テスト用ボタンを追加
  function addTestButton() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const testButton = document.createElement('button');
      testButton.className = 'btn btn-warning btn-sm position-absolute';
      testButton.style.cssText = 'bottom: 20px; left: 20px; z-index: 100;';
      testButton.innerHTML = '🧪 ガイド登録テスト';
      testButton.onclick = function() {
        addTestGuideCard();
      };
      heroSection.appendChild(testButton);
    }
  }
  
  // 初期化
  function initialize() {
    setupGuideRegistrationMonitor();
    addTestButton();
    console.log('🧪 ガイド登録テストシステム準備完了');
  }
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();