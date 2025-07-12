/**
 * 究極のスクロール修正スクリプト
 * 横スクロールを防止し、上下スクロールを有効化
 * 協賛店の右から左への流れは維持
 */

(function() {
  'use strict';

  console.log('究極のスクロール修正システム開始');

  function fixScrollIssues() {
    // 基本的な横スクロール防止
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.maxWidth = '100vw';
    document.documentElement.style.width = '100%';
    
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    document.body.style.maxWidth = '100%';
    document.body.style.width = '100%';
    document.body.style.minHeight = '100vh';
    
    // 協賛店バナーのスクロール機能は維持
    const sponsorBanner = document.querySelector('.sponsor-banner');
    if (sponsorBanner) {
      sponsorBanner.style.overflowX = 'hidden';
      sponsorBanner.style.overflowY = 'hidden';
      sponsorBanner.style.position = 'relative';
      sponsorBanner.style.whiteSpace = 'nowrap';
    }
    
    const sponsorScroll = document.querySelector('.sponsor-scroll');
    if (sponsorScroll) {
      sponsorScroll.style.display = 'inline-block';
      sponsorScroll.style.whiteSpace = 'nowrap';
      // アニメーションは維持
    }
    
    // 全体のコンテナを修正
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      // 協賛店関連の要素は除外
      if (element.classList.contains('sponsor-banner') || 
          element.classList.contains('sponsor-scroll') ||
          element.classList.contains('sponsor-item') ||
          element.closest('.sponsor-banner')) {
        return;
      }
      
      // 画面幅を超える要素の修正
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.width && 
          element.getBoundingClientRect().width > window.innerWidth) {
        element.style.maxWidth = '100%';
        element.style.overflowX = 'hidden';
        element.style.boxSizing = 'border-box';
      }
    });
    
    // Bootstrap関連の修正
    const containers = document.querySelectorAll('.container, .container-fluid');
    containers.forEach(container => {
      container.style.maxWidth = '100%';
      container.style.overflowX = 'hidden';
      container.style.boxSizing = 'border-box';
    });
    
    // 行要素の修正
    const rows = document.querySelectorAll('.row');
    rows.forEach(row => {
      row.style.maxWidth = '100%';
      row.style.overflowX = 'hidden';
      row.style.boxSizing = 'border-box';
    });
    
    // カラム要素の修正
    const columns = document.querySelectorAll('[class*="col-"]');
    columns.forEach(col => {
      col.style.maxWidth = '100%';
      col.style.overflowX = 'hidden';
      col.style.boxSizing = 'border-box';
    });
    
    // モーダルopen時の修正
    const body = document.body;
    if (body.classList.contains('modal-open')) {
      body.style.overflowY = 'auto';
      body.style.overflowX = 'hidden';
      body.style.paddingRight = '0';
    }
    
    console.log('スクロール修正完了 - 協賛店アニメーション維持');
  }

  // 即座に実行
  fixScrollIssues();

  // DOM読み込み後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixScrollIssues);
  }

  // 動的な要素に対応
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        setTimeout(fixScrollIssues, 100);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 継続的な監視（頻度を高める）
  setInterval(fixScrollIssues, 500);

  // ウィンドウリサイズ時の修正
  window.addEventListener('resize', fixScrollIssues);

  // モーダルイベント監視
  document.addEventListener('show.bs.modal', function() {
    setTimeout(fixScrollIssues, 100);
  });

  document.addEventListener('hidden.bs.modal', function() {
    setTimeout(fixScrollIssues, 100);
  });

  console.log('究極のスクロール修正システム完了');
})();