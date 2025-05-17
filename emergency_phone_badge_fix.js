/**
 * 緊急電話認証バッジ修正スクリプト
 * 電話認証が完了していない場合でも「認証済み」バッジが表示される問題を修正
 * 
 * 完全緊急対応版: 認証状態に関わらずバッジを非表示に強制
 */
(function() {
  console.log('緊急電話認証バッジ修正スクリプト: 初期化開始');
  
  // DOMが読み込まれたら実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmergencyFix);
  } else {
    initEmergencyFix();
  }
  
  // モーダル表示時にも実行
  document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'registerGuideModal' || event.target.id === 'guideRegisterModal') {
      console.log('電話認証バッジ修正: ガイドモーダル表示');
      setTimeout(fixGuideBadge, 100);
    }
  });
  
  // ページ読み込み完了時にも実行
  window.addEventListener('load', function() {
    console.log('ページ読み込み完了: バッジ修正実行');
    initEmergencyFix();
  });
  
  // 緊急修正初期化
  function initEmergencyFix() {
    console.log('緊急電話認証バッジ修正: 初期化');
    fixGuideBadge();
    monitorBadgeChanges();
  }
  
  // ガイド認証バッジを修正
  function fixGuideBadge() {
    // ガイド電話認証バッジ要素を取得
    const guideBadge = document.getElementById('guide-phone-verified');
    if (!guideBadge) {
      console.log('ガイド認証バッジが見つかりません');
      return;
    }
    
    // 緊急対応：認証状態に関わらずバッジを非表示に強制
    console.log('緊急対応：認証バッジを非表示に強制します');
    
    // display:none !important を適用
    guideBadge.style.setProperty('display', 'none', 'important');
    
    // クラスでも非表示を適用
    guideBadge.classList.add('d-none');
    
    // 入力フィールドを強制的に有効化
    const phoneInput = document.getElementById('guide-phone-number');
    if (phoneInput) {
      phoneInput.disabled = false;
    }
    
    // 送信ボタンを有効化
    const sendBtn = document.getElementById('guide-send-code-btn');
    if (sendBtn) {
      sendBtn.disabled = false;
    }
    
    // コード入力フィールドを表示
    const codeFieldContainer = document.getElementById('guide-verification-code');
    if (codeFieldContainer) {
      const container = codeFieldContainer.closest('.mb-4');
      if (container) {
        container.style.display = 'block';
      }
    }
    
    // reCAPTCHAコンテナを表示
    const recaptchaContainer = document.getElementById('guide-recaptcha-container');
    if (recaptchaContainer) {
      recaptchaContainer.style.display = 'block';
    }
    
    // 認証状態も強制的にリセット
    if (window.resetPhoneVerification && typeof window.resetPhoneVerification === 'function') {
      window.resetPhoneVerification('guide');
      console.log('ガイドの認証状態を強制リセットしました');
    }
  }
  
  // バッジの変更を監視
  function monitorBadgeChanges() {
    // DOMの変更を監視
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'class' && 
            mutation.target.id === 'guide-phone-verified') {
          
          // クラス変更が検出されたらバッジを修正
          console.log('ガイド認証バッジのクラス変更を検出');
          fixGuideBadge();
        }
      });
    });
    
    // ガイド認証バッジを監視
    const guideBadge = document.getElementById('guide-phone-verified');
    if (guideBadge) {
      observer.observe(guideBadge, { attributes: true });
      console.log('ガイド認証バッジの監視を開始');
    }
  }
})();