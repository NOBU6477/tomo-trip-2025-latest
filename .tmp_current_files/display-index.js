/**
 * メインページコンテンツの強制表示スクリプト
 * Replitプレビューでのローディング問題を解決
 */

// ExpressベースのWebサーバー
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

// ベーシックなHTMLを返す関数
function generateBasicHtml() {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Local Guide - 特別な旅の体験を (シンプルモード)</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      border-radius: 10px;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    h1 {
      color: #0066cc;
      margin-bottom: 1rem;
      text-align: center;
    }
    p {
      margin-bottom: 1.5rem;
    }
    .btn-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin: 2rem 0;
    }
    .btn {
      display: inline-block;
      background-color: #0066cc;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: 500;
    }
    .btn-secondary {
      background-color: #6c757d;
    }
    .links {
      margin-top: 2rem;
      text-align: center;
    }
    .links a {
      color: #0066cc;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Local Guide</h1>
    <p>特別な旅の体験を、地元のガイドと一緒に</p>
    
    <div class="btn-container">
      <a href="/" class="btn">通常モードを表示</a>
      <a href="/direct" class="btn btn-secondary">直接表示ページ</a>
      <a href="/emergency" class="btn btn-secondary">緊急スタンドアロンページ</a>
    </div>
    
    <div class="links">
      <a href="/direct">新しいタブで開く</a>
      <a href="/auto-wait">自動待機モード</a>
      <a href="/?debug=true">デバッグモード</a>
    </div>
  </div>
</body>
</html>
  `;
}

// 静的ファイルを提供
app.use(express.static(path.join(__dirname)));

// 直接表示ページ
app.get('/direct', (req, res) => {
  console.log('直接表示ページへのアクセス');
  try {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'force-direct-open.html'), 'utf8');
    res.status(200).send(htmlContent);
  } catch (err) {
    console.log('直接表示ページの読み込みに失敗:', err);
    res.status(500).send('内部エラーが発生しました');
  }
});

// スタンドアロン緊急ページ - 最後の手段
app.get('/emergency', (req, res) => {
  console.log('緊急スタンドアロンページへのアクセス');
  try {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'emergency-standalone.html'), 'utf8');
    res.status(200).send(htmlContent);
  } catch (err) {
    console.log('緊急スタンドアロンページの読み込みに失敗:', err);
    res.status(500).send('緊急ページの読み込みに失敗しました');
  }
});

// 直接アクセスページ - 特殊なローディング対策ページ
app.get('/direct-access', (req, res) => {
  console.log('直接アクセスページへのアクセス');
  try {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'direct-access.html'), 'utf8');
    res.status(200).send(htmlContent);
  } catch (err) {
    console.log('直接アクセスページの読み込みに失敗:', err);
    res.status(500).send('直接アクセスページの読み込みに失敗しました');
  }
});

// 応答なしエラーの自動クリック対策ページ
app.get('/auto-wait', (req, res) => {
  console.log('自動待機ページへのアクセス');
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>自動待機モード - Local Guide</title>
  <style>
    body {
      font-family: sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background: #f8f9fa;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #0066cc;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background: #0066cc;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 10px 5px;
    }
  </style>
  
  <!-- 応答なしエラーの自動対策スクリプト -->
  <script>
    // このページでエラーが出たら自動的に「待機」ボタンをクリックする
    function createAutoWaitClicker() {
      // 定期的にダイアログをチェック
      setInterval(() => {
        try {
          // ダイアログのテキストパターン
          const patternList = [
            'このページは応答していません',
            'ページは応答していません',
            'not responding',
            'wait for the page'
          ];
          
          // ダイアログ内のボタンを探す
          const buttons = document.querySelectorAll('button');
          buttons.forEach(button => {
            if (!button.textContent) return;
            
            // 「待機」「Wait」ボタンを検出
            if (button.textContent.includes('待機') || 
                button.textContent.includes('Wait') || 
                button.textContent.includes('待つ')) {
              console.log('「待機」ボタンを自動クリックします');
              setTimeout(() => button.click(), 10);
            }
          });
          
          // 親フレームをチェック
          if (window.parent && window.parent !== window) {
            try {
              const parentButtons = window.parent.document.querySelectorAll('button');
              parentButtons.forEach(button => {
                if (!button.textContent) return;
                if (button.textContent.includes('待機') || 
                    button.textContent.includes('Wait')) {
                  console.log('親フレームの「待機」ボタンを自動クリックします');
                  setTimeout(() => button.click(), 10);
                }
              });
            } catch (e) {
              // クロスオリジンエラーは無視
            }
          }
        } catch (e) {
          console.error('自動待機処理エラー:', e);
        }
      }, 500);
    }
    
    // 自動待機クリッカーを起動
    createAutoWaitClicker();
  </script>
</head>
<body>
  <div class="container">
    <h1>自動待機モード</h1>
    <p>このページでは「このページは応答していません」というエラーが表示された場合に「待機」ボタンを自動的にクリックします。</p>
    <p>メインページに問題なくアクセスできるようになったら、以下のボタンをクリックしてください。</p>
    
    <div>
      <a href="/" class="btn">メインページへ</a>
      <a href="/?mode=simple" class="btn">シンプルモードへ</a>
    </div>
  </div>
</body>
</html>
  `;
  res.status(200).send(html);
});

