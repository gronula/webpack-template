const header = document.querySelector(`.header`);
const mainNavList = header.querySelector(`.main-nav__list`);
const mainNavItems = mainNavList.querySelectorAll(`.main-nav__item`);

const mainNavLinkClickHandler = (evt) => {
  header.classList.toggle(`no-scroll`);
  const currentItem = evt.currentTarget.closest(`.main-nav__item`);
  mainNavItems.forEach((item) => {
    if (item !== currentItem) {
      item.classList.remove(`main-nav__item--opened`);
    }
  });
  currentItem.classList.toggle(`main-nav__item--opened`);
};

const mainNavItemMouseenterHandler = (evt) => {
  if (window.innerWidth >= 1024) {
    const target = evt.target.closest(`.main-nav__item`);
    target.classList.add(`hovered`);
  }
}

const mainNavItemMouseleaveHandler = (evt) => {
  if (window.innerWidth >= 1024) {
    const target = evt.target.closest(`.main-nav__item`);
    target.classList.remove(`hovered`);
  }
}

export {
  mainNavItemMouseenterHandler,
  mainNavItemMouseleaveHandler,
  mainNavLinkClickHandler,
};
