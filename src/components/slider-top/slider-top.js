import 'swiper/dist/css/swiper.min.css';
import Swiper from 'swiper';

window.addEventListener(`DOMContentLoaded`, () => {
  const sliderTop = document.querySelector(`.slider-top`);
  const slidersMain = document.querySelectorAll(`.slider-main`);
  const sliderInvestments = document.querySelector(`.investments__slider`);
  let sliderTopSwiper;
  let sliderMainSwipers;

  const sliderTopSwiperParams = {
    slidesPerView: 1,
    loop: true,
    loopAdditionalSlides: 3,
    autoplay: {
      delay: 6000,
      waitForTransition: false,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.slider-top__arrow--next',
      prevEl: '.slider-top__arrow--prev',
    },
    pagination: {
      el: '.slider-top__dots',
      clickable: true,
      bulletClass: `slider-top__dot`,
      bulletActiveClass: `active`,
      renderBullet: function (index, className) {
        return `
        <button class="${className}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="25"></circle>
          </svg>
        </button>`;
      },
    },
    on: {
      touchStart: function (e) {
        this.autoplay.stop();
      },
      touchEnd: function (e) {
        this.autoplay.start();
      },
      slideChange: function () {
        const currentIndex = this.realIndex < 10 ? `0${this.realIndex + 1}` : `${this.realIndex + 1}`;
        this.el.querySelector(`.slider-top__page--current`).textContent = currentIndex;
      }
    }
  };

  const sliderMainSwiperParams = {
    slidesPerView: 'auto',
    loop: false,
    autoplay: false,
    navigation: false,
    pagination: false,
  };

  if (sliderTop) {
    sliderTopSwiper = new Swiper(sliderTop, sliderTopSwiperParams);
  }

  if (slidersMain) {
    sliderMainSwipers = new Swiper(slidersMain, sliderMainSwiperParams);
  }

  if (window.innerWidth >= 1024) {
    sliderMainSwipers.forEach((it) => it.destroy());
  }

  window.addEventListener(`resize`, () => {
    if (window.innerWidth >= 1024) {
      sliderMainSwipers.forEach((it) => {
        if (it.initialized) {
          it.destroy();
        }
      });
    } else {
      sliderMainSwipers.forEach((it) => {
        if (!it.initialized) {
          it = new Swiper(slidersMain, sliderMainSwiperParams);
        }
      });
    }
  });
});
