/**
 * 証明写真・表裏写真の最終修正スクリプト
 * 他のスクリプトを上書きして完全に制御します
 */
(function() {
  'use strict';
  
  // ページ読み込み完了時に初期化
  window.addEventListener('DOMContentLoaded', init);
  
  // カメラストリーム
  let cameraStream = null;
  
  // 処理中フラグ
  let isProcessing = false;
  
  /**
   * 初期化処理
   */
  function init() {
    console.log('証明写真・表裏写真の最終修正スクリプトを初期化');
    
    // 遅延実行
    setTimeout(function() {
      // 英語テキストの置換
      replaceEnglishTexts();
      
      // ラジオボタンの修正
      fixPhotoTypeRadios();
      
      // ボタンテキストの修正
      fixButtonTexts();
      
      // カメラボタンの修正
      setupCameraButtons();
    }, 500);
    
    // モーダル表示時のイベントをリスナー登録
    document.addEventListener('shown.bs.modal', function(event) {
      // モーダル表示後にDOM更新
      setTimeout(function() {
        replaceEnglishTexts();
        fixPhotoTypeRadios();
        fixButtonTexts();
        setupCameraButtons();
      }, 100);
    });
    
    // 定期的なチェック
    setInterval(function() {
      if (!isProcessing) {
        isProcessing = true;
        replaceEnglishTexts();
        fixPhotoTypeRadios();
        fixButtonTexts();
        setupCameraButtons();
        isProcessing = false;
      }
    }, 1000);
  }
  
  /**
   * 英語テキストを日本語に置換
   */
  function replaceEnglishTexts() {
    const translations = {
      'PHOTO SELECT': '写真を選択',
      'SELECT PHOTO': '写真を選択',
      'PHOTO CAMERA': 'カメラで撮影',
      'CAMERA': 'カメラで撮影',
      'photo title': '証明写真タイプ',
      'photo single': '証明写真（1枚）',
      'photo dual': '表裏写真（運転免許証等）',
      'photo description': '証明写真の詳細',
      'ID Photo Type:': '証明写真タイプ:',
      'photo type': '証明写真タイプ',
      'Single Photo': '証明写真（1枚）',
      'Dual Photo': '表裏写真（運転免許証等）',
      'Front Photo': '表面写真',
      'Back Photo': '裏面写真',
      'required': '必須',
      'delete': '削除'
    };
    
    // テキストノードの探索と置換
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue.trim();
      
      if (translations[text]) {
        node.nodeValue = node.nodeValue.replace(text, translations[text]);
      }
    }
    
    // 要素内テキストの置換
    for (const englishText in translations) {
      const selector = 'h1, h2, h3, h4, h5, h6, p, label, button, a, span, div, small';
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
        if (element.childNodes.length === 1 && 
            element.firstChild.nodeType === Node.TEXT_NODE && 
            element.textContent.trim() === englishText) {
          element.textContent = translations[englishText];
        } else if (element.innerHTML.includes(englishText)) {
          element.innerHTML = element.innerHTML.replace(
            new RegExp(englishText, 'g'), 
            translations[englishText]
          );
        }
      });
    }
  }
  
  /**
   * ラジオボタンの修正
   */
  function fixPhotoTypeRadios() {
    // 写真タイプラジオボタン
    const singleRadio = document.getElementById('id-photo-type-single');
    const dualRadio = document.getElementById('id-photo-type-dual');
    
    if (!singleRadio || !dualRadio) return;
    
    // セクション要素
    const singleSection = document.getElementById('single-photo-section');
    const dualSection = document.getElementById('dual-photo-section');
    
    if (!singleSection || !dualSection) return;
    
    // 既に修正済みの場合はスキップ
    if (singleRadio.hasAttribute('data-final-fixed')) return;
    
    // 既存のイベントリスナーを削除（クローンで置換）
    const singleRadioClone = singleRadio.cloneNode(true);
    const dualRadioClone = dualRadio.cloneNode(true);
    
    if (singleRadio.parentNode) {
      singleRadio.parentNode.replaceChild(singleRadioClone, singleRadio);
    }
    
    if (dualRadio.parentNode) {
      dualRadio.parentNode.replaceChild(dualRadioClone, dualRadio);
    }
    
    // 更新後の参照を取得
    const newSingleRadio = document.getElementById('id-photo-type-single');
    const newDualRadio = document.getElementById('id-photo-type-dual');
    
    if (!newSingleRadio || !newDualRadio) return;
    
    // クリックイベントリスナーを設定
    newSingleRadio.onclick = function() {
      console.log('シングル写真タイプがクリックされました');
      showElement(singleSection);
      hideElement(dualSection);
    };
    
    newDualRadio.onclick = function() {
      console.log('デュアル写真タイプがクリックされました');
      hideElement(singleSection);
      showElement(dualSection);
    };
    
    // カスタムchangeイベントも設定
    newSingleRadio.addEventListener('change', function() {
      if (this.checked) {
        console.log('シングル写真タイプが選択されました');
        showElement(singleSection);
        hideElement(dualSection);
      }
    });
    
    newDualRadio.addEventListener('change', function() {
      if (this.checked) {
        console.log('デュアル写真タイプが選択されました');
        hideElement(singleSection);
        showElement(dualSection);
      }
    });
    
    // 初期状態を設定
    if (newSingleRadio.checked) {
      console.log('初期状態: シングル写真タイプ');
      showElement(singleSection);
      hideElement(dualSection);
    } else if (newDualRadio.checked) {
      console.log('初期状態: デュアル写真タイプ');
      hideElement(singleSection);
      showElement(dualSection);
    }
    
    // 処理済みフラグをセット
    newSingleRadio.setAttribute('data-final-fixed', 'true');
    newDualRadio.setAttribute('data-final-fixed', 'true');
  }
  
  /**
   * ボタンテキストの修正
   */
  function fixButtonTexts() {
    document.querySelectorAll('button').forEach(button => {
      // カメラボタンのテキスト修正
      if (button.textContent.trim() === 'PHOTO CAMERA' ||
          button.textContent.trim() === 'CAMERA') {
        button.innerHTML = button.innerHTML.replace(
          /PHOTO CAMERA|CAMERA/g, 'カメラで撮影'
        );
      }
      
      // 写真選択ボタンのテキスト修正
      if (button.textContent.trim() === 'PHOTO SELECT' ||
          button.textContent.trim() === 'SELECT PHOTO') {
        button.innerHTML = button.innerHTML.replace(
          /PHOTO SELECT|SELECT PHOTO/g, '写真を選択'
        );
      }
      
      // 削除ボタンのテキスト修正
      if (button.textContent.trim() === 'delete' ||
          button.textContent.trim() === 'Delete') {
        button.textContent = '削除';
      }
    });
  }
  
  /**
   * カメラボタンの設定
   */
  function setupCameraButtons() {
    // カメラボタンを検索
    document.querySelectorAll('button').forEach(button => {
      const text = button.textContent.trim();
      const id = button.id || '';
      
      // カメラボタンかどうかを判定
      const isCameraButton = text.includes('カメラ') || 
                              text.includes('撮影') || 
                              text.includes('CAMERA') || 
                              id.includes('camera');
      
      if (isCameraButton && !button.hasAttribute('data-final-camera-fixed')) {
        // 既存のイベントを全て削除
        const buttonClone = button.cloneNode(true);
        if (button.parentNode) {
          button.parentNode.replaceChild(buttonClone, button);
        } else {
          return; // 親ノードがなければスキップ
        }
        
        // ボタンのIDやクラスから写真タイプを判定
        let photoType = 'generic';
        let targetInputId = null;
        
        if (id.includes('id-photo-camera')) {
          photoType = 'single';
          targetInputId = 'id-photo-input';
        } else if (id.includes('front-camera')) {
          photoType = 'front';
          targetInputId = 'id-photo-front-input';
        } else if (id.includes('back-camera')) {
          photoType = 'back';
          targetInputId = 'id-photo-back-input';
        } else {
          // 一般的なカメラボタン - 親要素からターゲットを推測
          const parent = buttonClone.closest('.form-group') || 
                       buttonClone.closest('.document-upload-section') || 
                       buttonClone.parentElement;
          
          if (parent) {
            const fileInput = parent.querySelector('input[type="file"]');
            if (fileInput) {
              targetInputId = fileInput.id;
            }
          }
        }
        
        // 新しいイベントリスナーを設定
        buttonClone.addEventListener('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          
          console.log(`カメラボタンがクリックされました: タイプ=${photoType}, ターゲット=${targetInputId}`);
          
          if (targetInputId) {
            showFinalCamera(photoType, targetInputId);
          }
        });
        
        // 処理済みフラグをセット
        buttonClone.setAttribute('data-final-camera-fixed', 'true');
      }
    });
  }
  
  /**
   * 最終的なカメラモーダルを表示
   */
  function showFinalCamera(photoType, targetInputId) {
    // タイトルの設定
    let title = 'カメラで撮影';
    if (photoType === 'single') {
      title = '証明写真を撮影';
    } else if (photoType === 'front') {
      title = '表面写真を撮影';
    } else if (photoType === 'back') {
      title = '裏面写真を撮影';
    }
    
    console.log(`カメラモーダルを表示: ${photoType} - ${title}`);
    
    // 既存のモーダルをクリーンアップ
    const existingModal = document.getElementById('finalCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // カメラモーダルのHTML
    const modalHtml = `
      <div class="modal fade" id="finalCameraModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <div class="video-container">
                  <video id="final-camera-video" class="w-100" playsinline autoplay></video>
                  <canvas id="final-camera-canvas" class="d-none"></canvas>
                </div>
                <div id="final-camera-preview" class="preview-container mt-3 text-center d-none">
                  <img id="final-preview-image" class="img-fluid rounded" alt="プレビュー">
                </div>
                <div id="final-camera-error" class="alert alert-danger d-none" role="alert">
                  カメラにアクセスできません。デバイスのカメラ設定を確認してください。
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" id="final-capture-btn" class="btn btn-primary">撮影する</button>
              <button type="button" id="final-retake-btn" class="btn btn-outline-primary d-none">撮り直す</button>
              <button type="button" id="final-use-btn" class="btn btn-success d-none">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // モーダル要素を取得
    const modalElement = document.getElementById('finalCameraModal');
    const modal = new bootstrap.Modal(modalElement);
    
    // 要素の取得
    const video = document.getElementById('final-camera-video');
    const canvas = document.getElementById('final-camera-canvas');
    const captureBtn = document.getElementById('final-capture-btn');
    const retakeBtn = document.getElementById('final-retake-btn');
    const useBtn = document.getElementById('final-use-btn');
    const previewContainer = document.getElementById('final-camera-preview');
    const previewImage = document.getElementById('final-preview-image');
    const errorAlert = document.getElementById('final-camera-error');
    
    // モーダルを表示
    modal.show();
    
    // モーダルが閉じられたときにカメラを停止
    modalElement.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // カメラ起動
    startCamera();
    
    // ボタンイベントの設定
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', retakePhoto);
    useBtn.addEventListener('click', usePhoto);
    
    /**
     * カメラを起動
     */
    function startCamera() {
      // モバイルデバイスの場合は背面カメラを優先
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobile ? 'environment' : 'user'
        }
      };
      
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
          cameraStream = stream;
          video.srcObject = stream;
          errorAlert.classList.add('d-none');
        })
        .catch(function(err) {
          console.error('カメラ起動エラー:', err);
          errorAlert.classList.remove('d-none');
          errorAlert.textContent = 'カメラエラー: ' + err.message;
        });
    }
    
    /**
     * カメラを停止
     */
    function stopCamera() {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
      }
    }
    
    /**
     * 写真を撮影
     */
    function capturePhoto() {
      // ビデオの内容をキャンバスに描画
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // プレビュー表示
      const imageDataURL = canvas.toDataURL('image/jpeg');
      previewImage.src = imageDataURL;
      
      // UI表示の切り替え
      video.classList.add('d-none');
      previewContainer.classList.remove('d-none');
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      useBtn.classList.remove('d-none');
    }
    
    /**
     * 写真を撮り直す
     */
    function retakePhoto() {
      // UI表示を元に戻す
      video.classList.remove('d-none');
      previewContainer.classList.add('d-none');
      captureBtn.classList.remove('d-none');
      retakeBtn.classList.add('d-none');
      useBtn.classList.add('d-none');
    }
    
    /**
     * 撮影した写真を使用
     */
    function usePhoto() {
      canvas.toBlob(function(blob) {
        if (!blob) {
          console.error('画像の変換に失敗しました');
          return;
        }
        
        // 対象の入力要素
        const fileInput = document.getElementById(targetInputId);
        if (!fileInput) {
          console.error('対象の入力要素が見つかりません:', targetInputId);
          return;
        }
        
        // ファイル名を設定
        const fileName = `photo_${photoType}_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        try {
          // DataTransferオブジェクトを使用してファイルをセット
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          
          // changeイベントを発火
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          console.log('ファイルが正常に設定されました:', targetInputId);
          
          // プレビュー要素の更新
          updatePhotoPreview(fileInput, file);
        } catch (error) {
          console.error('ファイル設定エラー:', error);
        }
        
        // モーダルを閉じる
        modal.hide();
      }, 'image/jpeg', 0.95);
    }
  }
  
  /**
   * 写真プレビューの更新
   */
  function updatePhotoPreview(fileInput, file) {
    // ファイル入力の親要素を探す
    const parent = fileInput.closest('.form-group') || 
                 fileInput.closest('.photo-container') || 
                 fileInput.parentElement;
    
    if (!parent) return;
    
    // プレビュー画像要素を探す
    const previewId = fileInput.id.replace('-input', '-preview');
    const previewImg = document.getElementById(previewId) || 
                     parent.querySelector('img');
    
    if (!previewImg) return;
    
    // FileReaderでプレビュー表示
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      
      // プレビューコンテナの表示
      const previewContainer = previewImg.parentElement;
      if (previewContainer && previewContainer.classList.contains('d-none')) {
        previewContainer.classList.remove('d-none');
      }
      
      // プレースホルダーの非表示
      const placeholderId = fileInput.id.replace('-input', '-placeholder');
      const placeholder = document.getElementById(placeholderId);
      if (placeholder) {
        placeholder.classList.add('d-none');
      }
      
      // 削除ボタンの表示
      const removeId = fileInput.id.replace('-input', '-remove');
      const removeBtn = document.getElementById(removeId) || 
                      parent.querySelector('button[id*="remove"]');
      
      if (removeBtn && removeBtn.classList.contains('d-none')) {
        removeBtn.classList.remove('d-none');
      }
    };
    
    reader.readAsDataURL(file);
  }
  
  /**
   * 要素を表示
   */
  function showElement(element) {
    if (!element) return;
    element.style.display = 'block';
    element.classList.remove('d-none');
  }
  
  /**
   * 要素を非表示
   */
  function hideElement(element) {
    if (!element) return;
    element.style.display = 'none';
    element.classList.add('d-none');
  }
  
})();