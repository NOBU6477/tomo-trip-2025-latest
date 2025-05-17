/**
 * 観光客（ツーリスト）プロフィールページの機能を制御するスクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
  // 認証状態を確認
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  
  // 観光客以外はホームページにリダイレクト
  if (!currentUser || !currentUser.id || currentUser.type !== 'tourist') {
    window.location.href = 'index.html?auth=required&type=tourist';
    return;
  }
  
  // ユーザー情報を表示
  displayUserInfo(currentUser);
  
  // タブ切り替えの設定
  setupTabNavigation();
  
  // プロフィール編集フォームの設定
  setupProfileEditForm();
  
  // アカウント削除確認の設定
  setupDeleteAccountConfirmation();
  
  // お気に入り削除機能の設定
  setupWishlistRemoval();
});

/**
 * ユーザー情報を表示
 */
function displayUserInfo(user) {
  // ヘッダー部分のユーザー情報
  const nameElement = document.getElementById('tourist-name');
  const emailElement = document.getElementById('tourist-email');
  
  if (nameElement) nameElement.textContent = user.name || 'ゲスト';
  if (emailElement) emailElement.textContent = user.email || '';
  
  // プロフィール詳細情報
  document.getElementById('profile-name').textContent = user.name || 'ゲスト';
  document.getElementById('profile-email').textContent = user.email || '';
  
  // 電話番号（存在する場合）
  if (user.phone) {
    document.getElementById('profile-phone').textContent = user.phone;
  }
  
  // 編集フォームの初期値も設定
  document.getElementById('edit-name').value = user.name || '';
  document.getElementById('edit-email').value = user.email || '';
  document.getElementById('edit-phone').value = user.phone || '';
}

/**
 * タブナビゲーションの設定
 */
function setupTabNavigation() {
  const tabLinks = document.querySelectorAll('.list-group-item');
  
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // アクティブクラスの切り替え
      tabLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      
      // タブコンテンツの切り替え
      const targetId = this.getAttribute('data-bs-target');
      const tabPanes = document.querySelectorAll('.tab-pane');
      
      tabPanes.forEach(pane => {
        pane.classList.add('d-none');
        if (pane.id === targetId) {
          pane.classList.remove('d-none');
        }
      });
    });
  });
}

/**
 * プロフィール編集フォームの設定
 */
function setupProfileEditForm() {
  const editProfileForm = document.getElementById('edit-profile-form');
  
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // フォームからデータを取得
      const name = document.getElementById('edit-name').value;
      const phone = document.getElementById('edit-phone').value;
      const nationality = document.getElementById('edit-nationality').value;
      
      // 言語選択（複数可）
      const languageSelect = document.getElementById('edit-languages');
      const selectedLanguages = Array.from(languageSelect.selectedOptions).map(option => option.value);
      
      // 興味・関心（チェックボックス）
      const interestCheckboxes = document.querySelectorAll('input[id^="interest-"]:checked');
      const selectedInterests = Array.from(interestCheckboxes).map(checkbox => checkbox.value);
      
      // 自己紹介
      const bio = document.getElementById('edit-bio').value;
      
      // 現在のユーザー情報を取得して更新
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        name: name,
        phone: phone,
        nationality: nationality,
        languages: selectedLanguages,
        interests: selectedInterests,
        bio: bio
      };
      
      // セッションストレージに保存
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // プロフィール表示を更新
      document.getElementById('tourist-name').textContent = name;
      document.getElementById('profile-name').textContent = name;
      document.getElementById('profile-phone').textContent = phone;
      document.getElementById('profile-nationality').textContent = nationality;
      document.getElementById('profile-languages').textContent = selectedLanguages.join('、');
      
      // 興味・関心バッジを更新
      const interestsContainer = document.getElementById('profile-interests');
      interestsContainer.innerHTML = '';
      selectedInterests.forEach(interest => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-light text-dark me-2 mb-2';
        badge.textContent = interest;
        interestsContainer.appendChild(badge);
      });
      
      // 自己紹介を更新
      document.getElementById('profile-bio').textContent = bio;
      
      // モーダルを閉じる
      const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
      modal.hide();
      
      // 成功メッセージ
      showAlert('プロフィールが更新されました', 'success');
    });
  }
}

/**
 * アカウント削除確認機能の設定
 */
function setupDeleteAccountConfirmation() {
  const deleteConfirmInput = document.getElementById('delete-confirm');
  const confirmDeleteButton = document.getElementById('confirm-delete-button');
  
  if (deleteConfirmInput && confirmDeleteButton) {
    // 入力内容に応じてボタンの有効/無効を切り替え
    deleteConfirmInput.addEventListener('input', function() {
      confirmDeleteButton.disabled = this.value !== 'DELETE';
    });
    
    // 削除ボタンのクリックイベント
    confirmDeleteButton.addEventListener('click', function() {
      if (deleteConfirmInput.value === 'DELETE') {
        // セッションストレージからユーザー情報を削除
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('touristRegistrationData');
        
        // モーダルを閉じる
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
        modal.hide();
        
        // アラート表示
        showAlert('アカウントが削除されました。ホームページにリダイレクトします...', 'success');
        
        // 2秒後にホームページにリダイレクト
        setTimeout(() => {
          window.location.href = 'index.html?deleted=true';
        }, 2000);
      }
    });
  }
}

/**
 * お気に入り削除機能の設定
 */
function setupWishlistRemoval() {
  const removeWishButtons = document.querySelectorAll('.remove-wish');
  
  if (removeWishButtons) {
    removeWishButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // クリックされたボタンの親要素（カード）を取得
        const wishCard = this.closest('.wish-list-card');
        
        // 確認ダイアログ
        if (confirm('このガイドをお気に入りから削除しますか？')) {
          // フェードアウトアニメーション
          wishCard.style.transition = 'opacity 0.3s ease';
          wishCard.style.opacity = '0';
          
          // アニメーション後に要素を削除
          setTimeout(() => {
            wishCard.remove();
            
            // お気に入りが空になったかチェック
            const remainingCards = document.querySelectorAll('.wish-list-card');
            if (remainingCards.length === 0) {
              const wishlistTab = document.getElementById('wishlist-tab');
              wishlistTab.innerHTML = `
                <div class="content-card p-4">
                  <h2 class="h4 mb-4 section-title">お気に入りガイド</h2>
                  <div class="text-center py-4 text-muted">
                    <i class="bi bi-heart" style="font-size: 3rem;"></i>
                    <p class="mt-3">お気に入りに追加したガイドがありません</p>
                    <a href="guides.html" class="btn btn-primary mt-2">ガイドを探す</a>
                  </div>
                </div>
              `;
            }
          }, 300);
        }
      });
    });
  }
}

/**
 * アラートメッセージを表示する共通関数
 */
function showAlert(message, type = 'info') {
  // アラートコンテナの確認・作成
  let alertContainer = document.getElementById('alert-container');
  
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.maxWidth = '400px';
    alertContainer.style.zIndex = '9999';
    document.body.appendChild(alertContainer);
  }
  
  // アラート要素の作成
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type} alert-dismissible fade show`;
  alertElement.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // アラートを追加
  alertContainer.appendChild(alertElement);
  
  // 5秒後に自動的に消える
  setTimeout(() => {
    alertElement.classList.remove('show');
    setTimeout(() => {
      alertElement.remove();
    }, 150);
  }, 5000);
}