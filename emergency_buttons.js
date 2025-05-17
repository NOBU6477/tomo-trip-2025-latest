/**
 * 撮影ボタンの緊急修正スクリプト
 * まったく新しいボタンを追加して対応
 */
(function() {
  console.log('撮影ボタン緊急修正を初期化');
  
  // モーダル内の撮影ボタンを監視して修正
  function checkAndFixSpecificButtons() {
    // 特定のボタンを探す
    const captureButtons = document.querySelectorAll('button.btn-danger, button.capture-button, button:has(.fa-camera)');
    
    captureButtons.forEach(function(button) {
      // すでに処理済みならスキップ
      if (button.hasAttribute('data-emergency-handled')) return;
      
      // メインボタンテキストが「撮影する」に近いか確認
      const buttonText = button.textContent.trim();
      const isCaptureLike = buttonText.includes('撮影') || buttonText.includes('写真') || buttonText.includes('カメラ');
      
      if (isCaptureLike || button.classList.contains('btn-danger') || button.querySelector('.fa-camera')) {
        console.log('撮影ボタンを検出:', button);
        
        // 新しいボタンで置き換え
        const newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.className = button.className + ' emergency-button';
        newButton.innerHTML = button.innerHTML;
        newButton.style.cssText = button.style.cssText + '; transform: scale(1.1) !important; box-shadow: 0 0 20px rgba(220, 53, 69, 0.7) !important;';
        
        // 新しいクリックハンドラを設定
        newButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          console.log('緊急ボタンがクリックされました');
          
          // 最も近いビデオを探す
          const modal = button.closest('.modal, [role="dialog"]');
          const video = modal ? modal.querySelector('video') : null;
          
          if (video) {
            captureImageDirectly(video, modal);
          } else {
            console.warn('関連するビデオが見つかりません');
          }
          
          return false;
        });
        
        // 処理済みとしてマーク
        newButton.setAttribute('data-emergency-handled', 'true');
        
        // 元のボタンを置き換え
        if (button.parentNode) {
          button.parentNode.replaceChild(newButton, button);
          console.log('撮影ボタンを置き換えました');
        }
      }
    });
    
    // カメラモーダルが表示されていて、撮影ボタンがない場合は追加
    const cameraModals = document.querySelectorAll('.modal:has(video)');
    cameraModals.forEach(function(modal) {
      if (modal.querySelector('[data-emergency-handled]')) return;
      
      const video = modal.querySelector('video');
      if (!video) return;
      
      const existingButton = modal.querySelector('.btn-danger, .capture-button, button:has(.fa-camera)');
      if (existingButton) return;
      
      console.log('カメラモーダルを検出しましたが、撮影ボタンがありません。新しいボタンを追加します');
      
      // ボタンを追加する場所を探す
      const buttonContainer = modal.querySelector('.modal-body') || modal.querySelector('.modal-content');
      if (!buttonContainer) return;
      
      // 新しいボタン要素を作成
      const newButton = document.createElement('button');
      newButton.type = 'button';
      newButton.className = 'btn btn-danger btn-lg rounded-pill emergency-button';
      newButton.innerHTML = '<i class="fas fa-camera"></i> 撮影する';
      newButton.style.cssText = 'position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; padding: 10px 30px;';
      
      // クリックイベントを設定
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        captureImageDirectly(video, modal);
        return false;
      });
      
      // 処理済みとしてマーク
      newButton.setAttribute('data-emergency-handled', 'true');
      
      // コンテナに追加
      buttonContainer.appendChild(newButton);
      console.log('新しい撮影ボタンを追加しました');
    });
  }
  
  /**
   * ビデオから直接画像をキャプチャする
   */
  function captureImageDirectly(video, modal) {
    try {
      console.log('ビデオからキャプチャを実行します');
      
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      
      // ビデオのサイズを取得
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      } else {
        // サイズが取得できない場合はエレメントサイズを使用
        canvas.width = video.clientWidth || 640;
        canvas.height = video.clientHeight || 480;
      }
      
      // ビデオフレームをキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像データを取得
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // 関連するファイル入力を探す
      const fileInput = findNearestFileInput(modal);
      
      if (fileInput) {
        // Blobを作成
        canvas.toBlob(function(blob) {
          // ファイル名を生成
          const now = new Date();
          const fileName = `photo_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.jpg`;
          
          // Fileオブジェクトを作成
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          
          // ファイル入力に設定
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          console.log('キャプチャ画像を設定しました:', fileInput.id);
          
          // モーダルを閉じる
          closeModal(modal);
          
          // 成功メッセージ
          showMessage('写真を撮影しました！', 'success');
          
        }, 'image/jpeg', 0.9);
      } else {
        console.error('関連するファイル入力が見つかりません');
        showMessage('写真の適用先が見つかりませんでした', 'warning');
      }
      
    } catch (error) {
      console.error('カメラキャプチャエラー:', error);
      showMessage('写真の撮影に失敗しました', 'danger');
    }
  }
  
  /**
   * 最も近いファイル入力要素を探す
   */
  function findNearestFileInput(modal) {
    // カメラモーダルに関連付けられたファイル入力を探す
    if (!modal) return null;
    
    // 1. data-target 属性をチェック
    if (modal.hasAttribute('data-target')) {
      const targetId = modal.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input && input.type === 'file') return input;
    }
    
    // 2. モーダル内のファイル入力を探す
    const modalFileInputs = modal.querySelectorAll('input[type="file"]');
    if (modalFileInputs.length > 0) {
      return modalFileInputs[0];
    }
    
    // 3. 表示中のモーダルのIDから関連するファイル入力を推測
    const modalId = modal.id;
    if (modalId) {
      // 例: camera-modal-profile-photo → profile-photo-input
      const possibleInputId = modalId.replace('camera-modal-', '') + '-input';
      const input = document.getElementById(possibleInputId);
      if (input && input.type === 'file') return input;
      
      // 別の命名パターンを試す
      const parts = modalId.split('-');
      if (parts.length >= 2) {
        const baseName = parts[parts.length - 1];
        const baseInput = document.getElementById(baseName);
        if (baseInput && baseInput.type === 'file') return baseInput;
      }
    }
    
    // 4. ドキュメント内のすべてのファイル入力をチェック
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    if (allFileInputs.length > 0) {
      return allFileInputs[0]; // 最初のファイル入力を使用
    }
    
    return null;
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    if (!modal) return;
    
    try {
      // 方法1: Bootstrap 5のAPIを使用
      if (typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
          return;
        }
      }
      
      // 方法2: 閉じるボタンをクリック
      const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"], .close');
      if (closeBtn) {
        closeBtn.click();
        return;
      }
      
      // 方法3: モーダルクラスとスタイルを変更
      modal.classList.remove('show');
      modal.style.display = 'none';
      
      // バックドロップも削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
      
      // bodyのスタイルを戻す
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
  }
  
  /**
   * メッセージを表示
   */
  function showMessage(message, type) {
    // 既存のメッセージを削除
    const existing = document.getElementById('emergency-message');
    if (existing) existing.remove();
    
    // アラート要素を作成
    const alert = document.createElement('div');
    alert.id = 'emergency-message';
    alert.className = `alert alert-${type || 'info'} alert-dismissible fade show fixed-top mx-auto mt-3`;
    alert.style.cssText = 'width: 80%; max-width: 500px; z-index: 9999; box-shadow: 0 4px 15px rgba(0,0,0,0.2);';
    
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // bodyに追加
    document.body.appendChild(alert);
    
    // 5秒後に自動的に閉じる
    setTimeout(function() {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  }
  
  // 初期化時とDOM変更時にチェック
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndFixSpecificButtons);
  } else {
    checkAndFixSpecificButtons();
  }
  
  // モーダルが表示された時にチェック
  document.body.addEventListener('shown.bs.modal', function() {
    setTimeout(checkAndFixSpecificButtons, 100);
  });
  
  // DOM変更を監視
  const observer = new MutationObserver(function(mutations) {
    let shouldCheck = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length || 
          (mutation.type === 'attributes' && 
           (mutation.attributeName === 'class' || mutation.attributeName === 'style'))) {
        shouldCheck = true;
      }
    });
    
    if (shouldCheck) {
      checkAndFixSpecificButtons();
    }
  });
  
  // document.bodyが存在する場合のみ監視を開始
  if (document && document.body) {
    try {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
      console.log('緊急ボタン修正: オブザーバー設定完了');
    } catch (error) {
      console.error('緊急ボタン修正: オブザーバー設定エラー:', error);
    }
  } else {
    console.warn('緊急ボタン修正: document.bodyがまだ利用できません');
    // 一定時間後に再実行
    setTimeout(function() {
      if (document && document.body) {
        try {
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
          });
          console.log('緊急ボタン修正: 遅延オブザーバー設定完了');
        } catch (error) {
          console.error('緊急ボタン修正: 遅延オブザーバー設定エラー:', error);
        }
      }
    }, 500);
  }
  
  // 定期的にチェック
  setInterval(checkAndFixSpecificButtons, 1000);
})();