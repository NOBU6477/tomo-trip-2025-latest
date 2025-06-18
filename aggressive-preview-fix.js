/**
 * 強制プレビュー修正システム
 * プレビューカードの表示を確実に制御
 */
(function() {
  'use strict';

  const AggressivePreviewFix = {
    /**
     * システムを初期化
     */
    initialize() {
      this.forceCreatePreviewCard();
      this.setupAggressiveUpdates();
      this.startForceMonitoring();
      
      console.log('強制プレビュー修正システム初期化完了');
    },

    /**
     * プレビューカードを強制作成
     */
    forceCreatePreviewCard() {
      // 既存のプレビューカードを削除
      const existingPreviews = document.querySelectorAll('.preview-container, [class*="preview"]');
      existingPreviews.forEach(elem => elem.remove());

      // 新しいプレビューカードを作成
      const container = this.createNewPreviewContainer();
      
      // フォームの後に挿入
      const form = document.getElementById('profile-basic-form') || document.querySelector('form');
      if (form) {
        form.parentNode.insertBefore(container, form.nextSibling);
      } else {
        document.body.appendChild(container);
      }

      console.log('プレビューカードを強制作成しました');
      
      // 初期データで更新
      setTimeout(() => {
        this.forceUpdateAllData();
      }, 200);
    },

    /**
     * 新しいプレビューコンテナを作成
     */
    createNewPreviewContainer() {
      const container = document.createElement('div');
      container.className = 'preview-container mt-4 p-3 border rounded bg-light';
      container.id = 'forced-preview-container';
      
      container.innerHTML = `
        <h6 class="mb-3">ガイドカードプレビュー</h6>
        <div class="col-md-6">
          <div class="card guide-card h-100 shadow-sm" id="forced-preview-card">
            <div class="position-relative">
              <img id="forced-preview-photo" class="card-img-top" 
                   src="https://via.placeholder.com/300x200/007bff/ffffff?text=プロフィール写真" 
                   alt="プロフィール写真" style="height: 200px; object-fit: cover;">
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-success">新規</span>
              </div>
            </div>
            <div class="card-body">
              <h5 id="forced-preview-name" class="card-title">お名前を入力してください</h5>
              <p class="text-muted mb-2">
                <i class="bi bi-geo-alt-fill"></i> <span id="forced-preview-location">活動エリアを選択してください</span>
              </p>
              <p class="text-muted mb-2">
                <i class="bi bi-translate"></i> <span id="forced-preview-languages">日本語</span>
              </p>
              <p id="forced-preview-description" class="card-text small">自己紹介を入力してください</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="rating">
                  <span class="text-warning">★★★★★</span>
                  <small class="text-muted">(新規)</small>
                </div>
                <div class="price">
                  <strong id="forced-preview-fee">¥6,000/回</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      return container;
    },

    /**
     * 強制的な更新システムを設定
     */
    setupAggressiveUpdates() {
      // フォームフィールドの監視
      const fields = [
        'guide-name',
        'guide-location', 
        'guide-description',
        'guide-session-fee'
      ];

      fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.addEventListener('input', () => this.forceUpdateAllData());
          field.addEventListener('change', () => this.forceUpdateAllData());
          field.addEventListener('keyup', () => this.forceUpdateAllData());
        }
      });

      // 写真プレビューの監視
      const photoPreview = document.getElementById('guide-profile-preview');
      if (photoPreview) {
        const observer = new MutationObserver(() => this.forceUpdatePhoto());
        observer.observe(photoPreview, { 
          attributes: true, 
          attributeFilter: ['src'],
          subtree: true,
          childList: true
        });
      }

      // 言語チェックボックスの監視
      document.addEventListener('change', (e) => {
        if (e.target.classList.contains('language-checkbox')) {
          this.forceUpdateLanguages();
        }
      });
    },

    /**
     * 全データを強制更新
     */
    forceUpdateAllData() {
      this.forceUpdateName();
      this.forceUpdateLocation();
      this.forceUpdateDescription();
      this.forceUpdateFee();
      this.forceUpdateLanguages();
      this.forceUpdatePhoto();
    },

    /**
     * 名前を強制更新
     */
    forceUpdateName() {
      const nameField = document.getElementById('guide-name');
      const previewName = document.getElementById('forced-preview-name');
      
      if (nameField && previewName) {
        const name = nameField.value.trim();
        if (name) {
          previewName.textContent = name;
          console.log('強制名前更新:', name);
        }
      }
    },

    /**
     * 活動エリアを強制更新
     */
    forceUpdateLocation() {
      const locationField = document.getElementById('guide-location');
      const previewLocation = document.getElementById('forced-preview-location');
      
      if (locationField && previewLocation) {
        const location = locationField.value;
        if (location) {
          previewLocation.textContent = location;
          console.log('強制活動エリア更新:', location);
        }
      }
    },

    /**
     * 説明を強制更新
     */
    forceUpdateDescription() {
      const descField = document.getElementById('guide-description');
      const previewDesc = document.getElementById('forced-preview-description');
      
      if (descField && previewDesc) {
        const desc = descField.value.trim();
        if (desc) {
          const shortDesc = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
          previewDesc.textContent = shortDesc;
          console.log('強制説明更新');
        }
      }
    },

    /**
     * 料金を強制更新
     */
    forceUpdateFee() {
      const feeField = document.getElementById('guide-session-fee');
      const previewFee = document.getElementById('forced-preview-fee');
      
      if (feeField && previewFee) {
        const fee = parseInt(feeField.value) || 6000;
        previewFee.textContent = `¥${fee.toLocaleString()}/回`;
        console.log('強制料金更新:', fee);
      }
    },

    /**
     * 言語を強制更新
     */
    forceUpdateLanguages() {
      const previewLang = document.getElementById('forced-preview-languages');
      
      if (previewLang) {
        const selected = Array.from(document.querySelectorAll('.language-checkbox:checked'))
          .map(cb => {
            const label = cb.nextElementSibling?.textContent?.trim();
            return label ? label.replace(/^[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]*/, '') : '';
          })
          .filter(lang => lang);
        
        const languages = selected.length > 0 ? selected.join(', ') : '日本語';
        previewLang.textContent = languages;
        console.log('強制言語更新:', languages);
      }
    },

    /**
     * 写真を強制更新
     */
    forceUpdatePhoto() {
      const photoPreview = document.getElementById('guide-profile-preview');
      const previewImg = document.getElementById('forced-preview-photo');
      
      if (photoPreview && previewImg) {
        if (photoPreview.src && !photoPreview.src.includes('placeholder')) {
          previewImg.src = photoPreview.src;
          previewImg.style.display = 'block';
          console.log('強制写真更新:', photoPreview.src);
        }
      }
    },

    /**
     * 自動入力システムとの統合
     */
    integrateWithAutoFiller() {
      // 自動入力完了後に強制更新
      if (window.AutoProfileFiller) {
        const originalAutoFill = window.AutoProfileFiller.autoFillProfile;
        
        window.AutoProfileFiller.autoFillProfile = () => {
          originalAutoFill.call(window.AutoProfileFiller);
          
          // 複数回実行して確実に反映
          setTimeout(() => this.forceUpdateAllData(), 300);
          setTimeout(() => this.forceUpdateAllData(), 800);
          setTimeout(() => this.forceUpdateAllData(), 1500);
        };

        // 個別の自動入力メソッドも監視
        const originalFillName = window.AutoProfileFiller.autoFillName;
        window.AutoProfileFiller.autoFillName = () => {
          originalFillName.call(window.AutoProfileFiller);
          setTimeout(() => this.forceUpdateName(), 100);
        };

        const originalFillPhoto = window.AutoProfileFiller.autoFillPhoto;
        window.AutoProfileFiller.autoFillPhoto = () => {
          originalFillPhoto.call(window.AutoProfileFiller);
          setTimeout(() => this.forceUpdatePhoto(), 100);
        };
      }
    },

    /**
     * 強制監視を開始
     */
    startForceMonitoring() {
      // 定期的な強制更新
      setInterval(() => {
        if (document.getElementById('forced-preview-card')) {
          this.forceUpdateAllData();
        } else {
          // プレビューカードが消えた場合は再作成
          this.forceCreatePreviewCard();
        }
      }, 2000);

      // 自動入力システムとの統合
      setTimeout(() => {
        this.integrateWithAutoFiller();
      }, 500);

      // ページロード後の強制更新
      setTimeout(() => {
        this.forceUpdateAllData();
      }, 1000);

      setTimeout(() => {
        this.forceUpdateAllData();
      }, 3000);
    },

    /**
     * デバッグ情報を出力
     */
    debugStatus() {
      const nameField = document.getElementById('guide-name');
      const photoPreview = document.getElementById('guide-profile-preview');
      const previewCard = document.getElementById('forced-preview-card');
      
      console.log('=== プレビュー状況デバッグ ===');
      console.log('名前フィールド値:', nameField?.value);
      console.log('写真プレビューsrc:', photoPreview?.src);
      console.log('プレビューカード存在:', !!previewCard);
      console.log('========================');
    }
  };

  /**
   * 初期化
   */
  function initialize() {
    // グローバルオブジェクトとして公開
    window.AggressivePreviewFix = AggressivePreviewFix;
    
    // システムを初期化
    AggressivePreviewFix.initialize();
    
    // デバッグ関数をグローバルに公開
    window.debugPreview = () => AggressivePreviewFix.debugStatus();
    
    console.log('強制プレビュー修正システム開始');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();