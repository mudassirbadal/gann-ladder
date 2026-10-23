const CACHE_NAME = 'gann-terminal-v2';
const STATIC_ASSETS = ['/', '/index.html', '/pwa-icon.svg', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.hostname.includes('binance.com') || url.hostname.includes('telegram.org') || url.hostname.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        })
      );
    })
  );
});

// ============================================================================
// OS LOCK-SCREEN & BACKGROUND PUSH NOTIFICATIONS
// ============================================================================

// 1. Web Push event from background server / cloud
self.addEventListener('push', (event) => {
  let payload = {
    title: 'Gann Radar Alert',
    body: 'Gann harmonic level reaction triggered.',
    icon: '/pwa-icon.svg',
    badge: '/pwa-icon.svg',
    tag: 'gann-push-alert',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || '/pwa-icon.svg',
    badge: payload.badge || '/pwa-icon.svg',
    tag: payload.tag || 'gann-alert',
    vibrate: [200, 100, 200, 100, 300],
    requireInteraction: true,
    data: payload.data || { url: '/' }
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// 2. Notification click handler (opens or focuses app from phone lock screen)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// 3. Client message dispatcher to trigger OS-level notification from Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      ...options,
      icon: options?.icon || '/pwa-icon.svg',
      badge: options?.badge || '/pwa-icon.svg',
      vibrate: [200, 100, 200],
      requireInteraction: true
    });
  }
});
