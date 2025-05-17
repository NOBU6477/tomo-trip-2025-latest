/**
 * カメラアクセスがブロックされた場合のフォールバック機能
 * 撮影モーダルが動作しない場合にネイティブのファイル選択UIにフォールバック
 */
(function() {
  'use strict';
  
  // DOMの読み込みが完了したら初期化
  document.addEventListener('DOMContentLoaded', init);
  
  // 最後に使用したモーダルと関連するファイル入力要素
  let lastCameraModal = null;
  let lastFileInput = null;
  
  /**
   * 初期化
   */
  function init() {
    console.log('カメラフォールバック機能を初期化しています...');
    
    // カメラモーダルの表示イベントを監視
    document.body.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // カメラモーダルであるかどうか確認
      if (isModalCamera(modal)) {
        console.log('カメラモーダル検出:', modal.id);
        monitorCameraModal(modal);
      }
    });
    
    // カメラエラーイベントをリッスン
    document.addEventListener('camera-error', function(event) {
      console.log('カメラエラーを検知:', event.detail);
      activateFallback();
    });
    
    // すでに表示されているカメラモーダルがあれば監視を開始
    document.querySelectorAll('.modal.show').forEach(modal => {
      if (isModalCamera(modal)) {
        monitorCameraModal(modal);
      }
    });
  }
  
  /**
   * カメラモーダルの状態を監視
   * @param {HTMLElement} modal カメラモーダル
   */
  function monitorCameraModal(modal) {
    lastCameraModal = modal;
    
    // ターゲット入力要素を保存
    const targetInputId = modal.getAttribute('data-target-input');
    if (targetInputId) {
      lastFileInput = document.getElementById(targetInputId);
    } else {
      // IDが指定されていない場合は他の方法で探す
      const fileInputs = document.querySelectorAll('input[type="file"]');
      for (const input of fileInputs) {
        if (input.getAttribute('data-camera-active') === 'true') {
          lastFileInput = input;
          break;
        }
      }
    }
    
    console.log('カメラモーダルを監視中:', modal.id, 'ターゲット:', lastFileInput ? lastFileInput.id : 'なし');
    
    // カメラ要素を監視
    const video = modal.querySelector('video');
    if (video) {
      setTimeout(() => checkCameraState(modal, video), 3000);
    }
    
    // エラーメッセージを監視
    const errorMessages = modal.querySelectorAll('.alert-danger, .alert-warning');
    if (errorMessages.length > 0) {
      console.log('エラーメッセージを検出:', errorMessages[0].textContent);
      setTimeout(activateFallback, 1000);
    }
  }
  
  /**
   * カメラの状態をチェック
   * @param {HTMLElement} modal モーダル要素
   * @param {HTMLVideoElement} video ビデオ要素
   */
  function checkCameraState(modal, video) {
    if (!video.srcObject || !video.played || video.played.length === 0) {
      console.warn('カメラストリームが再生されていません');
      
      // フィードバックメッセージを表示
      const feedbackElement = modal.querySelector('.camera-feedback, .feedback-message');
      if (feedbackElement && !feedbackElement.classList.contains('alert-success')) {
        feedbackElement.textContent = 'カメラにアクセスできません。ファイル選択に切り替えます...';
        feedbackElement.className = 'alert alert-warning camera-feedback mt-2';
        
        // フォールバックをトリガー
        setTimeout(activateFallback, 2000);
      }
    } else {
      console.log('カメラストリームは正常に再生中です');
    }
  }
  
  /**
   * カメラエラーを処理
   * @param {CustomEvent} event カスタムイベント
   */
  function handleCameraError(event) {
    console.error('カメラエラー:', event.detail);
    activateFallback();
  }
  
  /**
   * フォールバックを有効化する
   */
  function activateFallback() {
    console.log('フォールバックを実行...');
    
    // 直近のファイル入力があれば
    if (lastFileInput) {
      const fileInput = lastFileInput;
      console.log('ファイル入力にフォールバック:', fileInput.id);
      
      // モーダルを閉じる
      if (lastCameraModal) {
        const modalInstance = bootstrap.Modal.getInstance(lastCameraModal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
      
      // ストリームを停止（可能であれば）
      if (window.mobileCameraFix && typeof window.mobileCameraFix.stopCameraStream === 'function') {
        window.mobileCameraFix.stopCameraStream();
      }
      
      // ネイティブファイル選択に切り替え
      setTimeout(() => {
        // captureを削除して標準のファイル選択UIを使用
        fileInput.removeAttribute('capture');
        fileInput.setAttribute('accept', 'image/*');
        fileInput.click();
      }, 500);
    } else {
      console.warn('フォールバック用のファイル入力要素が見つかりません');
      
      // すべてのファイル入力を探してみる
      const allFileInputs = document.querySelectorAll('input[type="file"]:not([disabled])');
      if (allFileInputs.length > 0) {
        console.log('利用可能なファイル入力を使用:', allFileInputs[0].id);
        activateFileInput(allFileInputs[0]);
      }
    }
  }
  
  /**
   * ファイル入力要素を起動
   * @param {HTMLInputElement} fileInput ファイル入力要素
   */
  function activateFileInput(fileInput) {
    fileInput.removeAttribute('capture');
    fileInput.setAttribute('accept', 'image/*');
    
    // クリックを遅延させて実行
    setTimeout(() => {
      fileInput.click();
    }, 300);
  }
  
  /**
   * モーダルがカメラ関連かどうかを判定
   * @param {HTMLElement} modal モーダル要素
   * @returns {boolean} カメラモーダルかどうか
   */
  function isModalCamera(modal) {
    // IDに基づく確認
    if (modal.id && (
      modal.id.includes('camera') || 
      modal.id.includes('Camera') || 
      modal.id.includes('photo')
    )) {
      return true;
    }
    
    // クラスに基づく確認
    if (modal.classList.contains('camera-modal')) {
      return true;
    }
    
    // コンテンツに基づく確認
    return !!modal.querySelector('video') || 
           !!modal.querySelector('[id*="camera"]') ||
           !!modal.querySelector('.camera-container');
  }
  
  // 外部からアクセスできるようにグローバル変数に設定
  window.cameraFallback = {
    activateFallback: activateFallback,
    isModalCamera: isModalCamera
  };
})();