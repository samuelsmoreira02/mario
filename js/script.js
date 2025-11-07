const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const gameOver = document.querySelector(".game-over");
const score = document.querySelector(".score");
const highScore = document.querySelector("#high-score");
const bullet = document.querySelector(".Obsbullet");
const pointSound = document.querySelector(".power");
const mountains = document.querySelector(".mountains");

let marioLevel = "start";
("beg");
("pro");
("fly");


const setCookie = function (name, value, expirationDays) {
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";SameSite=Lax;path=/";
};

const getCookie = function (name) {
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  name = name + "=";

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};


var audio = document.getElementById("backgroundMusic");
audio.play();


var scoreValue = -1;
var highScoreValue = getCookie("high-score");
highScore.textContent = getCookie("high-score");


const jump = () => {
  if (gameOver.style.display === "block" || mario.classList.contains("jump")) {
    return;
  }

  mario.classList.add("jump");


  document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
      const audio = document.getElementById("soundJump");
      if (!audio.classList.contains("playng")) {
        audio.classList.add("playng");
        audio.currentTime = 0;
        audio.play();
        audio.classList.remove("playng");
      }
    }

    
    if (scoreValue < 5 && marioLevel !== "starter") {
      mario.src = "images/mario-starter.gif";
      marioLevel = "starter";
    } else if (
      scoreValue >= 5 &&
      scoreValue < 10 &&
      marioLevel !== "beginner"
    ) {
      mario.src = "./images/mario-beginner.gif";
      marioLevel = "beginner";
    } else if (scoreValue >= 10 && marioLevel !== "pro") {
      mario.src = "./images/mario-pro.gif";
      marioLevel = "pro";
    }

    if (marioLevel === "pro") {
      mario.src = "./images/mario-flying.gif";
      setTimeout(() => {
        mario.src = "./images/mario-pro.gif";
      }, 500);
    }


    if (scoreValue === 5 || scoreValue === 10) {
      pointSound.currentTime = 0;
      pointSound.play();
    }
  });

  scoreValue += 1;
  score.textContent = scoreValue;

  if (highScoreValue < scoreValue) {
    setCookie("high-score", scoreValue, 365);
    highScoreValue = scoreValue;
    highScore.textContent = highScoreValue;
  }

  setTimeout(() => {
    mario.classList.remove("jump");
  }, 500);
};


const waitingFailure = () => {
  const pipePosition = pipe.offsetLeft;
  const bulletPosition = bullet.offsetLeft;
  const mountainsPosition = mountains.offsetLeft;

  const marioPosition = +window
    .getComputedStyle(mario)
    .bottom.replace("px", "");

  const marioRect = mario.getBoundingClientRect();
  const bulletRect = bullet.getBoundingClientRect();

  const bulletCollision =
    bulletRect.left <= marioRect.right - 40 &&
    bulletRect.right >= marioRect.left + 40 &&
    bulletRect.bottom >= marioRect.top + 20;

  const pipeCollision =
    pipePosition <= 120 && pipePosition > 0 && marioPosition < 112;

  if (pipeCollision || bulletCollision) {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    mario.style.animationPlayState = "paused";
    mario.style.bottom = `${marioPosition}px`;

    pipe.style.animation = "none";
    pipe.style.left = `${pipePosition}px`;

    bullet.style.animation = "none";
    bullet.style.left = `${bulletPosition}px`;

    mario.src = "./images/game-over.png";
    mario.style.width = "75px";
    mario.style.marginLeft = "50px";

    mountains.style.animation = "none";
    mountains.style.left = `${mountainsPosition}px`;

    gameOver.style.display = "block";

    const soundMarioDie = document.getElementById("soundMarioDie");
    if (!soundMarioDie.classList.contains("playng")) {
      soundMarioDie.classList.add("playng");
      soundMarioDie.currentTime = 0;
      soundMarioDie.play().catch((error) => {
        console.error("Erro ao reproduzir o som de morte do Mario:", error);
      });
      soundMarioDie.classList.remove("playng");
    }

    pointSound.pause();
    


    clearInterval(loop);

    document.removeEventListener("keydown", jump);
    document.removeEventListener("touchstart", jump);
  }
};

var loop = setInterval(waitingFailure, 10);



const bulletMinDelay = 4000;
const bulletMaxDelay = 9000;
let bulletActive = false;

const isPipeVisible = () => {
  const pipePosition = pipe.offsetLeft;

  return pipePosition > 200 && pipePosition < 800;
};

const animateBullet = () => {
 
  if (isPipeVisible()) {
    bulletActive = false;
    scheduleNextBullet(); 
    return;
  }

  bullet.style.display = "block";
  bullet.style.animation = "bullet-animation 0.7s linear";

  bullet.addEventListener(
    "animationend",
    () => {
      bullet.style.display = "none";
      bullet.style.animation = "none";
      bulletActive = false;
      scheduleNextBullet();
    },
    { once: true }
  );
};

const scheduleNextBullet = () => {
  const randomDelay =
    Math.random() * (bulletMaxDelay - bulletMinDelay) + bulletMinDelay;
  setTimeout(() => {
    if (!bulletActive) {
      bulletActive = true;
      animateBullet();
    }
  }, randomDelay);
};

const startBulletSpawn = () => {
  bullet.style.display = "none";
  bullet.style.animation = "none";
  bulletActive = false;
  scheduleNextBullet();
};

startBulletSpawn();


const spawnTurtle = () => {
  const randomDelay = 2000 + 3000;
  setTimeout(() => {
    const shouldShowTurtle = Math.random() < 0.2;
    if (shouldShowTurtle) {
      pipe.src = "./images/turtle.gif";
    } else {
      pipe.src = "./images/pipe.png";
    }
    spawnTurtle();
  }, randomDelay);
};

spawnTurtle();


const restartGame = function () {
  gameOver.style.display = "none";

  mario.style.animationPlayState = "running";
  mario.src = "./images/mario.gif";
  mario.style.width = "150px";
  mario.style.marginLeft = "0";
  mario.style.bottom = "0";

  bullet.style.animationPlayState = "running";
  bullet.style.display = "none";
  bullet.style.left = "auto";

  pipe.style.left = "auto";
  pipe.style.animation = "pipe-animation 1s infinite linear";

  mountains.style.animation = "mountains-animation 30s infinite linear";

  const backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.currentTime = 0;
  backgroundMusic.play().catch((error) => {
    console.error("Erro ao reproduzir a música de fundo:", error);
  });

  scoreValue = 0;
  score.textContent = scoreValue;

  document.addEventListener("keydown", jump);
  document.addEventListener("touchstart", jump);

  loop = setInterval(waitingFailure, 10);
  soundMarioDie.pause();

  startBulletSpawn();
};

document.querySelector(".retry").addEventListener("click", restartGame);
document.querySelector(".game-board").addEventListener("keydown", jump);

document.querySelector(".game-board").addEventListener("touchstart", jump);
