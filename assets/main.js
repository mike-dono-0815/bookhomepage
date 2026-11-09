(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    if (!toggle || !menu) return;
    root.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    if ("inert" in menu) menu.inert = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener("click", function () {
      setMenu(!root.classList.contains("menu-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* ---------- Scroll reveals: once per section ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (!hasIO || reduce) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          ro.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- Tagline: words light up one at a time ---------- */
  var tagline = document.querySelector("[data-word-reveal]");
  if (tagline) {
    var words = [];
    Array.prototype.slice.call(tagline.childNodes).forEach(function (node) {
      var accent = node.nodeType === 1 && node.classList.contains("accent");
      var text = node.textContent;
      var frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement("span");
        s.className = "w" + (accent ? " accent" : "");
        s.textContent = part;
        words.push(s);
        frag.appendChild(s);
      });
      tagline.replaceChild(frag, node);
    });
    if (reduce || !hasIO) {
      words.forEach(function (w) { w.classList.add("on"); });
    } else {
      // A word activates once it crosses a trigger line 40% up from the bottom.
      var wo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting || en.boundingClientRect.top < 0) {
            en.target.classList.add("on");
            wo.unobserve(en.target);
          }
        });
      }, { rootMargin: "0px 0px -40% 0px", threshold: 1 });
      words.forEach(function (w) { wo.observe(w); });
    }
  }

  /* ---------- Flipbook: real book pages with a page turn ---------- */
  var bookEl = document.getElementById("flipbook");
  var wrap = document.querySelector(".flipbook-wrap");
  if (bookEl && window.St && window.St.PageFlip) {
    var pages = bookEl.querySelectorAll(".page");
    var labels = Array.prototype.map.call(pages, function (p, i) {
      if (i === 0) return "Cover";
      if (p.classList.contains("page-end")) return "What happens next";
      var alt = (p.querySelector("img") || {}).alt || "";
      return /^Introduction/.test(alt) ? "Introduction" : "Chapter One";
    });
    // Keep the whole page on screen below the floating nav, with room for the controls.
    var maxH = Math.max(420, Math.min(720, window.innerHeight - 240));
    var book = new window.St.PageFlip(bookEl, {
      width: 400,
      height: 600,
      size: "stretch",
      minWidth: 240,
      maxWidth: Math.round(maxH * 2 / 3),
      minHeight: 360,
      maxHeight: maxH,
      showCover: true,
      usePortrait: true,
      autoSize: true,
      drawShadow: true,
      maxShadowOpacity: 0.45,
      flippingTime: reduce ? 300 : 900,
      mobileScrollSupport: true,
      swipeDistance: 30,
      clickEventForward: true,
      showPageCorners: !reduce
    });
    book.loadFromHTML(pages);

    var prev = document.querySelector(".flip-prev");
    var next = document.querySelector(".flip-next");
    var status = document.querySelector(".flip-status");
    var total = pages.length;
    function update() {
      var i = book.getCurrentPageIndex();
      var spread = book.getOrientation() === "landscape" && i > 0 && i + 1 < total;
      var left = labels[i];
      var right = spread ? labels[i + 1] : left;
      var name = left === right ? left : left + " / " + right;
      var nums = spread ? (i + 1) + "–" + (i + 2) : String(i + 1);
      status.textContent = name + " · " + nums + " of " + total;
      prev.disabled = i === 0;
      next.disabled = i + (spread ? 2 : 1) >= total;
      // In two-page view a lone cover sits in the right half (and a lone last
      // page in the left half); slide the book so the single page is centred.
      var landscape = book.getOrientation() === "landscape";
      wrap.classList.toggle("at-cover", landscape && i === 0);
      wrap.classList.toggle("at-back", landscape && i > 0 && i === total - 1 && i % 2 === 1);
    }
    book.on("flip", update);
    book.on("changeOrientation", update);
    book.on("init", update);
    // Start sliding back to the two-page position as soon as a turn begins,
    // so the opening spread lands centred; re-check when the turn settles.
    book.on("changeState", function (e) {
      if (e.data === "flipping" || e.data === "user_fold") {
        wrap.classList.remove("at-cover", "at-back");
      } else if (e.data === "read") {
        update();
      }
    });
    update();
    prev.addEventListener("click", function () { book.flipPrev(); });
    next.addEventListener("click", function () { book.flipNext(); });

    // "Read larger": shows the current page or spread at full screen height.
    var zoomBtn = document.querySelector(".flip-zoom");
    var dlg = document.querySelector(".page-zoom");
    if (zoomBtn && dlg && typeof dlg.showModal === "function") {
      var holder = dlg.querySelector(".page-zoom-pages");
      var zPrev = dlg.querySelector(".zoom-prev");
      var zNext = dlg.querySelector(".zoom-next");
      var imgs = Array.prototype.map.call(pages, function (p) { return p.querySelector("img"); });
      var lastImg = imgs.length - 1;
      while (lastImg >= 0 && !imgs[lastImg]) lastImg--;
      var wide = function () { return window.matchMedia("(min-width: 900px)").matches; };
      var zi = 0;
      function renderZoom() {
        holder.innerHTML = "";
        // Spreads follow the book: cover alone, then pairs (1,2), (3,4)...
        var show = [zi];
        if (wide() && zi > 0 && zi + 1 <= lastImg) show.push(zi + 1);
        holder.classList.toggle("spread", show.length === 2);
        show.forEach(function (k) {
          var im = document.createElement("img");
          im.src = imgs[k].src;
          im.alt = imgs[k].alt;
          holder.appendChild(im);
        });
        zPrev.disabled = zi === 0;
        zNext.disabled = show[show.length - 1] >= lastImg;
      }
      function step(dir) {
        var span = wide() && zi > 0 ? 2 : 1;
        if (dir > 0) zi = zi === 0 ? 1 : zi + span;
        else zi = wide() ? (zi <= 1 ? 0 : zi - 2) : Math.max(0, zi - 1);
        zi = Math.min(zi, lastImg);
        renderZoom();
      }
      zoomBtn.addEventListener("click", function () {
        zi = Math.min(book.getCurrentPageIndex(), lastImg);
        if (wide() && zi > 0 && zi % 2 === 0) zi -= 1; // align to the left page of a spread
        renderZoom();
        dlg.showModal();
      });
      zPrev.addEventListener("click", function () { step(-1); });
      zNext.addEventListener("click", function () { step(1); });
      dlg.querySelector(".zoom-close").addEventListener("click", function () { dlg.close(); });
      dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
        if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
      });
      // Keep the book in sync with where the reader got to.
      dlg.addEventListener("close", function () {
        var target = Math.min(zi, total - 1);
        if (target !== book.getCurrentPageIndex()) book.turnToPage(target);
        update();
      });
    } else if (zoomBtn) {
      zoomBtn.hidden = true;
    }

    // Arrow keys turn pages while the book is on screen.
    var bookInView = false;
    if (hasIO) {
      new IntersectionObserver(function (en) { bookInView = en[0].isIntersecting; }, { threshold: 0.5 }).observe(wrap);
    }
    document.addEventListener("keydown", function (e) {
      if (!bookInView || e.altKey || e.ctrlKey || e.metaKey) return;
      if (document.querySelector(".page-zoom[open]")) return; // the zoom view has its own keys
      var tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") { book.flipNext(); e.preventDefault(); }
      if (e.key === "ArrowLeft") { book.flipPrev(); e.preventDefault(); }
    });
  } else if (wrap) {
    // Library missing: hide the flipbook and open the text version instead.
    wrap.style.display = "none";
    var tv = document.querySelector(".text-version");
    if (tv) tv.open = true;
  }

  /* ---------- Substack embed: hide skeleton once loaded ---------- */
  var frame = document.querySelector(".embed-frame iframe");
  var skel = document.querySelector(".embed-skeleton");
  if (frame && skel) {
    frame.addEventListener("load", function () { skel.hidden = true; });
  }

  /* ---------- Scrollspy: mark the current nav item ---------- */
  var links = document.querySelectorAll(".nav-links a[href^='#']");
  if (hasIO && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute("aria-current"); });
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }
})();
