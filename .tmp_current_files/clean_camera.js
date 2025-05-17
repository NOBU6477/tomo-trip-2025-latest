/**
 * クリーンに再実装されたカメラ機能
 * シンプルでトラブルのない実装を目指します
 */
(function() {
  console.log('クリーンカメラ機能を初期化');
  
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', init);
  
  /**
   * 初期化処理
   */
  function init() {
    // カメラボタンのクリックイベントをカスタム処理に置き換え
    setupCameraButtons();
    
    // モーダルが表示されたときのイベントリスナー
    document.body.addEventListener('shown.bs.modal', function(e) {
      // モーダル内のカメラボタンを設定
      setTimeout(setupCameraButtons, 200);
    });
  }
  
  /**
   * カメラボタンのセットアップ
   */
  function setupCameraButtons() {
    // すべてのカメラボタンを検索
    const cameraButtons = document.querySelectorAll('.camera-button');
    
    cameraButtons.forEach(function(button) {
      // すでに処理済みならスキップ
      if (button.hasAttribute('data-camera-setup')) return;
      
      // 元のクリックイベントを削除するためクローン
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }
      
      // ターゲットIDを取得
      const targetId = newButton.getAttribute('data-target');
      if (!targetId) return;
      
      // クリックイベントリスナー
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(`カメラボタンがクリックされました: ${targetId}`);
        
        // シンプルなカメラモーダルを表示
        showCleanCameraModal(targetId);
      });
      
      // 処理済みとしてマーク
      newButton.setAttribute('data-camera-setup', 'true');
    });
  }
  
  /**
   * シンプルなカメラモーダルを表示
   */
  function showCleanCameraModal(targetId) {
    // ターゲットファイル入力を取得
    const fileInput = document.getElementById(targetId);
    if (!fileInput) {
      console.error(`ターゲット入力が見つかりません: ${targetId}`);
      return;
    }
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('clean-camera-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // モーダルを作成
    const modalHTML = `
      <div id="clean-camera-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.9); z-index: 10000; display: flex; flex-direction: column;">
        <div style="padding: 1rem; display: flex; justify-content: space-between; align-items: center; background-color: #007bff; color: white;">
          <h5 style="margin: 0; font-size: 1.25rem;">カメラで撮影</h5>
          <button type="button" id="clean-camera-close" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 1rem;">
          <video id="clean-camera-video" autoplay playsinline style="max-width: 100%; max-height: 70vh; background-color: #000;"></video>
          <button type="button" id="clean-camera-capture" style="margin-top: 1rem; padding: 0.75rem 2rem; background-color: #dc3545; color: white; border: none; border-radius: 9999px; font-size: 1.25rem; cursor: pointer;">
            <i class="fas fa-camera"></i> 撮影する
          </button>
          <div id="clean-camera-preview-container" style="display: none; width: 100%; max-width: 500px; text-align: center;">
            <img id="clean-camera-preview" style="max-width: 100%; max-height: 70vh; margin-bottom: 1rem;" alt="プレビュー">
            <div style="display: flex; justify-content: center; gap: 1rem;">
              <button type="button" id="clean-camera-use" style="padding: 0.75rem 1.5rem; background-color: #28a745; color: white; border: none; border-radius: 9999px; font-size: 1.1rem; cursor: pointer;">
                <i class="fas fa-check"></i> この写真を使用
              </button>
              <button type="button" id="clean-camera-retake" style="padding: 0.75rem 1.5rem; background-color: #6c757d; color: white; border: none; border-radius: 9999px; font-size: 1.1rem; cursor: pointer;">
                <i class="fas fa-redo"></i> 撮り直す
              </button>
            </div>
          </div>
          <canvas id="clean-camera-canvas" style="display: none;"></canvas>
        </div>
      </div>
    `;
    
    // ドキュメントに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 要素への参照
    const modal = document.getElementById('clean-camera-modal');
    const video = document.getElementById('clean-camera-video');
    const canvas = document.getElementById('clean-camera-canvas');
    const captureBtn = document.getElementById('clean-camera-capture');
    const closeBtn = document.getElementById('clean-camera-close');
    const useBtn = document.getElementById('clean-camera-use');
    const retakeBtn = document.getElementById('clean-camera-retake');
    const previewContainer = document.getElementById('clean-camera-preview-container');
    const previewImg = document.getElementById('clean-camera-preview');
    
    // ストリームを保持する変数
    let stream = null;
    
    // カメラを起動
    startCamera();
    
    // カメラを起動
    function startCamera() {
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      .then(function(s) {
        stream = s;
        video.srcObject = stream;
        video.style.display = 'block';
        captureBtn.style.display = 'block';
      })
      .catch(function(error) {
        console.error('カメラエラー:', error);
        
        // カメラを使えない場合はファイル選択に切り替え
        showFallbackFileInput();
      });
    }
    
    // カメラが使えない場合のファイル選択UIを表示
    function showFallbackFileInput() {
      // モーダル内のスタイル変更
      modal.querySelector('div:nth-child(2)').innerHTML = `
        <div style="text-align: center; color: white; padding: 2rem;">
          <div style="margin-bottom: 1.5rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ffc107;"></i>
            <p style="margin: 1rem 0; font-size: 1.2rem;">カメラへのアクセスができませんでした</p>
            <p style="margin-bottom: 2rem;">お使いのデバイスではカメラを使用できません。ファイルから画像をアップロードしてください。</p>
          </div>
          <button type="button" id="fallback-file-button" style="padding: 0.75rem 1.5rem; background-color: #28a745; color: white; border: none; border-radius: 0.25rem; font-size: 1.1rem; cursor: pointer;">
            <i class="fas fa-upload me-2"></i> 画像を選択
          </button>
        </div>
      `;
      
      // ファイル選択ボタンのイベント
      document.getElementById('fallback-file-button').addEventListener('click', function() {
        // 隠しファイル入力を作成して使用
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'file';
        hiddenInput.accept = 'image/*';
        hiddenInput.style.display = 'none';
        document.body.appendChild(hiddenInput);
        
        // ファイル選択時の処理
        hiddenInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            // オリジナルのファイル入力にコピー
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(this.files[0]);
            fileInput.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            // モーダルを閉じる
            closeModal();
          }
          
          // 使用後に隠しファイル入力を削除
          document.body.removeChild(hiddenInput);
        });
        
        // ファイル選択ダイアログを開く
        hiddenInput.click();
      });
      
      // 閉じるボタンのイベント
      document.getElementById('clean-camera-close').addEventListener('click', closeModal);
    }
    
    // 撮影ボタンのイベント
    captureBtn.addEventListener('click', function() {
      // キャンバスのサイズをビデオに合わせる
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // ビデオフレームをキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // プレビュー表示
      previewImg.src = canvas.toDataURL('image/jpeg');
      
      // 表示を切り替え
      video.style.display = 'none';
      captureBtn.style.display = 'none';
      previewContainer.style.display = 'block';
    });
    
    // 撮り直しボタンのイベント
    retakeBtn.addEventListener('click', function() {
      // 表示を切り替え
      video.style.display = 'block';
      captureBtn.style.display = 'block';
      previewContainer.style.display = 'none';
    });
    
    // 使用ボタンのイベント
    useBtn.addEventListener('click', function() {
      // キャンバスからBlobを作成
      canvas.toBlob(function(blob) {
        // ファイル名を生成
        const now = new Date();
        const fileName = `photo_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}.jpg`;
        
        // Fileオブジェクトを作成
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // ファイル入力に設定
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
        
        // モーダルを閉じる
        closeModal();
      }, 'image/jpeg', 0.9);
    });
    
    // 閉じるボタンのイベント
    closeBtn.addEventListener('click', closeModal);
    
    // モーダルを閉じる
    function closeModal() {
      // ストリームを停止
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // モーダルを削除
      modal.remove();
    }
  }
})();