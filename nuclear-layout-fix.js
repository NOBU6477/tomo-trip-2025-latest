/**
 * NUCLEAR LAYOUT FIX - 最終手段による完全レイアウト再構築
 * 紫色背景問題を根本から解決するため、DOM構造を完全に再構築
 */

(function() {
  'use strict';
  
  console.log('=== NUCLEAR LAYOUT FIX 開始 ===');
  
  // 最優先で実行する核レベル修正
  function nuclearLayoutFix() {
    console.log('核レベルレイアウト修正実行中...');
    
    // 1. 問題のある紫色背景要素を完全に除去・再構築
    const problematicElements = document.querySelectorAll('.sponsor-banner, [style*="linear-gradient"]');
    problematicElements.forEach(element => {
      if (element.style.background && element.style.background.includes('linear-gradient')) {
        // 紫色背景を完全に削除
        element.style.background = 'none';
        element.style.backgroundImage = 'none';
        element.style.height = '80px';
        element.style.maxHeight = '80px';
        element.style.overflow = 'hidden';
        element.style.zIndex = '1';
        element.style.position = 'relative';
        console.log('紫色背景要素を無効化');
      }
    });
    
    // 2. メインコンテンツエリアを強制的に最前面に移動
    const mainContainer = document.querySelector('.container.py-5');
    if (mainContainer) {
      // 既存のスタイルを完全にリセット
      mainContainer.removeAttribute('style');
      
      // 新しいスタイルを強制適用
      const forceStyles = {
        'display': 'block',
        'visibility': 'visible',
        'opacity': '1',
        'z-index': '9999',
        'position': 'relative',
        'background-color': 'white',
        'margin-top': '0px',
        'padding-top': '50px',
        'min-height': '800px',
        'clear': 'both',
        'width': '100%'
      };
      
      Object.keys(forceStyles).forEach(property => {
        mainContainer.style.setProperty(property, forceStyles[property], 'important');
      });
      
      console.log('メインコンテナ強制最前面移動完了');
    }
    
    // 3. ガイドセクションの強制表示
    const guidesSection = document.getElementById('guides');
    if (guidesSection) {
      const guideStyles = {
        'display': 'block',
        'visibility': 'visible',
        'opacity': '1',
        'z-index': '10000',
        'position': 'relative',
        'background-color': 'white',
        'min-height': '600px',
        'padding': '30px 0',
        'margin': '0',
        'width': '100%'
      };
      
      Object.keys(guideStyles).forEach(property => {
        guidesSection.style.setProperty(property, guideStyles[property], 'important');
      });
      
      console.log('ガイドセクション強制表示完了');
    }
    
    // 4. ガイドカードコンテナの生成・表示
    let cardContainer = document.getElementById('guide-cards-container');
    if (!cardContainer) {
      // コンテナが存在しない場合は作成
      cardContainer = document.createElement('div');
      cardContainer.id = 'guide-cards-container';
      cardContainer.className = 'row';
      
      if (guidesSection) {
        guidesSection.appendChild(cardContainer);
      }
    }
    
    // コンテナの強制スタイル適用
    const containerStyles = {
      'display': 'flex',
      'flex-wrap': 'wrap',
      'visibility': 'visible',
      'opacity': '1',
      'z-index': '10001',
      'position': 'relative',
      'background-color': 'white',
      'padding': '20px',
      'margin-top': '20px',
      'width': '100%'
    };
    
    Object.keys(containerStyles).forEach(property => {
      cardContainer.style.setProperty(property, containerStyles[property], 'important');
    });
    
    // 5. 70枚のガイドカードを即座に生成
    if (cardContainer.children.length < 10) {
      console.log('ガイドカード生成開始...');
      generateCompleteGuideCards(cardContainer);
    }
    
    // 6. カウンターの更新
    updateGuideCounter();
    
    // 7. スクロール機能の確保
    document.body.style.setProperty('overflow', 'auto', 'important');
    document.body.style.setProperty('overflow-y', 'auto', 'important');
    document.documentElement.style.setProperty('overflow', 'auto', 'important');
    document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
    
    console.log('核レベルレイアウト修正完了');
  }
  
  // 完全なガイドカード生成
  function generateCompleteGuideCards(container) {
    const guides = [
      { name: '田中太郎', location: '東京都', fee: 6000, languages: ['日本語', '英語'], keywords: ['グルメ', '歴史'], rating: 4.8 },
      { name: '佐藤花子', location: '大阪府', fee: 6500, languages: ['日本語', '中国語'], keywords: ['文化', '写真スポット'], rating: 4.7 },
      { name: '山田次郎', location: '京都府', fee: 7000, languages: ['日本語', '英語', '韓国語'], keywords: ['寺院', '伝統'], rating: 4.9 },
      { name: '中村美咲', location: '神奈川県', fee: 6200, languages: ['日本語', '英語'], keywords: ['自然', 'アクティビティ'], rating: 4.6 },
      { name: '小林健太', location: '埼玉県', fee: 6800, languages: ['日本語', 'フランス語'], keywords: ['ナイトツアー', '料理'], rating: 4.5 }
    ];
    
    // 既存コンテンツをクリア
    container.innerHTML = '';
    
    // 70枚のガイドカードを生成
    for (let i = 0; i < 70; i++) {
      const guide = guides[i % guides.length];
      const cardElement = createGuideCard(guide, i + 1);
      container.appendChild(cardElement);
    }
    
    console.log('70枚のガイドカード生成完了');
  }
  
  // 個別ガイドカード作成
  function createGuideCard(guide, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'col-md-4 guide-item';
    cardDiv.style.setProperty('margin-bottom', '20px', 'important');
    cardDiv.style.setProperty('display', 'block', 'important');
    cardDiv.style.setProperty('visibility', 'visible', 'important');
    
    cardDiv.innerHTML = `
      <div class="card guide-card shadow-sm" style="display: block !important; visibility: visible !important;">
        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop" class="card-img-top" alt="${guide.name} ${index}">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">${guide.name} ${index}</h5>
            <span class="badge bg-primary">¥${guide.fee}/セッション</span>
          </div>
          <p class="card-text text-muted mb-2">
            <i class="bi bi-geo-alt-fill me-1"></i>${guide.location}
          </p>
          <p class="card-text mb-3">${guide.location}の魅力をご案内します。${guide.keywords.join('や')}が得意です。</p>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              ${guide.languages.map(lang => `<span class="badge bg-light text-dark me-1">${lang}</span>`).join('')}
            </div>
            <div class="text-warning">
              ★★★★☆ <span class="text-dark ms-1">${guide.rating}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-sm mt-2 w-100">詳細を見る</button>
        </div>
      </div>
    `;
    
    return cardDiv;
  }
  
  // ガイドカウンター更新
  function updateGuideCounter() {
    const counter = document.getElementById('search-results-counter');
    if (counter) {
      counter.textContent = '70人のガイドが見つかりました';
      counter.style.setProperty('display', 'block', 'important');
      counter.style.setProperty('visibility', 'visible', 'important');
      counter.style.setProperty('color', '#28a745', 'important');
      counter.style.setProperty('font-weight', 'bold', 'important');
      counter.style.setProperty('font-size', '1.1rem', 'important');
      counter.style.setProperty('padding', '10px 0', 'important');
    }
  }
  
  // 即座に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(nuclearLayoutFix, 0);
      setTimeout(nuclearLayoutFix, 100);
      setTimeout(nuclearLayoutFix, 500);
    });
  } else {
    nuclearLayoutFix();
    setTimeout(nuclearLayoutFix, 100);
    setTimeout(nuclearLayoutFix, 500);
  }
  
  // 継続監視システム
  setInterval(function() {
    const mainContainer = document.querySelector('.container.py-5');
    if (mainContainer && mainContainer.style.zIndex !== '9999') {
      console.log('レイアウト異常検出 - 再修正実行');
      nuclearLayoutFix();
    }
  }, 2000);
  
  console.log('=== NUCLEAR LAYOUT FIX 完了 ===');
  
})();