/* =========================================================
   ENGINEX SERVICE WORKER
========================================================= */

const CACHE_NAME =
    "enginex-v4";


const STATIC_FILES = [

    "/",

    "/index.html",

    "/style.css",

    "/script.js"

];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)

                .then(cache => {

                    return cache.addAll(
                        STATIC_FILES
                    );

                })

        );


        self.skipWaiting();

    }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()

                .then(keys => {

                    return Promise.all(

                        keys
                            .filter(
                                key =>
                                    key !==
                                    CACHE_NAME
                            )

                            .map(
                                key =>
                                    caches.delete(
                                        key
                                    )
                            )

                    );

                })

        );


        self.clients.claim();

    }
);


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        const url =
            new URL(
                request.url
            );


        /*
            Jangan cache API.
        */

        if (
            url.pathname.startsWith(
                "/api/"
            )
        ) {

            return;

        }


        /*
            Jangan cache request selain GET.
        */

        if (
            request.method !== "GET"
        ) {

            return;

        }


        /*
            External services seperti
            Supabase dan Midtrans
            tidak kita cache.
        */

        if (
            url.origin !==
            self.location.origin
        ) {

            return;

        }


        /*
            Network first.

            Ini mencegah user terus mendapat
            script lama sesudah deployment.
        */

        event.respondWith(

            fetch(request)

                .then(response => {

                    if (
                        response &&
                        response.status === 200
                    ) {

                        const copy =
                            response.clone();


                        caches
                            .open(
                                CACHE_NAME
                            )

                            .then(cache => {

                                cache.put(
                                    request,
                                    copy
                                );

                            });

                    }


                    return response;

                })

                .catch(() => {

                    return caches
                        .match(request)

                        .then(
                            cached =>
                                cached ||
                                caches.match(
                                    "/index.html"
                                )
                        );

                })

        );

    }

);
