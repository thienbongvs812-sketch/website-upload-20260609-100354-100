import { H as Hls } from './hls-vendor-dru42stk.js';

export function startMoviePlayer(options) {
    var video = document.querySelector(options.videoSelector);
    var overlay = document.querySelector(options.overlaySelector);
    var source = options.source;
    var loaded = false;
    var hls = null;

    if (!video || !source) {
        return;
    }

    function loadSource() {
        if (loaded) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            loaded = true;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            loaded = true;
            return;
        }

        video.src = source;
        loaded = true;
    }

    function hideOverlay() {
        if (overlay) {
            overlay.classList.add('is-hidden');
            overlay.setAttribute('aria-hidden', 'true');
        }
    }

    function playMovie() {
        loadSource();
        hideOverlay();
        video.controls = true;
        var attempt = video.play();

        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {
                video.controls = true;
            });
        }
    }

    if (overlay) {
        overlay.addEventListener('click', function (event) {
            event.preventDefault();
            playMovie();
        });
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playMovie();
        }
    });

    video.addEventListener('error', function () {
        if (hls && typeof hls.destroy === 'function') {
            hls.destroy();
        }
    });
}
