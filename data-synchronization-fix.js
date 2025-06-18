/**
 * データ同期修正システム
 * プレビューとガイドリストで同じデータを確実に表示
 */
(function() {
  'use strict';

  const DataSyncFix = {
    // 現在のガイドデータを保持
    currentGuideData: null,

    /**
     * システムを初期化
     */
    initialize() {
      this.setupDataCapture();
      this.overrideSystemMethods();
      this.startSynchronization();
      
      console.log('データ同期修正システム初期化完了');
    },

    /**
     * データキャプチャを設定
     */
    setupDataCapture() {
      // フォームデータの変更を監視
      const fields = ['guide-name', 'guide-description', 'guide-location', 'guide-session-fee'];
      
      fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
          field.addEventListener('input', () => this.captureCurrentData());
          field.addEventListener('change', () => this.captureCurrentData());
        }
      });

      // 写真変更の監視
      const photoPreview = document.getElementById('guide-profile-preview');
      if (photoPreview) {
        const observer = new MutationObserver(() => this.captureCurrentData());
        observer.observe(photoPreview, { attributes: true, attributeFilter: ['src'] });
      }

      // 定期的なデータキャプチャ
      setInterval(() => {
        this.captureCurrentData();
      }, 1000);
    },

    /**
     * 現在のデータをキャプチャ
     */
    captureCurrentData() {
      const name = this.getFieldValue('guide-name');
      const description = this.getFieldValue('guide-description');
      const location = this.getFieldValue('guide-location');
      const sessionFee = parseInt(this.getFieldValue('guide-session-fee')) || 6000;
      const photoPreview = document.getElementById('guide-profile-preview');
      const profilePhoto = photoPreview?.src || '';

      // データが変更されている場合のみ更新
      if (name || description || location || (profilePhoto && !profilePhoto.includes('placeholder'))) {
        this.currentGuideData = {
          name: name || 'ガイド',
          description: description || '新規登録ガイドです。よろしくお願いします。',
          location: location || '未設定',
          sessionFee: sessionFee,
          profilePhoto: profilePhoto,
          languages: this.collectLanguages(),
          timestamp: new Date().toISOString()
        };

        // プレビューを即座に更新
        this.updateAllPreviews();
      }
    },

    /**
     * フィールド値を取得
     */
    getFieldValue(fieldId) {
      const field = document.getElementById(fieldId);
      return field ? field.value.trim() : '';
    },

    /**
     * 選択された言語を収集
     */
    collectLanguages() {
      const languages = [];
      const checkboxes = document.querySelectorAll('.language-checkbox:checked');
      
      checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling?.textContent?.trim();
        if (label) {
          const cleanLabel = label.replace(/^[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]*/, '');
          languages.push(cleanLabel);
        }
      });

      return languages.length > 0 ? languages : ['日本語'];
    },

    /**
     * すべてのプレビューを更新
     */
    updateAllPreviews() {
      if (!this.currentGuideData) return;

      // プレビューカードを更新
      this.updatePreviewCard();
      
      // 統合システムのデータも更新
      this.updateUnifiedSystemData();
    },

    /**
     * プレビューカードを更新
     */
    updatePreviewCard() {
      const data = this.currentGuideData;
      
      // 名前を更新
      const nameElements = document.querySelectorAll('#preview-card-name, .guide-card .card-title');
      nameElements.forEach(elem => {
        if (elem) elem.textContent = data.name;
      });

      // 説明を更新
      const descElements = document.querySelectorAll('#preview-card-description, .guide-card .card-text');
      descElements.forEach(elem => {
        if (elem) {
          const shortDesc = data.description.length > 100 ? 
            data.description.substring(0, 100) + '...' : data.description;
          elem.textContent = shortDesc;
        }
      });

      // 活動エリアを更新
      const locationElements = document.querySelectorAll('#preview-card-location');
      locationElements.forEach(elem => {
        if (elem) elem.textContent = data.location;
      });

      // 料金を更新
      const feeElements = document.querySelectorAll('#preview-card-fee, .price strong');
      feeElements.forEach(elem => {
        if (elem) elem.textContent = `¥${data.sessionFee.toLocaleString()}/回`;
      });

      // 写真を更新
      if (data.profilePhoto && !data.profilePhoto.includes('placeholder')) {
        const photoElements = document.querySelectorAll('#preview-card-photo, .guide-card img');
        photoElements.forEach(elem => {
          if (elem) elem.src = data.profilePhoto;
        });
      }

      // 言語を更新
      const langElements = document.querySelectorAll('#preview-card-languages');
      langElements.forEach(elem => {
        if (elem) elem.textContent = data.languages.join(', ');
      });

      console.log('プレビューカード更新完了:', data.name);
    },

    /**
     * 統合システムのデータを更新
     */
    updateUnifiedSystemData() {
      if (window.UnifiedGuideSystem && window.UnifiedGuideSystem.GuideDataManager) {
        // 統合システムに現在のデータを反映
        const manager = window.UnifiedGuideSystem.GuideDataManager;
        
        // フィールドに値を設定（統合システムが読み取れるように）
        this.ensureFieldValues();
      }
    },

    /**
     * フィールドに値を確保
     */
    ensureFieldValues() {
      if (!this.currentGuideData) return;

      const nameField = document.getElementById('guide-name');
      if (nameField && !nameField.value.trim()) {
        nameField.value = this.currentGuideData.name;
      }

      const descField = document.getElementById('guide-description');
      if (descField && !descField.value.trim()) {
        descField.value = this.currentGuideData.description;
      }

      const locationField = document.getElementById('guide-location');
      if (locationField && !locationField.value) {
        locationField.value = this.currentGuideData.location;
      }

      const feeField = document.getElementById('guide-session-fee');
      if (feeField && !feeField.value) {
        feeField.value = this.currentGuideData.sessionFee.toString();
      }
    },

    /**
     * システムメソッドをオーバーライド
     */
    overrideSystemMethods() {
      // 統合ガイドシステムの保存処理をオーバーライド
      if (window.UnifiedGuideSystem && window.UnifiedGuideSystem.ProfileSaveManager) {
        const originalSave = window.UnifiedGuideSystem.ProfileSaveManager.executeCompleteSave;
        
        window.UnifiedGuideSystem.ProfileSaveManager.executeCompleteSave = () => {
          // 保存前にデータを確保
          this.captureCurrentData();
          this.ensureFieldValues();
          
          // 元の保存処理を実行
          const result = originalSave?.call(window.UnifiedGuideSystem.ProfileSaveManager);
          
          // 保存後にガイドリストを更新
          setTimeout(() => {
            this.forceGuideListUpdate();
          }, 300);
          
          return result;
        };
      }

      // 自動入力システムとの連携
      if (window.AutoProfileFiller) {
        const originalAutoFill = window.AutoProfileFiller.autoFillProfile;
        
        window.AutoProfileFiller.autoFillProfile = () => {
          originalAutoFill.call(window.AutoProfileFiller);
          
          // 自動入力後にデータをキャプチャ
          setTimeout(() => {
            this.captureCurrentData();
            this.updateAllPreviews();
          }, 800);
        };
      }
    },

    /**
     * ガイドリストの強制更新
     */
    forceGuideListUpdate() {
      // 現在のデータで新しいガイドを作成
      if (this.currentGuideData) {
        const guideId = 'guide_' + Date.now();
        const completeGuideData = {
          id: guideId,
          ...this.currentGuideData,
          rating: 4.8,
          reviewCount: 'new',
          isNew: true,
          verified: true,
          isUserCreated: true,
          createdAt: new Date().toISOString()
        };

        // ストレージに保存
        this.saveToAllStorages(completeGuideData);

        // ガイドリスト管理システムを更新
        if (window.GuideListManager) {
          setTimeout(() => {
            window.GuideListManager.updateMainPageGuides();
          }, 500);
        }

        // ページリダイレクト
        setTimeout(() => {
          window.location.href = '/?updated=true';
        }, 1000);
      }
    },

    /**
     * 全ストレージに保存
     */
    saveToAllStorages(guideData) {
      const storageKeys = [
        'unifiedGuideData',
        'userCreatedGuides',
        'userAddedGuides'
      ];

      storageKeys.forEach(key => {
        try {
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          
          // 同じIDのガイドを削除
          const filtered = existing.filter(g => g.id !== guideData.id);
          
          // 新しいガイドを先頭に追加
          filtered.unshift(guideData);
          
          localStorage.setItem(key, JSON.stringify(filtered));
          console.log(`${key}に保存完了:`, guideData.name);
        } catch (error) {
          console.warn(`${key}保存エラー:`, error);
        }
      });
    },

    /**
     * 同期を開始
     */
    startSynchronization() {
      // 初期データキャプチャ
      setTimeout(() => {
        this.captureCurrentData();
      }, 1000);

      // 自動入力完了を待ってから同期
      setTimeout(() => {
        this.captureCurrentData();
        this.updateAllPreviews();
      }, 2000);

      // 定期的な同期
      setInterval(() => {
        if (this.currentGuideData) {
          this.updateAllPreviews();
        }
      }, 3000);
    }
  };

  /**
   * 初期化
   */
  function initialize() {
    // グローバルオブジェクトとして公開
    window.DataSyncFix = DataSyncFix;
    
    // システムを初期化
    DataSyncFix.initialize();
    
    console.log('データ同期修正システム開始');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();