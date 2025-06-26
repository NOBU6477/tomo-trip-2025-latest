/**
 * 協賛店自己管理システム
 * 店舗情報の編集、写真管理、プレビュー機能
 */

(function() {
  'use strict';
  
  console.log('協賛店管理システム開始');
  
  let currentSponsorId = null;
  let sponsorPhotos = [];
  
  // 現在の協賛店IDを取得（実際の実装では認証システムから取得）
  function getCurrentSponsorId() {
    // URLパラメータまたはローカルストレージから取得
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('id');
    
    if (paramId) {
      localStorage.setItem('currentSponsorId', paramId);
      return paramId;
    }
    
    return localStorage.getItem('currentSponsorId') || 'sponsor_sample_1';
  }
  
  // 協賛店データを取得
  function getSponsorData(sponsorId) {
    try {
      const sponsorData = JSON.parse(localStorage.getItem('sponsorData') || '[]');
      return sponsorData.find(s => s.id === sponsorId);
    } catch (error) {
      console.error('協賛店データ取得エラー:', error);
      return null;
    }
  }
  
  // 協賛店データを更新
  function updateSponsorData(sponsorId, updatedData) {
    try {
      const sponsorData = JSON.parse(localStorage.getItem('sponsorData') || '[]');
      const index = sponsorData.findIndex(s => s.id === sponsorId);
      
      if (index !== -1) {
        sponsorData[index] = { ...sponsorData[index], ...updatedData };
        localStorage.setItem('sponsorData', JSON.stringify(sponsorData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('協賛店データ更新エラー:', error);
      return false;
    }
  }
  
  // フォームに現在のデータを読み込み
  function loadSponsorDataToForm() {
    const sponsorId = getCurrentSponsorId();
    const sponsor = getSponsorData(sponsorId);
    
    if (!sponsor) {
      showStatus('協賛店データが見つかりません', 'error');
      return;
    }
    
    // 基本情報
    document.getElementById('editStoreName').value = sponsor.storeName || '';
    document.getElementById('editStoreType').value = sponsor.storeType || '';
    document.getElementById('editPhone').value = sponsor.phone || '';
    document.getElementById('editWebsite').value = sponsor.website || '';
    document.getElementById('editAddress').value = sponsor.address || '';
    document.getElementById('editDescription').value = sponsor.description || '';
    document.getElementById('editBenefits').value = sponsor.benefits || '';
    
    // 写真データ読み込み
    sponsorPhotos = sponsor.photos || [];
    renderPhotoGallery();
    
    // 営業時間読み込み
    loadBusinessHours(sponsor.businessHours);
  }
  
  // 営業時間読み込み
  function loadBusinessHours(businessHours) {
    if (!businessHours) return;
    
    Object.keys(businessHours).forEach(day => {
      const dayCard = document.querySelector(`[data-day="${day}"]`);
      if (dayCard && businessHours[day]) {
        const inputs = dayCard.querySelectorAll('input[type="time"]');
        if (inputs.length >= 2) {
          inputs[0].value = businessHours[day].open || '';
          inputs[1].value = businessHours[day].close || '';
        }
        
        if (businessHours[day].open || businessHours[day].close) {
          dayCard.classList.add('selected');
          dayCard.querySelector('.time-inputs').classList.add('active');
        }
      }
    });
  }
  
  // 写真ギャラリー表示
  function renderPhotoGallery() {
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '';
    
    // 既存の写真表示
    sponsorPhotos.forEach((photo, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'photo-item';
      photoItem.innerHTML = `
        <img src="${photo}" alt="店舗写真${index + 1}">
        <button class="photo-delete" onclick="deletePhoto(${index})">
          <i class="bi bi-trash"></i>
        </button>
      `;
      gallery.appendChild(photoItem);
    });
    
    // 新規追加用スロット（最大6枚まで）
    if (sponsorPhotos.length < 6) {
      const addButton = document.createElement('div');
      addButton.className = 'photo-item';
      addButton.onclick = () => document.getElementById('photoInput').click();
      addButton.innerHTML = `
        <div class="photo-upload">
          <i class="bi bi-plus-circle"></i>
          <span>写真を追加</span>
        </div>
      `;
      gallery.appendChild(addButton);
    }
  }
  
  // 写真削除
  window.deletePhoto = function(index) {
    if (confirm('この写真を削除しますか？')) {
      sponsorPhotos.splice(index, 1);
      renderPhotoGallery();
      showStatus('写真を削除しました', 'success');
    }
  };
  
  // 写真アップロード処理
  function setupPhotoUpload() {
    const photoInput = document.getElementById('photoInput');
    
    photoInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        if (sponsorPhotos.length >= 6) {
          showStatus('写真は最大6枚までです', 'error');
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          showStatus('ファイルサイズは5MB以下にしてください', 'error');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
          sponsorPhotos.push(e.target.result);
          renderPhotoGallery();
          showStatus('写真を追加しました', 'success');
        };
        reader.readAsDataURL(file);
      });
      
      // ファイル入力をリセット
      photoInput.value = '';
    });
  }
  
  // 営業時間設定
  function setupBusinessHours() {
    const dayCards = document.querySelectorAll('.day-card');
    
    dayCards.forEach(card => {
      card.addEventListener('click', function() {
        const timeInputs = this.querySelector('.time-inputs');
        
        if (this.classList.contains('selected')) {
          // 選択解除
          this.classList.remove('selected');
          timeInputs.classList.remove('active');
          timeInputs.querySelectorAll('input').forEach(input => input.value = '');
        } else {
          // 選択
          this.classList.add('selected');
          timeInputs.classList.add('active');
          // デフォルト時間設定
          const inputs = timeInputs.querySelectorAll('input');
          if (!inputs[0].value) inputs[0].value = '10:00';
          if (!inputs[1].value) inputs[1].value = '18:00';
        }
      });
    });
  }
  
  // フォーム送信処理
  function setupFormSubmission() {
    const form = document.getElementById('sponsorEditForm');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        storeName: document.getElementById('editStoreName').value,
        storeType: document.getElementById('editStoreType').value,
        phone: document.getElementById('editPhone').value,
        website: document.getElementById('editWebsite').value,
        address: document.getElementById('editAddress').value,
        description: document.getElementById('editDescription').value,
        benefits: document.getElementById('editBenefits').value,
        photos: sponsorPhotos,
        businessHours: getBusinessHoursData(),
        lastUpdated: new Date().toISOString()
      };
      
      const sponsorId = getCurrentSponsorId();
      if (updateSponsorData(sponsorId, formData)) {
        showStatus('更新を保存しました', 'success');
      } else {
        showStatus('更新に失敗しました', 'error');
      }
    });
  }
  
  // 営業時間データを取得
  function getBusinessHoursData() {
    const businessHours = {};
    const dayCards = document.querySelectorAll('.day-card');
    
    dayCards.forEach(card => {
      const day = card.dataset.day;
      const inputs = card.querySelectorAll('input[type="time"]');
      
      if (card.classList.contains('selected') && inputs.length >= 2) {
        businessHours[day] = {
          open: inputs[0].value,
          close: inputs[1].value
        };
      }
    });
    
    return businessHours;
  }
  
  // プレビュー機能
  window.previewChanges = function() {
    const previewSection = document.getElementById('previewSection');
    const previewContent = document.getElementById('previewContent');
    
    const formData = {
      storeName: document.getElementById('editStoreName').value,
      storeType: document.getElementById('editStoreType').value,
      phone: document.getElementById('editPhone').value,
      website: document.getElementById('editWebsite').value,
      address: document.getElementById('editAddress').value,
      description: document.getElementById('editDescription').value,
      benefits: document.getElementById('editBenefits').value,
      photos: sponsorPhotos
    };
    
    const storeTypeLabels = {
      restaurant: 'レストラン',
      cafe: 'カフェ',
      hotel: 'ホテル・宿泊施設',
      shop: 'ショップ・小売店',
      activity: 'アクティビティ・体験',
      transportation: '交通・移動',
      other: 'その他'
    };
    
    previewContent.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          ${formData.photos.length > 0 ? `
            <div id="photoCarousel" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                ${formData.photos.map((photo, index) => `
                  <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${photo}" class="d-block w-100" style="height: 200px; object-fit: cover; border-radius: 10px;">
                  </div>
                `).join('')}
              </div>
              ${formData.photos.length > 1 ? `
                <button class="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
                  <span class="carousel-control-next-icon"></span>
                </button>
              ` : ''}
            </div>
          ` : `
            <div style="height: 200px; background: #f8f9fa; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #666;">
              <i class="bi bi-image" style="font-size: 3rem;"></i>
            </div>
          `}
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h4>${formData.storeName}</h4>
              <p class="text-muted mb-0">${storeTypeLabels[formData.storeType] || formData.storeType}</p>
            </div>
          </div>
          
          ${formData.description ? `
            <p style="line-height: 1.6; margin-bottom: 15px;">${formData.description}</p>
          ` : ''}
          
          ${formData.benefits ? `
            <div style="background: linear-gradient(135deg, #fff5f5, #f0f8ff); padding: 15px; border-radius: 10px; border-left: 4px solid #ff6b6b; margin-bottom: 15px;">
              <h6 style="color: #ff6b6b; font-weight: 700; margin-bottom: 8px;">
                <i class="bi bi-gift"></i> 観光客向け特典
              </h6>
              <div>${formData.benefits}</div>
            </div>
          ` : ''}
          
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
            <div style="display: flex; align-items: center; gap: 5px; color: #666;">
              <i class="bi bi-geo-alt"></i>
              <span>${formData.address}</span>
            </div>
            ${formData.phone ? `
              <div style="display: flex; align-items: center; gap: 5px; color: #666;">
                <i class="bi bi-telephone"></i>
                <span>${formData.phone}</span>
              </div>
            ` : ''}
            ${formData.website ? `
              <div style="display: flex; align-items: center; gap: 5px; color: #666;">
                <i class="bi bi-globe"></i>
                <span>ウェブサイト</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    
    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
  };
  
  // ステータス表示
  function showStatus(message, type) {
    const indicator = document.getElementById('statusIndicator');
    indicator.textContent = message;
    indicator.className = `status-indicator status-${type}`;
    indicator.style.display = 'block';
    
    setTimeout(() => {
      indicator.style.display = 'none';
    }, 3000);
  }
  
  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    currentSponsorId = getCurrentSponsorId();
    setupPhotoUpload();
    setupBusinessHours();
    setupFormSubmission();
    loadSponsorDataToForm();
  });
  
})();