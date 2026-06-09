(function () {
    var body = document.body;
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            body.classList.toggle('menu-open');
        });

        mobileNav.addEventListener('click', function (event) {
            if (event.target.tagName === 'A') {
                body.classList.remove('menu-open');
            }
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
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
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                restart();
            });
        }

        showSlide(0);
        restart();
    }

    var panel = document.querySelector('[data-filter-panel]');

    if (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var typeSelect = panel.querySelector('[data-filter-type]');
        var regionSelect = panel.querySelector('[data-filter-region]');
        var yearSelect = panel.querySelector('[data-filter-year]');
        var resetButton = panel.querySelector('[data-filter-reset]');
        var countNode = panel.querySelector('[data-filter-count]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        function fillSelect(select, values) {
            if (!select) {
                return;
            }

            values.forEach(function (value) {
                if (!value) {
                    return;
                }

                var option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        function unique(attr) {
            var set = new Set();

            cards.forEach(function (card) {
                var value = card.getAttribute(attr) || '';
                if (value) {
                    set.add(value);
                }
            });

            return Array.from(set).sort(function (a, b) {
                var na = Number(a);
                var nb = Number(b);

                if (!Number.isNaN(na) && !Number.isNaN(nb)) {
                    return nb - na;
                }

                return a.localeCompare(b, 'zh-CN');
            });
        }

        fillSelect(typeSelect, unique('data-type'));
        fillSelect(regionSelect, unique('data-region'));
        fillSelect(yearSelect, unique('data-year'));

        if (input && query) {
            input.value = query;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : '');
            var type = typeSelect ? typeSelect.value : '';
            var region = regionSelect ? regionSelect.value : '';
            var year = yearSelect ? yearSelect.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-search'));
                var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchType = !type || card.getAttribute('data-type') === type;
                var matchRegion = !region || card.getAttribute('data-region') === region;
                var matchYear = !year || card.getAttribute('data-year') === year;
                var matched = matchKeyword && matchType && matchRegion && matchYear;

                card.classList.toggle('is-hidden-by-filter', !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (countNode) {
                countNode.textContent = String(visible);
            }
        }

        [input, typeSelect, regionSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        if (resetButton) {
            resetButton.addEventListener('click', function () {
                if (input) {
                    input.value = '';
                }

                [typeSelect, regionSelect, yearSelect].forEach(function (select) {
                    if (select) {
                        select.value = '';
                    }
                });

                applyFilter();
            });
        }

        applyFilter();
    }
})();
