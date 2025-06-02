/**
 * ガイドプロフィール編集画面の処理
 * ガイドが自身のプロフィール情報を編集するための機能を提供
 */

// DOMの準備完了時に実行
document.addEventListener('DOMContentLoaded', function() {
  console.log('ガイドプロフィールハンドラー初期化中...');
  
  // 認証状態をチェックしてアクセス制御メッセージを非表示にする
  checkAuthenticationStatus();
  
  // 各種編集機能をセットアップ
  setupPhotoEditFunctions();
  setupCertPhotoEditFunctions();
  setupBioEditFunctions();
  setupSpecialtiesEditFunctions();
  setupFeeEditFunctions();
  setupBasicInfoEditFunctions();
  setupIdDocumentEditFunctions();
  setupGuideListRedirect();
  
  // プロフィールの初期化
  initGuideProfile();
});

/**
 * 認証状態をチェックしてアクセス制御を解除
 */
function checkAuthenticationStatus() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const userType = sessionStorage.getItem('userType');
  const registrationCompleted = sessionStorage.getItem('guideRegistrationCompleted') === 'true';
  
  console.log('認証状態チェック:', { isLoggedIn, userType, registrationCompleted });
  
  // ガイドとしてログイン済みまたは新規登録完了の場合、アクセス許可
  if ((isLoggedIn && userType === 'guide') || registrationCompleted) {
    // アクセス拒否メッセージを非表示にする
    const accessDeniedElements = document.querySelectorAll('[class*="access-denied"], [class*="login-required"], .alert-danger');
    accessDeniedElements.forEach(element => {
      if (element.textContent.includes('アクセスが拒否') || element.textContent.includes('ログインして')) {
        element.style.display = 'none';
      }
    });
    
    // ガイド専用コンテンツを表示
    const guideOnlyElements = document.querySelectorAll('.guide-only');
    guideOnlyElements.forEach(element => {
      element.classList.remove('d-none');
    });
    
    // 制限されたコンテンツのアクセス許可
    const restrictedElements = document.querySelectorAll('.content-restricted');
    restrictedElements.forEach(element => {
      element.classList.remove('content-restricted');
    });
  }
}

/**
 * セッションストレージからガイドプロフィールを読み込み
 */
function loadGuideProfile() {
  try {
    console.log('ガイドプロフィールデータを読み込み中...');
    
    // 新規登録からの遷移かどうかをチェック
    const isNewRegistration = sessionStorage.getItem('guideRegistrationCompleted') === 'true';
    
    // ユーザー情報を取得
    const user = getCurrentUser();
    
    // デフォルトプロフィール情報（新規ユーザーまたはデモ用）
    const defaultProfile = {
      id: '12345',
      username: 'guide_user',
      email: 'guide@example.com',
      firstName: '太郎',
      lastName: '観光',
      phone: '+819012345678',
      gender: 'male',
      ageGroup: '36-45',
      city: '東京',
      bio: 'こんにちは。東京在住のガイドです。東京の隠れた名所や、地元の人しか知らないスポットをご案内します。一緒に東京で素敵な時間を過ごしましょう！',
      languages: ['ja', 'en'],
      specialties: ['history', 'food', 'photography'],
      baseFee: 6000,
      hourlyFee: 3000,
      profilePhotoUrl: 'https://placehold.co/150',
      certificationPhotoUrl: 'https://placehold.co/150',
      documentType: 'passport',
      documentUrls: {
        passport: 'https://placehold.co/120x80?text=ID'
      }
    };
    
    // 新規登録の場合
    if (isNewRegistration) {
      console.log('新規登録ユーザーを検出しました');
      
      // 登録データの取得（sessionStorageから取得できる場合）
      const registrationData = JSON.parse(sessionStorage.getItem('guideRegistrationData') || '{}');
      
      // ユーザーが存在しない場合は新規作成
      if (!user) {
        console.log('新規ユーザーを作成します');
        
        // 登録データを使用してプロフィールを作成
        const newUser = {
          userType: 'guide',
          ...defaultProfile,
          ...registrationData
        };
        
        // セッションに保存
        setCurrentUser(newUser);
        
        // 登録データは一度だけ使用するので削除
        if (Object.keys(registrationData).length > 0) {
          sessionStorage.removeItem('guideRegistrationData');
        }
        
        return newUser;
      }
      
      // 既存ユーザーに登録データをマージ
      if (Object.keys(registrationData).length > 0) {
        const updatedUser = {
          ...user,
          ...registrationData
        };
        setCurrentUser(updatedUser);
        sessionStorage.removeItem('guideRegistrationData');
        return updatedUser;
      }
    }
    
    // 通常のケース：既存ユーザーまたはデモモード
    if (!user) {
      console.log('ユーザーが見つかりません。デモプロフィールを使用します');
      // デモユーザーを作成
      const demoUser = {
        userType: 'guide',
        ...defaultProfile
      };
      setCurrentUser(demoUser);
      return demoUser;
    }
    
    // ユーザータイプのチェック（現在は無効化）
    /*
    if (user.userType !== 'guide') {
      console.warn('このプロフィールはガイド用ではありません');
      window.location.href = 'index.html';
      return null;
    }
    */
    
    // 既存ユーザーのプロフィールを返す
    console.log('既存のガイドプロフィールを使用します');
    
    // 必要なフィールドが欠けている場合はデフォルト値で補完
    const completeProfile = {
      ...defaultProfile,
      ...user
    };

    return completeProfile;
  } catch (error) {
    console.error('ガイドプロフィール読み込み中にエラーが発生しました:', error);
    return null;
  }
}

/**
 * ガイドプロフィール情報を画面に表示
 * @param {Object} profile ガイドプロフィール情報
 */
