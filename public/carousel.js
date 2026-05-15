import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.co-carousel', {
    loop: false,
    watchSlidesProgress: true,
    speed: 1000,
    grabCursor: true,
    navigation: {
      nextEl: '.co-carousel__nav-button.next',
      prevEl: '.co-carousel__nav-button.prev',
    },
    on: {
      touchEnd: function (swiper) {
        const time = Date.now() - swiper.touchEventsData.touchStartTime;
        const distance = Math.abs(swiper.touches.diff);
        const velocity = distance / time;
        let newSpeed = 1000 - velocity * 800;
        swiper.params.speed = Math.max(200, Math.min(1000, newSpeed));
      },
      progress: function (swiper) {
        swiper.slides.forEach((slide) => {
          const progress = slide.progress;
          if (progress >= -1 && progress <= 1) {
            const progressPositive = Math.abs(progress);
            const scale = 1 - progressPositive * 0.15;
            const textMaskY = progressPositive * 30;
            const opacity = 1 - progressPositive * 0.4;

            slide.querySelector('.proj-card').style.transform = `scale(${scale})`;
            slide.querySelector('.proj-card').style.opacity = opacity.toFixed(2);

            const masks = slide.querySelectorAll('.text-mask span');
            masks.forEach((t, i) => {
              t.style.transform = `translate3d(0, ${textMaskY * (i + 1)}px, 0)`;
            });
          }
        });
      },
      setTransition: function (swiper, speed) {
        swiper.slides.forEach((slide) => {
          slide.querySelector('.proj-card').style.transition = `${speed}ms`;
          slide.querySelectorAll('.text-mask span').forEach((t) => {
            t.style.transition = `${speed}ms`;
          });
        });
      },
      transitionEnd: function (swiper) {
        swiper.params.speed = 1000;
      },
    },
  });
});
