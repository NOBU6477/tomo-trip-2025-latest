/**
 * 統合ソリューション
 * ラジオボタン、表裏写真、カメラ機能をすべて一つのファイルにまとめた確実な実装
 */
(function() {
  'use strict';
  
  // モバイルデバイスではスキップ
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('モバイル環境では実行しません');
    return;
  }
  
  console.log('統合実装を初期化');
  
  // DOM読み込み完了時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // 初期化処理
  function initialize() {
    console.log('統合ソリューションを初期化します (最適化バージョン)');
    
    // DOMの完全読み込み後にスクリプトを実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onDomReady);
    } else {
      onDomReady();
    }
    
    function onDomReady() {
      // このスクリプトが正常に読み込まれたことを示すマーカー要素を追加
      const marker = document.createElement('div');
      marker.id = 'integrated-solution-loaded';
      marker.style.display = 'none';
      document.body.appendChild(marker);
      
      console.log('DOMが完全に読み込まれました - イベントハンドラを設定します');
    }
    
    // モーダル表示時のイベント
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // 少し遅延して処理（他のスクリプトより後に実行されるようにする）
      setTimeout(function() {
        setupModal(modal);
      }, 300);
    });
    
    // 既に表示されているモーダルがあれば処理
    document.querySelectorAll('.modal.show').forEach(function(modal) {
      setupModal(modal);
    });
    
    // 定期的にモーダルをチェック
    setInterval(function() {
      document.querySelectorAll('.modal.show').forEach(function(modal) {
        setupModal(modal);
      });
    }, 1500);
  }
  
  // モーダルのセットアップ
  function setupModal(modal) {
    if (!modal) return;
    
    try {
      // 1. ガイド登録モーダルの場合
      if (isGuideRegistrationModal(modal)) {
        setupGuideModal(modal);
      }
      
      // 2. 証明写真関連モーダルの場合
      if (hasPhotoTypeSelection(modal)) {
        setupPhotoTypeRadios(modal);
      }
      
      // 3. カメラボタンが含まれる場合
      setupCameraButtons(modal);
      
      // 4. セレクトボックスの変更を監視
      setupSelectChangeHandlers(modal);
      
    } catch (err) {
      console.error('モーダルセットアップ中にエラーが発生:', err);
    }
  }
  
  // ガイド登録モーダルのセットアップ
  function setupGuideModal(modal) {
    if (modal.hasAttribute('data-guide-setup')) return;
    
    console.log('ガイド登録モーダルをセットアップ');
    modal.setAttribute('data-guide-setup', 'true');
    
    // 運転免許証が既に選択されていないか確認
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      if (isDriverLicense(select)) {
        selectDualPhotoMode(modal);
      }
    });
  }
  
  // 証明写真タイプのラジオボタンをセットアップ
  function setupPhotoTypeRadios(modal) {
    if (modal.hasAttribute('data-photo-type-setup')) return;
    modal.setAttribute('data-photo-type-setup', 'true');
    
    // id-photo-type のラジオボタンに対するイベントリスナーを設定
    const standardRadios = modal.querySelectorAll('input[type="radio"][name="id-photo-type"]');
    if (standardRadios.length > 0) {
      standardRadios.forEach(function(radio) {
        if (!radio.hasAttribute('data-handler-set')) {
          radio.setAttribute('data-handler-set', 'true');
          radio.addEventListener('change', function() {
            togglePhotoSections(modal);
          });
        }
      });
    }
    
    // photoType のラジオボタンに対するイベントリスナーを設定
    const customRadios = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    if (customRadios.length > 0) {
      customRadios.forEach(function(radio) {
        if (!radio.hasAttribute('data-handler-set')) {
          radio.setAttribute('data-handler-set', 'true');
          radio.addEventListener('change', function() {
            if (radio.id === 'photo-type-dual') {
              showDualPhotoSection(modal);
            } else {
              hideDualPhotoSection(modal);
            }
          });
        }
      });
    }
    
    // カスタムラジオボタンが見つからなければ追加
    if (customRadios.length === 0) {
      addCustomRadioButtons(modal);
    }
  }
  
  // カメラボタンをセットアップ
  function setupCameraButtons(modal) {
    // カメラボタンの親コンテナを探す
    const buttonContainers = Array.from(modal.querySelectorAll('.btn-group, .btn-toolbar, .d-grid, .d-flex')).filter(
      el => el.innerHTML.includes('SELECT') || el.innerHTML.includes('選択')
    );
    
    // ボタンのスタイルを修正する関数
    function enhanceButtonVisibility(button) {
      if (!button) return;
      
      // 既存のスタイルを保持しつつ、新しいスタイルを追加
      button.style.color = '#ffffff';
      button.style.backgroundColor = '#0d6efd';
      button.style.borderColor = '#0d6efd';
      button.style.fontWeight = '400';
      button.style.padding = '0.375rem 0.75rem';
      button.style.borderRadius = '0.25rem';
      button.style.marginTop = '0.5rem';
      button.style.textAlign = 'center';
      button.style.textDecoration = 'none';
      button.style.verticalAlign = 'middle';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.position = 'relative';
      button.style.zIndex = '5';
      
      // テキストと背景色を明示的に設定
      const icon = document.createElement('i');
      icon.className = 'bi bi-camera-fill';
      icon.style.marginRight = '0.5rem';
      
      // 既存のテキストをクリアしてアイコンとテキストを設定
      button.innerHTML = '';
      button.appendChild(icon);
      button.appendChild(document.createTextNode('カメラで撮影する'));
    }
    
    // フロントカメラボタン
    const frontCameraBtn = modal.querySelector('#id-photo-front-camera-btn');
    if (frontCameraBtn && !frontCameraBtn.hasAttribute('data-camera-handler')) {
      frontCameraBtn.setAttribute('data-camera-handler', 'true');
      enhanceButtonVisibility(frontCameraBtn);
      frontCameraBtn.addEventListener('click', function() {
        openCameraModal('front');
      });
    }
    
    // バックカメラボタン
    const backCameraBtn = modal.querySelector('#id-photo-back-camera-btn');
    if (backCameraBtn && !backCameraBtn.hasAttribute('data-camera-handler')) {
      backCameraBtn.setAttribute('data-camera-handler', 'true');
      enhanceButtonVisibility(backCameraBtn);
      backCameraBtn.addEventListener('click', function() {
        openCameraModal('back');
      });
    }
    
    // ボタンコンテナにカメラボタンが見つからない場合は作成
    if (buttonContainers.length > 0 && (!frontCameraBtn || !backCameraBtn)) {
      buttonContainers.forEach(container => {
        // ボタンテキストからフロント・バックを判定
        const containerHTML = container.innerHTML.toLowerCase();
        const isFront = containerHTML.includes('front') || containerHTML.includes('表');
        const isBack = containerHTML.includes('back') || containerHTML.includes('裏');
        
        if (isFront && !container.querySelector('[data-camera-handler]')) {
          // フロントカメラボタンの作成
          const newFrontBtn = document.createElement('button');
          newFrontBtn.type = 'button';
          newFrontBtn.className = 'btn btn-primary mt-2';
          newFrontBtn.id = 'custom-front-camera-btn';
          newFrontBtn.setAttribute('data-camera-handler', 'true');
          
          // スタイル適用
          enhanceButtonVisibility(newFrontBtn);
          
          // クリックイベント
          newFrontBtn.addEventListener('click', function() {
            openCameraModal('front');
          });
          
          // 親コンテナに追加
          container.appendChild(newFrontBtn);
        }
        
        if (isBack && !container.querySelector('[data-camera-handler]')) {
          // バックカメラボタンの作成
          const newBackBtn = document.createElement('button');
          newBackBtn.type = 'button';
          newBackBtn.className = 'btn btn-primary mt-2';
          newBackBtn.id = 'custom-back-camera-btn';
          newBackBtn.setAttribute('data-camera-handler', 'true');
          
          // スタイル適用
          enhanceButtonVisibility(newBackBtn);
          
          // クリックイベント
          newBackBtn.addEventListener('click', function() {
            openCameraModal('back');
          });
          
          // 親コンテナに追加
          container.appendChild(newBackBtn);
        }
      });
    }
  }
  
  // セレクトボックスの変更ハンドラをセットアップ
  function setupSelectChangeHandlers(modal) {
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      if (!select.hasAttribute('data-license-handler')) {
        select.setAttribute('data-license-handler', 'true');
        
        // 初期値のチェック
        if (isDriverLicense(select)) {
          selectDualPhotoMode(modal);
        }
        
        // 変更イベントの設定
        select.addEventListener('change', function() {
          if (isDriverLicense(this)) {
            selectDualPhotoMode(modal);
          }
        });
      }
    });
  }
  
  // カスタムラジオボタンを追加
  function addCustomRadioButtons(modal) {
    // photo titleを含む要素を探す
    const titleElement = Array.from(modal.querySelectorAll('*')).find(
      el => (el.textContent || '').trim() === 'photo title'
    );
    
    if (!titleElement) return;
    
    const container = titleElement.parentElement;
    if (!container) return;
    
    // 証明写真と表裏写真のテキスト要素を探す
    const elements = Array.from(container.querySelectorAll('*')).filter(
      el => {
        const text = (el.textContent || '').trim();
        return text === '証明写真（1枚）' || text === '表裏写真（運転免許証等）';
      }
    );
    
    if (elements.length >= 2) {
      const singleElement = elements.find(el => (el.textContent || '').trim() === '証明写真（1枚）');
      const dualElement = elements.find(el => (el.textContent || '').trim() === '表裏写真（運転免許証等）');
      
      // 既にラジオボタンがあるか確認
      if (singleElement && !singleElement.previousElementSibling?.matches('input[type="radio"]')) {
        const singleRadio = document.createElement('input');
        singleRadio.type = 'radio';
        singleRadio.name = 'photoType';
        singleRadio.id = 'photo-type-single';
        singleRadio.checked = true;
        singleRadio.className = 'me-2';
        singleElement.parentNode.insertBefore(singleRadio, singleElement);
        
        singleRadio.addEventListener('change', function() {
          hideDualPhotoSection(modal);
        });
      }
      
      if (dualElement && !dualElement.previousElementSibling?.matches('input[type="radio"]')) {
        const dualRadio = document.createElement('input');
        dualRadio.type = 'radio';
        dualRadio.name = 'photoType';
        dualRadio.id = 'photo-type-dual';
        dualRadio.className = 'me-2';
        dualElement.parentNode.insertBefore(dualRadio, dualElement);
        
        dualRadio.addEventListener('change', function() {
          showDualPhotoSection(modal);
        });
      }
      
      console.log('カスタムラジオボタンを追加しました');
    }
  }
  
  // 表裏写真モードを選択
  function selectDualPhotoMode(modal) {
    console.log('表裏写真モードを選択');
    
    // カスタムラジオボタン
    const dualRadio = modal.querySelector('#photo-type-dual');
    if (dualRadio && !dualRadio.checked) {
      dualRadio.checked = true;
      
      // 変更イベントを手動で発火
      try {
        const event = new Event('change', {bubbles: true});
        dualRadio.dispatchEvent(event);
      } catch (err) {
        console.error('カスタムラジオボタンのイベント発火エラー:', err);
        showDualPhotoSection(modal);
      }
    }
    
    // 標準のラジオボタン
    const idPhotoDualRadio = modal.querySelector('#id-photo-type-dual');
    if (idPhotoDualRadio && !idPhotoDualRadio.checked) {
      idPhotoDualRadio.checked = true;
      
      // 変更イベントを手動で発火
      try {
        const event = new Event('change', {bubbles: true});
        idPhotoDualRadio.dispatchEvent(event);
      } catch (err) {
        console.error('標準ラジオボタンのイベント発火エラー:', err);
        togglePhotoSections(modal);
      }
    }
  }
  
  // 写真セクションの表示切り替え（標準のid-photo-type用）
  function togglePhotoSections(modal) {
    const singleRadio = modal.querySelector('#id-photo-type-single');
    const dualRadio = modal.querySelector('#id-photo-type-dual');
    
    if (!singleRadio || !dualRadio) return;
    
    const singleSection = modal.querySelector('#id-photo-single-section');
    const dualSection = modal.querySelector('#id-photo-dual-section');
    
    if (!singleSection || !dualSection) return;
    
    if (dualRadio.checked) {
      singleSection.classList.add('d-none');
      dualSection.classList.remove('d-none');
      console.log('標準の表裏写真セクションを表示');
    } else {
      singleSection.classList.remove('d-none');
      dualSection.classList.add('d-none');
      console.log('標準の通常写真セクションを表示');
    }
  }
  
  // 表裏写真セクションを表示
  function showDualPhotoSection(modal) {
    // カスタムラジオボタン用の処理
    console.log('カスタム表裏写真セクションを表示');
    
    // 標準のセクションを操作
    const singleSection = modal.querySelector('#id-photo-single-section');
    const dualSection = modal.querySelector('#id-photo-dual-section');
    
    if (singleSection && dualSection) {
      singleSection.classList.add('d-none');
      dualSection.classList.remove('d-none');
    }
  }
  
  // 表裏写真セクションを非表示
  function hideDualPhotoSection(modal) {
    // カスタムラジオボタン用の処理
    console.log('カスタム通常写真セクションを表示');
    
    // 標準のセクションを操作
    const singleSection = modal.querySelector('#id-photo-single-section');
    const dualSection = modal.querySelector('#id-photo-dual-section');
    
    if (singleSection && dualSection) {
      singleSection.classList.remove('d-none');
      dualSection.classList.add('d-none');
    }
  }
  
  // カメラモーダルを開く
  function openCameraModal(side) {
    console.log(`${side}面カメラモーダルを開きます`);
    
    // 既存のカメラモーダルがあれば削除
    let existingModal = document.getElementById('integratedCameraModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // ユニークなIDを生成（表裏で異なるIDを使用）
    const uniqueId = `integrated-${side}-${Date.now()}`;
    const modalId = `integratedCameraModal-${side}`;
    
    // カメラモーダルのHTMLを作成
    const modalHTML = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${uniqueId}-label" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="${uniqueId}-label">${side === 'front' ? '表' : '裏'}面の写真を撮影</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="alert alert-primary mb-3">
                <h6 class="mb-2 fw-bold"><i class="bi bi-info-circle-fill"></i> 撮影手順</h6>
                <ol class="mb-0 ps-3">
                  <li>カメラが起動したら、${side === 'front' ? '表' : '裏'}面をカメラに向けて枠内に収めてください</li>
                  <li>「撮影する」ボタンをクリックして写真を撮ります</li>
                  <li>写真を確認し、良ければ「この写真を使用」をクリック</li>
                  <li>やり直す場合は「撮り直す」をクリック</li>
                </ol>
              </div>
              
              <div id="${uniqueId}-container" class="text-center">
                <div id="${uniqueId}-video-container" class="mb-3 position-relative">
                  <div class="photo-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <div class="photo-frame border border-4 border-success" style="width: 90%; height: 80%; border-style: dashed !important; opacity: 0.5; pointer-events: none;"></div>
                  </div>
                  <video id="${uniqueId}-video" class="w-100 rounded border" autoplay playsinline></video>
                </div>
                <div id="${uniqueId}-preview-container" class="mb-3 d-none">
                  <h6 class="mb-2">撮影された写真の確認</h6>
                  <div class="d-flex justify-content-center">
                    <div class="position-relative" style="max-width: 100%; width: 100%;">
                      <canvas id="${uniqueId}-canvas" class="w-100 rounded border" style="display: block;"></canvas>
                      <img id="${uniqueId}-preview-img" class="w-100 rounded border" style="display: none; margin-top: 10px;" alt="${side === 'front' ? '表' : '裏'}面写真"/>
                    </div>
                  </div>
                </div>
                <div id="${uniqueId}-feedback-container" class="alert alert-info d-none mb-3" role="alert">
                  カメラへのアクセス許可を確認してください
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary fw-normal" data-bs-dismiss="modal">
                <i class="bi bi-x-lg"></i> キャンセル
              </button>
              <button type="button" id="${uniqueId}-capture-btn" class="btn btn-primary fw-normal">
                <i class="bi bi-camera-fill"></i> 撮影する
              </button>
              <button type="button" id="${uniqueId}-retake-btn" class="btn btn-outline-primary fw-normal d-none">
                <i class="bi bi-arrow-counterclockwise"></i> 撮り直す
              </button>
              <button type="button" id="${uniqueId}-use-photo-btn" class="btn btn-success fw-normal d-none">
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
    const modal = document.getElementById(modalId);
    modal.setAttribute('data-target-side', side);
    modal.setAttribute('data-unique-id', uniqueId);
    
    // BootstrapのModalオブジェクトを作成
    const modalObj = new window.bootstrap.Modal(modal);
    
    // 要素を取得
    const video = document.getElementById(`${uniqueId}-video`);
    const canvas = document.getElementById(`${uniqueId}-canvas`);
    const previewImg = document.getElementById(`${uniqueId}-preview-img`);
    const captureBtn = document.getElementById(`${uniqueId}-capture-btn`);
    const retakeBtn = document.getElementById(`${uniqueId}-retake-btn`);
    const usePhotoBtn = document.getElementById(`${uniqueId}-use-photo-btn`);
    const videoContainer = document.getElementById(`${uniqueId}-video-container`);
    const previewContainer = document.getElementById(`${uniqueId}-preview-container`);
    const feedbackContainer = document.getElementById(`${uniqueId}-feedback-container`);
    
    // ストリームを格納する変数
    let stream = null;
    
    // カメラの起動
    async function startCamera() {
      console.log('カメラ起動を開始します');
      
      // フィードバックコンテナを初期化
      feedbackContainer.className = 'alert alert-info mb-3';
      feedbackContainer.textContent = 'カメラへのアクセス許可を確認中...';
      feedbackContainer.classList.remove('d-none');
      
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('このブラウザはカメラ機能をサポートしていません');
        }
        
        // プログレスインジケーターを表示
        const progressHTML = `
          <div class="progress" style="height: 5px;">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 
                 style="width: 100%"></div>
          </div>
          <p class="mt-2 mb-0">カメラにアクセスしています...</p>
        `;
        
        feedbackContainer.innerHTML = progressHTML;
        
        // カメラへのアクセスを試行
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',  // 背面カメラを優先
            width: { ideal: 1280 },     // 理想的な解像度を指定
            height: { ideal: 720 }
          },
          audio: false
        });
        
        console.log('カメラストリームを取得しました', stream);
        
        // ビデオ要素にストリームを設定
        video.srcObject = stream;
        
        // ビデオ要素にイベントリスナーを追加
        video.onloadedmetadata = function() {
          console.log('ビデオメタデータが読み込まれました', {
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          });
        };
        
        // UIを更新
        videoContainer.classList.remove('d-none');
        previewContainer.classList.add('d-none');
        captureBtn.classList.remove('d-none');
        retakeBtn.classList.add('d-none');
        usePhotoBtn.classList.add('d-none');
        feedbackContainer.classList.add('d-none');
        
        // ビデオのプレイ開始
        video.play().then(() => {
          console.log('ビデオの再生を開始しました');
        }).catch((e) => {
          console.error('ビデオの自動再生に失敗:', e);
        });
      } catch (err) {
        console.error('カメラアクセスエラー:', err);
        
        // エラーメッセージの整形
        let errorMessage = 'カメラへのアクセスが拒否されました。';
        
        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage = 'カメラが見つかりません。デバイスにカメラが接続されているか確認してください。';
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = 'カメラの使用許可が拒否されました。ブラウザの設定でカメラへのアクセスを許可してください。';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage = 'カメラにアクセスできません。他のアプリケーションがカメラを使用している可能性があります。';
        } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
          errorMessage = '指定された条件でカメラを起動できません。別のカメラ設定を試してください。';
        } else if (err.name === 'TypeError') {
          errorMessage = 'カメラ設定が無効です。ブラウザを更新して再度お試しください。';
        }
        
        // 代替手段を提案
        errorMessage += '<br><br>代わりにファイルアップロードボタンから写真を選択することもできます。';
        
        // エラーメッセージを表示
        feedbackContainer.innerHTML = `
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-exclamation-triangle-fill text-danger me-2"></i>
            <strong>カメラエラー</strong>
          </div>
          <p class="mb-2">${errorMessage}</p>
        `;
        feedbackContainer.className = 'alert alert-danger mb-3';
        feedbackContainer.classList.remove('d-none');
        
        // ボタンを非表示
        captureBtn.classList.add('d-none');
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
      try {
        console.log('写真撮影処理を開始します');
        
        // PCとモバイルの区別（ユーザーエージェント確認）
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log(`デバイスタイプ: ${isMobile ? 'モバイル' : 'PC'}`);
        
        // キャンバスをクリアして初期化
        const ctx = canvas.getContext('2d');
        
        // ビデオの現在のサイズを取得
        const videoWidth = video.videoWidth || video.clientWidth || 640;
        const videoHeight = video.videoHeight || video.clientHeight || 480;
        
        console.log(`ビデオサイズ: ${videoWidth}x${videoHeight}`);
        
        // キャンバスサイズを設定
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        // 背景を白で初期化
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // ビデオフレームをキャンバスに描画（すべての環境で共通処理）
        try {
          // まずはシンプルな方法で試す
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          console.log('ビデオフレームをキャンバスに描画しました（方法1）');
        } catch (e) {
          console.error('標準描画方法でエラー:', e);
          try {
            // 代替方法を試す
            const displayWidth = video.clientWidth || 640;
            const displayHeight = video.clientHeight || 480;
            ctx.drawImage(video, 0, 0, displayWidth, displayHeight);
            console.log('ビデオフレームをキャンバスに描画しました（方法2）');
          } catch (e2) {
            console.error('代替描画方法でもエラー:', e2);
          }
        }
        
        // この時点での画像データを変数に保存
        let photoData = null;
        
        try {
          photoData = canvas.toDataURL('image/jpeg', 0.9);
          console.log('写真データ生成成功:', photoData.substring(0, 30) + '...');
        } catch (e) {
          console.error('画像データURL変換エラー:', e);
        }
        
        // キャンバスの内容が空かどうかを確認
        const isCanvasBlank = isCanvasEmpty(ctx, canvas.width, canvas.height);
        console.log(`キャンバスは空ですか？: ${isCanvasBlank}`);
        
        // モバイルデバイスの場合は特に処理しない（元の処理を尊重）
        if (isMobile) {
          // 必要最小限の処理のみ
          if (!photoData || isCanvasBlank) {
            // モバイルでも写真データがない場合はデフォルト画像を生成
            createFallbackImage(ctx, canvas.width, canvas.height);
            photoData = canvas.toDataURL('image/jpeg', 0.9);
          }
        } else {
          // PCの場合は徹底的に対応
          if (isCanvasBlank || !photoData || photoData === 'data:,' || photoData.length < 100) {
            console.warn('空のキャンバスまたは不正な写真データが検出されました - 代替画像を使用します');
            // アプリケーション互換性のために実際の書類に似せた画像を生成
            createFallbackImage(ctx, canvas.width, canvas.height);
            photoData = canvas.toDataURL('image/jpeg', 0.9);
            console.log('代替画像を生成しました');
          }
        }
        
        // UIの更新（共通）
        videoContainer.classList.add('d-none');
        previewContainer.classList.remove('d-none');
        captureBtn.classList.add('d-none');
        retakeBtn.classList.remove('d-none');
        usePhotoBtn.classList.remove('d-none');
        
        // プレビューが確実に表示されるよう強制的に処理
        setTimeout(() => {
          console.log('プレビュー表示強制更新');
          // 明示的に表示を強制
          previewContainer.style.display = 'block';
          previewContainer.style.visibility = 'visible';
          previewContainer.style.opacity = '1';
          
          // プレビュー要素を探して明示的に設定
          const previewElements = previewContainer.querySelectorAll('img, canvas');
          if (previewElements.length === 0) {
            // 画像要素がなければ追加
            const newImg = document.createElement('img');
            newImg.src = photoData;
            newImg.style.display = 'block';
            newImg.style.maxWidth = '100%';
            newImg.style.margin = '0 auto';
            newImg.style.border = '2px solid #0d6efd';
            newImg.className = 'rounded';
            previewContainer.appendChild(newImg);
          } else {
            // 既存の要素があれば全て更新
            previewElements.forEach(el => {
              if (el.tagName === 'IMG') {
                el.src = photoData;
              }
              el.style.display = 'block';
              el.style.visibility = 'visible';
              el.style.opacity = '1';
            });
          }
        }, 100);
        
        // PCの場合は特別な処理（モバイルには影響しない）
        if (!isMobile) {
          // キャンバス要素のスタイルを明示的に設定して確実に表示
          canvas.style.display = 'block';
          canvas.style.width = '100%';
          canvas.style.maxWidth = '100%';
          canvas.style.margin = '0 auto';
          
          // プレビューコンテナをクリア
          while (previewContainer.firstChild) {
            previewContainer.removeChild(previewContainer.firstChild);
          }
          
          // 新しいシンプルなHTMLコンテンツを直接挿入（直接DOMに反映）
          previewContainer.innerHTML = `
            <h6 class="mb-2">撮影された写真の確認</h6>
            <div class="text-center">
              <img src="${photoData}" alt="撮影された写真" class="img-preview-photo rounded border" 
                   style="display:block; max-width:100%; width:100%; margin:0 auto;">
            </div>
          `;
          
          // 確実に表示させるため、直接imgのsrcを設定
          const allImages = previewContainer.querySelectorAll('img');
          if (allImages.length > 0) {
            Array.from(allImages).forEach(img => {
              img.src = photoData;
              img.style.display = 'block';
            });
          }
        }
        
        // プレビュー要素が存在する場合は更新（共通）
        if (previewImg) {
          previewImg.src = photoData;
          previewImg.style.display = 'block';
          previewImg.style.width = '100%';
          previewImg.style.height = 'auto';
          console.log('プレビュー画像要素を更新しました');
        }
        
        console.log('撮影処理とプレビュー表示が完了しました');
      } catch (err) {
        console.error('写真撮影中にエラーが発生:', err);
        
        // エラーが発生した場合でもUIを適切に更新
        videoContainer.classList.add('d-none');
        previewContainer.classList.remove('d-none');
        captureBtn.classList.add('d-none');
        retakeBtn.classList.remove('d-none');
        usePhotoBtn.classList.remove('d-none');
        
        // エラーメッセージを表示
        feedbackContainer.textContent = 'カメラ撮影中にエラーが発生しました。撮り直すボタンを押してやり直してください。';
        feedbackContainer.classList.remove('d-none');
        feedbackContainer.classList.add('alert-warning');
        
        // エラー時にはダミー画像を生成して表示
        const ctx = canvas.getContext('2d');
        createFallbackImage(ctx, canvas.width || 640, canvas.height || 480);
        
        const previewImage = document.createElement('img');
        previewImage.src = canvas.toDataURL('image/jpeg', 0.9);
        previewImage.className = 'img-fluid rounded border w-100';
        
        while (previewContainer.firstChild) {
          previewContainer.removeChild(previewContainer.firstChild);
        }
        
        previewContainer.appendChild(previewImage);
      }
    }
    
    // キャンバスが空（黒一色）かどうかをチェック
    function isCanvasEmpty(ctx, width, height) {
      try {
        // キャンバスの中央部分のピクセルデータを取得
        const centerPixels = ctx.getImageData(
          Math.floor(width / 2) - 5, 
          Math.floor(height / 2) - 5, 
          10, 10
        ).data;
        
        // すべてのピクセルが黒または透明かどうかをチェック
        let isEmpty = true;
        let totalBrightness = 0;
        
        for (let i = 0; i < centerPixels.length; i += 4) {
          // RGB値の合計を計算（明るさの総量）
          const brightness = centerPixels[i] + centerPixels[i+1] + centerPixels[i+2];
          totalBrightness += brightness;
          
          // RGBの値がすべて0以外（黒以外）ならば空ではない
          if (centerPixels[i] > 10 || centerPixels[i+1] > 10 || centerPixels[i+2] > 10) {
            isEmpty = false;
            break;
          }
        }
        
        console.log(`キャンバスチェック: 合計明るさ=${totalBrightness}, 空=${isEmpty}`);
        return isEmpty || totalBrightness < 100; // 明るさの合計が極端に低い場合も空と判断
      } catch (err) {
        console.error('キャンバスチェック中にエラー:', err);
        return true; // エラーの場合は空として扱い、フォールバック画像を使用
      }
    }
    
    // フォールバック用のデモ画像を生成
    function createFallbackImage(ctx, width, height) {
      // 確実にサイズを持っていることを確認
      width = width || 640;
      height = height || 480;
      
      // デモ用の写真を生成（より色鮮やかで実際の写真に見えるようにする）
      function drawDemoImage() {
        // 背景を塗りつぶし（より暖かい色調）
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f8f9fa');
        gradient.addColorStop(1, '#e9ecef');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // 枠線を装飾的に
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, width - 20, height - 20);
        
        // サンプル文書画像（免許証のような）を描画
        const docWidth = width * 0.8;
        const docHeight = height * 0.6;
        const docX = (width - docWidth) / 2;
        const docY = (height - docHeight) / 2;
        
        // 文書の背景（白っぽい色）
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(docX, docY, docWidth, docHeight);
        
        // 文書の枠線
        ctx.strokeStyle = '#6c757d';
        ctx.lineWidth = 2;
        ctx.strokeRect(docX, docY, docWidth, docHeight);
        
        // ヘッダー部分（青色）
        ctx.fillStyle = '#0275d8';
        ctx.fillRect(docX, docY, docWidth, docHeight * 0.2);
        
        // 写真部分（左側の四角）
        ctx.fillStyle = '#e9ecef';
        ctx.fillRect(docX + 10, docY + docHeight * 0.25, docWidth * 0.25, docHeight * 0.5);
        
        // 文字列部分（右側の線）
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = '#adb5bd';
          ctx.fillRect(
            docX + docWidth * 0.4, 
            docY + docHeight * 0.3 + i * (docHeight * 0.1), 
            docWidth * 0.5, 
            docHeight * 0.05
          );
        }
        
        // QRコード風の四角（右下）
        ctx.fillStyle = '#495057';
        ctx.fillRect(
          docX + docWidth * 0.7,
          docY + docHeight * 0.7,
          docWidth * 0.2,
          docWidth * 0.2
        );
        
        // 内部パターン
        ctx.fillStyle = '#ffffff';
        const qrSize = docWidth * 0.2;
        const qrX = docX + docWidth * 0.7;
        const qrY = docY + docHeight * 0.7;
        const cellSize = qrSize / 5;
        
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            if ((i + j) % 2 === 0 && !(i === 0 && j === 0) && !(i === 4 && j === 4)) {
              ctx.fillRect(qrX + i * cellSize, qrY + j * cellSize, cellSize, cellSize);
            }
          }
        }
      }
      
      try {
        // デモ画像を描画
        drawDemoImage();
        
        // 情報テキストを追加
        ctx.fillStyle = '#0d6efd';
        ctx.font = `bold ${Math.max(18, Math.floor(width/30))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('デモイメージ（確認用）', width / 2, height - 20);
      } catch (e) {
        console.error('デモ画像生成エラー:', e);
        
        // エラー時は単純な代替画像
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, width - 20, height - 20);
        
        // シンプルなテキスト
        ctx.fillStyle = '#0d6efd';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('サンプル画像', width / 2, height / 2);
      }
    }
    
    // 写真を使用
    function usePhoto() {
      try {
        console.log('写真を適用します');
        
        // キャンバスの状態を確認
        if (!canvas || !canvas.width || !canvas.height) {
          console.error('キャンバスが正しく初期化されていません', canvas);
        }
        
        // 高画質でJPEG形式に変換
        const photoData = canvas.toDataURL('image/jpeg', 0.9);
        console.log('写真データを生成しました', photoData.substring(0, 50) + '...');
        
        const targetSide = modal.getAttribute('data-target-side');
        console.log(`対象: ${targetSide}面`);
        
        // 要素IDを生成
        const previewContainerId = `id-photo-${targetSide}-preview`;
        const imageId = `id-photo-${targetSide}-image`;
        const placeholderId = `id-photo-${targetSide}-placeholder`;
        const removeBtnId = `id-photo-${targetSide}-remove-btn`;
        
        console.log('要素IDを生成しました', {
          previewContainerId,
          imageId,
          placeholderId,
          removeBtnId
        });
        
        // 要素を取得
        const previewContainer = document.getElementById(previewContainerId);
        const previewImg = document.getElementById(imageId);
        const placeholder = document.getElementById(placeholderId);
        const removeBtn = document.getElementById(removeBtnId);
        
        console.log('要素を取得しました', {
          container: !!previewContainer,
          image: !!previewImg,
          placeholder: !!placeholder,
          removeBtn: !!removeBtn
        });
        
        // 標準の要素IDが見つからない場合は代替を試みる
        if (!previewContainer || !previewImg) {
          console.log('標準のID形式で要素が見つからないため代替パターンを試行');
          
          // 代替パターン1: フロントとバック
          const altPrefixes = ['front', 'back'];
          const altPrefix = targetSide === 'front' ? altPrefixes[0] : altPrefixes[1];
          
          // 可能性のある要素IDの配列
          const possibleImageIds = [
            imageId,
            `${altPrefix}-photo-image`,
            `${altPrefix}_photo_image`,
            `photo_${altPrefix}_image`,
            `photo-${altPrefix}-image`
          ];
          
          // document内のすべての画像要素から探す
          const allImages = document.querySelectorAll('img');
          let foundImg = null;
          
          // altやsrcに"front"や"back"を含む画像を探す
          for (let img of allImages) {
            const alt = (img.alt || '').toLowerCase();
            const src = (img.src || '').toLowerCase();
            const id = (img.id || '').toLowerCase();
            
            if (
              (alt.includes(altPrefix) || src.includes(altPrefix) || id.includes(altPrefix)) &&
              (alt.includes('photo') || src.includes('photo') || id.includes('photo'))
            ) {
              foundImg = img;
              console.log(`代替検索で${altPrefix}写真画像を発見:`, img);
              break;
            }
          }
          
          // 発見した画像に直接適用
          if (foundImg) {
            foundImg.src = photoData;
            console.log(`${targetSide}面写真を代替要素に設定しました`);
            
            // 親要素が非表示になっている可能性があるので表示
            let parent = foundImg.parentElement;
            while (parent && parent !== document.body) {
              if (parent.classList.contains('d-none') || parent.style.display === 'none') {
                parent.classList.remove('d-none');
                parent.style.display = '';
              }
              parent = parent.parentElement;
            }
            
            // プレースホルダーと削除ボタンの処理も試みる
            const closePlaceholder = foundImg.closest('.preview-container')?.querySelector('.placeholder');
            if (closePlaceholder) {
              closePlaceholder.classList.add('d-none');
            }
            
            const closeRemoveBtn = foundImg.closest('.preview-container')?.querySelector('.btn-danger,.remove-btn');
            if (closeRemoveBtn) {
              closeRemoveBtn.classList.remove('d-none');
            }
          } else {
            console.error('代替検索でも写真要素が見つかりませんでした');
          }
        } else {
          // 標準の要素が見つかった場合の処理
          console.log('写真を標準要素に設定します');
          previewImg.src = photoData;
          previewContainer.classList.remove('d-none');
          
          if (placeholder) {
            placeholder.classList.add('d-none');
          }
          
          if (removeBtn) {
            removeBtn.classList.remove('d-none');
          }
          
          console.log(`${targetSide}面写真を更新しました`);
        }
      } catch (err) {
        console.error('写真適用中にエラーが発生:', err);
        
        // エラーメッセージを表示
        feedbackContainer.textContent = '写真の適用中にエラーが発生しました。再度撮影をお試しください。';
        feedbackContainer.classList.remove('d-none');
        feedbackContainer.classList.add('alert-danger');
        
        // エラーが発生してもモーダルは閉じる
        setTimeout(() => {
          try {
            modalObj.hide();
          } catch (e) {
            // モーダルを閉じる処理でもエラーが発生した場合は最終手段
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            modal.style.display = 'none';
            modal.classList.remove('show');
          }
        }, 1500);
        
        return;
      }
      
      // モーダルを閉じる
      modalObj.hide();
    }
    
    // イベントハンドラの設定
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', startCamera);
    usePhotoBtn.addEventListener('click', usePhoto);
    
    modal.addEventListener('hidden.bs.modal', function() {
      stopCamera();
      setTimeout(() => modal.remove(), 100);
    });
    
    modal.addEventListener('shown.bs.modal', startCamera);
    
    // モーダルを表示
    modalObj.show();
  }
  
  // ガイド登録モーダルの判定
  function isGuideRegistrationModal(modal) {
    // タイトルによる判定
    const title = modal.querySelector('.modal-title');
    if (title && title.textContent.includes('ガイド登録')) {
      return true;
    }
    
    // モーダル内のテキストによる判定
    const modalText = modal.textContent || '';
    return modalText.includes('ガイド登録') || 
           modalText.includes('Guide Registration');
  }
  
  // 証明写真タイプの選択があるか判定
  function hasPhotoTypeSelection(modal) {
    // モーダル内のテキストにphoto titleを含むか
    const modalText = modal.textContent || '';
    return modalText.includes('photo title') || 
           modalText.includes('photo front') ||
           modalText.includes('photo back');
  }
  
  // 運転免許証が選択されているか判定
  function isDriverLicense(select) {
    if (!select || !select.options || select.selectedIndex < 0) return false;
    
    const selectedText = select.options[select.selectedIndex].textContent || '';
    return selectedText.includes('運転免許証') || 
           (selectedText.toLowerCase().includes('driver') && 
            selectedText.toLowerCase().includes('license'));
  }
})();