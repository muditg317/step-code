

const randomMemes = [
  "https://i.imgur.com/QKsSRsu.jpg",
  "https://i.imgur.com/AolTIfZ.jpg",
  "https://inteng-storage.s3.amazonaws.com/images/APRIL/sizes/black_hole_resize_md.jpg",
  "https://cdn-images-1.medium.com/max/800/1*sa36HnySp33Inkm62q-Scw.png",
  "http://devhumor.com/content/uploads/images/July2018/javascript_underwater.jpg",
  "https://afinde-production.s3.amazonaws.com/uploads/981ebabb-5722-44c1-ad30-fc57fbc8ee9d.jpeg",
  "https://preview.redd.it/bptzx7ur4uj11.jpg?width=960&crop=smart&auto=webp&s=d506a8f60ef41916578633bbb3e2d95ef7196fb7",
  "https://blog.lipsumarium.com/assets/img/posts/2017-07-22-caption-memes-in-python/one-does-not-simply-make-a-good-meme-generator-in-python.jpg",
  "https://i.redd.it/eqntkqfehnj01.jpg",
  "https://wyncode.co/uploads/2014/08/181.jpg",
  "https://pics.me.me/google-someone-just-signed-in-on-a-device-do-you-46615353.png"
];

const clearContentBkgd = (content_block) => {
  content_block.style.backgroundImage = "";
}

const randomizeContentBkgd = (content_block) => {
  content_block.style.backgroundImage = `url('${randomMemes[Math.floor(Math.random() * randomMemes.length)]}')`;
}

document.addEventListener('click', function (event) {
  element = event.target;
  do {
    if (element.classList && element.classList.contains("content")) {
      break;
    }
    element = element.parentNode;
  } while (element);
  if(element && element.classList.contains("content") && element.id !== "memes") {
    if(element.classList.contains("live")) {
      clearContentBkgd(element);
      element.classList.remove("live");
    } else {
      randomizeContentBkgd(element);
      element.classList.add("live");
    }
  }
},false);