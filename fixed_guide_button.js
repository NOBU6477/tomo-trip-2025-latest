/**
 * ガイド登録ボタン関連の問題を最終的に解決するスクリプト
 * ID重複問題への直接的なアプローチ
 */
(function() {
  // ページ読み込み完了時に実行
  document.addEventListener('DOMContentLoaded', function() {
    console.log('ガイドボタン最終修正を適用');
    
    // ヒーローセクションのガイドになるボタン
    const heroGuideBtn = document.getElementById('become-guide-btn');
    if (heroGuideBtn) {
      console.log('ヒーローセクションのガイドボタンを発見');
      heroGuideBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('ヒーローセクションのガイドボタンがクリックされました');
        
        handleGuideButtonClick();
        return false;
      });
    }
    
    // 下部セクションのガイドになるボタン
    const sectionGuideBtn = document.getElementById('become-guide-btn-section');
    if (sectionGuideBtn) {
      console.log('下部セクションのガイドボタンを発見');
      sectionGuideBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('下部セクションのガイドボタンがクリックされました');
        
        handleGuideButtonClick();
        return false;
      });
    }
    
    // ユーザータイプモーダル内のガイド選択ボタン
    const typeModalGuideBtn = document.getElementById('select-guide-btn');
    if (typeModalGuideBtn) {
      console.log('ユーザータイプモーダル内のガイドボタンを発見');
      // 既存のイベントを削除するためクローン
      const newTypeModalGuideBtn = typeModalGuideBtn.cloneNode(true);
      if (typeModalGuideBtn.parentNode) {
        typeModalGuideBtn.parentNode.replaceChild(newTypeModalGuideBtn, typeModalGuideBtn);
      }
      
      // 新しいイベントを設定
      newTypeModalGuideBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('ユーザータイプモーダル内のガイドボタンがクリックされました');
        
        // まずユーザータイプモーダルを閉じる
        closeModal('userTypeModal');
        
        // 少し待ってからガイド登録モーダルを表示
        setTimeout(function() {
          openModal('guideRegisterModal');
        }, 300);
        
        return false;
      });
    }
  });
  
  /**
   * ガイド登録ボタンクリック時の共通処理
   */
  function handleGuideButtonClick() {
    const currentUser = getCurrentUser ? getCurrentUser() : null;
    
    if (currentUser) {
      // ログイン済みの場合は直接ガイド登録モーダルを表示
      openModal('guideRegisterModal');
    } else {
      // 未ログインの場合はユーザータイプモーダルを表示
      openModal('userTypeModal');
    }
  }
  
  /**
   * モーダルを安全に閉じる処理
   * @param {string} modalId モーダルのID
   */
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // モーダルを非表示に
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    
    // バックドロップを削除
    document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    });
    
    // bodyスタイルをリセット
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  
  /**
   * モーダルを安全に開く処理
   * @param {string} modalId モーダルのID
   */
  function openModal(modalId) {
    // まず他のモーダルをすべて閉じる
    document.querySelectorAll('.modal.show').forEach(function(openModal) {
      openModal.classList.remove('show');
      openModal.style.display = 'none';
      openModal.setAttribute('aria-hidden', 'true');
      openModal.removeAttribute('aria-modal');
    });
    
    // バックドロップを削除
    document.querySelectorAll('.modal-backdrop').forEach(function(backdrop) {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    });
    
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`モーダル ${modalId} が見つかりません`);
      return;
    }
    
    // 新しいバックドロップを追加
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.style.opacity = '0.25';
    document.body.appendChild(backdrop);
    
    // モーダル表示
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.style.background = 'none';
    modal.setAttribute('aria-modal', 'true');
    modal.removeAttribute('aria-hidden');
    
    // bodyスタイル設定
    document.body.classList.add('modal-open');
    
    console.log(`モーダル ${modalId} を表示しました`);
  }
})();