/**
 * モバイル環境向け修正スクリプト
 * 固有の問題を修正するための追加機能
 */

document.addEventListener('DOMContentLoaded', function() {
  // モバイル環境かどうか確認
  const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log('モバイル環境を検出しました。モバイル向け修正を適用します。');
    initMobileFixes();
  } else {
    // PC環境ではモーダルダイアログのサイズを戻す
    fixPCModalDialogSize();
  }
});

/**
 * モバイル向け修正の初期化
 */
function initMobileFixes() {
  // ガイド登録モーダルを修正
  fixGuideRegistrationModal();
  
  // カメラボタンが表示されない問題を修正
  fixCameraButtons();
  
  // スクロールできない問題を修正
  fixModalScrolling();
  
  // 下部に固定されたボタンを追加
  addFixedBottomButtons();
  
  // ドロップダウンメニューの修正
  fixDropdownMenus();
  
  // 新規登録モーダルのサイズを調整
  fixSignupModalSize();
}

/**
 * PC環境でのモーダルサイズを修正
 * モバイル用のスタイルが影響しないようにする
 */
function fixPCModalDialogSize() {
  // PCでは何もしない - Bootstrap標準のスタイルを維持
}

/**
 * 新規登録モーダルのサイズと内容を調整
 */
function fixSignupModalSize() {
  // 新規登録ボタンを監視
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
    button.addEventListener('click', function() {
      // ターゲットモーダルを取得
      const targetId = button.getAttribute('data-bs-target');
      if (!targetId) return;
      
      // モーダルが表示されたときの処理
      const targetModal = document.querySelector(targetId);
      if (targetModal) {
        // モーダルが表示された後にサイズを調整
        targetModal.addEventListener('shown.bs.modal', function() {
          adjustRegisterModalSize(targetModal);
        }, { once: true });
      }
    });
  });
  
  // すでに開いているモーダルも処理
  document.querySelectorAll('.modal.show').forEach(modal => {
    adjustRegisterModalSize(modal);
  });
  
  // Bootstrap 5のモーダルイベントを監視
  document.addEventListener('show.bs.modal', function(event) {
    const modal = event.target;
    
    // 新規登録や登録に関連するモーダルかどうか確認
    if (modal.id.includes('register') || 
        modal.id.includes('guide') || 
        modal.querySelector('.modal-title')?.textContent.includes('登録') ||
        modal.querySelector('.modal-title')?.textContent.includes('ガイド')) {
      
      // モーダル表示後に調整
      setTimeout(() => adjustRegisterModalSize(modal), 50);
    }
  });
}

/**
 * 登録モーダルのサイズを調整する
 */
function adjustRegisterModalSize(modal) {
  if (!modal) return;
  
  // モーダルダイアログを取得
  const dialog = modal.querySelector('.modal-dialog');
  if (!dialog) return;
  
  // モーダルの内容
  const content = modal.querySelector('.modal-content');
  const body = modal.querySelector('.modal-body');
  
  if (dialog && content) {
    // スマホサイズの場合のみ調整
    if (window.innerWidth < 768) {
      // ダイアログの幅を調整（サイズを小さくする）
      dialog.style.maxWidth = '92%';
      dialog.style.margin = '0.5rem auto';
      
      // モーダル内のコンテンツの表示サイズを調整
      if (body) {
        // フォーム要素のサイズを縮小
        body.querySelectorAll('input, select, textarea').forEach(el => {
          el.style.fontSize = '14px';
          if (el.tagName.toLowerCase() === 'select') {
            // セレクトボックスの高さも調整
            el.style.padding = '0.375rem 0.5rem';
            el.style.backgroundPosition = 'right 0.5rem center';
          }
        });
        
        // ラベルのサイズを調整
        body.querySelectorAll('label').forEach(label => {
          label.style.fontSize = '14px';
          label.style.marginBottom = '0.25rem';
        });
        
        // フォームグループの余白を縮小
        body.querySelectorAll('.form-group, .mb-3').forEach(group => {
          group.style.marginBottom = '0.5rem';
        });
        
        // 文字サイズを全体的に調整
        body.querySelectorAll('p, div, span, small, .form-text').forEach(el => {
          if (!el.classList.contains('modal-body') && 
              !el.classList.contains('form-group') && 
              !el.classList.contains('mb-3')) {
            el.style.fontSize = '14px';
          }
        });
      }
      
      // モーダルタイトルのサイズ調整
      const title = modal.querySelector('.modal-title');
      if (title) {
        title.style.fontSize = '1rem';
      }
      
      // ボタンのサイズ調整
      modal.querySelectorAll('.btn').forEach(btn => {
        if (!btn.classList.contains('btn-lg')) {
          btn.style.fontSize = '14px';
          btn.style.padding = '0.375rem 0.75rem';
        }
      });
    } else {
      // PC環境では標準のBootstrapサイズに戻す
      dialog.style.maxWidth = '';
      dialog.style.margin = '';
    }
  }
}

