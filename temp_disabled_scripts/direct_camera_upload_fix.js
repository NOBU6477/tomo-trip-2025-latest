/**
 * 直接的なカメラ・アップロード機能の修正スクリプト
 * マイナンバーカード選択時のセクション表示と真っ黒画像の問題を解決
 */
(function() {
  console.log('直接カメラ修正: 初期化中...');
  
  // ページロード後に初期化
  document.addEventListener('DOMContentLoaded', function() {
    console.log('直接カメラ修正: DOMContentLoadedイベント発火');
    
    // すぐに実行
    setTimeout(initDirectFix, 500);
    
    // 新しいモーダルなどが追加された場合のイベントリスナー
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // 新要素の追加を検出
          checkForAddedElements(mutation.addedNodes);
        }
      }
    });
    
    // document全体の変更を監視
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 定期的に再実行して確実に適用
    setInterval(initDirectFix, 2000);
  });
  
  /**
   * 直接的な修正を初期化
   */
  function initDirectFix() {
    console.log('直接カメラ修正: 初期化処理を実行');
    
    // マイナンバーカードセクションの修正
    fixMyNumberCardSection();
    
    // 書類タイプセレクタの設定
    setupDocumentSelectors();
    
    // カメラボタンを設定
    setupAllCameraButtons();
    
    // 裏表両面ボタンの表示
    setupDualPhotoButtons();
    
    // 画像プレビューの修正（真っ黒画像問題）
    fixImagePreview();
  }
  
  /**
   * マイナンバーカードセクションの修正
   */
  function fixMyNumberCardSection() {
    console.log('直接カメラ修正: マイナンバーカードセクション処理');
    
    // 1. 値が「マイナンバーカード」のセレクト要素を探す
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
      // 現在の選択値をチェック
      if (select.value === 'idCard' || 
          (select.selectedOptions && select.selectedOptions[0] && 
           select.selectedOptions[0].textContent.includes('マイナンバー'))) {
        
        console.log('直接カメラ修正: マイナンバーカード選択を検出', select);
        
        // 親コンテナを探す
        const container = findParentContainer(select);
        if (!container) return;
        
        // 既存のファイル入力とカメラセクションを探す
        let existingSection = container.querySelector('[id*="idcard-section"]');
        
        // 既存のセクションがなければ作成
        if (!existingSection) {
          console.log('直接カメラ修正: マイナンバーカードセクションを作成');
          
          // 裏面もある場合は両面セクションを作成
          createIdCardDualSection(container);
        } else {
          console.log('直接カメラ修正: 既存のマイナンバーカードセクションを表示');
          existingSection.style.display = '';
        }
      }
    });
    
    // 2. テキスト「マイナンバーカード」を含むセレクトオプションを探す
    selects.forEach(select => {
      const options = Array.from(select.options || []);
      const hasMyNumberOption = options.some(option => 
        option.textContent.includes('マイナンバー') ||
        option.value === 'idCard'
      );
      
      if (hasMyNumberOption) {
        // 変更イベントリスナーを設定（まだ設定されていなければ）
        if (!select.getAttribute('data-mynumber-processed')) {
          select.setAttribute('data-mynumber-processed', 'true');
          
          select.addEventListener('change', function() {
            console.log('直接カメラ修正: セレクト変更', this.value);
            
            if (this.value === 'idCard' || 
                (this.selectedOptions && this.selectedOptions[0] && 
                 this.selectedOptions[0].textContent.includes('マイナンバー'))) {
              
              // マイナンバーカードが選択された場合
              const container = findParentContainer(this);
              if (container) {
                setTimeout(() => {
                  fixMyNumberCardSection();
                }, 100);
              }
            }
          });
        }
      }
    });
  }
  
  /**
   * マイナンバーカード用の両面セクションを作成
   */
  function createIdCardDualSection(container) {
    console.log('直接カメラ修正: マイナンバーカード両面セクション作成');
    
    // 既存のファイルセクションを非表示
    const existingFileInputs = container.querySelectorAll('input[type="file"]');
    existingFileInputs.forEach(input => {
      const inputSection = input.closest('.form-group, .mb-3');
      if (inputSection) {
        inputSection.style.display = 'none';
      }
    });
    
    // セクションを作成
    const idCardSection = document.createElement('div');
    idCardSection.id = 'idcard-section';
    idCardSection.className = 'idcard-section document-section mt-3';
    
    idCardSection.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">マイナンバーカード/運転経歴証明書アップロード</h5>
          <p class="text-muted small">両面をアップロードしてください</p>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label for="idcard-front-input" class="form-label">マイナンバーカード（表面）</label>
                <div class="input-group">
                  <input type="file" class="form-control" id="idcard-front-input" accept="image/*">
                  <button type="button" class="btn btn-outline-primary document-camera">
                    <i class="bi bi-camera"></i> カメラ
                  </button>
                </div>
                <div class="preview-container mt-2"></div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="idcard-back-input" class="form-label">マイナンバーカード（裏面）</label>
                <div class="input-group">
                  <input type="file" class="form-control" id="idcard-back-input" accept="image/*">
                  <button type="button" class="btn btn-outline-primary document-camera">
                    <i class="bi bi-camera"></i> カメラ
                  </button>
                </div>
                <div class="preview-container mt-2"></div>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between mt-3 my-card-buttons">
            <button type="button" class="btn btn-primary front-photo-btn">
              <i class="bi bi-camera me-2"></i>表面を撮影
            </button>
            <button type="button" class="btn btn-primary back-photo-btn">
              <i class="bi bi-camera me-2"></i>裏面を撮影
            </button>
          </div>
        </div>
      </div>
    `;
    
    // コンテナに追加
    container.appendChild(idCardSection);
    
    // ボタンにイベントを設定
    setTimeout(() => {
      const frontBtn = idCardSection.querySelector('.front-photo-btn');
      const backBtn = idCardSection.querySelector('.back-photo-btn');
      
      if (frontBtn) {
        frontBtn.addEventListener('click', function() {
          const input = document.getElementById('idcard-front-input');
          if (input) {
            openCameraModal(input, '表面');
          }
        });
      }
      
      if (backBtn) {
        backBtn.addEventListener('click', function() {
          const input = document.getElementById('idcard-back-input');
          if (input) {
            openCameraModal(input, '裏面');
          }
        });
      }
      
      // document-cameraボタンも設定
      const cameraButtons = idCardSection.querySelectorAll('.document-camera');
      cameraButtons.forEach(button => {
        button.addEventListener('click', function() {
          const input = this.closest('.input-group').querySelector('input[type="file"]');
          if (input) {
            if (input.id.includes('front')) {
              openCameraModal(input, '表面');
            } else {
              openCameraModal(input, '裏面');
            }
          }
        });
      });
    }, 100);
  }
  
  /**
   * 親コンテナを探す
   */
  function findParentContainer(element) {
    // モーダル本体を探す
    const modal = element.closest('.modal-content, .modal-body');
    if (modal) return modal;
    
    // フォームを探す
    const form = element.closest('form');
    if (form) return form;
    
    // 親要素を辿る
    let parent = element.parentElement;
    let depth = 0;
    
    while (parent && depth < 4) {
      if (parent.classList.contains('card-body') || 
          parent.classList.contains('modal-body') ||
          parent.classList.contains('form-section')) {
        return parent;
      }
      
      // フォーム要素のグループが複数あれば親コンテナとみなす
      if (parent.querySelectorAll('.form-group, .mb-3').length > 1) {
        return parent;
      }
      
      parent = parent.parentElement;
      depth++;
    }
    
    // 見つからなければコンテナ系の要素を探す
    return element.closest('.container, .container-fluid, .row, .card, section') || document.body;
  }
  
  /**
   * 追加された要素をチェック
   */
  function checkForAddedElements(nodes) {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // モーダルかどうかをチェック
        if (node.classList && (node.classList.contains('modal') || node.classList.contains('modal-dialog'))) {
          console.log('直接カメラ修正: 新しいモーダルを検出');
          
          // 少し遅延させて処理
          setTimeout(() => {
            initDirectFix();
          }, 300);
        }
        
        // セレクトボックスの追加をチェック
        if (node.tagName === 'SELECT') {
          setTimeout(() => {
            setupDocumentSelectors();
          }, 100);
        }
        
        // 子ノードもチェック
        if (node.childNodes && node.childNodes.length) {
          checkForAddedElements(node.childNodes);
        }
      }
    });
  }
  
  /**
   * 書類タイプセレクタの設定
   */
  function setupDocumentSelectors() {
    // 書類タイプのセレクト要素を探す
    const selectors = document.querySelectorAll('select');
    
    selectors.forEach(select => {
      // 書類タイプのセレクトかどうかをチェック
      const options = Array.from(select.options || []);
      const isDocumentSelector = options.some(option => {
        const text = option.textContent.toLowerCase();
        const value = option.value.toLowerCase();
        return text.includes('マイナンバー') || 
               text.includes('運転免許') || 
               text.includes('パスポート') || 
               value === 'idcard' || 
               value === 'license' || 
               value === 'passport';
      });
      
      if (isDocumentSelector && !select.getAttribute('data-document-processed')) {
        // 処理済みとしてマーク
        select.setAttribute('data-document-processed', 'true');
        
        // 現在の選択値があれば処理
        if (select.value) {
          handleDocumentTypeChange(select, select.value);
        }
        
        // 変更イベントリスナーを設定
        select.addEventListener('change', function() {
          handleDocumentTypeChange(this, this.value);
        });
      }
    });
  }
  
  /**
   * 書類タイプ変更の処理
   */
  function handleDocumentTypeChange(select, value) {
    console.log('直接カメラ修正: 書類タイプ変更', value);
    
    // 親コンテナを探す
    const container = findParentContainer(select);
    if (!container) return;
    
    // 既存のセクションを非表示
    const existingSections = container.querySelectorAll('.document-section');
    existingSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // 新しいタイプに基づいてセクションを表示
    if (value === 'license' || value.includes('driver')) {
      // 運転免許証
      showLicenseSection(container);
    } else if (value === 'idCard' || value.includes('my_number')) {
      // マイナンバーカード
      showIdCardSection(container);
    } else if (value === 'passport') {
      // パスポート
      showPassportSection(container);
    }
  }
  
  /**
   * 運転免許証セクションを表示
   */
  function showLicenseSection(container) {
    console.log('直接カメラ修正: 運転免許証セクション表示');
    
    // 既存のセクションを探す
    let section = container.querySelector('.license-section, #license-section');
    
    if (!section) {
      // 既存のファイル入力を探す
      const frontInput = container.querySelector('input[id*="license"][id*="front"]');
      const backInput = container.querySelector('input[id*="license"][id*="back"]');
      
      if (frontInput && backInput) {
        // 既にあるなら表示
        const frontSection = frontInput.closest('.form-group, .mb-3');
        const backSection = backInput.closest('.form-group, .mb-3');
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        
        return;
      }
      
      // セクションを新規作成
      section = document.createElement('div');
      section.id = 'license-section';
      section.className = 'license-section document-section mt-3';
      
      section.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">運転免許証アップロード</h5>
            <p class="text-muted small">両面をアップロードしてください</p>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="license-front-input" class="form-label">運転免許証（表面）</label>
                  <div class="input-group">
                    <input type="file" class="form-control" id="license-front-input" accept="image/*">
                    <button type="button" class="btn btn-outline-primary document-camera">
                      <i class="bi bi-camera"></i> カメラ
                    </button>
                  </div>
                  <div class="preview-container mt-2"></div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="license-back-input" class="form-label">運転免許証（裏面）</label>
                  <div class="input-group">
                    <input type="file" class="form-control" id="license-back-input" accept="image/*">
                    <button type="button" class="btn btn-outline-primary document-camera">
                      <i class="bi bi-camera"></i> カメラ
                    </button>
                  </div>
                  <div class="preview-container mt-2"></div>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between mt-3 my-card-buttons">
              <button type="button" class="btn btn-primary front-photo-btn">
                <i class="bi bi-camera me-2"></i>表面を撮影
              </button>
              <button type="button" class="btn btn-primary back-photo-btn">
                <i class="bi bi-camera me-2"></i>裏面を撮影
              </button>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(section);
      
      // ボタンにイベントを設定
      setTimeout(() => {
        const frontBtn = section.querySelector('.front-photo-btn');
        const backBtn = section.querySelector('.back-photo-btn');
        
        if (frontBtn) {
          frontBtn.addEventListener('click', function() {
            const input = document.getElementById('license-front-input');
            if (input) {
              openCameraModal(input, '表面');
            }
          });
        }
        
        if (backBtn) {
          backBtn.addEventListener('click', function() {
            const input = document.getElementById('license-back-input');
            if (input) {
              openCameraModal(input, '裏面');
            }
          });
        }
        
        // document-cameraボタンも設定
        const cameraButtons = section.querySelectorAll('.document-camera');
        cameraButtons.forEach(button => {
          button.addEventListener('click', function() {
            const input = this.closest('.input-group').querySelector('input[type="file"]');
            if (input) {
              if (input.id.includes('front')) {
                openCameraModal(input, '表面');
              } else {
                openCameraModal(input, '裏面');
              }
            }
          });
        });
      }, 100);
    } else {
      // 既存のセクションを表示
      section.style.display = '';
    }
  }
  
  /**
   * マイナンバーカードセクションを表示
   */
  function showIdCardSection(container) {
    console.log('直接カメラ修正: マイナンバーカードセクション表示');
    
    // 既存のセクションを探す
    let section = container.querySelector('.idcard-section, #idcard-section');
    
    if (!section) {
      // 既存のファイル入力を探す
      const frontInput = container.querySelector('input[id*="idcard"][id*="front"]');
      const backInput = container.querySelector('input[id*="idcard"][id*="back"]');
      
      if (frontInput && backInput) {
        // 既にあるなら表示
        const frontSection = frontInput.closest('.form-group, .mb-3');
        const backSection = backInput.closest('.form-group, .mb-3');
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        
        return;
      }
      
      // セクションを新規作成
      createIdCardDualSection(container);
    } else {
      // 既存のセクションを表示
      section.style.display = '';
    }
  }
  
  /**
   * パスポートセクションを表示
   */
  function showPassportSection(container) {
    console.log('直接カメラ修正: パスポートセクション表示');
    
    // 既存のセクションを探す
    let section = container.querySelector('.passport-section, #passport-section');
    
    if (!section) {
      // 既存のファイル入力を探す
      const input = container.querySelector('input[id*="passport"]');
      
      if (input) {
        // 既にあるなら表示
        const inputSection = input.closest('.form-group, .mb-3');
        
        if (inputSection) {
          inputSection.style.display = '';
          return;
        }
      }
      
      // セクションを新規作成
      section = document.createElement('div');
      section.id = 'passport-section';
      section.className = 'passport-section document-section mt-3';
      
      section.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">パスポートアップロード</h5>
            <div class="mb-3">
              <label for="passport-input" class="form-label">パスポート</label>
              <div class="input-group">
                <input type="file" class="form-control" id="passport-input" accept="image/*">
                <button type="button" class="btn btn-outline-primary document-camera">
                  <i class="bi bi-camera"></i> カメラ
                </button>
              </div>
              <div class="preview-container mt-2"></div>
            </div>
            <div class="mt-3">
              <button type="button" class="btn btn-primary photo-btn">
                <i class="bi bi-camera me-2"></i>パスポートを撮影
              </button>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(section);
      
      // ボタンにイベントを設定
      setTimeout(() => {
        const photoBtn = section.querySelector('.photo-btn');
        
        if (photoBtn) {
          photoBtn.addEventListener('click', function() {
            const input = document.getElementById('passport-input');
            if (input) {
              openCameraModal(input);
            }
          });
        }
        
        // document-cameraボタンも設定
        const cameraButton = section.querySelector('.document-camera');
        if (cameraButton) {
          cameraButton.addEventListener('click', function() {
            const input = document.getElementById('passport-input');
            if (input) {
              openCameraModal(input);
            }
          });
        }
      }, 100);
    } else {
      // 既存のセクションを表示
      section.style.display = '';
    }
  }
  
  /**
   * すべてのカメラボタンを設定
   */
  function setupAllCameraButtons() {
    console.log('直接カメラ修正: すべてのカメラボタンを設定');
    
    // 1. document-cameraクラスのボタン
    setupDocumentCameraButtons();
    
    // 2. 「カメラで撮影」テキストを含むボタン
    setupCameraTextButtons();
    
    // 3. カメラアイコンを含むボタン
    setupCameraIconButtons();
  }
  
  /**
   * document-cameraクラスのボタンを設定
   */
  function setupDocumentCameraButtons() {
    const buttons = document.querySelectorAll('.document-camera');
    
    buttons.forEach(button => {
      // 処理済みかチェック
      if (button.getAttribute('data-camera-setup')) {
        return;
      }
      
      // 処理済みとしてマーク
      button.setAttribute('data-camera-setup', 'true');
      
      // 関連するファイル入力を探す
      const input = button.closest('.input-group')?.querySelector('input[type="file"]');
      
      if (input) {
        // 表裏情報を取得
        let side = '';
        if (input.id.includes('front')) {
          side = '表面';
        } else if (input.id.includes('back')) {
          side = '裏面';
        }
        
        // クリックイベントを設定
        button.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          openCameraModal(input, side);
        });
      }
    });
  }
  
  /**
   * 「カメラで撮影」テキストを含むボタンを設定
   */
  function setupCameraTextButtons() {
    const buttons = Array.from(document.querySelectorAll('button, a, .btn')).filter(el => 
      el.textContent && el.textContent.includes('カメラで撮影')
    );
    
    buttons.forEach(button => {
      // 処理済みかチェック
      if (button.getAttribute('data-camera-setup')) {
        return;
      }
      
      // 処理済みとしてマーク
      button.setAttribute('data-camera-setup', 'true');
      
      // 関連するファイル入力を探す
      const container = button.closest('.modal-body, .card, form, .document-section');
      
      // クリックイベントを設定
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (container) {
          // コンテナ内のファイル入力を探す
          const fileInputs = container.querySelectorAll('input[type="file"]');
          
          if (fileInputs.length > 0) {
            // 表面/裏面を判断（テキストや周囲の要素から）
            const parentText = button.parentElement?.textContent || '';
            let side = '';
            
            if (parentText.includes('表面') || parentText.includes('表')) {
              side = '表面';
              openCameraModal(fileInputs[0], side);
            } else if (parentText.includes('裏面') || parentText.includes('裏')) {
              side = '裏面';
              
              // 裏面用の入力があるか確認
              if (fileInputs.length > 1) {
                openCameraModal(fileInputs[1], side);
              } else {
                openCameraModal(fileInputs[0], side);
              }
            } else {
              // 特定できない場合は最初の入力を使用
              openCameraModal(fileInputs[0], side);
            }
          }
        }
      });
    });
  }
  
  /**
   * カメラアイコンを含むボタンを設定
   */
  function setupCameraIconButtons() {
    const buttons = Array.from(document.querySelectorAll('button, a, .btn')).filter(el => 
      el.querySelector('.bi-camera, .fa-camera, [class*="camera"]') ||
      (el.innerHTML && el.innerHTML.includes('camera'))
    );
    
    buttons.forEach(button => {
      // 処理済みかチェック
      if (button.getAttribute('data-camera-setup')) {
        return;
      }
      
      // document-cameraクラスのボタンはスキップ（上で設定済み）
      if (button.classList.contains('document-camera')) {
        return;
      }
      
      // 処理済みとしてマーク
      button.setAttribute('data-camera-setup', 'true');
      
      // ボタンのテキストと周囲の要素から情報を取得
      const buttonText = button.textContent || '';
      const parentText = button.parentElement?.textContent || '';
      
      let targetInput = null;
      let side = '';
      
      // ボタンのテキストから書類タイプと表裏を判断
      if (buttonText.includes('運転免許')) {
        if (buttonText.includes('表面') || buttonText.includes('表')) {
          targetInput = document.getElementById('license-front-input');
          side = '表面';
        } else if (buttonText.includes('裏面') || buttonText.includes('裏')) {
          targetInput = document.getElementById('license-back-input');
          side = '裏面';
        } else {
          targetInput = document.getElementById('license-front-input') || 
                        document.getElementById('license-input');
        }
      } else if (buttonText.includes('マイナンバー') || buttonText.includes('証明書')) {
        if (buttonText.includes('表面') || buttonText.includes('表')) {
          targetInput = document.getElementById('idcard-front-input');
          side = '表面';
        } else if (buttonText.includes('裏面') || buttonText.includes('裏')) {
          targetInput = document.getElementById('idcard-back-input');
          side = '裏面';
        } else {
          targetInput = document.getElementById('idcard-front-input') || 
                        document.getElementById('idcard-input');
        }
      } else if (buttonText.includes('パスポート')) {
        targetInput = document.getElementById('passport-input');
      }
      
      // 見つからなかった場合は親コンテナから探す
      if (!targetInput) {
        const container = button.closest('.modal-body, .card, form, .document-section');
        if (container) {
          const fileInputs = container.querySelectorAll('input[type="file"]');
          if (fileInputs.length > 0) {
            targetInput = fileInputs[0];
          }
        }
      }
      
      // クリックイベントを設定
      if (targetInput) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          openCameraModal(targetInput, side);
        });
      }
    });
  }
  
  /**
   * 裏表両面ボタンの表示
   */
  function setupDualPhotoButtons() {
    console.log('直接カメラ修正: 裏表両面ボタンの表示');
    
    // 裏表両面が必要な書類セクションを探す
    const licenseSection = document.querySelector('#license-section, .license-section');
    const idcardSection = document.querySelector('#idcard-section, .idcard-section');
    
    // 運転免許証セクションのボタン設定
    if (licenseSection && !licenseSection.getAttribute('data-buttons-setup')) {
      licenseSection.setAttribute('data-buttons-setup', 'true');
      
      // 既存のボタンがあるか確認
      if (!licenseSection.querySelector('.my-card-buttons')) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'my-card-buttons d-flex justify-content-between mt-3';
        
        buttonsDiv.innerHTML = `
          <button type="button" class="btn btn-primary front-photo-btn">
            <i class="bi bi-camera me-2"></i>表面を撮影
          </button>
          <button type="button" class="btn btn-primary back-photo-btn">
            <i class="bi bi-camera me-2"></i>裏面を撮影
          </button>
        `;
        
        // カードボディを探して追加
        const cardBody = licenseSection.querySelector('.card-body');
        if (cardBody) {
          cardBody.appendChild(buttonsDiv);
          
          // ボタンイベント設定
          const frontBtn = buttonsDiv.querySelector('.front-photo-btn');
          const backBtn = buttonsDiv.querySelector('.back-photo-btn');
          
          if (frontBtn) {
            frontBtn.addEventListener('click', function() {
              const input = document.getElementById('license-front-input');
              if (input) {
                openCameraModal(input, '表面');
              }
            });
          }
          
          if (backBtn) {
            backBtn.addEventListener('click', function() {
              const input = document.getElementById('license-back-input');
              if (input) {
                openCameraModal(input, '裏面');
              }
            });
          }
        }
      }
    }
    
    // マイナンバーカードセクションのボタン設定
    if (idcardSection && !idcardSection.getAttribute('data-buttons-setup')) {
      idcardSection.setAttribute('data-buttons-setup', 'true');
      
      // 既存のボタンがあるか確認
      if (!idcardSection.querySelector('.my-card-buttons')) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'my-card-buttons d-flex justify-content-between mt-3';
        
        buttonsDiv.innerHTML = `
          <button type="button" class="btn btn-primary front-photo-btn">
            <i class="bi bi-camera me-2"></i>表面を撮影
          </button>
          <button type="button" class="btn btn-primary back-photo-btn">
            <i class="bi bi-camera me-2"></i>裏面を撮影
          </button>
        `;
        
        // カードボディを探して追加
        const cardBody = idcardSection.querySelector('.card-body');
        if (cardBody) {
          cardBody.appendChild(buttonsDiv);
          
          // ボタンイベント設定
          const frontBtn = buttonsDiv.querySelector('.front-photo-btn');
          const backBtn = buttonsDiv.querySelector('.back-photo-btn');
          
          if (frontBtn) {
            frontBtn.addEventListener('click', function() {
              const input = document.getElementById('idcard-front-input');
              if (input) {
                openCameraModal(input, '表面');
              }
            });
          }
          
          if (backBtn) {
            backBtn.addEventListener('click', function() {
              const input = document.getElementById('idcard-back-input');
              if (input) {
                openCameraModal(input, '裏面');
              }
            });
          }
        }
      }
    }
  }
  
  /**
   * 画像プレビューの修正（真っ黒画像問題対応）
   */
  function fixImagePreview() {
    console.log('直接カメラ修正: 画像プレビュー修正');
    
    // 真っ黒画像問題の原因はcanvasのdrawImageの問題の可能性が高い
    // 画像プレビュー要素をすべて探す
    const previewImages = document.querySelectorAll('img.preview-img, .preview-container img');
    
    previewImages.forEach(img => {
      // src属性があり、空でなく、data:image/を含む場合
      if (img.src && img.src.includes('data:image/')) {
        // 画像読み込みエラーを検出するイベントリスナー
        if (!img.getAttribute('data-error-listener')) {
          img.setAttribute('data-error-listener', 'true');
          
          img.addEventListener('error', function() {
            console.log('直接カメラ修正: 画像読み込みエラーを検出', this.src.substring(0, 30) + '...');
            
            // エラーアイコンを表示
            this.onerror = null; // 再帰呼び出し防止
            this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMCAxNHYtNCI+PC9wYXRoPjxwYXRoIGQ9Ik0xNCAxNHYtNCI+PC9wYXRoPjxwYXRoIGQ9Ik05IDE4aDYiPjwvcGF0aD48cGF0aCBkPSJNMTAgMjJoNCBhMiAyIDAgMCAwIDIgLTJWNGEyIDIgMCAwIDAgLTIgLTJoLTRhMiAyIDAgMCAwIC0yIDJ2MTZhMiAyIDAgMCAwIDIgMnoiPjwvcGF0aD48L3N2Zz4=';
            this.className = 'error-preview-img';
            this.style.background = '#f8d7da';
            this.style.padding = '10px';
            this.style.border = '1px solid #f5c6cb';
            this.style.borderRadius = '4px';
            
            // エラーメッセージを表示
            const errorMsg = document.createElement('div');
            errorMsg.className = 'alert alert-danger mt-2 small';
            errorMsg.innerHTML = '<i class="bi bi-exclamation-triangle me-1"></i>画像の読み込みエラー（再撮影してください）';
            
            const parent = this.parentElement;
            if (parent) {
              parent.appendChild(errorMsg);
              
              // 少し遅延して削除
              setTimeout(() => {
                if (errorMsg.parentElement) {
                  errorMsg.parentElement.removeChild(errorMsg);
                }
              }, 5000);
            }
          });
        }
      }
    });
  }
  
  // グローバル変数
  let mediaStream = null;
  let currentFileInput = null;
  let facingMode = 'environment';  // 初期値は背面カメラ
  
  /**
   * カメラモーダルを開く
   */
  function openCameraModal(fileInput, side = '') {
    if (!fileInput) {
      console.error('直接カメラ修正: ファイル入力要素が見つかりません');
      return;
    }
    
    console.log('直接カメラ修正: カメラモーダルを開きます', fileInput.id);
    currentFileInput = fileInput;
    
    // 既存のモーダルを削除
    const existingModal = document.getElementById('direct-camera-modal');
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
      if (inputId.includes('back') || side === '裏面') {
        title = '運転免許証(裏面)を撮影';
      } else {
        title = '運転免許証(表面)を撮影';
      }
    } else if (inputId.includes('idcard')) {
      if (inputId.includes('back') || side === '裏面') {
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
      <div class="modal fade" id="direct-camera-modal" tabindex="-1" aria-hidden="true">
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
      const modal = new bootstrap.Modal(document.getElementById('direct-camera-modal'));
      
      // モーダルイベント
      const modalElement = document.getElementById('direct-camera-modal');
      
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
    const modalElement = document.getElementById('direct-camera-modal');
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
    console.log('直接カメラ修正: カメラを起動します');
    
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
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    
    // カメラアクセス
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        console.log('カメラストリームを取得しました', facingMode);
        mediaStream = stream;
        video.srcObject = stream;
        
        // カメラ切り替えボタン
        if (switchBtn) {
          switchBtn.addEventListener('click', function() {
            switchCamera();
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
  function switchCamera() {
    console.log('直接カメラ修正: カメラを切り替えます');
    
    // 現在のストリームを停止
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    
    // facingModeを切り替え
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    
    // 新しい設定でカメラを再起動
    const constraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    
    const video = document.getElementById('camera-video');
    if (!video) return;
    
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        mediaStream = stream;
        video.srcObject = stream;
      })
      .catch(function(err) {
        console.error('カメラ切り替えエラー:', err);
      });
  }
  
  /**
   * カメラを停止
   */
  function stopCamera() {
    console.log('直接カメラ修正: カメラを停止します');
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
  }
  
  /**
   * 写真を撮影
   */
  function capturePhoto() {
    console.log('直接カメラ修正: 写真を撮影します');
    
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
    
    try {
      // キャンバスサイズを設定（真っ黒画像問題対策で明示的に設定）
      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      console.log(`直接カメラ修正: キャンバスサイズ設定 ${videoWidth}x${videoHeight}`);
      
      // 映像をキャンバスに描画
      const context = canvas.getContext('2d');
      
      // 描画前にクリア
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // 映像を描画
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 画像データを取得
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      console.log('直接カメラ修正: 画像データ作成完了', imageData.substring(0, 30) + '...');
      
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
        // 既存のリスナーをクリア
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
        // 既存のリスナーをクリア
        const newUsePhotoBtn = usePhotoBtn.cloneNode(true);
        usePhotoBtn.parentNode.replaceChild(newUsePhotoBtn, usePhotoBtn);
        
        newUsePhotoBtn.addEventListener('click', function() {
          usePhoto(imageData);
        });
      }
    } catch (err) {
      console.error('撮影エラー:', err);
      alert('写真の撮影中にエラーが発生しました。再試行してください。');
    }
  }
  
  /**
   * 撮影した写真を使用
   */
  function usePhoto(dataURL) {
    console.log('直接カメラ修正: 写真を使用します');
    
    if (!currentFileInput) {
      console.error('ファイル入力が指定されていません');
      return;
    }
    
    try {
      // 真っ黒画像問題対策としてBlobの作成方法を改善
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        // 背景を白で塗りつぶし
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 画像を描画
        ctx.drawImage(img, 0, 0);
        
        // JPEGとして取得（高品質）
        canvas.toBlob(function(blob) {
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
              const modal = bootstrap.Modal.getInstance(document.getElementById('direct-camera-modal'));
              if (modal) modal.hide();
            } catch (err) {
              console.log('モーダル取得エラー:', err);
              
              // 手動でモーダルを閉じる
              const modalElement = document.getElementById('direct-camera-modal');
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
            updatePreview(currentFileInput, canvas.toDataURL('image/jpeg', 0.9));
            
          } catch (err) {
            console.error('ファイル設定エラー:', err);
            alert('写真の設定に失敗しました');
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.onerror = function() {
        console.error('画像読み込みエラー');
        alert('画像の処理中にエラーが発生しました。別の方法で試してください。');
      };
      
      img.src = dataURL;
    } catch (err) {
      console.error('写真処理エラー:', err);
      alert('写真の処理中にエラーが発生しました。別の方法で試してください。');
    }
  }
  
  /**
   * カメラエラー表示
   */
  function showCameraError() {
    console.log('直接カメラ修正: エラーを表示します');
    
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
          <div class="mt-3">
            <button class="btn btn-secondary me-2" data-bs-dismiss="modal">
              キャンセル
            </button>
            <input type="file" id="fallback-file-input" accept="image/*" style="display:none">
            <button class="btn btn-primary" id="manual-upload-btn">
              <i class="bi bi-upload me-1"></i>画像を選択
            </button>
          </div>
        </div>
      `;
      
      // 手動アップロードボタンのイベント設定
      const manualBtn = container.querySelector('#manual-upload-btn');
      const fileInput = container.querySelector('#fallback-file-input');
      
      if (manualBtn && fileInput) {
        manualBtn.addEventListener('click', function() {
          fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
              usePhoto(e.target.result);
            };
            
            reader.readAsDataURL(this.files[0]);
          }
        });
      }
    }
  }
  
  /**
   * プレビュー更新
   */
  function updatePreview(fileInput, dataURL) {
    console.log('直接カメラ修正: プレビューを更新します');
    
    // 親コンテナを探す
    const container = fileInput.closest('.form-group, .mb-3, .document-upload-section, .card');
    if (!container) return;
    
    // プレビュー要素を探す
    let previewContainer = container.querySelector('.preview-container');
    let previewImg = previewContainer ? previewContainer.querySelector('img') : null;
    
    // プレビューコンテナがなければ作成
    if (!previewContainer) {
      previewContainer = document.createElement('div');
      previewContainer.className = 'preview-container mt-2';
      container.appendChild(previewContainer);
    }
    
    // プレビュー画像がなければ作成
    if (!previewImg) {
      previewImg = document.createElement('img');
      previewImg.className = 'preview-img img-fluid';
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
      previewContainer.appendChild(removeBtn);
      
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
    previewContainer.appendChild(successMsg);
    
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
    if (document.getElementById('direct-camera-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'direct-camera-styles';
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
        margin-bottom: 1.5rem;
      }
      
      .my-card-buttons {
        margin-top: 1rem;
      }
      
      /* 画像プレビューのエラー表示用 */
      .error-preview-img {
        max-width: 100px;
        max-height: 100px;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // グローバル関数でカメラオープンを提供（他のスクリプトから呼び出せるように）
  window.openDirectCameraModal = function(inputId, side) {
    const input = document.getElementById(inputId);
    if (input) {
      openCameraModal(input, side);
    }
  };
  
  // グローバルユーティリティ関数
  window.cameraUtilities = {
    createIdCardSection: function(containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        createIdCardDualSection(container);
      }
    },
    
    createLicenseSection: function(containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        showLicenseSection(container);
      }
    },
    
    capturePhoto: function(inputId, side) {
      const input = document.getElementById(inputId);
      if (input) {
        openCameraModal(input, side);
      }
    }
  };
})();