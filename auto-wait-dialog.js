/**
 * 「このページは応答していません」ダイアログを自動的に処理するスクリプト
 * ダイアログが表示されたら自動的に「待機」ボタンをクリックします
 */

(function() {
  console.log('Auto-wait-dialog: 初期化');
  
  // 既に実行済みかどうかをチェック
  if (window.__autoWaitInitialized) {
    console.log('Auto-wait-dialog: 既に初期化済み');
    return;
  }
  
  window.__autoWaitInitialized = true;
  
  // 定期的に「このページは応答していません」ダイアログをチェック
  function checkForUnresponsiveDialog() {
    // 現在のドキュメント、親フレーム、トップフレームでダイアログを探す
    const contexts = [window];
    try { if (window.parent && window.parent !== window) contexts.push(window.parent); } catch (e) {}
    try { if (window.top && window.top !== window.parent) contexts.push(window.top); } catch (e) {}
    
    // 各コンテキストでダイアログを探す
    contexts.forEach(ctx => {
      try {
        findAndHandleDialogs(ctx.document);
      } catch (e) {
        // クロスオリジンエラーは無視
      }
    });
  }
  
  // ダイアログを見つけて処理
  function findAndHandleDialogs(doc) {
    if (!doc) return;
    
    // ダイアログに関連するテキスト
    const dialogTexts = [
      'このページは応答していません',
      'ページが応答していません',
      'page is unresponsive',
      'not responding',
      'wait for the page',
      'takes too long'
    ];
    
    // テキストを含む要素を検索
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      if (!el.textContent) return;
      
      for (const text of dialogTexts) {
        if (el.textContent.includes(text)) {
          handleDialog(el, doc);
          break;
        }
      }
    });
    
    // 「待機」ボタンを直接探す
    const waitTexts = ['待機', '待つ', 'Wait', 'keep waiting', 'continue'];
    const buttons = doc.querySelectorAll('button');
    
    buttons.forEach(btn => {
      if (!btn.textContent) return;
      
      for (const text of waitTexts) {
        if (btn.textContent.toLowerCase().includes(text.toLowerCase())) {
          // 親要素がダイアログっぽいか確認
          let parent = btn.parentElement;
          let depth = 0;
          let isDialog = false;
          
          while (parent && depth < 5) {
            if (
              parent.getAttribute('role') === 'dialog' ||
              parent.classList.contains('modal') ||
              parent.classList.contains('dialog') ||
              parent.classList.contains('popup') ||
              parent.style.position === 'fixed'
            ) {
              isDialog = true;
              break;
            }
            parent = parent.parentElement;
            depth++;
          }
          
          if (isDialog) {
            console.log('Auto-wait-dialog: ダイアログ内の「待機」ボタンを発見');
            simulateWaitButtonClick(btn);
          }
        }
      }
    });
  }
  
  // ダイアログを処理
  function handleDialog(element, doc) {
    // ダイアログから「待機」ボタンを探す
    const waitTexts = ['待機', '待つ', 'Wait', 'keep waiting', 'continue'];
    let waitButton = null;
    
    // 要素の親をたどる
    let parent = element;
    let depth = 0;
    const MAX_DEPTH = 10;
    
    while (parent && depth < MAX_DEPTH) {
      // ボタンを探す
      const buttons = parent.querySelectorAll('button');
      
      for (const btn of buttons) {
        if (!btn.textContent) continue;
        
        for (const text of waitTexts) {
          if (btn.textContent.toLowerCase().includes(text.toLowerCase())) {
            waitButton = btn;
            break;
          }
        }
        
        if (waitButton) break;
      }
      
      if (waitButton) break;
      
      // 親要素に移動
      parent = parent.parentElement;
      depth++;
    }
    
    // 「待機」ボタンが見つかったらクリック
    if (waitButton) {
      console.log('Auto-wait-dialog: 「待機」ボタンを発見');
      simulateWaitButtonClick(waitButton);
    } else {
      // 見つからない場合は、ドキュメント全体から探す
      const allButtons = doc.querySelectorAll('button');
      
      for (const btn of allButtons) {
        if (!btn.textContent) continue;
        
        for (const text of waitTexts) {
          if (btn.textContent.toLowerCase().includes(text.toLowerCase())) {
            console.log('Auto-wait-dialog: ドキュメント内で「待機」ボタンを発見');
            simulateWaitButtonClick(btn);
            return;
          }
        }
      }
      
      // ボタンが1つでもあれば左側のボタンをクリック
      if (allButtons.length > 0) {
        console.log('Auto-wait-dialog: 左側のボタンをクリック');
        simulateWaitButtonClick(allButtons[0]);
      }
    }
  }
  
  // ボタンクリックのシミュレーション
  function simulateWaitButtonClick(button) {
    try {
      console.log('Auto-wait-dialog: ボタンをクリック:', button.textContent);
      
      // 通常のクリック
      button.click();
      
      // イベントディスパッチによるクリック（念のため）
      try {
        button.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
      } catch (e) {}
      
      // setTimeout でも試す（ブラウザの処理順序の違いに対応）
      setTimeout(() => {
        try {
          button.click();
        } catch (e) {}
      }, 10);
    } catch (e) {
      console.error('Auto-wait-dialog: ボタンクリックエラー:', e);
    }
  }
  
  // ブラウザのメインスレッドの負荷を分散するための関数
  function maintainPageResponsiveness() {
    // 短いタイムアウトで実行を分割する
    function yieldExecution() {
      setTimeout(yieldExecution, 50);
    }
    
    // 実行を開始
    yieldExecution();
  }
  
  // 定期的にダイアログをチェック
  setInterval(checkForUnresponsiveDialog, 300);
  
  // ページの応答性を維持
  maintainPageResponsiveness();
  
  // 初期ロード時にもチェック
  window.addEventListener('load', checkForUnresponsiveDialog);
  
  // エラー発生時にもチェック
  window.addEventListener('error', checkForUnresponsiveDialog);
  window.addEventListener('unhandledrejection', checkForUnresponsiveDialog);
  
  console.log('Auto-wait-dialog: 初期化完了');
})();