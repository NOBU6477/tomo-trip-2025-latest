/**
 * 書類アップロード用の横レイアウト修正とカメラボタン機能修復スクリプト
 */
(function() {
  console.log('横レイアウト・カメラ修正: 初期化中');
  
  // 設定
  const config = {
    // Windows連携メッセージの非表示フラグ
    hideWindowsMessages: true,
    
    // カメラモーダルが表示されるまでの待機時間（ミリ秒）
    cameraModalWaitTime: 500,
    
    // 定期的なチェック間隔（ミリ秒）
    checkInterval: 1000
  };
  
  // DOM変更の監視
  const observer = new MutationObserver(handleDomChanges);
  
  // 初期化時と定期的に要素をチェック
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFixes);
  } else {
    initFixes();
  }
  
  // 初期化機能
  function initFixes() {
    console.log('横レイアウト・カメラ修正: 初期化を開始');
    
    // DOM全体の変更を監視
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // 初回チェック
    checkAndFixLayout();
    fixCameraButtons();
    
    // 定期的にチェック
    setInterval(function() {
      checkAndFixLayout();
      fixCameraButtons();
      if (config.hideWindowsMessages) {
        removeWindowsMessages();
      }
    }, config.checkInterval);
  }
  
  // DOM変更ハンドラ
  function handleDomChanges(mutations) {
    let shouldCheckLayout = false;
    let shouldFixButtons = false;
    
    // 変更の種類を確認
    for (const mutation of mutations) {
      // 新しく追加された要素があるか
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          
          // 要素ノードのみ処理
          if (node.nodeType === Node.ELEMENT_NODE) {
            // モーダルかどうか
            if (node.classList && node.classList.contains('modal')) {
              console.log('横レイアウト・カメラ修正: モーダル追加を検出');
              shouldCheckLayout = true;
              shouldFixButtons = true;
            }
            
            // Windows連携メッセージかどうか
            if (config.hideWindowsMessages && node.id && node.id.includes('Xiaomi')) {
              console.log('横レイアウト・カメラ修正: Windowsリンクメッセージを検出');
              node.style.display = 'none';
            }
          }
        }
      }
    }
    
    // 変更があれば対応する機能を実行
    if (shouldCheckLayout) {
      setTimeout(checkAndFixLayout, 100);
    }
    
    if (shouldFixButtons) {
      setTimeout(fixCameraButtons, 100);
    }
  }
  
  // レイアウトをチェックして修正
  function checkAndFixLayout() {
    // 書類セクションを探す
    const documentSections = findDocumentSections();
    
    if (documentSections.length > 0) {
      console.log('横レイアウト・カメラ修正: 書類セクションを検出 -', documentSections.length);
      
      // 各セクションに対してレイアウト修正
      documentSections.forEach(section => {
        convertToHorizontalLayout(section);
      });
    }
  }
  
  // 書類セクションを探す（運転免許証アップロードなど）
  function findDocumentSections() {
    const results = [];
    
    // 1. 運転免許証の表面・裏面を含む要素
    const licenseRows = document.querySelectorAll('.row, .form-row, div.mb-3, div.mb-4');
    
    licenseRows.forEach(row => {
      const text = row.textContent.trim();
      
      // 表面・裏面という文字列を含む要素を検索
      if (
        text.includes('運転免許証') || 
        text.includes('表面') && text.includes('裏面') ||
        text.includes('両面をアップロードしてください')
      ) {
        results.push(row);
      }
    });
    
    // 2. カメラと表面・裏面を含む要素を詳細に検索
    if (results.length === 0) {
      const sections = document.querySelectorAll('.card, .form-group, .mb-3, .mb-4');
      
      sections.forEach(section => {
        // カメラボタンと運転免許証関連文字列があるか
        const hasCameraButton = section.querySelector('button.camera-button, button:has(i.bi-camera), [class*="camera"]');
        const hasDualSides = section.textContent.includes('表面') && section.textContent.includes('裏面');
        
        if (hasCameraButton || hasDualSides) {
          results.push(section);
        }
      });
    }
    
    return results;
  }
  
  // 縦レイアウトを横レイアウトに変換
  function convertToHorizontalLayout(container) {
    // すでに処理済みのコンテナならスキップ
    if (container.getAttribute('data-horizontal-layout') === 'true') {
      return;
    }
    
    console.log('横レイアウト・カメラ修正: レイアウト変換を開始');
    
    // 処理済みフラグを設定
    container.setAttribute('data-horizontal-layout', 'true');
    
    try {
      // 表面と裏面のセクションを探す
      const frontSection = findSideSection(container, '表面');
      const backSection = findSideSection(container, '裏面');
      
      if (frontSection && backSection) {
        console.log('横レイアウト・カメラ修正: 表面・裏面セクションを検出');
        
        // 親要素
        const parent = container.parentNode;
        
        // 新しい水平コンテナの作成
        const horizontalContainer = document.createElement('div');
        horizontalContainer.className = 'row document-sides-container';
        horizontalContainer.style.display = 'flex';
        horizontalContainer.style.flexDirection = 'row';
        horizontalContainer.style.gap = '20px';
        horizontalContainer.style.margin = '0 -10px';
        
        // 表面と裏面を入れる列を作成
        const frontCol = document.createElement('div');
        frontCol.className = 'col-md-6 front-side-column';
        
        const backCol = document.createElement('div');
        backCol.className = 'col-md-6 back-side-column';
        
        // 連続テキストを探して最初の列に移動
        const introText = findIntroductionText(container);
        if (introText) {
          frontCol.appendChild(introText.cloneNode(true));
          if (introText.parentNode) {
            introText.style.display = 'none';
          }
        }
        
        // 表面と裏面の要素を対応する列に移動
        frontCol.appendChild(frontSection);
        backCol.appendChild(backSection);
        
        // 水平コンテナに列を追加
        horizontalContainer.appendChild(frontCol);
        horizontalContainer.appendChild(backCol);
        
        // 元の場所に水平コンテナを挿入
        container.parentNode.insertBefore(horizontalContainer, container);
        
        // 元のコンテナを非表示にする（完全に削除すると予期せぬ動作の可能性）
        container.style.display = 'none';
        
        console.log('横レイアウト・カメラ修正: 水平レイアウトに変換完了');
      } else {
        console.log('横レイアウト・カメラ修正: 表面または裏面セクションが見つかりません');
      }
    } catch (err) {
      console.error('横レイアウト・カメラ修正: レイアウト変換エラー', err);
    }
  }
  
  // 表面または裏面のセクションを探す
  function findSideSection(container, sideType) {
    // sideTypeは'表面'または'裏面'
    
    // まず子要素から直接検索
    const directChildren = Array.from(container.children);
    
    for (const child of directChildren) {
      if (child.textContent.includes(sideType)) {
        return child;
      }
    }
    
    // 子要素内の深い階層から検索
    const potentialSections = [];
    
    // .row, .form-group, .mb-3などのコンテナ要素を探す
    const containers = container.querySelectorAll('.row, .form-group, .mb-3, .mb-4, .card-body, div');
    
    containers.forEach(elem => {
      if (elem.textContent.includes(sideType)) {
        // 重複を除外
        if (!potentialSections.includes(elem) && !hasAncestor(elem, potentialSections)) {
          potentialSections.push(elem);
        }
      }
    });
    
    // 最も細かい範囲の要素を選ぶ
    if (potentialSections.length > 0) {
      // テキスト内容の長さが最も短い（＝最も具体的な）要素を選択
      potentialSections.sort((a, b) => a.textContent.length - b.textContent.length);
      return potentialSections[0];
    }
    
    // ファイル入力とカメラボタンを含む要素を探す
    const fileInputs = container.querySelectorAll('input[type="file"]');
    
    for (const input of fileInputs) {
      // 入力ラベルやボタンにsideTypeが含まれているか確認
      const parentGroup = findParentElement(input, '.form-group, .mb-3, .mb-4');
      
      if (parentGroup && parentGroup.textContent.includes(sideType)) {
        return parentGroup;
      }
    }
    
    return null;
  }
  
  // 紹介テキストを探す（「両面をアップロードしてください」など）
  function findIntroductionText(container) {
    const paragraphs = container.querySelectorAll('p, .text-muted, .mb-2, .form-text');
    
    for (const p of paragraphs) {
      const text = p.textContent.trim();
      if (
        text.includes('両面をアップロード') || 
        text.includes('アップロードしてください') ||
        text.includes('表面と裏面')
      ) {
        return p;
      }
    }
    
    return null;
  }
  
  // カメラボタンを修正
  function fixCameraButtons() {
    // カメラボタンを探す
    const cameraButtons = document.querySelectorAll('button.camera-button, button:has(i.bi-camera), [class*="camera"], .btn-primary:has(.bi-camera), .camera');
    
    cameraButtons.forEach(button => {
      // すでに処理済みならスキップ
      if (button.getAttribute('data-camera-fixed') === 'true') {
        return;
      }
      
      // 処理済みフラグを設定
      button.setAttribute('data-camera-fixed', 'true');
      
      console.log('横レイアウト・カメラ修正: カメラボタンを検出', button.textContent.trim());
      
      // オリジナルのクリックイベントを保存
      const originalClick = button.onclick;
      
      // クリックイベントを上書き
      button.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('横レイアウト・カメラ修正: カメラボタンがクリックされました');
        
        // 関連するファイル入力を探す
        const fileInput = findRelatedFileInput(button);
        
        if (fileInput) {
          // 1. オリジナルのクリックイベントを試行
          if (typeof originalClick === 'function') {
            try {
              console.log('横レイアウト・カメラ修正: オリジナルのイベントハンドラを実行');
              originalClick.call(button, e);
              
              // カメラモーダルが表示されるまで少し待つ
              setTimeout(() => {
                checkCameraModalOpened(fileInput);
              }, config.cameraModalWaitTime);
              
              return;
            } catch (err) {
              console.error('横レイアウト・カメラ修正: オリジナルのイベントハンドラでエラー', err);
            }
          }
          
          // 2. フォールバック: イベントをディスパッチ
          try {
            console.log('横レイアウト・カメラ修正: クリックイベントをディスパッチ');
            // クリックイベントをディスパッチ
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            
            button.dispatchEvent(clickEvent);
            
            // カメラモーダルが表示されるまで少し待つ
            setTimeout(() => {
              checkCameraModalOpened(fileInput);
            }, config.cameraModalWaitTime);
            
            return;
          } catch (err) {
            console.error('横レイアウト・カメラ修正: イベントディスパッチでエラー', err);
          }
          
          // 3. 最終手段: 直接カメラAPIを使用
          try {
            console.log('横レイアウト・カメラ修正: 直接カメラAPIを使用');
            openCameraDirectly(fileInput);
          } catch (err) {
            console.error('横レイアウト・カメラ修正: 直接カメラAPIでエラー', err);
            
            // 4. 最終フォールバック: ファイル選択ダイアログを開く
            try {
              console.log('横レイアウト・カメラ修正: ファイル選択ダイアログを開く');
              fileInput.click();
            } catch (clickErr) {
              console.error('横レイアウト・カメラ修正: ファイル選択ダイアログでエラー', clickErr);
            }
          }
        } else {
          console.error('横レイアウト・カメラ修正: 関連するファイル入力が見つかりません');
          
          // オリジナルのクリックイベントを試行
          if (typeof originalClick === 'function') {
            try {
              originalClick.call(button, e);
            } catch (err) {
              console.error('横レイアウト・カメラ修正: 最終フォールバックでエラー', err);
            }
          }
        }
      };
    });
  }
  
  // カメラモーダルが開いたかチェック
  function checkCameraModalOpened(fileInput) {
    // 開いているモーダルを探す
    const openModals = document.querySelectorAll('.modal.show, .modal[style*="display: block"]');
    
    if (openModals.length > 0) {
      console.log('横レイアウト・カメラ修正: カメラモーダルが開きました');
      
      // Windowsメッセージを非表示
      if (config.hideWindowsMessages) {
        removeWindowsMessages();
      }
      
      // 定期的にWindowsメッセージをチェック
      const intervalId = setInterval(() => {
        if (config.hideWindowsMessages) {
          removeWindowsMessages();
        }
      }, 1000);
      
      // 一定時間後にクリア
      setTimeout(() => {
        clearInterval(intervalId);
      }, 10000);
    } else {
      console.log('横レイアウト・カメラ修正: カメラモーダルが開きませんでした');
      
      // フォールバック: 直接カメラAPIを使用
      try {
        openCameraDirectly(fileInput);
      } catch (err) {
        console.error('横レイアウト・カメラ修正: 直接カメラAPIでエラー', err);
        
        // 最終フォールバック: ファイル選択ダイアログを開く
        try {
          fileInput.click();
        } catch (clickErr) {
          console.error('横レイアウト・カメラ修正: ファイル選択ダイアログでエラー', clickErr);
        }
      }
    }
  }
  
  // 直接カメラを開く
  function openCameraDirectly(fileInput) {
    // モーダルが存在するか確認
    const existingModal = document.querySelector('#direct-camera-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // モーダルを作成
    const modal = document.createElement('div');
    modal.id = 'direct-camera-modal';
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('data-bs-backdrop', 'static');
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title"><i class="bi bi-camera me-2"></i>カメラで撮影</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-0">
            <div class="camera-container bg-dark position-relative" style="min-height: 300px;">
              <video id="direct-camera-video" class="w-100" autoplay playsinline></video>
              <canvas id="direct-camera-canvas" class="d-none"></canvas>
              
              <div id="direct-preview-container" class="d-none position-absolute top-0 start-0 w-100 h-100 bg-dark d-flex align-items-center justify-content-center">
                <img id="direct-preview-image" src="" alt="撮影画像" style="max-width: 100%; max-height: 100%; object-fit: contain;">
              </div>
              
              <div id="direct-camera-status" class="position-absolute top-0 start-0 w-100 p-2 text-white bg-dark bg-opacity-50" style="display: none;"></div>
            </div>
          </div>
          <div class="modal-footer">
            <div id="direct-camera-controls">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
              <button type="button" class="btn btn-primary" id="direct-capture-btn">
                <i class="bi bi-camera me-1"></i>撮影
              </button>
            </div>
            <div id="direct-preview-controls" style="display: none;">
              <button type="button" class="btn btn-secondary" id="direct-retake-btn">
                <i class="bi bi-arrow-counterclockwise me-1"></i>撮り直す
              </button>
              <button type="button" class="btn btn-primary" id="direct-use-photo-btn">
                <i class="bi bi-check me-1"></i>この写真を使用する
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // DOMに追加
    document.body.appendChild(modal);
    
    // Bootstrapモーダルを初期化
    let modalInstance = null;
    try {
      modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    } catch (err) {
      console.error('横レイアウト・カメラ修正: モーダル初期化エラー', err);
      
      // 手動でモーダルを表示
      modal.style.display = 'block';
      modal.classList.add('show');
      document.body.classList.add('modal-open');
      
      // 背景を追加
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
    
    // カメラのセットアップ
    const video = document.getElementById('direct-camera-video');
    const canvas = document.getElementById('direct-camera-canvas');
    const captureBtn = document.getElementById('direct-capture-btn');
    const retakeBtn = document.getElementById('direct-retake-btn');
    const usePhotoBtn = document.getElementById('direct-use-photo-btn');
    const previewContainer = document.getElementById('direct-preview-container');
    const previewImage = document.getElementById('direct-preview-image');
    const cameraControls = document.getElementById('direct-camera-controls');
    const previewControls = document.getElementById('direct-preview-controls');
    const statusDisplay = document.getElementById('direct-camera-status');
    
    // メディアストリーム
    let mediaStream = null;
    
    // カメラを開始
    async function startCamera() {
      try {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };
        
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = mediaStream;
        updateStatus('カメラ準備完了');
      } catch (err) {
        console.error('横レイアウト・カメラ修正: カメラアクセスエラー', err);
        updateStatus('カメラにアクセスできません', 'error');
        showCameraError();
      }
    }
    
    // カメラを停止
    function stopCamera() {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
      }
    }
    
    // 写真を撮影
    function capturePhoto() {
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        
        // 背景を白く塗る（透明部分対策）
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // ビデオをキャンバスに描画
        ctx.drawImage(video, 0, 0);
        
        // 画像データを取得
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        
        // プレビュー表示
        previewImage.src = imageData;
        previewContainer.classList.remove('d-none');
        video.style.display = 'none';
        
        // コントロールを切り替え
        cameraControls.style.display = 'none';
        previewControls.style.display = 'block';
      } catch (err) {
        console.error('横レイアウト・カメラ修正: 写真撮影エラー', err);
        updateStatus('写真の撮影に失敗しました', 'error');
      }
    }
    
    // 写真を撮り直す
    function retakePhoto() {
      // ビデオ表示に戻す
      previewContainer.classList.add('d-none');
      video.style.display = 'block';
      
      // コントロールを切り替え
      cameraControls.style.display = 'block';
      previewControls.style.display = 'none';
    }
    
    // 撮影した写真を使用
    function usePhoto() {
      try {
        // 画像データを取得
        const imageData = previewImage.src;
        
        // ファイル作成
        fetch(imageData)
          .then(res => res.blob())
          .then(blob => {
            // ファイル名とタイプを設定
            const filename = 'camera_' + Date.now() + '.jpg';
            const file = new File([blob], filename, { type: 'image/jpeg' });
            
            // DataTransferオブジェクトを作成してファイル入力に設定
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
            
            // モーダルを閉じる
            closeModal();
          })
          .catch(err => {
            console.error('横レイアウト・カメラ修正: ファイル作成エラー', err);
            updateStatus('ファイルの作成に失敗しました', 'error');
          });
      } catch (err) {
        console.error('横レイアウト・カメラ修正: 写真使用エラー', err);
        updateStatus('写真の使用に失敗しました', 'error');
      }
    }
    
    // カメラエラーを表示
    function showCameraError() {
      const container = document.querySelector('.camera-container');
      if (!container) return;
      
      container.innerHTML = `
        <div class="p-4 text-center">
          <div class="alert alert-warning mb-3">
            <h5 class="mb-2">カメラにアクセスできません</h5>
            <p class="mb-1">以下の理由が考えられます：</p>
            <ul class="text-start">
              <li>ブラウザの設定でカメラへのアクセスが許可されていません</li>
              <li>デバイスにカメラが接続されていません</li>
              <li>別のアプリがカメラを使用しています</li>
            </ul>
          </div>
          <div class="mt-3">
            <button class="btn btn-secondary me-2" data-bs-dismiss="modal">
              キャンセル
            </button>
            <button class="btn btn-primary" id="direct-file-select-btn">
              <i class="bi bi-upload me-1"></i>画像を選択
            </button>
          </div>
        </div>
      `;
      
      // ファイル選択ボタンの設定
      const fileSelectBtn = document.getElementById('direct-file-select-btn');
      if (fileSelectBtn) {
        fileSelectBtn.addEventListener('click', function() {
          closeModal();
          setTimeout(() => {
            fileInput.click();
          }, 300);
        });
      }
    }
    
    // ステータス表示を更新
    function updateStatus(message, type = 'info') {
      if (!statusDisplay) return;
      
      statusDisplay.textContent = message;
      statusDisplay.style.display = 'block';
      
      // スタイルをタイプに応じて設定
      if (type === 'error') {
        statusDisplay.className = 'position-absolute top-0 start-0 w-100 p-2 text-white bg-danger bg-opacity-75';
      } else {
        statusDisplay.className = 'position-absolute top-0 start-0 w-100 p-2 text-white bg-dark bg-opacity-50';
      }
      
      // 一定時間後に消す
      setTimeout(() => {
        statusDisplay.style.display = 'none';
      }, 3000);
    }
    
    // モーダルを閉じる
    function closeModal() {
      // カメラを停止
      stopCamera();
      
      // モーダルを閉じる
      if (modalInstance) {
        modalInstance.hide();
      } else {
        // 手動で閉じる
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        // 背景を削除
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
      }
      
      // 少し待ってからモーダル要素を削除
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 300);
    }
    
    // モーダルが閉じられたらカメラを停止
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
    });
    
    // カメラ開始
    startCamera();
    
    // ボタンイベントを設定
    if (captureBtn) {
      captureBtn.addEventListener('click', capturePhoto);
    }
    
    if (retakeBtn) {
      retakeBtn.addEventListener('click', retakePhoto);
    }
    
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', usePhoto);
    }
    
    // 閉じるボタンの設定
    const closeButtons = modal.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', closeModal);
    });
  }
  
  // 関連するファイル入力を探す
  function findRelatedFileInput(button) {
    // 1. フォームグループ内を探す
    const formGroup = findParentElement(button, '.form-group, .mb-3, .mb-4, .form-row, .input-group');
    
    if (formGroup) {
      const fileInput = formGroup.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 2. 近くの要素を探す
    let parent = button.parentNode;
    while (parent && parent !== document.body) {
      const fileInput = parent.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
      parent = parent.parentNode;
    }
    
    // 3. データ属性を探す
    const targetId = button.getAttribute('data-target') || button.getAttribute('data-bs-target');
    if (targetId && targetId.startsWith('#')) {
      const fileInput = document.querySelector(targetId + ' input[type="file"]') || document.querySelector('input[type="file"]' + targetId);
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 4. ボタンの近くにあるすべてのファイル入力を探す
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    if (allFileInputs.length === 1) {
      // ファイル入力が1つしかなければそれを使用
      return allFileInputs[0];
    }
    
    return null;
  }
  
  // Windows連携メッセージを削除
  function removeWindowsMessages() {
    // Xiaomi系のポップアップを検索して削除
    const xiaomiPopups = document.querySelectorAll('div[id^="Xiaomi"]');
    xiaomiPopups.forEach(popup => {
      popup.style.display = 'none';
    });
    
    // Windowsリンクテキストを含む要素を検索
    const windowsLinkElements = Array.from(document.querySelectorAll('div, p, span')).filter(
      el => el.textContent && el.textContent.includes('Windows にリンク')
    );
    
    windowsLinkElements.forEach(element => {
      element.style.display = 'none';
    });
  }
  
  // ヘルパー関数: 指定したセレクターに一致する親要素を探す
  function findParentElement(element, selector) {
    while (element && element !== document.body) {
      if (element.matches && element.matches(selector)) {
        return element;
      }
      element = element.parentNode;
    }
    return null;
  }
  
  // ヘルパー関数: 配列内の要素の祖先かどうか
  function hasAncestor(element, potentialAncestors) {
    let parent = element.parentNode;
    while (parent && parent !== document.body) {
      if (potentialAncestors.includes(parent)) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
})();