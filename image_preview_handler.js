/**
 * 画像プレビュー機能を向上させるスクリプト
 * iframeを使用して別ウィンドウで画像を表示
 */
(function() {
  'use strict';

  // 初期化
  document.addEventListener('DOMContentLoaded', initImagePreviewHandler);

  /**
   * 初期化
   */
  function initImagePreviewHandler() {
    console.log('画像プレビューハンドラーを初期化しています...');
    
    // 既存のプレビュー画像にクリックイベントを追加
    setupExistingPreviews();
    
    // DOMの変更を監視して新しく追加されたプレビュー画像にもイベントを設定
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          setupAddedNodes(mutation.addedNodes);
        }
      });
    });
    
    // 監視を開始
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * 既存のプレビュー画像に拡大機能を設定
   */
  function setupExistingPreviews() {
    // プレビューコンテナ内のすべての画像にイベントリスナーを設定
    document.querySelectorAll('.preview-container img, .document-preview img').forEach(function(img) {
      setupImagePreview(img);
    });
  }
  
  /**
   * 追加された要素内のプレビュー画像に拡大機能を設定
   * @param {NodeList} nodes 追加されたノード
   */
  function setupAddedNodes(nodes) {
    nodes.forEach(function(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // 追加されたノード内のプレビュー画像を検索
        node.querySelectorAll('.preview-container img, .document-preview img').forEach(function(img) {
          setupImagePreview(img);
        });
        
        // 要素自体が画像かつプレビューコンテナ内にある場合
        if (node.tagName === 'IMG' && 
            (node.closest('.preview-container') || node.closest('.document-preview'))) {
          setupImagePreview(node);
        }
      }
    });
  }
  
  /**
   * 画像プレビューの設定
   * @param {HTMLImageElement} img 画像要素
   */
  function setupImagePreview(img) {
    // すでに設定済みならスキップ
    if (img.hasAttribute('data-preview-handler')) return;
    
    // マーカーを設定
    img.setAttribute('data-preview-handler', 'true');
    
    // ホバー効果のためのクラスを追加
    img.classList.add('preview-zoomable');
    
    // クリックイベントを設定
    img.addEventListener('click', function() {
      // 画像のソースがある場合のみ実行
      if (this.src && this.src !== '') {
        showEnhancedPreview(this.src, this.alt || '画像プレビュー');
      }
    });
    
    console.log('画像プレビュー機能を設定しました:', img.src);
  }
  
  /**
   * 拡張プレビューの表示（拡大画像用オーバーレイ）
   * @param {string} imgSrc 画像のソースURL
   * @param {string} title タイトル
   */
  function showEnhancedPreview(imgSrc, title) {
    // 既存のオーバーレイを削除
    const existingOverlay = document.getElementById('image-preview-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }
    
    // オーバーレイHTML
    const overlayHTML = `
      <div id="image-preview-overlay" class="image-preview-overlay">
        <div class="preview-content">
          <div class="preview-header">
            <h5>${title}</h5>
            <button type="button" class="btn-close" aria-label="閉じる"></button>
          </div>
          <div class="preview-body">
            <img src="${imgSrc}" alt="${title}" class="preview-image">
          </div>
          <div class="preview-footer">
            <div class="preview-controls">
              <button type="button" class="btn btn-sm btn-outline-secondary zoom-out-btn">
                <i class="bi bi-zoom-out"></i>
              </button>
              <span class="zoom-level">100%</span>
              <button type="button" class="btn btn-sm btn-outline-secondary zoom-in-btn">
                <i class="bi bi-zoom-in"></i>
              </button>
            </div>
            <button type="button" class="btn btn-secondary close-btn">閉じる</button>
          </div>
        </div>
      </div>
    `;
    
    // オーバーレイをページに追加
    document.body.insertAdjacentHTML('beforeend', overlayHTML);
    
    // 要素の取得
    const overlay = document.getElementById('image-preview-overlay');
    const closeBtn = overlay.querySelector('.btn-close');
    const closeButton = overlay.querySelector('.close-btn');
    const previewImage = overlay.querySelector('.preview-image');
    const zoomInBtn = overlay.querySelector('.zoom-in-btn');
    const zoomOutBtn = overlay.querySelector('.zoom-out-btn');
    const zoomLevel = overlay.querySelector('.zoom-level');
    
    // 現在のズームレベル
    let currentZoom = 100;
    
    // ズームインボタンのクリックイベント
    zoomInBtn.addEventListener('click', function() {
      if (currentZoom < 200) {
        currentZoom += 20;
        updateZoom();
      }
    });
    
    // ズームアウトボタンのクリックイベント
    zoomOutBtn.addEventListener('click', function() {
      if (currentZoom > 50) {
        currentZoom -= 20;
        updateZoom();
      }
    });
    
    // ズームレベルの更新
    function updateZoom() {
      previewImage.style.transform = `scale(${currentZoom / 100})`;
      zoomLevel.textContent = `${currentZoom}%`;
    }
    
    // 閉じるボタンのクリックイベント
    closeBtn.addEventListener('click', function() {
      overlay.remove();
    });
    
    // 閉じるボタン（フッター）のクリックイベント
    closeButton.addEventListener('click', function() {
      overlay.remove();
    });
    
    // オーバーレイ自体のクリックで閉じる（プレビューコンテンツ以外をクリック時）
    overlay.addEventListener('click', function(event) {
      if (event.target === overlay) {
        overlay.remove();
      }
    });
    
    // ESCキーで閉じる
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && overlay.parentNode) {
        overlay.remove();
      }
    });
    
    // ホイールズーム
    previewImage.addEventListener('wheel', function(event) {
      event.preventDefault();
      
      // ホイールの方向に応じてズームイン・アウト
      if (event.deltaY < 0 && currentZoom < 200) {
        // ズームイン
        currentZoom += 10;
        updateZoom();
      } else if (event.deltaY > 0 && currentZoom > 50) {
        // ズームアウト
        currentZoom -= 10;
        updateZoom();
      }
    });
    
    // タッチデバイス用のピンチズーム処理
    let initialDistance = 0;
    
    previewImage.addEventListener('touchstart', function(event) {
      if (event.touches.length === 2) {
        initialDistance = getTouchDistance(event.touches);
      }
    }, { passive: false });
    
    previewImage.addEventListener('touchmove', function(event) {
      if (event.touches.length === 2) {
        event.preventDefault();
        
        const currentDistance = getTouchDistance(event.touches);
        const distanceChange = currentDistance - initialDistance;
        
        if (Math.abs(distanceChange) > 5) {
          // 距離が増加した場合はズームイン、減少した場合はズームアウト
          if (distanceChange > 0 && currentZoom < 200) {
            currentZoom += 5;
            updateZoom();
          } else if (distanceChange < 0 && currentZoom > 50) {
            currentZoom -= 5;
            updateZoom();
          }
          
          // 初期距離を更新
          initialDistance = currentDistance;
        }
      }
    }, { passive: false });
    
    // タッチ間の距離を計算
    function getTouchDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
  
  // 外部からアクセスできるように設定
  window.imagePreviewHandler = {
    setupImagePreview: setupImagePreview,
    showEnhancedPreview: showEnhancedPreview
  };
})();