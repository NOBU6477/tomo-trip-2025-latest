/**
 * 最終的なカメラ修正スクリプト
 * document.bodyが存在するタイミングでのみ実行する安全な実装
 */
(function() {
  console.log('最終的なカメラ修正を実行します');
  
  // DOMが完全に読み込まれた時点で実行するメイン関数
  function initializeWhenReady() {
    console.log('DOM読み込み完了 - カメラ修正を初期化します');
    
    if (!document || !document.body) {
      console.warn('document.bodyがまだ存在しません。再試行します...');
      setTimeout(initializeWhenReady, 100);
      return;
    }
    
    // すべてのカメラボタンを対象とする
    setupCameraButtons();
    
    // カメラモーダルが表示された場合に備えてMutationObserverを設定
    setupModalObserver();
    
    // フォールバックメカニズムとして定期的にモーダルをチェック
    setInterval(checkForCameraModals, 1000);
  }
  
  /**
   * ページ上のカメラボタンをすべて設定
   */
  function setupCameraButtons() {
    // カメラボタンの通常のセレクタ
    const cameraButtons = document.querySelectorAll('button:has(.fa-camera), a:has(.fa-camera), button:contains("カメラ"), a:contains("カメラ"), [data-bs-target*="camera"], [data-target*="camera"]');
    
    console.log(`${cameraButtons.length}個のカメラボタンを検出しました`);
    
    cameraButtons.forEach(function(button, index) {
      if (button.hasAttribute('data-final-camera-button')) return;
      
      console.log(`カメラボタン ${index + 1} を設定します:`, button.outerHTML);
      
      // 元のクリックイベントリスナーをすべて削除
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }
      
      // 新しいクリックイベントリスナーを追加
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('カメラボタンがクリックされました');
        
        // 関連するファイル入力またはターゲットIDを特定
        let targetId = null;
        
        // data-target または data-bs-target 属性を確認
        if (newButton.hasAttribute('data-target')) {
          targetId = newButton.getAttribute('data-target').replace('#', '');
        } else if (newButton.hasAttribute('data-bs-target')) {
          targetId = newButton.getAttribute('data-bs-target').replace('#', '');
        }
        
        // ボタンの近くにあるファイル入力を探す
        if (!targetId) {
          const nearestInput = findNearestFileInput(newButton);
          if (nearestInput) targetId = nearestInput.id;
        }
        
        // 特定されたIDを使用してカメラモーダルを開く
        openCameraModal(targetId);
        
        return false;
      });
      
      // 処理済みとしてマーク
      newButton.setAttribute('data-final-camera-button', 'true');
      
      console.log(`カメラボタン ${index + 1} の設定が完了しました`);
    });
  }
  
  /**
   * 最も近いファイル入力要素を取得
   */
  function findNearestFileInput(element) {
    // 1. 親要素内のファイル入力を検索
    let parent = element.parentNode;
    let fileInput = null;
    
    // 5階層まで遡って探す
    for (let i = 0; i < 5 && parent; i++) {
      fileInput = parent.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
      parent = parent.parentNode;
    }
    
    // 2. IDまたはクラスが関連しそうなファイル入力を探す
    const possibleTargets = [];
    if (element.id) {
      possibleTargets.push(
        element.id.replace('camera', ''),
        element.id.replace('Camera', ''),
        element.id.replace('btn', ''),
        element.id.replace('Btn', '')
      );
    }
    
    // 可能性のあるIDに基づいてファイル入力を探す
    for (const targetId of possibleTargets) {
      if (!targetId) continue;
      fileInput = document.getElementById(targetId);
      if (fileInput && fileInput.type === 'file') return fileInput;
    }
    
    // 3. どれも見つからない場合は最初のファイル入力を返す
    return document.querySelector('input[type="file"]');
  }
  
  /**
   * カメラモーダルを表示
   */
  function openCameraModal(targetId) {
    console.log(`カメラモーダルを開いています（ターゲットID: ${targetId || 'なし'}）`);
    
    // 既存のモーダルを削除
    cleanupExistingModals();
    
    // モーダル要素を作成
    const modalId = `custom-camera-modal-${Date.now()}`;
    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'modal fade custom-camera-modal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('data-target-input', targetId || '');
    
    // モーダルHTMLを設定
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">カメラで撮影</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center p-0">
            <div class="camera-container" style="position: relative; max-height: 80vh; overflow: hidden;">
              <video id="camera-video-${modalId}" autoplay playsinline style="width: 100%; max-height: 70vh; background: #000;"></video>
              <canvas id="camera-canvas-${modalId}" style="display: none;"></canvas>
              <div class="camera-controls mt-3 mb-3 p-3">
                <button id="capture-btn-${modalId}" type="button" class="btn btn-danger btn-lg rounded-pill" style="
                  min-width: 200px;
                  font-size: 1.2rem;
                  padding: 12px 30px;
                  box-shadow: 0 0 15px rgba(220, 53, 69, 0.5);
                  position: relative;
                  z-index: 100;
                ">
                  <i class="fas fa-camera"></i> 撮影する
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // bodyに追加
    document.body.appendChild(modal);
    
    // カメラモーダルを表示
    showModal(modal);
    
    // カメラストリームを初期化
    initializeCamera(modal, targetId);
  }
  
  /**
   * 既存のカメラモーダルをクリーンアップ
   */
  function cleanupExistingModals() {
    // すでに存在するカスタムモーダルを削除
    const existingModals = document.querySelectorAll('.custom-camera-modal');
    existingModals.forEach(function(modal) {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });
    
    // バックドロップも削除
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(function(backdrop) {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    });
    
    // ストリームを停止
    if (window.activeStream) {
      const tracks = window.activeStream.getTracks();
      tracks.forEach(track => track.stop());
      window.activeStream = null;
    }
  }
  
  /**
   * モーダルを表示
   */
  function showModal(modal) {
    // Bootstrapが利用可能な場合はAPIを使用
    if (typeof bootstrap !== 'undefined') {
      try {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        return;
      } catch (error) {
        console.warn('Bootstrap APIでのモーダル表示に失敗しました:', error);
      }
    }
    
    // 手動でモーダルを表示
    modal.style.display = 'block';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    // body要素にモーダルオープンクラスを追加
    document.body.classList.add('modal-open');
    
    // バックドロップを追加
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
  
  /**
   * カメラを初期化
   */
  function initializeCamera(modal, targetId) {
    const videoId = `camera-video-${modal.id}`;
    const video = document.getElementById(videoId);
    
    if (!video) {
      console.error('ビデオ要素が見つかりません:', videoId);
      return;
    }
    
    console.log('カメラを初期化しています...');
    
    // カメラアクセスのオプション
    const constraints = {
      video: { facingMode: 'user' },
      audio: false
    };
    
    // カメラアクセスを取得
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        console.log('カメラストリームを取得しました');
        
        // グローバル変数にストリームを保存（後でクリーンアップ用）
        window.activeStream = stream;
        
        // ビデオにストリームを設定
        video.srcObject = stream;
        
        // 撮影ボタンのイベントを設定
        const captureBtn = document.getElementById(`capture-btn-${modal.id}`);
        if (captureBtn) {
          captureBtn.addEventListener('click', function() {
            capturePhoto(modal, targetId);
          });
        }
      })
      .catch(function(error) {
        console.error('カメラアクセスに失敗しました:', error);
        showCameraError(modal, error.message);
      });
  }
  
  /**
   * 写真を撮影
   */
  function capturePhoto(modal, targetId) {
    console.log('写真を撮影します...');
    
    const video = document.getElementById(`camera-video-${modal.id}`);
    const canvas = document.getElementById(`camera-canvas-${modal.id}`);
    
    if (!video || !canvas) {
      console.error('ビデオまたはキャンバス要素が見つかりません');
      return;
    }
    
    try {
      // キャンバスのサイズをビデオに合わせる
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // ビデオフレームをキャンバスに描画
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像をBlobに変換
      canvas.toBlob(function(blob) {
        // FileオブジェクトをBlobから作成
        const fileName = `photo_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        // ファイル入力を見つけてファイルを設定
        const fileInput = targetId ? document.getElementById(targetId) : null;
        
        if (fileInput && fileInput.type === 'file') {
          // DataTransferオブジェクトを使用してファイルを設定
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          
          // 変更イベントを発火
          const event = new Event('change', { bubbles: true });
          fileInput.dispatchEvent(event);
          
          console.log('ファイルを設定しました:', targetId);
          
          // 成功メッセージを表示
          showMessage('写真を撮影しました', 'success');
        } else {
          console.warn('ターゲットファイル入力が見つかりません。すべてのファイル入力を検索します...');
          
          // すべてのファイル入力を検索
          const inputs = document.querySelectorAll('input[type="file"]');
          if (inputs.length > 0) {
            const input = inputs[0];
            
            // DataTransferオブジェクトを使用してファイルを設定
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
            
            console.log('最初のファイル入力にファイルを設定しました:', input.id);
            
            // 成功メッセージを表示
            showMessage('写真を撮影しました', 'success');
          } else {
            console.error('利用可能なファイル入力がありません');
            showMessage('ファイル入力が見つかりません', 'error');
          }
        }
        
        // モーダルを閉じる
        closeModal(modal);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('写真撮影中にエラーが発生しました:', error);
      showMessage('写真の撮影に失敗しました', 'error');
    }
  }
  
  /**
   * カメラエラーメッセージを表示
   */
  function showCameraError(modal, errorMessage) {
    const videoContainer = modal.querySelector('.camera-container');
    if (!videoContainer) return;
    
    // エラーメッセージを表示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger m-3';
    errorDiv.innerHTML = \`<i class="fas fa-exclamation-circle"></i> カメラへのアクセスエラー: \${errorMessage || 'カメラが見つからないか、アクセスが拒否されました。'}\`;
    
    // カメラコンテナの先頭に追加
    videoContainer.insertBefore(errorDiv, videoContainer.firstChild);
    
    // ファイル選択へのフォールバックボタンを追加
    const fallbackButton = document.createElement('button');
    fallbackButton.type = 'button';
    fallbackButton.className = 'btn btn-primary btn-lg rounded-pill mt-3';
    fallbackButton.innerHTML = '<i class="fas fa-upload"></i> 画像をアップロード';
    fallbackButton.style.cssText = 'min-width: 200px; font-size: 1.1rem; padding: 10px 25px;';
    
    // ファイル選択ボタンのクリックイベント
    fallbackButton.addEventListener('click', function() {
      const targetId = modal.getAttribute('data-target-input');
      const fileInput = targetId ? document.getElementById(targetId) : null;
      
      if (fileInput && fileInput.type === 'file') {
        // モーダルを閉じてファイル選択ダイアログを表示
        closeModal(modal);
        fileInput.click();
      } else {
        // すべてのファイル入力を検索
        const inputs = document.querySelectorAll('input[type="file"]');
        if (inputs.length > 0) {
          closeModal(modal);
          inputs[0].click();
        } else {
          showMessage('ファイル入力が見つかりません', 'error');
        }
      }
    });
    
    // コントロール部分に追加
    const controls = modal.querySelector('.camera-controls');
    if (controls) {
      controls.innerHTML = '';
      controls.appendChild(fallbackButton);
    }
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    try {
      // 1. Bootstrap APIを使用
      if (typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
          return;
        }
      }
      
      // 2. 閉じるボタンをクリック
      const closeBtn = modal.querySelector('.btn-close, [data-bs-dismiss="modal"], .close');
      if (closeBtn) {
        closeBtn.click();
        return;
      }
      
      // 3. モーダルクラスとスタイルを直接変更
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      
      // バックドロップも削除
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(function(backdrop) {
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      });
      
      // bodyのスタイルをリセット
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // ストリームを停止
      if (window.activeStream) {
        const tracks = window.activeStream.getTracks();
        tracks.forEach(track => track.stop());
        window.activeStream = null;
      }
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
  }
  
  /**
   * メッセージを表示
   */
  function showMessage(message, type = 'success') {
    // 既存のメッセージを削除
    const existingMessage = document.getElementById('camera-message');
    if (existingMessage) existingMessage.remove();
    
    // 新しいメッセージを作成
    const messageElement = document.createElement('div');
    messageElement.id = 'camera-message';
    messageElement.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${type === 'error' ? '#f8d7da' : '#d4edda'};
      color: ${type === 'error' ? '#721c24' : '#155724'};
      border: 1px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'};
      border-radius: 6px;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      min-width: 300px;
      text-align: center;
    `;
    
    // メッセージテキスト
    messageElement.textContent = message;
    
    // ドキュメントに追加
    document.body.appendChild(messageElement);
    
    // 3秒後に削除
    setTimeout(function() {
      if (messageElement.parentNode) {
        messageElement.parentNode.removeChild(messageElement);
      }
    }, 3000);
  }
  
  /**
   * メイン：モーダルの監視と自動修正
   */
  function setupModalObserver() {
    console.log('モーダル監視を設定します');
    
    // MutationObserverを作成
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 新しく追加されたノードの中からモーダルを検索
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element
              // モーダル要素かどうか確認
              if (node.classList && (node.classList.contains('modal') || node.hasAttribute('role') && node.getAttribute('role') === 'dialog')) {
                // モーダル内にカメラ関連要素があるか確認
                if (isModalCamera(node)) {
                  console.log('新しいカメラモーダルを検出:', node.id || 'ID無しモーダル');
                  fixCameraModal(node);
                }
              }
              
              // 子孫要素の中からモーダルを検索
              const modals = node.querySelectorAll('.modal, [role="dialog"]');
              modals.forEach(function(modal) {
                if (isModalCamera(modal)) {
                  console.log('新しいカメラモーダルを検出(子孫):', modal.id || 'ID無しモーダル');
                  fixCameraModal(modal);
                }
              });
            }
          });
        }
      });
    });
    
    // document.bodyを監視
    try {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      console.log('モーダル監視を開始しました');
    } catch (error) {
      console.error('モーダル監視の設定に失敗しました:', error);
    }
  }
  
  /**
   * モーダルがカメラモーダルかどうかを判定
   */
  function isModalCamera(modal) {
    // 1. モーダルにビデオ要素があるか
    const hasVideo = modal.querySelector('video') !== null;
    if (hasVideo) return true;
    
    // 2. ID名でカメラ関連か判断
    if (modal.id && (modal.id.includes('camera') || modal.id.includes('photo'))) {
      return true;
    }
    
    // 3. クラス名でカメラ関連か判断
    if (modal.classList && (
      modal.classList.contains('camera-modal') || 
      modal.classList.contains('photo-modal')
    )) {
      return true;
    }
    
    // 4. モーダルタイトルにカメラ関連ワードがあるか
    const title = modal.querySelector('.modal-title');
    if (title && (
      title.textContent.includes('カメラ') || 
      title.textContent.includes('写真') || 
      title.textContent.includes('撮影')
    )) {
      return true;
    }
    
    return false;
  }
  
  /**
   * 既存のカメラモーダルを修正
   */
  function fixCameraModal(modal) {
    if (modal.hasAttribute('data-final-fixed')) return;
    
    console.log('カメラモーダルを修正します:', modal.id || 'ID無しモーダル');
    
    // カメラモーダル内に撮影ボタンがあるか確認
    const captureButtons = modal.querySelectorAll('button.btn-danger, button:contains("撮影"), a:contains("撮影"), button:has(.fa-camera)');
    
    if (captureButtons.length > 0) {
      console.log(`${captureButtons.length}個の撮影ボタンを検出`);
      
      // すべての撮影ボタンを修正
      captureButtons.forEach(function(button, index) {
        if (button.hasAttribute('data-final-fixed')) return;
        
        console.log(`撮影ボタン ${index + 1} を修正`);
        
        // 元のクリックイベントリスナーをすべて削除するため、ボタンを複製
        const newButton = button.cloneNode(true);
        
        // 新しいスタイルを適用
        newButton.style.cssText = `
          display: block !important;
          background-color: #dc3545 !important;
          color: white !important;
          font-weight: bold !important;
          font-size: 1.2rem !important;
          padding: 12px 30px !important;
          border-radius: 50px !important;
          border: none !important;
          box-shadow: 0 0 20px rgba(220, 53, 69, 0.7) !important;
          margin: 20px auto !important;
          cursor: pointer !important;
          min-width: 180px !important;
          min-height: 50px !important;
          position: relative !important;
          z-index: 9999 !important;
        `;
        
        // カメラ撮影処理のクリックイベントを設定
        newButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // ビデオ要素を探す
          const video = modal.querySelector('video');
          if (!video) {
            console.warn('カメラモーダル内にビデオ要素が見つかりません');
            return;
          }
          
          try {
            // キャンバスを作成
            let canvas = modal.querySelector('canvas');
            if (!canvas) {
              canvas = document.createElement('canvas');
              canvas.style.display = 'none';
              video.parentNode.appendChild(canvas);
            }
            
            // キャンバスのサイズをビデオに合わせる
            canvas.width = video.videoWidth || video.clientWidth || 640;
            canvas.height = video.videoHeight || video.clientHeight || 480;
            
            // ビデオフレームをキャンバスに描画
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // 関連するファイル入力を探す
            let fileInput = null;
            
            // data-target-input属性をチェック
            if (modal.hasAttribute('data-target-input')) {
              fileInput = document.getElementById(modal.getAttribute('data-target-input'));
            }
            
            // モーダルIDからファイル入力IDを推測
            if (!fileInput && modal.id) {
              const modalId = modal.id;
              const possibleId = modalId
                .replace('camera-modal-', '')
                .replace('camera-', '')
                .replace('-modal', '')
                .replace('Modal', '');
              
              fileInput = document.getElementById(possibleId);
            }
            
            // モーダル内のファイル入力を探す
            if (!fileInput) {
              const modalInputs = modal.querySelectorAll('input[type="file"]');
              if (modalInputs.length > 0) {
                fileInput = modalInputs[0];
              }
            }
            
            // ドキュメント内のすべてのファイル入力を探す
            if (!fileInput) {
              const allInputs = document.querySelectorAll('input[type="file"]');
              if (allInputs.length > 0) {
                fileInput = allInputs[0];
              }
            }
            
            if (fileInput) {
              // 画像をBlobに変換
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
                
                console.log('ファイル入力にキャプチャ画像を設定しました:', fileInput.id);
                
                // モーダルを閉じる
                closeModal(modal);
                
                // 成功メッセージを表示
                showMessage('写真を撮影しました', 'success');
              }, 'image/jpeg', 0.9);
            } else {
              console.error('関連するファイル入力が見つかりません');
              showMessage('ファイル入力が見つかりません', 'error');
            }
          } catch (error) {
            console.error('写真撮影中にエラーが発生しました:', error);
            showMessage('写真の撮影に失敗しました', 'error');
          }
          
          return false;
        });
        
        // 元のボタンを新しいボタンに置き換え
        if (button.parentNode) {
          button.parentNode.replaceChild(newButton, button);
          console.log('撮影ボタンを新しいボタンで置き換えました');
        }
        
        // 処理済みとしてマーク
        newButton.setAttribute('data-final-fixed', 'true');
      });
    } else {
      console.log('撮影ボタンが見つかりません。新しいボタンを追加します');
      
      // モーダル内のビデオ要素を確認
      const video = modal.querySelector('video');
      if (!video) {
        console.warn('モーダル内にビデオ要素が見つかりません');
        return;
      }
      
      // 新しい撮影ボタンを作成
      const newButton = document.createElement('button');
      newButton.type = 'button';
      newButton.className = 'btn btn-danger btn-lg rounded-pill final-capture-btn';
      newButton.innerHTML = '<i class="fas fa-camera"></i> 撮影する';
      newButton.style.cssText = `
        display: block !important;
        background-color: #dc3545 !important;
        color: white !important;
        font-weight: bold !important;
        font-size: 1.2rem !important;
        padding: 12px 30px !important;
        border-radius: 50px !important;
        border: none !important;
        box-shadow: 0 0 20px rgba(220, 53, 69, 0.7) !important;
        margin: 20px auto !important;
        cursor: pointer !important;
        min-width: 200px !important;
        min-height: 50px !important;
        position: relative !important;
        z-index: 9999 !important;
      `;
      
      // カメラ撮影処理のクリックイベントを設定
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        try {
          // キャンバスを作成
          let canvas = modal.querySelector('canvas');
          if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.style.display = 'none';
            video.parentNode.appendChild(canvas);
          }
          
          // キャンバスのサイズをビデオに合わせる
          canvas.width = video.videoWidth || video.clientWidth || 640;
          canvas.height = video.videoHeight || video.clientHeight || 480;
          
          // ビデオフレームをキャンバスに描画
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // 関連するファイル入力を探す
          let fileInput = null;
          
          // data-target-input属性をチェック
          if (modal.hasAttribute('data-target-input')) {
            fileInput = document.getElementById(modal.getAttribute('data-target-input'));
          }
          
          // モーダルIDからファイル入力IDを推測
          if (!fileInput && modal.id) {
            const modalId = modal.id;
            const possibleId = modalId
              .replace('camera-modal-', '')
              .replace('camera-', '')
              .replace('-modal', '')
              .replace('Modal', '');
            
            fileInput = document.getElementById(possibleId);
          }
          
          // モーダル内のファイル入力を探す
          if (!fileInput) {
            const modalInputs = modal.querySelectorAll('input[type="file"]');
            if (modalInputs.length > 0) {
              fileInput = modalInputs[0];
            }
          }
          
          // ドキュメント内のすべてのファイル入力を探す
          if (!fileInput) {
            const allInputs = document.querySelectorAll('input[type="file"]');
            if (allInputs.length > 0) {
              fileInput = allInputs[0];
            }
          }
          
          if (fileInput) {
            // 画像をBlobに変換
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
              
              console.log('ファイル入力にキャプチャ画像を設定しました:', fileInput.id);
              
              // モーダルを閉じる
              closeModal(modal);
              
              // 成功メッセージを表示
              showMessage('写真を撮影しました', 'success');
            }, 'image/jpeg', 0.9);
          } else {
            console.error('関連するファイル入力が見つかりません');
            showMessage('ファイル入力が見つかりません', 'error');
          }
        } catch (error) {
          console.error('写真撮影中にエラーが発生しました:', error);
          showMessage('写真の撮影に失敗しました', 'error');
        }
        
        return false;
      });
      
      // 撮影ボタンを追加する場所を探す
      const buttonContainer = modal.querySelector('.modal-footer') || 
                             modal.querySelector('.modal-body') || 
                             modal.querySelector('.camera-controls');
      
      if (buttonContainer) {
        buttonContainer.appendChild(newButton);
        console.log('撮影ボタンを追加しました');
      } else {
        // コンテナが見つからない場合はモーダルコンテンツに直接追加
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
          // ボタンコンテナを作成して追加
          const container = document.createElement('div');
          container.className = 'camera-controls text-center p-3';
          container.appendChild(newButton);
          modalContent.appendChild(container);
          console.log('撮影ボタンとコンテナを追加しました');
        } else {
          // 最終手段: モーダル自体に追加
          modal.appendChild(newButton);
          console.log('撮影ボタンをモーダルに直接追加しました');
        }
      }
      
      // 処理済みとしてマーク
      newButton.setAttribute('data-final-fixed', 'true');
    }
    
    // モーダルを処理済みとしてマーク
    modal.setAttribute('data-final-fixed', 'true');
  }
  
  /**
   * カメラモーダルを定期的にチェック
   */
  function checkForCameraModals() {
    // カメラモーダルを検索
    const modals = document.querySelectorAll('.modal:not([data-final-fixed]), [role="dialog"]:not([data-final-fixed])');
    
    modals.forEach(function(modal) {
      // 表示中のモーダルでカメラ関連かチェック
      if (isModalCamera(modal) && 
          (modal.classList.contains('show') || 
           modal.style.display === 'block')) {
        console.log('定期チェックでカメラモーダルを検出:', modal.id || 'ID無しモーダル');
        fixCameraModal(modal);
      }
    });
  }
  
  // DOMContentLoadedイベントで初期化を開始
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWhenReady);
  } else {
    // すでにDOMが読み込まれている場合は即時実行
    initializeWhenReady();
  }
  
  // 1秒後にもう一度実行して確実に適用（読み込みタイミングの問題対策）
  setTimeout(initializeWhenReady, 1000);
})();