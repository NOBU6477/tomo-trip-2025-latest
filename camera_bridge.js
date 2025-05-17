/**
 * カメラ関連の各種スクリプトを連携させるためのブリッジスクリプト
 * 簡単なインターフェースを提供し、異なるカメラ実装間の連携を可能にする
 */
(function() {
  'use strict';
  
  // グローバルカメラ連携インターフェース
  window.cameraInterface = {
    // 現在の写真モード（'single', 'dual-front', 'dual-back'）
    mode: 'single',
    
    // 保存された写真
    photos: {
      single: null,
      front: null,
      back: null
    },
    
    // 現在のモーダル参照
    currentModal: null,
    
    // 2段階フローの状態
    dualFlowActive: false,
    
    // コールバック
    onPhotoTaken: null,
    onDualPhotoComplete: null
  };
  
  // DOM構築後に設定
  document.addEventListener('DOMContentLoaded', function() {
    setupCameraBridge();
  });
  
  /**
   * カメラブリッジのセットアップ
   */
  function setupCameraBridge() {
    console.log('カメラブリッジを初期化しています...');
    
    // グローバルインターフェース関数を提供
    window.showCamera = function(mode, callback) {
      console.log(`カメラを起動: ${mode}`);
      
      // モード設定 ('single', 'dual-front', 'dual-back')
      window.cameraInterface.mode = mode || 'single';
      window.cameraInterface.onPhotoTaken = callback;
      
      // 既存のカメラUIがあればそれを使用
      const cameraFunctions = [
        // document_camera_handler.js のカメラ関数
        window.openDocumentCamera,
        
        // direct_camera_handler.js のカメラ関数 
        window.showCameraModal,
        
        // document_camera_fixed.js のカメラ関数
        window.origShowCamera,
        
        // 他のカメラ実装
        window.openCamera
      ];
      
      // 最初に見つかった有効なカメラ関数を実行
      for (const fn of cameraFunctions) {
        if (typeof fn === 'function') {
          try {
            // パラメータを統一：表裏写真モードのとき適切な識別子を渡す
            if (window.cameraInterface.mode === 'dual-front') {
              fn('front');
            } else if (window.cameraInterface.mode === 'dual-back') {
              fn('back');
            } else {
              fn();
            }
            return;
          } catch (err) {
            console.error('カメラ関数の実行エラー:', err);
          }
        }
      }
      
      // 既存の関数が見つからない場合、フォールバックのカメラUIを表示
      showFallbackCamera();
    };
    
    // 既存のカメラキャプチャ関数をオーバーライド/拡張
    extendExistingCameraFunctions();
  }
  
  /**
   * 既存のカメラ関数を拡張
   */
  function extendExistingCameraFunctions() {
    // ドキュメントカメラハンドラの拡張
    if (typeof window.takePhoto === 'function') {
      const originalTakePhoto = window.takePhoto;
      window.takePhoto = function(stream, fileInput) {
        const result = originalTakePhoto.apply(this, arguments);
        
        // 表裏モードの連携
        if (window.cameraInterface.dualFlowActive) {
          if (window.cameraInterface.mode === 'dual-front') {
            window.cameraInterface.photos.front = fileInput.files[0];
            console.log('表面の写真を保存しました');
            
            // 裏面の写真撮影に移行
            setTimeout(function() {
              window.cameraInterface.mode = 'dual-back';
              window.showCamera('dual-back');
            }, 500);
          } 
          else if (window.cameraInterface.mode === 'dual-back') {
            window.cameraInterface.photos.back = fileInput.files[0];
            console.log('裏面の写真を保存しました');
            
            // 両方の写真が揃った場合、完了コールバックを呼び出す
            if (window.cameraInterface.onDualPhotoComplete && 
                window.cameraInterface.photos.front && 
                window.cameraInterface.photos.back) {
              window.cameraInterface.onDualPhotoComplete(
                window.cameraInterface.photos.front,
                window.cameraInterface.photos.back
              );
            }
          }
        }
        
        return result;
      };
    }
  }
  
  /**
   * フォールバックのカメラUI
   */
  function showFallbackCamera() {
    console.log('フォールバックカメラUIを表示します');
    
    const modalId = 'fallback-camera-modal-' + Date.now();
    const modalTitle = window.cameraInterface.mode === 'dual-front' ? '表面の写真を撮影' :
                      window.cameraInterface.mode === 'dual-back' ? '裏面の写真を撮影' : 
                      '写真を撮影';
    
    const modalHTML = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${modalTitle}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <video id="${modalId}-video" autoplay playsinline style="width: 100%; display: block;"></video>
                <canvas id="${modalId}-canvas" style="display: none;"></canvas>
                <div id="${modalId}-result" style="display: none; width: 100%;">
                  <img id="${modalId}-image" style="width: 100%;" />
                </div>
                <div class="text-center mt-2 camera-feedback"></div>
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
    
    // モーダル要素の参照を取得
    const cameraModal = document.getElementById(modalId);
    window.cameraInterface.currentModal = cameraModal;
    
    // BootstrapモーダルのJSインスタンスを作成
    const modal = new bootstrap.Modal(cameraModal);
    
    // 要素への参照を取得
    const video = document.getElementById(`${modalId}-video`);
    const canvas = document.getElementById(`${modalId}-canvas`);
    const result = document.getElementById(`${modalId}-result`);
    const capturedImage = document.getElementById(`${modalId}-image`);
    const captureBtn = document.getElementById(`${modalId}-capture`);
    const retakeBtn = document.getElementById(`${modalId}-retake`);
    const useBtn = document.getElementById(`${modalId}-use`);
    const feedbackDiv = cameraModal.querySelector('.camera-feedback');
    
    // フィードバック表示
    function showFeedback(message, type = 'info') {
      if (feedbackDiv) {
        feedbackDiv.innerHTML = `<div class="alert alert-${type} py-1 px-2">${message}</div>`;
      }
    }
    
    // カメラ起動
    let stream = null;
    showFeedback('カメラを起動しています...', 'info');
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(mediaStream) {
        stream = mediaStream;
        video.srcObject = mediaStream;
        video.onloadedmetadata = function() {
          video.play();
          showFeedback('カメラの準備ができました。撮影ボタンを押してください', 'success');
        };
      })
      .catch(function(err) {
        console.error('カメラアクセスエラー:', err);
        showFeedback('カメラにアクセスできません: ' + err.message, 'danger');
      });
    
    // 撮影ボタン
    captureBtn.addEventListener('click', function() {
      if (!stream) {
        showFeedback('カメラが利用できません', 'danger');
        return;
      }
      
      // キャンバスをビデオのサイズに設定
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // ビデオフレームをキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像をDataURLとして取得
      const imageDataURL = canvas.toDataURL('image/png');
      capturedImage.src = imageDataURL;
      
      // 表示を切り替え
      video.style.display = 'none';
      result.style.display = 'block';
      captureBtn.style.display = 'none';
      retakeBtn.style.display = 'inline-block';
      useBtn.style.display = 'inline-block';
      
      showFeedback('写真を撮影しました！確認してください', 'success');
    });
    
    // 撮り直しボタン
    retakeBtn.addEventListener('click', function() {
      // 表示を元に戻す
      video.style.display = 'block';
      result.style.display = 'none';
      captureBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      useBtn.style.display = 'none';
      
      showFeedback('もう一度撮影してください', 'info');
    });
    
    // 使用ボタン
    useBtn.addEventListener('click', function() {
      // キャンバスからBlobを作成
      canvas.toBlob(function(blob) {
        // ファイル名を現在のモードに応じて変更
        const fileName = window.cameraInterface.mode === 'dual-front' ? 'front.png' :
                        window.cameraInterface.mode === 'dual-back' ? 'back.png' : 
                        'photo.png';
        
        // BlobからFileオブジェクトを作成
        const file = new File([blob], fileName, { type: 'image/png' });
        
        // 適切な場所に保存
        if (window.cameraInterface.mode === 'single') {
          window.cameraInterface.photos.single = file;
          
          // コールバックがあれば呼び出す
          if (typeof window.cameraInterface.onPhotoTaken === 'function') {
            window.cameraInterface.onPhotoTaken(file);
          }
        } 
        else if (window.cameraInterface.mode === 'dual-front') {
          window.cameraInterface.photos.front = file;
          console.log('表面の写真を保存しました');
          
          // バックモードへ移行の設定
          setTimeout(function() {
            window.cameraInterface.mode = 'dual-back';
            // モーダルを閉じた後に裏面撮影を開始
            modal.hide();
            
            setTimeout(function() {
              window.showCamera('dual-back');
            }, 500);
          }, 500);
        } 
        else if (window.cameraInterface.mode === 'dual-back') {
          window.cameraInterface.photos.back = file;
          console.log('裏面の写真を保存しました');
          
          // 両方の写真が揃った場合、完了コールバックを呼び出す
          if (typeof window.cameraInterface.onDualPhotoComplete === 'function' && 
              window.cameraInterface.photos.front) {
            window.cameraInterface.onDualPhotoComplete(
              window.cameraInterface.photos.front,
              window.cameraInterface.photos.back
            );
          }
        }
        
        // モーダルを閉じる
        modal.hide();
      }, 'image/png');
    });
    
    // モーダルが閉じられたときのクリーンアップ
    cameraModal.addEventListener('hidden.bs.modal', function() {
      // カメラストリームを停止
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // 裏面モードへの移行でなければDOMから削除
      if (window.cameraInterface.mode !== 'dual-front') {
        setTimeout(function() {
          if (document.body.contains(cameraModal)) {
            document.body.removeChild(cameraModal);
          }
        }, 300);
      }
    });
    
    // モーダルを表示
    modal.show();
  }
})();