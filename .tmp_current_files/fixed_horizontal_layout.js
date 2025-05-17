/**
 * 横レイアウトと機能修正（エラーフリー版）
 */
(function() {
  console.log('横レイアウト修正: 初期化');
  
  // 設定
  const config = {
    // Windows連携メッセージの非表示フラグ
    hideWindowsMessages: true,
    
    // 定期的なチェック間隔（ミリ秒）
    checkInterval: 1000
  };
  
  // 初期化時と定期的に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 定期的に実行
  setInterval(init, 3000);
  
  // DOM変更の監視
  const observer = new MutationObserver(function(mutations) {
    let needsCheck = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            // モーダルが追加された場合
            if (node.classList && node.classList.contains('modal')) {
              console.log('横レイアウト修正: モーダルを検出');
              setTimeout(init, 100);
              needsCheck = true;
              break;
            }
            
            // Windows連携メッセージかチェック
            if (config.hideWindowsMessages && node.id && node.id.includes('Xiaomi')) {
              console.log('横レイアウト修正: Windowsメッセージを非表示化');
              node.style.display = 'none';
            }
          }
        }
      }
    }
    
    if (needsCheck) {
      setTimeout(initHorizontalLayout, 300);
      setTimeout(fixCameraButtons, 300);
    }
  });
  
  // document全体の変更を監視
  observer.observe(document.body, { childList: true, subtree: true });
  
  // 初期化
  function init() {
    // Windows連携メッセージを非表示
    if (config.hideWindowsMessages) {
      removeWindowsMessages();
    }
    
    // 横レイアウトを適用
    initHorizontalLayout();
    
    // カメラボタンを修正
    fixCameraButtons();
  }
  
  // Windows連携メッセージを非表示
  function removeWindowsMessages() {
    // Xiaomi系のポップアップを検索して非表示
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
  
  // 横レイアウトを初期化
  function initHorizontalLayout() {
    // 運転免許証（表裏）のコンテナを探す
    const licenseSections = findLicenseSections();
    
    licenseSections.forEach(section => {
      // すでに処理済みならスキップ
      if (section.getAttribute('data-horizontal-layout') === 'true') {
        return;
      }
      
      // 処理済みフラグを設定
      section.setAttribute('data-horizontal-layout', 'true');
      
      // 表裏のコンテナを探す
      const frontContainer = findSideContainer(section, '表面');
      const backContainer = findSideContainer(section, '裏面');
      
      if (frontContainer && backContainer) {
        console.log('横レイアウト修正: 表面・裏面コンテナを検出');
        
        // 親要素を取得
        const parent = section.parentNode;
        if (!parent) return;
        
        // 水平レイアウト用コンテナを作成
        const horizontalContainer = document.createElement('div');
        horizontalContainer.className = 'row license-horizontal-container';
        horizontalContainer.style.display = 'flex';
        horizontalContainer.style.flexDirection = 'row';
        horizontalContainer.style.alignItems = 'flex-start';
        horizontalContainer.style.justifyContent = 'center';
        horizontalContainer.style.width = '100%';
        horizontalContainer.style.marginTop = '1rem';
        horizontalContainer.style.marginBottom = '1rem';
        
        // 導入テキストを探す（「両面をアップロードしてください」など）
        const introText = findIntroText(section);
        if (introText) {
          const introContainer = document.createElement('div');
          introContainer.className = 'text-center mb-3 w-100';
          introContainer.appendChild(introText.cloneNode(true));
          horizontalContainer.appendChild(introContainer);
        }
        
        // 左側（表面）列
        const frontCol = document.createElement('div');
        frontCol.className = 'col-md-6 license-front';
        frontCol.style.padding = '0.5rem 1rem';
        
        // 右側（裏面）列
        const backCol = document.createElement('div');
        backCol.className = 'col-md-6 license-back';
        backCol.style.padding = '0.5rem 1rem';
        
        // コンテンツを移動
        frontCol.appendChild(frontContainer);
        backCol.appendChild(backContainer);
        
        // 列をコンテナに追加
        horizontalContainer.appendChild(frontCol);
        horizontalContainer.appendChild(backCol);
        
        // 元の場所に挿入
        section.insertAdjacentElement('beforebegin', horizontalContainer);
        
        // 元のセクションを非表示
        section.style.display = 'none';
        
        console.log('横レイアウト修正: 横レイアウトに変換完了');
      }
    });
  }
  
  // 運転免許証セクションを探す
  function findLicenseSections() {
    const results = [];
    
    // 1. 「運転免許証」「表面」「裏面」というテキストを含む要素を探す
    const candidates = document.querySelectorAll('.card, .card-body, .form-group, .mb-3, .mb-4, div');
    
    candidates.forEach(elem => {
      const text = elem.textContent;
      
      // 「運転免許証」に関する要素を検索
      if (
        text.includes('運転免許証') &&
        (text.includes('表面') || text.includes('裏面')) &&
        !elem.closest('[data-horizontal-layout="true"]') // すでに処理済みの親要素の中にない
      ) {
        // これまでに見つかった結果と重複していないか確認
        if (!results.some(r => r.contains(elem) || elem.contains(r))) {
          results.push(elem);
        }
      }
    });
    
    return results;
  }
  
  // 表面または裏面のコンテナを探す
  function findSideContainer(section, sideType) {
    // `.row` や `.col` などのコンテナ要素内で表面/裏面テキストを含む要素を探す
    const containers = section.querySelectorAll('.row, .col, .col-md-6, .mb-3, .form-group, div');
    
    for (const container of containers) {
      const text = container.textContent.trim();
      
      // 他の側のテキストを含まない、かつ目的の側のテキストを含む
      if (
        (sideType === '表面' && text.includes('表面') && !text.includes('裏面')) ||
        (sideType === '裏面' && text.includes('裏面') && !text.includes('表面'))
      ) {
        // 小さすぎるコンテナは除外
        if (container.offsetWidth > 100 && container.offsetHeight > 50) {
          return container;
        }
      }
    }
    
    // 2. ファイル入力とカメラボタンを含むコンテナで探す
    const fileInputs = section.querySelectorAll('input[type="file"]');
    
    for (const input of fileInputs) {
      const parentContainer = input.closest('.form-group, .mb-3, .input-group, div');
      if (parentContainer && parentContainer.textContent.includes(sideType)) {
        return parentContainer;
      }
    }
    
    // 3. 最後の手段：画像要素のコンテナから探す
    const images = section.querySelectorAll('img');
    
    for (const img of images) {
      const parentContainer = img.closest('.form-group, .mb-3, .preview-container, div');
      if (parentContainer && parentContainer.textContent.includes(sideType)) {
        return parentContainer;
      }
    }
    
    return null;
  }
  
  // 導入テキストを探す（「両面をアップロードしてください」など）
  function findIntroText(section) {
    const paragraphs = section.querySelectorAll('p, .form-text, .text-muted, small');
    
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
    const cameraButtons = document.querySelectorAll('.camera-button, button:has(.bi-camera), button.btn-primary, button.btn-outline-primary');
    
    cameraButtons.forEach(button => {
      // テキストチェック（カメラに関連するボタンかどうか）
      const buttonText = button.textContent.trim().toLowerCase();
      if (!buttonText.includes('カメラ') && !buttonText.includes('撮影')) {
        return;
      }
      
      // すでに処理済みならスキップ
      if (button.getAttribute('data-camera-fixed') === 'true') {
        return;
      }
      
      // 処理済みフラグを設定
      button.setAttribute('data-camera-fixed', 'true');
      
      console.log('横レイアウト修正: カメラボタンを処理', buttonText);
      
      // オリジナルのクリックイベントを保存
      const originalClick = button.onclick;
      
      // クリックイベントを上書き
      button.onclick = function(e) {
        e.preventDefault();
        
        console.log('横レイアウト修正: カメラボタンがクリックされました');
        
        // 関連するファイル入力を探す
        const fileInput = findRelatedFileInput(button);
        
        if (fileInput) {
          console.log('横レイアウト修正: 関連するファイル入力を検出', fileInput.id || fileInput.name);
          
          // 1. オリジナルのイベントを試行
          if (typeof originalClick === 'function') {
            try {
              console.log('横レイアウト修正: オリジナルのクリックハンドラを実行');
              originalClick.call(button, e);
              return;
            } catch (err) {
              console.error('横レイアウト修正: オリジナルのクリックハンドラでエラー', err);
            }
          }
          
          // 2. ファイル選択ダイアログを開く
          try {
            fileInput.click();
          } catch (clickErr) {
            console.error('横レイアウト修正: ファイル選択ダイアログを開く際にエラー', clickErr);
          }
        } else {
          console.error('横レイアウト修正: 関連するファイル入力が見つかりません');
          
          // オリジナルのイベントハンドラを試行
          if (typeof originalClick === 'function') {
            originalClick.call(button, e);
          }
        }
      };
    });
  }
  
  // 関連するファイル入力を探す
  function findRelatedFileInput(button) {
    // 1. 同じフォームグループ内を探す
    const formGroup = findParentElement(button, '.form-group, .mb-3, .mb-4, .input-group');
    
    if (formGroup) {
      const fileInput = formGroup.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 2. 近くの要素を探す
    let parent = button.parentNode;
    let depth = 0;
    const maxDepth = 5; // 最大探索深度
    
    while (parent && parent !== document.body && depth < maxDepth) {
      const fileInput = parent.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
      parent = parent.parentNode;
      depth++;
    }
    
    // 3. ボタンのテキストで判断
    const buttonText = button.textContent.trim().toLowerCase();
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    
    if (buttonText.includes('表面')) {
      // 表面関連のファイル入力を探す
      for (const input of allFileInputs) {
        const inputContainer = input.closest('.form-group, .mb-3, .mb-4, .input-group');
        if (inputContainer && inputContainer.textContent.toLowerCase().includes('表面')) {
          return input;
        }
      }
    } else if (buttonText.includes('裏面')) {
      // 裏面関連のファイル入力を探す
      for (const input of allFileInputs) {
        const inputContainer = input.closest('.form-group, .mb-3, .mb-4, .input-group');
        if (inputContainer && inputContainer.textContent.toLowerCase().includes('裏面')) {
          return input;
        }
      }
    }
    
    // 4. ページ内のすべてのファイル入力から1つ選択
    if (allFileInputs.length === 1) {
      return allFileInputs[0];
    }
    
    return null;
  }
  
  // 指定したセレクターに一致する親要素を探す
  function findParentElement(element, selector) {
    while (element && element !== document.body) {
      if (element.matches && element.matches(selector)) {
        return element;
      }
      element = element.parentNode;
    }
    return null;
  }
})();