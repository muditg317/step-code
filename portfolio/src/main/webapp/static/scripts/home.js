const windowLoadHandlerHome = () => {
  setTimeout(() => {
    document.querySelector(".LI-profile-pic").src =
        "https://media-exp1.licdn.com/dms/image/C5603AQGDOaDSpoTQ6g/profile-displayphoto-shrink_200_200/"
        + "0?e=1596672000&v=beta&t=EiqH2TCfBNn58UQGlNgMf8MXUSLj0YTAqRDYsMEoefc";
  }, 1000);
}
window.addEventListener("load",windowLoadHandlerHome);

let navBar = document.querySelector(".nav-bar#top-nav");

function scrollEvent(scrollPos) {
  let elementAtPageCenter = document.elementFromPoint(window.innerWidth/2,window.innerHeight/2);
  let block = elementAtPageCenter;
  if (scrollPos === 0) {
    block = null;
  }
  while (block && !block.classList.contains("content-block")) {
    block = block.parentElement;
  }


  let current = navBar.querySelector(".active");
  if (current != null) {
    current.classList.remove("active");
  }

  if (block) {
    let navID = "nav-" + block.id;
    let activeNavItem = navBar.querySelector("#"+navID);
    activeNavItem.className += " active";
  }
}

//requestAnimationFrame is used to limit the frequency of function calls on every scroll event
let lastScrollPos = 0;
let ticking = false;
window.addEventListener('scroll', function(e) {
  lastScrollPos = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      scrollEvent(lastScrollPos);
      ticking = false;
    });

    ticking = true;
  }
});
