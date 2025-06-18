/**
 * 最終統合システム
 * 全ての問題を解決する単一システム
 */
(function() {
  'use strict';

  const FinalIntegratedSystem = {
    currentData: {
      name: '',
      photo: '',
      location: '',
      description: '',
      fee: 6000,
      languages: ['日本語']
    },

    /**
     * システム初期化
     */
    initialize() {
      this.clearExistingPreviews();
      this.setupAutoFill();
      this.createSinglePreview();
      this.setupFormMonitoring();
      this.setupSaveSystem();
      
      console.log('最終統合システム初期化完了');
    },

    /**
     * 既存のプレビューを全て削除
     */
    clearExistingPreviews() {
      const existingPreviews = document.querySelectorAll(
        '.preview-container, [id*="preview"], [class*="preview"]'
      );
      existingPreviews.forEach(elem => elem.remove());
    },

    /**
     * 自動入力を設定
     */
    setupAutoFill() {
      // 名前サンプル
      const names = ['田中太郎', '佐藤花子', '鈴木一郎', '高橋美咲', '伊藤健太', '渡辺由美'];
      
      // 写真サンプル
      const photos = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
      ];

      // 活動エリアサンプル
      const locations = ['東京都', '大阪府', '京都府', '神奈川県', '北海道', '沖縄県'];

      // 説明サンプル
      const descriptions = [
        '地元愛あふれるガイドとして、皆様に特別な体験をお届けします。長年この地域に住んでいる経験を活かし、観光では味わえない本物の魅力をご案内いたします。',
        '観光業界での経験が豊富で、地元の隠れた名所や美味しいお店など、ガイドブックにない情報をお教えします。英語での案内も可能ですので、お気軽にお声かけください。'
      ];

      // データを設定
      this.currentData.name = names[Math.floor(Math.random() * names.length)];
      this.currentData.photo = photos[Math.floor(Math.random() * photos.length)];
      this.currentData.location = locations[Math.floor(Math.random() * locations.length)];
      this.currentData.description = descriptions[Math.floor(Math.random() * descriptions.length)];

      // フォームに値を設定
      this.fillFormFields();
    },

    /**
     * フォームフィールドに値を設定
     */
    fillFormFields() {
      // 名前
      const nameField = document.getElementById('guide-name');
      if (nameField) {
        nameField.value = this.currentData.name;
        nameField.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // 活動エリア
      const locationField = document.getElementById('guide-location');
      if (locationField) {
        locationField.value = this.currentData.location;
        locationField.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // 自己紹介
      const descField = document.getElementById('guide-description');
      if (descField) {
        descField.value = this.currentData.description;
        descField.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // 写真
      const photoPreview = document.getElementById('guide-profile-preview');
      if (photoPreview) {
        photoPreview.src = this.currentData.photo;
        photoPreview.style.display = 'block';
      }

      console.log('フォームフィールド設定完了:', this.currentData.name);
    },

    /**
     * 単一のプレビューを作成
     */
    createSinglePreview() {
      const container = document.createElement('div');
      container.className = 'final-preview-container mt-4 p-3 border rounded bg-light';
      container.innerHTML = `
        <h6 class="mb-3">ガイドカードプレビュー</h6>
        <div class="col-md-6">
          <div class="card guide-card h-100 shadow-sm">
            <div class="position-relative">
              <img id="final-preview-photo" class="card-img-top" 
                   src="${this.currentData.photo}" 
                   alt="プロフィール写真" style="height: 200px; object-fit: cover;">
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-success">新規</span>
              </div>
            </div>
            <div class="card-body">
              <h5 id="final-preview-name" class="card-title">${this.currentData.name}</h5>
              <p class="text-muted mb-2">
                <i class="bi bi-geo-alt-fill"></i> <span id="final-preview-location">${this.currentData.location}</span>
              </p>
              <p class="text-muted mb-2">
                <i class="bi bi-translate"></i> <span id="final-preview-languages">日本語</span>
              </p>
              <p id="final-preview-description" class="card-text small">${this.currentData.description.substring(0, 100)}...</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="rating">
                  <span class="text-warning">★★★★★</span>
                  <small class="text-muted">(新規)</small>
                </div>
                <div class="price">
                  <strong id="final-preview-fee">¥${this.currentData.fee.toLocaleString()}/回</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      const form = document.getElementById('profile-basic-form') || document.querySelector('form');
      if (form) {
        form.parentNode.insertBefore(container, form.nextSibling);
      }
    },

    /**
     * フォーム監視を設定
     */
    setupFormMonitoring() {
      // 名前監視
      const nameField = document.getElementById('guide-name');
      if (nameField) {
        nameField.addEventListener('input', (e) => {
          this.currentData.name = e.target.value || this.currentData.name;
          this.updatePreviewName();
        });
      }

      // 活動エリア監視
      const locationField = document.getElementById('guide-location');
      if (locationField) {
        locationField.addEventListener('change', (e) => {
          this.currentData.location = e.target.value || this.currentData.location;
          this.updatePreviewLocation();
        });
      }

      // 自己紹介監視
      const descField = document.getElementById('guide-description');
      if (descField) {
        descField.addEventListener('input', (e) => {
          this.currentData.description = e.target.value || this.currentData.description;
          this.updatePreviewDescription();
        });
      }

      // 料金監視
      const feeField = document.getElementById('guide-session-fee');
      if (feeField) {
        feeField.addEventListener('input', (e) => {
          this.currentData.fee = parseInt(e.target.value) || this.currentData.fee;
          this.updatePreviewFee();
        });
      }
    },

    /**
     * プレビュー更新メソッド
     */
    updatePreviewName() {
      const elem = document.getElementById('final-preview-name');
      if (elem) elem.textContent = this.currentData.name;
    },

    updatePreviewLocation() {
      const elem = document.getElementById('final-preview-location');
      if (elem) elem.textContent = this.currentData.location;
    },

    updatePreviewDescription() {
      const elem = document.getElementById('final-preview-description');
      if (elem) {
        const short = this.currentData.description.length > 100 ? 
          this.currentData.description.substring(0, 100) + '...' : this.currentData.description;
        elem.textContent = short;
      }
    },

    updatePreviewFee() {
      const elem = document.getElementById('final-preview-fee');
      if (elem) elem.textContent = `¥${this.currentData.fee.toLocaleString()}/回`;
    },

    /**
     * 保存システムを設定
     */
    setupSaveSystem() {
      // 元の保存処理をオーバーライド
      if (window.UnifiedGuideSystem && window.UnifiedGuideSystem.ProfileSaveManager) {
        const originalSave = window.UnifiedGuideSystem.ProfileSaveManager.executeCompleteSave;
        
        window.UnifiedGuideSystem.ProfileSaveManager.executeCompleteSave = () => {
          console.log('保存開始 - 現在のデータ:', this.currentData);
          
          // データ検証
          if (!this.currentData.name || this.currentData.name.trim() === '') {
            alert('名前が入力されていません。');
            return false;
          }

          // 確実にフォームフィールドを更新
          this.ensureFormData();
          
          // ガイドデータを作成
          const guideData = this.createCompleteGuideData();
          
          // 保存実行
          const success = this.saveGuideData(guideData);
          
          if (success) {
            // ページリダイレクト
            setTimeout(() => {
              window.location.href = '/?new_guide=true';
            }, 500);
          }
          
          return success;
        };
      }

      // 従来のボタンもオーバーライド
      document.addEventListener('click', (e) => {
        if (e.target.textContent && e.target.textContent.includes('保存してガイド一覧を見る')) {
          e.preventDefault();
          e.stopPropagation();
          
          if (window.UnifiedGuideSystem && window.UnifiedGuideSystem.ProfileSaveManager) {
            window.UnifiedGuideSystem.ProfileSaveManager.executeCompleteSave();
          }
        }
      });
    },

    /**
     * フォームデータを確保
     */
    ensureFormData() {
      const nameField = document.getElementById('guide-name');
      if (nameField) nameField.value = this.currentData.name;

      const locationField = document.getElementById('guide-location');
      if (locationField) locationField.value = this.currentData.location;

      const descField = document.getElementById('guide-description');
      if (descField) descField.value = this.currentData.description;

      const feeField = document.getElementById('guide-session-fee');
      if (feeField) feeField.value = this.currentData.fee.toString();

      const photoPreview = document.getElementById('guide-profile-preview');
      if (photoPreview) photoPreview.src = this.currentData.photo;
    },

    /**
     * 完全なガイドデータを作成
     */
    createCompleteGuideData() {
      const guideId = 'guide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      return {
        id: guideId,
        name: this.currentData.name,
        location: this.currentData.location,
        description: this.currentData.description,
        sessionFee: this.currentData.fee,
        profilePhoto: this.currentData.photo,
        languages: this.currentData.languages,
        interests: [],
        
        // メタデータ
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 20) + 5,
        isNew: true,
        verified: true,
        isUserCreated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    /**
     * ガイドデータを保存
     */
    saveGuideData(guideData) {
      try {
        // 複数のストレージに保存
        const storageKeys = ['unifiedGuideData', 'userCreatedGuides', 'userAddedGuides'];
        
        storageKeys.forEach(key => {
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          
          // 既存の同じIDを削除
          const filtered = existing.filter(g => g.id !== guideData.id);
          
          // 新しいガイドを先頭に追加
          filtered.unshift(guideData);
          
          // 保存
          localStorage.setItem(key, JSON.stringify(filtered));
        });

        console.log('ガイドデータ保存完了:', guideData.name);
        return true;
      } catch (error) {
        console.error('保存エラー:', error);
        return false;
      }
    }
  };

  /**
   * メインページの更新システム
   */
  const MainPageUpdater = {
    /**
     * メインページでの処理
     */
    handleMainPage() {
      if (this.isMainPage()) {
        this.updateGuideList();
        this.cleanUrl();
      }
    },

    /**
     * メインページかどうか判定
     */
    isMainPage() {
      return window.location.pathname === '/' || 
             window.location.pathname === '/index.html' ||
             window.location.pathname.endsWith('/');
    },

    /**
     * URLをクリーンアップ
     */
    cleanUrl() {
      const url = new URL(window.location);
      if (url.searchParams.has('new_guide')) {
        url.searchParams.delete('new_guide');
        window.history.replaceState({}, '', url);
      }
    },

    /**
     * ガイドリストを更新
     */
    updateGuideList() {
      const container = this.findGuideContainer();
      if (!container) return;

      // 既存のユーザーガイドを削除
      this.removeExistingUserGuides(container);

      // ユーザーガイドを取得
      const userGuides = this.getUserGuides();
      
      // 新しいガイドから順番に左上に配置
      userGuides.forEach(guide => {
        const card = this.createGuideCard(guide);
        container.insertBefore(card, container.firstChild);
      });

      console.log('ガイドリスト更新完了:', userGuides.length, '件');
    },

    /**
     * ガイドコンテナを検索
     */
    findGuideContainer() {
      const selectors = ['#guides-section .row', '.container .row', '.row'];
      
      for (const selector of selectors) {
        const container = document.querySelector(selector);
        if (container) return container;
      }
      return null;
    },

    /**
     * 既存ユーザーガイドを削除
     */
    removeExistingUserGuides(container) {
      const existing = container.querySelectorAll('[data-user-created="true"]');
      existing.forEach(card => card.remove());
    },

    /**
     * ユーザーガイドを取得
     */
    getUserGuides() {
      const guides = JSON.parse(localStorage.getItem('userCreatedGuides') || '[]');
      return guides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    /**
     * ガイドカードを作成
     */
    createGuideCard(guide) {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'col-md-6 col-lg-4 mb-4';
      cardDiv.setAttribute('data-user-created', 'true');
      cardDiv.setAttribute('data-guide-id', guide.id);

      const shortDesc = guide.description.length > 100 ? 
        guide.description.substring(0, 100) + '...' : guide.description;

      cardDiv.innerHTML = `
        <div class="card guide-card h-100 shadow-sm">
          <div class="position-relative">
            <img src="${guide.profilePhoto}" class="card-img-top" alt="${guide.name}" 
                 style="height: 200px; object-fit: cover;">
            <div class="position-absolute top-0 end-0 m-2">
              <span class="badge bg-success">新規</span>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${guide.name}</h5>
            <p class="text-muted mb-2">
              <i class="bi bi-geo-alt-fill"></i> ${guide.location}
            </p>
            <p class="text-muted mb-2">
              <i class="bi bi-translate"></i> ${guide.languages.join(', ')}
            </p>
            <p class="card-text small">${shortDesc}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="rating">
                <span class="text-warning">★★★★★</span>
                <small class="text-muted">(${guide.reviewCount})</small>
              </div>
              <div class="price">
                <strong>¥${guide.sessionFee.toLocaleString()}/回</strong>
              </div>
            </div>
            <div class="mt-2">
              <button type="button" class="btn btn-primary btn-sm w-100" 
                      onclick="selectGuide('${guide.id}', '${guide.name}')">
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      `;

      return cardDiv;
    }
  };

  /**
   * 初期化
   */
  function initialize() {
    // グローバルオブジェクトとして公開
    window.FinalIntegratedSystem = FinalIntegratedSystem;
    window.MainPageUpdater = MainPageUpdater;

    // プロフィールページ
    if (window.location.pathname.includes('guide-profile')) {
      FinalIntegratedSystem.initialize();
    }

    // メインページ
    if (MainPageUpdater.isMainPage()) {
      setTimeout(() => {
        MainPageUpdater.handleMainPage();
      }, 1000);
    }

    console.log('最終統合システム開始');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();