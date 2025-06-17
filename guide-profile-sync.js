/**
 * ガイドプロフィール編集とトップページの同期システム
 * ガイドが編集した内容をリアルタイムでトップページに反映
 */

class GuideProfileSync {
  constructor() {
    this.currentGuideId = this.getCurrentGuideId();
    this.init();
  }

  /**
   * システム初期化
   */
  init() {
    this.setupEventListeners();
    this.loadGuideProfile();
  }

  /**
   * 現在ログイン中のガイドIDを取得
   * 実際のアプリケーションではセッションから取得
   */
  getCurrentGuideId() {
    // テスト用：ローカルストレージから取得
    return localStorage.getItem('currentGuideId') || '1';
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    // プロフィール写真変更の監視
    document.addEventListener('profilePhotoChanged', (event) => {
      this.syncProfilePhoto(event.detail);
    });

    // プロフィール情報変更の監視
    document.addEventListener('profileInfoChanged', (event) => {
      this.syncProfileInfo(event.detail);
    });

    // ページ離脱時の自動保存
    window.addEventListener('beforeunload', () => {
      this.saveCurrentProfile();
    });
  }

  /**
   * ガイドプロフィール情報を読み込み
   */
  loadGuideProfile() {
    const savedProfiles = this.getStoredProfiles();
    const profile = savedProfiles[this.currentGuideId];
    
    if (profile) {
      this.populateProfileForm(profile);
    }
  }

