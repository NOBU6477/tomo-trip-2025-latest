/**
 * シンプルな表裏写真機能修正スクリプト
 * 運転免許証選択時に自動的に表裏写真ラジオボタンを選択し、写真領域を2枚表示に拡張
 */
(function() {
  'use strict';

  // PC環境でのみ実行
  if (isMobileDevice()) {
    console.log('モバイルデバイスを検出: PCモードをスキップします');
    return;
  }

  // 状態管理
  const state = {
    frontPhoto: null,
    backPhoto: null,
    isProcessing: false
  };

  // 初期化
  function init() {
    console.log('シンプル表裏写真修正を初期化');
    
    // DOMの読み込みが完了したら実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupHandlers);
    } else {
      setupHandlers();
    }
  }

  // モバイルデバイスかどうかを判定
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // イベントハンドラのセットアップ
  function setupHandlers() {
    // モーダル表示イベント
    document.addEventListener('shown.bs.modal', handleModalShown);
    
    // セレクト変更イベント
    document.addEventListener('change', handleSelectChange);
    
    // 既存のモーダルをチェック
    setTimeout(checkExistingModals, 500);
  }

  // 既存のモーダルをチェック
  function checkExistingModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
      handleModalShown({ target: modal });
    });
  }

  // モーダル表示時の処理
  function handleModalShown(event) {
    const modal = event.target;
    if (!modal || !modal.classList || !modal.classList.contains('modal')) return;
    
    console.log('モーダル表示を検出');
    
    // 身分証明書タイプのセレクトを確認
    checkIdDocumentType(modal);
    
    // 表裏写真のラジオボタンをセットアップ
    setupRadioButtons(modal);
  }

  // セレクト変更時の処理
  function handleSelectChange(event) {
    if (event.target.tagName !== 'SELECT') return;
    
    const select = event.target;
    checkIfLicenseSelected(select);
  }

  // 運転免許証が選択されているかチェック
  function checkIdDocumentType(modal) {
    if (!modal) return;
    
    const selects = modal.querySelectorAll('select');
    selects.forEach(select => {
      checkIfLicenseSelected(select);
    });
  }

  // 運転免許証が選択されているか確認
  function checkIfLicenseSelected(select) {
    if (!select || !select.options || select.selectedIndex < 0) return;
    
    const selectedOption = select.options[select.selectedIndex];
    const selectedText = selectedOption.textContent;
    
    if (selectedText.includes('運転免許証') || 
        (selectedText.toLowerCase().includes('driver') && 
         selectedText.toLowerCase().includes('license'))) {
      console.log('運転免許証が選択されました');
      
      // モーダルを取得
      const modal = findParentModal(select);
      if (modal) {
        // 表裏写真ラジオボタンを選択
        selectDualPhotoRadio(modal);
        
        // 写真エリアを2枚表示に拡張
        setupDualPhotoArea(modal);
      }
    }
  }

  // 親モーダルを探す
  function findParentModal(element) {
    if (!element) return null;
    
    let current = element;
    while (current) {
      if (current.classList && current.classList.contains('modal')) {
        return current;
      }
      current = current.parentElement;
    }
    
    return null;
  }

  // 表裏写真ラジオボタンをセットアップ
  function setupRadioButtons(modal) {
    if (!modal) return;
    
    // すでに設定済みならスキップ
    if (modal._radioButtonsSetup) return;
    
    // 証明写真タイプのセクションを探す
    const photoTitleElements = Array.from(modal.querySelectorAll('*')).filter(el => {
      return el.textContent && (
        el.textContent.trim() === 'photo title' || 
        el.textContent.trim() === '証明写真タイプ'
      );
    });
    
    if (photoTitleElements.length === 0) return;
    
    const photoTitleEl = photoTitleElements[0];
    const photoSection = photoTitleEl.parentElement;
    
    // 表裏写真と証明写真のテキスト要素を探す
    const photoLabelElements = Array.from(photoSection.querySelectorAll('*')).filter(el => {
      const text = el.textContent && el.textContent.trim();
      return text === '証明写真（1枚）' || text === '表裏写真（運転免許証等）';
    });
    
    // モーダルにフラグを設定
    modal._radioButtonsSetup = true;
    
    console.log('ラジオボタンをセットアップしました');
  }

  // 表裏写真ラジオボタンを選択
  function selectDualPhotoRadio(modal) {
    if (!modal) return;
    
    console.log('表裏写真ラジオボタンを選択します');
    
    // すべてのラジオボタンを取得
    const radios = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    if (radios.length < 2) return;
    
    // インデックス1が表裏写真（通常2番目のラジオボタン）
    const dualPhotoRadio = radios[1];
    if (dualPhotoRadio) {
      dualPhotoRadio.checked = true;
      
      // 変更イベントを発火
      const event = new Event('change', { bubbles: true });
      dualPhotoRadio.dispatchEvent(event);
      
      console.log('表裏写真ラジオボタンを選択しました');
    }
  }

  // 写真エリアを2枚表示に拡張
  function setupDualPhotoArea(modal) {
    if (!modal) return;
    
    // すでに拡張済みならスキップ
    if (modal._dualPhotoSetup) return;

    // 既に裏面写真コンテナが存在するかチェック
    if (modal.querySelector('.back-photo-container')) {
      console.log('裏面写真コンテナは既に存在します');
      modal._dualPhotoSetup = true;
      return;
    }
    
    console.log('写真エリアを2枚表示に拡張します');
    
    // 写真関連の要素を探す方法をいくつか試す
    let photoContainer = null;
    
    // 方法1: ファイル入力を探す
    const fileInputs = modal.querySelectorAll('input[type="file"][accept*="image"]');
    if (fileInputs.length > 0) {
      // ファイル入力の親要素を辿る
      let parent = fileInputs[0].parentElement;
      // フォームグループを探す
      while (parent && parent !== modal) {
        if (parent.classList && (
            parent.classList.contains('form-group') || 
            parent.classList.contains('mb-3'))) {
          photoContainer = parent;
          break;
        }
        parent = parent.parentElement;
      }
      // 見つからなかった場合は直接の親を使用
      if (!photoContainer) {
        photoContainer = fileInputs[0].parentElement;
      }
    }
    
    // 方法2: プレビュー画像を探す
    if (!photoContainer) {
      const previewImages = modal.querySelectorAll('img.preview-image, img[alt="写真プレビュー"], img[alt="Photo Preview"]');
      if (previewImages.length > 0) {
        let parent = previewImages[0].parentElement;
        while (parent && parent !== modal) {
          if (parent.classList && (
              parent.classList.contains('form-group') || 
              parent.classList.contains('mb-3'))) {
            photoContainer = parent;
            break;
          }
          parent = parent.parentElement;
        }
        if (!photoContainer) {
          photoContainer = previewImages[0].parentElement;
        }
      }
    }
    
    // 方法3: 写真タイトルからコンテナを見つける
    if (!photoContainer) {
      const photoTitleElements = Array.from(modal.querySelectorAll('*')).filter(el => {
        return el.textContent && (
          el.textContent.trim() === 'photo title' || 
          el.textContent.trim() === '証明写真タイプ'
        );
      });
      
      if (photoTitleElements.length > 0) {
        let parent = photoTitleElements[0].parentElement;
        // タイトルから2階層上まで探す
        for (let i = 0; i < 3; i++) {
          if (!parent) break;
          
          // 子要素に画像やファイル入力があるか確認
          const hasImage = parent.querySelector('img');
          const hasFileInput = parent.querySelector('input[type="file"]');
          
          if (hasImage || hasFileInput) {
            photoContainer = parent;
            break;
          }
          
          parent = parent.parentElement;
        }
      }
    }
    
    // 写真コンテナが見つからない場合は終了
    if (!photoContainer) {
      console.warn('写真コンテナが見つかりませんでした');
      return;
    }
    
    console.log('写真コンテナを検出しました');
    
    // すでに表裏モードになっているか確認
    const existingLabels = photoContainer.querySelectorAll('.text-muted');
    for (const label of existingLabels) {
      if (label.textContent.includes('表面') || label.textContent.includes('裏面')) {
        console.log('すでに表裏モードになっています');
        modal._dualPhotoSetup = true;
        return;
      }
    }
    
    // 「表面の写真」ラベルを追加
    const frontLabel = document.createElement('div');
    frontLabel.className = 'text-muted mb-2';
    frontLabel.textContent = '表面の写真';
    frontLabel.style.fontSize = '14px';
    frontLabel.style.fontWeight = 'bold';
    frontLabel.style.marginBottom = '8px';
    
    // 写真コンテナの最初の要素を見つける
    try {
      const firstElement = photoContainer.querySelector('img, input[type="file"], .preview-container');
      
      // コンテナの最初に挿入（エラー対策）
      if (firstElement && photoContainer.contains(firstElement)) {
        photoContainer.insertBefore(frontLabel, firstElement);
      } else if (photoContainer.firstChild) {
        photoContainer.insertBefore(frontLabel, photoContainer.firstChild);
      } else {
        photoContainer.appendChild(frontLabel);
      }
    } catch (e) {
      console.warn('表面ラベル追加エラー:', e);
      // エラー時は単純に追加
      try {
        photoContainer.appendChild(frontLabel);
      } catch (e2) {
        console.error('表面ラベル追加完全失敗:', e2);
      }
    }
    
    // 裏面用のコンテナを作成
    const backContainer = document.createElement('div');
    backContainer.className = 'back-photo-container mt-3';
    backContainer.style.marginTop = '20px';
    backContainer.style.paddingTop = '15px';
    backContainer.style.borderTop = '1px solid #eee';
    
    // 裏面写真ラベル
    const backLabel = document.createElement('div');
    backLabel.className = 'text-muted mb-2';
    backLabel.textContent = '裏面の写真';
    backLabel.style.fontSize = '14px';
    backLabel.style.fontWeight = 'bold';
    backLabel.style.marginBottom = '8px';
    backContainer.appendChild(backLabel);
    
    // プレビューエリア
    const previewArea = document.createElement('div');
    previewArea.className = 'back-preview-area';
    previewArea.style.width = '100%';
    previewArea.style.height = '150px';
    previewArea.style.border = '1px dashed #ccc';
    previewArea.style.backgroundColor = '#f8f9fa';
    previewArea.style.display = 'flex';
    previewArea.style.alignItems = 'center';
    previewArea.style.justifyContent = 'center';
    previewArea.style.position = 'relative';
    previewArea.style.marginBottom = '10px';
    previewArea.style.borderRadius = '4px';
    
    // プレビュー画像
    const previewImg = document.createElement('img');
    previewImg.className = 'back-preview-image';
    previewImg.alt = '裏面写真プレビュー';
    previewImg.style.maxWidth = '100%';
    previewImg.style.maxHeight = '100%';
    previewImg.style.display = 'none';
    previewArea.appendChild(previewImg);
    
    // プレースホルダー
    const placeholder = document.createElement('span');
    placeholder.className = 'back-placeholder';
    placeholder.textContent = '裏面写真はまだ設定されていません';
    placeholder.style.color = '#6c757d';
    previewArea.appendChild(placeholder);
    
    backContainer.appendChild(previewArea);
    
    // ボタングループを複製
    try {
      // オリジナルのボタングループを探す
      const originalButtons = photoContainer.querySelector('.btn-group, .d-grid, .d-flex');
      
      if (originalButtons) {
        // ボタングループを複製
        const clonedButtons = originalButtons.cloneNode(true);
        
        // IDが重複しないように修正
        clonedButtons.querySelectorAll('[id]').forEach(el => {
          el.id = 'back-' + el.id;
        });
        
        // カメラボタンのテキストを更新
        const cameraButton = clonedButtons.querySelector('button:not(.btn-close)');
        if (cameraButton) {
          if (cameraButton.textContent.includes('カメラ')) {
            cameraButton.textContent = '裏面をカメラで撮影';
          } else if (cameraButton.textContent.includes('撮影')) {
            cameraButton.textContent = '裏面を撮影';
          }
        }
        
        backContainer.appendChild(clonedButtons);
      } else {
        // ボタンが見つからない場合は独自のボタンを作成
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-grid gap-2';
        buttonContainer.style.marginTop = '10px';
        
        const cameraButton = document.createElement('button');
        cameraButton.type = 'button';
        cameraButton.className = 'btn btn-primary';
        cameraButton.textContent = '裏面をカメラで撮影';
        
        buttonContainer.appendChild(cameraButton);
        backContainer.appendChild(buttonContainer);
      }
    } catch (e) {
      console.warn('ボタン複製エラー:', e);
    }
    
    // 写真コンテナの後に裏面コンテナを追加（互換性を考慮した実装）
    try {
      if (photoContainer.parentNode) {
        // after()メソッドが存在しない古いブラウザ対応
        if (typeof photoContainer.after === 'function') {
          photoContainer.after(backContainer);
        } else {
          // 次の兄弟要素の前に挿入
          if (photoContainer.nextSibling) {
            photoContainer.parentNode.insertBefore(backContainer, photoContainer.nextSibling);
          } else {
            // 兄弟要素がなければ末尾に追加
            photoContainer.parentNode.appendChild(backContainer);
          }
        }
        console.log('裏面コンテナを追加しました');
      } else {
        console.warn('写真コンテナに親要素がありません');
        // 親要素がない場合は写真コンテナ自体に追加
        photoContainer.appendChild(backContainer);
      }
    } catch (e) {
      console.error('裏面コンテナ追加エラー:', e);
      
      // エラー回避策として別の場所に追加
      try {
        // モーダルボディに直接追加
        const modalBody = modal.querySelector('.modal-body') || modal;
        modalBody.appendChild(backContainer);
        console.log('代替方法で裏面コンテナを追加しました');
      } catch (e2) {
        console.error('代替追加方法でもエラー:', e2);
      }
    }
    
    // 隠しフィールドを追加
    addHiddenFields(modal);
    
    // フラグを設定
    modal._dualPhotoSetup = true;
    
    console.log('写真エリアを2枚表示に拡張しました');
  }

  // 隠しフィールドを追加
  function addHiddenFields(modal) {
    if (!modal) return;
    
    const form = modal.querySelector('form') || modal;
    
    // すでに存在するかチェック
    if (form.querySelector('#back-photo-data')) return;
    
    // 裏面写真用フィールド
    const backPhotoField = document.createElement('input');
    backPhotoField.type = 'hidden';
    backPhotoField.id = 'back-photo-data';
    backPhotoField.name = 'backPhotoData';
    form.appendChild(backPhotoField);
    
    // 写真モード用フィールド
    const photoModeField = document.createElement('input');
    photoModeField.type = 'hidden';
    photoModeField.id = 'photo-mode-field';
    photoModeField.name = 'photoMode';
    photoModeField.value = 'dual';
    form.appendChild(photoModeField);
    
    console.log('隠しフィールドを追加しました');
  }

  // 初期化実行
  init();
})();