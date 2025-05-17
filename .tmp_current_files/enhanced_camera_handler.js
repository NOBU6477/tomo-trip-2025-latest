/**
 * 証明写真カメラ機能を強化する専用スクリプト
 * 特に表裏写真モードでの撮影機能に対応
 */
(function() {
  'use strict';
  
  // DOMの読み込みが完了したら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  let photoType = null; // 現在の撮影モード ('single', 'front', 'back')
  let targetPhotoInput = null; // ターゲットの入力要素ID
  
  /**
   * 初期化
   */
  function init() {
    console.log('強化カメラ機能を初期化');
    
    // モーダルイベントを監視（モーダル表示時）
    document.addEventListener('shown.bs.modal', function(event) {
      if (!event.target || !event.target.id) return;
      
      if (event.target.id.includes('RegisterModal') || 
          event.target.id.includes('DocumentModal')) {
        setTimeout(setupCameraButtons, 200);
      }
    });
    
    // DOMの変更を監視（新要素の追加時）
    const observer = new MutationObserver(function(mutations) {
      let shouldSetup = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1 && 
               (node.tagName === 'BUTTON' || 
                (node.tagName === 'DIV' && node.querySelector('button')))) {
              shouldSetup = true;
              break;
            }
          }
        }
      });
      
      if (shouldSetup) {
        setTimeout(setupCameraButtons, 200);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 初期設定
    setupCameraButtons();
  }
  
  /**
   * カメラボタンのセットアップ
   */
  function setupCameraButtons() {
    // より基本的なセレクターを使用
    // 1. IDにカメラを含むボタン
    document.querySelectorAll('button[id*="camera"]').forEach(processButton);
    
    // 2. カメラアイコンを含むボタン
    document.querySelectorAll('button:not([data-camera-enhanced])').forEach(button => {
      const icons = button.querySelectorAll('i.bi-camera');
      if (icons.length > 0) {
        processButton(button);
      }
    });
    
    // 3. テキストでカメラ/撮影を含むボタン
    document.querySelectorAll('button:not([data-camera-enhanced])').forEach(button => {
      const text = button.textContent.trim();
      if (text.includes('カメラ') || text.includes('撮影') || 
          text.includes('CAMERA') || text.includes('PHOTO')) {
        processButton(button);
      }
    });
    
    // ボタン処理関数
    function processButton(button) {
      if (button.hasAttribute('data-camera-enhanced')) {
        return; // 既に設定済み
      }
      
      // どのタイプのカメラボタンかを判定
      if (button.id && button.id.includes('id-photo-camera-btn')) {
        setupSinglePhotoCamera(button);
      } else if (button.id && button.id.includes('front-camera')) {
        setupFrontPhotoCamera(button);
      } else if (button.id && button.id.includes('back-camera')) {
        setupBackPhotoCamera(button);
      } else {
        // 汎用カメラボタン
        setupGenericCamera(button);
      }
      
      // 設定済みフラグ
      button.setAttribute('data-camera-enhanced', 'true');
    }
  }
  
  /**
   * 単一写真用カメラボタンの設定
   */
  function setupSinglePhotoCamera(button) {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      console.log('単一証明写真カメラが起動されました');
      photoType = 'single';
      targetPhotoInput = 'id-photo-input';
      
      showCamera('証明写真を撮影');
    });
  }
  
  /**
   * 表面写真用カメラボタンの設定
   */
  function setupFrontPhotoCamera(button) {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      console.log('表面写真カメラが起動されました');
      photoType = 'front';
      targetPhotoInput = 'id-photo-front-input';
      
      showCamera('表面写真を撮影');
    });
  }
  
  /**
   * 裏面写真用カメラボタンの設定
   */
  function setupBackPhotoCamera(button) {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      console.log('裏面写真カメラが起動されました');
      photoType = 'back';
      targetPhotoInput = 'id-photo-back-input';
      
      showCamera('裏面写真を撮影');
    });
  }
  
  /**
   * 汎用カメラボタンの設定
   */
  function setupGenericCamera(button) {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      console.log('汎用カメラが起動されました');
      
      // ボタンの親要素や周囲からターゲット入力を推測
      const parent = button.closest('.form-group') || button.closest('.mb-3') || button.parentElement;
      if (!parent) return;
      
      const fileInput = parent.querySelector('input[type="file"]');
      if (!fileInput) return;
      
      targetPhotoInput = fileInput.id;
      photoType = 'generic';
      
      showCamera('写真を撮影');
    });
  }
  
  /**
   * カメラモーダルを表示
   */
  function showCamera(title) {
    // 既存のモーダルをクリーンアップ
    let existingModal = document.getElementById('enhancedCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // モーダルHTML
    const modalHTML = `
      <div class="modal fade" id="enhancedCameraModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <div class="video-container">
                  <video id="enhanced-camera-video" class="w-100" playsinline autoplay></video>
                  <canvas id="enhanced-camera-canvas" class="d-none"></canvas>
                </div>
                <div id="enhanced-camera-preview" class="preview-container mt-3 text-center d-none">
                  <img id="enhanced-preview-image" class="img-fluid rounded" alt="プレビュー">
                </div>
                <div id="enhanced-camera-error" class="alert alert-danger d-none" role="alert">
                  カメラにアクセスできません。デバイスのカメラ設定を確認してください。
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" id="enhanced-capture-btn" class="btn btn-primary">撮影する</button>
              <button type="button" id="enhanced-retake-btn" class="btn btn-outline-primary d-none">撮り直す</button>
              <button type="button" id="enhanced-use-btn" class="btn btn-success d-none">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルを追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // モーダルを取得して表示
    const modalElement = document.getElementById('enhancedCameraModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // 要素の取得
    const video = document.getElementById('enhanced-camera-video');
    const canvas = document.getElementById('enhanced-camera-canvas');
    const captureBtn = document.getElementById('enhanced-capture-btn');
    const retakeBtn = document.getElementById('enhanced-retake-btn');
    const useBtn = document.getElementById('enhanced-use-btn');
    const previewContainer = document.getElementById('enhanced-camera-preview');
    const previewImage = document.getElementById('enhanced-preview-image');
    const errorAlert = document.getElementById('enhanced-camera-error');
    
    // モーダルが閉じられたときにカメラを停止
    modalElement.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // カメラ起動
    startCamera();
    
    /**
     * カメラを起動
     */
    function startCamera() {
      // モバイルデバイスの場合は背面カメラを優先
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobile ? 'environment' : 'user'
        }
      };
      
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          window.cameraStream = stream;
          video.srcObject = stream;
          captureBtn.disabled = false;
          errorAlert.classList.add('d-none');
        })
        .catch(err => {
          console.error('カメラの起動に失敗しました:', err);
          errorAlert.classList.remove('d-none');
          errorAlert.textContent = 'カメラにアクセスできません: ' + err.message;
        });
    }
    
    /**
     * カメラを停止
     */
    function stopCamera() {
      if (window.cameraStream) {
        window.cameraStream.getTracks().forEach(track => track.stop());
        window.cameraStream = null;
      }
    }
    
    // 撮影ボタンのイベント
    captureBtn.addEventListener('click', function() {
      capturePhoto();
    });
    
    // 撮り直しボタンのイベント
    retakeBtn.addEventListener('click', function() {
      retakePhoto();
    });
    
    // 写真使用ボタンのイベント
    useBtn.addEventListener('click', function() {
      usePhoto();
    });
    
    /**
     * 写真を撮影
     */
    function capturePhoto() {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 写真をDataURLに変換
      const imageDataURL = canvas.toDataURL('image/jpeg');
      
      // プレビュー表示
      previewImage.src = imageDataURL;
      previewContainer.classList.remove('d-none');
      video.classList.add('d-none');
      
      // ボタン状態の変更
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      useBtn.classList.remove('d-none');
    }
    
    /**
     * 写真を撮り直す
     */
    function retakePhoto() {
      // プレビューを非表示にしてビデオを再表示
      previewContainer.classList.add('d-none');
      video.classList.remove('d-none');
      
      // ボタン状態の復元
      captureBtn.classList.remove('d-none');
      retakeBtn.classList.add('d-none');
      useBtn.classList.add('d-none');
    }
    
    /**
     * 撮影した写真を使用
     */
    function usePhoto() {
      canvas.toBlob(function(blob) {
        if (!blob) {
          console.error('Blobの作成に失敗しました');
          return;
        }
        
        // ファイル名を設定
        const fileName = `photo_${photoType}_${new Date().getTime()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // 対象の入力要素を特定
        const fileInput = document.getElementById(targetPhotoInput);
        if (!fileInput) {
          console.error('ターゲット入力要素が見つかりません:', targetPhotoInput);
          return;
        }
        
        // ファイルを設定
        try {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          
          // changeイベントを発火
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          console.log('ファイルが正常に設定されました:', targetPhotoInput);
          
          // 現在の写真タイプに基づいて処理を実行
          processPhotoForType(fileInput, file);
        } catch (error) {
          console.error('ファイル設定エラー:', error);
        }
        
        // モーダルを閉じる
        modal.hide();
      }, 'image/jpeg', 0.95);
    }
    
    /**
     * 写真タイプに基づいた処理を実行
     */
    function processPhotoForType(fileInput, file) {
      // idPhotoHandlerスクリプトの関数を呼び出し
      if (photoType === 'single' && typeof handleIdPhotoChange === 'function') {
        handleIdPhotoChange(file);
      } else if (photoType === 'front' && typeof handleIdPhotoFrontChange === 'function') {
        handleIdPhotoFrontChange(file);
      } else if (photoType === 'back' && typeof handleIdPhotoBackChange === 'function') {
        handleIdPhotoBackChange(file);
      } else {
        // フォールバック：プレビュー要素を直接操作
        updatePreviewElement(fileInput, file);
      }
    }
    
    /**
     * プレビュー要素を直接更新
     */
    function updatePreviewElement(fileInput, file) {
      const parent = fileInput.closest('.form-group') || 
                   fileInput.closest('.mb-3') || 
                   fileInput.parentElement;
      if (!parent) return;
      
      // プレビュー要素を探す
      const previewImg = parent.querySelector('img[id*="preview"], img[id*="image"]');
      if (!previewImg) return;
      
      // プレビュー表示
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        
        // プレビューコンテナとプレースホルダーを処理
        const previewContainer = parent.querySelector('[id*="preview"]');
        const placeholder = parent.querySelector('[id*="placeholder"]');
        
        if (previewContainer) previewContainer.classList.remove('d-none');
        if (placeholder) placeholder.classList.add('d-none');
        
        // 削除ボタンを表示
        const removeBtn = parent.querySelector('button[id*="remove"]');
        if (removeBtn) removeBtn.classList.remove('d-none');
      };
      
      reader.readAsDataURL(file);
    }
  }
})();