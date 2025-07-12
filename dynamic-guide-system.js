/**
 * 動的ガイドシステム - スケーラブルガイド表示・登録統合システム
 * ガイド登録機能と連携し、無制限にガイドが追加できるシステム
 */

(function() {
  'use strict';

  // システム設定
  const INITIAL_GUIDE_COUNT = 70; // 初期表示数
  const GUIDES_PER_PAGE = 15; // "もっと見る"で追加される数

  /**
   * 動的ガイドシステムの初期化
   */
  function initializeDynamicGuideSystem() {
    console.log('動的ガイドシステムを初期化中...');
    
    // DOMが読み込まれた後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupGuideSystem);
    } else {
      setupGuideSystem();
    }
    
    // ガイド登録完了を監視
    document.addEventListener('guideRegistered', handleNewGuideRegistration);
    
    // ストレージ変更を監視
    window.addEventListener('storage', handleStorageChange);
  }

  /**
   * ガイドシステムのセットアップ
   */
  function setupGuideSystem() {
    console.log('ガイドシステムセットアップ開始');
    
    // 初期ガイドデータを生成
    generateInitialGuides();
    
    // 登録済みガイドを読み込み
    loadRegisteredGuides();
    
    // ガイド表示を更新
    displayAllGuides();
    
    // "もっと見る"ボタンのセットアップ
    setupLoadMoreButton();
    
    // ガイド登録フォームのセットアップ
    setupGuideRegistrationForm();
    
    console.log('ガイドシステムセットアップ完了');
  }

  /**
   * 初期ガイドデータを生成（ローカルストレージに保存）
   */
  function generateInitialGuides() {
    // 既にデータが存在する場合はスキップ
    if (localStorage.getItem('initialGuidesGenerated')) {
      console.log('初期ガイドデータは既に生成済み');
      return;
    }

    console.log('初期ガイドデータを生成中...');

    const prefectures = [
      '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
      '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
      '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
      '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
      '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
      '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
      '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
    ];

    const specialties = [
      '歴史ガイド', '食べ歩き', '自然散策', '文化体験', '街歩き', '温泉案内',
      '寺社巡り', '伝統工芸', '地元グルメ', '絶景スポット', '写真撮影',
      'アウトドア', '釣り体験', '農業体験', '祭り案内', '夜景ツアー',
      'アニメ聖地', '建築巡り', 'カフェ巡り', 'ショッピング', '美術館',
      '博物館', '庭園巡り', '花見案内', '紅葉案内', '雪景色'
    ];

    const languages = [
      ['日本語', '英語'],
      ['日本語', '中国語'],
      ['日本語', '韓国語'],
      ['日本語', '英語', 'フランス語'],
      ['日本語', '英語', 'ドイツ語'],
      ['日本語', 'スペイン語'],
      ['日本語', 'イタリア語'],
      ['日本語', 'ロシア語'],
      ['日本語', 'ポルトガル語'],
      ['日本語', 'タイ語']
    ];

    // 初期ガイドデータを生成
    for (let i = 1; i <= INITIAL_GUIDE_COUNT; i++) {
      const prefecture = prefectures[(i - 1) % prefectures.length];
      const specialty = specialties[(i - 1) % specialties.length];
      const guideLangs = languages[(i - 1) % languages.length];
      const fee = 6000 + ((i - 1) % 10) * 1000;
      const rating = (3.5 + ((i - 1) % 20) * 0.1).toFixed(1);

      const guideData = {
        id: i,
        name: `${specialty}の専門家`,
        location: prefecture,
        specialty: specialty,
        description: `${prefecture}の${specialty}を専門とするプロフェッショナルガイドです。地元の魅力を余すことなくご案内いたします。`,
        languages: guideLangs,
        fee: fee,
        rating: parseFloat(rating),
        image: `https://images.unsplash.com/photo-${1544620347 + i}?w=400&h=300&fit=crop`,
        keywords: [specialty, prefecture.replace('県', '').replace('府', '').replace('都', ''), '体験', 'ツアー'],
        isInitial: true,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(`guide_${i}`, JSON.stringify(guideData));
    }

    // 初期ガイド生成完了をマーク
    localStorage.setItem('initialGuidesGenerated', 'true');
    localStorage.setItem('lastGuideId', INITIAL_GUIDE_COUNT.toString());
    
    console.log(`${INITIAL_GUIDE_COUNT}件の初期ガイドデータを生成しました`);
  }

  /**
   * 登録済みガイドを読み込み
   */
  function loadRegisteredGuides() {
    console.log('登録済みガイドを読み込み中...');
    
    const registeredGuides = [];
    
    // ローカルストレージから登録済みガイドを検索
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('guide_')) {
        try {
          const guideData = JSON.parse(localStorage.getItem(key));
          if (guideData && !guideData.isInitial) {
            registeredGuides.push(guideData);
          }
        } catch (e) {
          console.warn('無効なガイドデータをスキップ:', key);
        }
      }
    }
    
    console.log(`${registeredGuides.length}件の登録済みガイドを読み込みました`);
    return registeredGuides;
  }

  /**
   * すべてのガイドを表示
   */
  function displayAllGuides() {
    console.log('すべてのガイドを表示中...');
    
    const container = document.getElementById('guide-cards-container');
    if (!container) {
      console.error('ガイドコンテナが見つかりません');
      return;
    }

    // 既存のガイドカードを保持
    const existingCards = Array.from(container.querySelectorAll('.guide-item'));
    const existingIds = existingCards.map(card => parseInt(card.dataset.guideId)).filter(id => !isNaN(id));
    
    // 全ガイドデータを取得
    const allGuides = getAllGuideData();
    
    // 新しいガイドのみ追加
    let addedCount = 0;
    allGuides.forEach(guide => {
      if (!existingIds.includes(guide.id)) {
        const guideHTML = createGuideCardHTML(guide);
        container.insertAdjacentHTML('beforeend', guideHTML);
        addedCount++;
      }
    });

    // カウンターを更新
    updateGuideCounter(allGuides.length);

    console.log(`${addedCount}件の新しいガイドカードを追加しました（総数: ${allGuides.length}件）`);
  }

  /**
   * すべてのガイドデータを取得
   */
  function getAllGuideData() {
    const guides = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('guide_')) {
        try {
          const guideData = JSON.parse(localStorage.getItem(key));
          if (guideData && guideData.id) {
            guides.push(guideData);
          }
        } catch (e) {
          console.warn('無効なガイドデータをスキップ:', key);
        }
      }
    }
    
    // IDでソート
    guides.sort((a, b) => a.id - b.id);
    
    return guides;
  }

  /**
   * ガイドカードのHTMLを生成
   */
  function createGuideCardHTML(guide) {
    const languageBadges = guide.languages.map(lang => 
      `<span class="badge bg-light text-dark me-1">${lang}</span>`
    ).join('');

    const stars = Math.floor(guide.rating);
    const halfStar = guide.rating % 1 >= 0.5;
    
    let starsHTML = '';
    for (let s = 0; s < stars; s++) {
      starsHTML += '<i class="bi bi-star-fill"></i>';
    }
    if (halfStar) {
      starsHTML += '<i class="bi bi-star-half"></i>';
    }
    for (let s = stars + (halfStar ? 1 : 0); s < 5; s++) {
      starsHTML += '<i class="bi bi-star"></i>';
    }

    return `
      <div class="col-md-4 guide-item mb-4" data-guide-id="${guide.id}" data-location="${guide.location}" data-languages="${guide.languages.join(',')}" data-fee="${guide.fee}" data-keywords="${guide.keywords.join(',')}">
        <div class="card guide-card shadow-sm h-100">
          <img src="${guide.image}" class="card-img-top guide-image" alt="${guide.name}の写真" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${guide.name}</h5>
              <span class="badge bg-primary">¥${guide.fee.toLocaleString()}/セッション</span>
            </div>
            <p class="card-text text-muted mb-2">
              <i class="bi bi-geo-alt-fill me-1"></i>${guide.location}
            </p>
            <p class="card-text mb-3">${guide.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="guide-languages">
                ${languageBadges}
              </div>
              <div class="text-warning">
                ${starsHTML}
                <span class="text-dark ms-1">${guide.rating}</span>
              </div>
            </div>
          </div>
          <div class="card-footer bg-white border-0 pt-0">
            <button class="btn btn-outline-primary w-100 guide-details-link" data-guide-id="${guide.id}">
              <i class="bi bi-eye me-1"></i>詳細を見る
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * ガイドカウンターを更新
   */
  function updateGuideCounter(count) {
    const counter = document.getElementById('search-results-counter');
    if (counter) {
      counter.textContent = `${count}人のガイドが見つかりました`;
    }
  }

  /**
   * "もっと見る"ボタンのセットアップ
   */
  function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-guides');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() {
        // 将来的な拡張: ページネーション機能
        console.log('もっと見るボタンがクリックされました');
      });
    }
  }

  /**
   * ガイド登録フォームのセットアップ
   */
  function setupGuideRegistrationForm() {
    const form = document.getElementById('guideRegistrationForm');
    if (form) {
      form.addEventListener('submit', handleGuideRegistration);
    }
  }

  /**
   * ガイド登録処理
   */
  function handleGuideRegistration(event) {
    event.preventDefault();
    
    console.log('ガイド登録フォームが送信されました');
    
    const form = event.target;
    const formData = new FormData(form);
    const lastId = parseInt(localStorage.getItem('lastGuideId') || '0');
    const newId = lastId + 1;
    
    // 言語の収集（複数選択対応）
    const selectedLanguages = [];
    const languageCheckboxes = form.querySelectorAll('input[name="guide-languages"]:checked');
    languageCheckboxes.forEach(checkbox => {
      selectedLanguages.push(checkbox.value);
    });
    
    // バリデーション
    const name = formData.get('guide-name');
    const location = formData.get('guide-location');
    const specialty = formData.get('guide-specialty');
    const description = formData.get('guide-description');
    const fee = parseInt(formData.get('guide-fee'));
    
    if (!name || !location || !specialty || !description) {
      showErrorMessage('すべての必須項目を入力してください。');
      return;
    }
    
    if (fee < 6000) {
      showErrorMessage('料金は6,000円以上で設定してください。');
      return;
    }
    
    if (selectedLanguages.length === 0) {
      showErrorMessage('対応言語を1つ以上選択してください。');
      return;
    }
    
    // フォームデータからガイド情報を構築
    const guideData = {
      id: newId,
      name: name.trim(),
      location: location,
      specialty: specialty,
      description: description.trim(),
      languages: selectedLanguages,
      fee: fee,
      rating: 4.0,
      image: `https://images.unsplash.com/photo-${1544620347 + newId}?w=400&h=300&fit=crop`,
      keywords: (formData.get('guide-keywords') || '').split(',').map(k => k.trim()).filter(k => k),
      isInitial: false,
      createdAt: new Date().toISOString()
    };
    
    // ローカルストレージに保存
    localStorage.setItem(`guide_${newId}`, JSON.stringify(guideData));
    localStorage.setItem('lastGuideId', newId.toString());
    
    // ガイド登録完了イベントを発火
    const event_registered = new CustomEvent('guideRegistered', { detail: guideData });
    document.dispatchEvent(event_registered);
    
    // フォームをリセット
    form.reset();
    
    console.log('新しいガイドが登録されました:', guideData);
  }

  /**
   * 新しいガイド登録を処理
   */
  function handleNewGuideRegistration(event) {
    const newGuide = event.detail;
    console.log('新しいガイドが登録されました:', newGuide);
    
    // ガイド表示を更新
    displayAllGuides();
    
    // 成功メッセージを表示
    showSuccessMessage('ガイドが正常に登録されました！');
    
    // モーダルを閉じる
    const modal = document.getElementById('registerGuideModal');
    if (modal && window.bootstrap) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  /**
   * ストレージ変更を処理
   */
  function handleStorageChange(event) {
    if (event.key && event.key.startsWith('guide_')) {
      console.log('ガイドデータが変更されました:', event.key);
      displayAllGuides();
    }
  }

  /**
   * 成功メッセージを表示
   */
  function showSuccessMessage(message) {
    showToastMessage(message, 'success');
  }

  /**
   * エラーメッセージを表示
   */
  function showErrorMessage(message) {
    showToastMessage(message, 'error');
  }

  /**
   * トースト通知を表示
   */
  function showToastMessage(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    const backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${backgroundColor};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s;
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.style.opacity = '1', 100);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, type === 'error' ? 5000 : 3000);
  }

  // システム初期化
  initializeDynamicGuideSystem();

  // グローバル関数として公開
  window.DynamicGuideSystem = {
    displayAllGuides: displayAllGuides,
    getAllGuideData: getAllGuideData,
    createGuideCardHTML: createGuideCardHTML,
    updateGuideCounter: updateGuideCounter
  };

})();