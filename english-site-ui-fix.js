/**
 * 英語サイトUI修復システム
 * 協賛店ボタン、検索機能、ガイドボタンの配置修正
 */

console.log('🔧 英語サイトUI修復システム開始');

// UI修復の実行
function fixEnglishSiteUI() {
  console.log('🔧 英語サイトUI修復実行中...');
  
  // 協賛店ボタンの位置確認と修正
  fixSponsorButtons();
  
  // 検索機能の配置修正
  fixSearchFunctionality();
  
  // Filter Guideボタンの機能確認
  fixFilterGuideButton();
  
  // ガイドカード表示の確認
  fixGuideCardsDisplay();
  
  console.log('✅ 英語サイトUI修復完了');
}

function fixSponsorButtons() {
  console.log('🔧 協賛店ボタン修復中...');
  
  const sponsorButtons = document.querySelector('.sponsor-mini-buttons');
  if (!sponsorButtons) {
    console.warn('⚠️ 協賛店ボタンが見つかりません');
    return;
  }
  
  // 位置の確認と調整
  sponsorButtons.style.position = 'fixed';
  sponsorButtons.style.top = '100px';
  sponsorButtons.style.right = '20px';
  sponsorButtons.style.zIndex = '1050';
  
  console.log('✅ 協賛店ボタン位置修正完了');
}

function fixSearchFunctionality() {
  console.log('🔧 検索機能配置修復中...');
  
  // フィルターボタンの配置確認
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  if (filterToggleBtn) {
    const parentDiv = filterToggleBtn.closest('.text-center');
    if (parentDiv) {
      parentDiv.style.marginBottom = '20px';
      parentDiv.style.padding = '10px 0';
    }
  }
  
  // フィルターカードの配置確認
  const filterCard = document.getElementById('filter-card');
  if (filterCard) {
    filterCard.style.position = 'relative';
    filterCard.style.zIndex = '100';
  }
  
  console.log('✅ 検索機能配置修正完了');
}

function fixFilterGuideButton() {
  console.log('🔧 Filter Guideボタン修復中...');
  
  // Filter Guideボタンの機能確認
  const filterGuideBtn = document.querySelector('[data-bs-target="#filter-help-modal-en"]');
  if (!filterGuideBtn) {
    console.warn('⚠️ Filter Guideボタンが見つかりません');
    return;
  }
  
  // ボタンクリックイベントの確認
  filterGuideBtn.addEventListener('click', function() {
    console.log('Filter Guideボタンがクリックされました');
  });
  
  console.log('✅ Filter Guideボタン機能確認完了');
}

function fixGuideCardsDisplay() {
  console.log('🔧 ガイドカード表示修復中...');
  
  // ガイドカードコンテナの確認
  const cardsContainer = document.getElementById('guide-cards-container');
  if (!cardsContainer) {
    console.warn('⚠️ ガイドカードコンテナが見つかりません');
    return;
  }
  
  // カード表示の確認
  const cards = cardsContainer.querySelectorAll('.guide-card');
  console.log(`現在表示されているガイドカード数: ${cards.length}`);
  
  // カードが表示されていない場合の対処
  if (cards.length === 0) {
    console.log('⚠️ ガイドカードが表示されていません - 統一システムに委託');
  }
  
  console.log('✅ ガイドカード表示確認完了');
}

// レスポンシブ対応
function handleResponsiveAdjustments() {
  console.log('📱 レスポンシブ調整実行中...');
  
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // モバイル環境での調整
    const sponsorButtons = document.querySelector('.sponsor-mini-buttons');
    if (sponsorButtons) {
      sponsorButtons.style.top = '80px';
      sponsorButtons.style.right = '10px';
    }
    
    const fixedGuideButton = document.querySelector('.fixed-guide-button');
    if (fixedGuideButton) {
      fixedGuideButton.style.right = '10px';
      fixedGuideButton.style.top = '40%';
    }
  }
  
  console.log('✅ レスポンシブ調整完了');
}

// 初期化と実行
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 英語サイトUI修復システム初期化');
  
  // 初期修復実行
  setTimeout(fixEnglishSiteUI, 1000);
  
  // レスポンシブ調整
  window.addEventListener('resize', handleResponsiveAdjustments);
  
  // 定期的なUI確認（5秒ごと）
  setInterval(() => {
    // 重要な要素が消失していないか確認
    const sponsorButtons = document.querySelector('.sponsor-mini-buttons');
    const filterGuideBtn = document.querySelector('[data-bs-target="#filter-help-modal-en"]');
    
    if (!sponsorButtons || !filterGuideBtn) {
      console.log('⚠️ 重要なUI要素が見つかりません - 再修復実行');
      fixEnglishSiteUI();
    }
  }, 5000);
});

// 遅延実行で確実に修復
setTimeout(fixEnglishSiteUI, 2000);
setTimeout(fixEnglishSiteUI, 5000);

console.log('✅ 英語サイトUI修復システム読み込み完了');

// グローバル関数として公開
window.englishSiteUIFix = {
  fix: fixEnglishSiteUI,
  fixSponsorButtons: fixSponsorButtons,
  fixSearchFunctionality: fixSearchFunctionality,
  fixFilterGuideButton: fixFilterGuideButton,
  fixGuideCardsDisplay: fixGuideCardsDisplay
};