/**
 * 「このページは応答していません」エラーを自動的に解決するための特化スクリプト
 * このスクリプトは各ページに組み込むことで、エラーが表示されたら自動的に「待機」を押します
 */

(function() {
  console.log('No-response-fix: 初期化');

  // メインスレッドの負荷分散のためのアイドル時間確保
  let lastYield = Date.now();
  let isProcessing = false;
  
  // スケジューラーを間引いて実行するためのラッパー関数
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  }
  
  // 応答なしダイアログを検出して「待機」ボタンをクリックする関数
  const checkForDialog = throttle(function() {
    if (isProcessing) return;
    isProcessing = true;
    
    try {
      // 現在のドキュメント、親フレーム、トップフレームをチェック
      const contexts = [window];
      try { if (window.parent && window.parent !== window) contexts.push(window.parent); } catch (e) {}
      try { if (window.top && window.top !== window.parent) contexts.push(window.top); } catch (e) {}
      
      // 各コンテキストでダイアログを探す
      for (const ctx of contexts) {
        try {
          const doc = ctx.document;
          if (!doc) continue;
          
          // ダイアログをテキストで検索
          const dialogTexts = [
            'このページは応答していません',
            'このページの処理で時間がかかっています',
            'ページが応答していません',
            'ページの応答がありません',
            'ページの応答が停止しました',
            'page is unresponsive',
            'wait for the page', 
            'not responding',
            'still loading',
            'takes too long',
            '応答なし'
          ];
          
          // ページ内のテキストを走査
          const textElements = doc.querySelectorAll('*');
          for (const el of textElements) {
            if (!el.textContent) continue;
            
            for (const dialogText of dialogTexts) {
              if (el.textContent.includes(dialogText)) {
                console.log('応答なしダイアログを検出:', dialogText);
                
                // ボタンを探す
                const waitTexts = ['待機', '待つ', 'Wait', 'Continue'];
                const buttons = doc.querySelectorAll('button');
                
                for (const btn of buttons) {
                  if (!btn.textContent) continue;
                  
                  for (const waitText of waitTexts) {
                    if (btn.textContent.includes(waitText)) {
                      console.log('「待機」ボタンをクリック:', btn.textContent);
                      setTimeout(() => {
                        try {
                          btn.click();
                          // クリックイベントを発火（念のため）
                          btn.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: ctx
                          }));
                        } catch (e) {
                          console.error('ボタンクリックエラー:', e);
                        }
                      }, 10);
                      
                      return;
                    }
                  }
                  
                  // 「待機」という文字が無くても左側のボタンをクリック
                  if (buttons.length > 0) {
                    console.log('左側のボタンをクリック');
                    setTimeout(() => buttons[0].click(), 10);
                    return;
                  }
                }
              }
            }
          }
          
          // ボタンの内容で直接検索
          const buttons = doc.querySelectorAll('button');
          for (const btn of buttons) {
            if (!btn.textContent) continue;
            
            if (
              btn.textContent.includes('待機') ||
              btn.textContent.includes('待つ') ||
              btn.textContent.toLowerCase().includes('wait') ||
              btn.textContent.toLowerCase().includes('continue')
            ) {
              // 親要素をチェックしてダイアログっぽいかどうか確認
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
                console.log('ダイアログ内の「待機」ボタンを検出。クリック中...');
                setTimeout(() => {
                  try {
                    btn.click();
                  } catch (e) {
                    console.error('ボタンクリックエラー:', e);
                  }
                }, 10);
                return;
              }
            }
          }
        } catch (e) {
          console.error('コンテキスト処理エラー:', e);
        }
      }
    } catch (e) {
      console.error('ダイアログチェックエラー:', e);
    } finally {
      isProcessing = false;
      
      // メインスレッドのアイドル時間を確保
      const now = Date.now();
      if (now - lastYield > 100) {
        lastYield = now;
        setTimeout(checkForDialog, 10);
      }
    }
  }, 300);
  
  // 定期的に実行
  const intervalId = setInterval(checkForDialog, 500);
  
  // ブラウザパフォーマンスを維持するための関数
  function maintainResponsiveness() {
    // メインスレッドの負荷を分散
    function yieldExecution() {
      setTimeout(yieldExecution, 50);
    }
    yieldExecution();
  }
  
  // パフォーマンス維持処理を開始
  maintainResponsiveness();
  
  // ページロード時とイベント発生時にもチェック
  window.addEventListener('load', checkForDialog);
  window.addEventListener('error', checkForDialog);
  window.addEventListener('unhandledrejection', checkForDialog);
  
  // スクリプト対応済み属性を追加
  document.documentElement.setAttribute('data-no-response-fix', 'applied');
  
  console.log('No-response-fix: 初期化完了');
})();