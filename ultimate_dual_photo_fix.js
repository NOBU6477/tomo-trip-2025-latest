/**
 * 最終的な表裏写真機能修正スクリプト
 * 最も強力で確実なアプローチでUIを変更
 */
(function() {
  'use strict';
  
  // スマートフォンには適用しない
  if (isMobileDevice()) {
    console.log('モバイルデバイスではスキップします');
    return;
  }
  
  console.log('最終的な表裏写真機能を初期化します');
  
  // デバイス判定
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // ページ読み込み後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 初期化処理
  function init() {
    // 即時および定期的に既存のセレクト要素をチェック
    setTimeout(function() {
      checkExistingElements();
      // 1秒ごとにチェック（一定回数のみ）
      let checkCount = 0;
      const intervalId = setInterval(function() {
        checkExistingElements();
        if (++checkCount >= 10) clearInterval(intervalId);
      }, 1000);
    }, 500);
    
    // モーダルのイベント監視
    setupModalListeners();
    
    // セレクト要素変更の監視
    document.addEventListener('change', function(event) {
      const target = event.target;
      if (target.tagName === 'SELECT') {
        handleSelectChange(target);
      }
    }, true);
  }
  
  // モーダルイベントリスナーを設定
  function setupModalListeners() {
    // モーダル表示完了イベント
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      processModalContent(modal);
    });
    
    // DOM変更の監視
    try {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1 && node.classList && node.classList.contains('modal')) {
                setTimeout(function() { 
                  processModalContent(node);
                }, 300);
              }
            });
          }
        });
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
      console.warn('MutationObserver設定エラー:', e);
    }
  }
  
  // 既存の要素をチェック
  function checkExistingElements() {
    // 表示されているモーダルをチェック
    const visibleModals = document.querySelectorAll('.modal.show');
    visibleModals.forEach(processModalContent);
    
    // すべてのセレクト要素をチェック
    const selects = document.querySelectorAll('select');
    selects.forEach(handleSelectChange);
  }
  
  // モーダルの内容を処理
  function processModalContent(modal) {
    if (!modal || !modal.classList || !modal.classList.contains('modal')) return;
    
    console.log('モーダルを処理します');
    
    // モーダル内のすべてのセレクト要素をチェック
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      if (isDriverLicenseSelected(select)) {
        console.log('モーダル内で運転免許証を検出');
        applyDualPhotoMode(modal);
      }
    });
  }
  
  // セレクト要素の変更を処理
  function handleSelectChange(select) {
    if (isDriverLicenseSelected(select)) {
      console.log('運転免許証が選択されました');
      
      // 最も近いモーダルを探す
      const modal = findParentModal(select);
      if (modal) {
        applyDualPhotoMode(modal);
      }
    }
  }
  
  // 運転免許証が選択されているか確認
  function isDriverLicenseSelected(select) {
    try {
      if (!select || !select.options || select.selectedIndex < 0) return false;
      
      const selectedOption = select.options[select.selectedIndex];
      const selectedText = selectedOption.textContent || '';
      
      // 日本語と英語の両方に対応
      return selectedText.includes('運転免許証') || 
            (selectedText.toLowerCase().includes('driver') && 
             selectedText.toLowerCase().includes('license'));
    } catch (e) {
      console.warn('選択チェックエラー:', e);
      return false;
    }
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
    
    // 表示中のモーダルを返す（直接の親が見つからない場合）
    return document.querySelector('.modal.show');
  }
  
  // 表裏写真モードを適用
  function applyDualPhotoMode(modal) {
    // すでに処理済みかチェック
    if (modal._dualPhotoApplied) return;
    
    console.log('表裏写真モードを適用します');
    
    // まずラジオボタンの選択
    if (selectDualPhotoRadio(modal)) {
      console.log('表裏写真ラジオボタンを選択しました');
    }
    
    // 次に写真エリアの拡張
    if (createBackPhotoArea(modal)) {
      console.log('裏面写真エリアを作成しました');
      modal._dualPhotoApplied = true;
    }
  }
  
  // 表裏写真ラジオボタンを選択
  function selectDualPhotoRadio(modal) {
    try {
      // ラジオボタンを探す（複数の方法で）
      let dualRadio = null;
      
      // 方法1: 名前で探す
      const radiosByName = modal.querySelectorAll('input[type="radio"][name="photoType"]');
      if (radiosByName.length >= 2) {
        dualRadio = radiosByName[1]; // 2番目が表裏写真
      }
      
      // 方法2: ラベルテキストで探す
      if (!dualRadio) {
        const labels = Array.from(modal.querySelectorAll('label')).filter(label => 
          label.textContent && label.textContent.trim().includes('表裏写真')
        );
        
        if (labels.length > 0) {
          // ラベルに関連付けられたラジオボタンを探す
          const id = labels[0].getAttribute('for');
          if (id) {
            dualRadio = modal.querySelector(`input[type="radio"][id="${id}"]`);
          }
          
          // または隣接するラジオボタンを探す
          if (!dualRadio) {
            let prev = labels[0].previousElementSibling;
            if (prev && prev.tagName === 'INPUT' && prev.type === 'radio') {
              dualRadio = prev;
            }
          }
        }
      }
      
      // 方法3: 親要素内で探す
      if (!dualRadio) {
        const dualTexts = Array.from(modal.querySelectorAll('*')).filter(el => 
          el.textContent && el.textContent.trim() === '表裏写真（運転免許証等）'
        );
        
        if (dualTexts.length > 0) {
          let parent = dualTexts[0].parentElement;
          const nearbyRadio = parent.querySelector('input[type="radio"]');
          if (nearbyRadio) {
            dualRadio = nearbyRadio;
          }
        }
      }
      
      // ラジオボタンが見つかったらチェック
      if (dualRadio) {
        dualRadio.checked = true;
        
        // 変更イベントを発火
        try {
          const event = new Event('change', { bubbles: true });
          dualRadio.dispatchEvent(event);
        } catch (e) {
          console.warn('ラジオボタンイベント発火エラー:', e);
        }
        
        return true;
      }
      
      console.warn('表裏写真ラジオボタンが見つかりません');
      return false;
    } catch (e) {
      console.error('ラジオボタン選択エラー:', e);
      return false;
    }
  }
  
  // 裏面写真エリアを作成
  function createBackPhotoArea(modal) {
    try {
      // すでに存在するかチェック
      if (modal.querySelector('.back-photo-area')) {
        return true;
      }
      
      // 写真コンテナを見つける
      const photoContainer = findPhotoContainer(modal);
      if (!photoContainer) {
        console.warn('写真コンテナが見つかりません');
        return false;
      }
      
      console.log('写真コンテナを発見:', photoContainer);
      
      // 表面ラベルを追加
      if (!photoContainer.querySelector('.front-photo-label')) {
        const frontLabel = document.createElement('div');
        frontLabel.className = 'front-photo-label';
        frontLabel.textContent = '表面の写真';
        frontLabel.style.fontWeight = 'bold';
        frontLabel.style.fontSize = '14px';
        frontLabel.style.color = '#555';
        frontLabel.style.marginBottom = '8px';
        
        // 写真コンテナの先頭に挿入
        photoContainer.insertBefore(frontLabel, photoContainer.firstChild);
      }
      
      // 裏面写真コンテナを作成
      const backPhotoArea = document.createElement('div');
      backPhotoArea.className = 'back-photo-area';
      backPhotoArea.style.marginTop = '20px';
      backPhotoArea.style.paddingTop = '15px';
      backPhotoArea.style.borderTop = '1px solid #eee';
      
      // 裏面ラベル
      const backLabel = document.createElement('div');
      backLabel.className = 'back-photo-label';
      backLabel.textContent = '裏面の写真';
      backLabel.style.fontWeight = 'bold';
      backLabel.style.fontSize = '14px';
      backLabel.style.color = '#555';
      backLabel.style.marginBottom = '8px';
      backPhotoArea.appendChild(backLabel);
      
      // プレビューエリア
      const previewContainer = document.createElement('div');
      previewContainer.className = 'preview-container';
      previewContainer.style.width = '100%';
      previewContainer.style.height = '150px';
      previewContainer.style.border = '1px dashed #ccc';
      previewContainer.style.borderRadius = '4px';
      previewContainer.style.backgroundColor = '#f8f9fa';
      previewContainer.style.display = 'flex';
      previewContainer.style.alignItems = 'center';
      previewContainer.style.justifyContent = 'center';
      previewContainer.style.position = 'relative';
      previewContainer.style.marginBottom = '10px';
      
      // プレビュー画像
      const previewImg = document.createElement('img');
      previewImg.className = 'back-preview-image';
      previewImg.alt = '裏面写真プレビュー';
      previewImg.style.maxWidth = '100%';
      previewImg.style.maxHeight = '100%';
      previewImg.style.objectFit = 'contain';
      previewImg.style.display = 'none';
      previewContainer.appendChild(previewImg);
      
      // プレースホルダー
      const placeholder = document.createElement('span');
      placeholder.className = 'placeholder-text';
      placeholder.textContent = '裏面写真はまだ設定されていません';
      placeholder.style.color = '#999';
      previewContainer.appendChild(placeholder);
      
      backPhotoArea.appendChild(previewContainer);
      
      // ボタンコンテナ
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'd-grid gap-2';
      
      // カメラボタン
      const cameraButton = document.createElement('button');
      cameraButton.type = 'button';
      cameraButton.className = 'btn btn-primary back-camera-btn';
      cameraButton.textContent = '裏面をカメラで撮影';
      cameraButton.style.marginBottom = '5px';
      buttonContainer.appendChild(cameraButton);
      
      // ファイル選択ボタン
      const fileButton = document.createElement('button');
      fileButton.type = 'button';
      fileButton.className = 'btn btn-outline-secondary back-file-btn';
      fileButton.textContent = 'ファイルを選択';
      buttonContainer.appendChild(fileButton);
      
      backPhotoArea.appendChild(buttonContainer);
      
      // 隠しファイル入力
      const hiddenFileInput = document.createElement('input');
      hiddenFileInput.type = 'file';
      hiddenFileInput.accept = 'image/*';
      hiddenFileInput.className = 'back-file-input';
      hiddenFileInput.style.display = 'none';
      backPhotoArea.appendChild(hiddenFileInput);
      
      // 隠しデータフィールド
      const hiddenDataField = document.createElement('input');
      hiddenDataField.type = 'hidden';
      hiddenDataField.name = 'backPhotoData';
      hiddenDataField.className = 'back-photo-data';
      backPhotoArea.appendChild(hiddenDataField);
      
      // 写真コンテナの後に挿入
      photoContainer.after(backPhotoArea);
      
      // カメラボタンのクリックイベント
      cameraButton.addEventListener('click', function() {
        console.log('裏面カメラボタンがクリックされました');
        // ここにカメラ機能を実装
        alert('裏面カメラ機能はデモンストレーション用です。実際の機能は開発中です。');
      });
      
      // ファイル選択ボタンのクリックイベント
      fileButton.addEventListener('click', function() {
        hiddenFileInput.click();
      });
      
      // ファイル選択イベント
      hiddenFileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
          const file = this.files[0];
          
          // プレビュー表示
          const reader = new FileReader();
          reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            placeholder.style.display = 'none';
            
            // 隠しデータフィールドにも設定
            hiddenDataField.value = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
      
      return true;
    } catch (e) {
      console.error('裏面写真エリア作成エラー:', e);
      return false;
    }
  }
  
  // 写真コンテナを見つける（複数の方法で）
  function findPhotoContainer(modal) {
    try {
      // 方法1: クラス名で探す
      let container = modal.querySelector('.photo-container, .photo-upload-area, .id-photo-container');
      if (container) return container;
      
      // 方法2: ファイル入力から探す
      const fileInputs = modal.querySelectorAll('input[type="file"][accept*="image"]');
      if (fileInputs.length > 0) {
        // ファイル入力の親階層を辿る
        let parent = fileInputs[0].parentElement;
        let depth = 0;
        
        while (parent && parent !== modal && depth < 5) {
          // フォームグループらしき要素を探す
          if (parent.classList && 
             (parent.classList.contains('form-group') || 
              parent.classList.contains('mb-3'))) {
            return parent;
          }
          parent = parent.parentElement;
          depth++;
        }
        
        // 見つからなければ直接の親を返す
        return fileInputs[0].parentElement;
      }
      
      // 方法3: プレビュー画像から探す
      const previewImages = modal.querySelectorAll('img.preview-image, img[alt="写真プレビュー"], img[alt="Photo Preview"]');
      if (previewImages.length > 0) {
        let parent = previewImages[0].parentElement;
        let depth = 0;
        
        while (parent && parent !== modal && depth < 5) {
          if (parent.classList && 
             (parent.classList.contains('form-group') || 
              parent.classList.contains('mb-3'))) {
            return parent;
          }
          parent = parent.parentElement;
          depth++;
        }
        
        return previewImages[0].parentElement;
      }
      
      // 方法4: 表裏写真ラジオボタンから探す
      const radioButtons = modal.querySelectorAll('input[type="radio"][name="photoType"]');
      if (radioButtons.length >= 2) {
        // ラジオボタンから最も近いフォームグループを探す
        let current = radioButtons[1].parentElement;
        let depth = 0;
        
        while (current && current !== modal && depth < 5) {
          // 次のフォームグループを探す
          let nextGroup = current.nextElementSibling;
          while (nextGroup) {
            if (nextGroup.classList && 
               (nextGroup.classList.contains('form-group') || 
                nextGroup.classList.contains('mb-3'))) {
              // ファイル入力またはプレビュー画像があるかチェック
              if (nextGroup.querySelector('input[type="file"]') || 
                  nextGroup.querySelector('img')) {
                return nextGroup;
              }
            }
            nextGroup = nextGroup.nextElementSibling;
          }
          
          current = current.parentElement;
          depth++;
        }
      }
      
      // 方法5: テキスト内容から探す
      const photoTexts = Array.from(modal.querySelectorAll('*')).filter(el => 
        el.textContent && (
          el.textContent.trim() === 'photo title' || 
          el.textContent.trim() === '証明写真タイプ'
        )
      );
      
      if (photoTexts.length > 0) {
        // テキストの親要素の次のフォームグループを探す
        let parent = photoTexts[0].parentElement;
        if (parent) {
          // 親要素の次のフォームグループ
          let nextSibling = parent.nextElementSibling;
          while (nextSibling) {
            if (nextSibling.classList && 
               (nextSibling.classList.contains('form-group') || 
                nextSibling.classList.contains('mb-3'))) {
              return nextSibling;
            }
            nextSibling = nextSibling.nextElementSibling;
          }
        }
      }
      
      return null;
    } catch (e) {
      console.error('写真コンテナ検索エラー:', e);
      return null;
    }
  }
})();