/**
 * 非常にシンプルなカメラ実装
 * 最小限の機能だけを実装して、確実に動作するようにします
 */
(function() {
  // すべてのカメラボタンを設定
  function setupCameraButtons() {
    console.log('シンプルカメラ: カメラボタンをセットアップします');
    
    try {
      // カメラ撮影ボタンのフォールバック検索
      var allButtons = document.querySelectorAll('button, a');
      var filteredButtons = [];
      
      for (var i = 0; i < allButtons.length; i++) {
        var button = allButtons[i];
        
        // アイコンチェック
        if (button.querySelector('.fa-camera')) {
          filteredButtons.push(button);
          continue;
        }
        
        // データ属性チェック
        if (button.hasAttribute('data-bs-target') && 
            button.getAttribute('data-bs-target').includes('camera')) {
          filteredButtons.push(button);
          continue;
        }
        
        // テキスト内容チェック
        var buttonText = button.textContent || button.innerText;
        if (buttonText.includes('カメラ') || buttonText.includes('撮影')) {
          filteredButtons.push(button);
          continue;
        }
      }
      
      console.log('シンプルカメラ: ' + filteredButtons.length + '個のカメラボタンを検出しました');
      
      // 各ボタンにイベントリスナーを設定
      for (var i = 0; i < filteredButtons.length; i++) {
        var button = filteredButtons[i];
        
        // すでに処理済みならスキップ
        if (button.getAttribute('data-simple-camera') === 'true') {
          continue;
        }
        
        // 元のイベントリスナーを削除するために新しいボタンに置き換え
        var newButton = button.cloneNode(true);
        if (button.parentNode) {
          button.parentNode.replaceChild(newButton, button);
        }
        
        // 新しいイベントリスナーを設定
        newButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // 関連するファイル入力を探す
          var fileInput = findNearestFileInput(this);
          var targetId = fileInput ? fileInput.id : null;
          
          // カメラモーダルを開く
          window.location.href = '/simple_test.html';
        });
        
        // 処理済みとしてマーク
        newButton.setAttribute('data-simple-camera', 'true');
      }
    } catch (error) {
      console.error('シンプルカメラ: セットアップエラー', error);
    }
  }
  
  // 最も近いファイル入力要素を取得
  function findNearestFileInput(element) {
    // 親要素をさかのぼってファイル入力を探す
    var parent = element.parentNode;
    
    // 5階層までさかのぼる
    for (var i = 0; i < 5 && parent; i++) {
      var fileInput = parent.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
      parent = parent.parentNode;
    }
    
    // ドキュメント内のすべてのファイル入力を探す
    var allInputs = document.querySelectorAll('input[type="file"]');
    return allInputs.length > 0 ? allInputs[0] : null;
  }
  
  // 遅延初期化
  setTimeout(function() {
    try {
      console.log('シンプルカメラ: 初期化開始');
      setupCameraButtons();
    } catch (error) {
      console.error('シンプルカメラ: 初期化エラー', error);
    }
  }, 1000);
})();