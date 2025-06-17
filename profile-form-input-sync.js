/**
 * プロフィールフォーム入力同期システム
 * ユーザーがフォームに入力した内容を即座にプレビューと保存データに反映
 */

class ProfileFormInputSync {
  constructor() {
    this.currentData = {};
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    console.log('プロフィールフォーム入力同期システムを開始');
    
    // 現在のデータを読み込み
    this.loadCurrentData();
    
    // フォームリスナーを設定
    this.setupFormListeners();
    
    // プレビュー更新システムを設定
    this.setupPreviewSync();
    
    // 保存機能を設定
    this.setupSaveFunction();
  }

  /**
   * 現在のデータを読み込み
   */
  loadCurrentData() {
    // セッションストレージから現在のユーザー情報を取得
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      try {
        this.currentData = JSON.parse(currentUser);
      } catch (e) {
        console.error('ユーザーデータ読み込みエラー:', e);
        this.currentData = {};
      }
    }

    // 初期値を設定
    if (!this.currentData.name) this.currentData.name = '';
    if (!this.currentData.username) this.currentData.username = '';
    if (!this.currentData.email) this.currentData.email = '';
    if (!this.currentData.phone) this.currentData.phone = '';
    if (!this.currentData.location) this.currentData.location = '';

    console.log('現在のデータ:', this.currentData);
  }

  /**
   * フォームリスナーを設定
   */
  setupFormListeners() {
    const fieldMappings = [
      { id: 'guide-name', key: 'name', label: '氏名' },
      { id: 'guide-username', key: 'username', label: 'ユーザー名' },
      { id: 'guide-email', key: 'email', label: 'メールアドレス' },
      { id: 'guide-phone', key: 'phone', label: '電話番号' },
      { id: 'guide-location', key: 'location', label: '活動エリア' }
    ];

    fieldMappings.forEach(({ id, key, label }) => {
      const field = document.getElementById(id);
      if (field) {
        // 初期値を設定
        if (this.currentData[key]) {
          field.value = this.currentData[key];
        }

        // 入力イベントを監視
        field.addEventListener('input', (e) => {
          const value = e.target.value;
          this.handleFieldChange(key, value, label);
        });

        // フォーカス離脱時の処理
        field.addEventListener('blur', (e) => {
          const value = e.target.value;
          this.saveFieldData(key, value);
        });

        console.log(`${label}フィールドのリスナーを設定: ${id}`);
      }
    });
  }

  /**
   * フィールド変更処理
   */
  handleFieldChange(key, value, label) {
    // データを更新
    this.currentData[key] = value;
    
    // プレビューを即座に更新
    this.updatePreview(key, value);
    
    // サイドバーを更新
    this.updateSidebar();
    
    console.log(`${label}が変更されました: ${value}`);
  }

  /**
   * プレビュー更新
   */
  updatePreview(key, value) {
    const previewCard = document.querySelector('.profile-preview-card, .profile-preview, .card.preview');
    if (!previewCard) return;

    switch (key) {
      case 'name':
        // 名前要素を更新
        const nameElements = previewCard.querySelectorAll('h4, h5, .card-title, [class*="name"]');
        nameElements.forEach(element => {
          element.textContent = value || '名前未設定';
        });
        break;

      case 'username':
        // ユーザー名要素を更新
        const usernameElements = previewCard.querySelectorAll('small, [class*="username"]');
        usernameElements.forEach(element => {
          element.textContent = value ? `@${value}` : '@ユーザー名';
        });
        break;

      case 'location':
        // 場所要素を更新
        const locationElements = previewCard.querySelectorAll('[class*="location"]');
        locationElements.forEach(element => {
          if (element.innerHTML) {
            element.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${value || '活動地域未設定'}`;
          } else {
            element.textContent = value || '活動地域未設定';
          }
        });
        break;
    }
  }

  /**
   * サイドバー更新
   */
  updateSidebar() {
    const sidebarName = document.getElementById('user-name');
    if (sidebarName && this.currentData.name) {
      sidebarName.textContent = this.currentData.name;
    }
  }

  /**
   * プレビュー同期設定
   */
  setupPreviewSync() {
    // プレビューボタンのクリックイベント
    const previewButton = document.querySelector('button[class*="preview"], .btn[class*="preview"]');
    if (previewButton) {
      previewButton.addEventListener('click', () => {
        this.syncAllToPreview();
      });
    }

    // 定期的にプレビューを更新
    setInterval(() => {
      this.syncAllToPreview();
    }, 2000);
  }

  /**
   * 全てのデータをプレビューに同期
   */
  syncAllToPreview() {
    Object.keys(this.currentData).forEach(key => {
      if (this.currentData[key]) {
        this.updatePreview(key, this.currentData[key]);
      }
    });
  }

  /**
   * フィールドデータを保存
   */
  saveFieldData(key, value) {
    this.currentData[key] = value;
    
    // セッションストレージを更新
    sessionStorage.setItem('currentUser', JSON.stringify(this.currentData));
    
    // ローカルストレージのプロフィールも更新
    const profiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
    const userId = this.currentData.id || 'current';
    
    if (!profiles[userId]) {
      profiles[userId] = {};
    }
    
    profiles[userId][key] = value;
    profiles[userId].lastUpdated = new Date().toISOString();
    
    localStorage.setItem('guideProfiles', JSON.stringify(profiles));
    
    console.log(`${key}を保存: ${value}`);
  }

  /**
   * 保存機能を設定
   */
  setupSaveFunction() {
    // 基本情報保存ボタン
    const saveBasicButton = document.getElementById('save-basic-info');
    if (saveBasicButton) {
      saveBasicButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.saveAllData();
        this.updateAllDisplays();
      });
    }

    // その他の保存ボタン
    const saveButtons = document.querySelectorAll('button[type="submit"], .btn-success, button[class*="save"]');
    
    saveButtons.forEach(button => {
      if (button.textContent.includes('保存') || button.textContent.includes('更新')) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.saveAllData();
          this.updateAllDisplays();
        });
      }
    });

    // フォーム送信イベント
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveAllData();
        this.updateAllDisplays();
      });
    });
  }

  /**
   * 全データを保存
   */
  saveAllData() {
    // 現在のフォーム値を取得
    const fieldMappings = [
      { id: 'guide-name', key: 'name' },
      { id: 'guide-username', key: 'username' },
      { id: 'guide-email', key: 'email' },
      { id: 'guide-phone', key: 'phone' },
      { id: 'guide-location', key: 'location' }
    ];

    fieldMappings.forEach(({ id, key }) => {
      const field = document.getElementById(id);
      if (field) {
        this.currentData[key] = field.value;
      }
    });

    // セッションストレージを更新
    sessionStorage.setItem('currentUser', JSON.stringify(this.currentData));

    // ローカルストレージを更新
    const profiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
    const userId = this.currentData.id || 'current';
    
    profiles[userId] = {
      ...profiles[userId],
      ...this.currentData,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('guideProfiles', JSON.stringify(profiles));

    // 成功メッセージを表示
    this.showSaveSuccess();

    console.log('全データ保存完了:', this.currentData);
  }

  /**
   * 保存成功メッセージを表示
   */
  showSaveSuccess() {
    const messageHtml = `
      <div class="alert alert-success alert-dismissible fade show position-fixed" 
           style="top: 20px; right: 20px; z-index: 9999; width: auto; max-width: 400px;">
        <i class="bi bi-check-circle me-2"></i>
        基本情報を保存しました
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
   * 手動でデータを取得
   */
  getCurrentFormData() {
    const formData = {};
    const fieldMappings = [
      { id: 'guide-name', key: 'name' },
      { id: 'guide-username', key: 'username' },
      { id: 'guide-email', key: 'email' },
      { id: 'guide-phone', key: 'phone' },
      { id: 'guide-location', key: 'location' }
    ];

    fieldMappings.forEach(({ id, key }) => {
      const field = document.getElementById(id);
      if (field) {
        formData[key] = field.value;
      }
    });

    return formData;
  }

  /**
   * 手動でプレビューを更新
   */
  forceUpdatePreview() {
    const formData = this.getCurrentFormData();
    Object.keys(formData).forEach(key => {
      this.updatePreview(key, formData[key]);
    });
  }

  /**
   * 全ての表示を更新
   */
  updateAllDisplays() {
    // プレビューカードを更新
    this.syncAllToPreview();
    
    // サイドバーを更新
    this.updateSidebar();
    
    // ナビバーのユーザーメニューを更新
    this.updateNavbarUserMenu();
    
    console.log('全ての表示を更新しました');
  }

  /**
   * ナビバーのユーザーメニューを更新
   */
  updateNavbarUserMenu() {
    const userMenuButton = document.querySelector('#userMenuDropdown');
    if (userMenuButton && this.currentData.name) {
      const nameSpan = userMenuButton.querySelector('span:last-child');
      if (nameSpan) {
        nameSpan.textContent = this.currentData.name;
      } else {
        // ボタンテキストを直接更新
        const icon = userMenuButton.querySelector('i');
        userMenuButton.innerHTML = '';
        if (icon) {
          userMenuButton.appendChild(icon);
        }
        userMenuButton.innerHTML += this.currentData.name;
      }
    }
  }
}

// グローバルに公開
window.ProfileFormInputSync = ProfileFormInputSync;

// 自動初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.profileFormInputSync = new ProfileFormInputSync();
  });
} else {
  window.profileFormInputSync = new ProfileFormInputSync();
}

// ページ表示時にも初期化
window.addEventListener('pageshow', () => {
  if (!window.profileFormInputSync) {
    window.profileFormInputSync = new ProfileFormInputSync();
  }
});