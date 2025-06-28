/**
 * 協賛店一覧ページ - シンプル版
 * 確実に動作する最小限の実装
 */

console.log('sponsor-list-simple.js 読み込み開始');

// 協賛店詳細ページに移動（グローバル関数）
window.viewSponsorDetail = function(sponsorId) {
  console.log('詳細ページに移動:', sponsorId);
  window.location.href = `sponsor-detail.html?id=${sponsorId}`;
};

// 初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM読み込み完了 - シンプル版初期化開始');
  
  // 要素の存在確認
  const sponsorList = document.getElementById('sponsorList');
  const emptyState = document.getElementById('emptyState');
  
  if (!sponsorList) {
    console.error('sponsorList要素が見つかりません');
    return;
  }
  
  console.log('要素確認完了');
  
  // サンプルデータ作成
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
      photos: [],
      operatingHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '10:00', close: '20:00', closed: false },
        sunday: { open: '10:00', close: '20:00', closed: false }
      },
      status: 'approved'
    },
    {
      id: 'sponsor_sample_2',
      storeName: '富士山ホテル',
      storeType: 'hotel',
      contactName: '山田花子',
      contactEmail: 'fujisan@example.com',
      phone: '0555-123-4567',
      website: 'https://fujisan-hotel.jp',
      address: '山梨県富士吉田市新西原5-6-1',
      description: '富士山の絶景を望む温泉ホテルです。四季折々の自然を楽しみながら、ゆったりとした時間をお過ごしいただけます。',
      benefits: '外国人観光客割引15%、英語対応スタッフ常駐、富士山ガイドツアー無料',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NjdlZWE7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNzY0YmEyO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2IpIiByeD0iMTUiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lhYzlsbE8L3RleHQ+PC9zdmc+',
      photos: [],
      operatingHours: {
        monday: { open: '24:00', close: '24:00', closed: false },
        tuesday: { open: '24:00', close: '24:00', closed: false },
        wednesday: { open: '24:00', close: '24:00', closed: false },
        thursday: { open: '24:00', close: '24:00', closed: false },
        friday: { open: '24:00', close: '24:00', closed: false },
        saturday: { open: '24:00', close: '24:00', closed: false },
        sunday: { open: '24:00', close: '24:00', closed: false }
      },
      status: 'approved'
    }
  ];
  
  console.log('サンプルデータ作成完了:', sampleSponsors.length, '件');
  
  // カード作成関数
  function createSponsorCard(sponsor) {
    return `
      <div class="col-lg-6 col-xl-4 mb-4">
        <div class="sponsor-card h-100">
          <div class="sponsor-photo-section">
            <div class="photo-placeholder">
              <img src="${sponsor.logo}" alt="${sponsor.storeName}" class="sponsor-logo">
              <div class="sponsor-name-overlay">
                <h5>${sponsor.storeName}</h5>
              </div>
            </div>
          </div>
          
          <div class="sponsor-content">
            <div class="mb-3">
              <p class="sponsor-description">${sponsor.description}</p>
            </div>
            
            <div class="benefits-highlight mb-3">
              <h6><i class="bi bi-gift"></i> 特典</h6>
              <p class="mb-0">${sponsor.benefits}</p>
            </div>
            
            <div class="sponsor-contact">
              <div class="contact-item">
                <i class="bi bi-geo-alt"></i>
                <span>${sponsor.address}</span>
              </div>
              <div class="contact-item">
                <i class="bi bi-telephone"></i>
                <span>${sponsor.phone}</span>
              </div>
              ${sponsor.website ? `
                <div class="contact-item">
                  <i class="bi bi-globe"></i>
                  <span>${sponsor.website}</span>
                </div>
              ` : ''}
            </div>
            
            <div class="sponsor-actions mt-3">
              <button class="btn btn-primary btn-sm" onclick="viewSponsorDetail('${sponsor.id}')">
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // 協賛店を表示
  function displaySponsors() {
    console.log('協賛店表示開始');
    
    if (sampleSponsors.length === 0) {
      console.log('データなし - 空状態表示');
      sponsorList.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    
    console.log('カード生成中...');
    const cardsHtml = sampleSponsors.map(sponsor => {
      console.log('カード生成:', sponsor.storeName);
      return createSponsorCard(sponsor);
    }).join('');
    
    sponsorList.innerHTML = cardsHtml;
    sponsorList.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';
    
    console.log('協賛店表示完了');
    
    // ボタン確認
    setTimeout(() => {
      const buttons = document.querySelectorAll('[onclick*="viewSponsorDetail"]');
      console.log('詳細ボタン数:', buttons.length);
    }, 100);
  }
  
  // 表示実行
  displaySponsors();
  
  console.log('シンプル版初期化完了');
});

console.log('sponsor-list-simple.js 読み込み完了');