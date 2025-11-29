const CACHE_NAME = 'sendiabete-pro-v1.0.0';

// Fichiers à mettre en cache pour la PWA
const urlsToCache = [
  './',                    // Racine
  './index.html',          // Page de connexion
  './app.html',            // Application principale
  './admin.html',          // Admin (optionnel)
  './styles.css',          // Styles
  './manifest.json',       // Configuration PWA
  'https://i.postimg.cc/jS7RdL11/logo-v2.png', // Logo
  'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js' // Bibliothèque PDF
];

// Installation
self.addEventListener('install', function(event) {
  console.log('🚀 Service Worker installé');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Mise en cache des ressources');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('✅ Toutes les ressources sont en cache');
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.error('❌ Erreur cache:', error);
      })
  );
});

// Activation
self.addEventListener('activate', function(event) {
  console.log('🎯 Service Worker activé');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('🎉 Service Worker prêt');
      return self.clients.claim();
    })
  );
});

// Interception requêtes
self.addEventListener('fetch', function(event) {
  // Ignorer les requêtes API
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('openai.com')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});