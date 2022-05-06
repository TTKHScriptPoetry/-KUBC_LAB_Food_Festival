const FILES_TO_CACHE = [
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js"
];

const APP_PREFIX = 'FoodFest-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION; // FoodFest- version_01

self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  // respondWith to intercept the fetch request
  e.respondWith(
    // to determine if the resource already exists in caches:
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // Omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// The context of self here refers to the service worker object.
// Service workers run before the window object has even been created
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME) //installing cache :  FoodFest- version_01
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

self.addEventListener('activate', function (e) {
    e.waitUntil(
      caches.keys().then(function (keyList) {   // .keys() returns an array of all cache names, which we're calling keyList.
        // `keyList` contains all cache names under your username.github.io
        // filter out ones that has this app prefix to create keeplist
        // console.log (keyList);
        let cacheKeeplist = keyList.filter(function (key) {
          return key.indexOf(APP_PREFIX); // find FoodFest-
        });
        // add current cache name to keeplist
        cacheKeeplist.push(CACHE_NAME);
        return Promise.all(keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i] );
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