function displayGuideProfile(profile) {
  if (!profile) return;

  // 要素に安全にテキストを設定する補助関数
  function setElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    } else {
      console.warn(`要素 ${id} が見つかりません`);
    }
  }

  // 要素に安全に画像ソースを設定する補助関数
  function setImageSrc(id, src) {
    const element = document.getElementById(id);
    if (element) {
      element.src = src;
    } else {
      console.warn(`画像要素 ${id} が見つかりません`);
    }
  }

  // 基本情報の表示
  setElementText('guide-fullname', `${profile.lastName} ${profile.firstName}`);
  setElementText('guide-location', profile.city);
  setElementText('guide-username', profile.username);
  setElementText('guide-email', profile.email);
  setElementText('guide-phone', profile.phone);
  setElementText('guide-gender', translateGender(profile.gender));
  setElementText('guide-age-group', translateAgeGroup(profile.ageGroup));
  
  // 自己紹介
  setElementText('guide-bio', profile.bio || '自己紹介文がここに表示されます。');
  
  // 言語と専門分野
  updateLanguagesDisplay(profile.languages);
  updateSpecialtiesDisplay(profile.specialties);
  
  // 料金情報
  setElementText('guide-base-fee', `¥${profile.baseFee.toLocaleString()}`);
  setElementText('guide-hourly-fee', `¥${profile.hourlyFee.toLocaleString()}`);
  
  // 写真
  if (profile.profilePhotoUrl) {
    setImageSrc('guide-profile-photo', profile.profilePhotoUrl);
    setImageSrc('profile-photo-preview', profile.profilePhotoUrl);
  }
  
  if (profile.certificationPhotoUrl) {
    setImageSrc('guide-certification-photo', profile.certificationPhotoUrl);
  }
  
  // 身分証明書
  setElementText('document-type-display', translateDocumentType(profile.documentType));
  
  const documentContainer = document.getElementById('guide-id-documents');
  if (!documentContainer) {
    console.warn('書類コンテナ要素が見つかりません');
    return;
  }
  
  const documentPreviewDiv = documentContainer.querySelector('.d-flex');
  if (!documentPreviewDiv) {
    console.warn('書類プレビュー要素が見つかりません');
    return;
  }
  
  const documentImages = documentPreviewDiv.querySelectorAll('img');
  
  // 既存の画像を削除（placeholder以外）
  if (documentImages.length > 0) {
    Array.from(documentImages).forEach(img => {
      if (!img.src.includes('placeholder')) {
        img.remove();
      }
    });
  }
  
  // 書類タイプに応じた画像を表示
  if (profile.documentUrls) {
    if (profile.documentType === 'passport' && profile.documentUrls.passport) {
      const firstDocImg = documentPreviewDiv.querySelector('img');
      if (firstDocImg) {
        firstDocImg.src = profile.documentUrls.passport;
        firstDocImg.alt = 'パスポート';
      }
    } else if (['driverLicense', 'idCard', 'residentCard'].includes(profile.documentType)) {
      const frontKey = `${profile.documentType}Front`;
      const backKey = `${profile.documentType}Back`;
      
      if (profile.documentUrls[frontKey]) {
        const firstDocImg = documentPreviewDiv.querySelector('img');
        if (firstDocImg) {
          firstDocImg.src = profile.documentUrls[frontKey];
          firstDocImg.alt = '書類表面';
        }
      }
      
      if (profile.documentUrls[backKey]) {
        const secondDocImg = documentPreviewDiv.querySelector('img:nth-child(2)');
        if (secondDocImg) {
          secondDocImg.src = profile.documentUrls[backKey];
          secondDocImg.alt = '書類裏面';
        } else {
          const newImg = document.createElement('img');
          newImg.src = profile.documentUrls[backKey];
          newImg.alt = '書類裏面';
          newImg.className = 'document-preview';
          documentPreviewDiv.appendChild(newImg);
        }
      }
    }
  }
}

/**
 * 編集モーダルのフォームに初期値を設定
 * @param {Object} profile ガイドプロフィール情報
 */
function initializeEditForms(profile) {
  if (!profile) {
    console.error('プロフィールデータがありません');
    return;
  }
  
  // 要素に安全に値を設定する補助関数
  function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.value = value;
    } else {
      console.warn(`入力要素 ${id} が見つかりません`);
    }
  }

  // 自己紹介
  setInputValue('bio-edit-text', profile.bio || '');
  
  // 言語選択
  const languagesSelect = document.getElementById('languages-edit');
  if (languagesSelect) {
    try {
      Array.from(languagesSelect.options).forEach(option => {
        option.selected = profile.languages && profile.languages.includes(option.value);
      });
    } catch (error) {
      console.error('言語選択の設定中にエラー:', error);
    }
  } else {
    console.warn('言語選択要素が見つかりません');
  }
  
  // 専門分野
  try {
    const specialtyCheckboxes = document.querySelectorAll('.specialty-checkbox');
    if (specialtyCheckboxes.length > 0) {
      specialtyCheckboxes.forEach(checkbox => {
        checkbox.checked = profile.specialties && profile.specialties.includes(checkbox.value);
      });
    } else {
      console.warn('専門分野チェックボックスが見つかりません');
    }
  } catch (error) {
    console.error('専門分野の設定中にエラー:', error);
  }
  
  // 料金
  setInputValue('base-fee-edit', profile.baseFee || 6000);
  setInputValue('hourly-fee-edit', profile.hourlyFee || 3000);
  
  // 基本情報
  setInputValue('username-edit', profile.username || '');
  setInputValue('email-edit', profile.email || '');
  setInputValue('phone-edit', profile.phone || '');
  setInputValue('firstName-edit', profile.firstName || '');
  setInputValue('lastName-edit', profile.lastName || '');
  setInputValue('city-edit', profile.city || '');
  
  // 性別
  try {
    const genderRadios = document.querySelectorAll('input[name="gender-edit"]');
    if (genderRadios.length > 0) {
      genderRadios.forEach(radio => {
        if (radio.value === profile.gender) {
          radio.checked = true;
        }
      });
    } else {
      console.warn('性別ラジオボタンが見つかりません');
    }
  } catch (error) {
    console.error('性別選択の設定中にエラー:', error);
  }
  
  // 年齢層
  const ageGroupSelect = document.getElementById('age-group-edit');
  if (ageGroupSelect) {
    try {
      Array.from(ageGroupSelect.options).forEach(option => {
        if (option.value === profile.ageGroup) {
          option.selected = true;
        }
      });
    } catch (error) {
      console.error('年齢層選択の設定中にエラー:', error);
    }
  } else {
    console.warn('年齢層選択要素が見つかりません');
  }
  
  // 身分証明書
  const documentTypeSelect = document.getElementById('document-type-edit');
  if (documentTypeSelect) {
    try {
      Array.from(documentTypeSelect.options).forEach(option => {
        if (option.value === profile.documentType) {
          option.selected = true;
        }
      });
    } catch (error) {
      console.error('書類タイプ選択の設定中にエラー:', error);
    }
  } else {
    console.warn('書類タイプ選択要素が見つかりません');
  }
  
  console.log('フォームの初期化が完了しました');
}

/**
 * プロフィール写真編集機能
 * 注：プロフィール写真機能は現在無効化されています
 */
function setupPhotoEditFunctions() {
  console.log('プロフィール写真機能は無効化されています');
  // この機能は削除されました
}

/**
 * 証明写真編集機能の設定
 */
