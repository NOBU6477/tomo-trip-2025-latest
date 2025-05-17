/**
 * 表裏写真機能の最終修正版
 * より直接的なアプローチで写真エリアを2枚表示にする
 */
(function() {
  'use strict';
  
  // PC環境でのみ実行
  if (isMobileDevice()) {
    console.log('モバイルデバイスを検出: PC用修正をスキップします');
    return;
  }
  
  // 初期化
  function init() {
    console.log('表裏写真の最終修正を初期化');
    
    // DOMロード完了時または即時実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupListeners);
    } else {
      setupListeners();
    }
  }
  
  // モバイルデバイスかどうかを判定
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  // イベントリスナーのセットアップ
  function setupListeners() {
    // モーダル表示を監視
    document.addEventListener('shown.bs.modal', handleModalShown);
    
    // セレクト変更を監視
    document.addEventListener('change', handleSelectChange);
    
    // ボタンクリックを監視（登録ボタン用）
    document.addEventListener('click', function(event) {
      const target = event.target;
      if (target.tagName === 'BUTTON' && 
          (target.textContent.includes('登録') || target.classList.contains('guide-register-btn') || 
           target.classList.contains('tourist-register-btn'))) {
        setTimeout(function() {
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            checkIdDocumentType(modal);
          });
        }, 500);
      }
    });
    
    // 既存のモーダルをチェック
    setTimeout(function() {
      document.querySelectorAll('.modal.show').forEach(function(modal) {
        checkIdDocumentType(modal);
      });
    }, 500);
  }
  
  // モーダル表示時の処理
  function handleModalShown(event) {
    const modal = event.target;
    
    if (!modal || !modal.classList || !modal.classList.contains('modal')) return;
    
    // 身分証明書タイプをチェック
    checkIdDocumentType(modal);
  }
  
  // セレクト変更時の処理
  function handleSelectChange(event) {
    if (event.target.tagName !== 'SELECT') return;
    
    const select = event.target;
    const modal = findParentModal(select);
    
    if (!modal) return;
    
    // 運転免許証選択チェック
    if (isLicenseSelected(select)) {
      console.log('運転免許証が選択されました');
      
      // 表裏ラジオボタンを選択
      selectDualPhotoRadio(modal);
      
      // 写真エリアを拡張（最も確実な実装）
      setupDualPhotoArea(modal);
    }
  }
  
  // 身分証明書タイプのチェック
  function checkIdDocumentType(modal) {
    if (!modal) return;
    
    // セレクト要素を探す
    const selects = modal.querySelectorAll('select');
    let hasLicense = false;
    
    // 各セレクトをチェック
    selects.forEach(function(select) {
      if (isLicenseSelected(select)) {
        hasLicense = true;
      }
    });
    
    // 運転免許証が選択されていれば処理
    if (hasLicense) {
      console.log('身分証明書チェック: 運転免許証を検出');
      
      // 表裏ラジオボタンを選択
      selectDualPhotoRadio(modal);
      
      // 写真エリアを拡張
      setupDualPhotoArea(modal);
    }
  }
  
  // 運転免許証選択チェック
  function isLicenseSelected(select) {
    if (!select || !select.options || select.selectedIndex < 0) return false;
    
    const selectedText = select.options[select.selectedIndex].textContent || '';
    
    return selectedText.includes('運転免許証') || 
           (selectedText.toLowerCase().includes('driver') && 
            selectedText.toLowerCase().includes('license'));
  }
  
  // 親モーダルを探す
  function findParentModal(element) {
    if (!element) return null;
    
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
    if (!modal) return;
    
    // すべてのラジオボタンを探す
    const radios = modal.querySelectorAll('input[type="radio"][name="photoType"]');
    
    // 表裏写真ラジオボタン（通常2番目）を選択
    if (radios.length >= 2) {
      radios[1].checked = true;
      
      try {
        // 変更イベントを発火
        const event = new Event('change', { bubbles: true });
        radios[1].dispatchEvent(event);
      } catch (e) {
        console.warn('ラジオボタンイベント発火エラー:', e);
      }
      
      console.log('表裏写真ラジオボタンを選択しました');
    }
  }
  
  // 写真エリアを2枚表示に拡張
  function setupDualPhotoArea(modal) {
    if (!modal) return;
    
    // すでに裏面コンテナが存在するか確認
    if (modal.querySelector('.back-photo-container')) {
      console.log('裏面コンテナはすでに存在します');
      return;
    }
    
    console.log('写真エリアを2枚表示に拡張します（最終方式）');
    
    // 最も確実な方法でモーダルボディを取得
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
      console.warn('モーダルボディが見つかりません');
      return;
    }
    
    // モーダルボディ内のすべての写真関連要素を探す
    const photoInputs = modalBody.querySelectorAll('input[type="file"][accept*="image"]');
    if (photoInputs.length === 0) {
      console.warn('写真入力要素が見つかりません');
      return;
    }
    
    // 写真入力要素の近くに表面/裏面ラベルを直接挿入する
    for (const photoInput of photoInputs) {
      // 最も近い親のフォームグループを探す
      let formGroup = photoInput.parentElement;
      while (formGroup && 
             !formGroup.classList.contains('form-group') && 
             !formGroup.classList.contains('mb-3') &&
             formGroup !== modalBody) {
        formGroup = formGroup.parentElement;
      }
      
      if (!formGroup || formGroup === modalBody) {
        console.warn('フォームグループが見つかりません');
        continue;
      }
      
      // すでにラベル付けされているかチェック
      const existingLabels = formGroup.querySelectorAll('.front-label, .back-label');
      if (existingLabels.length > 0) {
        console.log('すでにラベル付けされています');
        continue;
      }
      
      // 「表面の写真」ラベルを作成
      const frontLabel = document.createElement('div');
      frontLabel.className = 'front-label text-muted mb-2';
      frontLabel.textContent = '表面の写真';
      frontLabel.style.fontSize = '14px';
      frontLabel.style.fontWeight = 'bold';
      
      // 写真入力の前に挿入（最大限の互換性のための実装）
      try {
        if (photoInput.previousElementSibling) {
          formGroup.insertBefore(frontLabel, photoInput);
        } else {
          formGroup.insertBefore(frontLabel, formGroup.firstChild);
        }
      } catch (e) {
        console.warn('表面ラベル挿入エラー:', e);
        try {
          formGroup.appendChild(frontLabel);
        } catch (e2) {
          console.error('表面ラベル追加失敗:', e2);
        }
      }
      
      // 裏面コンテナを作成
      const backContainer = document.createElement('div');
      backContainer.className = 'back-photo-container form-group mb-3';
      backContainer.style.marginTop = '20px';
      backContainer.style.paddingTop = '10px';
      backContainer.style.borderTop = '1px solid #eee';
      
      // 「裏面の写真」ラベル
      const backLabel = document.createElement('div');
      backLabel.className = 'back-label text-muted mb-2';
      backLabel.textContent = '裏面の写真';
      backLabel.style.fontSize = '14px';
      backLabel.style.fontWeight = 'bold';
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
      
      // ボタンコンテナを複製
      try {
        // 元のボタングループを探す
        const buttonGroup = formGroup.querySelector('.btn-group') || 
                           formGroup.querySelector('.d-grid') ||
                           formGroup.querySelector('.d-flex');
        
        if (buttonGroup) {
          // ボタングループを複製
          const clonedButtons = buttonGroup.cloneNode(true);
          
          // ID衝突を回避
          clonedButtons.querySelectorAll('[id]').forEach(el => {
            el.id = 'back-' + el.id;
          });
          
          // カメラボタンのテキスト更新
          const cameraButton = clonedButtons.querySelector('button');
          if (cameraButton) {
            if (cameraButton.textContent.includes('カメラ')) {
              cameraButton.textContent = '裏面をカメラで撮影';
            } else if (cameraButton.textContent.includes('撮影')) {
              cameraButton.textContent = '裏面を撮影';
            }
          }
          
          backContainer.appendChild(clonedButtons);
        } else {
          // 独自のボタンを作成
          const backButtonContainer = document.createElement('div');
          backButtonContainer.className = 'd-grid gap-2';
          
          const backCameraButton = document.createElement('button');
          backCameraButton.type = 'button';
          backCameraButton.className = 'btn btn-primary';
          backCameraButton.textContent = '裏面をカメラで撮影';
          
          backButtonContainer.appendChild(backCameraButton);
          backContainer.appendChild(backButtonContainer);
        }
      } catch (e) {
        console.warn('ボタン複製エラー:', e);
      }
      
      // 裏面写真用の隠しフィールド
      const backPhotoField = document.createElement('input');
      backPhotoField.type = 'hidden';
      backPhotoField.id = 'back-photo-field';
      backPhotoField.name = 'backPhotoData';
      backContainer.appendChild(backPhotoField);
      
      // 最も確実な方法で裏面コンテナを追加
      try {
        formGroup.after(backContainer);
      } catch (e) {
        console.warn('after()メソッドエラー:', e);
        
        try {
          // バックアップ方法1: parentNodeのinsertBeforeを使用
          if (formGroup.parentNode && formGroup.nextSibling) {
            formGroup.parentNode.insertBefore(backContainer, formGroup.nextSibling);
          }
          // バックアップ方法2: 親の末尾に追加
          else if (formGroup.parentNode) {
            formGroup.parentNode.appendChild(backContainer);
          }
          // 最終手段: モーダルボディに直接追加
          else {
            modalBody.appendChild(backContainer);
          }
        } catch (e2) {
          console.error('バックアップ追加方法エラー:', e2);
          
          // 最終手段の最終手段
          try {
            modalBody.appendChild(backContainer);
          } catch (e3) {
            console.error('最終追加方法エラー:', e3);
          }
        }
      }
    }
    
    console.log('写真エリアを2枚表示に拡張しました');
  }
  
  // 初期化実行
  init();
})();