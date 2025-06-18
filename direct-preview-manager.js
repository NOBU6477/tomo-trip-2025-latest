/**
 * 直接プレビュー管理システム
 * プレビューカードの表示を確実に制御
 */
(function() {
  'use strict';

  const DirectPreviewManager = {
    /**
     * システムを初期化
     */
    initialize() {
      this.ensurePreviewCardExists();
      this.setupDirectPreviewUpdates();
      this.startMonitoring();
      
      console.log('直接プレビュー管理システム初期化完了');
    },

    /**
     * プレビューカードの存在を確保
     */
    ensurePreviewCardExists() {
      let previewCard = this.findPreviewCard();
      
      if (!previewCard) {
        previewCard = this.createPreviewCard();
      }
      
      // 初期データで更新
      setTimeout(() => {
        this.updatePreviewFromForm();
      }, 100);
      
      return previewCard;
    },

    /**
     * 既存のプレビューカードを検索
     */
    findPreviewCard() {
      return document.querySelector('.guide-card, [class*="preview"] .card, .card.h-100');
    },

    /**
     * プレビューカードを作成
     */
    createPreviewCard() {
      // 既存のプレビューエリアを探す
      let container = document.querySelector('.preview-container, [class*="preview"]');
      
      if (!container) {
        // プレビューエリアを作成
        container = document.createElement('div');
        container.className = 'preview-container mt-4 p-3 border rounded bg-light';
        container.innerHTML = '<h6 class="mb-3">ガイドカードプレビュー</h6>';
        
        // フォームの後に挿入
        const form = document.getElementById('profile-basic-form') || document.querySelector('form');
        if (form) {
          form.parentNode.insertBefore(container, form.nextSibling);
        } else {
          document.body.appendChild(container);
        }
      }

      // カードを作成
      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'col-md-6';
      cardWrapper.innerHTML = `
        <div class="card guide-card h-100 shadow-sm">
          <div class="position-relative">
            <img id="preview-card-photo" class="card-img-top" 
                 src="https://via.placeholder.com/300x200/007bff/ffffff?text=プロフィール写真" 
                 alt="プロフィール写真" style="height: 200px; object-fit: cover;">
            <div class="position-absolute top-0 end-0 m-2">
              <span class="badge bg-success">新規</span>
            </div>
          </div>
          <div class="card-body">
            <h5 id="preview-card-name" class="card-title">お名前を入力してください</h5>
            <p class="text-muted mb-2">
              <i class="bi bi-geo-alt-fill"></i> <span id="preview-card-location">活動エリアを選択してください</span>
            </p>
            <p class="text-muted mb-2">
              <i class="bi bi-translate"></i> <span id="preview-card-languages">日本語</span>
            </p>
            <p id="preview-card-description" class="card-text small">自己紹介を入力してください</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="rating">
                <span class="text-warning">★★★★★</span>
                <small class="text-muted">(新規)</small>
              </div>
              <div class="price">
                <strong id="preview-card-fee">¥6,000/回</strong>
              </div>
            </div>
          </div>
        </div>
      `;

      container.appendChild(cardWrapper);
      console.log('プレビューカードを作成しました');
      
      return cardWrapper.querySelector('.guide-card');
    },

    /**
     * 直接プレビュー更新を設定
     */
    setupDirectPreviewUpdates() {
      // フォームフィールドの監視
      const fields = [
        { id: 'guide-name', handler: () => this.updatePreviewName() },
        { id: 'guide-location', handler: () => this.updatePreviewLocation() },
        { id: 'guide-description', handler: () => this.updatePreviewDescription() },
        { id: 'guide-session-fee', handler: () => this.updatePreviewFee() }
      ];

      fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
          element.addEventListener('input', field.handler);
          element.addEventListener('change', field.handler);
        }
      });

      // 言語チェックボックスの監視
      const languageCheckboxes = document.querySelectorAll('.language-checkbox');
      languageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => this.updatePreviewLanguages());
      });

      // プロフィール写真の監視
      const photoPreview = document.getElementById('guide-profile-preview');
      if (photoPreview) {
        const observer = new MutationObserver(() => this.updatePreviewPhoto());
        observer.observe(photoPreview, { attributes: true, attributeFilter: ['src'] });
      }
    },

    /**
     * プレビューの名前を更新
     */
    updatePreviewName() {
      const nameField = document.getElementById('guide-name');
      const previewName = document.getElementById('preview-card-name');
      
      if (nameField && previewName) {
        const name = nameField.value.trim() || 'お名前を入力してください';
        previewName.textContent = name;
        console.log('プレビュー名前更新:', name);
      }
    },

    /**
     * プレビューの活動エリアを更新
     */
    updatePreviewLocation() {
      const locationField = document.getElementById('guide-location');
      const previewLocation = document.getElementById('preview-card-location');
      
      if (locationField && previewLocation) {
        const location = locationField.value || '活動エリアを選択してください';
        previewLocation.textContent = location;
        console.log('プレビュー活動エリア更新:', location);
      }
    },

    /**
     * プレビューの自己紹介を更新
     */
    updatePreviewDescription() {
      const descField = document.getElementById('guide-description');
      const previewDesc = document.getElementById('preview-card-description');
      
      if (descField && previewDesc) {
        const desc = descField.value.trim() || '自己紹介を入力してください';
        const shortDesc = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
        previewDesc.textContent = shortDesc;
        console.log('プレビュー自己紹介更新');
      }
    },

    /**
     * プレビューの料金を更新
     */
    updatePreviewFee() {
      const feeField = document.getElementById('guide-session-fee');
      const previewFee = document.getElementById('preview-card-fee');
      
      if (feeField && previewFee) {
        const fee = parseInt(feeField.value) || 6000;
        previewFee.textContent = `¥${fee.toLocaleString()}/回`;
        console.log('プレビュー料金更新:', fee);
      }
    },

    /**
     * プレビューの言語を更新
     */
    updatePreviewLanguages() {
      const previewLang = document.getElementById('preview-card-languages');
      
      if (previewLang) {
        const selected = Array.from(document.querySelectorAll('.language-checkbox:checked'))
          .map(cb => cb.nextElementSibling?.textContent?.trim().replace(/^[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]*/, ''))
          .filter(lang => lang);
        
        const languages = selected.length > 0 ? selected.join(', ') : '日本語';
        previewLang.textContent = languages;
        console.log('プレビュー言語更新:', languages);
      }
    },

    /**
     * プレビューの写真を更新
     */
    updatePreviewPhoto() {
      const photoPreview = document.getElementById('guide-profile-preview');
      const previewImg = document.getElementById('preview-card-photo');
      
      if (photoPreview && previewImg && photoPreview.src && !photoPreview.src.includes('placeholder')) {
        previewImg.src = photoPreview.src;
        console.log('プレビュー写真更新');
      }
    },

    /**
     * フォームからプレビューを更新
     */
    updatePreviewFromForm() {
      this.updatePreviewName();
      this.updatePreviewLocation();
      this.updatePreviewDescription();
      this.updatePreviewFee();
      this.updatePreviewLanguages();
      this.updatePreviewPhoto();
    },

    /**
     * 自動入力システムとの連携
     */
    integrateWithAutoFiller() {
      // 自動入力完了後にプレビューを更新
      if (window.AutoProfileFiller) {
        const originalAutoFill = window.AutoProfileFiller.autoFillProfile;
        
        window.AutoProfileFiller.autoFillProfile = () => {
          originalAutoFill.call(window.AutoProfileFiller);
          
          setTimeout(() => {
            this.updatePreviewFromForm();
          }, 600);
        };
      }
    },

    /**
     * 監視を開始
     */
    startMonitoring() {
      // 定期的にプレビューを同期
      setInterval(() => {
        this.syncPreviewWithForm();
      }, 2000);

      // 自動入力システムとの連携
      setTimeout(() => {
        this.integrateWithAutoFiller();
      }, 1000);

      // MutationObserverでDOMの変更を監視
      const observer = new MutationObserver(() => {
        if (!this.findPreviewCard()) {
          this.ensurePreviewCardExists();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    },

    /**
     * フォームとプレビューの同期
     */
    syncPreviewWithForm() {
      const nameField = document.getElementById('guide-name');
      const previewName = document.getElementById('preview-card-name');
      
      if (nameField && previewName) {
        // フォームに値があるのにプレビューが初期状態の場合
        if (nameField.value.trim() && previewName.textContent.includes('お名前を入力')) {
          this.updatePreviewFromForm();
          console.log('プレビュー同期実行');
        }
      }
    },

    /**
     * プレビューを強制更新
     */
    forceUpdate() {
      this.ensurePreviewCardExists();
      this.updatePreviewFromForm();
      console.log('プレビュー強制更新完了');
    }
  };

  /**
   * 初期化
   */
  function initialize() {
    // グローバルオブジェクトとして公開
    window.DirectPreviewManager = DirectPreviewManager;
    
    // システムを初期化
    DirectPreviewManager.initialize();
    
    // ページロード後に追加で実行
    setTimeout(() => {
      DirectPreviewManager.forceUpdate();
    }, 1500);
    
    console.log('直接プレビュー管理システム開始');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();