function setupCertPhotoEditFunctions() {
  console.log('証明写真編集機能を初期化します');
  
  const selectButton = document.getElementById('cert-photo-select');
  const cameraButton = document.getElementById('cert-photo-camera');
  const fileInput = document.getElementById('cert-photo-input');
  const preview = document.getElementById('cert-photo-preview');
  const saveButton = document.getElementById('save-cert-photo');
  
  if (!selectButton) {
    console.error('証明写真選択ボタンが見つかりません');
  }
  
  if (!fileInput) {
    console.error('証明写真ファイル入力が見つかりません');
  }
  
  if (!preview) {
    console.error('証明写真プレビューが見つかりません');
  }
  
  if (!saveButton) {
    console.error('証明写真保存ボタンが見つかりません');
  }
  
  if (!selectButton || !fileInput || !preview || !saveButton) {
    console.warn('証明写真編集に必要な要素が見つかりません');
    return;
  }
  
  // ファイル選択ボタンのクリックイベント
  selectButton.addEventListener('click', function() {
    console.log('証明写真選択ボタンがクリックされました');
    fileInput.click();
  });
  
  // ファイル選択時のイベント
  fileInput.addEventListener('change', function(e) {
    console.log('証明写真ファイルが選択されました');
    
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log('選択されたファイル:', file.name, file.type, file.size);
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        console.log('ファイル読み込み完了');
        preview.src = e.target.result;
        preview.style.display = 'block'; // プレビューを表示
      };
      
      reader.onerror = function(e) {
        console.error('ファイル読み込みエラー:', e);
        alert('ファイルの読み込みに失敗しました。別のファイルを試してください。');
      };
      
      reader.readAsDataURL(file);
    }
  });
  
  // カメラボタンのクリックイベント
  if (cameraButton) {
    cameraButton.addEventListener('click', function() {
      console.log('カメラボタンがクリックされました');
      
      // カメラをサポートしているか確認
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // カメラキャプチャモーダルを作成
        const modalHtml = `
          <div class="modal fade" id="cameraModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">カメラで撮影</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                  <video id="camera-preview" style="width: 100%; max-width: 400px;" autoplay></video>
                  <canvas id="camera-canvas" style="display: none;"></canvas>
                  <div class="mt-3">
                    <button id="capture-button" class="btn btn-primary">撮影する</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // 既存のモーダルがあれば削除
        const existingModal = document.getElementById('cameraModal');
        if (existingModal) {
          existingModal.remove();
        }
        
        // 新しいモーダルを追加
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // モーダルを開く
        const cameraModal = new bootstrap.Modal(document.getElementById('cameraModal'));
        cameraModal.show();
        
        // カメラの開始
        const video = document.getElementById('camera-preview');
        const canvas = document.getElementById('camera-canvas');
        const captureButton = document.getElementById('capture-button');
        
        let stream = null;
        
        // カメラを要求
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function(mediaStream) {
            stream = mediaStream;
            video.srcObject = mediaStream;
            video.onloadedmetadata = function(e) {
              video.play();
            };
          })
          .catch(function(err) {
            console.error('カメラアクセスエラー:', err);
            alert('カメラへのアクセスができませんでした。許可設定を確認してください。');
            cameraModal.hide();
          });
        
        // 撮影ボタン
        captureButton.addEventListener('click', function() {
          // キャンバスの設定
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // 画像をキャンバスに描画
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // 画像データを取得
          const imageData = canvas.toDataURL('image/png');
          
          // プレビューに設定
          preview.src = imageData;
          preview.style.display = 'block';
          
          // カメラの停止
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          // モーダルを閉じる
          cameraModal.hide();
        });
        
        // モーダルが閉じられたときにカメラを停止
        document.getElementById('cameraModal').addEventListener('hidden.bs.modal', function() {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        });
      } else {
        alert('お使いのブラウザはカメラへのアクセスをサポートしていません。');
      }
    });
  }
  
  // 保存ボタンのクリックイベント
  saveButton.addEventListener('click', function() {
    console.log('証明写真保存ボタンがクリックされました');
    
    const profile = loadGuideProfile();
    if (!profile) {
      console.error('プロフィールデータが読み込めませんでした');
      showError('プロフィールデータが読み込めません。再度お試しください。');
      return;
    }
    
    if (!preview.src || preview.src.indexOf('placeholder') > -1) {
      alert('証明写真がアップロードされていません。まずは写真を選択またはカメラで撮影してください。');
      return;
    }
    
    // ユーザー情報の更新
    try {
      // 実際の実装ではFirebaseなどにアップロードしてURLを取得する
      // ここではクライアント側のData URIを直接保存（本番環境では推奨されません）
      const certificationPhotoUrl = preview.src;
      
      setCurrentUser({
        ...getCurrentUser(),
        certificationPhotoUrl: certificationPhotoUrl
      });
      
      // 画面の更新
      const certPhoto = document.getElementById('guide-certification-photo');
      if (certPhoto) {
        certPhoto.src = certificationPhotoUrl;
      }
      
      console.log('証明写真を更新しました');
      
      // モーダルを閉じる
      try {
        const modal = bootstrap.Modal.getInstance(document.getElementById('certPhotoEditModal'));
        if (modal) {
          modal.hide();
        }
      } catch (error) {
        console.error('モーダルを閉じる際にエラーが発生しました:', error);
      }
      
      // 成功メッセージ表示
      showSuccess('証明写真が更新されました');
    } catch (error) {
      console.error('証明写真の更新中にエラーが発生しました:', error);
      showError('証明写真の更新に失敗しました。再度お試しください。');
    }
  });
}

/**
 * 自己紹介編集機能の設定
 */
function setupBioEditFunctions() {
  const saveButton = document.getElementById('save-bio');
  const bioText = document.getElementById('bio-edit-text');
  
  if (!saveButton || !bioText) {
    console.warn('自己紹介編集に必要な要素が見つかりません');
    return;
  }
  
  saveButton.addEventListener('click', () => {
    const profile = loadGuideProfile();
    if (!profile) return;
    
    // ユーザー情報の更新
    setCurrentUser({...getCurrentUser(), bio: bioText.value});
    
    // 画面の更新
    const guideBio = document.getElementById('guide-bio');
    if (guideBio) {
      guideBio.textContent = bioText.value;
    }
    
    // モーダルを閉じる
    try {
      const modal = bootstrap.Modal.getInstance(document.getElementById('bioEditModal'));
      if (modal) {
        modal.hide();
      }
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
    
    // 成功メッセージ表示
    showSuccess('自己紹介が更新されました');
  });
}

/**
 * スキルと専門分野編集機能の設定
 */
function setupSpecialtiesEditFunctions() {
  const saveButton = document.getElementById('save-specialties');
  const languagesSelect = document.getElementById('languages-edit');
  
  if (!saveButton || !languagesSelect) {
    console.warn('スキルと専門分野編集に必要な要素が見つかりません');
    return;
  }
  
  saveButton.addEventListener('click', () => {
    const profile = loadGuideProfile();
    if (!profile) return;
    
    // 言語の取得
    const selectedLanguages = Array.from(languagesSelect.selectedOptions).map(option => option.value);
    
    // 専門分野の取得
    const specialtyCheckboxes = document.querySelectorAll('.specialty-checkbox:checked');
    const selectedSpecialties = Array.from(specialtyCheckboxes).map(checkbox => checkbox.value);
    
    // ユーザー情報の更新（データ同期システム使用）
    const updateData = {
      languages: selectedLanguages,
      specialties: selectedSpecialties
    };
    
    if (window.guideDataSync && typeof window.guideDataSync.updateGuideProfile === 'function') {
      window.guideDataSync.updateGuideProfile(updateData);
    } else {
      // フォールバック: 従来のsetCurrentUser関数を使用
      setCurrentUser({
        ...getCurrentUser(), 
        ...updateData
      });
    }
    
    // 画面の更新
    updateLanguagesDisplay(selectedLanguages);
    updateSpecialtiesDisplay(selectedSpecialties);
    
    // モーダルを閉じる
    try {
      const modal = bootstrap.Modal.getInstance(document.getElementById('specialtiesEditModal'));
      if (modal) {
        modal.hide();
      }
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
    
    // 成功メッセージ表示
    showSuccess('スキルと専門分野が更新されました');
  });
}

/**
 * 言語表示を更新
 * @param {Array} languages 言語コード配列
 */
function updateLanguagesDisplay(languages) {
  if (!languages || !Array.isArray(languages)) {
    console.warn('有効な言語配列がありません');
    return;
  }
  
  const languagesContainer = document.getElementById('guide-languages');
  if (!languagesContainer) {
    console.warn('言語表示コンテナが見つかりません');
    return;
  }
  
  try {
    languagesContainer.innerHTML = '';
    
    if (languages.length === 0) {
      const placeholder = document.createElement('span');
      placeholder.className = 'text-muted small';
      placeholder.textContent = '言語が選択されていません';
      languagesContainer.appendChild(placeholder);
      return;
    }
    
    languages.forEach(langCode => {
      const badge = document.createElement('span');
      badge.className = 'badge bg-info badge-language';
      badge.textContent = translateLanguage(langCode);
      languagesContainer.appendChild(badge);
    });
  } catch (error) {
    console.error('言語表示の更新中にエラーが発生しました:', error);
  }
}

/**
 * 専門分野表示を更新
 * @param {Array} specialties 専門分野配列
 */
function updateSpecialtiesDisplay(specialties) {
  if (!specialties || !Array.isArray(specialties)) {
    console.warn('有効な専門分野配列がありません');
    return;
  }
  
  const specialtiesContainer = document.getElementById('guide-specialties');
  if (!specialtiesContainer) {
    console.warn('専門分野表示コンテナが見つかりません');
    return;
  }
  
  try {
    specialtiesContainer.innerHTML = '';
    
    if (specialties.length === 0) {
      const placeholder = document.createElement('span');
      placeholder.className = 'text-muted small';
      placeholder.textContent = '専門分野が選択されていません';
      specialtiesContainer.appendChild(placeholder);
      return;
    }
    
    specialties.forEach(specialtyCode => {
      const badge = document.createElement('span');
      badge.className = 'badge bg-secondary badge-specialty';
      badge.textContent = translateSpecialty(specialtyCode);
      specialtiesContainer.appendChild(badge);
    });
  } catch (error) {
    console.error('専門分野表示の更新中にエラーが発生しました:', error);
  }
}

/**
 * 料金情報編集機能の設定
 */
function setupFeeEditFunctions() {
  const saveButton = document.getElementById('save-fees');
  const baseFeeInput = document.getElementById('base-fee-edit');
  const hourlyFeeInput = document.getElementById('hourly-fee-edit');
  
  if (!saveButton || !baseFeeInput || !hourlyFeeInput) {
    console.warn('料金情報編集に必要な要素が見つかりません');
    return;
  }
  
  saveButton.addEventListener('click', () => {
    const profile = loadGuideProfile();
    if (!profile) return;
    
    const baseFee = parseInt(baseFeeInput.value);
    const hourlyFee = parseInt(hourlyFeeInput.value);
    
    // 値のバリデーション
    if (baseFee < 6000) {
      alert('基本料金は最低6,000円以上に設定してください');
      return;
    }
    
    if (hourlyFee < 3000) {
      alert('時間単価は最低3,000円以上に設定してください');
      return;
    }
    
    // ユーザー情報の更新（データ同期システム使用）
    const updateData = {
      baseFee: baseFee,
      hourlyFee: hourlyFee,
      price: baseFee // 基本料金をpriceフィールドにも設定
    };
    
    if (window.guideDataSync && typeof window.guideDataSync.updateGuideProfile === 'function') {
      window.guideDataSync.updateGuideProfile(updateData);
    } else {
      // フォールバック: 従来のsetCurrentUser関数を使用
      setCurrentUser({
        ...getCurrentUser(), 
        ...updateData
      });
    }
    
    // 画面の更新
    const baseFeeDisplay = document.getElementById('guide-base-fee');
    const hourlyFeeDisplay = document.getElementById('guide-hourly-fee');
    
    if (baseFeeDisplay) {
      baseFeeDisplay.textContent = `¥${baseFee.toLocaleString()}`;
    }
    
    if (hourlyFeeDisplay) {
      hourlyFeeDisplay.textContent = `¥${hourlyFee.toLocaleString()}`;
    }
    
    // モーダルを閉じる
    try {
      const modal = bootstrap.Modal.getInstance(document.getElementById('feeEditModal'));
      if (modal) {
        modal.hide();
      }
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
    
    // 成功メッセージ表示
    showSuccess('料金情報が更新されました');
  });
}

/**
 * ガイド一覧への遷移機能の設定
 */
function setupGuideListRedirect() {
  const saveAndViewButton = document.getElementById('save-and-view-guide-list');
  const profileForm = document.getElementById('profile-basic-form');
  
  console.log('setupGuideListRedirect実行中...');
  console.log('ボタン要素:', saveAndViewButton);
  
  if (!saveAndViewButton) {
    console.warn('ガイド一覧遷移ボタンが見つかりません');
    // DOMが完全に読み込まれてから再試行
    setTimeout(() => {
      const retryButton = document.getElementById('save-and-view-guide-list');
      if (retryButton) {
        console.log('再試行でボタンを発見、イベントを設定します');
        setupButtonEvent(retryButton);
      }
    }, 1000);
    return;
  }
  
  setupButtonEvent(saveAndViewButton);
}

/**
 * ボタンイベントを設定する共通関数
 */
function setupButtonEvent(button) {
  console.log('ボタンイベントを設定中:', button);
  
  // 「保存してガイド一覧を見る」ボタンのクリックイベント
  button.addEventListener('click', function(event) {
    event.preventDefault();
    console.log('保存してガイド一覧を見るボタンがクリックされました');
    
    // ユーザータイプを確認
    const currentUser = getCurrentUser();
    const userType = sessionStorage.getItem('userType');
    const isGuide = (currentUser && (currentUser.userType === 'guide' || currentUser.type === 'guide')) || userType === 'guide';
    
    console.log('ユーザー確認:', { currentUser, userType, isGuide });
    
    if (!isGuide) {
      console.log('ガイドではないためアクセス拒否');
      showUserTypeError('ガイド専用機能です', 'この機能はガイドアカウント専用です。ガイドとして登録・ログインしてからご利用ください。');
      return;
    }
    
    console.log('ガイドとして認証済み、保存処理を開始します');
    
    // プロフィール情報を保存
    const guideName = document.getElementById('guide-name')?.value || currentUser?.name || '新規ガイド';
    const guideUsername = document.getElementById('guide-username')?.value || currentUser?.username || 'new_guide';
    const guideLocation = document.getElementById('guide-location')?.value || currentUser?.city || '東京';
    const sessionFee = document.getElementById('guide-session-fee')?.value || '6000';
    const guideBio = document.getElementById('guide-bio')?.value || '新規登録ガイドです。よろしくお願いします。';
    
    // 保存処理開始
    button.textContent = '保存中...';
    button.disabled = true;
    
    console.log('プロフィールデータ取得中...');
    
    // ガイドデータを作成・更新
    const guideData = {
      id: currentUser?.id || Date.now().toString(),
      name: guideName,
      username: guideUsername,
      location: guideLocation,
      city: guideLocation,
      bio: guideBio,
      description: guideBio,
      fee: parseInt(sessionFee.replace(/[^\d]/g, '')) || 6000,
      price: parseInt(sessionFee.replace(/[^\d]/g, '')) || 6000,
      rating: '新規',
      reviews: '0',
      imageUrl: currentUser?.profileImage || 'https://placehold.co/400x300/e3f2fd/1976d2/png?text=Guide',
      specialties: getSelectedSpecialties() || ['観光案内'],
      keywords: getSelectedSpecialties() || ['観光案内'],
      languages: currentUser?.languages || ['日本語'],
      phone: currentUser?.phone,
      email: currentUser?.email,
      userType: 'guide',
      type: 'guide',
      isNewGuide: true
    };
    
    console.log('作成されたガイドデータ:', guideData);
    
    // データ同期システムを使用してデータを保存
    if (window.guideDataSync && typeof window.guideDataSync.saveGuideData === 'function') {
      window.guideDataSync.saveGuideData(guideData);
      console.log('データ同期システムでガイドデータを保存しました');
    }
    
    // ガイドリストに追加（従来方式も併用）
    addNewGuideToList(guideData);
    
    // セッションストレージも更新
    const updatedUser = { ...currentUser, ...guideData };
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    sessionStorage.setItem(`guide_${guideData.id}`, JSON.stringify(guideData));
    
    console.log('ガイドデータの保存が完了しました');
    
    // ボタンを元に戻す
    button.textContent = '保存してガイド一覧を見る';
    button.disabled = false;
      
    // 成功メッセージを表示
    showSuccess('プロフィールが保存されました！ガイド一覧ページに移動します。');
    
    console.log('ガイド一覧ページに移動します...');
    
    // ガイド一覧ページに遷移
    setTimeout(() => {
      try {
        console.log('現在のURL:', window.location.href);
        console.log('ページ遷移を実行中...');
        
        // index.htmlに移動（ガイドセクションに直接移動）
        window.location.href = './index.html#guides';
        
        // 念のため少し遅延を入れて再度確認
        setTimeout(() => {
          if (window.location.pathname.includes('guide-profile')) {
            console.log('最初の遷移が失敗、再試行中...');
            window.location.replace('./index.html#guides');
          }
        }, 500);
        
      } catch (error) {
        console.error('ページ遷移でエラーが発生しました:', error);
        alert('ガイド一覧ページへの自動移動に失敗しました。手動でトップページに戻ってください。');
      }
    }, 1000);
  });
  
  // 通常の保存ボタンにも遷移オプションを追加
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 確認ダイアログを表示
      const shouldRedirect = confirm('プロフィールを保存しました。ガイド一覧ページを確認しますか？');
      if (shouldRedirect) {
        window.location.href = 'index.html#guides';
      }
    });
  }
}

/**
 * 選択された専門分野を取得
 */
function getSelectedSpecialties() {
  const specialties = [];
  const checkboxes = document.querySelectorAll('#guide-interests input[type="checkbox"]:checked');
  checkboxes.forEach(checkbox => {
    specialties.push(checkbox.value);
  });
  
  // カスタムキーワードも追加
  const customKeywords = document.getElementById('interest-custom')?.value;
  if (customKeywords) {
    const keywords = customKeywords.split(',').map(k => k.trim()).filter(k => k);
    specialties.push(...keywords);
  }
  
  return specialties;
}

/**
 * 新しいガイドをガイドリストに追加
 */
function addNewGuideToList(guideData) {
  // ローカルストレージに保存
  let guideList = JSON.parse(localStorage.getItem('additionalGuides') || '[]');
  guideList.push(guideData);
  localStorage.setItem('additionalGuides', JSON.stringify(guideList));
  
  console.log('新しいガイドが追加されました:', guideData);
}

/**
 * 基本情報編集機能の設定
 */
function setupBasicInfoEditFunctions() {
  const saveButton = document.getElementById('save-basic-info');
  
  if (!saveButton) {
    console.warn('基本情報編集に必要な要素が見つかりません');
    return;
  }
  
  saveButton.addEventListener('click', () => {
    const profile = loadGuideProfile();
    if (!profile) return;
    
    // フォームデータの取得
    const username = document.getElementById('username-edit')?.value;
    const email = document.getElementById('email-edit')?.value;
    const phone = document.getElementById('phone-edit')?.value;
    const firstName = document.getElementById('firstName-edit')?.value;
    const lastName = document.getElementById('lastName-edit')?.value;
    const city = document.getElementById('city-edit')?.value;
    const gender = document.querySelector('input[name="gender-edit"]:checked')?.value;
    const ageGroup = document.getElementById('age-group-edit')?.value;
    
    // バリデーション（簡易版）
    if (!username || !email || !phone || !firstName || !lastName || !city) {
      alert('すべての必須項目を入力してください');
      return;
    }
    
    // ユーザー情報の更新
    setCurrentUser({
      ...getCurrentUser(),
      username,
      email,
      phone,
      firstName,
      lastName,
      city,
      gender,
      ageGroup
    });
    
    // 画面の更新
    const fullNameDisplay = document.getElementById('guide-fullname');
    const locationDisplay = document.getElementById('guide-location');
    const usernameDisplay = document.getElementById('guide-username');
    const emailDisplay = document.getElementById('guide-email');
    const phoneDisplay = document.getElementById('guide-phone');
    const genderDisplay = document.getElementById('guide-gender');
    const ageGroupDisplay = document.getElementById('guide-age-group');
    
    if (fullNameDisplay) fullNameDisplay.textContent = `${lastName} ${firstName}`;
    if (locationDisplay) locationDisplay.textContent = city;
    if (usernameDisplay) usernameDisplay.textContent = username;
    if (emailDisplay) emailDisplay.textContent = email;
    if (phoneDisplay) phoneDisplay.textContent = phone;
    if (genderDisplay) genderDisplay.textContent = translateGender(gender);
    if (ageGroupDisplay) ageGroupDisplay.textContent = translateAgeGroup(ageGroup);
    
    // モーダルを閉じる
    try {
      const modal = bootstrap.Modal.getInstance(document.getElementById('basicInfoEditModal'));
      if (modal) {
        modal.hide();
      }
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
    
    // 成功メッセージ表示
    showSuccess('基本情報が更新されました');
  });
}

/**
 * 身分証明書編集機能の設定
 */
function setupIdDocumentEditFunctions() {
  const documentTypeSelect = document.getElementById('document-type-edit');
  const saveButton = document.getElementById('save-id-documents');
  
  if (!documentTypeSelect || !saveButton) {
    console.warn('身分証明書編集に必要な要素が見つかりません');
    return;
  }
  
  // 書類タイプに応じてセクションを表示
  documentTypeSelect.addEventListener('change', function() {
    const sections = document.querySelectorAll('.document-upload-section');
    sections.forEach(section => section.classList.add('d-none'));
    
    const selectedType = this.value;
    const targetSection = document.getElementById(`${selectedType}-section`);
    if (targetSection) {
      targetSection.classList.remove('d-none');
    }
  });
  
  // 書類アップロード用のファイル選択ボタンを設定
  setupDocumentFileButtons();
  
  saveButton.addEventListener('click', () => {
    const profile = loadGuideProfile();
    if (!profile) return;
    
    const documentType = documentTypeSelect.value;
    
    // 実際の実装ではFirebaseなどへファイルをアップロード
    // 簡略化のためプレースホルダー画像で代用
    
    const documentUrls = {};
    
    if (documentType === 'passport') {
      documentUrls.passport = 'https://placehold.co/120x80?text=Passport';
    } else if (documentType === 'driverLicense') {
      documentUrls.driverLicenseFront = 'https://placehold.co/120x80?text=License_F';
      documentUrls.driverLicenseBack = 'https://placehold.co/120x80?text=License_B';
    } else if (documentType === 'idCard') {
      documentUrls.idCardFront = 'https://placehold.co/120x80?text=ID_F';
      documentUrls.idCardBack = 'https://placehold.co/120x80?text=ID_B';
    } else if (documentType === 'residentCard') {
      documentUrls.residentCardFront = 'https://placehold.co/120x80?text=Res_F';
      documentUrls.residentCardBack = 'https://placehold.co/120x80?text=Res_B';
    }
    
    // ユーザー情報の更新
    setCurrentUser({
      ...getCurrentUser(),
      documentType,
      documentUrls
    });
    
    // 画面の更新
    const documentTypeDisplay = document.getElementById('document-type-display');
    if (documentTypeDisplay) {
      documentTypeDisplay.textContent = translateDocumentType(documentType);
    }
    
    // 書類プレビュー更新
    const documentContainer = document.getElementById('guide-id-documents');
    if (!documentContainer) return;
    
    const documentPreviewDiv = documentContainer.querySelector('.d-flex');
    if (!documentPreviewDiv) return;
    
    // 既存のプレビューをクリア
    documentPreviewDiv.innerHTML = '';
    
    if (documentType === 'passport') {
      const img = document.createElement('img');
      img.src = documentUrls.passport;
      img.alt = 'パスポート';
      img.className = 'document-preview';
      documentPreviewDiv.appendChild(img);
    } else {
      const frontKey = `${documentType}Front`;
      const backKey = `${documentType}Back`;
      
      const frontImg = document.createElement('img');
      frontImg.src = documentUrls[frontKey];
      frontImg.alt = '書類表面';
      frontImg.className = 'document-preview';
      documentPreviewDiv.appendChild(frontImg);
      
      const backImg = document.createElement('img');
      backImg.src = documentUrls[backKey];
      backImg.alt = '書類裏面';
      backImg.className = 'document-preview';
      documentPreviewDiv.appendChild(backImg);
    }
    
    // モーダルを閉じる
    try {
      const modal = bootstrap.Modal.getInstance(document.getElementById('idDocumentEditModal'));
      if (modal) {
        modal.hide();
      }
    } catch (error) {
      console.error('モーダルを閉じる際にエラーが発生しました:', error);
    }
    
    // 成功メッセージ表示
    showSuccess('身分証明書が更新されました');
  });
}

/**
 * 書類アップロード用のファイル選択ボタンを設定
 */
function setupDocumentFileButtons() {
  setupFileButton('passport', 'select', 'camera', 'file', 'preview', 'remove');
  setupFileButton('driverLicense-front', 'select', 'camera', 'file', 'preview', 'remove');
  setupFileButton('driverLicense-back', 'select', 'camera', 'file', 'preview', 'remove');
  setupFileButton('idCard-front', 'select', 'camera', 'file', 'preview', 'remove');
  setupFileButton('idCard-back', 'select', 'camera', 'file', 'preview', 'remove');
  setupFileButton('residentCard-front', 'select', 'camera', 'file', 'preview', 'remove');
  setupFileButton('residentCard-back', 'select', 'camera', 'file', 'preview', 'remove');
}

/**
 * ファイル選択ボタンの設定
 * @param {string} prefix 要素IDのプレフィックス
 * @param {string} selectId 選択ボタンのID接尾辞
 * @param {string} cameraId カメラボタンのID接尾辞
 * @param {string} fileId ファイル入力のID接尾辞
 * @param {string} previewId プレビュー要素のID接尾辞
 * @param {string} removeId 削除ボタンのID接尾辞
 */
function setupFileButton(prefix, selectId, cameraId, fileId, previewId, removeId) {
  console.log(`ファイル選択ボタンのセットアップを開始: ${prefix}`);
  
  // 要素の取得
  const selectButton = document.getElementById(`${prefix}-${selectId}`);
  const cameraButton = document.getElementById(`${prefix}-${cameraId}`);
  const fileInput = document.getElementById(`${prefix}-${fileId}`);
  const previewContainer = document.getElementById(`${prefix}-${previewId}`);
  const removeButton = document.getElementById(`${prefix}-${removeId}`);
  
  // 要素の検証
  if (!selectButton) {
    console.error(`選択ボタンが見つかりません: ${prefix}-${selectId}`);
  }
  
  if (!fileInput) {
    console.error(`ファイル入力が見つかりません: ${prefix}-${fileId}`);
  }
  
  if (!previewContainer) {
    console.error(`プレビューコンテナが見つかりません: ${prefix}-${previewId}`);
  }
  
  // 必須要素がなければ処理を中断
  if (!selectButton || !fileInput || !previewContainer) {
    console.warn(`必須要素が見つからないため、${prefix}のファイル選択機能を設定できません`);
    return;
  }
  
  // ファイル選択ボタンのクリックイベント
  selectButton.addEventListener('click', function() {
    console.log(`ファイル選択ボタンがクリックされました: ${prefix}`);
    fileInput.click();
  });
  
  // ファイル入力の変更イベント
  fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log(`ファイルが選択されました: ${file.name} (${file.type}, ${file.size} bytes)`);
      
      // 画像ファイルか確認
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください（JPG, PNG, GIF）');
        return;
      }
      
      // ファイルサイズの確認（5MB以下）
      if (file.size > 5 * 1024 * 1024) {
        alert('ファイルサイズが大きすぎます。5MB以下の画像を選択してください。');
        return;
      }
      
      // FileReaderでファイルを読み込む
      const reader = new FileReader();
      
      reader.onload = function(e) {
        console.log(`ファイル読み込み完了: ${prefix}`);
        
        // プレビュー要素を取得または作成
        let previewImg = previewContainer.querySelector('img');
        if (!previewImg) {
          previewImg = document.createElement('img');
          previewImg.className = 'img-thumbnail';
          previewImg.style.maxHeight = '150px';
          previewContainer.appendChild(previewImg);
        }
        
        // プレビュー画像を設定
        previewImg.src = e.target.result;
        previewContainer.classList.remove('d-none');
        
        // 削除ボタンを表示
        if (removeButton) {
          removeButton.classList.remove('d-none');
        }
      };
      
      reader.onerror = function() {
        console.error(`ファイル読み込みエラー: ${prefix}`);
        alert('ファイルの読み込みに失敗しました。別のファイルを試してください。');
      };
      
      reader.readAsDataURL(file);
    }
  });
  
  // カメラボタンのイベント
  if (cameraButton) {
    cameraButton.addEventListener('click', function() {
      console.log(`カメラボタンがクリックされました: ${prefix}`);
      
      // ブラウザがカメラをサポートしているか確認
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // カメラモーダルを作成
        const cameraModalId = `${prefix}-camera-modal`;
        let modalHtml = `
          <div class="modal fade" id="${cameraModalId}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">カメラで撮影</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                  <video id="${prefix}-video" style="width: 100%; max-width: 400px;" autoplay></video>
                  <canvas id="${prefix}-canvas" style="display: none;"></canvas>
                  <div class="mt-3">
                    <button id="${prefix}-capture" class="btn btn-primary">撮影する</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // 既存のモーダルを削除
        const existingModal = document.getElementById(cameraModalId);
        if (existingModal) {
          existingModal.remove();
        }
        
        // モーダルをDOMに追加
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // モーダルを表示
        const cameraModal = new bootstrap.Modal(document.getElementById(cameraModalId));
        cameraModal.show();
        
        // カメラへのアクセスを開始
        const video = document.getElementById(`${prefix}-video`);
        const canvas = document.getElementById(`${prefix}-canvas`);
        const captureButton = document.getElementById(`${prefix}-capture`);
        let stream = null;
        
        // カメラへのアクセスリクエスト
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function(mediaStream) {
            stream = mediaStream;
            video.srcObject = mediaStream;
            video.onloadedmetadata = function() {
              video.play();
            };
          })
          .catch(function(err) {
            console.error('カメラアクセスエラー:', err);
            alert('カメラへのアクセスができませんでした。設定を確認してください。');
            cameraModal.hide();
          });
        
        // 撮影ボタンのイベント
        captureButton.addEventListener('click', function() {
          // キャンバスを設定
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // 映像をキャンバスに描画
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // 画像データを取得
          const imageData = canvas.toDataURL('image/png');
          
          // プレビュー要素を取得または作成
          let previewImg = previewContainer.querySelector('img');
          if (!previewImg) {
            previewImg = document.createElement('img');
            previewImg.className = 'img-thumbnail';
            previewImg.style.maxHeight = '150px';
            previewContainer.appendChild(previewImg);
          }
          
          // プレビュー画像を設定
          previewImg.src = imageData;
          previewContainer.classList.remove('d-none');
          
          // 削除ボタンを表示
          if (removeButton) {
            removeButton.classList.remove('d-none');
          }
          
          // カメラの停止
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          // モーダルを閉じる
          cameraModal.hide();
        });
        
        // モーダルが閉じられたときの処理
        document.getElementById(cameraModalId).addEventListener('hidden.bs.modal', function() {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        });
      } else {
        alert('お使いのブラウザはカメラ機能をサポートしていません。');
      }
    });
  }
  
  // 削除ボタンのイベント
  if (removeButton) {
    removeButton.addEventListener('click', function() {
      console.log(`削除ボタンがクリックされました: ${prefix}`);
      
      // ファイル入力をリセット
      fileInput.value = '';
      
      // プレビュー要素を非表示
      const previewImg = previewContainer.querySelector('img');
      if (previewImg) {
        previewImg.src = '';
      }
      
      previewContainer.classList.add('d-none');
      removeButton.classList.add('d-none');
    });
  }
  
  console.log(`ファイル選択ボタンのセットアップ完了: ${prefix}`);
}

