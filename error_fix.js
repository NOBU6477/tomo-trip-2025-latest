// ページ読み込み完了後に実行
window.addEventListener('load', function() {
  // URLパラメータのチェック
  const params = new URLSearchParams(window.location.search);
  if (params.get('showIdModal') === 'true') {
    console.log('URLパラメータからのモーダル表示処理');
    // URLを綺麗に
    history.replaceState({}, document.title, '/');
    
    // モーダル切り替え
    setTimeout(function() {
      // 他のすべてのモーダルを閉じる
      document.querySelectorAll('.modal.show').forEach(function(modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      });
      
      // バックドロップをクリア
      document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      });
      
      // 新しいバックドロップを作成
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.style.opacity = '0.25';
      document.body.appendChild(backdrop);
      
      // 身分証明書モーダルを表示
      const idModal = document.getElementById('idDocumentModal');
      if (idModal) {
        // 透明度調整
        idModal.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
        
        // ユーザータイプを設定
        let typeField = idModal.querySelector('input[name="user-type"]');
        if (!typeField) {
          typeField = document.createElement('input');
          typeField.type = 'hidden';
          typeField.name = 'user-type';
          typeField.value = params.get('userType') || 'tourist';
          idModal.querySelector('form').appendChild(typeField);
        } else {
          typeField.value = params.get('userType') || 'tourist';
        }
        
        // モーダルを表示
        idModal.classList.add('show');
        idModal.style.display = 'block';
        idModal.setAttribute('aria-modal', 'true');
        idModal.removeAttribute('aria-hidden');
        
        // bodyスタイルを設定
        document.body.classList.add('modal-open');
        
        console.log('URLパラメータから身分証明書モーダルを表示しました');
      }
    }, 300);
  }
  
  // 観光客ボタンの設定
  const touristBtn = document.getElementById('tourist-upload-id');
  if (touristBtn) {
    // クローンして既存のイベントをクリア
    const newBtn = touristBtn.cloneNode(true);
    touristBtn.parentNode.replaceChild(newBtn, touristBtn);
    
    // 直接イベントを設定
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('観光客ボタンクリック - エラー修正');
      
      // トップページに戻ってモーダルを表示
      window.location.href = '/?showIdModal=true&userType=tourist';
      
      return false;
    });
  }
});
