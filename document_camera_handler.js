/**
 * 身分証明書アップロード用カメラ機能を提供するスクリプト
 * 各種身分証明書のカメラでの撮影機能を実装
 */
(function() {
  'use strict';
  
  // 現在のカメラストリームを保存する変数
  let currentStream = null;
  
  // 文書カメラ用の変数（名前衝突を避けるため独自の名前空間を使用）
  let docCameraPhotoFile = null;
  
  // DOMの読み込みが完了したら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  /**
   * 初期化処理
   */
  function init() {
    setupModalObserver();
    setupAllCameraButtons();
    setupExistingCameraButtons();
  }
  
  /**
   * モーダル表示のイベントを監視してカメラ機能を設定
   */
  function setupModalObserver() {
    try {
      // モーダル表示イベントを監視
      document.addEventListener('shown.bs.modal', function(event) {
        if (!event.target || !event.target.id) return;
        
        const modalId = event.target.id;
        if (modalId === 'touristRegisterModal' || 
            modalId === 'guideRegisterModal' || 
            modalId === 'idDocumentModal') {
          // モーダル内のカメラボタンを設定
          setupDocumentCameraButtons();
        }
      });
      console.log('モーダル表示イベントリスナーを設定しました');
    } catch (error) {
      console.error('モーダル監視設定エラー:', error);
    }
  }
  
  /**
   * サイト内のすべてのカメラボタンを設定
   */
  function setupAllCameraButtons() {
    try {
      // サイト全体のカメラファイル選択セクションを検索
      document.querySelectorAll('.input-group, .form-group').forEach(function(container) {
        if (container.querySelector('input[type="file"]')) {
          // ファイル入力要素があればカメラボタンを追加
          addCameraButton(container);
        }
      });
      console.log('すべてのカメラボタンを設定しました');
    } catch (error) {
      console.error('カメラボタン設定エラー:', error);
    }
  }
  
  /**
   * 指定したコンテナに新しいカメラボタンを追加
   * @param {HTMLElement} container カメラボタンを追加するコンテナ要素
   */
  function addCameraButton(container) {
    try {
      // ファイル入力要素を取得
      const fileInput = container.querySelector('input[type="file"]');
      if (!fileInput) return;
      
      // 既存のカメラボタンをチェック
      const existingButton = container.querySelector('.camera-btn');
      if (existingButton) return;
      
      // 入力グループ内の最初のボタンを見つける
      const inputGroup = container.querySelector('.input-group');
      if (inputGroup) {
        const firstButton = inputGroup.querySelector('button, .btn');
        
        // カメラボタンを作成
        const cameraButton = createCameraButton();
        cameraButton.setAttribute('data-target-input', fileInput.id);
        
        // カメラボタンのクリックイベント
        cameraButton.addEventListener('click', function() {
          createAndShowCameraModal(fileInput);
        });
        
        // ボタンを追加
        if (firstButton) {
          inputGroup.insertBefore(cameraButton, firstButton);
        } else {
          inputGroup.appendChild(cameraButton);
        }
      }
    } catch (error) {
      console.error('カメラボタン追加エラー:', error);
    }
  }
  
  /**
   * 身分証明書セクションのカメラ撮影機能を設定
   */
  function setupDocumentCameraCapture() {
    try {
      // 証明写真用カメラリンク
      const idPhotoLink = document.querySelector('.id-photo-camera-link');
      if (idPhotoLink) {
        idPhotoLink.addEventListener('click', function(e) {
          e.preventDefault();
          
          // 証明写真入力を取得
          const idPhotoInput = document.getElementById('id-photo-input');
          if (idPhotoInput) {
            createAndShowCameraModal(idPhotoInput);
          } else {
            console.error('証明写真入力要素が見つかりません');
          }
        });
      }
    } catch (error) {
      console.error('書類カメラ撮影設定エラー:', error);
    }
  }
  
  /**
   * 書類アップロードセクション内の既存のカメラボタンを設定
   */
  function setupDocumentCameraButtons() {
    try {
      // カメラで撮影ボタンを特定
      const cameraButtons = document.querySelectorAll('.camera-btn, [data-camera-target]');
      
      cameraButtons.forEach(function(button) {
        // 既に設定済みなら処理しない
        if (button.hasAttribute('data-camera-initialized')) return;
        
        // クリックイベントを設定
        button.addEventListener('click', function(e) {
          e.preventDefault();
          
          // ターゲット入力を取得
          let targetInput;
          const targetId = button.getAttribute('data-camera-target') || 
                          button.getAttribute('data-target-input');
          
          if (targetId) {
            targetInput = document.getElementById(targetId);
          }
          
          // ターゲットが見つからない場合は親要素から探す
          if (!targetInput) {
            const container = button.closest('.input-group, .form-group');
            if (container) {
              targetInput = container.querySelector('input[type="file"]');
            }
          }
          
          // カメラモーダルを表示
          if (targetInput) {
            createAndShowCameraModal(targetInput);
          } else {
            console.error('カメラターゲット入力が見つかりません');
          }
        });
        
        // 初期化フラグを設定
        button.setAttribute('data-camera-initialized', 'true');
      });
      
      // 証明写真カメラリンク
      const photoLinks = document.querySelectorAll('[data-camera="id-photo"], .id-photo-camera-link');
      photoLinks.forEach(function(link) {
        if (link.hasAttribute('data-camera-initialized')) return;
        
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const idPhotoInput = document.getElementById('id-photo-input');
          if (idPhotoInput) {
            createAndShowCameraModal(idPhotoInput);
          }
        });
        
        link.setAttribute('data-camera-initialized', 'true');
      });
      
      console.log('書類カメラボタンを設定しました');
    } catch (error) {
      console.error('書類カメラボタン設定エラー:', error);
    }
  }
  
  /**
   * 既存のファイル入力におけるカメラボタンを設定
   */
  function setupExistingCameraButtons() {
    try {
      // id属性を持つすべてのファイル入力要素を対象
      document.querySelectorAll('input[type="file"][id]').forEach(function(fileInput) {
        const container = fileInput.closest('.input-group, .form-group');
        if (container) {
          // カメラボタンの追加
          addCameraButton(container);
        }
      });
      
      // カメラで撮影ボタンを設定
      document.querySelectorAll('[data-camera-action="take-photo"], .camera-btn').forEach(function(button) {
        if (button.hasAttribute('data-camera-initialized')) return;
        
        button.addEventListener('click', function(e) {
          e.preventDefault();
          let targetInput = null;
          
          // ターゲット入力IDを取得
          const targetId = button.getAttribute('data-target-input');
          if (targetId) {
            targetInput = document.getElementById(targetId);
          }
          
          // 親要素から探す
          if (!targetInput) {
            const container = button.closest('.input-group, .form-group');
            if (container) {
              targetInput = container.querySelector('input[type="file"]');
            }
          }
          
          // カメラモーダルを表示
          if (targetInput) {
            createAndShowCameraModal(targetInput);
          }
        });
        
        button.setAttribute('data-camera-initialized', 'true');
      });
      
      // 証明写真用カメラリンク
      setupDocumentCameraCapture();
      
      console.log('既存のカメラボタンを設定しました');
    } catch (error) {
      console.error('既存のカメラボタン設定エラー:', error);
    }
  }
  
  /**
   * カメラボタンを作成
   * @returns {HTMLElement} カメラボタン要素
   */
  function createCameraButton() {
    const cameraButton = document.createElement('button');
    cameraButton.type = 'button';
    cameraButton.className = 'btn btn-outline-secondary camera-btn';
    cameraButton.innerHTML = '<i class="bi bi-camera-fill"></i>';
    cameraButton.setAttribute('data-i18n', 'camera.button');
    cameraButton.setAttribute('title', 'カメラで撮影');
    
    return cameraButton;
  }
  
  /**
   * カメラモーダルを作成して表示
   * @param {HTMLInputElement|HTMLElement} targetElement 関連するファイル入力要素または元ボタン
   */
  function createAndShowCameraModal(targetElement) {
    // データを安全に扱うための関数
    const safeCreateModal = function(fileInputElement) {
      try {
        // 既存のモーダルとカメラストリームを確実に停止・削除
        cleanupExistingCameraModal();
        
        // モーダルの作成と表示
        createCameraModalElement(fileInputElement);
      } catch (error) {
        console.error('カメラモーダル作成エラー:', error);
        alert('カメラを起動できませんでした。ブラウザの設定を確認するか、別の方法でファイルをアップロードしてください。');
      }
    };
    
    // ファイル入力要素を適切に特定
    let fileInput = findFileInputElement(targetElement);
    
    // ファイル入力が見つからない場合は何もしない
    if (!fileInput) {
      console.error('カメラに関連付ける有効なファイル入力要素が見つかりません');
      return;
    }
    
    // モーダル作成処理を実行
    safeCreateModal(fileInput);
  }
  
  /**
   * ファイル入力要素を見つける
   * @param {HTMLElement} targetElement クリックされた要素
   * @returns {HTMLInputElement|null} 関連付けるファイル入力要素
   */
  function findFileInputElement(targetElement) {
    // TargetElementがnullの場合は処理しない
    if (!targetElement) {
      console.error('対象要素がnullです');
      return null;
    }
    
    // すでにファイル入力要素の場合はそのまま返す
    if (targetElement.tagName === 'INPUT' && targetElement.type === 'file') {
      return targetElement;
    }
    
    let fileInput = null;
    const btn = targetElement;
    
    // 複数の方法でファイル入力を見つける
    // 1. data-target-input属性から
    const targetInputId = btn.getAttribute('data-target-input');
    if (targetInputId) {
      fileInput = document.getElementById(targetInputId);
      if (fileInput) console.log('data-target-input属性からファイル入力を特定:', targetInputId);
    }
    
    // 2. 親要素から検索
    if (!fileInput) {
      const parentElement = btn.closest('.input-group, .form-group, .mb-3');
      if (parentElement) {
        fileInput = parentElement.querySelector('input[type="file"]');
        if (fileInput) console.log('親要素からファイル入力を特定:', fileInput.id);
      }
    }
    
    // 3. ID命名規則から推測
    if (!fileInput && btn.id) {
      const buttonId = btn.id;
      const possibleInputId = buttonId.replace('-camera', '-input').replace('-camera-btn', '-input');
      fileInput = document.getElementById(possibleInputId);
      if (fileInput) console.log('ID命名規則からファイル入力を特定:', possibleInputId);
    }
    
    // 4. 特定の既知のID
    if (!fileInput) {
      // 証明写真用のIDを試す
      fileInput = document.getElementById('id-photo-input');
      if (fileInput) console.log('既知のIDからファイル入力を特定: id-photo-input');
    }
    
    // 5. フォームコンテキストから探す
    if (!fileInput) {
      const form = btn.closest('form');
      if (form) {
        const fileInputs = form.querySelectorAll('input[type="file"]');
        if (fileInputs.length === 1) {
          fileInput = fileInputs[0];
          if (fileInput) console.log('フォームからファイル入力を特定:', fileInput.id);
        }
      }
    }
    
    // 結果を確認
    if (!fileInput) {
      console.error('関連するファイル入力要素が見つかりませんでした');
      return null;
    }
    
    // 有効性チェック
    if (fileInput.disabled) {
      console.error('ファイル入力要素が無効化されています:', fileInput.id);
      return null;
    }
    
    return fileInput;
  }
  
  /**
   * 既存のカメラモーダルとリソースをクリーンアップ
   */
  function cleanupExistingCameraModal() {
    // カメラストリームを停止
    stopCamera();
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('cameraModal');
    if (existingModal) {
      try {
        // Bootstrapモーダルインスタンスを取得して破棄
        const oldModalInstance = bootstrap.Modal.getInstance(existingModal);
        if (oldModalInstance) {
          oldModalInstance.dispose();
        }
        
        // DOM要素を削除
        existingModal.remove();
        console.log('既存のカメラモーダルを削除しました');
      } catch (error) {
        console.log('モーダル削除中にエラーが発生しました:', error);
        
        // フォールバック: 直接削除を試みる
        try {
          existingModal.parentNode.removeChild(existingModal);
          console.log('直接DOM操作でモーダルを削除しました');
        } catch (e) {
          console.error('モーダル要素の削除に完全に失敗しました');
        }
      }
    }
    
    // モーダル背景も削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
      try {
        backdrop.parentNode.removeChild(backdrop);
      } catch (e) {
        console.log('モーダル背景の削除に失敗:', e);
      }
    });
    
    // body要素からbootstrapクラスを削除
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  
  /**
   * カメラモーダルを作成してDOMに追加
   * @param {HTMLInputElement} fileInput 関連付けるファイル入力要素
   */
  function createCameraModalElement(fileInput) {
    // ファイル入力の情報を記録（デバッグ用）
    const fileInputId = fileInput.id || 'unknown';
    console.log(`カメラモーダルを作成: 対象=${fileInputId}`);
    
    // カメラ用モーダルのHTML
    const modalHtml = `
      <div class="modal fade" id="cameraModal" tabindex="-1" aria-labelledby="cameraModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="cameraModalLabel">写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-feedback mb-3">
                <div class="alert alert-info">カメラへのアクセス許可を確認してください...</div>
              </div>
              <div class="ratio ratio-4x3 mb-2 bg-dark">
                <video id="cameraPreview" class="w-100 h-100 bg-dark" autoplay playsInline muted></video>
              </div>
              <canvas id="cameraCanvas" class="d-none"></canvas>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary camera-cancel-btn" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-primary" id="captureButton" disabled>
                <i class="bi bi-camera-fill"></i> 撮影する
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // モーダル要素を取得
    const modalElement = document.getElementById('cameraModal');
    if (!modalElement) {
      throw new Error('カメラモーダル要素の作成に失敗しました');
    }
    
    // イベントリスナーを設定
    setupCameraModalEvents(modalElement, fileInput);
    
    // モーダルを表示
    displayCameraModal(modalElement, fileInput);
  }
  
  /**
   * カメラモーダルにイベントリスナーを設定
   * @param {HTMLElement} modalElement モーダル要素
   * @param {HTMLInputElement} fileInput ファイル入力要素
   */
  function setupCameraModalEvents(modalElement, fileInput) {
    // モーダルが閉じられたときにカメラを停止
    modalElement.addEventListener('hidden.bs.modal', function() {
      console.log('モーダルクローズイベントによりカメラを停止します');
      stopCamera();
    });
    
    // キャンセルボタンの動作を強化
    const cancelBtn = modalElement.querySelector('.camera-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        console.log('キャンセルボタンがクリックされました');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // フォールバック: 手動でモーダルを閉じる
          cleanupExistingCameraModal();
        }
      });
    }
  }
  
  /**
   * カメラモーダルを表示してカメラを初期化
   * @param {HTMLElement} modalElement モーダル要素
   * @param {HTMLInputElement} fileInput ファイル入力要素
   */
  function displayCameraModal(modalElement, fileInput) {
    try {
      // Bootstrapモーダルを初期化
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',  // モーダル外クリックでは閉じない
        keyboard: true       // ESCキーで閉じることは許可
      });
      
      // モーダルを表示
      modal.show();
      
      // モーダルが表示されてからカメラを初期化
      modalElement.addEventListener('shown.bs.modal', function onModalShown() {
        // イベントを一度だけ実行
        modalElement.removeEventListener('shown.bs.modal', onModalShown);
        
        // 少し遅延してカメラを初期化（UIレンダリングを待つ）
        setTimeout(function() {
          initializeCamera(fileInput);
        }, 300);
      });
      
      console.log('カメラモーダルを表示しました');
    } catch (error) {
      console.error('モーダル表示エラー:', error);
      alert('カメラモーダルの表示に失敗しました。別の方法でファイルをアップロードしてください。');
    }
  }
  
  /**
   * カメラを初期化して起動
   * @param {HTMLInputElement} fileInput 関連するファイル入力要素
   */
  function initializeCamera(fileInput) {
    console.log('カメラの初期化を開始します');
    
    const video = document.getElementById('cameraPreview');
    const captureButton = document.getElementById('captureButton');
    const feedbackDiv = document.querySelector('.camera-feedback');
    
    if (!video || !captureButton || !feedbackDiv) {
      console.error('カメラUIの要素が見つかりません');
      showCameraFeedback('エラー: カメラUIの初期化に失敗しました', 'danger');
      return;
    }
    
    // カメラのアクセス制約を緩和して互換性を向上
    const constraints = { 
      audio: false,
      video: { 
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    };
    
    // フィードバックを表示
    showCameraFeedback('カメラを起動しています...', 'info');
    
    // メディアデバイスが利用可能かチェック
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showCameraFeedback('エラー: お使いのブラウザはカメラをサポートしていません', 'danger');
      return;
    }
    
    // カメラへのアクセスを試行
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        // ストリームを保存
        currentStream = stream;
        
        // ストリームをビデオ要素に接続
        video.srcObject = stream;
        
        // ビデオの読み込みイベント
        video.onloadedmetadata = function() {
          // ビデオが読み込まれたら再生開始
          video.play()
            .then(() => {
              console.log('カメラ映像の再生を開始しました');
              // 撮影ボタンを有効化
              captureButton.disabled = false;
              // 成功メッセージを表示
              showCameraFeedback('カメラの準備ができました。撮影ボタンを押してください', 'success');
              
              // 撮影ボタンのクリックイベントを設定
              captureButton.addEventListener('click', function() {
                capturePhoto(stream, fileInput);
              });
            })
            .catch(error => {
              console.error('ビデオ再生エラー:', error);
              showCameraFeedback('カメラの起動に失敗しました: ' + error.message, 'danger');
            });
        };
      })
      .catch(error => {
        console.error('カメラアクセスエラー:', error);
        let errorMessage = 'カメラにアクセスできません';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = 'カメラへのアクセスが拒否されました。ブラウザの設定でカメラへのアクセスを許可してください。';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = 'カメラが見つかりません。カメラが接続されているか確認してください。';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage = 'カメラにアクセスできません。他のアプリケーションがカメラを使用している可能性があります。';
        } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
          errorMessage = '要求されたカメラ設定に対応していません。';
        } else if (error.name === 'TypeError') {
          errorMessage = 'カメラの設定が無効です。';
        }
        
        showCameraFeedback(errorMessage, 'danger');
      });
  }
  
  /**
   * カメラフィードバックメッセージを表示
   * @param {string} message 表示するメッセージ
   * @param {string} type メッセージタイプ（info, success, warning, danger）
   */
  function showCameraFeedback(message, type = 'info') {
    const feedbackDiv = document.querySelector('.camera-feedback');
    if (feedbackDiv) {
      feedbackDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    }
  }
  
  /**
   * 写真を撮影する
   * @param {MediaStream} stream カメラストリーム
   * @param {HTMLInputElement} fileInput 関連するファイル入力要素
   */
  function capturePhoto(stream, fileInput) {
    console.log('写真を撮影します');
    
    const video = document.getElementById('cameraPreview');
    const canvas = document.getElementById('cameraCanvas');
    
    if (!video || !canvas) {
      console.error('撮影に必要な要素が見つかりません');
      return;
    }
    
    try {
      // ビデオの表示サイズを取得
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      if (!videoWidth || !videoHeight) {
        console.error('ビデオのサイズが無効です:', videoWidth, videoHeight);
        showCameraFeedback('カメラの映像が無効です。もう一度試してください。', 'warning');
        return;
      }
      
      // キャンバスのサイズをビデオに合わせる
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      // キャンバスに映像をキャプチャ
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      // PNG形式で画像データを取得
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('画像の生成に失敗しました');
          showCameraFeedback('画像の生成に失敗しました。もう一度試してください。', 'danger');
          return;
        }
        
        // ファイル名を生成
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `photo_${timestamp}.png`;
        
        // File オブジェクトを作成
        const file = new File([blob], fileName, { type: 'image/png' });
        console.log('撮影した画像:', fileName, file.size, 'bytes');
        
        // 撮影成功メッセージを表示
        showCameraFeedback('写真を撮影しました！', 'success');
        
        // ファイル入力のタイプに応じて処理を分岐
        processPhotoFile(file, fileInput);
        
        // カメラモーダルを閉じる
        setTimeout(() => {
          const modalElement = document.getElementById('cameraModal');
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }, 1000);
      }, 'image/png', 0.95);
      
    } catch (error) {
      console.error('写真の撮影中にエラーが発生しました:', error);
      showCameraFeedback('写真の撮影に失敗しました: ' + error.message, 'danger');
    }
  }
  
  /**
   * 撮影した写真を処理する
   * @param {File} file 撮影した写真のFileオブジェクト
   * @param {HTMLInputElement} fileInput 関連するファイル入力要素
   */
  function processPhotoFile(file, fileInput) {
    try {
      // 入力フィールドのIDを取得
      const fileInputId = fileInput.id || 'unknown';
      console.log('写真を処理します:', fileInputId);
      
      if (fileInputId === 'id-photo-input' && typeof handleIdPhotoChange === 'function') {
        // 証明写真の場合、専用ハンドラを使用
        console.log('証明写真ハンドラを使用して処理します');
        handleIdPhotoChange(file);
      } else {
        // 通常のファイル入力に設定
        console.log('通常のファイル入力として処理します');
        // DataTransfer APIでファイル入力を更新
        updateInputWithFile(fileInput, file);
        
        // プレビュー表示用のハンドラを呼び出し
        triggerDocumentPreview(fileInput, file);
      }
    } catch (error) {
      console.error('写真の処理中にエラーが発生しました:', error);
    }
  }
  
  /**
   * ファイル入力要素にFileオブジェクトを設定する
   * @param {HTMLInputElement} fileInput ファイル入力要素
   * @param {File} file Fileオブジェクト
   */
  function updateInputWithFile(fileInput, file) {
    try {
      // DataTransferオブジェクトを使用してファイル入力を更新
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      
      // 変更イベントを発火してプレビュー更新
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (error) {
      console.error('ファイル入力の更新中にエラーが発生しました:', error);
    }
  }
  
  /**
   * 書類プレビュー機能を呼び出す
   * @param {HTMLInputElement} fileInput ファイル入力要素
   * @param {File} file Fileオブジェクト
   */
  function triggerDocumentPreview(fileInput, file) {
    try {
      // ファイル入力要素の親要素を取得
      const inputGroup = fileInput.closest('.input-group, .form-group');
      if (!inputGroup) return;
      
      // モーダルを取得
      const modal = fileInput.closest('.modal');
      if (!modal) return;
      
      // ユーザータイプを特定
      let userType = '';
      if (modal.id === 'touristRegisterModal') {
        userType = 'tourist';
      } else if (modal.id === 'guideRegisterModal') {
        userType = 'guide';
      } else if (modal.id === 'idDocumentModal') {
        userType = modal.getAttribute('data-user-type') || 'document';
      }
      
      // プレビュー表示要素を取得
      const previewContainer = modal.querySelector(`#${userType}-document-preview`);
      const previewImage = modal.querySelector(`#${userType}-document-image`);
      const uploadPrompt = modal.querySelector(`#${userType}-document-upload-prompt`);
      
      if (previewContainer && previewImage && uploadPrompt) {
        // ファイルをプレビュー表示
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          uploadPrompt.classList.add('d-none');
          previewContainer.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('書類プレビュー呼び出し中にエラーが発生しました:', error);
    }
  }
  
  /**
   * カメラを停止
   */
  function stopCamera() {
    try {
      // 現在のストリームを停止
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop();
        });
        currentStream = null;
        console.log('カメラストリームを停止しました');
      }
      
      // ビデオ要素のストリームも停止
      const video = document.getElementById('cameraPreview');
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }
    } catch (error) {
      console.error('カメラ停止中にエラーが発生しました:', error);
    }
  }
  
  /**
   * 最も近いセクション要素を見つける
   * @param {HTMLElement} element 起点となる要素
   * @returns {HTMLElement} 見つかったセクション要素、または null
   */
  function findClosestSection(element) {
    // IDが-uploadで終わる親要素を探す
    let currentNode = element;
    while (currentNode) {
      if (currentNode.id && currentNode.id.endsWith('-upload')) {
        return currentNode;
      }
      currentNode = currentNode.parentElement;
    }
    return null;
  }
  
  /**
   * ファイル入力フィールドを正しいIDでマッピング
   * @param {string} sectionId セクションID
   * @returns {string|null} ファイル入力ID
   */
  function getFileInputIdForSection(sectionId) {
    // 各セクションに対応するファイル入力IDを返す
    const mapping = {
      'passport-upload': 'passport-input',
      'license-upload-front': 'license-front-input',
      'license-upload-back': 'license-back-input',
      'idcard-upload-front': 'idcard-front-input',
      'idcard-upload-back': 'idcard-back-input', 
      'residencecard-upload-front': 'residencecard-front-input',
      'residencecard-upload-back': 'residencecard-back-input'
    };
    
    return mapping[sectionId] || null;
  }
  
  /**
   * 翻訳を適用する
   */
  function applyTranslations() {
    // 国際化モジュールがあれば利用
    if (typeof translateElements === 'function') {
      translateElements();
    }
  }
  
  /**
   * 証明写真データを取得（他のJSで使用）
   * @returns {File|null} 証明写真のFile
   */
  function getProfilePhotoFile() {
    // このファイルでは身分証明書写真撮影のみをサポート
    return null;
  }
  
  // DOMの変更を監視して新しく追加されたカメラボタンを設定
  function setupDomObserver() {
    try {
      // MutationObserverが利用可能かチェック
      if (typeof MutationObserver !== 'function') {
        console.log('MutationObserverがサポートされていません');
        return;
      }
      
      // 新しいノードに対してカメラボタンを設定するオブザーバー
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type !== 'childList') return;
          
          // 新しく追加されたノードをチェック
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            
            // 追加された要素内のファイル入力要素をチェック
            if (node.querySelector) {
              const fileInputs = node.querySelectorAll('input[type="file"]');
              fileInputs.forEach(function(input) {
                const container = input.closest('.input-group, .form-group');
                if (container) {
                  addCameraButton(container);
                }
              });
              
              // カメラボタンを設定
              const cameraButtons = node.querySelectorAll('.camera-btn, [data-camera-target]');
              cameraButtons.forEach(function(button) {
                if (!button.hasAttribute('data-camera-initialized')) {
                  button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // ターゲット要素を取得
                    const targetId = button.getAttribute('data-camera-target') || 
                                    button.getAttribute('data-target-input');
                    let targetInput = targetId ? document.getElementById(targetId) : null;
                    
                    // 親要素から探す
                    if (!targetInput) {
                      const container = button.closest('.input-group, .form-group');
                      if (container) {
                        targetInput = container.querySelector('input[type="file"]');
                      }
                    }
                    
                    // カメラモーダルを表示
                    if (targetInput) {
                      createAndShowCameraModal(targetInput);
                    }
                  });
                  
                  button.setAttribute('data-camera-initialized', 'true');
                }
              });
            }
          });
        });
      });
      
      // document.bodyが利用可能になったら監視を開始
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        console.log('DOM変更監視を開始しました');
      } else {
        window.addEventListener('load', function() {
          if (document.body) {
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
            console.log('DOM変更監視を開始しました (遅延)');
          }
        });
      }
    } catch (error) {
      console.error('DOM監視設定エラー:', error);
    }
  }
  
  // DOM監視を開始
  setupDomObserver();
  
  // グローバルにAPIを公開
  window.documentCameraHandler = {
    createCameraModal: createAndShowCameraModal,
    stopCamera: stopCamera
  };
})();