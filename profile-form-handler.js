/**
 * プロフィール編集フォーム機能
 * 編集可能項目の保存と管理
 */

(function() {
  'use strict';

  /**
   * フォーム保存処理
   */
  function setupFormSaveHandler() {
    const saveButton = document.getElementById('save-basic-info');
    if (saveButton) {
      saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        saveProfileData();
      });
    }

    // フォーム送信の処理
    const form = document.getElementById('profile-basic-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileData();
      });
    }
  }

  /**
   * プロフィールデータを保存
   */
  function saveProfileData() {
    // フォームデータを収集
    const formData = {
      location: document.getElementById('guide-location')?.value || '',
      languages: getSelectedLanguages(),
      description: document.getElementById('guide-description')?.value || '',
      sessionFee: document.getElementById('guide-session-fee')?.value || '6000',
      interests: getSelectedInterests(),
      customInterests: document.getElementById('interest-custom')?.value || ''
    };

    // 既存のユーザーデータを取得
    const existingUser = getExistingUserData();
    if (!existingUser) {
      showAlert('ユーザーデータが見つかりません', 'error');
      return;
    }

    // データをマージ
    const updatedUser = {
      ...existingUser,
      ...formData,
      lastUpdated: new Date().toISOString()
    };

    // セッションストレージに保存
    try {
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      sessionStorage.setItem('guideRegistrationData', JSON.stringify(updatedUser));
      
      // ローカルストレージにも保存
      const guideProfiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
      const profileKey = updatedUser.email || updatedUser.username || 'default';
      guideProfiles[profileKey] = updatedUser;
      localStorage.setItem('guideProfiles', JSON.stringify(guideProfiles));

      showAlert('プロフィールを保存しました', 'success');
      
      // 表示を更新
      setTimeout(() => {
        updateDisplayFromData(updatedUser);
      }, 500);

    } catch (error) {
      console.error('保存エラー:', error);
      showAlert('保存に失敗しました', 'error');
    }
  }

  /**
   * 既存のユーザーデータを取得
   */
  function getExistingUserData() {
    const sources = ['currentUser', 'guideRegistrationData', 'latestGuideRegistration'];
    
    for (const key of sources) {
      try {
        const data = sessionStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed && parsed.email && (parsed.name || parsed.firstName)) {
            return parsed;
          }
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  }

  /**
   * 選択された言語を取得
   */
  function getSelectedLanguages() {
    const select = document.getElementById('guide-languages');
    if (!select) return ['ja'];
    
    const selected = Array.from(select.selectedOptions).map(option => option.value);
    return selected.length > 0 ? selected : ['ja'];
  }

  /**
   * 選択された興味分野を取得
   */
  function getSelectedInterests() {
    const interests = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
      if (checkbox.value && checkbox.id.startsWith('interest-')) {
        interests.push(checkbox.value);
      }
    });
    
    return interests;
  }

  /**
   * データから表示を更新
   */
  function updateDisplayFromData(userData) {
    // 基本情報表示を更新
    const displayLocation = document.getElementById('display-location');
    if (displayLocation && userData.location) {
      displayLocation.textContent = userData.location;
    }

    // 言語表示を更新
    const displayLanguages = document.getElementById('display-languages');
    if (displayLanguages && userData.languages) {
      const languageLabels = {
        'ja': '日本語',
        'en': '英語',
        'zh': '中国語',
        'ko': '韓国語',
        'fr': 'フランス語',
        'de': 'ドイツ語',
        'es': 'スペイン語',
        'it': 'イタリア語',
        'ru': 'ロシア語',
        'other': 'その他'
      };
      
      const languageTags = userData.languages.map(lang => 
        `<span class="badge bg-primary me-1">${languageLabels[lang] || lang}</span>`
      ).join('');
      
      displayLanguages.innerHTML = languageTags;
    }
  }

  /**
   * フォームに既存データを設定
   */
  function loadExistingDataToForm() {
    const userData = getExistingUserData();
    if (!userData) return;

    // 活動エリア（セレクトボックス対応）
    const locationField = document.getElementById('guide-location');
    if (locationField && userData.location) {
      // セレクトボックスの場合、optionを選択
      const options = locationField.querySelectorAll('option');
      for (let option of options) {
        if (option.value === userData.location) {
          option.selected = true;
          break;
        }
      }
    }

    // 言語選択
    if (userData.languages && Array.isArray(userData.languages)) {
      const languagesSelect = document.getElementById('guide-languages');
      if (languagesSelect) {
        Array.from(languagesSelect.options).forEach(option => {
          option.selected = userData.languages.includes(option.value);
        });
      }
    }

    // 自己紹介
    const descriptionField = document.getElementById('guide-description');
    if (descriptionField && userData.description) {
      descriptionField.value = userData.description;
    }

    // セッション料金
    const feeField = document.getElementById('guide-session-fee');
    if (feeField && userData.sessionFee) {
      feeField.value = userData.sessionFee;
    }

    // 興味分野
    if (userData.interests && Array.isArray(userData.interests)) {
      userData.interests.forEach(interest => {
        const checkbox = document.getElementById(`interest-${interest}`);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    }

    // カスタム興味（テキストエリア対応）
    const customField = document.getElementById('interest-custom');
    if (customField && userData.customInterests) {
      customField.value = userData.customInterests;
    }
  }

  /**
   * アラート表示
   */
  function showAlert(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : 
                     type === 'error' ? 'alert-danger' : 'alert-info';
    
    const alert = document.createElement('div');
    alert.className = `alert ${alertClass} alert-dismissible fade show`;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // 3秒後に自動削除
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    }, 3000);
  }

  /**
   * 初期化
   */
  function initialize() {
    setupFormSaveHandler();
    
    // DOM準備後にデータを読み込み
    setTimeout(() => {
      loadExistingDataToForm();
    }, 1000);
  }

  // DOM準備後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();