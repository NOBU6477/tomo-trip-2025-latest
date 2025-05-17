/**
 * 証明写真タイプ（単一・表裏）に基づいて
 * アップロード機能とカメラ機能を切り替えるスクリプト
 */
(function() {
  'use strict';
  
  // DOMの準備ができたら実行
  document.addEventListener('DOMContentLoaded', function() {
    // モーダルの表示イベントを監視
    document.addEventListener('shown.bs.modal', function(event) {
      setTimeout(function() {
        setupPhotoTypeHandlers(event.target);
      }, 300);
    });
    
    // ボタンクリック時のバックアップ処理
    document.addEventListener('click', function(event) {
      if (event.target && 
         (event.target.classList.contains('guide-register-btn') || 
          event.target.classList.contains('tourist-register-btn') ||
          (event.target.closest && (
            event.target.closest('.guide-register-btn') || 
            event.target.closest('.tourist-register-btn')
          ))
         )) {
        setTimeout(function() {
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            setupPhotoTypeHandlers(modal);
          });
        }, 500);
      }
    });
  });
  
  /**
   * 写真タイプに応じたハンドラを設定
   */
  function setupPhotoTypeHandlers(modal) {
    if (!modal) return;
    
    try {
      console.log('写真タイプハンドラをセットアップしています...');
      
      // 写真タイプの選択肢を取得
      const photoRadios = modal.querySelectorAll('input[type="radio"][name="photoType"]');
      if (photoRadios.length < 2) {
        console.log('ラジオボタンがまだ設定されていません');
        return;
      }
      
      // カメラボタンと選択ボタンの取得
      const cameraButton = findCameraButton(modal);
      const fileSelectButton = findFileSelectButton(modal);
      
      if (!cameraButton || !fileSelectButton) {
        console.log('写真関連のボタンが見つかりません');
        return;
      }
      
      // 初期状態のアップロードタイプを設定
      let currentUploadType = 'single'; // デフォルト: 単一写真
      photoRadios.forEach(function(radio) {
        if (radio.checked) {
          // チェックされているラジオボタンの後のテキストを確認
          const nextNode = radio.nextSibling;
          const textContent = nextNode ? nextNode.textContent || '' : '';
          
          if (textContent.includes('表裏') || textContent.includes('運転免許証')) {
            currentUploadType = 'dual';
          }
        }
        
        // ラジオボタンの変更イベントを監視
        radio.addEventListener('change', function() {
          const label = this.nextSibling;
          const labelText = label ? label.textContent || '' : '';
          
          if (labelText.includes('表裏') || labelText.includes('運転免許証')) {
            currentUploadType = 'dual';
          } else {
            currentUploadType = 'single';
          }
          
          console.log('写真タイプが変更されました:', currentUploadType);
          
          // アップロードUIを更新
          updatePhotoUploadUI(modal, currentUploadType);
        });
      });
      
      // ファイル選択ボタンのクリックイベントをオーバーライド
      if (fileSelectButton) {
        // 元のクリックイベントリスナーを保存
        const originalClick = fileSelectButton.onclick;
        
        fileSelectButton.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          handleFileSelection(currentUploadType, modal);
          return false;
        };
      }
      
      // カメラボタンのクリックイベントをオーバーライド
      if (cameraButton) {
        // 元のクリックイベントリスナーを保存
        const originalClick = cameraButton.onclick;
        
        cameraButton.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          handleCameraCapture(currentUploadType, modal);
          return false;
        };
      }
      
      // 初期UIを設定
      updatePhotoUploadUI(modal, currentUploadType);
      
      console.log('写真タイプハンドラのセットアップが完了しました');
    } catch (err) {
      console.error('写真タイプハンドラの設定中にエラーが発生しました:', err);
    }
  }
  
  /**
   * カメラボタンを見つける
   */
  function findCameraButton(modal) {
    // テキストに「カメラ」を含むボタンを検索
    const cameraButtons = Array.from(modal.querySelectorAll('button')).filter(function(btn) {
      return btn.textContent.includes('カメラ') || 
             btn.textContent.includes('CAMERA') || 
             btn.textContent.includes('撮影');
    });
    
    return cameraButtons.length > 0 ? cameraButtons[0] : null;
  }
  
  /**
   * ファイル選択ボタンを見つける
   */
  function findFileSelectButton(modal) {
    // テキストに「ファイル」を含むボタンを検索
    const fileButtons = Array.from(modal.querySelectorAll('button')).filter(function(btn) {
      return btn.textContent.includes('ファイル') || 
             btn.textContent.includes('FILE') || 
             btn.textContent.includes('SELECT') || 
             btn.textContent.includes('選択');
    });
    
    return fileButtons.length > 0 ? fileButtons[0] : null;
  }
  
  /**
   * 写真アップロードUIを更新
   */
  function updatePhotoUploadUI(modal, uploadType) {
    // 現在のプレビュー要素を取得
    const previewContainer = modal.querySelector('.photo-preview') || 
                            modal.querySelector('img[alt="写真プレビュー"]') || 
                            modal.querySelector('img[alt="Photo Preview"]');
                            
    if (previewContainer) {
      if (uploadType === 'dual') {
        // 表裏写真モードの場合、プレビューを2つに分割
        previewContainer.parentNode.classList.add('dual-preview-container');
        
        // 既存の表裏写真プレビューがあるか確認
        const existingFrontPreview = modal.querySelector('.front-preview');
        const existingBackPreview = modal.querySelector('.back-preview');
        
        if (!existingFrontPreview && !existingBackPreview) {
          // プレビュー領域を分割
          const originalParent = previewContainer.parentNode;
          
          // オリジナルのスタイルを保存
          const originalStyle = window.getComputedStyle(previewContainer);
          const originalWidth = originalStyle.width;
          const originalHeight = originalStyle.height;
          
          // オリジナルのプレビューを非表示
          previewContainer.style.display = 'none';
          
          // 表面プレビュー要素を作成
          const frontPreview = document.createElement('div');
          frontPreview.className = 'front-preview';
          frontPreview.style.width = originalWidth;
          frontPreview.style.height = originalHeight;
          frontPreview.style.marginBottom = '10px';
          frontPreview.style.position = 'relative';
          frontPreview.style.border = '1px dashed #ccc';
          frontPreview.style.borderRadius = '4px';
          frontPreview.style.backgroundColor = '#f8f9fa';
          frontPreview.style.display = 'flex';
          frontPreview.style.alignItems = 'center';
          frontPreview.style.justifyContent = 'center';
          
          // 裏面プレビュー要素を作成
          const backPreview = document.createElement('div');
          backPreview.className = 'back-preview';
          backPreview.style.width = originalWidth;
          backPreview.style.height = originalHeight;
          backPreview.style.position = 'relative';
          backPreview.style.border = '1px dashed #ccc';
          backPreview.style.borderRadius = '4px';
          backPreview.style.backgroundColor = '#f8f9fa';
          backPreview.style.display = 'flex';
          backPreview.style.alignItems = 'center';
          backPreview.style.justifyContent = 'center';
          
          // ラベルを追加
          const frontLabel = document.createElement('span');
          frontLabel.textContent = '表面';
          frontLabel.style.position = 'absolute';
          frontLabel.style.top = '5px';
          frontLabel.style.left = '5px';
          frontLabel.style.backgroundColor = 'rgba(255,255,255,0.7)';
          frontLabel.style.padding = '2px 5px';
          frontLabel.style.borderRadius = '3px';
          frontLabel.style.fontSize = '12px';
          frontPreview.appendChild(frontLabel);
          
          const backLabel = document.createElement('span');
          backLabel.textContent = '裏面';
          backLabel.style.position = 'absolute';
          backLabel.style.top = '5px';
          backLabel.style.left = '5px';
          backLabel.style.backgroundColor = 'rgba(255,255,255,0.7)';
          backLabel.style.padding = '2px 5px';
          backLabel.style.borderRadius = '3px';
          backLabel.style.fontSize = '12px';
          backPreview.appendChild(backLabel);
          
          // デフォルトアイコンを追加
          const frontIcon = document.createElement('div');
          frontIcon.innerHTML = '<i class="bi bi-card-image" style="font-size: 48px; color: #adb5bd;"></i>';
          frontPreview.appendChild(frontIcon);
          
          const backIcon = document.createElement('div');
          backIcon.innerHTML = '<i class="bi bi-card-image" style="font-size: 48px; color: #adb5bd;"></i>';
          backPreview.appendChild(backIcon);
          
          // プレビュー要素を追加
          originalParent.appendChild(frontPreview);
          originalParent.appendChild(backPreview);
        }
      } else {
        // 単一写真モードの場合、元のプレビューを表示
        previewContainer.parentNode.classList.remove('dual-preview-container');
        previewContainer.style.display = '';
        
        // 表裏プレビューがあれば削除
        const frontPreview = modal.querySelector('.front-preview');
        const backPreview = modal.querySelector('.back-preview');
        
        if (frontPreview) frontPreview.remove();
        if (backPreview) backPreview.remove();
      }
    }
    
    console.log('アップロードUIを更新しました:', uploadType);
  }
  
  /**
   * ファイル選択処理
   */
  function handleFileSelection(uploadType, modal) {
    if (uploadType === 'dual') {
      // 表裏写真モードの場合、カスタムファイル選択を実装
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.multiple = true; // 複数ファイル選択を許可
      
      fileInput.onchange = function(e) {
        const files = e.target.files;
        if (files.length > 0) {
          if (files.length >= 2) {
            // 2つ以上のファイルが選択された場合、最初の2つを使用
            updateDualPhotoPreview(modal, files[0], files[1]);
          } else {
            // 1つのファイルだけが選択された場合は表面とする
            updateDualPhotoPreview(modal, files[0], null);
            alert('裏面の写真も選択してください');
          }
        }
      };
      
      fileInput.click();
    } else {
      // 単一写真モードの場合、元のファイル選択処理を使用
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      
      fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
          updateSinglePhotoPreview(modal, file);
        }
      };
      
      fileInput.click();
    }
  }
  
  /**
   * カメラ撮影処理
   */
  function handleCameraCapture(uploadType, modal) {
    if (uploadType === 'dual') {
      // 表裏写真モードの場合、専用のカメラモーダルを表示
      showDualCameraModal(modal);
    } else {
      // 単一写真モードの場合、元のカメラ機能を使用
      showSingleCameraModal(modal);
    }
  }
  
  /**
   * 単一写真用カメラモーダル
   */
  function showSingleCameraModal(parentModal) {
    // まず既存のカメラモーダルがあればそちらを使用
    const existingCamera = document.querySelector('#camera-modal');
    if (existingCamera && typeof window.showCamera === 'function') {
      window.showCamera();
      return;
    }
    
    // カメラモーダルを作成
    const modalHTML = `
      <div class="modal fade" id="simple-camera-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <video id="simple-camera-video" autoplay playsinline style="width: 100%; display: block;"></video>
                <canvas id="simple-camera-canvas" style="display: none;"></canvas>
                <div id="simple-camera-result" style="display: none; width: 100%;">
                  <img id="simple-captured-image" style="width: 100%;" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" id="simple-capture-btn" class="btn btn-primary">撮影</button>
              <button type="button" id="simple-retake-btn" class="btn btn-secondary" style="display: none;">撮り直す</button>
              <button type="button" id="simple-use-btn" class="btn btn-success" style="display: none;">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstChild);
    
    // モーダルのインスタンスを取得
    const cameraModal = document.getElementById('simple-camera-modal');
    const modal = new bootstrap.Modal(cameraModal);
    
    // カメラ関連の要素
    const video = document.getElementById('simple-camera-video');
    const canvas = document.getElementById('simple-camera-canvas');
    const result = document.getElementById('simple-camera-result');
    const capturedImage = document.getElementById('simple-captured-image');
    
    // ボタン要素
    const captureBtn = document.getElementById('simple-capture-btn');
    const retakeBtn = document.getElementById('simple-retake-btn');
    const useBtn = document.getElementById('simple-use-btn');
    
    // カメラを起動
    let stream = null;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(mediaStream) {
        stream = mediaStream;
        video.srcObject = mediaStream;
        video.onloadedmetadata = function() {
          video.play();
        };
      })
      .catch(function(err) {
        console.error('カメラアクセスエラー:', err);
        alert('カメラにアクセスできません: ' + err.message);
      });
    
    // 撮影ボタン
    captureBtn.addEventListener('click', function() {
      // キャンバスのサイズをビデオのサイズに合わせる
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // キャンバスに画像を描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像をDataURLとして取得
      const imageDataURL = canvas.toDataURL('image/png');
      capturedImage.src = imageDataURL;
      
      // ビデオを非表示、結果を表示
      video.style.display = 'none';
      result.style.display = 'block';
      
      // ボタンの表示を切り替え
      captureBtn.style.display = 'none';
      retakeBtn.style.display = 'inline-block';
      useBtn.style.display = 'inline-block';
    });
    
    // 撮り直しボタン
    retakeBtn.addEventListener('click', function() {
      // ビデオを表示、結果を非表示
      video.style.display = 'block';
      result.style.display = 'none';
      
      // ボタンの表示を切り替え
      captureBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      useBtn.style.display = 'none';
    });
    
    // 使用ボタン
    useBtn.addEventListener('click', function() {
      // キャプチャした画像からBlobを作成
      canvas.toBlob(function(blob) {
        // 画像ファイルを作成
        const file = new File([blob], 'photo.png', { type: 'image/png' });
        
        // プレビューを更新
        updateSinglePhotoPreview(parentModal, file);
        
        // カメラモーダルを閉じる
        modal.hide();
      });
    });
    
    // モーダルが閉じられたときのイベント
    cameraModal.addEventListener('hidden.bs.modal', function() {
      // カメラストリームを停止
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // モーダルをDOMから削除
      document.body.removeChild(cameraModal);
    });
    
    // モーダルを表示
    modal.show();
  }
  
  /**
   * 表裏写真用カメラモーダル
   */
  function showDualCameraModal(parentModal) {
    // 既存のカメラモーダルをクリーンアップ
    const existingModals = document.querySelectorAll('#dual-camera-modal');
    existingModals.forEach(m => m.parentNode && m.parentNode.removeChild(m));
    
    // カメラモーダルを作成
    const modalHTML = `
      <div class="modal fade" id="dual-camera-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">表裏写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <video id="dual-camera-video" autoplay playsinline style="width: 100%; display: block;"></video>
                <canvas id="dual-camera-canvas" style="display: none;"></canvas>
                <div id="dual-camera-result" style="display: none; width: 100%;">
                  <img id="dual-captured-image" style="width: 100%;" />
                </div>
                <div class="text-center mt-2">
                  <span id="side-indicator" class="badge bg-primary">表面を撮影してください</span>
                </div>
              </div>
              
              <div class="dual-preview-container mt-3" style="display: none;">
                <div class="row">
                  <div class="col-6">
                    <div class="dual-preview-box front-preview-box">
                      <span class="position-absolute top-0 start-0 badge bg-secondary m-1">表面</span>
                      <img id="dual-front-preview" class="img-fluid" />
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="dual-preview-box back-preview-box">
                      <span class="position-absolute top-0 start-0 badge bg-secondary m-1">裏面</span>
                      <img id="dual-back-preview" class="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" id="dual-capture-btn" class="btn btn-primary">撮影</button>
              <button type="button" id="dual-retake-btn" class="btn btn-secondary" style="display: none;">撮り直す</button>
              <button type="button" id="dual-next-btn" class="btn btn-success" style="display: none;">次へ（裏面撮影）</button>
              <button type="button" id="dual-use-btn" class="btn btn-success" style="display: none;">写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstChild);
    
    // モーダルのインスタンスを取得
    const cameraModal = document.getElementById('dual-camera-modal');
    const modal = new bootstrap.Modal(cameraModal);
    
    // カメラ関連の要素
    const video = document.getElementById('dual-camera-video');
    const canvas = document.getElementById('dual-camera-canvas');
    const result = document.getElementById('dual-camera-result');
    const capturedImage = document.getElementById('dual-captured-image');
    const sideIndicator = document.getElementById('side-indicator');
    
    // 表裏プレビュー関連の要素
    const dualPreviewContainer = cameraModal.querySelector('.dual-preview-container');
    const frontPreviewImg = document.getElementById('dual-front-preview');
    const backPreviewImg = document.getElementById('dual-back-preview');
    
    // プレビューボックスのスタイル設定
    const previewBoxes = cameraModal.querySelectorAll('.dual-preview-box');
    previewBoxes.forEach(box => {
      box.style.position = 'relative';
      box.style.height = '100px';
      box.style.border = '1px solid #ddd';
      box.style.borderRadius = '4px';
      box.style.overflow = 'hidden';
      box.style.display = 'flex';
      box.style.alignItems = 'center';
      box.style.justifyContent = 'center';
      box.style.backgroundColor = '#f8f9fa';
    });
    
    // ボタン要素
    const captureBtn = document.getElementById('dual-capture-btn');
    const retakeBtn = document.getElementById('dual-retake-btn');
    const nextBtn = document.getElementById('dual-next-btn');
    const useBtn = document.getElementById('dual-use-btn');
    
    // 撮影状態を管理
    let currentSide = 'front'; // 'front' または 'back'
    let frontImage = null;
    let backImage = null;
    
    // カメラを起動
    let stream = null;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(mediaStream) {
        stream = mediaStream;
        video.srcObject = mediaStream;
        video.onloadedmetadata = function() {
          video.play();
        };
      })
      .catch(function(err) {
        console.error('カメラアクセスエラー:', err);
        alert('カメラにアクセスできません: ' + err.message);
      });
    
    // 撮影ボタン
    captureBtn.addEventListener('click', function() {
      // キャンバスのサイズをビデオのサイズに合わせる
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // キャンバスに画像を描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像をDataURLとして取得
      const imageDataURL = canvas.toDataURL('image/png');
      capturedImage.src = imageDataURL;
      
      // ビデオを非表示、結果を表示
      video.style.display = 'none';
      result.style.display = 'block';
      
      // ボタンの表示を切り替え
      captureBtn.style.display = 'none';
      retakeBtn.style.display = 'inline-block';
      
      if (currentSide === 'front') {
        nextBtn.style.display = 'inline-block';
      } else {
        useBtn.style.display = 'inline-block';
      }
      
      // 画像をBlobとして保存
      canvas.toBlob(function(blob) {
        const file = new File([blob], currentSide + '.png', { type: 'image/png' });
        
        if (currentSide === 'front') {
          frontImage = file;
          
          // 表面プレビューを更新
          if (frontPreviewImg) {
            frontPreviewImg.src = imageDataURL;
            dualPreviewContainer.style.display = 'block';
          }
        } else {
          backImage = file;
          
          // 裏面プレビューを更新
          if (backPreviewImg) {
            backPreviewImg.src = imageDataURL;
          }
        }
      });
    });
    
    // 撮り直しボタン
    retakeBtn.addEventListener('click', function() {
      // ビデオを表示、結果を非表示
      video.style.display = 'block';
      result.style.display = 'none';
      
      // ボタンの表示を切り替え
      captureBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      useBtn.style.display = 'none';
    });
    
    // 次へボタン（裏面撮影へ）
    nextBtn.addEventListener('click', function() {
      // 裏面撮影モードに切り替え
      currentSide = 'back';
      sideIndicator.textContent = '裏面を撮影してください';
      
      // ビデオを表示、結果を非表示
      video.style.display = 'block';
      result.style.display = 'none';
      
      // ボタンの表示を切り替え
      captureBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      useBtn.style.display = 'none';
    });
    
    // 使用ボタン
    useBtn.addEventListener('click', function() {
      // 両方の画像が撮影されていることを確認
      if (frontImage && backImage) {
        // プレビューを更新
        updateDualPhotoPreview(parentModal, frontImage, backImage);
        
        // カメラモーダルを閉じる
        modal.hide();
      } else {
        alert('表面と裏面の両方の写真が必要です');
      }
    });
    
    // モーダルが閉じられたときのイベント
    cameraModal.addEventListener('hidden.bs.modal', function() {
      // カメラストリームを停止
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // モーダルをDOMから削除
      document.body.removeChild(cameraModal);
    });
    
    // モーダルを表示
    modal.show();
  }
  
  /**
   * 単一写真プレビューの更新
   */
  function updateSinglePhotoPreview(modal, file) {
    // 写真のプレビュー要素を探す
    const previewImg = modal.querySelector('.photo-preview img') || 
                      modal.querySelector('img[alt="写真プレビュー"]') || 
                      modal.querySelector('img[alt="Photo Preview"]');
    
    if (previewImg) {
      // FileReaderを使用してファイルをDataURLに変換
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
        
        // 写真が設定されたことを示す要素を更新
        const photoStatus = previewImg.closest('.photo-container').querySelector('.photo-status');
        if (photoStatus) {
          photoStatus.textContent = '写真が設定されました';
        }
        
        // 非表示要素を表示
        const hiddenElements = previewImg.closest('.photo-container').querySelectorAll('.d-none');
        hiddenElements.forEach(function(el) {
          el.classList.remove('d-none');
        });
      };
      reader.readAsDataURL(file);
      
      // 隠しフィールドにファイルを設定
      const fileInput = modal.querySelector('input[type="file"][accept="image/*"]');
      if (fileInput) {
        // DataTransferオブジェクトを使用して、ファイルリストをシミュレート
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // ファイル変更イベントを発火
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      }
    }
  }
  
  /**
   * 表裏写真プレビューの更新
   */
  function updateDualPhotoPreview(modal, frontFile, backFile) {
    // データ保存用の隠しフィールドを用意する
    ensureHiddenFields(modal);
    
    // 表面プレビュー要素
    const frontPreview = modal.querySelector('.front-preview');
    // 裏面プレビュー要素
    const backPreview = modal.querySelector('.back-preview');
    
    if (frontPreview && frontFile) {
      // 表面プレビューを更新
      frontPreview.innerHTML = '<span style="position: absolute; top: 5px; left: 5px; background-color: rgba(255,255,255,0.7); padding: 2px 5px; border-radius: 3px; font-size: 12px;">表面</span>';
      const frontImg = document.createElement('img');
      frontImg.style.width = '100%';
      frontImg.style.height = '100%';
      frontImg.style.objectFit = 'contain';
      
      const reader = new FileReader();
      reader.onload = function(e) {
        frontImg.src = e.target.result;
        
        // 表面データを隠しフィールドに保存
        saveFrontImageData(modal, e.target.result);
      };
      reader.readAsDataURL(frontFile);
      
      frontPreview.appendChild(frontImg);
      
      // 表面画像ファイルを保存
      modal._frontFile = frontFile;
    }
    
    if (backPreview && backFile) {
      // 裏面プレビューを更新
      backPreview.innerHTML = '<span style="position: absolute; top: 5px; left: 5px; background-color: rgba(255,255,255,0.7); padding: 2px 5px; border-radius: 3px; font-size: 12px;">裏面</span>';
      const backImg = document.createElement('img');
      backImg.style.width = '100%';
      backImg.style.height = '100%';
      backImg.style.objectFit = 'contain';
      
      const reader = new FileReader();
      reader.onload = function(e) {
        backImg.src = e.target.result;
        
        // 裏面データを隠しフィールドに保存
        saveBackImageData(modal, e.target.result);
      };
      reader.readAsDataURL(backFile);
      
      backPreview.appendChild(backImg);
      
      // 裏面画像ファイルを保存
      modal._backFile = backFile;
    }
    
    // メインの画像入力にはそのままファイルを設定（既存の処理との互換性のため）
    const fileInput = modal.querySelector('input[type="file"][accept="image/*"]');
    if (fileInput && frontFile) {
      try {
        // 前面画像を主要な入力フィールドに設定
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(frontFile);
        fileInput.files = dataTransfer.files;
        
        // ファイル変更イベントを発火
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      } catch (err) {
        console.error('ファイル入力の更新中にエラーが発生しました:', err);
      }
    }
    
    // 写真が設定されたことを示す要素を更新
    updatePhotoStatusElement(modal);
  }
  
  /**
   * 表裏画像データを保持するための隠しフィールドを確保
   */
  function ensureHiddenFields(modal) {
    // 既に存在するかチェック
    if (modal.querySelector('#dual-front-image-data') && 
        modal.querySelector('#dual-back-image-data')) {
      return;
    }
    
    // フォームを探す
    const form = modal.querySelector('form') || modal;
    
    // 表面画像データ用の隠しフィールド
    const frontDataField = document.createElement('input');
    frontDataField.type = 'hidden';
    frontDataField.id = 'dual-front-image-data';
    frontDataField.name = 'frontImageData';
    form.appendChild(frontDataField);
    
    // 裏面画像データ用の隠しフィールド
    const backDataField = document.createElement('input');
    backDataField.type = 'hidden';
    backDataField.id = 'dual-back-image-data';
    backDataField.name = 'backImageData';
    form.appendChild(backDataField);
    
    // 写真タイプを示す隠しフィールド
    const photoTypeField = document.createElement('input');
    photoTypeField.type = 'hidden';
    photoTypeField.id = 'photo-type-field';
    photoTypeField.name = 'photoTypeField';
    photoTypeField.value = 'dual'; // 表裏モード
    form.appendChild(photoTypeField);
    
    console.log('表裏画像用の隠しフィールドを追加しました');
  }
  
  /**
   * 表面画像データを保存
   */
  function saveFrontImageData(modal, dataUrl) {
    const frontDataField = modal.querySelector('#dual-front-image-data');
    if (frontDataField) {
      frontDataField.value = dataUrl;
    }
  }
  
  /**
   * 裏面画像データを保存
   */
  function saveBackImageData(modal, dataUrl) {
    const backDataField = modal.querySelector('#dual-back-image-data');
    if (backDataField) {
      backDataField.value = dataUrl;
    }
  }
  
  /**
   * 写真状態表示の更新
   */
  function updatePhotoStatusElement(modal) {
    // 表面と裏面のファイルが設定されているか確認
    const frontFile = modal._frontFile;
    const backFile = modal._backFile;
    
    const photoStatus = modal.querySelector('.photo-status') || 
                        modal.querySelector('.photo-container .text-muted');
    
    if (photoStatus) {
      if (frontFile && backFile) {
        photoStatus.textContent = '表面と裏面の写真が設定されました';
        photoStatus.style.color = 'green';
      } else if (frontFile) {
        photoStatus.textContent = '表面の写真のみ設定されています。裏面も必要です。';
        photoStatus.style.color = 'orange';
      } else {
        photoStatus.textContent = '写真が未設定です';
        photoStatus.style.color = '';
      }
    }
  }
})();