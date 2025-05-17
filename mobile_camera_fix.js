/**
 * モバイルデバイスのカメラ撮影機能を修正するスクリプト
 * スマートフォンでのカメラアクセスと画像取得の問題を解決
 * 真っ黒な画面になる問題を修正
 */
(function() {
  'use strict';

  // DOMの読み込みが完了したら初期化
  document.addEventListener('DOMContentLoaded', initMobileCameraFix);

  let lastAccessedCamera = null; // 最後にアクセスしたカメラストリームを保持

  /**
   * 初期化
   */
  function initMobileCameraFix() {
    console.log('モバイルカメラ修正を初期化しています...');
    
    // モーダル表示イベントを監視
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // IDドキュメントモーダルのカメラボタンを修正
      if (modal.id === 'idDocumentModal' || modal.id === 'touristRegisterModal') {
        setupCameraButtons(modal);
      }
      
      // カメラモーダル自体の設定 - 表示時に自動的にカメラを初期化
      if (modal.id === 'cameraModal') {
        setupCaptureButton(modal);
        // モーダル表示時に自動的にカメラを初期化
        initializeCameraInModal(modal);
      }
    });
    
    // カメラモーダルの閉じるイベントを監視
    document.addEventListener('hidden.bs.modal', function(event) {
      const modal = event.target;
      if (modal.id === 'cameraModal') {
        stopCameraStream();
      }
    });
    
    // 既存のモーダル内のカメラボタンを修正
    document.querySelectorAll('#idDocumentModal, #touristRegisterModal').forEach(function(modal) {
      setupCameraButtons(modal);
    });
    
    // ファイル入力要素の変更を監視して転送を強制
    monitorFileInputs();
    
    // カメラモーダル作成ボタンを監視
    document.addEventListener('click', function(event) {
      // カメラボタンクリック
      if (event.target.classList.contains('camera-btn') || 
          event.target.classList.contains('document-camera') ||
          event.target.closest('.camera-btn') || 
          event.target.closest('.document-camera')) {
        
        // 既存のモーダルがすでに存在する場合はそれを使用
        const existingModal = document.getElementById('cameraModal');
        if (existingModal) {
          const button = event.target.classList.contains('camera-btn') || event.target.classList.contains('document-camera') 
            ? event.target 
            : (event.target.closest('.camera-btn') || event.target.closest('.document-camera'));
          
          const targetInput = findTargetFileInput(button);
          if (targetInput) {
            // ターゲット入力要素をモーダルに関連付け
            existingModal.setAttribute('data-target-input', targetInput.id);
            
            // モーダルを開く前にIDを付与
            const bsModal = new bootstrap.Modal(existingModal);
            bsModal.show();
          }
        }
      }
    });
    
    // 既存のunified_camera_handlerとの連携
    hookIntoExistingCameraHandlers();
  }

  /**
   * 既存のカメラハンドラーと連携
   */
  function hookIntoExistingCameraHandlers() {
    // オリジナルのcameraModalのオープン関数をフック
    if (window.initializeCamera) {
      const originalInitializeCamera = window.initializeCamera;
      window.initializeCamera = function(fileInput) {
        // モバイルデバイスの場合は我々のロジックを優先
        if (isMobileDevice()) {
          // カメラモーダルのtarget inputを設定
          const cameraModal = document.getElementById('cameraModal');
          if (cameraModal && fileInput) {
            cameraModal.setAttribute('data-target-input', fileInput.id);
            
            // モバイル対応のカメラ初期化
            initializeCameraInModal(cameraModal);
            return true;
          }
        }
        
        // モバイルでない場合は元の実装を呼び出す
        return originalInitializeCamera.apply(this, arguments);
      };
    }
    
    // オリジナルのcapturePhoto関数をフック
    if (window.capturePhoto) {
      const originalCapturePhoto = window.capturePhoto;
      window.capturePhoto = function(video, modal) {
        // モバイルデバイスの場合は我々のロジックを優先
        if (isMobileDevice() && modal) {
          return captureAndProcessImage(video, modal);
        }
        
        // モバイルでない場合は元の実装を呼び出す
        return originalCapturePhoto.apply(this, arguments);
      };
    }
  }

  /**
   * カメラボタンの設定
   * @param {HTMLElement} modal モーダル要素
   */
  function setupCameraButtons(modal) {
    // モーダル内のすべてのカメラボタンを取得
    const cameraButtons = modal.querySelectorAll('.document-camera, .camera-btn');
    
    cameraButtons.forEach(function(button) {
      // すでに設定済みなら処理しない
      if (button.hasAttribute('data-mobile-camera-fix')) return;
      
      // マーカーを設定
      button.setAttribute('data-mobile-camera-fix', 'true');
      
      // イベントリスナーを設定
      button.addEventListener('click', function(event) {
        // デフォルトのイベント処理を停止
        event.preventDefault();
        event.stopPropagation();
        
        // 関連するファイル入力要素を特定
        let targetInput = findTargetFileInput(button);
        
        if (targetInput) {
          // モバイルデバイスの場合はネイティブカメラUIを使用
          if (isMobileDevice() && preferNativeCamera()) {
            activateMobileCamera(targetInput);
          } else {
            // カスタムカメラモーダルを使用
            showCameraModal(targetInput);
          }
        } else {
          console.error('関連するファイル入力要素が見つかりません');
        }
        
        return false;
      });
    });
    
    console.log('カメラボタンを設定しました');
  }

  /**
   * ネイティブカメラを優先するかどうか
   * 特定の条件に基づいて判断
   */
  function preferNativeCamera() {
    // iOS SafariではJavaScriptカメラよりネイティブカメラUIの方が安定している
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent)) {
      return true;
    }
    
    // Android Chromeでは古いバージョンでカメラAPIに問題があることが多い
    // デフォルトではファイル選択にフォールバック
    return false;
  }

  /**
   * カメラモーダルを表示
   * @param {HTMLInputElement} targetInput 対象のファイル入力要素
   */
  function showCameraModal(targetInput) {
    // 既存のカメラモーダルを取得または作成
    let cameraModal = document.getElementById('cameraModal');
    
    if (!cameraModal) {
      // カメラモーダルが存在しない場合は作成
      cameraModal = createCameraModal();
      document.body.appendChild(cameraModal);
    }
    
    // ターゲット入力要素をモーダルに関連付け
    if (targetInput) {
      cameraModal.setAttribute('data-target-input', targetInput.id);
    }
    
    // モーダルを開く
    const bsModal = new bootstrap.Modal(cameraModal);
    bsModal.show();
  }

  /**
   * カメラモーダルを作成
   * @returns {HTMLElement} カメラモーダル要素
   */
  function createCameraModal() {
    const modal = document.createElement('div');
    modal.id = 'cameraModal';
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'cameraModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="cameraModalLabel">写真を撮影</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <div class="camera-container">
              <video id="cameraPreview" class="w-100" autoplay playsinline></video>
              <canvas id="cameraCanvas" class="d-none"></canvas>
            </div>
            <div class="camera-feedback mt-2 d-none"></div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" id="captureButton" class="btn btn-primary btn-lg">
              <i class="fas fa-camera me-2"></i>撮影する
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  /**
   * モーダル内のカメラを初期化
   * @param {HTMLElement} modal カメラモーダル
   */
  function initializeCameraInModal(modal) {
    const video = modal.querySelector('#cameraPreview');
    const captureButton = modal.querySelector('#captureButton');
    
    if (!video || !captureButton) return;
    
    // 撮影ボタンを無効化（カメラ起動まで）
    captureButton.disabled = true;
    
    // フィードバック表示
    showCameraFeedback(modal, 'カメラへアクセスしています...', 'info');
    
    // 以前のストリームがあれば停止
    stopCameraStream();
    
    // カメラが使用可能か確認
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('このブラウザはカメラAPIに対応していません');
      showCameraFeedback(modal, 'お使いのブラウザはカメラ機能に対応していません。', 'danger');
      
      // カスタムエラーイベントを発火
      if (window.dispatchCameraError) {
        window.dispatchCameraError({ message: 'カメラAPIに非対応のブラウザ' });
      }
      
      return;
    }

    // モバイルデバイスかどうかでカメラオプションを分岐
    let constraints;
    
    if (isMobileDevice()) {
      constraints = getMobileOptimizedConstraints();
    } else {
      constraints = getDesktopConstraints();
    }
    
    console.log('カメラ設定:', JSON.stringify(constraints));
    
    try {
      // カメラアクセス
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          console.log('カメラアクセス成功:', stream.getVideoTracks()[0].label);
          
          // ビデオ要素にストリームを設定
          video.srcObject = stream;
          lastAccessedCamera = stream;
          
          // フィードバックメッセージを消去
          clearCameraFeedback(modal);
          
          // カメラが実際に起動したことを確認するタイマー
          let videoStartTimeout = setTimeout(() => {
            console.warn('ビデオ開始タイムアウト - カメラが起動していない可能性があります');
            fallbackToNativeInput(modal);
          }, 5000);
          
          // ビデオが読み込まれたらタイマーをクリア
          video.onloadedmetadata = function() {
            clearTimeout(videoStartTimeout);
            captureButton.disabled = false;
            
            video.play()
              .then(() => {
                console.log('ビデオ再生開始');
              })
              .catch(err => {
                console.error('ビデオ再生エラー:', err);
                showCameraFeedback(modal, 'ビデオの再生に失敗しました。ファイル選択に切り替えます...', 'warning');
                fallbackToNativeInput(modal);
              });
          };
          
          // 再生開始時
          video.onplaying = function() {
            console.log('ビデオ再生中');
            clearTimeout(videoStartTimeout);
          };
          
          // 撮影ボタンのイベント設定
          captureButton.onclick = function() {
            captureAndProcessImage(video, modal);
          };
        })
        .catch(function(error) {
          console.error('カメラアクセスエラー:', error);
          
          // エラー内容によって異なるメッセージを表示
          let errorMessage = 'カメラにアクセスできませんでした。';
          
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage = 'カメラへのアクセス許可が拒否されました。ブラウザの設定を確認してください。';
          } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage = 'カメラデバイスが見つかりませんでした。';
          } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage = 'カメラを起動できませんでした。他のアプリがカメラを使用中かもしれません。';
          } else if (error.name === 'OverconstrainedError') {
            errorMessage = '要求されたカメラ設定は対応していません。';
          }
          
          // エラーメッセージを表示
          showCameraFeedback(modal, errorMessage + ' ファイル選択に切り替えます...', 'warning');
          
          // カスタムエラーイベントを発火
          if (window.dispatchCameraError) {
            window.dispatchCameraError({ message: errorMessage, error: error });
          }
          
          // 少し待ってからファイル選択に切り替え
          setTimeout(() => {
            fallbackToNativeInput(modal);
          }, 2000);
        });
    } catch (error) {
      console.error('カメラ初期化例外:', error);
      showCameraFeedback(modal, 'カメラの初期化中にエラーが発生しました。ファイル選択に切り替えます...', 'danger');
      
      setTimeout(() => {
        fallbackToNativeInput(modal);
      }, 1500);
    }
  }
  
  /**
   * モバイルデバイスに最適化されたカメラ設定を取得
   * デバイスによって設定を調整
   */
  function getMobileOptimizedConstraints() {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    // 基本的な設定
    const baseConstraints = {
      video: {
        facingMode: 'environment', // 背面カメラを優先
        width: { ideal: 1024 },
        height: { ideal: 768 }
      },
      audio: false
    };
    
    // iOS固有の設定
    if (isIOS) {
      // iOSではより低い解像度から開始
      baseConstraints.video.width = { ideal: 640 };
      baseConstraints.video.height = { ideal: 480 };
    }
    
    // Android固有の設定
    if (isAndroid) {
      // 古いAndroidデバイスでは特定の制約が必要
      baseConstraints.video.width = { ideal: 800 };
      baseConstraints.video.height = { ideal: 600 };
    }
    
    return baseConstraints;
  }
  
  /**
   * デスクトップに最適化されたカメラ設定を取得
   */
  function getDesktopConstraints() {
    return {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
  }
  
  /**
   * ネイティブのファイル入力UIに切り替える
   */
  function fallbackToNativeInput(modal) {
    // ターゲット入力要素を取得
    const targetInputId = modal.getAttribute('data-target-input');
    if (!targetInputId) {
      console.error('ターゲット入力要素IDが見つかりません');
      return;
    }
    
    const fileInput = document.getElementById(targetInputId);
    if (!fileInput) {
      console.error('ターゲット入力要素が見つかりません:', targetInputId);
      return;
    }
    
    // モーダルを閉じる
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
    
    // ストリームを停止
    stopCameraStream();
    
    // ファイル入力の設定
    fileInput.setAttribute('accept', 'image/*');
    fileInput.removeAttribute('capture'); // captureを削除して標準のファイル選択UIを使用
    
    // 少し遅延させてからファイル選択UIを表示
    setTimeout(() => {
      fileInput.click();
    }, 500);
    
    console.log('ネイティブファイル選択UIに切り替えました');
  }

  /**
   * キャプチャボタンの設定
   * @param {HTMLElement} modal カメラモーダル
   */
  function setupCaptureButton(modal) {
    const captureButton = modal.querySelector('#captureButton');
    if (!captureButton) return;
    
    // すでに設定済みなら処理しない
    if (captureButton.hasAttribute('data-mobile-camera-fix')) return;
    
    // マーカーを設定
    captureButton.setAttribute('data-mobile-camera-fix', 'true');
    
    // 撮影ボタンのクリックイベントを設定
    captureButton.onclick = function() {
      const video = modal.querySelector('#cameraPreview');
      if (video && video.srcObject) {
        captureAndProcessImage(video, modal);
      } else {
        console.error('ビデオストリームが見つかりません');
        showCameraFeedback(modal, 'カメラの準備ができていません', 'danger');
      }
    };
  }

  /**
   * カメラストリームを停止
   */
  function stopCameraStream() {
    if (lastAccessedCamera) {
      lastAccessedCamera.getTracks().forEach(track => track.stop());
      lastAccessedCamera = null;
      console.log('カメラストリームを停止しました');
    }
  }

  /**
   * フィードバックメッセージを表示
   * @param {HTMLElement} modal モーダル要素
   * @param {string} message メッセージ
   * @param {string} type メッセージタイプ（info, success, warning, danger）
   */
  function showCameraFeedback(modal, message, type = 'info') {
    const feedbackEl = modal.querySelector('.camera-feedback');
    if (feedbackEl) {
      feedbackEl.innerHTML = message;
      feedbackEl.className = `camera-feedback mt-2 alert alert-${type}`;
      feedbackEl.classList.remove('d-none');
    }
  }

  /**
   * フィードバックメッセージをクリア
   * @param {HTMLElement} modal モーダル要素
   */
  function clearCameraFeedback(modal) {
    const feedbackEl = modal.querySelector('.camera-feedback');
    if (feedbackEl) {
      feedbackEl.innerHTML = '';
      feedbackEl.classList.add('d-none');
    }
  }

  /**
   * モバイルデバイスかどうかを判定
   * @returns {boolean} モバイルデバイスかどうか
   */
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * 関連するファイル入力要素を探す
   * @param {HTMLElement} button カメラボタン
   * @returns {HTMLInputElement|null} ファイル入力要素
   */
  function findTargetFileInput(button) {
    // ボタンのdata-target-input属性を確認
    if (button.dataset.targetInput) {
      return document.getElementById(button.dataset.targetInput);
    }
    
    // 親要素からファイル入力を探す
    const parent = button.closest('.input-group, .document-upload-section, .form-group');
    if (parent) {
      return parent.querySelector('input[type="file"]');
    }
    
    return null;
  }

  /**
   * モバイルカメラを起動（ネイティブUIを使用）
   * @param {HTMLInputElement} fileInput ファイル入力要素
   */
  function activateMobileCamera(fileInput) {
    console.log('モバイルネイティブカメラを起動します');
    
    // ファイル入力のacceptとcapture属性を設定
    fileInput.setAttribute('accept', 'image/*');
    
    // iOSとAndroidの違いに対応
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // iOS: カメラへの直接アクセスを可能にするがファイル選択も許可
      fileInput.removeAttribute('capture');
    } else {
      // Android: 環境カメラを使用
      fileInput.setAttribute('capture', 'environment');
    }
    
    // mobileAccessフラグを設定
    fileInput.setAttribute('data-mobile-access', 'true');
    
    // クリックを発火してネイティブのカメラUIを表示
    fileInput.click();
  }

  /**
   * 画像をキャプチャして処理
   * @param {HTMLVideoElement} video ビデオ要素
   * @param {HTMLElement} modal モーダル要素
   */
  function captureAndProcessImage(video, modal) {
    if (!video || !video.srcObject) {
      console.error('有効なビデオストリームがありません');
      showCameraFeedback(modal, 'カメラが準備できていません', 'danger');
      return;
    }
    
    const canvas = modal.querySelector('#cameraCanvas') || document.createElement('canvas');
    
    // キャンバスのサイズをビデオサイズに設定
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (canvas.width === 0 || canvas.height === 0) {
      console.error('ビデオの次元が無効です:', video.videoWidth, video.videoHeight);
      showCameraFeedback(modal, 'カメラの解像度を取得できませんでした', 'danger');
      return;
    }
    
    try {
      // ビデオフレームをキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 処理中メッセージ
      showCameraFeedback(modal, '画像を処理しています...', 'info');
      
      // 画像データをBlobに変換
      canvas.toBlob(function(blob) {
        if (!blob) {
          console.error('キャンバスからBlobを生成できませんでした');
          showCameraFeedback(modal, '画像の処理に失敗しました', 'danger');
          return;
        }
        
        // ファイル名を生成
        const fileName = `mobile_photo_${Date.now()}.jpg`;
        
        // Fileオブジェクトを作成
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // 関連するファイル入力要素を取得
        const targetInputId = modal.getAttribute('data-target-input');
        const fileInput = document.getElementById(targetInputId);
        
        if (fileInput) {
          try {
            // DataTransferオブジェクトを使用してFileListを作成
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            // 変更イベントを発火
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            console.log('画像をキャプチャし処理しました:', fileName);
            
            // モーダルを閉じる前に成功メッセージ
            showCameraFeedback(modal, '画像を正常にキャプチャしました', 'success');
            
            // 少し遅延してからモーダルを閉じる（ユーザーがメッセージを見れるように）
            setTimeout(() => {
              // モーダルを閉じる
              const modalInstance = bootstrap.Modal.getInstance(modal);
              if (modalInstance) {
                modalInstance.hide();
              }
            }, 1000);
            
            // プレビュー更新を強制
            forcePreviewUpdate(fileInput);
          } catch (error) {
            console.error('ファイル設定エラー:', error);
            showCameraFeedback(modal, 'ファイルの設定に失敗しました: ' + error.message, 'danger');
          }
        } else {
          console.error('ターゲット入力要素が見つかりません:', targetInputId);
          showCameraFeedback(modal, 'ターゲット入力要素が見つかりません', 'danger');
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('画像キャプチャエラー:', error);
      showCameraFeedback(modal, '画像のキャプチャに失敗しました: ' + error.message, 'danger');
    }
  }

  /**
   * ファイル入力の変更を監視
   */
  function monitorFileInputs() {
    // DOMの変更を監視してファイル入力を追跡
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 追加されたファイル入力要素を設定
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const fileInputs = node.querySelectorAll('input[type="file"]');
              fileInputs.forEach(setupFileInput);
            }
          });
        }
      });
    });
    
    // DOM監視を開始
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 既存のファイル入力要素を設定
    document.querySelectorAll('input[type="file"]').forEach(setupFileInput);
  }

  /**
   * ファイル入力要素を設定
   * @param {HTMLInputElement} input ファイル入力要素
   */
  function setupFileInput(input) {
    // すでに設定済みなら処理しない
    if (input.hasAttribute('data-file-handler-attached')) return;
    
    // マーカーを設定
    input.setAttribute('data-file-handler-attached', 'true');
    
    // 変更イベントで強制的にファイル変更イベントを発火
    input.addEventListener('change', function() {
      if (this.files && this.files.length > 0) {
        // モバイルアクセスフラグがある場合
        if (this.hasAttribute('data-mobile-access')) {
          console.log('モバイルカメラからファイルを受信:', this.files[0].name);
        }
        
        // プレビュー更新を強制
        forcePreviewUpdate(this);
      }
    });
  }

  /**
   * プレビュー更新を強制
   * @param {HTMLInputElement} fileInput ファイル入力要素
   */
  function forcePreviewUpdate(fileInput) {
    // ファイルが選択されていない場合は処理しない
    if (!fileInput.files || fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    
    // プレビュー要素を探す
    let previewElement = null;
    
    // data-preview属性があれば使用
    if (fileInput.dataset.preview) {
      previewElement = document.querySelector(fileInput.dataset.preview);
    } else {
      // IDからプレビュー要素を推測
      const inputId = fileInput.id;
      if (inputId) {
        previewElement = document.getElementById(`${inputId}-preview`);
      }
    }
    
    if (!previewElement) {
      // 親要素からプレビュー要素を探す
      const parent = fileInput.closest('.document-upload-section, .input-group, .form-group');
      if (parent) {
        previewElement = parent.querySelector('.preview-container');
      }
    }
    
    // プレビュー要素が見つかった場合
    if (previewElement) {
      updatePreview(previewElement, file);
    }
  }

  /**
   * プレビューを更新
   * @param {HTMLElement} previewElement プレビュー要素
   * @param {File} file ファイル
   */
  function updatePreview(previewElement, file) {
    // FileReaderでファイルを読み込む
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // 画像プレビュー要素
      let imgElement = previewElement.querySelector('img');
      
      // 画像要素がなければ作成
      if (!imgElement) {
        imgElement = document.createElement('img');
        previewElement.appendChild(imgElement);
      }
      
      // 画像ソースを設定
      imgElement.src = e.target.result;
      imgElement.alt = file.name;
      imgElement.className = 'preview-image';
      
      // プレビュー要素を表示
      previewElement.style.display = 'block';
      
      // zoom-in効果を追加
      if (!imgElement.classList.contains('preview-zoomable')) {
        imgElement.classList.add('preview-zoomable');
      }
      
      console.log('プレビューを更新しました');
      
      // 変更イベントを発火
      previewElement.dispatchEvent(new CustomEvent('preview-updated', {
        bubbles: true,
        detail: { file: file }
      }));
    };
    
    // ファイルをDataURLとして読み込む
    reader.readAsDataURL(file);
  }

  // 外部からアクセスできるようにグローバル変数に設定
  window.mobileCameraFix = {
    activateMobileCamera: activateMobileCamera,
    forcePreviewUpdate: forcePreviewUpdate,
    initializeCameraInModal: initializeCameraInModal,
    captureAndProcessImage: captureAndProcessImage,
    stopCameraStream: stopCameraStream,
    fallbackToNativeInput: fallbackToNativeInput
  };
})();