/**
 * ガイド登録モーダルの修正
 */
function fixGuideRegistrationModal() {
  // Bootstrap 5のモーダルイベントを監視
  document.addEventListener('show.bs.modal', function(event) {
    const modal = event.target;
    
    // ガイド登録に関連するモーダルかどうかを確認
    if (modal.querySelector('form') && 
        (modal.id.includes('register') || 
         modal.id.includes('guide') || 
         modal.querySelector('h5.modal-title')?.textContent.includes('ガイド'))) {
      
      console.log('ガイド登録関連モーダルを検出しました。修正を適用します。');
      
      // モーダルの内部構造を修正
      const modalBody = modal.querySelector('.modal-body');
      const form = modal.querySelector('form');
      
      if (modalBody && form) {
        // モーダルボディに十分な余白を追加
        modalBody.style.paddingBottom = '100px';
        
        // スクロール可能にする
        modalBody.style.overflow = 'auto';
        modalBody.style.maxHeight = 'calc(100vh - 120px)';
        
        // 「登録する」ボタンがあればコピーして固定フッターに追加
        const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        if (submitButtons.length > 0) {
          const lastSubmitBtn = submitButtons[submitButtons.length - 1];
          
          // 固定フッターを作成
          let fixedFooter = modal.querySelector('.fixed-footer');
          if (!fixedFooter) {
            fixedFooter = document.createElement('div');
            fixedFooter.className = 'fixed-footer';
            fixedFooter.style.position = 'fixed';
            fixedFooter.style.bottom = '0';
            fixedFooter.style.left = '0';
            fixedFooter.style.width = '100%';
            fixedFooter.style.background = '#fff';
            fixedFooter.style.padding = '10px 15px';
            fixedFooter.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
            fixedFooter.style.zIndex = '1050';
            fixedFooter.style.borderTop = '1px solid #dee2e6';
            
            fixedFooter.innerHTML = `
              <div class="d-grid">
                <button type="button" class="btn btn-primary btn-lg fixed-submit-btn">登録する</button>
              </div>
            `;
            
            // ボタンにクリックイベントを設定
            fixedFooter.querySelector('.fixed-submit-btn').addEventListener('click', function() {
              lastSubmitBtn.click(); // 元のボタンをクリック
            });
            
            // bodyの最後に追加
            document.body.appendChild(fixedFooter);
            
            // モーダルが閉じられたときに削除
            modal.addEventListener('hidden.bs.modal', function() {
              if (fixedFooter.parentNode) {
                fixedFooter.parentNode.removeChild(fixedFooter);
              }
            });
          }
        }
      }
    }
  });
}

/**
 * カメラボタンの修正
 */
