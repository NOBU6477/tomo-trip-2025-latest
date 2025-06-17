/**
 * プロフィールプレビューリアルタイム更新システム
 * フォーム入力を即座にプレビューカードに反映
 */

class ProfilePreviewUpdater {
  constructor() {
    this.previewCard = null;
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    if (window.location.pathname.includes('guide-profile.html')) {
      this.findPreviewCard();
      this.setupFormListeners();
      this.loadCurrentData();
      console.log('プロフィールプレビュー更新システムを初期化');
    }
  }

  /**
   * プレビューカードを特定
   */
  findPreviewCard() {
    // 複数のセレクタでプレビューカードを探す
    const selectors = [
      '.profile-preview-card',
      '.profile-preview',
      '.card.preview',
      '[class*="preview"] .card',
      '.tab-pane .card'
    ];

    for (const selector of selectors) {
      const cards = document.querySelectorAll(selector);
      for (const card of cards) {
        // プレビューカードらしい要素を判定
        if (card.querySelector('.guide-preview-name') || 
            card.textContent.includes('プロフィールプレビュー') ||
            card.closest('.profile-preview-container')) {
          this.previewCard = card;
          console.log('プレビューカードを特定:', selector);
          return;
        }
      }
    }

    console.warn('プレビューカードが見つかりません');
  }

