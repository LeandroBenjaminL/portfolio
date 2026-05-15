// Anime.js v4 Scramble Text Effect
// Load anime globally first, then init
(function initScramble() {
  if (typeof anime === 'undefined') {
    // Retry until anime is loaded
    setTimeout(initScramble, 100);
    return;
  }

  document.querySelectorAll('.scramble').forEach(el => {
    const original = el.textContent;
    const replay = () => {
      anime({
        targets: el,
        innerHTML: [anime.scrambleText({
          text: original,
          duration: 600,
          settleDuration: 200,
          perturbation: 0.15,
          chars: 'lowercase',
          cursor: '',
        })],
        duration: 600,
        easing: 'linear',
      });
    };
    el.addEventListener('pointerenter', replay);
    el.addEventListener('pointerdown', replay);
  });
})();
