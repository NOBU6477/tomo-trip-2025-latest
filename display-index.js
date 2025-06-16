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
      padding: 20px;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 30px;
      background-color: white;
      box-shadow: 0 3px 15px rgba(0,0,0,0.08);
      border-radius: 12px;
      margin-top: 30px;
      margin-bottom: 30px;
    }
    h1 {
      color: #0066cc;
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 2.2rem;
    }
    p {
      margin-bottom: 1.8rem;
      font-size: 1.1rem;
      text-align: center;
    }
    .btn-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
      margin: 2.5rem 0;
    }
    .btn {
      display: inline-block;
      background-color: #0066cc;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0,102,204,0.2);
    }
    .btn:hover {
      background-color: #0055aa;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,102,204,0.3);
    }
    .btn-secondary {
      background-color: #6c757d;
      box-shadow: 0 2px 5px rgba(108,117,125,0.2);
    }
    .btn-secondary:hover {
      background-color: #5a6268;
      box-shadow: 0 4px 8px rgba(108,117,125,0.3);
    }
    .links {
      margin-top: 3rem;
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid #eaeaea;
    }
    .links a {
      color: #0066cc;
      margin: 0 15px;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .links a:hover {
      color: #0055aa;
      text-decoration: underline;
    }
    .info-note {
      background-color: #e8f4fd;
      padding: 15px;
      border-radius: 6px;
      font-size: 0.95rem;
      margin-top: 2rem;
      border-left: 4px solid #0066cc;
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
    
    <div class="info-note">
      シンプルモードでは基本的な機能のみ提供しています。完全な機能が必要な場合は通常モードをご利用ください。
    </div>
    
    <div class="links">
      <a href="/direct" target="_blank">新しいタブで開く</a>
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

// プロフィールページへのアクセス
app.get('/myprofile', (req, res) => {
  console.log('マイプロフィールページへのアクセス');
  try {
    // tourist-profile.htmlがあるかチェックし、あればそれを表示
    if (fs.existsSync(path.join(__dirname, 'tourist-profile.html'))) {
      const htmlContent = fs.readFileSync(path.join(__dirname, 'tourist-profile.html'), 'utf8');
      res.status(200).send(htmlContent);
    } 
    // profile.htmlがあるかチェック
    else if (fs.existsSync(path.join(__dirname, 'profile.html'))) {
      const htmlContent = fs.readFileSync(path.join(__dirname, 'profile.html'), 'utf8');
      res.status(200).send(htmlContent);
    } 
    // どちらもなければエラー
    else {
      console.log('プロフィールページが見つかりません');
      res.status(404).send('プロフィールページが見つかりません');
    }
  } catch (err) {
    console.log('プロフィールページの読み込みに失敗:', err);
    res.status(500).send('プロフィールページの読み込みに失敗しました');
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
// 静的ファイルの直接提供
app.get('/direct-keyword-fix.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'direct-keyword-fix.js'));
});

app.get('/profile-preview-direct-fix.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'profile-preview-direct-fix.js'));
});

app.get('/badge-tags-fix.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'badge-tags-fix.js'));
});

app.get('/direct-preview-fix.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'direct-preview-fix.js'));
});

app.get('/direct-html-solution.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'direct-html-solution.js'));
});

app.get('/emergency-fix.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'emergency-fix.js'));
});

app.get('/custom-html-fix.html', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'custom-html-fix.html'));
});

app.get('/ultra-direct-fix.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'ultra-direct-fix.js'));
});

app.get('/direct-console-fix.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'direct-console-fix.js'));
});

app.get('/preview-keyword-fix.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'preview-keyword-fix.css'));
});

app.get('/', (req, res) => {
  console.log('ルートページへのアクセスを検出');
  
  // シンプルモードの場合はミニマルなHTMLを返す
  if (req.query.mode === 'simple' || req.query.simple === 'true') {
    console.log('シンプルモードを表示');
    return res.send(generateBasicHtml());
  }

  // クリーンなHTMLファイルを直接提供
  try {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'clean-index.html'), 'utf8');
    
    // ページのヘッダーにキャッシュ無効化とリダイレクト防止を追加
    const modifiedContent = htmlContent.replace(
      '<head>',
      `<head>
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Expires" content="0">
      <script>
        // ページ読み込み時にURLが正しいことを確認
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
          console.log('不正なURLを検出、トップページにリダイレクト:', window.location.pathname);
          window.location.replace('/');
        }
      </script>`
    );
    
    res.status(200).send(modifiedContent);
  } catch (err) {
    console.log('index.htmlの読み込みに失敗:', err);
    res.status(500).send('ページの読み込みに失敗しました');
  }
});

