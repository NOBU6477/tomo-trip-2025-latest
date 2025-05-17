// クリーンな修正スクリプト
(function() {
  console.log('クリーンな修正スクリプトを開始します');
  
  // DOMが読み込まれた時に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded: クリーン修正スクリプト');
    setupRegisterButton();
  });
  
  // ウィンドウロード時にも実行（念のため）
  window.addEventListener('load', function() {
    console.log('window.onload: クリーン修正スクリプト');
    setupRegisterButton();
  });
  
  // 新規登録ボタンのセットアップ
  function setupRegisterButton() {
    // 新規登録ボタンを探す（複数のセレクタでカバー）
    const registerButton = document.querySelector('.btn.btn-warning, a.btn-warning, button.btn-warning, a.nav-link.btn-warning');
    
    if (registerButton) {
      console.log('新規登録ボタンを発見しました');
      
      // 既存のイベントをすべて削除するため、ボタンをクローン
      const newButton = registerButton.cloneNode(true);
      if (registerButton.parentNode) {
        registerButton.parentNode.replaceChild(newButton, registerButton);
      }
      
      // 新しいボタンにクリックイベントを追加
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('新規登録ボタンがクリックされました');
        
        // すべてのモーダルを閉じる
        closeAllModals();
        
        // ユーザータイプモーダルを表示
        showModal('userTypeModal');
        
        return false;
      });
    } else {
      console.warn('新規登録ボタンが見つかりません');
      
      // ナビゲーションバーを探す
      const navbar = document.querySelector('.navbar-nav, nav .nav');
      if (navbar) {
        console.log('ナビゲーションバーを発見、新規登録ボタンを作成します');
        
        // 新規登録ボタンを作成
        const registerButton = document.createElement('a');
        registerButton.href = '#';
        registerButton.className = 'btn btn-warning btn-sm ms-2';
        registerButton.textContent = '新規登録';
        
        // クリックイベントを追加
        registerButton.addEventListener('click', function(e) {
          e.preventDefault();
          console.log('新規作成した登録ボタンがクリックされました');
          
          // すべてのモーダルを閉じる
          closeAllModals();
          
          // ユーザータイプモーダルを表示
          showModal('userTypeModal');
          
          return false;
        });
        
        // ナビゲーションバーに追加
        navbar.appendChild(registerButton);
      }
    }
  }
  
  // モーダルを表示する関数
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`モーダル "${modalId}" が見つかりません`);
      return;
    }
    
    console.log(`モーダル "${modalId}" を表示します`);
    
    // 新しいバックドロップを作成
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.style.opacity = '0.25';
    backdrop.style.zIndex = '1040';
    document.body.appendChild(backdrop);
    
    // モーダルを表示
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
    modal.style.zIndex = '1050';
    modal.setAttribute('aria-modal', 'true');
    modal.removeAttribute('aria-hidden');
    
    // bodyスタイルを設定
    document.body.classList.add('modal-open');
    
    // モーダル表示イベントを発火
    setTimeout(function() {
      const event = new Event('shown.bs.modal');
      modal.dispatchEvent(event);
    }, 10);
  }
  
  // すべてのモーダルを閉じる関数
  function closeAllModals() {
    // 表示中のモーダルをすべて閉じる
    document.querySelectorAll('.modal.show').forEach(function(modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    });
    
    // バックドロップを削除
    document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    });
    
    // bodyスタイルをリセット
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
})();
