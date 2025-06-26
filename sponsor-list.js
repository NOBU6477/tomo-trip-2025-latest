/**
 * 協賛店一覧ページの機能
 * 登録された協賛店の表示と管理
 */

(function() {
  'use strict';
  
  console.log('協賛店一覧スクリプト開始');
  
  // 業種の日本語表示
  const storeTypeLabels = {
    restaurant: 'レストラン',
    cafe: 'カフェ',
    hotel: 'ホテル・宿泊施設',
    shop: 'ショップ・小売店',
    activity: 'アクティビティ・体験',
    transportation: '交通・移動',
    other: 'その他'
  };
  
  // 協賛店データを読み込み
  function loadSponsorData() {
    try {
      const sponsorData = localStorage.getItem('sponsorData');
      return sponsorData ? JSON.parse(sponsorData) : [];
    } catch (error) {
      console.error('協賛店データ読み込みエラー:', error);
      return [];
    }
  }
  
  // 協賛店カードを生成
  function createSponsorCard(sponsor) {
    const statusClass = sponsor.status === 'approved' ? 'status-approved' : 'status-pending';
    const statusText = sponsor.status === 'approved' ? '承認済み' : '審査中';
    
    return `
      <div class="col-lg-6 col-xl-4">
        <div class="sponsor-card">
          <!-- ステータスと編集バッジ -->
          <span class="status-badge ${statusClass}">${statusText}</span>
          <div class="edit-badge">
            <button class="btn btn-light btn-sm" onclick="editSponsor('${sponsor.id}')">
              <i class="bi bi-pencil"></i> 編集
            </button>
          </div>
          
          <!-- 写真セクション -->
          ${sponsor.photos && sponsor.photos.length > 0 ? `
            <div class="sponsor-photo-section">
              <div id="carousel${sponsor.id}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                  ${sponsor.photos.map((photo, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                      <img src="${photo}" class="d-block w-100">
                    </div>
                  `).join('')}
                </div>
                ${sponsor.photos.length > 1 ? `
                  <button class="carousel-control-prev" type="button" data-bs-target="#carousel${sponsor.id}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carousel${sponsor.id}" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                  </button>
                ` : ''}
              </div>
              
              <!-- 店舗名オーバーレイ -->
              <div class="sponsor-overlay">
                <div class="sponsor-name-overlay">${sponsor.storeName}</div>
                <div class="sponsor-type-overlay">${storeTypeLabels[sponsor.storeType] || sponsor.storeType}</div>
              </div>
            </div>
          ` : `
            <div class="photo-placeholder">
              <i class="bi bi-shop"></i>
            </div>
            <div class="sponsor-overlay">
              <div class="sponsor-name-overlay">${sponsor.storeName}</div>
              <div class="sponsor-type-overlay">${storeTypeLabels[sponsor.storeType] || sponsor.storeType}</div>
            </div>
          `}
          
          <!-- コンテンツセクション -->
          <div class="sponsor-content">
          
          ${sponsor.description ? `
            <div class="sponsor-description">
              ${sponsor.description}
            </div>
          ` : ''}
          
          ${sponsor.referredBy ? `
            <div class="referral-info">
              <small class="text-primary">
                <i class="bi bi-person-check"></i> 
                ガイド紹介による登録 (紹介コード: ${sponsor.referredBy.referralCode})
              </small>
            </div>
          ` : ''}
          
          ${sponsor.benefits ? `
            <div class="sponsor-benefits">
              <h6><i class="bi bi-gift"></i> 観光客向け特典</h6>
              <div>${sponsor.benefits}</div>
            </div>
          ` : ''}
          
          <div class="sponsor-contact">
            <div class="contact-item clickable address-item" onclick="showMap('${sponsor.storeName}', '${sponsor.address}')">
              <i class="bi bi-geo-alt"></i>
              <span class="address-link">${sponsor.address}</span>
              <small class="text-muted ms-2">タップで地図表示</small>
            </div>
            ${sponsor.phone ? `
              <div class="contact-item clickable">
                <i class="bi bi-telephone"></i>
                <a href="tel:${sponsor.phone.replace(/[^0-9+]/g, '')}" class="phone-link">${sponsor.phone}</a>
                <small class="text-muted ms-2">タップで電話</small>
              </div>
            ` : ''}
            ${sponsor.website ? `
              <div class="contact-item clickable">
                <i class="bi bi-globe"></i>
                <a href="${sponsor.website}" target="_blank" class="text-decoration-none">ウェブサイト</a>
                <small class="text-muted ms-2">タップで開く</small>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  // 流れるロゴバーを生成
  function createFloatingLogos(sponsors) {
    const logoScroll = document.getElementById('logoScroll');
    const approvedSponsors = sponsors.filter(s => s.status === 'approved');
    
    if (approvedSponsors.length === 0) {
      logoScroll.innerHTML = '<div class="text-center w-100 text-muted">承認済み協賛店のロゴが表示されます</div>';
      return;
    }
    
    // ロゴを3回繰り返して滑らかなループを作る
    const logos = approvedSponsors.concat(approvedSponsors, approvedSponsors);
    
    logoScroll.innerHTML = logos.map(sponsor => 
      `<img src="${sponsor.logo}" alt="${sponsor.storeName}" class="floating-logo">`
    ).join('');
  }
  
  // 協賛店一覧を表示
  function displaySponsors() {
    const sponsors = loadSponsorData();
    const sponsorList = document.getElementById('sponsorList');
    const emptyState = document.getElementById('emptyState');
    
    if (sponsors.length === 0) {
      sponsorList.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }
    
    sponsorList.innerHTML = sponsors.map(createSponsorCard).join('');
    createFloatingLogos(sponsors);
    
    emptyState.style.display = 'none';
    sponsorList.style.display = 'flex';
  }
  
  // サンプルデータを追加（初回のみ）
  function addSampleData() {
    const existingData = loadSponsorData();
    if (existingData.length > 0) return;
    
    const sampleSponsors = [
      {
        id: 'sponsor_sample_1',
        storeName: '桜カフェ',
        storeType: 'cafe',
        contactName: '田中太郎',
        contactEmail: 'sakura@example.com',
        phone: '03-1234-5678',
        website: 'https://sakura-cafe.jp',
        address: '東京都渋谷区桜丘町1-1',
        description: '季節の桜をモチーフにした美しいカフェです。手作りケーキと香り高いコーヒーをお楽しみいただけます。',
        benefits: '観光客の方には10%割引、英語メニューもご用意しています。',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjk5Y2Q7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY2YmE2O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2EpIiByeD0iMTUiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7moYw8L3RleHQ+PC9zdmc+',
        photos: [
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImNhZmUiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY1ZjU7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmZlYmVkO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2NhZmUpIi8+PHRleHQgeD0iMjAwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZjZiNmIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuahzOOCq+ODleOCpzwvdGV4dD48L3N2Zz4=',
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImNha2UiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmY4ZTc7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmZmMGQ2O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2Nha2UpIi8+PHRleHQgeD0iMjAwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmE3MjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuaJi+S9nOOCseODvOOCrewvdGV4dD48L3N2Zz4='
        ],
        businessHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '09:00', close: '22:00' },
          sunday: { open: '09:00', close: '18:00' }
        },
        registrationDate: new Date().toISOString(),
        status: 'approved'
      },
      {
        id: 'sponsor_sample_2',
        storeName: '富士山ホテル',
        storeType: 'hotel',
        contactName: '山田花子',
        contactEmail: 'fuji@example.com',
        phone: '055-1234-5678',
        website: 'https://fuji-hotel.jp',
        address: '静岡県富士宮市富士山1-1',
        description: '富士山を一望できる絶景ホテル。温泉と日本料理でおもてなしいたします。',
        benefits: 'TomoTripガイド同行のお客様は宿泊料金20%割引、無料温泉入浴券プレゼント。',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNzY0YmEyO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2IpIiByeD0iMTUiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lrownPInmoYw8L3RleHQ+PC9zdmc+',
        photos: [
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Im1vdW50YWluIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojODdjZWVhO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMwNjE5MjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNtb3VudGFpbikiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuWvjOWjq+WxsTwvdGV4dD48L3N2Zz4=',
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Im9uc2VuIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmZlYmU2O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmZDFkMTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNvbnNlbikiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzMzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5ris5rOJPC90ZXh0Pjwvc3ZnPg=='
        ],
        businessHours: {
          monday: { open: '15:00', close: '23:00' },
          tuesday: { open: '15:00', close: '23:00' },
          wednesday: { open: '15:00', close: '23:00' },
          thursday: { open: '15:00', close: '23:00' },
          friday: { open: '15:00', close: '24:00' },
          saturday: { open: '12:00', close: '24:00' },
          sunday: { open: '12:00', close: '22:00' }
        },
        registrationDate: new Date().toISOString(),
        status: 'approved'
      }
    ];
    
    localStorage.setItem('sponsorData', JSON.stringify(sampleSponsors));
  }
  
  // 地図表示機能
  window.showMap = function(storeName, address) {
    const mapModal = document.getElementById('mapModal');
    const mapTitle = document.getElementById('mapTitle');
    const mapAddress = document.getElementById('mapAddress');
    const openGoogleMaps = document.getElementById('openGoogleMaps');
    
    mapTitle.textContent = storeName;
    mapAddress.textContent = address;
    
    // Google マップ用URLを生成
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    
    openGoogleMaps.onclick = function() {
      window.open(googleMapsUrl, '_blank');
    };
    
    mapModal.style.display = 'flex';
    
    // モーダル外をクリックで閉じる
    mapModal.onclick = function(e) {
      if (e.target === mapModal) {
        closeMapModal();
      }
    };
  };
  
  // 地図モーダルを閉じる
  window.closeMapModal = function() {
    const mapModal = document.getElementById('mapModal');
    mapModal.style.display = 'none';
  };
  
  // 営業時間をフォーマット
  function formatBusinessHours(businessHours) {
    if (!businessHours || Object.keys(businessHours).length === 0) {
      return '<span class="text-muted">営業時間未設定</span>';
    }
    
    const dayLabels = {
      monday: '月',
      tuesday: '火',
      wednesday: '水',
      thursday: '木',
      friday: '金',
      saturday: '土',
      sunday: '日'
    };
    
    const hoursHtml = Object.keys(dayLabels).map(day => {
      const hours = businessHours[day];
      if (hours && hours.open && hours.close) {
        return `
          <div class="hours-item">
            <span>${dayLabels[day]}</span>
            <span>${hours.open} - ${hours.close}</span>
          </div>
        `;
      }
      return `
        <div class="hours-item">
          <span>${dayLabels[day]}</span>
          <span class="text-muted">定休日</span>
        </div>
      `;
    }).join('');
    
    return hoursHtml;
  }
  
  // 協賛店編集ページに移動
  window.editSponsor = function(sponsorId) {
    window.location.href = `sponsor-management.html?id=${sponsorId}`;
  };
  
  // ESCキーで地図モーダルを閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMapModal();
    }
  });
  
  // 初期化
  document.addEventListener('DOMContentLoaded', function() {
    addSampleData(); // サンプルデータ追加
    displaySponsors();
  });
  
})();