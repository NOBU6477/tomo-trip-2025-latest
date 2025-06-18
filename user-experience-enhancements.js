/**
 * ユーザーエクスペリエンス向上システム
 * 統一されたUI/UXと機能追加
 */
(function() {
  'use strict';

  const UXEnhancements = {
    /**
     * プロフィール入力の支援機能
     */
    enhanceProfileForm() {
      // リアルタイムバリデーション
      this.setupRealtimeValidation();
      
      // 入力支援機能
      this.setupInputAssistance();
      
      // プレビュー機能の強化
      this.enhancePreviewFeatures();
    },

    /**
     * リアルタイムバリデーション
     */
    setupRealtimeValidation() {
      const nameField = document.getElementById('guide-name');
      if (nameField) {
        nameField.addEventListener('input', (e) => {
          const value = e.target.value.trim();
          this.validateField(e.target, value.length >= 2, '名前は2文字以上で入力してください');
        });
      }

      const locationField = document.getElementById('guide-location');
      if (locationField) {
        locationField.addEventListener('change', (e) => {
          this.validateField(e.target, e.target.value !== '', '活動エリアを選択してください');
        });
      }

      const descriptionField = document.getElementById('guide-description');
      if (descriptionField) {
        descriptionField.addEventListener('input', (e) => {
          const value = e.target.value.trim();
          this.validateField(e.target, value.length >= 20, '自己紹介は20文字以上で入力してください');
        });
      }

      const feeField = document.getElementById('guide-session-fee');
      if (feeField) {
        feeField.addEventListener('input', (e) => {
          const value = parseInt(e.target.value);
          this.validateField(e.target, value >= 6000, '料金は¥6,000以上で設定してください');
        });
      }
    },

    /**
     * フィールドバリデーション表示
     */
    validateField(field, isValid, errorMessage) {
      // 既存のフィードバックを削除
      const existingFeedback = field.parentNode.querySelector('.validation-feedback');
      if (existingFeedback) {
        existingFeedback.remove();
      }

      // 新しいフィードバックを追加
      if (!isValid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback validation-feedback';
        feedback.textContent = errorMessage;
        field.parentNode.appendChild(feedback);
      } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        const feedback = document.createElement('div');
        feedback.className = 'valid-feedback validation-feedback';
        feedback.textContent = '✓ 正しく入力されています';
        field.parentNode.appendChild(feedback);
      }
    },

    /**
     * 入力支援機能
     */
    setupInputAssistance() {
      // 自己紹介の入力支援
      const descriptionField = document.getElementById('guide-description');
      if (descriptionField) {
        this.addInputSuggestions(descriptionField, [
          '地元愛あふれるガイドとして、皆様に特別な体験をお届けします。',
          '長年この地域に住んでいる経験を活かし、観光では味わえない本物の魅力をご案内します。',
          '地元の隠れた名所や美味しいお店など、ガイドブックにない情報をお教えします。'
        ]);
      }

      // 追加情報の入力支援
      const additionalField = document.getElementById('interest-custom');
      if (additionalField) {
        this.addInputSuggestions(additionalField, [
          '英語での案内も可能です。観光業界での経験が豊富です。',
          '写真撮影のお手伝いもいたします。おすすめスポットでの記念撮影をサポートします。',
          '地元の文化や歴史について詳しく説明できます。'
        ]);
      }
    },

    /**
     * 入力候補を追加
     */
    addInputSuggestions(field, suggestions) {
      const suggestionContainer = document.createElement('div');
      suggestionContainer.className = 'input-suggestions mt-2';
      suggestionContainer.innerHTML = `
        <small class="text-muted">参考例をクリックして使用できます：</small>
        <div class="d-flex flex-wrap gap-1 mt-1">
          ${suggestions.map(suggestion => 
            `<button type="button" class="btn btn-outline-secondary btn-sm suggestion-btn" data-suggestion="${suggestion}">
              ${suggestion.substring(0, 20)}...
            </button>`
          ).join('')}
        </div>
      `;

      field.parentNode.appendChild(suggestionContainer);

      // 候補クリック時の処理
      suggestionContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-btn')) {
          const suggestion = e.target.getAttribute('data-suggestion');
          if (field.value.trim() === '') {
            field.value = suggestion;
          } else {
            field.value += '\n\n' + suggestion;
          }
          
          // 文字数カウンターを更新
          field.dispatchEvent(new Event('input'));
        }
      });
    },

    /**
     * プレビュー機能の強化
     */
    enhancePreviewFeatures() {
      // リアルタイムプレビューの更新
      const previewCard = this.createRealtimePreview();
      if (previewCard) {
        this.setupRealtimePreviewUpdates(previewCard);
      }
    },

    /**
     * リアルタイムプレビューカードを作成
     */
    createRealtimePreview() {
      const previewContainer = document.createElement('div');
      previewContainer.className = 'mt-4 p-3 border rounded bg-light';
      previewContainer.innerHTML = `
        <h6 class="mb-3">ガイドカードプレビュー</h6>
        <div class="col-md-6">
          <div class="card guide-card h-100 shadow-sm">
            <div class="position-relative">
              <img id="preview-photo" src="https://via.placeholder.com/300x200/007bff/ffffff?text=プロフィール写真" class="card-img-top" style="height: 200px; object-fit: cover;">
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge bg-success">新規</span>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title" id="preview-name">お名前を入力してください</h5>
              <p class="text-muted mb-2">
                <i class="bi bi-geo-alt-fill"></i> <span id="preview-location">活動エリアを選択してください</span>
              </p>
              <p class="text-muted mb-2">
                <i class="bi bi-translate"></i> <span id="preview-languages">日本語</span>
              </p>
              <p class="card-text small" id="preview-description">自己紹介を入力してください</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="rating">
                  <span class="text-warning">★★★★★</span>
                  <small class="text-muted">(新規)</small>
                </div>
                <div class="price">
                  <strong id="preview-fee">¥6,000/回</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // フォームの下に挿入
      const form = document.getElementById('profile-basic-form');
      if (form) {
        form.appendChild(previewContainer);
        return previewContainer;
      }
      
      return null;
    },

    /**
     * リアルタイムプレビュー更新を設定
     */
    setupRealtimePreviewUpdates(previewContainer) {
      // 名前の更新
      const nameField = document.getElementById('guide-name');
      if (nameField) {
        nameField.addEventListener('input', () => {
          const preview = previewContainer.querySelector('#preview-name');
          preview.textContent = nameField.value.trim() || 'お名前を入力してください';
        });
      }

      // 活動エリアの更新
      const locationField = document.getElementById('guide-location');
      if (locationField) {
        locationField.addEventListener('change', () => {
          const preview = previewContainer.querySelector('#preview-location');
          preview.textContent = locationField.value || '活動エリアを選択してください';
        });
      }

      // 自己紹介の更新
      const descriptionField = document.getElementById('guide-description');
      if (descriptionField) {
        descriptionField.addEventListener('input', () => {
          const preview = previewContainer.querySelector('#preview-description');
          const text = descriptionField.value.trim() || '自己紹介を入力してください';
          preview.textContent = text.length > 80 ? text.substring(0, 80) + '...' : text;
        });
      }

      // 料金の更新
      const feeField = document.getElementById('guide-session-fee');
      if (feeField) {
        feeField.addEventListener('input', () => {
          const preview = previewContainer.querySelector('#preview-fee');
          const fee = parseInt(feeField.value) || 6000;
          preview.textContent = `¥${fee.toLocaleString()}/回`;
        });
      }

      // 言語の更新
      const languageCheckboxes = document.querySelectorAll('.language-checkbox');
      languageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const preview = previewContainer.querySelector('#preview-languages');
          const selected = Array.from(document.querySelectorAll('.language-checkbox:checked'))
            .map(cb => cb.nextElementSibling?.textContent?.trim().replace(/^[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]*/, ''))
            .filter(lang => lang);
          preview.textContent = selected.length > 0 ? selected.join(', ') : '日本語';
        });
      });

      // プロフィール写真の更新
      const photoField = document.getElementById('guide-profile-preview');
      if (photoField) {
        const observer = new MutationObserver(() => {
          const preview = previewContainer.querySelector('#preview-photo');
          if (photoField.src && !photoField.src.includes('placeholder')) {
            preview.src = photoField.src;
          }
        });
        observer.observe(photoField, { attributes: true, attributeFilter: ['src'] });
      }
    },

    /**
     * 保存完了時のUX向上
     */
    enhanceSaveExperience() {
      // 保存プロセスの視覚的フィードバック
      const originalSave = window.UnifiedGuideSystem?.ProfileSaveManager?.executeCompleteSave;
      if (originalSave) {
        window.UnifiedGuideSystem.ProfileSaveManager.executeCompleteSave = () => {
          this.showSaveProgress();
          const result = originalSave.call(window.UnifiedGuideSystem.ProfileSaveManager);
          if (result) {
            this.showSaveSuccess();
          } else {
            this.hideSaveProgress();
          }
          return result;
        };
      }
    },

    /**
     * 保存進行状況を表示
     */
    showSaveProgress() {
      const progressDiv = document.createElement('div');
      progressDiv.id = 'save-progress';
      progressDiv.className = 'alert alert-info';
      progressDiv.innerHTML = `
        <div class="d-flex align-items-center">
          <div class="spinner-border spinner-border-sm me-2" role="status"></div>
          プロフィールを保存しています...
        </div>
      `;

      const form = document.getElementById('profile-basic-form');
      if (form) {
        form.insertBefore(progressDiv, form.firstChild);
      }
    },

    /**
     * 保存成功を表示
     */
    showSaveSuccess() {
      this.hideSaveProgress();
      
      const successDiv = document.createElement('div');
      successDiv.className = 'alert alert-success alert-dismissible fade show';
      successDiv.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong>保存完了！</strong> ガイドプロフィールが正常に保存されました。
        メインページのガイド一覧に反映されています。
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;

      const form = document.getElementById('profile-basic-form');
      if (form) {
        form.insertBefore(successDiv, form.firstChild);
        
        // 5秒後に自動削除
        setTimeout(() => successDiv.remove(), 5000);
      }
    },

    /**
     * 保存進行状況を非表示
     */
    hideSaveProgress() {
      const progressDiv = document.getElementById('save-progress');
      if (progressDiv) {
        progressDiv.remove();
      }
    },

    /**
     * メインページでのガイドカード表示改善
     */
    enhanceMainPageDisplay() {
      // ガイドカードのホバー効果
      this.addCardHoverEffects();
      
      // ローディング状態の表示
      this.setupLoadingStates();
      
      // ガイドカードの並び替え機能
      this.addSortingFeatures();
    },

    /**
     * カードホバー効果を追加
     */
    addCardHoverEffects() {
      const style = document.createElement('style');
      style.textContent = `
        .guide-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .guide-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .guide-card .btn {
          transition: all 0.2s ease;
        }
        .guide-card:hover .btn-primary {
          background-color: #0056b3;
          border-color: #0056b3;
        }
      `;
      document.head.appendChild(style);
    },

    /**
     * ローディング状態の設定
     */
    setupLoadingStates() {
      // ガイド一覧更新時のローディング表示
      const originalUpdate = window.UnifiedGuideSystem?.GuideDisplayManager?.updateGuideList;
      if (originalUpdate) {
        window.UnifiedGuideSystem.GuideDisplayManager.updateGuideList = () => {
          this.showLoadingSpinner();
          const result = originalUpdate.call(window.UnifiedGuideSystem.GuideDisplayManager);
          setTimeout(() => this.hideLoadingSpinner(), 300);
          return result;
        };
      }
    },

    /**
     * ローディングスピナーを表示
     */
    showLoadingSpinner() {
      const container = document.querySelector('#guides-section .row, .container .row');
      if (container && !document.getElementById('guides-loading')) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'guides-loading';
        loadingDiv.className = 'text-center py-4';
        loadingDiv.innerHTML = `
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">読み込み中...</span>
          </div>
          <p class="mt-2 text-muted">ガイド一覧を更新しています...</p>
        `;
        container.appendChild(loadingDiv);
      }
    },

    /**
     * ローディングスピナーを非表示
     */
    hideLoadingSpinner() {
      const loadingDiv = document.getElementById('guides-loading');
      if (loadingDiv) {
        loadingDiv.remove();
      }
    },

    /**
     * 並び替え機能を追加
     */
    addSortingFeatures() {
      const guidesSection = document.getElementById('guides-section');
      if (guidesSection) {
        const sortContainer = document.createElement('div');
        sortContainer.className = 'mb-3';
        sortContainer.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <h4>ガイド一覧</h4>
            <div class="d-flex gap-2">
              <select class="form-select form-select-sm" id="guide-sort" style="width: auto;">
                <option value="newest">新着順</option>
                <option value="price-low">料金安い順</option>
                <option value="price-high">料金高い順</option>
                <option value="rating">評価順</option>
              </select>
            </div>
          </div>
        `;
        
        guidesSection.insertBefore(sortContainer, guidesSection.firstChild);
        
        // 並び替えイベント
        const sortSelect = document.getElementById('guide-sort');
        if (sortSelect) {
          sortSelect.addEventListener('change', () => {
            this.sortGuides(sortSelect.value);
          });
        }
      }
    },

    /**
     * ガイドを並び替え
     */
    sortGuides(sortType) {
      const container = document.querySelector('#guides-section .row');
      if (!container) return;

      const cards = Array.from(container.querySelectorAll('.col-md-6, .col-lg-4'));
      
      cards.sort((a, b) => {
        switch (sortType) {
          case 'price-low':
            return this.extractPrice(a) - this.extractPrice(b);
          case 'price-high':
            return this.extractPrice(b) - this.extractPrice(a);
          case 'rating':
            return this.extractRating(b) - this.extractRating(a);
          case 'newest':
          default:
            return this.isUserCreated(b) - this.isUserCreated(a);
        }
      });

      // カードを再配置
      cards.forEach(card => container.appendChild(card));
    },

    /**
     * 価格を抽出
     */
    extractPrice(card) {
      const priceText = card.querySelector('.price strong')?.textContent || '¥6,000';
      return parseInt(priceText.replace(/[^\d]/g, '')) || 6000;
    },

    /**
     * 評価を抽出
     */
    extractRating(card) {
      const ratingText = card.querySelector('.rating small')?.textContent || '(0)';
      return parseInt(ratingText.replace(/[^\d]/g, '')) || 0;
    },

    /**
     * ユーザー作成ガイドかどうか
     */
    isUserCreated(card) {
      return card.hasAttribute('data-user-created') ? 1 : 0;
    }
  };

  /**
   * 初期化
   */
  function initialize() {
    // プロフィールページでの機能強化
    if (window.location.pathname.includes('guide-profile') || 
        document.getElementById('profile-basic-form')) {
      UXEnhancements.enhanceProfileForm();
      UXEnhancements.enhanceSaveExperience();
    }

    // メインページでの機能強化
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      setTimeout(() => {
        UXEnhancements.enhanceMainPageDisplay();
      }, 1000);
    }

    // グローバルオブジェクトとして公開
    window.UXEnhancements = UXEnhancements;

    console.log('ユーザーエクスペリエンス向上システム初期化完了');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();