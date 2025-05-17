/**
 * ガイド登録画面専用の直接写真修正スクリプト
 * 最も単純で直接的なアプローチで実装
 */
(function() {
  // スマートフォンでは実行しない
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('モバイルデバイスでは実行しません');
    return;
  }

  console.log('ガイド登録写真モジュール: 起動');

  // 初期化
  function initialize() {
    // 既存のモーダルをすぐにチェック
    setTimeout(checkGuideModal, 500);
    
    // モーダル表示イベントを監視
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      if (isGuideModal(modal)) {
        console.log('ガイド登録モーダルを検出');
        setupDualPhoto(modal);
      }
    });
    
    // セレクト変更イベントを監視
    document.addEventListener('change', function(event) {
      if (event.target.tagName === 'SELECT') {
        // 運転免許証選択を検出
        if (isDriverLicense(event.target)) {
          const modal = findParentModal(event.target);
          if (modal && isGuideModal(modal)) {
            console.log('運転免許証選択を検出: ガイド登録');
            setupDualPhoto(modal);
          }
        }
      }
    });
    
    // 定期的にモーダルをチェック
    setInterval(checkGuideModal, 2000);
  }
  
  // 既存のガイドモーダルをチェック
  function checkGuideModal() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      if (isGuideModal(modal)) {
        setupDualPhoto(modal);
      }
    });
  }
  
  // ガイド登録モーダルか判定
  function isGuideModal(modal) {
    // タイトル要素を探す
    const headers = modal.querySelectorAll('.modal-header, .modal-title, h5');
    for (let i = 0; i < headers.length; i++) {
      const text = headers[i].textContent || '';
      if (text.includes('ガイド登録') || text.includes('Guide Registration')) {
        return true;
      }
    }
    
    // モーダル全体のテキストで判定
    const modalText = modal.textContent || '';
    return modalText.includes('ガイド登録') && 
           (modalText.includes('証明写真') || modalText.includes('photo'));
  }
  
  // 運転免許証選択チェック
  function isDriverLicense(select) {
    if (!select || !select.options || select.selectedIndex < 0) return false;
    
    const selectedText = select.options[select.selectedIndex].textContent || '';
    return selectedText.includes('運転免許証') || 
           (selectedText.toLowerCase().includes('driver') && 
            selectedText.toLowerCase().includes('license'));
  }
  
  // 親モーダルを探す
  function findParentModal(element) {
    let current = element;
    let depth = 0;
    
    while (current && depth < 10) {
      if (current.classList && current.classList.contains('modal')) {
        return current;
      }
      current = current.parentElement;
      depth++;
    }
    
    return null;
  }
  
  // 表裏写真機能をセットアップ
  function setupDualPhoto(modal) {
    // すでに処理済みか確認
    if (modal.querySelector('#guide-dual-photo-marker')) {
      return;
    }
    
    console.log('表裏写真機能をセットアップします');
    
    // 処理済みマーカーを設定
    const marker = document.createElement('div');
    marker.id = 'guide-dual-photo-marker';
    marker.style.display = 'none';
    modal.appendChild(marker);
    
    // ラジオボタン選択
    selectDualPhotoRadio(modal);
    
    // 写真エリアをセットアップ
    setupPhotoArea(modal);
  }
  
  // 表裏写真ラジオボタン選択
  function selectDualPhotoRadio(modal) {
    const radioButtons = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    
    if (radioButtons.length >= 2) {
      // 2番目のラジオボタン（表裏写真）選択
      radioButtons[1].checked = true;
      
      // イベント発火
      try {
        const event = new Event('change', { bubbles: true });
        radioButtons[1].dispatchEvent(event);
        console.log('表裏写真ラジオボタン選択完了');
      } catch (e) {
        console.warn('ラジオボタンイベント発火エラー:', e);
      }
    } else {
      console.warn('ラジオボタンが見つかりません');
    }
  }
  
  // 写真エリアのセットアップ
  function setupPhotoArea(modal) {
    // 1. 写真エリアを見つける
    const photoSection = findPhotoSection(modal);
    if (!photoSection) {
      console.warn('写真セクションが見つかりません');
      return;
    }
    
    console.log('写真セクションを発見:', photoSection);
    
    // 2. 表面ラベルを追加
    if (!photoSection.querySelector('.front-photo-label')) {
      const frontLabel = document.createElement('div');
      frontLabel.className = 'front-photo-label';
      frontLabel.textContent = '表面の写真';
      frontLabel.style.fontWeight = 'bold';
      frontLabel.style.marginBottom = '10px';
      frontLabel.style.color = '#333';
      
      // 写真セクションの先頭に挿入
      photoSection.insertBefore(frontLabel, photoSection.firstChild);
    }
    
    // 3. 裏面写真エリアが既にあるか確認
    if (modal.querySelector('.back-photo-section')) {
      return;
    }
    
    // 4. 裏面写真セクション作成
    const backSection = document.createElement('div');
    backSection.className = 'back-photo-section';
    backSection.style.marginTop = '20px';
    backSection.style.paddingTop = '15px';
    backSection.style.borderTop = '1px solid #ddd';
    
    // 裏面ラベル
    const backLabel = document.createElement('div');
    backLabel.className = 'back-photo-label';
    backLabel.textContent = '裏面の写真';
    backLabel.style.fontWeight = 'bold';
    backLabel.style.marginBottom = '10px';
    backLabel.style.color = '#333';
    backSection.appendChild(backLabel);
    
    // プレビューエリア
    const previewArea = document.createElement('div');
    previewArea.className = 'preview-area';
    previewArea.style.width = '100%';
    previewArea.style.height = '150px';
    previewArea.style.border = '1px dashed #ccc';
    previewArea.style.borderRadius = '4px';
    previewArea.style.backgroundColor = '#f9f9f9';
    previewArea.style.display = 'flex';
    previewArea.style.alignItems = 'center';
    previewArea.style.justifyContent = 'center';
    previewArea.style.marginBottom = '15px';
    previewArea.style.position = 'relative';
    
    // プレビュー画像
    const previewImage = document.createElement('img');
    previewImage.className = 'back-preview-image';
    previewImage.alt = '裏面写真プレビュー';
    previewImage.style.maxWidth = '100%';
    previewImage.style.maxHeight = '100%';
    previewImage.style.display = 'none';
    previewArea.appendChild(previewImage);
    
    // プレースホルダー
    const placeholder = document.createElement('div');
    placeholder.textContent = '裏面写真はまだ設定されていません';
    placeholder.style.color = '#999';
    previewArea.appendChild(placeholder);
    
    backSection.appendChild(previewArea);
    
    // ボタンエリア
    const buttonArea = document.createElement('div');
    buttonArea.className = 'd-grid gap-2';
    
    // ファイル選択ボタン
    const fileButton = document.createElement('button');
    fileButton.type = 'button';
    fileButton.className = 'btn btn-primary mb-2';
    fileButton.innerHTML = '<i class="bi bi-file-earmark-image"></i> ファイルを選択';
    fileButton.onclick = function() {
      fileInput.click();
    };
    buttonArea.appendChild(fileButton);
    
    // カメラボタン
    const cameraButton = document.createElement('button');
    cameraButton.type = 'button';
    cameraButton.className = 'btn btn-outline-secondary';
    cameraButton.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
    cameraButton.onclick = function() {
      alert('裏面カメラ機能のデモです');
    };
    buttonArea.appendChild(cameraButton);
    
    backSection.appendChild(buttonArea);
    
    // 非表示ファイル入力
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.onchange = function() {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          previewImage.style.display = 'block';
          placeholder.style.display = 'none';
          
          // 隠しフィールドにデータを設定
          hiddenField.value = e.target.result;
        };
        
        reader.readAsDataURL(file);
      }
    };
    backSection.appendChild(fileInput);
    
    // 隠しフィールド
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'backPhotoData';
    hiddenField.className = 'back-photo-data';
    backSection.appendChild(hiddenField);
    
    // 裏面セクションを挿入
    photoSection.parentNode.insertBefore(backSection, photoSection.nextSibling);
    console.log('裏面写真セクションを挿入しました');
  }
  
  // 写真セクションを見つける
  function findPhotoSection(modal) {
    // 方法1: 写真に関するテキストを含む要素を探す
    const photoTexts = ['写真について', 'photo title', 'About Photo'];
    for (let i = 0; i < photoTexts.length; i++) {
      const elements = Array.from(modal.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.trim() === photoTexts[i]
      );
      
      if (elements.length > 0) {
        // 見つかった要素の次の要素を探す
        let next = elements[0].nextElementSibling;
        while (next) {
          // 画像またはファイル入力がある要素を返す
          if (next.querySelector('img') || next.querySelector('input[type="file"]')) {
            return next;
          }
          next = next.nextElementSibling;
        }
        
        // 親要素の次を探す
        const parent = elements[0].parentElement;
        if (parent) {
          next = parent.nextElementSibling;
          while (next) {
            if (next.querySelector('img') || next.querySelector('input[type="file"]')) {
              return next;
            }
            next = next.nextElementSibling;
          }
        }
      }
    }
    
    // 方法2: 証明写真タイプのラジオボタンの親要素の次の要素を探す
    const radioButtons = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    if (radioButtons.length > 0) {
      let radioParent = radioButtons[0].parentElement;
      while (radioParent && !radioParent.classList.contains('form-group') && 
             !radioParent.classList.contains('mb-3')) {
        radioParent = radioParent.parentElement;
      }
      
      if (radioParent) {
        let next = radioParent.nextElementSibling;
        while (next) {
          if (next.querySelector('img') || next.querySelector('input[type="file"]')) {
            return next;
          }
          next = next.nextElementSibling;
        }
      }
    }
    
    // 方法3: モーダルボディ内の画像またはファイル入力を含む最初の要素
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      const elements = modalBody.querySelectorAll('div');
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].querySelector('img') || elements[i].querySelector('input[type="file"]')) {
          return elements[i];
        }
      }
    }
    
    // 方法4: 最も単純に - 既存のプレビュー画像を探す
    const previewImages = modal.querySelectorAll('img.preview-image, img[alt="写真プレビュー"]');
    if (previewImages.length > 0) {
      let parent = previewImages[0].parentElement;
      while (parent && parent !== modal && 
             !parent.classList.contains('form-group') && 
             !parent.classList.contains('mb-3')) {
        parent = parent.parentElement;
      }
      
      return parent || previewImages[0].parentElement;
    }
    
    // 方法5: ファイル入力を探す
    const fileInputs = modal.querySelectorAll('input[type="file"]');
    if (fileInputs.length > 0) {
      let parent = fileInputs[0].parentElement;
      while (parent && parent !== modal && 
             !parent.classList.contains('form-group') && 
             !parent.classList.contains('mb-3')) {
        parent = parent.parentElement;
      }
      
      return parent || fileInputs[0].parentElement;
    }
    
    return null;
  }
  
  // ページ読み込み完了時または即時実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();