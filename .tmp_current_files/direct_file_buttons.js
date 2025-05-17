/**
 * 直接ファイル選択ボタンを追加する最終手段のスクリプト
 * どのような状況でも画像アップロードができるように直接ボタンをインジェクト
 */
(function() {
  console.log('直接ファイル選択ボタンを初期化');
  
  // DOMが読み込まれたら実行
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(injectUploadButtons, 1000);
    
    // モーダルが表示されたときにも実行
    document.body.addEventListener('shown.bs.modal', function() {
      setTimeout(injectUploadButtons, 500);
    });
  });
  
  /**
   * すべてのモーダルにアップロードボタンを追加
   */
  function injectUploadButtons() {
    // すべてのモーダルを対象に
    const modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
      // ファイル入力を検索
      const fileInputs = modal.querySelectorAll('input[type="file"]');
      fileInputs.forEach(function(input) {
        // すでに処理済みならスキップ
        if (input.hasAttribute('data-injected')) return;
        
        // 親のフォームグループを検索
        const formGroup = findClosestFormGroup(input);
        if (!formGroup) return;
        
        // 既存のボタンコンテナを探すか作成
        let buttonContainer = formGroup.querySelector('.file-buttons-container');
        if (!buttonContainer) {
          buttonContainer = document.createElement('div');
          buttonContainer.className = 'file-buttons-container mt-2';
          formGroup.appendChild(buttonContainer);
        }
        
        // 既に同じIDのボタンがあるかチェック
        const existingButton = buttonContainer.querySelector(`[data-for="${input.id}"]`);
        if (existingButton) return;
        
        // ラベルを探す
        const label = formGroup.querySelector('label');
        const labelText = label ? label.textContent.trim() : 'ファイル';
        
        // ファイル選択ボタンを作成
        const fileButton = document.createElement('button');
        fileButton.type = 'button';
        fileButton.className = 'btn btn-secondary me-2 mb-2';
        fileButton.innerHTML = `<i class="fas fa-upload me-2"></i> ${labelText}をアップロード`;
        fileButton.setAttribute('data-for', input.id);
        
        // クリックイベントを設定
        fileButton.addEventListener('click', function() {
          // 隠しファイル入力を作成
          const hiddenInput = document.createElement('input');
          hiddenInput.type = 'file';
          hiddenInput.accept = 'image/*';
          hiddenInput.style.display = 'none';
          document.body.appendChild(hiddenInput);
          
          // ファイル選択イベント
          hiddenInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
              // 元の入力にファイルをコピー
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(this.files[0]);
              input.files = dataTransfer.files;
              
              // 変更イベントを発火
              const event = new Event('change', { bubbles: true });
              input.dispatchEvent(event);
            }
            
            // 使用後に削除
            document.body.removeChild(hiddenInput);
          });
          
          // クリックして開く
          hiddenInput.click();
        });
        
        // ボタンコンテナに追加
        buttonContainer.appendChild(fileButton);
        
        // 処理済みとしてマーク
        input.setAttribute('data-injected', 'true');
        
        console.log(`ファイル選択ボタンを追加: ${input.id}`);
      });
    });
    
    // メインページ上のファイル入力にも対応
    const mainFileInputs = document.querySelectorAll('input[type="file"]:not([data-injected])');
    mainFileInputs.forEach(function(input) {
      // 親のフォームグループを検索
      const formGroup = findClosestFormGroup(input);
      if (!formGroup) return;
      
      // 既存のボタンコンテナを探すか作成
      let buttonContainer = formGroup.querySelector('.file-buttons-container');
      if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'file-buttons-container mt-2';
        formGroup.appendChild(buttonContainer);
      }
      
      // 既に同じIDのボタンがあるかチェック
      const existingButton = buttonContainer.querySelector(`[data-for="${input.id}"]`);
      if (existingButton) return;
      
      // ラベルを探す
      const label = formGroup.querySelector('label');
      const labelText = label ? label.textContent.trim() : 'ファイル';
      
      // ファイル選択ボタンを作成
      const fileButton = document.createElement('button');
      fileButton.type = 'button';
      fileButton.className = 'btn btn-secondary me-2 mb-2';
      fileButton.innerHTML = `<i class="fas fa-upload me-2"></i> ${labelText}をアップロード`;
      fileButton.setAttribute('data-for', input.id);
      
      // クリックイベントを設定
      fileButton.addEventListener('click', function() {
        // 隠しファイル入力を作成
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'file';
        hiddenInput.accept = 'image/*';
        hiddenInput.style.display = 'none';
        document.body.appendChild(hiddenInput);
        
        // ファイル選択イベント
        hiddenInput.addEventListener('change', function() {
          if (this.files && this.files[0]) {
            // 元の入力にファイルをコピー
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(this.files[0]);
            input.files = dataTransfer.files;
            
            // 変更イベントを発火
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
          }
          
          // 使用後に削除
          document.body.removeChild(hiddenInput);
        });
        
        // クリックして開く
        hiddenInput.click();
      });
      
      // ボタンコンテナに追加
      buttonContainer.appendChild(fileButton);
      
      // 処理済みとしてマーク
      input.setAttribute('data-injected', 'true');
      
      console.log(`メインページにファイル選択ボタンを追加: ${input.id}`);
    });
  }
  
  /**
   * 最も近いフォームグループ要素を取得
   */
  function findClosestFormGroup(element) {
    let current = element;
    while (current) {
      if (current.classList.contains('form-group') || 
          current.classList.contains('mb-3') || 
          current.classList.contains('mb-4')) {
        return current;
      }
      current = current.parentElement;
    }
    return element.parentElement;
  }
  
  // 一定間隔でボタンを追加
  setInterval(injectUploadButtons, 5000);
})();