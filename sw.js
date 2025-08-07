// Service Worker for TomoTrip
// Simple service worker to prevent 404 errors

self.addEventListener('install', function(event) {
  console.log('TomoTrip Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('TomoTrip Service Worker activated');
});

self.addEventListener('fetch', function(event) {
  // Let the browser handle all requests normally
  return;
});