/**
 * カメラボタンの総合修正スクリプト
 * 以下の問題を解決します：
 * 1. document-cameraクラスのボタンが反応しない問題
 * 2. 「カメラで撮影」ボタンが反応しない問題
 * 3. マイナンバーカード選択時にセクションが表示されない問題
 */
(function() {
  console.log('総合カメラ修正: 初期化中...');
  
  // ページ読み込み後に初期化
  document.addEventListener('DOMContentLoaded', function() {
    // 初期化処理を実行
    setTimeout(initCompleteFix, 500);
    
    // DOM変更を監視して新しく追加された要素にも対応
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // 新しいノードが追加されたら処理を実行
          initCompleteFix();
          
          // モーダルが追加された場合は特別処理
          checkForAddedModals(mutation.addedNodes);
        }
      }
    });
    
    // document全体の変更を監視
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 定期的に再確認
    setInterval(initCompleteFix, 2000);
  });
  
  /**
   * 総合修正の初期化
   */
  function initCompleteFix() {
    console.log('総合カメラ修正: カメラボタン処理を初期化');
    
    // 「カメラで撮影」ボタン（モーダル内に存在することが多い）
    setupCaptureButtons();
    
    // document-cameraクラスのボタン
    setupDocumentCameraButtons();
    
    // 書類選択処理
    setupDocumentTypeHandlers();
  }
  
  /**
   * 追加されたモーダルをチェック
   */
  function checkForAddedModals(nodes) {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // モーダルかどうかをチェック
        if (node.classList && node.classList.contains('modal')) {
          console.log('総合カメラ修正: 新しいモーダルを検出');
          
          // モーダル内の要素を処理
          setTimeout(() => {
            setupCaptureButtons();
            setupDocumentTypeHandlers();
          }, 300);
        }
        
        // 子ノードも再帰的にチェック
        if (node.childNodes && node.childNodes.length) {
          checkForAddedModals(node.childNodes);
        }
      }
    });
  }
  
  /**
   * 「カメラで撮影」ボタンの設定
   */
  function setupCaptureButtons() {
    // 「カメラで撮影」テキストを含むボタンを検索
    const buttons = findButtonsByText('カメラで撮影');
    
    console.log(`総合カメラ修正: ${buttons.length}個の「カメラで撮影」ボタンを検出`);
    
    buttons.forEach((button, index) => {
      // 処理済みかチェック
      if (button.getAttribute('data-capture-processed')) {
        return;
      }
      
      console.log(`総合カメラ修正: 「カメラで撮影」ボタン${index + 1}を処理`);
      
      // 処理済みとしてマーク
      button.setAttribute('data-capture-processed', 'true');
      
      // 関連するファイル入力を探す
      const fileInput = findAssociatedFileInput(button);
      
      if (!fileInput) {
        console.error('総合カメラ修正: 関連するファイル入力が見つかりません');
        return;
      }
      
      // クリックイベントを設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('総合カメラ修正: 「カメラで撮影」ボタンがクリックされました');
        
        openCameraModal(fileInput);
      });
    });
  }
  
  /**
   * document-cameraクラスのボタン設定
   */
  function setupDocumentCameraButtons() {
    // document-cameraクラスを持つすべてのボタンを検索
    const cameraButtons = document.querySelectorAll('.document-camera');
    console.log(`総合カメラ修正: ${cameraButtons.length}個のdocument-cameraボタンを検出`);
    
    cameraButtons.forEach((button, index) => {
      // 処理済みかチェック
      if (button.getAttribute('data-camera-processed')) {
        return;
      }
      
      console.log(`総合カメラ修正: document-cameraボタン${index + 1}を処理`);
      
      // 処理済みとしてマーク
      button.setAttribute('data-camera-processed', 'true');
      
      // 関連するファイル入力を探す
      const fileInput = findRelatedFileInput(button);
      
      if (!fileInput) {
        console.error('総合カメラ修正: 関連するファイル入力が見つかりません');
        return;
      }
      
      // クリックイベントを設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('総合カメラ修正: document-cameraボタンがクリックされました');
        
        openCameraModal(fileInput);
      });
    });
  }
  
  /**
   * 書類タイプ選択ハンドラの設定
   */
  function setupDocumentTypeHandlers() {
    // 書類タイプ選択要素を検索
    const documentSelects = document.querySelectorAll('select[id*="document-type"], select[id*="id-type"]');
    
    if (!documentSelects.length) {
      // セレクタを拡張して検索
      const allSelects = document.querySelectorAll('select');
      documentSelects = Array.from(allSelects).filter(select => {
        const options = Array.from(select.options || []);
        return options.some(option => {
          return option.value === 'idCard' || 
                 option.value === 'license' || 
                 option.textContent.includes('マイナンバー') || 
                 option.textContent.includes('運転免許');
        });
      });
    }
    
    console.log(`総合カメラ修正: ${documentSelects.length}個の書類タイプ選択要素を検出`);
    
    documentSelects.forEach((select, index) => {
      // 処理済みかチェック
      if (select.getAttribute('data-document-processed')) {
        return;
      }
      
      console.log(`総合カメラ修正: 書類タイプ選択${index + 1}を処理`);
      
      // 処理済みとしてマーク
      select.setAttribute('data-document-processed', 'true');
      
      // 現在の選択を確認して即座に処理
      const currentValue = select.value;
      if (currentValue) {
        handleDocumentTypeChange(select, currentValue);
      }
      
      // 変更イベントを設定
      select.addEventListener('change', function() {
        console.log(`総合カメラ修正: 書類タイプが変更されました: ${this.value}`);
        handleDocumentTypeChange(this, this.value);
      });
    });
  }
  
  /**
   * 書類タイプ変更時の処理
   */
  function handleDocumentTypeChange(select, value) {
    // 親コンテナを探す
    const container = findParentContainer(select);
    if (!container) return;
    
    // すべてのドキュメントセクション（あれば）を非表示
    const existingSections = container.querySelectorAll('.document-section');
    existingSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // 値に基づいて適切なセクションを表示
    if (value === 'license' || value === 'driver_license') {
      // 運転免許証の場合
      console.log('総合カメラ修正: 運転免許証セクションを表示');
      showLicenseSection(container);
    } else if (value === 'idCard' || value === 'my_number') {
      // マイナンバーカードの場合
      console.log('総合カメラ修正: マイナンバーカードセクションを表示');
      showIdCardSection(container);
    } else if (value === 'passport') {
      // パスポートの場合
      console.log('総合カメラ修正: パスポートセクションを表示');
      showPassportSection(container);
    } else if (value === 'residence_card') {
      // 在留カードの場合
      console.log('総合カメラ修正: 在留カードセクションを表示');
      showResidenceCardSection(container);
    }
  }
  
  /**
   * 運転免許証セクションを表示
   */
  function showLicenseSection(container) {
    // 既存のセクションがあるか確認
    let section = container.querySelector('.license-section, [id*="license-section"]');
    
    if (!section) {
      // セクションがなければID接頭辞で探す
      const frontInput = container.querySelector('input[id*="license"][id*="front"]');
      const backInput = container.querySelector('input[id*="license"][id*="back"]');
      
      if (frontInput && backInput) {
        // 入力要素があればそれらの親セクションを表示
        const frontSection = findParentSection(frontInput);
        const backSection = findParentSection(backInput);
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        return;
      }
      
      // 入力要素が見つからない場合、セクションを作成
      section = createDocumentSection('license', '運転免許証', true);
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * マイナンバーカードセクションを表示
   */
  function showIdCardSection(container) {
    // 既存のセクションがあるか確認
    let section = container.querySelector('.idcard-section, [id*="idcard-section"]');
    
    if (!section) {
      // セクションがなければID接頭辞で探す
      const frontInput = container.querySelector('input[id*="idcard"][id*="front"]');
      const backInput = container.querySelector('input[id*="idcard"][id*="back"]');
      
      if (frontInput && backInput) {
        // 入力要素があればそれらの親セクションを表示
        const frontSection = findParentSection(frontInput);
        const backSection = findParentSection(backInput);
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        return;
      }
      
      // 入力要素が見つからない場合、セクションを作成
      section = createDocumentSection('idcard', 'マイナンバーカード/運転経歴証明書', true);
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * パスポートセクションを表示
   */
  function showPassportSection(container) {
    // 既存のセクションがあるか確認
    let section = container.querySelector('.passport-section, [id*="passport-section"]');
    
    if (!section) {
      // セクションがなければID接頭辞で探す
      const input = container.querySelector('input[id*="passport"]');
      
      if (input) {
        // 入力要素があればその親セクションを表示
        const passportSection = findParentSection(input);
        if (passportSection) {
          passportSection.style.display = '';
          return;
        }
      }
      
      // 入力要素が見つからない場合、セクションを作成
      section = createDocumentSection('passport', 'パスポート', false);
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * 在留カードセクションを表示
   */
  function showResidenceCardSection(container) {
    // 既存のセクションがあるか確認
    let section = container.querySelector('.residence-section, [id*="residence-section"]');
    
    if (!section) {
      // セクションがなければID接頭辞で探す
      const frontInput = container.querySelector('input[id*="residence"][id*="front"]');
      const backInput = container.querySelector('input[id*="residence"][id*="back"]');
      
      if (frontInput && backInput) {
        // 入力要素があればそれらの親セクションを表示
        const frontSection = findParentSection(frontInput);
        const backSection = findParentSection(backInput);
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        return;
      }
      
      // 入力要素が見つからない場合、セクションを作成
      section = createDocumentSection('residence', '在留カード', true);
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * 親コンテナを探す
   */
  function findParentContainer(element) {
    // モーダルを探す
    const modal = element.closest('.modal, .modal-content, .modal-body');
    if (modal) return modal;
    
    // フォームを探す
    const form = element.closest('form');
    if (form) return form;
    
    // カードを探す
    const card = element.closest('.card, .card-body');
    if (card) return card;
    
    // セクションを探す
    const section = element.closest('section, .section');
    if (section) return section;
    
    // 親要素をさかのぼる
    let parent = element.parentElement;
    let depth = 0;
    
    while (parent && depth < 5) {
      // 同じ階層にセクション区切りらしき要素があれば親とみなす
      if (parent.querySelectorAll('.form-group, .mb-3, hr').length > 1) {
        return parent;
      }
      
      parent = parent.parentElement;
      depth++;
    }
    
    // 見つからなければbodyを返す
    return document.body;
  }
  
  /**
   * 親セクションを探す
   */
  function findParentSection(element) {
    // 直接の親を探す
    const directSection = element.closest('.form-group, .mb-3, .document-section');
    if (directSection) return directSection;
    
    // 親要素をさかのぼる
    let parent = element.parentElement;
    let depth = 0;
    
    while (parent && depth < 3) {
      if (parent.classList.contains('form-group') || 
          parent.classList.contains('mb-3') || 
          parent.classList.contains('document-section')) {
        return parent;
      }
      
      parent = parent.parentElement;
      depth++;
    }
    
    return null;
  }
  
  /**
   * 書類セクションを作成
   */
  function createDocumentSection(type, title, hasBack) {
    const section = document.createElement('div');
    section.className = `document-section ${type}-section`;
    section.id = `${type}-section`;
    
    if (hasBack) {
      // 表裏両方の場合
      section.innerHTML = `
        <h5 class="mt-3">${title}をアップロード</h5>
        <div class="row g-3">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="${type}-front-input" class="form-label">${title}（表面）</label>
              <div class="input-group">
                <input type="file" class="form-control" id="${type}-front-input" accept="image/jpeg, image/png, image/jpg, application/pdf">
                <button type="button" class="btn btn-outline-primary document-camera">
                  <i class="bi bi-camera"></i> カメラ
                </button>
              </div>
            </div>
            <div class="d-flex">
              <div class="preview-container"></div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label for="${type}-back-input" class="form-label">${title}（裏面）</label>
              <div class="input-group">
                <input type="file" class="form-control" id="${type}-back-input" accept="image/jpeg, image/png, image/jpg, application/pdf">
                <button type="button" class="btn btn-outline-primary document-camera">
                  <i class="bi bi-camera"></i> カメラ
                </button>
              </div>
            </div>
            <div class="d-flex">
              <div class="preview-container"></div>
            </div>
          </div>
        </div>
      `;
    } else {
      // 片面のみの場合
      section.innerHTML = `
        <h5 class="mt-3">${title}をアップロード</h5>
        <div class="mb-3">
          <div class="input-group">
            <input type="file" class="form-control" id="${type}-input" accept="image/jpeg, image/png, image/jpg, application/pdf">
            <button type="button" class="btn btn-outline-primary document-camera">
              <i class="bi bi-camera"></i> カメラ
            </button>
          </div>
        </div>
        <div class="d-flex">
          <div class="preview-container"></div>
        </div>
      `;
    }
    
    // イベントハンドラを後で設定できるようにカスタムイベントを発火
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('document-section-created', {
        detail: { section, type }
      }));
    }, 0);
    
    return section;
  }
  
  /**
   * 関連するファイル入力要素を見つける
   */
  function findRelatedFileInput(button) {
    // 1. 入力グループ内のファイル入力を探す（最も一般的なパターン）
    const inputGroup = button.closest('.input-group');
    if (inputGroup) {
      const fileInput = inputGroup.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 2. 親要素内のファイル入力を探す
    const parentContainer = button.closest('.form-group, .mb-3, .document-upload-section');
    if (parentContainer) {
      const fileInput = parentContainer.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 3. ボタンのテキストからファイル入力を推測
    const buttonText = button.textContent.toLowerCase();
    
    if (buttonText.includes('運転免許証')) {
      if (buttonText.includes('裏')) {
        return document.getElementById('license-back-input');
      } else {
        return document.getElementById('license-front-input');
      }
    } else if (buttonText.includes('マイナンバー')) {
      if (buttonText.includes('裏')) {
        return document.getElementById('idcard-back-input');
      } else {
        return document.getElementById('idcard-front-input');
      }
    } else if (buttonText.includes('パスポート')) {
      return document.getElementById('passport-input');
    } else if (buttonText.includes('在留')) {
      if (buttonText.includes('裏')) {
        return document.getElementById('residence-back-input');
      } else {
        return document.getElementById('residence-front-input');
      }
    }
    
    // 4. 祖先要素を辿ってファイル入力を探す
    let currentElement = button.parentElement;
    let searchDepth = 0;
    
    while (currentElement && searchDepth < 5) {
      const fileInput = currentElement.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
      
      currentElement = currentElement.parentElement;
      searchDepth++;
    }
    
    return null;
  }
  
  /**
   * 「カメラで撮影」ボタンの関連するファイル入力を見つける
   */
  function findAssociatedFileInput(button) {
    // 1. 親コンテナ内の要素を調査
    const container = button.closest('.modal-body, .card, .document-section, form, .document-upload-container');
    
    if (container) {
      // a. 現在表示されている入力を優先
      const visibleSections = Array.from(container.querySelectorAll('.document-section')).filter(
        section => section.style.display !== 'none'
      );
      
      if (visibleSections.length > 0) {
        for (const section of visibleSections) {
          const fileInput = section.querySelector('input[type="file"]');
          if (fileInput) return fileInput;
        }
      }
      
      // b. 最初のファイル入力を使用
      const fileInput = container.querySelector('input[type="file"]');
      if (fileInput) return fileInput;
    }
    
    // 2. ボタン自体の属性をチェック
    const targetId = button.getAttribute('data-target') || 
                     button.getAttribute('data-bs-target') || 
                     button.getAttribute('aria-controls');
    
    if (targetId) {
      const targetInput = document.getElementById(targetId);
      if (targetInput && targetInput.type === 'file') {
        return targetInput;
      }
    }
    
    // 3. 親要素を直接調査
    const parentForm = button.closest('form');
    if (parentForm) {
      const fileInputs = parentForm.querySelectorAll('input[type="file"]');
      if (fileInputs.length > 0) {
        return fileInputs[0];
      }
    }
    
    // 4. 同じモーダル内を検索
    const modal = button.closest('.modal');
    if (modal) {
      const fileInputs = modal.querySelectorAll('input[type="file"]');
      if (fileInputs.length > 0) {
        return fileInputs[0];
      }
    }
    
    // 5. ページ全体から検索
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    if (allFileInputs.length > 0) {
      return allFileInputs[0];
    }
    
    return null;
  }
  
  /**
   * テキストを含むボタンを検索
   */
  function findButtonsByText(text) {
    const result = [];
    const allElements = document.querySelectorAll('button, a, .btn, [role="button"]');
    
    allElements.forEach(element => {
      // テキスト内容を確認
      if (element.textContent && element.textContent.includes(text)) {
        result.push(element);
      }
      
      // 翻訳キー属性も確認
      if (element.getAttribute('data-i18n') === 'document.cameraCapture') {
        result.push(element);
      }
    });
    
    return result;
  }
  
  // グローバル変数
  let mediaStream = null;
  let currentFileInput = null;
  
  /**
   * カメラモーダルを開く
   */
  function openCameraModal(fileInput) {
    console.log('総合カメラ修正: カメラモーダルを開きます');
    currentFileInput = fileInput;
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('complete-camera-modal');
    if (existingModal) {
      try {
        const bsModal = bootstrap.Modal.getInstance(existingModal);
        if (bsModal) bsModal.hide();
      } catch (e) {
        console.error('モーダルインスタンス取得エラー:', e);
      }
      
      existingModal.remove();
    }
    
    // カメラスタイルを追加
    addCameraStyles();
    
    // モーダルのタイトルとガイドテキストを決定
    let title = 'カメラで撮影';
    let guideText = '書類全体がフレーム内に収まるようにしてください';
    
    // ファイル入力のIDから文書タイプを推測
    const inputId = fileInput.id || '';
    
    if (inputId.includes('license')) {
      if (inputId.includes('back')) {
        title = '運転免許証(裏面)を撮影';
      } else {
        title = '運転免許証(表面)を撮影';
      }
    } else if (inputId.includes('idcard')) {
      if (inputId.includes('back')) {
        title = 'マイナンバーカード(裏面)を撮影';
      } else {
        title = 'マイナンバーカード(表面)を撮影';
      }
    } else if (inputId.includes('passport')) {
      title = 'パスポートを撮影';
    } else if (inputId.includes('residence')) {
      if (inputId.includes('back')) {
        title = '在留カード(裏面)を撮影';
      } else {
        title = '在留カード(表面)を撮影';
      }
    } else if (inputId.includes('photo')) {
      title = '証明写真を撮影';
      guideText = 'あなたの顔がフレーム内に収まるようにしてください';
    }
    
    // モーダルHTML
    const modalHtml = `
      <div class="modal fade" id="complete-camera-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title"><i class="bi bi-camera me-2"></i>${title}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0">
              <div class="camera-container bg-dark">
                <video id="camera-video" autoplay playsinline class="w-100"></video>
                <canvas id="camera-canvas" class="d-none"></canvas>
                
                <div id="camera-guide" class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <div class="guide-frame">
                    <div class="guide-text">${guideText}</div>
                  </div>
                </div>
                
                <div id="camera-controls" class="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-between align-items-center camera-controls-bg">
                  <button id="switch-camera-btn" class="btn btn-light rounded-circle" type="button">
                    <i class="bi bi-arrow-repeat"></i>
                  </button>
                  <button id="capture-btn" class="btn btn-light rounded-circle capture-button" type="button">
                    <span class="capture-circle"></span>
                  </button>
                  <button id="close-camera-btn" class="btn btn-light rounded-circle" data-bs-dismiss="modal" type="button">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
                
                <div id="preview-container" class="position-absolute top-0 start-0 w-100 h-100 bg-dark d-none">
                  <img id="preview-image" class="w-100 h-100 object-fit-contain" src="" alt="撮影画像">
                </div>
              </div>
            </div>
            <div class="modal-footer d-none" id="preview-footer">
              <button type="button" class="btn btn-secondary" id="retake-btn">
                <i class="bi bi-arrow-counterclockwise me-1"></i>撮り直す
              </button>
              <button type="button" class="btn btn-primary" id="use-photo-btn">
                <i class="bi bi-check-lg me-1"></i>この写真を使用
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // モーダルをDOMに追加
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // モーダルを初期化して表示
    try {
      // Bootstrap 5のモーダル初期化
      const modal = new bootstrap.Modal(document.getElementById('complete-camera-modal'));
      
      // モーダルイベント
      const modalElement = document.getElementById('complete-camera-modal');
      
      modalElement.addEventListener('shown.bs.modal', function() {
        startCamera();
      });
      
      modalElement.addEventListener('hidden.bs.modal', function() {
        stopCamera();
      });
      
      // モーダル表示
      modal.show();
    } catch (err) {
      console.error('モーダル初期化エラー:', err);
      
      // エラー時は独自の実装でモーダル表示
      showModalManually();
    }
  }
  
  /**
   * 手動でモーダル表示（Bootstrap APIが使えない場合）
   */
  function showModalManually() {
    const modalElement = document.getElementById('complete-camera-modal');
    if (!modalElement) return;
    
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    
    // 背景オーバーレイを追加
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
    
    // bodyにクラスを追加
    document.body.classList.add('modal-open');
    
    // カメラを起動
    startCamera();
    
    // 閉じるボタンを設定
    const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        
        // 背景を削除
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(el => el.remove());
        
        // bodyからクラスを削除
        document.body.classList.remove('modal-open');
        
        // カメラを停止
        stopCamera();
      });
    });
  }
  
  /**
   * カメラを起動
   */
  function startCamera() {
    console.log('総合カメラ修正: カメラを起動します');
    
    const video = document.getElementById('camera-video');
    const captureBtn = document.getElementById('capture-btn');
    const switchBtn = document.getElementById('switch-camera-btn');
    
    if (!video || !captureBtn) {
      console.error('必要な要素が見つかりません');
      return;
    }
    
    // カメラ設定
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    
    // カメラアクセス
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        console.log('カメラストリームを取得しました');
        mediaStream = stream;
        video.srcObject = stream;
        
        // カメラ切り替えボタン
        if (switchBtn) {
          switchBtn.addEventListener('click', function() {
            const currentFacingMode = constraints.video.facingMode;
            const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
            
            // 現在のストリームを停止
            if (mediaStream) {
              mediaStream.getTracks().forEach(track => track.stop());
            }
            
            // 新しい設定でカメラを再起動
            const newConstraints = {
              video: {
                facingMode: newFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
              },
              audio: false
            };
            
            navigator.mediaDevices.getUserMedia(newConstraints)
              .then(function(newStream) {
                mediaStream = newStream;
                video.srcObject = newStream;
                constraints.video.facingMode = newFacingMode;
              })
              .catch(function(err) {
                console.error('カメラ切り替えエラー:', err);
              });
          });
        }
        
        // 撮影ボタン
        captureBtn.addEventListener('click', function() {
          capturePhoto();
        });
      })
      .catch(function(err) {
        console.error('カメラエラー:', err);
        showCameraError();
      });
  }
  
  /**
   * カメラを停止
   */
  function stopCamera() {
    console.log('総合カメラ修正: カメラを停止します');
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }
  
  /**
   * 写真を撮影
   */
  function capturePhoto() {
    console.log('総合カメラ修正: 写真を撮影します');
    
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const cameraGuide = document.getElementById('camera-guide');
    const cameraControls = document.getElementById('camera-controls');
    const previewFooter = document.getElementById('preview-footer');
    
    if (!video || !canvas || !previewContainer || !previewImage) {
      console.error('必要な要素が見つかりません');
      return;
    }
    
    // キャンバスサイズ設定
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // 映像をキャンバスに描画
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // 画像データを取得
    const imageData = canvas.toDataURL('image/jpeg');
    
    // プレビュー表示
    previewImage.src = imageData;
    
    // UI切り替え
    previewContainer.classList.remove('d-none');
    if (cameraGuide) cameraGuide.classList.add('d-none');
    if (cameraControls) cameraControls.classList.add('d-none');
    if (previewFooter) previewFooter.classList.remove('d-none');
    
    // 撮り直しボタン
    const retakeBtn = document.getElementById('retake-btn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', function() {
        // UIを撮影モードに戻す
        previewContainer.classList.add('d-none');
        if (cameraGuide) cameraGuide.classList.remove('d-none');
        if (cameraControls) cameraControls.classList.remove('d-none');
        if (previewFooter) previewFooter.classList.add('d-none');
      });
    }
    
    // 写真使用ボタン
    const usePhotoBtn = document.getElementById('use-photo-btn');
    if (usePhotoBtn) {
      usePhotoBtn.addEventListener('click', function() {
        usePhoto(imageData);
      });
    }
  }
  
  /**
   * 撮影した写真を使用
   */
  function usePhoto(dataURL) {
    console.log('総合カメラ修正: 写真を使用します');
    
    if (!currentFileInput) {
      console.error('ファイル入力が指定されていません');
      return;
    }
    
    // Blob変換
    fetch(dataURL)
      .then(res => res.blob())
      .then(blob => {
        // ファイル名生成
        const filename = 'camera_' + Date.now() + '.jpg';
        const file = new File([blob], filename, { type: 'image/jpeg' });
        
        try {
          // ファイル入力更新
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          currentFileInput.files = dataTransfer.files;
          
          // 変更イベント発火
          const event = new Event('change', { bubbles: true });
          currentFileInput.dispatchEvent(event);
          
          // モーダルを閉じる
          try {
            const modal = bootstrap.Modal.getInstance(document.getElementById('complete-camera-modal'));
            if (modal) modal.hide();
          } catch (err) {
            console.log('モーダル取得エラー:', err);
            
            // 手動でモーダルを閉じる
            const modalElement = document.getElementById('complete-camera-modal');
            if (modalElement) {
              modalElement.classList.remove('show');
              modalElement.style.display = 'none';
              
              // 背景を削除
              const backdrops = document.querySelectorAll('.modal-backdrop');
              backdrops.forEach(el => el.remove());
              
              // bodyクラスを削除
              document.body.classList.remove('modal-open');
            }
          }
          
          // プレビュー更新
          updatePreview(currentFileInput, dataURL);
        } catch (err) {
          console.error('ファイル設定エラー:', err);
          alert('写真の設定に失敗しました');
        }
      })
      .catch(err => {
        console.error('Blob変換エラー:', err);
      });
  }
  
  /**
   * カメラエラー表示
   */
  function showCameraError() {
    console.log('総合カメラ修正: エラーを表示します');
    
    const container = document.querySelector('.camera-container');
    if (container) {
      container.innerHTML = `
        <div class="p-4 text-center">
          <div class="alert alert-warning mb-3">
            <h5><i class="bi bi-exclamation-triangle me-2"></i>カメラにアクセスできません</h5>
            <p class="mb-1">以下の理由が考えられます：</p>
            <ul class="text-start small">
              <li>ブラウザの設定でカメラへのアクセスが許可されていません</li>
              <li>デバイスにカメラが接続されていません</li>
              <li>別のアプリがカメラを使用しています</li>
            </ul>
          </div>
          <button class="btn btn-primary" data-bs-dismiss="modal">
            閉じる
          </button>
        </div>
      `;
    }
  }
  
  /**
   * プレビュー更新
   */
  function updatePreview(fileInput, dataURL) {
    console.log('総合カメラ修正: プレビューを更新します');
    
    // 親コンテナを探す
    const container = fileInput.closest('.form-group, .mb-3, .document-upload-section, .card, .document-section');
    if (!container) return;
    
    // プレビュー要素を探す
    let previewImg = container.querySelector('img.preview-img, img[id$="-preview"], img.document-preview-img');
    
    // プレビューがなければ作成
    if (!previewImg) {
      // プレビューコンテナを探す
      let previewContainer = container.querySelector('.preview-container');
      
      // コンテナがなければ作成
      if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'preview-container mt-2';
        container.appendChild(previewContainer);
      }
      
      // 画像要素を作成
      previewImg = document.createElement('img');
      previewImg.className = 'preview-img img-fluid mt-2';
      previewImg.style.maxHeight = '200px';
      previewImg.alt = 'プレビュー';
      previewContainer.appendChild(previewImg);
    }
    
    // 画像を設定
    previewImg.src = dataURL;
    previewImg.classList.remove('d-none');
    previewImg.style.display = 'block';
    
    // プレースホルダを非表示
    const placeholder = container.querySelector('.placeholder, .upload-placeholder, [class*="placeholder"]');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    // 削除ボタン表示/作成
    let removeBtn = container.querySelector('.remove-btn, .delete-btn, button[id*="remove"], button[id*="delete"]');
    
    // 削除ボタンがなければ作成
    if (!removeBtn) {
      removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn btn-danger btn-sm mt-2 remove-btn';
      removeBtn.innerHTML = '<i class="bi bi-trash me-1"></i>削除';
      
      // 適切な場所に挿入
      const previewContainer = container.querySelector('.preview-container');
      if (previewContainer) {
        previewContainer.appendChild(removeBtn);
      } else {
        container.appendChild(removeBtn);
      }
      
      // 削除ボタンイベント
      removeBtn.addEventListener('click', function() {
        // ファイル入力リセット
        fileInput.value = '';
        
        // プレビュー非表示
        previewImg.src = '';
        previewImg.classList.add('d-none');
        previewImg.style.display = 'none';
        
        // プレースホルダ表示
        if (placeholder) {
          placeholder.style.display = '';
        }
        
        // 削除ボタン非表示
        this.style.display = 'none';
      });
    }
    
    // 削除ボタン表示
    removeBtn.classList.remove('d-none');
    removeBtn.style.display = '';
    
    // 成功メッセージ
    const existingSuccess = container.querySelector('.alert-success');
    if (existingSuccess) existingSuccess.remove();
    
    const successMsg = document.createElement('div');
    successMsg.className = 'alert alert-success mt-2 small';
    successMsg.innerHTML = '<i class="bi bi-check-circle me-2"></i>正常にアップロードされました';
    
    const previewContainer = container.querySelector('.preview-container');
    if (previewContainer) {
      previewContainer.appendChild(successMsg);
    } else {
      container.appendChild(successMsg);
    }
  }
  
  /**
   * カメラスタイル追加
   */
  function addCameraStyles() {
    if (document.getElementById('complete-camera-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'complete-camera-styles';
    style.textContent = `
      .camera-container {
        position: relative;
        overflow: hidden;
        background-color: #000;
        min-height: 300px;
        max-height: 70vh;
      }
      
      #camera-video {
        width: 100%;
        max-height: 70vh;
        min-height: 300px;
        object-fit: cover;
      }
      
      .guide-frame {
        border: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        width: 85%;
        height: 70%;
        position: relative;
      }
      
      .guide-text {
        position: absolute;
        bottom: -40px;
        left: 0;
        right: 0;
        text-align: center;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 0.9rem;
      }
      
      .camera-controls-bg {
        background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
      }
      
      .capture-button {
        width: 70px;
        height: 70px;
        padding: 0;
        border: 3px solid white;
      }
      
      .capture-circle {
        width: 54px;
        height: 54px;
        background-color: white;
        border-radius: 50%;
        display: block;
      }
      
      #switch-camera-btn, #close-camera-btn {
        width: 50px;
        height: 50px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #switch-camera-btn i, #close-camera-btn i {
        font-size: 1.5rem;
      }
      
      #preview-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-header.bg-primary {
        background-color: #0d6efd !important;
      }
      
      .preview-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .document-section {
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: 0.375rem;
        background-color: rgba(0, 0, 0, 0.025);
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // インラインbootstrapコードを注入（モーダル初期化に問題があった場合に備える）
  const inlineScript = document.createElement('script');
  inlineScript.textContent = `
    // カメラモーダル用のヘルパー
    window.openCameraModalHelper = function(inputElement) {
      // カスタムイベントを発火
      document.dispatchEvent(new CustomEvent('open-camera-modal', {
        detail: { input: inputElement }
      }));
    };
    
    // 書類タイプ変更ヘルパー
    window.handleDocumentTypeHelper = function(selectElement) {
      // カスタムイベントを発火
      document.dispatchEvent(new CustomEvent('document-type-changed', {
        detail: { select: selectElement, value: selectElement.value }
      }));
    };
  `;
  
  document.head.appendChild(inlineScript);
  
  // カスタムイベントリスナー
  document.addEventListener('open-camera-modal', function(e) {
    if (e.detail && e.detail.input) {
      openCameraModal(e.detail.input);
    }
  });
  
  document.addEventListener('document-type-changed', function(e) {
    if (e.detail) {
      handleDocumentTypeChange(e.detail.select, e.detail.value);
    }
  });
})();