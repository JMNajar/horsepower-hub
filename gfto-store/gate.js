(function () {
  var VALID = ['geronimo', 'jeffnajar'];
  if (localStorage.getItem('gfto_gate_ok') === '1') return;

  document.write(
    '<div id="gfto-gate" style="position:fixed;inset:0;z-index:999999;background:#101F3C;' +
    'display:flex;align-items:center;justify-content:center;font-family:Inter,Arial,sans-serif;">' +
      '<form id="gfto-gate-form" style="background:#FAF7EE;border-top:4px solid #9E1B1B;' +
      'padding:2.5rem 2.25rem;border-radius:6px;max-width:340px;width:90%;text-align:center;' +
      'box-shadow:0 20px 60px rgba(0,0,0,.4);">' +
        '<div style="font-family:Oswald,Arial,sans-serif;font-weight:700;letter-spacing:.06em;' +
        'text-transform:uppercase;color:#101F3C;font-size:1.05rem;margin-bottom:.4rem;">GFTO &mdash; Private</div>' +
        '<div style="color:#6E7686;font-size:.85rem;margin-bottom:1.25rem;">Enter the password to continue.</div>' +
        '<input id="gfto-gate-input" type="password" autocomplete="off" ' +
        'style="width:100%;padding:.65rem .75rem;border:1px solid #E0D9C8;border-radius:4px;' +
        'font-size:.95rem;margin-bottom:.85rem;box-sizing:border-box;" />' +
        '<div id="gfto-gate-error" style="display:none;color:#9E1B1B;font-size:.8rem;margin-bottom:.75rem;">' +
        'Incorrect password.</div>' +
        '<button type="submit" style="width:100%;padding:.7rem;border:none;border-radius:4px;' +
        'background:#9E1B1B;color:#fff;font-weight:600;font-size:.9rem;cursor:pointer;">Enter</button>' +
      '</form>' +
    '</div>'
  );

  document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.getElementById('gfto-gate');
    var form = document.getElementById('gfto-gate-form');
    var input = document.getElementById('gfto-gate-input');
    var error = document.getElementById('gfto-gate-error');
    if (!form) return;
    document.body.style.overflow = 'hidden';
    input.focus();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').trim();
      if (VALID.indexOf(val) !== -1) {
        localStorage.setItem('gfto_gate_ok', '1');
        overlay.parentNode.removeChild(overlay);
        document.body.style.overflow = '';
      } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
      }
    });
  });
})();
