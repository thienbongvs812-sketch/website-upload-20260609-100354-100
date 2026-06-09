(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var toggle = qs('[data-menu-toggle]');
    var panel = qs('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slider = qs('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = qsa('[data-hero-slide]', slider);
    var dots = qsa('[data-hero-dot]', slider);
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        play();
      });
    });

    slider.addEventListener('mouseenter', function () {
      clearInterval(timer);
    });
    slider.addEventListener('mouseleave', play);
    play();
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function initFilters() {
    var form = qs('[data-filter-form]');
    var list = qs('[data-filter-list]');
    if (!form || !list) {
      return;
    }
    var keywordInput = qs('[data-filter-keyword]', form);
    var yearSelect = qs('[data-filter-year]', form);
    var regionSelect = qs('[data-filter-region]', form);
    var typeSelect = qs('[data-filter-type]', form);
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (keywordInput && query) {
      keywordInput.value = query;
    }

    function apply() {
      var keyword = normalize(keywordInput && keywordInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var region = normalize(regionSelect && regionSelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      qsa('[data-filter-card]', list).forEach(function (card) {
        var text = normalize(card.getAttribute('data-filter-text'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardRegion = normalize(card.getAttribute('data-region'));
        var cardType = normalize(card.getAttribute('data-type'));
        var visible = true;
        if (keyword && text.indexOf(keyword) === -1) {
          visible = false;
        }
        if (year && cardYear !== year) {
          visible = false;
        }
        if (region && cardRegion !== region) {
          visible = false;
        }
        if (type && cardType !== type) {
          visible = false;
        }
        card.classList.toggle('is-filter-hidden', !visible);
      });
    }

    form.addEventListener('input', apply);
    form.addEventListener('change', apply);
    form.addEventListener('reset', function () {
      window.setTimeout(apply, 0);
    });
    apply();
  }

  function initImages() {
    qsa('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('image-missing');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initImages();
  });
})();
