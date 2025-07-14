/**
 * 新規登録ボタン修正スクリプト
 * Bootstrap依存から脱却して直接ドロップダウンを制御
 */
(function() {
  console.log('新規登録ボタン直接制御を初期化');
  
  // ページ読み込み完了前に実行
  setupRegisterDropdown();
  
  // ページ読み込み完了後にも実行
  document.addEventListener('DOMContentLoaded', function() {
    setupRegisterDropdown();
  });
  
  /**
   * 新規登録ドロップダウンを設定
   */
  function setupRegisterDropdown() {
    // メイン新規登録ボタン
    const registerBtn = document.getElementById('registerDropdown');
    if (registerBtn) {
      // クリックイベントのオーバーライド
      registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('新規登録ボタンがクリックされました（直接制御）');
        
        // ドロップダウンメニューを手動で切り替え
        const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="registerDropdown"]');
        if (dropdownMenu) {
          if (dropdownMenu.classList.contains('show')) {
            closeDropdown(dropdownMenu);
          } else {
            // 他の開いているドロップダウンを閉じる
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
              closeDropdown(menu);
            });
            // このドロップダウンを開く
            openDropdown(dropdownMenu, registerBtn);
          }
        }
        
        return false;
      }, true); // キャプチャリングフェーズで実行
    }
    
    // 旅行者として登録ボタン
    const touristRegLink = document.querySelector('a[data-bs-target="#registerTouristModal"]');
    if (touristRegLink) {
      touristRegLink.addEventListener('click', function(e) {
        console.log('旅行者登録リンクがクリックされました（直接制御）');
        
        // 親ドロップダウンを閉じる
        const parentDropdown = e.target.closest('.dropdown-menu');
        if (parentDropdown) {
          closeDropdown(parentDropdown);
        }
        
        // モーダルを手動で開く
        const modalId = this.getAttribute('data-bs-target');
        if (modalId) {
          openModal(modalId.substring(1)); // #を除去
        }
      });
    }
    
    // ガイドとして登録ボタン
    const guideRegLink = document.querySelector('a[data-bs-target="#registerGuideModal"]');
    if (guideRegLink) {
      guideRegLink.addEventListener('click', function(e) {
        console.log('ガイド登録リンクがクリックされました（直接制御）');
        
        // 親ドロップダウンを閉じる
        const parentDropdown = e.target.closest('.dropdown-menu');
        if (parentDropdown) {
          closeDropdown(parentDropdown);
        }
        
        // モーダルを手動で開く
        const modalId = this.getAttribute('data-bs-target');
        if (modalId) {
          openModal(modalId.substring(1)); // #を除去
        }
      });
    }
    
    // ドキュメントのクリックでドロップダウンを閉じる
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          closeDropdown(menu);
        });
      }
    });
  }
  
  /**
   * ドロップダウンを開く
   */
  function openDropdown(dropdownMenu, toggleBtn) {
    dropdownMenu.classList.add('show');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  }
  
  /**
   * ドロップダウンを閉じる
   */
  function closeDropdown(dropdownMenu) {
    dropdownMenu.classList.remove('show');
    const toggleId = dropdownMenu.getAttribute('aria-labelledby');
    if (toggleId) {
      const toggleBtn = document.getElementById(toggleId);
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }
  
  /**
   * モーダルを開く
   */
  function openModal(modalId) {
    try {
      // Bootstrapのモーダル機能を使用
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        // Bootstrapの公式APIがある場合
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        } else {
          // 公式APIがない場合は手動で表示
          modalElement.classList.add('show');
          modalElement.style.display = 'block';
          document.body.classList.add('modal-open');
          
          // 背景オーバーレイの作成
          let backdrop = document.querySelector('.modal-backdrop');
          if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
          }
        }
      }
    } catch (err) {
      console.error('モーダルを開く際にエラーが発生しました:', err);
    }
  }
})();