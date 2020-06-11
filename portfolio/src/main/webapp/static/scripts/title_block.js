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
const windowResizeHandler_TITLE = () => {
  setTitleImageWidth();
}
window.addEventListener("resize", windowResizeHandler_TITLE);

const domContentLoadedHandler_TITLE = () => {
  setTitleImageWidth();
}
document.addEventListener("DOMContentLoaded", domContentLoadedHandler_TITLE);
