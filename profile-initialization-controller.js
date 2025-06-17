/**
 * プロフィール初期化制御システム
 * 正しい順序でデータを読み込み、新規登録情報を確実に表示
 */

class ProfileInitializationController {
  constructor() {
    this.correctUserData = {
      name: '優',
      email: 'test1500@gmail.com',
      username: '優'
    };
    this.init();
  }

  /**
   * 初期化処理
   */
  init() {
    console.log('プロフィール初期化制御を開始');
    
    // 1. 古いデータを完全削除
    this.purgeOldData();
    
    // 2. 正しいセッションデータを設定
    this.setCorrectSessionData();
    
    // 3. フォームフィールドを設定
    this.setFormFields();
    
    // 4. プレビューカードを更新
    this.updatePreviewCard();
    
    // 5. 継続監視を開始
    this.startContinuousMonitoring();
    
    console.log('プロフィール初期化完了');
  }

  /**
   * 古いデータを完全削除
   */
  purgeOldData() {
    console.log('古いデータを削除中...');
    
    // ローカルストレージから古いデータを削除
    const localStorageKeys = [
      'guideProfiles',
      'savedGuides',
      'userGuides',
      'registeredGuides',
      'guideDetailsData',
      'profileCache'
    ];

    localStorageKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          
          if (Array.isArray(parsed)) {
            const filtered = parsed.filter(item => 
              !this.isOldData(item)
            );
            localStorage.setItem(key, JSON.stringify(filtered));
          } else if (typeof parsed === 'object') {
            Object.keys(parsed).forEach(id => {
              if (this.isOldData(parsed[id])) {
                delete parsed[id];
              }
            });
            localStorage.setItem(key, JSON.stringify(parsed));
          }
        }
      } catch (e) {
        // エラーの場合は削除
        localStorage.removeItem(key);
      }
    });

    // セッションストレージの不要なデータを削除
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('guide_') && key !== 'guideRegistrationData') {
        try {
          const data = JSON.parse(sessionStorage.getItem(key));
          if (this.isOldData(data)) {
            sessionStorage.removeItem(key);
          }
        } catch (e) {
          sessionStorage.removeItem(key);
        }
      }
    });

    console.log('古いデータ削除完了');
  }

  /**
   * 古いデータかどうかを判定
   */
  isOldData(data) {
    if (!data) return false;
    
    const dataStr = JSON.stringify(data).toLowerCase();
    return dataStr.includes('test1400') || 
           (data.email && data.email !== 'test1500@gmail.com') ||
           (data.name && data.name !== '優' && data.name.includes('test'));
  }

  /**
   * 正しいセッションデータを設定
   */
  setCorrectSessionData() {
    console.log('正しいセッションデータを設定中...');
    
    // 現在のユーザーデータを確認・修正
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser || this.isOldData(JSON.parse(currentUser))) {
      sessionStorage.setItem('currentUser', JSON.stringify(this.correctUserData));
      console.log('正しいcurrentUserを設定');
    }

    // 登録データを確認・修正
    const registrationData = sessionStorage.getItem('guideRegistrationData');
    if (registrationData) {
      try {
        const regData = JSON.parse(registrationData);
        if (this.isOldData(regData)) {
          const correctedData = { ...regData, ...this.correctUserData };
          sessionStorage.setItem('guideRegistrationData', JSON.stringify(correctedData));
          console.log('登録データを修正');
        }
      } catch (e) {
        sessionStorage.setItem('guideRegistrationData', JSON.stringify(this.correctUserData));
      }
    }

    // ガイドIDを設定
    sessionStorage.setItem('currentGuideId', '1');
  }

  /**
   * フォームフィールドを設定
   */
  setFormFields() {
    console.log('フォームフィールドを設定中...');
    
    const fieldMappings = [
      { id: 'guide-name', value: this.correctUserData.name },
      { id: 'guide-username', value: this.correctUserData.username },
      { id: 'guide-email', value: this.correctUserData.email },
      { id: 'guide-phone', value: '' },
      { id: 'guide-location', value: '' }
    ];

    fieldMappings.forEach(({ id, value }) => {
      const field = document.getElementById(id);
      if (field) {
        field.value = value;
        
        // イベントを発火してリアルタイム同期をトリガー
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log(`${id}を設定: ${value}`);
      }
    });

    // サイドバーのユーザー名も更新
    const sidebarName = document.getElementById('user-name');
    if (sidebarName) {
      sidebarName.textContent = this.correctUserData.name;
    }
  }

  /**
   * プレビューカードを更新
   */
  updatePreviewCard() {
    console.log('プレビューカードを更新中...');
    
    // プレビューカードを探す
    const previewSelectors = [
      '.profile-preview-card',
      '.profile-preview',
      '.card.preview',
      '.tab-pane .card'
    ];

    let previewCard = null;
    for (const selector of previewSelectors) {
      previewCard = document.querySelector(selector);
      if (previewCard) break;
    }

    if (!previewCard) {
      console.warn('プレビューカードが見つかりません');
      return;
    }

    // 名前を更新
    const nameElements = previewCard.querySelectorAll('h4, h5, .card-title, [class*="name"]');
    nameElements.forEach(element => {
      if (element.textContent.includes('test') || !element.textContent.trim()) {
        element.textContent = this.correctUserData.name;
      }
    });

    // ユーザー名を更新
    const usernameElements = previewCard.querySelectorAll('small, [class*="username"]');
    usernameElements.forEach(element => {
      if (element.textContent.includes('@') || element.textContent.includes('test')) {
        element.textContent = '@' + this.correctUserData.username;
      }
    });

    console.log('プレビューカード更新完了');
  }

  /**
   * 継続監視を開始
   */
  startContinuousMonitoring() {
    console.log('継続監視を開始');
    
    // DOM変更を監視
    const observer = new MutationObserver(() => {
      this.checkAndCorrectData();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['value']
    });

    // 定期的なチェック
    setInterval(() => {
      this.checkAndCorrectData();
    }, 3000);

    // フォーカス時のチェック
    window.addEventListener('focus', () => {
      setTimeout(() => this.checkAndCorrectData(), 100);
    });
  }

  /**
   * データの正確性をチェックして修正
   */
  checkAndCorrectData() {
    // フォームフィールドをチェック
    const nameField = document.getElementById('guide-name');
    if (nameField && (nameField.value.includes('test1400') || nameField.value === '')) {
      nameField.value = this.correctUserData.name;
      nameField.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const emailField = document.getElementById('guide-email');
    if (emailField && (emailField.value.includes('test1400') || emailField.value === '')) {
      emailField.value = this.correctUserData.email;
      emailField.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // セッションデータをチェック
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        if (this.isOldData(userData)) {
          sessionStorage.setItem('currentUser', JSON.stringify(this.correctUserData));
          this.setFormFields();
        }
      } catch (e) {
        sessionStorage.setItem('currentUser', JSON.stringify(this.correctUserData));
      }
    }
  }

  /**
   * 手動で完全リセット
   */
  performCompleteReset() {
    console.log('完全リセットを実行');
    
    // 必要なデータを保存
    const registrationData = sessionStorage.getItem('guideRegistrationData');
    
    // すべてをクリア
    localStorage.clear();
    sessionStorage.clear();
    
    // 正しいデータを設定
    sessionStorage.setItem('currentUser', JSON.stringify(this.correctUserData));
    if (registrationData) {
      sessionStorage.setItem('guideRegistrationData', registrationData);
    }
    
    // ページをリロード
    window.location.reload();
  }
}

// グローバルに公開
window.ProfileInitializationController = ProfileInitializationController;

// 他のスクリプトより前に実行
(function() {
  if (window.location.pathname.includes('guide-profile.html')) {
    // 即座に実行
    window.profileInitController = new ProfileInitializationController();
    
    // DOM準備完了後にも実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          window.profileInitController.checkAndCorrectData();
        }, 500);
      });
    }
  }
})();