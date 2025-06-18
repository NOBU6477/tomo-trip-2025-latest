/**
 * プレビューシステム修正
 * 自動入力データをプレビューに正確に反映
 */
(function() {
  'use strict';

  const PreviewSystemFix = {
    /**
     * プレビューシステムを初期化
     */
    initialize() {
      this.setupRealTimePreview();
      this.forcePreviewUpdate();
      
      // 自動入力との連携
      this.integrateWithAutoFiller();
      
      console.log('プレビューシステム修正完了');
    },

    /**
     * リアルタイムプレビューを設定
     */
    setupRealTimePreview() {
      // 名前フィールドの監視
      const nameField = document.getElementById('guide-name');
      if (nameField) {
        nameField.addEventListener('input', () => this.updatePreviewName());
        nameField.addEventListener('change', () => this.updatePreviewName());
      }

      // 活動エリアの監視
      const locationField = document.getElementById('guide-location');
      if (locationField) {
        locationField.addEventListener('change', () => this.updatePreviewLocation());
      }

      // 自己紹介の監視
      const descField = document.getElementById('guide-description');
      if (descField) {
        descField.addEventListener('input', () => this.updatePreviewDescription());
        descField.addEventListener('change', () => this.updatePreviewDescription());
      }

      // セッション料金の監視
      const feeField = document.getElementById('guide-session-fee');
      if (feeField) {
        feeField.addEventListener('input', () => this.updatePreviewFee());
        feeField.addEventListener('change', () => this.updatePreviewFee());
      }

      // 言語選択の監視
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
      const previewName = this.findPreviewElement('.card-title, [data-preview="name"]');
      
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
      const previewLocation = this.findPreviewElement('[data-preview="location"]');
      
      if (locationField && previewLocation) {
        const location = locationField.value || '活動エリアを選択してください';
        previewLocation.textContent = location;
        console.log('プレビュー活動エリア更新:', location);
      } else {
        // 代替手段でlocation要素を探す
        const locationElements = document.querySelectorAll('.text-muted');
        locationElements.forEach(elem => {
          if (elem.innerHTML.includes('bi-geo-alt-fill') || elem.textContent.includes('活動エリア')) {
            const location = locationField?.value || '活動エリアを選択してください';
            elem.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${location}`;
          }
        });
      }
    },

    /**
     * プレビューの自己紹介を更新
     */
    updatePreviewDescription() {
      const descField = document.getElementById('guide-description');
      const previewDesc = this.findPreviewElement('.card-text, [data-preview="description"]');
      
      if (descField && previewDesc) {
        const desc = descField.value.trim() || '自己紹介を入力してください';
        const shortDesc = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
        previewDesc.textContent = shortDesc;
        console.log('プレビュー自己紹介更新:', shortDesc);
      }
    },

    /**
     * プレビューの料金を更新
     */
    updatePreviewFee() {
      const feeField = document.getElementById('guide-session-fee');
      const previewFee = this.findPreviewElement('.price strong, [data-preview="fee"]');
      
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
      const previewLang = this.findPreviewElement('[data-preview="languages"]');
      
      if (previewLang) {
        const selected = Array.from(document.querySelectorAll('.language-checkbox:checked'))
          .map(cb => cb.nextElementSibling?.textContent?.trim().replace(/^[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]*/, ''))
          .filter(lang => lang);
        
        const languages = selected.length > 0 ? selected.join(', ') : '日本語';
        previewLang.innerHTML = `<i class="bi bi-translate"></i> ${languages}`;
        console.log('プレビュー言語更新:', languages);
      }
    },

    /**
     * プレビューの写真を更新
     */
    updatePreviewPhoto() {
      const photoPreview = document.getElementById('guide-profile-preview');
      const previewImg = this.findPreviewElement('.card-img-top, [data-preview="photo"]');
      
      if (photoPreview && previewImg && photoPreview.src && !photoPreview.src.includes('placeholder')) {
        previewImg.src = photoPreview.src;
        console.log('プレビュー写真更新:', photoPreview.src);
      }
    },

    /**
     * プレビュー要素を検索
     */
    findPreviewElement(selector) {
      // プレビューカード内で要素を検索
      const previewCard = document.querySelector('.guide-card, [class*="preview"]');
      if (previewCard) {
        return previewCard.querySelector(selector);
      }
      
      // 全体から検索
      return document.querySelector(selector);
    },

    /**
     * プレビューを強制更新
     */
    forcePreviewUpdate() {
      setTimeout(() => {
        this.updatePreviewName();
        this.updatePreviewLocation();
        this.updatePreviewDescription();
        this.updatePreviewFee();
        this.updatePreviewLanguages();
        this.updatePreviewPhoto();
        console.log('プレビュー強制更新完了');
      }, 500);
    },

    /**
     * 自動入力システムとの連携
     */
    integrateWithAutoFiller() {
      // 自動入力後にプレビューを更新
      if (window.AutoProfileFiller) {
        const originalAutoFill = window.AutoProfileFiller.autoFillProfile;
        
        window.AutoProfileFiller.autoFillProfile = () => {
          originalAutoFill.call(window.AutoProfileFiller);
          
          // 自動入力後にプレビューを更新
          setTimeout(() => {
            this.forcePreviewUpdate();
          }, 300);
        };
      }

      // 定期的なプレビュー同期
      setInterval(() => {
        this.syncPreviewWithForm();
      }, 2000);
    },

    /**
     * フォームとプレビューの同期
     */
    syncPreviewWithForm() {
      const nameField = document.getElementById('guide-name');
      const descField = document.getElementById('guide-description');
      const previewCard = document.querySelector('.guide-card');
      
      if (nameField && descField && previewCard) {
        // 名前が自動入力されているのにプレビューが空の場合
        if (nameField.value.trim() && previewCard.textContent.includes('お名前を入力')) {
          this.forcePreviewUpdate();
        }
        
        // 説明が自動入力されているのにプレビューが空の場合
        if (descField.value.trim() && previewCard.textContent.includes('自己紹介を入力')) {
          this.forcePreviewUpdate();
        }
      }
    },

    /**
     * プレビューカードが存在しない場合は作成
     */
    ensurePreviewCardExists() {
      const previewContainer = document.querySelector('[class*="preview"]');
      if (!previewContainer || !previewContainer.querySelector('.guide-card')) {
        this.createPreviewCard();
      }
    },

    /**
     * プレビューカードを作成
     */
    createPreviewCard() {
      const container = document.querySelector('.container, .form-container') || document.body;
      
      const previewDiv = document.createElement('div');
      previewDiv.className = 'mt-4 p-3 border rounded bg-light preview-container';
      previewDiv.innerHTML = `
        <h6 class="mb-3">ガイドカードプレビュー</h6>
        <div class="col-md-6">
          <div class="card guide-card h-100 shadow-sm">
            <div class="position-relative">
              <img class="card-img-top" src="https://via.placeholder.com/300x200/007bff/ffffff?text=プロフィール写真" style="height: 200px; object-fit: cover;">
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-success">新規</span>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">お名前を入力してください</h5>
              <p class="text-muted mb-2" data-preview="location">
                <i class="bi bi-geo-alt-fill"></i> 活動エリアを選択してください
              </p>
              <p class="text-muted mb-2" data-preview="languages">
                <i class="bi bi-translate"></i> 日本語
              </p>
              <p class="card-text small" data-preview="description">自己紹介を入力してください</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="rating">
                  <span class="text-warning">★★★★★</span>
                  <small class="text-muted">(新規)</small>
                </div>
                <div class="price">
                  <strong data-preview="fee">¥6,000/回</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(previewDiv);
      console.log('プレビューカードを作成しました');
    }
  };

  /**
   * 初期化
   */
  function initialize() {
    // グローバルオブジェクトとして公開
    window.PreviewSystemFix = PreviewSystemFix;
    
    // プレビューシステムを初期化
    PreviewSystemFix.initialize();
    
    // プレビューカードの存在を確認
    setTimeout(() => {
      PreviewSystemFix.ensurePreviewCardExists();
      PreviewSystemFix.forcePreviewUpdate();
    }, 1000);
    
    console.log('プレビューシステム修正開始');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();