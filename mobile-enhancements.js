/**
 * モバイル表示強化のためのスクリプト
 * モバイルデバイスでのユーザーエクスペリエンスを改善する機能を提供
 */

document.addEventListener('DOMContentLoaded', function() {
  if (isMobileDevice()) {
    console.log('モバイル端末を検出しました。モバイル体験向上機能を適用します。');
    
    // モバイルナビゲーションの強化
    enhanceMobileNavigation();
    
    // タッチジェスチャーの強化
    enhanceTouchGestures();
    
    // モーダルをモバイル向けに最適化
    optimizeModalsForMobile();
    
    // スクロール体験の向上
    enhanceScrollExperience();
    
    // スワイプアクションの設定
    setupSwipeActions();
    
    // フォーム入力の最適化
    optimizeFormInputs();
    
    // モバイルデバイスのセーフエリア対応
    handleSafeAreas();
    
    // プログレッシブWebアプリ機能（オフライン対応など）
    setupPWAFeatures();
  }
});

/**
 * モバイルナビゲーションの強化
 */
function enhanceMobileNavigation() {
  // 下部ナビゲーションが存在するか確認
  if (!document.querySelector('.bottom-nav')) {
    // 下部ナビゲーションの作成
    createBottomNav();
  }
  
  // ナビゲーションの現在位置をハイライト
  highlightCurrentNavItem();
  
  // スクロール時のヘッダー動作を設定
  setupScrollingHeader();
}

/**
 * 下部ナビゲーションの作成
 */
function createBottomNav() {
  // メインメニュー項目の取得
  const mainMenuItems = Array.from(document.querySelectorAll('.navbar-nav .nav-item .nav-link'))
    .filter(link => !link.closest('.dropdown-menu'));
  
  // 主要な4-5項目のみ取得
  const primaryNavItems = mainMenuItems.slice(0, 5);
  
  if (primaryNavItems.length > 0) {
    // 下部ナビゲーションの作成
    const bottomNav = document.createElement('div');
    bottomNav.className = 'bottom-nav safe-area-padding-bottom d-md-none';
    
    // ナビゲーション項目の作成
    primaryNavItems.forEach(item => {
      const navItem = document.createElement('a');
      navItem.className = 'bottom-nav-item';
      navItem.href = item.href;
      
      // アイコンの推測
      let iconClass = 'bi-house';
      if (item.textContent.includes('ガイド') || item.textContent.includes('Guide')) {
        iconClass = 'bi-person-badge';
      } else if (item.textContent.includes('探す') || item.textContent.includes('Search')) {
        iconClass = 'bi-search';
      } else if (item.textContent.includes('予約') || item.textContent.includes('Book')) {
        iconClass = 'bi-calendar';
      } else if (item.textContent.includes('メッセージ') || item.textContent.includes('Message')) {
        iconClass = 'bi-chat';
      } else if (item.textContent.includes('プロフィール') || item.textContent.includes('Profile')) {
        iconClass = 'bi-person';
      }
      
      // アイコンと名前を設定
      navItem.innerHTML = `
        <i class="bi ${iconClass} bottom-nav-icon"></i>
        <span>${item.textContent.trim()}</span>
      `;
      
      // 現在のページの場合はアクティブクラスを追加
      if (item.classList.contains('active') || window.location.href.includes(item.href)) {
        navItem.classList.add('active');
      }
      
      bottomNav.appendChild(navItem);
    });
    
    // ボディにナビゲーションを追加
    document.body.appendChild(bottomNav);
    
    // コンテンツ領域の下部マージン調整
    document.querySelector('main') && (document.querySelector('main').style.marginBottom = '60px');
  }
}

/**
 * タッチジェスチャーの強化
 */
function enhanceTouchGestures() {
  // タッチ操作の対象要素
  const touchElements = document.querySelectorAll('.card, .btn, .nav-link, .list-group-item');
  
  touchElements.forEach(element => {
    // タッチ開始時のエフェクト
    element.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    }, { passive: true });
    
    // タッチ終了時のエフェクト
    element.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    }, { passive: true });
    
    // タッチキャンセル時のエフェクト
    element.addEventListener('touchcancel', function() {
      this.classList.remove('touch-active');
    }, { passive: true });
  });
}

/**
 * モーダルをモバイル向けに最適化
 */
function optimizeModalsForMobile() {
  // モーダルのフルスクリーン表示
  document.querySelectorAll('.modal').forEach(modal => {
    if (!modal.classList.contains('modal-fullscreen-mobile')) {
      modal.classList.add('modal-fullscreen-mobile');
      
      // モーダル表示時のイベント
      modal.addEventListener('shown.bs.modal', function() {
        // フォーカスを入力フィールドに設定
        const firstInput = this.querySelector('input, select, textarea');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 500);
        }
        
        // モーダル閉じるボタンの強化
        const closeButton = this.querySelector('.modal-header .btn-close');
        if (closeButton) {
          closeButton.style.padding = '1rem';
          closeButton.style.margin = '0';
        }
      });
    }
  });
}

/**
 * スクロール体験の向上
 */
function enhanceScrollExperience() {
  // スクロールイベントのパフォーマンス最適化
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScrollEffects();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  // スワイプエリアのタッチスクロール最適化
  document.querySelectorAll('.swipe-area').forEach(area => {
    area.classList.add('smooth-scroll', 'hide-scrollbar');
  });
}

/**
 * スクロール時のエフェクト処理
 */
