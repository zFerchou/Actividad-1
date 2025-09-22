// src/service-worker.js
/* global workbox */
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Cachea assets estáticos (html, js, css, images)
registerRoute(
  ({ request }) => ['document', 'script', 'style', 'image', 'font'].includes(request.destination),
  new StaleWhileRevalidate()
);

// Cachea peticiones a la API (solo GET)
registerRoute(
  ({ url, request }) => url.pathname.startsWith('/api/') && request.method === 'GET',
  new StaleWhileRevalidate()
);
