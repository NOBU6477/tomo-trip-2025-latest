/**
 * シンプルにメインページにカメラテストボタンを追加するスクリプト
 * グローバルスコープで関数を定義して、ボタンクリックで確実に呼び出せるようにする
 */

// グローバル変数
let cameraStream = null;

// 初期化関数 - ページ読み込み時に実行
function initCameraTest() {
  console.log('カメラテスト初期化開始');
  
  // ヒーローセクションの下にボタンを挿入
  let hero = document.querySelector('.hero-section');
  if (!hero) {
    // ヒーローセクションが見つからない場合は、#heroセクションを探す
    hero = document.getElementById('hero');
  }
  
  if (hero) {
    // テストボタン用のコンテナを作成
    const testContainer = document.createElement('div');
    testContainer.className = 'container camera-test-container my-4 text-center';
    testContainer.style.padding = '20px';
    testContainer.style.backgroundColor = '#f8f9fa';
    testContainer.style.borderRadius = '8px';
    testContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    // 見出しを追加
    const heading = document.createElement('h3');
    heading.textContent = 'カメラ機能テスト';
    heading.style.marginBottom = '20px';
    testContainer.appendChild(heading);
    
    // 説明文を追加
    const description = document.createElement('p');
    description.textContent = 'カメラの動作をテストします。「カメラを起動」ボタンをクリックして、デバイスのカメラにアクセスします。';
    description.style.marginBottom = '20px';
    testContainer.appendChild(description);
    
    // カメラテストコンテナを作成
    const cameraContainer = document.createElement('div');
    cameraContainer.className = 'camera-container';
    cameraContainer.style.width = '100%';
    cameraContainer.style.maxWidth = '500px';
    cameraContainer.style.margin = '0 auto';
    
    // ビデオ要素を追加
    const video = document.createElement('video');
    video.id = 'camera-test-video';
    video.autoplay = true;
    video.playsInline = true;
    video.style.width = '100%';
    video.style.height = 'auto';
    video.style.marginBottom = '15px';
    video.style.borderRadius = '8px';
    video.style.display = 'none';
    video.style.backgroundColor = '#000';
    cameraContainer.appendChild(video);
    
    // キャンバス要素を追加（画像キャプチャ用）
    const canvas = document.createElement('canvas');
    canvas.id = 'camera-test-canvas';
    canvas.style.display = 'none';
    cameraContainer.appendChild(canvas);
    
    // プレビュー画像を追加
    const previewContainer = document.createElement('div');
    previewContainer.id = 'preview-container';
    previewContainer.style.display = 'none';
    previewContainer.style.marginTop = '15px';
    const previewImg = document.createElement('img');
    previewImg.id = 'camera-preview';
    previewImg.style.width = '100%';
    previewImg.style.maxWidth = '400px';
    previewImg.style.borderRadius = '8px';
    previewImg.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    previewContainer.appendChild(previewImg);
    cameraContainer.appendChild(previewContainer);
    
    // ステータスメッセージ表示エリアを追加
    const statusContainer = document.createElement('div');
    statusContainer.id = 'camera-status';
    statusContainer.style.marginTop = '10px';
    statusContainer.style.color = '#6c757d';
    statusContainer.style.fontStyle = 'italic';
    cameraContainer.appendChild(statusContainer);
    
    // ボタングループを作成
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group mt-3';
    buttonGroup.role = 'group';
    
    // カメラ起動ボタンを追加
    const startButton = document.createElement('button');
    startButton.type = 'button';
    startButton.id = 'start-camera';
    startButton.className = 'btn btn-primary me-2';
    startButton.textContent = 'カメラを起動';
    // 直接関数を呼び出すのではなく、グローバル関数への参照を設定
    startButton.setAttribute('onclick', 'startCamera()');
    buttonGroup.appendChild(startButton);
    
    // 撮影ボタンを追加
    const captureButton = document.createElement('button');
    captureButton.type = 'button';
    captureButton.id = 'capture-photo';
    captureButton.className = 'btn btn-success me-2';
    captureButton.textContent = '写真を撮影';
    captureButton.disabled = true;
    captureButton.setAttribute('onclick', 'capturePhoto()');
    buttonGroup.appendChild(captureButton);
    
    // 停止ボタンを追加
    const stopButton = document.createElement('button');
    stopButton.type = 'button';
    stopButton.id = 'stop-camera';
    stopButton.className = 'btn btn-danger';
    stopButton.textContent = 'カメラを停止';
    stopButton.disabled = true;
    stopButton.setAttribute('onclick', 'stopCamera()');
    buttonGroup.appendChild(stopButton);
    
    // 再撮影ボタンを追加
    const retakeButton = document.createElement('button');
    retakeButton.type = 'button';
    retakeButton.id = 'retake-photo';
    retakeButton.className = 'btn btn-outline-primary me-2';
    retakeButton.textContent = '再撮影';
    retakeButton.style.display = 'none';
    retakeButton.setAttribute('onclick', 'retakePhoto()');
    buttonGroup.appendChild(retakeButton);
    
    // 使用ボタンを追加
    const useButton = document.createElement('button');
    useButton.type = 'button';
    useButton.id = 'use-photo';
    useButton.className = 'btn btn-outline-success';
    useButton.textContent = 'この写真を使用';
    useButton.style.display = 'none';
    useButton.setAttribute('onclick', 'usePhoto()');
    buttonGroup.appendChild(useButton);
    
    cameraContainer.appendChild(buttonGroup);
    testContainer.appendChild(cameraContainer);
    
    // ヒーローセクションの後にテストコンテナを挿入
    hero.parentNode.insertBefore(testContainer, hero.nextSibling);
    
    console.log('カメラテストボタンが追加されました');
    
    // 初期ステータスメッセージを設定
    const status = document.getElementById('camera-status');
    if (status) {
      status.textContent = 'カメラ起動ボタンを押してください。';
    }
  } else {
    console.log('ヒーローセクションまたはidが"hero"の要素が見つかりません');
  }
}