function handleScrollEffects() {
  // ナビゲーションバーのスクロール処理
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }
  
  // バックトップボタンの表示制御
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }
}

/**
 * スワイプアクションの設定
 */
function setupSwipeActions() {
  // リスト項目にスワイプアクションを追加
  document.querySelectorAll('.swipe-action-container').forEach(container => {
    let startX, currentX, initialOffset;
    const content = container.querySelector('.swipe-action-content');
    const buttonsWidth = container.querySelector('.swipe-action-buttons')?.offsetWidth || 100;
    
    // タッチスタート
    container.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      currentX = startX;
      initialOffset = content.style.transform ? 
        parseInt(content.style.transform.replace('translateX(', '').replace('px)', '')) : 0;
      
      container.classList.add('swiping');
    }, { passive: true });
    
    // タッチムーブ
    container.addEventListener('touchmove', function(e) {
      if (container.classList.contains('swiping')) {
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        let newOffset = initialOffset + diff;
        
        // 左スワイプの制限（右にあるボタンを表示）
        if (newOffset < -buttonsWidth) newOffset = -buttonsWidth;
        // 右スワイプの制限
        if (newOffset > 0) newOffset = 0;
        
        content.style.transform = `translateX(${newOffset}px)`;
      }
    }, { passive: true });
    
    // タッチエンド
    container.addEventListener('touchend', function() {
      container.classList.remove('swiping');
      
      const finalOffset = content.style.transform ? 
        parseInt(content.style.transform.replace('translateX(', '').replace('px)', '')) : 0;
      
      // スナップ動作（閾値を超えたら全表示、そうでなければ非表示）
      if (finalOffset < -buttonsWidth/2) {
        content.style.transform = `translateX(${-buttonsWidth}px)`;
      } else {
        content.style.transform = 'translateX(0)';
      }
    }, { passive: true });
  });
}

/**
 * フォーム入力の最適化
 */
function optimizeFormInputs() {
  // iOS用の入力フィールド最適化
  document.querySelectorAll('input, select, textarea').forEach(input => {
    // フォーカス時にページ拡大を防止
    input.addEventListener('focus', function() {
      document.body.classList.add('keyboard-open');
      // viewportメタタグの更新
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1, maximum-scale=1');
      }
    });
    
    // ブラー時に元に戻す
    input.addEventListener('blur', function() {
      document.body.classList.remove('keyboard-open');
      // viewportメタタグを戻す
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1');
      }
    });
  });
}

/**
 * セーフエリア対応（iPhone X以降）
 */
function handleSafeAreas() {
  // CSSカスタムプロパティでセーフエリアを設定
  document.documentElement.style.setProperty(
    '--safe-area-inset-top', 'env(safe-area-inset-top)');
  document.documentElement.style.setProperty(
    '--safe-area-inset-right', 'env(safe-area-inset-right)');
  document.documentElement.style.setProperty(
    '--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
  document.documentElement.style.setProperty(
    '--safe-area-inset-left', 'env(safe-area-inset-left)');
  
  // 下部固定要素にセーフエリアのパディングを追加
  document.querySelectorAll('.fixed-bottom, .bottom-nav').forEach(element => {
    element.classList.add('safe-area-padding-bottom');
  });
}

/**
 * PWA機能のセットアップ
 */
function setupPWAFeatures() {
  // オンライン/オフライン状態の監視
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // 初期状態の確認
  updateOnlineStatus();
}

/**
 * オンライン/オフライン状態の更新
 */
function updateOnlineStatus() {
  if (navigator.onLine) {
    document.documentElement.classList.remove('offline-mode');
    document.documentElement.classList.add('online-mode');
  } else {
    document.documentElement.classList.remove('online-mode');
    document.documentElement.classList.add('offline-mode');
    
    // オフライン通知の表示
    showOfflineNotification();
  }
}

/**
 * オフライン通知の表示
 */
function showOfflineNotification() {
  // 既存の通知を確認
  if (document.querySelector('.offline-notification')) return;
  
  const notification = document.createElement('div');
  notification.className = 'offline-notification';
  notification.innerHTML = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <i class="bi bi-wifi-off me-2"></i>
      インターネット接続がオフラインです。一部の機能が制限されます。
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="閉じる"></button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // 5秒後に自動的に閉じる
  setTimeout(() => {
    const alert = notification.querySelector('.alert');
    if (alert) {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }
  }, 5000);
}

/**
 * 現在のナビゲーション項目をハイライト
 */
function highlightCurrentNavItem() {
  const currentPath = window.location.pathname;
  
  // 通常のナビゲーション
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/') {
      link.classList.add('active');
    }
  });
  
  // 下部ナビゲーション
  document.querySelectorAll('.bottom-nav-item').forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/') {
      link.classList.add('active');
    }
  });
}

/**
 * スクロール時のヘッダー挙動
 */
function setupScrollingHeader() {
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        // 下スクロール時はヘッダーを隠す
        if (scrollTop > lastScrollTop) {
          navbar.classList.add('navbar-hidden');
        } 
        // 上スクロール時はヘッダーを表示
        else {
          navbar.classList.remove('navbar-hidden');
        }
      } else {
        navbar.classList.remove('navbar-hidden');
      }
      
      lastScrollTop = scrollTop;
    }, { passive: true });
  }
}

/**
 * モバイルデバイスかどうかを判定
 */
function isMobileDevice() {
  return (window.innerWidth <= 767) || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}