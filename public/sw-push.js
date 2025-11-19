// Custom Service Worker for Push Notifications
// This works alongside next-pwa's generated service worker

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push received:', event);

  if (!event.data) {
    console.log('[Service Worker] Push event has no data');
    return;
  }

  try {
    const data = event.data.json();
    console.log('[Service Worker] Push data:', data);

    const options = {
      body: data.body || 'New notification from Gyst',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/badge-96x96.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'gyst-notification',
      requireInteraction: data.requireInteraction || false,
      data: {
        url: data.data?.url || '/protected',
        ...data.data,
      },
      actions: data.actions || [
        {
          action: 'open',
          title: 'Open',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'close',
          title: 'Close',
        }
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Gyst', options)
    );
  } catch (error) {
    console.error('[Service Worker] Error processing push:', error);
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/protected';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open a new window if none found
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('notificationclose', function(event) {
  console.log('[Service Worker] Notification closed:', event);
});

// Handle push subscription changes
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker] Push subscription changed');

  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: self.registration.applicationServerKey
    }).then(function(newSubscription) {
      console.log('[Service Worker] New subscription:', newSubscription);
      // TODO: Send new subscription to server
      return fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubscription)
      });
    })
  );
});

console.log('[Service Worker] Push notification handlers registered');
