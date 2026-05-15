// Scroll reveal + Skill bars + Counters
(function initIntegrations() {
  if (typeof anime === 'undefined') {
    setTimeout(initIntegrations, 200);
    return;
  }

  // ─── Scroll Reveal (fade-in) ───
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ─── Skill Bars ───
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const bar = item.querySelector('.skill-bar-fill');
        const pct = item.querySelector('.skill-bar-pct');
        const target = parseInt(item.getAttribute('data-pct') || 0);

        if (bar) {
          anime({
            targets: bar,
            width: ['0%', target + '%'],
            duration: 1800,
            easing: 'easeOutExpo',
            delay: 200,
          });
        }
        if (pct) {
          const state = { v: 0 };
          anime({
            targets: state,
            v: target,
            duration: 1800,
            easing: 'easeOutExpo',
            delay: 200,
            update: () => { pct.textContent = Math.round(state.v) + '%'; }
          });
        }
        skillObserver.unobserve(item);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar-item').forEach(el => skillObserver.observe(el));

  // ─── Counters ───
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count') || 0);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const state = { v: 0 };

        anime({
          targets: state,
          v: target,
          duration: 2000,
          easing: 'easeOutExpo',
          update: () => { el.textContent = prefix + Math.round(state.v) + suffix; }
        });
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));
})();