  /**
   * プロフィールフォームにデータを設定
   */
  populateProfileForm(profile) {
    // プロフィール写真
    const profilePhoto = document.getElementById('guide-profile-preview');
    if (profilePhoto && profile.profilePhoto) {
      profilePhoto.src = profile.profilePhoto;
    }

    // 基本情報
    const fields = ['guide-name', 'guide-username', 'guide-email', 'guide-location'];
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      const key = fieldId.replace('guide-', '');
      if (field && profile[key]) {
        field.value = profile[key];
      }
    });

    // 自己紹介
    const bioField = document.getElementById('guide-bio');
    if (bioField && profile.bio) {
      bioField.value = profile.bio;
    }

    // 料金
    const feeField = document.getElementById('guide-fee');
    if (feeField && profile.fee) {
      feeField.value = profile.fee;
    }
  }

  /**
   * プロフィール写真の同期
   */
  syncProfilePhoto(photoData) {
    const { guideId, photoUrl } = photoData;
    
    // ローカルストレージに保存
    const profiles = this.getStoredProfiles();
    if (!profiles[guideId]) profiles[guideId] = {};
    profiles[guideId].profilePhoto = photoUrl;
    profiles[guideId].lastUpdated = new Date().toISOString();
    
    localStorage.setItem('guideProfiles', JSON.stringify(profiles));
    
    // トップページのガイドカードを更新
    this.updateTopPageGuideCard(guideId, { profilePhoto: photoUrl });
    
    console.log(`ガイド${guideId}のプロフィール写真を同期しました`);
  }

  /**
   * プロフィール情報の同期
   */
  syncProfileInfo(profileData) {
    const { guideId, data } = profileData;
    
    // ローカルストレージに保存
    const profiles = this.getStoredProfiles();
    if (!profiles[guideId]) profiles[guideId] = {};
    
    Object.assign(profiles[guideId], data);
    profiles[guideId].lastUpdated = new Date().toISOString();
    
    localStorage.setItem('guideProfiles', JSON.stringify(profiles));
    
    // トップページのガイドカードを更新
    this.updateTopPageGuideCard(guideId, data);
    
    console.log(`ガイド${guideId}のプロフィール情報を同期しました`);
  }

  /**
   * トップページのガイドカードを更新
   */
  updateTopPageGuideCard(guideId, data) {
    // 現在のページがトップページかチェック
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
      // 他のタブでトップページが開いている場合の処理
      this.broadcastToTopPage(guideId, data);
      return;
    }

    const guideCard = document.querySelector(`[data-guide-id="${guideId}"]`);
    if (!guideCard) return;

    // プロフィール写真を更新
    if (data.profilePhoto) {
      const profileImg = guideCard.querySelector('.guide-profile-photo');
      if (profileImg) {
        profileImg.src = data.profilePhoto;
      }
    }

    // ガイド名を更新
    if (data.name) {
      const nameElement = guideCard.querySelector('.card-title');
      if (nameElement) {
        nameElement.textContent = data.name;
      }
    }

    // 地域を更新
    if (data.location) {
      const locationElement = guideCard.querySelector('.guide-location');
      if (locationElement) {
        locationElement.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${data.location}`;
      }
      
      // データ属性も更新
      guideCard.setAttribute('data-location', data.location);
    }

    // 料金を更新
    if (data.fee) {
      const feeElement = guideCard.querySelector('.badge.bg-primary');
      if (feeElement) {
        feeElement.textContent = `¥${Number(data.fee).toLocaleString()}/セッション`;
      }
      
      // データ属性も更新
      guideCard.setAttribute('data-fee', data.fee);
    }

    // 自己紹介を更新
    if (data.bio) {
      const bioElement = guideCard.querySelector('.card-text');
      if (bioElement && !bioElement.classList.contains('text-muted')) {
        bioElement.textContent = data.bio;
      }
    }
  }

  /**
   * 他のタブのトップページに更新情報をブロードキャスト
   */
  broadcastToTopPage(guideId, data) {
    // LocalStorage変更イベントを使用してタブ間通信
    const broadcastData = {
      type: 'guideProfileUpdate',
      guideId,
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem('guideBroadcast', JSON.stringify(broadcastData));
    
    // 即座に削除（イベントトリガーのため）
    setTimeout(() => {
      localStorage.removeItem('guideBroadcast');
    }, 100);
  }

  /**
   * 現在のプロフィール情報を保存
   */
  saveCurrentProfile() {
    const profileData = this.collectCurrentProfileData();
    if (profileData && Object.keys(profileData).length > 0) {
      this.syncProfileInfo({
        guideId: this.currentGuideId,
        data: profileData
      });
    }
  }

  /**
   * 現在のフォームからプロフィールデータを収集
   */
  collectCurrentProfileData() {
    const data = {};
    
    // 基本情報フィールド
    const fields = {
      'guide-name': 'name',
      'guide-username': 'username',
      'guide-email': 'email',
      'guide-location': 'location',
      'guide-bio': 'bio',
      'guide-fee': 'fee'
    };

    Object.entries(fields).forEach(([fieldId, key]) => {
      const field = document.getElementById(fieldId);
      if (field && field.value.trim()) {
        data[key] = field.value.trim();
      }
    });

    return data;
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
   * 特定のガイドのプロフィール情報を取得
   */
  getGuideProfile(guideId) {
    const profiles = this.getStoredProfiles();
    return profiles[guideId] || null;
  }

  /**
   * プロフィール写真変更イベントを発火
   */
  static triggerProfilePhotoChange(guideId, photoUrl) {
    const event = new CustomEvent('profilePhotoChanged', {
      detail: { guideId, photoUrl }
    });
    document.dispatchEvent(event);
  }

  /**
   * プロフィール情報変更イベントを発火
   */
  static triggerProfileInfoChange(guideId, data) {
    const event = new CustomEvent('profileInfoChanged', {
      detail: { guideId, data }
    });
    document.dispatchEvent(event);
  }
}

// LocalStorage変更イベントリスナー（タブ間通信用）
window.addEventListener('storage', function(e) {
  if (e.key === 'guideBroadcast' && e.newValue) {
    try {
      const broadcastData = JSON.parse(e.newValue);
      if (broadcastData.type === 'guideProfileUpdate') {
        const sync = new GuideProfileSync();
        sync.updateTopPageGuideCard(broadcastData.guideId, broadcastData.data);
      }
    } catch (error) {
      console.error('ブロードキャストデータの処理エラー:', error);
    }
  }
});

// グローバルに公開
window.GuideProfileSync = GuideProfileSync;