  /**
   * フォームリスナーを設定
   */
  setupFormListeners() {
    // 名前フィールド
    const nameField = document.getElementById('guide-name');
    if (nameField) {
      nameField.addEventListener('input', (e) => {
        this.updatePreviewName(e.target.value);
      });
    }

    // ユーザー名フィールド
    const usernameField = document.getElementById('guide-username');
    if (usernameField) {
      usernameField.addEventListener('input', (e) => {
        this.updatePreviewUsername(e.target.value);
      });
    }

    // メールアドレスフィールド
    const emailField = document.getElementById('guide-email');
    if (emailField) {
      emailField.addEventListener('input', (e) => {
        this.updatePreviewEmail(e.target.value);
      });
    }

    // 場所フィールド
    const locationField = document.getElementById('guide-location');
    if (locationField) {
      locationField.addEventListener('input', (e) => {
        this.updatePreviewLocation(e.target.value);
      });
    }

    // 自己紹介フィールド
    const bioField = document.getElementById('guide-description') || document.getElementById('guide-bio');
    if (bioField) {
      bioField.addEventListener('input', (e) => {
        this.updatePreviewBio(e.target.value);
      });
    }

    // 料金フィールド
    const feeField = document.getElementById('guide-session-fee') || document.getElementById('guide-fee');
    if (feeField) {
      feeField.addEventListener('input', (e) => {
        this.updatePreviewFee(e.target.value);
      });
    }

    // 言語選択
    const languageCheckboxes = document.querySelectorAll('input[type="checkbox"][name="languages"]');
    languageCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updatePreviewLanguages();
      });
    });
  }

  /**
   * 現在のデータを読み込み
   */
  loadCurrentData() {
    // セッションストレージから現在のユーザー情報を取得
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        this.updateAllPreviewData(userData);
      } catch (e) {
        console.error('ユーザーデータ読み込みエラー:', e);
      }
    }

    // フォームフィールドからも読み込み
    this.updateFromFormFields();
  }

  /**
   * フォームフィールドから値を読み込み
   */
  updateFromFormFields() {
    const nameField = document.getElementById('guide-name');
    if (nameField && nameField.value) {
      this.updatePreviewName(nameField.value);
    }

    const usernameField = document.getElementById('guide-username');
    if (usernameField && usernameField.value) {
      this.updatePreviewUsername(usernameField.value);
    }

    const emailField = document.getElementById('guide-email');
    if (emailField && emailField.value) {
      this.updatePreviewEmail(emailField.value);
    }

    const locationField = document.getElementById('guide-location');
    if (locationField && locationField.value) {
      this.updatePreviewLocation(locationField.value);
    }
  }

  /**
   * プレビューの名前を更新
   */
  updatePreviewName(name) {
    if (!this.previewCard) {
      this.findPreviewCard();
      if (!this.previewCard) return;
    }

    const nameElements = this.previewCard.querySelectorAll('h4, h5, .guide-preview-name, .card-title, .name');
    nameElements.forEach(element => {
      if (element.textContent.includes('優') || element.textContent.includes('test') || !element.textContent.trim()) {
        element.textContent = name || '優';
      }
    });

    // サイドバーのユーザー名も更新
    const sidebarName = document.getElementById('user-name');
    if (sidebarName) {
      sidebarName.textContent = name || '優';
    }

    console.log('プレビュー名前更新:', name);
  }

  /**
   * プレビューのユーザー名を更新
   */
  updatePreviewUsername(username) {
    if (!this.previewCard) return;

    const usernameElements = this.previewCard.querySelectorAll('.guide-preview-username, .username, small');
    usernameElements.forEach(element => {
      if (element.textContent.includes('@') || element.textContent.includes('優')) {
        element.textContent = '@' + (username || '優');
      }
    });

    console.log('プレビューユーザー名更新:', username);
  }

  /**
   * プレビューのメールアドレスを更新
   */
  updatePreviewEmail(email) {
    if (!this.previewCard) return;

    const emailElements = this.previewCard.querySelectorAll('.email, [class*="email"]');
    emailElements.forEach(element => {
      if (element.textContent.includes('@') || element.textContent.includes('test')) {
        element.textContent = email || 'test1500@gmail.com';
      }
    });

    console.log('プレビューメール更新:', email);
  }

  /**
   * プレビューの場所を更新
   */
  updatePreviewLocation(location) {
    if (!this.previewCard) return;

    const locationElements = this.previewCard.querySelectorAll('.guide-preview-location, .location, [class*="location"]');
    locationElements.forEach(element => {
      if (element.innerHTML) {
        element.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${location || '活動地域'}`;
      } else {
        element.textContent = location || '活動地域';
      }
    });

    console.log('プレビュー場所更新:', location);
  }

  /**
   * プレビューの自己紹介を更新
   */
  updatePreviewBio(bio) {
    if (!this.previewCard) return;

    const bioElements = this.previewCard.querySelectorAll('p, .guide-preview-description, .description, .bio');
    bioElements.forEach(element => {
      if (element.textContent.includes('自己紹介') || element.textContent.includes('表示されます') || !element.textContent.trim()) {
        element.textContent = bio || '自己紹介文がここに表示されます。';
      }
    });

    console.log('プレビュー自己紹介更新:', bio?.substring(0, 30) + '...');
  }

  /**
   * プレビューの料金を更新
   */
  updatePreviewFee(fee) {
    if (!this.previewCard) return;

    const feeElements = this.previewCard.querySelectorAll('.guide-preview-fee-value, .fee, .price, [class*="fee"]');
    feeElements.forEach(element => {
      if (element.textContent.includes('¥') || element.textContent.includes('セッション')) {
        const formattedFee = Number(fee || 5000).toLocaleString();
        element.textContent = `¥${formattedFee} / セッション`;
      }
    });

    console.log('プレビュー料金更新:', fee);
  }

  /**
   * プレビューの言語を更新
   */
  updatePreviewLanguages() {
    if (!this.previewCard) return;

    const languageContainer = this.previewCard.querySelector('.guide-preview-languages, .languages, [class*="language"]');
    if (!languageContainer) return;

    // 選択された言語を取得
    const selectedLanguages = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="languages"]:checked');
    checkboxes.forEach(checkbox => {
      selectedLanguages.push(checkbox.value);
    });

    if (selectedLanguages.length === 0) {
      selectedLanguages.push('日本語');
    }

    // 言語バッジを生成
    const badgeHTML = selectedLanguages.map(lang => 
      `<span class="badge bg-light text-dark me-1">${lang}</span>`
    ).join('');

    languageContainer.innerHTML = badgeHTML;

    console.log('プレビュー言語更新:', selectedLanguages);
  }

  /**
   * 全てのプレビューデータを更新
   */
  updateAllPreviewData(userData) {
    this.updatePreviewName(userData.name);
    this.updatePreviewUsername(userData.username || userData.name);
    this.updatePreviewEmail(userData.email);
    this.updatePreviewLocation(userData.location || userData.city);
    this.updatePreviewBio(userData.bio);
    this.updatePreviewFee(userData.fee);
  }

  /**
   * プレビューカードを強制更新
   */
  forceUpdate() {
    this.findPreviewCard();
    this.loadCurrentData();
    this.updateFromFormFields();
  }
}

// グローバルに公開
window.ProfilePreviewUpdater = ProfilePreviewUpdater;

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.profilePreviewUpdater = new ProfilePreviewUpdater();
  });
} else {
  window.profilePreviewUpdater = new ProfilePreviewUpdater();
}

// ページ表示時にも更新
window.addEventListener('pageshow', () => {
  if (window.profilePreviewUpdater) {
    window.profilePreviewUpdater.forceUpdate();
  }
});