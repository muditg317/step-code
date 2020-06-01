const recentKeys = [];
const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "a", "b"];
const endKonamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "z", "y"];
let konami = false;
let doneKonami = false;

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
    doneKonami = true;
    konamiGame.style.visibility = "visible";
    resetKonamiGame();
  } else {
    alert("more konami!!");
  }
};

const endKonami = () => {
  if(doneKonami) {
    alert("no more konami.. :(");
    konami = false;
    doneKonami = false;
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
