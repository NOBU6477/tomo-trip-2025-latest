/**
 * 新規登録ドロップダウン最終解決策
 * 問題の根本解決として、HTMLの構造を直接変更
 */
(function() {
  console.log('新規登録ドロップダウン最終解決策を実行します');
  
  // DOMがロードされた時点で実行
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(runFinalFix, 100); // 少し遅延させて他のスクリプトの初期化後に実行
  });
  
  // ページが完全に読み込まれた後にも実行
  window.addEventListener('load', function() {
    setTimeout(runFinalFix, 200);
  });
  
  /**
   * 最終修正を実行
   */
  function runFinalFix() {
    console.log('新規登録ドロップダウン最終修正を実行');
    
    // ステップ1: 既存のBootstrapドロップダウンの属性を削除してプレーンなボタンに変える
    const registerButton = document.getElementById('registerDropdown');
    if (!registerButton) {
      console.error('新規登録ボタンが見つかりません');
      return;
    }
    
    // Bootstrapのイベントリスナーが不要になるよう属性を変更
    registerButton.removeAttribute('data-bs-toggle');
    
    // CSSスタイルを保持したままクラスを変更
    registerButton.className = 'btn btn-light';
    
    // ドロップダウンのアイコンを手動で追加
    if (!registerButton.querySelector('i.bi-chevron-down')) {
      const chevronIcon = document.createElement('i');
      chevronIcon.className = 'bi bi-chevron-down ms-1';
      chevronIcon.style.fontSize = '0.8em';
      registerButton.appendChild(chevronIcon);
    }
    
    // ステップ2: ドロップダウンメニューを取得
    const dropdownMenu = document.querySelector('.dropdown-menu[aria-labelledby="registerDropdown"]');
    if (!dropdownMenu) {
      console.error('ドロップダウンメニューが見つかりません');
      return;
    }
    
    // スタイルを設定
    Object.assign(dropdownMenu.style, {
      position: 'absolute',
      top: '100%',
      right: '0',
      zIndex: '1000',
      display: 'none', // 初期状態は非表示
      minWidth: '10rem',
      padding: '0.5rem 0',
      fontSize: '1rem',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box',
      border: '1px solid rgba(0,0,0,0.15)',
      borderRadius: '0.25rem',
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
    });
    
    // ステップ3: トグルボタンのイベントハンドラを設定
    registerButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('新規登録ボタンがクリックされました（最終解決策）');
      
      // ドロップダウンの表示/非表示を切り替え
      const isVisible = dropdownMenu.style.display === 'block';
      dropdownMenu.style.display = isVisible ? 'none' : 'block';
      
      // アイコンの回転をアニメーション
      const icon = registerButton.querySelector('i.bi-chevron-down');
      if (icon) {
        icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
        icon.style.transition = 'transform 0.2s';
      }
      
      return false;
    };
    
    // ステップ4: ドロップダウン内の項目にイベントハンドラを設定
    setupDropdownItems(dropdownMenu);
    
    // ステップ5: ドキュメント内の別の場所をクリックするとドロップダウンを閉じる
    document.addEventListener('click', function(e) {
      if (!registerButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
        
        // アイコンを元に戻す
        const icon = registerButton.querySelector('i.bi-chevron-down');
        if (icon) {
          icon.style.transform = 'rotate(0deg)';
        }
      }
    });
    
    console.log('新規登録ドロップダウン修正完了');
  }
  
  /**
   * ドロップダウン内の項目にイベントハンドラを設定
   */
  function setupDropdownItems(dropdownMenu) {
    // 旅行者として登録
    const touristItem = dropdownMenu.querySelector('a[data-bs-target="#registerTouristModal"]');
    if (touristItem) {
      touristItem.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('旅行者登録リンクがクリックされました（最終解決策）');
        
        // ドロップダウンを閉じる
        dropdownMenu.style.display = 'none';
        
        // モーダルを開く
        openBootstrapModal('registerTouristModal');
        
        return false;
      };
    }
    
    // ガイドとして登録
    const guideItem = dropdownMenu.querySelector('a[data-bs-target="#registerGuideModal"]');
    if (guideItem) {
      guideItem.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('ガイド登録リンクがクリックされました（最終解決策）');
        
        // ドロップダウンを閉じる
        dropdownMenu.style.display = 'none';
        
        // モーダルを開く
        openBootstrapModal('registerGuideModal');
        
        return false;
      };
    }
  }
  
  /**
   * Bootstrapモーダルを表示する関数
   */
  function openBootstrapModal(modalId) {
    try {
      // モーダル要素を取得
      const modalElement = document.getElementById(modalId);
      if (!modalElement) {
        console.error('モーダル要素が見つかりません:', modalId);
        return;
      }
      
      // Bootstrapが利用可能な場合はAPIを使う
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
      } else {
        // 手動でモーダルを表示
        forceShowModal(modalElement);
      }
    } catch (error) {
      console.error('モーダル表示エラー:', error);
      // エラーが発生した場合は手動で表示
      forceShowModal(document.getElementById(modalId));
    }
  }
  
  /**
   * モーダルを強制的に表示する関数
   */
  function forceShowModal(modalElement) {
    if (!modalElement) return;
    
    console.log('モーダルを強制的に表示します');
    
    // バックドロップを作成・追加
    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
    
    // モーダルを表示
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
    modalElement.setAttribute('aria-modal', 'true');
    modalElement.removeAttribute('aria-hidden');
    
    // bodyにモーダル用のスタイルを適用
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
    
    // モーダルの閉じるボタンにイベントリスナーを設定
    const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(button => {
      button.onclick = function() {
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
   * モーダルを強制的に閉じる関数
   */
  function forceHideModal(modalElement) {
    if (!modalElement) return;
    
    // モーダルを非表示
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('aria-modal');
    
    // バックドロップを削除
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    
    // bodyを元に戻す
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
})();