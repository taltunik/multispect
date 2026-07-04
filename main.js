/* =================================================================
   MULTISPECT · CIVIC BAROMETER — main.js
   Vanilla JS only. Three behaviours:
     1. Scroll reveal (IntersectionObserver)
     2. Sticky nav: mobile menu + scroll-spy active link + smooth scroll
     3. Dynamic background that travels the spectrum as you scroll
   All motion is disabled under prefers-reduced-motion.
   ================================================================= */
(function () {
  "use strict";

  // Reveal-hiding is gated on this class so content stays visible if JS never runs.
  document.documentElement.classList.add("js");

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = motionQuery.matches;

  /* ---------------------------------------------------------------
     BACKGROUND TONES — one per section id.
     The palette is cool/civic & light at the top, deepens to a
     darker warm "security edge" around the Barometer and Case
     Studies, then resolves back to a calm civic tone at the close.
     Retune freely; keys must match each <section id="…">.
  --------------------------------------------------------------- */
  var TONES = {
    hero:       "#eef3f4", // cool civic, light
    spectrum:   "#eaf1f1",
    summary:    "#e6eded",
    challenge:  "#e2eb ea".replace(" ", ""), // (guard against typos)
    quote:      "#1b2a30", // dark calm accent band
    depth:      "#e9ede9",
    stack:      "#edeae2", // warming paper
    polygon:    "#ece6dc",
    deepdive:   "#ece2d5", // warm sand
    barometer:  "#16110d", // DARKEST + WARMEST — the security edge
    delivery:   "#ece3d8", // easing back up
    platform:   "#ece6dd",
    why:        "#ede3d4",
    cases:      "#171210", // second dark/warm zone
    about:      "#e9e7df", // resolving to neutral civic
    principles: "#e8edec",
    contact:    "#ecf2f1"  // calm, optimistic civic close
  };
  // normalise the guarded value
  TONES.challenge = "#e2ebea";

  /* ===============================================================
     1 · SCROLL REVEAL
  =============================================================== */
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  // stagger grouped children for a gentle cascade
  document.querySelectorAll(".cols, .bands, .altitudes, .diffs, .principles, .pillars, .benefits").forEach(function (group) {
    group.querySelectorAll("[data-reveal]").forEach(function (el, i) {
      el.style.setProperty("--stagger", i);
    });
  });

  var revealObs = null;

  function reveal(el) {
    el.classList.add("is-in");
    if (revealObs) revealObs.unobserve(el);
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) reveal(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    // reduced motion / very old browsers: just show everything
    reveals.forEach(reveal);
  }

  // If the preference flips to "reduce" mid-session, show everything at once.
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", function (e) {
      if (e.matches) reveals.forEach(reveal);
    });
  }

  /* — Proactive reveal —
     The observer alone is not enough when the page JUMPS instead of
     scrolling: anchor navigation (nav clicks, hashchange, loading a
     #fragment URL, bfcache restore) can land the viewport on a section
     whose reveal never fired, leaving it blank. So: */

  // (a) anything already inside the viewport is revealed immediately …
  function revealInView() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(function (el) {
      if (el.classList.contains("is-in")) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) reveal(el);
    });
  }

  // (b) … and the target of an anchor jump is revealed in full, so it is
  // readable the moment the viewport lands on it.
  function revealHashTarget(hash) {
    if (!hash || hash.length < 2) return;
    var target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (err) { return; }
    if (!target) return;
    if (target.hasAttribute("data-reveal")) reveal(target);
    target.querySelectorAll("[data-reveal]").forEach(reveal);
  }

  window.addEventListener("load", function () {
    revealHashTarget(location.hash);
    revealInView();
  });
  window.addEventListener("pageshow", revealInView);
  window.addEventListener("hashchange", function () {
    revealHashTarget(location.hash);
    revealInView();
  });
  // catch in-page anchor clicks (nav, skip-link, brand) before the scroll starts
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a) revealHashTarget(a.getAttribute("href"));
  });

  /* ===============================================================
     1b · SPECTRUM HOVER — hovering a band lifts its card (CSS) and
     sends a runner gliding along the axis to that band's node, so
     the bands read as positions on one scale.
  =============================================================== */
  var spectrumSec = document.getElementById("spectrum");
  if (spectrumSec) {
    var specBar = spectrumSec.querySelector(".spectrum-bar");
    var specBands = spectrumSec.querySelectorAll(".band");
    if (specBar && specBands.length > 1) {
      var runner = document.createElement("span");
      runner.className = "spectrum-bar__runner";
      runner.setAttribute("aria-hidden", "true");
      specBar.appendChild(runner);
      var specNodes = specBar.querySelectorAll(".spectrum-bar__nodes span");
      specBands.forEach(function (band, i) {
        band.addEventListener("mouseenter", function () {
          runner.style.setProperty("--pos", String(i / (specBands.length - 1)));
          runner.style.borderColor = getComputedStyle(band).borderTopColor;
          specBar.classList.add("is-tracking");
          specNodes.forEach(function (n, j) { n.classList.toggle("is-hot", i === j); });
        });
        band.addEventListener("mouseleave", function () {
          specBar.classList.remove("is-tracking");
          specNodes.forEach(function (n) { n.classList.remove("is-hot"); });
        });
      });
    }
  }

  /* ===============================================================
     2 · STICKY NAV
  =============================================================== */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  // --- mobile menu open/close ---
  function closeMenu() {
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
    // close after choosing a destination
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // --- scroll-spy: highlight the nav link of the section in view ---
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll("[data-spy]"));
  var linkById = {};
  var spySections = [];
  spyLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) { linkById[id] = a; spySections.push(sec); }
  });

  function setActive(id) {
    spyLinks.forEach(function (a) { a.classList.remove("is-active"); });
    if (linkById[id]) linkById[id].classList.add("is-active");
  }

  if ("IntersectionObserver" in window && spySections.length) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spySections.forEach(function (s) { spyObs.observe(s); });
  }

  /* ===============================================================
     3 · DYNAMIC BACKGROUND — travels the spectrum on scroll
     The active section is the one currently sitting at the TOP of the
     viewport (just under the sticky nav). That section's theme is what
     fills the screen, so its tone always matches the visible text —
     correct even for sections taller than the viewport (e.g. the long
     Case Studies block). CSS transitions #bg-layer smoothly between
     tones; the transition is disabled under prefers-reduced-motion.
  =============================================================== */
  var bgLayer = document.getElementById("bg-layer");
  var allSections = Array.prototype.slice.call(document.querySelectorAll(".section[data-tone]"));
  var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 60;

  if (bgLayer && allSections.length) {
    var activeTone = null;

    function pickActiveTone() {
      var line = navH + 2; // just below the sticky nav
      var current = allSections[0];
      for (var i = 0; i < allSections.length; i++) {
        var r = allSections[i].getBoundingClientRect();
        if (r.top <= line && r.bottom > line) { current = allSections[i]; break; }
        if (r.top > line) break; // sections are in document order
      }
      var tone = TONES[current.id];
      if (tone && tone !== activeTone) {
        activeTone = tone;
        bgLayer.style.backgroundColor = tone;
      }
    }

    // rAF-throttled scroll handler (GPU-cheap: reads rects, sets one colour)
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { pickActiveTone(); ticking = false; });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    pickActiveTone(); // correct colour on first paint
  }
})();
