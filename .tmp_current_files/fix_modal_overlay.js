// モーダルの表示問題を修正するスクリプト
document.addEventListener('DOMContentLoaded', function() {
  console.log('モーダルオーバーレイ修正スクリプトを実行');
  
  // モーダル表示時の処理
  document.addEventListener('show.bs.modal', function (event) {
    console.log('モーダル表示イベント:', event.target.id);
    
    // 既存のバックドロップを確認
    const existingBackdrops = document.querySelectorAll('.modal-backdrop');
    
    // 重複するバックドロップを削除
    if (existingBackdrops.length > 1) {
      console.log('重複するバックドロップを削除します');
      for (let i = 1; i < existingBackdrops.length; i++) {
        existingBackdrops[i].remove();
      }
    }
    
    // モーダルのz-indexを調整
    const modal = event.target;
    modal.style.zIndex = '1051';
    
    // 直接スタイルを適用
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    
    // モーダルの内容部分にもスタイルを強制適用
    const modalDialog = modal.querySelector('.modal-dialog');
    if (modalDialog) {
      modalDialog.style.zIndex = '1052';
      modalDialog.style.margin = '1.75rem auto';
      
      const modalContent = modalDialog.querySelector('.modal-content');
      if (modalContent) {
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.border = '1px solid rgba(0, 0, 0, 0.2)';
        modalContent.style.borderRadius = '0.3rem';
        modalContent.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.5)';
      }
    }
    
    // bodyにクラスを設定
    document.body.classList.add('modal-open');
  });
  
  // モーダル非表示時の処理
  document.addEventListener('hidden.bs.modal', function (event) {
    console.log('モーダル非表示イベント:', event.target.id);
    
    // ほかのモーダルが表示されているか確認
    const visibleModals = document.querySelectorAll('.modal.show');
    if (visibleModals.length === 0) {
      // 表示中のモーダルがない場合のみbodyクラスを削除
      document.body.classList.remove('modal-open');
    }
  });
  
  // 観光客ボタンの修正（直接モーダル制御）
  function fixTouristButton() {
    const touristBtn = document.getElementById('tourist-upload-id');
    if (touristBtn) {
      console.log('観光客ボタンを修正（モーダル制御）');
      
      touristBtn.onclick = function(e) {
        e.preventDefault();
        console.log('観光客ボタンクリック - モーダル制御');
        
        // 観光客登録モーダルを閉じる
        const touristRegModal = document.getElementById('touristRegisterModal');
        if (touristRegModal) {
          const bsModal = bootstrap.Modal.getInstance(touristRegModal);
          if (bsModal) {
            bsModal.hide();
            console.log('観光客登録モーダルを閉じました');
            
            // モーダルが閉じ終わるのを待ってから次のモーダルを表示
            setTimeout(function() {
              // 身分証明書モーダルを表示
              const idDocModal = document.getElementById('idDocumentModal');
              if (idDocModal) {
                // ユーザータイプ設定
                let typeField = idDocModal.querySelector('input[name="user-type"]');
                if (!typeField) {
                  typeField = document.createElement('input');
                  typeField.type = 'hidden';
                  typeField.name = 'user-type';
                  idDocModal.querySelector('form').appendChild(typeField);
                }
                typeField.value = 'tourist';
                
                // 全てのバックドロップを削除
                document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
                  backdrop.remove();
                });
                
                // 新しいモーダルを表示
                const newModal = new bootstrap.Modal(idDocModal, {
                  backdrop: true,
                  keyboard: true,
                  focus: true
                });
                
                newModal.show();
                console.log('身分証明書モーダルを表示しました');
              }
            }, 500);
          } else {
            console.warn('観光客登録モーダルのインスタンスが見つかりません');
            openIdDocumentModal('tourist');
          }
        } else {
          console.warn('観光客登録モーダルが見つかりません');
          openIdDocumentModal('tourist');
        }
        
        return false;
      };
    }
  }
  
  // 直接身分証明書モーダルを開く関数
  function openIdDocumentModal(userType) {
    const idDocModal = document.getElementById('idDocumentModal');
    if (idDocModal) {
      // ユーザータイプ設定
      let typeField = idDocModal.querySelector('input[name="user-type"]');
      if (!typeField) {
        typeField = document.createElement('input');
        typeField.type = 'hidden';
        typeField.name = 'user-type';
        idDocModal.querySelector('form').appendChild(typeField);
      }
      typeField.value = userType || 'tourist';
      
      // 既存のバックドロップを削除
      document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
        backdrop.remove();
      });
      
      // モーダルを表示
      setTimeout(function() {
        const newModal = new bootstrap.Modal(idDocModal, {
          backdrop: true,
          keyboard: true,
          focus: true
        });
        newModal.show();
      }, 100);
    }
  }
  
  // 初期化実行
  fixTouristButton();
  
  // モーダル表示時にボタンを再設定
  document.addEventListener('shown.bs.modal', function(e) {
    if (e.target.id === 'touristRegisterModal') {
      setTimeout(fixTouristButton, 100);
    }
  });
});

// 即時実行関数でページが既に読み込まれている場合に対応
(function() {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // 観光客ボタン修正（直接版）
    const touristBtn = document.getElementById('tourist-upload-id');
    if (touristBtn) {
      console.log('即時実行: 観光客ボタン修正（モーダル制御）');
      
      // クリックイベントをインラインで設定
      touristBtn.onclick = function(e) {
        e.preventDefault();
        
        // 現在のモーダルを閉じる
        bootstrap.Modal.getInstance(document.getElementById('touristRegisterModal'))?.hide();
        
        // 全てのバックドロップを削除
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        
        // bodyの状態をリセット
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // 少し待ってから新しいモーダルを表示
        setTimeout(function() {
          const idDocModal = document.getElementById('idDocumentModal');
          if (idDocModal) {
            // ユーザータイプ設定
            let typeField = idDocModal.querySelector('input[name="user-type"]');
            if (!typeField) {
              typeField = document.createElement('input');
              typeField.type = 'hidden';
              typeField.name = 'user-type';
              idDocModal.querySelector('form').appendChild(typeField);
            }
            typeField.value = 'tourist';
            
            // モーダルを表示
            const newModal = new bootstrap.Modal(idDocModal);
            newModal.show();
          }
        }, 500);
        
        return false;
      };
    }
  }
})();
