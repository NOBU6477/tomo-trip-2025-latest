/**
 * 改良されたガイドプロフィール管理システム
 * 活動エリア、言語選択、自己紹介、追加情報の機能強化
 */
(function() {
  'use strict';

  let currentGuideData = {};

  function initializeEnhancedProfile() {
    setupCharacterCounters();
    setupLocationSelection();
    setupLanguageSelection();
    setupFormSaving();
    setupDataSynchronization();
    loadExistingData();
    
    console.log('Enhanced guide profile system initialized');
  }

  /**
   * 文字カウンター機能の設定
   */
  function setupCharacterCounters() {
    // 自己紹介文字カウンター
    const descriptionField = document.getElementById('guide-description');
    const descriptionCounter = document.getElementById('description-count');
    
    if (descriptionField && descriptionCounter) {
      descriptionField.addEventListener('input', function() {
        const count = this.value.length;
        descriptionCounter.textContent = count;
        
        if (count > 800) {
          descriptionCounter.style.color = '#dc3545';
        } else if (count > 600) {
          descriptionCounter.style.color = '#fd7e14';
        } else {
          descriptionCounter.style.color = '#6c757d';
        }
      });
      
      // 初期表示
      descriptionCounter.textContent = descriptionField.value.length;
    }

    // 追加情報文字カウンター
    const additionalInfoField = document.getElementById('interest-custom');
    const additionalInfoCounter = document.getElementById('additional-info-count');
    
    if (additionalInfoField && additionalInfoCounter) {
      additionalInfoField.addEventListener('input', function() {
        const count = this.value.length;
        additionalInfoCounter.textContent = count;
        
        if (count > 400) {
          additionalInfoCounter.style.color = '#dc3545';
        } else if (count > 300) {
          additionalInfoCounter.style.color = '#fd7e14';
        } else {
          additionalInfoCounter.style.color = '#6c757d';
        }
      });
      
      // 初期表示
      additionalInfoCounter.textContent = additionalInfoField.value.length;
    }
  }

  /**
   * 活動エリア選択機能の設定
   */
  function setupLocationSelection() {
    const locationInputs = document.querySelectorAll('input[name="location"]');
    
    locationInputs.forEach(input => {
      input.addEventListener('change', function() {
        if (this.checked) {
          currentGuideData.location = this.value;
          updateDisplayLocation(this.value);
          console.log('Location selected:', this.value);
        }
      });
    });
  }

  /**
   * 言語選択機能の設定
   */
  function setupLanguageSelection() {
    const languageInputs = document.querySelectorAll('.language-checkbox');
    
    languageInputs.forEach(input => {
      input.addEventListener('change', function() {
        const selectedLanguages = getSelectedLanguages();
        currentGuideData.languages = selectedLanguages;
        updateDisplayLanguages(selectedLanguages);
        console.log('Languages selected:', selectedLanguages);
      });
    });
  }

  /**
   * 選択された言語を取得
   */
  function getSelectedLanguages() {
    const checkedLanguages = document.querySelectorAll('.language-checkbox:checked');
    return Array.from(checkedLanguages).map(input => ({
      value: input.value,
      label: input.nextElementSibling.textContent.trim()
    }));
  }

  /**
   * 表示エリアの場所を更新
   */
  function updateDisplayLocation(location) {
    const displayLocation = document.getElementById('display-location');
    if (displayLocation) {
      displayLocation.textContent = location;
    }
  }

  /**
   * 表示エリアの言語を更新
   */
  function updateDisplayLanguages(languages) {
    const displayLanguages = document.getElementById('display-languages');
    if (displayLanguages && languages.length > 0) {
      displayLanguages.innerHTML = languages.map(lang => 
        `<span class="badge bg-primary me-1">${lang.label}</span>`
      ).join('');
    }
  }

  /**
   * フォーム保存機能の設定
   */
  function setupFormSaving() {
    // 基本情報保存ボタン
    const saveBasicButton = document.getElementById('save-basic-info');
    if (saveBasicButton) {
      saveBasicButton.addEventListener('click', function() {
        saveBasicInfo();
        showSaveMessage('基本情報を保存しました', 'success');
      });
    }

    // 完全保存ボタン
    const form = document.getElementById('profile-basic-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveCompleteProfile();
        showSaveMessage('プロフィールを完全保存しました', 'success');
      });
    }

    // 保存してガイド一覧を見るボタン
    const saveAndViewButton = document.getElementById('save-and-view-guide-list');
    if (saveAndViewButton) {
      saveAndViewButton.addEventListener('click', function() {
        saveCompleteProfile();
        redirectToGuideList();
      });
    }
  }

  /**
   * 基本情報の保存
   */
  function saveBasicInfo() {
    const formData = collectFormData();
    
    // セッションストレージに保存
    sessionStorage.setItem('guideProfileData', JSON.stringify(formData));
    
    // ローカルストレージにも保存（永続化）
    const guideId = getCurrentGuideId();
    const existingProfiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
    existingProfiles[guideId] = formData;
    localStorage.setItem('guideProfiles', JSON.stringify(existingProfiles));
    
    console.log('Basic info saved:', formData);
  }

  /**
   * 完全プロフィールの保存
   */
  function saveCompleteProfile() {
    const formData = collectFormData();
    
    // より詳細なデータ収集
    const completeData = {
      ...formData,
      profilePhoto: getProfilePhotoData(),
      gallery: getGalleryData(),
      lastUpdated: new Date().toISOString()
    };
    
    // 複数の場所に保存
    sessionStorage.setItem('guideProfileData', JSON.stringify(completeData));
    
    const guideId = getCurrentGuideId();
    const existingProfiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
    existingProfiles[guideId] = completeData;
    localStorage.setItem('guideProfiles', JSON.stringify(existingProfiles));
    
    // メインページのガイドデータも更新
    updateMainPageGuideData(completeData);
    
    console.log('Complete profile saved:', completeData);
  }

  /**
   * フォームデータの収集
   */
  function collectFormData() {
    return {
      // 基本情報
      name: document.getElementById('guide-name')?.value || '',
      username: document.getElementById('guide-username')?.value || '',
      email: document.getElementById('guide-email')?.value || '',
      
      // 活動エリア
      location: document.querySelector('input[name="location"]:checked')?.value || '',
      
      // 対応言語
      languages: getSelectedLanguages(),
      
      // 自己紹介
      description: document.getElementById('guide-description')?.value || '',
      
      // セッション料金
      sessionFee: document.getElementById('guide-session-fee')?.value || '6000',
      
      // 得意分野・興味
      interests: getSelectedInterests(),
      
      // 追加情報
      additionalInfo: document.getElementById('interest-custom')?.value || '',
      
      // タイムスタンプ
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * 選択された興味・得意分野を取得
   */
  function getSelectedInterests() {
    const checkedInterests = document.querySelectorAll('input[type="checkbox"][id^="interest-"]:checked');
    return Array.from(checkedInterests).map(input => ({
      value: input.value,
      label: input.nextElementSibling.textContent.trim()
    }));
  }

  /**
   * プロフィール写真データを取得
   */
  function getProfilePhotoData() {
    const profileImg = document.getElementById('guide-profile-preview');
    return profileImg ? profileImg.src : null;
  }

  /**
   * ギャラリーデータを取得
   */
  function getGalleryData() {
    // ギャラリー機能が実装されている場合のデータ収集
    return [];
  }

  /**
   * 現在のガイドIDを取得
   */
  function getCurrentGuideId() {
    return sessionStorage.getItem('currentGuideId') || 
           localStorage.getItem('currentGuideId') || 
           'test-guide-' + Date.now();
  }

  /**
   * 既存データの読み込み
   */
  function loadExistingData() {
    const guideId = getCurrentGuideId();
    const existingProfiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
    const savedData = existingProfiles[guideId] || JSON.parse(sessionStorage.getItem('guideProfileData') || '{}');
    
    if (Object.keys(savedData).length > 0) {
      populateForm(savedData);
      currentGuideData = savedData;
      console.log('Loaded existing data:', savedData);
    }
  }

  /**
   * フォームにデータを設定
   */
  function populateForm(data) {
    // 基本情報
    if (data.name) {
      const nameField = document.getElementById('guide-name');
      if (nameField) nameField.value = data.name;
    }
    
    if (data.username) {
      const usernameField = document.getElementById('guide-username');
      if (usernameField) usernameField.value = data.username;
    }
    
    if (data.email) {
      const emailField = document.getElementById('guide-email');
      if (emailField) emailField.value = data.email;
    }
    
    // 活動エリア
    if (data.location) {
      const locationInput = document.querySelector(`input[name="location"][value="${data.location}"]`);
      if (locationInput) {
        locationInput.checked = true;
        updateDisplayLocation(data.location);
      }
    }
    
    // 対応言語
    if (data.languages && Array.isArray(data.languages)) {
      data.languages.forEach(lang => {
        const langInput = document.getElementById(`lang-${lang.value}`);
        if (langInput) langInput.checked = true;
      });
      updateDisplayLanguages(data.languages);
    }
    
    // 自己紹介
    if (data.description) {
      const descField = document.getElementById('guide-description');
      if (descField) {
        descField.value = data.description;
        // 文字カウンターも更新
        const counter = document.getElementById('description-count');
        if (counter) counter.textContent = data.description.length;
      }
    }
    
    // セッション料金
    if (data.sessionFee) {
      const feeField = document.getElementById('guide-session-fee');
      if (feeField) feeField.value = data.sessionFee;
    }
    
    // 追加情報
    if (data.additionalInfo) {
      const additionalField = document.getElementById('interest-custom');
      if (additionalField) {
        additionalField.value = data.additionalInfo;
        // 文字カウンターも更新
        const counter = document.getElementById('additional-info-count');
        if (counter) counter.textContent = data.additionalInfo.length;
      }
    }
    
    // 興味・得意分野
    if (data.interests && Array.isArray(data.interests)) {
      data.interests.forEach(interest => {
        const interestInput = document.getElementById(`interest-${interest.value}`);
        if (interestInput) interestInput.checked = true;
      });
    }
  }

  /**
   * メインページのガイドデータを更新
   */
  function updateMainPageGuideData(data) {
    // メインページで使用されるガイドデータ形式に変換
    const guideData = {
      id: getCurrentGuideId(),
      name: data.name || 'テストガイド',
      location: data.location || '',
      languages: data.languages || [],
      description: data.description || '',
      fee: parseInt(data.sessionFee) || 6000,
      interests: data.interests || [],
      additionalInfo: data.additionalInfo || '',
      profilePhoto: data.profilePhoto || 'https://via.placeholder.com/150',
      rating: 4.8, // デフォルト評価
      reviewCount: 12 // デフォルトレビュー数
    };
    
    // メインページのガイドリストに追加/更新
    const existingGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
    const existingIndex = existingGuides.findIndex(guide => guide.id === guideData.id);
    
    if (existingIndex >= 0) {
      existingGuides[existingIndex] = guideData;
    } else {
      existingGuides.push(guideData);
    }
    
    localStorage.setItem('userAddedGuides', JSON.stringify(existingGuides));
    console.log('Updated main page guide data');
  }

  /**
   * データ同期の設定
   */
  function setupDataSynchronization() {
    // フォーム入力時の自動保存
    const form = document.getElementById('profile-basic-form');
    if (form) {
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('change', function() {
          // 300ms後に自動保存（連続入力対応）
          clearTimeout(this.saveTimeout);
          this.saveTimeout = setTimeout(() => {
            saveBasicInfo();
          }, 300);
        });
      });
    }
  }

  /**
   * ガイド一覧ページへのリダイレクト
   */
  function redirectToGuideList() {
    showSaveMessage('保存完了！ガイド一覧ページに移動します...', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html#guides-section';
    }, 1500);
  }

  /**
   * 保存メッセージの表示
   */
  function showSaveMessage(message, type = 'success') {
    // 既存のメッセージを削除
    const existingAlert = document.querySelector('.save-alert');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // 新しいメッセージを作成
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show save-alert`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    alertDiv.innerHTML = `
      <strong>${message}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // 3秒後に自動削除
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 3000);
  }

  // 初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedProfile);
  } else {
    initializeEnhancedProfile();
  }

})();