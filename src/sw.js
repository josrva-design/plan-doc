/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ url }) => url.pathname.startsWith('/icons/'),
  new CacheFirst({ cacheName: 'pwa-icons', plugins: [] }),
  'GET'
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/assets/'),
  new CacheFirst({ cacheName: 'pwa-assets', plugins: [] }),
  'GET'
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
