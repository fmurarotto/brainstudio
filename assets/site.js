// BRAINSTUDIO — phone menu and contact form. No dependencies, works on any host.
(function () {
  var root = document.documentElement;
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = root.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close Menu' : 'Open Menu');
    });
    document.querySelectorAll('.menu a').forEach(function (a) {
      a.addEventListener('click', function () { root.classList.remove('menu-open'); });
    });
  }

  // Contact form. Messages go to the address in data-to once a form service is connected
  // (Phase 3: set the form's action to the chosen host's or service's endpoint).
  document.querySelectorAll('form.contact').forEach(function (form) {
    var status = form.querySelector('.f-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      if (form.querySelector('[name="company-website"]').value) return; // spam trap
      var endpoint = form.getAttribute('action');
      var key = form.querySelector('[name="access_key"]');
      if (!endpoint || (key && key.value === 'WEB3FORMS_ACCESS_KEY')) {
        status.textContent = 'This form is not connected yet.';
        return;
      }
      var btn = form.querySelector('.f-send');
      btn.disabled = true;
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (r) {
          if (!r.ok || (r.j && r.j.success === false)) throw new Error('send failed');
          form.reset();
          status.textContent = 'Thank you!';
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please try again.';
        })
        .then(function () { btn.disabled = false; });
    });
  });
})();
