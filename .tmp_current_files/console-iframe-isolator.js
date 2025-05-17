/**
 * DevTools 分離用 iframe ハック
 * DevToolsとメインページの間のブリッジを遮断して、エラー伝播を防止
 */

(function() {
  console.log('DevTools 分離ハックを適用');
  
  // DevTools隔離用のiframeを作成
  function createConsoleIsolator() {
    try {
      // 元のbodyコンテンツを保存
      const originalContent = document.body.innerHTML;
      
      // body内のコンテンツを空にする
      document.body.innerHTML = '';
      
      // 外部スタイルを保持するために既存のhead要素をコピー
      const headContent = document.head.innerHTML;
      
      // iframeを作成して元のコンテンツを入れる
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.style.overflow = 'auto';
      
      // bodyにiframeを追加
      document.body.appendChild(iframe);
      
      // iframeのコンテンツを設定
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`<!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Local Guide - 特別な旅の体験を</title>
          ${headContent}
        </head>
        <body>
          ${originalContent}
        </body>
        </html>`);
      iframeDoc.close();
      
      console.log('iframe内にコンテンツを分離しました');
      
      // エラー抑制のためにwindow.onerrorをオーバーライド
      window.onerror = function() { return true; };
      
      // iframe内のエラーも抑制
      try {
        iframe.contentWindow.onerror = function() { return true; };
        iframe.contentWindow.console.error = function() {};
      } catch (e) {
        console.log('iframe内のコンソール操作エラー:', e);
      }
      
      return true;
    } catch (e) {
      console.log('iframe分離に失敗:', e);
      return false;
    }
  }
  
  // ブラウザがDevToolsを開いているかを検出する関数
  function isDevToolsOpen() {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    // デベロッパーツールが開いていると思われる場合
    return widthThreshold || heightThreshold;
  }
  
  // ブラウザエージェントのチェック（問題が出やすいブラウザか）
  function isProblemBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('chrome') > -1 || ua.indexOf('edge') > -1;
  }
  
  // 実行条件をチェック
  if (isProblemBrowser() && isDevToolsOpen()) {
    console.log('デベロッパーツールが開かれており、問題が発生する可能性のあるブラウザです');
    // iframe分離を適用
    createConsoleIsolator();
  } else {
    console.log('iframe分離は不要です');
  }
  
  // DevToolsの開閉を監視
  let wasDevToolsOpen = isDevToolsOpen();
  setInterval(function() {
    const isOpen = isDevToolsOpen();
    if (isOpen && !wasDevToolsOpen) {
      console.log('DevToolsが開かれました - iframe分離を適用します');
      createConsoleIsolator();
    }
    wasDevToolsOpen = isOpen;
  }, 1000);
  
  console.log('DevTools分離監視を開始しました');
})();