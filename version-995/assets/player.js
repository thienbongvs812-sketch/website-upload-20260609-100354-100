(function () {
  window.initMoviePlayer = function (source) {
    var video = document.getElementById('movie-player');
    var overlay = document.getElementById('play-overlay');
    if (!video || !source) {
      return;
    }

    var ready = false;
    var hls = null;

    function loadSource() {
      if (ready) {
        return Promise.resolve();
      }
      ready = true;
      video.controls = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }

      return new Promise(function (resolve) {
        if (video.readyState > 0) {
          resolve();
          return;
        }
        video.addEventListener('loadedmetadata', resolve, { once: true });
        window.setTimeout(resolve, 700);
      });
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function showOverlay() {
      if (overlay && video.paused && video.currentTime === 0) {
        overlay.classList.remove('is-hidden');
      }
    }

    function startPlayback() {
      hideOverlay();
      loadSource().then(function () {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            showOverlay();
          });
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', hideOverlay);
    video.addEventListener('ended', showOverlay);

    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  };
})();