/**
 * 性別コードを表示用テキストに変換
 * @param {string} genderCode 性別コード
 * @returns {string} 表示用テキスト
 */
function translateGender(genderCode) {
  const genderMap = {
    'male': '男性',
    'female': '女性',
    'other': 'その他',
    'prefer_not_to_say': '回答しない'
  };
  return genderMap[genderCode] || '未設定';
}

/**
 * 年齢層コードを表示用テキストに変換
 * @param {string} ageGroupCode 年齢層コード
 * @returns {string} 表示用テキスト
 */
function translateAgeGroup(ageGroupCode) {
  const ageGroupMap = {
    '18-25': '18-25歳',
    '26-35': '26-35歳',
    '36-45': '36-45歳',
    '46-55': '46-55歳',
    '56-65': '56-65歳',
    'over-65': '65歳以上'
  };
  return ageGroupMap[ageGroupCode] || '未設定';
}

/**
 * 言語コードを表示用テキストに変換
 * @param {string} langCode 言語コード
 * @returns {string} 表示用テキスト
 */
function translateLanguage(langCode) {
  const langMap = {
    'ja': '日本語',
    'en': '英語',
    'zh': '中国語',
    'ko': '韓国語',
    'es': 'スペイン語',
    'fr': 'フランス語',
    'de': 'ドイツ語',
    'it': 'イタリア語',
    'ru': 'ロシア語',
    'pt': 'ポルトガル語',
    'th': 'タイ語',
    'vi': 'ベトナム語'
  };
  return langMap[langCode] || langCode;
}

