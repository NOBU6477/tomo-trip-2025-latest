/**
 * 証明写真のデフォルト画像を提供するスクリプト
 * ユーザーが手動で撮影・アップロードしなくても、デフォルト画像（シルエット）を使用できるようにする
 */
(function() {
  console.log('デフォルト写真プロバイダーを初期化');
  
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', init);
  
  /**
   * 初期化処理
   */
  function init() {
    // 証明写真に関連するフォームグループを探す
    setupDefaultPhotoButtons();
    
    // モーダルが表示されたときのイベントリスナー
    document.body.addEventListener('shown.bs.modal', function(e) {
      // モーダル内のカメラボタンを設定
      setTimeout(setupDefaultPhotoButtons, 200);
    });
  }
  
  /**
   * 証明写真にデフォルトボタンを追加
   */
  function setupDefaultPhotoButtons() {
    // プロフィール写真のセクションを探す（ラベルテキストで探す）
    const photoLabels = Array.from(document.querySelectorAll('label')).filter(label => 
      label.textContent.includes('証明写真') || 
      label.textContent.includes('プロフィール写真') ||
      label.textContent.includes('顔写真')
    );
    
    photoLabels.forEach(function(label) {
      // 親のフォームグループを見つける
      const formGroup = findParentFormGroup(label);
      if (!formGroup) return;
      
      // すでに処理済みならスキップ
      if (formGroup.hasAttribute('data-default-added')) return;
      
      // ターゲットのファイル入力を探す
      const fileInput = formGroup.querySelector('input[type="file"]');
      if (!fileInput) return;
      
      // ボタンコンテナがすでにあるか確認
      let buttonContainer = formGroup.querySelector('.button-container');
      if (!buttonContainer) {
        // ボタンコンテナを作成
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container mt-2';
        
        // 適切な位置に挿入
        const existingContainer = formGroup.querySelector('.camera-button')?.parentElement;
        if (existingContainer) {
          existingContainer.parentElement.insertBefore(buttonContainer, existingContainer.nextSibling);
        } else {
          formGroup.appendChild(buttonContainer);
        }
      }
      
      // デフォルト写真ボタンを追加
      const defaultButton = document.createElement('button');
      defaultButton.type = 'button';
      defaultButton.className = 'btn btn-outline-secondary default-photo-button mt-2';
      defaultButton.innerHTML = '<i class="fas fa-user me-1"></i> デフォルト画像を使用';
      defaultButton.setAttribute('data-target', fileInput.id);
      
      // クリックイベントリスナー
      defaultButton.addEventListener('click', function() {
        setDefaultPhoto(fileInput);
      });
      
      // ボタンコンテナに追加
      buttonContainer.appendChild(defaultButton);
      
      // 処理済みとしてマーク
      formGroup.setAttribute('data-default-added', 'true');
      
      console.log(`デフォルト写真ボタンを追加: ${fileInput.id}`);
    });
  }
  
  /**
   * 親のフォームグループを見つける
   */
  function findParentFormGroup(element) {
    let current = element;
    const maxDepth = 5; // 最大探索階層
    let depth = 0;
    
    while (current && depth < maxDepth) {
      if (current.classList.contains('form-group') || 
          current.classList.contains('mb-3') || 
          current.classList.contains('mb-4')) {
        return current;
      }
      current = current.parentElement;
      depth++;
    }
    
    return null;
  }
  
  /**
   * デフォルト証明写真を設定
   */
  function setDefaultPhoto(fileInput) {
    // デフォルト写真のDataURLを作成
    const silhouetteDataURL = createSilhouetteImage();
    
    // DataURLをBlobに変換
    fetch(silhouetteDataURL)
      .then(res => res.blob())
      .then(blob => {
        // Fileオブジェクトを作成
        const fileName = 'default_profile_photo.png';
        const file = new File([blob], fileName, { type: 'image/png' });
        
        // ファイル入力に設定
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
        
        console.log('デフォルト証明写真を設定しました');
      })
      .catch(error => {
        console.error('デフォルト写真の設定に失敗:', error);
      });
  }
  
  /**
   * シルエット画像を作成
   */
  function createSilhouetteImage() {
    // キャンバスを作成
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // 背景を描画
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // シルエットを描画
    ctx.fillStyle = '#adb5bd';
    
    // 頭
    ctx.beginPath();
    ctx.arc(150, 120, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // 胴体
    ctx.beginPath();
    ctx.moveTo(100, 190);
    ctx.quadraticCurveTo(150, 180, 200, 190);
    ctx.lineTo(220, 300);
    ctx.lineTo(80, 300);
    ctx.closePath();
    ctx.fill();
    
    // 縁取り
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // DataURLとして返す
    return canvas.toDataURL('image/png');
  }
  
  // 定期的にチェック
  setInterval(setupDefaultPhotoButtons, 3000);
})();