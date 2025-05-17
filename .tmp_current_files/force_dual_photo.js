/**
 * 強制的に表裏写真機能を実装するスクリプト
 * 最も直接的なDOM書き換えにより確実に実装
 */
(function() {
  'use strict';
  
  // スマートフォンでは実行しない
  if (isMobileDevice()) {
    console.log('モバイルデバイスでは実行しません');
    return;
  }
  
  console.log('強制的な表裏写真機能を初期化');
  
  // モバイルデバイス判定
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // DOM読み込み完了または即時実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 初期化処理
  function init() {
    console.log('表裏写真機能の初期化');
    
    // モーダル表示イベントのリスニング
    document.addEventListener('shown.bs.modal', handleModalShown);
    
    // セレクトボックス変更の監視
    document.addEventListener('change', function(event) {
      if (event.target.tagName === 'SELECT') {
        checkLicenseSelection(event.target);
      }
    });
    
    // 一定間隔で既存のモーダルをチェック（信頼性のため）
    setInterval(checkExistingModals, 1000);
    
    // 初回チェック
    setTimeout(checkExistingModals, 500);
  }
  
  // 既存のモーダルをチェック
  function checkExistingModals() {
    const visibleModals = document.querySelectorAll('.modal.show');
    visibleModals.forEach(function(modal) {
      processModal(modal);
    });
  }
  
  // モーダル表示イベントハンドラ
  function handleModalShown(event) {
    const modal = event.target;
    processModal(modal);
  }
  
  // モーダルの処理
  function processModal(modal) {
    // モーダル内のセレクト要素をチェック
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      checkLicenseSelection(select);
    });
  }
  
  // 運転免許証選択のチェック
  function checkLicenseSelection(select) {
    try {
      // 値が選択されているか確認
      if (!select || !select.options || select.selectedIndex < 0) return;
      
      const selectedText = select.options[select.selectedIndex].textContent || '';
      
      // 運転免許証が選択されているか確認
      if (selectedText.includes('運転免許証') || 
         (selectedText.toLowerCase().includes('driver') && 
          selectedText.toLowerCase().includes('license'))) {
        
        console.log('運転免許証選択を検出: ' + selectedText);
        
        // 親モーダルを見つける
        const modal = findParentModal(select);
        if (modal) {
          // 表裏写真ラジオボタンの選択
          selectDualPhotoRadio(modal);
          
          // 強制的に表裏写真エリアを挿入
          forceDualPhotoArea(modal);
        }
      }
    } catch (e) {
      console.error('運転免許証チェックエラー:', e);
    }
  }
  
  // 親モーダルを見つける
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
    
    // 直接のモーダルが見つからない場合は表示中のモーダルを返す
    return document.querySelector('.modal.show');
  }
  
  // 表裏写真ラジオボタンを選択
  function selectDualPhotoRadio(modal) {
    // 表裏写真に関連するラジオボタンを見つける
    const radioGroups = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    
    if (radioGroups.length >= 2) {
      // 2番目のラジオボタン（表裏写真）を選択
      radioGroups[1].checked = true;
      
      // 変更イベントを発火
      try {
        const event = new Event('change', { bubbles: true });
        radioGroups[1].dispatchEvent(event);
        console.log('表裏写真ラジオボタン選択成功');
      } catch (e) {
        console.warn('ラジオボタンイベント発火エラー:', e);
      }
    } else {
      console.warn('ラジオボタンが見つかりません');
    }
  }
  
  // 強制的に表裏写真エリアを挿入
  function forceDualPhotoArea(modal) {
    // すでに実行済みかチェック
    if (modal._dualPhotoForced) {
      return;
    }
    
    try {
      // モーダルボディを取得
      const modalBody = modal.querySelector('.modal-body');
      if (!modalBody) {
        console.warn('モーダルボディが見つかりません');
        return;
      }
      
      // すでに裏面写真があるかチェック
      if (modalBody.querySelector('.back-photo-container')) {
        console.log('裏面写真エリアはすでに存在します');
        modal._dualPhotoForced = true;
        return;
      }
      
      console.log('強制的に表裏写真エリアを挿入します');
      
      // ファイル入力エリアを探す
      let photoContainer = null;
      const fileInputs = modalBody.querySelectorAll('input[type="file"]');
      
      if (fileInputs.length > 0) {
        // 最初のファイル入力の親フォームグループを探す
        photoContainer = findParentFormGroup(fileInputs[0]);
      }
      
      // 写真コンテナが見つからなければ別の方法を試す
      if (!photoContainer) {
        // プレビュー画像を探す
        const previewImages = modalBody.querySelectorAll('img.preview-image, img[alt="写真プレビュー"]');
        if (previewImages.length > 0) {
          photoContainer = findParentFormGroup(previewImages[0]);
        }
      }
      
      // それでも見つからなければ登録フォームを探す
      if (!photoContainer) {
        const forms = modalBody.querySelectorAll('form');
        if (forms.length > 0) {
          // フォーム内の最後のフォームグループを見つける
          const formGroups = forms[0].querySelectorAll('.form-group, .mb-3');
          if (formGroups.length > 0) {
            // 写真に関連しそうなフォームグループを探す
            for (let i = 0; i < formGroups.length; i++) {
              if (formGroups[i].querySelector('input[type="file"]') || 
                  formGroups[i].querySelector('img')) {
                photoContainer = formGroups[i];
                break;
              }
            }
            
            // 見つからなければ最後のフォームグループを使用
            if (!photoContainer) {
              photoContainer = formGroups[formGroups.length - 1];
            }
          }
        }
      }
      
      // それでも見つからなければモーダルボディに直接追加
      if (!photoContainer) {
        console.warn('写真コンテナが見つかりません。モーダルボディに直接追加します。');
        
        // 新しいフォームグループを作成
        photoContainer = document.createElement('div');
        photoContainer.className = 'form-group mb-3 auto-created-container';
        modalBody.appendChild(photoContainer);
      }
      
      // 見つかった写真コンテナに「表面の写真」ラベルを追加
      const frontLabel = document.createElement('div');
      frontLabel.className = 'front-photo-label mb-2';
      frontLabel.textContent = '表面の写真';
      frontLabel.style.fontWeight = 'bold';
      frontLabel.style.color = '#333';
      frontLabel.style.fontSize = '14px';
      
      // コンテナの先頭に追加
      if (photoContainer.firstChild) {
        photoContainer.insertBefore(frontLabel, photoContainer.firstChild);
      } else {
        photoContainer.appendChild(frontLabel);
      }
      
      // 裏面写真コンテナの作成
      const backContainer = document.createElement('div');
      backContainer.className = 'form-group mb-3 back-photo-container';
      backContainer.style.marginTop = '20px';
      backContainer.style.paddingTop = '15px';
      backContainer.style.borderTop = '1px solid #ddd';
      
      // 裏面写真ラベル
      const backLabel = document.createElement('div');
      backLabel.className = 'back-photo-label mb-2';
      backLabel.textContent = '裏面の写真';
      backLabel.style.fontWeight = 'bold';
      backLabel.style.color = '#333';
      backLabel.style.fontSize = '14px';
      backContainer.appendChild(backLabel);
      
      // プレビューエリア
      const previewArea = document.createElement('div');
      previewArea.className = 'preview-area';
      previewArea.style.width = '100%';
      previewArea.style.height = '150px';
      previewArea.style.border = '1px dashed #ccc';
      previewArea.style.borderRadius = '4px';
      previewArea.style.backgroundColor = '#f8f8f8';
      previewArea.style.display = 'flex';
      previewArea.style.alignItems = 'center';
      previewArea.style.justifyContent = 'center';
      previewArea.style.marginBottom = '10px';
      previewArea.style.position = 'relative';
      
      // プレビュー画像
      const previewImg = document.createElement('img');
      previewImg.className = 'back-preview-image';
      previewImg.alt = '裏面プレビュー';
      previewImg.style.maxWidth = '100%';
      previewImg.style.maxHeight = '100%';
      previewImg.style.display = 'none';
      previewArea.appendChild(previewImg);
      
      // プレースホルダーテキスト
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder-text';
      placeholder.textContent = '裏面写真はまだ設定されていません';
      placeholder.style.color = '#999';
      previewArea.appendChild(placeholder);
      
      backContainer.appendChild(previewArea);
      
      // ボタングループ
      const btnGroup = document.createElement('div');
      btnGroup.className = 'd-grid gap-2';
      
      // カメラボタン
      const cameraBtn = document.createElement('button');
      cameraBtn.type = 'button';
      cameraBtn.className = 'btn btn-primary mb-2';
      cameraBtn.textContent = '裏面をカメラで撮影';
      cameraBtn.onclick = function() {
        alert('裏面カメラ機能は現在デモンストレーション用です');
      };
      btnGroup.appendChild(cameraBtn);
      
      // ファイル選択ボタン
      const fileBtn = document.createElement('button');
      fileBtn.type = 'button';
      fileBtn.className = 'btn btn-outline-secondary';
      fileBtn.textContent = 'ファイルを選択';
      fileBtn.onclick = function() {
        fileInput.click();
      };
      btnGroup.appendChild(fileBtn);
      
      backContainer.appendChild(btnGroup);
      
      // 非表示のファイル入力
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
            hiddenInput.value = e.target.result;
          };
          
          reader.readAsDataURL(file);
        }
      };
      backContainer.appendChild(fileInput);
      
      // 隠しフィールド
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'backPhotoData';
      hiddenInput.className = 'back-photo-data';
      backContainer.appendChild(hiddenInput);
      
      // 写真コンテナの直後に裏面コンテナを挿入
      try {
        // DOM APIのafterメソッドを使用
        photoContainer.after(backContainer);
      } catch (e) {
        console.warn('DOM API afterメソッドが使用できません:', e);
        
        // 従来の方法を使用
        if (photoContainer.nextSibling) {
          photoContainer.parentNode.insertBefore(backContainer, photoContainer.nextSibling);
        } else if (photoContainer.parentNode) {
          photoContainer.parentNode.appendChild(backContainer);
        } else {
          // モーダルボディに直接追加
          modalBody.appendChild(backContainer);
        }
      }
      
      console.log('裏面写真エリアを追加しました');
      modal._dualPhotoForced = true;
    } catch (e) {
      console.error('裏面写真エリア作成エラー:', e);
      
      // エラー時の最終手段
      try {
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
          // 最もシンプルな形式で追加
          const simpleContainer = document.createElement('div');
          simpleContainer.className = 'simple-back-photo mt-4 p-3 border';
          simpleContainer.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">裏面の写真</div>
            <div style="height: 120px; border: 1px dashed #ccc; background: #f8f8f8; display: flex; align-items: center; justify-content: center; color: #999; margin-bottom: 10px;">
              裏面写真はまだ設定されていません
            </div>
            <div>
              <button type="button" class="btn btn-primary w-100">裏面をカメラで撮影</button>
            </div>
          `;
          
          modalBody.appendChild(simpleContainer);
          console.log('シンプルな裏面写真エリアを追加しました');
          modal._dualPhotoForced = true;
        }
      } catch (e2) {
        console.error('シンプルな裏面写真エリア作成にも失敗:', e2);
      }
    }
  }
  
  // 親のフォームグループを見つける
  function findParentFormGroup(element) {
    let current = element;
    let depth = 0;
    
    while (current && depth < 5) {
      if (current.classList && 
         (current.classList.contains('form-group') || 
          current.classList.contains('mb-3'))) {
        return current;
      }
      current = current.parentElement;
      depth++;
    }
    
    // 直接の親を返す
    return element.parentElement;
  }
})();