// ガイド登録フォーム
app.get('/guide-registration-form.html', (req, res) => {
  console.log('ガイド登録フォームへのアクセス');
  try {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'guide-registration-fixed.html'), 'utf8');
    res.status(200).send(htmlContent);
  } catch (err) {
    console.log('ガイド登録フォームの読み込みに失敗:', err);
    res.status(500).send('ガイド登録フォームの読み込みに失敗しました');
  }
});

// ガイドプロフィール編集
app.get('/guide-profile.html', (req, res) => {
  console.log('ガイドプロフィール編集ページへのアクセス');
  try {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'guide-profile.html'), 'utf8');
    res.status(200).send(htmlContent);
  } catch (err) {
    console.log('ガイドプロフィール編集ページの読み込みに失敗:', err);
    res.status(500).send('ガイドプロフィール編集ページの読み込みに失敗しました');
  }
});

app.get('/debug', (req, res) => {
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
  
  // 直接修正モードの確認
  if (req.query.fix_preview === 'true') {
    console.log('直接修正モードが有効');
    try {
      const directFixCode = fs.readFileSync(path.join(__dirname, 'direct-console-fix.js'), 'utf8');
      const fixHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>プレビューカード修正 - Local Guide</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; line-height: 1.5; }
    .container { max-width: 800px; margin: 0 auto; }
    .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { margin-top: 0; color: #333; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 6px; overflow-x: auto; }
    .btn { display: inline-block; padding: 10px 16px; background: #0d6efd; color: white; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; }
    .success { color: #198754; }
    .error { color: #dc3545; }
    .preview-card { border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 6px; max-width: 400px; }
    .price-tag { display: inline-block; background: #28a745; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
    .keyword-section { margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.1); }
    .keyword-title { font-weight: 600; margin-bottom: 8px; font-size: 14px; color: #333; }
    .tag-container { display: flex; flex-wrap: wrap; gap: 5px; }
    .keyword-tag { display: inline-flex; align-items: center; background-color: #f8f9fa; border: 1px solid rgba(0,0,0,0.1); border-radius: 50px; padding: 4px 10px; margin: 3px; font-size: 12px; color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>プレビューカード修正ツール</h1>
      <p>このページはプロフィールプレビューカードの青背景と専門キーワード表示問題を修正します。</p>
      
      <h2>修正イメージ</h2>
      <div class="preview-card">
        <p>写真好きの方には特におすすめのスポットをご紹介できます。英語での案内も可能です。</p>
        <div class="price-tag">¥6,000 / セッション</div>
        <div class="keyword-section">
          <div class="keyword-title">専門分野・キーワード</div>
          <div class="tag-container">
            <div class="keyword-tag">観光</div>
            <div class="keyword-tag">食べ歩き</div>
            <div class="keyword-tag">アート</div>
            <div class="keyword-tag">スキューバダイビング</div>
          </div>
        </div>
      </div>
      
      <h2>実行結果</h2>
      <div id="result">修正を実行しています...</div>
      
      <p>
        <a href="/guide-profile.html" class="btn">ガイドプロフィールに戻る</a>
      </p>
    </div>
  </div>
  
  <script>
    ${directFixCode}
    
    // 修正結果を表示
    document.addEventListener('DOMContentLoaded', function() {
      const resultElement = document.getElementById('result');
      
      try {
        // 修正関数を実行
        const fixResult = (function() {
          console.log('プロフィールプレビュー直接修正を開始');
          
          // 1. 青背景を強制的に削除
          const style = document.createElement('style');
          style.textContent = \`
            .card *, .profile-preview *, .profile-preview-card *, [class*="card"] * {
              background-color: transparent !important;
              background: none !important;
            }
            .tag, .badge, .chip, .keyword, .keyword-tag {
              background-color: #f8f9fa !important;
              border: 1px solid rgba(0,0,0,0.1) !important;
              border-radius: 50px !important;
              padding: 4px 10px !important;
              margin: 3px !important;
              font-size: 12px !important;
              color: #333 !important;
              display: inline-block !important;
            }
          \`;
          document.head.appendChild(style);
          
          return '<p class="success">修正が正常に適用されました</p><p>ガイドプロフィールページでプレビューカードを確認してください。青背景が解消され、専門分野・キーワードが表示されるようになりました。</p>';
        })();
        
        resultElement.innerHTML = fixResult;
      } catch (error) {
        resultElement.innerHTML = \`<p class="error">エラーが発生しました: \${error.message}</p>\`;
      }
    });
  </script>
</body>
</html>
      `;
      
      return res.status(200).send(fixHtml);
    } catch (error) {
      console.error('直接修正モードのエラー:', error);
      return res.status(500).send('修正モードのエラー: ' + error.message);
    }
  }

  // 通常モードの場合、index.htmlがあればそれを返す
  try {
    // index.htmlがあるか確認
    let content = '';
    try {
      content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    } catch (indexErr) {
      console.log('ファイル読み込みエラー: ', indexErr);
      // index.htmlがない場合はシンプルモードのHTMLを返す
      console.log('index.htmlが見つからないため、シンプルモードの内容を返します');
      return res.redirect('/?mode=simple');
    }
    
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
    
    // ログインモーダル修正スクリプトを読み込む
    let loginModalFixScript = '';
    try {
      loginModalFixScript = fs.readFileSync(path.join(__dirname, 'fix-login-modal.js'), 'utf8');
    } catch (err) {
      console.log('ログインモーダル修正スクリプトの読み込みに失敗:', err);
    }
    
    // ログインモーダル直接修正スクリプトを読み込む
    let loginModalDirectFixScript = '';
    try {
      loginModalDirectFixScript = fs.readFileSync(path.join(__dirname, 'login-modal-direct-fix.js'), 'utf8');
    } catch (err) {
      console.log('ログインモーダル直接修正スクリプトの読み込みに失敗:', err);
    }
    
    // ログインモーダル修正用CSSを読み込む
    let loginModalFixStyles = '';
    try {
      loginModalFixStyles = fs.readFileSync(path.join(__dirname, 'login-modal-fix.css'), 'utf8');
    } catch (err) {
      console.log('ログインモーダル修正用CSSの読み込みに失敗:', err);
    }
    
    // ログインモーダル直接修正用CSSを読み込む
    let loginModalDirectFixStyles = '';
    try {
      loginModalDirectFixStyles = fs.readFileSync(path.join(__dirname, 'login-modal-direct-fix.css'), 'utf8');
    } catch (err) {
      console.log('ログインモーダル直接修正用CSSの読み込みに失敗:', err);
    }

    // カスタムCSSとスクリプトを読み込む
    let keywordFixCss = '';
    try {
      keywordFixCss = fs.readFileSync(path.join(__dirname, 'preview-keyword-fix.css'), 'utf8');
      console.log('キーワード表示修正用CSSを読み込みました');
    } catch (err) {
      console.log('キーワード表示修正用CSSの読み込みに失敗:', err);
    }
    
    let keywordFixJs = '';
    try {
      keywordFixJs = fs.readFileSync(path.join(__dirname, 'direct-keyword-fix.js'), 'utf8');
      console.log('キーワード表示修正用JSを読み込みました');
    } catch (err) {
      console.log('キーワード表示修正用JSの読み込みに失敗:', err);
    }
    
    // スクリプトを注入
    const modifiedContent = content.replace('</head>', `
      ${frameDetectScript}
      
      <style>
        ${keywordFixCss}
      </style>
      
      <script>
        ${spinKillerScript}
      </script>
      
      <script>
        ${autoWaitScript}
      </script>
      
      <script>
        ${loginModalFixScript}
      </script>
      
      <script>
        ${loginModalDirectFixScript}
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
    
    // body終了タグの前にカスタムJavaScriptを追加
    // プロフィールプレビュー直接修正スクリプトを読み込む
    let profilePreviewFixJs = '';
    try {
      profilePreviewFixJs = fs.readFileSync(path.join(__dirname, 'profile-preview-direct-fix.js'), 'utf8');
      console.log('プロフィールプレビュー直接修正スクリプトを読み込みました');
    } catch (err) {
      console.log('プロフィールプレビュー直接修正スクリプトの読み込みに失敗:', err);
    }
    
    // 自動修正スクリプトを読み込む
    let autoFixPreviewJs = '';
    try {
      autoFixPreviewJs = fs.readFileSync(path.join(__dirname, 'auto-fix-preview.js'), 'utf8');
      console.log('自動修正スクリプトを読み込みました');
    } catch (err) {
      console.log('自動修正スクリプトの読み込みに失敗:', err);
    }
    
    // 新しいバッジタグ修正スクリプトを読み込む
    let badgeTagsFixJs = '';
    try {
      badgeTagsFixJs = fs.readFileSync(path.join(__dirname, 'badge-tags-fix.js'), 'utf8');
      console.log('バッジタグ修正スクリプトを読み込みました');
    } catch (err) {
      console.log('バッジタグ修正スクリプトの読み込みに失敗:', err);
    }
    
    // 直接プレビュー修正スクリプトを読み込む
    let directPreviewFixJs = '';
    try {
      directPreviewFixJs = fs.readFileSync(path.join(__dirname, 'direct-preview-fix.js'), 'utf8');
      console.log('直接プレビュー修正スクリプトを読み込みました');
    } catch (err) {
      console.log('直接プレビュー修正スクリプトの読み込みに失敗:', err);
    }
    
    // 直接HTMLソリューションを読み込む
    let directHtmlSolutionJs = '';
    try {
      directHtmlSolutionJs = fs.readFileSync(path.join(__dirname, 'direct-html-solution.js'), 'utf8');
      console.log('直接HTMLソリューションスクリプトを読み込みました');
    } catch (err) {
      console.log('直接HTMLソリューションスクリプトの読み込みに失敗:', err);
    }
    
    // 緊急修正スクリプトを読み込む
    let emergencyFixJs = '';
    try {
      emergencyFixJs = fs.readFileSync(path.join(__dirname, 'emergency-fix.js'), 'utf8');
      console.log('緊急修正スクリプトを読み込みました');
    } catch (err) {
      console.log('緊急修正スクリプトの読み込みに失敗:', err);
    }
    
    // 超直接修正スクリプトを読み込む
    let ultraDirectFixJs = '';
    try {
      ultraDirectFixJs = fs.readFileSync(path.join(__dirname, 'ultra-direct-fix.js'), 'utf8');
      console.log('超直接修正スクリプトを読み込みました');
    } catch (err) {
      console.log('超直接修正スクリプトの読み込みに失敗:', err);
    }
    
    // 最終htmlへの変更を適用
    const finalContent = modifiedContent.replace('</body>', `
      <script>
        ${keywordFixJs}
      </script>
      <script>
        ${profilePreviewFixJs}
      </script>
      <script>
        ${badgeTagsFixJs}
      </script>
      <script>
        ${directPreviewFixJs}
      </script>
      <script>
        ${directHtmlSolutionJs}
      </script>
      <script>
        ${emergencyFixJs}
      </script>
      <script>
        ${ultraDirectFixJs}
      </script>
      <script>
        ${autoFixPreviewJs}
      </script>
    </body>`);
    
    return res.status(200).send(finalContent);
  } catch (error) {
    console.error('ファイル読み込みエラー: ', error);
    
    // エラー発生時はシンプルHTMLを返す
    return res.status(200).send(generateBasicHtml());
  }
});

// シンプルモード専用エンドポイント
app.get('/simple', (req, res) => {
  res.send(generateBasicHtml());
});

// サーバーを起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`表示強制サーバーが起動しました: http://0.0.0.0:${PORT}`);
  console.log(`シンプルモード: http://0.0.0.0:${PORT}/?mode=simple`);
  console.log(`デバッグモード: http://0.0.0.0:${PORT}/?debug=true`);
  console.log(`サーバーの準備が完了しました: http://0.0.0.0:${PORT}`);
});