/**
 * URL パラメータ抽出・処理
 * シンプルモードやテスト用のパラメータを扱う
 */

(function() {
  // URLパラメータを取得する関数
  function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (let i = 0; i < pairs.length; i++) {
      if (!pairs[i]) continue;
      
      const pair = pairs[i].split('=');
      const key = decodeURIComponent(pair[0]);
      const value = pair.length > 1 ? decodeURIComponent(pair[1]) : true;
      
      // 既存の値があれば配列にする
      if (params[key]) {
        if (Array.isArray(params[key])) {
          params[key].push(value);
        } else {
          params[key] = [params[key], value];
        }
      } else {
        params[key] = value;
      }
    }
    
    return params;
  }
  
  // シンプルモードかどうかを判定
  function isSimpleMode() {
    const params = getUrlParams();
    return params.mode === 'simple' || params.simple === 'true';
  }
  
  // デバッグモードかどうかを判定
  function isDebugMode() {
    const params = getUrlParams();
    return params.debug === 'true';
  }
  
  // シンプルモードへの変更またはリロードボタンを追加
  function addModeToggleButton() {
    const isSimple = isSimpleMode();
    const buttonText = isSimple ? 'フルバージョンに切り替え' : 'シンプルモードに切り替え';
    const buttonUrl = isSimple ? '/' : '/?mode=simple';
    
    // 既存のボタンがあれば削除
    const existingButton = document.getElementById('mode-toggle-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    // ボタンを作成
    const button = document.createElement('div');
    button.id = 'mode-toggle-button';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #0d6efd;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      cursor: pointer;
      z-index: 9999;
      font-family: sans-serif;
      font-size: 14px;
    `;
    button.innerText = buttonText;
    
    // クリックイベントを追加
    button.addEventListener('click', function() {
      window.location.href = buttonUrl;
    });
    
    // ページに追加
    document.body.appendChild(button);
    
    // デバッグモードボタンも追加（オプション）
    if (isDebugMode()) {
      addDebugControls();
    }
  }
  
  // デバッグコントロールを追加（開発者向け）
  function addDebugControls() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background-color: rgba(0,0,0,0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      z-index: 10000;
      font-family: monospace;
      font-size: 12px;
      width: 300px;
      max-height: 400px;
      overflow-y: auto;
    `;
    
    // デバッグ情報を表示
    const info = document.createElement('div');
    info.innerHTML = `
      <h3>デバッグ情報</h3>
      <p>URL: ${window.location.href}</p>
      <p>シンプルモード: ${isSimpleMode() ? 'ON' : 'OFF'}</p>
      <p>ユーザーエージェント: ${navigator.userAgent}</p>
    `;
    debugPanel.appendChild(info);
    
    // アクションボタン
    const actions = document.createElement('div');
    actions.innerHTML = `
      <h3>アクション</h3>
      <button id="debug-reload">ページ再読み込み</button>
      <button id="debug-clear-cache">キャッシュクリア</button>
      <button id="debug-toggle-mode">モード切替</button>
    `;
    debugPanel.appendChild(actions);
    
    // ページに追加
    document.body.appendChild(debugPanel);
    
    // イベントリスナー設定
    document.getElementById('debug-reload').addEventListener('click', function() {
      window.location.reload();
    });
    
    document.getElementById('debug-clear-cache').addEventListener('click', function() {
      window.location.href = window.location.href + '&cache=' + new Date().getTime();
    });
    
    document.getElementById('debug-toggle-mode').addEventListener('click', function() {
      window.location.href = isSimpleMode() ? '/' : '/?mode=simple';
    });
  }
  
  // DOMContentLoaded時に実行
  function onDomReady() {
    addModeToggleButton();
    
    // ローディング表示を非表示にする特殊処理
    if (isSimpleMode()) {
      // シンプルモードではすべてのローディング要素を非表示
      const style = document.createElement('style');
      style.textContent = `
        .loading, .spinner, [role="status"], .preloader {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      
      // bodyを確実に表示
      document.body.style.display = 'block';
      document.body.style.visibility = 'visible';
    }
  }
  
  // ページロード完了時に実行
  window.addEventListener('DOMContentLoaded', onDomReady);
  
  // 既にDOMが読み込まれている場合のフォールバック
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    onDomReady();
  }
})();