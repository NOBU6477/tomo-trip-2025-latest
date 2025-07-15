/**
 * Service Worker - キャッシュ制御とオフライン対応
 */

const CACHE_NAME = 'local-guide-v1.2';
const STATIC_CACHE = 'static-v1.2';
const DYNAMIC_CACHE = 'dynamic-v1.2';

// キャッシュするリソース（404エラーファイルを除外）
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/guide-registration-form.html',
  '/guide-profile.html',
  '/performance-optimization.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js'
];

// インストール時のキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// アクティベート時の古いキャッシュ削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// フェッチ時のキャッシュ戦略
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // 404エラーファイルのリクエストをスキップ
  const skip404Files = [
    'console-debug-helper.js',
    'bootstrap-modal-scroll-fix.js', 
    'complete-language-fix.js',
    'guide-login-debug.js',
    'session-debugger.js'
  ];
  
  // 404エラーファイルを空レスポンスで処理
  if (skip404Files.some(file => request.url.includes(file))) {
    event.respondWith(new Response('', { status: 200 }));
    return;
  }
  
  // ナビゲーションリクエスト: Network First
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 静的リソース: Cache First
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    );
    return;
  }

  // 画像: Cache First with Fallback
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response;
          
          return fetch(request)
            .then(fetchResponse => {
              if (fetchResponse.ok) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return fetchResponse;
            })
            .catch(() => {
              // 画像が読み込めない場合のフォールバック
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f8f9fa"/><text x="200" y="150" text-anchor="middle" fill="#6c757d">画像を読み込めません</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            });
        })
    );
    return;
  }

  // その他のリクエスト: Network First
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});