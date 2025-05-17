/**
 * ガイド登録モーダル専用修正スクリプト
 * 電話認証セクションの重複を防止し、常に正しいUIを維持する
 */

(function() {
  // モーダル表示イベント
  document.addEventListener('shown.bs.modal', function(e) {
    const modal = e.target;
    
    // ガイド登録モーダルの場合のみ
    if (modal && modal.id === 'registerGuideModal') {
      // 即時実行して既存の重複を修正
      setTimeout(cleanupDuplicateSections, 0);
      
      // さらに時間をおいて再度チェック
      setTimeout(cleanupDuplicateSections, 500);
    }
  });
  
  // DOMの変更を監視
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      // ガイド登録モーダルの変更を検出したら実行
      const guideModal = document.getElementById('registerGuideModal');
      if (guideModal && guideModal.classList.contains('show')) {
        cleanupDuplicateSections();
      }
    });
    
    // body全体の変更を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // 電話認証セクションの重複を修正
  function cleanupDuplicateSections() {
    const guideModal = document.getElementById('registerGuideModal');
    if (!guideModal) return;
    
    // 1. 電話認証セクションの重複を調整
    const phoneSections = guideModal.querySelectorAll('[id$="phone-verification-section"]');
    if (phoneSections.length > 1) {
      // メインセクションのみ残し、他は非表示に
      const mainSection = phoneSections[0];
      for (let i = 1; i < phoneSections.length; i++) {
        const section = phoneSections[i];
        section.style.display = 'none';
      }
      
      // メインセクションのスタイル調整
      mainSection.style.marginBottom = '20px';
      mainSection.style.padding = '15px';
      mainSection.style.backgroundColor = '#f8f9fa';
      mainSection.style.borderRadius = '0.375rem';
      mainSection.style.border = '1px solid #dee2e6';
      
      // セクションタイトル追加（まだなければ）
      if (!mainSection.querySelector('h5.section-title')) {
        const title = document.createElement('h5');
        title.className = 'section-title mb-3';
        title.textContent = '電話番号認証';
        mainSection.prepend(title);
      }
    }
    
    // 2. その他の重複するセクションやバッジを処理
    const otherPhoneSections = guideModal.querySelectorAll('.phone-verification-section:not([id])');
    otherPhoneSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // 3. バッジの表示調整
    // 「未表示」関連要素
    const unverifiedElements = guideModal.querySelectorAll('.unverified-text, #unverified-text');
    if (unverifiedElements.length > 1) {
      // 最初の要素以外を非表示
      for (let i = 1; i < unverifiedElements.length; i++) {
        unverifiedElements[i].style.display = 'none';
      }
      
      // 表示する要素のスタイル調整
      unverifiedElements[0].style.display = 'inline-block';
      unverifiedElements[0].style.backgroundColor = '#f8f9fa';
      unverifiedElements[0].style.color = '#6c757d';
      unverifiedElements[0].style.padding = '3px 8px';
      unverifiedElements[0].style.borderRadius = '4px';
      unverifiedElements[0].style.fontSize = '14px';
    }
    
    // 4. 電話番号入力フィールドを整理
    const phoneInputs = guideModal.querySelectorAll('input[type="tel"]');
    if (phoneInputs.length > 1) {
      // 最初の入力フィールド以外を無効化
      for (let i = 1; i < phoneInputs.length; i++) {
        phoneInputs[i].parentElement.style.display = 'none';
      }
    }
    
    // 5. 送信ボタンを整理
    const sendButtons = guideModal.querySelectorAll('[id$="send-code-btn"]');
    if (sendButtons.length > 1) {
      // 最初のボタン以外を非表示
      for (let i = 1; i < sendButtons.length; i++) {
        sendButtons[i].style.display = 'none';
      }
    }
  }
  
  // ページロード時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    setupMutationObserver();
    
    // 既にモーダルが表示されていれば修正を適用
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal && guideModal.classList.contains('show')) {
      cleanupDuplicateSections();
    }
  });
  
  // 一定間隔で強制実行（フォールバック）
  setInterval(function() {
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal && guideModal.classList.contains('show')) {
      cleanupDuplicateSections();
    }
  }, 1000);
})();