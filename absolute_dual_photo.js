/**
 * 絶対確実な表裏写真機能実装
 * 単一スクリプトで完全に独立して動作する設計
 */
document.addEventListener('DOMContentLoaded', function() {
  // スマートフォンでは実行しない
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('モバイルデバイスでは実行しません');
    return;
  }

  console.log('絶対確実な表裏写真機能を初期化');

  // モーダル表示イベントリスナー
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    processModal(modal);
  });

  // DOMの変更を監視
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // 新しい要素が追加された場合
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          // モーダル要素が追加された場合
          if (node.nodeType === 1 && node.classList && node.classList.contains('modal')) {
            // 少し遅延させて処理（DOM完全構築後）
            setTimeout(function() {
              processModal(node);
            }, 300);
          }
        }
      }
    });
  });

  // body要素の変更を監視
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // セレクト要素の変更を監視
  document.addEventListener('change', function(event) {
    const target = event.target;
    if (target.tagName === 'SELECT') {
      checkForDriverLicense(target);
    }
  });

  // 既存のモーダルを確認
  setTimeout(checkExistingModals, 500);
  // 定期的に確認（初期化されている可能性があるため）
  setInterval(checkExistingModals, 2000);

  // 既存のモーダルを処理
  function checkExistingModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(function(modal) {
      processModal(modal);
    });
  }

  // モーダル処理の本体
  function processModal(modal) {
    if (!modal || !modal.classList || !modal.classList.contains('modal')) {
      return;
    }

    // モーダル内のセレクト要素を確認
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      checkForDriverLicense(select);
    });
  }

  // 運転免許証選択チェック
  function checkForDriverLicense(select) {
    if (!select || !select.options || select.selectedIndex < 0) {
      return;
    }

    const selectedOption = select.options[select.selectedIndex];
    const selectedText = selectedOption.textContent || '';

    // 運転免許証が選択されているか確認
    if (selectedText.includes('運転免許証') || 
        (selectedText.toLowerCase().includes('driver') && 
         selectedText.toLowerCase().includes('license'))) {
      
      console.log('運転免許証選択検出: ' + selectedText);
      
      // モーダルを見つける
      const modal = findParentModal(select);
      if (modal) {
        // ラジオボタン選択と写真エリア設定
        activateDualPhotoMode(modal);
      }
    }
  }

  // 親モーダルを検索
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
    
    // 表示中のモーダルを返す
    return document.querySelector('.modal.show');
  }

  // 表裏写真モードを有効化
  function activateDualPhotoMode(modal) {
    console.log('表裏写真モードを有効化します');
    
    // すでに処理済みかチェック
    if (modal.getAttribute('data-dual-photo-processed') === 'true') {
      console.log('モーダルはすでに処理済み');
      return;
    }
    
    // ラジオボタン選択
    selectDualPhotoRadio(modal);
    
    // 裏面写真エリア作成
    createBackPhotoArea(modal);
    
    // 処理済みフラグ設定
    modal.setAttribute('data-dual-photo-processed', 'true');
  }

  // 表裏写真ラジオボタン選択
  function selectDualPhotoRadio(modal) {
    const radioButtons = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    
    if (radioButtons.length >= 2) {
      // 2番目のラジオボタンを選択（表裏写真）
      radioButtons[1].checked = true;
      
      // 変更イベント発火
      try {
        const event = new Event('change', { bubbles: true });
        radioButtons[1].dispatchEvent(event);
        console.log('表裏写真ラジオボタン選択成功');
      } catch (e) {
        console.warn('ラジオボタンイベント発火エラー:', e);
      }
    } else {
      console.warn('ラジオボタンが見つかりません');
    }
  }

  // 裏面写真エリア作成
  function createBackPhotoArea(modal) {
    try {
      // すでに存在するかチェック
      if (modal.querySelector('.back-photo-area')) {
        console.log('裏面写真エリアはすでに存在します');
        return;
      }
      
      console.log('裏面写真エリアを作成します');
      
      // 写真コンテナを検索
      const photoContainer = findPhotoContainer(modal);
      
      if (!photoContainer) {
        console.warn('写真コンテナが見つかりません');
        return;
      }
      
      // 表面ラベルが既にあるかチェック
      if (!photoContainer.querySelector('.front-photo-label')) {
        // 表面ラベルを追加
        const frontLabel = document.createElement('div');
        frontLabel.className = 'front-photo-label';
        frontLabel.textContent = '表面の写真';
        frontLabel.style.fontWeight = 'bold';
        frontLabel.style.fontSize = '14px';
        frontLabel.style.marginBottom = '10px';
        frontLabel.style.color = '#333';
        
        // 写真コンテナの先頭に追加
        if (photoContainer.firstChild) {
          photoContainer.insertBefore(frontLabel, photoContainer.firstChild);
        } else {
          photoContainer.appendChild(frontLabel);
        }
      }
      
      // 裏面写真エリア作成
      const backPhotoArea = document.createElement('div');
      backPhotoArea.className = 'back-photo-area form-group mb-3';
      backPhotoArea.style.marginTop = '20px';
      backPhotoArea.style.paddingTop = '15px';
      backPhotoArea.style.borderTop = '1px solid #ddd';
      
      // 裏面写真ラベル
      const backLabel = document.createElement('div');
      backLabel.className = 'back-photo-label';
      backLabel.textContent = '裏面の写真';
      backLabel.style.fontWeight = 'bold';
      backLabel.style.fontSize = '14px';
      backLabel.style.marginBottom = '10px';
      backLabel.style.color = '#333';
      backPhotoArea.appendChild(backLabel);
      
      // プレビューエリア
      const previewArea = document.createElement('div');
      previewArea.className = 'back-preview-area';
      previewArea.style.width = '100%';
      previewArea.style.height = '150px';
      previewArea.style.border = '1px dashed #ccc';
      previewArea.style.borderRadius = '4px';
      previewArea.style.backgroundColor = '#f9f9f9';
      previewArea.style.display = 'flex';
      previewArea.style.alignItems = 'center';
      previewArea.style.justifyContent = 'center';
      previewArea.style.marginBottom = '10px';
      previewArea.style.position = 'relative';
      
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
      placeholder.className = 'back-placeholder';
      placeholder.textContent = '裏面写真はまだ設定されていません';
      placeholder.style.color = '#999';
      previewArea.appendChild(placeholder);
      
      backPhotoArea.appendChild(previewArea);
      
      // ボタングループ
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'd-grid gap-2';
      
      // カメラボタン
      const cameraButton = document.createElement('button');
      cameraButton.type = 'button';
      cameraButton.className = 'btn btn-primary back-camera-btn';
      cameraButton.textContent = '裏面をカメラで撮影';
      cameraButton.style.marginBottom = '5px';
      cameraButton.onclick = function() {
        alert('このボタンは裏面カメラ機能のデモです。現在実装中です。');
      };
      buttonGroup.appendChild(cameraButton);
      
      // ファイル選択ボタン
      const fileButton = document.createElement('button');
      fileButton.type = 'button';
      fileButton.className = 'btn btn-outline-secondary back-file-btn';
      fileButton.textContent = 'ファイルを選択';
      fileButton.onclick = function() {
        fileInput.click();
      };
      buttonGroup.appendChild(fileButton);
      
      backPhotoArea.appendChild(buttonGroup);
      
      // 非表示ファイル入力
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      fileInput.className = 'back-file-input';
      fileInput.onchange = function() {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          const reader = new FileReader();
          
          reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            placeholder.style.display = 'none';
            
            // 隠しフィールドにデータを設定
            hiddenField.value = e.target.result;
          };
          
          reader.readAsDataURL(file);
        }
      };
      backPhotoArea.appendChild(fileInput);
      
      // 隠しフィールド
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'backPhotoData';
      hiddenField.className = 'back-photo-data';
      backPhotoArea.appendChild(hiddenField);
      
      // 裏面写真エリアを写真コンテナの後に挿入
      try {
        if (typeof photoContainer.after === 'function') {
          photoContainer.after(backPhotoArea);
        } else {
          // IE対応
          if (photoContainer.parentNode) {
            if (photoContainer.nextSibling) {
              photoContainer.parentNode.insertBefore(backPhotoArea, photoContainer.nextSibling);
            } else {
              photoContainer.parentNode.appendChild(backPhotoArea);
            }
          }
        }
        console.log('裏面写真エリアを追加しました');
      } catch (e) {
        console.error('裏面写真エリア挿入エラー:', e);
        
        // エラー時は親要素に直接追加
        try {
          const parent = photoContainer.parentNode;
          if (parent) {
            parent.appendChild(backPhotoArea);
            console.log('エラー回避: 親要素に直接追加しました');
          }
        } catch (e2) {
          console.error('親要素への追加もエラー:', e2);
        }
      }
    } catch (e) {
      console.error('裏面写真エリア作成エラー:', e);
      
      // 最終手段: モーダルボディに直接追加
      try {
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
          const simpleBackArea = document.createElement('div');
          simpleBackArea.className = 'emergency-back-photo';
          simpleBackArea.style.margin = '20px 0';
          simpleBackArea.style.padding = '15px';
          simpleBackArea.style.border = '1px solid #ddd';
          simpleBackArea.style.borderRadius = '4px';
          simpleBackArea.style.backgroundColor = '#f8f8f8';
          
          simpleBackArea.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">裏面の写真</div>
            <div style="height: 120px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #999; margin-bottom: 10px;">
              裏面写真はまだ設定されていません
            </div>
            <button type="button" class="btn btn-primary w-100">裏面をカメラで撮影</button>
          `;
          
          modalBody.appendChild(simpleBackArea);
          console.log('緊急対応: シンプルな裏面写真エリアを追加しました');
        }
      } catch (e3) {
        console.error('緊急対応も失敗:', e3);
      }
    }
  }

  // 写真コンテナを見つける
  function findPhotoContainer(modal) {
    // 複数の方法で検索を試みる
    
    // 方法1: 既存のクラス名で検索
    let container = modal.querySelector('.photo-container, .photo-upload-container, .id-photo-container');
    if (container) return container;
    
    // 方法2: ファイル入力から探す
    const fileInputs = modal.querySelectorAll('input[type="file"][accept*="image"]');
    if (fileInputs.length > 0) {
      return findParentFormGroup(fileInputs[0]);
    }
    
    // 方法3: プレビュー画像から探す
    const previewImages = modal.querySelectorAll('img.preview-image, img[alt="写真プレビュー"], img[alt="Photo Preview"]');
    if (previewImages.length > 0) {
      return findParentFormGroup(previewImages[0]);
    }
    
    // 方法4: 証明写真タイプのラベルから探す
    const photoLabels = Array.from(modal.querySelectorAll('label, div, h5')).filter(function(el) {
      const text = el.textContent || '';
      return text.includes('証明写真タイプ') || text.includes('photo title');
    });
    
    if (photoLabels.length > 0) {
      const label = photoLabels[0];
      // ラベルの次の要素または次のフォームグループを探す
      let next = label.nextElementSibling;
      while (next) {
        if (next.classList && 
           (next.classList.contains('form-group') || 
            next.classList.contains('mb-3'))) {
          return next;
        }
        next = next.nextElementSibling;
      }
      
      // 直接の次要素がない場合は親要素の次を探す
      const parent = label.parentElement;
      if (parent) {
        next = parent.nextElementSibling;
        while (next) {
          if (next.classList && 
             (next.classList.contains('form-group') || 
              next.classList.contains('mb-3'))) {
            return next;
          }
          next = next.nextElementSibling;
        }
      }
    }
    
    // 方法5: 単一・表裏写真ラジオボタンから探す
    const radioButtons = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    if (radioButtons.length >= 2) {
      // ラジオボタンの親要素の次のフォームグループを探す
      const radioParent = findParentFormGroup(radioButtons[0]);
      if (radioParent) {
        let next = radioParent.nextElementSibling;
        while (next) {
          if (next.classList && 
             (next.classList.contains('form-group') || 
              next.classList.contains('mb-3')) &&
             (next.querySelector('input[type="file"]') || 
              next.querySelector('img'))) {
            return next;
          }
          next = next.nextElementSibling;
        }
      }
    }
    
    // 方法6: モーダルボディ内のファイル入力を含む最初の要素
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      const elements = modalBody.querySelectorAll('*');
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].querySelector && 
            elements[i].querySelector('input[type="file"]')) {
          return elements[i];
        }
      }
    }
    
    return null;
  }
  
  // 親のフォームグループを見つける
  function findParentFormGroup(element) {
    let current = element;
    let depth = 0;
    
    // 親階層を辿ってフォームグループを探す
    while (current && depth < 5) {
      if (current.classList && 
         (current.classList.contains('form-group') || 
          current.classList.contains('mb-3'))) {
        return current;
      }
      current = current.parentElement;
      depth++;
    }
    
    // 見つからなければ親要素を返す
    return element.parentElement;
  }
});