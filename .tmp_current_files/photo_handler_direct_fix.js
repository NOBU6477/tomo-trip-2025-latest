/**
 * 写真ハンドリングの問題を直接修正するスクリプト
 * 特に表裏写真機能の挙動を修正します
 */
(function() {
  'use strict';
  
  // グローバル変数
  let photoElements = {
    single: {
      section: null,
      input: null,
      preview: null,
      cameraBtn: null
    },
    front: {
      section: null,
      input: null,
      preview: null,
      cameraBtn: null
    },
    back: {
      section: null,
      input: null,
      preview: null,
      cameraBtn: null
    }
  };
  
  // DOMの読み込みが完了したら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  /**
   * 初期化
   */
  function init() {
    console.log('写真ハンドリング直接修正スクリプトを初期化');
    
    // モーダル表示イベントを監視
    document.addEventListener('shown.bs.modal', function(event) {
      if (!event.target || !event.target.id) return;
      
      if (event.target.id.includes('RegisterModal') || 
          event.target.id.includes('DocumentModal')) {
        setTimeout(setupPhotoHandlers, 100);
      }
    });
    
    // 定期的に実行
    setInterval(setupPhotoHandlers, 1000);
    
    // 初期設定
    setupPhotoHandlers();
  }
  
  /**
   * 写真関連の要素を設定
   */
  function setupPhotoHandlers() {
    // 写真タイプを変更するラジオボタンの設定
    setupPhotoTypeRadio();
    
    // 写真セクションの要素を収集
    collectPhotoElements();
    
    // カメラボタンの設定
    setupCameraButtons();
  }
  
  /**
   * 写真タイプラジオボタンの設定
   */
  function setupPhotoTypeRadio() {
    const singleRadio = document.getElementById('id-photo-type-single');
    const dualRadio = document.getElementById('id-photo-type-dual');
    
    if (!singleRadio || !dualRadio) return;
    
    // 既に処理済みの場合はスキップ
    if (singleRadio.hasAttribute('data-fixed') || dualRadio.hasAttribute('data-fixed')) return;
    
    // シングルとデュアルセクション
    const singleSection = document.getElementById('single-photo-section');
    const dualSection = document.getElementById('dual-photo-section');
    
    if (!singleSection || !dualSection) return;
    
    // チェンジイベントの設定
    singleRadio.addEventListener('change', function() {
      if (this.checked) {
        console.log('シングル写真モードに切り替え');
        singleSection.style.display = 'block';
        singleSection.classList.remove('d-none');
        dualSection.style.display = 'none';
        dualSection.classList.add('d-none');
      }
    });
    
    dualRadio.addEventListener('change', function() {
      if (this.checked) {
        console.log('デュアル写真モードに切り替え');
        singleSection.style.display = 'none';
        singleSection.classList.add('d-none');
        dualSection.style.display = 'block';
        dualSection.classList.remove('d-none');
      }
    });
    
    // クリックイベントも追加（チェンジイベントが発火しない場合の対策）
    singleRadio.addEventListener('click', function() {
      console.log('シングル写真モードがクリックされました');
      singleSection.style.display = 'block';
      singleSection.classList.remove('d-none');
      dualSection.style.display = 'none';
      dualSection.classList.add('d-none');
    });
    
    dualRadio.addEventListener('click', function() {
      console.log('デュアル写真モードがクリックされました');
      singleSection.style.display = 'none';
      singleSection.classList.add('d-none');
      dualSection.style.display = 'block';
      dualSection.classList.remove('d-none');
    });
    
    // 初期状態の設定
    if (singleRadio.checked) {
      singleSection.style.display = 'block';
      singleSection.classList.remove('d-none');
      dualSection.style.display = 'none';
      dualSection.classList.add('d-none');
    } else if (dualRadio.checked) {
      singleSection.style.display = 'none';
      singleSection.classList.add('d-none');
      dualSection.style.display = 'block';
      dualSection.classList.remove('d-none');
    }
    
    // 処理済みマーク
    singleRadio.setAttribute('data-fixed', 'true');
    dualRadio.setAttribute('data-fixed', 'true');
    
    console.log('写真タイプラジオボタンを設定しました');
  }
  
  /**
   * 写真関連の要素を収集
   */
  function collectPhotoElements() {
    // シングル写真
    photoElements.single.section = document.getElementById('single-photo-section');
    photoElements.single.input = document.getElementById('id-photo-input');
    photoElements.single.preview = document.getElementById('id-photo-preview');
    photoElements.single.cameraBtn = document.getElementById('id-photo-camera-btn');
    
    // 表面写真（デュアルモード）
    photoElements.front.section = document.getElementById('dual-photo-section');
    photoElements.front.input = document.getElementById('id-photo-front-input');
    photoElements.front.preview = document.getElementById('id-photo-front-preview');
    photoElements.front.cameraBtn = document.querySelector('button[id*="front-camera"]');
    
    // 裏面写真（デュアルモード）
    photoElements.back.section = photoElements.front.section; // 同じセクション内
    photoElements.back.input = document.getElementById('id-photo-back-input');
    photoElements.back.preview = document.getElementById('id-photo-back-preview');
    photoElements.back.cameraBtn = document.querySelector('button[id*="back-camera"]');
    
    console.log('写真要素を収集しました');
  }
  
  /**
   * カメラボタンの設定
   */
  function setupCameraButtons() {
    // シングル写真カメラボタン
    if (photoElements.single.cameraBtn && !photoElements.single.cameraBtn.hasAttribute('data-handler-fixed')) {
      photoElements.single.cameraBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showCamera('single', '証明写真を撮影');
      });
      photoElements.single.cameraBtn.setAttribute('data-handler-fixed', 'true');
    }
    
    // 表面写真カメラボタン
    if (photoElements.front.cameraBtn && !photoElements.front.cameraBtn.hasAttribute('data-handler-fixed')) {
      photoElements.front.cameraBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showCamera('front', '表面写真を撮影');
      });
      photoElements.front.cameraBtn.setAttribute('data-handler-fixed', 'true');
    }
    
    // 裏面写真カメラボタン
    if (photoElements.back.cameraBtn && !photoElements.back.cameraBtn.hasAttribute('data-handler-fixed')) {
      photoElements.back.cameraBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showCamera('back', '裏面写真を撮影');
      });
      photoElements.back.cameraBtn.setAttribute('data-handler-fixed', 'true');
    }
  }
  
  /**
   * カメラモーダルを表示
   */
  function showCamera(type, title) {
    console.log(`${type}写真用カメラを起動`);
    
    // 既存のカメラモーダルを削除
    let existingModal = document.getElementById('customCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // カメラモーダルのHTML
    const modalHTML = `
      <div class="modal fade" id="customCameraModal" tabindex="-1" aria-labelledby="customCameraModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="customCameraModalLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <div class="video-container">
                  <video id="custom-camera-video" class="w-100" playsinline autoplay></video>
                  <canvas id="custom-camera-canvas" class="d-none"></canvas>
                </div>
                <div id="custom-camera-preview" class="preview-container mt-3 text-center d-none">
                  <img id="custom-preview-image" class="img-fluid rounded" alt="プレビュー">
                </div>
                <div id="custom-camera-error" class="alert alert-danger d-none" role="alert">
                  カメラにアクセスできません。デバイスのカメラ設定を確認してください。
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" id="custom-capture-btn" class="btn btn-primary">撮影する</button>
              <button type="button" id="custom-retake-btn" class="btn btn-outline-primary d-none">撮り直す</button>
              <button type="button" id="custom-use-btn" class="btn btn-success d-none">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // モーダルの設定と表示
    const modalElement = document.getElementById('customCameraModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // 要素の取得
    const video = document.getElementById('custom-camera-video');
    const canvas = document.getElementById('custom-camera-canvas');
    const captureBtn = document.getElementById('custom-capture-btn');
    const retakeBtn = document.getElementById('custom-retake-btn');
    const useBtn = document.getElementById('custom-use-btn');
    const previewContainer = document.getElementById('custom-camera-preview');
    const previewImage = document.getElementById('custom-preview-image');
    const errorAlert = document.getElementById('custom-camera-error');
    
    // カメラの起動
    startCamera();
    
    // モーダルが閉じられたときの処理
    modalElement.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // 撮影ボタンのイベント設定
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', retakePhoto);
    useBtn.addEventListener('click', usePhoto);
    
    /**
     * カメラを起動
     */
    function startCamera() {
      // モバイルデバイスの場合、背面カメラを優先
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobile ? 'environment' : 'user'
        }
      };
      
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          window.cameraStream = stream;
          video.srcObject = stream;
          errorAlert.classList.add('d-none');
        })
        .catch(function(err) {
          console.error('カメラアクセスエラー:', err);
          errorAlert.classList.remove('d-none');
          errorAlert.textContent = 'カメラエラー: ' + err.message;
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
    
    /**
     * 写真を撮影
     */
    function capturePhoto() {
      // ビデオの内容をキャンバスに描画
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // プレビュー画像の表示
      const imageDataURL = canvas.toDataURL('image/jpeg');
      previewImage.src = imageDataURL;
      
      // UI表示の切り替え
      video.classList.add('d-none');
      previewContainer.classList.remove('d-none');
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      useBtn.classList.remove('d-none');
    }
    
    /**
     * 写真を撮り直す
     */
    function retakePhoto() {
      // UI表示を元に戻す
      video.classList.remove('d-none');
      previewContainer.classList.add('d-none');
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
          console.error('画像の変換に失敗しました');
          return;
        }
        
        // 写真タイプに応じた処理
        const fileName = `photo_${type}_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // 対象の入力要素にファイルをセット
        const targetInput = photoElements[type].input;
        if (targetInput) {
          try {
            // DataTransferオブジェクトを使用してファイルをセット
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            targetInput.files = dataTransfer.files;
            
            // changeイベントを発火
            const event = new Event('change', { bubbles: true });
            targetInput.dispatchEvent(event);
            
            // プレビュー画像の更新
            updatePreview(type, file);
            
            console.log(`${type}写真が正常に設定されました`);
          } catch (error) {
            console.error('ファイル設定エラー:', error);
          }
        } else {
          console.error(`${type}写真の入力要素が見つかりません`);
        }
        
        // モーダルを閉じる
        modal.hide();
      }, 'image/jpeg', 0.95);
    }
  }
  
  /**
   * プレビュー画像の更新
   */
  function updatePreview(type, file) {
    const preview = photoElements[type].preview;
    if (!preview) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      // プレビュー画像の表示
      preview.src = e.target.result;
      
      // プレビューコンテナの表示
      const container = preview.parentElement;
      if (container) {
        container.classList.remove('d-none');
        
        // 削除ボタンの表示
        const removeBtn = container.querySelector('button[id*="remove"]');
        if (removeBtn) {
          removeBtn.classList.remove('d-none');
        }
      }
      
      // プレースホルダーの非表示
      const placeholder = document.getElementById(`id-photo-${type}-placeholder`);
      if (placeholder) {
        placeholder.classList.add('d-none');
      }
    };
    
    reader.readAsDataURL(file);
  }
})();