const windowLoadHandler_HOME = () => {
  setTimeout(() => {
    document.querySelector(".LI-profile-pic").src =
        "https://media-exp1.licdn.com/dms/image/C5603AQGDOaDSpoTQ6g/profile-displayphoto-shrink_200_200/"
        + "0?e=1596672000&v=beta&t=EiqH2TCfBNn58UQGlNgMf8MXUSLj0YTAqRDYsMEoefc";
  }, 1000);
}
window.addEventListener("load",windowLoadHandler_HOME);

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
