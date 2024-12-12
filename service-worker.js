self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/StyleHome.css',
          '/scriptHome.js',
          '/StyleJadwal.css',
          '/StyleSetTimer.css',
          '/SeninL1A.js',
          '/SeninL1P.js',
          '/SeninL2A.js',
          '/SeninL2P.js',
          '/SelasaL1A.js',
          '/SelasaL1P.js',
          '/SelasaL2A.js',
          '/SelasaL2P.js',
          '/RabuL1A.js',
          '/RabuL1P.js',
          '/RabuL2A.js',
          '/RabuL2P.js',
          '/KamisL1A.js',
          '/KamisL1P.js',
          '/KamisL2A.js',
          '/KamisL2P.js',
          '/JumatL1A.js',
          '/JumatL1P.js',
          '/JumatL2A.js',
          '/JumatL2P.js',
          '/SabtuL1A.js',
          '/SabtuL1P.js',
          '/SabtuL2A.js',
          '/SabtuL2P.js',
          '/MingguL1A.js',
          '/MingguL1P.js',
          '/MingguL2A.js',
          '/MingguL2P.js',
          '/JadwalL1A.html',
          '/JadwalL1P.html',
          '/JadwalL2A.html',
          '/JadwalL2P.html',
          '/TimerSeninL1A.html',
          '/TimerSeninL1P.html',
          '/TimerSeninL2A.html',
          '/TimerSeninL2P.html',
          '/TimerSelasaL1A.html',
          '/TimerSelasaL1P.html',
          '/TimerSelasaL2A.html',
          '/TimerSelasaL2P.html',
          '/TimerRabuL1A.html',
          '/TimerRabuL1P.html',
          '/TimerRabuL2A.html',
          '/TimerRabuL2P.html',
          '/TimerKamisL1A.html',
          '/TimerKamisL1P.html',
          '/TimerKamisL2A.html',
          '/TimerKamisL2P.html',
          '/TimerJumatL1A.html',
          '/TimerJumatL1P.html',
          '/TimerJumatL2A.html',
          '/TimerJumatL2P.html',
          '/TimerSabtuL1A.html',
          '/TimerSabtuL1P.html',
          '/TimerSabtuL2A.html',
          '/TimerSabtuL2P.html',
          '/TimerMingguL1A.html',
          '/TimerMingguL1P.html',
          '/TimerMingguL2A.html',
          '/TimerMingguL2P.html',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  });
  