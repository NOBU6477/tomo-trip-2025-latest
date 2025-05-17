/**
 * 書類セクション表示の問題を修正するスクリプト
 * マイナンバーカード選択時に適切なセクションを表示する
 */
(function() {
  console.log('書類セクション修正: 初期化中...');
  
  // DOMが完全に読み込まれたら実行
  document.addEventListener('DOMContentLoaded', function() {
    // 初期化処理
    setTimeout(initDocumentSectionsFix, 500);
    
    // DOM変化を監視
    const observer = new MutationObserver(function(mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // 新しいモーダルなどが追加された場合に処理
          setTimeout(initDocumentSectionsFix, 300);
        }
      }
    });
    
    // document全体の変更を監視
    observer.observe(document.body, { childList: true, subtree: true });
  });
  
  /**
   * 書類セクション修正の初期化
   */
  function initDocumentSectionsFix() {
    console.log('書類セクション修正: 書類タイプ選択を監視');
    
    // すべての書類タイプ選択を検索（マイナンバーを含むオプションを持つもの）
    const documentTypeSelects = findDocumentTypeSelects();
    console.log(`書類セクション修正: ${documentTypeSelects.length}個の書類タイプ選択を検出`);
    
    documentTypeSelects.forEach(function(select) {
      // 既に処理済みかチェック
      if (select.getAttribute('data-sections-processed')) {
        return;
      }
      
      // 処理済みとしてマーク
      select.setAttribute('data-sections-processed', 'true');
      
      // 現在の選択値をチェック
      if (select.value) {
        processDocumentTypeSelection(select, select.value);
      }
      
      // 変更イベントを追加
      select.addEventListener('change', function() {
        processDocumentTypeSelection(this, this.value);
      });
    });
  }
  
  /**
   * 書類タイプ選択を探す
   */
  function findDocumentTypeSelects() {
    // 直接クラス/IDで探す
    let selects = document.querySelectorAll('select[id*="document-type"], select[id*="id-type"]');
    
    // 見つからなければ内容で探す
    if (!selects.length) {
      const allSelects = document.querySelectorAll('select');
      selects = Array.from(allSelects).filter(select => {
        // マイナンバーやパスポートなどのオプションを含むか確認
        const options = Array.from(select.options || []);
        return options.some(option => {
          const text = option.textContent.toLowerCase();
          const value = option.value.toLowerCase();
          return text.includes('マイナンバー') || 
                 text.includes('運転免許') || 
                 text.includes('パスポート') || 
                 text.includes('在留') || 
                 value === 'idcard' || 
                 value === 'license' || 
                 value === 'passport' || 
                 value === 'residence';
        });
      });
    }
    
    return selects;
  }
  
  /**
   * 書類タイプ選択処理
   */
  function processDocumentTypeSelection(select, value) {
    console.log(`書類セクション修正: 書類タイプ「${value}」を処理`);
    
    // コンテナを探す
    const container = findContainer(select);
    if (!container) {
      console.error('書類セクション修正: 書類セクションのコンテナが見つかりません');
      return;
    }
    
    // 既存のセクション（表示されていれば）を隠す
    hideAllDocumentSections(container);
    
    // 値に応じて適切なセクションを表示
    if (value === 'idCard' || value === 'my_number') {
      console.log('書類セクション修正: マイナンバーカードセクションを表示');
      showIdCardSection(container);
    } else if (value === 'license' || value === 'driver_license') {
      console.log('書類セクション修正: 運転免許証セクションを表示');
      showLicenseSection(container);
    } else if (value === 'passport') {
      console.log('書類セクション修正: パスポートセクションを表示');
      showPassportSection(container);
    } else if (value === 'residence_card') {
      console.log('書類セクション修正: 在留カードセクションを表示');
      showResidenceCardSection(container);
    }
  }
  
  /**
   * コンテナを探す
   */
  function findContainer(element) {
    // フォームを探す
    const form = element.closest('form');
    
    // モーダルを探す
    const modal = element.closest('.modal-content, .modal-body');
    
    // 専用コンテナを探す
    const documentContainer = element.closest('.document-container, .document-upload-container');
    
    // いずれかが存在すれば返す
    if (documentContainer) return documentContainer;
    if (modal) return modal;
    if (form) return form;
    
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
    
    // 見つからなければレベルを上げてもう一度探す
    let container = element.closest('.container, .container-fluid, .card, .card-body, section');
    if (container) return container;
    
    // どうしても見つからなければbodyを返す
    return document.body;
  }
  
  /**
   * すべての書類セクションを隠す
   */
  function hideAllDocumentSections(container) {
    // クラスに基づくセクションを探す
    const sections = container.querySelectorAll('.document-section, .id-section, .license-section, .passport-section, .residence-section');
    
    // ID接頭辞に基づくセクションを探す
    const idSections = container.querySelectorAll('[id*="license-section"], [id*="idcard-section"], [id*="passport-section"], [id*="residence-section"]');
    
    // すべて非表示にする
    sections.forEach(section => {
      section.style.display = 'none';
    });
    
    idSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // 個別の入力要素も非表示にする
    const inputGroups = [
      { prefix: 'license', isDouble: true },
      { prefix: 'idcard', isDouble: true },
      { prefix: 'passport', isDouble: false },
      { prefix: 'residence', isDouble: true }
    ];
    
    inputGroups.forEach(group => {
      if (group.isDouble) {
        // 表裏両方ある場合
        const frontGroup = container.querySelector(`[id*="${group.prefix}-front"]`);
        const backGroup = container.querySelector(`[id*="${group.prefix}-back"]`);
        
        if (frontGroup) {
          const frontSection = frontGroup.closest('.form-group, .mb-3');
          if (frontSection) frontSection.style.display = 'none';
        }
        
        if (backGroup) {
          const backSection = backGroup.closest('.form-group, .mb-3');
          if (backSection) backSection.style.display = 'none';
        }
      } else {
        // 単一の場合
        const inputGroup = container.querySelector(`[id*="${group.prefix}-input"]`);
        if (inputGroup) {
          const section = inputGroup.closest('.form-group, .mb-3');
          if (section) section.style.display = 'none';
        }
      }
    });
  }
  
  /**
   * マイナンバーカードセクション表示
   */
  function showIdCardSection(container) {
    // 既存のセクションを探す
    let section = container.querySelector('.idcard-section, [id*="idcard-section"]');
    
    // 見つからなければ個別要素を探す
    if (!section) {
      const frontInput = container.querySelector('input[id*="idcard"][id*="front"]');
      const backInput = container.querySelector('input[id*="idcard"][id*="back"]');
      
      if (frontInput && backInput) {
        // 入力要素が既にあれば表示
        const frontSection = frontInput.closest('.form-group, .mb-3');
        const backSection = backInput.closest('.form-group, .mb-3');
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        
        return;
      }
      
      // セクションを作成
      section = createDocumentSection('idcard', 'マイナンバーカード/運転経歴証明書');
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * 運転免許証セクション表示
   */
  function showLicenseSection(container) {
    // 既存のセクションを探す
    let section = container.querySelector('.license-section, [id*="license-section"]');
    
    // 見つからなければ個別要素を探す
    if (!section) {
      const frontInput = container.querySelector('input[id*="license"][id*="front"]');
      const backInput = container.querySelector('input[id*="license"][id*="back"]');
      
      if (frontInput && backInput) {
        // 入力要素が既にあれば表示
        const frontSection = frontInput.closest('.form-group, .mb-3');
        const backSection = backInput.closest('.form-group, .mb-3');
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        
        return;
      }
      
      // セクションを作成
      section = createDocumentSection('license', '運転免許証');
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * パスポートセクション表示
   */
  function showPassportSection(container) {
    // 既存のセクションを探す
    let section = container.querySelector('.passport-section, [id*="passport-section"]');
    
    // 見つからなければ個別要素を探す
    if (!section) {
      const input = container.querySelector('input[id*="passport"]');
      
      if (input) {
        // 入力要素が既にあれば表示
        const inputSection = input.closest('.form-group, .mb-3');
        if (inputSection) {
          inputSection.style.display = '';
          return;
        }
      }
      
      // セクションを作成
      section = createDocumentSection('passport', 'パスポート', false);
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * 在留カードセクション表示
   */
  function showResidenceCardSection(container) {
    // 既存のセクションを探す
    let section = container.querySelector('.residence-section, [id*="residence-section"]');
    
    // 見つからなければ個別要素を探す
    if (!section) {
      const frontInput = container.querySelector('input[id*="residence"][id*="front"]');
      const backInput = container.querySelector('input[id*="residence"][id*="back"]');
      
      if (frontInput && backInput) {
        // 入力要素が既にあれば表示
        const frontSection = frontInput.closest('.form-group, .mb-3');
        const backSection = backInput.closest('.form-group, .mb-3');
        
        if (frontSection) frontSection.style.display = '';
        if (backSection) backSection.style.display = '';
        
        return;
      }
      
      // セクションを作成
      section = createDocumentSection('residence', '在留カード');
      container.appendChild(section);
    }
    
    // セクションを表示
    section.style.display = '';
  }
  
  /**
   * 書類セクション作成
   */
  function createDocumentSection(type, title, isDouble = true) {
    const section = document.createElement('div');
    section.className = `document-section ${type}-section mt-3`;
    section.id = `${type}-section`;
    
    if (isDouble) {
      // 表裏両方を持つ書類
      section.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${title}アップロード</h5>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="${type}-front-input" class="form-label">${title}（表面）</label>
                  <div class="input-group mb-3">
                    <input type="file" class="form-control" id="${type}-front-input" accept="image/*">
                    <button class="btn btn-outline-primary document-camera" type="button">
                      <i class="bi bi-camera"></i> カメラ
                    </button>
                  </div>
                  <div class="preview-container"></div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="${type}-back-input" class="form-label">${title}（裏面）</label>
                  <div class="input-group mb-3">
                    <input type="file" class="form-control" id="${type}-back-input" accept="image/*">
                    <button class="btn btn-outline-primary document-camera" type="button">
                      <i class="bi bi-camera"></i> カメラ
                    </button>
                  </div>
                  <div class="preview-container"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // 片面のみの書類
      section.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${title}アップロード</h5>
            <div class="mb-3">
              <label for="${type}-input" class="form-label">${title}</label>
              <div class="input-group mb-3">
                <input type="file" class="form-control" id="${type}-input" accept="image/*">
                <button class="btn btn-outline-primary document-camera" type="button">
                  <i class="bi bi-camera"></i> カメラ
                </button>
              </div>
              <div class="preview-container"></div>
            </div>
          </div>
        </div>
      `;
    }
    
    // 新しいセクションを作成したことをイベントで通知
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('document-section-created', {
        detail: { section, type }
      }));
    }, 0);
    
    return section;
  }
})();