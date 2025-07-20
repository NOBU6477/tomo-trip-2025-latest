/**
 * 英語サイト右側ボタン修正システム
 * 日本語サイトと同じ構造に統一
 */

console.log('🔧 English Right Buttons Fix - Loading...');

// 右側ボタンを日本語サイトと同じ構造に修正
function createRightSideButtons() {
  console.log('🔧 Creating right side buttons...');
  
  // 既存の右側ボタンを削除
  const existingButtons = [
    document.querySelector('.sponsor-action-buttons'),
    document.querySelector('.fixed-guide-button'),
    document.querySelector('.right-side-buttons'),
    document.querySelector('.floating-buttons'),
    document.querySelector('.sponsor-mini-buttons')
  ];
  
  existingButtons.forEach(btn => {
    if (btn) {
      btn.remove();
      console.log('Removed existing button');
    }
  });
  
  // 日本語サイトと同じ構造のボタンを作成
  const rightButtonsHTML = `
    <!-- Right Side Fixed Buttons (English Version) -->
    <div class="sponsor-action-buttons" style="
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 15px;
    ">
      <button class="btn sponsor-btn register-btn" id="sponsorRegisterBtn" title="Sponsor Registration" style="
        background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        color: white;
        border: none;
        border-radius: 25px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        transition: all 0.3s ease;
        min-width: 160px;
        text-align: center;
      ">
        <i class="bi bi-shop me-2"></i>Sponsor Registration
      </button>
      
      <button class="btn sponsor-btn login-btn" id="sponsorLoginBtn" title="Sponsor Login" style="
        background: linear-gradient(135deg, #4ecdc4, #44a08d);
        color: white;
        border: none;
        border-radius: 25px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        transition: all 0.3s ease;
        min-width: 160px;
        text-align: center;
      ">
        <i class="bi bi-box-arrow-in-right me-2"></i>Login
      </button>
    </div>
    
    <!-- Filter Guide Button (Bottom Right) -->
    <div class="fixed-guide-button" style="
      position: fixed;
      right: 20px;
      bottom: 20%;
      z-index: 1000;
    ">
      <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#filter-help-modal-en" style="
        background: linear-gradient(135deg, #17a2b8, #20c997);
        border: none;
        color: white;
        padding: 15px 20px;
        border-radius: 25px;
        font-size: 13px;
        font-weight: 600;
        text-align: center;
        line-height: 1.3;
        box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
        transition: all 0.3s ease;
        min-width: 140px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      ">
        <i class="bi bi-question-circle-fill" style="font-size: 20px;"></i>
        <span style="font-size: 11px; line-height: 1.2;">Filter Features &<br>New Toolbar<br>User Guide</span>
      </button>
    </div>
    
    <style>
      .sponsor-btn:hover {
        transform: translateX(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      }
      
      .fixed-guide-button .btn:hover {
        transform: translateX(-5px);
        box-shadow: 0 8px 25px rgba(23, 162, 184, 0.4);
        background: linear-gradient(135deg, #138496, #1e7e34);
      }
      
      @media (max-width: 768px) {
        .sponsor-action-buttons {
          right: 10px;
          top: 30%;
        }
        
        .sponsor-btn {
          padding: 10px 16px;
          font-size: 12px;
          min-width: 140px;
        }
        
        .fixed-guide-button {
          right: 10px;
          bottom: 15%;
        }
        
        .fixed-guide-button .btn {
          padding: 12px 16px;
          font-size: 11px;
          min-width: 120px;
        }
      }
    </style>
  `;
  
  // ボタンをページに挿入
  document.body.insertAdjacentHTML('beforeend', rightButtonsHTML);
  
  // イベントリスナーを追加
  setupButtonEventListeners();
  
  console.log('✅ Right side buttons created successfully');
}

// ボタンイベントリスナー設定
function setupButtonEventListeners() {
  console.log('🔧 Setting up button event listeners...');
  
  // 協賛店登録ボタン
  const sponsorRegisterBtn = document.getElementById('sponsorRegisterBtn');
  if (sponsorRegisterBtn) {
    sponsorRegisterBtn.addEventListener('click', function() {
      alert('Sponsor Registration System - Coming Soon!');
      console.log('Sponsor registration button clicked');
    });
  }

  // 協賛店ログインボタン
  const sponsorLoginBtn = document.getElementById('sponsorLoginBtn');
  if (sponsorLoginBtn) {
    sponsorLoginBtn.addEventListener('click', function() {
      alert('Sponsor Dashboard - Coming Soon!');
      console.log('Sponsor login button clicked');
    });
  }
  
  console.log('✅ Button event listeners set up successfully');
}

// ガイドカウンター修正
function fixGuideCounter() {
  console.log('🔧 Fixing guide counter...');
  
  function updateCounterDisplay() {
    const container = document.getElementById('guide-cards-container');
    if (!container) return;
    
    const visibleCards = container.querySelectorAll('.col-md-6:not([style*="display: none"])');
    const actualCount = visibleCards.length;
    
    // カウンター要素を更新
    const guideCountNumber = document.getElementById('guide-count-number');
    const totalGuideCount = document.getElementById('total-guide-count');
    
    if (guideCountNumber) {
      guideCountNumber.textContent = actualCount;
    }
    
    if (totalGuideCount) {
      totalGuideCount.textContent = '24'; // 総ガイド数
    }
    
    // カウンターテキスト全体を更新
    const guidesCountElement = document.getElementById('guides-count');
    if (guidesCountElement) {
      guidesCountElement.innerHTML = `
        <i class="bi bi-people-fill me-2"></i><span id="guide-count-number">${actualCount}</span> guides displaying (Total <span id="total-guide-count">24</span>)
      `;
    }
    
    console.log(`✅ Guide counter updated: ${actualCount} guides displaying`);
  }
  
  // 即座に実行
  updateCounterDisplay();
  
  // 定期的に更新
  setInterval(updateCounterDisplay, 3000);
  
  // MutationObserverでDOMの変更を監視
  const observer = new MutationObserver(updateCounterDisplay);
  const container = document.getElementById('guide-cards-container');
  if (container) {
    observer.observe(container, { childList: true, subtree: true, attributes: true });
  }
}

// メイン初期化関数
function initializeEnglishRightButtons() {
  console.log('🔧 Initializing English Right Buttons Fix...');
  
  // 順次実行
  setTimeout(() => {
    createRightSideButtons();
    fixGuideCounter();
  }, 500);
  
  console.log('✅ English Right Buttons Fix initialized');
}

// DOM読み込み完了時に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnglishRightButtons);
} else {
  initializeEnglishRightButtons();
}

// 外部から呼び出し可能な関数をグローバルに公開
window.englishRightButtonsFix = {
  createRightSideButtons,
  setupButtonEventListeners,
  fixGuideCounter,
  initializeEnglishRightButtons
};

console.log('✅ English Right Buttons Fix Script Loaded');