
var version = '0.0.14';
var cacheName = 'sample-ch';
var cache = version + '-' + cacheName;

var filesToCache = [
                    '/Scripts/ServiceWorker/skinnybar.helper.js',
                    '/Themes/main.min.css',
                    '/Features/ServiceWorker/ServiceWorkerSample.html'
];

self.addEventListener('install', function (event) {
    // Perform some task
    console.log('installed....');
    event.waitUntil(caches.open(cache).then(function (cache) {
                            console.log('[ServiceWorker] Caching files');
                            cache.addAll(filesToCache);
                        })
                    );

});


self.addEventListener('activate', function (event) {
    // Perform some task
    console.log('activating....');
    event.waitUntil(
                    caches.keys()
                    .then(function (keyList) {                        
                        Promise.all(keyList.map(function (key) {
                            console.log(key);
                            if (key !== cache) {
                                console.log('[ServiceWorker] Removing old cache ', key);
                                //return caches.delete(key);
                            }
                        })
                        );
                    })
                );
});

self.addEventListener("fetch", function (event) {
    //fetch request as specified by event object 
    console.log("Resource requested is :- ", event.request.url); //Note that Request and Response are also objects 

    event.respondWith(    
                        caches.match(event.request)
                            .then(function (response) {
                                if (response) {
                                    console.log("Fulfilling " + event.request.url + " from cache.");                                   
                                    return response;
                                } else {
                                    console.log(event.request.url + " not found in cache fetching from network.");                                 
                                    return fetch(event.request);
                                }
                            })
                    );
});