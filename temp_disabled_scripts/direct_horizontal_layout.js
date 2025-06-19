/**
 * 直接DOM操作による書類アップロード横並びレイアウト
 * HTML構造に直接介入して確実に横並びにする
 */
(function() {
  console.log('直接横並びレイアウト: 初期化開始');
  
  // スタイルの定義
  const styles = `
    /* 横並び要素のスタイル */
    .horizontal-container {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      margin-bottom: 1rem;
      width: 100%;
    }
    
    /* 横並び要素の子要素 */
    .horizontal-item {
      flex: 1;
      min-width: 45%;
    }
    
    /* レスポンシブ対応 */
    @media (max-width: 768px) {
      .horizontal-container {
        flex-direction: column;
      }
    }
  `;
  
  // スタイルの挿入
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
  
  // DOM読み込み時に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // モーダル表示時にも実行
  document.addEventListener('shown.bs.modal', function(e) {
    console.log('直接横並びレイアウト: モーダル表示イベント検出');
    setTimeout(function() {
      applyHorizontalLayoutToModal(e.target);
    }, 100);
  });
  
  // DOMの変更を監視
  function init() {
    console.log('直接横並びレイアウト: 初期化実行');
    
    // 既存のモーダルを処理
    document.querySelectorAll('.modal.show').forEach(function(modal) {
      applyHorizontalLayoutToModal(modal);
    });
    
    // MutationObserverの設定
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              if (node.classList && node.classList.contains('modal')) {
                setTimeout(function() {
                  applyHorizontalLayoutToModal(node);
                }, 100);
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // モーダルに横並びレイアウトを適用
  function applyHorizontalLayoutToModal(modal) {
    if (!modal) return;
    
    console.log('直接横並びレイアウト: モーダル処理');
    
    // 運転免許証関連のアップロードエリアを探す
    const documentItems = findDocumentItems(modal);
    
    if (documentItems && documentItems.front && documentItems.back) {
      console.log('直接横並びレイアウト: 表裏書類セクションを検出');
      applyHorizontalLayout(documentItems.front, documentItems.back);
      
      // カメラボタンの削除
      removeCameraButtons(modal);
    }
  }
  
  // 書類アップロード要素を探す
  function findDocumentItems(container) {
    // 書類関連の項目を含むブロックを探す
    const allBlocks = container.querySelectorAll('.form-group, .mb-3');
    
    let frontBlock = null;
    let backBlock = null;
    
    for (const block of allBlocks) {
      const text = block.textContent.toLowerCase();
      if (text.includes('表面') || text.includes('front')) {
        frontBlock = block;
      } else if (text.includes('裏面') || text.includes('back')) {
        backBlock = block;
      }
    }
    
    if (frontBlock && backBlock) {
      return { front: frontBlock, back: backBlock };
    }
    
    return null;
  }
  
  // 横並びレイアウトを適用
  function applyHorizontalLayout(frontBlock, backBlock) {
    // すでに適用済みかチェック
    if (frontBlock.closest('.horizontal-container')) {
      console.log('直接横並びレイアウト: すでに適用済み');
      return;
    }
    
    console.log('直接横並びレイアウト: レイアウト適用');
    
    // 親要素の取得
    const parent = frontBlock.parentNode;
    if (!parent) return;
    
    // 横並びコンテナの作成
    const container = document.createElement('div');
    container.className = 'horizontal-container';
    
    // 前のブロックの前に挿入
    parent.insertBefore(container, frontBlock);
    
    // 各ブロックをラップしてコンテナに移動
    const frontWrapper = document.createElement('div');
    frontWrapper.className = 'horizontal-item';
    const backWrapper = document.createElement('div');
    backWrapper.className = 'horizontal-item';
    
    // クローンして移動（元の参照を保持）
    frontWrapper.appendChild(frontBlock);
    backWrapper.appendChild(backBlock);
    
    // コンテナに追加
    container.appendChild(frontWrapper);
    container.appendChild(backWrapper);
  }
  
  // カメラボタンを削除
  function removeCameraButtons(container) {
    console.log('直接横並びレイアウト: カメラボタン削除');
    
    // テキストでカメラボタンを特定
    container.querySelectorAll('button').forEach(function(button) {
      const text = button.textContent.trim().toLowerCase();
      if (text.includes('カメラ') || text.includes('撮影') || text.includes('camera')) {
        console.log('直接横並びレイアウト: カメラボタン削除 -', text);
        button.remove();
      }
    });
    
    // クラス名でカメラボタンを特定
    container.querySelectorAll('.camera-button, .btn-camera, [data-target*="camera"], [data-bs-target*="camera"]').forEach(function(button) {
      button.remove();
    });
    
    // アイコンでカメラボタンを特定
    container.querySelectorAll('button i.bi-camera, button i.fa-camera').forEach(function(icon) {
      const button = icon.closest('button');
      if (button) button.remove();
    });
  }
})();