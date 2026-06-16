const CACHE_NAME = 'histolite-v2'; // Увеличил версию, чтобы старый кэш гарантированно сбросился

// Файлы, которые будут закэшированы для офлайн-работы
const urlsToCache = [
  '/HistoLite/',
  '/HistoLite/index.html'
];

// Установка Service Worker — кэшируем основные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // <-- НОВОЕ: заставляет новый Service Worker активироваться сразу, без ожидания
  );
});

// Перехватываем запросы и отдаём из кэша, если есть
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Активация — удаляем старые кэши и забираем контроль над страницей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim()) // <-- НОВОЕ: новый Service Worker сразу берёт управление на себя
  );
});
