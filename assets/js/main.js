const menuScrollThreshold = 150;
let floatingNavEl;

window.addEventListener("load", onLoad);
window.onscroll = onScroll;
// document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
  floatingNavEl = document.getElementById("floating-nav");
  onScroll();

  setupShuffle();
}

function onScroll() {
  if (window.hideNav && floatingNavEl) {
    if (document.documentElement.scrollTop > menuScrollThreshold)
      floatingNavEl.classList.remove("hidden");
    else floatingNavEl.classList.add("hidden");
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
  }
  setupFilterButtons();
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
