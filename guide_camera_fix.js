/**
 * ガイド登録フォームのカメラボタン修正
 * 特定のガイド登録モーダル内のカメラリンクに直接対応
 */
(function() {
  console.log('ガイド登録カメラボタン修正を初期化');
  
  // ガイド登録モーダルが表示されたときに実行
  document.body.addEventListener('shown.bs.modal', function(e) {
    if (e.target.id === 'guideRegistrationModal' || 
        e.target.classList.contains('guide-modal') || 
        e.target.querySelector('.guide-registration')) {
      setTimeout(fixGuideModalCameraButtons, 200);
    }
  });
  
  // ガイド登録モーダル内のカメラボタンを修正
  function fixGuideModalCameraButtons() {
    // 特定のモーダル内のカメラリンクを探す
    const guideModal = document.getElementById('guideRegistrationModal') || 
                      document.querySelector('.guide-modal') || 
                      document.querySelector('.modal:has(.guide-registration)');
    
    if (!guideModal) return;
    
    // すべてのカメラリンクを探す
    const cameraLinks = guideModal.querySelectorAll('a:has(.fa-camera), a:has(.fas.fa-camera), a.camera-link, a.camera-button');
    
    cameraLinks.forEach(function(link) {
      // すでに処理済みならスキップ
      if (link.hasAttribute('data-guide-camera-fixed')) return;
      
      // ターゲットのファイル入力を特定
      let fileInputId = null;
      
      // 1. data-target 属性をチェック
      if (link.hasAttribute('data-target')) {
        fileInputId = link.getAttribute('data-target');
      } 
      // 2. 同じセクション内のファイル入力を探す
      else {
        const section = link.closest('.form-group, .mb-3, .mb-4');
        if (section) {
          const fileInput = section.querySelector('input[type="file"]');
          if (fileInput && fileInput.id) {
            fileInputId = fileInput.id;
          }
        }
      }
      
      if (!fileInputId) {
        console.warn('ガイド登録カメラリンクに関連するファイル入力が見つかりません');
        return;
      }
      
      console.log(`ガイド登録カメラリンクを検出: ターゲット=${fileInputId}`);
      
      // 新しいリンクに置き換え
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      // クリックイベント
      newLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        showGuideCameraModal(fileInputId);
        
        return false;
      });
      
      // 処理済みとしてマーク
      newLink.setAttribute('data-guide-camera-fixed', 'true');
    });
  }
  
  // ガイド用カメラモーダルを表示
  function showGuideCameraModal(targetId) {
    console.log(`ガイド用カメラモーダルを表示: ${targetId}`);
    
    // ファイル入力要素を取得
    const fileInput = document.getElementById(targetId);
    if (!fileInput) {
      console.error(`ターゲット入力が見つかりません: ${targetId}`);
      return;
    }
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('guide-camera-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // モーダルを作成
    const modalHTML = `
      <div id="guide-camera-modal" class="modal fade show" tabindex="-1" role="dialog" aria-hidden="false" style="display: block; background-color: rgba(0,0,0,0.5); z-index: 1060;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">カメラで撮影</h5>
              <button type="button" class="btn-close btn-close-white" id="guide-camera-close"></button>
            </div>
            <div class="modal-body text-center">
              <div id="guide-camera-view">
                <video id="guide-camera-video" autoplay playsinline class="img-fluid mb-3" style="background-color: #000; max-height: 50vh;"></video>
                <button type="button" id="guide-camera-capture" class="btn btn-danger rounded-pill">
                  <i class="fas fa-camera me-1"></i> 撮影する
                </button>
              </div>
              <div id="guide-camera-preview" style="display: none;">
                <img id="guide-camera-image" class="img-fluid mb-3" style="max-height: 50vh;">
                <div class="d-flex justify-content-center gap-2">
                  <button type="button" id="guide-camera-use" class="btn btn-success">この写真を使用</button>
                  <button type="button" id="guide-camera-retake" class="btn btn-secondary">撮り直す</button>
                </div>
              </div>
              <div id="guide-camera-fallback" style="display: none;">
                <div class="alert alert-warning mb-3">
                  <i class="fas fa-exclamation-triangle me-2"></i> カメラへのアクセスができませんでした
                </div>
                <button type="button" id="guide-camera-file" class="btn btn-primary">
                  <i class="fas fa-upload me-1"></i> 画像をアップロード
                </button>
              </div>
              <canvas id="guide-camera-canvas" style="display: none;"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // ドキュメントに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 要素への参照
    const modal = document.getElementById('guide-camera-modal');
    const video = document.getElementById('guide-camera-video');
    const canvas = document.getElementById('guide-camera-canvas');
    const captureBtn = document.getElementById('guide-camera-capture');
    const closeBtn = document.getElementById('guide-camera-close');
    const useBtn = document.getElementById('guide-camera-use');
    const retakeBtn = document.getElementById('guide-camera-retake');
    const cameraView = document.getElementById('guide-camera-view');
    const previewView = document.getElementById('guide-camera-preview');
    const fallbackView = document.getElementById('guide-camera-fallback');
    const fallbackBtn = document.getElementById('guide-camera-file');
    const previewImg = document.getElementById('guide-camera-image');
    
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
      cameraView.style.display = 'block';
      fallbackView.style.display = 'none';
    })
    .catch(function(error) {
      console.error('カメラエラー:', error);
      
      // カメラが使えない場合はファイル選択表示
      cameraView.style.display = 'none';
      fallbackView.style.display = 'block';
    });
    
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
      cameraView.style.display = 'none';
      previewView.style.display = 'block';
    });
    
    // 撮り直しボタンのイベント
    retakeBtn.addEventListener('click', function() {
      // 表示を切り替え
      cameraView.style.display = 'block';
      previewView.style.display = 'none';
    });
    
    // 使用ボタンのイベント
    useBtn.addEventListener('click', function() {
      // キャンバスからBlobを作成
      canvas.toBlob(function(blob) {
        // ファイル名を生成
        const now = new Date();
        const fileName = `guide_photo_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}.jpg`;
        
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
    
    // フォールバックボタンのイベント
    fallbackBtn.addEventListener('click', function() {
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
    closeBtn.addEventListener('click', closeModal);
    
    // モーダルの外側をクリックして閉じる
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    
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
  
  // DOMが読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // ページ初期ロード時に既に表示されているモーダルをチェック
      const visibleGuideModal = document.querySelector('#guideRegistrationModal.show, .guide-modal.show, .modal.show:has(.guide-registration)');
      if (visibleGuideModal) {
        fixGuideModalCameraButtons();
      }
    });
  } else {
    // ページ初期ロード時に既に表示されているモーダルをチェック
    const visibleGuideModal = document.querySelector('#guideRegistrationModal.show, .guide-modal.show, .modal.show:has(.guide-registration)');
    if (visibleGuideModal) {
      fixGuideModalCameraButtons();
    }
  }
  
  // 定期的に確認
  setInterval(function() {
    const visibleGuideModal = document.querySelector('#guideRegistrationModal.show, .guide-modal.show, .modal.show:has(.guide-registration)');
    if (visibleGuideModal) {
      fixGuideModalCameraButtons();
    }
  }, 1000);
})();