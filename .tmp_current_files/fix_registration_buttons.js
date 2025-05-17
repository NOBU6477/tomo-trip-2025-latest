/**
 * 登録ボタンと言語切替の問題を修正するスクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('登録ボタン修正スクリプトを読み込みました');
  
  // 観光客として登録ボタンの修正
  const touristRegisterBtn = document.getElementById('tourist-register-btn');
  if (touristRegisterBtn) {
    touristRegisterBtn.addEventListener('click', function(e) {
      console.log('観光客として登録ボタンがクリックされました');
      e.preventDefault();
      
      // 現在のユーザータイプを設定（電話認証後のフローで使用）
      window.currentUserRegistrationType = 'tourist';
      
      // 電話番号認証モーダルを表示
      const phoneModal = new bootstrap.Modal(document.getElementById('phoneVerificationModal'));
      phoneModal.show();
      
      // 電話認証が完了した後の処理を設定
      window.onPhoneVerificationComplete = function() {
        console.log('電話認証が完了しました - 観光客登録へ進みます');
        
        // 電話認証モーダルを閉じる
        const phoneVerificationModal = bootstrap.Modal.getInstance(document.getElementById('phoneVerificationModal'));
        if (phoneVerificationModal) phoneVerificationModal.hide();
        
        // 認証済み電話番号を保存
        const phoneNumberInput = document.getElementById('phone-number');
        if (phoneNumberInput && phoneNumberInput.value) {
          window.verifiedPhoneNumber = phoneNumberInput.value;
          localStorage.setItem('verifiedPhoneNumber', phoneNumberInput.value);
        }
        
        // IDドキュメント登録モーダルを表示
        setTimeout(() => {
          // 観光客用身分証明書モーダルを表示
          const idDocumentModal = new bootstrap.Modal(document.getElementById('idDocumentModal'));
          // 観光客用であることを示す隠しフィールドを設定
          const userTypeField = document.getElementById('id-document-user-type');
          if (userTypeField) {
            userTypeField.value = 'tourist';
          }
          idDocumentModal.show();
        }, 500);
      };
    });
  } else {
    console.error('観光客として登録ボタンが見つかりません');
  }
  
  // ガイドとして登録ボタン（何もしない、data-bs属性で直接モーダルを開くように変更）
  const guideRegisterBtn = document.getElementById('guide-register-btn');
  if (guideRegisterBtn) {
    console.log('ガイド登録ボタンが見つかりました（data-bs-toggle属性で直接モーダルを開くように設定されています）');
  } else {
    console.error('ガイドとして登録ボタンが見つかりません');
  }
  
  // 各種モーダルの表示イベントリスナー設定
  const idDocumentModal = document.getElementById('idDocumentModal');
  if (idDocumentModal) {
    idDocumentModal.addEventListener('shown.bs.modal', function() {
      console.log('身分証明書モーダルが表示されました');
      // 身分証明書モーダルの初期化処理
      if (typeof initDocumentHandler === 'function') {
        initDocumentHandler();
      }
    });
  }
  
  // ドキュメント提出完了後の処理を定義
  window.onDocumentSubmitComplete = function(userType) {
    console.log(`書類提出が完了しました - ${userType}`);
    
    // 身分証明書モーダルを閉じる
    const idDocumentModal = bootstrap.Modal.getInstance(document.getElementById('idDocumentModal'));
    if (idDocumentModal) idDocumentModal.hide();
    
    // ユーザータイプに応じた登録モーダルを表示
    setTimeout(() => {
      if (userType === 'tourist') {
        const touristModal = new bootstrap.Modal(document.getElementById('touristRegisterModal'));
        touristModal.show();
      } else if (userType === 'guide') {
        const guideModal = new bootstrap.Modal(document.getElementById('registerGuideModal'));
        guideModal.show();
      }
    }, 500);
  };
  
  console.log('登録ボタンの修正が完了しました');
});