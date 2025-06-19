/**
 * シンプルなガイド登録システム
 * 基本的な機能のみ実装
 */

// ガイドデータの管理
const GuideManager = {
  guides: JSON.parse(localStorage.getItem('guides') || '[]'),
  
  // 新しいガイドを追加
  addGuide(guideData) {
    const newGuide = {
      id: Date.now(),
      ...guideData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    this.guides.unshift(newGuide); // 最新が最初に表示
    this.saveGuides();
    return newGuide;
  },
  
  // ガイドリストを保存
  saveGuides() {
    localStorage.setItem('guides', JSON.stringify(this.guides));
  },
  
  // ガイドリストを取得
  getGuides() {
    return this.guides;
  }
};

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
  // メインページでガイドを表示
  if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
    displayGuides();
    checkForNewGuide();
  }
});

// ガイドを表示する関数
function displayGuides() {
  const guidesContainer = document.querySelector('.guides-container');
  if (!guidesContainer) return;
  
  const guides = GuideManager.getGuides();
  
  // 新しく追加されたガイドを表示
  guides.forEach((guide, index) => {
    if (index < 3) { // 最初の3つだけ表示
      const guideCard = createGuideCard(guide);
      guidesContainer.appendChild(guideCard);
    }
  });
}

// ガイドカードを作成
function createGuideCard(guide) {
  const card = document.createElement('div');
  card.className = 'col-md-4 guide-item';
  card.innerHTML = `
    <div class="card guide-card shadow-sm">
      <div class="guide-profile-container">
        <img src="${guide.photo || 'https://placehold.co/400x300/e3f2fd/1976d2/png?text=Photo'}" 
             class="card-img-top guide-image" 
             alt="${guide.name}のプロフィール写真">
        <div class="position-absolute top-0 end-0 m-2">
          <span class="badge bg-success">新規</span>
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h5 class="card-title mb-0">${guide.name}</h5>
          <span class="badge bg-primary">¥${guide.fee ? guide.fee.toLocaleString() : '6,000'}/セッション</span>
        </div>
        <p class="card-text text-muted mb-2">
          <i class="bi bi-geo-alt-fill me-1"></i>${guide.location || '未設定'}
        </p>
        <p class="card-text mb-3">${guide.description || 'よろしくお願いします。'}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="rating text-warning">
            <span>★★★★★</span>
            <small class="text-muted">(新規)</small>
          </div>
          <span class="text-muted small">${guide.languages ? guide.languages.join(', ') : '日本語'}</span>
        </div>
      </div>
      <div class="card-footer bg-white border-0 pt-0">
        <a href="#" class="btn btn-outline-primary w-100 guide-details-link">詳細を見る</a>
      </div>
    </div>
  `;
  return card;
}

// 新しいガイド登録確認
function checkForNewGuide() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('new_guide') === 'true') {
    // URLパラメータをクリア
    const url = new URL(window.location);
    url.searchParams.delete('new_guide');
    window.history.replaceState({}, '', url);
    
    // 成功メッセージ表示
    showSuccessMessage('新しいガイドが登録されました！');
  }
}

// 成功メッセージを表示
function showSuccessMessage(message) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
  alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alert);
  
  // 5秒後に自動で削除
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}

// グローバルに公開
window.GuideManager = GuideManager;