/**
 * 直接的な方法でで表裏写真機能を実装するスクリプト
 */
(function() {
  'use strict';

  // PCのみを対象
  if (isMobileDevice()) {
    console.log('モバイルデバイスは対象外');
    return;
  }

  console.log('表裏写真直接切替機能を初期化');

  // ユーザーエージェントによるモバイル判定
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // DOM読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 初期化
  function init() {
    // セレクト要素変更の監視
    document.addEventListener('change', function(event) {
      if (event.target.tagName !== 'SELECT') return;
      
      // 運転免許証かどうかチェック
      if (isLicenseSelected(event.target)) {
        console.log('運転免許証選択を検出');
        activateDualPhotoMode(event.target);
      }
    });

    // モーダル表示時のハンドリング
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      // 証明書タイプのセレクト要素をチェック
      const selects = modal.querySelectorAll('select');
      selects.forEach(function(select) {
        if (isLicenseSelected(select)) {
          console.log('モーダル内の運転免許証選択を検出');
          activateDualPhotoMode(select);
        }
      });
    });

    // 1秒後に既存のセレクト要素をチェック（安全のため）
    setTimeout(checkExistingSelects, 1000);
  }

  // 既存のセレクトボックスをチェック
  function checkExistingSelects() {
    const selects = document.querySelectorAll('select');
    selects.forEach(function(select) {
      if (isLicenseSelected(select)) {
        console.log('既存の運転免許証選択を検出');
        activateDualPhotoMode(select);
      }
    });
  }

  // 運転免許証選択チェック
  function isLicenseSelected(select) {
    if (!select || !select.options || select.selectedIndex < 0) return false;
    
    const selectedOption = select.options[select.selectedIndex];
    const selectedText = selectedOption.textContent || '';
    
    return selectedText.includes('運転免許証') || 
           (selectedText.toLowerCase().includes('driver') && 
            selectedText.toLowerCase().includes('license'));
  }

  // 表裏写真モードを有効化
  function activateDualPhotoMode(selectElement) {
    // モーダルを探す
    const modal = findClosestModal(selectElement);
    if (!modal) return;
    
    console.log('表裏写真モードを有効化');
    
    // ラジオボタン選択
    selectDualPhotoRadio(modal);
    
    // 写真エリアを拡張
    setupDualPhotoArea(modal);
  }

  // 最も近いモーダルを見つける
  function findClosestModal(element) {
    let current = element;
    let i = 0;
    
    while (current && i < 10) {
      if (current.classList && current.classList.contains('modal')) {
        return current;
      }
      current = current.parentElement;
      i++;
    }
    
    return document.querySelector('.modal.show');
  }

  // 表裏写真ラジオボタン選択
  function selectDualPhotoRadio(container) {
    // すべてのラジオボタン検索
    const radioButtons = container.querySelectorAll('input[type="radio"][name="photoType"]');
    if (radioButtons.length < 2) {
      console.warn('ラジオボタンが見つかりません');
      return;
    }
    
    // 2番目のラジオボタンを選択(表裏写真)
    const dualRadio = radioButtons[1];
    if (dualRadio) {
      dualRadio.checked = true;
      
      // イベント発火
      try {
        const event = new Event('change', { bubbles: true });
        dualRadio.dispatchEvent(event);
      } catch (e) {
        console.warn('ラジオボタンイベント発火失敗:', e);
      }
      
      console.log('表裏写真ラジオボタンを選択しました');
    }
  }

  // 写真エリアを2枚表示に拡張
  function setupDualPhotoArea(container) {
    // 既にセットアップ済みかチェック
    if (container.querySelector('.back-photo-container')) {
      console.log('既にセットアップ済み');
      return;
    }
    
    // 写真領域を検索（複数の方法で検索）
    let photoArea = findPhotoArea(container);
    
    if (!photoArea) {
      console.warn('写真領域が見つかりません');
      return;
    }
    
    // 既存の写真フィールドを「表面」とラベル付け
    const frontLabel = document.createElement('div');
    frontLabel.className = 'front-photo-label mb-2';
    frontLabel.textContent = '表面の写真';
    frontLabel.style.fontWeight = 'bold';
    frontLabel.style.fontSize = '14px';
    frontLabel.style.color = '#555';
    
    try {
      // 写真エリアの最初に挿入
      if (photoArea.firstChild) {
        photoArea.insertBefore(frontLabel, photoArea.firstChild);
      } else {
        photoArea.appendChild(frontLabel);
      }
    } catch (e) {
      console.warn('表面ラベル追加エラー:', e);
    }

    // 裏面写真用のコンテナを作成
    const backContainer = document.createElement('div');
    backContainer.className = 'back-photo-container mt-3 mb-3';
    backContainer.style.marginTop = '15px';
    backContainer.style.paddingTop = '15px';
    backContainer.style.borderTop = '1px solid #eee';
    
    // 裏面ラベル
    const backLabel = document.createElement('div');
    backLabel.className = 'back-photo-label mb-2';
    backLabel.textContent = '裏面の写真';
    backLabel.style.fontWeight = 'bold';
    backLabel.style.fontSize = '14px';
    backLabel.style.color = '#555';
    backContainer.appendChild(backLabel);
    
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
    previewImg.style.maxHeight = '100%';
    previewImg.style.maxWidth = '100%';
    previewImg.style.display = 'none';
    previewContainer.appendChild(previewImg);
    
    // プレースホルダー
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.textContent = '裏面写真はまだ設定されていません';
    placeholder.style.color = '#6c757d';
    previewContainer.appendChild(placeholder);
    
    backContainer.appendChild(previewContainer);
    
    // ボタンコンテナ
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-grid gap-2';
    
    // カメラボタン
    const cameraButton = document.createElement('button');
    cameraButton.type = 'button';
    cameraButton.className = 'btn btn-primary';
    cameraButton.textContent = '裏面をカメラで撮影';
    cameraButton.addEventListener('click', function() {
      // ここにカメラ機能を実装
      console.log('裏面撮影ボタンがクリックされました');
    });
    
    buttonContainer.appendChild(cameraButton);
    backContainer.appendChild(buttonContainer);
    
    // 隠しフィールド
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'backPhotoData';
    hiddenField.id = 'back-photo-data';
    backContainer.appendChild(hiddenField);
    
    // 写真エリアの後に挿入
    try {
      // 複数の方法を試行（ブラウザ互換性のため）
      if (typeof photoArea.after === 'function') {
        photoArea.after(backContainer);
      } else if (photoArea.parentNode) {
        if (photoArea.nextSibling) {
          photoArea.parentNode.insertBefore(backContainer, photoArea.nextSibling);
        } else {
          photoArea.parentNode.appendChild(backContainer);
        }
      } else {
        // 最終手段
        const form = container.querySelector('form');
        if (form) {
          form.appendChild(backContainer);
        } else {
          const modalBody = container.querySelector('.modal-body');
          if (modalBody) {
            modalBody.appendChild(backContainer);
          } else {
            container.appendChild(backContainer);
          }
        }
      }
      console.log('裏面写真コンテナを追加しました');
    } catch (e) {
      console.error('裏面コンテナ追加エラー:', e);
      // 最終的な手段
      try {
        container.appendChild(backContainer);
      } catch (e2) {
        console.error('最終的な追加方法もエラー:', e2);
      }
    }
  }

  // 写真エリアを見つける（複数の方法を試行）
  function findPhotoArea(container) {
    // 方法1: プレビュー画像から見つける
    const previewImg = container.querySelector('img.preview-image') ||
                      container.querySelector('img[alt="写真プレビュー"]') ||
                      container.querySelector('img[alt="Photo Preview"]');
    
    if (previewImg) {
      // 親のフォームグループを探す
      let parent = previewImg.parentElement;
      while (parent && parent !== container) {
        if (parent.classList && 
            (parent.classList.contains('form-group') || parent.classList.contains('mb-3'))) {
          return parent;
        }
        parent = parent.parentElement;
      }
      
      // 直接の親を返す
      return previewImg.parentElement;
    }
    
    // 方法2: ファイル入力から見つける
    const fileInput = container.querySelector('input[type="file"][accept*="image"]');
    if (fileInput) {
      // 親のフォームグループを探す
      let parent = fileInput.parentElement;
      while (parent && parent !== container) {
        if (parent.classList && 
            (parent.classList.contains('form-group') || parent.classList.contains('mb-3'))) {
          return parent;
        }
        parent = parent.parentElement;
      }
      
      // 直接の親を返す
      return fileInput.parentElement;
    }
    
    // 方法3: 証明写真タイプのラベルから探す
    const photoTypeLabel = Array.from(container.querySelectorAll('*')).find(
      el => el.textContent && 
           (el.textContent.trim() === 'photo title' || el.textContent.trim() === '証明写真タイプ')
    );
    
    if (photoTypeLabel) {
      // フォームグループを探す
      let parent = photoTypeLabel.parentElement;
      while (parent && parent !== container) {
        // 子要素に画像またはファイル入力があるか確認
        if (parent.querySelector('img') || parent.querySelector('input[type="file"]')) {
          return parent;
        }
        parent = parent.parentElement;
      }
    }
    
    // 方法4: photo title配下の最初のフォームグループを返す
    const photoTitle = Array.from(container.querySelectorAll('div, h5, label')).find(
      el => el.textContent && el.textContent.includes('photo title')
    );
    
    if (photoTitle) {
      const nextFormGroup = Array.from(container.querySelectorAll('.form-group, .mb-3')).find(
        el => {
          const rect1 = photoTitle.getBoundingClientRect();
          const rect2 = el.getBoundingClientRect();
          return rect2.top >= rect1.bottom;
        }
      );
      
      if (nextFormGroup) {
        return nextFormGroup;
      }
    }
    
    return null;
  }
})();