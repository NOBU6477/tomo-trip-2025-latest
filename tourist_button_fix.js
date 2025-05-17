// 観光客ボタンのみを修正するスクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('観光客ボタン専用修正スクリプトを実行');
  
  // 観光客モーダルが表示された時にボタンをセットアップする
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'touristRegisterModal') {
      console.log('観光客登録モーダルが表示されました');
      setupTouristButton();
    }
  });
  
  // ボタンのセットアップ
  function setupTouristButton() {
    const touristBtn = document.getElementById('tourist-upload-id');
    if (touristBtn) {
      console.log('観光客アップロードボタンを発見');
      
      // 既存のイベントをクリア
      const newBtn = touristBtn.cloneNode(true);
      if (touristBtn.parentNode) {
        touristBtn.parentNode.replaceChild(newBtn, touristBtn);
      }
      
      // 新しいイベントを設定
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('観光客アップロードボタンがクリックされました');
        
        // モーダル表示処理
        showIdDocumentModal();
        
        return false;
      });
    }
  }
  
  // 観光客用ドキュメントモーダルを表示する関数
  function showIdDocumentModal() {
    console.log('観光客用にモーダル表示');
    
    // Bootstrap APIを直接使用してモーダルを処理
    const touristModal = bootstrap.Modal.getInstance(document.getElementById('touristRegisterModal'));
    if (touristModal) {
      touristModal.hide();
    }
    
    // 少し待ってからモーダルを表示（Bootstrapトランジション待機）
    setTimeout(function() {
      // 観光客登録モーダルを直接表示（IDドキュメントをスキップ）
      const registerTouristModal = new bootstrap.Modal(document.getElementById('touristRegisterModal'));
      registerTouristModal.show();
      
      console.log('観光客登録モーダルを再表示しました');
    }, 300);
  }
  
  // ページ読み込み時に一度実行
  setupTouristButton();
});

// ページが完全に読み込まれた時に実行
window.addEventListener('load', function() {
  console.log('ウィンドウロード時に観光客ボタン修正を実行');
  
  // 観光客ボタンを探す
  const touristBtn = document.getElementById('tourist-upload-id');
  if (touristBtn) {
    console.log('観光客アップロードボタンを発見（ウィンドウロード時）');
    
    // 既存のイベントをクリア
    const newBtn = touristBtn.cloneNode(true);
    if (touristBtn.parentNode) {
      touristBtn.parentNode.replaceChild(newBtn, touristBtn);
    }
    
    // 直接イベントを設定
    newBtn.onclick = function(e) {
      e.preventDefault();
      console.log('観光客アップロードボタンがクリックされました（ウィンドウロード時）');
      
      // 現在のモーダルを閉じる
      document.querySelectorAll('.modal.show').forEach(function(modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      });
      
      // バックドロップをクリア
      document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      });
      
      // 観光客登録モーダルを直接表示
      setTimeout(function() {
        const registerTouristModal = document.getElementById('touristRegisterModal');
        if (registerTouristModal) {
          const bsModal = new bootstrap.Modal(registerTouristModal);
          bsModal.show();
          console.log('観光客登録モーダルを直接表示');
        } else {
          console.error('観光客登録モーダルが見つかりません');
        }
      }, 300);
      
      return false;
    };
  }
});
