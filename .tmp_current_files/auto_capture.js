/**
 * 完全自動撮影スクリプト
 * カメラモーダルが開いたら自動的に撮影して確認画面に進む
 */
(function() {
  console.log('[自動撮影] スクリプトを初期化');

  // モーダルを監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === 1 && node.classList && node.classList.contains('modal')) {
            handleModalAdded(node);
          }
        }
      }
    });
  });

  // ボディ要素を監視開始
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // イベントリスナーを追加
  document.addEventListener('click', function(event) {
    if (event.target && (
        event.target.textContent.includes('カメラで撮影') ||
        (event.target.parentElement && event.target.parentElement.textContent.includes('カメラで撮影'))
    )) {
      console.log('[自動撮影] カメラボタンがクリックされました');
      setTimeout(checkForCameraModal, 500);
    }
  }, true);

  /**
   * カメラモーダルを探す
   */
  function checkForCameraModal() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      if (isCameraModal(modal)) {
        console.log('[自動撮影] カメラモーダルを発見');
        handleCameraModal(modal);
      }
    });

    // まだ見つからない場合は少し待って再試行
    setTimeout(function() {
      const moreModals = document.querySelectorAll('.modal.show');
      moreModals.forEach(function(modal) {
        if (isCameraModal(modal) && !modal.dataset.autoHandled) {
          console.log('[自動撮影] 遅延検出したカメラモーダルを処理');
          handleCameraModal(modal);
        }
      });
    }, 1000);
  }

  /**
   * 新しく追加されたモーダルを処理
   */
  function handleModalAdded(modal) {
    if (modal.classList.contains('show') || getComputedStyle(modal).display !== 'none') {
      if (isCameraModal(modal) && !modal.dataset.autoHandled) {
        console.log('[自動撮影] 新しく追加されたカメラモーダルを処理');
        setTimeout(function() {
          handleCameraModal(modal);
        }, 500);
      }
    } else {
      // モーダルが表示されるのを待つ
      const checkVisibility = setInterval(function() {
        if (modal.classList.contains('show') || getComputedStyle(modal).display !== 'none') {
          clearInterval(checkVisibility);
          if (isCameraModal(modal) && !modal.dataset.autoHandled) {
            console.log('[自動撮影] 表示されたカメラモーダルを処理');
            handleCameraModal(modal);
          }
        }
      }, 100);

      // 最大5秒待機
      setTimeout(function() {
        clearInterval(checkVisibility);
      }, 5000);
    }
  }

  /**
   * カメラモーダルかどうかを判定
   */
  function isCameraModal(modal) {
    // タイトルでチェック
    const title = modal.querySelector('.modal-title');
    if (title && (title.textContent.includes('写真') || 
                 title.textContent.includes('カメラ') || 
                 title.textContent.includes('撮影'))) {
      return true;
    }

    // 内容でチェック
    return modal.querySelector('video') !== null || 
           modal.innerHTML.includes('カメラ') || 
           modal.innerHTML.includes('撮影');
  }

  /**
   * カメラモーダルを処理
   */
  function handleCameraModal(modal) {
    // 既に処理済みならスキップ
    if (modal.dataset.autoHandled) return;
    modal.dataset.autoHandled = 'true';

    console.log('[自動撮影] カメラモーダルを処理中');

    // カメラの準備とビデオのロードを待つ
    setupCamera(modal);
  }

  /**
   * カメラのセットアップ
   */
  function setupCamera(modal) {
    // ビデオ要素を取得
    let video = modal.querySelector('video');
    
    // ビデオ要素がなければ、おそらくまだロードされていないので作成する
    if (!video) {
      // 代替案: 既存の撮影ボタンをクリック
      const captureBtn = modal.querySelector('button:not(.btn-close):not([data-bs-dismiss="modal"])');
      if (captureBtn && (captureBtn.textContent.includes('撮影') || captureBtn.className.includes('capture'))) {
        console.log('[自動撮影] 撮影ボタンをクリック');
        captureBtn.click();
        
        // クリック後に確認画面が表示されるのを待つ
        setTimeout(function() {
          const confirmBtn = modal.querySelector('button.btn-success') || 
                            modal.querySelector('button:contains("この写真を使用")');
          if (confirmBtn) {
            console.log('[自動撮影] 写真確認画面を検出、写真を使用ボタンを設定');
            confirmBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              usePhoto(modal);
              return false;
            }, true);
          }
        }, 1000);
        return;
      }
      
      console.log('[自動撮影] ビデオ要素が見つからないため作成');
      const videoContainer = modal.querySelector('.video-container') || modal.querySelector('.modal-body');
      if (videoContainer) {
        video = document.createElement('video');
        video.className = 'w-100';
        video.autoplay = true;
        video.playsInline = true;
        videoContainer.appendChild(video);
      } else {
        console.error('[自動撮影] ビデオコンテナが見つかりません');
        return;
      }
    }
    
    // カメラを開始
    startCamera(video)
      .then(function() {
        console.log('[自動撮影] カメラの起動に成功、1秒後に自動撮影');
        // カメラが起動したら1秒後に自動撮影
        setTimeout(function() {
          captureAndShow(modal, video);
        }, 1000);
      })
      .catch(function(error) {
        console.error('[自動撮影] カメラの起動に失敗:', error);
        // カメラが起動できなくても撮影ボタンで代用
        forceCapture(modal);
      });
  }
  
  /**
   * カメラを起動
   */
  function startCamera(video) {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false 
      })
      .then(function(stream) {
        video.srcObject = stream;
        video.onloadedmetadata = function() {
          video.play().then(resolve).catch(reject);
        };
      })
      .catch(reject);
    });
  }
  
  /**
   * 強制的に撮影を実行
   */
  function forceCapture(modal) {
    console.log('[自動撮影] 強制撮影を実行');
    
    // 撮影ボタンを探して強制的にクリック
    const captureBtn = modal.querySelector('button:contains("撮影")');
    if (captureBtn) {
      captureBtn.click();
      
      // 「この写真を使用」ボタンのクリックをオーバーライド
      setTimeout(function() {
        const usePhotoBtn = modal.querySelector('button:contains("この写真を使用")');
        if (usePhotoBtn) {
          usePhotoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            usePhoto(modal);
            return false;
          }, true);
        }
      }, 1000);
    } else {
      // 代替案：擬似的な撮影とプレビュー表示
      makeDummyCapture(modal);
    }
  }
  
  /**
   * 撮影してプレビュー表示
   */
  function captureAndShow(modal, video) {
    try {
      console.log('[自動撮影] 写真を撮影');
      
      // ビデオがロードされているか確認
      if (!video || !video.videoWidth) {
        console.log('[自動撮影] ビデオが準備できていない、強制撮影に切り替え');
        forceCapture(modal);
        return;
      }
      
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // ビデオフレームを描画
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // データURLを取得
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      
      // プレビュー表示を更新
      showPreview(modal, imageData);
      
      // ボタンを設定
      setupButtons(modal);
    } catch (error) {
      console.error('[自動撮影] 撮影エラー:', error);
      forceCapture(modal);
    }
  }
  
  /**
   * ダミー撮影と表示
   */
  function makeDummyCapture(modal) {
    console.log('[自動撮影] ダミー撮影を実行');
    
    // キャンバスを作成
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    
    // 単色で描画
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // テキストを描画
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('カメラが使用できません', canvas.width / 2, canvas.height / 2);
    
    // データURLを取得
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // プレビュー表示を更新
    showPreview(modal, imageData);
    
    // ボタンを設定
    setupButtons(modal);
  }
  
  /**
   * プレビュー表示を更新
   */
  function showPreview(modal, imageData) {
    console.log('[自動撮影] プレビュー表示を更新');
    
    try {
      // ビデオコンテナを非表示
      const videoContainer = modal.querySelector('#video-container, .video-container');
      if (videoContainer) {
        videoContainer.style.display = 'none';
        videoContainer.classList.add('d-none');
      }
      
      // 撮影ボタンを非表示
      const captureBtn = modal.querySelector('button:contains("撮影")');
      if (captureBtn) {
        captureBtn.style.display = 'none';
        captureBtn.classList.add('d-none');
      }
      
      // プレビュー画像を表示
      let previewContainer = modal.querySelector('#preview-container, .preview-container');
      let previewImg = modal.querySelector('#preview-image, .preview-image, img.preview');
      
      // プレビューコンテナがなければ作成
      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.id = 'preview-container';
        previewContainer.className = 'preview-container text-center mt-3';
        
        // モーダルボディに追加
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
          modalBody.appendChild(previewContainer);
        }
      }
      
      // プレビュー画像がなければ作成
      if (!previewImg) {
        previewImg = document.createElement('img');
        previewImg.id = 'preview-image';
        previewImg.className = 'preview-image img-fluid';
        previewImg.style.maxWidth = '100%';
        previewImg.style.maxHeight = '300px';
        previewContainer.appendChild(previewImg);
      }
      
      // 画像を更新
      previewImg.src = imageData;
      
      // データを保存
      modal.dataset.capturedImage = imageData;
      
      // プレビューコンテナを表示
      previewContainer.style.display = 'block';
      previewContainer.classList.remove('d-none');
      
      // 確認メッセージを表示
      let confirmHeading = modal.querySelector('h6:contains("撮影された写真の確認")');
      if (!confirmHeading) {
        confirmHeading = document.createElement('h6');
        confirmHeading.textContent = '撮影された写真の確認';
        confirmHeading.className = 'mt-3 mb-2 text-center';
        
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody && previewContainer) {
          modalBody.insertBefore(confirmHeading, previewContainer);
        }
      }
    } catch (error) {
      console.error('[自動撮影] プレビュー表示エラー:', error);
    }
  }
  
  /**
   * ボタンを設定
   */
  function setupButtons(modal) {
    console.log('[自動撮影] ボタンを設定');
    
    try {
      // フッターを取得または作成
      let modalFooter = modal.querySelector('.modal-footer');
      if (!modalFooter) {
        modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
          modalContent.appendChild(modalFooter);
        }
      }
      
      // 「この写真を使用」ボタンを取得または作成
      let usePhotoBtn = modal.querySelector('button:contains("この写真を使用")');
      if (!usePhotoBtn) {
        usePhotoBtn = document.createElement('button');
        usePhotoBtn.type = 'button';
        usePhotoBtn.className = 'btn btn-success';
        usePhotoBtn.textContent = 'この写真を使用';
        
        modalFooter.appendChild(usePhotoBtn);
      }
      
      // 「撮り直す」ボタンを取得または作成
      let retakeBtn = modal.querySelector('button:contains("撮り直")');
      if (!retakeBtn) {
        retakeBtn = document.createElement('button');
        retakeBtn.type = 'button';
        retakeBtn.className = 'btn btn-outline-primary';
        retakeBtn.textContent = '撮り直す';
        
        modalFooter.insertBefore(retakeBtn, usePhotoBtn);
      }
      
      // 「キャンセル」ボタンを取得
      let cancelBtn = modal.querySelector('button:contains("キャンセル")');
      if (!cancelBtn) {
        cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'キャンセル';
        cancelBtn.setAttribute('data-bs-dismiss', 'modal');
        
        modalFooter.insertBefore(cancelBtn, retakeBtn);
      }
      
      // ボタンを表示
      usePhotoBtn.style.display = 'inline-block';
      usePhotoBtn.classList.remove('d-none');
      
      retakeBtn.style.display = 'inline-block';
      retakeBtn.classList.remove('d-none');
      
      // イベントリスナーをクリア
      usePhotoBtn.removeEventListener('click', usePhotoHandler);
      
      // 「この写真を使用」ボタンのイベントハンドラ
      usePhotoBtn.addEventListener('click', usePhotoHandler, true);
      
      // 「撮り直す」ボタンのイベントハンドラ
      retakeBtn.onclick = function() {
        retakePhoto(modal);
      };
    } catch (error) {
      console.error('[自動撮影] ボタン設定エラー:', error);
    }
  }
  
  /**
   * 「この写真を使用」ボタンのハンドラ
   */
  function usePhotoHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const modal = this.closest('.modal');
    if (modal) {
      usePhoto(modal);
    }
    
    return false;
  }
  
  /**
   * 写真を使用する
   */
  function usePhoto(modal) {
    console.log('[自動撮影] 写真を使用');
    
    try {
      // 画像データを取得
      const imageData = modal.dataset.capturedImage;
      if (!imageData) {
        console.error('[自動撮影] 画像データがありません');
        return;
      }
      
      // 前後面の判定
      const titleElement = modal.querySelector('.modal-title');
      const title = titleElement ? titleElement.textContent : '';
      const isBackSide = title.includes('裏面');
      
      // 写真のタイプを特定
      const photoType = isBackSide ? 'back' : 'front';
      
      // カメラストリームを停止
      const video = modal.querySelector('video');
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // グローバル変数に保存（モーダルが閉じた後に使用）
      window._lastPhotoData = imageData;
      window._lastPhotoType = photoType;
      
      // モーダルを閉じる
      closeModal(modal);
      
      // メインページの要素を更新
      setTimeout(function() {
        updateMainPagePhoto(imageData, photoType);
      }, 500);
    } catch (error) {
      console.error('[自動撮影] 写真使用エラー:', error);
      
      // エラーが発生した場合もモーダルを閉じる
      closeModal(modal);
    }
  }
  
  /**
   * 写真を撮り直す
   */
  function retakePhoto(modal) {
    console.log('[自動撮影] 写真を撮り直します');
    
    try {
      // プレビューコンテナを非表示
      const previewContainer = modal.querySelector('#preview-container, .preview-container');
      if (previewContainer) {
        previewContainer.style.display = 'none';
        previewContainer.classList.add('d-none');
      }
      
      // ビデオコンテナを表示
      const videoContainer = modal.querySelector('#video-container, .video-container');
      if (videoContainer) {
        videoContainer.style.display = 'block';
        videoContainer.classList.remove('d-none');
      }
      
      // 確認ボタンを非表示
      const usePhotoBtn = modal.querySelector('button:contains("この写真を使用")');
      const retakeBtn = modal.querySelector('button:contains("撮り直")');
      
      if (usePhotoBtn) {
        usePhotoBtn.style.display = 'none';
        usePhotoBtn.classList.add('d-none');
      }
      
      if (retakeBtn) {
        retakeBtn.style.display = 'none';
        retakeBtn.classList.add('d-none');
      }
      
      // 撮影ボタンを表示
      const captureBtn = modal.querySelector('button:contains("撮影")');
      if (captureBtn) {
        captureBtn.style.display = 'inline-block';
        captureBtn.classList.remove('d-none');
      }
      
      // カメラを再起動
      const video = modal.querySelector('video');
      if (video) {
        startCamera(video)
          .then(function() {
            // 1秒後に自動撮影
            setTimeout(function() {
              captureAndShow(modal, video);
            }, 1000);
          })
          .catch(function(error) {
            console.error('[自動撮影] カメラ再起動エラー:', error);
            forceCapture(modal);
          });
      } else {
        // ビデオ要素がない場合は強制撮影
        forceCapture(modal);
      }
    } catch (error) {
      console.error('[自動撮影] 撮り直しエラー:', error);
    }
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    console.log('[自動撮影] モーダルを閉じます');
    
    try {
      // カメラストリームを停止
      const video = modal.querySelector('video');
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }
      
      // 閉じるボタンを探してクリック
      const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
      if (closeBtn) {
        closeBtn.click();
        return;
      }
      
      // Bootstrap APIでモーダルを閉じる
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        try {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
            return;
          }
        } catch (e) {
          console.error('[自動撮影] Bootstrap API エラー:', e);
        }
      }
      
      // 最後の手段として直接CSSを変更
      modal.style.display = 'none';
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // 背景も削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }
    } catch (error) {
      console.error('[自動撮影] モーダルを閉じる際のエラー:', error);
    }
  }
  
  /**
   * メインページの写真を更新
   */
  function updateMainPagePhoto(imageData, photoType) {
    console.log(`[自動撮影] メインページの写真を更新: ${photoType}`);
    
    try {
      // ID候補
      const imageIdCandidates = [
        `${photoType}-photo-image`,
        `photo-${photoType}-image`,
        'id-photo-image',
        'photo-image'
      ];
      
      const containerIdCandidates = [
        `${photoType}-photo-preview`,
        `photo-${photoType}-preview`,
        'id-photo-preview'
      ];
      
      const placeholderIdCandidates = [
        `${photoType}-photo-placeholder`,
        `photo-${photoType}-placeholder`,
        'id-photo-placeholder'
      ];
      
      const inputIdCandidates = [
        `${photoType}-photo-input`,
        `photo-${photoType}-input`,
        'id-photo-input'
      ];
      
      // 要素を探す
      let photoImg = null;
      let previewContainer = null;
      let placeholder = null;
      let fileInput = null;
      
      // IDから画像を探す
      for (const id of imageIdCandidates) {
        const img = document.getElementById(id);
        if (img) {
          photoImg = img;
          break;
        }
      }
      
      // IDからコンテナを探す
      for (const id of containerIdCandidates) {
        const container = document.getElementById(id);
        if (container) {
          previewContainer = container;
          break;
        }
      }
      
      // IDからプレースホルダーを探す
      for (const id of placeholderIdCandidates) {
        const ph = document.getElementById(id);
        if (ph) {
          placeholder = ph;
          break;
        }
      }
      
      // IDから入力要素を探す
      for (const id of inputIdCandidates) {
        const input = document.getElementById(id);
        if (input && input.type === 'file') {
          fileInput = input;
          break;
        }
      }
      
      // 画像要素が見つからない場合はクラスや属性から探す
      if (!photoImg) {
        const allImages = document.querySelectorAll('img');
        for (const img of allImages) {
          if ((img.id && img.id.includes(photoType)) || 
              (img.className && img.className.includes(photoType)) ||
              (img.className && img.className.includes('photo'))) {
            photoImg = img;
            break;
          }
        }
      }
      
      // それでも見つからない場合はプレースホルダーの親に画像を探す
      if (!photoImg && placeholder) {
        const parent = placeholder.parentElement;
        if (parent) {
          photoImg = parent.querySelector('img');
        }
      }
      
      // プレビュー画像を更新
      if (photoImg) {
        photoImg.src = imageData;
        photoImg.style.display = 'block';
        
        // 親要素も表示
        const parent = photoImg.parentElement;
        if (parent) {
          parent.classList.remove('d-none');
          parent.style.display = 'block';
        }
      }
      
      // プレビューコンテナを表示
      if (previewContainer) {
        previewContainer.classList.remove('d-none');
        previewContainer.style.display = 'block';
      }
      
      // プレースホルダーを非表示
      if (placeholder) {
        placeholder.classList.add('d-none');
        placeholder.style.display = 'none';
      }
      
      // ファイル入力を更新
      if (fileInput) {
        updateFileInput(fileInput, imageData);
      }
      
      console.log('[自動撮影] メインページの更新完了');
    } catch (error) {
      console.error('[自動撮影] メインページ更新エラー:', error);
    }
  }
  
  /**
   * ファイル入力要素を更新
   */
  function updateFileInput(input, imageData) {
    try {
      // データURLをBlobに変換
      const blob = dataURLToBlob(imageData);
      
      // ファイル名を生成
      const fileName = `photo_${Date.now()}.jpg`;
      
      // Fileオブジェクトを作成
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // DataTransferオブジェクトを使用
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
      
      console.log('[自動撮影] ファイル入力を更新しました');
    } catch (error) {
      console.error('[自動撮影] ファイル入力更新エラー:', error);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    // データURLをバイナリに変換
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const array = new Uint8Array(raw.length);
    
    for (let i = 0; i < raw.length; i++) {
      array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([array], { type: contentType });
  }
  
  /**
   * テキストを含む要素を探す拡張機能
   */
  HTMLElement.prototype.textContains = function(text) {
    return this.textContent && this.textContent.includes(text);
  };
  
  // テキスト検索用のユーティリティ関数
  function findElementByText(parent, tagName, text) {
    const elements = parent.querySelectorAll(tagName);
    for (const element of elements) {
      if (element.textContent && element.textContent.includes(text)) {
        return element;
      }
    }
    return null;
  }
})();