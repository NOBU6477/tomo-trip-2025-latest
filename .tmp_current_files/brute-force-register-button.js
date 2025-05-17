/**
 * 新規登録ボタン完全強制修正版
 * 徹底的なDOMハイジャックでブートストラップの制約を突破
 */
(function() {
  console.log('新規登録ボタン完全強制修正版を初期化');
  
  // 起動時にすぐ実行
  forceInitRegisterButton();
  
  // DOMロード後にも実行
  document.addEventListener('DOMContentLoaded', forceInitRegisterButton);
  
  // ウィンドウロード後にも実行
  window.addEventListener('load', forceInitRegisterButton);
  
  // 一定間隔で実行して確実に修正
  setTimeout(forceInitRegisterButton, 1000);
  setTimeout(forceInitRegisterButton, 2000);
  
  /**
   * 強制的に登録ボタンを初期化
   */
  function forceInitRegisterButton() {
    // メイン新規登録ボタンを完全に初期化
    initializeMainRegisterButton();
    
    // 子メニュー項目を初期化
    initializeRegisterMenuItems();
    
    // ボディクリックイベントを設定
    setupBodyClickHandler();
  }
  
  /**
   * メイン新規登録ボタンを完全初期化
   */
  function initializeMainRegisterButton() {
    // 元の新規登録ボタンを取得
    const originalButton = document.getElementById('registerDropdown');
    if (!originalButton) return;
    
    console.log('新規登録ボタンを完全初期化します');
    
    // ボタンの属性をコピーして新しいボタンを作成
    const newButton = document.createElement('button');
    newButton.id = 'registerDropdown';
    newButton.className = originalButton.className;
    newButton.setAttribute('aria-expanded', 'false');
    newButton.textContent = originalButton.textContent;
    
    // 元のボタンを置き換え
    originalButton.parentNode.replaceChild(newButton, originalButton);
    
    // ドロップダウンメニューを取得または作成
    let dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="registerDropdown"]');
    
    // 明示的にイベントハンドラを設定
    newButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('新規登録ボタンが強制的にクリックされました');
      
      // すべてのドロップダウンを閉じる
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        if (menu !== dropdownMenu) {
          menu.classList.remove('show');
        }
      });
      
      // ドロップダウンの表示を切り替え
      if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
        this.setAttribute('aria-expanded', dropdownMenu.classList.contains('show') ? 'true' : 'false');
      }
      
      return false;
    };
  }
  
  /**
   * 登録メニュー項目を初期化
   */
  function initializeRegisterMenuItems() {
    // 旅行者として登録
    initializeMenuItem('a[data-bs-target="#registerTouristModal"]', 'registerTouristModal');
    
    // ガイドとして登録
    initializeMenuItem('a[data-bs-target="#registerGuideModal"]', 'registerGuideModal');
  }
  
  /**
   * メニュー項目を初期化
   */
  function initializeMenuItem(selector, modalId) {
    const menuItem = document.querySelector(selector);
    if (!menuItem) return;
    
    // 元のメニュー項目の属性をコピーして新しいものを作成
    const newMenuItem = document.createElement('a');
    newMenuItem.className = menuItem.className;
    newMenuItem.setAttribute('data-bs-target', '#' + modalId);
    newMenuItem.href = '#';
    newMenuItem.textContent = menuItem.textContent;
    
    // 元のメニュー項目を置き換え
    menuItem.parentNode.replaceChild(newMenuItem, menuItem);
    
    // クリックイベントを設定
    newMenuItem.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log(modalId + 'を表示します');
      
      // 親ドロップダウンを閉じる
      const dropdownMenu = document.querySelector('.dropdown-menu.show');
      if (dropdownMenu) {
        dropdownMenu.classList.remove('show');
        
        // 関連するボタンのaria-expandedを更新
        const toggleId = dropdownMenu.getAttribute('aria-labelledby');
        if (toggleId) {
          const toggleButton = document.getElementById(toggleId);
          if (toggleButton) {
            toggleButton.setAttribute('aria-expanded', 'false');
          }
        }
      }
      
      // 対応するモーダルを表示
      showModal(modalId);
      
      return false;
    };
  }
  
  /**
   * ボディクリックハンドラを設定
   */
  function setupBodyClickHandler() {
    document.body.addEventListener('click', function(e) {
      // ドロップダウン内またはドロップダウンボタンのクリックでなければ
      if (!e.target.closest('.dropdown-menu') && !e.target.closest('#registerDropdown')) {
        // すべてのドロップダウンを閉じる
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          menu.classList.remove('show');
          
          // 関連するボタンのaria-expandedを更新
          const toggleId = menu.getAttribute('aria-labelledby');
          if (toggleId) {
            const toggleButton = document.getElementById(toggleId);
            if (toggleButton) {
              toggleButton.setAttribute('aria-expanded', 'false');
            }
          }
        });
      }
    });
  }
  
  /**
   * モーダルを表示
   */
  function showModal(modalId) {
    // モーダル要素を取得
    const modalElement = document.getElementById(modalId);
    if (!modalElement) {
      console.error('モーダル要素が見つかりません:', modalId);
      return;
    }
    
    try {
      // Bootstrapが利用可能な場合
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.show();
      } else {
        // Bootstrapが利用できない場合は手動で表示
        forceShowModal(modalElement);
      }
    } catch (error) {
      console.error('モーダル表示エラー:', error);
      // エラーが発生した場合は手動で表示
      forceShowModal(modalElement);
    }
  }
  
  /**
   * モーダルを強制的に表示
   */
  function forceShowModal(modalElement) {
    console.log('モーダルを強制的に表示します');
    
    // バックドロップを作成
    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
    
    // bodyに必要なクラスを追加
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
    
    // モーダルを表示
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
    modalElement.setAttribute('aria-modal', 'true');
    modalElement.removeAttribute('aria-hidden');
    
    // モーダルの閉じるボタン
    const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(button => {
      button.onclick = function(e) {
        e.preventDefault();
        forceHideModal(modalElement);
        return false;
      };
    });
    
    // モーダル背景のクリックでも閉じられるようにする
    modalElement.onclick = function(e) {
      if (e.target === modalElement) {
        forceHideModal(modalElement);
      }
    };
  }
  
  /**
   * モーダルを強制的に閉じる
   */
  function forceHideModal(modalElement) {
    // モーダルを非表示
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('aria-modal');
    
    // バックドロップを削除
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.parentNode.removeChild(backdrop);
    }
    
    // bodyを元に戻す
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
})();