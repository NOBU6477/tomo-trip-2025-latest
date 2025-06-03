/**
 * ガイド一覧統合システム
 * 新規登録されたガイドを確実にガイド一覧に表示する
 */

(function() {
  'use strict';

  /**
   * ガイド一覧の統合初期化
   */
  function initializeGuideListIntegration() {
    console.log('ガイド一覧統合システムを初期化中...');
    
    // DOMが読み込まれた後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadAllGuideData);
    } else {
      loadAllGuideData();
    }
    
    // ストレージイベントを監視
    window.addEventListener('storage', handleStorageChange);
    
    // カスタムイベントを監視
    document.addEventListener('guideDataUpdated', handleGuideDataUpdate);
  }

  /**
   * すべてのガイドデータを読み込み
   */
  function loadAllGuideData() {
    console.log('すべてのガイドデータを読み込み中...');
    
    const guideContainer = document.getElementById('guide-cards-container');
    if (!guideContainer) {
      console.log('ガイドコンテナが見つかりません');
      return;
    }
    
    // 既存のガイドカード数をカウント
    const existingCards = guideContainer.querySelectorAll('.guide-card').length;
    console.log(`既存のガイドカード数: ${existingCards}`);
    
    // 新規ガイドを追加
    const newGuides = loadNewGuides();
    if (newGuides.length > 0) {
      addGuidesToContainer(newGuides, guideContainer);
      console.log(`${newGuides.length}件の新規ガイドを追加しました`);
      
      // フィルター機能を再適用
      setTimeout(() => {
        applyFiltersAfterUpdate();
      }, 500);
    } else {
      console.log('新規ガイドは見つかりませんでした');
    }
  }

  /**
   * 新規ガイドデータを収集
   */
  function loadNewGuides() {
    const allGuides = [];
    
    // 1. ローカルストレージのガイドリストから取得
    try {
      const guides = JSON.parse(localStorage.getItem('guides')) || [];
      allGuides.push(...guides);
      console.log(`ローカルストレージから${guides.length}件のガイドを読み込み`);
    } catch (e) {
      console.warn('ローカルストレージのガイド読み込みエラー:', e);
    }
    
    // 2. セッションストレージから取得
    try {
      const currentUser = sessionStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData && userData.id && !allGuides.find(g => g.id === userData.id)) {
          allGuides.push(userData);
          console.log('現在のユーザーをガイドリストに追加');
        }
      }
    } catch (e) {
      console.warn('セッションストレージの読み込みエラー:', e);
    }
    
    // 3. プロフィールデータから取得
    try {
      const guideDetailsData = JSON.parse(localStorage.getItem('guideDetailsData')) || {};
      Object.values(guideDetailsData).forEach(guide => {
        if (guide && guide.id && !allGuides.find(g => g.id === guide.id)) {
          allGuides.push(guide);
        }
      });
    } catch (e) {
      console.warn('ガイド詳細データの読み込みエラー:', e);
    }
    
    return allGuides.filter(guide => guide && guide.id && guide.name);
  }

  /**
   * ガイドをコンテナに追加
   */
  function addGuidesToContainer(guides, container) {
    guides.forEach(guide => {
      // 既存のカードがあるかチェック
      const existingCard = container.querySelector(`[data-guide-id="${guide.id}"]`);
      if (existingCard) {
        console.log(`ガイドID ${guide.id} は既に存在します - 更新`);
        updateExistingGuideCard(existingCard, guide);
        return;
      }
      
      // 新しいガイドカードを作成
      const guideCard = createGuideCard(guide);
      container.appendChild(guideCard);
      console.log(`新規ガイドカードを追加: ${guide.name}`);
    });
  }

  /**
   * ガイドカードHTMLを生成
   */
  function createGuideCard(guide) {
    const div = document.createElement('div');
    div.className = 'col-md-4 guide-item';
    
    // 言語バッジ
    const languages = guide.languages || ['日本語'];
    const languageBadges = languages.map(lang => 
      `<span class="badge bg-light text-dark guide-lang me-1">${lang}</span>`
    ).join('');
    
    // 専門分野キーワード
    const keywords = guide.specialties || guide.keywords || [];
    const keywordsText = Array.isArray(keywords) ? keywords.join(',') : keywords;
    
    // 料金表示
    const fee = guide.fee || guide.price || '6000';
    const feeDisplay = parseInt(fee).toLocaleString();
    
    // 画像URL
    const imageUrl = guide.image || guide.imageUrl || 'https://via.placeholder.com/300x200?text=ガイド写真';
    
    div.innerHTML = `
      <div class="card guide-card shadow-sm" 
           data-guide-id="${guide.id}"
           data-location="${encodeURIComponent(guide.location || guide.city || '東京')}"
           data-languages="${languages.join(',')}"
           data-fee="${fee}"
           data-keywords="${encodeURIComponent(keywordsText)}">
        <img src="${imageUrl}" class="card-img-top guide-image" alt="${guide.name}のガイド写真" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title guide-name mb-0">${guide.name}</h5>
            <span class="badge bg-primary guide-fee">¥${feeDisplay}/セッション</span>
          </div>
          <p class="card-text text-muted mb-2 guide-location">
            <i class="bi bi-geo-alt-fill me-1"></i>${guide.location || guide.city || '東京'}
          </p>
          <p class="card-text mb-3 guide-description">${guide.bio || guide.description || '経験豊富なガイドです。'}</p>
          <div class="mb-3">
            ${languageBadges}
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-warning">
              <span class="badge bg-success">新規</span>
            </div>
            <a href="guide-details.html?id=${guide.id}" class="btn btn-primary btn-sm">詳細を見る</a>
          </div>
        </div>
      </div>
    `;
    
    return div;
  }

  /**
   * 既存のガイドカードを更新
   */
  function updateExistingGuideCard(cardElement, guide) {
    try {
      // 名前を更新
      const nameElement = cardElement.querySelector('.guide-name, .card-title');
      if (nameElement && guide.name) {
        nameElement.textContent = guide.name;
      }
      
      // 場所を更新
      const locationElement = cardElement.querySelector('.guide-location');
      if (locationElement && (guide.location || guide.city)) {
        locationElement.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${guide.location || guide.city}`;
      }
      
      // 説明を更新
      const descElement = cardElement.querySelector('.guide-description');
      if (descElement && (guide.bio || guide.description)) {
        descElement.textContent = guide.bio || guide.description;
      }
      
      // 料金を更新
      const feeElement = cardElement.querySelector('.guide-fee');
      if (feeElement && (guide.fee || guide.price)) {
        const fee = parseInt(guide.fee || guide.price).toLocaleString();
        feeElement.textContent = `¥${fee}/セッション`;
      }
      
      // データ属性を更新
      if (guide.location || guide.city) {
        cardElement.setAttribute('data-location', encodeURIComponent(guide.location || guide.city));
      }
      if (guide.fee || guide.price) {
        cardElement.setAttribute('data-fee', guide.fee || guide.price);
      }
      
      console.log(`ガイドカード更新完了: ${guide.name}`);
    } catch (error) {
      console.error('ガイドカード更新エラー:', error);
    }
  }

  /**
   * フィルター機能を再適用
   */
  function applyFiltersAfterUpdate() {
    try {
      // グローバルフィルター関数を呼び出し
      if (typeof window.applyFilters === 'function') {
        window.applyFilters();
        console.log('フィルター機能を再適用しました');
      } else {
        // フィルターイベントを発火
        document.dispatchEvent(new Event('guide-data-loaded'));
        console.log('ガイドデータ読み込みイベントを発火しました');
      }
    } catch (error) {
      console.error('フィルター適用エラー:', error);
    }
  }

  /**
   * ストレージ変更イベントハンドラ
   */
  function handleStorageChange(event) {
    if (event.key === 'guides' || event.key === 'guideDetailsData') {
      console.log('ストレージ変更を検出 - ガイドリストを更新');
      setTimeout(loadAllGuideData, 100);
    }
  }

  /**
   * ガイドデータ更新イベントハンドラ
   */
  function handleGuideDataUpdate(event) {
    console.log('ガイドデータ更新イベントを受信');
    setTimeout(loadAllGuideData, 100);
  }

  // 初期化実行
  initializeGuideListIntegration();

})();

console.log('ガイド一覧統合システムがロードされました');