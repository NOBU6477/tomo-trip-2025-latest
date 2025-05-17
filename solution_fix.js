/**
 * 最終的な修正スクリプト - UIを崩さず安定して動作する
 */
document.addEventListener("DOMContentLoaded", function() {
  // マスター言語設定 - 日本語を確保
  if (window.i18n) {
    window.i18n.currentLang = 'ja';
  }
  
  // 直接置換テーブル - UI要素のテキストを直接置換
  const REPLACE_TABLE = {
    'photo front': '表面写真',
    'photo back': '裏面写真',
    'photo dual requirements': '表裏写真の要件',
    'PHOTO FRONT SELECT': '表面写真を選択',
    'PHOTO BACK SELECT': '裏面写真を選択',
    '証明写真タイプ': '観光客'
  };
  
  // 1. 初期起動時にすべてのテキストを変更
  fixAllText();
  
  // 2. DOM変更を監視（モーダル表示などを検出）
  const observer = new MutationObserver(function(mutations) {
    let shouldFix = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === 1) {
            shouldFix = true;
            break;
          }
        }
      }
      
      if (shouldFix) break;
    }
    
    if (shouldFix) {
      // テキスト変更と「この写真を使用」ボタン追加を実行
      setTimeout(function() {
        fixAllText();
        addUsePhotoButton();
      }, 200);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 定期的にも確認（他の方法で追加された場合に対応）
  setInterval(function() {
    fixAllText();
    addUsePhotoButton();
  }, 1000);
  
  /**
   * 文書内のすべてのテキストを修正
   */
  function fixAllText() {
    // 1. 見出しやラベルの修正
    const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, span, div, button, a');
    
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      
      // テキストコンテンツがあるか確認
      if (element.textContent && element.textContent.trim()) {
        const text = element.textContent.trim();
        
        // 置換テーブルに基づいて内容を変更
        for (const key in REPLACE_TABLE) {
          if (text === key) {
            element.textContent = REPLACE_TABLE[key];
            break;
          }
        }
      }
    }
    
    // 2. アカウントタイプの「証明写真タイプ」→「観光客」修正
    const cards = document.querySelectorAll('.card-title');
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].textContent === '証明写真タイプ') {
        cards[i].textContent = '観光客';
      }
    }
    
    // 3. 型バックアップ: 強制的な翻訳オブジェクト上書き
    if (window.i18n && window.i18n.dictionary) {
      if (window.i18n.dictionary.ja) {
        // 日本語の翻訳を強制的に上書き
        window.i18n.dictionary.ja['photo.front'] = '表面写真';
        window.i18n.dictionary.ja['photo.back'] = '裏面写真';
        window.i18n.dictionary.ja['photo.select_front'] = '表面写真を選択';
        window.i18n.dictionary.ja['photo.select_back'] = '裏面写真を選択';
        window.i18n.dictionary.ja['auth.tourist'] = '観光客';
        window.i18n.dictionary.ja['auth.document_type'] = '観光客';
      }
    }
  }
  
  /**
   * 「この写真を使用」ボタンをカメラモーダルに追加
   */
  function addUsePhotoButton() {
    // すべてのモーダルを探す
    const modals = document.querySelectorAll('.modal.show');
    
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      const title = modal.querySelector('.modal-title');
      
      if (title && (title.textContent.includes('写真') || title.textContent.includes('撮影'))) {
        // 画像があるか確認
        const image = modal.querySelector('img');
        if (image && image.src && !image.src.endsWith('data:,')) {
          // すでに写真が撮影されている場合は「この写真を使用」ボタンを確保
          ensureUsePhotoButton(modal);
        }
        
        // 撮影ボタンのイベントを拡張
        const captureBtn = findButton(modal, '撮影');
        if (captureBtn && !captureBtn._enhanced) {
          captureBtn._enhanced = true;
          captureBtn.addEventListener('click', function() {
            setTimeout(function() {
              ensureUsePhotoButton(modal);
            }, 500);
          });
        }
      }
    }
  }
  
  /**
   * 指定したテキストを含むボタンを探す
   */
  function findButton(container, text) {
    const buttons = container.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent.includes(text)) {
        return buttons[i];
      }
    }
    return null;
  }
  
  /**
   * 「この写真を使用」ボタンを確保
   */
  function ensureUsePhotoButton(modal) {
    // すでにある場合は何もしない
    if (findButton(modal, 'この写真を使用')) {
      return;
    }
    
    // 追加する場所を決定
    const footer = modal.querySelector('.modal-footer');
    if (!footer) {
      return;
    }
    
    // ボタン作成
    const useButton = document.createElement('button');
    useButton.type = 'button';
    useButton.className = 'btn btn-success';
    useButton.textContent = 'この写真を使用';
    useButton.style.width = '100%';
    useButton.style.marginTop = '10px';
    
    // ビデオと撮影ボタンを非表示に
    const video = modal.querySelector('video');
    if (video) {
      video.style.display = 'none';
      
      // ストリームも停止
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
    
    const captureBtn = findButton(modal, '撮影');
    if (captureBtn) {
      captureBtn.style.display = 'none';
    }
    
    // クリックイベント - 画像を保存して閉じる
    useButton.addEventListener('click', function() {
      // 画像データを取得
      const img = modal.querySelector('img');
      if (!img || !img.src) {
        closeModal(modal);
        return;
      }
      
      // 写真タイプを判定
      const isBack = modal.querySelector('.modal-title').textContent.includes('裏面');
      const photoType = isBack ? 'back' : 'front';
      
      // 画像データを保存
      window._tempImageData = {
        data: img.src,
        type: photoType
      };
      
      // モーダルを閉じる
      closeModal(modal);
      
      // メインページの表示を更新
      setTimeout(updateMainPagePhoto, 300);
    });
    
    // モーダルに追加
    footer.appendChild(useButton);
    
    // 「撮影された写真の確認」メッセージを表示
    let confirmMsg = modal.querySelector('.confirmation-message');
    if (!confirmMsg) {
      confirmMsg = document.createElement('h6');
      confirmMsg.className = 'text-center mt-3 confirmation-message';
      confirmMsg.textContent = '撮影された写真の確認';
      
      const body = modal.querySelector('.modal-body');
      if (body) {
        body.appendChild(confirmMsg);
      }
    }
  }
  
  /**
   * モーダルを閉じる
   */
  function closeModal(modal) {
    // 閉じるボタンをクリック
    const closeButton = modal.querySelector('.btn-close, [data-bs-dismiss="modal"]');
    if (closeButton) {
      closeButton.click();
      return;
    }
    
    // または Bootstrap API を使用
    try {
      if (typeof bootstrap !== 'undefined') {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
          return;
        }
      }
    } catch (e) {
      console.error('Bootstrap API 利用エラー:', e);
    }
    
    // 最後の手段: 直接 DOM 操作
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
    
    // 背景も削除
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }
  
  /**
   * メインページの写真表示を更新
   */
  function updateMainPagePhoto() {
    // 保存したデータを取得
    const tempData = window._tempImageData;
    if (!tempData || !tempData.data) return;
    
    const photoType = tempData.type;
    const imageData = tempData.data;
    
    // 表・裏で ID を決定
    const imgId = photoType === 'back' ? 'back-photo-image' : 'id-photo-image';
    const previewId = photoType === 'back' ? 'back-photo-preview' : 'id-photo-preview';
    const placeholderId = photoType === 'back' ? 'back-photo-placeholder' : 'id-photo-placeholder';
    const inputId = photoType === 'back' ? 'back-photo-input' : 'id-photo-input';
    
    // 画像を更新
    const img = document.getElementById(imgId);
    if (img) {
      img.src = imageData;
      img.style.display = 'block';
      
      // 親要素も表示
      const parent = img.parentElement;
      if (parent) {
        parent.style.display = 'block';
        parent.classList.remove('d-none');
      }
    }
    
    // プレビュー表示
    const preview = document.getElementById(previewId);
    if (preview) {
      preview.style.display = 'block';
      preview.classList.remove('d-none');
    }
    
    // プレースホルダー非表示
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.style.display = 'none';
      placeholder.classList.add('d-none');
    }
    
    // ファイル入力更新
    const input = document.getElementById(inputId);
    if (input && input.type === 'file') {
      updateFileInput(input, imageData);
    }
  }
  
  /**
   * ファイル入力を更新
   */
  function updateFileInput(input, dataURL) {
    try {
      // データURLをBlobに変換
      const blob = dataURLToBlob(dataURL);
      
      // Fileオブジェクトを作成
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // DataTransferオブジェクトを使用
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    } catch (e) {
      console.error('ファイル入力更新エラー:', e);
    }
  }
  
  /**
   * データURLをBlobに変換
   */
  function dataURLToBlob(dataURL) {
    // データURLの形式をチェック
    const match = dataURL.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      console.error('無効なデータURL形式');
      return new Blob([''], { type: 'image/jpeg' });
    }
    
    const contentType = match[1];
    const base64 = match[2];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    
    return new Blob([array], { type: contentType });
  }
});