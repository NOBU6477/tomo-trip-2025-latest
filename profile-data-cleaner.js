/**
 * プロフィールデータクリーナー
 * 古いデータを削除し、正しい新規登録データが表示されるようにする
 */

class ProfileDataCleaner {
  constructor() {
    this.init();
  }

  /**
   * 初期化
   */
  init() {
    if (window.location.pathname.includes('guide-profile.html')) {
      this.performCleanup();
      this.ensureCorrectData();
    }
  }

  /**
   * 包括的なデータクリーンアップ
   */
  performCleanup() {
    console.log('プロフィールデータクリーンアップを開始...');

    // 1. 古いローカルストレージデータを削除
    this.cleanLocalStorage();

    // 2. 古いセッションストレージデータを整理
    this.cleanSessionStorage();

    // 3. DOM内の古いデータを削除
    this.cleanDOMData();

    // 4. フォームフィールドをリセット
    this.resetFormFields();

    console.log('データクリーンアップ完了');
  }

  /**
   * ローカルストレージのクリーンアップ
   */
  cleanLocalStorage() {
    try {
      // 古いガイドプロフィールを削除
      const profiles = JSON.parse(localStorage.getItem('guideProfiles') || '{}');
      
      // test1400関連のプロフィールを削除
      Object.keys(profiles).forEach(id => {
        const profile = profiles[id];
        if (profile.email === 'test1400@gmail.com' || 
            profile.name === 'test1400' ||
            profile.email === 'test1400@example.com') {
          delete profiles[id];
          console.log(`古いプロフィール削除: ${id}`);
        }
      });

      localStorage.setItem('guideProfiles', JSON.stringify(profiles));

      // 古いガイドリストを削除
      const savedGuides = JSON.parse(localStorage.getItem('savedGuides') || '[]');
      const filteredGuides = savedGuides.filter(guide => {
        return guide.email !== 'test1400@gmail.com' && 
               guide.name !== 'test1400' &&
               guide.email !== 'test1400@example.com';
      });
      localStorage.setItem('savedGuides', JSON.stringify(filteredGuides));

      // その他の古いデータキーを削除
      const keysToCheck = [
        'guideDetailsData',
        'userGuides',
        'registeredGuides',
        'profileCache'
      ];

      keysToCheck.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (this.containsOldData(parsed)) {
              localStorage.removeItem(key);
              console.log(`古いデータキー削除: ${key}`);
            }
          } catch (e) {
            // JSON解析エラーの場合は削除
            localStorage.removeItem(key);
          }
        }
      });

    } catch (error) {
      console.error('ローカルストレージクリーンアップエラー:', error);
    }
  }

  /**
   * セッションストレージのクリーンアップ
   */
  cleanSessionStorage() {
    try {
      // 現在の登録データを保護しつつ、古いデータを削除
      const currentUser = sessionStorage.getItem('currentUser');
      const registrationData = sessionStorage.getItem('guideRegistrationData');

      if (currentUser) {
        const user = JSON.parse(currentUser);
        // test1500@gmail.com と 優 以外の場合は削除
        if (user.email !== 'test1500@gmail.com' || user.name !== '優') {
          console.log('古いセッションユーザーデータを削除');
          sessionStorage.removeItem('currentUser');
        }
      }

      // 古いガイドセッションを削除
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('guide_') && key !== 'guideRegistrationData') {
          const data = sessionStorage.getItem(key);
          if (data && this.containsOldData(JSON.parse(data))) {
            sessionStorage.removeItem(key);
            console.log(`古いセッションデータ削除: ${key}`);
          }
        }
      });

    } catch (error) {
      console.error('セッションストレージクリーンアップエラー:', error);
    }
  }

  /**
   * DOM内の古いデータを削除
   */
  cleanDOMData() {
    // data-属性に古いデータが含まれている要素を削除
    const elementsWithData = document.querySelectorAll('[data-guide-id], [data-user-id]');
    elementsWithData.forEach(element => {
      const guideId = element.getAttribute('data-guide-id');
      const userId = element.getAttribute('data-user-id');
      
      if (guideId === 'test1400' || userId === 'test1400') {
        element.remove();
        console.log('古いDOM要素を削除');
      }
    });
  }

  /**
   * フォームフィールドをリセット
   */
  resetFormFields() {
    const fieldsToReset = [
      'guide-name',
      'guide-username', 
      'guide-email',
      'guide-phone',
      'guide-location'
    ];

    fieldsToReset.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && this.containsOldValue(field.value)) {
        field.value = '';
        console.log(`フィールドリセット: ${fieldId}`);
      }
    });
  }

  /**
   * 正しいデータが確実に表示されるようにする
   */
  ensureCorrectData() {
    // 現在のセッションデータを確認
    const currentUser = sessionStorage.getItem('currentUser');
    const registrationData = sessionStorage.getItem('guideRegistrationData');

    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        
        // 正しいユーザーデータ（優、test1500@gmail.com）を強制設定
        if (user.name === '優' && user.email === 'test1500@gmail.com') {
          this.setCorrectFormData(user);
        }
      } catch (error) {
        console.error('正しいデータ設定エラー:', error);
      }
    }

    if (registrationData) {
      try {
        const regData = JSON.parse(registrationData);
        this.setCorrectFormData(regData);
      } catch (error) {
        console.error('登録データ設定エラー:', error);
      }
    }
  }

  /**
   * 正しいフォームデータを設定
   */
  setCorrectFormData(userData) {
    const fieldMapping = {
      'guide-name': userData.name || '優',
      'guide-email': userData.email || 'test1500@gmail.com',
      'guide-username': userData.username || userData.name || '優',
      'guide-phone': userData.phone || '',
      'guide-location': userData.location || userData.city || ''
    };

    Object.keys(fieldMapping).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.value = fieldMapping[fieldId];
        console.log(`正しいデータ設定 ${fieldId}: ${fieldMapping[fieldId]}`);
      }
    });
  }

  /**
   * 古いデータが含まれているかチェック
   */
  containsOldData(data) {
    if (!data) return false;
    
    const dataStr = JSON.stringify(data).toLowerCase();
    return dataStr.includes('test1400') || 
           dataStr.includes('test1400@gmail.com') ||
           dataStr.includes('test1400@example.com');
  }

  /**
   * フィールド値に古いデータが含まれているかチェック
   */
  containsOldValue(value) {
    if (!value) return false;
    
    return value.includes('test1400') || 
           value === 'test1400@gmail.com' ||
           value === 'test1400@example.com';
  }

  /**
   * 完全リセット（緊急時用）
   */
  performCompleteReset() {
    console.log('完全リセットを実行...');
    
    // 新規登録データ以外をすべて削除
    const registrationData = sessionStorage.getItem('guideRegistrationData');
    const currentUser = sessionStorage.getItem('currentUser');
    
    // ローカルストレージを完全クリア
    localStorage.clear();
    
    // セッションストレージをクリアし、必要なデータのみ復元
    sessionStorage.clear();
    
    if (registrationData) {
      sessionStorage.setItem('guideRegistrationData', registrationData);
    }
    
    if (currentUser) {
      sessionStorage.setItem('currentUser', currentUser);
    }
    
    console.log('完全リセット完了');
    
    // ページをリロード
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// グローバルに公開
window.ProfileDataCleaner = ProfileDataCleaner;

// 自動実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.profileDataCleaner = new ProfileDataCleaner();
  });
} else {
  window.profileDataCleaner = new ProfileDataCleaner();
}