/**
 * 強制表示修正
 * どんな状況でもページコンテンツを必ず表示させる
 */
(function() {
  // ページが完全に読み込まれていない場合に対応するタイマー
  let forceTimer = null;
  
  /**
   * 強制表示を実行する
   */
  function forceDisplay() {
    // ページ内容を強制的に表示
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    
    // メインコンテンツを表示
    const mainElements = [
      document.getElementById('main-content'),
      document.querySelector('main'),
      document.querySelector('.container'),
      document.querySelector('.content')
    ];
    
    mainElements.forEach(function(element) {
      if (element) {
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.display = 'block';
      }
    });
    
    // モーダル背景だけが残っている場合に対応
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    if (modalBackdrops.length > 0) {
      modalBackdrops.forEach(function(backdrop) {
        backdrop.style.opacity = '0';
        backdrop.style.display = 'none';
      });
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    // スクロールが無効になっている場合は有効に
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.documentElement.style.overflow = '';
    
    // 5秒後にスピナーを再確認
    setTimeout(function() {
      // 残っているスピナーを全て非表示
      const spinners = document.querySelectorAll('.spinner, .spinner-border, .spinner-grow, .loading');
      spinners.forEach(function(spinner) {
        spinner.style.display = 'none';
      });
    }, 5000);
  }
  
  // イベントリスナーの登録
  function setupListeners() {
    // DOM読み込み完了時
    document.addEventListener('DOMContentLoaded', function() {
      if (forceTimer) {
        clearTimeout(forceTimer);
      }
      setTimeout(forceDisplay, 3000);
    });
    
    // ページ完全読み込み時
    window.addEventListener('load', function() {
      if (forceTimer) {
        clearTimeout(forceTimer);
      }
      setTimeout(forceDisplay, 1000);
    });
    
    // タッチイベント発生時（モバイル）
    document.addEventListener('touchstart', function() {
      if (forceTimer) {
        clearTimeout(forceTimer);
      }
      setTimeout(forceDisplay, 500);
    }, { once: true, passive: true });
    
    // クリック時
    document.addEventListener('click', function() {
      forceDisplay();
    }, { once: true, passive: true });
    
    // スクロール時
    window.addEventListener('scroll', function() {
      forceDisplay();
    }, { once: true, passive: true });
  }
  
  // タイマーを設定して一定時間後に強制表示
  forceTimer = setTimeout(function() {
    forceDisplay();
  }, 7000); // 7秒後に実行
  
  // イベントリスナー登録
  setupListeners();
  
  // 即座に初期処理を行う
  setTimeout(function() {
    // スタイルを強制適用してコンテンツ表示を保証
    const style = document.createElement('style');
    style.innerHTML = `
      .modal-backdrop {
        opacity: 0 !important;
      }
      body {
        overflow: auto !important;
      }
    `;
    document.head.appendChild(style);
  }, 0);
})();