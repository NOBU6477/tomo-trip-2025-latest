/**
 * ガイドリスト管理システム
 * 新規ガイドの左上配置と正確なデータ表示を保証
 */
(function() {
  'use strict';

  const GuideListManager = {
    /**
     * システムを初期化
     */
    initialize() {
      this.setupMainPageUpdates();
      this.monitorGuideChanges();
      this.forceInitialUpdate();
      
      console.log('ガイドリスト管理システム初期化完了');
    },

    /**
     * メインページの更新システムを設定
     */
    setupMainPageUpdates() {
      // ページロード時の更新
      if (this.isMainPage()) {
        setTimeout(() => {
          this.updateMainPageGuides();
        }, 1000);
      }

      // URLパラメータによる更新検知
      if (window.location.search.includes('updated=true')) {
        setTimeout(() => {
          this.updateMainPageGuides();
          this.cleanUrl();
        }, 500);
      }
    },

    /**
     * メインページかどうかを判定
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
      url.searchParams.delete('updated');
      window.history.replaceState({}, '', url);
    },

    /**
     * ガイド変更を監視
     */
    monitorGuideChanges() {
      // localStorageの変更を監視
      window.addEventListener('storage', (e) => {
        if (e.key && (e.key.includes('Guide') || e.key.includes('guide'))) {
          console.log('ガイドデータ変更検知:', e.key);
          setTimeout(() => {
            this.updateMainPageGuides();
          }, 300);
        }
      });

      // 定期的な同期チェック
      setInterval(() => {
        if (this.isMainPage()) {
          this.syncGuideDisplay();
        }
      }, 5000);
    },

    /**
     * 強制初期更新
     */
    forceInitialUpdate() {
      if (this.isMainPage()) {
        // 複数回実行して確実に反映
        setTimeout(() => this.updateMainPageGuides(), 500);
        setTimeout(() => this.updateMainPageGuides(), 1500);
        setTimeout(() => this.updateMainPageGuides(), 3000);
      }
    },

    /**
     * メインページのガイド表示を更新
     */
    updateMainPageGuides() {
      console.log('=== メインページガイド更新開始 ===');
      
      const container = this.findMainContainer();
      if (!container) {
        console.error('メインコンテナが見つかりません');
        return;
      }

      // 既存のユーザーガイドを削除
      this.removeExistingUserGuides(container);
      
      // ユーザー作成ガイドを取得
      const userGuides = this.getAllUserGuides();
      console.log('表示対象ガイド:', userGuides.length, '件');

      if (userGuides.length === 0) {
        console.log('表示するユーザーガイドがありません');
        return;
      }

      // 新しいガイドから順番に左上に配置
      userGuides.reverse().forEach((guide, index) => {
        const guideCard = this.createGuideCard(guide);
        console.log(`ガイドカード作成: ${guide.name} (${guide.id})`);
        
        // 最初の子要素として挿入（左上に配置）
        container.insertBefore(guideCard, container.firstChild);
      });

      console.log('=== メインページガイド更新完了 ===');
    },

    /**
     * メインコンテナを検索
     */
    findMainContainer() {
      const selectors = [
        '#guides-section .row',
        '.guides-section .row',
        '.container .row',
        '.row.g-4',
        '.row'
      ];

      for (const selector of selectors) {
        const container = document.querySelector(selector);
        if (container) {
          console.log('コンテナ発見:', selector);
          return container;
        }
      }

      console.error('ガイドコンテナが見つかりませんでした');
      return null;
    },

    /**
     * 既存ユーザーガイドを削除
     */
    removeExistingUserGuides(container) {
      const existing = container.querySelectorAll('[data-user-created="true"], [data-guide-id^="guide_"], [data-guide-id^="user_guide_"]');
      console.log('削除対象のユーザーガイド:', existing.length, '件');
      existing.forEach(card => card.remove());
    },

    /**
     * 全ユーザーガイドを取得
     */
    getAllUserGuides() {
      const sources = [
        'unifiedGuideData',
        'userCreatedGuides', 
        'userAddedGuides'
      ];

      const allGuides = [];
      const seenIds = new Set();

      sources.forEach(source => {
        try {
          const guides = JSON.parse(localStorage.getItem(source) || '[]');
          guides.forEach(guide => {
            if (guide.id && !seenIds.has(guide.id) && guide.isUserCreated) {
              allGuides.push(guide);
              seenIds.add(guide.id);
            }
          });
        } catch (error) {
          console.warn(`${source}の読み込みエラー:`, error);
        }
      });

      // 作成日時でソート（新しいものが先頭）
      return allGuides.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.timestamp || 0);
        const dateB = new Date(b.createdAt || b.timestamp || 0);
        return dateB - dateA;
      });
    },

    /**
     * ガイドカードを作成
     */
    createGuideCard(guide) {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'col-md-6 col-lg-4 mb-4';
      cardDiv.setAttribute('data-user-created', 'true');
      cardDiv.setAttribute('data-guide-id', guide.id);

      // データの検証と安全な取得
      const name = guide.name || 'ガイド';
      const location = guide.location || '未設定';
      const description = guide.description || '新規登録ガイドです。よろしくお願いします。';
      const sessionFee = guide.sessionFee || 6000;
      const languages = Array.isArray(guide.languages) ? guide.languages.slice(0, 3).join(', ') : '日本語';
      const profilePhoto = guide.profilePhoto || 'https://via.placeholder.com/300x200/007bff/ffffff?text=ガイド';
      const reviewCount = guide.reviewCount || 'new';
      
      // 説明文の短縮
      const shortDesc = description.length > 100 ? description.substring(0, 100) + '...' : description;

      cardDiv.innerHTML = `
        <div class="card guide-card h-100 shadow-sm">
          <div class="position-relative">
            <img src="${profilePhoto}" class="card-img-top guide-photo" alt="${name}" 
                 style="height: 200px; object-fit: cover;" 
                 onerror="this.src='https://via.placeholder.com/300x200/007bff/ffffff?text=ガイド'">
            <div class="position-absolute top-0 end-0 m-2">
              <span class="badge bg-success">新規</span>
            </div>
          </div>
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="text-muted mb-2">
              <i class="bi bi-geo-alt-fill"></i> ${location}
            </p>
            <p class="text-muted mb-2">
              <i class="bi bi-translate"></i> ${languages}
            </p>
            <p class="card-text small">${shortDesc}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="rating">
                <span class="text-warning">★★★★★</span>
                <small class="text-muted">(${reviewCount})</small>
              </div>
              <div class="price">
                <strong>¥${sessionFee.toLocaleString()}/回</strong>
              </div>
            </div>
            <div class="mt-2">
              <button type="button" class="btn btn-primary btn-sm w-100" 
                      onclick="selectGuide('${guide.id}', '${name}')">
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      `;

      return cardDiv;
    },

    /**
     * ガイド表示の同期
     */
    syncGuideDisplay() {
      const container = this.findMainContainer();
      if (!container) return;

      const userGuidesInStorage = this.getAllUserGuides();
      const userGuidesOnPage = container.querySelectorAll('[data-user-created="true"]');

      // ストレージとページの表示数が異なる場合は更新
      if (userGuidesInStorage.length !== userGuidesOnPage.length) {
        console.log('ガイド表示数不一致 - 同期実行');
        this.updateMainPageGuides();
      }
    },

    /**
     * デバッグ情報を出力
     */
    debugInfo() {
      const userGuides = this.getAllUserGuides();
      const container = this.findMainContainer();
      const guidesOnPage = container ? container.querySelectorAll('[data-user-created="true"]').length : 0;

      console.log('=== ガイドリスト管理デバッグ ===');
      console.log('ストレージ内ユーザーガイド数:', userGuides.length);
      console.log('ページ表示ユーザーガイド数:', guidesOnPage);
      console.log('ユーザーガイド詳細:', userGuides);
      console.log('=============================');
    }
  };

  /**
   * 初期化
   */
  function initialize() {
    // グローバルオブジェクトとして公開
    window.GuideListManager = GuideListManager;
    
    // システムを初期化
    GuideListManager.initialize();
    
    // デバッグ関数をグローバルに公開
    window.debugGuideList = () => GuideListManager.debugInfo();
    
    console.log('ガイドリスト管理システム開始');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();