/**
 * 専門分野コードを表示用テキストに変換
 * @param {string} specialtyCode 専門分野コード
 * @returns {string} 表示用テキスト
 */
function translateSpecialty(specialtyCode) {
  const specialtyMap = {
    'history': '歴史・文化',
    'nature': '自然・アウトドア',
    'food': '食文化・グルメ',
    'art': '芸術・工芸',
    'shopping': 'ショッピング',
    'nightlife': 'ナイトライフ',
    'photography': '写真スポット',
    'local': '地元密着体験'
  };
  return specialtyMap[specialtyCode] || specialtyCode;
}

/**
 * 書類タイプコードを表示用テキストに変換
 * @param {string} documentTypeCode 書類タイプコード
 * @returns {string} 表示用テキスト
 */
function translateDocumentType(documentTypeCode) {
  const documentTypeMap = {
    'passport': 'パスポート',
    'driverLicense': '運転免許証',
    'idCard': 'マイナンバーカード/運転経歴証明書',
    'residentCard': '在留カード'
  };
  return documentTypeMap[documentTypeCode] || '未設定';
}

/**
 * 現在のログインユーザー情報を取得
 * @returns {Object|null} ユーザー情報
 */
function getCurrentUser() {
  try {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error('ユーザー情報の取得エラー:', e);
    return null;
  }
}

