// const homeButton = document.querySelector(".logo");
// homeButton.addEventListener("click", (event) => {
//     if (window.location.pathname !== "/") {
//         window.location.href = window.location.origin;
//     }
//     window.location.hash = "";
//     window.scrollTo(0,0);
// });

const top_nav = document.getElementById("top_nav");

const responsiveNav = () => {
  if (top_nav.className === "nav_bar") {
    top_nav.className += " responsive";
  } else {
    top_nav.className = "nav_bar";
  }
}

const navToSection = (elementSelector) => {
    jumpToSection(elementSelector);
    top_nav.className = "nav_bar";
}

const windowResizeHandler_NAV = () => {
    if (window.innerWidth > 700) {
        top_nav.className = "nav_bar";
    }
}

window.addEventListener("resize", windowResizeHandler_NAV);

const navBarHeight = document.getElementById("top_nav").computedStyleMap().get("min-height")["value"];
const jumpToSection = (elementSelector) => {
    element = document.querySelector(elementSelector);
    const elemRect = element.getBoundingClientRect();
    scrollBy(0,elemRect.top-navBarHeight);
}

const docClickHandler_NAV = (event) => {
    if (!top_nav.contains(event.target)) {
        top_nav.classList.remove("responsive");
    }
};
document.addEventListener("click", docClickHandler_NAV);