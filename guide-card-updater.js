/**
 * ガイドカードのリアルタイム更新システム
 * プロフィール編集ページの変更をトップページに即座に反映
 */

class GuideCardUpdater {
  constructor() {
    this.init();
  }

  /**
   * システム初期化
   */
  init() {
    this.setupEventListeners();
    this.loadAndUpdateExistingCards();
    console.log('ガイドカード更新システムを初期化しました');
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    // ストレージ変更の監視
    window.addEventListener('storage', (e) => {
      if (e.key === 'guideProfiles') {
        this.handleProfileUpdate(e.newValue);
      }
    });

    // カスタムイベントの監視
    document.addEventListener('profilePhotoChanged', (event) => {
      this.updateGuideCardPhoto(event.detail.guideId, event.detail.photoUrl);
    });

    document.addEventListener('profileInfoChanged', (event) => {
      this.updateGuideCardInfo(event.detail.guideId, event.detail.profileData);
    });

    // ページロード時の初期更新
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.loadAndUpdateExistingCards();
      }, 1000);
    });
  }

  /**
   * プロフィール更新処理
   */
  handleProfileUpdate(newValue) {
    if (!newValue) return;

    try {
      const profiles = JSON.parse(newValue);
      Object.keys(profiles).forEach(guideId => {
        const profileData = profiles[guideId];
        this.updateGuideCard(guideId, profileData);
      });
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
    }
  }

  /**
   * 既存のガイドカードを読み込んで更新
   */
  loadAndUpdateExistingCards() {
    const profiles = this.getStoredProfiles();
    const currentUser = this.getCurrentUser();
    
    if (currentUser && profiles[currentUser.id]) {
      this.updateGuideCard(currentUser.id, profiles[currentUser.id]);
    }

    // すべてのガイドカードを更新
    Object.keys(profiles).forEach(guideId => {
      this.updateGuideCard(guideId, profiles[guideId]);
    });
  }

  /**
   * 特定のガイドカードを更新
   */
  updateGuideCard(guideId, profileData) {
    const guideCard = document.querySelector(`[data-guide-id="${guideId}"]`);
    if (!guideCard) return;

    console.log(`ガイドカード更新中: ID=${guideId}`, profileData);

    // プロフィール写真を更新
    if (profileData.profilePhoto) {
      this.updateCardImage(guideCard, profileData.profilePhoto);
    }

    // 紹介文を更新
    if (profileData.bio) {
      this.updateCardDescription(guideCard, profileData.bio);
    }

    // 名前を更新
    if (profileData.name) {
      this.updateCardName(guideCard, profileData.name);
    }

    // 料金を更新
    if (profileData.fee) {
      this.updateCardFee(guideCard, profileData.fee);
    }

    // 場所を更新
    if (profileData.location) {
      this.updateCardLocation(guideCard, profileData.location);
    }

    console.log(`ガイドカード更新完了: ID=${guideId}`);
  }

  /**
   * カード画像を更新
   */
  updateCardImage(guideCard, imageUrl) {
    const image = guideCard.querySelector('.guide-image, .card-img-top');
    if (image) {
      image.src = imageUrl;
      image.onerror = () => {
        console.error('画像読み込みエラー:', imageUrl);
        image.src = 'https://placehold.co/400x300/e3f2fd/1976d2/png?text=Guide';
      };
      console.log('カード画像を更新しました:', imageUrl);
    }
  }

  /**
   * カード説明文を更新
   */
  updateCardDescription(guideCard, description) {
    // カード本文を探す（複数のパターンに対応）
    const descriptionElement = guideCard.querySelector('.card-text:not(.text-muted):not(.guide-location)') ||
                              guideCard.querySelector('p:not(.text-muted):not(.guide-location)') ||
                              guideCard.querySelector('.guide-description');
    
    if (descriptionElement) {
      descriptionElement.textContent = description;
      console.log('カード説明文を更新しました:', description);
    }
  }

  /**
   * カード名前を更新
   */
  updateCardName(guideCard, name) {
    const nameElement = guideCard.querySelector('.card-title, h5');
    if (nameElement) {
      nameElement.textContent = name;
      console.log('カード名前を更新しました:', name);
    }
  }

  /**
   * カード料金を更新
   */
  updateCardFee(guideCard, fee) {
    const feeElement = guideCard.querySelector('.guide-fee, .badge.bg-primary');
    if (feeElement) {
      const numericFee = fee.toString().replace(/[^\d]/g, '');
      feeElement.textContent = `¥${parseInt(numericFee).toLocaleString()}/セッション`;
      console.log('カード料金を更新しました:', fee);
    }
  }

  /**
   * カード場所を更新
   */
  updateCardLocation(guideCard, location) {
    const locationElement = guideCard.querySelector('.guide-location, .text-muted');
    if (locationElement) {
      locationElement.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${location}`;
      console.log('カード場所を更新しました:', location);
    }
  }

  /**
   * ガイドカード写真のみ更新（外部から呼び出し用）
   */
  updateGuideCardPhoto(guideId, photoUrl) {
    const guideCard = document.querySelector(`[data-guide-id="${guideId}"]`);
    if (guideCard) {
      this.updateCardImage(guideCard, photoUrl);
    }
  }

  /**
   * ガイドカード情報のみ更新（外部から呼び出し用）
   */
  updateGuideCardInfo(guideId, profileData) {
    this.updateGuideCard(guideId, profileData);
  }

  /**
   * 保存されたプロフィール情報を取得
   */
  getStoredProfiles() {
    try {
      return JSON.parse(localStorage.getItem('guideProfiles') || '{}');
    } catch (error) {
      console.error('プロフィールデータの読み込みエラー:', error);
      return {};
    }
  }

  /**
   * 現在のユーザー情報を取得
   */
  getCurrentUser() {
    try {
      const currentUser = sessionStorage.getItem('currentUser');
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error('現在のユーザー情報取得エラー:', error);
      return null;
    }
  }

  /**
   * 強制的にすべてのガイドカードを再読み込み
   */
  forceRefreshAllCards() {
    console.log('すべてのガイドカードを強制更新中...');
    this.loadAndUpdateExistingCards();
  }
}

// グローバルに公開
window.GuideCardUpdater = GuideCardUpdater;

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.guideCardUpdater = new GuideCardUpdater();
  });
} else {
  window.guideCardUpdater = new GuideCardUpdater();
}