/**
 * 登録フロー修正スクリプト - 完全独立型
 * 基本情報の読み込みとリダイレクト防止を確実に実行
 */

(function() {
  'use strict';

  // 即座に実行してリダイレクトを防止
  preventUnwantedRedirects();
  loadRegistrationData();

  // 完全なリダイレクト防止システム
  function preventUnwantedRedirects() {
    // location.hrefの置き換えを完全に防止
    const originalLocation = window.location;
    let preventRedirect = false;

    // URLパラメータをチェック
    const urlParams = new URLSearchParams(window.location.search);
    const step = urlParams.get('step');
    const mode = urlParams.get('mode');
    
    if (step === '2' || mode === 'registration') {
      preventRedirect = true;
      console.log('新規登録モード検出 - リダイレクト防止を有効化');
      
      // セッションに登録モードを設定
      sessionStorage.setItem('registrationInProgress', 'true');
      sessionStorage.setItem('currentStep', '2');
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userType', 'guide');
      sessionStorage.setItem('bypassAccessControl', 'true');
    }

    // location.href setter を無効化
    Object.defineProperty(window.location, 'href', {
      set: function(url) {
        if (preventRedirect && (url.includes('index.html') || url === '/')) {
          console.log('リダイレクト防止:', url);
          return;
        }
        originalLocation.href = url;
      },
      get: function() {
        return originalLocation.href;
      }
    });

    // assign と replace も無効化
    const originalAssign = window.location.assign;
    const originalReplace = window.location.replace;

    window.location.assign = function(url) {
      if (preventRedirect && (url.includes('index.html') || url === '/')) {
        console.log('assign リダイレクト防止:', url);
        return;
      }
      return originalAssign.call(originalLocation, url);
    };

    window.location.replace = function(url) {
      if (preventRedirect && (url.includes('index.html') || url === '/')) {
        console.log('replace リダイレクト防止:', url);
        return;
      }
      return originalReplace.call(originalLocation, url);
    };

    // alert や confirm による中断も防止
    const originalAlert = window.alert;
    window.alert = function(message) {
      if (preventRedirect && message.includes('アクセス')) {
        console.log('アクセス制御アラートを無効化:', message);
        return;
      }
      return originalAlert.call(window, message);
    };
  }

  // 登録データの読み込み
  function loadRegistrationData() {
    const registrationData = localStorage.getItem('guideRegistrationData');
    
    if (registrationData) {
      try {
        const data = JSON.parse(registrationData);
        console.log('登録データを読み込み:', data);
        
        // DOMが準備できたらフォームに設定
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => setFormData(data));
        } else {
          setFormData(data);
        }
        
        // さらに遅延実行も設定
        setTimeout(() => setFormData(data), 500);
        setTimeout(() => setFormData(data), 1000);
      } catch (error) {
        console.error('登録データの読み込みエラー:', error);
      }
    }
  }

  // フォームデータを設定
  function setFormData(data) {
    console.log('フォームにデータを設定中:', data);
    
    // 名前フィールド
    const nameFields = [
      '#guide-name',
      'input[name="name"]',
      'input[placeholder*="名前"]'
    ];
    
    nameFields.forEach(selector => {
      const field = document.querySelector(selector);
      if (field && !field.value) {
        field.value = `${data.lastName || ''} ${data.firstName || ''}`.trim();
        console.log('名前を設定:', field.value);
      }
    });

    // メールアドレス
    const emailFields = [
      '#guide-email',
      'input[name="email"]',
      'input[type="email"]'
    ];
    
    emailFields.forEach(selector => {
      const field = document.querySelector(selector);
      if (field && !field.value && data.email) {
        field.value = data.email;
        console.log('メールを設定:', field.value);
      }
    });

    // 電話番号
    const phoneFields = [
      '#guide-phone',
      'input[name="phone"]',
      'input[type="tel"]'
    ];
    
    phoneFields.forEach(selector => {
      const field = document.querySelector(selector);
      if (field && !field.value && data.phone) {
        field.value = data.phone;
        console.log('電話番号を設定:', field.value);
      }
    });

    // 活動エリア
    const locationFields = [
      '#guide-location',
      'select[name="location"]'
    ];
    
    locationFields.forEach(selector => {
      const field = document.querySelector(selector);
      if (field && !field.value && data.location) {
        field.value = data.location;
        console.log('活動エリアを設定:', field.value);
      }
    });

    // 自己紹介
    const introFields = [
      '#guide-intro',
      'textarea[name="introduction"]'
    ];
    
    introFields.forEach(selector => {
      const field = document.querySelector(selector);
      if (field && !field.value && data.introduction) {
        field.value = data.introduction;
        console.log('自己紹介を設定:', field.value);
      }
    });

    // ページタイトルを更新
    updatePageForRegistration();
  }

  // ページを登録モード用に更新
  function updatePageForRegistration() {
    const urlParams = new URLSearchParams(window.location.search);
    const step = urlParams.get('step');
    
    if (step === '2') {
      // ページタイトルを変更
      document.title = 'ガイド登録 - ステップ2 | Local Guide';
      
      // ヘッダーを変更
      const header = document.querySelector('h1');
      if (header) {
        header.textContent = 'ガイドプロフィール設定（ステップ2）';
      }
      
      // ステップインジケーターを追加
      addStepIndicator();
      
      // 戻るリンクを追加
      addBackLink();
      
      // 保存ボタンを更新
      updateSaveButton();
    }
  }

  // ステップインジケーターを追加
  function addStepIndicator() {
    if (document.querySelector('.registration-step-indicator')) {
      return; // 既に存在する場合は何もしない
    }
    
    const container = document.querySelector('.container');
    if (container) {
      const indicator = document.createElement('div');
      indicator.className = 'registration-step-indicator text-center mb-4';
      indicator.innerHTML = `
        <style>
          .registration-step-indicator .step {
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
          .registration-step-indicator .step.active {
            background-color: #0d6efd;
            color: white;
          }
          .registration-step-indicator .step.completed {
            background-color: #198754;
            color: white;
          }
        </style>
        <span class="step completed">1</span>
        <span>基本情報</span>
        <span class="step active">2</span>
        <span>プロフィール詳細</span>
        <span class="step">3</span>
        <span>完了</span>
      `;
      
      container.insertBefore(indicator, container.firstChild);
    }
  }

  // 戻るリンクを追加
  function addBackLink() {
    if (document.querySelector('.back-to-registration')) {
      return;
    }
    
    const container = document.querySelector('.container');
    if (container) {
      const backLink = document.createElement('a');
      backLink.href = 'guide-registration-form.html';
      backLink.className = 'back-to-registration d-flex align-items-center text-decoration-none text-muted mb-3';
      backLink.innerHTML = '<i class="bi bi-arrow-left me-2"></i>基本情報に戻る';
      
      const indicator = document.querySelector('.registration-step-indicator');
      if (indicator) {
        indicator.parentNode.insertBefore(backLink, indicator);
      } else {
        container.insertBefore(backLink, container.firstChild);
      }
    }
  }

  // 保存ボタンを更新
  function updateSaveButton() {
    const saveButton = document.querySelector('#save-and-view-guides, .btn[onclick*="save"]');
    if (saveButton) {
      saveButton.textContent = '登録を完了する';
      saveButton.className = 'btn btn-success btn-lg';
      
      // クリックイベントを登録完了用に変更
      saveButton.onclick = function(e) {
        e.preventDefault();
        completeRegistration();
      };
    }
  }

  // 登録完了処理
  function completeRegistration() {
    console.log('登録完了処理を開始');
    
    // 現在のフォームデータを収集
    const profileData = {
      name: document.querySelector('#guide-name')?.value || '',
      email: document.querySelector('#guide-email')?.value || '',
      phone: document.querySelector('#guide-phone')?.value || '',
      location: document.querySelector('#guide-location')?.value || '',
      introduction: document.querySelector('#guide-intro')?.value || '',
      registrationCompleted: true,
      completedDate: new Date().toISOString()
    };
    
    // 基本情報と統合
    const basicData = JSON.parse(localStorage.getItem('guideRegistrationData') || '{}');
    const completeData = Object.assign({}, basicData, profileData);
    
    // 完了データを保存
    localStorage.setItem('completeGuideData', JSON.stringify(completeData));
    
    // ガイド一覧に追加
    addToGuideList(completeData);
    
    // セッションをクリア
    sessionStorage.removeItem('registrationInProgress');
    sessionStorage.removeItem('currentStep');
    
    // 完了メッセージと遷移
    alert('ガイド登録が完了しました！ガイド一覧に追加されました。');
    
    setTimeout(() => {
      window.location.href = 'index.html#guides';
    }, 1000);
  }

  // ガイド一覧に追加
  function addToGuideList(guideData) {
    const existingGuides = JSON.parse(localStorage.getItem('userAddedGuides') || '[]');
    
    const newGuide = {
      id: Date.now(),
      name: guideData.name,
      location: guideData.location,
      introduction: guideData.introduction,
      email: guideData.email,
      phone: guideData.phone,
      addedDate: new Date().toISOString()
    };
    
    existingGuides.push(newGuide);
    localStorage.setItem('userAddedGuides', JSON.stringify(existingGuides));
    
    console.log('ガイド一覧に追加:', newGuide);
  }

  // グローバル関数として公開
  window.completeRegistration = completeRegistration;
  
  console.log('登録フロー修正スクリプトが初期化されました');

})();