/**
 * ガイドプロフィール編集ページ専用プロフィール写真編集機能
 * トップページのガイドカードと自動同期
 */

class ProfilePhotoEditor {
  constructor() {
    this.currentGuideId = this.getCurrentGuideId();
    this.init();
  }

  /**
   * システム初期化
   */
  init() {
    this.setupProfilePhotoEditor();
    this.loadCurrentProfilePhoto();
    this.setupEventListeners();
  }

  /**
   * 現在のガイドIDを取得
   */
  getCurrentGuideId() {
    // セッションから取得、なければデフォルト値
    return localStorage.getItem('currentGuideId') || sessionStorage.getItem('currentGuideId') || '1';
  }

  /**
   * プロフィール写真編集機能をセットアップ
   */
  setupProfilePhotoEditor() {
    const profilePhotoContainer = document.querySelector('.profile-photo-container');
    if (!profilePhotoContainer) return;

    // 既存の写真編集オーバーレイをチェック
    if (!profilePhotoContainer.querySelector('.profile-photo-edit-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'profile-photo-edit-overlay';
      overlay.innerHTML = `
        <div class="edit-buttons">
          <button type="button" class="btn btn-light btn-sm" onclick="profilePhotoEditor.openPhotoUpload()" title="ファイルから選択">
            <i class="bi bi-folder2-open"></i>
          </button>
          <button type="button" class="btn btn-light btn-sm" onclick="profilePhotoEditor.openCamera()" title="カメラで撮影">
            <i class="bi bi-camera"></i>
          </button>
        </div>
      `;
      profilePhotoContainer.appendChild(overlay);
    }

    // 隠しファイル入力を追加
    if (!document.getElementById('profile-photo-input')) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = 'profile-photo-input';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);

      fileInput.addEventListener('change', (e) => {
        this.handleFileSelect(e.target.files[0]);
      });
    }

