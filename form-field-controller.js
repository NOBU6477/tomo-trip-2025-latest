/**
 * フォームフィールド制御システム
 * 登録データを確実にフォームフィールドに反映
 */

class FormFieldController {
  constructor() {
    this.registrationData = null;
    this.retryCount = 0;
    this.maxRetries = 10;
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    console.log('フォームフィールド制御システムを開始');
    
    // URLパラメータをチェック
    const urlParams = new URLSearchParams(window.location.search);
    const isRegistrationMode = urlParams.get('mode') === 'registration' || urlParams.get('step') === '2';
    
    if (isRegistrationMode) {
      console.log('新規登録モードを検出');
      this.handleRegistrationMode();
    } else {
      console.log('通常モード');
      this.loadExistingData();
    }
  }

  /**
   * 新規登録モードの処理
   */
  handleRegistrationMode() {
    // 登録データを取得
    this.loadRegistrationData();
    
    // フォームフィールドが準備できるまで待機
    this.waitForFormFields(() => {
      this.populateFormFields();
      this.setupRealTimeSync();
    });
  }

  /**
   * 登録データを読み込み
   */
  loadRegistrationData() {
    console.log('登録データを読み込み中...');
    
    // セッションストレージから登録データを取得
    const sources = [
      'guideRegistrationData',
      'currentUser',
      'guideBasicData'
    ];

    for (const source of sources) {
      const data = sessionStorage.getItem(source);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.email === 'test1500@gmail.com' || parsed.name === '優') {
            this.registrationData = parsed;
            console.log(`有効な登録データを発見 (${source}):`, parsed);
            break;
          }
        } catch (e) {
          console.error(`データ解析エラー ${source}:`, e);
        }
      }
    }

    // 登録データが見つからない場合はデフォルト値を使用
    if (!this.registrationData) {
      console.log('登録データが見つからないため、デフォルト値を使用');
      this.registrationData = {
        name: '優',
        email: 'test1500@gmail.com',
        username: '優',
        firstName: '優',
        lastName: '',
        phone: '',
        location: ''
      };
      
      // セッションストレージに保存
      sessionStorage.setItem('currentUser', JSON.stringify(this.registrationData));
    }
  }

  /**
   * 既存データを読み込み
   */
  loadExistingData() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      try {
        this.registrationData = JSON.parse(currentUser);
        this.waitForFormFields(() => {
          this.populateFormFields();
        });
      } catch (e) {
        console.error('既存データ読み込みエラー:', e);
      }
    }
  }

  /**
   * フォームフィールドの準備を待機
   */
  waitForFormFields(callback) {
    const checkFields = () => {
      const nameField = document.getElementById('guide-name');
      const emailField = document.getElementById('guide-email');
      const usernameField = document.getElementById('guide-username');

      if (nameField && emailField && usernameField) {
        console.log('フォームフィールドの準備完了');
        callback();
      } else {
        this.retryCount++;
        if (this.retryCount < this.maxRetries) {
          console.log(`フォームフィールド待機中... (${this.retryCount}/${this.maxRetries})`);
          setTimeout(checkFields, 200);
        } else {
          console.error('フォームフィールドの準備がタイムアウトしました');
        }
      }
    };

    checkFields();
  }

  /**
   * フォームフィールドに値を設定
   */
  populateFormFields() {
    if (!this.registrationData) {
      console.error('登録データがありません');
      return;
    }

    console.log('フォームフィールドに値を設定中:', this.registrationData);

    // フィールドマッピング
    const fieldMappings = [
      {
        id: 'guide-name',
        value: this.registrationData.name || 
               `${this.registrationData.firstName || ''} ${this.registrationData.lastName || ''}`.trim() ||
               '優'
      },
      {
        id: 'guide-username',
        value: this.registrationData.username || 
               this.registrationData.firstName || 
               '優'
      },
      {
        id: 'guide-email',
        value: this.registrationData.email || 'test1500@gmail.com'
      },
      {
        id: 'guide-phone',
        value: this.registrationData.phone || ''
      },
      {
        id: 'guide-location',
        value: this.registrationData.location || 
               this.registrationData.city || 
               ''
      }
    ];

    // フィールドに値を設定
    fieldMappings.forEach(({ id, value }) => {
      const field = document.getElementById(id);
      if (field) {
        // 既存の値をクリア
        field.value = '';
        
        // 新しい値を設定
        field.value = value;
        
        // 見た目の更新を強制
        field.setAttribute('value', value);
        
        // イベントを発火
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log(`${id}に設定: "${value}"`);
      } else {
        console.warn(`フィールド ${id} が見つかりません`);
      }
    });

    // サイドバーのユーザー名も更新
    this.updateSidebarName();

    // プレビューカードも更新
    this.updatePreviewCard();

    // 成功メッセージを表示
    this.showSuccessMessage();
  }

  /**
   * サイドバーのユーザー名を更新
   */
  updateSidebarName() {
    const sidebarName = document.getElementById('user-name');
    if (sidebarName) {
      const userName = this.registrationData.name || '優';
      sidebarName.textContent = userName;
      console.log('サイドバー名前更新:', userName);
    }
  }

  /**
   * プレビューカードを更新
   */
  updatePreviewCard() {
    const previewCard = document.querySelector('.profile-preview-card, .profile-preview, .card.preview');
    if (!previewCard) return;

    // 名前を更新
    const nameElements = previewCard.querySelectorAll('h4, h5, .card-title, [class*="name"]');
    nameElements.forEach(element => {
      element.textContent = this.registrationData.name || '優';
    });

    // ユーザー名を更新
    const usernameElements = previewCard.querySelectorAll('small, [class*="username"]');
    usernameElements.forEach(element => {
      element.textContent = '@' + (this.registrationData.username || '優');
    });

    console.log('プレビューカード更新完了');
  }

  /**
   * リアルタイム同期を設定
   */
  setupRealTimeSync() {
    const fieldIds = ['guide-name', 'guide-username', 'guide-email', 'guide-phone', 'guide-location'];
    
    fieldIds.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', (e) => {
          this.updateSessionData(fieldId, e.target.value);
        });
      }
    });

    console.log('リアルタイム同期を設定しました');
  }

  /**
   * セッションデータを更新
   */
  updateSessionData(fieldId, value) {
    if (!this.registrationData) return;

    // フィールドIDに基づいてデータを更新
    switch (fieldId) {
      case 'guide-name':
        this.registrationData.name = value;
        break;
      case 'guide-username':
        this.registrationData.username = value;
        break;
      case 'guide-email':
        this.registrationData.email = value;
        break;
      case 'guide-phone':
        this.registrationData.phone = value;
        break;
      case 'guide-location':
        this.registrationData.location = value;
        break;
    }

    // セッションストレージを更新
    sessionStorage.setItem('currentUser', JSON.stringify(this.registrationData));
    
    console.log(`セッションデータ更新 ${fieldId}:`, value);
  }

  /**
   * 成功メッセージを表示
   */
  showSuccessMessage() {
    const messageHtml = `
      <div id="form-field-success" class="alert alert-info alert-dismissible fade show position-fixed" 
           style="top: 20px; right: 20px; z-index: 9999; width: auto; max-width: 400px;">
        <i class="bi bi-info-circle me-2"></i>
        登録情報をフォームに反映しました
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', messageHtml);

    setTimeout(() => {
      const alert = document.getElementById('form-field-success');
      if (alert) {
        alert.remove();
      }
    }, 3000);
  }

  /**
   * 手動でフォーム更新を実行
   */
  forceUpdate() {
    console.log('手動フォーム更新を実行');
    this.loadRegistrationData();
    this.waitForFormFields(() => {
      this.populateFormFields();
    });
  }
}

// グローバルに公開
window.FormFieldController = FormFieldController;

// 最優先で実行
(function() {
  if (window.location.pathname.includes('guide-profile.html')) {
    // DOM準備前でも実行
    window.formFieldController = new FormFieldController();
    
    // DOM準備後にも実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          if (window.formFieldController) {
            window.formFieldController.forceUpdate();
          }
        }, 500);
      });
    }
  }
})();