/**
 * ユーザー情報を保存
 * @param {Object} user ユーザー情報
 */
function setCurrentUser(user) {
  try {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  } catch (e) {
    console.error('ユーザー情報の保存エラー:', e);
  }
}

/**
 * エラーメッセージを表示
 * @param {string} message エラーメッセージ
 */
function showError(message) {
  // Bootstrap Toastを使用
  const toastContainer = document.createElement('div');
  toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
  toastContainer.style.zIndex = '5';
  
  toastContainer.innerHTML = `
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-danger text-white">
        <strong class="me-auto">エラー</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  
  document.body.appendChild(toastContainer);
  const toastEl = toastContainer.querySelector('.toast');
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
  
  // トースト消去後にコンテナを削除
  toastEl.addEventListener('hidden.bs.toast', () => {
    document.body.removeChild(toastContainer);
  });
}

/**
 * 成功メッセージを表示
 * @param {string} message 成功メッセージ
 */
function showSuccess(message) {
  // Bootstrap Toastを使用
  const toastContainer = document.createElement('div');
  toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
  toastContainer.style.zIndex = '5';
  
  toastContainer.innerHTML = `
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">成功</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  
  document.body.appendChild(toastContainer);
  const toastEl = toastContainer.querySelector('.toast');
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
  
  // トースト消去後にコンテナを削除
  toastEl.addEventListener('hidden.bs.toast', () => {
    document.body.removeChild(toastContainer);
  });
}

