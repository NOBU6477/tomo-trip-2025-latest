/**
 * 証明写真関連の英語表記をすべて日本語に直接書き換えるスクリプト
 * ラジオボタンの機能も修正
 */
(function() {
  'use strict';
  
  // DOMの読み込みが完了したら初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  /**
   * 初期化
   */
  function init() {
    console.log('証明写真テキスト直接修正スクリプトを初期化');
    
    // モーダル表示イベントを監視
    document.addEventListener('shown.bs.modal', function(event) {
      if (!event.target || !event.target.id) return;
      
      console.log('モーダルが表示されました: ' + event.target.id);
      
      if (event.target.id.includes('RegisterModal') || 
          event.target.id.includes('DocumentModal')) {
        setTimeout(fixPhotoTexts, 100);
      }
    });
    
    // 定期的にチェック（遅延ロードやDOMの動的変更に対応）
    setInterval(fixPhotoTexts, 1000);
  }
  
  /**
   * 証明写真関連のテキストをすべて修正
   */
  function fixPhotoTexts() {
    // 英語表記を日本語に直接置換
    fixTextElements('photo title', '証明写真タイプ');
    fixTextElements('photo single', '証明写真（1枚）');
    fixTextElements('photo dual', '表裏写真（運転免許証等）');
    fixTextElements('photo description', '証明写真の詳細');
    fixTextElements('PHOTO SELECT', '写真を選択');
    fixTextElements('PHOTO CAMERA', 'カメラで撮影');
    fixTextElements('required', '必須');
    
    // ラジオボタンの機能修正
    fixRadioButtons();
    
    // カメラボタンの機能修正
    fixCameraButtons();
  }
  
  /**
   * テキスト要素のテキストを置換
   */
  function fixTextElements(oldText, newText) {
    // テキストノードの探索
    const textNodes = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue && node.nodeValue.trim() === oldText) {
        textNodes.push(node);
      }
    }
    
    // テキストを置換
    textNodes.forEach(node => {
      node.nodeValue = newText;
    });
    
    // ボタンや見出しなど、HTML要素のコンテンツも対象に
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, label, a, div').forEach(el => {
      if (el.childNodes.length === 1 && 
          el.firstChild.nodeType === Node.TEXT_NODE && 
          el.textContent.trim() === oldText) {
        el.textContent = newText;
      }
    });
  }
  
  /**
   * ラジオボタンの機能を修正
   */
  function fixRadioButtons() {
    // 写真タイプラジオボタン
    const singleRadio = document.getElementById('id-photo-type-single');
    const dualRadio = document.getElementById('id-photo-type-dual');
    
    if (!singleRadio || !dualRadio) {
      return; // ラジオボタンがまだ存在しない
    }
    
    // セクション要素
    const singleSection = document.getElementById('single-photo-section');
    const dualSection = document.getElementById('dual-photo-section');
    
    if (!singleSection || !dualSection) {
      return; // セクションがまだ存在しない
    }
    
    // イベントリスナーが既に追加されているかを確認
    if (!singleRadio.hasAttribute('data-fixed')) {
      // 単一写真タイプのイベント
      singleRadio.addEventListener('click', function() {
        console.log('単一写真モードがクリックされました');
        singleSection.style.display = 'block';
        singleSection.classList.remove('d-none');
        dualSection.style.display = 'none';
        dualSection.classList.add('d-none');
      });
      singleRadio.setAttribute('data-fixed', 'true');
    }
    
    if (!dualRadio.hasAttribute('data-fixed')) {
      // 表裏写真タイプのイベント
      dualRadio.addEventListener('click', function() {
        console.log('表裏写真モードがクリックされました');
        singleSection.style.display = 'none';
        singleSection.classList.add('d-none');
        dualSection.style.display = 'block';
        dualSection.classList.remove('d-none');
      });
      dualRadio.setAttribute('data-fixed', 'true');
    }
    
    // 初期状態の設定
    if (singleRadio.checked) {
      singleSection.style.display = 'block';
      singleSection.classList.remove('d-none');
      dualSection.style.display = 'none';
      dualSection.classList.add('d-none');
    } else if (dualRadio.checked) {
      singleSection.style.display = 'none';
      singleSection.classList.add('d-none');
      dualSection.style.display = 'block';
      dualSection.classList.remove('d-none');
    }
  }
  
  /**
   * カメラボタンの機能を修正
   */
  function fixCameraButtons() {
    // すべてのボタンを検索
    document.querySelectorAll('button').forEach(button => {
      // ボタンの内容がカメラに関連していて、修正されていない場合
      if ((button.textContent.includes('カメラ') || 
           button.textContent.includes('PHOTO CAMERA') || 
           button.textContent.includes('撮影')) && 
          !button.hasAttribute('data-camera-fixed')) {
        
        // イベントリスナーを追加
        button.addEventListener('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          
          console.log('カメラボタンがクリックされました');
          
          // ボタンのIDやクラスに基づいて、対象のIDを決定
          let targetId = null;
          
          if (button.id.includes('id-photo-camera-btn')) {
            targetId = 'id-photo';
          } else if (button.id.includes('front-camera')) {
            targetId = 'id-photo-front';
          } else if (button.id.includes('back-camera')) {
            targetId = 'id-photo-back';
          } else if (button.classList.contains('camera-btn')) {
            const parent = button.closest('.document-upload-section');
            if (parent) {
              targetId = parent.id.replace('-upload', '');
            }
          }
          
          if (targetId) {
            console.log('カメラ対象ID:', targetId);
            showCamera(targetId);
          } else {
            console.log('カメラ対象IDが特定できませんでした');
          }
        });
        
        // 修正済みとマーク
        button.setAttribute('data-camera-fixed', 'true');
        console.log('カメラボタンを修正しました:', button.textContent);
      }
    });
  }
  
  /**
   * カメラモーダルを表示
   */
  function showCamera(targetId) {
    console.log('カメラモーダルを表示します、対象:', targetId);
    
    // モーダルのクリーンアップ
    let existingModal = document.getElementById('cameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // カメラモーダルを作成
    const modalHTML = `
      <div class="modal fade" id="cameraModal" tabindex="-1" aria-labelledby="cameraModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="cameraModalLabel">写真を撮影</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="camera-container">
                <div class="video-container">
                  <video id="camera-video" class="w-100" playsinline autoplay></video>
                  <canvas id="camera-canvas" class="d-none"></canvas>
                </div>
                <div id="camera-preview-container" class="preview-container mt-3 text-center d-none">
                  <img id="camera-preview-image" class="img-fluid rounded" alt="プレビュー">
                </div>
                <div id="camera-error" class="alert alert-danger d-none" role="alert">
                  カメラにアクセスできません。デバイスのカメラ設定を確認してください。
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" id="camera-capture-btn" class="btn btn-primary">撮影する</button>
              <button type="button" id="camera-retake-btn" class="btn btn-outline-primary d-none">撮り直す</button>
              <button type="button" id="camera-use-btn" class="btn btn-success d-none">この写真を使用</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Bootstrap Modalインスタンスを作成して表示
    const modalElement = document.getElementById('cameraModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // カメラの設定
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const captureBtn = document.getElementById('camera-capture-btn');
    const retakeBtn = document.getElementById('camera-retake-btn');
    const useBtn = document.getElementById('camera-use-btn');
    const previewContainer = document.getElementById('camera-preview-container');
    const previewImage = document.getElementById('camera-preview-image');
    const errorAlert = document.getElementById('camera-error');
    
    // モーダルが閉じられたときにカメラを停止
    modalElement.addEventListener('hidden.bs.modal', function() {
      if (window.cameraStream) {
        window.cameraStream.getTracks().forEach(track => track.stop());
        window.cameraStream = null;
      }
    });
    
    // カメラを起動
    let constraints = { 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        window.cameraStream = stream;
        video.srcObject = stream;
        captureBtn.disabled = false;
        errorAlert.classList.add('d-none');
      })
      .catch(err => {
        console.error('カメラの起動に失敗しました:', err);
        errorAlert.classList.remove('d-none');
        errorAlert.textContent = 'カメラにアクセスできません: ' + err.message;
      });
    
    // 撮影ボタンのイベント
    captureBtn.addEventListener('click', function() {
      // キャンバスの設定
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 写真をDataURLに変換
      const imageDataURL = canvas.toDataURL('image/jpeg');
      
      // プレビュー表示
      previewImage.src = imageDataURL;
      previewContainer.classList.remove('d-none');
      video.classList.add('d-none');
      
      // ボタン状態の変更
      captureBtn.classList.add('d-none');
      retakeBtn.classList.remove('d-none');
      useBtn.classList.remove('d-none');
    });
    
    // 撮り直しボタンのイベント
    retakeBtn.addEventListener('click', function() {
      // プレビューを非表示にしてビデオを再表示
      previewContainer.classList.add('d-none');
      video.classList.remove('d-none');
      
      // ボタン状態の復元
      captureBtn.classList.remove('d-none');
      retakeBtn.classList.add('d-none');
      useBtn.classList.add('d-none');
    });
    
    // 写真使用ボタンのイベント
    useBtn.addEventListener('click', function() {
      // 写真をBlobに変換
      canvas.toBlob(function(blob) {
        if (!blob) {
          console.error('Blobの作成に失敗しました');
          return;
        }
        
        // ファイル名を設定
        const fileName = `photo_${new Date().getTime()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // 対象の入力要素と対応するプレビュー要素を特定
        const fileInput = document.getElementById(targetId + '-input');
        
        if (fileInput) {
          // DataTransferオブジェクトを使用してファイル入力にファイルを追加
          try {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            // changeイベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            console.log('ファイルが正常に設定されました');
          } catch (error) {
            console.error('ファイル設定エラー:', error);
          }
        } else {
          console.error('対象の入力要素が見つかりませんでした:', targetId + '-input');
        }
        
        // モーダルを閉じる
        modal.hide();
      }, 'image/jpeg', 0.95);
    });
  }
})();