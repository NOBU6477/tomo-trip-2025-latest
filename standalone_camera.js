/**
 * スタンドアロンカメラ実装（すべての依存関係から独立）
 * 即時実行関数でDOM読み込み完了前でも実行可能
 */
(function() {
  console.log('スタンドアロンカメラを初期化します');
  
  // モーダルが表示されているか定期的にチェック
  const checkInterval = setInterval(checkForCameraModal, 500);
  
  // カメラモーダルを検出してカスタム処理
  function checkForCameraModal() {
    if (!document || !document.body) return;
    
    // カメラモーダルを検索
    const modals = document.querySelectorAll('.modal, [role="dialog"]');
    
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      
      // モーダルにvideoタグがあるか、IDやクラスでカメラモーダルと判断できるか確認
      const hasVideo = modal.querySelector('video') !== null;
      const isCameraModal = modal.id && (
        modal.id.includes('camera') || 
        modal.id.includes('photo') || 
        modal.classList.contains('camera-modal')
      );
      
      if ((hasVideo || isCameraModal) && modal.style.display !== 'none' && !modal.hasAttribute('data-standalone-fixed')) {
        console.log('カメラモーダル検出:', modal.id || 'ID無しモーダル');
        
        // モーダルがすでに表示されている場合
        if (modal.classList.contains('show') || 
            modal.classList.contains('in') || 
            modal.style.display === 'block') {
          fixCameraModal(modal);
        }
        
        // 今後のモーダル表示を監視
        const modalObserver = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
              if (modal.classList.contains('show') || 
                  modal.classList.contains('in') || 
                  modal.style.display === 'block') {
                fixCameraModal(modal);
              }
            }
          });
        });
        
        try {
          modalObserver.observe(modal, {
            attributes: true,
            attributeFilter: ['class', 'style']
          });
        } catch (error) {
          console.error('モーダル監視エラー:', error);
        }
        
        // 処理済みとしてマーク
        modal.setAttribute('data-standalone-fixed', 'true');
      }
    }
  }
  
  // カメラモーダルを修正
  function fixCameraModal(modal) {
    console.log('カメラモーダルを修正:', modal.id || 'ID無しモーダル');
    
    // 撮影ボタンを探す
    const captureButtons = modal.querySelectorAll('button.btn-danger, button:contains("撮影"), a:contains("撮影"), button:has(.fa-camera)');
    
    if (captureButtons.length > 0) {
      console.log(`${captureButtons.length}個の撮影ボタンを検出`);
      
      captureButtons.forEach(function(button, index) {
        if (button.hasAttribute('data-standalone-button-fixed')) return;
        
        console.log(`撮影ボタン ${index + 1} を修正`);
        
        // 新しいボタンを作成
        const newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.className = button.className + ' standalone-capture-btn';
        newButton.innerHTML = '<i class="fas fa-camera"></i> 撮影する';
        newButton.style.cssText = `
          display: block !important;
          background-color: #dc3545 !important;
          color: white !important;
          font-weight: bold !important;
          font-size: 1.2rem !important;
          padding: 12px 30px !important;
          border-radius: 50px !important;
          border: none !important;
          box-shadow: 0 0 20px rgba(220, 53, 69, 0.7) !important;
          margin: 20px auto !important;
          cursor: pointer !important;
          min-width: 180px !important;
          min-height: 50px !important;
          position: relative !important;
          z-index: 9999 !important;
        `;
        
        // クリックイベントを設定
        newButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // ビデオ要素を探す
          const video = modal.querySelector('video');
          if (!video) {
            console.warn('カメラモーダル内にビデオ要素が見つかりません');
            return;
          }
          
          try {
            // キャンバスを作成
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // ビデオからサイズを取得
            canvas.width = video.videoWidth || video.clientWidth || 640;
            canvas.height = video.videoHeight || video.clientHeight || 480;
            
            // ビデオフレームをキャンバスに描画
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // 関連するファイル入力を探す
            let fileInput = findRelatedFileInput(modal);
            
            if (fileInput) {
              // 画像データをBlobに変換
              canvas.toBlob(function(blob) {
                // ファイル名を生成
                const now = new Date();
                const fileName = `capture_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.jpg`;
                
                // FileオブジェクトにBlobをラップ
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                
                // ファイル入力にセット
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                
                // 変更イベント発火
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
                
                // 成功メッセージ
                showMessage('写真を撮影しました');
                
                // モーダルを閉じる
                closeStandaloneModal(modal);
              }, 'image/jpeg', 0.9);
            } else {
              console.error('ファイル入力が見つかりません');
              showMessage('ファイル入力が見つかりません', 'error');
            }
          } catch (error) {
            console.error('カメラキャプチャエラー:', error);
            showMessage('写真の撮影に失敗しました', 'error');
          }
          
          return false;
        });
        
        // ボタンを置き換え
        if (button.parentNode) {
          button.parentNode.replaceChild(newButton, button);
          console.log('撮影ボタンを置き換えました');
        } else {
          // 親要素がない場合はモーダルに追加
          const container = modal.querySelector('.modal-body') || modal.querySelector('.modal-content') || modal;
          container.appendChild(newButton);
          console.log('撮影ボタンを新規追加しました');
        }
        
        // 処理済みとしてマーク
        newButton.setAttribute('data-standalone-button-fixed', 'true');
      });
    } else {
      console.log('撮影ボタンが見つかりません。新しいボタンを追加します');
      
      // モーダル内のビデオ要素を確認
      const video = modal.querySelector('video');
      if (!video) {
        console.warn('カメラモーダル内にビデオ要素が見つかりません');
        return;
      }
      
      // 撮影ボタンを新規作成
      const newButton = document.createElement('button');
      newButton.type = 'button';
      newButton.className = 'btn btn-danger btn-lg rounded-pill standalone-capture-btn';
      newButton.innerHTML = '<i class="fas fa-camera"></i> 撮影する';
      newButton.style.cssText = `
        display: block !important;
        background-color: #dc3545 !important;
        color: white !important;
        font-weight: bold !important;
        font-size: 1.2rem !important;
        padding: 12px 30px !important;
        border-radius: 50px !important;
        border: none !important;
        box-shadow: 0 0 20px rgba(220, 53, 69, 0.7) !important;
        margin: 20px auto !important;
        cursor: pointer !important;
        min-width: 180px !important;
        min-height: 50px !important;
        position: relative !important;
        z-index: 9999 !important;
      `;
      
      // クリックイベントを設定
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        try {
          // キャンバスを作成
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          // ビデオからサイズを取得
          canvas.width = video.videoWidth || video.clientWidth || 640;
          canvas.height = video.videoHeight || video.clientHeight || 480;
          
          // ビデオフレームをキャンバスに描画
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // 関連するファイル入力を探す
          let fileInput = findRelatedFileInput(modal);
          
          if (fileInput) {
            // 画像データをBlobに変換
            canvas.toBlob(function(blob) {
              // ファイル名を生成
              const now = new Date();
              const fileName = `capture_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.jpg`;
              
              // FileオブジェクトにBlobをラップ
              const file = new File([blob], fileName, { type: 'image/jpeg' });
              
              // ファイル入力にセット
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              fileInput.files = dataTransfer.files;
              
              // 変更イベント発火
              const event = new Event('change', { bubbles: true });
              fileInput.dispatchEvent(event);
              
              // 成功メッセージ
              showMessage('写真を撮影しました');
              
              // モーダルを閉じる
              closeStandaloneModal(modal);
            }, 'image/jpeg', 0.9);
          } else {
            console.error('ファイル入力が見つかりません');
            showMessage('ファイル入力が見つかりません', 'error');
          }
        } catch (error) {
          console.error('カメラキャプチャエラー:', error);
          showMessage('写真の撮影に失敗しました', 'error');
        }
        
        return false;
      });
      
      // ボタンを追加
      const container = modal.querySelector('.modal-body') || modal.querySelector('.modal-content') || modal;
      container.appendChild(newButton);
      
      console.log('新しい撮影ボタンを追加しました');
      
      // 処理済みとしてマーク
      newButton.setAttribute('data-standalone-button-fixed', 'true');
    }
  }
  
  // 関連するファイル入力を見つける
  function findRelatedFileInput(modal) {
    // 1. モーダル属性からターゲットを取得
    if (modal.hasAttribute('data-target')) {
      const targetId = modal.getAttribute('data-target');
      const fileInput = document.getElementById(targetId);
      if (fileInput && fileInput.type === 'file') return fileInput;
    }
    
    // 2. モーダルIDからターゲットを推測
    if (modal.id) {
      const modalId = modal.id;
      // 例: camera-modal-profilePhoto -> profilePhoto
      if (modalId.startsWith('camera-modal-')) {
        const targetId = modalId.substring('camera-modal-'.length);
        const fileInput = document.getElementById(targetId);
        if (fileInput && fileInput.type === 'file') return fileInput;
      }
      
      // 他のIDパターン
      const possibleTargetId = modalId
        .replace('camera-modal-', '')
        .replace('camera-', '')
        .replace('-modal', '')
        .replace('Modal', '');
      
      const fileInput = document.getElementById(possibleTargetId);
      if (fileInput && fileInput.type === 'file') return fileInput;
    }
    
    // 3. モーダル内のファイル入力を探す
    const modalFileInputs = modal.querySelectorAll('input[type="file"]');
    if (modalFileInputs.length > 0) return modalFileInputs[0];
    
    // 4. ドキュメント内のすべてのファイル入力から選択
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    return allFileInputs.length > 0 ? allFileInputs[0] : null;
  }
  
  // モーダルを閉じる
  function closeStandaloneModal(modal) {
    try {
      // 1. Bootstrap APIを使用
      if (typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
          return;
        }
      }
      
      // 2. 閉じるボタンをクリック
      const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"], .close');
      if (closeBtn) {
        closeBtn.click();
        return;
      }
      
      // 3. モーダル属性とスタイルを直接変更
      modal.classList.remove('show', 'in');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      
      // バックドロップを削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      
      // bodyのスタイルをリセット
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
  }
  
  // メッセージを表示
  function showMessage(message, type = 'success') {
    // 既存メッセージを削除
    const existingMessage = document.getElementById('standalone-message');
    if (existingMessage) existingMessage.remove();
    
    // 新しいメッセージを作成
    const messageElement = document.createElement('div');
    messageElement.id = 'standalone-message';
    messageElement.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${type === 'error' ? '#f8d7da' : '#d4edda'};
      color: ${type === 'error' ? '#721c24' : '#155724'};
      border: 1px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'};
      border-radius: 6px;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      min-width: 300px;
      text-align: center;
    `;
    
    // メッセージテキスト
    messageElement.textContent = message;
    
    // ドキュメントに追加
    if (document.body) {
      document.body.appendChild(messageElement);
      
      // 数秒後に削除
      setTimeout(function() {
        if (messageElement.parentNode) {
          messageElement.parentNode.removeChild(messageElement);
        }
      }, 3000);
    }
  }
  
  // 実行時にもチェック
  if (document && document.body) {
    checkForCameraModal();
  }
  
  // ドキュメント読み込み完了時
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      checkForCameraModal();
    });
  }
  
  // 15秒後にインターバルをクリア（最初の読み込み時のみ機能すれば良い）
  setTimeout(function() {
    clearInterval(checkInterval);
  }, 15000);
})();