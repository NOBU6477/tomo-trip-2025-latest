/**
 * 統合ガイドシステム
 * プロフィール作成から詳細表示まで一貫したデータ管理
 */
(function() {
  'use strict';

  // ガイドデータの中央管理
  const GuideDataManager = {
    // 現在編集中のガイドID
    currentGuideId: null,
    
    // ガイドデータストレージキー
    storageKeys: {
      guides: 'unifiedGuideData',
      currentGuide: 'currentEditingGuide',
      userGuides: 'userCreatedGuides'
    },

    /**
     * 新しいガイドIDを生成
     */
    generateGuideId() {
      return 'guide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * 現在のガイドIDを取得または生成
     */
    getCurrentGuideId() {
      if (!this.currentGuideId) {
        this.currentGuideId = localStorage.getItem('currentGuideId') || this.generateGuideId();
        localStorage.setItem('currentGuideId', this.currentGuideId);
      }
      return this.currentGuideId;
    },

    /**
     * フォームから完全なガイドデータを収集
     */
    collectCompleteGuideData() {
      const guideId = this.getCurrentGuideId();
      
      const data = {
        id: guideId,
        name: this.getFieldValue('guide-name'),
        username: this.getFieldValue('guide-username'),
        email: this.getFieldValue('guide-email'),
        location: this.getFieldValue('guide-location'),
        description: this.getFieldValue('guide-description'),
        sessionFee: parseInt(this.getFieldValue('guide-session-fee')) || 6000,
        additionalInfo: this.getFieldValue('interest-custom'),
        languages: this.collectLanguages(),
        interests: this.collectInterests(),
        profilePhoto: this.getProfilePhotoUrl(),
        
        // メタデータ
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 20) + 5,
        isNew: true,
        verified: true,
        isUserCreated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('収集した完全ガイドデータ:', data);
      return data;
    },

    /**
     * フィールド値を安全に取得
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
          // アイコンを除去して言語名のみを取得
          const cleanLabel = label.replace(/^[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]*/, '');
          languages.push(cleanLabel);
        }
      });

      return languages.length > 0 ? languages : ['日本語'];
    },

    /**
     * 選択された興味・得意分野を収集
     */
    collectInterests() {
      const interests = [];
      const checkboxes = document.querySelectorAll('input[id^="interest-"]:checked');
      
      checkboxes.forEach(checkbox => {
        const label = checkbox.nextElementSibling?.textContent?.trim();
        if (label) {
          interests.push(label);
        }
      });

      return interests;
    },

    /**
     * プロフィール写真URLを取得
     */
    getProfilePhotoUrl() {
      const img = document.getElementById('guide-profile-preview');
      if (img && img.src && !img.src.includes('placeholder')) {
        return img.src;
      }
      return 'https://via.placeholder.com/300x300/007bff/ffffff?text=' + encodeURIComponent('ガイド');
    },

    /**
     * ガイドデータを保存
     */
    saveGuideData(guideData) {
      try {
        // 1. 統合ガイドデータに保存
        const allGuides = this.getAllGuides();
        const existingIndex = allGuides.findIndex(g => g.id === guideData.id);
        
        if (existingIndex >= 0) {
          allGuides[existingIndex] = guideData;
        } else {
          allGuides.unshift(guideData); // 新規は先頭に
        }
        
        localStorage.setItem(this.storageKeys.guides, JSON.stringify(allGuides));
        
        // 2. ユーザー作成ガイド専用ストレージに保存
        const userGuides = JSON.parse(localStorage.getItem(this.storageKeys.userGuides) || '[]');
        const userIndex = userGuides.findIndex(g => g.id === guideData.id);
        
        if (userIndex >= 0) {
          userGuides[userIndex] = guideData;
        } else {
          userGuides.unshift(guideData);
        }
        
        localStorage.setItem(this.storageKeys.userGuides, JSON.stringify(userGuides));
        
        // 3. 現在編集中ガイドとして保存
        localStorage.setItem(this.storageKeys.currentGuide, JSON.stringify(guideData));
        
        // 4. 従来システムとの互換性のため
        const legacyGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
        const legacyIndex = legacyGuides.findIndex(g => g.id === guideData.id);
        
        if (legacyIndex >= 0) {
          legacyGuides[legacyIndex] = guideData;
        } else {
          legacyGuides.unshift(guideData);
        }
        
        localStorage.setItem('userAddedGuides', JSON.stringify(legacyGuides));
        
        console.log('ガイドデータを全ストレージに保存完了:', guideData.id);
        return true;
        
      } catch (error) {
        console.error('ガイドデータ保存エラー:', error);
        return false;
      }
    },

    /**
     * 全ガイドデータを取得
     */
    getAllGuides() {
      return JSON.parse(localStorage.getItem(this.storageKeys.guides) || '[]');
    },

    /**
     * 特定のガイドデータを取得
     */
    getGuideById(guideId) {
      const allGuides = this.getAllGuides();
      return allGuides.find(g => g.id === guideId) || null;
    },

    /**
     * ユーザー作成ガイドのみを取得
     */
    getUserCreatedGuides() {
      return JSON.parse(localStorage.getItem(this.storageKeys.userGuides) || '[]');
    }
  };

  // メインページ用ガイド表示システム
  const GuideDisplayManager = {
    /**
     * ガイド一覧を更新
     */
    updateGuideList() {
      console.log('=== ガイド一覧更新開始 ===');
      
      const container = this.findGuideContainer();
      if (!container) {
        console.error('ガイドコンテナが見つかりません');
        return;
      }

      // 既存のユーザー作成ガイドを削除
      this.removeExistingUserGuides(container);
      
      // ユーザー作成ガイドを追加（左上から順番に配置）
      const userGuides = GuideDataManager.getUserCreatedGuides();
      console.log('表示対象ガイド数:', userGuides.length);
      
      // 最新のガイドから順番に左上に配置
      userGuides.forEach((guide, index) => {
        const guideCard = this.createGuideCard(guide);
        // 常に先頭（左上）に挿入
        container.insertBefore(guideCard, container.firstChild);
      });

      console.log('=== ガイド一覧更新完了 ===');
    },

    /**
     * 強制的にガイド一覧を更新
     */
    forceUpdateGuideList() {
      console.log('強制ガイド一覧更新実行');
      this.updateGuideList();
      
      // 従来システムも更新
      if (typeof window.updateGuideDisplay === 'function') {
        window.updateGuideDisplay();
      }
      
      // 追加で再レンダリング
      setTimeout(() => {
        this.updateGuideList();
      }, 500);
    },

    /**
     * ガイドコンテナを検索
     */
    findGuideContainer() {
      const selectors = [
        '.guide-cards-container',
        '#guides-section .row',
        '.container .row',
        '.row.g-4'
      ];
      
      for (const selector of selectors) {
        const container = document.querySelector(selector);
        if (container && container.children.length > 0) {
          return container;
        }
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
     * ガイドカードを作成
     */
    createGuideCard(guide) {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'col-md-6 col-lg-4 mb-4';
      cardDiv.setAttribute('data-user-created', 'true');
      cardDiv.setAttribute('data-guide-id', guide.id);

      const languages = Array.isArray(guide.languages) ? guide.languages.slice(0, 3).join(', ') : '日本語';
      const interests = Array.isArray(guide.interests) ? guide.interests.slice(0, 2).join(', ') : '';
      const description = guide.description || '新規登録ガイドです。';
      const shortDesc = description.length > 80 ? description.substring(0, 80) + '...' : description;

      cardDiv.innerHTML = `
        <div class="card guide-card h-100 shadow-sm">
          <div class="position-relative">
            <img src="${guide.profilePhoto}" class="card-img-top guide-photo" alt="${guide.name}" style="height: 200px; object-fit: cover;">
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
              <i class="bi bi-translate"></i> ${languages}
            </p>
            <p class="card-text small">${shortDesc}</p>
            ${interests ? `<div class="mb-2"><small class="text-muted">得意分野: ${interests}</small></div>` : ''}
            <div class="d-flex justify-content-between align-items-center">
              <div class="rating">
                <span class="text-warning">★★★★★</span>
                <small class="text-muted">(${guide.reviewCount})</small>
              </div>
              <div class="price">
                <strong>¥${guide.sessionFee.toLocaleString()}/回</strong>
              </div>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <button class="btn btn-primary w-100" onclick="selectGuide('${guide.id}', '${guide.name}')">
              このガイドを選ぶ
            </button>
          </div>
        </div>
      `;

      return cardDiv;
    }
  };

  // プロフィールページ用保存システム
  const ProfileSaveManager = {
    /**
     * 完全保存を実行
     */
    executeCompleteSave() {
      console.log('=== 統合保存処理開始 ===');
      
      // 1. フォームデータを収集
      const guideData = GuideDataManager.collectCompleteGuideData();
      
      // 2. データ検証
      if (!this.validateGuideData(guideData)) {
        return false;
      }
      
      // 3. データを保存
      const success = GuideDataManager.saveGuideData(guideData);
      if (!success) {
        alert('保存に失敗しました。');
        return false;
      }
      
      // 4. 他ページに通知
      this.notifyOtherPages(guideData);
      
      // 5. 成功メッセージ
      this.showSuccessMessage();
      
      console.log('=== 統合保存処理完了 ===');
      return true;
    },

    /**
     * ガイドデータを検証
     */
    validateGuideData(data) {
      if (!data.name) {
        alert('名前を入力してください。');
        document.getElementById('guide-name')?.focus();
        return false;
      }
      
      if (!data.location) {
        alert('活動エリアを選択してください。');
        document.getElementById('guide-location')?.focus();
        return false;
      }
      
      if (data.sessionFee < 6000) {
        alert('セッション料金は¥6,000以上で設定してください。');
        document.getElementById('guide-session-fee')?.focus();
        return false;
      }
      
      return true;
    },

    /**
     * 他ページに更新を通知
     */
    notifyOtherPages(guideData) {
      // BroadcastChannel
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const channel = new BroadcastChannel('guide_updates');
          channel.postMessage({
            type: 'GUIDE_SAVED',
            data: guideData,
            timestamp: Date.now()
          });
        } catch (error) {
          console.log('BroadcastChannel利用不可');
        }
      }
      
      // ストレージイベント
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'guideUpdateTrigger',
        newValue: JSON.stringify({ id: guideData.id, timestamp: Date.now() })
      }));
    },

    /**
     * 成功メッセージを表示
     */
    showSuccessMessage() {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert alert-success alert-dismissible fade show';
      alertDiv.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        プロフィールを保存しました！ガイド一覧に反映されています。
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;

      const form = document.getElementById('profile-basic-form');
      if (form) {
        form.insertBefore(alertDiv, form.firstChild);
        setTimeout(() => alertDiv.remove(), 5000);
      }
    }
  };

  // 初期化とイベント設定
  function initialize() {
    // グローバル関数として公開
    window.UnifiedGuideSystem = {
      GuideDataManager,
      GuideDisplayManager,
      ProfileSaveManager
    };

    // プロフィールページでの保存ハンドラー設定
    if (window.location.pathname.includes('guide-profile') || 
        document.getElementById('profile-basic-form')) {
      
      // 既存の保存ボタンを置き換え
      const form = document.getElementById('profile-basic-form');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          ProfileSaveManager.executeCompleteSave();
        });
      }

      const saveBasicButton = document.getElementById('save-basic-info');
      if (saveBasicButton) {
        saveBasicButton.onclick = function(e) {
          e.preventDefault();
          ProfileSaveManager.executeCompleteSave();
        };
      }

      const saveAndViewButton = document.getElementById('save-and-view-guide-list');
      if (saveAndViewButton) {
        saveAndViewButton.onclick = function(e) {
          e.preventDefault();
          if (ProfileSaveManager.executeCompleteSave()) {
            setTimeout(() => window.location.href = '/', 1000);
          }
        };
      }
    }

    // メインページでのガイド表示
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      // ページロード時にガイド一覧を更新
      setTimeout(() => GuideDisplayManager.updateGuideList(), 500);
      
      // BroadcastChannelリスナー
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const channel = new BroadcastChannel('guide_updates');
          channel.addEventListener('message', function(event) {
            if (event.data.type === 'GUIDE_SAVED') {
              setTimeout(() => GuideDisplayManager.updateGuideList(), 200);
            }
          });
        } catch (error) {
          console.log('BroadcastChannel利用不可');
        }
      }
      
      // ストレージイベントリスナー
      window.addEventListener('storage', function(e) {
        if (e.key === 'guideUpdateTrigger') {
          setTimeout(() => GuideDisplayManager.updateGuideList(), 200);
        }
      });
    }

    console.log('統合ガイドシステム初期化完了');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();