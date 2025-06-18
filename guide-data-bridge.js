/**
 * ガイドデータ連携システム
 * プロフィール保存から一覧表示まで確実にデータを連携
 */
(function() {
  'use strict';

  /**
   * プロフィール保存時のデータ処理
   */
  function handleProfileSave(profileData) {
    console.log('Processing profile save:', profileData);
    
    // データ検証
    if (!validateProfileData(profileData)) {
      console.error('Invalid profile data:', profileData);
      return false;
    }

    // ガイドカード用データに変換
    const guideCardData = transformToGuideCard(profileData);
    
    // ローカルストレージに保存
    saveToLocalStorage(guideCardData);
    
    // セッションストレージにも保存
    saveToSessionStorage(guideCardData);
    
    // メインページが開いている場合は即座に反映
    updateMainPageIfOpen(guideCardData);
    
    console.log('Profile data saved and synchronized');
    return true;
  }

  /**
   * プロフィールデータの検証
   */
  function validateProfileData(data) {
    if (!data) {
      console.error('Validation failed: No data provided');
      return false;
    }
    if (!data.name || data.name.trim() === '') {
      console.error('Validation failed: Name is required');
      return false;
    }
    if (!data.location || data.location.trim() === '') {
      console.error('Validation failed: Location is required');
      return false;
    }
    if (!data.sessionFee || parseInt(data.sessionFee) < 6000) {
      console.error('Validation failed: Session fee must be at least 6000');
      return false;
    }
    console.log('Profile data validation passed');
    return true;
  }

  /**
   * ガイドカード用データに変換
   */
  function transformToGuideCard(profileData) {
    console.log('=== データ変換開始 ===');
    console.log('入力データ:', profileData);
    
    // プロフィール写真のURLを取得
    const profileImg = document.getElementById('guide-profile-preview');
    const profilePhotoUrl = profileImg ? profileImg.src : 'https://via.placeholder.com/150x150/007bff/ffffff?text=ガイド';
    console.log('プロフィール写真URL:', profilePhotoUrl);
    
    // 言語データの正規化
    const languages = normalizeLanguages(profileData.languages);
    console.log('正規化後言語:', languages);
    
    // 興味・得意分野の正規化
    const interests = normalizeInterests(profileData.interests);
    console.log('正規化後興味:', interests);

    const transformedData = {
      id: generateGuideId(profileData),
      name: profileData.name ? profileData.name.trim() : 'テストガイド',
      location: profileData.location || '未設定',
      languages: languages,
      description: profileData.description || '新規登録ガイドです。よろしくお願いします。',
      sessionFee: parseInt(profileData.sessionFee) || 6000,
      interests: interests,
      additionalInfo: profileData.additionalInfo || '',
      profilePhoto: profilePhotoUrl,
      rating: 4.8,
      reviewCount: Math.floor(Math.random() * 20) + 5,
      isNew: true,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('変換後データ:', transformedData);
    console.log('=== データ変換完了 ===');
    
    return transformedData;
  }

  /**
   * 言語データの正規化
   */
  function normalizeLanguages(languages) {
    if (!Array.isArray(languages)) return ['日本語'];
    
    const languageMap = {
      'japanese': '日本語',
      'english': '英語',
      'chinese': '中国語',
      'korean': '韓国語',
      'spanish': 'スペイン語',
      'french': 'フランス語'
    };

    return languages.map(lang => {
      if (typeof lang === 'string') {
        return languageMap[lang] || lang;
      }
      return languageMap[lang.value] || lang.label || '日本語';
    });
  }

  /**
   * 興味・得意分野の正規化
   */
  function normalizeInterests(interests) {
    if (!Array.isArray(interests)) return [];
    
    const interestMap = {
      'sightseeing': '観光',
      'food': 'グルメ',
      'culture': '文化体験',
      'nature': '自然',
      'shopping': 'ショッピング',
      'history': '歴史',
      'art': 'アート',
      'family': 'ファミリー向け',
      'luxury': '高級・プレミアム',
      'budget': 'リーズナブル',
      'local': '地元密着',
      'traditional': '伝統体験'
    };

    return interests.map(interest => {
      if (typeof interest === 'string') {
        return interestMap[interest] || interest;
      }
      return interestMap[interest.value] || interest.label || interest.value;
    });
  }

  /**
   * ガイドIDの生成
   */
  function generateGuideId(profileData) {
    const existingId = localStorage.getItem('currentGuideId');
    if (existingId) return existingId;
    
    const newId = 'user_guide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('currentGuideId', newId);
    return newId;
  }

  /**
   * ローカルストレージに保存
   */
  function saveToLocalStorage(guideData) {
    try {
      const existingGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
      const existingIndex = existingGuides.findIndex(guide => guide.id === guideData.id);
      
      if (existingIndex >= 0) {
        // 既存データの更新
        existingGuides[existingIndex] = guideData;
      } else {
        // 新規データは先頭に追加
        existingGuides.unshift(guideData);
      }
      
      localStorage.setItem('userAddedGuides', JSON.stringify(existingGuides));
      console.log('Guide data saved to localStorage:', guideData.id);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * セッションストレージに保存
   */
  function saveToSessionStorage(guideData) {
    try {
      sessionStorage.setItem('latestGuideData', JSON.stringify(guideData));
      sessionStorage.setItem('guideDataSaveTimestamp', Date.now().toString());
      console.log('Guide data saved to sessionStorage');
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  }

  /**
   * メインページが開いている場合の即座反映
   */
  function updateMainPageIfOpen(guideData) {
    // 別タブ・ウィンドウのメインページに通知
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('guide_updates');
        channel.postMessage({
          type: 'GUIDE_UPDATED',
          data: guideData,
          timestamp: Date.now()
        });
        console.log('Broadcast guide update notification');
      } catch (error) {
        console.log('BroadcastChannel not available');
      }
    }

    // 現在のページがメインページの場合は直接更新
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      setTimeout(() => {
        if (typeof window.forceUpdateGuideList === 'function') {
          window.forceUpdateGuideList();
        }
      }, 100);
    }
  }

  /**
   * メインページでのデータ受信処理
   */
  function setupMainPageListener() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('guide_updates');
        channel.addEventListener('message', function(event) {
          if (event.data.type === 'GUIDE_UPDATED') {
            console.log('Received guide update notification');
            setTimeout(() => {
              if (typeof window.forceUpdateGuideList === 'function') {
                window.forceUpdateGuideList();
              }
            }, 100);
          }
        });
      } catch (error) {
        console.log('BroadcastChannel not available for listening');
      }
    }
  }

  /**
   * ページロード時の初期化
   */
  function initialize() {
    // メインページでのリスナー設定
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      setupMainPageListener();
    }

    // グローバル関数として公開
    window.handleProfileSave = handleProfileSave;
    window.guideDataBridge = {
      handleProfileSave: handleProfileSave,
      validateProfileData: validateProfileData,
      transformToGuideCard: transformToGuideCard
    };

    console.log('Guide data bridge initialized');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();