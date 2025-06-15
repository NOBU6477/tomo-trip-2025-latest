/**
 * 性能最適化とモバイルUX改善スクリプト
 * 画像のLazy-loading、CDN最適化、キャッシュ制御、モバイルタッチ操作改善を実装
 */

(function() {
  'use strict';

  // 1. 画像Lazy-loading実装
  function implementImageLazyLoading() {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
      
      // WebP対応の画像最適化
      if (supportsWebP()) {
        const src = img.src;
        if (src.includes('placehold.co') || src.includes('unsplash.com')) {
          // 画像URLにWebP形式の指定を追加
          img.src = src + (src.includes('?') ? '&' : '?') + 'fm=webp&q=80';
        }
      }
    });
  }

  // WebP対応チェック
  function supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // 2. CSS/JS最適化とプリロード
  function optimizeResourceLoading() {
    // 重要なリソースをプリロード
    const criticalResources = [
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
      'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css'
    ];

    criticalResources.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = function() { this.rel = 'stylesheet'; };
      document.head.appendChild(link);
    });

    // 非クリティカルJSの遅延読み込み
    const deferredScripts = [
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
      'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js'
    ];

    window.addEventListener('load', () => {
      deferredScripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
      });
    });
  }

  // 3. モバイルタッチ操作最適化
  function optimizeMobileTouch() {
    // タッチエリアの最小サイズ確保 (44px x 44px)
    const touchElements = document.querySelectorAll('button, a, .card, .form-control');
    touchElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      const height = parseInt(computedStyle.height);
      const width = parseInt(computedStyle.width);
      
      if (height < 44) {
        el.style.minHeight = '44px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
      }
      
      if (width < 44) {
        el.style.minWidth = '44px';
      }
    });

    // スワイプジェスチャー改善
    const swipeElements = document.querySelectorAll('.swiper-container, .carousel');
    swipeElements.forEach(el => {
      el.style.touchAction = 'pan-y pinch-zoom';
    });

    // ボタンのタップ反応改善
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(btn => {
      btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      }, { passive: true });
      
      btn.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      }, { passive: true });
    });
  }

  // 4. ナビゲーション最適化
  function optimizeNavigation() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      // スムーズスクロール実装
      const navLinks = navbar.querySelectorAll('a[href^="#"]');
      navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

      // ハンバーガーメニューのアクセシビリティ改善
      const navToggle = navbar.querySelector('.navbar-toggler');
      const navCollapse = navbar.querySelector('.navbar-collapse');
      
      if (navToggle && navCollapse) {
        navToggle.addEventListener('click', function() {
          const isExpanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !isExpanded);
        });

        // メニュー外タップで閉じる
        document.addEventListener('click', function(e) {
          if (!navbar.contains(e.target) && navCollapse.classList.contains('show')) {
            navToggle.click();
          }
        });
      }
    }
  }

  // 5. パフォーマンス監視とレポート
  function implementPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint監視
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay監視
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  // 6. レスポンシブ画像実装
  function implementResponsiveImages() {
    const images = document.querySelectorAll('.guide-image, .card-img-top');
    images.forEach(img => {
      const src = img.src;
      
      // レスポンシブ画像のsrcset実装
      if (src.includes('placehold.co') || src.includes('unsplash.com')) {
        const baseSrc = src.split('?')[0];
        img.srcset = `
          ${baseSrc}?w=300&q=80 300w,
          ${baseSrc}?w=600&q=80 600w,
          ${baseSrc}?w=900&q=80 900w
        `;
        img.sizes = `
          (max-width: 576px) 300px,
          (max-width: 768px) 600px,
          900px
        `;
      }
    });
  }

  // 7. フォーム最適化
  function optimizeForms() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // モバイルキーボード最適化
      if (input.type === 'email') {
        input.setAttribute('inputmode', 'email');
      } else if (input.type === 'tel') {
        input.setAttribute('inputmode', 'tel');
      } else if (input.type === 'number') {
        input.setAttribute('inputmode', 'numeric');
      }

      // フォーカス時のズーム防止
      input.addEventListener('focus', function() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          );
        }
      });

      input.addEventListener('blur', function() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0'
          );
        }
      });
    });
  }

  // 8. Service Worker実装（簡易版）
  function implementServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }

  // 初期化
  function init() {
    // DOM読み込み完了後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
      runOptimizations();
    }
  }

  function runOptimizations() {
    implementImageLazyLoading();
    optimizeResourceLoading();
    optimizeMobileTouch();
    optimizeNavigation();
    implementResponsiveImages();
    optimizeForms();
    implementPerformanceMonitoring();
    
    // ページ完全読み込み後の最適化
    window.addEventListener('load', () => {
      implementServiceWorker();
    });
  }

  // スクリプト実行
  init();

})();