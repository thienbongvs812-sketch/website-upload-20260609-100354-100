(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function escapeText(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function setupNav() {
    var toggle = $('[data-nav-toggle]');
    var panel = $('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = $('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = $all('[data-hero-slide]', hero);
    var dots = $all('[data-hero-dot]', hero);
    var prev = $('[data-hero-prev]', hero);
    var next = $('[data-hero-next]', hero);
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }
    restart();
  }

  function setupFiltering() {
    var scopes = $all('[data-filter-scope]');
    if (!scopes.length) {
      return;
    }
    var input = $('.js-filter-input');
    var year = $('.js-filter-year');
    var type = $('.js-filter-type');

    function apply() {
      var q = normalize(input && input.value);
      var y = year ? year.value : '';
      var t = type ? type.value : '';
      scopes.forEach(function (scope) {
        $all('[data-search]', scope).forEach(function (item) {
          var haystack = normalize(item.getAttribute('data-search'));
          var matchText = !q || haystack.indexOf(q) !== -1;
          var matchYear = !y || item.getAttribute('data-year') === y;
          var matchType = !t || item.getAttribute('data-type') === t;
          item.classList.toggle('is-filter-hidden', !(matchText && matchYear && matchType));
        });
      });
    }

    [input, year, type].forEach(function (el) {
      if (el) {
        el.addEventListener('input', apply);
        el.addEventListener('change', apply);
      }
    });
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeText(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a class="movie-thumb" href="' + escapeText(movie.url) + '" aria-label="' + escapeText(movie.title) + '">' +
      '<img src="' + escapeText(movie.cover) + '" alt="' + escapeText(movie.title) + '" loading="lazy">' +
      '<span class="movie-badge">' + escapeText(movie.type) + '</span>' +
      '<span class="movie-score">' + escapeText(movie.score) + '</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<div class="movie-meta-line">' + escapeText(movie.year) + ' · ' + escapeText(movie.region) + ' · ' + escapeText(movie.primaryGenre) + '</div>' +
      '<h3><a href="' + escapeText(movie.url) + '">' + escapeText(movie.title) + '</a></h3>' +
      '<p>' + escapeText(movie.desc) + '</p>' +
      '<div class="tag-list">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  function setupSearchPage() {
    var results = $('[data-search-results]');
    if (!results || !window.MOVIE_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var input = $('[data-search-input]');
    var status = $('[data-search-status]');
    if (input) {
      input.value = q;
    }
    var needle = normalize(q);
    var list = window.MOVIE_INDEX.filter(function (movie) {
      if (!needle) {
        return movie.hot;
      }
      return normalize([movie.title, movie.region, movie.type, movie.year, movie.genre, (movie.tags || []).join(' ')].join(' ')).indexOf(needle) !== -1;
    }).slice(0, needle ? 120 : 72);
    if (status) {
      status.textContent = needle ? '搜索结果：' + q : '热门内容';
    }
    if (!list.length) {
      results.innerHTML = '<div class="content-card"><h2>未找到相关影片</h2><p>可以尝试更换片名、地区、年份或类型再次搜索。</p></div>';
      return;
    }
    results.innerHTML = list.map(movieCard).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNav();
    setupHero();
    setupFiltering();
    setupSearchPage();
  });
})();
