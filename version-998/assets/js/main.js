(function () {
  var header = document.querySelector("[data-site-header]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var slider = document.querySelector("[data-hero-slider]");
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var active = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle("is-active", current === active);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle("is-active", current === active);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(active + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(active - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(active + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        startTimer();
      });
    });

    startTimer();
  }

  var searchInput = document.querySelector("[data-search-input]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-searchable-card]"));
  var emptyState = document.querySelector("[data-empty-state]");
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-field]"));
  var currentFilter = { field: "all", value: "" };

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  }

  function cardText(card) {
    return normalize([
      card.getAttribute("data-title"),
      card.getAttribute("data-region"),
      card.getAttribute("data-type"),
      card.getAttribute("data-year"),
      card.getAttribute("data-genre"),
      card.textContent
    ].join(" "));
  }

  function matchesFilter(card) {
    if (!currentFilter.value || currentFilter.field === "all") {
      return true;
    }
    var value = normalize(currentFilter.value);
    if (currentFilter.field === "genre") {
      return normalize(card.getAttribute("data-genre") + " " + card.textContent).indexOf(value) !== -1;
    }
    return normalize(card.getAttribute("data-" + currentFilter.field)).indexOf(value) !== -1;
  }

  function applySearch() {
    if (!cards.length) {
      return;
    }
    var query = normalize(searchInput ? searchInput.value : "");
    var visible = 0;
    cards.forEach(function (card) {
      var matched = cardText(card).indexOf(query) !== -1 && matchesFilter(card);
      card.style.display = matched ? "" : "none";
      if (matched) {
        visible += 1;
      }
    });
    if (emptyState) {
      emptyState.classList.toggle("is-visible", visible === 0);
    }
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (query) {
      searchInput.value = query;
    }
    searchInput.addEventListener("input", applySearch);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (item) {
        item.classList.remove("is-active");
      });
      button.classList.add("is-active");
      currentFilter = {
        field: button.getAttribute("data-filter-field") || "all",
        value: button.getAttribute("data-filter-value") || ""
      };
      applySearch();
    });
  });

  applySearch();
})();
