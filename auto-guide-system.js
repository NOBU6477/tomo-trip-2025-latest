/**
 * 自動ガイド追加システム
 * 新規ガイド登録時に自動的にガイド一覧に追加する機能
 */

(function() {
  'use strict';
  
  console.log('🚀 自動ガイド追加システム開始');
  
  // ガイドテンプレート（日本語版）
  const guideTemplateJA = {
    id: null,
    name: '',
    location: '',
    price: '¥6,000/セッション',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    description: '',
    specialties: [],
    languages: ['日本語'],
    rating: 4.5
  };
  
  // ガイドテンプレート（英語版）
  const guideTemplateEN = {
    id: null,
    name: '',
    location: '',
    price: '$50/session',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    description: '',
    specialties: [],
    languages: ['English'],
    rating: 4.5
  };
  
  /**
   * 新規ガイドをガイド一覧に追加
   * @param {Object} guideData - ガイド情報
   */
  function addNewGuide(guideData) {
    try {
      const isEnglishSite = window.location.href.includes('index-en.html');
      const template = isEnglishSite ? guideTemplateEN : guideTemplateJA;
      
      // デフォルト値を適用
      const newGuide = Object.assign({}, template, guideData);
      newGuide.id = Date.now(); // ユニークID生成
      
      // ガイドカードHTML生成
      const guideCardHTML = createGuideCardHTML(newGuide, isEnglishSite);
      
      // ガイド一覧コンテナを取得
      const guidesContainer = document.querySelector('#guide-cards, .guide-cards, .guides-container');
      if (guidesContainer) {
        // 新しいガイドカードを追加
        const cardElement = document.createElement('div');
        cardElement.innerHTML = guideCardHTML;
        guidesContainer.appendChild(cardElement.firstElementChild);
        
        // ローカルストレージに保存
        saveGuideToStorage(newGuide, isEnglishSite);
        
        console.log('✅ 新規ガイド追加完了:', newGuide.name);
        
        // ガイド数カウンター更新
        updateGuideCounter();
        
        // 成功通知
        showNotification(`新しいガイド「${newGuide.name}」が追加されました！`, 'success');
        
        return newGuide.id;
      } else {
        console.error('ガイドコンテナが見つかりません');
        return null;
      }
      
    } catch (error) {
      console.error('ガイド追加エラー:', error);
      showNotification('ガイド追加に失敗しました。', 'error');
      return null;
    }
  }
  
  /**
   * ガイドカードHTMLを生成
   * @param {Object} guide - ガイド情報
   * @param {boolean} isEnglish - 英語サイトかどうか
   * @returns {string} - ガイドカードHTML
   */
  function createGuideCardHTML(guide, isEnglish) {
    const locationText = isEnglish ? 'Location' : '場所';
    const detailsText = isEnglish ? 'See Details' : '詳細を見る';
    
    return `
      <div class="col-lg-4 col-md-6 mb-4 guide-item" data-guide-id="${guide.id}">
        <div class="card guide-card h-100">
          <img src="${guide.image}" class="card-img-top" alt="${guide.name}">
          <div class="card-body">
            <h5 class="card-title">${guide.name}</h5>
            <p class="guide-location"><i class="bi bi-geo-alt"></i> ${guide.location}</p>
            <p class="card-text">${guide.description}</p>
            <div class="mb-2">
              ${guide.specialties.map(specialty => 
                `<span class="badge bg-light text-dark me-1">${specialty}</span>`
              ).join('')}
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="badge bg-primary">${guide.price}</span>
              </div>
              <div class="rating">
                ${'★'.repeat(Math.floor(guide.rating))}${'☆'.repeat(5 - Math.floor(guide.rating))} ${guide.rating}
              </div>
            </div>
            <button class="btn btn-primary w-100 mt-2">${detailsText}</button>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * ガイド情報をローカルストレージに保存
   * @param {Object} guide - ガイド情報
   * @param {boolean} isEnglish - 英語サイトかどうか
   */
  function saveGuideToStorage(guide, isEnglish) {
    const storageKey = isEnglish ? 'added_guides_en' : 'added_guides_ja';
    let savedGuides = JSON.parse(localStorage.getItem(storageKey) || '[]');
    savedGuides.push(guide);
    localStorage.setItem(storageKey, JSON.stringify(savedGuides));
  }
  
  /**
   * ローカルストレージから保存済みガイドを読み込み
   */
  function loadSavedGuides() {
    const isEnglishSite = window.location.href.includes('index-en.html');
    const storageKey = isEnglishSite ? 'added_guides_en' : 'added_guides_ja';
    const savedGuides = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    savedGuides.forEach(guide => {
      // 既存チェック
      if (!document.querySelector(`[data-guide-id="${guide.id}"]`)) {
        addNewGuide(guide);
      }
    });
  }
  
  /**
   * ガイド数カウンター更新
   */
  function updateGuideCounter() {
    const visibleGuides = document.querySelectorAll('.guide-item:not(.d-none)');
    const counter = document.querySelector('#search-results-counter, #guide-counter');
    
    if (counter) {
      const isEnglishSite = window.location.href.includes('index-en.html');
      const text = isEnglishSite ? 
        `Found ${visibleGuides.length} guides` : 
        `${visibleGuides.length}人のガイドが見つかりました`;
      counter.textContent = text;
    }
  }
  
  /**
   * 通知表示
   * @param {string} message - メッセージ
   * @param {string} type - 通知タイプ（success, error, info）
   */
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  /**
   * 新規ガイド登録フォームとの連携
   */
  function setupGuideRegistrationIntegration() {
    // ガイド登録フォーム送信イベントを監視
    document.addEventListener('submit', function(e) {
      if (e.target.id === 'guide-register-form' || e.target.classList.contains('guide-registration')) {
        e.preventDefault();
        
        // フォームデータを取得
        const formData = new FormData(e.target);
        const newGuideData = {
          name: formData.get('name') || formData.get('guide-name'),
          location: formData.get('location') || formData.get('guide-location'),
          description: formData.get('description') || formData.get('guide-description'),
          specialties: (formData.get('specialties') || '').split(',').map(s => s.trim()).filter(s => s),
          languages: (formData.get('languages') || '日本語').split(',').map(s => s.trim())
        };
        
        // 必須項目チェック
        if (newGuideData.name && newGuideData.location) {
          const guideId = addNewGuide(newGuideData);
          if (guideId) {
            // フォームリセット
            e.target.reset();
            
            // モーダルを閉じる
            const modal = e.target.closest('.modal');
            if (modal) {
              const modalInstance = bootstrap.Modal.getInstance(modal);
              if (modalInstance) modalInstance.hide();
            }
          }
        } else {
          showNotification('名前と場所は必須項目です。', 'error');
        }
      }
    });
  }
  
  /**
   * システム初期化
   */
  function initialize() {
    // 保存済みガイドを読み込み
    loadSavedGuides();
    
    // ガイド登録フォーム連携設定
    setupGuideRegistrationIntegration();
    
    // ガイド数カウンター初期更新
    setTimeout(updateGuideCounter, 1000);
    
    console.log('✅ 自動ガイド追加システム初期化完了');
  }
  
  // グローバル関数として公開
  window.addNewGuide = addNewGuide;
  window.updateGuideCounter = updateGuideCounter;
  
  // DOMContentLoaded後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();