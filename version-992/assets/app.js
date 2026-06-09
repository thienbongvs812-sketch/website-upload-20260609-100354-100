(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', mobilePanel.classList.contains('is-open'));
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var showSlide = function (index) {
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
    };
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var filterRoots = Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]'));
  filterRoots.forEach(function (root) {
    var keyword = root.querySelector('[data-filter-keyword]');
    var year = root.querySelector('[data-filter-year]');
    var type = root.querySelector('[data-filter-type]');
    var status = root.querySelector('[data-filter-status]');
    var list = document.querySelector('[data-card-list]');
    if (!list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));
    if (keyword && initialQuery) {
      keyword.value = initialQuery;
    }
    var normalize = function (value) {
      return String(value || '').toLowerCase().trim();
    };
    var apply = function () {
      var q = normalize(keyword && keyword.value);
      var y = normalize(year && year.value);
      var t = normalize(type && type.value);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        var ok = true;
        if (q && haystack.indexOf(q) === -1) {
          ok = false;
        }
        if (y && normalize(card.getAttribute('data-year')) !== y) {
          ok = false;
        }
        if (t && normalize(card.getAttribute('data-type')).indexOf(t) === -1) {
          ok = false;
        }
        card.classList.toggle('is-hidden', !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (status) {
        status.textContent = visible ? '已匹配 ' + visible + ' 部影片' : '未找到匹配影片';
      }
    };
    [keyword, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    apply();
  });
})();
