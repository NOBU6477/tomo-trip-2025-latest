/**
 * モバイル対応ツールバーアダプター
 * PC仕様をモバイル端末に適応させる
 */

console.log('📱 モバイル対応ツールバーアダプター開始');

// モバイル検出
function isMobileDevice() {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// タブレット検出
function isTabletDevice() {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// PC仕様をモバイルに適応
function adaptPCSpecsToMobile() {
  if (!isMobileDevice()) {
    console.log('📱 PC環境のため、モバイル適応はスキップ');
    return;
  }

  console.log('📱 モバイル端末検出 - PC仕様を適応中');

  // フローティングツールバーのモバイル適応
  adaptFloatingToolbarForMobile();
  
  // フィルターモーダルのモバイル最適化
  adaptFilterModalForMobile();
  
  // ガイドカードのモバイル表示調整
  adaptGuideCardsForMobile();
  
  // キーボードナビゲーションのモバイル調整
  adaptKeyboardNavigationForMobile();
  
  console.log('✅ モバイル適応完了');
}

function adaptFloatingToolbarForMobile() {
  console.log('📱 フローティングツールバーのモバイル適応');
  
  const toolbar = document.getElementById('floating-toolbar');
  if (!toolbar) {
    console.log('⚠️ ツールバーが見つかりません');
    return;
  }

  // モバイル専用スタイルを適用
  const mobileStyle = document.createElement('style');
  mobileStyle.id = 'mobile-toolbar-style';
  mobileStyle.textContent = `
    @media (max-width: 768px) {
      #floating-toolbar {
        position: fixed !important;
        bottom: 10px !important;
        right: 10px !important;
        left: 10px !important;
        width: calc(100% - 20px) !important;
        max-width: none !important;
        z-index: 9999 !important;
        background: rgba(0, 0, 0, 0.9) !important;
        border-radius: 15px !important;
        padding: 15px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
        transform: none !important;
      }

      #floating-toolbar .toolbar-content {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        justify-content: center !important;
      }

      #floating-toolbar .btn {
        font-size: 12px !important;
        padding: 8px 12px !important;
        border-radius: 20px !important;
        flex: 1 1 auto !important;
        min-width: 80px !important;
        text-align: center !important;
      }

      #floating-toolbar .dropdown-menu {
        position: absolute !important;
        bottom: 100% !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        margin-bottom: 10px !important;
        max-height: 200px !important;
        overflow-y: auto !important;
      }

      /* タッチフレンドリーなボタンサイズ */
      #floating-toolbar button {
        min-height: 44px !important;
        touch-action: manipulation !important;
      }

      /* スワイプ操作のヒント */
      #floating-toolbar::before {
        content: "← スワイプで操作 →";
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.1);
        color: white;
        padding: 4px 12px;
        border-radius: 10px;
        font-size: 10px;
        white-space: nowrap;
        animation: fadeInOut 3s infinite;
      }

      @keyframes fadeInOut {
        0%, 50%, 100% { opacity: 0.3; }
        25%, 75% { opacity: 1; }
      }
    }

    @media (max-width: 480px) {
      #floating-toolbar {
        bottom: 5px !important;
        left: 5px !important;
        right: 5px !important;
        width: calc(100% - 10px) !important;
        padding: 10px !important;
      }

      #floating-toolbar .btn {
        font-size: 11px !important;
        padding: 6px 8px !important;
        min-width: 70px !important;
      }
    }
  `;
  
  document.head.appendChild(mobileStyle);
  console.log('✅ ツールバーモバイルスタイル適用完了');
}

function adaptFilterModalForMobile() {
  console.log('📱 フィルターモーダルのモバイル最適化');
  
  const filterModal = document.getElementById('filter-help-modal');
  if (!filterModal) {
    console.log('⚠️ フィルターモーダルが見つかりません');
    return;
  }

  // モバイル用フィルターモーダルスタイル
  const mobileModalStyle = document.createElement('style');
  mobileModalStyle.id = 'mobile-modal-style';
  mobileModalStyle.textContent = `
    @media (max-width: 768px) {
      .modal-xl {
        max-width: 100% !important;
        margin: 0 !important;
        height: 100vh !important;
      }

      .modal-dialog-scrollable {
        height: 100vh !important;
      }

      .modal-content {
        height: 100vh !important;
        border-radius: 0 !important;
      }

      .modal-body {
        padding: 15px !important;
        font-size: 14px !important;
      }

      .modal-body .card {
        margin-bottom: 15px !important;
      }

      .modal-body .card-body {
        padding: 12px !important;
      }

      .modal-body .btn {
        font-size: 13px !important;
        padding: 8px 12px !important;
      }

      .modal-body kbd {
        font-size: 11px !important;
        padding: 2px 6px !important;
      }

      .modal-body .row > .col-md-6,
      .modal-body .row > .col-md-4 {
        margin-bottom: 15px !important;
      }

      /* モバイル専用ナビゲーション */
      .modal-body::before {
        content: "画面を上下にスワイプしてスクロールできます";
        display: block;
        text-align: center;
        background: #e3f2fd;
        color: #1976d2;
        padding: 8px;
        margin: -15px -15px 15px -15px;
        font-size: 12px;
        border-bottom: 1px solid #bbdefb;
      }
    }
  `;
  
  document.head.appendChild(mobileModalStyle);
  console.log('✅ フィルターモーダルモバイル最適化完了');
}

function adaptGuideCardsForMobile() {
  console.log('📱 ガイドカードのモバイル表示調整');
  
  const mobileCardStyle = document.createElement('style');
  mobileCardStyle.id = 'mobile-card-style';
  mobileCardStyle.textContent = `
    @media (max-width: 768px) {
      .guide-card {
        margin-bottom: 20px !important;
      }

      .guide-card .card-img-top {
        height: 200px !important;
        object-fit: cover !important;
      }

      .guide-card .card-body {
        padding: 15px !important;
      }

      .guide-card .card-title {
        font-size: 16px !important;
        line-height: 1.3 !important;
      }

      .guide-card .card-text {
        font-size: 13px !important;
        line-height: 1.4 !important;
      }

      .guide-card .btn {
        font-size: 13px !important;
        padding: 8px 16px !important;
        border-radius: 20px !important;
      }

      /* ブックマーク・比較アイコンのタッチ対応 */
      .guide-card .btn-outline-warning,
      .guide-card .btn-outline-success {
        min-width: 44px !important;
        min-height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      /* モバイル専用ヒント表示 */
      .guide-card:first-child::before {
        content: "💡 カード左上の★で保存、☑で比較選択";
        position: absolute;
        top: -40px;
        left: 0;
        right: 0;
        background: rgba(255, 193, 7, 0.1);
        color: #856404;
        padding: 8px;
        text-align: center;
        font-size: 12px;
        border-radius: 15px;
        animation: mobileHint 5s ease-in-out;
      }

      @keyframes mobileHint {
        0%, 80% { opacity: 1; }
        100% { opacity: 0; }
      }
    }
  `;
  
  document.head.appendChild(mobileCardStyle);
  console.log('✅ ガイドカードモバイル調整完了');
}

function adaptKeyboardNavigationForMobile() {
  console.log('📱 キーボードナビゲーションのモバイル調整');
  
  // モバイルでは仮想キーボードが表示されるため、
  // タッチジェスチャーでのページング操作を追加
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  document.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // 水平スワイプの検出（左右ページング）
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      const toolbar = document.getElementById('floating-toolbar');
      if (!toolbar) return;

      // 右スワイプ（前のページ）
      if (diffX > 0) {
        const prevBtn = toolbar.querySelector('.btn-secondary');
        if (prevBtn && !prevBtn.disabled) {
          prevBtn.click();
          showMobileSwipeHint('前のページへ');
        }
      }
      // 左スワイプ（次のページ）
      else {
        const nextBtn = toolbar.querySelector('.btn-primary');
        if (nextBtn && !nextBtn.disabled) {
          nextBtn.click();
          showMobileSwipeHint('次のページへ');
        }
      }
    }

    touchStartX = 0;
    touchStartY = 0;
  });

  console.log('✅ モバイルタッチジェスチャー対応完了');
}

