const staticCharInTheBay = "char-in-the-bay"
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/js/jquery.countdown.min.js",
  "/js/jquery.min.js",
  "/js/luxon.min.js",
  "/images/char.png",
  "/images/kl.svg",
  "/images/plane.png",
  "/images/sf.png",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticCharInTheBay)
    .then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request)
    .then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})