/**
 * 重複した電話認証セクションを修正するスクリプト
 * ガイド登録モーダル内で表示される重複した電話番号認証セクションを統合
 */

(function() {
  // 重複表示を整理するメイン関数
  function fixDuplicateSections() {
    // ガイド登録モーダルを取得
    const guideModal = document.getElementById('registerGuideModal');
    if (!guideModal) return;
    
    // モーダル内の電話認証セクションをすべて探す
    const phoneSections = guideModal.querySelectorAll('[id$="phone-verification-section"]');
    
    // 複数のセクションが見つかった場合
    if (phoneSections && phoneSections.length > 1) {
      console.log('重複した電話認証セクションが見つかりました。統合します...');
      
      // 最初のセクションを保持し、それ以外を非表示に
      for (let i = 1; i < phoneSections.length; i++) {
        phoneSections[i].style.display = 'none';
      }
      
      // メインのセクションを明確にする
      const mainSection = phoneSections[0];
      mainSection.style.marginBottom = '20px';
      mainSection.style.padding = '15px';
      mainSection.style.border = '1px solid #dee2e6';
      mainSection.style.borderRadius = '0.375rem';
      mainSection.style.backgroundColor = '#f8f9fa';
      
      // セクションのタイトルを明確に
      const sectionTitle = document.createElement('h5');
      sectionTitle.textContent = '電話番号認証';
      sectionTitle.className = 'mb-3';
      mainSection.prepend(sectionTitle);
    }
    
    // 同じページ内の別の場所に重複表示されている可能性のあるセクション
    const otherPhoneSections = document.querySelectorAll('.phone-verification-section:not([id])');
    otherPhoneSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // 既に表示されているバッジや状態表示を整理
    cleanupStatusDisplays(guideModal);
  }
  
  // ステータス表示を整理
  function cleanupStatusDisplays(modal) {
    if (!modal) return;
    
    // 「未表示」テキストの重複を整理
    const unverifiedTexts = modal.querySelectorAll('.unverified-text, #unverified-text');
    
    // 1つだけを表示し、他を非表示に
    if (unverifiedTexts.length > 1) {
      for (let i = 1; i < unverifiedTexts.length; i++) {
        unverifiedTexts[i].style.display = 'none';
      }
    }
    
    // 同様に認証済みバッジも整理
    const verifiedBadges = modal.querySelectorAll('.badge.bg-success, .verification-badge.verified');
    if (verifiedBadges.length > 1) {
      for (let i = 1; i < verifiedBadges.length; i++) {
        verifiedBadges[i].style.display = 'none';
      }
    }
  }
  
  // 電話番号入力フィールドのラベルが「電話番号」のみになるよう修正
  function fixPhoneLabels() {
    const guideModal = document.getElementById('registerGuideModal');
    if (!guideModal) return;
    
    // すべてのラベル要素を取得
    const labels = guideModal.querySelectorAll('label');
    
    // 電話番号関連のラベルを探して修正
    labels.forEach(label => {
      if (label.textContent.includes('電話番号') && label.textContent.trim() !== '電話番号') {
        label.textContent = '電話番号';
      }
    });
  }
  
  // モーダル表示時に実行
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    if (modal && modal.id === 'registerGuideModal') {
      setTimeout(function() {
        fixDuplicateSections();
        fixPhoneLabels();
      }, 100);
    }
  });
  
  // ページロード時にも実行
  document.addEventListener('DOMContentLoaded', function() {
    // 既に表示されているモーダルがあれば処理
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal && guideModal.classList.contains('show')) {
      fixDuplicateSections();
      fixPhoneLabels();
    }
  });
  
  // 一定間隔で実行（モーダルの表示状態に関わらず）
  setInterval(function() {
    const guideModal = document.getElementById('registerGuideModal');
    if (guideModal && guideModal.classList.contains('show')) {
      fixDuplicateSections();
      fixPhoneLabels();
    }
  }, 1000);
})();