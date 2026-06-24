/* =================================================================
   MULTISPECT · CIVIC BAROMETER — main.js  (multi-page)
   Vanilla JS only. Shared across every page. Behaviours:
     1. Scroll reveal (IntersectionObserver)
     2. Sticky nav: mobile menu + active page link
     3. Dynamic background that travels the spectrum on scroll
     4. Legacy hash redirects (old single-page anchors → new pages)
   All motion disabled under prefers-reduced-motion.
   ================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = document.body.getAttribute("data-page") || "home";

  /* ---------------------------------------------------------------
     BACKGROUND TONES — one per section id, across ALL pages.
     Cool/civic & light at the top of a page, deepening to a darker
     warm "security edge" around the Barometer / Case Studies, then
     resolving back to a calm civic tone. Retune freely; keys match
     each <section id="…"> in the HTML.
  --------------------------------------------------------------- */
  var TONES = {
    /* — landing spine — */
    hero:            "#eef3f4",
    spectrum:        "#eaf1f1",
    "challenge-tease":"#e2ebea",
    stack:           "#ece7dd",
    "why-tease":     "#ede3d4",
    contact:         "#ecf2f1",
    /* — method — */
    "method-intro":  "#eef3f4",
    summary:         "#e6eded",
    challenge:       "#e2ebea",
    blindspot:       "#1b2a30", // dark calm accent
    depth:           "#e9ede9",
    /* — products — */
    "products-intro":"#eef3f4",
    polygon:         "#ece6dc",
    deepdive:        "#ece2d5",
    barometer:       "#16110d", // darkest + warmest
    altitudes:       "#ece3d8",
    /* — cases — */
    "cases-intro":   "#efe9e1",
    cases:           "#171210", // dark / warm
    /* — why — */
    "why-intro":     "#eef3f4",
    platform:        "#ece6dd",
    why:             "#ede3d4",
    /* — about — */
    "about-intro":   "#eef3f4",
    about:           "#e9e7df",
    principles:      "#e8edec"
  };

  /* ---------------------------------------------------------------
     LEGACY HASH REDIRECTS
     The site used to be one page; these ids moved to sub-pages.
     If an old deep link lands on the homepage, forward it so the
     anchor still resolves.
  --------------------------------------------------------------- */
  var REDIRECTS = {
    summary:   "method.html#summary",
    challenge: "method.html#challenge",
    quote:     "method.html#blindspot",
    depth:     "method.html#depth",
    polygon:   "products.html#polygon",
    deepdive:  "products.html#deepdive",
    barometer: "products.html#barometer",
    delivery:  "products.html#altitudes",
    platform:  "why.html#platform",
    why:       "why.html#why",
    cases:     "cases.html#cases",
    about:     "about.html#about",
    principles:"about.html#principles"
  };
  if (page === "home" && window.location.hash) {
    var key = window.location.hash.slice(1);
    // only redirect ids that are NOT present on the landing page
    if (REDIRECTS[key] && !document.getElementById(key)) {
      window.location.replace(REDIRECTS[key]);
      return; // stop running on a page we're leaving
    }
  }

  /* ===============================================================
     1 · SCROLL REVEAL
  =============================================================== */
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  document.querySelectorAll(".cols, .bands, .altitudes, .diffs, .principles, .pillars, .benefits, .metrics")
    .forEach(function (group) {
      group.querySelectorAll("[data-reveal]").forEach(function (el, i) {
        el.style.setProperty("--stagger", i);
      });
    });

  function inView(el) {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var r = el.getBoundingClientRect();
    return r.top < vh && r.bottom > 0;
  }
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); revealObs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    reveals.forEach(function (el) {
      // Anything already in the initial viewport appears immediately (spec);
      // the rest animate in on scroll via the observer.
      if (inView(el)) { el.classList.add("is-in"); }
      else { revealObs.observe(el); }
    });
    // Fallback: once layout is settled, reveal any in-view element that the
    // synchronous pass missed (e.g. script ran before first layout).
    window.addEventListener("load", function () {
      reveals.forEach(function (el) {
        if (!el.classList.contains("is-in") && inView(el)) el.classList.add("is-in");
      });
    });
  }

  /* ===============================================================
     2 · STICKY NAV
  =============================================================== */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  // highlight the current page's nav link
  var activeLink = document.querySelector('[data-nav="' + page + '"]');
  if (activeLink) activeLink.classList.add("is-active");

  /* ===============================================================
     3 · DYNAMIC BACKGROUND — travels the spectrum on scroll
     Active section = the one at the TOP of the viewport (under the
     nav); its theme is what fills the screen, so its tone always
     matches the visible text — correct even for tall sections.
  =============================================================== */
  var bgLayer = document.getElementById("bg-layer");
  var allSections = Array.prototype.slice.call(document.querySelectorAll(".section[data-tone]"));
  var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 60;

  if (bgLayer && allSections.length) {
    // Dark-theme sections paint their OWN background so their light text is
    // always readable — independent of the travelling layer. (On a page that
    // mixes light and dark sections, one travelling colour can't serve both.)
    allSections.forEach(function (s) {
      if (s.classList.contains("theme-dark") && TONES[s.id]) s.style.backgroundColor = TONES[s.id];
    });

    var LIGHT_FALLBACK = "#eef3f4";
    var activeTone = null;
    function pickActiveTone() {
      var line = navH + 2;
      var current = allSections[0];
      for (var i = 0; i < allSections.length; i++) {
        var r = allSections[i].getBoundingClientRect();
        if (r.top <= line && r.bottom > line) { current = allSections[i]; break; }
        if (r.top > line) break;
      }
      // When the top section paints itself dark, keep the travelling layer light
      // so transparent light sections around it stay readable.
      var tone = current.classList.contains("theme-dark") ? LIGHT_FALLBACK : TONES[current.id];
      if (tone && tone !== activeTone) { activeTone = tone; bgLayer.style.backgroundColor = tone; }
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { pickActiveTone(); ticking = false; });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    pickActiveTone();
  }

  /* ===============================================================
     4 · ACCORDION (native <details>) — open the one linked by hash
  =============================================================== */
  if (window.location.hash) {
    var target = document.getElementById(window.location.hash.slice(1));
    if (target) {
      var det = target.closest("details");
      if (det) det.open = true;
    }
  }
})();
