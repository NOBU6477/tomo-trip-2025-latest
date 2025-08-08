// Service Worker - Basic Implementation
// Prevents 404 error for sw.js

self.addEventListener('install', function(event) {
    // Skip waiting to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    // Take control of all pages immediately
    event.waitUntil(self.clients.claim());
});

// Basic fetch handler - pass through all requests
self.addEventListener('fetch', function(event) {
    // Let the browser handle all fetch requests normally
    return;
});

console.log('Service Worker registered successfully');