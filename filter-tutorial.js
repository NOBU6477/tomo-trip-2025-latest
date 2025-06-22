/**
 * フィルターチュートリアルシステム
 * 初回ユーザーにフィルター機能の使い方を案内する
 */

(function() {
  'use strict';
  
  let tutorialInitialized = false;
  
  function initFilterTutorial() {
    if (tutorialInitialized) return;
    tutorialInitialized = true;
    
    console.log('フィルターチュートリアルシステムを初期化中...');
    
    // チュートリアルボタンのイベントリスナー
    const tutorialBtn = document.getElementById('filter-tutorial-btn');
    if (tutorialBtn) {
      tutorialBtn.addEventListener('click', showFilterTutorial);
    }
    
    // 「実際に試してみる」ボタンのイベントリスナー
    const tryFilterBtn = document.getElementById('try-filter-btn');
    if (tryFilterBtn) {
      tryFilterBtn.addEventListener('click', startFilterDemo);
    }
    
    // 初回訪問者の検出とチュートリアル表示判定
    checkFirstTimeUser();
    
    console.log('フィルターチュートリアルシステム初期化完了');
  }
  
  /**
   * フィルターチュートリアルモーダルを表示
   */
  function showFilterTutorial() {
    console.log('フィルターチュートリアルを表示');
    
    const modal = new bootstrap.Modal(document.getElementById('filterTutorialModal'));
    modal.show();
    
    // チュートリアル表示をマーク
    localStorage.setItem('filterTutorialShown', 'true');
    
    // アナリティクス用のイベント（実装時にGoogle Analyticsなどに送信）
    trackTutorialEvent('tutorial_opened');
  }
  
  /**
   * フィルターデモを開始
   */
  function startFilterDemo() {
    console.log('フィルターデモを開始');
    
    // チュートリアルモーダルを閉じる
    const tutorialModal = bootstrap.Modal.getInstance(document.getElementById('filterTutorialModal'));
    if (tutorialModal) {
      tutorialModal.hide();
    }
    
    // フィルター画面を自動で開く
    setTimeout(() => {
      const toggleFilterBtn = document.getElementById('toggle-filter-button');
      if (toggleFilterBtn) {
        // フィルターが閉じている場合のみ開く
        const filterCard = document.getElementById('filter-card');
        if (filterCard && filterCard.classList.contains('d-none')) {
          toggleFilterBtn.click();
        }
        
        // フィルターボタンをハイライト
        highlightFilterButton();
      }
    }, 300);
    
    // デモ完了をマーク
    localStorage.setItem('filterDemoCompleted', 'true');
    
    trackTutorialEvent('demo_started');
  }
  
  /**
   * フィルターボタンをハイライト表示
   */
  function highlightFilterButton() {
    const toggleBtn = document.getElementById('toggle-filter-button');
    if (!toggleBtn) return;
    
    // ハイライト効果を追加
    toggleBtn.classList.add('filter-highlight');
    
    // 3秒後にハイライトを削除
    setTimeout(() => {
      toggleBtn.classList.remove('filter-highlight');
    }, 3000);
    
    // 成功メッセージを表示
    showTutorialMessage('フィルター機能をお試しください！地域や言語などの条件を選択できます。', 'success');
  }
  
  /**
   * チュートリアル関連メッセージを表示
   */
  function showTutorialMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show tutorial-alert`;
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 350px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    alertDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
        <span>${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // 5秒後に自動削除
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
  
  /**
   * 初回ユーザーかどうかを判定し、チュートリアルを表示するか決定
   */
  function checkFirstTimeUser() {
    const hasSeenTutorial = localStorage.getItem('filterTutorialShown');
    const hasUsedFilter = localStorage.getItem('filterUsed');
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    
    // 訪問回数をカウント
    localStorage.setItem('visitCount', (visitCount + 1).toString());
    
    // 初回訪問で、チュートリアルを見たことがなく、フィルターを使ったことがない場合
    if (!hasSeenTutorial && !hasUsedFilter && visitCount <= 2) {
      // 3秒後にさりげなくヒントを表示
      setTimeout(() => {
        showFilterHint();
      }, 3000);
    }
  }
  
  /**
   * フィルター機能のヒントを表示
   */
  function showFilterHint() {
    const hintDiv = document.createElement('div');
    hintDiv.className = 'filter-hint';
    hintDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      padding: 15px 20px;
      border-radius: 15px;
      box-shadow: 0 6px 20px rgba(0,123,255,0.3);
      z-index: 9998;
      max-width: 300px;
      animation: slideInLeft 0.5s ease-out;
    `;
    
    hintDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div class="fw-bold mb-1">
            <i class="bi bi-funnel me-1"></i>フィルター機能
          </div>
          <div class="small">お好みの条件でガイドを絞り込めます</div>
          <button class="btn btn-light btn-sm mt-2" onclick="document.getElementById('filter-tutorial-btn').click(); this.parentElement.parentElement.parentElement.remove();">
            使い方を見る
          </button>
        </div>
        <button class="btn-close btn-close-white ms-2" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
    `;
    
    // アニメーション用CSS
    if (!document.getElementById('filter-hint-styles')) {
      const style = document.createElement('style');
      style.id = 'filter-hint-styles';
      style.textContent = `
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .filter-highlight {
          animation: pulse 1.5s infinite;
          box-shadow: 0 0 0 4px rgba(0,123,255,0.3) !important;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0,123,255,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(0,123,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,123,255,0); }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(hintDiv);
    
    // 10秒後に自動削除
    setTimeout(() => {
      if (hintDiv.parentNode) {
        hintDiv.remove();
      }
    }, 10000);
    
    trackTutorialEvent('hint_shown');
  }
  
  /**
   * フィルター使用をトラッキング
   */
  function markFilterUsed() {
    localStorage.setItem('filterUsed', 'true');
    trackTutorialEvent('filter_used');
  }
  
  /**
   * チュートリアルイベントのトラッキング
   */
  function trackTutorialEvent(eventName) {
    console.log(`チュートリアルイベント: ${eventName}`);
    
    // Google Analytics 4 への送信例（実装時）
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'filter_tutorial',
        event_label: 'filter_usage_guidance'
      });
    }
    
    // 内部統計用にローカルストレージに記録
    const events = JSON.parse(localStorage.getItem('tutorialEvents') || '[]');
    events.push({
      event: eventName,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('tutorialEvents', JSON.stringify(events));
  }
  
  /**
   * フィルター適用時にチュートリアル関連の処理
   */
  function onFilterApplied() {
    markFilterUsed();
    
    // 初回フィルター使用時にお祝いメッセージ
    const isFirstTimeUse = !localStorage.getItem('firstFilterUseMessageShown');
    if (isFirstTimeUse) {
      setTimeout(() => {
        showTutorialMessage('フィルターが適用されました！結果をご確認ください。', 'success');
      }, 500);
      localStorage.setItem('firstFilterUseMessageShown', 'true');
    }
  }
  
  /**
   * リセットボタン使用時にもっと見るボタンについてのヒントを表示
   */
  function onFilterReset() {
    const hasSeenLoadMoreHint = localStorage.getItem('loadMoreHintShown');
    
    if (!hasSeenLoadMoreHint) {
      setTimeout(() => {
        showLoadMoreHint();
        localStorage.setItem('loadMoreHintShown', 'true');
      }, 1000);
    }
  }
  
  /**
   * もっと見るボタンについてのヒントを表示
   */
  function showLoadMoreHint() {
    const loadMoreBtn = document.getElementById('load-more-guides');
    if (!loadMoreBtn || loadMoreBtn.style.display === 'none') return;
    
    const hintDiv = document.createElement('div');
    hintDiv.className = 'load-more-hint';
    hintDiv.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 15px 20px;
      border-radius: 15px;
      box-shadow: 0 6px 20px rgba(40,167,69,0.3);
      z-index: 9998;
      max-width: 280px;
      animation: slideInRight 0.5s ease-out;
    `;
    
    hintDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div class="fw-bold mb-1">
            <i class="bi bi-arrow-down-circle me-1"></i>もっと見る
          </div>
          <div class="small">リセット後は3名のみ表示。「もっと見る」で全ガイドを表示できます</div>
        </div>
        <button class="btn-close btn-close-white ms-2" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
    `;
    
    // アニメーション用CSS（右からスライドイン）
    if (!document.getElementById('load-more-hint-styles')) {
      const style = document.createElement('style');
      style.id = 'load-more-hint-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(hintDiv);
    
    // 8秒後に自動削除
    setTimeout(() => {
      if (hintDiv.parentNode) {
        hintDiv.remove();
      }
    }, 8000);
    
    trackTutorialEvent('load_more_hint_shown');
  }
  
  // グローバル関数として公開
  window.initFilterTutorial = initFilterTutorial;
  window.onFilterApplied = onFilterApplied;
  window.onFilterReset = onFilterReset;
  
  // DOM読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilterTutorial);
  } else {
    initFilterTutorial();
  }
  
})();