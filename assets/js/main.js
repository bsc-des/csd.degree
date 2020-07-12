const menuScrollThreshold = 150;
let floatingNav;

window.addEventListener("load", onLoad);
window.onscroll = onScroll;

function onLoad() {
  floatingNav = document.getElementById("floating-nav");
  onScroll();

  setupShuffle();
}

function setupShuffle() {
  var shuffleGrid = document.getElementById("shuffle-grid");
  if (shuffleGrid) {
    window.shuffleInstance = new window.Shuffle(shuffleGrid, {
      itemSelector: ".grid-brick",
      sizer: ".sizer-element",
    });
  }
}

function onScroll() {
  if (window.hideNav && floatingNav) {
    if (document.documentElement.scrollTop > menuScrollThreshold)
      floatingNav.classList.remove("hidden");
    else floatingNav.classList.add("hidden");
  }
}
