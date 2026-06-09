(function () {
  function setupPlayer() {
    var video = document.querySelector('.js-player');
    var button = document.querySelector('.js-play');
    if (!video || !button) {
      return;
    }
    var source = video.getAttribute('data-src');
    var started = false;

    function load() {
      if (started) {
        return;
      }
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        video._hls = hls;
      } else {
        video.src = source;
      }
    }

    function play() {
      load();
      button.classList.add('is-hidden');
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    button.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setupPlayer);
})();
