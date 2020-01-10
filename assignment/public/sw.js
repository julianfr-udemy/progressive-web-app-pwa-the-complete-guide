const STATIC_CACHE_NAME = "static-v2";
const DYNAMIC_CACHE_NAME = "dynamic-v1";

self.addEventListener("install", function (event) {
  console.log("[Service Worker] I live... again!");
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(function (cache) {
        cache.addAll([
          "/",
          "/index.html",
          "/src/js/main.js",
          "/src/js/material.min.js",
          "/src/css/app.css",
          "/src/css/main.css",
          "https://fonts.googleapis.com/css?family=Roboto:400,700",
          "https://fonts.googleapis.com/icon?family=Material+Icons",
          "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
        ])
      })
  );
});

self.addEventListener("activate", function (event) {
  console.log("[Service Worker] Activate");
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (cache) {
        if (cache) {
          return cache;
        } else {
          return fetch(event.request)
            .then(function (response) {
              return caches
                .open(DYNAMIC_CACHE_NAME)
                .then(function (cache) {
                  cache.put(event.request.url, response.clone());
                  return response;
                })
            })
        }
      })
  );
});