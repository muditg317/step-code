const title_block = document.querySelector(".title_block");
const title_block_inner = document.querySelector(".title_block_inner");
const title_img = document.querySelector("#title_image");
const main_content = document.querySelector(".mainContent");
const setTitleImageWidth = () => {
  if (title_block && title_img) {
    let img_width = title_img.naturalWidth*500/title_img.naturalHeight;
    let page_width = parseInt(window.getComputedStyle(title_block).width);
    title_block_inner.style.width = Math.min(img_width,page_width)+"px";
    main_content.style.maxWidth = img_width+"px";
  }
}
const windowResizeHandler_MAIN = () => {
  setTitleImageWidth();
}
window.addEventListener("resize", windowResizeHandler_MAIN);

const domContentLoadedHandler_MAIN = () => {
  setTitleImageWidth();
}
document.addEventListener("DOMContentLoaded", domContentLoadedHandler_MAIN);

const windowLoadHandler_MAIN = () => {
  setTitleImageWidth();
  setTimeout(() => {
    document.querySelector(".LI-profile-pic").src =
        "https://media-exp1.licdn.com/dms/image/C5603AQGDOaDSpoTQ6g/profile-displayphoto-shrink_200_200/"
        + "0?e=1596672000&v=beta&t=EiqH2TCfBNn58UQGlNgMf8MXUSLj0YTAqRDYsMEoefc";
  }, 1000);
}
window.addEventListener("load",windowLoadHandler_MAIN);

let content_blocks = document.querySelectorAll(".content_block");

let last_known_scroll_position = 0;
let ticking = false;

function scrollEvent(scroll_pos) {
  var content_index = 0;
  let centerElement = document.elementFromPoint(window.innerWidth/2,window.innerHeight/2);
  let block = centerElement;
  while (block && !block.classList.contains("content_block")) {
    block = block.parentElement;
  }
  if (scroll_pos === 0) {
    block = null;
  }

  let nav_bar = document.querySelector(".nav_bar#top_nav");
  let current = nav_bar.querySelector(".active");
  if (current != null) {
    current.className = current.className.replace(" active", "");
  }

  if (block) {
    let nav_id = "nav_" + block.id;
    let new_nav_item = nav_bar.querySelector("#"+nav_id);
    new_nav_item.className += " active";
  }
}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      scrollEvent(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;
  }
});
