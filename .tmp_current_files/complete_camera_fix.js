/**
 * カメラ機能のための総合的な修正スクリプト
 * 問題を根本から解決するために全てを上書きします
 */
(function() {
  console.log('総合修正スクリプトを初期化');
  
  // DOMが完全に読み込まれた後に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了、監視を開始');
    setupEventListeners();
  });
  
  // イベントリスナーをセットアップ
  function setupEventListeners() {
    // 1. カメラボタン（「カメラで撮影する」ボタン）をクリックした時
    document.addEventListener('click', function(event) {
      const target = event.target;
      
      // カメラボタンの判定
      if (isCameraButton(target)) {
        console.log('カメラボタンがクリックされました');
        
        // カメラモーダルが表示されるのを待つ
        setTimeout(waitForCameraModal, 300);
      }
      
      // 撮影ボタンの判定
      if (isCaptureButton(target)) {
        console.log('撮影ボタンがクリックされました');
        
        // 少し待ってからUIを更新（撮影確認画面表示）
        setTimeout(function() {
          // 現在のモーダルを取得
          const modal = findVisibleModal();
          if (modal) {
            showConfirmationUI(modal);
          }
        }, 500);
      }
    }, true);
    
    // 2. モーダルが表示された時の監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (isModalElement(node) && isVisible(node)) {
              console.log('新しいモーダルを検出');
              
              // カメラモーダルを処理
              if (isCameraModal(node)) {
                console.log('カメラモーダルを検出');
                enhanceCameraModal(node);
              }
            }
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  /**
   * カメラボタンかどうかを判定
   */
  function isCameraButton(element) {
    const button = element.closest('button');
    if (!button) return false;
    
    return button.textContent && button.textContent.includes('カメラで撮影');
  }
  
  /**
   * 撮影ボタンかどうかを判定
   */
  function isCaptureButton(element) {
    const button = element.closest('button');
    if (!button) return false;
    
    return button.textContent && button.textContent.includes('撮影');
  }
  
  /**
   * モーダル要素かどうかを判定
   */
  function isModalElement(element) {
    return element.nodeType === 1 && 
           element.classList && 
           element.classList.contains('modal');
  }
  
  /**
   * 要素が表示されているかどうかを判定
   */
  function isVisible(element) {
    return element.classList.contains('show') || 
           getComputedStyle(element).display !== 'none';
  }
  
  /**
   * カメラモーダルが表示されるのを待つ
   */
  function waitForCameraModal() {
    const modal = findVisibleModal();
    if (modal && isCameraModal(modal)) {
      console.log('カメラモーダルを発見');
      enhanceCameraModal(modal);
    } else {
      // まだ見つからなければ再試行
      setTimeout(waitForCameraModal, 300);
    }
  }
  
  /**
   * 表示中のモーダルを探す
   */
  function findVisibleModal() {
    const modals = document.querySelectorAll('.modal');
    for (let i = 0; i < modals.length; i++) {
      if (isVisible(modals[i])) {
        return modals[i];
      }
    }
    return null;
  }
  
  /**
   * カメラモーダルかどうかを判定
   */
  function isCameraModal(modal) {
    // タイトルで判定
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || 
                 title.textContent.includes('カメラ') || 
                 title.textContent.includes('撮影'))) {
      return true;
    }
    
    // コンテンツで判定
    return modal.querySelector('video') !== null || 
           modal.innerHTML.includes('カメラ') || 
           modal.innerHTML.includes('撮影');
  }
  
  /**
   * カメラモーダルを拡張
   */
  function enhanceCameraModal(modal) {
    console.log('カメラモーダルを拡張');
    
    // 既に処理済みならスキップ
    if (modal._enhanced) return;
    modal._enhanced = true;
    
    // 必要なUIコンポーネントを追加
    enhanceModalUI(modal);
    
    // 「この写真を使用」ボタンを追加/強化
    ensureUsePhotoButton(modal);
  }
  
  /**
   * モーダルUIを拡張
   */
  function enhanceModalUI(modal) {
    console.log('モーダルUIを拡張');
    
    // モーダルフッターを取得または作成
    let footer = modal.querySelector('.modal-footer');
    if (!footer) {
      footer = document.createElement('div');
      footer.className = 'modal-footer';
      
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.appendChild(footer);
      }
    }
    
    // 「この写真を使用」ボタンを追加
    let useButton = modal.querySelector('.btn-success');
    if (!useButton) {
      useButton = document.createElement('button');
      useButton.type = 'button';
      useButton.className = 'btn btn-success';
      useButton.innerHTML = '<i class="fas fa-check"></i> この写真を使用';
      
      footer.appendChild(useButton);
    }
    
    // 「この写真を使用」ボタンを強化
    useButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      useCurrentPhoto(modal);
      
      return false;
    };
    
    // 初期状態では「この写真を使用」ボタンを非表示
    useButton.style.display = 'none';
  }
  
  /**
   * 「この写真を使用」ボタンを確保
   */
  function ensureUsePhotoButton(modal) {
    // ボタンをすべて取得
    const buttons = modal.querySelectorAll('button');
    
    let useButton = null;
    
    // 既存の「この写真を使用」ボタンを探す
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent && buttons[i].textContent.includes('この写真を使用')) {
        useButton = buttons[i];
        break;
      }
    }
    
    // なければ成功ボタンを探す
    if (!useButton) {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains('btn-success')) {
          useButton = buttons[i];
          break;
        }
      }
    }
    
    // ボタンが見つかった場合、イベントを上書き
    if (useButton) {
      console.log('「この写真を使用」ボタンを強化');
      
      // 古いイベントリスナーを削除
      const newButton = useButton.cloneNode(true);
      useButton.parentNode.replaceChild(newButton, useButton);
      
      // 新しいイベントリスナーを設定
      newButton.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('「この写真を使用」ボタンがクリックされました');
        useCurrentPhoto(modal);
        
        return false;
      };
    }
  }
  
  /**
   * 撮影確認UIを表示
   */
  function showConfirmationUI(modal) {
    console.log('撮影確認UIを表示');
    
    // ビデオ要素を非表示
    const video = modal.querySelector('video');
    if (video) {
      const container = video.parentElement;
      if (container) {
        container.style.display = 'none';
      } else {
        video.style.display = 'none';
      }
    }
    
    // 撮影ボタンを非表示
    const captureButton = findButtonByText(modal, '撮影');
    if (captureButton) {
      captureButton.style.display = 'none';
    }
    
    // 確認文を追加
    let confirmationText = modal.querySelector('h6');
    if (!confirmationText) {
      confirmationText = document.createElement('h6');
      confirmationText.className = 'text-center mt-3';
      confirmationText.textContent = '撮影された写真の確認';
      
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) {
        modalBody.appendChild(confirmationText);
      }
    }
    
    // 「この写真を使用」ボタンを表示
    const useButton = findButtonByText(modal, 'この写真を使用') || 
                     modal.querySelector('.btn-success');
    if (useButton) {
      useButton.style.display = 'inline-block';
    } else {
      // ボタンがなければ作成
      const footer = modal.querySelector('.modal-footer');
      if (footer) {
        const newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.className = 'btn btn-success';
        newButton.textContent = 'この写真を使用';
        
        newButton.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          useCurrentPhoto(modal);
          
          return false;
        };
        
        footer.appendChild(newButton);
      }
    }
  }
  
  /**
   * テキストでボタンを探す
   */
  function findButtonByText(container, text) {
    const buttons = container.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent && buttons[i].textContent.includes(text)) {
        return buttons[i];
      }
    }
    return null;
  }
  
  /**
   * 現在の写真を使用
   */
  function useCurrentPhoto(modal) {
    console.log('現在の写真を使用');
    
    // 画像を探す
    const img = modal.querySelector('img');
    if (!img || !img.src) {
      console.log('画像が見つかりません');
      closeModalSafely(modal);
      return;
    }
    
    // 写真タイプ（表/裏）を判定
    const title = modal.querySelector('.modal-title');
    const isBack = title && title.textContent.includes('裏面');
    const photoType = isBack ? 'back' : 'front';
    
    // 写真データを保存
    const photoData = {
      src: img.src,
      type: photoType
    };
    
    console.log(`写真データを保存: ${photoType}`);
    window._photoData = photoData;
    
    // モーダルを閉じる
    closeModalSafely(modal);
    
    // メインページを更新
    setTimeout(updateMainPage, 300);
  }
  
  /**
   * モーダルを安全に閉じる
   */
  function closeModalSafely(modal) {
    console.log('モーダルを安全に閉じる');
    
    // 1. カメラストリームを停止
    const video = modal.querySelector('video');
    if (video && video.srcObject) {
      try {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      } catch (e) {
        console.error('カメラ停止エラー:', e);
      }
    }
    
    // 2. 閉じるボタンをクリック
    const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
    if (closeBtn) {
      closeBtn.click();
    }
    
    // 3. Bootstrap APIを使用
    try {
      if (typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
        }
      }
    } catch (e) {
      console.error('Bootstrap APIエラー:', e);
    }
    
    // 4. 直接DOM操作
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // 5. 背景削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(function(backdrop) {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    });
  }
  
  /**
   * メインページを更新
   */
  function updateMainPage() {
    console.log('メインページを更新');
    
    // 保存した写真データを取得
    const data = window._photoData;
    if (!data || !data.src) {
      console.log('写真データがありません');
      return;
    }
    
    const imageData = data.src;
    const photoType = data.type;
    
    // 要素IDを決定
    const imgId = photoType === 'back' ? 'back-photo-image' : 'id-photo-image';
    const previewId = photoType === 'back' ? 'back-photo-preview' : 'id-photo-preview';
    const placeholderId = photoType === 'back' ? 'back-photo-placeholder' : 'id-photo-placeholder';
    const inputId = photoType === 'back' ? 'back-photo-input' : 'id-photo-input';
    
    // 画像を更新
    const img = document.getElementById(imgId);
    if (img) {
      img.src = imageData;
      img.style.display = 'block';
      
      const parent = img.parentElement;
      if (parent) {
        parent.style.display = 'block';
        parent.classList.remove('d-none');
      }
    } else {
      console.log('画像要素が見つかりません');
    }
    
    // プレビューコンテナを表示
    const preview = document.getElementById(previewId);
    if (preview) {
      preview.style.display = 'block';
      preview.classList.remove('d-none');
    }
    
    // プレースホルダーを非表示
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.style.display = 'none';
      placeholder.classList.add('d-none');
    }
    
    // ファイル入力を更新
    const input = document.getElementById(inputId);
    if (input && input.type === 'file') {
      updateFileInput(input, imageData);
    }
  }
  
  /**
   * ファイル入力を更新
   */
  function updateFileInput(input, dataURL) {
    try {
      // データURLをBlobに変換
      const blob = dataURLToBlob(dataURL);
      
      // Fileオブジェクトを作成
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // DataTransferオブジェクトを使用
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      
      console.log('ファイル入力を更新しました');
    } catch (e) {
      console.error('ファイル入力更新エラー:', e);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    // データURLの形式をチェック
    const match = dataURL.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      console.error('無効なデータURL形式');
      return new Blob([''], { type: 'image/jpeg' });
    }
    
    const contentType = match[1];
    const base64 = match[2];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    
    return new Blob([array], { type: contentType });
  }
})();