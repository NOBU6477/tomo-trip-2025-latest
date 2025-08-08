// Service Worker Disabled for CSP Compliance
// This service worker intentionally does nothing

console.log('Service Worker disabled - CSP compliant mode');

// No-op event listeners
self.addEventListener('install', () => {});
self.addEventListener('activate', () => {});
self.addEventListener('fetch', () => {});