const minScrollHeight = 500;
const bottomOffset = 20;
const animationDistance = 125;
const animationTime = 50;
const timeStep = 1;

const backToTopButton = document.getElementById("back-to-top-block");
let shown = document.body.scrollTop > minScrollHeight || document.documentElement.scrollTop > minScrollHeight;
if (shown) {
  backToTopButton.style.display = "flex";
}

const showBackToTopButton = () => {
  if(shown) {
    return;
  }
  backToTopButton.style.display = "flex";
  var pos = bottomOffset - animationDistance;
  backToTopButton.style.bottom = pos + 'px';
  const increment = animationDistance / (animationTime / timeStep);
  const id = setInterval(frame, timeStep);
  const steps = animationTime / timeStep;
  var step = 0;
  function frame() {
    if (step === steps - 1) {
      backToTopButton.style.bottom = bottomOffset + 'px';
      clearInterval(id);
    } else {
      pos += increment;
      backToTopButton.style.bottom = pos + 'px';
    }
    step++;
  }
  shown = true;
}

const hideBackToTopButton = () => {
  backToTopButton.style.display = "none";
  shown = false;
}

const windowScrollHandlerToTop = () => {
  if (document.body.scrollTop >= minScrollHeight || document.documentElement.scrollTop >= minScrollHeight) {
    showBackToTopButton();
  } else {
    hideBackToTopButton();
  }
}

window.addEventListener("scroll", windowScrollHandlerToTop);


const goToTop = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  window.scrollTo(0,0);
}
