// CyberSafe Progressive Web App Service Worker
// Version: 2.1.0 - Updated for better cache management
const CACHE_NAME = 'cybersafe-pwa-v2.1.1';
const API_CACHE_NAME = 'cybersafe-api-v2.6';
const STATIC_ASSETS = [
  // Core HTML
  '/',
  '/index.html',
  '/auth/index.html',
  '/auth/reset-password.html',
  '/auth/success.html',
  '/auth/verify.html',

  // CSS Files
  '/styles/main.css',
  '/styles/auth.css',
  '/styles/dashboard.css',
  '/styles/profile.css',
  '/styles/email-verification.css',
  '/auth/style.css',

  // JavaScript Files
  '/scripts/app.js',
  '/scripts/auth.js',
  '/scripts/dashboard.js',
  '/scripts/modules.js',
  '/scripts/quiz-system.js',
  '/scripts/video-player.js',
  '/scripts/module-content.js',
  '/scripts/casestudy.js',
  '/scripts/navigation-manager.js',
  '/scripts/app-enhancements.js',
  '/scripts/profile-manager.js',
  '/scripts/firebase-config.js',
  '/scripts/firestore-service.js',
  '/scripts/assets-service.js',
  '/auth/script.js',
  '/auth/verify.js',

  // Assets
  '/assets/icons/logo.svg',
  '/manifest.json'
];

const DYNAMIC_ASSETS = [
  // External dependencies
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'
];

// Track notification state to prevent spam
let lastNotificationTime = 0;
const NOTIFICATION_COOLDOWN = 30000; // 30 seconds between notifications

// Development mode detection
const isDevelopment = self.location.hostname === 'localhost' || 
                     self.location.hostname === '127.0.0.1';

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker: Installing...');
  
  if (isDevelopment) {
    // Skip waiting immediately in development
    console.log('🔧 Development mode - skipping waiting');
    self.skipWaiting();
    return;
  }
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('📦 Caching static assets...');
          return cache.addAll(STATIC_ASSETS);
        }),
      caches.open(API_CACHE_NAME)
        .then(cache => {
          console.log('🌐 Caching dynamic assets...');
          return cache.addAll(DYNAMIC_ASSETS);
        })
    ]).then(() => {
      console.log('✅ All assets cached successfully');
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ Cache installation failed:', error);
    })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete ALL old caches (more aggressive cleanup)
          if (cacheName.startsWith('cybersafe-') && 
              cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated and ready');
      
      // Send test notification on activation (only in production)
      if (!isDevelopment) {
        sendTestNotification('Service Worker Activated', 'CyberSafe is now ready for offline use! 🚀');
      }
      
      // Claim clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch Event - Smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Bypass cache for HTML files in development
  if (isDevelopment && request.mode === 'navigate') {
    event.respondWith(fetch(request));
    return;
  }

  // Send test notification on page load (main HTML request) - only in production
  if (!isDevelopment && request.mode === 'navigate' && url.pathname === '/' && !url.search.includes('notification=disabled')) {
    setTimeout(() => {
      sendTestNotification('Welcome to CyberSafe!', 'Your cybersecurity learning journey starts here! 🛡️');
    }, 2000);
  }

  // Handle different types of requests with appropriate strategies
  event.respondWith(
    handleFetch(request).catch(error => {
      console.error('🚨 Fetch failed:', error);
      return handleOfflineFallback(request);
    })
  );
});

// Send test notification function
async function sendTestNotification(title, message) {
  // Don't send notifications in development
  if (isDevelopment) return;

  const now = Date.now();
  
  // Prevent notification spam
  if (now - lastNotificationTime < NOTIFICATION_COOLDOWN) {
    console.log('⏰ Notification cooldown active, skipping...');
    return;
  }

  try {
    // Check if notifications are supported and granted
    if (self.Notification && self.Notification.permission === 'granted') {
      const options = {
        body: message,
        icon: '/assets/icons/logo.svg',
        badge: '/assets/icons/logo.svg',
        image: '/assets/icons/logo.svg',
        vibrate: [100, 50, 100],
        tag: 'cybersafe-test-notification',
        requireInteraction: false,
        actions: [
          {
            action: 'explore',
            title: 'Explore Modules',
            icon: '/assets/icons/logo.svg'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/assets/icons/logo.svg'
          }
        ],
        data: {
          url: '/',
          timestamp: new Date().toISOString(),
          type: 'test-notification'
        }
      };

      await self.registration.showNotification(title, options);
      lastNotificationTime = now;
      console.log('🔔 Test notification sent:', title);
      
    } else if (self.Notification && self.Notification.permission === 'default') {
      console.log('🔔 Notification permission not granted, requesting...');
    }
  } catch (error) {
    console.error('❌ Failed to send notification:', error);
  }
}

// Smart fetch handler with different strategies
async function handleFetch(request) {
  const url = new URL(request.url);

  // Development mode: network only for same-origin requests
  if (isDevelopment && url.origin === self.location.origin) {
    try {
      const networkResponse = await fetch(request);
      return networkResponse;
    } catch (error) {
      console.log('🌐 Development network failed, trying cache...');
      const cached = await caches.match(request);
      if (cached) return cached;
      throw error;
    }
  }

  // Strategy 1: Cache First for static assets
  if (isStaticAsset(url)) {
    return cacheFirst(request);
  }

  // Strategy 2: Network First for API calls
  if (isApiRequest(url)) {
    return networkFirst(request);
  }

  // Strategy 3: Stale While Revalidate for dynamic content
  if (isDynamicContent(url)) {
    return staleWhileRevalidate(request);
  }

  // Default: Network First with cache fallback
  return networkFirst(request);
}

