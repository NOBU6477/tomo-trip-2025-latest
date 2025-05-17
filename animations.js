/**
 * アニメーション効果の制御用スクリプト
 * UI要素に動的なアニメーション効果を適用する
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('アニメーション機能を初期化');

  // 連続要素表示アニメーション（ガイドカードなど）
  initStaggerAnimation();
  
  // スクロール時のフェードインアニメーション
  initScrollAnimations();
  
  // モーダル表示時のアニメーション強化
  enhanceModalAnimations();
  
  // 要素のホバーエフェクト適用
  applyHoverEffects();
  
  // モバイルタッチ効果の適用
  applyMobileEffects();
});

/**
 * 連続して要素を表示するアニメーション
 */
function initStaggerAnimation() {
  // 対象要素を取得（ガイドカード、メッセージリストなど）
  const staggerContainers = document.querySelectorAll('.guide-list, .message-list, .schedule-list');
  
  staggerContainers.forEach(container => {
    const items = container.querySelectorAll('.guide-card, .message-list-item, .schedule-item');
    
    // 各要素に遅延時間を設定
    items.forEach((item, index) => {
      item.classList.add('stagger-item');
      
      // 表示状態を確認して初期アニメーションを適用
      if (isElementInViewport(item)) {
        setTimeout(() => {
          item.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        }, 100);
      }
    });
  });
}

/**
 * スクロール時のアニメーション
 */
function initScrollAnimations() {
  // フェードイン要素に適用
  const fadeElements = document.querySelectorAll('.fade-in-element');
  
  // スクロールイベントリスナーを追加
  document.addEventListener('scroll', function() {
    fadeElements.forEach(element => {
      if (isElementInViewport(element)) {
        element.classList.add('visible');
      }
    });
    
    // 連続表示要素のアニメーション
    const staggerItems = document.querySelectorAll('.stagger-item:not([style*="animation"])');
    staggerItems.forEach((item, index) => {
      if (isElementInViewport(item)) {
        item.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
      }
    });
  });
  
  // 初期表示時のチェック
  setTimeout(() => {
    fadeElements.forEach(element => {
      if (isElementInViewport(element)) {
        element.classList.add('visible');
      }
    });
  }, 300);
}

/**
 * モーダルアニメーションの強化
 */
function enhanceModalAnimations() {
  // Bootstrapのモーダルイベントを利用
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('show.bs.modal', function() {
      // モーダル内の要素に順番にアニメーションを適用
      const elements = this.querySelectorAll('.modal-header, .modal-body > *, .modal-footer');
      elements.forEach((element, index) => {
        element.style.opacity = '0';
        setTimeout(() => {
          element.style.animation = `fadeIn 0.3s ease forwards ${index * 0.1}s`;
        }, 300);
      });
    });
  });
}

/**
 * ホバーエフェクトの適用
 */
function applyHoverEffects() {
  // ガイドカードにホバーエフェクトを適用
  document.querySelectorAll('.guide-card').forEach(card => {
    card.classList.add('hover-lift');
  });
  
  // ボタンにクリックエフェクトを適用
  document.querySelectorAll('.btn').forEach(button => {
    button.classList.add('click-pulse');
  });
  
  // ギャラリー項目に特殊効果を適用
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.classList.add('hover-grow');
  });
}

/**
 * モバイルタッチ効果の適用
 */
function applyMobileEffects() {
  if (isMobileDevice()) {
    // タッチ可能な要素にタッチエフェクトを適用
    document.querySelectorAll('.btn, .card, .guide-card, .nav-link').forEach(element => {
      element.classList.add('touch-highlight');
    });
  }
}

/**
 * 要素が表示領域内にあるかを判定
 */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * モバイルデバイスかどうかを判定
 */
function isMobileDevice() {
  return (window.innerWidth <= 767) || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 特定の要素にスケルトンローディング効果を適用
 */
function applySkeletonLoading(element, duration = 1500) {
  element.classList.add('skeleton-loading');
  
  setTimeout(() => {
    element.classList.remove('skeleton-loading');
  }, duration);
}

// グローバルに公開する関数
window.animateElement = function(element, animationType) {
  element.classList.add(`animate-${animationType}`);
  
  // アニメーション完了後にクラスを削除
  element.addEventListener('animationend', () => {
    element.classList.remove(`animate-${animationType}`);
  }, { once: true });
};