/**
 * エラー検出スクリプト
 * JSON構文エラーの正確な原因と場所を特定するためのツール
 */

(function() {
  console.log('=== エラー検出スクリプトを実行します ===');
  
  // 既に実行済みなら終了
  if (window.errorDetectorRun) {
    console.log('エラー検出は既に実行済みです');
    return;
  }
  
  window.errorDetectorRun = true;
  
  // エラーイベントのリスナーを設定
  window.addEventListener('error', function(event) {
    console.log('=== エラーを検出しました ===');
    console.log('エラーメッセージ: ' + event.message);
    console.log('エラー発生ファイル: ' + event.filename);
    console.log('エラー位置: 行 ' + event.lineno + ', 列 ' + event.colno);
    
    // スタックトレースがあれば表示
    if (event.error && event.error.stack) {
      console.log('スタックトレース:');
      console.log(event.error.stack);
    }
    
    // 特にJSONエラーの場合
    if (event.message.includes('token')) {
      console.log('JSONエラーを検出しました - 構文解析の問題が考えられます');
    }
  });
  
  // スクリプト読み込みエラーの検出
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    if (tagName.toLowerCase() === 'script') {
      element.addEventListener('error', function(event) {
        console.log('スクリプト読み込みエラー:', event.target.src);
      });
    }
    return element;
  };
  
  // JSONパースエラーの検出
  const originalJSONParse = JSON.parse;
  JSON.parse = function(text) {
    try {
      return originalJSONParse.call(JSON, text);
    } catch (e) {
      console.log('=== JSONパースエラー ===');
      console.log('エラーメッセージ:', e.message);
      console.log('問題のテキスト (最初の100文字):', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
      
      // エラーの位置を特定
      const match = e.message.match(/position (\d+)/);
      if (match && match[1]) {
        const position = parseInt(match[1]);
        const errorContext = text.substring(Math.max(0, position - 20), Math.min(text.length, position + 20));
        console.log('エラー位置周辺のコンテキスト:', errorContext);
      }
      
      throw e;
    }
  };
  
  // セッションストレージアクセスのモニタリング
  const originalSetItem = sessionStorage.setItem;
  sessionStorage.setItem = function(key, value) {
    try {
      console.log('セッションストレージに書き込み - キー:', key, '値の長さ:', value.length);
      return originalSetItem.call(sessionStorage, key, value);
    } catch (e) {
      console.log('セッションストレージ書き込みエラー:', e.message);
      console.log('キー:', key);
      if (value && value.length > 200) {
        console.log('値 (最初の200文字):', value.substring(0, 200) + '...');
      } else {
        console.log('値:', value);
      }
      throw e;
    }
  };
  
  console.log('エラー検出スクリプトの設定が完了しました');
})();