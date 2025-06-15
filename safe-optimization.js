/**
 * 安全な性能最適化スクリプト
 * 既存機能を破損させない最小限の改善
 */

(function() {
  'use strict';

  // 1. 画像の遅延読み込み（安全版）
  function implementSafeLazyLoading() {
    // ページ読み込み完了後に実行
    window.addEventListener('load', () => {
      const images = document.querySelectorAll('img:not([loading])');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              imageObserver.unobserve(img);
            }
          });
        });

        // 最初に表示される画像以外を遅延読み込み対象に
        images.forEach((img, index) => {
          if (index > 3) { // 最初の3枚は即座に読み込み
            const rect = img.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
              img.dataset.src = img.src;
              img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmM3NTdkIj7oqq3jgb/ovrzjgb/kuK3jgafjgZk8L3RleHQ+PC9zdmc+';
              imageObserver.observe(img);
            }
          }
        });
      }
    });
  }

  // 2. Service Worker登録（エラーハンドリング強化）
  function registerServiceWorkerSafely() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered successfully');
          })
          .catch(error => {
            console.log('SW registration failed, continuing without cache');
          });
      });
    }
  }

  // 3. フォームの最適化（最小限）
  function optimizeForms() {
    const inputs = document.querySelectorAll('input[type="email"], input[type="tel"], input[type="number"]');
    
    inputs.forEach(input => {
      // モバイルキーボード最適化
      if (input.type === 'email' && !input.hasAttribute('inputmode')) {
        input.setAttribute('inputmode', 'email');
      } else if (input.type === 'tel' && !input.hasAttribute('inputmode')) {
        input.setAttribute('inputmode', 'tel');
      } else if (input.type === 'number' && !input.hasAttribute('inputmode')) {
        input.setAttribute('inputmode', 'numeric');
      }
    });
  }

  // 4. リソースプリロード（重要なもののみ）
  function preloadCriticalResources() {
    const criticalCSS = [
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css'
    ];

    criticalCSS.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  // 5. スムーススクロール（既存機能に影響なし）
  function addSmoothScrolling() {
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 6. 基本的なパフォーマンス監視
  function addBasicPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              const lcp = entry.startTime;
              if (lcp > 4000) {
                console.warn('LCP is slow:', lcp + 'ms');
              }
            }
          });
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('Performance monitoring not available');
      }
    }
  }

  // 7. 最小限のモバイル最適化
  function addMinimalMobileOptimizations() {
    // モバイルビューポート最適化
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewport);
    }

    // タッチアクション最適化
    const style = document.createElement('style');
    style.textContent = `
      .swiper-container, .carousel {
        touch-action: pan-y pinch-zoom;
      }
      
      button, .btn {
        touch-action: manipulation;
      }
    `;
    document.head.appendChild(style);
  }

  // 初期化関数
  function init() {
    // DOM準備完了後に安全に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
      runOptimizations();
    }
  }

  function runOptimizations() {
    try {
      addSmoothScrolling();
      addMinimalMobileOptimizations();
      optimizeForms();
      addBasicPerformanceMonitoring();
      
      // 重い処理は少し遅らせて実行
      setTimeout(() => {
        preloadCriticalResources();
        implementSafeLazyLoading();
        registerServiceWorkerSafely();
      }, 1000);
      
    } catch (error) {
      console.log('Some optimizations failed, continuing normally');
    }
  }

  // 開始
  init();

})();