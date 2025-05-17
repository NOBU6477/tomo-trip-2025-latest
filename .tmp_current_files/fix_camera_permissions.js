/**
 * カメラ権限問題修正スクリプト
 * PCのギャラリーではなく実際のカメラが使用されるようにします
 */
(function() {
  console.log('カメラ権限修正スクリプト: 初期化');

  // DOMが読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCameraPermissions);
  } else {
    initCameraPermissions();
  }

  // モーダルが開かれた時にも実行
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target && event.target.id === 'custom-camera-modal') {
      console.log('カメラモーダル表示検出: カメラ権限確認を実行');
      fixCameraPermissions();
    }
  });

  // カメラ権限の初期化
  function initCameraPermissions() {
    // カメラ関連のボタンを見つける（標準的なセレクタのみ使用）
    const cameraButtons = document.querySelectorAll('.camera-button, button.btn-outline-primary');
    
    // テキスト内容で追加検索
    const allButtons = document.querySelectorAll('button');
    const textMatchButtons = Array.from(allButtons).filter(button => {
      const buttonText = button.textContent.trim().toLowerCase();
      return buttonText.includes('カメラ') || buttonText.includes('撮影');
    });
    
    // 両方のリストを結合
    const combinedButtons = [...Array.from(cameraButtons), ...textMatchButtons];
    
    // 重複を除去
    const uniqueButtons = Array.from(new Set(combinedButtons));
    
    console.log('カメラ権限修正: ' + uniqueButtons.length + 'のカメラ関連ボタンを検出');
    
    uniqueButtons.forEach(button => {
      if (button.getAttribute('data-camera-permissions-fixed') === 'true') {
        return;
      }
      
      button.setAttribute('data-camera-permissions-fixed', 'true');
      
      // クリック時にカメラ権限を事前に確認
      button.addEventListener('click', function(e) {
        requestCameraPermission();
      }, true);
    });
  }

  // カメラモーダル内のカメラ機能を修正
  function fixCameraPermissions() {
    const modal = document.getElementById('custom-camera-modal');
    if (!modal) return;
    
    const video = modal.querySelector('video');
    if (!video) return;
    
    // ビデオ要素のsrcObjectが設定されているかチェック
    if (!video.srcObject) {
      console.log('カメラ権限修正: ビデオソースが設定されていません、再設定を試みます');
      
      // カメラへのアクセスを試みる
      startCameraWithPermissions(video);
    }
  }

  // 権限を明示的に要求してカメラを開始
  function startCameraWithPermissions(videoElement) {
    if (!videoElement) return;
    
    // カスタム制約で背面カメラを優先
    const constraints = {
      video: {
        // モバイルデバイスでは背面カメラを優先
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };
    
    console.log('カメラ権限修正: 明示的にカメラアクセスを要求');
    
    // メディアデバイスへのアクセスを要求
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        console.log('カメラ権限修正: カメラアクセス成功', stream);
        
        // ビデオソースを設定
        videoElement.srcObject = stream;
        
        // メタデータがロードされたらビデオを再生
        videoElement.onloadedmetadata = function() {
          videoElement.play();
        };
        
        // カメラアクセス成功イベントを発火
        const successEvent = new CustomEvent('camera-access-success', {
          detail: { stream: stream }
        });
        document.dispatchEvent(successEvent);
      })
      .catch(function(error) {
        console.error('カメラ権限修正: カメラアクセスエラー', error);
        
        // エラーイベントを発火
        const errorEvent = new CustomEvent('camera-access-error', {
          detail: { error: error }
        });
        document.dispatchEvent(errorEvent);
        
        // ユーザーにエラーを通知
        showCameraError(error);
      });
  }

  // カメラ権限を事前要求（ボタンクリック前）
  function requestCameraPermission() {
    // カメラ権限があるかどうかを確認
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
        console.log('カメラ権限修正: 事前権限確認成功');
        
        // 確認できたらストリームを停止
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(function(error) {
        console.error('カメラ権限修正: 事前権限確認エラー', error);
      });
  }

  // カメラエラーを表示
  function showCameraError(error) {
    const modal = document.getElementById('custom-camera-modal');
    if (!modal) return;
    
    // エラーメッセージ要素を作成または取得
    let errorMessageEl = modal.querySelector('.camera-error-message');
    
    if (!errorMessageEl) {
      errorMessageEl = document.createElement('div');
      errorMessageEl.className = 'camera-error-message alert alert-danger mt-3';
      
      const videoContainer = modal.querySelector('.camera-container');
      if (videoContainer) {
        videoContainer.appendChild(errorMessageEl);
      }
    }
    
    // エラーメッセージを設定
    let errorMessage = 'カメラへのアクセスに失敗しました。';
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage = 'カメラへのアクセス許可が必要です。ブラウザの権限設定を確認してください。';
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorMessage = 'カメラが見つかりません。カメラが接続されているか確認してください。';
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorMessage = 'カメラにアクセスできません。別のアプリがカメラを使用している可能性があります。';
    } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      errorMessage = '指定された条件でカメラを開始できません。';
    }
    
    errorMessageEl.textContent = errorMessage;
    errorMessageEl.style.display = 'block';
  }
})();