/**
 * ガイドプロフィール初期化
 */
function initGuideProfile() {
  console.log('ガイドプロフィール初期化を開始...');
  
  // 各種イベントリスナーを設定
  document.addEventListener('DOMContentLoaded', function() {
    // 要素の存在確認用ヘルパー関数
    function checkElement(id) {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`要素 ${id} が見つかりません`);
      }
      return !!element;
    }
    
    // 各種編集機能の設定
    console.log('各種編集機能を設定します');
    setupPhotoEditFunctions();      // プロフィール写真（無効化済み）
    setupCertPhotoEditFunctions();  // 証明写真
    setupBioEditFunctions();        // 自己紹介
    setupSpecialtiesEditFunctions(); // 専門分野
    setupFeeEditFunctions();        // 料金設定
    setupBasicInfoEditFunctions();  // 基本情報
    setupIdDocumentEditFunctions(); // 身分証明書
    
    // ヘッダーの読み込み
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
      fetch('header.html')
        .then(response => response.text())
        .then(data => {
          headerContainer.innerHTML = data;
          console.log('ヘッダーを読み込みました');
        })
        .catch(error => {
          console.error('ヘッダー読み込みエラー:', error);
        });
    }
  });
  
  // 新規登録からの遷移かどうかをチェック
  const isNewRegistration = sessionStorage.getItem('guideRegistrationCompleted') === 'true';
  if (isNewRegistration) {
    console.log('新規登録からの遷移を検出しました');
    
    // 一度使ったらフラグをクリア
    sessionStorage.removeItem('guideRegistrationCompleted');
    
    // 現在のユーザー情報を確認
    const userData = getCurrentUser();
    console.log('現在のユーザーデータ:', userData);

    // 通知を表示
    showSuccess('ガイドプロフィールへようこそ！ここでプロフィール情報を編集できます。');
    
    // 少し遅らせてメッセージを表示
    setTimeout(() => {
      const welcomeAlert = document.createElement('div');
      welcomeAlert.className = 'alert alert-success alert-dismissible fade show';
      welcomeAlert.innerHTML = `
        <h4><i class="bi bi-check-circle"></i> 登録が完了しました！</h4>
        <p>ガイドプロフィールページへようこそ。このページでは、あなたのプロフィール情報を編集できます。</p>
        <p>まずは、<strong>証明写真</strong>のアップロードや<strong>自己紹介文</strong>の記入から始めましょう。</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      
      // ページの先頭に挿入
      const container = document.querySelector('.container');
      if (container && container.parentNode) {
        container.parentNode.insertBefore(welcomeAlert, container);
      } else {
        document.body.insertBefore(welcomeAlert, document.body.firstChild);
      }
    }, 1000);
  }
  
  // ユーザープロフィールを取得
  const profile = loadGuideProfile();
  
  if (profile) {
    console.log('ガイドプロフィールデータを取得しました:', profile.username || '未設定');
    try {
      // プロフィール情報を画面に表示
      displayGuideProfile(profile);
      
      // フォームの初期値を設定
      initializeEditForms(profile);
      
      console.log('プロフィール表示が完了しました');
    } catch (error) {
      console.error('プロフィール表示中にエラーが発生しました:', error);
      
      // エラーメッセージを表示
      const errorAlert = document.createElement('div');
      errorAlert.className = 'alert alert-danger m-3';
      errorAlert.innerHTML = `
        <h4>プロフィールの読み込みに問題が発生しました</h4>
        <p>ブラウザを更新するか、メインページに戻ってからもう一度お試しください。</p>
        <a href="index.html" class="btn btn-outline-secondary mt-2">メインページに戻る</a>
      `;
      
      // ページの先頭に挿入
      const container = document.querySelector('.container');
      if (container && container.parentNode) {
        container.parentNode.insertBefore(errorAlert, container);
      } else {
        document.body.insertBefore(errorAlert, document.body.firstChild);
      }
    }
  } else {
    console.error('ガイドプロフィールデータが見つかりません');
    
    // エラーメッセージを表示
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-warning m-3';
    errorAlert.innerHTML = `
      <h4>プロフィール情報が見つかりません</h4>
      <p>ログインしていない、または新規登録が必要な可能性があります。</p>
      <a href="index.html" class="btn btn-primary mt-2">メインページに戻る</a>
    `;
    
    // ページに挿入
    document.body.insertBefore(errorAlert, document.body.firstChild);
  }
  
  // 開発用：デバッグ情報
  console.log('セッションストレージ内容:', Object.keys(sessionStorage));
  try {
    console.log('現在のユーザー:', getCurrentUser());
  } catch (e) {
    console.error('ユーザーデータ取得エラー:', e);
  }
}

/**
 * ユーザータイプエラーメッセージを表示
 * @param {string} title エラータイトル
 * @param {string} message エラーメッセージ
 */
function showUserTypeError(title, message) {
  // モーダルを作成
  const modalHtml = `
    <div class="modal fade" id="userTypeErrorModal" tabindex="-1" aria-labelledby="userTypeErrorModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-warning">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title" id="userTypeErrorModalLabel">
              <i class="bi bi-exclamation-triangle me-2"></i>${title}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">${message}</p>
            <div class="alert alert-info">
              <small><strong>現在のユーザータイプ:</strong> ${getUserTypeDisplay()}</small>
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <a href="bootstrap_solution.html" class="btn btn-primary">
                <i class="bi bi-person-plus me-1"></i>ガイド登録
              </a>
              <button type="button" class="btn btn-outline-primary" onclick="showLoginOptions()">
                <i class="bi bi-box-arrow-in-right me-1"></i>ログイン
              </button>
              <a href="index.html" class="btn btn-outline-secondary">
                <i class="bi bi-house me-1"></i>ホームに戻る
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 既存のモーダルを削除
  const existingModal = document.getElementById('userTypeErrorModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // 新しいモーダルを追加
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // モーダルを表示
  const modal = new bootstrap.Modal(document.getElementById('userTypeErrorModal'));
  modal.show();
}

/**
 * 現在のユーザータイプ表示用テキストを取得
 */
function getUserTypeDisplay() {
  const currentUser = getCurrentUser();
  const userType = sessionStorage.getItem('userType');
  
  if (currentUser) {
    if (currentUser.userType === 'guide' || currentUser.type === 'guide' || userType === 'guide') {
      return 'ガイド';
    } else if (currentUser.userType === 'tourist' || currentUser.type === 'tourist' || userType === 'tourist') {
      return '観光客';
    }
  }
  
  return '未ログイン';
}

/**
 * ログインオプションを表示
 */
function showLoginOptions() {
  // userTypeErrorModal を非表示にしてから新しいモーダルを表示
  const currentModal = bootstrap.Modal.getInstance(document.getElementById('userTypeErrorModal'));
  if (currentModal) {
    currentModal.hide();
  }
  
  setTimeout(() => {
    alert('ログイン機能は開発中です。新規登録からガイドアカウントを作成してください。');
  }, 300);
}