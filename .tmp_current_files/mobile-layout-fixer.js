/**
 * モバイル表示最適化のためのJavaScriptコード
 * ブラウザ幅に応じて動的にレイアウトを調整します
 */

document.addEventListener('DOMContentLoaded', function() {
  // 初期化処理
  initMobileOptimizations();
});

/**
 * モバイル最適化の初期化
 */
function initMobileOptimizations() {
  // 画面サイズ変更時の処理
  window.addEventListener('resize', adjustLayoutForScreenSize);
  
  // 初回実行
  adjustLayoutForScreenSize();
  
  // 時間設定フォームを最適化
  optimizeTimeSelectors();
  
  // 画面方向変更時のイベント処理
  setupOrientationChangeHandler();
  
  // 曜日タブスクロールの動作を最適化
  enhanceTabScrolling();
  
  // モバイルでのカメラボタン処理を最適化
  optimizeCameraButtons();
  
  // モーダルが開かれたときの処理を追加
  setupModalHandlers();
  
  // モバイルフォーム送信ボタンの最適化
  setupMobileFormButtons();
  
  // スクロール位置調整のイベント監視
  monitorScrollPosition();
}

/**
 * 画面サイズに応じてレイアウトを調整
 */
function adjustLayoutForScreenSize() {
  const isMobile = window.innerWidth < 768;
  
  // サイドバーのメニューをモバイル時は水平スクロール可能にする
  const sidebarMenu = document.querySelector('.profile-sidebar .nav-pills');
  if (sidebarMenu) {
    if (isMobile) {
      sidebarMenu.classList.add('flex-row');
      sidebarMenu.classList.remove('flex-column');
    } else {
      sidebarMenu.classList.add('flex-column');
      sidebarMenu.classList.remove('flex-row');
    }
  }
  
  // モバイル時のサイドバープロフィール写真サイズを調整
  const profilePhoto = document.querySelector('.profile-photo-container');
  if (profilePhoto && isMobile) {
    profilePhoto.style.width = '100px';
    profilePhoto.style.height = '100px';
  } else if (profilePhoto) {
    profilePhoto.style.width = '150px';
    profilePhoto.style.height = '150px';
  }
  
  // モバイル時にフォームのフッターを固定
  if (isMobile) {
    addFixedFormFooters();
  } else {
    removeFixedFormFooters();
  }
}

/**
 * 時間設定セレクターの最適化
 */
function optimizeTimeSelectors() {
  // すべての時間選択セレクターを取得
  const timeSelectors = document.querySelectorAll('.schedule-start, .schedule-end');
  
  // モバイル表示時のフォントサイズとpadding調整
  timeSelectors.forEach(selector => {
    if (window.innerWidth < 768) {
      selector.classList.add('mobile-select');
    }
    
    // 画面サイズ変更時の対応
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        selector.classList.add('mobile-select');
      } else {
        selector.classList.remove('mobile-select');
      }
    });
  });
}

/**
 * 画面回転時の処理を設定
 */
function setupOrientationChangeHandler() {
  // 画面の向きが変わったときの処理
  window.addEventListener('orientationchange', function() {
    // レイアウトを再調整
    setTimeout(function() {
      adjustLayoutForScreenSize();
      
      // カレンダー表示の更新（カレンダーライブラリがある場合）
      const calendar = document.getElementById('reservation-calendar');
      if (calendar && window.flatpickr && calendar._flatpickr) {
        calendar._flatpickr.redraw();
      }
      
      // モバイル時のモーダル高さ調整
      if (window.innerWidth < 768) {
        adjustModalHeights();
      }
    }, 200); // 少し遅延させて画面の更新を待つ
  });
}

/**
 * モーダルが開かれたときのハンドラーを設定
 */
function setupModalHandlers() {
  // Bootstrap 5のモーダルイベントを監視
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    
    // ガイド登録モーダルの場合は特別処理
    if (modal.id === 'guideRegisterModal') {
      optimizeGuideRegistrationModal(modal);
    }
    
    // すべてのモーダルで最下部ボタンが見えるようにスクロール位置を調整
    setTimeout(() => adjustModalHeights(), 100);
  });
  
  // モーダルサイズ変更時の処理
  window.addEventListener('resize', function() {
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modal => {
      if (window.innerWidth < 768) {
        adjustModalHeights();
      }
    });
  });
}

/**
 * モバイル端末でのガイド登録モーダルを最適化
 */
