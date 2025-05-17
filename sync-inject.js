/**
 * 同期的インジェクトスクリプト V2
 * DOMを直接操作して「このページは応答していません」ダイアログを検出し、即座に処理します
 * エラー対策強化版
 */

(function() {
  console.log('Sync-inject V2: 初期化');
  
  // 既に実行中かチェック (以前のバージョンも含む)
  if (window.__syncInjectInitialized || window.__syncInjectV2Initialized) {
    console.log('Sync-inject V2: 既に初期化済み');
    return;
  }
  
  window.__syncInjectV2Initialized = true;
  
  // パフォーマンス最適化のため変数をキャッシュ
  let lastScanTime = 0;
  const SCAN_INTERVAL = 50; // より短い間隔で検出 (50ミリ秒)
  let forceClickTimeout = null;
  let forceClickCount = 0;
  let consecutiveErrors = 0;
  const MAX_CONSECUTIVE_ERRORS = 10; // 最大連続エラー数
  
  // 核心的な最終対策: ダイアログ出現直後からの自動クリック機能
  // このコードはページロード直後から実行されるため、最優先で処理
  try {
    // イベントリスナー追加前のチェック
    if (typeof window.navigator !== 'undefined') {
      if (!window.__emergencyClickerAttached) {
        window.__emergencyClickerAttached = true;
        console.log('Sync-inject V2: 緊急クリッカーアタッチ');
        
        // ページのすべてのクリックイベントを監視し、ダイアログがある場合は自動クリック
        document.addEventListener('click', function() {
          // クリックイベント発生時に短遅延でボタンチェック
          setTimeout(emergencyButtonCheck, 10);
        }, true);
        
        // ダイアログが表示されたかもしれないタイミングでボタンをチェック
        ['mousedown', 'keydown', 'focus', 'blur', 'error'].forEach(eventType => {
          window.addEventListener(eventType, function() {
            setTimeout(emergencyButtonCheck, 50);
          }, true);
        });
        
        // 定期的に緊急チェック (50ms間隔)
        setInterval(emergencyButtonCheck, 50);
      }
    }
  } catch (e) {
    console.error('Sync-inject V2: 緊急クリッカー初期化エラー', e);
  }
  
  // 緊急ボタンチェック (最も軽量な実装)
  function emergencyButtonCheck() {
    try {
      // 直接すべてのボタンをチェック (他のチェックより高速)
      const allButtons = document.querySelectorAll('button');
      for (let i = 0; i < allButtons.length; i++) {
        const btn = allButtons[i];
        const text = btn && btn.textContent ? btn.textContent.toLowerCase() : '';
        if (text.includes('待機') || text.includes('wait')) {
          console.log('Sync-inject V2: 緊急クリッカーが「待機」ボタンを検出');
          setTimeout(() => {
            try { btn.click(); } catch (e) {}
          }, 10);
          break;
        }
      }
    } catch (e) {
      // エラーは無視
    }
  }

  // MutationObserver を使ってDOM変更を監視
  const observerOptions = {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  };
  
  // 「待機」ボタンに関連するテキスト
  const waitButtonTexts = ['待機', '待つ', 'Wait', 'wait', 'Continue', 'continue', 'このまま', '続行'];
  
  // ダイアログに関連するテキスト
  const dialogTexts = [
    'このページは応答していません',
    'このページの処理で時間がかかっています',
    'ページは応答していません',
    'ページが応答していません',
    'page is unresponsive',
    'not responding',
    'wait for the page', 
    'takes too long',
  ];
  
  // DOM走査を最適化するためのセレクタ
  const buttonSelector = 'button, [role="button"], .button, [type="button"]';
  const dialogSelector = '[role="dialog"], .modal, .dialog, [aria-modal="true"]';
  
  // 定期実行タイマーを設定
  const intervalId = setInterval(scanForDialog, SCAN_INTERVAL);
  
  // 親ウィンドウでも実行を試みる
  tryRunInParent();
  
  // 定期的なスキャン関数
  function scanForDialog() {
    // パフォーマンス最適化: あまりにも頻繁にスキャンしない
    const now = Date.now();
    if (now - lastScanTime < SCAN_INTERVAL) return;
    lastScanTime = now;
    
    try {
      // 方法1: ボタンから探索 (最も効率的)
      const buttons = document.querySelectorAll(buttonSelector);
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const text = button.textContent || '';
        
        // 「待機」ボタンを見つけたか確認
        if (containsAny(text, waitButtonTexts)) {
          // 親要素をチェックしてダイアログ内かどうか確認
          if (isInDialog(button)) {
            console.log('Sync-inject: 「待機」ボタンを発見', text);
            handleWaitButton(button);
            return;
          }
        }
      }
      
      // 方法2: ダイアログ要素から探索
      const dialogs = document.querySelectorAll(dialogSelector);
      for (let i = 0; i < dialogs.length; i++) {
        const dialog = dialogs[i];
        const text = dialog.textContent || '';
        
        // ダイアログテキストを含むか確認
        if (containsAny(text, dialogTexts)) {
          console.log('Sync-inject: ダイアログを発見', text.substring(0, 50) + '...');
          handleDialog(dialog);
          return;
        }
      }
      
      // 方法3: テキストベースの探索 (より広範囲だが負荷が高い)
      scanForDialogByText();
    } catch (e) {
      console.error('Sync-inject: スキャンエラー', e);
    }
  }
  
  // テキストベースでダイアログを検索
  function scanForDialogByText() {
    // すべての可視要素をスキャン
    const elements = document.body.querySelectorAll('div, p, span, h1, h2, h3, h4, h5, h6');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (!isVisible(element)) continue;
      
      const text = element.textContent || '';
      if (text.length < 5) continue; // 短すぎるテキストはスキップ
      
      // ダイアログテキストを含むか確認
      if (containsAny(text, dialogTexts)) {
        console.log('Sync-inject: テキストからダイアログを発見', text);
        // 要素からダイアログ全体を見つける
        const dialog = findDialogFromElement(element);
        if (dialog) {
          handleDialog(dialog);
          return;
        }
        
        // ダイアログ要素が見つからない場合、要素の周辺でボタンを探す
        searchButtonsNearElement(element);
        return;
      }
    }
  }
  
  // 要素がダイアログ内かどうかをチェック
  function isInDialog(element) {
    let current = element;
    let depth = 0;
    const MAX_DEPTH = 10;
    
    while (current && depth < MAX_DEPTH) {
      if (
        current.getAttribute('role') === 'dialog' ||
        current.classList.contains('modal') ||
        current.classList.contains('dialog') ||
        current.getAttribute('aria-modal') === 'true' ||
        current.style.position === 'fixed' ||
        current.style.zIndex > 1000
      ) {
        return true;
      }
      current = current.parentElement;
      depth++;
    }
    
    return false;
  }
  
  // 要素の周辺でボタンを探す
  function searchButtonsNearElement(element) {
    // 要素自体とその親で「待機」ボタンを探す
    let current = element;
    let depth = 0;
    const MAX_DEPTH = 10;
    
    while (current && depth < MAX_DEPTH) {
      const buttons = current.querySelectorAll(buttonSelector);
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const text = button.textContent || '';
        
        if (containsAny(text, waitButtonTexts)) {
          console.log('Sync-inject: 要素周辺でボタンを発見', text);
          handleWaitButton(button);
          return true;
        }
      }
      
      // 親要素に移動
      current = current.parentElement;
      depth++;
    }
    
    // ボタンが見つからない場合は強制的に探索を続行
    forceSearchForWaitButton();
    return false;
  }
  
  // 要素から親のダイアログを見つける
  function findDialogFromElement(element) {
    let current = element;
    let depth = 0;
    const MAX_DEPTH = 10;
    
    while (current && depth < MAX_DEPTH) {
      if (
        current.getAttribute('role') === 'dialog' ||
        current.classList.contains('modal') ||
        current.classList.contains('dialog') ||
        current.getAttribute('aria-modal') === 'true' ||
        (current.style && current.style.position === 'fixed')
      ) {
        return current;
      }
      current = current.parentElement;
      depth++;
    }
    
    return null;
  }
  
  // ダイアログを処理
  function handleDialog(dialog) {
    // ダイアログ内で「待機」ボタンを探す
    const buttons = dialog.querySelectorAll(buttonSelector);
    let waitButton = null;
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = button.textContent || '';
      
      if (containsAny(text, waitButtonTexts)) {
        waitButton = button;
        break;
      }
    }
    
    if (waitButton) {
      handleWaitButton(waitButton);
    } else if (buttons.length > 0) {
      // 「待機」ボタンが見つからない場合、左側のボタンをクリック
      console.log('Sync-inject: 「待機」ボタンが見つからないため左側のボタンをクリック');
      handleWaitButton(buttons[0]);
    } else {
      // どのボタンも見つからない場合は強制探索
      forceSearchForWaitButton();
    }
  }
  
  // 「待機」ボタンをクリック
  function handleWaitButton(button) {
    if (!button || !isVisible(button)) return;
    
    try {
      console.log('Sync-inject: 「待機」ボタンをクリック', button.textContent);
      
      // 通常のクリック
      button.click();
      
      // イベントディスパッチによるクリック
      try {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        button.dispatchEvent(clickEvent);
      } catch (e) {}
      
      // setTimeout でもクリック (ブラウザの処理順序の違いに対応)
      setTimeout(() => {
        try {
          button.click();
        } catch (e) {}
      }, 0);
      
      // 連続クリックを一時停止
      if (forceClickTimeout) {
        clearTimeout(forceClickTimeout);
        forceClickTimeout = null;
      }
    } catch (e) {
      console.error('Sync-inject: ボタンクリックエラー', e);
    }
  }
  
  // ボタンが見つからない場合、ページ内のすべてのボタンを強制探索
  function forceSearchForWaitButton() {
    if (forceClickCount > 5) return; // 最大試行回数を制限
    
    console.log('Sync-inject: 強制探索を開始');
    forceClickCount++;
    
    const allButtons = document.querySelectorAll('button');
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const text = button.textContent || '';
      
      if (containsAny(text, waitButtonTexts)) {
        console.log('Sync-inject: 強制探索で「待機」ボタンを発見', text);
        handleWaitButton(button);
        return;
      }
    }
    
    // それでも見つからない場合、ボタンを定期的に探し続ける
    if (!forceClickTimeout) {
      forceClickTimeout = setTimeout(() => {
        forceClickTimeout = null;
        scanForDialog();
      }, 500);
    }
  }
  
  // 要素が表示されているかどうかをチェック
  function isVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 &&
           element.offsetHeight > 0;
  }
  
  // 文字列の配列のいずれかを含むかどうかをチェック
  function containsAny(text, searchTexts) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    
    for (let i = 0; i < searchTexts.length; i++) {
      if (lowerText.includes(searchTexts[i].toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }
  
  // 親ウィンドウでもスクリプトを実行
  function tryRunInParent() {
    try {
      if (window.parent && window.parent !== window) {
        // 親ウィンドウのdocument
        const parentDoc = window.parent.document;
        
        // 親ウィンドウにすでに実行済みか確認
        if (!window.parent.__syncInjectInitialized) {
          // スクリプトの内容を文字列として取得
          const scriptContent = `(${arguments.callee.toString()})();`;
          
          // 親ウィンドウにスクリプトを注入
          const script = parentDoc.createElement('script');
          script.textContent = scriptContent;
          parentDoc.head.appendChild(script);
          
          console.log('Sync-inject: 親ウィンドウにスクリプトを注入しました');
        }
      }
    } catch (e) {
      // クロスオリジンエラーは無視
      console.log('Sync-inject: 親ウィンドウへの注入をスキップ (クロスオリジン)');
    }
  }
  
  // 緊急時用の最終手段の関数: DOM API全体をリダイレクト
  try {
    // ただしshadow DOMを使ったダイアログや特殊なモーダルを対策
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      // 生成されたダイアログやモーダル関連要素にフックを追加
      if (tagName && typeof tagName === 'string') {
        const tag = tagName.toLowerCase();
        if (tag === 'dialog' || tag === 'div' || tag === 'span') {
          // 少し遅延してチェック
          setTimeout(() => {
            try {
              if (element.getAttribute('role') === 'dialog' || 
                  element.style && (element.style.position === 'fixed' || 
                  element.style.zIndex > 1000)) {
                // モーダル要素が生成された可能性が高いのでチェック
                emergencyButtonCheck();
              }
            } catch (e) {}
          }, 50);
        }
      }
      
      return element;
    };
    console.log('Sync-inject V2: DOM拡張機能を有効化');
  } catch (e) {
    console.error('Sync-inject V2: DOM拡張エラー', e);
  }

  // 最終手段: リソースロードエラー時のレスキュー
  window.addEventListener('error', function(e) {
    if (e && e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT')) {
      console.log('Sync-inject V2: リソースロードエラーを検出、エラーダイアログを確認');
      emergencyButtonCheck();
    }
  }, true);

  // イベントリスナーを設定
  window.addEventListener('error', scanForDialog);
  window.addEventListener('unhandledrejection', scanForDialog);
  document.addEventListener('visibilitychange', scanForDialog);
  
  // セットアップが完了したら、直ちに初期チェックを実行
  setTimeout(function() {
    emergencyButtonCheck();
    scanForDialog();
  }, 100);
  
  // MutationObserverを設定 (3種類の方法で実装)
  try {
    const observer = new MutationObserver(function(mutations) {
      // ミューテーションがあるたびに緊急チェック実行
      emergencyButtonCheck();
      // 通常のスキャンも実行
      scanForDialog();
    });
    
    // DOM全体を監視
    if (document.documentElement) {
      observer.observe(document.documentElement, observerOptions);
    } else if (document.body) {
      observer.observe(document.body, observerOptions);
    } else {
      // DOCTYPEでなく実際のHTMLノードを取得
      const htmlNode = document.childNodes[document.childNodes.length - 1];
      if (htmlNode) {
        observer.observe(htmlNode, observerOptions);
      }
    }
    console.log('Sync-inject V2: MutationObserver設定完了');
  } catch (e) {
    console.error('Sync-inject V2: MutationObserver設定エラー', e);
    
    // 代替手段: setIntervalで頻繁にチェック
    setInterval(emergencyButtonCheck, 30);
    setInterval(scanForDialog, 100);
  }
  
  // iframeにも同じスクリプトを埋め込む (特にReplit関連のiframe)
  try {
    setTimeout(function() {
      const frames = document.querySelectorAll('iframe');
      frames.forEach(function(frame) {
        try {
          if (frame.contentDocument) {
            const script = frame.contentDocument.createElement('script');
            script.textContent = `(${arguments.callee.toString()})();`;
            frame.contentDocument.head.appendChild(script);
            console.log('Sync-inject V2: iframeにスクリプトを注入しました');
          }
        } catch (e) {
          // クロスオリジンエラーは無視
        }
      });
    }, 1000);
  } catch (e) {
    console.error('Sync-inject V2: iframe注入エラー', e);
  }
  
  console.log('Sync-inject V2: 初期化完了');
})();