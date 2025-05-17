/**
 * 超直接的かつ原始的な方法での実装
 * このスクリプトはDOMを直接操作し、Bootstrap準拠のHTMLを挿入します
 */
(function() {
  // モバイルデバイスではスキップ
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('モバイル環境では実行しません');
    return;
  }
  
  console.log('最も直接的なガイド登録写真実装を初期化');
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFix);
  } else {
    initFix();
  }
  
  // 初期化
  function initFix() {
    // モーダル表示イベントをモニタリング
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // ガイド登録モーダルの場合のみ処理
      if (isGuideRegistrationModal(modal)) {
        console.log('ガイド登録モーダルを検出');
        setupForNewGuideModal(modal);
      } else if (isPhotoModalWithDualOption(modal)) {
        // 証明写真モーダルの場合も処理
        console.log('写真モーダルを検出');
        setupExistingDualPhotoModal(modal);
      }
    });
    
    // 定期的にモーダルをチェック（より確実に）
    setInterval(function() {
      document.querySelectorAll('.modal.show').forEach(function(modal) {
        if (isGuideRegistrationModal(modal)) {
          setupForNewGuideModal(modal);
        } else if (isPhotoModalWithDualOption(modal)) {
          setupExistingDualPhotoModal(modal);
        }
      });
    }, 2000);
  }
  
  // 新規ガイド登録モーダルのセットアップ
  function setupForNewGuideModal(modal) {
    // 既に処理済みかチェック
    if (modal.hasAttribute('data-setup-complete')) {
      return;
    }
    
    // モーダル内のセレクトボックスにイベントを設定
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      if (!select.hasAttribute('data-handler-set')) {
        select.setAttribute('data-handler-set', 'true');
        
        // 初期値が運転免許証かチェック
        if (isDriverLicenseSelected(select)) {
          console.log('初期値が運転免許証です');
          createOrShowDualPhotoSection(modal);
        }
        
        // 変更イベントを設定
        select.addEventListener('change', function() {
          if (isDriverLicenseSelected(this)) {
            console.log('運転免許証選択を検出');
            createOrShowDualPhotoSection(modal);
          }
        });
      }
    });
    
    // 表裏写真セクションがすでにあるなら表示
    const dualSection = modal.querySelector('#id-photo-dual-section');
    if (dualSection) {
      // 通常の証明写真セクションと表裏写真セクションの切り替えイベントを設定
      setupPhotoSectionToggle(modal);
    }
    
    modal.setAttribute('data-setup-complete', 'true');
  }
  
  // 既存の表裏写真モーダルのセットアップ
  function setupExistingDualPhotoModal(modal) {
    if (modal.hasAttribute('data-camera-setup')) {
      return;
    }
    
    // 二重クリック対策
    modal.setAttribute('data-camera-setup', 'true');
    
    // 表裏写真のカメラ機能を設定
    setupDualPhotoCamera(modal);
  }
  
  // ガイド登録モーダルの判定
  function isGuideRegistrationModal(modal) {
    // タイトルからの判定
    const title = modal.querySelector('.modal-title, h5.modal-header');
    if (title && (title.textContent.includes('ガイド登録') || 
                 title.textContent.includes('Guide Registration'))) {
      return true;
    }
    
    // モーダルヘッダーからの判定
    const header = modal.querySelector('.modal-header');
    if (header && header.textContent && 
        (header.textContent.includes('ガイド登録') || 
         header.textContent.includes('Guide Registration'))) {
      return true;
    }
    
    return false;
  }
  
  // 表裏写真オプションがあるモーダルの判定
  function isPhotoModalWithDualOption(modal) {
    // モーダル内のテキストから判定
    const allText = modal.textContent || '';
    return allText.includes('photo title') && 
           (allText.includes('証明写真') || allText.includes('表裏写真'));
  }
  
  // 運転免許証選択チェック
  function isDriverLicenseSelected(select) {
    if (!select || !select.options || select.selectedIndex < 0) return false;
    
    const selectedOption = select.options[select.selectedIndex];
    const selectedText = selectedOption.textContent || '';
    
    return selectedText.includes('運転免許証') || 
          (selectedText.toLowerCase().includes('driver') && 
           selectedText.toLowerCase().includes('license'));
  }
  
  // 表裏写真セクションの作成または表示
  function createOrShowDualPhotoSection(modal) {
    // 表裏写真ラジオボタンの選択
    const dualRadio = modal.querySelector('input[type="radio"][name="photoType"][id="photo-type-dual"]');
    if (dualRadio) {
      dualRadio.checked = true;
      
      try {
        const event = new Event('change', { bubbles: true });
        dualRadio.dispatchEvent(event);
        console.log('表裏写真ラジオボタン選択成功');
      } catch (e) {
        console.warn('ラジオボタンイベント発火エラー:', e);
      }
    }
    
    // id-photo-typeラジオボタンを使った標準の表裏写真切り替え
    const idPhotoDualRadio = modal.querySelector('#id-photo-type-dual');
    if (idPhotoDualRadio) {
      idPhotoDualRadio.checked = true;
      try {
        const event = new Event('change', { bubbles: true });
        idPhotoDualRadio.dispatchEvent(event);
        console.log('標準表裏写真ラジオボタン選択成功');
      } catch (e) {
        console.warn('標準ラジオボタンイベント発火エラー:', e);
      }
    }
    
    // 表裏写真セクションの表示
    const singleSection = modal.querySelector('#id-photo-single-section');
    const dualSection = modal.querySelector('#id-photo-dual-section');
    
    if (singleSection && dualSection) {
      singleSection.classList.add('d-none');
      dualSection.classList.remove('d-none');
      console.log('表裏写真セクションを表示');
    }
  }
  
  // 表裏写真セクション切り替えイベントのセットアップ
  function setupPhotoSectionToggle(modal) {
    const radioButtons = modal.querySelectorAll('input[type="radio"][name="id-photo-type"]');
    
    radioButtons.forEach(function(radio) {
      if (!radio.hasAttribute('data-toggle-handler')) {
        radio.setAttribute('data-toggle-handler', 'true');
        
        radio.addEventListener('change', function() {
          const singleSection = modal.querySelector('#id-photo-single-section');
          const dualSection = modal.querySelector('#id-photo-dual-section');
          
          if (singleSection && dualSection) {
            if (this.id === 'id-photo-type-dual') {
              singleSection.classList.add('d-none');
              dualSection.classList.remove('d-none');
            } else {
              singleSection.classList.remove('d-none');
              dualSection.classList.add('d-none');
            }
          }
        });
      }
    });
  }
  
  // 表裏写真のカメラ機能を設定
  function setupDualPhotoCamera(modal) {
    // 表面カメラボタン
    const frontCameraBtn = modal.querySelector('#id-photo-front-camera-btn');
    if (frontCameraBtn && !frontCameraBtn.hasAttribute('data-camera-handler')) {
      frontCameraBtn.setAttribute('data-camera-handler', 'true');
      frontCameraBtn.addEventListener('click', function() {
        openDualCamera('front');
      });
    }
    
    // 裏面カメラボタン
    const backCameraBtn = modal.querySelector('#id-photo-back-camera-btn');
    if (backCameraBtn && !backCameraBtn.hasAttribute('data-camera-handler')) {
      backCameraBtn.setAttribute('data-camera-handler', 'true');
      backCameraBtn.addEventListener('click', function() {
        openDualCamera('back');
      });
    }
  }
  
  // カメラモーダルを開く
  function openDualCamera(side) {
    console.log(`${side}面カメラを起動します`);
    
    // 既存のカメラモーダルがあれば削除
    let existingModal = document.getElementById('dualCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // カメラモーダルのHTMLを作成
    const modalHTML = `
      <div class="modal fade" id="dualCameraModal" tabindex="-1" aria-labelledby="dualCameraModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="dualCameraModalLabel">${side === 'front' ? '表' : '裏'}面の写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div id="dualCameraContainer" class="text-center">
                <div id="dualVideoContainer" class="mb-3">
                  <video id="dualVideo" class="w-100 rounded border" autoplay playsinline></video>
                </div>
                <div id="dualPreviewContainer" class="mb-3 d-none">
                  <canvas id="dualCanvas" class="w-100 rounded border"></canvas>
                </div>
                <div id="dualFeedbackContainer" class="alert alert-info d-none mb-3" role="alert">
                  カメラへのアクセス許可を確認してください
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" id="dualCaptureBtn" class="btn btn-primary">
                <i class="bi bi-camera"></i> 撮影する
              </button>
              <button type="button" id="dualRetakeBtn" class="btn btn-outline-primary d-none">
                <i class="bi bi-arrow-repeat"></i> 撮り直す
              </button>
              <button type="button" id="dualUsePhotoBtn" class="btn btn-success d-none">
                <i class="bi bi-check-lg"></i> この写真を使用
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // モーダル要素を取得
    const modal = document.getElementById('dualCameraModal');
    modal.setAttribute('data-target-side', side);
    
    // Bootstrap Modalインスタンスを作成
    const bsModal = new window.bootstrap.Modal(modal);
    
    // ビデオ要素とボタンを取得
    const video = document.getElementById('dualVideo');
    const canvas = document.getElementById('dualCanvas');
    const captureBtn = document.getElementById('dualCaptureBtn');
    const retakeBtn = document.getElementById('dualRetakeBtn');
    const usePhotoBtn = document.getElementById('dualUsePhotoBtn');
    const videoContainer = document.getElementById('dualVideoContainer');
    const previewContainer = document.getElementById('dualPreviewContainer');
    const feedbackContainer = document.getElementById('dualFeedbackContainer');
    
    // ストリームを格納する変数
    let stream = null;
    
    // カメラの起動
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        video.srcObject = stream;
        videoContainer.classList.remove('d-none');
        previewContainer.classList.add('d-none');
        captureBtn.classList.remove('d-none');
        retakeBtn.classList.add('d-none');
        usePhotoBtn.classList.add('d-none');
        feedbackContainer.classList.add('d-none');
      } catch (err) {
        console.error('カメラアクセスエラー:', err);
        feedbackContainer.textContent = 'カメラへのアクセスが拒否されました。設定を確認してください。';
        feedbackContainer.classList.remove('d-none');
        feedbackContainer.classList.remove('alert-info');
        feedbackContainer.classList.add('alert-danger');
      }
    }
    
    // カメラの停止
    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
    }
    
    // 写真の撮影
    function capturePhoto() {
      const ctx = canvas.getContext('2d');
      
      // ビデオの縦横比を保持するためのサイズ計算
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      // キャンバスのサイズをビデオに合わせる
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      // ビデオフレームをキャンバスに描画
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      // UIの更新
      videoContainer.classList.add('d-none');
      previewContainer.classList.remove('d-none');
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      usePhotoBtn.classList.remove('d-none');
    }
    
    // 写真を使用
    function usePhoto() {
      // キャンバスの画像データを取得
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      
      // 写真の種類に基づいて対象要素のIDを設定
      const targetSide = modal.getAttribute('data-target-side') || side;
      
      // プレビュー要素と入力要素のIDを生成
      const previewContainerId = `id-photo-${targetSide}-preview`;
      const imageId = `id-photo-${targetSide}-image`;
      const placeholderId = `id-photo-${targetSide}-placeholder`;
      const removeBtnId = `id-photo-${targetSide}-remove-btn`;
      
      // 要素を取得
      const previewContainer = document.getElementById(previewContainerId);
      const previewImg = document.getElementById(imageId);
      const placeholder = document.getElementById(placeholderId);
      const removeBtn = document.getElementById(removeBtnId);
      
      // DOM要素が見つかった場合に更新
      if (previewContainer && previewImg) {
        previewImg.src = photoData;
        previewContainer.classList.remove('d-none');
        
        if (placeholder) {
          placeholder.classList.add('d-none');
        }
        
        if (removeBtn) {
          removeBtn.classList.remove('d-none');
        }
        
        console.log(`${targetSide}面の写真を更新しました`);
      } else {
        console.warn(`${targetSide}面のDOM要素が見つかりません`);
      }
      
      // モーダルを閉じる
      bsModal.hide();
    }
    
    // イベントリスナーの設定
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', startCamera);
    usePhotoBtn.addEventListener('click', usePhoto);
    
    // モーダルが閉じられたときのハンドラー
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
      setTimeout(() => modal.remove(), 200);
    });
    
    // モーダルが表示されたときのハンドラー
    modal.addEventListener('shown.bs.modal', startCamera);
    
    // モーダルを表示
    bsModal.show();
  }
})();