// Caching Strategies
async function cacheFirst(request) {
  // Bypass cache for HTML in development
  if (isDevelopment && request.url.includes('.html')) {
    try {
      return await fetch(request);
    } catch (error) {
      // Fall back to cache if network fails
      const cached = await caches.match(request);
      if (cached) return cached;
      throw error;
    }
  }

  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('📦 Serving from cache:', request.url);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && !isDevelopment) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // If both cache and network fail, return offline page
    return handleOfflineFallback(request);
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses (except in development)
    if (networkResponse.ok && !isDevelopment) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fall back to cache when network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('🌐 Network failed, serving from cache:', request.url);
      return cachedResponse;
    }
    
    throw error; // Re-throw to trigger offline fallback
  }
}

async function staleWhileRevalidate(request) {
  // Bypass cache in development
  if (isDevelopment) {
    return fetch(request);
  }

  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Return cached version immediately
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Silently fail - we already have cached version
  });

  return cachedResponse || fetchPromise;
}

// Offline fallback handler
async function handleOfflineFallback(request) {
  const url = new URL(request.url);

  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlinePage = await caches.match('/index.html');
    if (offlinePage) {
      // Send offline notification (only in production)
      if (!isDevelopment) {
        sendTestNotification('You\'re Offline', 'CyberSafe is working in offline mode. Some features may be limited.');
      }
      return offlinePage;
    }
  }

  // Return generic offline response for other requests
  return new Response(
    JSON.stringify({
      error: 'You are offline',
      message: 'Please check your internet connection and try again.',
      timestamp: new Date().toISOString()
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Helper functions to categorize requests
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.svg', '.json', '.html', '.ico'];
  const isStatic = staticExtensions.some(ext => url.pathname.endsWith(ext));
  
  return isStatic || 
         url.origin === self.location.origin && 
         (url.pathname.startsWith('/styles/') ||
          url.pathname.startsWith('/scripts/') ||
          url.pathname.startsWith('/assets/') ||
          url.pathname.startsWith('/auth/'));
}

function isApiRequest(url) {
  return url.href.includes('firebase') ||
         url.href.includes('googleapis') ||
         url.pathname.includes('/__/') || // Firebase hosting
         url.search.includes('apiKey=');
}

function isDynamicContent(url) {
  return url.pathname.includes('youtube.com') || // Video content
         url.pathname.includes('fonts.gstatic.com') || // Fonts
         url.pathname.includes('cdnjs.cloudflare.com'); // CDN assets
}

// Enhanced notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.tag);
  
  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data || {};

  if (action === 'explore' || action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        // Check if app is already open
        for (let client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            console.log('🎯 Focusing existing window');
            return client.focus();
          }
        }
        // Open new window if app isn't open
        if (clients.openWindow) {
          console.log('🪟 Opening new window');
          return clients.openWindow(notificationData.url || '/');
        }
      })
    );
  } else if (action === 'dismiss') {
    console.log('❌ Notification dismissed');
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow(notificationData.url || '/')
    );
  }
});

// Enhanced push notification handler
self.addEventListener('push', (event) => {
  console.log('📨 Push notification received');
  
  if (!event.data) {
    console.log('❌ Push event has no data');
    return;
  }

  try {
    const data = event.data.json();
    const title = data.title || 'CyberSafe';
    const options = {
      body: data.body || 'New update from CyberSafe',
      icon: '/assets/icons/logo.svg',
      badge: '/assets/icons/logo.svg',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        type: data.type || 'general'
      },
      actions: [
        {
          action: 'open',
          title: 'Open App'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
    
    console.log('✅ Push notification displayed');
  } catch (error) {
    console.error('❌ Error processing push notification:', error);
    
    // Fallback to simple notification
    event.waitUntil(
      self.registration.showNotification('CyberSafe', {
        body: 'New security update available!',
        icon: '/assets/icons/logo.svg'
      })
    );
  }
});

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    console.log('🔄 Performing background sync...');
    // Send sync notification (only in production)
    if (!isDevelopment) {
      sendTestNotification('Sync Complete', 'Your progress has been synchronized! ✅');
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
    if (!isDevelopment) {
      sendTestNotification('Sync Failed', 'Unable to sync your progress. Please check your connection.');
    }
  }
}

// Enhanced message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { data } = event;
  
  switch (data.type) {
    case 'SKIP_WAITING':
      console.log('⏩ Skipping waiting phase');
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        type: 'VERSION_INFO',
        version: '2.1.0',
        cacheName: CACHE_NAME,
        isDevelopment: isDevelopment
      });
      break;
      
    case 'SEND_TEST_NOTIFICATION':
      if (!isDevelopment) {
        sendTestNotification(data.title || 'Test Notification', data.message || 'This is a test notification from CyberSafe!');
      }
      break;
      
    case 'CLEAR_CACHE':
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('🗑️ Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('✅ All caches cleared');
        if (event.ports[0]) {
          event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
        }
      });
      break;
      
    case 'FORCE_RELOAD':
      console.log('🔄 Force reload requested');
      self.skipWaiting().then(() => {
        // Tell all clients to reload
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'FORCE_RELOAD' });
          });
        });
      });
      break;

    case 'GET_CACHE_INFO':
      caches.keys().then(cacheNames => {
        const cacheInfo = {
          type: 'CACHE_INFO',
          caches: cacheNames,
          currentCache: CACHE_NAME,
          isDevelopment: isDevelopment
        };
        if (event.ports[0]) {
          event.ports[0].postMessage(cacheInfo);
        }
      });
      break;
      
    default:
      console.log('📨 Unknown message type:', data.type);
  }
});

console.log('🚀 CyberSafe Service Worker loaded successfully!');
console.log('🔧 Development mode:', isDevelopment);
console.log('📦 Cache version:', CACHE_NAME);
