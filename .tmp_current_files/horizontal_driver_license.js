/**
 * 運転免許証表示の横並びレイアウト修正スクリプト
 * モーダル内の運転免許証の表面・裏面を強制的に横並びに表示します
 */
(function() {
  // DOMが完全に読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 初期化処理
  function init() {
    console.log('📄 横並び修正: 初期化');
    
    // 既存のモーダルをチェック
    checkAllModals();
    
    // モーダルの開閉を監視
    observeModalChanges();
    
    // 定期的にチェック
    setInterval(checkAllModals, 800);
  }
  
  // モーダルの変更を監視
  function observeModalChanges() {
    // DOM変更のオブザーバーを作成
    const observer = new MutationObserver(function(mutations) {
      let shouldCheck = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          // 追加された要素の中にモーダルやダイアログがあるかチェック
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList && 
                  (node.classList.contains('modal') || 
                   node.hasAttribute('role') && node.getAttribute('role') === 'dialog')) {
                shouldCheck = true;
                break;
              }
            }
          }
        }
      });
      
      if (shouldCheck) {
        setTimeout(checkAllModals, 100);
      }
    });
    
    // document全体の変更を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 全てのモーダルをチェック
  function checkAllModals() {
    // 表示中のモーダルを検索
    const modals = document.querySelectorAll('.modal.show, .modal[style*="display: block"], dialog[open], [role="dialog"]:not([style*="display: none"])');
    
    if (modals.length > 0) {
      console.log('📄 横並び修正: モーダルを検出', modals.length, '個');
      
      modals.forEach(modal => {
        processModal(modal);
      });
    }
  }
  
  // モーダルを処理
  function processModal(modal) {
    // すでに処理済みかチェック
    if (modal.getAttribute('data-horizontal-license-applied') === 'true') {
      return;
    }
    
    console.log('📄 横並び修正: モーダルを処理', modal.id || '(id なし)');
    
    // 運転免許証関連のコンテンツがあるかチェック
    if (modal.textContent.includes('運転免許証') ||
        modal.textContent.includes('表面') && modal.textContent.includes('裏面')) {
      console.log('📄 横並び修正: 運転免許証モーダルを検出');
      
      const modalBody = modal.querySelector('.modal-body') || modal;
      
      // 表面と裏面のセクションを探す
      const sections = findLicenseSections(modalBody);
      
      if (sections.front && sections.back) {
        console.log('📄 横並び修正: 表面と裏面のセクションを検出');
        
        // 横並びコンテナを作成
        const horizontalContainer = createHorizontalContainer(sections.front, sections.back, modalBody);
        
        // 処理済みフラグを設定
        modal.setAttribute('data-horizontal-license-applied', 'true');
      }
    } else {
      // 運転免許証関連でない場合も処理済みとマーク
      modal.setAttribute('data-horizontal-license-applied', 'true');
    }
  }
  
  // 運転免許証の表面と裏面のセクションを探す
  function findLicenseSections(container) {
    const result = {
      front: null,
      back: null
    };
    
    // 全ての要素を調査
    const allElements = container.querySelectorAll('*');
    
    // 表面・裏面のテキストを含む要素を探す
    for (const elem of allElements) {
      if (!elem.textContent) continue;
      
      const text = elem.textContent.trim().toLowerCase();
      const hasFileInput = !!elem.querySelector('input[type="file"]');
      const hasImg = !!elem.querySelector('img');
      const hasButton = !!elem.querySelector('button');
      
      // 表面セクション
      if (text.includes('表面') && !text.includes('裏面') && 
          (hasFileInput || hasImg || hasButton)) {
        if (!result.front || elem.textContent.length < result.front.textContent.length) {
          const parentContainer = findGoodParentContainer(elem);
          if (parentContainer) {
            result.front = parentContainer;
          } else {
            result.front = elem;
          }
        }
      }
      
      // 裏面セクション
      if (text.includes('裏面') && !text.includes('表面') && 
          (hasFileInput || hasImg || hasButton)) {
        if (!result.back || elem.textContent.length < result.back.textContent.length) {
          const parentContainer = findGoodParentContainer(elem);
          if (parentContainer) {
            result.back = parentContainer;
          } else {
            result.back = elem;
          }
        }
      }
    }
    
    // ファイル入力を持つ親要素を見つける
    function findGoodParentContainer(element) {
      // 適切なサイズの親コンテナを見つける
      let parent = element.parentNode;
      let bestParent = null;
      
      while (parent && parent !== container) {
        // form-group や row などのコンテナクラスを持っている
        if (parent.classList && 
            (parent.classList.contains('form-group') || 
             parent.classList.contains('mb-3') || 
             parent.classList.contains('mb-4') || 
             parent.classList.contains('input-group') ||
             parent.classList.contains('col') ||
             parent.classList.contains('col-md-6'))) {
          bestParent = parent;
        }
        
        parent = parent.parentNode;
      }
      
      return bestParent || element;
    }
    
    return result;
  }
  
  // 横並びコンテナを作成
  function createHorizontalContainer(frontSection, backSection, container) {
    // すでに横並びコンテナが存在するかチェック
    const existingContainer = container.querySelector('.horizontal-license-container');
    if (existingContainer) {
      return existingContainer;
    }
    
    // 既に横並びになっているかチェック
    const frontRect = frontSection.getBoundingClientRect();
    const backRect = backSection.getBoundingClientRect();
    
    // 両要素が横並びで表示されている場合は処理終了
    if (isHorizontallyArranged(frontRect, backRect)) {
      console.log('📄 横並び修正: すでに横並びになっています');
      return null;
    }
    
    console.log('📄 横並び修正: 横並びコンテナを作成');
    
    // 共通の親要素を探す
    let commonParent = findCommonParent(frontSection, backSection, container);
    
    // 横並びコンテナを作成
    const horizontalContainer = document.createElement('div');
    horizontalContainer.className = 'row horizontal-license-container';
    horizontalContainer.style.cssText = 'display:flex; flex-direction:row; width:100%; margin-bottom:1rem;';
    
    // 説明テキストを探す
    const introText = findIntroductionText(commonParent);
    if (introText) {
      // 説明テキスト用コンテナ
      const introContainer = document.createElement('div');
      introContainer.className = 'col-12 mb-3 text-center';
      introContainer.appendChild(introText.cloneNode(true));
      horizontalContainer.appendChild(introContainer);
      
      // 元のテキストを非表示
      introText.style.display = 'none';
    }
    
    // 表面用カラム
    const frontCol = document.createElement('div');
    frontCol.className = 'col-md-6 col-sm-12 license-front-col';
    frontCol.style.cssText = 'padding:0.5rem;';
    
    // 裏面用カラム
    const backCol = document.createElement('div');
    backCol.className = 'col-md-6 col-sm-12 license-back-col';
    backCol.style.cssText = 'padding:0.5rem;';
    
    // 要素を移動
    frontCol.appendChild(frontSection.cloneNode(true));
    backCol.appendChild(backSection.cloneNode(true));
    
    // カラムをコンテナに追加
    horizontalContainer.appendChild(frontCol);
    horizontalContainer.appendChild(backCol);
    
    // コンテナを挿入
    commonParent.insertBefore(horizontalContainer, frontSection);
    
    // 元の要素を非表示
    frontSection.style.display = 'none';
    backSection.style.display = 'none';
    
    // イベントハンドラを修正
    fixEventHandlers(horizontalContainer, frontSection, backSection);
    
    return horizontalContainer;
  }
  
  // 2つの要素が横に並んでいるかチェック
  function isHorizontallyArranged(rect1, rect2) {
    // 横方向の重なりがなく、縦方向には重なりがある
    return (rect1.right < rect2.left || rect2.right < rect1.left) &&
           !(rect1.bottom < rect2.top || rect2.bottom < rect1.top);
  }
  
  // 共通の親要素を探す
  function findCommonParent(elem1, elem2, container) {
    if (!elem1 || !elem2) return container;
    
    let parent = elem1.parentNode;
    
    while (parent && parent !== document.body) {
      if (parent.contains(elem2)) {
        return parent;
      }
      parent = parent.parentNode;
    }
    
    return container;
  }
  
  // 説明テキストを探す
  function findIntroductionText(container) {
    if (!container) return null;
    
    // テキスト要素を取得
    const textElements = container.querySelectorAll('p, small, .text-muted, .form-text');
    
    for (const elem of textElements) {
      const text = elem.textContent.trim().toLowerCase();
      if (text.includes('両面') || 
          text.includes('表面と裏面') || 
          text.includes('アップロードしてください')) {
        return elem;
      }
    }
    
    return null;
  }
  
  // イベントハンドラを修正
  function fixEventHandlers(container, originalFront, originalBack) {
    // ファイル入力要素の処理
    const fileInputs = container.querySelectorAll('input[type="file"]');
    const originalFrontFileInput = originalFront.querySelector('input[type="file"]');
    const originalBackFileInput = originalBack.querySelector('input[type="file"]');
    
    fileInputs.forEach(input => {
      // クローンされたinputはイベントリスナーが機能しないため、
      // オリジナルの入力とリンクさせる
      const isForFront = input.closest('.license-front-col') !== null;
      const originalInput = isForFront ? originalFrontFileInput : originalBackFileInput;
      
      if (originalInput) {
        input.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // 元のファイル入力を起動
          originalInput.click();
        });
      }
    });
    
    // カメラボタンの処理
    const cameraButtons = container.querySelectorAll('button');
    cameraButtons.forEach(button => {
      const buttonText = button.textContent.trim().toLowerCase();
      if (buttonText.includes('カメラ') || buttonText.includes('撮影')) {
        // 元のボタンを探す
        let originalButton = null;
        const isForFront = button.closest('.license-front-col') !== null;
        
        if (isForFront) {
          originalButton = findButtonWithText(originalFront, buttonText);
        } else {
          originalButton = findButtonWithText(originalBack, buttonText);
        }
        
        if (originalButton) {
          button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 元のボタンをクリック
            originalButton.click();
          });
        }
      }
    });
    
    // テキストを含むボタンを探す
    function findButtonWithText(container, text) {
      if (!container) return null;
      
      const buttons = container.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.trim().toLowerCase().includes(text)) {
          return btn;
        }
      }
      
      return null;
    }
  }
})();