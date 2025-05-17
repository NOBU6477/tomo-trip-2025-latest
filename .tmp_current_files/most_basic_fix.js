// 観光客の身分証明書モーダルを直接DOM操作で表示する最も基本的な修正
document.addEventListener('DOMContentLoaded', function() {
  try {
    // 観光客ボタンにイベントを設定
    const touristBtn = document.getElementById('tourist-upload-id');
    if (touristBtn) {
      console.log('観光客ボタンを見つけました（ハードコード修正）');
      
      // 既存のイベントを削除（クローンして置き換え）
      const newBtn = touristBtn.cloneNode(true);
      if (touristBtn.parentNode) {
        touristBtn.parentNode.replaceChild(newBtn, touristBtn);
      }
      
      // 新しいボタンにイベントを追加
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('観光客ボタンをクリックしました（ハードコード修正）');
        
        try {
          // 現在のモーダルを閉じる
          const currentModal = document.getElementById('touristRegisterModal');
          if (currentModal) {
            currentModal.classList.remove('show');
            currentModal.style.display = 'none';
            currentModal.setAttribute('aria-hidden', 'true');
            currentModal.removeAttribute('aria-modal');
          }
          
          // すべてのバックドロップを削除
          const backdrops = document.querySelectorAll('.modal-backdrop');
          if (backdrops.length > 0) {
            backdrops.forEach(function(backdrop) {
              if (backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
              }
            });
          }
          
          // bodyスタイルをリセット
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          
          // 少し待ってから新しいモーダルを表示
          setTimeout(function() {
            try {
              // 新しいバックドロップを作成
              const backdrop = document.createElement('div');
              backdrop.className = 'modal-backdrop fade show';
              backdrop.style.opacity = '0.25';
              backdrop.style.zIndex = '1040';
              document.body.appendChild(backdrop);
              
              // 身分証明書モーダルを表示
              const idModal = document.getElementById('idDocumentModal');
              if (idModal) {
                // ユーザータイプを設定
                let typeField = idModal.querySelector('input[name="user-type"]');
                if (!typeField) {
                  typeField = document.createElement('input');
                  typeField.type = 'hidden';
                  typeField.name = 'user-type';
                  typeField.value = 'tourist';
                  const form = idModal.querySelector('form');
                  if (form) {
                    form.appendChild(typeField);
                  }
                } else {
                  typeField.value = 'tourist';
                }
                
                // モーダルスタイルを設定
                idModal.classList.add('show');
                idModal.style.display = 'block';
                idModal.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                idModal.style.paddingRight = '15px';
                idModal.setAttribute('aria-modal', 'true');
                idModal.removeAttribute('aria-hidden');
                
                // bodyスタイルを設定
                document.body.classList.add('modal-open');
                
                console.log('身分証明書モーダルを表示しました（ハードコード修正）');
              } else {
                console.error('身分証明書モーダルが見つかりません');
              }
            } catch (modalError) {
              console.error('モーダル表示中にエラーが発生しました:', modalError);
            }
          }, 300);
        } catch (err) {
          console.error('ボタンクリック処理中にエラーが発生しました:', err);
        }
        
        return false;
      });
    }
  } catch (e) {
    console.error('ハードコード修正中にエラーが発生しました:', e);
  }
});