// カメラを起動する関数 - グローバルスコープで定義
function startCamera() {
  console.log('カメラ起動ボタンがクリックされました');
  
  const video = document.getElementById('camera-test-video');
  const startButton = document.getElementById('start-camera');
  const captureButton = document.getElementById('capture-photo');
  const stopButton = document.getElementById('stop-camera');
  const statusContainer = document.getElementById('camera-status');
  const previewContainer = document.getElementById('preview-container');
  const retakeButton = document.getElementById('retake-photo');
  const useButton = document.getElementById('use-photo');
  
  if (!video || !startButton || !captureButton || !stopButton || !statusContainer) {
    console.error('必要な要素が見つかりません');
    alert('カメラテスト要素が見つかりませんでした。ページを再読み込みして再試行してください。');
    return;
  }
  
  // プレビューを非表示
  if (previewContainer) previewContainer.style.display = 'none';
  if (retakeButton) retakeButton.style.display = 'none';
  if (useButton) useButton.style.display = 'none';
  
  // ステータスメッセージを表示
  statusContainer.textContent = 'カメラへのアクセスを要求中...';
  
  // カメラにアクセス
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user' 
      } 
    })
    .then(function(mediaStream) {
      cameraStream = mediaStream;
      video.srcObject = mediaStream;
      video.style.display = 'block';
      
      // ボタンの状態を更新
      startButton.disabled = true;
      captureButton.disabled = false;
      stopButton.disabled = false;
      
      statusContainer.textContent = 'カメラ準備完了！撮影ボタンを押してください。';
    })
    .catch(function(err) {
      console.error('カメラアクセスエラー:', err);
      statusContainer.textContent = `エラー: ${err.message}`;
      
      // ブラウザの権限エラーの場合
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        statusContainer.textContent = 'カメラへのアクセスが拒否されました。ブラウザの設定でカメラへのアクセスを許可してください。';
      }
      // デバイスが見つからない場合
      else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        statusContainer.textContent = 'カメラデバイスが見つかりません。カメラが接続されていることを確認してください。';
      }
      // その他のエラー
      else {
        statusContainer.textContent = `カメラエラー: ${err.message}`;
      }
    });
  } else {
    statusContainer.textContent = 'このブラウザではカメラへのアクセスがサポートされていません。';
  }
}

