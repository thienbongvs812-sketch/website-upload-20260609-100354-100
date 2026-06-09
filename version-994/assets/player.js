(function () {
  window.initMoviePlayer = function (playbackUrl) {
    var video = document.getElementById("moviePlayer");
    var frame = document.querySelector(".video-frame");
    var button = document.getElementById("playButton");
    if (!video || !frame || !button || !playbackUrl) {
      return;
    }

    var started = false;
    var hls = null;

    function playVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    function attachAndPlay() {
      if (started) {
        playVideo();
        return;
      }
      started = true;
      frame.classList.add("is-playing");
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = playbackUrl;
        playVideo();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(playbackUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
      } else {
        video.src = playbackUrl;
        playVideo();
      }
    }

    button.addEventListener("click", attachAndPlay);
    video.addEventListener("click", function () {
      if (!started) {
        attachAndPlay();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
