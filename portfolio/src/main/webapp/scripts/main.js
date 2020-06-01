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

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const xwwwfurlenc = (srcjson) => {
  if(typeof srcjson !== "object")
    if(typeof console !== "undefined"){
      console.log("\"srcjson\" is not a JSON object");
      return null;
    }
  u = encodeURIComponent;
  var urljson = "";
  var keys = Object.keys(srcjson);
  for(var i=0; i < keys.length; i++){
    urljson += u(keys[i]) + "=" + u(srcjson[keys[i]]);
    if(i < (keys.length-1))urljson+="&";
  }
  return urljson;
}


const commentList = document.getElementById("comment-list");
const commentBox = document.getElementById("comment-text");
const commentCountField = document.getElementById("num-comments");
const postComment = async (override) => {
  let comment = override || commentBox.value;
  commentBox.value = "";
  let response = await fetch("/data", {
      method: "POST",
      body: new URLSearchParams({comment})
    });
  let text = await response.text();
  let data = JSON.parse(text);
  loadComments(data);
}
const deleteComments = async () => {
  let response = await fetch("/delete-data", {
      method: "POST",
    });
  let text = await response.text();
  // let data = JSON.parse(text);
  await sleep(500);
  loadComments();
}
const loadComments = async (recentPostKeyObject) => {
  let response = await fetch(
    "/data?" + xwwwfurlenc({
      ...recentPostKeyObject,
      maxComments: commentCountField.value}));
  let text = await response.text();
  let comments = JSON.parse(text);
  commentList.innerHTML = "";
  comments.forEach(comment => {
    let p = document.createElement("p");
    p.classList.add("comment");
    p.innerText = comment;
    commentList.appendChild(p);
  });
}
loadComments();