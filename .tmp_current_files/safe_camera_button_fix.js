/**
 * カメラボタンの機能修復（UIを崩さずに直接ボタンだけを修正）
 * エラーが起きないシンプルな実装
 */
(function() {
  console.log('カメラボタン修正: 初期化中');
  
  // 初期化時に登録
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCameraFix);
  } else {
    initCameraFix();
  }
  
  // 定期的にチェック
  setInterval(initCameraFix, 3000);
  
  // DOM変更の監視
  const observer = new MutationObserver(function(mutations) {
    let shouldCheckButtons = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            // モーダルや新しいボタンが追加されたかどうか
            if (
              node.classList && (
                node.classList.contains('modal') || 
                node.classList.contains('camera-button') ||
                node.querySelector('.camera-button')
              )
            ) {
              shouldCheckButtons = true;
              break;
            }
          }
        }
      }
    }
    
    // 新しいボタンが追加されていれば確認
    if (shouldCheckButtons) {
      setTimeout(initCameraFix, 300);
    }
  });
  
  // document全体の変更を監視
  observer.observe(document.body, { childList: true, subtree: true });
  
  // カメラ修正の初期化
  function initCameraFix() {
    // カメラボタンを探す
    const buttons = document.querySelectorAll('.camera-button, .btn-primary[class*="camera"], button:has(.bi-camera), button:has(.fa-camera)');
    
    buttons.forEach(button => {
      // すでに処理済みならスキップ
      if (button.getAttribute('data-camera-fixed') === 'true') {
        return;
      }
      
      // 処理済みフラグを設定
      button.setAttribute('data-camera-fixed', 'true');
      
      console.log('カメラボタン修正: 新しいカメラボタンを検出');
      
      // オリジナルのクリックイベントを保存
      const originalClick = button.onclick;
      
      // クリックイベントを上書き
      button.onclick = function(e) {
        e.preventDefault();
        
        console.log('カメラボタン修正: カメラボタンがクリックされました');
        
        // 関連するファイル入力を探す
        const fileInput = findRelatedFileInput(button);
        
        if (fileInput) {
          console.log('カメラボタン修正: 関連するファイル入力を見つけました', fileInput.id || fileInput.name);
          
          // 1. オリジナルのイベントを試行
          if (typeof originalClick === 'function') {
            try {
              console.log('カメラボタン修正: オリジナルのイベントハンドラを実行');
              originalClick.call(button, e);
              return;
            } catch (err) {
              console.error('カメラボタン修正: オリジナルのイベントハンドラでエラー', err);
            }
          }
          
          // 2. 直接ファイル選択ダイアログを開く
          try {
            console.log('カメラボタン修正: ファイル選択ダイアログを開く');
            fileInput.click();
          } catch (clickErr) {
            console.error('カメラボタン修正: ファイル選択ダイアログでエラー', clickErr);
          }
        } else {
          console.error('カメラボタン修正: 関連するファイル入力が見つかりません');
          
          // オリジナルのイベントハンドラを試行
          if (typeof originalClick === 'function') {
            originalClick.call(button, e);
          }
        }
      };
    });
    
    // すべてのモーダル内のボタンをチェック
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      // 撮影ボタンを探す
      const captureButtons = modal.querySelectorAll('.btn-capture, #capture-btn');
      captureButtons.forEach(fixCaptureButton);
      
      // 「この写真を使用」ボタンを探す
      const usePhotoButtons = modal.querySelectorAll('.btn-use-photo, #use-photo-btn');
      usePhotoButtons.forEach(fixUsePhotoButton);
      
      // テキストでボタンを探す
      const allButtons = modal.querySelectorAll('button');
      allButtons.forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        if (text.includes('撮影')) {
          fixCaptureButton(btn);
        } else if (text.includes('この写真を使用')) {
          fixUsePhotoButton(btn);
        }
      });
    });
  }
  
  // 撮影ボタンを修正
  function fixCaptureButton(button) {
    // すでに処理済みならスキップ
    if (!button || button.getAttribute('data-fixed') === 'true') {
      return;
    }
    
    // 処理済みフラグを設定
    button.setAttribute('data-fixed', 'true');
    
    // オリジナルのクリックイベントを保存
    const originalClick = button.onclick;
    
    // クリックイベントを拡張
    button.onclick = function(e) {
      console.log('カメラボタン修正: 撮影ボタンがクリックされました');
      
      // オリジナルのイベントを実行
      if (typeof originalClick === 'function') {
        originalClick.call(this, e);
      }
      
      // ビデオ要素を探す
      const modal = button.closest('.modal');
      if (!modal) return;
      
      const video = modal.querySelector('video');
      if (!video || !video.srcObject) return;
      
      // キャンバス要素とプレビュー要素を探す
      const canvas = modal.querySelector('canvas');
      const previewImg = modal.querySelector('.preview-img, .snapshot-preview, img.preview');
      
      // 撮影処理
      try {
        if (canvas) {
          // キャンバスのサイズをビデオに合わせる
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          
          // 画像をキャンバスに描画
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // プレビュー画像を表示
          if (previewImg) {
            previewImg.src = canvas.toDataURL('image/jpeg');
            previewImg.style.display = 'block';
          }
          
          // ビデオを非表示、プレビューを表示
          video.style.display = 'none';
          if (canvas.parentNode) {
            canvas.parentNode.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('カメラボタン修正: 撮影処理でエラー', err);
      }
    };
  }
  
  // 写真使用ボタンを修正
  function fixUsePhotoButton(button) {
    // すでに処理済みならスキップ
    if (!button || button.getAttribute('data-fixed') === 'true') {
      return;
    }
    
    // 処理済みフラグを設定
    button.setAttribute('data-fixed', 'true');
    
    // オリジナルのクリックイベントを保存
    const originalClick = button.onclick;
    
    // クリックイベントを拡張
    button.onclick = function(e) {
      console.log('カメラボタン修正: 写真使用ボタンがクリックされました');
      
      // オリジナルのイベントを実行
      if (typeof originalClick === 'function') {
        originalClick.call(this, e);
      }
      
      // モーダルを閉じる
      const modal = button.closest('.modal');
      if (modal) {
        try {
          // Bootstrapモーダルを閉じる
          if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
              bsModal.hide();
              return;
            }
          }
          
          // 手動で閉じる
          modal.style.display = 'none';
          modal.classList.remove('show');
          
          // 背景を削除
          document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          
          // bodyのスタイルをリセット
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
        } catch (closeErr) {
          console.error('カメラボタン修正: モーダルを閉じる際にエラー', closeErr);
        }
      }
    };
  }
  
  // 関連するファイル入力を探す
  function findRelatedFileInput(button) {
    // 1. フォームグループ内を探す
    const formGroup = findParentElement(button, '.form-group, .mb-3, .mb-4, .input-group');
    
    if (formGroup) {
      const fileInput = formGroup.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 2. 近くの要素を探す
    let parent = button.parentNode;
    let searchDepth = 0;
    const maxDepth = 5; // 最大探索深度
    
    while (parent && parent !== document.body && searchDepth < maxDepth) {
      const fileInput = parent.querySelector('input[type="file"]');
      if (fileInput) {
        return fileInput;
      }
      parent = parent.parentNode;
      searchDepth++;
    }
    
    // 3. データ属性を探す
    const targetId = button.getAttribute('data-target') || button.getAttribute('data-bs-target');
    if (targetId && targetId.startsWith('#')) {
      const fileInput = document.querySelector(targetId + ' input[type="file"]') || document.querySelector('input[type="file"]' + targetId);
      if (fileInput) {
        return fileInput;
      }
    }
    
    // 4. 同じフォーム内で探す
    const form = button.closest('form');
    if (form) {
      const fileInputs = form.querySelectorAll('input[type="file"]');
      if (fileInputs.length === 1) {
        // フォーム内にファイル入力が1つしかなければそれを使用
        return fileInputs[0];
      }
    }
    
    // 5. ボタンのテキストから関連する入力を推測
    const buttonText = button.textContent.toLowerCase();
    const allFileInputs = document.querySelectorAll('input[type="file"]');
    
    // ボタンテキストに「表面」「裏面」などのキーワードがあれば対応する入力を探す
    if (allFileInputs.length > 0) {
      if (buttonText.includes('表面')) {
        for (const input of allFileInputs) {
          const inputId = input.id || '';
          const inputName = input.name || '';
          if (inputId.includes('front') || inputName.includes('front') || 
              inputId.includes('obverse') || inputName.includes('obverse')) {
            return input;
          }
        }
      } else if (buttonText.includes('裏面')) {
        for (const input of allFileInputs) {
          const inputId = input.id || '';
          const inputName = input.name || '';
          if (inputId.includes('back') || inputName.includes('back') || 
              inputId.includes('reverse') || inputName.includes('reverse')) {
            return input;
          }
        }
      }
    }
    
    // 6. 最後の手段：可視状態のファイル入力を探す
    for (const input of allFileInputs) {
      const style = window.getComputedStyle(input);
      if (style.display !== 'none' && style.visibility !== 'hidden') {
        return input;
      }
    }
    
    // 見つからなければnullを返す
    return null;
  }
  
  // 指定したセレクターに一致する親要素を探す
  function findParentElement(element, selector) {
    while (element && element !== document.body) {
      if (element.matches && element.matches(selector)) {
        return element;
      }
      element = element.parentNode;
    }
    return null;
  }
})();