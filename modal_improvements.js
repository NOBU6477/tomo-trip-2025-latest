/**
 * モーダル関連の総合的な改良スクリプト
 * 以下の問題を修正:
 * 1. モーダルが閉じない問題
 * 2. モーダルが表示されたまま画面がフリーズする問題
 * 3. モーダル表示中に画面が暗くならない問題
 * 4. モーダルのスクロール問題
 * 5. 複数モーダルが同時に表示される問題
 */
(function() {
  // 即時実行関数
  console.log('モーダル改良スクリプトを初期化');
  
  // DOMContentLoaded時の初期設定
  document.addEventListener('DOMContentLoaded', function() {
    setupModalImprovements();
    
    // モーダル表示イベント
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      console.log('モーダル表示を検出:', modal.id);
      fixBackdropForModal();
      setupEmergencyCloseButton(modal);
    });
    
    // モーダル非表示イベント
    document.addEventListener('hidden.bs.modal', function() {
      console.log('モーダル非表示を検出');
      cleanupAfterModalClose();
    });
  });
  
  // ウィンドウロード時にも実行
  window.addEventListener('load', function() {
    console.log('ページロード完了: モーダル改良を適用');
    setupModalImprovements();
    
    // 遅延実行（後から動的に追加される要素のため）
    setTimeout(setupModalImprovements, 1000);
    
    // ESCキーでモーダル閉じる機能
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        closeAllModals();
      }
    });
  });
  
  // グローバルエラーハンドラ
  window.addEventListener('error', function(e) {
    console.error('グローバルエラー:', e.message);
    
    // モーダル関連のエラーとみなせる場合、すべてのモーダルを閉じる
    if (e.message.includes('modal') || document.querySelector('.modal.show')) {
      console.log('エラー検出によるモーダル緊急終了を実行');
      closeAllModals();
    }
  });
  
  /**
   * モーダル改良機能の設定
   */
  function setupModalImprovements() {
    // すべてのモーダルを取得
    const modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
      setupModalImprovement(modal);
    });
    
    // すべての閉じるボタンを強化
    setupAllCloseButtons();
    
    // モーダル外クリックでも閉じられるようにする
    setupBackdropClickClose();
  }
  
  /**
   * 個別モーダルの改良設定
   * @param {HTMLElement} modal モーダル要素
   */
  function setupModalImprovement(modal) {
    if (!modal) return;
    
    try {
      // モーダルのID確認
      const modalId = modal.id || 'unknown-modal';
      console.log('モーダル改良設定:', modalId);
      
      // モーダル自体のクリックイベント
      modal.addEventListener('click', function(e) {
        // モーダルの外側がクリックされたら閉じる
        if (e.target === this) {
          console.log('モーダル背景クリック検出:', modalId);
          closeModal(modal);
        }
      });
      
      // 緊急停止ボタンを追加
      setupEmergencyCloseButton(modal);
      
      // スクロール問題を修正
      fixModalScroll(modal);
    } catch (err) {
      console.error('モーダル改良エラー:', err);
    }
  }
  
  /**
   * 緊急停止ボタンを設定
   * @param {HTMLElement} modal モーダル要素
   */
  function setupEmergencyCloseButton(modal) {
    if (!modal) return;
    
    const modalDialog = modal.querySelector('.modal-dialog');
    if (!modalDialog) return;
    
    // 既存の緊急ボタンを確認
    if (modalDialog.querySelector('.emergency-close-btn')) return;
    
    // 緊急停止ボタンを作成
    const emergencyBtn = document.createElement('button');
    emergencyBtn.className = 'emergency-close-btn btn btn-sm btn-danger position-absolute';
    emergencyBtn.style.top = '5px';
    emergencyBtn.style.right = '5px';
    emergencyBtn.style.zIndex = '9999';
    emergencyBtn.style.display = 'none';
    emergencyBtn.innerHTML = '緊急終了';
    
    // ボタンクリックイベント
    emergencyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('緊急終了ボタンが押されました');
      closeModal(modal);
      return false;
    });
    
    // 配置
    modalDialog.style.position = 'relative';
    modalDialog.appendChild(emergencyBtn);
  }
  
  /**
   * すべての閉じるボタンを強化
   */
  function setupAllCloseButtons() {
    // 全ての閉じるボタンを検索
    const closeButtons = document.querySelectorAll('.modal .btn-close, .modal .close, [data-bs-dismiss="modal"]');
    
    closeButtons.forEach(function(button) {
      // 既存のイベントリスナーを削除するためクローン
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
        
        // 新しいイベントリスナーを追加
        newButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // 親モーダルを特定
          const modal = this.closest('.modal');
          if (modal) {
            console.log('閉じるボタンがクリックされました:', modal.id);
            closeModal(modal);
          } else {
            // モーダルが見つからない場合はすべて閉じる
            closeAllModals();
          }
          
          return false;
        });
      }
    });
  }
  
  /**
   * モーダル外クリックで閉じる機能を設定
   */
  function setupBackdropClickClose() {
    // 直接バックドロップがクリックされた場合も処理
    document.body.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal-backdrop')) {
        console.log('背景クリックを検出');
        closeAllModals();
      }
    });
  }
  
  /**
   * モーダルのスクロール問題を修正
   * @param {HTMLElement} modal モーダル要素
   */
  function fixModalScroll(modal) {
    if (!modal) return;
    
    const modalDialog = modal.querySelector('.modal-dialog');
    if (modalDialog) {
      modalDialog.style.maxHeight = '95vh';
      modalDialog.style.overflowY = 'auto';
    }
  }
  
  /**
   * モーダル表示時の背景問題を修正
   */
  function fixBackdropForModal() {
    // 余分な背景を削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    if (backdrops.length > 1) {
      console.log('余分な背景を検出: ' + backdrops.length + '個');
      for (let i = 1; i < backdrops.length; i++) {
        backdrops[i].parentNode.removeChild(backdrops[i]);
      }
    }
    
    // 残った背景のスタイルを修正
    if (backdrops.length > 0) {
      backdrops[0].style.opacity = '0.5';
      backdrops[0].style.zIndex = '1040';
    }
  }
  
  /**
   * モーダルを閉じる
   * @param {HTMLElement} modal 閉じるモーダル
   */
  function closeModal(modal) {
    if (!modal) return;
    
    try {
      // モーダルを手動で非表示
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      
      // Bootstrapインスタンスでも閉じる試行
      try {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
      } catch (err) {
        console.log('Bootstrapモーダル制御に失敗:', err);
      }
      
      // 後処理
      cleanupAfterModalClose();
    } catch (err) {
      console.error('モーダル閉じるエラー:', err);
      
      // 最終手段
      try {
        modal.style.visibility = 'hidden';
        modal.style.display = 'none';
        removeModalBackdrops();
        document.body.style = '';
        document.body.classList.remove('modal-open');
      } catch (finalErr) {
        console.error('最終手段も失敗:', finalErr);
      }
    }
  }
  
  /**
   * すべてのモーダルを閉じる
   */
  function closeAllModals() {
    console.log('すべてのモーダルを閉じます');
    
    // 表示されているすべてのモーダルを閉じる
    const openModals = document.querySelectorAll('.modal.show, .modal[style*="display: block"]');
    openModals.forEach(function(modal) {
      closeModal(modal);
    });
    
    // 後処理
    cleanupAfterModalClose();
  }
  
  /**
   * モーダル閉じた後の共通処理
   */
  function cleanupAfterModalClose() {
    // 背景を削除
    removeModalBackdrops();
    
    // bodyのスタイルをリセット
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // 緊急終了ボタンを非表示
    const emergencyButtons = document.querySelectorAll('.emergency-close-btn');
    emergencyButtons.forEach(function(btn) {
      btn.style.display = 'none';
    });
  }
  
  /**
   * モーダルの背景を削除
   */
  function removeModalBackdrops() {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(function(backdrop) {
      try {
        backdrop.parentNode.removeChild(backdrop);
      } catch (err) {
        backdrop.style.display = 'none';
      }
    });
  }
  
  // グローバル関数をエクスポート
  window.closeAllModals = closeAllModals;
  window.closeModal = closeModal;
})();