    // スタイルを動的に追加
    this.addProfilePhotoStyles();
  }

  /**
   * プロフィール写真編集用スタイルを追加
   */
  addProfilePhotoStyles() {
    if (document.getElementById('profile-photo-editor-styles')) return;

    const style = document.createElement('style');
    style.id = 'profile-photo-editor-styles';
    style.textContent = `
      .profile-photo-edit-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 50%;
      }

      .profile-photo-container:hover .profile-photo-edit-overlay {
        opacity: 1;
      }

      .edit-buttons {
        display: flex;
        gap: 0.5rem;
      }

      .edit-buttons .btn {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
      }

      .photo-preview-modal .modal-dialog {
        max-width: 600px;
      }

      .photo-crop-container {
        position: relative;
        max-width: 100%;
        margin: 0 auto;
      }

      .photo-crop-container img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
      }

      .success-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
      }

      @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 現在のプロフィール写真を読み込み
   */
  loadCurrentProfilePhoto() {
    const savedProfiles = this.getStoredProfiles();
    const profile = savedProfiles[this.currentGuideId];
    
    if (profile && profile.profilePhoto) {
      const profileImg = document.querySelector('.profile-photo');
      if (profileImg) {
        profileImg.src = profile.profilePhoto;
      }
    }
  }

  /**
   * イベントリスナーをセットアップ
   */
  setupEventListeners() {
    // ページ離脱時の自動保存
    window.addEventListener('beforeunload', () => {
      this.saveCurrentState();
    });

    // プロフィール写真コンテナのクリックイベント
    const profilePhotoContainer = document.querySelector('.profile-photo-container');
    if (profilePhotoContainer) {
      profilePhotoContainer.addEventListener('click', () => {
        this.openPhotoUpload();
      });
    }
  }

  /**
   * ファイル選択ダイアログを開く
   */
  openPhotoUpload() {
    const fileInput = document.getElementById('profile-photo-input');
    if (fileInput) {
      fileInput.click();
    }
  }

  /**
   * カメラモーダルを開く
   */
  openCamera() {
    this.showCameraModal();
  }

  /**
   * ファイル選択処理
   */
  handleFileSelect(file) {
    if (!file) return;

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showAlert('ファイルサイズが大きすぎます。5MB以下のファイルを選択してください。', 'danger');
      return;
    }

    // 画像ファイルかチェック
    if (!file.type.startsWith('image/')) {
      this.showAlert('画像ファイルを選択してください。', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.showPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  /**
   * 写真プレビューモーダルを表示
   */
  showPhotoPreview(imageSrc) {
    // 既存のモーダルを削除
    const existingModal = document.getElementById('photoPreviewModal');
    if (existingModal) {
      existingModal.remove();
    }

    // 新しいモーダルを作成
    const modalHtml = `
      <div class="modal fade photo-preview-modal" id="photoPreviewModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">プロフィール写真のプレビュー</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="photo-crop-container">
                <img src="${imageSrc}" alt="プレビュー" class="img-fluid">
              </div>
              <div class="mt-3">
                <small class="text-muted">この写真をプロフィール写真として使用しますか？</small>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-primary" onclick="profilePhotoEditor.savePhoto('${imageSrc}')">
                <i class="bi bi-check-lg"></i> この写真を使用
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('photoPreviewModal'));
    modal.show();
  }

  /**
   * カメラモーダルを表示
   */
  showCameraModal() {
    // 既存のモーダルを削除
    const existingModal = document.getElementById('cameraModal');
    if (existingModal) {
      existingModal.remove();
    }

    // カメラモーダルを作成
    const modalHtml = `
      <div class="modal fade" id="cameraModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">カメラで撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
              <div id="cameraContainer">
                <video id="cameraVideo" autoplay playsinline style="width: 100%; max-width: 400px; border-radius: 8px;"></video>
                <canvas id="cameraCanvas" style="display: none;"></canvas>
                <div class="mt-3">
                  <button type="button" class="btn btn-primary me-2" onclick="profilePhotoEditor.capturePhoto()">
                    <i class="bi bi-camera"></i> 撮影
                  </button>
                  <button type="button" class="btn btn-outline-secondary" onclick="profilePhotoEditor.switchCamera()">
                    <i class="bi bi-arrow-repeat"></i> カメラ切替
                  </button>
                </div>
              </div>
              <div id="capturedContainer" style="display: none;">
                <img id="capturedImage" src="" class="img-fluid rounded mb-3" alt="撮影した写真">
                <div>
                  <button type="button" class="btn btn-success me-2" onclick="profilePhotoEditor.useCapturedPhoto()">
                    <i class="bi bi-check-lg"></i> この写真を使用
                  </button>
                  <button type="button" class="btn btn-outline-secondary" onclick="profilePhotoEditor.retakePhoto()">
                    <i class="bi bi-arrow-counterclockwise"></i> 撮り直し
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('cameraModal'));
    modal.show();

    // カメラを開始
    this.startCamera();

    // モーダルが閉じられた時の処理
    document.getElementById('cameraModal').addEventListener('hidden.bs.modal', () => {
      this.stopCamera();
    });
  }

  /**
   * カメラを開始
   */
  async startCamera() {
    try {
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: this.facingMode || 'user',
          width: { ideal: 400 },
          height: { ideal: 400 }
        }
      };

      this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = document.getElementById('cameraVideo');
      if (video) {
        video.srcObject = this.cameraStream;
      }
    } catch (error) {
      console.error('カメラエラー:', error);
      this.showAlert('カメラにアクセスできませんでした。ブラウザの設定を確認してください。', 'danger');
    }
  }

  /**
   * カメラを停止
   */
  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
  }

  /**
   * カメラ切替
   */
  switchCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.startCamera();
  }

  /**
   * 写真を撮影
   */
  capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    document.getElementById('capturedImage').src = imageDataUrl;

    document.getElementById('cameraContainer').style.display = 'none';
    document.getElementById('capturedContainer').style.display = 'block';
  }

  /**
   * 撮影した写真を使用
   */
  useCapturedPhoto() {
    const imageDataUrl = document.getElementById('capturedImage').src;
    
    // カメラモーダルを閉じる
    const modal = bootstrap.Modal.getInstance(document.getElementById('cameraModal'));
    modal.hide();
    
    // 写真を保存
    setTimeout(() => {
      this.savePhoto(imageDataUrl);
    }, 300);
  }

  /**
   * 撮り直し
   */
  retakePhoto() {
    document.getElementById('cameraContainer').style.display = 'block';
    document.getElementById('capturedContainer').style.display = 'none';
  }

  /**
   * 写真を保存
   */
  savePhoto(imageSrc) {
    // プロフィール写真を更新
    const profileImg = document.querySelector('.profile-photo');
    if (profileImg) {
      profileImg.src = imageSrc;
    }

    // ローカルストレージに保存
    const profiles = this.getStoredProfiles();
    if (!profiles[this.currentGuideId]) profiles[this.currentGuideId] = {};
    profiles[this.currentGuideId].profilePhoto = imageSrc;
    profiles[this.currentGuideId].lastUpdated = new Date().toISOString();
    
    localStorage.setItem('guideProfiles', JSON.stringify(profiles));

    // プロフィール写真変更イベントを発火（同期システム用）
    if (typeof GuideProfileSync !== 'undefined') {
      GuideProfileSync.triggerProfilePhotoChange(this.currentGuideId, imageSrc);
    }

    // モーダルを閉じる
    const previewModal = bootstrap.Modal.getInstance(document.getElementById('photoPreviewModal'));
    if (previewModal) {
      previewModal.hide();
    }

    // 成功メッセージを表示
    this.showSuccessToast('プロフィール写真を更新しました！');
  }

  /**
   * 現在の状態を保存
   */
  saveCurrentState() {
    const profileImg = document.querySelector('.profile-photo');
    if (profileImg && profileImg.src && !profileImg.src.includes('placehold.co')) {
      const profiles = this.getStoredProfiles();
      if (!profiles[this.currentGuideId]) profiles[this.currentGuideId] = {};
      profiles[this.currentGuideId].profilePhoto = profileImg.src;
      profiles[this.currentGuideId].lastUpdated = new Date().toISOString();
      
      localStorage.setItem('guideProfiles', JSON.stringify(profiles));
    }
  }

  /**
   * 保存されたプロフィール情報を取得
   */
  getStoredProfiles() {
    try {
      return JSON.parse(localStorage.getItem('guideProfiles') || '{}');
    } catch (error) {
      console.error('プロフィールデータの読み込みエラー:', error);
      return {};
    }
  }

  /**
   * 成功トーストを表示
   */
  showSuccessToast(message) {
    const toastHtml = `
      <div class="toast success-toast show" role="alert">
        <div class="toast-header">
          <i class="bi bi-check-circle-fill text-success me-2"></i>
          <strong class="me-auto">更新完了</strong>
          <button type="button" class="btn-close" onclick="this.closest('.toast').remove()"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', toastHtml);

    setTimeout(() => {
      const toast = document.querySelector('.success-toast');
      if (toast) {
        toast.remove();
      }
    }, 3000);
  }

  /**
   * アラートメッセージを表示
   */
  showAlert(message, type = 'danger') {
    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; width: auto; max-width: 500px;">
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', alertHtml);

    setTimeout(() => {
      const alert = document.querySelector(`.alert-${type}`);
      if (alert) {
        alert.remove();
      }
    }, 5000);
  }
}

// グローバルに公開
window.profilePhotoEditor = new ProfilePhotoEditor();