// ルートパスへのアクセス時の処理
app.get('/', (req, res) => {
  console.log('ルートページへのアクセスを検出');
  
  // スピナーキラースクリプトを読み込む
  let spinKillerScript = '';
  try {
    spinKillerScript = fs.readFileSync(path.join(__dirname, 'replit-spin-killer.js'), 'utf8');
    console.log('スピナーキラースクリプトを読み込みました');
  } catch (err) {
    console.log('スピナーキラースクリプトの読み込みに失敗:', err);
  }

  // 自動待機スクリプトを読み込む
  let autoWaitScript = '';
  try {
    autoWaitScript = fs.readFileSync(path.join(__dirname, 'auto-wait-dialog.js'), 'utf8');
  } catch (err) {
    console.log('自動待機スクリプトの読み込みに失敗:', err);
  }

  // Replitのプレビューフレームを検出して新しいタブで開くスクリプト
  const frameDetectScript = `
    <script>
      // Replitのプレビューフレーム内での表示を検出
      (function() {
        try {
          // フレーム内かどうかを確認
          const isInFrame = window !== window.top;
          
          // URLパラメータをチェック（直接開いた場合はリダイレクトしない）
          const urlParams = new URLSearchParams(window.location.search);
          if (isInFrame && !urlParams.has('direct_tab') && !urlParams.has('no_redirect')) {
            console.log('Replitのプレビューフレーム内を検出、新しいタブで開きます');
            
            // 新しいタブで同じURLを開く（direct_tabパラメータ付き）
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.append('direct_tab', 'true');
            
            window.open(currentUrl.toString(), '_blank');
          }
        } catch (e) {
          console.error('フレーム検出エラー:', e);
        }
      })();
    </script>
  `;
  
  // Replit側のSpinnerが表示されていないかを確認するためのテスト拡張モード
  if (req.query.debug === 'true') {
    console.log('デバッグモードを表示');
    const debugHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Replit Spinner Debug</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f0f0f0; padding: 20px; line-height: 1.5; }
    .panel { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .buttons { margin: 20px 0; display: flex; flex-wrap: wrap; gap: 10px; }
    button { padding: 10px 16px; cursor: pointer; border-radius: 4px; border: none; font-weight: 500; }
    .btn-primary { background: #0d6efd; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-success { background: #198754; color: white; }
    .btn-warning { background: #ffc107; color: #212529; }
    pre { background: #eee; padding: 10px; overflow-x: auto; border-radius: 4px; }
    h1 { margin-top: 0; color: #444; }
    h2 { margin-top: 20px; padding-bottom: 5px; border-bottom: 1px solid #ddd; }
    .section { margin-top: 30px; }
    .direct-links { margin-top: 30px; padding: 15px; border-radius: 6px; background: #f8f9fa; border: 1px solid #ddd; }
    code { font-family: monospace; background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="panel">
    <h1>Replit 読み込み問題解決ツール</h1>
    <p>このツールは「Loading your page...」問題を解決するためのものです。以下のオプションから選択してください。</p>
    
    <div class="buttons">
      <button class="btn-primary" onclick="openInNewTab('${req.protocol}://${req.get('host')}')">新しいタブで開く</button>
      <button class="btn-secondary" onclick="window.location.href='/?mode=simple'">シンプルモードを表示</button>
      <button class="btn-warning" onclick="inspectParentFrame()">親フレーム解析</button>
      <button class="btn-secondary" onclick="refreshPage()">ページ再読み込み</button>
    </div>
    
    <div class="direct-links">
      <h3>直接リンク（問題が解決しない場合は以下のURLを新しいタブで開いてください）</h3>
      <p><strong>通常モード:</strong> <a href="${req.protocol}://${req.get('host')}" target="_blank">${req.protocol}://${req.get('host')}</a></p>
      <p><strong>シンプルモード:</strong> <a href="${req.protocol}://${req.get('host')}/?mode=simple" target="_blank">${req.protocol}://${req.get('host')}/?mode=simple</a></p>
      <p><strong>緊急モード:</strong> <a href="${req.protocol}://${req.get('host')}/emergency" target="_blank">${req.protocol}://${req.get('host')}/emergency</a></p>
    </div>
    
    <div class="direct-fix">
      <h3>直接的な修正を適用</h3>
      <button class="btn-success" onclick="applyDirectFix()">Loading your page タブを強制的に修正</button>
      <p><small>※このボタンを押すと、親フレームの「Loading your page」タブを直接非表示にします。</small></p>
    </div>
    
    <div class="section">
      <h2>システム情報</h2>
      <p><strong>現在のURL:</strong></p>
      <pre id="current-url">${req.protocol}://${req.get('host')}${req.originalUrl}</pre>
      
      <p><strong>User Agent:</strong></p>
      <pre id="user-agent">${req.get('User-Agent') || ''}</pre>
      
      <div id="result" style="margin-top: 20px;"></div>
    </div>
  </div>
  
  <script>
    // 新しいタブでURLを開く
    function openInNewTab(url) {
      window.open(url, '_blank');
    }
    
    // 親フレームを解析
    function inspectParentFrame() {
      const result = document.getElementById('result');
      result.innerHTML = '<h2>親フレーム解析結果</h2>';
      
      try {
        if (window.parent && window.parent.document) {
          // すべての要素をループしてLoading your pageを含む要素を強制的に削除
          const allElements = window.parent.document.querySelectorAll('*');
          
          allElements.forEach(el => {
            try {
              if (el.textContent && el.textContent.includes('Loading your page')) {
                // 直接非表示
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                
                // 親要素も非表示
                let parent = el.parentElement;
                for (let i = 0; i < 5 && parent; i++) {
                  parent.style.display = 'none';
                  parent = parent.parentElement;
                }
              }
              
              // role="status"の要素も非表示
              if (el.getAttribute && el.getAttribute('role') === 'status') {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
              }
            } catch (err) {
              // 個別要素の処理エラーは無視
            }
          });
        } else {
          result.innerHTML += '<p>親フレームにアクセスできません。</p>';
        }
      } catch (e) {
        result.innerHTML += '<p>エラー: ' + e.message + '</p>';
      }
    }
    
    // 親フレームのLoading your pageタブを強制的に非表示にする
    function applyDirectFix() {
      try {
        // 親ドキュメントにスタイルを追加
        try {
          const styleEl = document.createElement('style');
          styleEl.textContent = 
            '.loading, .spinner, [role="status"], .loading-indicator {' +
            'display: none !important; visibility: hidden !important; opacity: 0 !important; }' +
            'body { display: block !important; visibility: visible !important; }' +
            '.preloader, #loading, .loading-screen { display: none !important; }';
          document.head.appendChild(styleEl);
          
          if (window.parent && window.parent.document) {
            window.parent.document.head.appendChild(styleEl.cloneNode(true));
          }
        } catch (styleErr) {
          console.log('スタイル適用エラー:', styleErr);
        }
        
        document.getElementById('result').innerHTML = '<h3>修正を適用しました</h3><p>状況が改善されない場合は<a href="/emergency" target="_blank">緊急スタンドアロンページ</a>にアクセスしてください。</p>';
      } catch (e) {
        document.getElementById('result').innerHTML = '<p>エラー: ' + e.message + '</p>';
      }
    }
    
    // ページを再読み込み
    function refreshPage() {
      window.location.reload();
    }
  </script>
</body>
</html>
    `;
    
    return res.send(debugHtml);
  }
  
  // シンプルモードの場合はミニマルなHTMLを返す
  if (req.query.mode === 'simple' || req.query.simple === 'true') {
    console.log('シンプルモードを表示');
    
    // 追加のスクリプトを読み込む
    let directLoadFixScript = '';
    try {
      directLoadFixScript = fs.readFileSync(path.join(__dirname, 'direct-load-fix.js'), 'utf8');
    } catch (err) {
      console.log('直接ロード修正スクリプトの読み込みに失敗:', err);
    }
    
    let noResponseFixScript = '';
    try {
      noResponseFixScript = fs.readFileSync(path.join(__dirname, 'no-response-fix.js'), 'utf8');
    } catch (err) {
      console.log('応答なしエラー修正スクリプトの読み込みに失敗:', err);
    }
    
    let syncInjectScript = '';
    try {
      syncInjectScript = fs.readFileSync(path.join(__dirname, 'sync-inject.js'), 'utf8');
    } catch (err) {
      console.log('同期インジェクトスクリプトの読み込みに失敗:', err);
    }
    
    let crashRecoveryScript = '';
    try {
      crashRecoveryScript = fs.readFileSync(path.join(__dirname, 'crash-recovery.js'), 'utf8');
    } catch (err) {
      console.log('クラッシュリカバリースクリプトの読み込みに失敗:', err);
    }
    
    // スピナーキラーとフレーム検出スクリプトを追加
    const enhancedSimpleHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Local Guide - 特別な旅の体験を (シンプルモード)</title>
  
  ${frameDetectScript}
  
  <script>
    ${spinKillerScript}
  </script>
  
  <script>
    ${autoWaitScript}
  </script>
  
  <script>
    ${directLoadFixScript}
  </script>
  
  <script>
    ${noResponseFixScript}
  </script>
  
  <script>
    ${syncInjectScript}
  </script>
  
  <script>
    ${crashRecoveryScript}
  </script>
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      border-radius: 10px;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    h1 {
      color: #0066cc;
      margin-bottom: 1rem;
      text-align: center;
    }
    p {
      margin-bottom: 1.5rem;
    }
    .btn-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin: 2rem 0;
    }
    .btn {
      display: inline-block;
      background-color: #0066cc;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: 500;
    }
    .btn-secondary {
      background-color: #6c757d;
    }
    .info-box {
      background-color: #e9f2fd;
      border-radius: 5px;
      padding: 15px;
      margin-top: 2rem;
    }
    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 1rem;
      border-left: 4px solid #c62828;
    }
    .links {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
    }
    .links a {
      color: #0066cc;
      text-decoration: none;
      margin-right: 1rem;
    }
    .links a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Local Guide</h1>
    <p>特別な旅の体験を、地元のガイドと一緒に</p>
    
    <div class="btn-container">
      <a href="/" class="btn">通常モードを表示</a>
      <a href="/direct" class="btn btn-secondary">直接表示ページを開く</a>
      <a href="/emergency" class="btn btn-secondary">緊急モードを表示</a>
    </div>
    
    <div class="info-box">
      <h3>シンプル表示モードについて</h3>
      <p>このページは、Replitプレビュー環境での表示問題を回避するために、最小限の機能だけを提供するシンプルなビューです。</p>
      <p>もし「このページは応答していません」というエラーが表示される場合は、「待機」ボタンを押すか、このページの<a href="/auto-wait">自動待機版</a>をお試しください。</p>
    </div>
    
    <div class="links">
      <a href="/direct">新しいタブで開く</a>
      <a href="/auto-wait">自動待機モード</a>
      <a href="/emergency">緊急スタンドアロンページ</a>
      <a href="/?debug=true">デバッグモード</a>
    </div>
  </div>
  
  <!-- 応答なしダイアログの自動クリック機能 -->
  <script>
    // このページでエラーが出たら自動的に「待機」ボタンをクリックする
    function createAutoWaitClicker() {
      // 定期的にダイアログをチェック
      setInterval(() => {
        try {
          // ダイアログのテキストパターン
          const patternList = [
            'このページは応答していません',
            'ページは応答していません',
            'not responding',
            'wait for the page'
          ];
          
          // ダイアログ内のボタンを探す
          const buttons = document.querySelectorAll('button');
          buttons.forEach(button => {
            if (!button.textContent) return;
            
            // 「待機」「Wait」ボタンを検出
            if (button.textContent.includes('待機') || 
                button.textContent.includes('Wait') || 
                button.textContent.includes('待つ')) {
              console.log('「待機」ボタンを自動クリックします');
              setTimeout(() => button.click(), 10);
            }
          });
          
          // 親フレームをチェック
          if (window.parent && window.parent !== window) {
            try {
              const parentButtons = window.parent.document.querySelectorAll('button');
              parentButtons.forEach(button => {
                if (!button.textContent) return;
                if (button.textContent.includes('待機') || 
                    button.textContent.includes('Wait')) {
                  console.log('親フレームの「待機」ボタンを自動クリックします');
                  setTimeout(() => button.click(), 10);
                }
              });
            } catch (e) {
              // クロスオリジンエラーは無視
            }
          }
        } catch (e) {
          console.error('自動待機処理エラー:', e);
        }
      }, 500);
    }
    
    // 自動待機クリッカーを起動
    createAutoWaitClicker();
  </script>
</body>
</html>
    `;
    
    return res.send(enhancedSimpleHtml);
  }
  
  // 通常モードの場合、index.htmlがあればそれを返す
  try {
    const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    
    // 追加のスクリプトを読み込む
    let directLoadFixScript = '';
    try {
      directLoadFixScript = fs.readFileSync(path.join(__dirname, 'direct-load-fix.js'), 'utf8');
    } catch (err) {
      console.log('直接ロード修正スクリプトの読み込みに失敗:', err);
    }
    
    let noResponseFixScript = '';
    try {
      noResponseFixScript = fs.readFileSync(path.join(__dirname, 'no-response-fix.js'), 'utf8');
    } catch (err) {
      console.log('応答なしエラー修正スクリプトの読み込みに失敗:', err);
    }
    
    let syncInjectScript = '';
    try {
      syncInjectScript = fs.readFileSync(path.join(__dirname, 'sync-inject.js'), 'utf8');
    } catch (err) {
      console.log('同期インジェクトスクリプトの読み込みに失敗:', err);
    }
    
    let crashRecoveryScript = '';
    try {
      crashRecoveryScript = fs.readFileSync(path.join(__dirname, 'crash-recovery.js'), 'utf8');
    } catch (err) {
      console.log('クラッシュリカバリースクリプトの読み込みに失敗:', err);
    }
    
    // フレーム検出スクリプトを追加
    const modifiedContent = content.replace('</head>', `
      ${frameDetectScript}
      
      <script>
        ${spinKillerScript}
      </script>
      
      <script>
        ${autoWaitScript}
      </script>
      
      <script>
        ${directLoadFixScript}
      </script>
      
      <script>
        ${noResponseFixScript}
      </script>
      
      <script>
        ${syncInjectScript}
      </script>
      
      <script>
        ${crashRecoveryScript}
      </script>
      
      <script>
        // 最終強制対策: innerHTML操作などが機能しなかった場合の対策
        (function() {
          let checkCount = 0;
          const maxChecks = 100;
          
          function forceButtonCheck() {
            if (checkCount++ > maxChecks) return;
            
            try {
              // すべてのボタンをチェック
              const buttons = Array.from(document.querySelectorAll('button'));
              for (const btn of buttons) {
                if (!btn || !btn.textContent) continue;
                if (btn.textContent.includes('待機') || btn.textContent.includes('Wait')) {
                  console.log('緊急対策: 待機ボタンを検出してクリック', btn.textContent);
                  setTimeout(() => btn.click(), 10);
                  break;
                }
              }
            } catch (e) {
              console.error('緊急対策エラー:', e);
            }
            
            // 再試行
            setTimeout(forceButtonCheck, 200);
          }
          
          // 実行を開始
          setTimeout(forceButtonCheck, 500);
          
          // エラー発生時にもチェック
          window.addEventListener('error', forceButtonCheck);
        })();
      </script>
      
      <style>
        /* すべてのスピナーとローディング要素を強制的に非表示 */
        .spinner, .spinner-border, .spinner-grow, 
        .loading, .loader, #loading, .loading-screen, 
        .loading-container, #preloader, .preloader,
        [role="progressbar"], [aria-busy="true"],
        [class*="spinner"], [class*="loading"],
        [id*="spinner"], [id*="loading"],
        .progress {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          animation: none !important;
          -webkit-animation: none !important;
        }
        
        /* 本文を必ず表示 */
        body {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      </style>
    </head>`);
    
    return res.status(200).send(modifiedContent);
  } catch (error) {
    console.error('ファイル読み込みエラー: ', error);
    
    // エラー発生時はシンプルHTMLを返す
    res.status(200).send(generateBasicHtml());
  }
});

// シンプルモード専用エンドポイント
app.get('/simple', (req, res) => {
  res.send(generateBasicHtml());
});

// ダイレクト表示エンドポイント
app.get('/direct', (req, res) => {
  const frameDetectScript = `
    <!-- フレーム内での表示を検出して新しいタブで開く -->
    <script>
      (function() {
        if (window !== window.top) {
          const directUrl = window.location.href.replace('/direct', '/') + '?direct_tab=true';
          window.open(directUrl, '_blank');
        }
      })();
    </script>
  `;
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Local Guide - 直接表示</title>
      ${frameDetectScript}
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
          background-color: #f8f9fa;
          text-align: center;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #0066cc;
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 20px;
        }
        .btn {
          display: inline-block;
          background-color: #0066cc;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 5px;
          font-weight: 500;
          margin-top: 10px;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #0055aa;
        }
        .options {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .timer {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>直接表示モード</h1>
        <p>このページは新しいタブでサイトを開きます。自動的にリダイレクトされない場合は下のリンクをクリックしてください。</p>
        <a href="/?direct_tab=true" target="_blank" class="btn">メインページを開く</a>
        
        <div class="options">
          <p>問題が解決しない場合は、以下のオプションをお試しください：</p>
          <a href="/?mode=simple" class="btn">シンプルモード</a>
          <a href="/emergency" class="btn">緊急スタンドアロンページ</a>
        </div>
        
        <div class="timer">
          <span id="countdown">5</span>秒後に自動的にリダイレクトします...
        </div>
      </div>
      
      <script>
        window.onload = function() {
          // 親フレームでないなら自動的に開く
          if (window === window.top) {
            let count = 5;
            const countdownEl = document.getElementById('countdown');
            
            const interval = setInterval(function() {
              count--;
              countdownEl.textContent = count;
              
              if (count <= 0) {
                clearInterval(interval);
                window.location.href = '/?direct_tab=true';
              }
            }, 1000);
          }
        };
      </script>
    </body>
    </html>
  `);
});

// 緊急スタンドアロンページ
app.get('/emergency', (req, res) => {
  try {
    const emergencyHtml = fs.readFileSync(path.join(__dirname, 'emergency-standalone.html'), 'utf8');
    res.send(emergencyHtml);
  } catch (e) {
    console.error('緊急ページ読み込みエラー:', e);
    res.send(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Local Guide - 緊急モード</title>
        <style>
          body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #0066cc; }
          .btn { display: inline-block; background: #0066cc; color: white; padding: 10px 20px; 
                text-decoration: none; border-radius: 5px; margin-right: 10px; }
        </style>
      </head>
      <body>
        <h1>緊急モード</h1>
        <p>申し訳ありませんが、緊急スタンドアロンページの読み込みに失敗しました。</p>
        <p>以下のオプションをお試しください：</p>
        <p>
          <a href="/?mode=simple" class="btn">シンプルモード</a>
          <a href="/direct" class="btn">直接表示モード</a>
        </p>
      </body>
      </html>
    `);
  }
});

// 自動待機バージョン
app.get('/auto-wait', (req, res) => {
  res.redirect('/?auto_wait=true');
});

// 強制直接開きページ
app.get('/force-direct', (req, res) => {
  try {
    const forceDirect = fs.readFileSync(path.join(__dirname, 'force-direct-open.html'), 'utf8');
    res.send(forceDirect);
  } catch (e) {
    console.error('強制直接開きページ読み込みエラー:', e);
    res.send(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>強制直接開きモード</title>
        <style>
          body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; padding: 1rem; }
          .btn { display: inline-block; background: #0066cc; color: white; padding: 12px 24px; 
                border-radius: 4px; text-decoration: none; margin: 8px 0; }
        </style>
      </head>
      <body>
        <h1>強制直接開きモード</h1>
        <p>特別なページでサイトを開きます。以下のボタンをクリックしてください。</p>
        <a href="/?force_direct=true&no_response_handler=true" target="_blank" class="btn">新しいタブで開く</a>
      </body>
      </html>
    `);
  }
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// サーバー起動
// サーバーが起動する前にコンソールに表示する
console.log(`表示強制サーバーが起動しました: http://0.0.0.0:${PORT}`);
console.log(`シンプルモード: http://0.0.0.0:${PORT}/?mode=simple`);
console.log(`デバッグモード: http://0.0.0.0:${PORT}/?debug=true`);

// サーバーの起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`サーバーの準備が完了しました: http://0.0.0.0:${PORT}`);
});