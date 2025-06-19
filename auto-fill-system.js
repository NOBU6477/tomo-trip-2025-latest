/**
 * 自動入力システム - 写真アップロード時の名前自動抽出機能
 * カメラ撮影とファイルアップロード両方に対応
 */

(function() {
  'use strict';

  let currentStream = null;
  let currentPhotoTarget = null;
  let facingMode = 'user'; // 'user' for front camera, 'environment' for back camera

  // 初期化
  function init() {
    setupEventListeners();
    setupDocumentTypeHandler();
    setupPhoneVerification();
  }

  // イベントリスナーの設定
  function setupEventListeners() {
    // プロフィール写真関連
    setupPhotoUpload('profilePhotoInput', 'profilePhotoPreview', handleProfilePhotoUpload);
    setupCameraButton('cameraPhotoBtn', 'profile');
    setupPhotoClick('profilePhotoPreview', 'profilePhotoInput');

    // 身分証明書写真関連
    setupPhotoUpload('documentFrontInput', 'documentFrontPreview', handleDocumentPhotoUpload);
    setupPhotoUpload('documentBackInput', 'documentBackPreview', handleDocumentPhotoUpload);
    setupCameraButton('cameraDocumentFrontBtn', 'documentFront');
    setupCameraButton('cameraDocumentBackBtn', 'documentBack');
    setupPhotoClick('documentFrontPreview', 'documentFrontInput');
    setupPhotoClick('documentBackPreview', 'documentBackInput');

    // アップロードボタン
    setupUploadButton('uploadPhotoBtn', 'profilePhotoInput');

    // カメラモーダル関連
    setupCameraModal();
  }

  // 写真アップロードの設定
  function setupPhotoUpload(inputId, previewId, handler) {
    document.addEventListener('DOMContentLoaded', function() {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('change', function(e) {
          const file = e.target.files[0];
          if (file) {
            handler(file, previewId);
          }
        });
      }
    });
  }

  // カメラボタンの設定
  function setupCameraButton(buttonId, type) {
    document.addEventListener('DOMContentLoaded', function() {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener('click', function() {
          currentPhotoTarget = type;
          openCameraModal();
        });
      }
    });
  }

  // 写真クリックでアップロード
  function setupPhotoClick(imageId, inputId) {
    document.addEventListener('DOMContentLoaded', function() {
      const image = document.getElementById(imageId);
      const input = document.getElementById(inputId);
      if (image && input) {
        image.addEventListener('click', function() {
          input.click();
        });
      }
    });
  }

  // アップロードボタンの設定
  function setupUploadButton(buttonId, inputId) {
    document.addEventListener('DOMContentLoaded', function() {
      const button = document.getElementById(buttonId);
      const input = document.getElementById(inputId);
      if (button && input) {
        button.addEventListener('click', function() {
          input.click();
        });
      }
    });
  }

  // プロフィール写真アップロード処理
  function handleProfilePhotoUpload(file, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      
      // 写真から名前を自動抽出（デモ機能）
      extractNameFromPhoto(file).then(extractedName => {
        if (extractedName) {
          autoFillName(extractedName);
          showNotification('写真から名前を自動入力しました: ' + extractedName, 'success');
        }
      }).catch(error => {
        console.log('名前抽出をスキップ:', error.message);
      });
    };
    reader.readAsDataURL(file);
  }

  // 身分証明書写真アップロード処理
  function handleDocumentPhotoUpload(file, previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      
      // 身分証明書から情報を自動抽出（デモ機能）
      extractInfoFromDocument(file).then(extractedInfo => {
        if (extractedInfo.name) {
          autoFillName(extractedInfo.name);
          showNotification('身分証明書から名前を自動入力しました: ' + extractedInfo.name, 'success');
        }
      }).catch(error => {
        console.log('身分証明書情報抽出をスキップ:', error.message);
      });
    };
    reader.readAsDataURL(file);
  }

  // 写真から名前を抽出（デモ実装）
  async function extractNameFromPhoto(file) {
    return new Promise((resolve, reject) => {
      // 実際のOCR APIを使用する場合はここに実装
      // デモとして、ファイル名から推測またはランダム生成
      const fileName = file.name.toLowerCase();
      
      // 日本人名のサンプル
      const sampleNames = [
        '田中 太郎', '佐藤 花子', '鈴木 一郎', '高橋 美咲',
        '伊藤 健太', '渡辺 麻衣', '山本 大輔', '中村 愛',
        '小林 翔太', '加藤 美穂', '吉田 和也', '山田 さくら'
      ];
      
      // ファイル名に基づいた名前の推測（簡易版）
      if (fileName.includes('tanaka') || fileName.includes('田中')) {
        resolve('田中 太郎');
      } else if (fileName.includes('sato') || fileName.includes('佐藤')) {
        resolve('佐藤 花子');
      } else if (fileName.includes('suzuki') || fileName.includes('鈴木')) {
        resolve('鈴木 一郎');
      } else {
        // ランダムに選択（デモ用）
        const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
        setTimeout(() => resolve(randomName), 1000); // 処理時間をシミュレート
      }
    });
  }

  // 身分証明書から情報を抽出（デモ実装）
  async function extractInfoFromDocument(file) {
    return new Promise((resolve, reject) => {
      // 実際のOCR APIを使用する場合はここに実装
      // デモとして、ファイル名または写真メタデータから推測
      
      const sampleData = {
        name: '山田 太郎',
        nationality: 'JP',
        documentNumber: '123456789'
      };
      
      setTimeout(() => resolve(sampleData), 1500); // 処理時間をシミュレート
    });
  }

  // 名前の自動入力
  function autoFillName(name) {
    const nameInput = document.getElementById('guideName');
    if (nameInput && !nameInput.value) {
      nameInput.value = name;
      
      // ユーザー名も自動生成
      const usernameInput = document.getElementById('guideUsername');
      if (usernameInput && !usernameInput.value) {
        const username = generateUsername(name);
        usernameInput.value = username;
      }
    }
  }

  // ユーザー名の自動生成
  function generateUsername(fullName) {
    // 名前からユーザー名を生成（姓名をローマ字風に変換）
    const nameMap = {
      '田中': 'tanaka',
      '佐藤': 'sato',
      '鈴木': 'suzuki',
      '高橋': 'takahashi',
      '伊藤': 'ito',
      '渡辺': 'watanabe',
      '山本': 'yamamoto',
      '中村': 'nakamura',
      '小林': 'kobayashi',
      '加藤': 'kato',
      '吉田': 'yoshida',
      '山田': 'yamada',
      '太郎': 'taro',
      '花子': 'hanako',
      '一郎': 'ichiro',
      '美咲': 'misaki',
      '健太': 'kenta',
      '麻衣': 'mai',
      '大輔': 'daisuke',
      '愛': 'ai',
      '翔太': 'shota',
      '美穂': 'miho',
      '和也': 'kazuya',
      'さくら': 'sakura'
    };

    let username = '';
    const names = fullName.split(' ');
    
    names.forEach(name => {
      if (nameMap[name]) {
        username += nameMap[name];
      } else {
        username += name.toLowerCase();
      }
    });

    // ランダムな数字を追加
    username += Math.floor(Math.random() * 1000);
    
    return username;
  }

  // 書類種類に応じた表裏写真の表示制御
  function setupDocumentTypeHandler() {
    document.addEventListener('DOMContentLoaded', function() {
      const documentType = document.getElementById('documentType');
      const backSection = document.getElementById('documentBackSection');
      
      if (documentType && backSection) {
        documentType.addEventListener('change', function() {
          if (this.value === 'driving_license') {
            backSection.style.display = 'block';
            showNotification('運転免許証は表面と裏面の両方をアップロードしてください', 'info');
          } else {
            backSection.style.display = 'none';
          }
        });
      }
    });
  }

  // カメラモーダルの設定
  function setupCameraModal() {
    document.addEventListener('DOMContentLoaded', function() {
      const modal = document.getElementById('cameraModal');
      const video = document.getElementById('cameraVideo');
      const canvas = document.getElementById('cameraCanvas');
      const preview = document.getElementById('cameraPreview');
      const previewImage = document.getElementById('previewImage');
      const captureBtn = document.getElementById('captureBtn');
      const usePhotoBtn = document.getElementById('usePhotoBtn');
      const retakeBtn = document.getElementById('retakeBtn');
      const switchCameraBtn = document.getElementById('switchCameraBtn');
      const errorDiv = document.getElementById('cameraError');

      if (!modal || !video || !canvas) return;

      // カメラ開始
      captureBtn?.addEventListener('click', function() {
        capturePhoto(video, canvas, preview, previewImage, captureBtn, usePhotoBtn, retakeBtn);
      });

      // 写真使用
      usePhotoBtn?.addEventListener('click', function() {
        useCurrentPhoto(previewImage);
        closeCameraModal(modal);
      });

      // 撮り直し
      retakeBtn?.addEventListener('click', function() {
        retakePhoto(video, preview, captureBtn, usePhotoBtn, retakeBtn);
      });

      // カメラ切り替え
      switchCameraBtn?.addEventListener('click', function() {
        switchCamera(video, errorDiv);
      });

      // モーダルが閉じられた時にカメラを停止
      modal.addEventListener('hidden.bs.modal', function() {
        stopCamera();
      });
    });
  }

  // カメラモーダルを開く
  function openCameraModal() {
    const modal = new bootstrap.Modal(document.getElementById('cameraModal'));
    modal.show();
    
    // カメラを開始
    setTimeout(() => {
      startCamera();
    }, 500);
  }

  // カメラ開始
  async function startCamera() {
    const video = document.getElementById('cameraVideo');
    const errorDiv = document.getElementById('cameraError');
    
    try {
      if (currentStream) {
        stopCamera();
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = currentStream;
      
      errorDiv.classList.add('d-none');
    } catch (error) {
      console.error('カメラアクセスエラー:', error);
      errorDiv.textContent = 'カメラにアクセスできません。設定を確認してください。';
      errorDiv.classList.remove('d-none');
    }
  }

  // カメラ停止
  function stopCamera() {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
    }
  }

  // カメラ切り替え
  async function switchCamera(video, errorDiv) {
    facingMode = facingMode === 'user' ? 'environment' : 'user';
    await startCamera();
  }

  // 写真撮影
  function capturePhoto(video, canvas, preview, previewImage, captureBtn, usePhotoBtn, retakeBtn) {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    
    previewImage.src = dataURL;
    video.style.display = 'none';
    preview.style.display = 'block';
    
    captureBtn.classList.add('d-none');
    usePhotoBtn.classList.remove('d-none');
    retakeBtn.classList.remove('d-none');
  }

  // 撮り直し
  function retakePhoto(video, preview, captureBtn, usePhotoBtn, retakeBtn) {
    video.style.display = 'block';
    preview.style.display = 'none';
    
    captureBtn.classList.remove('d-none');
    usePhotoBtn.classList.add('d-none');
    retakeBtn.classList.add('d-none');
  }

  // 写真使用
  function useCurrentPhoto(previewImage) {
    const dataURL = previewImage.src;
    
    // 対象に応じて適切な画像プレビューを更新
    if (currentPhotoTarget === 'profile') {
      const profilePreview = document.getElementById('profilePhotoPreview');
      if (profilePreview) {
        profilePreview.src = dataURL;
        // プロフィール写真から名前抽出を試行
        dataURLToFile(dataURL, 'camera_photo.jpg').then(file => {
          extractNameFromPhoto(file).then(name => {
            if (name) {
              autoFillName(name);
              showNotification('写真から名前を自動入力しました: ' + name, 'success');
            }
          }).catch(error => {
            console.log('名前抽出をスキップ:', error.message);
          });
        });
      }
    } else if (currentPhotoTarget === 'documentFront') {
      const documentPreview = document.getElementById('documentFrontPreview');
      if (documentPreview) {
        documentPreview.src = dataURL;
      }
    } else if (currentPhotoTarget === 'documentBack') {
      const documentPreview = document.getElementById('documentBackPreview');
      if (documentPreview) {
        documentPreview.src = dataURL;
      }
    }
  }

  // カメラモーダルを閉じる
  function closeCameraModal(modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
    stopCamera();
  }

  // DataURLをFileオブジェクトに変換
  function dataURLToFile(dataURL, filename) {
    return new Promise((resolve) => {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      
      resolve(new File([u8arr], filename, { type: mime }));
    });
  }

  // 電話番号認証の設定
  function setupPhoneVerification() {
    document.addEventListener('DOMContentLoaded', function() {
      const sendCodeBtn = document.getElementById('sendCodeBtn');
      const verifyCodeBtn = document.getElementById('verifyCodeBtn');
      const phoneNumber = document.getElementById('phoneNumber');
      const verificationCode = document.getElementById('verificationCode');
      const verificationContainer = document.getElementById('verificationCodeContainer');
      const verifyStatus = document.getElementById('verifyStatus');
      const verificationAlert = document.getElementById('verificationAlert');

      if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', function() {
          const phone = phoneNumber.value.trim();
          if (!phone) {
            showNotification('電話番号を入力してください', 'error');
            return;
          }
          
          if (!/^\d{10,11}$/.test(phone)) {
            showNotification('正しい電話番号を入力してください（先頭の0は除く）', 'error');
            return;
          }

          // 認証コード送信（デモ）
          sendCodeBtn.disabled = true;
          sendCodeBtn.textContent = '送信中...';
          
          setTimeout(() => {
            verificationContainer.classList.remove('d-none');
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = '再送信';
            showNotification('認証コードを送信しました（デモ: 123456を入力してください）', 'info');
          }, 2000);
        });
      }

      if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', function() {
          const code = verificationCode.value.trim();
          if (!code) {
            showAlert(verificationAlert, '認証コードを入力してください', 'danger');
            return;
          }

          // 認証確認（デモ）
          verifyCodeBtn.disabled = true;
          verifyCodeBtn.textContent = '確認中...';
          
          setTimeout(() => {
            if (code === '123456') {
              verifyStatus.textContent = '認証済み';
              verifyStatus.className = 'badge bg-success';
              showAlert(verificationAlert, '電話番号が認証されました', 'success');
              verificationContainer.classList.add('d-none');
            } else {
              showAlert(verificationAlert, '認証コードが正しくありません', 'danger');
            }
            verifyCodeBtn.disabled = false;
            verifyCodeBtn.textContent = '認証する';
          }, 1500);
        });
      }
    });
  }

  // アラート表示
  function showAlert(alertElement, message, type) {
    if (alertElement) {
      alertElement.className = `alert alert-${type}`;
      alertElement.textContent = message;
      alertElement.classList.remove('d-none');
    }
  }

  // 通知表示
  function showNotification(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show`;
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // 5秒後に自動削除
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }

  // アラートコンテナの作成
  function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; max-width: 400px; z-index: 9999;';
    document.body.appendChild(container);
    return container;
  }

  // 初期化実行
  document.addEventListener('DOMContentLoaded', init);

})();