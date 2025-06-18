/**
 * ガイドカードデータ修正システム
 * フォームデータから正確にガイドカードを生成
 */
(function() {
  'use strict';

  /**
   * フォームデータを直接ガイドカード形式に変換
   */
  function createGuideCardFromForm() {
    console.log('フォームから直接ガイドカードデータを作成中...');
    
    // フォームから直接データを取得
    const formData = {
      name: document.getElementById('guide-name')?.value?.trim() || '',
      location: document.getElementById('guide-location')?.value || '',
      description: document.getElementById('guide-description')?.value?.trim() || '',
      sessionFee: document.getElementById('guide-session-fee')?.value || '6000',
      additionalInfo: document.getElementById('interest-custom')?.value?.trim() || '',
      languages: collectLanguageData(),
      interests: collectInterestData()
    };

    console.log('収集したフォームデータ:', formData);

    // データ検証
    if (!formData.name) {
      alert('名前を入力してください。');
      return null;
    }

    if (!formData.location) {
      alert('活動エリアを選択してください。');
      return null;
    }

    // ガイドカード用データに変換
    const guideCardData = {
      id: 'user_guide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: formData.name,
      location: formData.location,
      languages: formData.languages,
      description: formData.description || '新規登録ガイドです。よろしくお願いします。',
      sessionFee: parseInt(formData.sessionFee),
      interests: formData.interests,
      additionalInfo: formData.additionalInfo,
      profilePhoto: getProfilePhotoUrl(),
      rating: 4.8,
      reviewCount: Math.floor(Math.random() * 15) + 5,
      isNew: true,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('生成したガイドカードデータ:', guideCardData);
    return guideCardData;
  }

  /**
   * 言語データを収集
   */
  function collectLanguageData() {
    const selectedLanguages = [];
    const languageCheckboxes = document.querySelectorAll('.language-checkbox:checked');
    
    languageCheckboxes.forEach(checkbox => {
      const label = checkbox.nextElementSibling?.textContent?.trim();
      if (label) {
        selectedLanguages.push(label.replace(/^[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]*/, ''));
      }
    });

    return selectedLanguages.length > 0 ? selectedLanguages : ['日本語'];
  }

  /**
   * 興味・得意分野データを収集
   */
  function collectInterestData() {
    const selectedInterests = [];
    const interestCheckboxes = document.querySelectorAll('input[id^="interest-"]:checked');
    
    interestCheckboxes.forEach(checkbox => {
      const label = checkbox.nextElementSibling?.textContent?.trim();
      if (label) {
        selectedInterests.push(label);
      }
    });

    return selectedInterests;
  }

  /**
   * プロフィール写真URLを取得
   */
  function getProfilePhotoUrl() {
    const profileImg = document.getElementById('guide-profile-preview');
    if (profileImg && profileImg.src && !profileImg.src.includes('placeholder')) {
      return profileImg.src;
    }
    return 'https://via.placeholder.com/150x150/007bff/ffffff?text=ガイド';
  }

  /**
   * ガイドカードを直接メインページに保存
   */
  function saveGuideCardDirectly(guideData) {
    try {
      console.log('ガイドカードデータを直接保存中:', guideData);
      
      // 既存のガイドリストを取得
      const existingGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
      
      // 同じIDのガイドがあるかチェック
      const existingIndex = existingGuides.findIndex(guide => guide.id === guideData.id);
      
      if (existingIndex >= 0) {
        // 既存データを更新
        existingGuides[existingIndex] = guideData;
        console.log('既存ガイドを更新しました');
      } else {
        // 新規データを先頭に追加
        existingGuides.unshift(guideData);
        console.log('新規ガイドを追加しました');
      }
      
      // ローカルストレージに保存
      localStorage.setItem('userAddedGuides', JSON.stringify(existingGuides));
      
      // セッションストレージにも保存
      sessionStorage.setItem('latestGuideData', JSON.stringify(guideData));
      sessionStorage.setItem('guideDataTimestamp', Date.now().toString());
      
      console.log('ガイドカードデータの保存完了');
      return true;
      
    } catch (error) {
      console.error('ガイドカードデータの保存エラー:', error);
      return false;
    }
  }

  /**
   * メインページの強制更新
   */
  function forceMainPageUpdate() {
    // BroadcastChannelで他のタブに通知
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('guide_updates');
        channel.postMessage({
          type: 'FORCE_GUIDE_UPDATE',
          timestamp: Date.now()
        });
        console.log('メインページ更新通知を送信しました');
      } catch (error) {
        console.log('BroadcastChannel利用不可');
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
   * 保存処理の完全な実行
   */
  function executeCompleteSave() {
    console.log('=== 完全保存処理開始 ===');
    
    // 1. フォームデータから直接ガイドカードを作成
    const guideCardData = createGuideCardFromForm();
    if (!guideCardData) {
      console.error('ガイドカードデータの作成に失敗しました');
      return false;
    }

    // 2. ガイドカードデータを保存
    const saveSuccess = saveGuideCardDirectly(guideCardData);
    if (!saveSuccess) {
      console.error('ガイドカードデータの保存に失敗しました');
      return false;
    }

    // 3. メインページの更新
    forceMainPageUpdate();

    // 4. 保存完了メッセージ
    showSaveSuccess();

    console.log('=== 完全保存処理完了 ===');
    return true;
  }

  /**
   * 保存成功メッセージを表示
   */
  function showSaveSuccess() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
      プロフィールを保存しました！メインページのガイド一覧に反映されます。
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const form = document.getElementById('profile-basic-form');
    if (form) {
      form.insertBefore(alertDiv, form.firstChild);
      
      setTimeout(() => {
        if (alertDiv.parentNode) {
          alertDiv.remove();
        }
      }, 5000);
    }
  }

  /**
   * 保存ボタンのイベントハンドラーを置き換え
   */
  function setupSaveButtonHandlers() {
    // 完全保存ボタン
    const form = document.getElementById('profile-basic-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        executeCompleteSave();
      });
    }

    // 基本情報保存ボタン
    const saveBasicButton = document.getElementById('save-basic-info');
    if (saveBasicButton) {
      saveBasicButton.addEventListener('click', function(e) {
        e.preventDefault();
        executeCompleteSave();
      });
    }

    // 保存してガイド一覧を見るボタン
    const saveAndViewButton = document.getElementById('save-and-view-guide-list');
    if (saveAndViewButton) {
      saveAndViewButton.addEventListener('click', function(e) {
        e.preventDefault();
        const success = executeCompleteSave();
        if (success) {
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      });
    }
  }

  /**
   * 初期化
   */
  function initialize() {
    console.log('ガイドカードデータ修正システム初期化中...');
    
    // 保存ボタンのハンドラーを設定
    setupSaveButtonHandlers();
    
    // グローバル関数として公開
    window.createGuideCardFromForm = createGuideCardFromForm;
    window.executeCompleteSave = executeCompleteSave;
    
    console.log('ガイドカードデータ修正システム初期化完了');
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();