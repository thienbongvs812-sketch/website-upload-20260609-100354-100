(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (slides.length > 0) {
      var active = 0;
      var activate = function (index) {
        active = index % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === active);
        });
      };
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          activate(index);
        });
      });
      activate(0);
      window.setInterval(function () {
        activate(active + 1);
      }, 5200);
    }

    var filterRoot = document.querySelector("[data-filter-root]");
    if (filterRoot) {
      var queryInput = filterRoot.querySelector("[data-filter-query]");
      var yearSelect = filterRoot.querySelector("[data-filter-year]");
      var regionSelect = filterRoot.querySelector("[data-filter-region]");
      var typeSelect = filterRoot.querySelector("[data-filter-type]");
      var cards = Array.prototype.slice.call(filterRoot.querySelectorAll(".movie-card"));
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q");
      if (initialQuery && queryInput) {
        queryInput.value = initialQuery;
      }
      var applyFilter = function () {
        var q = normalize(queryInput && queryInput.value);
        var y = normalize(yearSelect && yearSelect.value);
        var r = normalize(regionSelect && regionSelect.value);
        var t = normalize(typeSelect && typeSelect.value);
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-keywords"));
          var year = normalize(card.getAttribute("data-year"));
          var region = normalize(card.getAttribute("data-region"));
          var type = normalize(card.getAttribute("data-type"));
          var matched = true;
          if (q && text.indexOf(q) === -1) {
            matched = false;
          }
          if (y && year !== y) {
            matched = false;
          }
          if (r && region !== r) {
            matched = false;
          }
          if (t && type !== t) {
            matched = false;
          }
          card.classList.toggle("hidden-card", !matched);
        });
      };
      [queryInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });
      applyFilter();
    }
  });
})();
