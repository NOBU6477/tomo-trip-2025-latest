/**
 * ヘッダーボタン修正システム
 * モーダルとドロップダウンを確実に動作させる
 */

(function() {
  'use strict';
  
  console.log('ヘッダーボタン修正開始');

  function fixHeaderButtons() {
    // 1. Bootstrap JavaScriptが読み込まれているか確認
    if (typeof bootstrap === 'undefined') {
      console.warn('Bootstrap JavaScript未読み込み、代替実装を開始');
      
      // 簡易モーダル実装
      function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'block';
          modal.classList.add('show');
          document.body.classList.add('modal-open');
          
          // 背景クリックで閉じる
          modal.addEventListener('click', function(e) {
            if (e.target === modal) {
              closeModal(modalId);
            }
          });
        }
      }
      
      function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'none';
          modal.classList.remove('show');
          document.body.classList.remove('modal-open');
        }
      }
      
      // 簡易ドロップダウン実装
      function setupDropdowns() {
        const dropdownButtons = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdownButtons.forEach(button => {
          button.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            if (dropdown && dropdown.classList.contains('dropdown-menu')) {
              const isOpen = dropdown.classList.contains('show');
              
              // 他のドロップダウンを閉じる
              document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
              });
              
              if (!isOpen) {
                dropdown.classList.add('show');
              }
            }
          });
        });
        
        // ドロップダウン外をクリックしたら閉じる
        document.addEventListener('click', function(e) {
          if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
              menu.classList.remove('show');
            });
          }
        });
      }
      
      // モーダルトリガーボタンの設定
      const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
      modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
          e.preventDefault();
          const targetModal = this.getAttribute('data-bs-target');
          if (targetModal) {
            openModal(targetModal.substring(1)); // #を除去
          }
        });
      });
      
      // モーダル閉じるボタンの設定
      const modalCloseButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
      modalCloseButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          const modal = this.closest('.modal');
          if (modal) {
            closeModal(modal.id);
          }
        });
      });
      
      setupDropdowns();
    }

    // 2. ログインボタンの修正
    const loginButtons = document.querySelectorAll('[data-bs-target="#loginModal"]');
    loginButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('ログインボタンクリック');
        
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          const modal = new bootstrap.Modal(document.getElementById('loginModal'));
          modal.show();
        } else {
          // 代替実装
          const modal = document.getElementById('loginModal');
          if (modal) {
            modal.style.display = 'block';
            modal.classList.add('show');
            document.body.classList.add('modal-open');
          }
        }
      });
    });

    // 3. 新規登録ボタンの修正
    const registerButtons = document.querySelectorAll('[onclick="showRegisterOptions()"]');
    registerButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('新規登録ボタンクリック');
        
        if (typeof showRegisterOptions === 'function') {
          showRegisterOptions();
        } else {
          // 代替実装
          if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modal = new bootstrap.Modal(document.getElementById('registerOptionsModal'));
            modal.show();
          } else {
            const modal = document.getElementById('registerOptionsModal');
            if (modal) {
              modal.style.display = 'block';
              modal.classList.add('show');
              document.body.classList.add('modal-open');
            }
          }
        }
      });
    });

    // 4. 言語切り替えドロップダウンの修正
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
      languageDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('言語ドロップダウンクリック');
        
        const dropdown = this.nextElementSibling;
        if (dropdown) {
          const isOpen = dropdown.classList.contains('show');
          
          // 他のドロップダウンを閉じる
          document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
          });
          
          if (!isOpen) {
            dropdown.classList.add('show');
          }
        }
      });
    }

    // 5. CSS強制適用（モーダル表示用）
    const style = document.createElement('style');
    style.textContent = `
      /* モーダル表示強制 */
      .modal.show {
        display: block !important;
        opacity: 1;
      }
      
      .modal-backdrop {
        background-color: rgba(0, 0, 0, 0.5);
      }
      
      /* ドロップダウン表示強制 */
      .dropdown-menu.show {
        display: block !important;
        opacity: 1;
        visibility: visible;
      }
      
      /* ボタンのポインター設定 */
      button, .btn, a[role="button"] {
        cursor: pointer !important;
      }
      
      /* ボタンのホバー効果 */
      .btn:hover, button:hover {
        opacity: 0.8;
        transform: translateY(-1px);
        transition: all 0.2s ease;
      }
    `;
    document.head.appendChild(style);

    console.log('ヘッダーボタン修正完了');
  }

  // 即座に実行
  fixHeaderButtons();

  // DOM読み込み完了後にも実行
  document.addEventListener('DOMContentLoaded', fixHeaderButtons);
  window.addEventListener('load', fixHeaderButtons);

  console.log('ヘッダーボタン修正システム完了');
})();