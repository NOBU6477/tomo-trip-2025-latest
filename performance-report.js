/**
 * パフォーマンス測定・報告スクリプト
 * 最適化前後の性能比較と改善効果の定量化
 */

(function() {
  'use strict';

  const performanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    imageLoadTimes: [],
    jsLoadTimes: [],
    cssLoadTimes: []
  };

  // 1. Core Web Vitals測定
  function measureCoreWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        performanceMetrics.lcp = lastEntry.startTime;
        
        // LCP評価
        const rating = lastEntry.startTime <= 2500 ? 'good' : 
                      lastEntry.startTime <= 4000 ? 'needs-improvement' : 'poor';
        console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms (${rating})`);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          performanceMetrics.fid = entry.processingStart - entry.startTime;
          const rating = performanceMetrics.fid <= 100 ? 'good' : 
                        performanceMetrics.fid <= 300 ? 'needs-improvement' : 'poor';
          console.log(`FID: ${performanceMetrics.fid.toFixed(2)}ms (${rating})`);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        performanceMetrics.cls = clsValue;
        const rating = clsValue <= 0.1 ? 'good' : 
                      clsValue <= 0.25 ? 'needs-improvement' : 'poor';
        console.log(`CLS: ${clsValue.toFixed(3)} (${rating})`);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          performanceMetrics.fcp = entry.startTime;
          const rating = entry.startTime <= 1800 ? 'good' : 
                        entry.startTime <= 3000 ? 'needs-improvement' : 'poor';
          console.log(`FCP: ${entry.startTime.toFixed(2)}ms (${rating})`);
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    }
  }

  // 2. リソース読み込み時間測定
  function measureResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    
    resources.forEach(resource => {
      const loadTime = resource.responseEnd - resource.requestStart;
      
      if (resource.name.includes('.jpg') || resource.name.includes('.png') || 
          resource.name.includes('.webp') || resource.name.includes('image')) {
        performanceMetrics.imageLoadTimes.push(loadTime);
      } else if (resource.name.includes('.js')) {
        performanceMetrics.jsLoadTimes.push(loadTime);
      } else if (resource.name.includes('.css')) {
        performanceMetrics.cssLoadTimes.push(loadTime);
      }
    });

    // 平均読み込み時間
    const avgImageLoad = performanceMetrics.imageLoadTimes.length > 0 ? 
      performanceMetrics.imageLoadTimes.reduce((a, b) => a + b, 0) / performanceMetrics.imageLoadTimes.length : 0;
    const avgJSLoad = performanceMetrics.jsLoadTimes.length > 0 ?
      performanceMetrics.jsLoadTimes.reduce((a, b) => a + b, 0) / performanceMetrics.jsLoadTimes.length : 0;
    const avgCSSLoad = performanceMetrics.cssLoadTimes.length > 0 ?
      performanceMetrics.cssLoadTimes.reduce((a, b) => a + b, 0) / performanceMetrics.cssLoadTimes.length : 0;

    console.log(`平均画像読み込み時間: ${avgImageLoad.toFixed(2)}ms`);
    console.log(`平均JS読み込み時間: ${avgJSLoad.toFixed(2)}ms`);
    console.log(`平均CSS読み込み時間: ${avgCSSLoad.toFixed(2)}ms`);
  }

  // 3. ネットワーク情報取得
  function getNetworkInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      console.log(`接続タイプ: ${connection.effectiveType}`);
      console.log(`下り速度: ${connection.downlink}Mbps`);
      console.log(`RTT: ${connection.rtt}ms`);
    }
  }

  // 4. メモリ使用量測定
  function measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      console.log(`使用メモリ: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`総メモリ: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`メモリ制限: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
    }
  }

  // 5. Lazy Loading効果測定
  function measureLazyLoadingEffect() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    let visibleImages = 0;
    let totalImages = lazyImages.length;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleImages++;
          const loadStartTime = performance.now();
          
          entry.target.addEventListener('load', () => {
            const loadTime = performance.now() - loadStartTime;
            console.log(`Lazy画像読み込み完了: ${loadTime.toFixed(2)}ms`);
          });
        }
      });
    });

    lazyImages.forEach(img => observer.observe(img));
    
    console.log(`Lazy Loading対象画像: ${totalImages}枚`);
  }

  // 6. Service Worker効果測定
  function measureServiceWorkerEffect() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        console.log('Service Worker準備完了');
        
        // キャッシュヒット率測定
        caches.keys().then(cacheNames => {
          console.log(`アクティブキャッシュ数: ${cacheNames.length}`);
          
          cacheNames.forEach(cacheName => {
            caches.open(cacheName).then(cache => {
              cache.keys().then(keys => {
                console.log(`${cacheName}: ${keys.length}個のリソースをキャッシュ中`);
              });
            });
          });
        });
      });
    }
  }

  // 7. 総合レポート生成
  function generatePerformanceReport() {
    setTimeout(() => {
      const report = {
        timestamp: new Date().toISOString(),
        coreWebVitals: {
          lcp: performanceMetrics.lcp,
          fid: performanceMetrics.fid,
          cls: performanceMetrics.cls,
          fcp: performanceMetrics.fcp
        },
        resourceTiming: {
          imageLoadTimes: performanceMetrics.imageLoadTimes,
          jsLoadTimes: performanceMetrics.jsLoadTimes,
          cssLoadTimes: performanceMetrics.cssLoadTimes
        },
        optimizations: {
          lazyLoadingEnabled: document.querySelectorAll('img[loading="lazy"]').length > 0,
          serviceWorkerActive: 'serviceWorker' in navigator,
          responsiveImagesEnabled: document.querySelectorAll('img[srcset]').length > 0
        }
      };

      console.log('📊 パフォーマンスレポート:', report);
      
      // ローカルストレージに保存
      localStorage.setItem('performanceReport', JSON.stringify(report));
    }, 5000);
  }

  // 8. 最適化効果の数値化
  function calculateOptimizationImpact() {
    const beforeOptimization = {
      lcp: 4500, // 最適化前の推定値
      imageLoadTime: 800,
      totalRequestCount: 50
    };

    setTimeout(() => {
      const currentLCP = performanceMetrics.lcp;
      const currentImageLoadTime = performanceMetrics.imageLoadTimes.length > 0 ?
        performanceMetrics.imageLoadTimes.reduce((a, b) => a + b, 0) / performanceMetrics.imageLoadTimes.length : 0;
      
      if (currentLCP && currentImageLoadTime > 0) {
        const lcpImprovement = ((beforeOptimization.lcp - currentLCP) / beforeOptimization.lcp * 100).toFixed(1);
        const imageLoadImprovement = ((beforeOptimization.imageLoadTime - currentImageLoadTime) / beforeOptimization.imageLoadTime * 100).toFixed(1);
        
        console.log(`🚀 最適化効果:`);
        console.log(`  LCP改善: ${lcpImprovement}%`);
        console.log(`  画像読み込み改善: ${imageLoadImprovement}%`);
        
        // HTTPリクエスト数の削減効果
        const resourceCount = performance.getEntriesByType('resource').length;
        const requestReduction = ((beforeOptimization.totalRequestCount - resourceCount) / beforeOptimization.totalRequestCount * 100).toFixed(1);
        console.log(`  リクエスト数削減: ${requestReduction}%`);
      }
    }, 7000);
  }

  // 初期化
  function init() {
    console.log('🔍 パフォーマンス測定開始');
    
    measureCoreWebVitals();
    getNetworkInfo();
    measureLazyLoadingEffect();
    measureServiceWorkerEffect();
    
    window.addEventListener('load', () => {
      measureResourceTiming();
      measureMemoryUsage();
      generatePerformanceReport();
      calculateOptimizationImpact();
    });
  }

  // 開始
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();