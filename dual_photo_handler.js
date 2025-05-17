/**
 * 表裏写真を確実に処理するための最小限のスクリプト
 * 既存のUIは維持したまま、表裏写真の処理だけを追加
 */
(function() {
  'use strict';
  
  // DOMの準備ができたら実行
  document.addEventListener('DOMContentLoaded', function() {
    // モーダルの表示イベントを監視
    document.addEventListener('shown.bs.modal', function(event) {
      setTimeout(function() {
        setupDualPhotoMode(event.target);
      }, 300);
    });
    
    // 表裏写真モードの状態を保持
    window.dualPhotoMode = {
      enabled: false,
      frontPhoto: null,
      backPhoto: null,
      takingBack: false, // 裏面撮影中かどうか
      currentModal: null
    };
  });
  
  /**
   * 表裏写真モードの設定
   */
  function setupDualPhotoMode(modal) {
    if (!modal) return;
    
    try {
      console.log('表裏写真モードを検出中...');
      
      // 写真タイプのラジオボタンを探す
      const photoRadios = modal.querySelectorAll('input[type="radio"][name="photoType"]');
      if (photoRadios.length < 2) return;
      
      // 初期状態を設定
      window.dualPhotoMode.currentModal = modal;
      
      photoRadios.forEach(function(radio) {
        // ラジオボタンの状態を確認
        if (radio.checked) {
          const label = radio.nextSibling;
          const labelText = label ? label.textContent || '' : '';
          
          // 「表裏写真」のほうが選択されているか確認
          if (labelText.includes('表裏') || labelText.includes('運転免許証')) {
            enableDualPhotoMode(true);
          } else {
            enableDualPhotoMode(false);
          }
        }
        
        // クリックイベントを監視
        radio.addEventListener('change', function() {
          const label = this.nextSibling;
          const labelText = label ? label.textContent || '' : '';
          
          if (labelText.includes('表裏') || labelText.includes('運転免許証')) {
            enableDualPhotoMode(true);
          } else {
            enableDualPhotoMode(false);
          }
        });
      });
      
      // カメラボタンとファイル選択ボタンをオーバーライド
      const cameraButton = modal.querySelector('button:not(.btn-close):not(.close)');
      if (cameraButton && cameraButton.textContent.includes('カメラ')) {
        const originalClick = cameraButton.onclick;
        
        cameraButton.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          if (window.dualPhotoMode.enabled) {
            // 表裏写真モードの場合
            if (window.dualPhotoMode.takingBack) {
              // 裏面撮影中
              showBackPhotoCamera();
            } else {
              // 表面撮影
              showFrontPhotoCamera();
            }
          } else if (originalClick) {
            // 通常モード - 元のクリックイベントを呼び出し
            return originalClick.call(this, e);
          }
          
          return false;
        };
      }
    } catch (err) {
      console.error('表裏写真モードの設定中にエラーが発生しました:', err);
    }
  }
  
  /**
   * 表裏写真モードの有効/無効を切り替え
   */
  function enableDualPhotoMode(enable) {
    window.dualPhotoMode.enabled = enable;
    window.dualPhotoMode.frontPhoto = null;
    window.dualPhotoMode.backPhoto = null;
    window.dualPhotoMode.takingBack = false;
    
    const modal = window.dualPhotoMode.currentModal;
    if (!modal) return;
    
    // 写真プレビュー部分を探す
    const photoContainer = modal.querySelector('.photo-preview')?.parentNode ||
                          modal.querySelector('img[alt="写真プレビュー"]')?.parentNode;
    
    if (photoContainer) {
      // ステータスメッセージを表示するための要素を探す/作成する
      let statusElement = photoContainer.querySelector('.dual-photo-status');
      if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.className = 'dual-photo-status mt-2 text-info';
        photoContainer.appendChild(statusElement);
      }
      
      if (enable) {
        statusElement.textContent = '表裏写真モード: 表面から撮影してください';
        statusElement.style.display = 'block';
      } else {
        statusElement.style.display = 'none';
      }
    }
    
    console.log('表裏写真モード: ' + (enable ? '有効' : '無効'));
  }
  
  /**
   * 表面写真のカメラを表示
   */
  function showFrontPhotoCamera() {
    const modal = window.dualPhotoMode.currentModal;
    if (!modal) return;
    
    // 統合カメラインターフェースを使用
    if (typeof window.cameraInterface !== 'undefined') {
      // 表裏写真モードの設定
      window.cameraInterface.dualFlowActive = true;
      window.cameraInterface.mode = 'dual-front';
      window.cameraInterface.currentModal = modal;
      
      // 表裏写真が両方揃ったときのコールバック
      window.cameraInterface.onDualPhotoComplete = function(frontFile, backFile) {
        console.log('表裏写真が完了しました: 両方の写真を保存します');
        
        // 写真をグローバル状態に保存
        window.dualPhotoMode.frontPhoto = frontFile;
        window.dualPhotoMode.backPhoto = backFile;
        
        // ステータスを更新
        updateDualPhotoStatus();
        
        // 撮影完了のガイド表示
        const statusElement = modal.querySelector('.dual-photo-status');
        if (statusElement) {
          statusElement.textContent = '表裏写真モード: 表面と裏面の両方の写真が設定されました';
          statusElement.style.color = 'green';
        }
      };
      
      // 統合カメラインターフェースを呼び出し
      if (typeof window.showCamera === 'function') {
        window.showCamera('dual-front');
      }
    } else {
      // 既存のカメラモーダルのためにwindowスコープにパラメータを設定
      window.dualMode = true;
      window.dualPhotoMode.takingBack = false;
      
      // 既存のカメラモーダルを起動
      const cameraFunction = window.showCamera || window.openCamera;
      if (typeof cameraFunction === 'function') {
        // 表面写真用のパラメータを設定
        window.photoSide = 'front';
        cameraFunction();
      } else {
        // 既存の関数がない場合は独自に実装
        showSimpleCameraModal('表面', function(file) {
          // 表面写真を保存
          window.dualPhotoMode.frontPhoto = file;
          
          // ステータスを更新
          updateDualPhotoStatus();
          
          // 裏面の撮影を促す
          window.dualPhotoMode.takingBack = true;
          
          // 再度カメラボタンが押せるようにガイド表示
          const statusElement = modal.querySelector('.dual-photo-status');
          if (statusElement) {
            statusElement.textContent = '表裏写真モード: 次に裏面を撮影してください';
          }
        });
      }
    }
  }
  
  /**
   * 裏面写真のカメラを表示
   */
  function showBackPhotoCamera() {
    const modal = window.dualPhotoMode.currentModal;
    if (!modal) return;
    
    // 統合カメラインターフェースを使用
    if (typeof window.cameraInterface !== 'undefined') {
      // 裏面モードに設定
      window.cameraInterface.mode = 'dual-back';
      
      // 統合カメラインターフェースを呼び出し
      if (typeof window.showCamera === 'function') {
        window.showCamera('dual-back');
      }
    } else {
      // 既存のカメラモーダルのためにwindowスコープにパラメータを設定
      window.dualMode = true;
      window.dualPhotoMode.takingBack = true;
      
      // 既存のカメラモーダルを起動
      const cameraFunction = window.showCamera || window.openCamera;
      if (typeof cameraFunction === 'function') {
        // 裏面写真用のパラメータを設定
        window.photoSide = 'back';
        cameraFunction();
      } else {
        // 既存の関数がない場合は独自に実装
        showSimpleCameraModal('裏面', function(file) {
          // 裏面写真を保存
          window.dualPhotoMode.backPhoto = file;
          
          // ステータスを更新
          updateDualPhotoStatus();
          
          // 表面の撮影に戻る
          window.dualPhotoMode.takingBack = false;
        });
      }
    }
  }
  
  /**
   * 写真撮影後に状態を更新
   */
  function updateDualPhotoStatus() {
    const modal = window.dualPhotoMode.currentModal;
    if (!modal) return;
    
    const frontPhoto = window.dualPhotoMode.frontPhoto;
    const backPhoto = window.dualPhotoMode.backPhoto;
    
    // ステータスメッセージを表示するための要素を探す
    const statusElement = modal.querySelector('.dual-photo-status');
    if (statusElement) {
      if (frontPhoto && backPhoto) {
        statusElement.textContent = '表裏写真モード: 表面と裏面の両方の写真が設定されました';
        statusElement.style.color = 'green';
      } else if (frontPhoto) {
        statusElement.textContent = '表裏写真モード: 表面の写真のみ設定されています。裏面も撮影してください。';
        statusElement.style.color = '#ff9900';
      } else if (backPhoto) {
        statusElement.textContent = '表裏写真モード: 裏面の写真のみ設定されています。表面も撮影してください。';
        statusElement.style.color = '#ff9900';
      } else {
        statusElement.textContent = '表裏写真モード: 写真が未設定です';
        statusElement.style.color = '';
      }
    }
    
    // プレビュー画像を更新
    const previewImg = modal.querySelector('.photo-preview img') || 
                       modal.querySelector('img[alt="写真プレビュー"]') || 
                       modal.querySelector('img[alt="Photo Preview"]');
    
    if (previewImg) {
      if (frontPhoto) {
        // 表面写真をプレビューに表示
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImg.src = e.target.result;
          previewImg.style.display = 'block';
        };
        reader.readAsDataURL(frontPhoto);
        
        // 状態テキストを更新
        const statusText = modal.querySelector('.photo-status');
        if (statusText) {
          if (frontPhoto && backPhoto) {
            statusText.textContent = '表面と裏面の写真が設定されました';
          } else {
            statusText.textContent = '表面の写真が設定されました';
          }
        }
      }
      
      // 隠しフィールドの設定
      ensureHiddenFields(modal);
      
      // 通常のinput[type=file]に表面写真を設定（互換性のため）
      if (frontPhoto) {
        const fileInput = modal.querySelector('input[type="file"][accept="image/*"]');
        if (fileInput) {
          try {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(frontPhoto);
            fileInput.files = dataTransfer.files;
            
            // ファイル変更イベントを発火（既存のハンドラ用）
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
          } catch (err) {
            console.error('ファイル入力更新中のエラー:', err);
          }
        }
      }
      
      // 裏面写真を隠しフィールドに保存
      if (backPhoto) {
        const backPhotoField = modal.querySelector('#back-photo-field');
        if (backPhotoField) {
          const reader = new FileReader();
          reader.onload = function(e) {
            backPhotoField.value = e.target.result;
          };
          reader.readAsDataURL(backPhoto);
        }
      }
    }
  }
  
  /**
   * 隠しフィールドを作成
   */
  function ensureHiddenFields(modal) {
    // 既に隠しフィールドがあるか確認
    if (modal.querySelector('#back-photo-field')) return;
    
    // フォームを探す
    const form = modal.querySelector('form') || modal;
    
    // 裏面写真用の隠しフィールド
    const backPhotoField = document.createElement('input');
    backPhotoField.type = 'hidden';
    backPhotoField.id = 'back-photo-field';
    backPhotoField.name = 'backPhotoData';
    form.appendChild(backPhotoField);
    
    // 写真モード用の隠しフィールド
    const photoModeField = document.createElement('input');
    photoModeField.type = 'hidden';
    photoModeField.id = 'photo-mode-field';
    photoModeField.name = 'photoMode';
    photoModeField.value = 'dual';
    form.appendChild(photoModeField);
    
    console.log('裏面写真用の隠しフィールドを追加しました');
  }
  
  /**
   * シンプルなカメラモーダル
   */
  function showSimpleCameraModal(side, callback) {
    // カメラモーダルを作成
    const modalId = 'simple-camera-modal-' + Date.now();
    const modalHTML = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${side}の写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <video id="${modalId}-video" autoplay playsinline style="width: 100%; display: block;"></video>
                <canvas id="${modalId}-canvas" style="display: none;"></canvas>
                <div id="${modalId}-result" style="display: none; width: 100%;">
                  <img id="${modalId}-image" style="width: 100%;" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" id="${modalId}-capture" class="btn btn-primary">撮影</button>
              <button type="button" id="${modalId}-retake" class="btn btn-secondary" style="display: none;">撮り直す</button>
              <button type="button" id="${modalId}-use" class="btn btn-success" style="display: none;">この写真を使用</button>
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
    const cameraModal = document.getElementById(modalId);
    const modal = new bootstrap.Modal(cameraModal);
    
    // カメラ関連の要素
    const video = document.getElementById(`${modalId}-video`);
    const canvas = document.getElementById(`${modalId}-canvas`);
    const result = document.getElementById(`${modalId}-result`);
    const capturedImage = document.getElementById(`${modalId}-image`);
    
    // ボタン要素
    const captureBtn = document.getElementById(`${modalId}-capture`);
    const retakeBtn = document.getElementById(`${modalId}-retake`);
    const useBtn = document.getElementById(`${modalId}-use`);
    
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
        const file = new File([blob], `${side.toLowerCase()}-photo.png`, { type: 'image/png' });
        
        // コールバック関数を呼び出し
        if (typeof callback === 'function') {
          callback(file);
        }
        
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
  
  // 既存のカメラ処理に表裏写真モードのハンドリングを追加
  const originalFileChange = HTMLInputElement.prototype.dispatchEvent;
  HTMLInputElement.prototype.dispatchEvent = function(event) {
    const result = originalFileChange.call(this, event);
    
    // ファイル変更イベント後に表裏写真モードの状態を確認
    if (event.type === 'change' && this.type === 'file' && window.dualPhotoMode?.enabled) {
      setTimeout(function() {
        // 表裏写真モードが有効で、写真が設定された場合
        updateDualPhotoStatus();
      }, 100);
    }
    
    return result;
  };
})();