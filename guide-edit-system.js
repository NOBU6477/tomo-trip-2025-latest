/**
 * ガイド編集ページの機能システム
 * 写真アップロード、データ保存、フォーム処理を統合
 */

(function() {
  'use strict';
  
  let selectedSpecialties = [];
  
  // 写真アップロード処理
  function handlePhotoUpload(input, previewId) {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        if (preview) {
          preview.src = e.target.result;
          preview.style.opacity = '1';
          console.log('写真プレビュー更新完了:', previewId);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // データ読み込み
  function loadGuideData() {
    const registrationData = localStorage.getItem('guideRegistrationData');
    if (registrationData) {
      const data = JSON.parse(registrationData);
      
      // 基本情報を表示
      const guideNameField = document.getElementById('guide-name');
      const guideUsernameField = document.getElementById('guide-username');
      const guideEmailField = document.getElementById('guide-email');
      const guideLocationField = document.getElementById('guide-location');
      const guideLanguagesField = document.getElementById('guide-languages');
      
      if (guideNameField) guideNameField.value = data.name || '';
      if (guideUsernameField) guideUsernameField.value = data.username || '';
      if (guideEmailField) guideEmailField.value = data.email || '';
      if (guideLocationField) guideLocationField.value = data.location || '';
      if (guideLanguagesField) guideLanguagesField.value = data.languages || '';
    }
  }

  // 得意分野追加
  function addSpecialty(specialty) {
    if (!selectedSpecialties.includes(specialty)) {
      selectedSpecialties.push(specialty);
      updateSpecialtiesDisplay();
    }
  }

  // 得意分野表示更新
  function updateSpecialtiesDisplay() {
    const container = document.getElementById('selected-specialties');
    if (container) {
      container.innerHTML = selectedSpecialties.map(specialty => 
        `<span class="tag" onclick="removeSpecialty('${specialty}')">${specialty} <i class="bi bi-x"></i></span>`
      ).join('');
    }
  }

  // 得意分野削除
  function removeSpecialty(specialty) {
    selectedSpecialties = selectedSpecialties.filter(s => s !== specialty);
    updateSpecialtiesDisplay();
  }

  // カスタム得意分野追加
  function handleSpecialtyKeyPress(event) {
    if (event.key === 'Enter') {
      const input = event.target;
      const specialty = input.value.trim();
      if (specialty) {
        addSpecialty(specialty);
        input.value = '';
      }
    }
  }

  // 下書き保存
  function saveDraft() {
    const formData = {
      bio: document.getElementById('guide-bio')?.value || '',
      experience: document.getElementById('guide-experience')?.value || '',
      specialties: selectedSpecialties,
      hourlyRate: document.getElementById('hourly-rate')?.value || '',
      minDuration: document.getElementById('min-duration')?.value || '',
      maxGroupSize: document.getElementById('max-group-size')?.value || ''
    };

    // 既存データと統合
    const existingData = JSON.parse(localStorage.getItem('guideRegistrationData') || '{}');
    const updatedData = { ...existingData, ...formData };
    
    localStorage.setItem('guideRegistrationData', JSON.stringify(updatedData));
    
    alert('下書きが保存されました！');
  }

  // 保存して終了
  function saveAndExit() {
    const formData = {
      bio: document.getElementById('guide-bio')?.value || '',
      experience: document.getElementById('guide-experience')?.value || '',
      specialties: selectedSpecialties,
      hourlyRate: document.getElementById('hourly-rate')?.value || '',
      minDuration: document.getElementById('min-duration')?.value || '',
      maxGroupSize: document.getElementById('max-group-size')?.value || ''
    };

    // 既存データと統合
    const existingData = JSON.parse(localStorage.getItem('guideRegistrationData') || '{}');
    const updatedData = { ...existingData, ...formData };
    
    localStorage.setItem('guideRegistrationData', JSON.stringify(updatedData));
    
    alert('ガイド情報が保存されました！');
    window.location.href = '/';
  }

  // 初期化
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        loadGuideData();
        setupEventListeners();
      });
    } else {
      loadGuideData();
      setupEventListeners();
    }
  }

  // イベントリスナー設定
  function setupEventListeners() {
    // フォーム送信イベント
    const form = document.getElementById('guide-edit-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveAndExit();
      });
    }
  }

  // グローバル関数として公開
  window.handlePhotoUpload = handlePhotoUpload;
  window.addSpecialty = addSpecialty;
  window.removeSpecialty = removeSpecialty;
  window.handleSpecialtyKeyPress = handleSpecialtyKeyPress;
  window.saveDraft = saveDraft;
  window.saveAndExit = saveAndExit;

  // 初期化実行
  initialize();
  
  console.log('✅ ガイド編集システム初期化完了');

})();