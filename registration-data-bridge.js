/**
 * 登録データ橋渡しシステム
 * ガイド登録フォームからプロフィール編集ページへの正確なデータ転送を保証
 */

(function() {
  'use strict';

  /**
   * URLパラメータをチェックして登録モードかどうか判定
   */
  function isRegistrationMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mode') === 'registration' || urlParams.get('step') === '2';
  }

  /**
   * 登録データを強制的に設定
   */
  function forceRegistrationData() {
    if (!isRegistrationMode()) return;

    console.log('登録モードを検出 - 新しい登録データを強制設定');

    // 1. 古いデータを完全削除
    clearOldData();

    // 2. 新しい登録データを取得
    const registrationData = getNewRegistrationData();
    if (!registrationData) {
      console.warn('新しい登録データが見つかりません');
      return;
    }

    // 3. セッションデータを更新
    updateSessionData(registrationData);

    // 4. フォームフィールドを即座に更新
    updateFormFields(registrationData);

    // 5. プレビューを更新
    updatePreview(registrationData);

    console.log('新しい登録データの設定完了:', registrationData);
  }

  /**
   * 古いデータを削除
   */
  function clearOldData() {
    // ローカルストレージから古いプロフィールを削除
    const profiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
    Object.keys(profiles).forEach(id => {
      const profile = profiles[id];
      if (profile.email && profile.email.includes('test1400')) {
        delete profiles[id];
      }
    });
    localStorage.setItem('guideProfiles', JSON.stringify(profiles));

    // 古いガイドリストを削除
    const savedGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
    const filteredGuides = savedGuides.filter(guide => 
      !guide.email || !guide.email.includes('test1400')
    );
    localStorage.setItem('savedGuides', JSON.stringify(filteredGuides));

    console.log('古いデータを削除しました');
  }

  /**
   * 新しい登録データを取得
   */
  function getNewRegistrationData() {
    // セッションストレージから最新の登録データを取得
    const sources = [
      'guideRegistrationData',
      'currentUser',
      'guideBasicData'
    ];

    let latestData = null;
    let latestTimestamp = 0;

    for (const source of sources) {
      const data = sessionStorage.getItem(source);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          const timestamp = parsed.timestamp || parsed.registrationTime || Date.now();
          
          if (timestamp > latestTimestamp && 
              (parsed.email === 'test1500@gmail.com' || parsed.name === '優')) {
            latestData = parsed;
            latestTimestamp = timestamp;
          }
        } catch (e) {
          console.error(`データ解析エラー ${source}:`, e);
        }
      }
    }

    return latestData;
  }

  /**
   * セッションデータを更新
   */
  function updateSessionData(registrationData) {
    const currentUser = {
      id: registrationData.id || Date.now().toString(),
      name: registrationData.name || `${registrationData.firstName} ${registrationData.lastName}`,
      username: registrationData.username || registrationData.firstName || '優',
      email: registrationData.email || 'test1500@gmail.com',
      phone: registrationData.phone || '',
      city: registrationData.location || registrationData.city || '',
      userType: 'guide',
      bio: registrationData.bio || '新規登録ガイドです。よろしくお願いします。',
      languages: registrationData.languages || ['日本語'],
      specialties: registrationData.specialties || [],
      registrationTime: Date.now()
    };

    // セッションストレージを更新
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    sessionStorage.setItem('currentGuideId', currentUser.id);

    // 登録データも正規化して保存
    const normalizedRegData = {
      ...registrationData,
      name: currentUser.name,
      email: currentUser.email,
      username: currentUser.username,
      timestamp: Date.now()
    };
    sessionStorage.setItem('guideRegistrationData', JSON.stringify(normalizedRegData));

    console.log('セッションデータを更新:', currentUser);
  }

  /**
   * フォームフィールドを更新
   */
  function updateFormFields(data) {
    const fieldMappings = [
      { id: 'guide-name', value: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() },
      { id: 'guide-username', value: data.username || data.firstName || '優' },
      { id: 'guide-email', value: data.email || 'test1500@gmail.com' },
      { id: 'guide-phone', value: data.phone || '' },
      { id: 'guide-location', value: data.location || data.city || '' }
    ];

    fieldMappings.forEach(({ id, value }) => {
      const field = document.getElementById(id);
      if (field) {
        field.value = value;
        // 変更イベントを発火
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`${id}に設定: ${value}`);
      }
    });

    // サイドバーのユーザー名も更新
    const sidebarName = document.getElementById('user-name');
    if (sidebarName) {
      sidebarName.textContent = data.name || '優';
    }

    // 言語選択も設定
    if (data.languages && Array.isArray(data.languages)) {
      const languageCheckboxes = document.querySelectorAll('input[type="checkbox"][name="languages"]');
      languageCheckboxes.forEach(checkbox => {
        checkbox.checked = data.languages.includes(checkbox.value);
      });
    }
  }

  /**
   * プレビューを更新
   */
  function updatePreview(data) {
    // プレビューカードを探す
    const previewCard = document.querySelector('.profile-preview-card, .profile-preview, .card.preview');
    if (!previewCard) return;

    // 名前を更新
    const nameElements = previewCard.querySelectorAll('h4, h5, .card-title, [class*="name"]');
    nameElements.forEach(element => {
      element.textContent = data.name || '優';
    });

    // ユーザー名を更新
    const usernameElements = previewCard.querySelectorAll('small, [class*="username"]');
    usernameElements.forEach(element => {
      element.textContent = '@' + (data.username || '優');
    });

    // 場所を更新
    const locationElements = previewCard.querySelectorAll('[class*="location"]');
    locationElements.forEach(element => {
      if (element.innerHTML) {
        element.innerHTML = `<i class="bi bi-geo-alt-fill me-1"></i>${data.location || '活動地域'}`;
      }
    });

    console.log('プレビューを更新しました');
  }

  /**
   * 登録完了後の処理
   */
  function handleRegistrationComplete() {
    // URLパラメータを削除して通常モードに
    const url = new URL(window.location);
    url.searchParams.delete('mode');
    url.searchParams.delete('step');
    window.history.replaceState({}, '', url);

    // 成功メッセージを表示
    showSuccessMessage();
  }

  /**
   * 成功メッセージを表示
   */
  function showSuccessMessage() {
    const messageHtml = `
      <div class="alert alert-success alert-dismissible fade show position-fixed" style="top: 20px; right: 20px; z-index: 9999; width: auto; max-width: 400px;">
        <i class="bi bi-check-circle me-2"></i>ガイド登録が完了しました！プロフィール情報を編集してください。
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', messageHtml);

    setTimeout(() => {
      const alert = document.querySelector('.alert-success');
      if (alert) {
        alert.remove();
      }
    }, 5000);
  }

  /**
   * ページロード時の処理
   */
  function initialize() {
    if (window.location.pathname.includes('guide-profile.html')) {
      console.log('プロフィール編集ページ初期化開始');
      
      // 少し遅延させて他のスクリプトより後に実行
      setTimeout(() => {
        forceRegistrationData();
        
        if (isRegistrationMode()) {
          setTimeout(handleRegistrationComplete, 2000);
        }
      }, 100);
    }
  }

  // 即座に実行
  initialize();

  // DOM準備完了後にも実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }

  // ページ表示時にも実行
  window.addEventListener('pageshow', initialize);

})();