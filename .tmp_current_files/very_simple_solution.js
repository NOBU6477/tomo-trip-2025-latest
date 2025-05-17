/**
 * 最もシンプルな表裏写真実装
 * すべての複雑さを排除し、単純な方法で実装
 */
document.addEventListener('DOMContentLoaded', function() {
  // スマートフォンでは実行しない
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('モバイルデバイスでは実行しません');
    return;
  }

  console.log('超シンプルな表裏写真機能を初期化');
  
  // モーダル表示を監視
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    setTimeout(function() {
      handleModal(modal);
    }, 300);
  });
  
  // セレクト変更を監視
  document.addEventListener('change', function(event) {
    if (event.target.tagName === 'SELECT') {
      const select = event.target;
      // 運転免許証選択チェック
      if (isDriverLicense(select)) {
        console.log('運転免許証選択検出');
        const modal = findParentModal(select);
        if (modal) {
          handleModal(modal);
        }
      }
    }
  });
  
  // 既存モーダルを処理
  setTimeout(function() {
    const visibleModals = document.querySelectorAll('.modal.show');
    visibleModals.forEach(handleModal);
  }, 500);
  
  // モーダルを処理
  function handleModal(modal) {
    // ラジオボタン選択
    const photoTypeRadios = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    if (photoTypeRadios.length >= 2) {
      // 2番目のラジオボタン（表裏写真）を選択
      photoTypeRadios[1].checked = true;
      
      try {
        const event = new Event('change', { bubbles: true });
        photoTypeRadios[1].dispatchEvent(event);
      } catch (e) {
        console.warn('ラジオボタンイベントエラー:', e);
      }
    }
    
    // 写真エリアを処理
    setupPhotoArea(modal);
  }
  
  // 写真エリアをセットアップ
  function setupPhotoArea(modal) {
    // 既に処理済みかチェック
    if (modal.getAttribute('data-dual-photo-setup') === 'true') {
      return;
    }
    
    // 写真コンテナを探す（複数の方法で）
    let photoContainer = null;
    
    // 方法1: プレビュー画像から
    const previewImages = modal.querySelectorAll('img.preview-image, img[alt="写真プレビュー"]');
    if (previewImages.length > 0) {
      photoContainer = previewImages[0].closest('.form-group, .mb-3') || previewImages[0].parentElement;
    }
    
    // 方法2: ファイル入力から
    if (!photoContainer) {
      const fileInputs = modal.querySelectorAll('input[type="file"]');
      if (fileInputs.length > 0) {
        photoContainer = fileInputs[0].closest('.form-group, .mb-3') || fileInputs[0].parentElement;
      }
    }
    
    // 方法3: ボタンから
    if (!photoContainer) {
      const buttons = modal.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        const text = buttons[i].textContent || '';
        if (text.includes('カメラ') || text.includes('ファイル') || 
            text.includes('Camera') || text.includes('File')) {
          photoContainer = buttons[i].closest('.form-group, .mb-3') || buttons[i].parentElement;
          if (photoContainer) break;
        }
      }
    }
    
    if (!photoContainer) {
      console.warn('写真コンテナが見つかりません');
      return;
    }
    
    console.log('写真コンテナを発見:', photoContainer);
    
    // 表面ラベル追加
    if (!photoContainer.querySelector('.front-photo-label')) {
      const frontLabel = document.createElement('div');
      frontLabel.className = 'front-photo-label';
      frontLabel.textContent = '表面の写真';
      frontLabel.style.fontWeight = 'bold';
      frontLabel.style.marginBottom = '8px';
      frontLabel.style.color = '#333';
      
      photoContainer.insertBefore(frontLabel, photoContainer.firstChild);
    }
    
    // 裏面コンテナが既にあるかチェック
    if (modal.querySelector('.back-photo-container')) {
      return;
    }
    
    // 裏面写真コンテナ作成
    const backContainer = document.createElement('div');
    backContainer.className = 'back-photo-container';
    backContainer.style.marginTop = '20px';
    backContainer.style.paddingTop = '15px';
    backContainer.style.borderTop = '1px solid #ddd';
    
    // シンプルなHTML構造で作成
    backContainer.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; color: #333;">裏面の写真</div>
      <div style="width: 100%; height: 150px; border: 1px dashed #ccc; border-radius: 4px; background-color: #f9f9f9; 
                  display: flex; align-items: center; justify-content: center; margin-bottom: 10px; position: relative;">
        <img class="back-preview-image" alt="裏面写真プレビュー" style="max-width: 100%; max-height: 100%; display: none;">
        <div class="back-placeholder" style="color: #999;">裏面写真はまだ設定されていません</div>
      </div>
      <div class="d-grid gap-2">
        <button type="button" class="btn btn-primary mb-2 file-select-btn">
          <i class="bi bi-file-earmark-image"></i> ファイルを選択
        </button>
        <button type="button" class="btn btn-outline-secondary camera-btn">
          <i class="bi bi-camera"></i> カメラで撮影
        </button>
      </div>
      <input type="file" accept="image/*" style="display: none;" class="back-file-input">
      <input type="hidden" name="backPhotoData" class="back-photo-data">
    `;
    
    // 親要素の次の要素として追加
    if (photoContainer.nextSibling) {
      photoContainer.parentNode.insertBefore(backContainer, photoContainer.nextSibling);
    } else {
      photoContainer.parentNode.appendChild(backContainer);
    }
    
    // イベントリスナーを設定
    const fileBtn = backContainer.querySelector('.file-select-btn');
    const cameraBtn = backContainer.querySelector('.camera-btn');
    const fileInput = backContainer.querySelector('.back-file-input');
    const previewImg = backContainer.querySelector('.back-preview-image');
    const placeholder = backContainer.querySelector('.back-placeholder');
    const hiddenField = backContainer.querySelector('.back-photo-data');
    
    fileBtn.addEventListener('click', function() {
      fileInput.click();
    });
    
    cameraBtn.addEventListener('click', function() {
      alert('裏面カメラ機能のデモです');
    });
    
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
          previewImg.src = e.target.result;
          previewImg.style.display = 'block';
          placeholder.style.display = 'none';
          hiddenField.value = e.target.result;
        };
        
        reader.readAsDataURL(file);
      }
    });
    
    // 処理済みフラグを設定
    modal.setAttribute('data-dual-photo-setup', 'true');
    console.log('裏面写真エリアをセットアップしました');
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
    
    return document.querySelector('.modal.show');
  }
});