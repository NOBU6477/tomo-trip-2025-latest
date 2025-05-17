/**
 * 電話番号認証の状態管理スクリプト
 * 認証状態を保持し、UI要素を適切に更新
 */

(function() {
  // 認証状態を保存するキー
  const GUIDE_VERIFICATION_KEY = 'guide-phone-verified';
  const TOURIST_VERIFICATION_KEY = 'tourist-phone-verified';
  
  // DOM読み込み完了時に初期化
  document.addEventListener('DOMContentLoaded', function() {
    // ページロード時に保存された認証状態を確認
    checkSavedVerificationStatus();
    
    // 電話認証完了イベントのリスナー
    document.addEventListener('phoneVerified', function(e) {
      const userType = e.detail.userType;
      updateVerificationUI(userType, true);
    });
    
    // モーダル表示時のイベント
    document.addEventListener('shown.bs.modal', function(e) {
      const modal = e.target;
      
      // ガイド登録モーダルの場合
      if (modal && modal.id === 'registerGuideModal') {
        checkModalVerificationStatus('guide', modal);
      }
      
      // ツーリスト登録モーダルの場合
      if (modal && modal.id === 'registerTouristModal') {
        checkModalVerificationStatus('tourist', modal);
      }
    });
  });
  
  // 認証状態に基づいてUIを更新
  function updateVerificationUI(userType, isVerified) {
    // 対象の要素を取得
    const unverifiedText = document.querySelector(`#${userType}-phone-verification-section .unverified-text`) || 
                           document.querySelector(`.unverified-text`);
    
    const verifiedBadge = document.querySelector(`#${userType}-phone-verification-section .verification-badge.verified`);
    
    // 認証済み状態
    if (isVerified) {
      // 未表示テキストを非表示
      if (unverifiedText) {
        unverifiedText.style.display = 'none';
      }
      
      // 認証済みバッジが存在しない場合は作成
      if (!verifiedBadge && unverifiedText) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-success verification-badge verified';
        badge.textContent = '認証済み';
        
        // バッジを挿入
        if (unverifiedText.parentNode) {
          unverifiedText.parentNode.insertBefore(badge, unverifiedText.nextSibling);
        }
      }
      
      // 認証入力コンテナを非表示
      const codeContainer = document.querySelector(`#${userType}-phone-verification-section .verification-code-container`);
      if (codeContainer) {
        codeContainer.classList.add('d-none');
      }
      
      // 電話番号入力を読み取り専用に
      const phoneInput = document.querySelector(`#${userType}-phone-number`) || 
                         document.querySelector(`#phone-number`);
      if (phoneInput) {
        phoneInput.readOnly = true;
      }
      
      // コード送信ボタンを無効化
      const sendButton = document.querySelector(`#${userType}-send-code-btn`) || 
                         document.querySelector(`#send-code-btn`);
      if (sendButton) {
        sendButton.disabled = true;
        sendButton.textContent = '認証済み';
      }
      
      // 認証状態を保存
      sessionStorage.setItem(`${userType}-phone-verified`, 'true');
    } else {
      // 未認証状態
      // 未表示テキストを表示
      if (unverifiedText) {
        unverifiedText.style.display = 'inline-block';
      }
      
      // 認証済みバッジを削除
      if (verifiedBadge) {
        verifiedBadge.remove();
      }
      
      // 電話番号入力を編集可能に
      const phoneInput = document.querySelector(`#${userType}-phone-number`) || 
                         document.querySelector(`#phone-number`);
      if (phoneInput) {
        phoneInput.readOnly = false;
      }
      
      // コード送信ボタンを有効化
      const sendButton = document.querySelector(`#${userType}-send-code-btn`) || 
                         document.querySelector(`#send-code-btn`);
      if (sendButton) {
        sendButton.disabled = false;
        sendButton.textContent = '認証コード送信';
      }
      
      // 認証状態を削除
      sessionStorage.removeItem(`${userType}-phone-verified`);
    }
  }
  
  // ページロード時に保存された認証状態を確認
  function checkSavedVerificationStatus() {
    // ガイドの認証状態
    const guideVerified = sessionStorage.getItem(GUIDE_VERIFICATION_KEY) === 'true';
    if (guideVerified) {
      updateVerificationUI('guide', true);
    }
    
    // ツーリストの認証状態
    const touristVerified = sessionStorage.getItem(TOURIST_VERIFICATION_KEY) === 'true';
    if (touristVerified) {
      updateVerificationUI('tourist', true);
    }
  }
  
  // モーダル表示時に認証状態を確認
  function checkModalVerificationStatus(userType, modal) {
    const isVerified = sessionStorage.getItem(`${userType}-phone-verified`) === 'true';
    
    // 具体的なモーダル内の要素を更新
    if (isVerified) {
      // 未表示テキスト
      const unverifiedText = modal.querySelector('.unverified-text') || modal.querySelector('#unverified-text');
      if (unverifiedText) {
        unverifiedText.style.display = 'none';
      }
      
      // 既存の認証済みバッジがなければ作成
      const verifiedBadge = modal.querySelector('.verification-badge.verified');
      if (!verifiedBadge && unverifiedText) {
        const badge = document.createElement('span');
        badge.className = 'badge bg-success verification-badge verified';
        badge.textContent = '認証済み';
        
        if (unverifiedText.parentNode) {
          unverifiedText.parentNode.insertBefore(badge, unverifiedText.nextSibling);
        }
      }
      
      // 電話番号入力を読み取り専用に
      const phoneInput = modal.querySelector(`#${userType}-phone-number`) || modal.querySelector('#phone-number');
      if (phoneInput) {
        phoneInput.readOnly = true;
      }
      
      // コード送信ボタンを無効化
      const sendButton = modal.querySelector(`#${userType}-send-code-btn`) || modal.querySelector('#send-code-btn');
      if (sendButton) {
        sendButton.disabled = true;
        sendButton.textContent = '認証済み';
      }
    }
  }
  
  // 認証リセット（デバッグ用）
  window.resetPhoneVerification = function(userType) {
    if (userType) {
      sessionStorage.removeItem(`${userType}-phone-verified`);
      updateVerificationUI(userType, false);
      console.log(`${userType}の電話認証状態をリセットしました`);
    } else {
      // すべてリセット
      sessionStorage.removeItem(GUIDE_VERIFICATION_KEY);
      sessionStorage.removeItem(TOURIST_VERIFICATION_KEY);
      updateVerificationUI('guide', false);
      updateVerificationUI('tourist', false);
      console.log('すべての電話認証状態をリセットしました');
    }
  };
})();