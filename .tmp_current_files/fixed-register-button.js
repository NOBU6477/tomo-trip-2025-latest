/**
 * 新規登録ボタン完全修正版
 * Bootstrap依存せず確実に動作する実装
 */
(function() {
  console.log('新規登録ボタン完全修正版を初期化');
  
  // 即時実行
  setupRegisterButton();
  
  // DOM読み込み後にも実行
  document.addEventListener('DOMContentLoaded', function() {
    setupRegisterButton();
  });
  
  /**
   * 新規登録ボタンを正しく設定する
   */
  function setupRegisterButton() {
    // メイン新規登録ボタン
    const registerButton = document.getElementById('registerDropdown');
    if (registerButton) {
      // 既存のイベントリスナーを無効化
      const newButton = registerButton.cloneNode(true);
      registerButton.parentNode.replaceChild(newButton, registerButton);
      
      // 新しいイベントリスナーを設定
      newButton.addEventListener('click', function(e) {
        console.log('新規登録ボタンがクリックされました（完全修正版）');
        e.preventDefault();
        e.stopPropagation();
        
        const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="registerDropdown"]');
        if (dropdownMenu) {
          toggleDropdown(dropdownMenu, newButton);
        }
        
        return false;
      });
    }
    
    // 旅行者として登録ボタン
    setupModalButton('a[data-bs-target="#registerTouristModal"]', '旅行者登録', 'registerTouristModal');
    
    // ガイドとして登録ボタン
    setupModalButton('a[data-bs-target="#registerGuideModal"]', 'ガイド登録', 'registerGuideModal');
    
    // ドキュメントクリックでドロップダウンを閉じる
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        closeAllDropdowns();
      }
    });
  }
  
  /**
   * モーダルボタンを設定する
   */
  function setupModalButton(selector, logName, modalId) {
    const button = document.querySelector(selector);
    if (button) {
      // 既存のイベントリスナーを無効化
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // 新しいイベントリスナーを設定
      newButton.addEventListener('click', function(e) {
        console.log(logName + 'ボタンがクリックされました（完全修正版）');
        e.preventDefault();
        e.stopPropagation();
        
        // ドロップダウンを閉じる
        closeAllDropdowns();
        
        // モーダルを開く
        openBootstrapModal(modalId);
        
        return false;
      });
    }
  }
  
  /**
   * ドロップダウンの表示を切り替え
   */
  function toggleDropdown(dropdown, toggleButton) {
    if (dropdown.classList.contains('show')) {
      closeDropdown(dropdown, toggleButton);
    } else {
      // 他のドロップダウンをすべて閉じる
      closeAllDropdowns();
      // このドロップダウンを開く
      openDropdown(dropdown, toggleButton);
    }
  }
  
  /**
   * ドロップダウンを開く
   */
  function openDropdown(dropdown, toggleButton) {
    dropdown.classList.add('show');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', 'true');
    }
  }
  
  /**
   * ドロップダウンを閉じる
   */
  function closeDropdown(dropdown, toggleButton) {
    dropdown.classList.remove('show');
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', 'false');
    }
  }
  
  /**
   * すべてのドロップダウンを閉じる
   */
  function closeAllDropdowns() {
    const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
    openDropdowns.forEach(dropdown => {
      const toggleId = dropdown.getAttribute('aria-labelledby');
      const toggleButton = document.getElementById(toggleId);
      closeDropdown(dropdown, toggleButton);
    });
  }
  
  /**
   * Bootstrapモーダルを開く
   */
  function openBootstrapModal(modalId) {
    try {
      // モーダル要素を取得
      const modalElement = document.getElementById(modalId);
      if (!modalElement) {
        console.error('モーダル要素が見つかりません:', modalId);
        return;
      }
      
      // Bootstrap 5のモーダルを開く
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        // Bootstrap 5 API
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      } else {
        // Bootstrap APIが使えない場合は手動で開く
        console.log('Bootstrap APIが見つからないため手動でモーダルを開きます');
        
        // バックドロップを作成・追加
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
        
        // モーダルを表示
        modalElement.style.display = 'block';
        modalElement.classList.add('show');
        modalElement.setAttribute('aria-modal', 'true');
        modalElement.removeAttribute('aria-hidden');
        
        // bodyにスタイルを適用
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '15px';
        
        // モーダルの閉じるボタンにイベントリスナーを追加
        const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
        closeButtons.forEach(button => {
          button.addEventListener('click', function() {
            closeBootstrapModal(modalElement);
          });
        });
      }
    } catch (error) {
      console.error('モーダルを開く際にエラーが発生しました:', error);
    }
  }
  
  /**
   * Bootstrapモーダルを閉じる
   */
  function closeBootstrapModal(modalElement) {
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
    
    // bodyのスタイルを元に戻す
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
})();