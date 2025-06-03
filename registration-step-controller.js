/**
 * 登録ステップ制御スクリプト
 * URLパラメータに基づいて新規登録の続きか既存ユーザーの編集かを判定
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    console.log('登録ステップ制御を初期化中...');
    
    // URLパラメータをチェック
    const urlParams = new URLSearchParams(window.location.search);
    const step = urlParams.get('step');
    const mode = urlParams.get('mode');
    
    console.log('URLパラメータ - step:', step, 'mode:', mode);
    
    // 登録データをチェック
    const registrationData = localStorage.getItem('guideRegistrationData');
    const sessionInProgress = sessionStorage.getItem('registrationInProgress');
    
    console.log('登録進行中:', sessionInProgress);
    console.log('登録データ存在:', !!registrationData);
    
    if (step === '2' || sessionInProgress === 'true') {
      // 新規登録の第2ステップとして設定
      setupRegistrationStep2();
    } else {
      // 既存ユーザーのプロフィール編集モード
      setupExistingUserMode();
    }
  });

  /**
   * 新規登録ステップ2の設定
   */
  function setupRegistrationStep2() {
    console.log('新規登録ステップ2を設定中...');
    
    // ページタイトルを変更
    document.title = 'ガイド登録 - ステップ2 | Local Guide';
    
    // ヘッダーを新規登録用に変更
    updateHeaderForRegistration();
    
    // 登録データを読み込んでフォームに設定
    loadRegistrationDataToForm();
    
    // ステップインジケーターを追加
    addStepIndicator();
    
    // 保存ボタンを「登録完了」に変更
    updateSaveButtonForRegistration();
    
    // 不要なタブを非表示
    hideUnnecessaryTabsForRegistration();
  }

  /**
   * 既存ユーザーモードの設定
   */
  function setupExistingUserMode() {
    console.log('既存ユーザーのプロフィール編集モードを設定中...');
    // 通常のプロフィール編集画面として動作
  }

  /**
   * ヘッダーを新規登録用に更新
   */
  function updateHeaderForRegistration() {
    const header = document.querySelector('h1');
    if (header) {
      header.textContent = 'ガイドプロフィール設定';
    }
    
    // 戻るリンクを追加
    const container = document.querySelector('.container');
    if (container && !document.querySelector('.back-to-step1')) {
      const backLink = document.createElement('a');
      backLink.href = 'guide-registration-form.html';
      backLink.className = 'back-to-step1 d-flex align-items-center text-decoration-none text-muted mb-3';
      backLink.innerHTML = '<i class="bi bi-arrow-left me-2"></i>基本情報に戻る';
      container.insertBefore(backLink, container.firstChild);
    }
  }

  /**
   * 登録データをフォームに読み込み
   */
  function loadRegistrationDataToForm() {
    const registrationData = localStorage.getItem('guideRegistrationData');
    if (registrationData) {
      try {
        const data = JSON.parse(registrationData);
        console.log('登録データを読み込み:', data);
        
        // 基本情報をフォームに設定
        const nameField = document.querySelector('input[name="name"], #guide-name');
        if (nameField) {
          nameField.value = `${data.lastName} ${data.firstName}`;
        }
        
        const emailField = document.querySelector('input[name="email"], #guide-email');
        if (emailField) {
          emailField.value = data.email || '';
        }
        
        const phoneField = document.querySelector('input[name="phone"], #guide-phone');
        if (phoneField) {
          phoneField.value = data.phone || '';
        }
        
        const locationField = document.querySelector('select[name="location"], #guide-location');
        if (locationField) {
          locationField.value = data.location || '';
        }
        
        const introField = document.querySelector('textarea[name="introduction"], #guide-intro');
        if (introField) {
          introField.value = data.introduction || '';
        }
        
        console.log('フォームデータを設定完了');
      } catch (error) {
        console.error('登録データの読み込みに失敗:', error);
      }
    }
  }

  /**
   * ステップインジケーターを追加
   */
  function addStepIndicator() {
    const container = document.querySelector('.container');
    if (container && !document.querySelector('.step-indicator')) {
      const stepIndicator = document.createElement('div');
      stepIndicator.className = 'step-indicator text-center mb-4';
      stepIndicator.innerHTML = `
        <span class="step completed">1</span>
        <span>基本情報</span>
        <span class="step active">2</span>
        <span>プロフィール詳細</span>
        <span class="step">3</span>
        <span>完了</span>
      `;
      
      // CSS を追加
      const style = document.createElement('style');
      style.textContent = `
        .step-indicator .step {
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e9ecef;
          color: #6c757d;
          text-align: center;
          line-height: 30px;
          margin-right: 1rem;
          font-weight: bold;
        }
        .step-indicator .step.active {
          background-color: #0d6efd;
          color: white;
        }
        .step-indicator .step.completed {
          background-color: #198754;
          color: white;
        }
      `;
      document.head.appendChild(style);
      
      const backLink = document.querySelector('.back-to-step1');
      if (backLink) {
        backLink.parentNode.insertBefore(stepIndicator, backLink.nextSibling);
      } else {
        container.insertBefore(stepIndicator, container.firstChild);
      }
    }
  }

  /**
   * 保存ボタンを登録完了用に更新
   */
  function updateSaveButtonForRegistration() {
    const saveButton = document.querySelector('#save-and-view-guides, .btn-primary[type="submit"]');
    if (saveButton) {
      saveButton.textContent = '登録を完了する';
      saveButton.className = 'btn btn-success btn-lg';
      
      // クリックイベントを更新
      const newButton = saveButton.cloneNode(true);
      saveButton.parentNode.replaceChild(newButton, saveButton);
      
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        completeRegistration();
      });
    }
  }

  /**
   * 新規登録時に不要なタブを非表示
   */
  function hideUnnecessaryTabsForRegistration() {
    const tabsToHide = [
      'スケジュール',
      'メッセージ',
      'アカウント設定'
    ];
    
    tabsToHide.forEach(tabName => {
      const tabElement = document.querySelector(`[data-bs-target*="${tabName}"], .nav-link:contains("${tabName}")`);
      if (tabElement) {
        tabElement.style.display = 'none';
      }
    });
    
    // 写真ギャラリータブは表示
    const photoTab = document.querySelector('.nav-link[href="#photos"]');
    if (photoTab) {
      photoTab.style.display = '';
    }
  }

  /**
   * 登録完了処理
   */
  function completeRegistration() {
    console.log('登録完了処理を開始...');
    
    // 現在のフォームデータを取得
    const profileData = gatherProfileData();
    
    // 登録データと統合
    const registrationData = localStorage.getItem('guideRegistrationData');
    let completeData = {};
    
    if (registrationData) {
      completeData = JSON.parse(registrationData);
    }
    
    // プロフィールデータを追加
    Object.assign(completeData, profileData);
    completeData.registrationCompleted = true;
    completeData.completedDate = new Date().toISOString();
    
    // データを保存
    localStorage.setItem('completeGuideData', JSON.stringify(completeData));
    
    // ガイド一覧に追加
    addToGuideList(completeData);
    
    // 登録完了ページに遷移
    showRegistrationComplete();
  }

  /**
   * プロフィールデータを収集
   */
  function gatherProfileData() {
    return {
      name: document.querySelector('#guide-name')?.value || '',
      email: document.querySelector('#guide-email')?.value || '',
      phone: document.querySelector('#guide-phone')?.value || '',
      location: document.querySelector('#guide-location')?.value || '',
      introduction: document.querySelector('#guide-intro')?.value || '',
      languages: getSelectedLanguages(),
      keywords: getSelectedKeywords(),
      fee: document.querySelector('#guide-fee')?.value || '5000',
      profileImage: getProfileImageData()
    };
  }

  /**
   * 選択された言語を取得
   */
  function getSelectedLanguages() {
    const languages = [];
    document.querySelectorAll('input[name="languages"]:checked').forEach(checkbox => {
      languages.push(checkbox.value);
    });
    return languages;
  }

  /**
   * 選択されたキーワードを取得
   */
  function getSelectedKeywords() {
    const keywords = [];
    document.querySelectorAll('input[name="keywords"]:checked').forEach(checkbox => {
      keywords.push(checkbox.value);
    });
    return keywords;
  }

  /**
   * プロフィール画像データを取得
   */
  function getProfileImageData() {
    const imageElement = document.querySelector('.profile-photo');
    return imageElement?.src || '';
  }

  /**
   * ガイド一覧に追加
   */
  function addToGuideList(guideData) {
    const existingGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
    
    // 新しいガイドデータを作成
    const newGuide = {
      id: Date.now(),
      name: guideData.name,
      location: guideData.location,
      languages: guideData.languages,
      fee: guideData.fee,
      keywords: guideData.keywords,
      introduction: guideData.introduction,
      profileImage: guideData.profileImage,
      addedDate: new Date().toISOString()
    };
    
    existingGuides.push(newGuide);
    localStorage.setItem('userAddedGuides', JSON.stringify(existingGuides));
    
    console.log('ガイド一覧に追加完了:', newGuide);
  }

  /**
   * 登録完了画面を表示
   */
  function showRegistrationComplete() {
    // 登録進行中フラグをクリア
    sessionStorage.removeItem('registrationInProgress');
    sessionStorage.removeItem('currentStep');
    
    // 成功メッセージとリダイレクト
    alert('ガイド登録が完了しました！ガイド一覧に追加されました。');
    
    // ホームページにリダイレクト
    setTimeout(() => {
      window.location.href = 'index.html#guides';
    }, 1000);
  }

  // グローバル関数として公開
  window.setupRegistrationStep2 = setupRegistrationStep2;
  window.completeRegistration = completeRegistration;

  console.log('登録ステップ制御スクリプトがロードされました');

})();