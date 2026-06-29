/* ── Role switcher (hero) ──────────────────────────────── */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const role = pill.dataset.role;
    const sub  = pill.dataset.sub;

    // Morph headline word
    const display = document.getElementById('role-display');
    if (display) {
      display.classList.remove('in');
      display.classList.add('out');
      setTimeout(() => {
        display.textContent = role;
        display.classList.remove('out');
        display.classList.add('in');
      }, 220);
    }

    // Update subtitle
    const subEl = document.getElementById('hero-sub');
    if (subEl && sub) subEl.textContent = sub;
  });
});

/* ── Role tabs on register page ───────────────────────── */
document.querySelectorAll('.role-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const radio = tab.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
      const roleInput = document.getElementById('roleInput');
      if (roleInput) roleInput.value = radio.value;
    }
  });
});

/* ── Mobile nav toggle ─────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(11,30,61,0.98)';
    navLinks.style.padding = '16px 5%';
    navLinks.style.gap = '16px';
  });
}

/* ── Smooth scroll for anchor links ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
