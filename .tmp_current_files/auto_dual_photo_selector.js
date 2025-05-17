/**
 * 書類タイプに応じたラジオボタン自動選択と写真2枚表示機能
 * PC環境向けの拡張機能
 */
(function() {
  'use strict';

  // PC環境のみ実行 - スマートフォンには影響を与えない
  if (isMobileDevice()) {
    console.log('モバイルデバイスを検出: PC用拡張機能をスキップします');
    return;
  }

  // グローバル状態
  const state = {
    // 選択された書類タイプが免許証かどうか
    isLicenseSelected: false,
    // 表面写真
    frontPhoto: null,
    // 裏面写真
    backPhoto: null
  };

  // 初期化
  function init() {
    console.log('表裏写真自動選択・二枚表示機能を初期化中...');
    
    // DOMの読み込みが完了したら実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
      setupEventListeners();
    }
  }

  // モバイルデバイスかどうかを判定
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // イベントリスナーの設定
  function setupEventListeners() {
    // モーダル表示イベント
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      setTimeout(function() {
        setupDocumentTypeListener(modal);
        checkExistingDocumentType(modal);
      }, 300);
    });

    // セレクト変更イベントをグローバルに監視
    document.addEventListener('change', function(event) {
      if (event.target.tagName === 'SELECT') {
        const select = event.target;
        checkIfLicenseSelected(select);
      }
    });

    // すでに表示されているモーダルを確認
    setTimeout(function() {
      document.querySelectorAll('.modal.show').forEach(function(modal) {
        setupDocumentTypeListener(modal);
        checkExistingDocumentType(modal);
      });
    }, 500);
  }

  // 書類タイプの変更リスナーを設定
  function setupDocumentTypeListener(modal) {
    if (!modal) return;

    // 書類タイプのセレクト要素を探す
    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      if (!select._hasTypeListener) {
        select.addEventListener('change', function() {
          checkIfLicenseSelected(this);
        });
        select._hasTypeListener = true;
        console.log('書類タイプセレクト要素にリスナーを設定しました');
      }
    });
  }

  // 既存の書類タイプを確認
  function checkExistingDocumentType(modal) {
    if (!modal) return;

    const selects = modal.querySelectorAll('select');
    selects.forEach(function(select) {
      checkIfLicenseSelected(select);
    });
  }

  // 運転免許証が選択されているかチェック
  function checkIfLicenseSelected(select) {
    if (!select || !select.options || select.selectedIndex === -1) return;

    try {
      const selectedOption = select.options[select.selectedIndex];
      const selectedText = selectedOption.textContent || '';

      // 運転免許証が選択されているか確認
      if (selectedText.includes('運転免許証') || 
          selectedText.toLowerCase().includes('driver') && 
          selectedText.toLowerCase().includes('license')) {
        console.log('運転免許証が選択されました');
        state.isLicenseSelected = true;
        
        // モーダルを探す
        const modal = findContainingModal(select);
        if (modal) {
          // 表裏写真ラジオボタンを自動選択
          selectDualPhotoRadio(modal);
          // 写真エリアを2枚表示用に拡張
          setupDualPhotoArea(modal);
        }
      } else if (selectedText && selectedText.length > 0) {
        state.isLicenseSelected = false;
        console.log('その他の書類が選択されました: ' + selectedText);
      }
    } catch (error) {
      console.error('書類タイプ確認エラー:', error);
    }
  }

  // 要素を含むモーダルを探す
  function findContainingModal(element) {
    if (!element) return null;

    let current = element;
    for (let i = 0; i < 10; i++) { // 最大10階層まで探索
      if (!current) return null;
      
      if (current.classList && current.classList.contains('modal')) {
        return current;
      }
      
      current = current.parentElement;
    }
    
    return null;
  }

  // 表裏写真ラジオボタンを自動選択
  function selectDualPhotoRadio(modal) {
    console.log('表裏写真ラジオボタンを自動選択します');
    
    try {
      // 1. 表裏写真に関連するラジオボタンを探す
      const radioButtons = modal.querySelectorAll('input[type="radio"][name="photoType"]');
      let dualRadio = null;
      
      // ラジオボタンを探す
      for (const radio of radioButtons) {
        const nextNode = radio.nextSibling;
        let radioLabel = '';
        
        // ラベルテキストを取得
        if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
          radioLabel = nextNode.textContent.trim();
        } else if (nextNode && nextNode.nodeType === Node.ELEMENT_NODE) {
          radioLabel = nextNode.textContent.trim();
        }
        
        // テキストが表裏写真に関連する場合
        if (radioLabel.includes('表裏写真') || 
            radioLabel.includes('運転免許証') || 
            radioLabel.includes('dual')) {
          dualRadio = radio;
          break;
        }
      }
      
      // 2. ラジオボタンが見つかった場合は選択
      if (dualRadio) {
        dualRadio.checked = true;
        
        // 変更イベントを発火してラジオボタン選択を通知
        const event = new Event('change', { bubbles: true });
        dualRadio.dispatchEvent(event);
        
        console.log('表裏写真ラジオボタンを選択しました');
        return true;
      } else {
        console.warn('表裏写真ラジオボタンが見つかりませんでした');
      }
    } catch (error) {
      console.error('ラジオボタン選択エラー:', error);
    }
    
    return false;
  }

  // 写真エリアを2枚表示用に拡張
  function setupDualPhotoArea(modal) {
    console.log('写真エリアを2枚表示用に拡張します');
    
    try {
      // 1. 既存の写真エリアを探す
      const photoContainer = findPhotoContainer(modal);
      if (!photoContainer) {
        console.warn('写真コンテナが見つかりません');
        return;
      }
      
      // 2. 既に拡張済みかチェック
      if (photoContainer.querySelector('.back-photo-container')) {
        console.log('既に2枚表示用に拡張済みです');
        return;
      }
      
      // 3. 裏面写真用のコンテナを作成
      const backPhotoContainer = document.createElement('div');
      backPhotoContainer.className = 'back-photo-container mt-3';
      backPhotoContainer.style.marginTop = '15px';
      
      // 裏面写真ラベル
      const backLabel = document.createElement('div');
      backLabel.className = 'text-muted mb-2';
      backLabel.textContent = '裏面の写真';
      backLabel.style.fontSize = '14px';
      backLabel.style.fontWeight = 'bold';
      backPhotoContainer.appendChild(backLabel);
      
      // 裏面写真プレビュー
      const backPreviewArea = document.createElement('div');
      backPreviewArea.className = 'back-preview-area';
      backPreviewArea.style.width = '100%';
      backPreviewArea.style.height = '200px';
      backPreviewArea.style.border = '1px dashed #ccc';
      backPreviewArea.style.backgroundColor = '#f8f9fa';
      backPreviewArea.style.display = 'flex';
      backPreviewArea.style.alignItems = 'center';
      backPreviewArea.style.justifyContent = 'center';
      backPreviewArea.style.overflow = 'hidden';
      backPreviewArea.style.position = 'relative';
      
      // 裏面写真プレビュー画像
      const backPreviewImg = document.createElement('img');
      backPreviewImg.className = 'back-preview-image';
      backPreviewImg.alt = '裏面写真プレビュー';
      backPreviewImg.style.maxWidth = '100%';
      backPreviewImg.style.maxHeight = '100%';
      backPreviewImg.style.display = 'none';
      backPreviewArea.appendChild(backPreviewImg);
      
      // プレースホルダーテキスト
      const placeholder = document.createElement('span');
      placeholder.textContent = '裏面写真はまだ設定されていません';
      placeholder.style.color = '#6c757d';
      placeholder.style.textAlign = 'center';
      placeholder.className = 'back-placeholder';
      backPreviewArea.appendChild(placeholder);
      
      backPhotoContainer.appendChild(backPreviewArea);
      
      // 4. 既存の写真コンテナに「表面」ラベルを追加
      const frontLabel = document.createElement('div');
      frontLabel.className = 'text-muted mb-2';
      frontLabel.textContent = '表面の写真';
      frontLabel.style.fontSize = '14px';
      frontLabel.style.fontWeight = 'bold';
      
      // 既存のプレビュー要素の前に挿入
      const existingPreview = photoContainer.querySelector('img') || 
                              photoContainer.querySelector('.photo-preview') ||
                              photoContainer.firstChild;
      
      if (existingPreview && existingPreview.parentNode) {
        existingPreview.parentNode.insertBefore(frontLabel, existingPreview);
      } else {
        photoContainer.insertBefore(frontLabel, photoContainer.firstChild);
      }
      
      // 5. 写真コンテナの後に裏面コンテナを追加
      photoContainer.after(backPhotoContainer);
      
      // 6. 必要な隠しフィールドを追加
      addHiddenFields(modal);
      
      console.log('写真エリアを2枚表示用に拡張しました');
    } catch (error) {
      console.error('写真エリア拡張エラー:', error);
    }
  }

  // 写真コンテナを探す
  function findPhotoContainer(modal) {
    if (!modal) return null;
    
    try {
      // 1. 直接的なセレクタで探す
      let container = modal.querySelector('.photo-container') || 
                      modal.querySelector('.photo-preview-container');
      
      if (container) return container;
      
      // 2. ファイル入力要素を基準に探す
      const fileInput = modal.querySelector('input[type="file"][accept*="image"]');
      if (fileInput) {
        // 親の.form-groupか.mb-3を探す
        let parent = fileInput.parentElement;
        while (parent && !parent.classList.contains('form-group') && !parent.classList.contains('mb-3')) {
          parent = parent.parentElement;
          if (parent === modal) break;
        }
        return parent;
      }
      
      // 3. 画像要素を基準に探す
      const image = modal.querySelector('img.preview-image') || 
                    modal.querySelector('img[alt="写真プレビュー"]') ||
                    modal.querySelector('img[alt="Photo Preview"]');
      
      if (image) {
        // 親の.form-groupか.mb-3を探す
        let parent = image.parentElement;
        while (parent && !parent.classList.contains('form-group') && !parent.classList.contains('mb-3')) {
          parent = parent.parentElement;
          if (parent === modal) break;
        }
        return parent;
      }
    } catch (error) {
      console.error('写真コンテナ検索エラー:', error);
    }
    
    return null;
  }

  // 隠しフィールドを追加
  function addHiddenFields(modal) {
    try {
      // 既存のフィールドを確認
      if (modal.querySelector('#back-photo-data') && modal.querySelector('#photo-mode-field')) {
        return;
      }
      
      // フォームを探す
      const form = modal.querySelector('form') || modal;
      
      // 裏面写真用フィールド
      if (!modal.querySelector('#back-photo-data')) {
        const backPhotoField = document.createElement('input');
        backPhotoField.type = 'hidden';
        backPhotoField.id = 'back-photo-data';
        backPhotoField.name = 'backPhotoData';
        form.appendChild(backPhotoField);
      }
      
      // 写真モード用フィールド
      if (!modal.querySelector('#photo-mode-field')) {
        const photoModeField = document.createElement('input');
        photoModeField.type = 'hidden';
        photoModeField.id = 'photo-mode-field';
        photoModeField.name = 'photoMode';
        photoModeField.value = 'dual';
        form.appendChild(photoModeField);
      }
      
      console.log('隠しフィールドを追加しました');
    } catch (error) {
      console.error('隠しフィールド追加エラー:', error);
    }
  }

  // 初期化実行
  init();
})();