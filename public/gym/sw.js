self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Gym Tracker', {
      body: data.body || 'Notification',
      icon: '/gym/icon.png',
      tag: 'rest-timer',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/gym'));
});
