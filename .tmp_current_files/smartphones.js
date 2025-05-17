/**
 * スマートフォン環境専用スクリプト
 * PC環境では一切実行されません
 */

(function() {
  "use strict";
  
  // スマートフォン環境かどうかを判定 - タッチデバイスとビューポートサイズで判定
  const isSmartphone = 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) && 
    window.innerWidth < 768;
  
  // スマホ環境でない場合は何も実行しない
  if (!isSmartphone) {
    console.log('PC環境を検出しました。スマホ向け修正は実行しません。');
    return;
  }
  
  // スマホ環境の場合のみ実行
  console.log('スマートフォン環境を検出しました。スマホ最適化を適用します。');
  
  // DOMが読み込まれたらスマホ専用処理を開始
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartphoneOptimizations);
  } else {
    initSmartphoneOptimizations();
  }
  
  /**
   * スマホ向け最適化処理の初期化
   */
  function initSmartphoneOptimizations() {
    // スマホ専用のスタイルシートを読み込み
    const smartphoneStylesheet = document.createElement('link');
    smartphoneStylesheet.rel = 'stylesheet';
    smartphoneStylesheet.href = 'smartphones.css';
    document.head.appendChild(smartphoneStylesheet);
    
    // ハンバーガーメニューから出る登録モーダルの設定
    setupSignupModals();
    
    // ドロップダウンメニューのサイズと位置を最適化
    optimizeDropdownMenus();
    
    // ガイド登録モーダルの送信ボタン表示を最適化
    setupGuideRegistrationForms();
    
    // スマホ用カメラボタンの最適化
    setupCameraButtons();
  }
  
  /**
   * 新規登録モーダルのセットアップ
   */
  function setupSignupModals() {
    // Bootstrap 5のモーダル表示イベントをリッスン
    document.addEventListener('show.bs.modal', function(event) {
      const modal = event.target;
      
      // 「登録」を含むタイトルやIDを持つモーダルかを判断
      if ((modal.id && modal.id.includes('register')) || 
          (modal.querySelector('.modal-title') && 
           modal.querySelector('.modal-title').textContent.includes('登録'))) {
        
        // モーダルダイアログのサイズを調整
        const dialog = modal.querySelector('.modal-dialog');
        if (dialog) {
          dialog.style.maxWidth = '94%';
          dialog.style.width = '94%';
          dialog.style.margin = '0.5rem auto';
        }
        
        // 内部要素のサイズを最適化
        optimizeModalContents(modal);
      }
    });
    
    // すでに表示されているモーダルの処理
    document.querySelectorAll('.modal.show').forEach(function(modal) {
      const dialog = modal.querySelector('.modal-dialog');
      if (dialog) {
        dialog.style.maxWidth = '94%';
        dialog.style.width = '94%';
        dialog.style.margin = '0.5rem auto';
      }
      
      optimizeModalContents(modal);
    });
  }
  
  /**
   * モーダル内部要素の最適化
   */
  function optimizeModalContents(modal) {
    // モーダル内のフォーム要素のサイズを調整
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      // フォーム要素のサイズを縮小
      modalBody.querySelectorAll('input, select, textarea').forEach(function(el) {
        el.style.fontSize = '14px';
      });
      
      // ラベルのサイズを縮小
      modalBody.querySelectorAll('label').forEach(function(label) {
        label.style.fontSize = '14px';
        label.style.marginBottom = '0.25rem';
      });
      
      // フォームグループの余白を縮小
      modalBody.querySelectorAll('.form-group, .mb-3').forEach(function(group) {
        group.style.marginBottom = '0.5rem';
      });
    }
    
    // モーダルフッターのボタンを調整
    const footer = modal.querySelector('.modal-footer');
    if (footer) {
      footer.querySelectorAll('.btn').forEach(function(btn) {
        btn.style.fontSize = '14px';
      });
    }
  }
  
  /**
   * ドロップダウンメニューの最適化
   */
  function optimizeDropdownMenus() {
    // ドロップダウンが表示されたとき
    document.addEventListener('shown.bs.dropdown', function(event) {
      const dropdown = event.target;
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (menu) {
        // ドロップダウンメニューのサイズと位置を調整
        menu.style.maxWidth = '94%';
        menu.style.width = '94%';
        menu.style.left = '3%';
        menu.style.right = '3%';
        
        // 高さが大きすぎる場合はスクロール可能に
        const windowHeight = window.innerHeight;
        if (menu.offsetHeight > windowHeight * 0.7) {
          menu.style.maxHeight = (windowHeight * 0.7) + 'px';
          menu.style.overflowY = 'auto';
          menu.style.webkitOverflowScrolling = 'touch';
        }
      }
    });
  }
  
  /**
   * ガイド登録モーダルのフォーム送信ボタンの最適化
   */
  function setupGuideRegistrationForms() {
    // 「ガイド」を含むモーダルを検出
    document.addEventListener('shown.bs.modal', function(event) {
      const modal = event.target;
      
      if ((modal.id && modal.id.includes('guide')) || 
          (modal.querySelector('.modal-title') && 
           modal.querySelector('.modal-title').textContent.includes('ガイド'))) {
        
        // フォームがあるか確認
        const form = modal.querySelector('form');
        const modalBody = modal.querySelector('.modal-body');
        
        if (form && modalBody) {
          // フォームボディにパディングを追加して送信ボタンが見えるようにする
          modalBody.style.paddingBottom = '80px';
          
          // モーダルが長い場合はスクロール可能に
          modalBody.style.maxHeight = 'calc(100vh - 120px)';
          modalBody.style.overflowY = 'auto';
          
          // 送信ボタンを探す
          const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
          
          if (submitButton) {
            // すでに固定フッターがあるか確認
            let fixedFooter = document.getElementById('smartphone-fixed-footer');
            
            if (!fixedFooter) {
              // 固定フッターを作成
              fixedFooter = document.createElement('div');
              fixedFooter.id = 'smartphone-fixed-footer';
              fixedFooter.style.position = 'fixed';
              fixedFooter.style.bottom = '0';
              fixedFooter.style.left = '0';
              fixedFooter.style.width = '100%';
              fixedFooter.style.backgroundColor = '#fff';
              fixedFooter.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
              fixedFooter.style.zIndex = '1050';
              fixedFooter.style.padding = '10px';
              fixedFooter.style.borderTop = '1px solid #dee2e6';
              
              // 送信ボタンを追加
              const footerButton = document.createElement('button');
              footerButton.className = 'btn btn-primary btn-lg w-100';
              footerButton.textContent = '送信する';
              footerButton.addEventListener('click', function() {
                submitButton.click();
              });
              
              fixedFooter.appendChild(footerButton);
              document.body.appendChild(fixedFooter);
              
              // モーダルが閉じられたときにフッターを削除
              modal.addEventListener('hidden.bs.modal', function() {
                if (fixedFooter && fixedFooter.parentNode) {
                  fixedFooter.parentNode.removeChild(fixedFooter);
                }
              }, { once: true });
            }
          }
        }
      }
    });
  }
  
  /**
   * スマホ用カメラボタンの最適化
   */
  function setupCameraButtons() {
    // すべてのファイル入力フィールドを検索
    document.querySelectorAll('input[type="file"]').forEach(function(input) {
      // カメラボタンが既にあるか確認
      const container = input.closest('.mb-3, .form-group');
      
      if (container) {
        // :has()セレクタを使わずに同等の機能を実装
        let existingButton = container.querySelector('[class*="camera"]');
        
        if (!existingButton) {
          // ボタン要素を見つけてから、その中にカメラアイコンがあるか確認
          const buttons = container.querySelectorAll('button');
          for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].querySelector('.bi-camera, .fa-camera')) {
              existingButton = buttons[i];
              break;
            }
          }
        }
        
        if (!existingButton) {
          // カメラボタンを作成
          const cameraButton = document.createElement('button');
          cameraButton.className = 'btn btn-outline-secondary smartphone-camera-btn w-100 mt-2';
          cameraButton.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
          
          // カメラボタンにクリックイベントを追加
          cameraButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 隠しファイル入力を作成してカメラを起動
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'file';
            hiddenInput.accept = 'image/*';
            hiddenInput.capture = 'environment';
            hiddenInput.style.display = 'none';
            document.body.appendChild(hiddenInput);
            
            // ファイル選択後の処理
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
          
          // ファイル入力の後にカメラボタンを追加
          container.appendChild(cameraButton);
        }
      }
    });
    
    // 新しく追加されるDOM要素を監視してカメラボタンを追加
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // 要素ノード
              const fileInputs = node.querySelectorAll('input[type="file"]');
              if (fileInputs.length > 0) {
                setupCameraButtons(); // 再帰的に呼び出し
              }
            }
          });
        }
      });
    });
    
    // body全体を監視
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();