// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['Yeet!', 'Aight, Ima head out.', 'Beep boop, I\'m a coder', 'I wanna play games.'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

const title_block = document.querySelector(".title_block_inner");
const title_img = document.querySelector("#title_image");
let img_width = title_img.naturalWidth*500/title_img.naturalHeight;
title_block.style.width = img_width+"px";



const clearContentBkgd = (content_block) => {
  content_block.style.backgroundImage = "";
}

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
  "https://wyncode.co/uploads/2014/08/181.jpg"];

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


const recentKeys = [];
const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "a", "b"];
const endKonamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "z", "y"];
let konami = false;

const konamiGame = document.querySelector(".konamiGame");
let gameInterval = 0;
const frameTime = 20;
const frameCalibration = 50;

const scoreDisplay = document.querySelector("#score");
let score = 0;
scoreDisplay.innerHTML=score;

const gameHeight = 300;
const gameWidth = 300;
const birdStart = 50;

const pipeSpace = 120;
const birdSize = 10;
const pipeWidth = 20;

const gravity = -1.2*Math.pow(frameTime/frameCalibration,2);
const jumpStrength = 8.5*Math.pow(frameTime/frameCalibration,1);

const bird = document.querySelector("#bird");
let birdInterval = 0;
let birdX = birdStart;
let birdY = gameHeight/2-birdSize/2;
let birdVX = 0;
let birdVY = 0;

const pipeBottom = document.querySelector("#pipeBottom");
const pipeTop = document.querySelector("#pipeTop");
let pipeInterval = 0;
let pipeX = 0;
let pipeY = 0;
let pipeV = -7*frameTime/frameCalibration;

const setBirdPos = () => {
  bird.style.left = birdX+"px";
  bird.style.top = birdY+"px";
};

const setPipes = () => {
  pipeBottom.style.left = pipeX+"px";
  pipeBottom.style.top = pipeY+(pipeSpace/2.0)+"px";
  pipeTop.style.left = pipeX+"px";
  pipeTop.style.bottom = (300-pipeY)+(pipeSpace/2.0)+"px";
};

const checkClip = () => {
  if(pipeX-birdX < birdSize && pipeX-birdX > -(pipeWidth)) {
    if(birdY < pipeY-(pipeSpace/2.0)
        || birdY+birdSize > pipeY+(pipeSpace/2.0)) {
      return true;
    }
  }
  return false;
};

const resetBird = () => {
  birdX = birdStart;
  birdY = gameHeight/2-birdSize/2;
  birdVY = 0;
};

const resetPipes = () => {
  pipeX = gameWidth-pipeWidth;
  pipeY = Math.floor(Math.random()*(gameHeight-pipeSpace+1))+(pipeSpace/2.0);
};

const resetKonamiGame = () => {
  resetBird();
  resetPipes();
  setBirdPos();
  setPipes();
  score = 0;
  scoreDisplay.innerHTML=score;
  birdInterval = setInterval(() => {
    birdX += birdVX;
    birdY -= birdVY;
    birdVY += gravity;
    if(birdY > gameHeight-10) {
      birdY = gameHeight-10;
      birdVY = 0;
    }
    setBirdPos();
  },frameTime);
  pipeInterval = setInterval(() => {
    pipeX += pipeV;
    if(pipeX < birdStart-20) {
      resetPipes();
      score+=1;
      scoreDisplay.innerHTML=score;
    }
    setPipes();
  },frameTime);
  gameInterval = setInterval(() => {
    if(checkClip()) {
      clearInterval(birdInterval);
      clearInterval(pipeInterval);
      clearInterval(gameInterval);
      alert("birdy died! :(");
      konami = false;
    }
  },frameTime*2);
};

const executeKonami = () => {
  if(!konami) {
    alert("konami!");
    konami = true;
    konamiGame.style.visibility = "visible";
    resetKonamiGame();
  } else {
    alert("more konami!!");
  }
};

const endKonami = () => {
  if(konami) {
    alert("no more konami.. :(");
    konami = false;
    konamiGame.style.visibility = "hidden";
  } else {
    alert("try some konami!!");
  }
};

const pongCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const endPongCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "y", "z"];


const executePong = () => {

};
const endPong = () => {

};

const checkCode = (code,result) => {
  if(recentKeys.length<code.length) {
    return;
  }
  for(let i=0;i<code.length;i++) {
    if(recentKeys[recentKeys.length-code.length+i]!=code[i]) {
      return;
    }
  }
  result();
};

const checkCodes = () => {
  checkCode(konamiCode,executeKonami);
  checkCode(endKonamiCode,endKonami);
  checkCode(pongCode,executePong);
  checkCode(endPongCode,endPong);
};

window.addEventListener('keydown', function (event) {
  if(event.defaultPrevented) {
    return;
  }
  switch(event.key) {
    case " ":
      if(konami) {
        birdVY = jumpStrength;
      }
      break;
    case "ArrowUp":
      if(konami) {
        birdVY = jumpStrength;
      }
      break;
    default:
      break;
  }
  recentKeys.push(event.key);
  if(recentKeys.length > 10) {
    recentKeys.splice(0,1);
  }
  checkCodes();
  // event.preventDefault();
},true);
