/**
 * カメラ機能の代わりにファイルアップロードボタンを表示する
 * 既存のカメラボタンの横にファイルアップロードボタンを追加
 */
(function() {
  console.log('ファイルアップロードアダプター初期化');
  
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', init);
  
  /**
   * 初期化処理
   */
  function init() {
    // すべてのカメラボタンを監視して、横にファイルアップロードボタンを追加
    setupInitialButtons();
    
    // モーダルが表示されたときのイベントリスナー
    document.body.addEventListener('shown.bs.modal', function(e) {
      // モーダル内のカメラボタンを設定
      setTimeout(setupInitialButtons, 200);
    });
  }
  
  /**
   * ページ内の全てのカメラボタンに対応するファイルアップロードボタンを追加
   */
  function setupInitialButtons() {
    // すべてのカメラボタンを検索
    const cameraButtons = document.querySelectorAll('.camera-button');
    console.log(`カメラボタン検出: ${cameraButtons.length}個`);
    
    cameraButtons.forEach(function(button) {
      // すでに処理済みならスキップ
      if (button.hasAttribute('data-upload-added')) return;
      
      // ターゲットIDを取得
      const targetId = button.getAttribute('data-target');
      if (!targetId) return;
      
      // ターゲット入力要素を取得
      const fileInput = document.getElementById(targetId);
      if (!fileInput) return;
      
      // カメラボタンの親要素
      const parent = button.parentElement;
      
      // アップロードボタンを作成
      const uploadButton = document.createElement('button');
      uploadButton.type = 'button';
      uploadButton.className = 'btn btn-secondary upload-button ms-2';
      uploadButton.innerHTML = '<i class="fas fa-upload me-1"></i> アップロード';
      uploadButton.setAttribute('data-target', targetId);
      
      // クリックイベントリスナー
      uploadButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 隠しファイル入力を作成して使用
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'file';
        hiddenInput.accept = 'image/*';
        hiddenInput.style.display = 'none';
        document.body.appendChild(hiddenInput);
        
        // ファイル選択時の処理
        hiddenInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            // オリジナルのファイル入力にコピー
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(this.files[0]);
            fileInput.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
          }
          
          // 使用後に隠しファイル入力を削除
          document.body.removeChild(hiddenInput);
        });
        
        // ファイル選択ダイアログを開く
        hiddenInput.click();
      });
      
      // アップロードボタンを追加
      parent.insertBefore(uploadButton, button.nextSibling);
      
      // 処理済みとしてマーク
      button.setAttribute('data-upload-added', 'true');
      
      console.log(`アップロードボタンを追加: ${targetId}`);
    });
  }
  
  // 一定間隔でボタンチェック
  setInterval(setupInitialButtons, 2000);
})();