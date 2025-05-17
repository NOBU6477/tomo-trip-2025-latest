/**
 * 運転免許証とマイナンバーカードの裏表両面撮影対応と
 * 書類タイプ選択に応じたセクション表示を改善するスクリプト
 */
(function() {
  console.log('両面撮影対応: 初期化中...');
  
  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    // 初期化処理
    setTimeout(initDualDocumentCapture, 500);
    
    // DOM変更監視
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // 新しいモーダルなどの追加を検出
          checkForAddedModals(mutation.addedNodes);
        }
      }
    });
    
    // document全体の変更を監視
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 定期的に実行して確実に処理
    setInterval(initDualDocumentCapture, 3000);
  });
  
  /**
   * 両面撮影対応の初期化
   */
  function initDualDocumentCapture() {
    console.log('両面撮影対応: 書類選択処理を設定');
    
    // 書類タイプ選択を監視
    setupDocumentTypeSelectors();
    
    // カメラボタンを設定
    setupCameraButtons();
    
    // 両面アップロードラベルの設定
    fixDualUploadLabels();
  }
  
  /**
   * 追加されたノードのチェック
   */
  function checkForAddedModals(nodes) {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // モーダルかどうかをチェック
        if (node.classList && (node.classList.contains('modal') || node.classList.contains('modal-dialog'))) {
          console.log('両面撮影対応: 新しいモーダルを検出');
          
          // 少し遅延させて処理
          setTimeout(() => {
            setupDocumentTypeSelectors();
            setupCameraButtons();
            fixDualUploadLabels();
            
            // モーダル内の特定のセレクト要素を検索
            const selects = node.querySelectorAll('select');
            selects.forEach(select => {
              // 既存の選択値があれば処理する
              if (select.value) {
                handleDocumentTypeChange(select, select.value);
              }
            });
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
   * 書類タイプセレクタの設定
   */
  function setupDocumentTypeSelectors() {
    // 書類タイプセレクタを探す
    const selectors = findDocumentTypeSelectors();
    console.log(`両面撮影対応: ${selectors.length}個の書類タイプセレクタを検出`);
    
    selectors.forEach((select, index) => {
      // 処理済みかチェック
      if (select.getAttribute('data-dual-document-processed')) {
        return;
      }
      
      console.log(`両面撮影対応: 書類タイプセレクタ${index + 1}を処理`);
      select.setAttribute('data-dual-document-processed', 'true');
      
      // 現在の選択値を確認
      if (select.value) {
        handleDocumentTypeChange(select, select.value);
      }
      
      // 変更イベントリスナー
      select.addEventListener('change', function() {
        console.log(`両面撮影対応: 書類タイプが変更されました: ${this.value}`);
        handleDocumentTypeChange(this, this.value);
      });
    });
  }
  
  /**
   * 書類タイプセレクタを探す
   */
  function findDocumentTypeSelectors() {
    // 直接ID/クラスで探す
    let selectors = document.querySelectorAll('select[id*="document"], select[id*="id-type"]');
    
    // 見つからなければ内容で探す
    if (!selectors.length) {
      const allSelects = document.querySelectorAll('select');
      
      selectors = Array.from(allSelects).filter(select => {
        // オプションを確認
        const options = Array.from(select.options || []);
        return options.some(option => {
          const text = option.textContent.toLowerCase();
          const value = option.value.toLowerCase();
          
          return text.includes('マイナンバー') || 
                 text.includes('運転免許') || 
                 text.includes('パスポート') || 
                 value === 'idcard' || 
                 value === 'license' || 
                 value === 'passport';
        });
      });
    }
    
    return selectors;
  }
  
  /**
   * 書類タイプ変更処理
   */
  function handleDocumentTypeChange(select, value) {
    // コンテナを探す
    const container = findParentContainer(select);
    if (!container) return;
    
    // 既存のセクションを隠す
    const allSections = container.querySelectorAll('.document-section, [id*="-section"]');
    allSections.forEach(section => section.style.display = 'none');
    
    // 値に基づいて適切なセクションを表示
    if (value === 'license' || value.includes('driver')) {
      showLicenseSection(container);
    } else if (value === 'idCard' || value.includes('my_number')) {
      showIdCardSection(container);
    } else if (value === 'passport') {
      showPassportSection(container);
    }
    
    // 裏表両方が必要な書類タイプかを設定
    if (value === 'license' || value === 'idCard' || value.includes('my_number') || value.includes('driver')) {
      container.setAttribute('data-dual-document', 'true');
    } else {
      container.removeAttribute('data-dual-document');
    }
  }
  
  /**
   * 親コンテナを探す
   */
  function findParentContainer(element) {
    // モーダルを探す
    const modal = element.closest('.modal, .modal-body, .modal-content');
    if (modal) return modal;
    
    // フォームを探す
    const form = element.closest('form');
    if (form) return form;
    
    // セクションを探す
    const section = element.closest('section, .section, .card, .card-body');
    if (section) return section;
    
    // 親要素を辿る
    let current = element;
    let depth = 0;
    while (current && depth < 5) {
      // フォームグループなどを含む要素を探す
      if (current.querySelectorAll('.form-group, .mb-3').length > 1) {
        return current;
      }
      current = current.parentElement;
      depth++;
    }
    
    // どうしても見つからなければ最も近い大きなコンテナを返す
    return element.closest('.container, .container-fluid') || document.body;
  }
  
  /**
   * 運転免許証セクションを表示
   */
  function showLicenseSection(container) {
    console.log('両面撮影対応: 運転免許証セクションを表示');
    
    // 既存のセクションを探す
    let section = container.querySelector('.license-section, [id*="license-section"]');
    
    // 見つからなければ個別の要素を探す
    if (!section) {
      const frontInput = container.querySelector('input[id*="license"][id*="front"]');
      const backInput = container.querySelector('input[id*="license"][id*="back"]');
      
      if (frontInput && backInput) {
        // 既存の入力要素があれば表示
        const frontSection = frontInput.closest('.form-group, .mb-3');
        const backSection = backInput.closest('.form-group, .mb-3');
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        
        // セクションのラベルを更新
        const frontLabel = frontSection ? frontSection.querySelector('label') : null;
        const backLabel = backSection ? backSection.querySelector('label') : null;
        
        if (frontLabel) frontLabel.textContent = '運転免許証（表面）';
        if (backLabel) backLabel.textContent = '運転免許証（裏面）';
        
        return;
      }
      
      // 既存のファイル入力を探す（別の命名規則のもの）
      const licenseInputs = container.querySelectorAll('input[type="file"]');
      if (licenseInputs.length >= 2) {
        // 最初の2つを表と裏に使用
        const firstInput = licenseInputs[0];
        const secondInput = licenseInputs[1];
        
        if (firstInput && secondInput) {
          // IDを設定
          if (!firstInput.id || !firstInput.id.includes('license')) {
            firstInput.id = 'license-front-input';
          }
          if (!secondInput.id || !secondInput.id.includes('license')) {
            secondInput.id = 'license-back-input';
          }
          
          // 親セクションを表示
          const firstSection = firstInput.closest('.form-group, .mb-3');
          const secondSection = secondInput.closest('.form-group, .mb-3');
          
          if (firstSection) {
            firstSection.style.display = '';
            const label = firstSection.querySelector('label');
            if (label) label.textContent = '運転免許証（表面）';
          }
          
          if (secondSection) {
            secondSection.style.display = '';
            const label = secondSection.querySelector('label');
            if (label) label.textContent = '運転免許証（裏面）';
          }
          
          return;
        }
      }
      
      // セクションを作成する必要がある場合
      section = createDualDocumentSection('license', '運転免許証');
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * マイナンバーカードセクションを表示
   */
  function showIdCardSection(container) {
    console.log('両面撮影対応: マイナンバーカードセクションを表示');
    
    // 既存のセクションを探す
    let section = container.querySelector('.idcard-section, [id*="idcard-section"]');
    
    // 見つからなければ個別の要素を探す
    if (!section) {
      const frontInput = container.querySelector('input[id*="idcard"][id*="front"]');
      const backInput = container.querySelector('input[id*="idcard"][id*="back"]');
      
      if (frontInput && backInput) {
        // 既存の入力要素があれば表示
        const frontSection = frontInput.closest('.form-group, .mb-3');
        const backSection = backInput.closest('.form-group, .mb-3');
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        
        // セクションのラベルを更新
        const frontLabel = frontSection ? frontSection.querySelector('label') : null;
        const backLabel = backSection ? backSection.querySelector('label') : null;
        
        if (frontLabel) frontLabel.textContent = 'マイナンバーカード（表面）';
        if (backLabel) backLabel.textContent = 'マイナンバーカード（裏面）';
        
        return;
      }
      
      // 既存のファイル入力を探す（別の命名規則のもの）
      const idcardInputs = container.querySelectorAll('input[type="file"]');
      if (idcardInputs.length >= 2) {
        // 最初の2つを表と裏に使用
        const firstInput = idcardInputs[0];
        const secondInput = idcardInputs[1];
        
        if (firstInput && secondInput) {
          // IDを設定
          if (!firstInput.id || !firstInput.id.includes('idcard')) {
            firstInput.id = 'idcard-front-input';
          }
          if (!secondInput.id || !secondInput.id.includes('idcard')) {
            secondInput.id = 'idcard-back-input';
          }
          
          // 親セクションを表示
          const firstSection = firstInput.closest('.form-group, .mb-3');
          const secondSection = secondInput.closest('.form-group, .mb-3');
          
          if (firstSection) {
            firstSection.style.display = '';
            const label = firstSection.querySelector('label');
            if (label) label.textContent = 'マイナンバーカード（表面）';
          }
          
          if (secondSection) {
            secondSection.style.display = '';
            const label = secondSection.querySelector('label');
            if (label) label.textContent = 'マイナンバーカード（裏面）';
          }
          
          return;
        }
      }
      
      // セクションを作成する必要がある場合
      section = createDualDocumentSection('idcard', 'マイナンバーカード/運転経歴証明書');
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * パスポートセクションを表示
   */
  function showPassportSection(container) {
    console.log('両面撮影対応: パスポートセクションを表示');
    
    // 既存のセクションを探す
    let section = container.querySelector('.passport-section, [id*="passport-section"]');
    
    // 見つからなければ個別の要素を探す
    if (!section) {
      const passportInput = container.querySelector('input[id*="passport"]');
      
      if (passportInput) {
        // 既存の入力要素があれば表示
        const passportSection = passportInput.closest('.form-group, .mb-3');
        
        if (passportSection) {
          passportSection.style.display = '';
          
          // セクションのラベルを更新
          const label = passportSection.querySelector('label');
          if (label) label.textContent = 'パスポート';
          
          return;
        }
      }
      
      // 既存のファイル入力を探す（別の命名規則のもの）
      const fileInputs = container.querySelectorAll('input[type="file"]');
      if (fileInputs.length > 0) {
        // 最初の入力を使用
        const fileInput = fileInputs[0];
        
        if (fileInput) {
          // IDを設定
          if (!fileInput.id || !fileInput.id.includes('passport')) {
            fileInput.id = 'passport-input';
          }
          
          // 親セクションを表示
          const fileSection = fileInput.closest('.form-group, .mb-3');
          
          if (fileSection) {
            fileSection.style.display = '';
            const label = fileSection.querySelector('label');
            if (label) label.textContent = 'パスポート';
            
            return;
          }
        }
      }
      
      // セクションを作成する必要がある場合
      section = createSingleDocumentSection('passport', 'パスポート');
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * 両面書類セクションを作成
   */
  function createDualDocumentSection(type, title) {
    console.log(`両面撮影対応: ${title}セクションを作成`);
    
    const section = document.createElement('div');
    section.className = `document-section ${type}-section`;
    section.id = `${type}-section`;
    
    section.innerHTML = `
      <div class="card mt-3">
        <div class="card-body">
          <h5 class="card-title">${title}アップロード</h5>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="${type}-front-input" class="form-label">${title}（表面）</label>
                <div class="input-group">
                  <input type="file" class="form-control" id="${type}-front-input" accept="image/*">
                  <button class="btn btn-outline-primary document-camera" type="button">
                    <i class="bi bi-camera"></i> カメラ
                  </button>
                </div>
                <div class="preview-container mt-2"></div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="${type}-back-input" class="form-label">${title}（裏面）</label>
                <div class="input-group">
                  <input type="file" class="form-control" id="${type}-back-input" accept="image/*">
                  <button class="btn btn-outline-primary document-camera" type="button">
                    <i class="bi bi-camera"></i> カメラ
                  </button>
                </div>
                <div class="preview-container mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 新しいセクションが作成されたことを通知
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('document-section-created', {
        detail: { section, type, isDual: true }
      }));
    }, 10);
    
    return section;
  }
  
  /**
   * 単一書類セクションを作成
   */
  function createSingleDocumentSection(type, title) {
    console.log(`両面撮影対応: ${title}セクションを作成（単一）`);
    
    const section = document.createElement('div');
    section.className = `document-section ${type}-section`;
    section.id = `${type}-section`;
    
    section.innerHTML = `
      <div class="card mt-3">
        <div class="card-body">
          <h5 class="card-title">${title}アップロード</h5>
          <div class="mb-3">
            <label for="${type}-input" class="form-label">${title}</label>
            <div class="input-group">
              <input type="file" class="form-control" id="${type}-input" accept="image/*">
              <button class="btn btn-outline-primary document-camera" type="button">
                <i class="bi bi-camera"></i> カメラ
              </button>
            </div>
            <div class="preview-container mt-2"></div>
          </div>
        </div>
      </div>
    `;
    
    // 新しいセクションが作成されたことを通知
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('document-section-created', {
        detail: { section, type, isDual: false }
      }));
    }, 10);
    
    return section;
  }
  
  /**
   * カメラボタンの設定
   */
  function setupCameraButtons() {
    // クラス付きボタン
    setupDocumentCameraButtons();
    
    // テキスト検索による「カメラで撮影」ボタン
    setupCaptureButtons();
  }
  
  /**
   * document-cameraクラスのボタン設定
   */
  function setupDocumentCameraButtons() {
    const buttons = document.querySelectorAll('.document-camera');
    
    buttons.forEach(button => {
      // 処理済みか確認
      if (button.getAttribute('data-capture-fixed')) {
        return;
      }
      
      // 処理済みとしてマーク
      button.setAttribute('data-capture-fixed', 'true');
      
      // 関連するファイル入力を探す
      const fileInput = findRelatedFileInput(button);
      if (!fileInput) return;
      
      // クリックイベントハンドラを設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // カメラモーダルを開く
        openCameraModal(fileInput);
      });
    });
  }
  
  /**
   * 「カメラで撮影」ボタンの設定
   */
  function setupCaptureButtons() {
    // テキストでボタンを検索
    const buttons = findButtonsByText('カメラで撮影');
    
    buttons.forEach(button => {
      // 処理済みか確認
      if (button.getAttribute('data-capture-fixed')) {
        return;
      }
      
      // 処理済みとしてマーク
      button.setAttribute('data-capture-fixed', 'true');
      
      // 関連するファイル入力を探す
      const fileInput = findAssociatedFileInput(button);
      if (!fileInput) return;
      
      // クリックイベントハンドラを設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // カメラモーダルを開く
        openCameraModal(fileInput);
      });
    });
  }
  
  /**
   * テキストベースでボタンを探す
   */
  function findButtonsByText(searchText) {
    const result = [];
    const elements = document.querySelectorAll('button, a, .btn');
    
    elements.forEach(element => {
      const text = element.textContent || '';
      if (text.includes(searchText)) {
        result.push(element);
      }
    });
    
    return result;
  }
  
  /**
   * document-cameraボタンに関連するファイル入力を探す
   */
  function findRelatedFileInput(button) {
    // 入力グループ内のファイル入力を探す
    const inputGroup = button.closest('.input-group');
    if (inputGroup) {
      const fileInput = inputGroup.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 親コンテナ内のファイル入力を探す
    const container = button.closest('.form-group, .mb-3');
    if (container) {
      const fileInput = container.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // ボタンに関連するIDやテキストからファイル入力を推測
    const buttonId = button.id || '';
    const buttonText = button.textContent || '';
    
    if (buttonId.includes('license') || buttonText.includes('運転免許')) {
      if (buttonId.includes('back') || buttonText.includes('裏')) {
        return document.getElementById('license-back-input');
      } else {
        return document.getElementById('license-front-input');
      }
    } else if (buttonId.includes('idcard') || buttonText.includes('マイナンバー')) {
      if (buttonId.includes('back') || buttonText.includes('裏')) {
        return document.getElementById('idcard-back-input');
      } else {
        return document.getElementById('idcard-front-input');
      }
    } else if (buttonId.includes('passport') || buttonText.includes('パスポート')) {
      return document.getElementById('passport-input');
    }
    
    // 見つからなければnullを返す
    return null;
  }
  
  /**
   * 「カメラで撮影」ボタンに関連するファイル入力を探す
   */
  function findAssociatedFileInput(button) {
    // 親コンテナを探す
    const container = button.closest('.modal-body, .card-body, .document-section');
    if (!container) return null;
    
    // コンテキストを判断
    const modalTitle = container.closest('.modal')?.querySelector('.modal-title')?.textContent || '';
    const cardTitle = container.closest('.card')?.querySelector('.card-title')?.textContent || '';
    const title = modalTitle || cardTitle || '';
    
    // タイトルに基づいてファイル入力を探す
    if (title.includes('運転免許')) {
      if (title.includes('裏面')) {
        return container.querySelector('#license-back-input') || document.getElementById('license-back-input');
      } else {
        return container.querySelector('#license-front-input') || document.getElementById('license-front-input');
      }
    } else if (title.includes('マイナンバー')) {
      if (title.includes('裏面')) {
        return container.querySelector('#idcard-back-input') || document.getElementById('idcard-back-input');
      } else {
        return container.querySelector('#idcard-front-input') || document.getElementById('idcard-front-input');
      }
    } else if (title.includes('パスポート')) {
      return container.querySelector('#passport-input') || document.getElementById('passport-input');
    }
    
    // コンテナ内の最初のファイル入力を返す
    return container.querySelector('input[type="file"]');
  }
  
  /**
   * 両面アップロードラベルの修正
   */
  function fixDualUploadLabels() {
    // 運転免許証ラベル
    const licenseLabels = document.querySelectorAll('label[for*="license"]');
    licenseLabels.forEach(label => {
      if (label.textContent.includes('運転免許証') && !label.textContent.includes('表') && !label.textContent.includes('裏')) {
        // 表/裏の情報が不足している場合
        const forAttr = label.getAttribute('for') || '';
        if (forAttr.includes('front')) {
          label.textContent = '運転免許証（表面）';
        } else if (forAttr.includes('back')) {
          label.textContent = '運転免許証（裏面）';
        }
      }
    });
    
    // マイナンバーカードラベル
    const idcardLabels = document.querySelectorAll('label[for*="idcard"]');
    idcardLabels.forEach(label => {
      if ((label.textContent.includes('マイナンバー') || label.textContent.includes('ID')) && 
          !label.textContent.includes('表') && !label.textContent.includes('裏')) {
        // 表/裏の情報が不足している場合
        const forAttr = label.getAttribute('for') || '';
        if (forAttr.includes('front')) {
          label.textContent = 'マイナンバーカード（表面）';
        } else if (forAttr.includes('back')) {
          label.textContent = 'マイナンバーカード（裏面）';
        }
      }
    });
    
    // 「両面をアップロードしてください」メッセージの追加
    addDualUploadMessages();
  }
  
  /**
   * 「両面をアップロードしてください」メッセージを追加
   */
  function addDualUploadMessages() {
    // 運転免許証のセクションを探す
    const licenseSections = document.querySelectorAll('.license-section, [id*="license-section"]');
    licenseSections.forEach(section => {
      if (!section.querySelector('.dual-upload-message')) {
        addMessageToSection(section, '両面をアップロードしてください');
      }
    });
    
    // マイナンバーカードのセクションを探す
    const idcardSections = document.querySelectorAll('.idcard-section, [id*="idcard-section"]');
    idcardSections.forEach(section => {
      if (!section.querySelector('.dual-upload-message')) {
        addMessageToSection(section, '両面をアップロードしてください');
      }
    });
    
    // document-dualクラスがあるセクションにもメッセージ追加
    const dualSections = document.querySelectorAll('[data-dual-document="true"]');
    dualSections.forEach(section => {
      if (!section.querySelector('.dual-upload-message')) {
        const fileInputs = section.querySelectorAll('input[type="file"]');
        if (fileInputs.length >= 2) {
          addMessageToSection(section, '両面をアップロードしてください');
        }
      }
    });
  }
  
  /**
   * セクションにメッセージを追加
   */
  function addMessageToSection(section, message) {
    // カード内に追加
    const card = section.querySelector('.card');
    
    if (card) {
      // カードヘッダーの後に追加
      const cardBody = card.querySelector('.card-body');
      if (cardBody) {
        const cardTitle = cardBody.querySelector('.card-title');
        
        if (cardTitle) {
          const messageElem = document.createElement('div');
          messageElem.className = 'dual-upload-message text-secondary mb-3 fst-italic small';
          messageElem.textContent = message;
          
          cardTitle.insertAdjacentElement('afterend', messageElem);
        }
      }
    } else {
      // セクション自体に追加
      const messageElem = document.createElement('div');
      messageElem.className = 'dual-upload-message text-secondary mb-3 fst-italic small';
      messageElem.textContent = message;
      
      section.insertAdjacentElement('afterbegin', messageElem);
    }
  }
  
  // グローバル変数
  let mediaStream = null;
  let currentFileInput = null;
  
  /**
   * カメラモーダルを開く
   */
  function openCameraModal(fileInput) {
    if (!fileInput) {
      console.error('両面撮影対応: ファイル入力要素が見つかりません');
      return;
    }
    
    console.log('両面撮影対応: カメラモーダルを開きます', fileInput.id);
    currentFileInput = fileInput;
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('dual-document-camera-modal');
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
    } else if (inputId.includes('photo')) {
      title = '証明写真を撮影';
      guideText = 'あなたの顔がフレーム内に収まるようにしてください';
    }
    
    // モーダルHTML
    const modalHtml = `
      <div class="modal fade" id="dual-document-camera-modal" tabindex="-1" aria-hidden="true">
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
      const modal = new bootstrap.Modal(document.getElementById('dual-document-camera-modal'));
      
      // モーダルイベント
      const modalElement = document.getElementById('dual-document-camera-modal');
      
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
      
      // エラー時は手動でモーダルを表示
      showModalManually();
    }
  }
  
  /**
   * 手動でモーダルを表示（Bootstrap APIが使えない場合）
   */
  function showModalManually() {
    const modalElement = document.getElementById('dual-document-camera-modal');
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
    console.log('両面撮影対応: カメラを起動します');
    
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
            switchCamera(constraints);
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
   * カメラを切り替え
   */
  function switchCamera(constraints) {
    if (!mediaStream) return;
    
    // 現在のストリームを停止
    mediaStream.getTracks().forEach(track => track.stop());
    
    // 新しいfacingModeを設定
    const newFacingMode = constraints.video.facingMode === 'environment' ? 'user' : 'environment';
    constraints.video.facingMode = newFacingMode;
    
    // 新しい設定でカメラを再起動
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(newStream) {
        const video = document.getElementById('camera-video');
        if (video) {
          mediaStream = newStream;
          video.srcObject = newStream;
        }
      })
      .catch(function(err) {
        console.error('カメラ切り替えエラー:', err);
      });
  }
  
  /**
   * カメラを停止
   */
  function stopCamera() {
    console.log('両面撮影対応: カメラを停止します');
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }
  
  /**
   * 写真を撮影
   */
  function capturePhoto() {
    console.log('両面撮影対応: 写真を撮影します');
    
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
      // 既存のイベントリスナーを削除
      const newRetakeBtn = retakeBtn.cloneNode(true);
      retakeBtn.parentNode.replaceChild(newRetakeBtn, retakeBtn);
      
      newRetakeBtn.addEventListener('click', function() {
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
      // 既存のイベントリスナーを削除
      const newUsePhotoBtn = usePhotoBtn.cloneNode(true);
      usePhotoBtn.parentNode.replaceChild(newUsePhotoBtn, usePhotoBtn);
      
      newUsePhotoBtn.addEventListener('click', function() {
        usePhoto(imageData);
      });
    }
  }
  
  /**
   * 撮影した写真を使用
   */
  function usePhoto(dataURL) {
    console.log('両面撮影対応: 写真を使用します');
    
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
            const modal = bootstrap.Modal.getInstance(document.getElementById('dual-document-camera-modal'));
            if (modal) modal.hide();
          } catch (err) {
            console.log('モーダル取得エラー:', err);
            
            // 手動でモーダルを閉じる
            const modalElement = document.getElementById('dual-document-camera-modal');
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
          
          // 関連する裏面入力を確認
          checkRelatedBackInput(currentFileInput);
          
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
   * 関連する裏面入力をチェック
   */
  function checkRelatedBackInput(frontInput) {
    const inputId = frontInput.id || '';
    
    // 表面かどうかを確認し、裏面を強調表示
    if ((inputId.includes('front') || inputId.includes('license') || inputId.includes('idcard')) && 
        !inputId.includes('back')) {
        
      let backInputId = '';
      
      if (inputId.includes('license')) {
        backInputId = 'license-back-input';
      } else if (inputId.includes('idcard')) {
        backInputId = 'idcard-back-input';
      } else if (inputId.includes('front')) {
        backInputId = inputId.replace('front', 'back');
      }
      
      if (backInputId) {
        const backInput = document.getElementById(backInputId);
        if (backInput) {
          // 少し遅延させて表示を強調
          setTimeout(() => {
            // 裏面セクションを強調表示
            const backSection = backInput.closest('.form-group, .mb-3');
            if (backSection) {
              // 一時的なクラスを追加して強調
              backSection.classList.add('highlight-back-section');
              
              // 少し時間をおいて強調表示を解除
              setTimeout(() => {
                backSection.classList.remove('highlight-back-section');
              }, 3000);
            }
          }, 500);
        }
      }
    }
  }
  
  /**
   * カメラエラー表示
   */
  function showCameraError() {
    console.log('両面撮影対応: エラーを表示します');
    
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
    console.log('両面撮影対応: プレビューを更新します');
    
    // 親コンテナを探す
    const container = fileInput.closest('.form-group, .mb-3, .document-upload-section, .card');
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
    
    // 少し遅延させて削除
    setTimeout(() => {
      if (successMsg.parentNode) {
        successMsg.parentNode.removeChild(successMsg);
      }
    }, 3000);
  }
  
  /**
   * カメラスタイル追加
   */
  function addCameraStyles() {
    if (document.getElementById('dual-document-camera-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'dual-document-camera-styles';
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
      
      .highlight-back-section {
        animation: pulse-highlight 2s;
      }
      
      @keyframes pulse-highlight {
        0% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.5); }
        70% { box-shadow: 0 0 0 10px rgba(13, 110, 253, 0); }
        100% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // インラインスクリプトを注入してモーダル操作の補助
  const inlineScript = document.createElement('script');
  inlineScript.textContent = `
    // ユーティリティ関数をグローバルに公開
    window.openCameraModalDirectly = function(inputId) {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        // カスタムイベントを発火
        document.dispatchEvent(new CustomEvent('open-camera-modal', {
          detail: { inputId: inputId }
        }));
      }
    };
    
    // モーダル内操作ヘルパー
    window.cameraModalHelpers = {
      takePhoto: function() {
        document.getElementById('capture-btn')?.click();
      },
      
      usePhoto: function() {
        document.getElementById('use-photo-btn')?.click();
      },
      
      switchCamera: function() {
        document.getElementById('switch-camera-btn')?.click();
      }
    };
  `;
  
  document.head.appendChild(inlineScript);
  
  // カスタムイベントリスナー
  document.addEventListener('open-camera-modal', function(e) {
    if (e.detail) {
      if (e.detail.inputId) {
        const input = document.getElementById(e.detail.inputId);
        if (input) {
          openCameraModal(input);
        }
      } else if (e.detail.input) {
        openCameraModal(e.detail.input);
      }
    }
  });
})();