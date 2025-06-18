/**
 * ガイド詳細表示システム
 * ユーザー作成ガイドの詳細情報を正確に表示
 */
(function() {
  'use strict';

  const GuideDetailSystem = {
    /**
     * ガイド選択処理を統合管理
     */
    selectGuide(guideId, guideName) {
      console.log('ガイド選択:', guideId, guideName);
      
      // ユーザー作成ガイドかどうかを確認
      const isUserCreated = guideId.startsWith('guide_') || guideId.startsWith('user_guide_');
      
      if (isUserCreated) {
        this.handleUserCreatedGuide(guideId, guideName);
      } else {
        this.handleDefaultGuide(guideId, guideName);
      }
    },

    /**
     * ユーザー作成ガイドの処理
     */
    handleUserCreatedGuide(guideId, guideName) {
      // 統合ガイドシステムからデータを取得
      let guideData = null;
      
      if (window.UnifiedGuideSystem) {
        guideData = window.UnifiedGuideSystem.GuideDataManager.getGuideById(guideId);
      }
      
      // フォールバック: 従来のストレージから取得
      if (!guideData) {
        const userGuides = JSON.parse(localStorage.getItem('userCreatedGuides') || '[]');
        guideData = userGuides.find(g => g.id === guideId);
      }
      
      if (!guideData) {
        const legacyGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
        guideData = legacyGuides.find(g => g.id === guideId);
      }
      
      if (guideData) {
        console.log('ユーザー作成ガイドデータを取得:', guideData);
        this.showUserGuideDetail(guideData);
      } else {
        console.error('ガイドデータが見つかりません:', guideId);
        alert('ガイド情報が見つかりませんでした。');
      }
    },

    /**
     * デフォルトガイドの処理（従来通り）
     */
    handleDefaultGuide(guideId, guideName) {
      // 従来のガイド選択処理
      if (typeof window.originalSelectGuide === 'function') {
        window.originalSelectGuide(guideId, guideName);
      } else {
        this.showDefaultGuideSelection(guideId, guideName);
      }
    },

    /**
     * ユーザーガイド詳細を表示
     */
    showUserGuideDetail(guideData) {
      // 既存のモーダルがあれば削除
      const existingModal = document.getElementById('userGuideDetailModal');
      if (existingModal) {
        existingModal.remove();
      }

      // 新しいモーダルを作成
      const modal = this.createUserGuideDetailModal(guideData);
      document.body.appendChild(modal);

      // Bootstrapモーダルを表示
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    },

    /**
     * ユーザーガイド詳細モーダルを作成
     */
    createUserGuideDetailModal(guide) {
      const modalDiv = document.createElement('div');
      modalDiv.className = 'modal fade';
      modalDiv.id = 'userGuideDetailModal';
      modalDiv.setAttribute('tabindex', '-1');

      const languages = Array.isArray(guide.languages) ? guide.languages.join(', ') : '日本語';
      const interests = Array.isArray(guide.interests) ? guide.interests.join(', ') : '';
      const additionalInfo = guide.additionalInfo || '';

      modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">ガイド詳細 - ${guide.name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-4">
                  <img src="${guide.profilePhoto}" class="img-fluid rounded mb-3" alt="${guide.name}">
                  <div class="text-center">
                    <span class="badge bg-success mb-2">新規登録ガイド</span>
                    <div class="rating mb-2">
                      <span class="text-warning">★★★★★</span>
                      <small class="text-muted">(${guide.reviewCount}件)</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-8">
                  <h4>${guide.name}</h4>
                  <p class="text-muted mb-3">
                    <i class="bi bi-geo-alt-fill"></i> ${guide.location}
                  </p>
                  
                  <div class="mb-3">
                    <h6>対応言語</h6>
                    <p><i class="bi bi-translate"></i> ${languages}</p>
                  </div>
                  
                  <div class="mb-3">
                    <h6>自己紹介</h6>
                    <p>${guide.description}</p>
                  </div>
                  
                  ${interests ? `
                    <div class="mb-3">
                      <h6>得意分野・興味</h6>
                      <p>${interests}</p>
                    </div>
                  ` : ''}
                  
                  ${additionalInfo ? `
                    <div class="mb-3">
                      <h6>追加情報</h6>
                      <p>${additionalInfo}</p>
                    </div>
                  ` : ''}
                  
                  <div class="mb-3">
                    <h6>セッション料金</h6>
                    <div class="h5 text-primary">¥${guide.sessionFee.toLocaleString()}/回</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
              <button type="button" class="btn btn-primary" onclick="GuideDetailSystem.bookGuide('${guide.id}', '${guide.name}')">
                このガイドを予約する
              </button>
            </div>
          </div>
        </div>
      `;

      return modalDiv;
    },

    /**
     * デフォルトガイド選択表示
     */
    showDefaultGuideSelection(guideId, guideName) {
      // 従来のモーダル表示ロジック
      const modal = document.getElementById('guideSelectionModal');
      if (modal) {
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
          modalTitle.textContent = `${guideName}を選択しました`;
        }
        
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
      }
    },

    /**
     * ガイド予約処理
     */
    bookGuide(guideId, guideName) {
      // 予約情報をセッションストレージに保存
      const bookingData = {
        guideId: guideId,
        guideName: guideName,
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('selectedGuide', JSON.stringify(bookingData));
      sessionStorage.setItem('pendingBooking', 'true');
      
      // モーダルを閉じる
      const modal = document.getElementById('userGuideDetailModal');
      if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
        }
      }
      
      // 予約ページに遷移
      window.location.href = '#booking-section';
      
      // 予約セクションまでスクロール
      setTimeout(() => {
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
      
      console.log('ガイド予約開始:', guideId, guideName);
    },

    /**
     * 既存のselectGuide関数を置き換え
     */
    replaceSelectGuideFunction() {
      // 既存のselectGuide関数をバックアップ
      if (typeof window.selectGuide === 'function') {
        window.originalSelectGuide = window.selectGuide;
      }
      
      // 新しいselectGuide関数を設定
      window.selectGuide = (guideId, guideName) => {
        this.selectGuide(guideId, guideName);
      };
      
      console.log('selectGuide関数を統合システムに置き換えました');
    },

    /**
     * 「詳細を見る」ボタンの処理を統合
     */
    setupDetailButtons() {
      // 既存の詳細ボタンにイベントリスナーを追加
      document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && button.textContent.includes('詳細を見る')) {
          e.preventDefault();
          
          const card = button.closest('[data-guide-id]');
          if (card) {
            const guideId = card.getAttribute('data-guide-id');
            const guideName = card.querySelector('.card-title')?.textContent || 'ガイド';
            
            this.selectGuide(guideId, guideName);
          }
        }
      });
    }
  };

  /**
   * 初期化
   */
  function initialize() {
    // グローバルオブジェクトとして公開
    window.GuideDetailSystem = GuideDetailSystem;
    
    // selectGuide関数を置き換え
    GuideDetailSystem.replaceSelectGuideFunction();
    
    // 詳細ボタンの処理を設定
    GuideDetailSystem.setupDetailButtons();
    
    console.log('ガイド詳細表示システム初期化完了');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();