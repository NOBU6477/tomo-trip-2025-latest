/**
 * 最終的な横並びレイアウト実装と確実なカメラボタン削除
 * 直接CSSとDOM操作で確実に実現する
 */
(function() {
  console.log('最終横並びレイアウト: 初期化開始');
  
  // CSS定義の追加
  const css = `
    /* カメラボタン非表示 */
    button[data-original-title*="カメラ"],
    button[title*="カメラ"],
    button[aria-label*="カメラ"],
    button.camera-button,
    a.camera-button {
      display: none !important;
    }
    
    /* 横並びコンテナ */
    .license-horizontal-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 20px;
      margin: 15px 0;
    }
    
    /* 横並び項目 */
    .license-horizontal-item {
      flex: 1;
      min-width: 45%;
    }
    
    /* レスポンシブ対応 */
    @media (max-width: 768px) {
      .license-horizontal-container {
        flex-direction: column;
      }
    }
  `;
  
  // スタイル要素を挿入
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
  
  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLayout);
  } else {
    initializeLayout();
  }
  
  // MutationObserverでDOM変更を監視
  function initializeLayout() {
    console.log('最終横並びレイアウト: 初期化実行');
    
    // 定期実行
    setInterval(function() {
      removeAllCameraButtons();
      updateLicenseLayout();
    }, 500);
    
    // MutationObserverの設定
    const observer = new MutationObserver(function(mutations) {
      removeAllCameraButtons();
      updateLicenseLayout();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // モーダル表示イベント
    document.addEventListener('shown.bs.modal', function(e) {
      console.log('最終横並びレイアウト: モーダル表示イベント');
      setTimeout(function() {
        removeAllCameraButtons();
        updateLicenseLayout();
      }, 100);
    });
    
    // すぐに実行
    removeAllCameraButtons();
    updateLicenseLayout();
  }
  
  // すべてのカメラボタンを確実に削除
  function removeAllCameraButtons() {
    // クラスで特定
    document.querySelectorAll('.camera-button, .btn-camera').forEach(function(el) {
      el.style.display = 'none';
    });
    
    // テキストで特定
    document.querySelectorAll('button').forEach(function(button) {
      const text = button.textContent.trim().toLowerCase();
      if (text.includes('カメラ') || text.includes('撮影') || text.includes('camera')) {
        button.style.display = 'none';
      }
    });
    
    // カメラアイコンで特定
    document.querySelectorAll('button i.bi-camera, button i.fa-camera').forEach(function(icon) {
      const button = icon.closest('button');
      if (button) {
        button.style.display = 'none';
      }
    });
    
    // 属性で特定
    document.querySelectorAll('button[data-target*="camera"], button[data-bs-target*="camera"]').forEach(function(el) {
      el.style.display = 'none';
    });
  }
  
  // 免許証表裏のレイアウトを横並びに更新
  function updateLicenseLayout() {
    // すべてのモーダルをチェック
    document.querySelectorAll('.modal').forEach(function(modal) {
      // 表面と裏面の要素を探す
      const sections = findLicenseSections(modal);
      
      if (sections && sections.front && sections.back) {
        // 既に処理済みでないことを確認
        if (!sections.front.closest('.license-horizontal-container')) {
          console.log('最終横並びレイアウト: 免許証セクション検出、横並び適用');
          
          // 横並びコンテナを作成
          const container = document.createElement('div');
          container.className = 'license-horizontal-container';
          
          // 表面の親要素
          const frontParent = sections.front.parentNode;
          if (!frontParent) return;
          
          // コンテナを挿入
          frontParent.insertBefore(container, sections.front);
          
          // 表面と裏面をラップして移動
          const frontWrapper = document.createElement('div');
          frontWrapper.className = 'license-horizontal-item';
          frontWrapper.appendChild(sections.front);
          
          const backWrapper = document.createElement('div');
          backWrapper.className = 'license-horizontal-item';
          backWrapper.appendChild(sections.back);
          
          // コンテナに追加
          container.appendChild(frontWrapper);
          container.appendChild(backWrapper);
        }
      }
    });
  }
  
  // 免許証の表面と裏面のセクションを探す
  function findLicenseSections(container) {
    if (!container) return null;
    
    const allFormGroups = container.querySelectorAll('.form-group, .mb-3');
    
    let frontSection = null;
    let backSection = null;
    
    // テキスト内容で表面と裏面を特定
    for (const group of allFormGroups) {
      const text = group.textContent.toLowerCase();
      if (text.includes('表面') || text.includes('front')) {
        frontSection = group;
      } else if (text.includes('裏面') || text.includes('back')) {
        backSection = group;
      }
    }
    
    if (frontSection && backSection) {
      return { front: frontSection, back: backSection };
    }
    
    return null;
  }
  
  // CSSセレクタのpolyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
  
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }
})();