function showMobileSwipeHint(message) {
  const hint = document.createElement('div');
  hint.textContent = message;
  hint.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 10000;
    pointer-events: none;
    animation: swipeHint 1.5s ease-out forwards;
  `;

  const hintStyle = document.createElement('style');
  hintStyle.textContent = `
    @keyframes swipeHint {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `;

  document.head.appendChild(hintStyle);
  document.body.appendChild(hint);

  setTimeout(() => {
    document.body.removeChild(hint);
    document.head.removeChild(hintStyle);
  }, 1500);
}

// 画面サイズ変更時の再適応
function handleResize() {
  // デバウンス処理
  clearTimeout(window.mobileAdaptTimeout);
  window.mobileAdaptTimeout = setTimeout(() => {
    console.log('📱 画面サイズ変更 - 再適応実行');
    adaptPCSpecsToMobile();
  }, 300);
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 モバイル対応ツールバーアダプター初期化');
  
  // 初期適応
  setTimeout(adaptPCSpecsToMobile, 1000);
  
  // リサイズイベント
  window.addEventListener('resize', handleResize);
  
  // オリエンテーション変更対応
  window.addEventListener('orientationchange', () => {
    setTimeout(adaptPCSpecsToMobile, 500);
  });
});

// 遅延実行で確実に適応
setTimeout(adaptPCSpecsToMobile, 2000);
setTimeout(adaptPCSpecsToMobile, 5000);

console.log('✅ モバイル対応ツールバーアダプター読み込み完了');

// グローバル関数として公開
window.mobileToolbarAdapter = {
  adapt: adaptPCSpecsToMobile,
  isMobile: isMobileDevice,
  isTablet: isTabletDevice
};