function optimizeGuideRegistrationModal(modal) {
  if (window.innerWidth >= 768) return; // モバイルのみ対応
  
  // フォームを持つモーダルボディを取得
  const modalBody = modal.querySelector('.modal-body');
  if (!modalBody) return;
  
  // ガイド登録フォームを取得
  const form = modalBody.querySelector('form');
  if (!form) return;
  
  // 既存のモーダルフッターがあれば削除して新しくする
  const existingFooter = modal.querySelector('.modal-footer');
  if (existingFooter) {
    existingFooter.remove();
  }
  
  // 送信ボタンを含む固定フッターを作成
  const footer = document.createElement('div');
  footer.className = 'modal-footer fixed-bottom';
  footer.innerHTML = `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 d-grid">
          <button type="submit" class="btn btn-primary btn-lg">登録する</button>
        </div>
      </div>
    </div>
  `;
  
  // モーダルに追加
  modal.appendChild(footer);
  
  // ボタンにフォーム送信イベントを追加
  const submitBtn = footer.querySelector('button[type="submit"]');
  if (submitBtn && form) {
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  }
  
  // モーダルボディに余白を追加して固定フッターに隠れないようにする
  modalBody.style.paddingBottom = '80px';
  
  // カメラボタンを最適化
  optimizeCameraInModal(modal);
}

/**
 * モバイル端末でのカメラボタンを最適化
 */
function optimizeCameraButtons() {
  // モバイルのみ対応
  if (window.innerWidth >= 768) return;
  
  // カメラボタンを検出して最適化
  document.querySelectorAll('.document-camera.mobile-only').forEach(button => {
    ensureCameraButtonVisible(button);
  });
  
  // 新しく追加されるカメラボタンを監視
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.classList && node.classList.contains('document-camera')) {
            ensureCameraButtonVisible(node);
          }
        });
      }
    });
  });
  
  // bodyの変更を監視
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * カメラボタンが確実に表示されるようにする
 */
function ensureCameraButtonVisible(button) {
  if (!button || window.innerWidth >= 768) return;
  
  // display:noneを解除
  button.style.display = 'block';
  
  // ボタンのイベントを確認
  if (!button.onclick && !button.getAttribute('data-bs-toggle')) {
    // 対応するファイル入力を探す
    const targetId = button.getAttribute('data-target');
    if (targetId) {
      const fileInput = document.getElementById(targetId);
      if (fileInput) {
        // クリックでネイティブカメラを起動するよう設定
        button.addEventListener('click', function(e) {
          e.preventDefault();
          // モバイルでのカメラ起動 - capture属性付きの隠し入力を作成
          const hiddenInput = document.createElement('input');
          hiddenInput.type = 'file';
          hiddenInput.accept = 'image/*';
          hiddenInput.capture = 'environment';
          hiddenInput.style.display = 'none';
          document.body.appendChild(hiddenInput);
          
          // ファイル選択時の処理
          hiddenInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
              // ファイルを元の入力に転送
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(this.files[0]);
              fileInput.files = dataTransfer.files;
              
              // 変更イベントを発火
              fileInput.dispatchEvent(new Event('change', { bubbles: true }));
              
              // 使用後に削除
              document.body.removeChild(hiddenInput);
            }
          });
          
          // ファイル選択ダイアログを開く
          hiddenInput.click();
        });
      }
    }
  }
}

/**
 * モーダル内のカメラボタンを最適化
 */
function optimizeCameraInModal(modal) {
  if (!modal || window.innerWidth >= 768) return;
  
  // モーダル内のすべてのカメラボタンを取得
  const cameraButtons = modal.querySelectorAll('.document-camera.mobile-only, button:has(.bi-camera)');
  
  cameraButtons.forEach(button => {
    ensureCameraButtonVisible(button);
  });
  
  // ファイル入力にもスマホカメラを使えるようにする
  const fileInputs = modal.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    if (!input.hasAttribute('capture')) {
      // マークアップでのカメラボタンが無い場合、右側にカメラアイコンボタンを追加
      const container = input.closest('.mb-3, .form-group');
      if (container) {
        const existingBtn = container.querySelector('.document-camera, .camera-btn');
        if (!existingBtn) {
          const wrapper = document.createElement('div');
          wrapper.className = 'input-group mt-2';
          
          // 入力の直後に挿入
          input.parentNode.insertBefore(wrapper, input.nextSibling);
          wrapper.appendChild(input.cloneNode(true));
          input.remove();
          
          const cameraBtn = document.createElement('button');
          cameraBtn.className = 'btn btn-outline-secondary document-camera mobile-only';
          cameraBtn.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
          cameraBtn.setAttribute('data-target', input.id);
          wrapper.appendChild(cameraBtn);
          
          ensureCameraButtonVisible(cameraBtn);
        }
      }
    }
  });
}

/**
 * モーダルの高さを調整して最下部のボタンが見えるようにする
 */
