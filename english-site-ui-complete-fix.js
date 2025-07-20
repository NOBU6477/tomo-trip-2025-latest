/**
 * 英語サイト完全UI修正システム - 日本語サイトと完全一致
 */

console.log('🔧 English Site UI Complete Fix - Loading...');

// 日本語サイトと同じ右側ボタン構造を強制適用
function createRightSideButtons() {
  console.log('🔧 Creating right-side buttons matching Japanese site...');
  
  // 既存の重複ボタンを全削除
  const existingButtons = document.querySelectorAll('.sponsor-mini-buttons');
  existingButtons.forEach(btn => btn.remove());
  
  // 日本語サイトと同じCSS構造でボタンを作成
  const rightButtonsCSS = `
    <style id="english-right-buttons-style">
      /* 右側固定ボタン - 日本語サイト完全一致 */
      .sponsor-mini-buttons {
        position: fixed;
        top: 140px;
        right: 20px;
        z-index: 1050;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .sponsor-mini-wrapper {
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: flex-end;
      }

      .sponsor-mini-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        border: none;
        border-radius: 35px;
        font-size: 16px;
        font-weight: 700;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        cursor: pointer;
        backdrop-filter: blur(15px);
        font-family: 'Nunito', 'Quicksand', 'Comic Sans MS', cursive, -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: 
          0 8px 25px rgba(0, 0, 0, 0.15),
          0 4px 10px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.3);
        min-width: 200px;
        position: relative;
        overflow: hidden;
        text-decoration: none;
        color: white;
      }

      .sponsor-mini-btn.sponsor-register {
        background: linear-gradient(135deg, 
          #ff6b9d 0%, 
          #c44569 30%,
          #f8b500 70%,
          #ff6b9d 100%);
        color: white;
      }

      .sponsor-mini-btn.sponsor-login {
        background: linear-gradient(135deg,
          #4facfe 0%,
          #00f2fe 50%,
          #4facfe 100%);
        color: white;
      }

      .sponsor-mini-btn:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 
          0 15px 35px rgba(0, 0, 0, 0.25),
          0 8px 15px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.4);
        color: white;
        text-decoration: none;
      }

      .sponsor-mini-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s;
      }

      .sponsor-mini-btn:hover::before {
        left: 100%;
      }

      /* フィルターガイドボタン */
      .filter-guide-button {
        position: fixed;
        top: 300px;
        right: 20px;
        z-index: 1050;
      }

      .filter-guide-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px 20px;
        background: linear-gradient(135deg, #17a2b8, #20c997);
        color: white;
        border: none;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        min-width: 220px;
        box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .filter-guide-btn:hover {
        background: linear-gradient(135deg, #138496, #1e7e34);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(23, 162, 184, 0.4);
        color: white;
      }

      @media (max-width: 768px) {
        .sponsor-mini-buttons,
        .filter-guide-button {
          right: 10px;
        }
        
        .sponsor-mini-btn,
        .filter-guide-btn {
          min-width: 160px;
          font-size: 12px;
          padding: 12px 18px;
        }
      }
    </style>
  `;
  
  // CSS追加
  document.head.insertAdjacentHTML('beforeend', rightButtonsCSS);
  
  // ボタン要素作成
  const rightButtonsHTML = `
    <div class="sponsor-mini-buttons">
      <div class="sponsor-mini-wrapper">
        <a href="#" class="sponsor-mini-btn sponsor-register" onclick="alert('Sponsor Registration feature coming soon!')">
          <i class="bi bi-shop"></i>
          Sponsor Registration
        </a>
        <a href="#" class="sponsor-mini-btn sponsor-login" onclick="alert('Sponsor Login feature coming soon!')">
          <i class="bi bi-box-arrow-in-right"></i>
          Sponsor Login
        </a>
      </div>
    </div>

    <div class="filter-guide-button">
      <button type="button" class="filter-guide-btn" data-bs-toggle="modal" data-bs-target="#filter-help-modal-en">
        <i class="bi bi-question-circle"></i>
        Filter Features & New Toolbar User Guide
      </button>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', rightButtonsHTML);
  console.log('✅ Right-side buttons created matching Japanese site structure');
}

// ガイドカウンター正確表示修正
function fixGuideCounter() {
  console.log('🔧 Fixing guide counter display...');
  
  // ガイド表示数を実際のカード数に合わせる
  function updateCounter() {
    const visibleCards = document.querySelectorAll('#guide-cards-container .col-md-6:not([style*="display: none"])');
    const actualCount = visibleCards.length;
    
    // カウンター要素を探して更新
    const counterSelectors = [
      '#guide-count-number',
      '#guides-count',
      '.guide-counter',
      '[id*="guide-count"]',
      '[class*="guide-count"]'
    ];
    
    counterSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        if (element.tagName === 'SPAN' && element.id === 'guide-count-number') {
          element.textContent = actualCount;
        } else {
          element.innerHTML = `<i class="bi bi-people-fill me-2"></i><span id="guide-count-number">${actualCount}</span> guides found`;
        }
      }
    });
    
    console.log(`✅ Updated counter to show ${actualCount} guides`);
  }
  
  // 初期更新
  updateCounter();
  
  // 定期更新（フィルター操作を考慮）
  setInterval(updateCounter, 3000);
  
  // MutationObserver でカード変化を監視
  const observer = new MutationObserver(updateCounter);
  const container = document.getElementById('guide-cards-container');
  if (container) {
    observer.observe(container, { childList: true, subtree: true, attributes: true });
  }
}

// 12ガイド強制表示システム
function ensure12GuidesDisplay() {
  console.log('🔧 Ensuring 12 guides are displayed...');
  
  function force12Guides() {
    const container = document.getElementById('guide-cards-container');
    if (!container) return;
    
    const visibleCards = container.querySelectorAll('.col-md-6:not([style*="display: none"])');
    const totalCards = container.querySelectorAll('.col-md-6');
    
    if (visibleCards.length < 12 && totalCards.length >= 12) {
      // 隠されているカードを表示
      const hiddenCards = Array.from(totalCards).filter(card => 
        card.style.display === 'none' || card.style.display === ''
      );
      
      const needed = Math.min(12 - visibleCards.length, hiddenCards.length);
      for (let i = 0; i < needed; i++) {
        hiddenCards[i].style.display = 'block';
        hiddenCards[i].style.visibility = 'visible';
      }
      
      console.log(`✅ Displayed ${needed} additional guides, total visible: ${visibleCards.length + needed}`);
    }
  }
  
  // 即座に実行
  force12Guides();
  
  // 遅延実行で確実に
  setTimeout(force12Guides, 1000);
  setTimeout(force12Guides, 3000);
}

// スクロール機能修正
function fixScrollFunctionality() {
  console.log('🔧 Fixing scroll functionality...');
  
  // bodyとhtmlのスクロール設定を強制
  document.documentElement.style.overflow = 'auto';
  document.documentElement.style.overflowY = 'auto';
  document.body.style.overflow = 'auto';
  document.body.style.overflowY = 'auto';
  
  // modal-openクラスの除去
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
  
  // 固定ポジションの解除
  document.body.style.position = '';
  document.body.style.top = '';
  
  console.log('✅ Scroll functionality restored');
}

// 日本語コンテンツの完全除去
function removeJapaneseContent() {
  console.log('🔧 Removing Japanese content contamination...');
  
  // 日本語ガイド名の完全除去
  const japaneseNames = [
    'Takeshi Yamada', 'Hanako Sato', 'Hiroshi Tanaka', 'Yuki Nakamura',
    '山田健志', '佐藤花子', '田中博', '中村雪'
  ];
  
  const allTextElements = document.querySelectorAll('*');
  allTextElements.forEach(element => {
    if (element.children.length === 0) { // テキストノードのみの要素
      let text = element.textContent;
      let changed = false;
      
      japaneseNames.forEach(name => {
        if (text.includes(name)) {
          text = text.replace(new RegExp(name, 'g'), '');
          changed = true;
        }
      });
      
      if (changed) {
        element.textContent = text;
      }
    }
  });
  
  console.log('✅ Japanese content contamination removed');
}

// メイン初期化関数
function initializeEnglishSiteUI() {
  console.log('🔧 Initializing English Site UI Complete Fix...');
  
  // 順次実行で確実に修正
  setTimeout(() => {
    removeJapaneseContent();
    createRightSideButtons();
    fixScrollFunctionality();
    ensure12GuidesDisplay();
    fixGuideCounter();
  }, 500);
  
  console.log('✅ English Site UI Complete Fix initialized');
}

// DOM読み込み完了時に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnglishSiteUI);
} else {
  initializeEnglishSiteUI();
}

// 外部から呼び出し可能な修正関数をグローバルに公開
window.englishSiteUICompleteFix = {
  createRightSideButtons,
  fixGuideCounter,
  ensure12GuidesDisplay,
  fixScrollFunctionality,
  removeJapaneseContent,
  initializeEnglishSiteUI
};

console.log('✅ English Site UI Complete Fix Script Loaded');