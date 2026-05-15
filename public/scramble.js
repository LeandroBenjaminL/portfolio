// Scramble Text Effect — anime v4 compatible
(function initScramble() {
  if (typeof anime === 'undefined') {
    setTimeout(initScramble, 200);
    return;
  }

  const { animate } = anime;
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

  function getRandomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function scrambleText(original, progress) {
    const n = Math.floor(original.length * Math.min(progress, 1));
    let r = '';
    for (let i = 0; i < original.length; i++) {
      if (i < n) r += original[i];
      else if (i === n && progress < 1) r += getRandomChar();
      else r += original[i];
    }
    return r;
  }

  document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, a, .Card__type, .Hero__eyebrow, .site-footer p, .nav__item a')
    .forEach(el => {
      if (el.children.length > 0) return;
      const text = el.textContent.trim();
      if (text.length < 3) return;

      let original = el.textContent;

      el.addEventListener('pointerenter', () => {
        original = el.textContent;
        const state = { p: 0 };
        animate(state, {
          p: 1,
          duration: 200 + text.length * 12,
          onUpdate: () => {
            el.textContent = scrambleText(original, state.p);
          },
          onComplete: () => { el.textContent = original; }
        });
      });
    });
})();
