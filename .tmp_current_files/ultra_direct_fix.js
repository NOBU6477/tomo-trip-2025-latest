/**
 * 超直接的な方法で表裏写真機能を実装するスクリプト
 * 極めて原始的なアプローチでUIを確実に変更
 */
(function() {
  // PCのみをターゲットにする（スマートフォンには影響を与えない）
  if (isMobileDevice()) {
    console.log('モバイルデバイスでは動作しません');
    return;
  }

  console.log('超直接的な表裏写真機能を初期化');

  // モバイルデバイス判定
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // ページ読み込み後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 初期化
  function init() {
    // モーダル開閉イベントの監視
    document.addEventListener('shown.bs.modal', handleModalShown);
    
    // セレクトボックス変更の監視
    document.addEventListener('change', handleSelectChange);
    
    // 既存のモーダルで即時実行
    setTimeout(checkExistingModals, 500);
  }

  // 既存のモーダルをチェック
  function checkExistingModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(handleModalShown);
  }

  // モーダル表示時の処理
  function handleModalShown(modal) {
    // イベントオブジェクトの場合はtargetを使用
    if (modal && modal.target) {
      modal = modal.target;
    }
    
    if (!modal || !modal.classList || !modal.classList.contains('modal')) {
      return;
    }
    
    console.log('モーダル表示を検出');
    
    // モーダル内のすべてのセレクトをチェック
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      if (isLicenseSelected(select)) {
        console.log('モーダル内で運転免許証を検出');
        selectDualPhotoRadio(modal);
        createDualPhotoArea(modal);
      }
    });
  }

  // セレクト変更時の処理
  function handleSelectChange(event) {
    const select = event.target;
    
    if (select.tagName !== 'SELECT') return;
    
    if (isLicenseSelected(select)) {
      console.log('運転免許証選択を検出');
      
      // モーダルを探す
      const modal = findParentModal(select);
      if (modal) {
        selectDualPhotoRadio(modal);
        createDualPhotoArea(modal);
      }
    }
  }

  // 運転免許証選択チェック
  function isLicenseSelected(select) {
    if (!select || !select.options || select.selectedIndex < 0) return false;
    
    const selectedOption = select.options[select.selectedIndex];
    const text = selectedOption.textContent || '';
    
    return text.includes('運転免許証') || 
           (text.toLowerCase().includes('driver') && 
            text.toLowerCase().includes('license'));
  }

  // 親モーダルを探す
  function findParentModal(element) {
    let current = element;
    for (let i = 0; i < 10; i++) {
      if (!current) return null;
      
      if (current.classList && current.classList.contains('modal')) {
        return current;
      }
      
      current = current.parentElement;
    }
    
    return null;
  }

  // 表裏写真ラジオボタンを選択
  function selectDualPhotoRadio(modal) {
    try {
      // すべてのラジオボタンを探す
      const radioButtons = modal.querySelectorAll('input[type="radio"][name="photoType"]');
      
      if (radioButtons.length >= 2) {
        // 2番目（表裏写真）のラジオボタンを選択
        radioButtons[1].checked = true;
        
        try {
          // イベント発火
          const event = new Event('change', { bubbles: true });
          radioButtons[1].dispatchEvent(event);
          console.log('表裏写真ラジオボタンを選択しました');
        } catch (e) {
          console.warn('イベント発火エラー:', e);
        }
      } else {
        console.warn('ラジオボタンが見つかりません');
      }
    } catch (e) {
      console.error('ラジオボタン選択エラー:', e);
    }
  }

  // 表裏写真エリアを作成（最も直接的な方法）
  function createDualPhotoArea(modal) {
    console.log('表裏写真エリアを作成');
    
    // モーダルボディを取得
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
      console.warn('モーダルボディが見つかりません');
      return;
    }
    
    // すでに処理済みか確認
    if (modal._dualPhotoSetup || modal.querySelector('.back-photo-container')) {
      console.log('すでに処理済み');
      return;
    }
    
    // 写真コンテナのセレクタを定義
    const photoContainerSelectors = [
      '.photo-container',
      '.photo-upload-container',
      '.form-group:has(input[type="file"])',
      '.mb-3:has(input[type="file"])',
      'div:has(> img.preview-image)',
      'div:has(> img[alt="写真プレビュー"])'
    ];
    
    // セレクタの代わりに、より直接的な方法で探す
    let photoContainer = null;
    
    // 方法1: ファイル入力から探す
    const fileInputs = modalBody.querySelectorAll('input[type="file"][accept*="image"]');
    if (fileInputs.length > 0) {
      // ファイル入力の親要素を辿る
      let parent = fileInputs[0].parentElement;
      let depth = 0;
      
      while (parent && parent !== modalBody && depth < 5) {
        if (parent.classList && 
           (parent.classList.contains('form-group') || 
            parent.classList.contains('mb-3'))) {
          photoContainer = parent;
          break;
        }
        parent = parent.parentElement;
        depth++;
      }
      
      if (!photoContainer) {
        // 見つからなければ直接の親を使用
        photoContainer = fileInputs[0].parentElement;
      }
    }
    
    // 方法2: プレビュー画像から探す
    if (!photoContainer) {
      const previewImages = modalBody.querySelectorAll('img.preview-image, img[alt="写真プレビュー"], img[alt="Photo Preview"]');
      if (previewImages.length > 0) {
        let parent = previewImages[0].parentElement;
        let depth = 0;
        
        while (parent && parent !== modalBody && depth < 5) {
          if (parent.classList && 
             (parent.classList.contains('form-group') || 
              parent.classList.contains('mb-3'))) {
            photoContainer = parent;
            break;
          }
          parent = parent.parentElement;
          depth++;
        }
        
        if (!photoContainer) {
          // 見つからなければ直接の親を使用
          photoContainer = previewImages[0].parentElement;
        }
      }
    }
    
    // 方法3: 写真タイトルから推測
    if (!photoContainer) {
      const photoTitles = Array.from(modalBody.querySelectorAll('*')).filter(el => 
        el.textContent && (
          el.textContent.trim() === 'photo title' || 
          el.textContent.trim() === '証明写真タイプ'
        )
      );
      
      if (photoTitles.length > 0) {
        // 写真タイトルの後にあるform-groupを探す
        const formGroups = modalBody.querySelectorAll('.form-group, .mb-3');
        let found = false;
        
        for (const group of formGroups) {
          if (found) {
            photoContainer = group;
            break;
          }
          
          if (group.contains(photoTitles[0])) {
            found = true;
          }
        }
        
        // 見つからなければ次の要素を使用
        if (!photoContainer) {
          let nextElement = photoTitles[0].nextElementSibling;
          while (nextElement) {
            if (nextElement.querySelector('input[type="file"]') || 
                nextElement.querySelector('img')) {
              photoContainer = nextElement;
              break;
            }
            nextElement = nextElement.nextElementSibling;
          }
        }
      }
    }
    
    // 方法4: 最後の手段としてファイル入力のあるすべての要素
    if (!photoContainer) {
      const allContainersWithFile = Array.from(modalBody.querySelectorAll('*')).filter(el => 
        el.querySelector && el.querySelector('input[type="file"]')
      );
      
      if (allContainersWithFile.length > 0) {
        photoContainer = allContainersWithFile[0];
      }
    }
    
    // 写真コンテナが見つからなければ終了
    if (!photoContainer) {
      console.warn('写真コンテナが見つかりません');
      return;
    }
    
    console.log('写真コンテナを検出しました');
    
    try {
      // すでにラベル付けされているか確認
      const existingLabels = photoContainer.querySelectorAll('.front-label, .back-label');
      if (existingLabels.length > 0) {
        console.log('すでにラベル付けされています');
        return;
      }
      
      // 「表面の写真」ラベルを作成
      const frontLabel = document.createElement('div');
      frontLabel.className = 'front-label';
      frontLabel.textContent = '表面の写真';
      frontLabel.style.fontWeight = 'bold';
      frontLabel.style.marginBottom = '8px';
      frontLabel.style.fontSize = '14px';
      frontLabel.style.color = '#555';
      
      // コンテナの先頭に挿入
      if (photoContainer.firstChild) {
        photoContainer.insertBefore(frontLabel, photoContainer.firstChild);
      } else {
        photoContainer.appendChild(frontLabel);
      }
      
      // 裏面写真用のコンテナを作成
      const backContainer = document.createElement('div');
      backContainer.className = 'back-photo-container mb-3';
      backContainer.style.marginTop = '20px';
      backContainer.style.paddingTop = '15px';
      backContainer.style.borderTop = '1px solid #eee';
      
      // 裏面ラベル
      const backLabel = document.createElement('div');
      backLabel.className = 'back-label';
      backLabel.textContent = '裏面の写真';
      backLabel.style.fontWeight = 'bold';
      backLabel.style.marginBottom = '8px';
      backLabel.style.fontSize = '14px';
      backLabel.style.color = '#555';
      backContainer.appendChild(backLabel);
      
      // プレビューエリア作成
      const previewArea = document.createElement('div');
      previewArea.className = 'preview-area';
      previewArea.style.width = '100%';
      previewArea.style.height = '150px';
      previewArea.style.border = '1px dashed #ccc';
      previewArea.style.backgroundColor = '#f8f9fa';
      previewArea.style.display = 'flex';
      previewArea.style.alignItems = 'center';
      previewArea.style.justifyContent = 'center';
      previewArea.style.position = 'relative';
      previewArea.style.borderRadius = '4px';
      previewArea.style.marginBottom = '10px';
      
      // プレビュー画像
      const previewImg = document.createElement('img');
      previewImg.className = 'back-preview-image';
      previewImg.alt = '裏面写真プレビュー';
      previewImg.style.maxWidth = '100%';
      previewImg.style.maxHeight = '100%';
      previewImg.style.display = 'none';
      previewArea.appendChild(previewImg);
      
      // プレースホルダー
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
      placeholder.textContent = '裏面写真はまだ設定されていません';
      placeholder.style.color = '#6c757d';
      previewArea.appendChild(placeholder);
      
      backContainer.appendChild(previewArea);
      
      // ボタンコンテナ
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'd-grid gap-2';
      
      // カメラボタン
      const cameraButton = document.createElement('button');
      cameraButton.type = 'button';
      cameraButton.className = 'btn btn-primary back-camera-btn';
      cameraButton.textContent = '裏面をカメラで撮影';
      
      buttonContainer.appendChild(cameraButton);
      backContainer.appendChild(buttonContainer);
      
      // 隠しフィールド
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'backPhotoData';
      hiddenField.id = 'back-photo-data';
      backContainer.appendChild(hiddenField);
      
      // 裏面コンテナをDOMに追加
      if (photoContainer.nextElementSibling) {
        photoContainer.parentNode.insertBefore(backContainer, photoContainer.nextElementSibling);
      } else if (photoContainer.parentNode) {
        photoContainer.parentNode.appendChild(backContainer);
      } else {
        // 何らかの理由で親ノードがない場合
        modalBody.appendChild(backContainer);
      }
      
      // 完了フラグ
      modal._dualPhotoSetup = true;
      console.log('表裏写真エリアの作成完了');
      
    } catch (e) {
      console.error('表裏写真エリア作成エラー:', e);
      
      // エラー発生時の最後の手段
      try {
        // シンプルな裏面コンテナを作成
        const simpleBackContainer = document.createElement('div');
        simpleBackContainer.className = 'back-photo-container p-3 mt-3 border';
        simpleBackContainer.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 10px;">裏面の写真</div>
          <div style="height: 100px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #6c757d;">
            裏面写真はまだ設定されていません
          </div>
          <div class="mt-2">
            <button type="button" class="btn btn-primary w-100">裏面をカメラで撮影</button>
          </div>
          <input type="hidden" name="backPhotoData" id="back-photo-data">
        `;
        
        // モーダルボディの末尾に追加
        modalBody.appendChild(simpleBackContainer);
        console.log('シンプルな裏面コンテナを作成しました');
      } catch (e2) {
        console.error('シンプルな裏面コンテナ作成エラー:', e2);
      }
    }
  }
})();