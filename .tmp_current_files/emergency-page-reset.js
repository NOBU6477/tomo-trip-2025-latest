/**
 * 緊急ページリセットスクリプト
 * ページの初期表示や読み込みの問題に対する最終手段
 */
(function() {
  // ページ読み込み完了から5秒後に実行
  let pageTimeout = setTimeout(function() {
    // 滞留しているローディング状態を検出して強制リセット
    resetAllLoadingStates();
  }, 5000);

  // ページが正常に読み込まれた場合はタイムアウトをクリア
  window.addEventListener('load', function() {
    if (pageTimeout) {
      clearTimeout(pageTimeout);
      pageTimeout = null;
    }
    // 念のため改めて確認
    resetAllLoadingStates();
  });

  /**
   * すべてのローディング状態をリセット
   */
  function resetAllLoadingStates() {
    console.log('緊急ページリセットを実行');

    // 1. すべてのスピナーを停止
    document.querySelectorAll('.spinner-border, .spinner-grow, .loading, .loader').forEach(function(spinner) {
      spinner.style.display = 'none';
      spinner.style.animation = 'none';
    });

    // 2. 無効化されたボタンを有効化
    document.querySelectorAll('button[disabled]').forEach(function(button) {
      // 送信ボタンや処理中のボタンを有効化
      if (button.textContent.includes('中')) {
        button.disabled = false;
        button.textContent = button.textContent.replace(/[処送認証読].*中.*\.*/g, '送信');
      } else {
        button.disabled = false;
      }
    });

    // 3. モーダルが開いたままで背景がスクロールできない場合の修正
    if (document.body.classList.contains('modal-open')) {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      if (modalBackdrops.length > 0) {
        // モーダル背景を削除
        modalBackdrops.forEach(function(backdrop) {
          backdrop.remove();
        });
        // bodyからモーダル関連のクラスと属性を削除
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    }

    // 4. 処理中の通知やアラートを削除
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
      // ローディングや処理中を含むアラートを消す
      if (alert.textContent.includes('中') || alert.textContent.includes('loading')) {
        alert.remove();
      }
    });

    // 5. 無限ループになっている可能性のあるsetIntervalを全てクリア
    for (let i = 1; i < 10000; i++) {
      window.clearInterval(i);
    }
  }

  // モバイル環境では追加の対策を実施
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // スクロールが固定されている場合に解除
    document.body.style.position = '';
    document.body.style.overflow = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.height = '';

    // 固定ヘッダーが画面を覆っている場合の対策
    const fixedHeaders = document.querySelectorAll('header.fixed-top, .navbar.fixed-top');
    fixedHeaders.forEach(function(header) {
      // 一時的に固定解除してスクロールを確保
      header.style.position = 'relative';
      setTimeout(function() {
        header.style.position = '';
      }, 100);
    });
  }
})();