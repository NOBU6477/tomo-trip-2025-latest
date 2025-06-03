/**
 * プロフィールデータ管理システム
 * ガイドプロフィール編集の永続化とUI統一を実現
 */

class ProfileDataManager {
  constructor() {
    this.storageKeys = {
      guides: 'guides',
      guideProfiles: 'guideProfiles',
      userAddedGuides: 'userAddedGuides',
      guideDetailsData: 'guideDetailsData',
      currentUser: 'currentUser'
    };
  }

  /**
   * 現在のユーザー情報を取得
   */
  getCurrentUser() {
    try {
      // セッションストレージから取得
      const sessionUser = sessionStorage.getItem('currentUser');
      if (sessionUser) {
        return JSON.parse(sessionUser);
      }
      
      // ローカルストレージから取得
      const localUser = localStorage.getItem('currentUser');
      if (localUser) {
        return JSON.parse(localUser);
      }
      
      // 登録済みユーザーから取得
      const registeredUser = sessionStorage.getItem('registeredUser');
      if (registeredUser) {
        return JSON.parse(registeredUser);
      }
      
      return null;
    } catch (error) {
      console.error('現在のユーザー取得エラー:', error);
      return null;
    }
  }

  /**
   * プロフィールデータを全ストレージに保存
   */
  saveProfileData(profileData) {
    console.log('プロフィールデータを保存中:', profileData);
    
    try {
      // 1. ガイドリストに保存
      let guides = JSON.parse(localStorage.getItem(this.storageKeys.guides)) || [];
      const existingIndex = guides.findIndex(g => g.id === profileData.id);
      
      if (existingIndex !== -1) {
        guides[existingIndex] = { ...guides[existingIndex], ...profileData };
      } else {
        guides.push(profileData);
      }
      
      // 全ストレージキーに保存
      Object.values(this.storageKeys).forEach(key => {
        localStorage.setItem(key, JSON.stringify(guides));
      });
      
      // 2. セッションストレージに保存
      sessionStorage.setItem(`guide_${profileData.id}`, JSON.stringify(profileData));
      sessionStorage.setItem('currentUser', JSON.stringify(profileData));
      
      // 3. ガイド詳細データ専用ストレージ
      let detailsData = JSON.parse(localStorage.getItem('guideDetailsData')) || {};
      detailsData[profileData.id] = profileData;
      localStorage.setItem('guideDetailsData', JSON.stringify(detailsData));
      
      console.log('プロフィールデータの保存完了');
      return true;
    } catch (error) {
      console.error('プロフィールデータの保存エラー:', error);
      return false;
    }
  }

  /**
   * 保存されたプロフィールデータを読み込み
   */
  loadProfileData(userId) {
    console.log('プロフィールデータを読み込み中:', userId);
    
    try {
      // 複数のソースから検索
      const sources = [
        () => {
          const guides = JSON.parse(localStorage.getItem(this.storageKeys.guides)) || [];
          return guides.find(g => g.id === userId);
        },
        () => {
          const sessionData = sessionStorage.getItem(`guide_${userId}`);
          return sessionData ? JSON.parse(sessionData) : null;
        },
        () => {
          const detailsData = JSON.parse(localStorage.getItem('guideDetailsData')) || {};
          return detailsData[userId];
        }
      ];
      
      for (const source of sources) {
        const data = source();
        if (data) {
          console.log('プロフィールデータを発見:', data);
          return data;
        }
      }
      
      console.log('保存されたプロフィールデータが見つかりません');
      return null;
    } catch (error) {
      console.error('プロフィールデータの読み込みエラー:', error);
      return null;
    }
  }

  /**
   * フォームにデータを自動入力
   */
  populateForm(data) {
    if (!data) return;
    
    console.log('フォームにデータを入力中:', data);
    
    const fieldMappings = [
      { id: 'guide-name', value: data.name },
      { id: 'guide-location', value: data.location || data.city },
      { id: 'guide-description', value: data.bio || data.description },
      { id: 'guide-session-fee', value: data.fee || data.price }
    ];
    
    fieldMappings.forEach(({ id, value }) => {
      if (value) {
        const element = document.getElementById(id);
        if (element) {
          element.value = value;
          console.log(`${id} を設定:`, value);
        }
      }
    });
    
    // 言語設定
    if (data.languages && Array.isArray(data.languages)) {
      this.setLanguageSelections(data.languages);
    }
    
    // 専門分野設定
    if (data.specialties || data.keywords) {
      this.setSpecialtySelections(data.specialties || data.keywords);
    }
  }

  /**
   * 言語選択を設定
   */
  setLanguageSelections(languages) {
    const languagesSelect = document.getElementById('guide-languages');
    if (!languagesSelect) return;
    
    const langMap = {
      '日本語': 'ja', '英語': 'en', '中国語': 'zh', '韓国語': 'ko',
      'フランス語': 'fr', 'ドイツ語': 'de', 'スペイン語': 'es',
      'イタリア語': 'it', 'ロシア語': 'ru', 'その他': 'other'
    };
    
    Array.from(languagesSelect.options).forEach(option => {
      option.selected = false;
    });
    
    languages.forEach(lang => {
      const value = langMap[lang] || lang;
      const option = languagesSelect.querySelector(`option[value="${value}"]`);
      if (option) option.selected = true;
    });
    
    console.log('言語選択を設定:', languages);
  }

  /**
   * 専門分野選択を設定
   */
  setSpecialtySelections(specialties) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      const labelText = label ? label.textContent.trim() : '';
      
      checkbox.checked = specialties.includes(labelText) || specialties.includes(checkbox.value);
    });
    
    console.log('専門分野選択を設定:', specialties);
  }

  /**
   * ガイド一覧とガイド詳細ページのデータを同期
   */
  syncGuideDisplayData(profileData) {
    // ローカルストレージイベントを発火
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'guides',
      newValue: localStorage.getItem('guides'),
      url: window.location.href
    }));
    
    // カスタムイベントを発火
    window.dispatchEvent(new CustomEvent('guideDataUpdated', {
      detail: { guideData: profileData }
    }));
    
    console.log('ガイド表示データの同期完了');
  }
}

// グローバルインスタンスを作成
window.profileDataManager = new ProfileDataManager();

console.log('プロフィールデータ管理システムが初期化されました');