// 写真を撮影する関数 - グローバルスコープで定義
function capturePhoto() {
  console.log('写真撮影ボタンがクリックされました');
  
  const video = document.getElementById('camera-test-video');
  const canvas = document.getElementById('camera-test-canvas');
  const preview = document.getElementById('camera-preview');
  const previewContainer = document.getElementById('preview-container');
  const statusContainer = document.getElementById('camera-status');
  const captureButton = document.getElementById('capture-photo');
  const retakeButton = document.getElementById('retake-photo');
  const useButton = document.getElementById('use-photo');
  
  if (!video || !canvas || !preview || !previewContainer || !statusContainer || !captureButton) {
    console.error('必要な要素が見つかりません');
    return;
  }
  
  if (!cameraStream) {
    statusContainer.textContent = 'エラー: カメラが起動していません。';
    return;
  }
  
  try {
    // キャンバスの設定
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // 画像データをプレビューに設定
    preview.src = canvas.toDataURL('image/png');
    
    // プレビューを表示
    previewContainer.style.display = 'block';
    
    // ボタンの表示を切り替え
    captureButton.style.display = 'none';
    retakeButton.style.display = 'inline-block';
    useButton.style.display = 'inline-block';
    
    // ステータスメッセージを更新
    statusContainer.textContent = '写真を撮影しました。この写真を使用するか、再撮影してください。';
  } catch (error) {
    console.error('写真撮影中にエラーが発生しました:', error);
    statusContainer.textContent = `撮影エラー: ${error.message}`;
  }
}

// カメラを停止する関数 - グローバルスコープで定義
function stopCamera() {
  console.log('カメラ停止ボタンがクリックされました');
  
  const video = document.getElementById('camera-test-video');
  const startButton = document.getElementById('start-camera');
  const captureButton = document.getElementById('capture-photo');
  const stopButton = document.getElementById('stop-camera');
  const statusContainer = document.getElementById('camera-status');
  
  if (!video || !startButton || !captureButton || !stopButton || !statusContainer) {
    console.error('必要な要素が見つかりません');
    return;
  }
  
  if (cameraStream) {
    // すべてのトラックを停止
    cameraStream.getTracks().forEach(track => {
      track.stop();
      console.log('カメラトラックを停止しました');
    });
    cameraStream = null;
    
    // ビデオ要素をリセット
    video.srcObject = null;
    video.style.display = 'none';
    
    // ボタンの状態を更新
    startButton.disabled = false;
    captureButton.disabled = true;
    stopButton.disabled = true;
    captureButton.style.display = 'inline-block';
    
    // ステータスメッセージを更新
    statusContainer.textContent = 'カメラを停止しました。';
  } else {
    statusContainer.textContent = 'カメラは既に停止しています。';
  }
}

// 再撮影する関数 - グローバルスコープで定義
function retakePhoto() {
  console.log('再撮影ボタンがクリックされました');
  
  const previewContainer = document.getElementById('preview-container');
  const captureButton = document.getElementById('capture-photo');
  const retakeButton = document.getElementById('retake-photo');
  const useButton = document.getElementById('use-photo');
  const statusContainer = document.getElementById('camera-status');
  
  if (!previewContainer || !captureButton || !retakeButton || !useButton || !statusContainer) {
    console.error('必要な要素が見つかりません');
    return;
  }
  
  // プレビューを非表示
  previewContainer.style.display = 'none';
  
  // ボタンの表示を切り替え
  captureButton.style.display = 'inline-block';
  retakeButton.style.display = 'none';
  useButton.style.display = 'none';
  
  // ステータスメッセージを更新
  statusContainer.textContent = 'もう一度撮影してください。';
}

// 撮影した写真を使用する関数 - グローバルスコープで定義
function usePhoto() {
  console.log('写真確定ボタンがクリックされました');
  
  const preview = document.getElementById('camera-preview');
  const statusContainer = document.getElementById('camera-status');
  
  if (!preview || !statusContainer) {
    console.error('必要な要素が見つかりません');
    return;
  }
  
  try {
    // 撮影した写真のデータURL
    const imageData = preview.src;
    
    // 実際のアプリケーションでは、このデータを保存したり送信したりします
    console.log('使用する画像データ:', imageData.substring(0, 100) + '...');
    
    // 成功メッセージを表示
    statusContainer.textContent = '写真が確定されました！（実際のアプリではここでデータを保存します）';
    
    // 簡単なアラートを表示
    alert('カメラテスト成功！写真が確定されました。');
    
    // カメラを停止
    stopCamera();
  } catch (error) {
    console.error('写真使用中にエラーが発生しました:', error);
    statusContainer.textContent = `エラー: ${error.message}`;
  }
}

// ページ読み込み時に初期化
window.addEventListener('load', function() {
  console.log('ページが完全に読み込まれました。カメラテスト初期化を実行します。');
  initCameraTest();
});

// DOMContentLoadedでも初期化を試みる (ページロードに問題がある場合のバックアップ)
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMが読み込まれました。カメラテスト初期化を実行します。');
  initCameraTest();
});

// ページ離脱時にカメラを停止
window.addEventListener('beforeunload', function() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    console.log('ページ離脱時にカメラを停止しました');
  }
});