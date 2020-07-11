const menuScrollThreshold = 150;
let floatingNav;

window.addEventListener("load", onLoad);
window.onscroll = onScroll;

function onLoad() {
  floatingNav = document.getElementById("floating-nav");
  console.log(floatingNav);
  onScroll();
}

function onScroll() {
  console.log(hideNav);
  if (window.hideNav && floatingNav) {
    if (document.documentElement.scrollTop > menuScrollThreshold)
      floatingNav.classList.remove("hidden");
    else floatingNav.classList.add("hidden");
  }
}
