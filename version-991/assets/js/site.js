(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
            return;
        }
        document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        var toggle = document.querySelector('[data-nav-toggle]');
        var links = document.querySelector('[data-nav-links]');
        if (toggle && links) {
            toggle.addEventListener('click', function () {
                links.classList.toggle('is-open');
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var previous = hero.querySelector('[data-hero-prev]');
            var next = hero.querySelector('[data-hero-next]');
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('is-active', slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('is-active', dotIndex === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener('click', function () {
                    show(index);
                    start();
                });
            });

            if (previous) {
                previous.addEventListener('click', function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener('click', function () {
                    show(current + 1);
                    start();
                });
            }

            hero.addEventListener('mouseenter', stop);
            hero.addEventListener('mouseleave', start);
            show(0);
            start();
        }

        var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
        forms.forEach(function (form) {
            var input = form.querySelector('[data-filter-input]');
            var list = document.querySelector('[data-filter-list]');
            if (!input || !list) {
                return;
            }
            var params = new URLSearchParams(window.location.search);
            var initial = params.get('q') || '';
            input.value = initial;

            function filter() {
                var value = input.value.trim().toLowerCase();
                Array.prototype.slice.call(list.querySelectorAll('[data-search]')).forEach(function (item) {
                    var text = (item.getAttribute('data-search') || '').toLowerCase();
                    item.setAttribute('data-filter-hidden', value && text.indexOf(value) === -1 ? 'true' : 'false');
                });
            }

            input.addEventListener('input', filter);
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                filter();
            });
            filter();
        });

        var video = document.querySelector('[data-video-player]');
        var startButton = document.querySelector('[data-player-start]');
        var cover = document.querySelector('[data-player-cover]');
        var stream = window.movieStream;
        if (video && startButton && stream) {
            var connected = false;
            var hlsPlayer = null;

            function connect() {
                if (connected) {
                    return;
                }
                connected = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsPlayer = new window.Hls({ enableWorker: true });
                    hlsPlayer.loadSource(stream);
                    hlsPlayer.attachMedia(video);
                    return;
                }
                video.src = stream;
            }

            function play() {
                connect();
                if (cover) {
                    cover.classList.add('is-hidden');
                }
                video.controls = true;
                var promise = video.play();
                if (promise && promise.catch) {
                    promise.catch(function () {});
                }
            }

            startButton.addEventListener('click', play);
            if (cover && cover !== startButton) {
                cover.addEventListener('click', play);
            }
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
        }
    });
})();
