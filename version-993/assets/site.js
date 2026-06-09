(function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var opened = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var active = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function startHero() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startHero();
      });
    });

    startHero();
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-search-input]');
    var chips = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-value]'));
    var empty = scope.querySelector('[data-empty-state]');
    var root = scope.parentElement || document;
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card], .ranking-row'));
    var selected = 'all';

    function textOf(card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre'),
        card.textContent
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var visible = 0;
      cards.forEach(function (card) {
        var content = textOf(card);
        var matchQuery = !query || content.indexOf(query) !== -1;
        var matchChip = selected === 'all' || content.indexOf(selected.toLowerCase()) !== -1;
        var show = matchQuery && matchChip;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        selected = chip.getAttribute('data-filter-value') || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        applyFilter();
      });
    });
  });

  document.querySelectorAll('.player-shell').forEach(function (player) {
    var video = player.querySelector('video');
    var startButton = player.querySelector('.player-start');
    var initialized = false;
    var hlsInstance = null;

    function attachStream() {
      if (!video || initialized) {
        return;
      }
      initialized = true;
      var stream = player.getAttribute('data-stream');
      if (!stream) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function playVideo(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      attachStream();
      player.classList.add('is-playing');
      if (video) {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }
    }

    if (startButton) {
      startButton.addEventListener('click', playVideo);
    }

    player.addEventListener('click', function (event) {
      if (!player.classList.contains('is-playing') && event.target !== video) {
        playVideo(event);
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  });
})();
