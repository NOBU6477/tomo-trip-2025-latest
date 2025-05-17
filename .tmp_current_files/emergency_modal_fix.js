/**
 * 最終的な緊急対策：撮影ボタンが機能しない場合のための完全独立モーダル
 * このスクリプトはカメラモーダルを検出すると、完全に新しいカスタムモーダルに置き換える
 */
(function() {
  console.log('緊急モーダル修正を初期化');
  
  // 監視間隔を定義
  const CHECK_INTERVAL = 1000; // ミリ秒
  
  // 定期的にカメラモーダルをチェック
  setInterval(checkForCameraModal, CHECK_INTERVAL);
  
  // DOM変更の監視
  const observer = new MutationObserver(function(mutations) {
    let shouldCheck = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0 || 
          (mutation.type === 'attributes' && 
           (mutation.attributeName === 'class' || mutation.attributeName === 'style'))) {
        shouldCheck = true;
      }
    });
    
    if (shouldCheck) {
      checkForCameraModal();
    }
  });
  
  // 監視オプション
  const observerOptions = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'display']
  };
  
  // DOMコンテンツが読み込まれたらオブザーバーを設定
  function setupObserver() {
    if (document && document.body) {
      try {
        // 監視開始
        observer.observe(document.body, observerOptions);
        console.log('緊急モーダル修正: オブザーバー設定完了');
      } catch (error) {
        console.error('緊急モーダル修正: オブザーバー設定エラー:', error);
      }
    } else {
      console.warn('緊急モーダル修正: document.bodyがまだ利用できません');
      // 一定時間後に再試行
      setTimeout(setupObserver, 100);
    }
  }
  
  // ページロード時の初期設定
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setupObserver();
      checkForCameraModal();
    });
  } else {
    setupObserver();
    checkForCameraModal();
  }
  
  /**
   * カメラモーダルを検出してカスタムモーダルに置き換え
   */
  function checkForCameraModal() {
    const cameraModals = document.querySelectorAll('.modal:has(video), div[role="dialog"]:has(video)');
    
    cameraModals.forEach(function(modal) {
      // すでに処理済みならスキップ
      if (modal.hasAttribute('data-emergency-modal-fixed')) return;
      
      console.log('カメラモーダル検出、緊急置き換えを実行:', modal);
      
      // ビデオ要素の存在確認
      const video = modal.querySelector('video');
      if (!video) return;
      
      // 関連するファイル入力を特定
      let targetFileInput = null;
      
      // 1. モーダルのdata-target属性をチェック
      if (modal.hasAttribute('data-target')) {
        const targetId = modal.getAttribute('data-target');
        targetFileInput = document.getElementById(targetId);
      }
      
      // 2. モーダルIDから関連ファイル入力を推測
      if (!targetFileInput && modal.id) {
        const modalId = modal.id;
        if (modalId.includes('camera') || modalId.includes('photo')) {
          const possibleTargetId = modalId
            .replace('camera-modal-', '')
            .replace('modal-', '')
            .replace('camera-', '');
          
          targetFileInput = document.getElementById(possibleTargetId);
        }
      }
      
      // 3. 表示されたモーダル直前のカメラボタンから取得
      if (!targetFileInput && window.lastClickedCameraButton) {
        const button = window.lastClickedCameraButton;
        if (button.hasAttribute('data-target')) {
          const targetId = button.getAttribute('data-target');
          targetFileInput = document.getElementById(targetId);
        }
      }
      
      // 4. モーダル内のファイル入力要素を検索
      if (!targetFileInput) {
        const modalFileInputs = modal.querySelectorAll('input[type="file"]');
        if (modalFileInputs.length > 0) {
          targetFileInput = modalFileInputs[0];
        }
      }
      
      // 5. ドキュメント内のすべてのファイル入力から最初のものを使用
      if (!targetFileInput) {
        const allFileInputs = document.querySelectorAll('input[type="file"]');
        if (allFileInputs.length > 0) {
          targetFileInput = allFileInputs[0];
        }
      }
      
      if (!targetFileInput) {
        console.warn('関連するファイル入力が見つかりません');
        return;
      }
      
      // 元のモーダルを非表示
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      
      // 処理済みとしてマーク
      modal.setAttribute('data-emergency-modal-fixed', 'true');
      
      // ストリームを停止
      if (video.srcObject) {
        const stream = video.srcObject;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
      
      // バックドロップを削除
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      
      // 新しいカスタムモーダルを作成
      createCustomCameraModal(targetFileInput);
    });
  }
  
  /**
   * カスタムカメラモーダルを作成
   */
  function createCustomCameraModal(fileInput) {
    // 既存のカスタムモーダルを削除
    const existingModal = document.getElementById('custom-emergency-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // 新しいモーダル要素を作成
    const customModal = document.createElement('div');
    customModal.id = 'custom-emergency-modal';
    customModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      z-index: 2000;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;
    
    // モーダルの内容
    customModal.innerHTML = `
      <div style="background: linear-gradient(135deg, #0d6efd, #0a58ca); color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
        <h5 style="margin: 0; font-size: 1.25rem; font-weight: bold;">カメラで撮影</h5>
        <button id="custom-close-btn" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; line-height: 1;">&times;</button>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; overflow: hidden;">
        <div id="custom-camera-container" style="width: 100%; max-width: 640px; text-align: center;">
          <video id="custom-video" autoplay playsinline style="width: 100%; max-height: 60vh; background-color: #000; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);"></video>
          <button id="custom-capture-btn" style="margin-top: 20px; background: linear-gradient(135deg, #dc3545, #bb2d3b); color: white; border: none; border-radius: 50px; padding: 12px 30px; font-size: 1.2rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.5); animation: pulse-animation 2s infinite;">
            <i class="fas fa-camera" style="margin-right: 8px;"></i> 撮影する
          </button>
        </div>
        <div id="custom-preview-container" style="display: none; width: 100%; max-width: 640px; text-align: center;">
          <img id="custom-preview" style="width: 100%; max-height: 60vh; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);" />
          <div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px;">
            <button id="custom-use-btn" style="background: linear-gradient(135deg, #198754, #157347); color: white; border: none; border-radius: 50px; padding: 10px 25px; font-size: 1.1rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(25, 135, 84, 0.5);">
              <i class="fas fa-check" style="margin-right: 8px;"></i> この写真を使用
            </button>
            <button id="custom-retake-btn" style="background: linear-gradient(135deg, #6c757d, #5c636a); color: white; border: none; border-radius: 50px; padding: 10px 25px; font-size: 1.1rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(108, 117, 125, 0.5);">
              <i class="fas fa-redo" style="margin-right: 8px;"></i> 撮り直す
            </button>
          </div>
        </div>
        <div id="custom-fallback-container" style="display: none; width: 100%; max-width: 640px; text-align: center;">
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
            <div style="font-size: 1.1rem; font-weight: bold; margin-bottom: 8px;">
              <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i> カメラにアクセスできません
            </div>
            <p style="margin: 0;">お使いのブラウザでカメラが使用できないか、アクセス許可がありません。</p>
          </div>
          <button id="custom-file-btn" style="background: linear-gradient(135deg, #0d6efd, #0a58ca); color: white; border: none; border-radius: 50px; padding: 10px 25px; font-size: 1.1rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(13, 110, 253, 0.5);">
            <i class="fas fa-upload" style="margin-right: 8px;"></i> ファイルを選択
          </button>
          <div style="margin-top: 15px; text-align: center;">
            <button id="custom-default-btn" style="background: none; border: 1px solid #6c757d; color: #6c757d; border-radius: 50px; padding: 8px 20px; font-size: 1rem; cursor: pointer;">
              <i class="fas fa-user" style="margin-right: 8px;"></i> デフォルト画像を使用
            </button>
          </div>
        </div>
        <canvas id="custom-canvas" style="display: none;"></canvas>
      </div>
      <style>
        @keyframes pulse-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
            transform: scale(1);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(220, 53, 69, 0);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
            transform: scale(1);
          }
        }
        #custom-capture-btn:hover {
          transform: translateY(-3px);
        }
        #custom-use-btn:hover, #custom-retake-btn:hover, #custom-file-btn:hover {
          transform: translateY(-2px);
        }
        #custom-close-btn:hover {
          transform: scale(1.1);
        }
      </style>
    `;
    
    // ドキュメントに追加
    document.body.appendChild(customModal);
    
    // 要素への参照取得
    const video = document.getElementById('custom-video');
    const canvas = document.getElementById('custom-canvas');
    const captureBtn = document.getElementById('custom-capture-btn');
    const closeBtn = document.getElementById('custom-close-btn');
    const useBtn = document.getElementById('custom-use-btn');
    const retakeBtn = document.getElementById('custom-retake-btn');
    const fileBtn = document.getElementById('custom-file-btn');
    const defaultBtn = document.getElementById('custom-default-btn');
    const cameraContainer = document.getElementById('custom-camera-container');
    const previewContainer = document.getElementById('custom-preview-container');
    const fallbackContainer = document.getElementById('custom-fallback-container');
    const previewImg = document.getElementById('custom-preview');
    
    // ストリームを保持する変数
    let stream = null;
    
    // カメラを起動
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
      cameraContainer.style.display = 'block';
      fallbackContainer.style.display = 'none';
    })
    .catch(function(error) {
      console.error('カメラエラー:', error);
      
      // カメラが使えない場合はファイル選択表示
      cameraContainer.style.display = 'none';
      fallbackContainer.style.display = 'block';
    });
    
    // 撮影ボタンのイベント
    captureBtn.addEventListener('click', function() {
      // キャンバスのサイズをビデオに合わせる
      canvas.width = video.videoWidth || video.clientWidth || 640;
      canvas.height = video.videoHeight || video.clientHeight || 480;
      
      // ビデオフレームをキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // プレビュー表示
      previewImg.src = canvas.toDataURL('image/jpeg');
      
      // 表示を切り替え
      cameraContainer.style.display = 'none';
      previewContainer.style.display = 'block';
    });
    
    // 撮り直しボタンのイベント
    retakeBtn.addEventListener('click', function() {
      // 表示を切り替え
      cameraContainer.style.display = 'block';
      previewContainer.style.display = 'none';
    });
    
    // 使用ボタンのイベント
    useBtn.addEventListener('click', function() {
      // キャンバスからBlobを作成
      canvas.toBlob(function(blob) {
        // ファイル名を生成
        const now = new Date();
        const fileName = `capture_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.jpg`;
        
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
        closeCustomModal();
        
        // 成功メッセージ
        showSuccessMessage('写真を撮影しました');
      }, 'image/jpeg', 0.9);
    });
    
    // ファイル選択ボタンのイベント
    fileBtn.addEventListener('click', function() {
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
          closeCustomModal();
          
          // 成功メッセージ
          showSuccessMessage('ファイルをアップロードしました');
        }
        
        // 使用後に隠しファイル入力を削除
        document.body.removeChild(hiddenInput);
      });
      
      // ファイル選択ダイアログを開く
      hiddenInput.click();
    });
    
    // デフォルト画像ボタンのイベント
    defaultBtn.addEventListener('click', function() {
      // デフォルト画像を作成
      const defaultImageData = createDefaultImage();
      
      // Base64データをBlobに変換
      fetch(defaultImageData)
        .then(res => res.blob())
        .then(blob => {
          // Fileオブジェクトを作成
          const fileName = 'default_profile_photo.png';
          const file = new File([blob], fileName, { type: 'image/png' });
          
          // ファイル入力に設定
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          // モーダルを閉じる
          closeCustomModal();
          
          // 成功メッセージ
          showSuccessMessage('デフォルト画像を設定しました');
        })
        .catch(error => {
          console.error('デフォルト画像のエラー:', error);
        });
    });
    
    // 閉じるボタンのイベント
    closeBtn.addEventListener('click', closeCustomModal);
    
    // モーダルの外側をクリックして閉じる
    customModal.addEventListener('click', function(e) {
      if (e.target === customModal) {
        closeCustomModal();
      }
    });
    
    // モーダルを閉じる関数
    function closeCustomModal() {
      // ストリームを停止
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // モーダルを削除
      customModal.remove();
      
      // bodyのスタイルを戻す
      document.body.style.overflow = '';
    }
    
    // 成功メッセージを表示
    function showSuccessMessage(message) {
      const alertElement = document.createElement('div');
      alertElement.className = 'alert alert-success alert-dismissible fade show';
      alertElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        background-color: #d4edda;
        color: #155724;
        border-color: #c3e6cb;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
      `;
      
      alertElement.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
        ${message}
        <button type="button" class="btn-close" style="position: absolute; right: 10px; top: 10px; background: none; border: none; font-size: 1.25rem; font-weight: bold; cursor: pointer; padding: 0; opacity: 0.5;" onclick="this.parentElement.remove();">&times;</button>
      `;
      
      document.body.appendChild(alertElement);
      
      // 5秒後に自動的に消去
      setTimeout(function() {
        if (alertElement.parentNode) {
          alertElement.remove();
        }
      }, 5000);
    }
    
    /**
     * デフォルト画像を作成
     */
    function createDefaultImage() {
      // キャンバスを作成
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      // 背景を描画
      ctx.fillStyle = '#e9ecef';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // シルエットを描画
      ctx.fillStyle = '#adb5bd';
      
      // 頭
      ctx.beginPath();
      ctx.arc(150, 120, 60, 0, Math.PI * 2);
      ctx.fill();
      
      // 胴体
      ctx.beginPath();
      ctx.moveTo(100, 190);
      ctx.quadraticCurveTo(150, 180, 200, 190);
      ctx.lineTo(220, 300);
      ctx.lineTo(80, 300);
      ctx.closePath();
      ctx.fill();
      
      // 縁取り
      ctx.strokeStyle = '#6c757d';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // DataURLとして返す
      return canvas.toDataURL('image/png');
    }
  }
  
  // カメラボタンのクリックを監視して最後にクリックされたボタンを記録
  document.body.addEventListener('click', function(e) {
    // カメラボタンかどうか判定
    if (e.target.classList.contains('camera-button') || 
        e.target.closest('.camera-button') ||
        (e.target.tagName === 'A' && e.target.querySelector('.fa-camera')) ||
        (e.target.closest('a') && e.target.closest('a').querySelector('.fa-camera'))) {
      
      // 最後にクリックされたカメラボタンを記録
      window.lastClickedCameraButton = e.target.classList.contains('camera-button') ? 
                                      e.target : 
                                      (e.target.closest('.camera-button') || e.target.closest('a'));
    }
  }, true);
})();