function adjustModalHeights() {
  if (window.innerWidth >= 768) return; // モバイルのみ対応
  
  // 開いているモーダルを取得
  const openModals = document.querySelectorAll('.modal.show');
  
  openModals.forEach(modal => {
    const modalContent = modal.querySelector('.modal-content');
    const modalBody = modal.querySelector('.modal-body');
    const footer = modal.querySelector('.modal-footer');
    
    if (modalContent && modalBody) {
      // コンテンツの高さを確認してスクロール可能にする
      const windowHeight = window.innerHeight;
      const maxHeight = windowHeight - 60; // ヘッダーとマージンの分を考慮
      
      modalContent.style.maxHeight = `${maxHeight}px`;
      
      // フッターがある場合は、bodyのパディングを追加
      if (footer && footer.classList.contains('fixed-bottom')) {
        const footerHeight = footer.offsetHeight;
        modalBody.style.paddingBottom = `${footerHeight + 20}px`;
      }
    }
  });
}

/**
 * タブスクロールの動作を改善
 */
function enhanceTabScrolling() {
  const scheduleTab = document.getElementById('scheduleTab');
  if (!scheduleTab) return;
  
  // タブが選択されたときにスクロール位置を調整
  const tabButtons = scheduleTab.querySelectorAll('.nav-link');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // アクティブなタブが見えるようにスクロール位置を調整
      if (window.innerWidth < 768) {
        const buttonLeft = button.offsetLeft;
        const tabContainerWidth = scheduleTab.offsetWidth;
        const scrollPosition = buttonLeft - (tabContainerWidth / 2) + (button.offsetWidth / 2);
        
        scheduleTab.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * モバイルでのフォーム送信ボタンを最適化
 */
function setupMobileFormButtons() {
  if (window.innerWidth >= 768) return; // モバイルのみ対応
  
  // 長いフォームを取得
  const longForms = Array.from(document.querySelectorAll('form')).filter(form => {
    // フォームの長さが画面高さの1.5倍以上の場合
    return form.offsetHeight > window.innerHeight * 1.5;
  });
  
  longForms.forEach(form => {
    // フォーム送信ボタンを探す
    const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
    
    if (submitButtons.length > 0) {
      // 最後の送信ボタンを取得
      const lastSubmitBtn = submitButtons[submitButtons.length - 1];
      
      // 既存のボタンを非表示にしない（順番のため残す）
      
      // 固定フッターを作成
      const fixedFooter = document.createElement('div');
      fixedFooter.className = 'form-submit-buttons';
      fixedFooter.innerHTML = `
        <div class="d-grid">
          <button type="submit" class="btn btn-primary btn-lg">送信する</button>
        </div>
      `;
      
      // フォームの最後に追加
      form.appendChild(fixedFooter);
      
      // 新しいボタンにクリックイベントを設定
      const newSubmitBtn = fixedFooter.querySelector('button[type="submit"]');
      if (newSubmitBtn) {
        newSubmitBtn.addEventListener('click', function(e) {
          e.preventDefault();
          lastSubmitBtn.click(); // 元のボタンをクリック
        });
      }
    }
  });
}

/**
 * モバイル表示でフォームにフッターを固定
 */
function addFixedFormFooters() {
  // モーダル内のすべてのフォームフッターを確認
  document.querySelectorAll('.modal-footer').forEach(footer => {
    if (!footer.classList.contains('fixed-bottom')) {
      footer.classList.add('fixed-bottom');
      const modal = footer.closest('.modal');
      if (modal) {
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
          // フッター分の余白を追加
          modalBody.style.paddingBottom = `${footer.offsetHeight + 20}px`;
        }
      }
    }
  });
}

/**
 * デスクトップ表示でフォームフッターの固定を解除
 */
function removeFixedFormFooters() {
  document.querySelectorAll('.modal-footer.fixed-bottom').forEach(footer => {
    footer.classList.remove('fixed-bottom');
    const modal = footer.closest('.modal');
    if (modal) {
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) {
        modalBody.style.paddingBottom = '';
      }
    }
  });
}

/**
 * スクロール位置を監視して問題があれば調整
 */
function monitorScrollPosition() {
  let lastScrollTop = 0;
  let scrollStuck = false;
  let stuckCounter = 0;
  
  // スクロールが停止していないか確認
  window.addEventListener('scroll', function() {
    const currentScroll = window.scrollY;
    
    // 同じ位置での停滞をカウント
    if (Math.abs(currentScroll - lastScrollTop) < 1) {
      stuckCounter++;
      if (stuckCounter > 10) {
        scrollStuck = true;
      }
    } else {
      stuckCounter = 0;
      scrollStuck = false;
    }
    
    // スクロールが停滞していると判断される場合、モーダルの調整を試みる
    if (scrollStuck) {
      const openModals = document.querySelectorAll('.modal.show');
      if (openModals.length > 0) {
        adjustModalHeights();
        scrollStuck = false;
        stuckCounter = 0;
      }
    }
    
    lastScrollTop = currentScroll;
  });
}