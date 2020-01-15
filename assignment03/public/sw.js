var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';
var STATIC_URLS = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(cache => cache.addAll(STATIC_URLS))
  )
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});

self.addEventListener('fetch', function (event) { event.respondWith(cacheRouting(event.request)) });

function networkOnly(request) {
  console.log("--NETWORK ONLY-- Responding with:", request)
  return fetch(request);
}

async function cacheOnly(request) {
  const cache = await caches.match(request);

  if (cache) {
    console.log("--CACHE ONLY-- Responding with:", caches);
    return cache;
  } else {
    console.log("--CACHE ONLY-- Request not found", request);
  }
}

async function networkFallbackToCache(request) {
  try {
    const response = await fetch(request);
    console.log("--NETWORK SUCCESS-- Responding with:", response);
    const cache = await caches.open(CACHE_DYNAMIC_NAME);

    cache.put(request.url, response.clone());

    return response;
  } catch (error) {
    console.log(error)
    const cache = await caches.match(request);
    if (cache) {
      console.log("--CACHE SUCCESS-- Responding with:", cache);
      return cache;
    } else {
      console.log("--CACHE MISS--");
    }
  }
}

async function cacheFallbackToNetwork(request) {
  const cache = await caches.match(request);
  if (cache) {
    console.log("--CACHE SUCCESS-- Responding with:", cache);
    return cache;
  } else {
    console.log("--CACHE MISS--");
    return (fetch(request));
  }
}

async function cacheRouting(request) {
  let response;
  if (request.url === 'https://httpbin.org/ip') {
    const cache = await caches.open(CACHE_DYNAMIC_NAME);
    response = await fetch(request);

    cache.put(request.url, response.clone());
  } else if (STATIC_URLS.includes(request.url)) {
    console.log("--STATIC URL--")
    return caches.match(request);
  } else {
    const cache = await caches.match(request);
    if (cache) {
      console.log("--CACHE SUCCESS-- Responding with:", cache);
      return cache;
    } else {
      console.log("--CACHE MISS--");
      response = await fetch(request);

      (await caches.open(CACHE_DYNAMIC_NAME)).put(request.url, response.clone());
    }
  }

  return response;
}

// event.respondWith(
//   caches.match(event.request)
//     .then(function (response) {
//       if (response) {
//         return response;
//       } else {
//         return fetch(event.request)
//           .then(function (res) {
//             return caches.open(CACHE_DYNAMIC_NAME)
//               .then(function (cache) {
//                 cache.put(event.request.url, res.clone());
//                 return res;
//               });
//           })
//           .catch(function (err) {

//           });
//       }
//     })
// );