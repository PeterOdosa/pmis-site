// PMIS site: mobile menu, About dropdown, footer year. No dependencies.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var subs = nav ? Array.prototype.slice.call(nav.querySelectorAll('.has-sub')) : [];

  var setSub = function (li, open) {
    li.classList.toggle('is-open', open);
    var btn = li.querySelector('.sub-toggle');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  };
  var closeSubs = function (except) {
    subs.forEach(function (li) { if (li !== except) setSub(li, false); });
  };

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open) closeSubs();
    };

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    // Close the whole menu after tapping a link
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    // Reset when resizing up to desktop
    window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });

    // Escape closes menus and returns focus to the button that opened them
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = subs.filter(function (li) { return li.classList.contains('is-open'); })[0];
      closeSubs();
      if (open) {
        var btn = open.querySelector('.sub-toggle');
        if (btn) btn.focus();
      } else {
        setOpen(false);
      }
    });
  }

  // Submenu buttons
  subs.forEach(function (li) {
    var btn = li.querySelector('.sub-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var open = !li.classList.contains('is-open');
        closeSubs(li);
        setSub(li, open);
      });
    }
    // Close when keyboard focus leaves the item
    li.addEventListener('focusout', function (e) {
      if (!li.contains(e.relatedTarget)) setSub(li, false);
    });
  });

  // Click outside closes submenus
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) closeSubs();
  });

  // Contact form: send without leaving the page (falls back to a normal post if JS is off)
  var form = document.getElementById('contact-form');
  if (form && window.fetch) {
    var sent = document.getElementById('sent'), err = document.getElementById('error'), inv = document.getElementById('invalid');
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sent.classList.remove('is-shown'); err.classList.remove('is-shown'); inv.classList.remove('is-shown');
      var bad = null;
      ['name', 'email', 'message'].forEach(function (id) {
        var f = form.elements[id];
        var ok = f.value.trim() && (id !== 'email' || f.checkValidity());
        f.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !bad) bad = f;
      });
      if (bad) { inv.classList.add('is-shown'); bad.focus(); return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.ok) { sent.classList.add('is-shown'); form.reset(); sent.focus(); } else { err.classList.add('is-shown'); err.focus(); }
        })
        .catch(function () { err.classList.add('is-shown'); err.focus(); })
        .then(function () { btn.disabled = false; btn.textContent = 'Send message'; });
    });
  }

  // Photo enlarge view: <a href="full.jpg" data-lightbox><img ...></a>
  var links = document.querySelectorAll('a[data-lightbox]');
  if (links.length && window.HTMLDialogElement) {
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Photo');
    dlg.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close photo">&times;</button><img alt="">';
    document.body.appendChild(dlg);
    var big = dlg.querySelector('img');
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var thumb = a.querySelector('img');
        big.src = a.href; big.alt = thumb ? thumb.alt : '';
        dlg.showModal();
      });
    });
    dlg.addEventListener('click', function (e) { if (e.target !== big) dlg.close(); });
  }

  // EUDR page: "Book" buttons preselect the package
  document.querySelectorAll('a[data-pkg]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = document.querySelector('input[name="package"][value="' + a.getAttribute('data-pkg') + '"]');
      if (r) r.checked = true;
    });
  });

  // EUDR thanks page: show the reference and the matching pay button
  var refEl = document.getElementById('ref');
  if (refEl) {
    var q = new URLSearchParams(location.search);
    if (q.get('ref')) refEl.textContent = q.get('ref');
    var pkg = q.get('pkg');
    var buttons = document.querySelectorAll('[data-pay]');
    var live = 0;
    buttons.forEach(function (b) {
      var isLive = b.getAttribute('href') && b.getAttribute('href') !== '#';
      if (pkg && b.getAttribute('data-pay') !== pkg) { b.hidden = true; return; }
      if (!isLive) b.hidden = true; else live++;
    });
    if (!live) { var pend = document.getElementById('pay-pending'); if (pend) pend.classList.add('is-shown'); }
  }

  // Count-up numbers: <span class="stat__num" data-count="1000" data-suffix="+"> or data-since="2010"
  var nums = document.querySelectorAll('.stat__num[data-count], .stat__num[data-since]');
  if (nums.length) {
    var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
    var target = function (el) {
      return el.hasAttribute('data-since') ? new Date().getFullYear() - parseInt(el.getAttribute('data-since'), 10) : parseFloat(el.getAttribute('data-count'));
    };
    // Final value for screen readers, so they never hear half-counted numbers
    nums.forEach(function (el) {
      var end = fmt(target(el)) + (el.getAttribute('data-suffix') || '');
      el.textContent = end;
      var sr = document.createElement('span');
      sr.className = 'sr-only'; sr.textContent = end;
      el.setAttribute('aria-hidden', 'true');
      el.parentNode.insertBefore(sr, el.nextSibling);
    });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && 'IntersectionObserver' in window) {
      var run = function (el) {
        var end = target(el), suffix = el.getAttribute('data-suffix') || '', dur = 1800, t0 = null;
        el.textContent = '0' + suffix;
        var step = function (ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          el.textContent = fmt(end * (1 - Math.pow(1 - p, 3))) + suffix;   // ease-out
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      nums.forEach(function (el) { el.textContent = '0' + (el.getAttribute('data-suffix') || ''); });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); run(en.target); } });
      }, { threshold: 0.4 });
      nums.forEach(function (el) { io.observe(el); });
    }
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Back-to-top button (created here so every page gets it)
  (function () {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);
    var ticking = false;
    function update() {
      btn.classList.toggle('is-visible', window.scrollY > 600);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    btn.addEventListener('click', function () {
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var skip = document.querySelector('a[href="#main"], .skip');
      document.body.setAttribute('tabindex', '-1');
      document.body.focus({ preventScroll: true });
    });
    update();
  })();
})();
