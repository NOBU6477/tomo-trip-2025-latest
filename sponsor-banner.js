/**
 * 協賛店広告バナー機能
 * 右から左へのスクロール広告を実装
 */

(function() {
  'use strict';
  
  // 協賛店データ
  const sponsorData = [
    {
      name: '海の家レストラン',
      logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=60&fit=crop',
      offer: '20%OFF',
      category: 'グルメ'
    },
    {
      name: '山田温泉ホテル',
      logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=60&fit=crop',
      offer: '特別価格',
      category: '宿泊'
    },
    {
      name: 'サクラ観光バス',
      logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=60&fit=crop',
      offer: '送迎無料',
      category: '交通'
    },
    {
      name: '伝統工芸体験館',
      logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=60&fit=crop',
      offer: '体験割引',
      category: '体験'
    },
    {
      name: '地元特産品店',
      logo: 'https://images.unsplash.com/photo-1543083115-638c32cd3d58?w=100&h=60&fit=crop',
      offer: 'お土産10%OFF',
      category: 'ショッピング'
    },
    {
      name: 'カフェ桜',
      logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=60&fit=crop',
      offer: 'ドリンク1杯無料',
      category: 'カフェ'
    },
    {
      name: '釣り船太郎',
      logo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=60&fit=crop',
      offer: '初回半額',
      category: 'アクティビティ'
    },
    {
      name: 'レンタル自転車',
      logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=60&fit=crop',
      offer: '1日レンタル',
      category: 'レンタル'
    }
  ];
  
  /**
   * スポンサーバナーを初期化
   */
  function initSponsorBanner() {
    // 人気のガイドセクションを探す
    const popularGuidesSection = document.querySelector('.popular-guides, #popular-guides, [data-section="popular-guides"]');
    if (!popularGuidesSection) {
      console.log('人気のガイドセクションが見つかりません');
      return;
    }
    
    // スポンサーバナーを作成
    const bannerHTML = createSponsorBannerHTML();
    
    // バナーを人気のガイドセクションの前に挿入
    popularGuidesSection.insertAdjacentHTML('beforebegin', bannerHTML);
    
    console.log('協賛店広告バナーを追加しました');
  }
  
  /**
   * スポンサーバナーのHTMLを生成
   */
  function createSponsorBannerHTML() {
    // スポンサー項目を2回繰り返してシームレスなループを作成
    const sponsorItems = [...sponsorData, ...sponsorData].map(sponsor => 
      `<div class="sponsor-item">
         <img src="${sponsor.logo}" alt="${sponsor.name}" class="sponsor-logo" onerror="this.style.display='none'">
         <span class="sponsor-text">${sponsor.name}</span>
         <span class="sponsor-offer">${sponsor.offer}</span>
       </div>`
    ).join('');
    
    return `
      <div class="sponsor-banner">
        <div class="sponsor-scroll">
          ${sponsorItems}
        </div>
      </div>
    `;
  }
  
  /**
   * バナーのクリックイベントを設定
   */
  function setupBannerEvents() {
    document.addEventListener('click', function(e) {
      if (e.target.closest('.sponsor-item')) {
        const sponsorItem = e.target.closest('.sponsor-item');
        const sponsorName = sponsorItem.querySelector('.sponsor-text').textContent;
        
        // 実際のアプリでは協賛店の詳細ページに遷移
        console.log(`協賛店クリック: ${sponsorName}`);
        // alert(`${sponsorName}の詳細ページに遷移します`);
      }
    });
  }
  
  /**
   * ページ読み込み完了後に初期化
   */
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initSponsorBanner, 100);
        setupBannerEvents();
      });
    } else {
      setTimeout(initSponsorBanner, 100);
      setupBannerEvents();
    }
  }
  
  // 初期化実行
  initialize();
  
})();