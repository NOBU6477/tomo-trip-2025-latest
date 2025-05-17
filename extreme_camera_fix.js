/**
 * 最終的な対策：モーダル表示後に直接ボタンを置換
 */
(function() {
  'use strict';
  
  // DOMロード時に実行
  document.addEventListener('DOMContentLoaded', function() {
    // モーダル表示イベントをキャプチャ
    document.addEventListener('shown.bs.modal', function(event) {
      // モーダルが表示されたら少し遅延して実行
      setTimeout(function() {
        processModal(event.target);
      }, 50);
    });
    
    // クリックイベントもキャプチャ（代替手段）
    document.addEventListener('click', function(event) {
      if (event.target && (
          event.target.classList.contains('guide-register-btn') || 
          event.target.classList.contains('tourist-register-btn') ||
          event.target.closest('.guide-register-btn') ||
          event.target.closest('.tourist-register-btn')
      )) {
        // 少し遅延してすべてのモーダルをチェック
        setTimeout(function() {
          document.querySelectorAll('.modal.show').forEach(function(modal) {
            processModal(modal);
          });
        }, 300);
      }
    });
  });
  
  // 特定のモーダルを処理する
  function processModal(modal) {
    if (!modal) return;
    
    try {
      // セカンダリボタン（通常はカメラボタン）を見つける
      const secondaryButtons = modal.querySelectorAll('.btn-secondary');
      
      secondaryButtons.forEach(function(button) {
        // ボタン内のテキストで判定
        const text = button.textContent || '';
        
        if (text.includes('PHOTO CAMERA') || text.includes('Camera')) {
          // テキストを完全に置き換え
          button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
          
          // 元の英語テキストが残らないよう透明化
          button.style.color = 'white';
          
          // データ属性でマーク
          button.setAttribute('data-fixed', 'true');
          
          console.log('カメラボタンを修正しました');
        }
      });
      
      // 追加対策: セカンダリクラスがなくてもカメラ関連のボタンを検索
      const allButtons = modal.querySelectorAll('button');
      
      allButtons.forEach(function(button) {
        const text = button.textContent || '';
        const html = button.innerHTML || '';
        
        // PHOTO CAMERAが含まれている場合
        if (text.includes('PHOTO CAMERA') || 
            text.includes('Camera') ||
            html.includes('PHOTO CAMERA') ||
            html.includes('camera-icon')) {
          
          // すでに修正済みなら何もしない
          if (button.getAttribute('data-fixed') === 'true') return;
          
          // テキストを完全に置き換え
          button.innerHTML = '<i class="bi bi-camera"></i> カメラで撮影';
          button.style.color = 'white';
          button.setAttribute('data-fixed', 'true');
          
          console.log('追加のカメラボタンを修正しました');
        }
      });
    } catch (error) {
      console.error('モーダル処理中にエラーが発生しました:', error);
    }
  }
})();