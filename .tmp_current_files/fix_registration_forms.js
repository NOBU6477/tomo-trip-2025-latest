/**
 * 登録フォームの送信後処理を修正するスクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('登録フォーム処理修正スクリプトを読み込みました');
  
  // 観光客登録フォームの処理
  setupFormHandler('tourist');
  
  // ガイド登録フォームの処理
  setupFormHandler('guide');
  
  /**
   * 登録フォームのハンドラ設定
   * @param {string} userType ユーザータイプ ('tourist' または 'guide')
   */
  function setupFormHandler(userType) {
    const isGuide = userType === 'guide';
    const formId = isGuide ? 'register-guide-form' : 'register-tourist-form';
    const modalId = isGuide ? 'registerGuideModal' : 'registerTouristModal';
    const usernameId = isGuide ? 'guide-username' : 'tourist-username';
    const emailId = isGuide ? 'guide-email' : 'tourist-email';
    const passwordId = isGuide ? 'guide-password' : 'tourist-password';
    const confirmPasswordId = isGuide ? 'guide-confirm-password' : 'tourist-confirm-password';
    const loadingId = isGuide ? 'guide-form-loading' : 'tourist-form-loading';
    const successId = isGuide ? 'guide-form-success' : 'tourist-form-success';
    
    const registerForm = document.getElementById(formId);
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log(`${userType} 登録フォームが送信されました`);
      
      // フォームデータの取得
      const username = document.getElementById(usernameId)?.value || '';
      const email = document.getElementById(emailId)?.value || '';
      const password = document.getElementById(passwordId)?.value || '';
      const confirmPassword = document.getElementById(confirmPasswordId)?.value || '';
      
      // ローディング表示
      const loadingEl = document.getElementById(loadingId);
      const successEl = document.getElementById(successId);
      
      if (loadingEl) loadingEl.classList.remove('d-none');
      if (successEl) successEl.classList.add('d-none');
      
      // 簡易バリデーション
      if (password !== confirmPassword) {
        if (loadingEl) loadingEl.classList.add('d-none');
        showFormError(userType, 'パスワードが一致しません');
        return;
      }
      
      // 登録APIリクエスト（モック）
      // 実際のアプリケーションではfetchAPIを使用するべき
      setTimeout(() => {
        // 登録成功を模擬
        console.log(`${userType} 登録が完了しました`);
        
        // ユーザー情報の設定
        const user = {
          id: `${userType}-${Math.floor(Math.random() * 10000)}`,
          username: username,
          email: email,
          role: userType,
          phoneVerified: true,
          documentVerified: true
        };
        
        // ローカルストレージに保存
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // ローディング非表示
        if (loadingEl) loadingEl.classList.add('d-none');
        
        // 成功メッセージを表示
        if (successEl) {
          successEl.classList.remove('d-none');
          
          // 成功メッセージの表示時間（3秒）
          setTimeout(() => {
            // モーダルを閉じる
            const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
            if (modal) modal.hide();
            
            // ホームページ更新（ログイン状態表示）
            if (typeof updateUIForLoggedInUser === 'function') {
              updateUIForLoggedInUser(user);
            }
            
            // ページをリロードしてトップ画面に戻る
            window.location.href = '/';
          }, 3000);
        } else {
          // 成功要素がない場合は直接進める
          // モーダルを閉じる
          const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
          if (modal) modal.hide();
          
          // 成功メッセージを表示
          showToast(`${isGuide ? 'ガイド' : '観光客'}登録が完了しました！ようこそ ${username} さん`, 'success');
          
          // ホームページ更新（ログイン状態表示）
          if (typeof updateUIForLoggedInUser === 'function') {
            updateUIForLoggedInUser(user);
          }
          
          // ページをリロードしてトップ画面に戻る
          window.location.href = '/';
        }
      }, 2000);
    });
    
    console.log(`${userType} 登録フォームのハンドラーを設定しました`);
  }
  
  /**
   * フォームエラーメッセージを表示
   * @param {string} userType ユーザータイプ
   * @param {string} message エラーメッセージ
   */
  function showFormError(userType, message) {
    // アラートの代わりにモーダル内に表示
    const formId = userType === 'guide' ? 'register-guide-form' : 'register-tourist-form';
    const form = document.getElementById(formId);
    
    if (form) {
      // 既存のエラー要素を探す
      let errorEl = form.querySelector('.alert-danger');
      
      // なければ作成
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'alert alert-danger mt-3';
        errorEl.setAttribute('role', 'alert');
        form.appendChild(errorEl);
      }
      
      // メッセージを設定して表示
      errorEl.textContent = message;
      errorEl.classList.remove('d-none');
      
      // 3秒後に非表示
      setTimeout(() => {
        errorEl.classList.add('d-none');
      }, 3000);
    } else {
      // フォールバックとしてトースト表示
      showToast(message, 'danger');
    }
  }
  
  /**
   * トースト通知を表示
   * @param {string} message 表示するメッセージ
   * @param {string} type メッセージタイプ（success, danger, warning, info）
   */
  function showToast(message, type = 'info') {
    // 既存のトースト要素を取得または作成
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    // トースト要素の作成
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    const toastFlex = document.createElement('div');
    toastFlex.className = 'd-flex';
    
    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Close');
    
    // 要素を組み立て
    toastFlex.appendChild(toastBody);
    toastFlex.appendChild(closeButton);
    toastEl.appendChild(toastFlex);
    toastContainer.appendChild(toastEl);
    
    // Bootstrapトースト初期化
    const toast = new bootstrap.Toast(toastEl, {
      animation: true,
      autohide: true,
      delay: 5000
    });
    
    // トースト表示
    toast.show();
    
    // トーストが閉じられたら要素を削除
    toastEl.addEventListener('hidden.bs.toast', function() {
      toastEl.remove();
    });
  }
  
  console.log('登録フォーム処理修正が完了しました');
});
