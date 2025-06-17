/**
 * プロフィールフォーム同期システム
 * フォーム入力をリアルタイムでガイドカードに反映
 */

class ProfileFormSync {
  constructor() {
    this.currentGuideId = this.getCurrentGuideId();
    this.init();
  }

  /**
   * システム初期化
   */
  init() {
    if (window.location.pathname.includes('guide-profile.html')) {
      this.setupFormListeners();
      this.loadSavedData();
      console.log('プロフィールフォーム同期システムを初期化しました');
    }
  }

  /**
   * 現在のガイドIDを取得
   */
  getCurrentGuideId() {
    return sessionStorage.getItem('currentGuideId') || 
           localStorage.getItem('currentGuideId') || 
           '1';
  }

  /**
   * フォームイベントリスナーを設定
   */
  setupFormListeners() {
    // 自己紹介文の監視
    const bioField = document.getElementById('guide-bio');
    if (bioField) {
      bioField.addEventListener('input', () => {
        this.handleBioChange(bioField.value);
      });
      bioField.addEventListener('blur', () => {
        this.saveProfileData();
      });
    }

    // 名前の監視
    const nameField = document.getElementById('guide-name');
    if (nameField) {
      nameField.addEventListener('input', () => {
        this.handleNameChange(nameField.value);
      });
      nameField.addEventListener('blur', () => {
        this.saveProfileData();
      });
    }

    // 場所の監視
    const locationField = document.getElementById('guide-location');
    if (locationField) {
      locationField.addEventListener('input', () => {
        this.handleLocationChange(locationField.value);
      });
      locationField.addEventListener('blur', () => {
        this.saveProfileData();
      });
    }

    // 料金の監視
    const feeField = document.getElementById('guide-fee');
    if (feeField) {
      feeField.addEventListener('input', () => {
        this.handleFeeChange(feeField.value);
      });
      feeField.addEventListener('blur', () => {
        this.saveProfileData();
      });
    }

    // 言語選択の監視
    this.setupLanguageListeners();

    // フォーム送信の監視
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProfileData();
        this.showSaveConfirmation();
      });
    });

    // 保存ボタンの監視
    const saveButtons = document.querySelectorAll('[type="submit"], .btn-primary');
    saveButtons.forEach(button => {
      if (button.textContent.includes('保存') || button.textContent.includes('更新')) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.saveProfileData();
          this.showSaveConfirmation();
        });
      }
    });
  }

  /**
   * 言語選択の監視を設定
   */
  setupLanguageListeners() {
    const languageCheckboxes = document.querySelectorAll('input[type="checkbox"][value*="語"]');
    languageCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.handleLanguageChange();
      });
    });
  }

  /**
   * 自己紹介文変更処理
   */
  handleBioChange(bio) {
    this.updateProfileData({ bio });
    this.triggerCardUpdate({ bio });
  }

  /**
   * 名前変更処理
   */
  handleNameChange(name) {
    this.updateProfileData({ name });
    this.triggerCardUpdate({ name });
  }

  /**
   * 場所変更処理
   */
  handleLocationChange(location) {
    this.updateProfileData({ location });
    this.triggerCardUpdate({ location });
  }

  /**
   * 料金変更処理
   */
  handleFeeChange(fee) {
    this.updateProfileData({ fee });
    this.triggerCardUpdate({ fee });
  }

  /**
   * 言語変更処理
   */
  handleLanguageChange() {
    const selectedLanguages = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"][value*="語"]:checked');
    
    checkboxes.forEach(checkbox => {
      selectedLanguages.push(checkbox.value);
    });

    if (selectedLanguages.length === 0) {
      selectedLanguages.push('日本語'); // デフォルト
    }

    this.updateProfileData({ languages: selectedLanguages });
    this.triggerCardUpdate({ languages: selectedLanguages });
  }

  /**
   * プロフィールデータを更新
   */
  updateProfileData(newData) {
    const profiles = this.getStoredProfiles();
    if (!profiles[this.currentGuideId]) {
      profiles[this.currentGuideId] = {};
    }

    Object.assign(profiles[this.currentGuideId], newData);
    profiles[this.currentGuideId].lastUpdated = new Date().toISOString();

    localStorage.setItem('guideProfiles', JSON.stringify(profiles));
  }

  /**
   * ガイドカード更新をトリガー
   */
  triggerCardUpdate(data) {
    // ガイドカード更新システムに通知
    if (window.guideCardUpdater) {
      window.guideCardUpdater.updateGuideCard(this.currentGuideId, data);
    }

    // 同期システムに通知
    if (window.GuideProfileSync) {
      const syncInstance = new window.GuideProfileSync();
      syncInstance.syncProfileInfo({
        guideId: this.currentGuideId,
        data: data
      });
    }

    // カスタムイベントを発火
    const event = new CustomEvent('profileInfoChanged', {
      detail: {
        guideId: this.currentGuideId,
        profileData: data
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * 保存済みデータを読み込み
   */
  loadSavedData() {
    const profiles = this.getStoredProfiles();
    const profileData = profiles[this.currentGuideId];

    if (!profileData) return;

    // フォームフィールドに値を設定
    if (profileData.bio) {
      const bioField = document.getElementById('guide-bio');
      if (bioField && !bioField.value) {
        bioField.value = profileData.bio;
      }
    }

    if (profileData.name) {
      const nameField = document.getElementById('guide-name');
      if (nameField && !nameField.value) {
        nameField.value = profileData.name;
      }
    }

    if (profileData.location) {
      const locationField = document.getElementById('guide-location');
      if (locationField && !locationField.value) {
        locationField.value = profileData.location;
      }
    }

    if (profileData.fee) {
      const feeField = document.getElementById('guide-fee');
      if (feeField && !feeField.value) {
        feeField.value = profileData.fee;
      }
    }

    if (profileData.languages) {
      profileData.languages.forEach(lang => {
        const checkbox = document.querySelector(`input[type="checkbox"][value="${lang}"]`);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    }
  }

  /**
   * 全プロフィールデータを保存
   */
  saveProfileData() {
    const profileData = {
      bio: document.getElementById('guide-bio')?.value || '',
      name: document.getElementById('guide-name')?.value || '',
      location: document.getElementById('guide-location')?.value || '',
      fee: document.getElementById('guide-fee')?.value || '5000'
    };

    // 選択された言語を取得
    const selectedLanguages = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"][value*="語"]:checked');
    checkboxes.forEach(checkbox => {
      selectedLanguages.push(checkbox.value);
    });
    profileData.languages = selectedLanguages.length > 0 ? selectedLanguages : ['日本語'];

    this.updateProfileData(profileData);
    this.triggerCardUpdate(profileData);

    console.log('プロフィールデータを保存しました:', profileData);
  }

  /**
   * 保存確認メッセージを表示
   */
  showSaveConfirmation() {
    const messageHtml = `
      <div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; width: auto; max-width: 400px;">
        <i class="bi bi-check-circle me-2"></i>プロフィールを保存しました
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', messageHtml);

    setTimeout(() => {
      const alert = document.querySelector('.alert-success');
      if (alert) {
        alert.remove();
      }
    }, 3000);
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
}

// グローバルに公開
window.ProfileFormSync = ProfileFormSync;

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.profileFormSync = new ProfileFormSync();
  });
} else {
  window.profileFormSync = new ProfileFormSync();
}