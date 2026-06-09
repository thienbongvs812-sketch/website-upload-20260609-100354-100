(function () {
  function setupMoviePlayer(settings) {
    var options = settings || {};
    var video = document.getElementById(options.videoId || "movie-player");
    var button = document.getElementById(options.buttonId || "player-start");
    var layer = document.getElementById(options.layerId || "player-layer");
    var started = false;
    var hls = null;

    if (!video || !options.url) {
      return;
    }

    function setControls() {
      video.setAttribute("controls", "controls");
      if (layer) {
        layer.classList.add("is-hidden");
      }
    }

    function attachStream() {
      if (started) {
        setControls();
        return video.play().catch(function () {});
      }
      started = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(options.url);
        hls.attachMedia(video);
      } else {
        video.src = options.url;
      }
      setControls();
      return video.play().catch(function () {});
    }

    if (button) {
      button.addEventListener("click", attachStream);
    }

    if (layer) {
      layer.addEventListener("click", attachStream);
    }

    video.addEventListener("click", function () {
      if (!started) {
        attachStream();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
