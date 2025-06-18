/**
 * ガイド一覧同期システム
 * プロフィール編集で保存されたデータをメインページのガイド一覧に確実に反映
 */
(function() {
  'use strict';

  /**
   * メインページのガイド一覧を強制更新
   */
  function forceUpdateGuideList() {
    const userAddedGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
    
    if (userAddedGuides.length === 0) {
      console.log('No user added guides found');
      return;
    }

    console.log('Forcing guide list update with', userAddedGuides.length, 'guides');
    
    // ガイド一覧コンテナを探す
    const guideContainer = findGuideContainer();
    if (!guideContainer) {
      console.log('Guide container not found');
      return;
    }

    // 既存のユーザー追加ガイドを削除
    removeExistingUserGuides(guideContainer);
    
    // 新しいガイドカードを追加（新規は先頭に配置）
    userAddedGuides.forEach((guide, index) => {
      const guideCard = createGuideCard(guide);
      if (index === 0) {
        // 最新のガイドは先頭に挿入（左上に表示）
        guideContainer.insertBefore(guideCard, guideContainer.firstChild);
      } else {
        guideContainer.appendChild(guideCard);
      }
    });

    console.log('Guide list updated successfully');
  }

  /**
   * ガイド一覧コンテナを探す
   */
  function findGuideContainer() {
    // 複数の可能性のあるセレクタを試す
    const selectors = [
      '.guide-cards-container',
      '.guide-list-container', 
      '#guides-section .row',
      '.guides-grid',
      '[data-guides-container]'
    ];

    for (const selector of selectors) {
      const container = document.querySelector(selector);
      if (container) {
        return container;
      }
    }

    // フォールバック: ガイドカードが含まれている親要素を探す
    const existingCard = document.querySelector('.guide-card, .card');
    if (existingCard) {
      return existingCard.parentElement;
    }

    return null;
  }

  /**
   * 既存のユーザー追加ガイドを削除
   */
  function removeExistingUserGuides(container) {
    const userGuides = container.querySelectorAll('[data-user-added="true"]');
    userGuides.forEach(guide => guide.remove());
  }

  /**
   * ガイドカードを作成
   */
  function createGuideCard(guide) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'col-md-6 col-lg-4 mb-4';
    cardDiv.setAttribute('data-user-added', 'true');
    cardDiv.setAttribute('data-guide-id', guide.id);

    const languagesList = Array.isArray(guide.languages) 
      ? guide.languages.slice(0, 3).join(', ') 
      : '日本語';

    const interestsList = Array.isArray(guide.interests) 
      ? guide.interests.slice(0, 2).join(', ') 
      : '';

    cardDiv.innerHTML = `
      <div class="card guide-card h-100 shadow-sm">
        <div class="position-relative">
          <img src="${guide.profilePhoto}" class="card-img-top guide-photo" alt="${guide.name}" style="height: 200px; object-fit: cover;">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-success">新規</span>
          </div>
        </div>
        <div class="card-body">
          <h5 class="card-title">${guide.name}</h5>
          <p class="text-muted mb-2">
            <i class="bi bi-geo-alt-fill"></i> ${guide.location}
          </p>
          <p class="text-muted mb-2">
            <i class="bi bi-translate"></i> ${languagesList}
          </p>
          <p class="card-text small">${guide.description.substring(0, 80)}${guide.description.length > 80 ? '...' : ''}</p>
          ${interestsList ? `<div class="mb-2"><small class="text-muted">得意分野: ${interestsList}</small></div>` : ''}
          <div class="d-flex justify-content-between align-items-center">
            <div class="rating">
              <span class="text-warning">★★★★★</span>
              <small class="text-muted">(${guide.reviewCount})</small>
            </div>
            <div class="price">
              <strong>¥${guide.sessionFee.toLocaleString()}/回</strong>
            </div>
          </div>
        </div>
        <div class="card-footer bg-transparent">
          <button class="btn btn-primary w-100" onclick="selectGuide('${guide.id}', '${guide.name}')">
            このガイドを選ぶ
          </button>
        </div>
      </div>
    `;

    return cardDiv;
  }

  /**
   * ページロード時の初期化
   */
  function initializeGuideSync() {
    // DOMが完全に読み込まれた後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', forceUpdateGuideList);
    } else {
      forceUpdateGuideList();
    }

    // ストレージ変更を監視
    window.addEventListener('storage', function(e) {
      if (e.key === 'userAddedGuides') {
        setTimeout(forceUpdateGuideList, 100);
      }
    });

    // 定期的な同期チェック
    setInterval(function() {
      const latestGuideData = sessionStorage.getItem('latestGuideData');
      if (latestGuideData) {
        sessionStorage.removeItem('latestGuideData');
        forceUpdateGuideList();
      }
    }, 1000);
  }

  /**
   * グローバル関数として公開
   */
  window.updateGuideDisplay = forceUpdateGuideList;
  window.syncGuideList = forceUpdateGuideList;

  // 初期化
  initializeGuideSync();

})();