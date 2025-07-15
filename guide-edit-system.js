/**
 * ガイド編集システム
 * 基本情報登録後の詳細編集機能を実装
 */

(function() {
  'use strict';
  
  console.log('✏️ ガイド編集システム開始');
  
  let selectedSpecialties = [];
  let currentGuideData = null;
  
  // 初期化
  function initialize() {
    loadBasicInfo();
    setupProfilePhotoUpload();
    setupFormSubmission();
    setupSpecialtySystem();
  }
  
  // 基本情報を読み込み
  function loadBasicInfo() {
    // URLパラメータまたはlocalStorageから基本情報を取得
    const urlParams = new URLSearchParams(window.location.search);
    const guideId = urlParams.get('id');
    
    if (guideId) {
      currentGuideData = JSON.parse(localStorage.getItem(`guide_${guideId}`) || '{}');
    } else {
      // 新規登録の場合はsessionStorageから取得
      currentGuideData = JSON.parse(sessionStorage.getItem('newGuideData') || '{}');
    }
    
    if (currentGuideData) {
      // フォームに基本情報を設定
      document.getElementById('guide-name').value = currentGuideData.name || '';
      document.getElementById('guide-username').value = currentGuideData.username || '';
      document.getElementById('guide-email').value = currentGuideData.email || '';
      document.getElementById('guide-location').value = currentGuideData.location || '';
      document.getElementById('guide-languages').value = currentGuideData.languages || '';
      
      // プロフィール写真があれば表示
      if (currentGuideData.profilePhoto) {
        document.getElementById('profile-preview').src = currentGuideData.profilePhoto;
      }
      
      // 既存の詳細情報があれば設定
      if (currentGuideData.bio) {
        document.getElementById('guide-bio').value = currentGuideData.bio;
      }
      if (currentGuideData.experience) {
        document.getElementById('guide-experience').value = currentGuideData.experience;
      }
      if (currentGuideData.hourlyRate) {
        document.getElementById('guide-hourly-rate').value = currentGuideData.hourlyRate;
      }
      if (currentGuideData.groupRate) {
        document.getElementById('guide-group-rate').value = currentGuideData.groupRate;
      }
      if (currentGuideData.availableStart) {
        document.getElementById('available-start').value = currentGuideData.availableStart;
      }
      if (currentGuideData.availableEnd) {
        document.getElementById('available-end').value = currentGuideData.availableEnd;
      }
      
      // 得意分野があれば設定
      if (currentGuideData.specialties) {
        selectedSpecialties = currentGuideData.specialties;
        updateSpecialtyDisplay();
      }
    }
  }
  
  // プロフィール写真アップロード設定
  function setupProfilePhotoUpload() {
    const fileInput = document.getElementById('profile-photo');
    const preview = document.getElementById('profile-preview');
    
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          preview.src = e.target.result;
          
          // データを保存
          if (currentGuideData) {
            currentGuideData.profilePhoto = e.target.result;
            saveCurrentData();
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  // 得意分野システム設定
  function setupSpecialtySystem() {
    const customInput = document.getElementById('custom-specialty');
    
    customInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSpecialty(this.value.trim());
        this.value = '';
      }
    });
  }
  
  // 得意分野を追加
  function addSpecialty(specialty) {
    if (specialty && !selectedSpecialties.includes(specialty)) {
      selectedSpecialties.push(specialty);
      updateSpecialtyDisplay();
      saveCurrentData();
    }
  }
  
  // 得意分野表示更新
  function updateSpecialtyDisplay() {
    const container = document.getElementById('selected-specialties');
    container.innerHTML = '';
    
    selectedSpecialties.forEach(specialty => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML = `
        ${specialty}
        <i class="bi bi-x-circle ms-1" onclick="removeSpecialty('${specialty}')" style="cursor: pointer;"></i>
      `;
      container.appendChild(tag);
    });
  }
  
  // 得意分野を削除
  function removeSpecialty(specialty) {
    selectedSpecialties = selectedSpecialties.filter(s => s !== specialty);
    updateSpecialtyDisplay();
    saveCurrentData();
  }
  
  // キー入力処理
  function handleSpecialtyKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSpecialty(event.target.value.trim());
      event.target.value = '';
    }
  }
  
  // フォーム送信設定
  function setupFormSubmission() {
    const form = document.getElementById('guide-edit-form');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      publishGuide();
    });
  }
  
  // 現在のデータを保存
  function saveCurrentData() {
    if (!currentGuideData) return;
    
    // フォームデータを更新
    currentGuideData.bio = document.getElementById('guide-bio').value;
    currentGuideData.experience = document.getElementById('guide-experience').value;
    currentGuideData.hourlyRate = document.getElementById('guide-hourly-rate').value;
    currentGuideData.groupRate = document.getElementById('guide-group-rate').value;
    currentGuideData.availableStart = document.getElementById('available-start').value;
    currentGuideData.availableEnd = document.getElementById('available-end').value;
    currentGuideData.specialties = selectedSpecialties;
    
    // sessionStorageに保存
    sessionStorage.setItem('newGuideData', JSON.stringify(currentGuideData));
  }
  
  // 下書き保存
  function saveDraft() {
    saveCurrentData();
    showAlert('下書きを保存しました', 'success');
  }
  
  // 公開して完了
  function publishGuide() {
    saveCurrentData();
    
    if (!validateForm()) {
      return;
    }
    
    // ガイドデータを公開状態にして保存
    currentGuideData.status = 'published';
    currentGuideData.publishedAt = new Date().toISOString();
    currentGuideData.id = currentGuideData.id || Date.now().toString();
    
    // localStorageに保存
    localStorage.setItem(`guide_${currentGuideData.id}`, JSON.stringify(currentGuideData));
    
    // 既存のガイドリストに追加
    const existingGuides = JSON.parse(localStorage.getItem('publishedGuides') || '[]');
    const existingIndex = existingGuides.findIndex(g => g.id === currentGuideData.id);
    
    if (existingIndex >= 0) {
      existingGuides[existingIndex] = currentGuideData;
    } else {
      existingGuides.push(currentGuideData);
    }
    
    localStorage.setItem('publishedGuides', JSON.stringify(existingGuides));
    
    // sessionStorageをクリア
    sessionStorage.removeItem('newGuideData');
    
    showAlert('ガイド登録が完了しました！', 'success');
    
    // 2秒後にメインページに戻る
    setTimeout(() => {
      window.location.href = '/?guide_registered=true';
    }, 2000);
  }
  
  // フォームバリデーション
  function validateForm() {
    const bio = document.getElementById('guide-bio').value.trim();
    const hourlyRate = document.getElementById('guide-hourly-rate').value;
    
    if (!bio) {
      showAlert('自己紹介を入力してください', 'danger');
      return false;
    }
    
    if (parseInt(hourlyRate) < 6000) {
      showAlert('時給料金は6,000円以上に設定してください', 'danger');
      return false;
    }
    
    return true;
  }
  
  // 保存して終了
  function saveAndExit() {
    saveCurrentData();
    window.location.href = '/';
  }
  
  // アラート表示
  function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  }
  
  // アラートコンテナ作成
  function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; max-width: 400px; z-index: 9999;';
    document.body.appendChild(container);
    return container;
  }
  
  // グローバル関数として公開
  window.addSpecialty = addSpecialty;
  window.removeSpecialty = removeSpecialty;
  window.handleSpecialtyKeyPress = handleSpecialtyKeyPress;
  window.saveDraft = saveDraft;
  window.saveAndExit = saveAndExit;
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
})();