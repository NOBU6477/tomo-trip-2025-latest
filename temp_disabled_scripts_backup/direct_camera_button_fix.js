/**
 * カメラボタンを直接修正する緊急スクリプト
 * クラス名とテキストに基づいてすべてのカメラボタンを検出し、
 * モーダルの外側と内側の両方のボタンに対応
 */
(function() {
  console.log('カメラボタン直接修正スクリプトを初期化');
  
  // すべてのカメラボタンを検出して修正する
  function fixAllCameraButtons() {
    console.log('すべてのカメラボタンを検索中...');
    
    // テキスト内容でカメラボタンを検索
    const cameraTexts = ['カメラで撮影', 'カメラ', '写真を撮る'];
    
    cameraTexts.forEach(text => {
      // テキスト内容を含むすべての要素を検索
      const elements = Array.from(document.querySelectorAll('a, button, span, div'))
        .filter(el => el.textContent.trim() === text);
      
      elements.forEach(element => {
        if (element.hasAttribute('data-fixed-camera')) return;
        
        console.log(`カメラボタンを検出: ${element.tagName} "${element.textContent.trim()}"`);
        
        // ファイル入力IDを見つける
        let fileInputId = null;
        
        // 1. data-target 属性を確認
        if (element.hasAttribute('data-target')) {
          fileInputId = element.getAttribute('data-target');
        } 
        // 2. 近くのファイル入力要素を探す
        else {
          const fileInput = findNearestFileInput(element);
          if (fileInput && fileInput.id) {
            fileInputId = fileInput.id;
          }
        }
        
        if (!fileInputId) {
          console.warn('関連するファイル入力IDが見つかりません');
          
          // 最も近いフォームグループ内のファイル入力を探す
          const formGroup = findClosestFormGroup(element);
          if (formGroup) {
            const fileInput = formGroup.querySelector('input[type="file"]');
            if (fileInput && fileInput.id) {
              fileInputId = fileInput.id;
              console.log(`フォームグループ内でファイル入力を検出: ${fileInputId}`);
            }
          }
          
          // それでも見つからない場合は、DOM内のすべてのファイル入力から最適なものを選択
          if (!fileInputId) {
            const allFileInputs = document.querySelectorAll('input[type="file"]');
            if (allFileInputs.length > 0) {
              const visibleInputs = Array.from(allFileInputs).filter(input => {
                const rect = input.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
              });
              
              if (visibleInputs.length > 0) {
                fileInputId = visibleInputs[0].id;
                console.log(`可視ファイル入力を検出: ${fileInputId}`);
              } else if (allFileInputs[0].id) {
                fileInputId = allFileInputs[0].id;
                console.log(`最初のファイル入力を使用: ${fileInputId}`);
              }
            }
          }
        }
        
        if (fileInputId) {
          // クリックイベントを新しいハンドラーで置き換え
          const newElement = element.cloneNode(true);
          if (element.parentNode) {
            element.parentNode.replaceChild(newElement, element);
          }
          
          newElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`カメラボタンがクリックされました: ${fileInputId}`);
            showDirectCameraModal(fileInputId);
            
            return false;
          });
          
          // 処理済みとしてマーク
          newElement.setAttribute('data-fixed-camera', 'true');
          console.log(`カメラボタンを修正しました: ${fileInputId}`);
        }
      });
    });
    
    // カメラアイコンも対応
    const cameraIcons = document.querySelectorAll('.fa-camera, .fas.fa-camera');
    cameraIcons.forEach(icon => {
      const parent = icon.closest('a, button, span, div');
      if (parent && !parent.hasAttribute('data-fixed-camera')) {
        // 親要素に対して同様の処理を行う
        const fileInput = findNearestFileInput(parent);
        if (fileInput && fileInput.id) {
          const fileInputId = fileInput.id;
          
          // クリックイベントを新しいハンドラーで置き換え
          const newParent = parent.cloneNode(true);
          if (parent.parentNode) {
            parent.parentNode.replaceChild(newParent, parent);
          }
          
          newParent.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`カメラアイコンがクリックされました: ${fileInputId}`);
            showDirectCameraModal(fileInputId);
            
            return false;
          });
          
          // 処理済みとしてマーク
          newParent.setAttribute('data-fixed-camera', 'true');
          console.log(`カメラアイコンを修正しました: ${fileInputId}`);
        }
      }
    });
  }
  
  /**
   * 最も近いファイル入力要素を見つける
   */
  function findNearestFileInput(element) {
    // 1. 同じフォームグループ内
    const formGroup = findClosestFormGroup(element);
    if (formGroup) {
      const fileInput = formGroup.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
    }
    
    // 2. 親要素をさかのぼる
    let current = element.parentElement;
    let depth = 0;
    const maxDepth = 5;
    
    while (current && depth < maxDepth) {
      const fileInput = current.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
      
      current = current.parentElement;
      depth++;
    }
    
    // 3. 近くの要素を探す
    if (element.nextElementSibling) {
      const fileInput = element.nextElementSibling.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
    }
    
    if (element.previousElementSibling) {
      const fileInput = element.previousElementSibling.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
    }
    
    return null;
  }
  
  /**
   * 最も近いフォームグループを見つける
   */
  function findClosestFormGroup(element) {
    let current = element;
    let depth = 0;
    const maxDepth = 5;
    
    while (current && depth < maxDepth) {
      if (current.classList.contains('form-group') || 
          current.classList.contains('mb-3') || 
          current.classList.contains('mb-4')) {
        return current;
      }
      current = current.parentElement;
      depth++;
    }
    
    return null;
  }
  
  /**
   * 直接カメラモーダルを表示
   */
  function showDirectCameraModal(targetId) {
    console.log(`直接カメラモーダルを表示: ${targetId}`);
    
    // ファイル入力要素を取得
    const fileInput = document.getElementById(targetId);
    if (!fileInput) {
      console.error(`ターゲット入力が見つかりません: ${targetId}`);
      return;
    }
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('direct-camera-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // モーダルを作成
    const modalHTML = `
      <div id="direct-camera-modal" class="modal fade show" tabindex="-1" role="dialog" aria-hidden="false" style="display: block; background-color: rgba(0,0,0,0.5); z-index: 1050;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">カメラで撮影</h5>
              <button type="button" class="btn-close btn-close-white" id="direct-camera-close"></button>
            </div>
            <div class="modal-body text-center">
              <div id="direct-camera-view">
                <video id="direct-camera-video" autoplay playsinline class="img-fluid mb-3" style="background-color: #000; max-height: 50vh;"></video>
                <button type="button" id="direct-camera-capture" class="btn btn-danger rounded-pill">
                  <i class="fas fa-camera me-1"></i> 撮影する
                </button>
              </div>
              <div id="direct-camera-preview" style="display: none;">
                <img id="direct-camera-image" class="img-fluid mb-3" style="max-height: 50vh;">
                <div class="d-flex justify-content-center gap-2">
                  <button type="button" id="direct-camera-use" class="btn btn-success">この写真を使用</button>
                  <button type="button" id="direct-camera-retake" class="btn btn-secondary">撮り直す</button>
                </div>
              </div>
              <div id="direct-camera-fallback" style="display: none;">
                <div class="alert alert-warning mb-3">
                  <i class="fas fa-exclamation-triangle me-2"></i> カメラへのアクセスができませんでした
                </div>
                <button type="button" id="direct-camera-file" class="btn btn-primary">
                  <i class="fas fa-upload me-1"></i> 画像をアップロード
                </button>
              </div>
              <canvas id="direct-camera-canvas" style="display: none;"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // ドキュメントに追加
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 要素への参照
    const modal = document.getElementById('direct-camera-modal');
    const video = document.getElementById('direct-camera-video');
    const canvas = document.getElementById('direct-camera-canvas');
    const captureBtn = document.getElementById('direct-camera-capture');
    const closeBtn = document.getElementById('direct-camera-close');
    const useBtn = document.getElementById('direct-camera-use');
    const retakeBtn = document.getElementById('direct-camera-retake');
    const cameraView = document.getElementById('direct-camera-view');
    const previewView = document.getElementById('direct-camera-preview');
    const fallbackView = document.getElementById('direct-camera-fallback');
    const fallbackBtn = document.getElementById('direct-camera-file');
    const previewImg = document.getElementById('direct-camera-image');
    
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
      fixAllCameraButtons();
    });
  } else {
    fixAllCameraButtons();
  }
  
  // モーダルが表示されたときのイベントリスナー
  document.body.addEventListener('shown.bs.modal', function(e) {
    // モーダル内のカメラボタンを設定
    setTimeout(fixAllCameraButtons, 200);
  });
  
  // 定期的にカメラボタンを検索して修正
  setInterval(fixAllCameraButtons, 2000);
})();