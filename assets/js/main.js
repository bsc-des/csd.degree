const menuScrollThreshold = 150;
let mainNavEl;
let isMobileNavOpen = false;
let mobileNavToggles;

window.addEventListener("load", onLoad);
window.onscroll = onScroll;
// document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
  // Navigation menu logic
  mainNavEl = document.getElementById("main-nav");
  mobileNavToggles = document.getElementsByClassName("nav-toggle");
  for (let item of mobileNavToggles) {
    item.addEventListener("click", toggleMobileNav);
  }

  onScroll();
  setupShuffle();
}

function toggleMobileNav() {
  var navLinks = mainNavEl.getElementsByClassName("nav-links")[0];
  if (isMobileNavOpen) {
    navLinks.classList.remove("mobile-visible");
    for (let item of mobileNavToggles)
      item.firstElementChild.innerHTML = "menu";
  } else {
    navLinks.classList.add("mobile-visible");
    for (let item of mobileNavToggles)
      item.firstElementChild.innerHTML = "close";
  }

  isMobileNavOpen = !isMobileNavOpen;
}

function onScroll() {
  if (window.hideNav && mainNavEl) {
    if (document.documentElement.scrollTop > menuScrollThreshold)
      mainNavEl.classList.remove("hidden");
    else mainNavEl.classList.add("hidden");
  }
}

function setupShuffle() {
  var shuffleGrid = document.getElementById("shuffle-grid");
  if (shuffleGrid) {
    window.shuffle = new window.Shuffle(shuffleGrid, {
      itemSelector: ".grid-brick",
      sizer: ".sizer-element",
      isCentered: true,
    });
    setupFilterButtons();
  }
}

function setupFilterButtons() {
  const options = document.querySelector(".filter-options");

  const filterButtons = Array.from(options.children);
  filterButtons.forEach((button) => {
    button.addEventListener("click", handleFilterClick, false);
  });
}

function handleFilterClick(e) {
  const btn = e.currentTarget;
  const isActive = btn.classList.contains("active");
  const btnGroup = btn.getAttribute("data-group");

  removeActiveClassFromChildren(btn.parentNode);

  let filterGroup;
  if (isActive) {
    btn.classList.remove("active");
    filterGroup = Shuffle.ALL_ITEMS;
  } else {
    btn.classList.add("active");
    filterGroup = btnGroup;
  }

  console.log(filterGroup);

  window.shuffle.filter(filterGroup);
}

function removeActiveClassFromChildren(parent) {
  const { children } = parent;
  for (let i = children.length - 1; i >= 0; i--) {
    children[i].classList.remove("active");
  }
}
