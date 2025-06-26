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
          <div class="d-flex align-items-start mb-3">
            <img src="${sponsor.logo}" alt="${sponsor.storeName}" class="sponsor-logo me-3">
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="sponsor-name">${sponsor.storeName}</div>
                  <div class="sponsor-type">${storeTypeLabels[sponsor.storeType] || sponsor.storeType}</div>
                </div>
                <span class="status-badge ${statusClass}">${statusText}</span>
              </div>
            </div>
          </div>
          
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