function fixCameraButtons() {
  // すべてのカメラボタンを確実に表示
  function makeAllCameraButtonsVisible() {
    document.querySelectorAll('.document-camera, [id$="-camera-btn"], button:has(.bi-camera), button:has(.fa-camera)').forEach(button => {
      if (button.classList.contains('mobile-only') || button.classList.contains('d-none') || button.style.display === 'none') {
        button.classList.remove('d-none');
        button.style.display = 'block';
      }
    });
    
    // ファイル入力にカメラボタンが関連づけられていないものを確認
    document.querySelectorAll('input[type="file"]').forEach(input => {
      const container = input.closest('.mb-3, .form-group');
      if (container) {
        const hasCamera = container.querySelector('.document-camera, .camera-btn, button:has(.bi-camera)');
        if (!hasCamera) {
          // カメラボタンを追加
          const cameraBtn = document.createElement('button');
          cameraBtn.className = 'btn btn-outline-secondary document-camera w-100 mt-2';
          cameraBtn.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
          cameraBtn.setAttribute('data-target', input.id);
          
          // ボタン処理を追加
          cameraBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // モバイルでのカメラ起動
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
                input.files = dataTransfer.files;
                
                // 変更イベントを発火
                input.dispatchEvent(new Event('change', { bubbles: true }));
                
                // 使用後に削除
                document.body.removeChild(hiddenInput);
              }
            });
            
            // ファイル選択ダイアログを開く
            hiddenInput.click();
          });
          
          // 入力の直後に挿入
          input.parentNode.insertBefore(cameraBtn, input.nextSibling);
        }
      }
    });
  }
  
  // 初回実行
  makeAllCameraButtonsVisible();
  
  // DOM変更を監視して新しく追加されたカメラボタンも処理
  const observer = new MutationObserver(function(mutations) {
    let shouldRecheck = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === 1) { // 要素ノードの場合
            if (node.classList && 
                (node.classList.contains('document-camera') || 
                 node.querySelector('.document-camera, [id$="-camera-btn"]'))) {
              shouldRecheck = true;
              break;
            }
          }
        }
      }
    });
    
    if (shouldRecheck) {
      makeAllCameraButtonsVisible();
    }
  });
  
  // 監視を開始
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * モーダルスクロールの修正
 */
function fixModalScrolling() {
  // Bootstrap 5のモーダルイベントを監視
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    
    // モーダルのコンテンツが長い場合、スクロール可能にする
    const modalContent = modal.querySelector('.modal-content');
    const modalBody = modal.querySelector('.modal-body');
    
    if (modalContent && modalBody) {
      modalContent.style.maxHeight = 'calc(100vh - 60px)';
      modalContent.style.overflowY = 'auto';
      modalBody.style.overflowY = 'visible';
      
      // iOSでのスクロール問題を修正
      modalContent.style.webkitOverflowScrolling = 'touch';
      
      // 余分なスタイル継承を防止
      modal.style.overflow = 'hidden';
    }
  });
}

/**
 * 画面最下部に固定されたボタンを追加
 */
function addFixedBottomButtons() {
  // 長いフォームを検索
  document.querySelectorAll('form').forEach(form => {
    // フォームが画面高さの1.5倍以上の場合
    if (form.offsetHeight > window.innerHeight * 1.5) {
      const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
      
      if (submitButtons.length > 0) {
        // 最後の送信ボタンを取得
        const lastSubmitBtn = submitButtons[submitButtons.length - 1];
        
        // 固定フッターが既に存在しなければ作成
        if (!document.querySelector('.form-fixed-footer')) {
          const fixedFooter = document.createElement('div');
          fixedFooter.className = 'form-fixed-footer';
          fixedFooter.style.position = 'fixed';
          fixedFooter.style.bottom = '0';
          fixedFooter.style.left = '0';
          fixedFooter.style.width = '100%';
          fixedFooter.style.background = '#fff';
          fixedFooter.style.padding = '10px 15px';
          fixedFooter.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
          fixedFooter.style.zIndex = '1040';
          fixedFooter.style.borderTop = '1px solid #dee2e6';
          
          fixedFooter.innerHTML = `
            <div class="d-grid">
              <button type="button" class="btn btn-primary btn-lg fixed-submit-btn">送信する</button>
            </div>
          `;
          
          // ボタンにクリックイベントを設定
          fixedFooter.querySelector('.fixed-submit-btn').addEventListener('click', function() {
            lastSubmitBtn.click(); // 元のボタンをクリック
          });
          
          // bodyの最後に追加
          document.body.appendChild(fixedFooter);
        }
      }
    }
  });
}

/**
 * ドロップダウンメニューの修正
 */
function fixDropdownMenus() {
  // ドロップダウンメニューの表示位置調整
  document.addEventListener('show.bs.dropdown', function(event) {
    const dropdownMenu = event.target.querySelector('.dropdown-menu');
    
    if (dropdownMenu) {
      // メニューが右側に表示されるようにする
      dropdownMenu.classList.add('dropdown-menu-end');
      
      // 高さが大きすぎる場合はスクロール可能にする
      setTimeout(() => {
        const menuHeight = dropdownMenu.offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (menuHeight > windowHeight * 0.8) {
          dropdownMenu.style.maxHeight = `${windowHeight * 0.8}px`;
          dropdownMenu.style.overflowY = 'auto';
          dropdownMenu.style.webkitOverflowScrolling = 'touch';
        }
      }, 0);
    }
  });
}