/**
 * カメラアクセスがブロックされた場合のフォールバック機能
 * 撮影モーダルが動作しない場合にネイティブのファイル選択UIにフォールバック
 */
(function() {
  'use strict';

  // DOMの読み込みが完了したら初期化
  document.addEventListener('DOMContentLoaded', init);

  // グローバル変数
  let lastClickedInput = null;
  let retryAttempts = {};

  /**
   * 初期化
   */
  function init() {
    console.log('カメラフォールバック機能を初期化しています...');
    
    // すべてのカメラボタンを監視
    document.addEventListener('click', function(event) {
      const cameraBtn = 
        event.target.classList.contains('camera-btn') || 
        event.target.classList.contains('document-camera') ||
        event.target.closest('.camera-btn') || 
        event.target.closest('.document-camera');
      
      if (cameraBtn) {
        const button = event.target.classList.contains('camera-btn') || event.target.classList.contains('document-camera')
          ? event.target
          : (event.target.closest('.camera-btn') || event.target.closest('.document-camera'));
        
        const fileInput = findFileInput(button);
        if (fileInput) {
          lastClickedInput = fileInput;
          
          // リトライカウントの初期化（存在しない場合）
          if (!retryAttempts[fileInput.id]) {
            retryAttempts[fileInput.id] = 0;
          }
        }
      }
    });
    
    // カメラモーダルが表示されたら監視を開始
    document.addEventListener('shown.bs.modal', function(event) {
      if (event.target.id === 'cameraModal') {
        monitorCameraModal(event.target);
      }
    });
    
    // 既存のモーダルが存在する場合は監視
    const existingModal = document.getElementById('cameraModal');
    if (existingModal) {
      monitorCameraModal(existingModal);
    }

    // エラーがあった場合のイベントリスナー
    window.addEventListener('camera-access-error', handleCameraError);
  }

  /**
   * カメラモーダルの状態を監視
   * @param {HTMLElement} modal カメラモーダル
   */
  function monitorCameraModal(modal) {
    // ビデオ要素を監視
    const videoElement = modal.querySelector('#cameraPreview');
    if (!videoElement) return;
    
    // 5秒後にカメラの状態をチェック
    setTimeout(() => {
      checkCameraState(modal, videoElement);
    }, 5000);
  }

  /**
   * カメラの状態をチェック
   * @param {HTMLElement} modal モーダル要素
   * @param {HTMLVideoElement} video ビデオ要素
   */
  function checkCameraState(modal, video) {
    // モーダルが表示されていない場合は処理しない
    if (modal.style.display === 'none' || !modal.classList.contains('show')) {
      return;
    }
    
    // ストリームが正常かチェック
    const isStreamActive = video.srcObject && 
      video.srcObject.active && 
      video.srcObject.getVideoTracks().length > 0 && 
      video.srcObject.getVideoTracks()[0].readyState === 'live';
    
    // ビデオの再生状態をチェック
    const isVideoPlaying = !video.paused && video.currentTime > 0;
    
    if (!isStreamActive || !isVideoPlaying) {
      console.warn('カメラストリームが正常に動作していません');
      
      // ユーザーへのフィードバック
      const feedbackEl = modal.querySelector('.camera-feedback');
      if (feedbackEl) {
        feedbackEl.innerHTML = 'カメラにアクセスできません。ファイル選択モードに切り替えます...';
        feedbackEl.className = 'camera-feedback mt-2 alert alert-warning';
        feedbackEl.classList.remove('d-none');
      }
      
      // 少し待ってからフォールバック処理
      setTimeout(() => {
        fallbackToFileInput(modal);
      }, 1500);
    }
  }

  /**
   * カメラエラーを処理
   * @param {CustomEvent} event カスタムイベント
   */
  function handleCameraError(event) {
    console.warn('カメラアクセスエラーイベントを検出:', event.detail);
    
    // モーダルが存在する場合
    const modal = document.getElementById('cameraModal');
    if (modal) {
      fallbackToFileInput(modal);
    } else if (lastClickedInput) {
      // モーダルが存在しない場合は直接ファイル選択
      activateFileInput(lastClickedInput);
    }
  }

  /**
   * ファイル入力要素を探す
   * @param {HTMLElement} button ボタン要素
   * @returns {HTMLInputElement|null} ファイル入力要素
   */
  function findFileInput(button) {
    // data-target-input属性を確認
    if (button.dataset.targetInput) {
      return document.getElementById(button.dataset.targetInput);
    }
    
    // 親要素からファイル入力を探す
    const parent = button.closest('.document-upload-section, .input-group, .form-group');
    if (parent) {
      return parent.querySelector('input[type="file"]');
    }
    
    return null;
  }

  /**
   * ファイル入力要素にフォールバック
   * @param {HTMLElement} modal モーダル要素
   */
  function fallbackToFileInput(modal) {
    let fileInput = null;
    
    // ターゲット入力要素IDがある場合
    const targetInputId = modal.getAttribute('data-target-input');
    if (targetInputId) {
      fileInput = document.getElementById(targetInputId);
    } else if (lastClickedInput) {
      // 最後にクリックされた入力要素
      fileInput = lastClickedInput;
    }
    
    // モーダルを閉じる
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
    
    if (fileInput) {
      activateFileInput(fileInput);
    }
  }

  /**
   * ファイル入力要素を起動
   * @param {HTMLInputElement} fileInput ファイル入力要素
   */
  function activateFileInput(fileInput) {
    // リトライカウントを増やす
    if (retryAttempts[fileInput.id] !== undefined) {
      retryAttempts[fileInput.id]++;
    } else {
      retryAttempts[fileInput.id] = 1;
    }
    
    // リトライが多すぎる場合はカメラモードを完全に無効化
    if (retryAttempts[fileInput.id] >= 2) {
      console.warn(`${fileInput.id} のカメラ機能を無効化します（${retryAttempts[fileInput.id]}回失敗）`);
      fileInput.setAttribute('data-camera-disabled', 'true');
    }
    
    // ファイル選択のみを許可する設定
    fileInput.removeAttribute('capture');
    fileInput.setAttribute('accept', 'image/*');
    
    // クリックしてファイル選択ダイアログを表示
    setTimeout(() => {
      fileInput.click();
    }, 500);
  }

  // 外部からアクセスできるようにグローバル変数に設定
  window.cameraFallback = {
    fallbackToFileInput,
    handleCameraError
  };

  // カスタムカメラエラーイベント
  window.dispatchCameraError = function(errorDetails) {
    window.dispatchEvent(new CustomEvent('camera-access-error', {
      detail: errorDetails
    }));
  };
})();