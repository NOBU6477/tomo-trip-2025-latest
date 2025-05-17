/**
 * カメラボタンのデバッグスクリプト
 * 関連イベントを監視してコンソールに出力
 */
(function() {
  console.log('カメラボタンデバッグスクリプトを初期化');

  // グローバル変数として直接関数を公開
  window.openCameraModalDebug = function(targetId) {
    console.log('DEBUG: openCameraModalDebug が呼び出されました', targetId);
    alert('カメラ機能テスト: ' + targetId);
    
    // 実際のカメラモーダルを表示
    const modalHTML = `
      <div id="debug-camera-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;flex-direction:column;color:white;">
        <div style="padding:20px;display:flex;justify-content:space-between;background:#333;">
          <h3>デバッグカメラモーダル</h3>
          <button id="debug-close-btn" style="background:none;border:none;color:white;font-size:20px;">×</button>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:20px;">
          <p>ターゲットID: ${targetId}</p>
          <button id="debug-capture-btn" style="padding:10px 20px;background:#28a745;color:white;border:none;border-radius:5px;margin-top:20px;">テスト撮影</button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('debug-close-btn').addEventListener('click', function() {
      document.getElementById('debug-camera-modal').remove();
    });
    
    document.getElementById('debug-capture-btn').addEventListener('click', function() {
      alert('写真撮影テスト完了');
      document.getElementById('debug-camera-modal').remove();
    });
  };

  // DOMの読み込みが完了したら実行
  document.addEventListener('DOMContentLoaded', function() {
    // すべてのカメラボタンを直接ハードコーディングして登録
    const targetIds = [
      'passport-file',
      'license-front-file',
      'license-back-file',
      'idcard-front-file',
      'idcard-back-file',
      'residencecard-front-file',
      'residencecard-back-file',
      'profile_photo',
      'guide_profile_photo'
    ];
    
    // 各ボタンに直接イベントハンドラを追加
    targetIds.forEach(targetId => {
      const selectors = [
        `.camera-button[data-target="${targetId}"]`,
        `#${targetId}-camera-btn`
      ];
      
      selectors.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        if (buttons.length > 0) {
          console.log(`DEBUG: ボタンが見つかりました: ${selector} (${buttons.length}個)`);
          
          buttons.forEach((button, index) => {
            // 既存のイベントをすべて削除
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // 直接クリックイベントを設定
            newButton.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              
              console.log(`DEBUG: カメラボタンがクリックされました: ${selector} #${index}`, targetId);
              window.openCameraModalDebug(targetId);
            });
            
            // スタイルで識別
            newButton.style.border = '2px solid red';
            newButton.style.position = 'relative';
            
            // 識別用の番号を表示
            const badge = document.createElement('span');
            badge.textContent = index + 1;
            badge.style.position = 'absolute';
            badge.style.top = '-5px';
            badge.style.right = '-5px';
            badge.style.backgroundColor = 'red';
            badge.style.color = 'white';
            badge.style.borderRadius = '50%';
            badge.style.width = '20px';
            badge.style.height = '20px';
            badge.style.display = 'flex';
            badge.style.alignItems = 'center';
            badge.style.justifyContent = 'center';
            badge.style.fontSize = '12px';
            newButton.appendChild(badge);
          });
        } else {
          console.log(`DEBUG: ボタンが見つかりません: ${selector}`);
        }
      });
    });
    
    // モーダル表示時にもカメラボタンを登録
    document.body.addEventListener('shown.bs.modal', function(e) {
      setTimeout(() => {
        console.log('DEBUG: モーダルが表示されました', e.target.id);
        
        // モーダル内のカメラボタンを検出
        const modalCameraButtons = e.target.querySelectorAll('.camera-button');
        console.log(`DEBUG: モーダル内のカメラボタン: ${modalCameraButtons.length}個`);
        
        modalCameraButtons.forEach((button, index) => {
          const targetId = button.getAttribute('data-target');
          console.log(`DEBUG: モーダル内カメラボタン #${index}`, targetId);
          
          // 既存のイベントをすべて削除
          const newButton = button.cloneNode(true);
          button.parentNode.replaceChild(newButton, button);
          
          // 直接クリックイベントを設定
          newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`DEBUG: モーダル内カメラボタンがクリックされました #${index}`, targetId);
            window.openCameraModalDebug(targetId);
          });
          
          // スタイルで識別
          newButton.style.border = '2px solid blue';
          
          // 識別用の番号を表示
          const badge = document.createElement('span');
          badge.textContent = 'M' + (index + 1);
          badge.style.position = 'absolute';
          badge.style.top = '-5px';
          badge.style.right = '-5px';
          badge.style.backgroundColor = 'blue';
          badge.style.color = 'white';
          badge.style.borderRadius = '50%';
          badge.style.width = '20px';
          badge.style.height = '20px';
          badge.style.display = 'flex';
          badge.style.alignItems = 'center';
          badge.style.justifyContent = 'center';
          badge.style.fontSize = '12px';
          newButton.appendChild(badge);
        });
      }, 500);
    });
    
    // ページに表示されているすべてのカメラボタンをデバッグ表示
    const allCameraButtons = document.querySelectorAll('.camera-button');
    console.log(`DEBUG: ページ上のカメラボタン総数: ${allCameraButtons.length}個`);
    allCameraButtons.forEach((button, index) => {
      const targetId = button.getAttribute('data-target');
      const id = button.id;
      console.log(`DEBUG: カメラボタン #${index}`, { id, targetId });
    });
    
    // エクストラボタンを追加（テスト用）
    const testButton = document.createElement('button');
    testButton.textContent = 'カメラテスト';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '20px';
    testButton.style.right = '20px';
    testButton.style.padding = '10px';
    testButton.style.backgroundColor = '#dc3545';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.zIndex = '9000';
    
    testButton.addEventListener('click', function() {
      window.openCameraModalDebug('テストボタン');
    });
    
    document.body.appendChild(testButton);
  });
  
  // 遅延して初期化（DOMContentLoadedが発火した後に実行するため）
  setTimeout(function() {
    console.log('DEBUG: 遅延初期化を実行');
    
    // カメラボタンの状態を確認
    const allCameraButtons = document.querySelectorAll('.camera-button');
    console.log(`DEBUG: 遅延初期化後のカメラボタン総数: ${allCameraButtons.length}個`);
    
    // すべてのカメラボタンに直接イベントハンドラを追加
    allCameraButtons.forEach((button, index) => {
      const targetId = button.getAttribute('data-target');
      console.log(`DEBUG: 遅延初期化でカメラボタンを処理 #${index}`, targetId);
      
      // イベントを上書き
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log(`DEBUG: 遅延初期化したカメラボタンがクリックされました #${index}`, targetId);
        window.openCameraModalDebug(targetId);
      });
    });
  }, 2000);
})();