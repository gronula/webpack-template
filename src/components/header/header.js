import {
  mainNavItemMouseenterHandler,
  mainNavItemMouseleaveHandler,
  mainNavLinkClickHandler,
} from '../main-nav/main-nav';
import hoverintent from 'hoverintent';

window.addEventListener(`DOMContentLoaded`, () => {
  const header = document.querySelector(`.header`);
  const menuToggleBtn = header.querySelector(`.header__menu-toggle-btn`);
  const mainNavList = header.querySelector(`.main-nav__list`);
  const mainNavItems = mainNavList.querySelectorAll(`.main-nav__item`);
  const mainNavLinks = mainNavList.querySelectorAll(`.main-nav__link`);

  const menuToggleBtnClickHandler = () => {
    document.body.classList.toggle(`no-scroll`);
    header.classList.remove(`no-scroll`);
    header.classList.toggle(`header--opened`);
    mainNavItems.forEach((item) => {
      item.classList.remove(`main-nav__item--opened`);
    });
  };

  menuToggleBtn.addEventListener(`click`, menuToggleBtnClickHandler);
  mainNavItems.forEach((item) => hoverintent(item, mainNavItemMouseenterHandler, mainNavItemMouseleaveHandler).options({
    timeout: 200,
    interval: 200
  }));
  mainNavLinks.forEach((link) => link.addEventListener(`click`, mainNavLinkClickHandler));

  window.addEventListener(`resize`, () => {
    if (window.innerWidth >= 1024) {
      document.body.classList.remove(`no-scroll`);
      header.classList.remove(`no-scroll`);
      header.classList.remove(`header--opened`);
      mainNavItems.forEach((item) => {
        item.classList.remove(`main-nav__item--opened`);
      });
    }
  });
});
