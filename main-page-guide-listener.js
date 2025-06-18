/**
 * メインページガイド更新リスナー
 * プロフィールページからの更新通知を受信してガイド一覧を即座に更新
 */
(function() {
  'use strict';

  /**
   * BroadcastChannelリスナーの設定
   */
  function setupBroadcastListener() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('guide_updates');
        
        channel.addEventListener('message', function(event) {
          console.log('ガイド更新通知を受信:', event.data);
          
          if (event.data.type === 'FORCE_GUIDE_UPDATE' || event.data.type === 'GUIDE_UPDATED') {
            console.log('ガイド一覧を強制更新します');
            
            // 少し遅延させて更新
            setTimeout(() => {
              forceUpdateGuideList();
            }, 200);
          }
        });
        
        console.log('BroadcastChannelリスナーを設定しました');
      } catch (error) {
        console.log('BroadcastChannelが利用できません:', error);
      }
    }
  }

  /**
   * ガイド一覧の強制更新
   */
  function forceUpdateGuideList() {
    console.log('=== ガイド一覧強制更新開始 ===');
    
    const userAddedGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
    console.log('更新対象ガイド数:', userAddedGuides.length);
    
    if (userAddedGuides.length === 0) {
      console.log('更新対象のガイドがありません');
      return;
    }

    // ガイド一覧コンテナを探す
    const guideContainer = findGuideContainer();
    if (!guideContainer) {
      console.log('ガイドコンテナが見つかりません');
      return;
    }

    // 既存のユーザー追加ガイドを削除
    removeExistingUserGuides(guideContainer);
    
    // 新しいガイドカードを先頭に追加
    userAddedGuides.forEach((guide, index) => {
      const guideCard = createEnhancedGuideCard(guide);
      if (index === 0) {
        // 最新のガイドは先頭に挿入
        guideContainer.insertBefore(guideCard, guideContainer.firstChild);
      } else {
        // 他の既存カードの前（デフォルトカードの後）に挿入
        const existingUserCards = guideContainer.querySelectorAll('[data-user-added="true"]');
        if (existingUserCards.length > 0) {
          guideContainer.insertBefore(guideCard, existingUserCards[existingUserCards.length - 1].nextSibling);
        } else {
          guideContainer.appendChild(guideCard);
        }
      }
    });

    console.log('=== ガイド一覧強制更新完了 ===');
  }

  /**
   * ガイドコンテナを探す
   */
  function findGuideContainer() {
    const selectors = [
      '.guide-cards-container',
      '.guide-list-container', 
      '#guides-section .row',
      '.guides-grid',
      '[data-guides-container]',
      '.row.g-4',
      '.container .row'
    ];
    
    for (const selector of selectors) {
      const container = document.querySelector(selector);
      if (container && container.children.length > 0) {
        console.log(`ガイドコンテナを発見: ${selector}`);
        return container;
      }
    }
    
    console.log('ガイドコンテナが見つかりません');
    return null;
  }

  /**
   * 既存のユーザー追加ガイドを削除
   */
  function removeExistingUserGuides(container) {
    const existingUserGuides = container.querySelectorAll('[data-user-added="true"]');
    existingUserGuides.forEach(guide => guide.remove());
    console.log(`${existingUserGuides.length}個の既存ユーザーガイドを削除しました`);
  }

  /**
   * 強化されたガイドカードを作成
   */
  function createEnhancedGuideCard(guide) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'col-md-6 col-lg-4 mb-4';
    cardDiv.setAttribute('data-user-added', 'true');
    cardDiv.setAttribute('data-guide-id', guide.id);

    // 言語の表示処理
    const languagesList = Array.isArray(guide.languages) 
      ? guide.languages.slice(0, 3).join(', ') 
      : (typeof guide.languages === 'string' ? guide.languages : '日本語');

    // 興味・得意分野の表示処理
    const interestsList = Array.isArray(guide.interests) 
      ? guide.interests.slice(0, 2).join(', ') 
      : '';

    // 説明文の処理
    const description = guide.description || '新規登録ガイドです。よろしくお願いします。';
    const shortDescription = description.length > 80 ? description.substring(0, 80) + '...' : description;

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
          <p class="card-text small">${shortDescription}</p>
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
   * ページ読み込み時のガイド一覧更新
   */
  function updateGuidesOnLoad() {
    // ページ読み込み後に少し待ってから更新
    setTimeout(() => {
      const userGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
      if (userGuides.length > 0) {
        console.log('ページ読み込み時にガイド一覧を更新します');
        forceUpdateGuideList();
      }
    }, 500);
  }

  /**
   * 初期化
   */
  function initialize() {
    // メインページでのみ実行
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      console.log('メインページガイドリスナーを初期化中...');
      
      // BroadcastChannelリスナーの設定
      setupBroadcastListener();
      
      // ページ読み込み時の更新
      updateGuidesOnLoad();
      
      // グローバル関数として公開
      window.forceUpdateGuideList = forceUpdateGuideList;
      
      console.log('メインページガイドリスナー初期化完了');
    }
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();